import { Request, Response, Router } from 'express'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'
import { Options, Environment, DefaultPath } from './definitions'

export const router = Router()
const outputDir = path.join(__dirname, DefaultPath)
let config: Required<Options> = {
    outputDir,
    env: Environment.Dev
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
    if (config.env === process.env.NODE_ENV) {
        const uuidGenerated = uuid()
        res.locals.uuid = uuidGenerated
        res.append('uuid', uuidGenerated)
        fs.promises
            .writeFile(
                path.join(config.outputDir, `${uuidGenerated}.json`),
                JSON.stringify({
                    headers: req.headers,
                    method: req.method,
                    query: req.query,
                    params: req.params
                })
            )
            .then(() => {
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
