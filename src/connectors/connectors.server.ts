import http from "http";
import { BlackBoxApp } from "../../index";

/**
 * Метод для запуска сервера
 * @param server        - http server
 * @param serverConfig  - конфиг для сервера
 * @param cb            - callback-функция
 */
export default function serverStart(
    server: http.Server,
    serverConfig: BlackBoxApp.IServerConfig,
    cb: () => void
) {
    if (!server) throw new Error("server cannot be undefined!");

    server.listen(serverConfig?.port || 8080, cb).on("error", () => {});
}
