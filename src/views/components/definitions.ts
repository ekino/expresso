export interface AppProps {
    data?: ExpressoData
}

export interface ListItemProps {
    title?: string
    item?: ExpressoUnderlyingCall | ExpressoCall
}

export interface ListProps {
    title?: string
    items?: ExpressoUnderlyingCall[]
}

export type ExpressoData = {
    originalCall: ExpressoCall
    underlyingCalls: ExpressoUnderlyingCall[]
}

export type ExpressoUnderlyingCall = {
    id: string
    response: ExpressoResponse
    request: ExpressoRequest
}

export type ExpressoCall = ExpressoResponse & {
    data: any
}

export type ExpressoResponse = {
    headers?: any
    statusCode?: number | string
    statusMessage?: string
    time?: number
    url?: string
    data?: any
    error?: any
}

export type ExpressoRequest = {
    headers?: any
    protocol?: string | null
    hostname?: string | null
    path?: string | null
    method?: string
}
