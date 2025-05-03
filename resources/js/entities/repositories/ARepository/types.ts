import type { AxiosResponse } from 'axios';

export type RepositoryConfig = {
    id?: number;
    payload?: any;
    path?: string;
    headers?: HEADERS;
    withCredentials?: boolean;
};

type HEADERS = Partial<{
    Accept: string;
    'Accept-Charset': string;
    'Accept-Encoding': string;
    'Accept-Language': string;
    'Accept-Ranges': string;
    'Access-Control-Allow-Credentials': string;
    'Access-Control-Allow-Headers': string;
    'Access-Control-Allow-Methods': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Expose-Headers': string;
    'Access-Control-Max-Age': string;
    Age: string;
    Allow: string;
    Authorization: string;
    'Cache-Control': string;
    Connection: string;
    'Content-Disposition': string;
    'Content-Encoding': string;
    'Content-Language': string;
    'Content-Length': string;
    'Content-Location': string;
    'Content-Range': string;
    'Content-Security-Policy': string;
    'Content-Type': string;
    Cookie: string;
    Date: string;
    ETag: string;
    'X-CSRF-TOKEN': string;
    Expect: string;
    Expires: string;
    Forwarded: string;
    From: string;
    Host: string;
    'If-Match': string;
    'If-Modified-Since': string;
    'If-None-Match': string;
    'If-Range': string;
    'If-Unmodified-Since': string;
    'Last-Modified': string;
    Link: string;
    Location: string;
    Origin: string;
    Pragma: string;
    'Proxy-Authenticate': string;
    'Proxy-Authorization': string;
    Range: string;
    Referer: string;
    'Retry-After': string;
    Server: string;
    'Set-Cookie': string;
    'Strict-Transport-Security': string;
    TE: string;
    Trailer: string;
    'Transfer-Encoding': string;
    Upgrade: string;
    'User-Agent': string;
    Vary: string;
    Via: string;
    Warning: string;
    'WWW-Authenticate': string;
    'X-Content-Type-Options': string;
    'X-Frame-Options': string;
    'X-XSS-Protection': string;
}>;

export interface ResponsePayload<T> {
    status: number;
    result: boolean;
    response: AxiosResponse<T, any> | null;
}

export interface ResponseSuccessPayload<T> {
    status: number;
    result: boolean;
    response: AxiosResponse<T, any>;
}
