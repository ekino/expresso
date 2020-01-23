import express, { Request, Response, Router } from 'express'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'
import { Options, Environment, DefaultPath, RegexDebugRoute } from './definitions'

export const router = Router()
const outputDir = path.join(__dirname, DefaultPath)
let config: Required<Options> = {
    outputDir,
    env: Environment.Dev
}

function writeRequest(req: Request, path: string): Promise<void> {
    return fs.promises.writeFile(
        path,
        JSON.stringify({
            request: {
                headers: req.headers,
                method: req.method,
                query: req.query,
                params: req.params
            }
        })
    )
}

export function debugLoggerInit(options?: Options): void {
    config = {
        outputDir:
            options && options.outputDir
                ? path.join(__dirname, options.outputDir)
                : config.outputDir,
        env: options && options.env ? options.env : Environment.Dev
    }
    if (config.env === process.env.NODE_ENV) {
        fs.mkdir(config.outputDir, { recursive: true }, () => undefined)
    }
}

export function debugLogger(req: Request, res: Response, next: () => void): void {
    if (config.env === process.env.NODE_ENV && !RegExp(RegexDebugRoute).exec(req.url)) {
        const uuidGenerated = uuid()
        res.locals.uuid = uuidGenerated
        res.append('uuid', uuidGenerated)
        const filePath = path.join(config.outputDir, `${uuidGenerated}.json`)

        res.on('finish', () => {
            fs.promises
                .readFile(filePath, { encoding: 'utf8' })
                .then(content => {
                    const parsedContent = JSON.parse(content)
                    parsedContent.response = {
                        status: res.statusCode
                    }
                    return parsedContent
                })
                .then(output => {
                    fs.promises.writeFile(filePath, JSON.stringify(output))
                })
        })
        writeRequest(req, filePath).then(() => {
            next()
        })
    } else {
        next()
    }
}

router.get('/debug/:uuid', async (req: Request, res: Response) => {
    if (config.env === process.env.NODE_ENV) {
        const filePath = path.join(config.outputDir, `${req.params.uuid}.json`)
        try {
            await fs.promises.access(filePath)
            const fileContent = await fs.promises.readFile(filePath, {
                encoding: 'utf8'
            })
            return res.status(200).json(JSON.parse(fileContent))
        } catch (e) {
            return res.status(404).send()
        }
    }
    return res.status(200).send()
})

export * from './definitions'
