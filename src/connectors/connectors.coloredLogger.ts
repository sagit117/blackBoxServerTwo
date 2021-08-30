import { BlackBoxApp } from "../../index";
import clc from "cli-color";

/**
 * Класс для колорированного логирования
 */
export default class ColoredLogger implements BlackBoxApp.ColoredLogger {
    private readonly errorMsg: clc.Format;
    private readonly warnMsg: clc.Format;
    private readonly infoMsg: clc.Format;
    private readonly dateMsg: clc.Format;

    constructor(config: BlackBoxApp.ILoggerConfig) {
        this.errorMsg = eval(
            `clc.${config?.messages?.error || "red.bold"}`
        ) as clc.Format;
        this.warnMsg = eval(
            `clc.${config?.messages?.warning || "yellow"}`
        ) as clc.Format;
        this.infoMsg = eval(
            `clc.${config?.messages?.info || "blue"}`
        ) as clc.Format;
        this.dateMsg = eval(
            `clc.${config?.messages?.dateTime || "bgBlack.bold.white"}`
        ) as clc.Format;
    }

    /**
     * Возвращает строку для логирования ошибки
     * @param reason    - причина сообщения
     * @param msg       - сообщение
     */
    public logError(reason: string, msg: string): string {
        return (
            this.errorMsg(`[${reason}] `) +
            this.dateMsg(new Date().toLocaleDateString()) +
            this.errorMsg(msg)
        );
    }

    /**
     * Возвращает строку для логирования предупреждения
     * @param reason    - причина сообщения
     * @param msg       - сообщение
     */
    public logWarn(reason: string, msg: string): string {
        return (
            this.warnMsg(`[${reason}] `) +
            this.dateMsg(new Date().toLocaleDateString()) +
            this.warnMsg(msg)
        );
    }

    /**
     * Возвращает строку для логирования информации
     * @param reason    - причина сообщения
     * @param msg       - сообщение
     */
    public logInfo(reason: string, msg: string): string {
        return (
            this.infoMsg(`[${reason}] `) +
            this.dateMsg(new Date().toLocaleDateString()) +
            this.infoMsg(msg)
        );
    }
}
