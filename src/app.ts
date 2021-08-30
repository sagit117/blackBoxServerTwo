import http from 'http';
import Express from 'express';
import serverStart from './connectors/connectors.server';
import { BlackBoxApp } from '../index';
import Config from './connectors/connectors.config';

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
     * Запускаем сервер
     */
    const blackBoxApp = Express();
    createServer(blackBoxApp, config?.server);

    return {
        blackBoxApp,
        classConfig,
    };
}

function cbServerStart() {}

/**
 * Метод создает и запускает сервер
 * @param app           - express приложение
 * @param serverConfig  - конфиг сервера
 */
function createServer(
    app: Express.Express,
    serverConfig: BlackBoxApp.IServerConfig
) {
    if (!app) throw new Error('app cannot be undefined!');

    const server = http.createServer(app);

    serverStart(server, cbServerStart, serverConfig);
}
