import { Request, Response, Router } from 'express'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'
import { Options } from './definitions'

const router = Router()
const outputDir = path.join(__dirname, 'tmp')
let config: Required<Options> = {
    outputDir,
    env: 'dev'
}

export function debugLoggerInit(options?: Options): void {
    config = {
        outputDir: path.normalize(options?.outputDir ?? config.outputDir),
        env: options?.env ?? 'dev'
    }
    if (config.env === process.env.NODE_ENV) {
        fs.mkdir(config.outputDir, { recursive: true }, () => undefined)
    }
}

export async function debugLogger(req: Request, res: Response, next: () => void): Promise<void> {
    if (config.env === process.env.NODE_ENV) {
        const uuidGenerated = uuid()
        res.locals.uuid = uuidGenerated
        res.append('uuid', uuidGenerated)
        const filePath = path.join(config.outputDir, `${uuidGenerated}.json`)
        await fs.promises.writeFile(
            path.join(filePath),
            JSON.stringify({
                headers: req.headers,
                method: req.method,
                query: req.query,
                params: req.params
            })
        )
    }
    next()
}

router.get(
    '/debug/:uuid',
    async (req: Request, res: Response): Promise<object> => {
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
        return res.status(401)
    }
)

export { router }
export * from './definitions'
