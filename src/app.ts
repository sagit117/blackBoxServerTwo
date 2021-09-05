import http from "http";
import Express from "express";
import Compression from "compression";
import BodyParser from "body-parser";
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
     * Создаем логгер и активируем слушателей
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
        cbServerStart || cbServerStartDefault.bind(null, config)
    );

    /**
     * middleware
     */
    const urlencodedParser = BodyParser.urlencoded({
        limit: config?.server?.bodyParser?.limit || "50mb",
        extended: !!config?.server?.bodyParser?.extended,
        parameterLimit: config?.server?.bodyParser?.parameterLimit || 50000,
    }); // чтение данных из форм
    const jsonParser = BodyParser.json({
        limit: config?.server?.bodyParser?.limit || "50mb",
    }); // чтение данных из json

    blackBoxApp.use(urlencodedParser);
    blackBoxApp.use(jsonParser);

    config.server.useCompression && blackBoxApp.use(Compression());

    /**
     * Обработчики сигналов выхода
     */
    sigExitPrepare();

    /**
     * Обработчики неизвестных ошибок
     */
    process.on("uncaughtException", (error) => {
        LogEmitter.emit(LogEmitterEvent.logError, "uncaughtException", error);
        process.exit(1);
    });

    /**
     * Обработчик ошибок в promises
     */
    process.on("unhandledRejection", (reason, _promise) => {
        /**
         * Обработка ошибок специальных исключений
         */
        // if (reason instanceof HttpInternalServerException) {
        //     reason.response.send(reason.message)
        // } else if (reason instanceof HttpValidationException) {
        //     reason.response.send(reason.message)
        // }

        LogEmitter.emit(LogEmitterEvent.logError, "unhandledRejection", reason);
    });

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
 * callback-функция по умолчанию сработает после запуска сервера
 * @param config - конфигурация
 */
function cbServerStartDefault(config: BlackBoxApp.IConfigApp) {
    LogEmitter.emit(
        LogEmitterEvent.logInfo,
        "SERVER",
        `START in port ${config?.server?.port || 8080}`
    );
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

/**
 * Обработчики сигналов выхода
 */
function sigExitPrepare() {
    const exits = ["exit", "SIGTERM", "SIGINT", "SIGHUP", "SIGQUIT"];

    exits.forEach((event) => {
        process.on(event, (code: number) => {
            LogEmitter.emit(
                LogEmitterEvent.logWarn,
                "EXIT",
                `server остановлен по коду ${code}`
            );

            process.exit(0);
        });
    });
}
