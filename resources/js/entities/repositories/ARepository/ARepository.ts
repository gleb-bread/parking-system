import * as RepositoryTypes from "./types";
import { AxiosError } from "axios";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import * as Types from "@/shared/types";
import axios from "axios";

export class ARepository {
    constructor(
        private _url: string,
        private _config?: RepositoryTypes.RepositoryConfig
    ) {
        this._config = {
            withCredentials: true,
            ..._config,
        };
    }

    protected async GET() {
        let config = this.getConfigRequestGet();
        return axios.get(this.getUrl(), config);
    }

    protected async POST() {
        let config = this.getConfig();
        let data = this.getData();
        return axios.post(this.getUrl(), data, config);
    }

    protected async PATCH() {
        let config = this.getConfig();
        let data = this.getData();
        return axios.patch(this.getUrl(), data, config);
    }

    protected async PUT() {
        let config = this.getConfig();
        let data = this.getData();
        return axios.put(this.getUrl(), data, config);
    }

    protected async DELETE() {
        let config = this.getConfigRequestGet();
        return axios.delete(this.getUrl(), config);
    }

    private getUrl() {
        if (this._config?.id && this._config?.path) {
            return `${this._url}/${this._config.id}/${this._config.path}`;
        } else if (this._config?.id) {
            return `${this._url}/${this._config.id}`;
        } else if (this._config?.path) {
            return `${this._url}/${this._config.path}`;
        } else {
            return `${this._url}`;
        }
    }

    private getConfig(): AxiosRequestConfig {
        let config: AxiosRequestConfig = {};

        if (this._config?.headers) {
            config.headers = this._config.headers;
        }

        if (this._config?.withCredentials !== undefined) {
            config.withCredentials = !!this._config.withCredentials;
        }

        return config;
    }

    private getConfigRequestGet(): AxiosRequestConfig {
        let configRequest = this.getConfig();
        if (this._config?.payload) {
            configRequest.params = this._config.payload;
        }

        return configRequest;
    }

    private getData() {
        if (this._config?.payload) {
            return this._config.payload;
        } else {
            return {};
        }
    }

    protected get payload() {
        if (!this._config) {
            this._config = {};
        }
        if (!this._config.payload) {
            this._config.payload = {};
        }

        return { ...this._config.payload };
    }

    protected set payload(params: any) {
        if (!this._config) {
            this._config = {};
        }

        if (!this._config.payload) {
            this._config.payload = {};
        }

        if (typeof params === "object") {
            this._config.payload = { ...params };
        } else {
            this._config.payload = params;
        }
    }

    protected get config(): RepositoryTypes.RepositoryConfig {
        if (!this._config) {
            return {} as RepositoryTypes.RepositoryConfig;
        }

        return { ...this._config };
    }

    protected set config(config: RepositoryTypes.RepositoryConfig) {
        this._config = { ...config };
    }

    protected addParamsInConfig(config: RepositoryTypes.RepositoryConfig) {
        this._config = { ...this._config, ...config };
    }

    protected shallowEqual(
        obj1: Record<string, any>,
        obj2: Record<string, any>
    ): boolean {
        if (obj1 === obj2) {
            return true;
        }

        if (
            typeof obj1 !== "object" ||
            obj1 === null ||
            typeof obj2 !== "object" ||
            obj2 === null
        ) {
            return false;
        }

        let keys1 = Object.keys(obj1);
        let keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }

        return true;
    }

    protected generateResponse<T>(payload: {
        response?: AxiosResponse<T, any>;
    }): RepositoryTypes.ResponsePayload<T> {
        let result = {
            response: payload.response ?? null,
            ...this.getResultByStatusRequst(payload.response),
        };

        return result;
    }

    protected generateResponseSuccess<T>(payload: {
        response: AxiosResponse<T, any>;
    }): Types.Response.ResponsePayloadSuccess<T> {
        let result: Types.Response.ResponsePayloadSuccess<T> = {
            data: payload.response,
            status: payload.response?.status ?? 200,
            result: true,
        };

        return result;
    }

    protected generateResponseError<T = Types.Response.DefaultError>(payload: {
        response?: AxiosError<T, any>;
    }): Types.Response.ResponsePayloadError<T> {
        let result: Types.Response.ResponsePayloadError<T> = {
            data: payload.response ?? null,
            status: payload.response?.status ?? 400,
            result: false,
        };

        if (payload?.response?.status === 401) {
            window.location.href = "/login";
        }
        return result;
    }

    private getResultByStatusRequst(
        response?: AxiosResponse<any, any> | AxiosError<any, any>
    ) {
        if (response instanceof AxiosError) {
            const status = response?.response?.status ?? 400;

            return {
                status: status,
                result: this.checkResultByStatus(status),
            };
        } else {
            const status = response?.status ?? 400;

            return {
                status: status,
                result: this.checkResultByStatus(status),
            };
        }
    }

    private checkResultByStatus(status: number) {
        if (status != 200) {
            return false;
        } else {
            return true;
        }
    }

    protected get URL() {
        return this._url;
    }

    protected set URL(value: string) {
        this._url = value;
    }
}
