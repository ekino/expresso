import http, { RequestOptions, ClientRequest, IncomingMessage } from 'http'
import decompressResponse from 'decompress-response'
import crypto from 'crypto'
import { URL } from 'url'
import {
    ExpressoHttpInterceptorData,
    ExpressoHttpInterceptorCallback,
    ExpressoHttpInterceptorResponse,
    ExpressoHttpInterceptorRequest
} from './definitions'

class ExpressoHttpInterceptor {
    data: Array<ExpressoHttpInterceptorData> = []

    constructor() {
        const originalHttpRequestCallback: (
            url: string | RequestOptions | URL,
            options: RequestOptions | ExpressoHttpInterceptorCallback | undefined,
            callback?: ExpressoHttpInterceptorCallback
        ) => ClientRequest = http.request
        http.request = (
            url: string | RequestOptions | URL,
            options: RequestOptions | ExpressoHttpInterceptorCallback | undefined,
            callback?: ExpressoHttpInterceptorCallback
        ): ClientRequest => {
            const startAt = process.hrtime()

            if (this.isURL(url)) {
                const opt = options as RequestOptions
                const cb = this.overrideCallback(
                    opt,
                    callback as ExpressoHttpInterceptorCallback,
                    startAt
                )
                return originalHttpRequestCallback(url, opt, cb)
            } else {
                const opt = url as RequestOptions
                const cb = this.overrideCallback(
                    opt,
                    options as ExpressoHttpInterceptorCallback,
                    startAt
                )
                return originalHttpRequestCallback(opt, cb)
            }
        }
    }

    isURL(url: URL | string | RequestOptions | undefined): url is URL {
        return (url as URL).href !== undefined
    }

    /**
     * Add listeners to the response (`on data` and `on end`).
     * Store the underlyings requests and responses data within the memory.
     * @param options original http request options.
     * @param originalHttpRequestCallback original http request callback.
     * @param startAt [number, number] use to caclulate response time from this value.
     */
    overrideCallback(
        options: RequestOptions,
        originalHttpRequestCallback: ExpressoHttpInterceptorCallback,
        startAt: [number, number]
    ): ExpressoHttpInterceptorCallback {
        // Each call is identified by a hash based on request structure to avoid stream from getting lost.
        const hash = crypto
            .createHash('md5')
            .update(JSON.stringify({ date: new Date() }))
            .digest('hex')
        const buffer: any = {}
        if (!buffer[hash]) buffer[hash] = []
        return (res: IncomingMessage): any => {
            // In some case depending on http client (axios, got...) we need to decompress response before handle it.
            const response = decompressResponse(res)

            response.on('data', (data: Buffer): any => {
                buffer[hash] = [...buffer[hash], data]
            })
            response.on('end', () => {
                const diff = process.hrtime(startAt)
                const time = diff[0] * 1e3 + diff[1] * 1e-6
                if (res.statusCode === 200 && res.complete) {
                    const data = Buffer.concat(buffer[hash])
                    const json = JSON.parse(data.toString())
                    // In memory storage.
                    this.formatData(res, time, options, hash, json)
                } else {
                    // This is the place where edge cases should be handle (301...).
                    const error = new Error(`Something wrong with response : ${res.statusCode}`)
                    // In memory storage.
                    this.formatData(res, time, options, hash, null, error)
                }
            })
            originalHttpRequestCallback(res)
        }
    }

    private formatData(
        res: http.IncomingMessage,
        time: number,
        options: http.RequestOptions,
        hash: string,
        data?: any,
        error?: any
    ): void {
        const expressoResponse: ExpressoHttpInterceptorResponse = Object.assign(res, {
            time,
            data: data || undefined,
            error: error || undefined
        })
        const expressoRequest: ExpressoHttpInterceptorRequest = options
        const expressoData: ExpressoHttpInterceptorData = {
            id: hash,
            response: expressoResponse,
            request: expressoRequest
        }
        this.data = [...this.data, expressoData]
    }
}

export default ExpressoHttpInterceptor
