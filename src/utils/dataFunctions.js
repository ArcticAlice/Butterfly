import Database from '@tauri-apps/plugin-sql';
import { formatDateForDB } from './helperFunctions';

const DB_NAME = 'sqlite:butterflyTemp.db';

class Service {
    constructor(db) {
        this.db = db;
    }
    static async create() {
        const db = await Database.load(DB_NAME);
        const instance = new Service(db);
        return instance;
    }

    async getRecord(date, table_name) {
        const dateString = formatDateForDB(date);
        try {
            const result = await this.db.select(
                `SELECT Info FROM ${table_name} WHERE date = $1`,
                [dateString]
            )
            return result.length > 0 ? JSON.parse(result[0].Info) : null;
        } catch (error) {
            console.error(`Failed to get information for ${table_name}`, error);
            throw error;
        }
    }

    async saveRecord(date, info, table_name) {
        try {
            const dateString = formatDateForDB(date);
            const exists = await this.getRecord(date, table_name);
            const json = JSON.stringify(info);
            if (exists) {
                const result = await this.db.execute(
                    `UPDATE ${table_name} SET Info = $1 WHERE date = $2`,
                    [json, dateString]
                )
            } else {
                await this.db.execute(
                    `INSERT INTO ${table_name} (date, Info) VALUES ($1, $2)`,
                    [dateString, json]
                )
            }
        } catch (error) {
            console.error(`Failed to save information for ${table_name}`, error);
            throw error;
        }
    }
}

let serviceInstance = null;

export async function getService() {
    if (!serviceInstance) {
        try {
            serviceInstance = await Service.create();
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 50));
            serviceInstance = await Service.create();
        }
    }
    return serviceInstance;
}