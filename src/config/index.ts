import { Options } from './definitions'

export const defaultOptions: Options = {
    env: ['development', 'dev']
}

export const runInValidEnvironment = (env: string, options: any = defaultOptions): boolean => {
    return options.env.includes(env)
}

export const isEnable = (req: any, env: string, options: any = defaultOptions): boolean => {
    return runInValidEnvironment(env, options) && req.header('X-Expresso-Enable')
}
