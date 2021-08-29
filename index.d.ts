export namespace BlackBoxApp {
    export interface IConfigApp {
        server: {
            port: number;
            headers: Array<{
                key: string;
                value: string;
            }>;
        };
    }

    export abstract class Config {
        getConfig<T>(): T;
    }
}
