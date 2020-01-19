import express, { Request, Response } from 'express'
import { debugLogger, router } from './src'

const app = express()
app.use(debugLogger)
app.use(router)

app.get('/test', (req: Request, res: Response) => {
    return res.status(200).json({ ok: 200 })
})

app.listen(3000)
