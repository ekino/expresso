const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const view = path.join(__dirname, '../views/leroy.html')
exports.expressoApp = (app, setting = {}) => {
    const oldHandle = app.handle

    app.handle = function(req, res, next) {
        res.oldSend = app.response.send
        res.send = sendEdit.bind(res)
        res.oldJson = app.response.send
        res.json = jsonEdit.bind(res)
        res.oldEnd = res.end
        res.end = endEdit.bind(res)

        const { host, ...remainingHeaders } = req.headers
        res.ctx = {
            startAt: Date.now(),
            request: {
                httpVersion: req.httpVersion,
                host: req.headers.host,
                url: req.url,
                method: req.method,
                headers: remainingHeaders
            }
        }
        oldHandle.call(app, req, res, next)
    }

    return app
}

const sendEdit = function(obj) {
    if (typeof obj === 'object') {
        const content = fs.readFileSync(view, 'utf8')

        const contentWithJson = content.replace('<pre></pre>', `<pre>${JSON.stringify(obj)}</pre>`)
        return this.oldSend(contentWithJson)
    }
    return this.oldSend(obj)
}

const jsonEdit = function(obj) {
    return fs
        .readFile('./../views/index.html', 'utf8')
        .then(htmlContent => {
            const contentWithJson = htmlContent.replace(
                '<pre></pre>',
                `<pre>${JSON.stringify(obj)}</pre>`
            )
            return this.oldSend(contentWithJson)
        })
        .catch(e => {
            return this.oldSend(obj)
        })
}

const endEdit = function(chunk, encoding) {
    if (Buffer.isBuffer(chunk)) {
        this.ctx.response = {
            headers: this.getHeaders(),
            responseTime: Date.now() - this.ctx.startAt,
            statusCode: this.statusCode
        }
        const decodedChuck = chunk.toString('utf8')

        const template = Handlebars.compile(decodedChuck)
        const body = template({ body: this.ctx })

        const chunkModified = Buffer.from(body, 'utf8')
        this.setHeader('Content-Length', Buffer.byteLength(chunkModified, 'utf8'))

        return this.oldEnd(chunkModified, encoding || 'uft8')
    } else {
        return this.oldEnd(chunk, encoding || 'uft8')
    }
}
