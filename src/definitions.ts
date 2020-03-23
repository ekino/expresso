import { Application, NextFunction, Request, Response } from 'express-serve-static-core'

export type Config = {
    env?: string
}

export type ExpressoApp = Application & {
    handle: (req: Request, res: ExpressoResponse, next: NextFunction) => void
}

export type ExpressoResponse = Response & {
    ctx: {
        startAt: number
    }
}
