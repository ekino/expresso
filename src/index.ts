import path from 'path'
import fs from 'fs'
import Handlebars from 'handlebars'
import { expressoApp } from './leroy'
import { isValidEnvironment, defaultOptions } from './config'
import ExpressoHttpInterceptor from './interceptors/http'

export const leroy = expressoApp
const view = path.join(__dirname, './views/expresso.html')
const httpInterceptor = new ExpressoHttpInterceptor()

export const format = (req: any, res: any, originalResponseBody: any): any => {
    console.log('**debug expresso format**')
    return {
        original: JSON.stringify(originalResponseBody),
        request: {
            ...req
        },
        response: {
            statusCode: res.statusCode,
            headers: {
                contentType: res.get('Content-Type') || '-'
            }
        },
        underlyingCalls: httpInterceptor.parse()
    }
}

export const expressoMiddleware = (options: any = defaultOptions): any => {
    return (req: any, res: any, next: any): any => {
        if (!isValidEnvironment(process.env.NODE_ENV || '', options)) return next()

        const content = fs.readFileSync(view, 'utf8')
        const template = Handlebars.compile(content)
        const send = res.send

        res.send = function(body: any): any {
            const expresso = template({ expresso: format(req, res, body) })
            res.set('Content-Type', 'text/html')
            res.status(200)
            send.call(this, expresso)
        }

        res.json = function(body: any): any {
            const expresso = template({ expresso: format(req, res, body) })
            res.set('Content-Type', 'text/html')
            res.status(200)
            send.call(this, expresso)
        }

        return next()
    }
}
