import { NextFunction, Response, Request } from 'express-serve-static-core'
import { Config, ExpressoApp, ExpressoResponse } from './definitions'

let config: Config = {
    env: 'development'
}

export const expressoApp = (app: ExpressoApp, setting: Config = {}): ExpressoApp => {
    config = { ...config, ...setting }

    if (setting.env !== process.env.NODE_ENV) {
        return app
    }

    const oldHandle = app.handle

    app.handle = function(req: Request, res: ExpressoResponse, next: NextFunction): void {
        res.ctx = {
            startAt: Date.now()
        }
        oldHandle.call(app, req, res, next)
    }

    app.use(expressoMiddleware)

    return app
}

const expressoMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (req.get('debugHeader') !== 'true') {
        return next()
    }
    const oldSend = res.send

    res.send = (obj?: any): Response => {
        const oldEnd = res.end

        // @ts-ignore
        res.end = (chunk: any, encoding: string): void => {
            if (!Buffer.isBuffer(chunk)) {
                oldEnd.call(res, chunk, encoding || 'uft8')
            } else {
                const headers = res.getHeaders()
                const decodedChunk = chunk.toString('utf8')
                const decodedChunkWithResponseHeaders = decodedChunk.replace(
                    'Response headers :',
                    `Response headers : ${JSON.stringify(headers)}`
                )
                const chunkModified = Buffer.from(decodedChunkWithResponseHeaders, 'utf8')
                oldEnd.call(res, chunkModified, encoding || 'uft8')
            }
        }

        if (typeof obj === 'string') {
            const jsonWithDebugBar = `<html><pre>${obj}</pre><body><body>
                    <p>Request headers : </p>
                    <p>Response headers : </p>
                 </body></body></html>`
            return oldSend.call(res, jsonWithDebugBar)
        }

        if (typeof obj === 'object') {
            const jsonWithDebugBar = `<html><pre>${JSON.stringify(obj)}</pre>
                <body>
                    <p>Request headers : </p>
                    <p>Response headers : </p>
                 </body>
             </html>`
            return oldSend.call(res, jsonWithDebugBar)
        }
        return oldSend.call(res, obj)
    }
    next()
}
