export interface AppProps {
    data?: ExpressoData;
}
export interface ListItemProps {
    title?: string;
    item?: ExpressoUnderlyingCall | ExpressoCall;
}
export interface ListProps {
    title?: string;
    items?: ExpressoUnderlyingCall[];
}
export declare type ExpressoData = {
    originalCall: ExpressoCall;
    underlyingCalls: ExpressoUnderlyingCall[];
};
export declare type ExpressoUnderlyingCall = {
    id: string;
    response: ExpressoResponse;
    request: ExpressoRequest;
};
export declare type ExpressoCall = ExpressoResponse & {
    data: any;
};
export declare type ExpressoResponse = {
    headers?: any;
    statusCode?: number | string;
    statusMessage?: string;
    time?: number;
    url?: string;
    data?: any;
    error?: any;
};
export declare type ExpressoRequest = {
    headers?: any;
    protocol?: string | null;
    hostname?: string | null;
    path?: string | null;
    method?: string;
};
