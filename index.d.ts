import { Express } from "express";

export namespace BlackBoxApp {
    export interface IConfigApp {
        server: IServerConfig;
        logger: ILoggerConfig;
    }

    export interface IServerConfig {
        port: number;
        headers: Array<{
            key: string;
            value: string;
        }>;
    }

    export interface ILoggerConfig {
        messages: ILoggerMessageType;
    }

    export interface ILoggerMessageType {
        error?: string;
        info?: string;
        warning?: string;
        dateTime?: string;
    }

    export interface ICreateApp {
        blackBoxApp: Express;
        classConfig: Config;
    }

    export abstract class Config {
        getConfig<T>(): T;
    }
}
