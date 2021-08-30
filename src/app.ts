import http from 'http';
import Express from 'express';
import serverStart from './connectors/server';
import { BlackBoxApp } from '../index';
import Config from './connectors/config';

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
    const serverConfig: BlackBoxApp.IServerConfig = config.server;

    /**
     * Запускаем сервер
     */
    const blackBoxApp = Express();
    const server = http.createServer(blackBoxApp);

    serverStart(server, cbServerStart, serverConfig);

    function cbServerStart() {}

    return {
        blackBoxApp,
        classConfig,
    };
}
