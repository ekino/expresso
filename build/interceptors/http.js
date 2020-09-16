"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const decompress_response_1 = __importDefault(require("decompress-response"));
const crypto_1 = __importDefault(require("crypto"));
class ExpressoHttpInterceptor {
    constructor() {
        this.data = [];
        const originalHttpRequestCallback = http_1.default.request;
        http_1.default.request = (url, options, callback) => {
            const startAt = process.hrtime();
            if (this.isURL(url)) {
                const opt = options;
                const cb = this.overrideCallback(opt, callback, startAt);
                return originalHttpRequestCallback(url, opt, cb);
            }
            else {
                const opt = url;
                const cb = this.overrideCallback(opt, options, startAt);
                return originalHttpRequestCallback(opt, cb);
            }
        };
    }
    isURL(url) {
        return url.href !== undefined;
    }
    /**
     * Add listeners to the response (`on data` and `on end`).
     * Store the underlyings requests and responses data within the memory.
     * @param options original http request options.
     * @param originalHttpRequestCallback original http request callback.
     * @param startAt [number, number] use to caclulate response time from this value.
     */
    overrideCallback(options, originalHttpRequestCallback, startAt) {
        // Each call is identified by a hash based on request structure to avoid stream from getting lost.
        const hash = crypto_1.default
            .createHash('md5')
            .update(JSON.stringify({ date: new Date() }))
            .digest('hex');
        const buffer = {};
        if (!buffer[hash])
            buffer[hash] = [];
        return (res) => {
            // In some case depending on http client (axios, got...) we need to decompress response before handle it.
            const response = decompress_response_1.default(res);
            response.on('data', (data) => {
                buffer[hash] = [...buffer[hash], data];
            });
            response.on('end', () => {
                const diff = process.hrtime(startAt);
                const time = diff[0] * 1e3 + diff[1] * 1e-6;
                if (res.statusCode === 200 && res.complete) {
                    const data = Buffer.concat(buffer[hash]);
                    const json = JSON.parse(data.toString());
                    // In memory storage.
                    this.formatData(res, time, options, hash, json);
                }
                else {
                    // This is the place where edge cases should be handle (301...).
                    const error = new Error(`Something wrong with response : ${res.statusCode}`);
                    // In memory storage.
                    this.formatData(res, time, options, hash, null, error);
                }
            });
            originalHttpRequestCallback(res);
        };
    }
    formatData(res, time, options, hash, data, error) {
        const expressoResponse = Object.assign(res, {
            time,
            data: data || undefined,
            error: error || undefined
        });
        const expressoRequest = options;
        const expressoData = {
            id: hash,
            response: expressoResponse,
            request: expressoRequest
        };
        this.data = [...this.data, expressoData];
    }
}
exports.default = ExpressoHttpInterceptor;
//# sourceMappingURL=http.js.map