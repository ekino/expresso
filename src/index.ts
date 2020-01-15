import { Handler, Request, Response, Router } from 'express'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'
import { Options } from './definitions'

const router = Router()
let config: Options

export async function debugLogger(options: Options): Promise<Handler> {
    config = options
    const dir = path.normalize(options.outputDir || __dirname)
    await fs.promises.mkdir(dir, { recursive: true })

    return async (req: Request, res: Response, next: () => void): Promise<void> => {
        if (options.env === process.env.NODE_ENV || 'dev' === process.env.NODE_ENV) {
            const uuidGenerated = uuid()
            res.locals.uuid = uuidGenerated
            const fileName = `${uuidGenerated}.json`
            await fs.promises.writeFile(path.join(dir, fileName), req)
        }
        next()
    }
}

router.get(
    '/debug/:id',
    async (req: Request, res: Response): Promise<any> => {
        if (config.env === process.env.NODE_ENV || 'dev' === process.env.NODE_ENV) {
            const fileName = `${res.locals.uuid}.json`
            const fileContent = await fs.promises.readFile(
                path.join(config.outputDir || __dirname, fileName)
            )

            return res.status(200).send(fileContent)
        } else {
            return res.status(401)
        }
    }
)

export * from './definitions'
