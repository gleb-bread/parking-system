import * as Types from "@/shared/types";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";

export namespace Response {
    export type ManyEntityResponse<T> = {
        info: InfoObject;
        items: T[];
    };

    export type InfoObject = {
        limit: number;
        count: number;
        pages: number;
        currentPage: number;
        nextPage: string | null;
        prevPage: string | null;
    };

    export type DefaultResponse<T> = {
        genericList: number[];
        entities: Types.Objects.NumberObject<T>;
    };

    export type MultiResponse<T> = {
        genericList: number[];
        info: InfoObject;
        entities: Types.Objects.NumberObject<T>;
    };

    export type DefaultError = {
        msg: string;
        status: number;
    };

    export type ResponsePayloadError<T = DefaultError> =
        DefaultResponsePayloadError & {
            data: AxiosError<T, any> | null;
        };

    export type DefaultResponsePayloadSuccess = {
        status: number;
        result: true;
    };

    export type DefaultResponsePayloadError = {
        status: number;
        result: false;
    };

    export type ResponsePayloadSuccess<T> = DefaultResponsePayloadSuccess & {
        data: AxiosResponse<T, any>;
    };

    export type ParseResponsePayloadSuccess<T> =
        DefaultResponsePayloadSuccess & {
            data: T;
        };

    export interface ResponseSuccessPayload<T> {
        status: number;
        result: boolean;
        response: AxiosResponse<T, any>;
    }
}
