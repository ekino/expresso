import { Options } from './definitions'
import { EXPRESSO_ENV, EXPRESSO_STATIC_PATH } from '../constants'

export const defaultOptions: Options = {
    env: EXPRESSO_ENV,
    staticPath: EXPRESSO_STATIC_PATH
}

export const runInValidEnvironment = (env: string, options: Options = defaultOptions): boolean => {
    const optionalEnv = options.env || defaultOptions.env || EXPRESSO_ENV
    return optionalEnv.includes(env)
}

export const isEnable = (req: any, env: string, options: any = defaultOptions): boolean => {
    return (
        runInValidEnvironment(env, options) &&
        req.header('X-Expresso-Enable') &&
        req.path.indexOf(EXPRESSO_STATIC_PATH) <= -1
    )
}
