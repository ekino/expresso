import { ExpressoCall } from './components/definitions';
import { ExpressoHttpInterceptorData } from '../interceptors/definitions';
export declare const handleRender: (originalCall: ExpressoCall, underlyingCalls: ExpressoHttpInterceptorData[], staticPath?: string | undefined, publicPath?: string | undefined) => any;
export declare const renderFullPage: (html: any, preloadedState: any, staticPath?: string | undefined, publicPath?: string | undefined) => any;
