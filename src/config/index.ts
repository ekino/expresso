import { Options } from './definitions'

export const defaultOptions: Options = {
    env: ['development', 'dev']
}

export const isValidEnvironment = (env: string, options: any = defaultOptions): boolean => {
    return options.env.includes(env)
}
