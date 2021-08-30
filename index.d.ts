import { Express } from 'express';

export namespace BlackBoxApp {
    export interface IConfigApp {
        server: IServerConfig;
    }

    export interface IServerConfig {
        port: number;
        headers: Array<{
            key: string;
            value: string;
        }>;
    }

    export interface ICreateApp {
        blackBoxApp: Express;
        classConfig: Config;
    }

    export abstract class Config {
        getConfig<T>(): T;
    }
}
