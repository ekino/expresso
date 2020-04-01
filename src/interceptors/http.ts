import http from 'http'
import crypto from 'crypto'
import pick from 'lodash/pick'

class ExpressoHttpInterceptor {
    requests: Array<any> = []
    responses: Array<any> = []
    constructor() {
        const old = http.request
        http.request = (request: any, callback: any): any => {
            const startAt = process.hrtime()
            this.requests = [...this.requests, request]
            const hash = crypto
                .createHash('md5')
                .update(request.toString())
                .digest('hex')
            const buffer: any = {}
            if (!buffer[hash]) buffer[hash] = []
            const cb = (res: any): any => {
                res.on('data', (data: Buffer): any => {
                    buffer[hash] = [...buffer[hash], data]
                })
                res.on('end', () => {
                    if (res.statusCode === 200 && res.complete) {
                        const data = Buffer.concat(buffer[hash])
                        const json = JSON.parse(data.toString())
                        const diff = process.hrtime(startAt)
                        const time = diff[0] * 1e3 + diff[1] * 1e-6
                        this.responses = [...this.responses, { time, data: json, ...res }]
                    } else {
                        throw new Error(`Something wrong with response : ${res.statusCode}`)
                    }
                })
                callback(res)
            }
            old(request, cb).on('error', (error: any): any => {
                const diff = process.hrtime(startAt)
                const time = diff[0] * 1e3 + diff[1] * 1e-6
                this.responses = [...this.responses, { time, error }]
            })
            return old(request, cb)
        }
    }

    parse(): any {
        console.log('REQUESTS', this.requests)
        console.log('RESPONSES', this.responses)
        const responses = this.responses.map(res => {
            return pick(res, [
                'headers',
                'statusCode',
                'statusMessage',
                'data',
                'time',
                'responseUrl',
                'error'
            ])
        })
        console.log('PARSED RESPONSE', responses)
        return {
            data: 'Requests & responses for each underlying HTTP call'
        }
    }
}

export default ExpressoHttpInterceptor
