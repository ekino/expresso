import { isEnable, defaultOptions } from './config'
import express from 'express'
import path from 'path'
import { handleRender } from './views/server'
import ExpressoHttpInterceptor from './interceptors/http'
import { EXPRESSO_STATIC_PATH, EXPRESSO_PUBLIC_PATH } from './constants'

let interceptor: ExpressoHttpInterceptor

const middleware = (app: any, options: any = defaultOptions): any => {
    handleStatic(app)
    return (req: any, res: any, next: any): any => {
        if (!isEnable(req, process.env.NODE_ENV || '', options)) return next()
        if (!interceptor) interceptor = new ExpressoHttpInterceptor()
        const send = res.send
        res.send = function(body: any): any {
            // TODO append these to the final data (this is the original request info)
            // res.getHeaders() => (original response header before sending HTML)
            // body (original => response body before sending HTML)
            const originalRes = res.req
            res.set('Content-Type', 'text/html')
            res.status(200)
            send.call(this, handleRender({ ...originalRes, data: body }, interceptor.data))
        }

        res.json = function(body: any): any {
            const originalRes = res.req
            res.set('Content-Type', 'text/html')
            res.status(200)
            send.call(this, handleRender({ ...originalRes, data: body }, interceptor.data))
        }

        return next()
    }
}

const handleStatic = (app: any): void => {
    const publicPath = path.join(__dirname, EXPRESSO_PUBLIC_PATH)
    const middlewareStatic = express.static(publicPath, {
        index: false
    })
    app.use(EXPRESSO_STATIC_PATH, middlewareStatic)
}

export default {
    middleware
}
