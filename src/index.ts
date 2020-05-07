import { isEnable, defaultOptions } from './config'
import express from 'express'
import path from 'path'
import ExpressoHttpInterceptor from './interceptors/http'
import html from './views/html'
import { EXPRESSO_STATIC_PATH, EXPRESSO_PUBLIC_PATH } from './constants'

let httpInterceptor: any

const middleware = (options: any = defaultOptions): any => {
    return (req: any, res: any, next: any): any => {
        if (!isEnable(req, process.env.NODE_ENV || '', options)) return next()
        if (!httpInterceptor) httpInterceptor = new ExpressoHttpInterceptor()
        req.app.use(
            EXPRESSO_STATIC_PATH,
            express.static(path.join(__dirname, EXPRESSO_PUBLIC_PATH), { index: false })
        )

        const send = res.send
        res.send = function(body: any): any {
            res.set('Content-Type', 'text/html')
            res.status(200)
            send.call(this, html({}))
        }

        res.json = function(body: any): any {
            res.set('Content-Type', 'text/html')
            res.status(200)
            send.call(this, html({}))
        }

        return next()
    }
}

export default {
    middleware
}
