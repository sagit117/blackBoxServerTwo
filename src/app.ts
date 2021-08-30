import http from "http";
import Express from "express";
import serverStart from "./connectors/connectors.server";
import { BlackBoxApp } from "../index";
import Config from "./connectors/connectors.config";
import ColoredLogger from "./connectors/connectors.coloredLogger";

/**
 * Функция для создания приложения BlackBox
 * @param configPath - путь к файлу настроек
 */
export default function createApp(configPath: string): BlackBoxApp.ICreateApp {
    /**
     * Получаем настройки приложения
     */
    const classConfig = new Config(configPath);
    const config = classConfig.getConfig<BlackBoxApp.IConfigApp>();

    /**
     * Создаем логгер
     */
    const logger = new ColoredLogger(config.logger);

    /**
     * Запускаем сервер
     */
    const blackBoxApp = Express();
    createServer(blackBoxApp, config?.server, cbServerStart.bind(null, logger));

    return {
        blackBoxApp,
        classConfig,
    };
}

function cbServerStart(logger: ColoredLogger) {
    console.log(logger.logInfo("SERVER", "START"));
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
