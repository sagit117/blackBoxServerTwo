import * as fs from 'fs';
import { BlackBoxApp } from '../../index';

/**
 * Класс для получения настроек из файла json
 */
export default class Config implements BlackBoxApp.Config {
    private readonly config;

    /**
     * Загрузка настроек из файла конфигурации
     */
    constructor(url: string) {
        try {
            this.config = JSON.parse(fs.readFileSync(url, 'utf8'));
        } catch (e: any) {
            throw new Error(e);
        }
    }

    public getConfig<T>(): T {
        return this.config;
    }
}
