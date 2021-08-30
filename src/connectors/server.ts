import http from 'http';
import { BlackBoxApp } from '../../index';

/**
 * Метод для запуска сервера
 * @param server        - http server
 * @param cb            - callback-функция
 * @param serverConfig  - конфиг для сервера
 */
export default function serverStart(
    server: http.Server,
    cb: () => void,
    serverConfig: BlackBoxApp.IServerConfig
) {
    server.listen(serverConfig.port, cb).on('error', () => {});
}
