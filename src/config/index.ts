import { Options } from './definitions'
import { EXPRESSO_STATIC_PATH } from '../constants'

export const defaultOptions: Options = {
    env: ['development', 'dev']
}

export const runInValidEnvironment = (env: string, options: any = defaultOptions): boolean => {
    return options.env.includes(env)
}

export const isEnable = (req: any, env: string, options: any = defaultOptions): boolean => {
    return (
        runInValidEnvironment(env, options) &&
        req.header('X-Expresso-Enable') &&
        req.path.indexOf(EXPRESSO_STATIC_PATH) <= -1
    )
}
