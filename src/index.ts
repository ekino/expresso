import { isEnable, defaultOptions } from './config'
import express from 'express'
import path from 'path'
import { handleRender } from './views/server'
import ExpressoHttpInterceptor from './interceptors/http'
import { EXPRESSO_PUBLIC_PATH, EXPRESSO_STATIC_PATH } from './constants'
import { Options } from './config/definitions'
let interceptor: ExpressoHttpInterceptor
const middleware = (app: any, options: Options = defaultOptions): any => {
    handleStatic(app, options)
    return (req: any, res: any, next: any): any => {
        if (!isEnable(req, process.env.NODE_ENV || '', options)) return next()
        if (!interceptor) interceptor = new ExpressoHttpInterceptor()
        const send = res.send
        const staticPath = options.staticPath || defaultOptions.staticPath || EXPRESSO_STATIC_PATH
        res.send = function(body: any): any {
            // TODO append these to the final data (this is the original request info)
            // res.getHeaders() => (original response header before sending HTML)
            // body (original => response body before sending HTML)
            const originalRes = res.req
            res.set('Content-Type', 'text/html')
            res.status(200)
            send.call(
                this,
                handleRender({ ...originalRes, data: body }, interceptor.data, staticPath)
            )
            interceptor.data = []
        }

        res.json = function(body: any): any {
            const originalRes = res.req
            res.set('Content-Type', 'text/html')
            res.status(200)
            send.call(
                this,
                handleRender({ ...originalRes, data: body }, interceptor.data, staticPath)
            )
            interceptor.data = []
        }

        return next()
    }
}

const handleStatic = (app: any, options: Options): void => {
    const staticPath = options.staticPath
    const publicPath = EXPRESSO_PUBLIC_PATH
    const middlewareStatic = express.static(path.join(__dirname, publicPath), {
        index: false
    })
    app.use(staticPath, middlewareStatic)
}

export default {
    middleware
}
