import http, { RequestOptions, ClientRequest, IncomingMessage } from 'http'
import decompressResponse from 'decompress-response'
import crypto from 'crypto'
import { URL } from 'url'

type Callback = (res: IncomingMessage) => void
class ExpressoHttpInterceptor {
    data: Array<any> = []

    constructor() {
        const originalHttpRequest = http.request
        http.request = (
            url: string | RequestOptions | URL,
            options: RequestOptions | Callback | undefined,
            callback?: Callback
        ): ClientRequest => {
            const startAt = process.hrtime()

            if (this.isURL(url)) {
                const opt = options as RequestOptions
                const cb = this.overrideCallback(opt, callback as Callback, startAt)
                return originalHttpRequest(url, opt, cb)
            } else {
                const opt = url as RequestOptions
                const cb = this.overrideCallback(opt, callback as Callback, startAt)
                return originalHttpRequest(opt, cb)
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
        originalHttpRequestCallback: Callback,
        startAt: [number, number]
    ): Callback {
        // Each call is identified by a hash based on request structure to avoid stream from getting lost.
        const hash = crypto
            .createHash('md5')
            .update(JSON.stringify({ ...options, date: new Date() }))
            .digest('hex')
        const buffer: any = {}
        if (!buffer[hash]) buffer[hash] = []
        return (res: any): any => {
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
                    this.data = [
                        ...this.data,
                        {
                            id: hash,
                            response: this.formatRes({ time, data: json, ...res }),
                            request: this.formatReq({ ...options })
                        }
                    ]
                } else {
                    // This is the place where edge cases should be handle (301...).
                    console.error(`Something wrong with response : ${res.statusCode}`)
                    // In memory storage.
                    this.data = [
                        ...this.data,
                        {
                            id: hash,
                            response: this.formatRes({ time, ...res }),
                            request: this.formatReq({ ...options, id: hash })
                        }
                    ]
                }
            })
            originalHttpRequestCallback(res)
        }
    }

    formatRes = (res: any): any => {
        // Good place to filter what we need to handle in the view (response).
        const { headers, statusCode, statusMessage, data, time, responseUrl, error } = res
        return {
            headers,
            statusCode,
            statusMessage,
            data,
            time,
            responseUrl,
            error
        }
    }

    formatReq = (req: any): any => {
        // Good place to filter what we need to handle in the view (request).
        const { headers, protocol, hostname, path, method } = req
        return { headers, protocol, hostname, path, method }
    }
}

export default ExpressoHttpInterceptor
