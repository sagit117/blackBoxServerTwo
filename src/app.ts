import http from "http";
import Express from "express";
import serverStart from "./connectors/connectors.server";
import { BlackBoxApp } from "../index";
import Config from "./connectors/connectors.config";
import ColoredLogger from "./connectors/connectors.coloredLogger";
import LogEmitter from "./emitters/emitter.log";

/**
 * Типы событий для логирования
 */
export enum LogEmitterEvent {
    logError = "logError",
    logInfo = "logInfo",
    logWarn = "logWarn",
}

/**
 * Функция для создания приложения BlackBox
 * @param configPath    - путь к файлу настроек
 * @param cbServerStart - callback-функция сработает после запуска сервера, если не задана, сработает функция по умолчанию
 */
export default function createApp(
    configPath: string,
    cbServerStart?: () => void
): BlackBoxApp.ICreateApp {
    /**
     * Получаем настройки приложения
     */
    const classConfig = new Config(configPath);
    const config = classConfig.getConfig<BlackBoxApp.IConfigApp>();

    /**
     * Создаем логгер
     */
    const logger = new ColoredLogger(config.logger);
    activateLoggerEmitters(logger);

    /**
     * Запускаем сервер
     */
    const blackBoxApp = Express();
    createServer(
        blackBoxApp,
        config?.server,
        cbServerStart || cbServerStartDefault
    );

    /**
     * callback-функция по умолчанию сработает после запуска сервера
     */
    function cbServerStartDefault() {
        LogEmitter.emit(
            LogEmitterEvent.logInfo,
            "SERVER",
            `START in port ${config?.server?.port || 8080}`
        );
    }

    return {
        blackBoxApp,
        classConfig,
    };
}

/**
 * Метод создает и запускает сервер
 * @param app           - express приложение
 * @param serverConfig  - конфиг сервера
 * @param cbServerStart - callback-функция сработает после успешного запуска сервера
 */
function createServer(
    app: Express.Express,
    serverConfig: BlackBoxApp.IServerConfig,
    cbServerStart: () => void
) {
    if (!app) throw new Error("app cannot be undefined!");

    const server = http.createServer(app);

    serverStart(server, serverConfig, cbServerStart);
}

/**
 * Активация слушателей для логирования
 * @param logger - класс логгер
 */
function activateLoggerEmitters(logger: ColoredLogger) {
    LogEmitter.addListeners(
        LogEmitterEvent.logError,
        (reason: string, error: Error | string) => {
            logger.logError(
                reason,
                error instanceof Error ? error.stack : error
            );
        }
    );

    LogEmitter.addListeners(
        LogEmitterEvent.logInfo,
        (reason: string, error: string) => {
            logger.logInfo(reason, error);
        }
    );

    LogEmitter.addListeners(
        LogEmitterEvent.logWarn,
        (reason: string, error: string) => {
            logger.logWarn(reason, error);
        }
    );
}
