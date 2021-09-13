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
    private readonly textMsg: clc.Format;

    constructor(config: BlackBoxApp.ILoggerConfig) {
        // @ts-ignore
        const color = clc;

        this.errorMsg = eval(
            `color.${config?.messages?.error || "red.bold.bgWhite"}`
        ) as clc.Format;
        this.warnMsg = eval(
            `color.${config?.messages?.warning || "yellow.bold.bgWhite"}`
        ) as clc.Format;
        this.infoMsg = eval(
            `color.${config?.messages?.info || "blue.bold.bgWhite"}`
        ) as clc.Format;
        this.dateMsg = eval(
            `color.${config?.messages?.dateTime || "bgBlack.bold.white"}`
        ) as clc.Format;
        this.textMsg = eval(
            `color.${config?.messages?.text || "whiteBright"}`
        ) as clc.Format;
    }

    /**
     * Возвращает строку для логирования ошибки
     * @param reason    - причина сообщения
     * @param msg       - сообщение
     */
    public logError(reason: string, msg: string = ""): string {
        const logString =
            this.dateMsg(new Date().toLocaleDateString()) +
            " " +
            this.textMsg(`[${reason}] `) +
            " " +
            this.errorMsg(" CRITICAL ") +
            " " +
            this.textMsg(msg);

        this.log(logString);

        return logString;
    }

    /**
     * Возвращает строку для логирования предупреждения
     * @param reason    - причина сообщения
     * @param msg       - сообщение
     */
    public logWarn(reason: string, msg: string): string {
        const logString =
            this.dateMsg(new Date().toLocaleDateString()) +
            " " +
            this.textMsg(`[${reason}] `) +
            " " +
            this.warnMsg(" WARNING ") +
            " " +
            this.textMsg(msg);

        this.log(logString);

        return logString;
    }

    /**
     * Возвращает строку для логирования информации
     * @param reason    - причина сообщения
     * @param msg       - сообщение
     */
    public logInfo(reason: string, msg: string): string {
        const logString =
            this.dateMsg(new Date().toLocaleDateString()) +
            " " +
            this.textMsg(`[${reason}] `) +
            " " +
            this.infoMsg(" INFO ") +
            " " +
            this.textMsg(msg);

        this.log(logString);

        return logString;
    }

    /**
     * Логирование
     * @param str - строка лога
     * @private
     */
    private log(str: String) {
        console.log(str);
    }
}
