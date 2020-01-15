import { Handler, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'
import { Options } from './definitions'

export async function debugLogger(config: Options): Promise<Handler> {
    const dir = path.normalize(config.outputDir || __dirname)
    await fs.promises.mkdir(dir, { recursive: true })

    return async (req: Request, res: Response, next: () => void): Promise<void> => {
        if (config.env === process.env.NODE_ENV || 'dev' === process.env.NODE_ENV) {
            const uuidGenerated = uuid()
            res.locals.uuid = uuidGenerated
            const fileName = `${uuidGenerated}.json`
            await fs.promises.writeFile(path.join(dir, fileName), req)
        }
        next()
    }
}

export * from './definitions'
