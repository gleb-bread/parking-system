import { AxiosError } from 'axios';
import * as ServiceTypes from './types';
import * as ARepositoryTypes from '@/entities/repositories/ARepository/types';
import * as Types from '@/shared/types';

export class Service {
    protected getCacheObject<T, K extends keyof T>(array: T[], keyCache: K) {
        return array.reduce(
            (obj, value) => {
                const key = value[keyCache];
                if (
                    typeof key === 'string' ||
                    typeof key === 'number' ||
                    typeof key === 'symbol'
                ) {
                    obj[key] = value;
                }
                return obj;
            },
            {} as ServiceTypes.ServiceCacheObj<T, K>
        );
    }

    protected getIndexList<T, K extends keyof T>(array: T[], keyCache: K) {
        return array.reduce(
            (list, value) => {
                const key = value[keyCache];
                list.push(key);
                return list;
            },
            [] as Array<T[K]>
        );
    }

    protected validateRequest<T>(payload: ServiceTypes.ValidatePayload<T>) {
        try {
            if (payload.response.response instanceof AxiosError) {
                console.error(payload.response);
                payload.error(payload.response);
            } else {
                payload.success(
                    payload.response as unknown as ARepositoryTypes.ResponseSuccessPayload<T>
                );
            }
        } catch (err) {
            console.error('Validation error:', err);
            payload.error({
                status: 400,
                result: false,
                response: null,
            });
        } finally {
            if (payload.finally) {
                payload.finally(payload.response);
            }
        }
    }

    protected handlerResponse<T, E, J>(
        payload: ServiceTypes.ResponsePayload<T, E>,
        success: (
            response: Types.Response.ResponsePayloadSuccess<T>
        ) => Types.Response.ParseResponsePayloadSuccess<J>
    ) {
        if (payload.result) {
            return success(payload as Types.Response.ResponsePayloadSuccess<T>);
        }
        return payload;
    }

    protected generateResponse<T>(
        payload: Types.Response.ParseResponsePayloadSuccess<T>
    ): Types.Response.ParseResponsePayloadSuccess<T> {
        return {
            data: payload.data,
            result: payload.result,
            status: payload.status,
        };
    }
}
