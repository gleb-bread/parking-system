export namespace Objects {
    export type NumberObject<T> = { [key: number]: T };

    export type DefinitedStringObject<K extends string, T> = {
        [key in K]: T;
    };

    export type StringObject<T> = { [key: string]: T };
}
