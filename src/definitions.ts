export interface Options {
    env?: string
    outputDir?: string
}

export enum Environment {
    Dev = 'dev'
}

export const DefaultPath = 'tmp'
export const RegexDebugRoute = '/debug/[A-Za-z0-9_-]+'
