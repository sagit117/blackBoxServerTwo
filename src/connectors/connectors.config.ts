import fs from 'fs';
import { BlackBoxApp } from '../../index';

/**
 * Класс для получения настроек из файла json
 */
export default class Config implements BlackBoxApp.Config {
    private readonly config;

    /**
     * Загрузка настроек из файла конфигурации
     * @param path - путь к файлу настроек
     */
    constructor(path: string) {
        if (!path) throw new Error('path cannot be undefined!');

        try {
            this.config = JSON.parse(fs.readFileSync(path, 'utf8'));
        } catch (e: any) {
            throw new Error(e);
        }
    }

    public getConfig<T>(): T {
        return this.config;
    }
}
