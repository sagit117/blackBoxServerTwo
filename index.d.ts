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
        useCompression: boolean;
        bodyParser: {
            limit: string;
            extended: boolean;
            parameterLimit: number;
        };
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

    export abstract class ColoredLogger {
        logError(reason: string, msg: string): string;
        logWarn(reason: string, msg: string): string;
        logInfo(reason: string, msg: string): string;
    }
}
