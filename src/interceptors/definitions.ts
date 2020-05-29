import { RequestOptions, IncomingMessage } from 'http'

export type ExpressoHttpInterceptorCallback = (res: IncomingMessage) => void
export type ExpressoHttpInterceptorRequest = RequestOptions
export type ExpressoHttpInterceptorResponse = IncomingMessage & {
    time: number
    data: any
    error: any
}
export type ExpressoHttpInterceptorData = {
    id: string
    response: ExpressoHttpInterceptorResponse
    request: ExpressoHttpInterceptorRequest
}
