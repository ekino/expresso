/// <reference types="node" />
import { RequestOptions } from 'http';
import { URL } from 'url';
import { ExpressoHttpInterceptorData, ExpressoHttpInterceptorCallback } from './definitions';
declare class ExpressoHttpInterceptor {
    data: Array<ExpressoHttpInterceptorData>;
    constructor();
    isURL(url: URL | string | RequestOptions | undefined): url is URL;
    /**
     * Add listeners to the response (`on data` and `on end`).
     * Store the underlyings requests and responses data within the memory.
     * @param options original http request options.
     * @param originalHttpRequestCallback original http request callback.
     * @param startAt [number, number] use to caclulate response time from this value.
     */
    overrideCallback(options: RequestOptions, originalHttpRequestCallback: ExpressoHttpInterceptorCallback, startAt: [number, number]): ExpressoHttpInterceptorCallback;
    private formatData;
}
export default ExpressoHttpInterceptor;
