/// <reference types="node" />
import { RequestOptions, IncomingMessage } from 'http';
export declare type ExpressoHttpInterceptorCallback = (res: IncomingMessage) => void;
export declare type ExpressoHttpInterceptorRequest = RequestOptions;
export declare type ExpressoHttpInterceptorResponse = IncomingMessage & {
    time: number;
    data: any;
    error: any;
};
export declare type ExpressoHttpInterceptorData = {
    id: string;
    response: ExpressoHttpInterceptorResponse;
    request: ExpressoHttpInterceptorRequest;
};
