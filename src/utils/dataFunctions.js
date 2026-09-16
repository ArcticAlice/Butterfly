import Database from '@tauri-apps/plugin-sql';
import { formatDateForDB, normalizeFoodName, rankFoodMatches } from './helperFunctions';

const DB_NAME = 'sqlite:butterflyg.db';

class Service {
    constructor(db) {
        this.db = db;
    }
    static async create() {
        const db = await Database.load(DB_NAME);
        const instance = new Service(db);
        try {
            await db.execute(
                `CREATE TABLE IF NOT EXISTS unique_foods (
                    food_name TEXT PRIMARY KEY,
                    food_calories INTEGER
                )`
            );
        } catch (error) {
            console.error('Failed to create unique_foods table:', error);
        }
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

    async getRecordsForMonth(year, month, table_name) {
        try {
            const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-%`;
            const result = await this.db.select(
                `SELECT date, Info FROM ${table_name} WHERE date LIKE $1`,
                [monthPrefix]
            );
            return result.map(row => ({
                date: row.date,
                info: row.Info ? JSON.parse(row.Info) : null
            }));
        } catch (error) {
            console.error(`Failed to get monthly records for ${table_name}`, error);
            return [];
        }
    }

    async getUniqueFood(rawName) {
        const normalized = normalizeFoodName(rawName);
        if (!normalized) return null;
        try {
            const result = await this.db.select(
                `SELECT food_name, food_calories FROM unique_foods WHERE food_name = $1`,
                [normalized]
            );
            if (result && result.length > 0) {
                return {
                    food_name: result[0].food_name,
                    food_calories: Number(result[0].food_calories) || 0
                };
            }
            return null;
        } catch (error) {
            console.error('Failed to get unique food:', error);
            return null;
        }
    }

    async saveUniqueFood(rawName, calories) {
        const normalized = normalizeFoodName(rawName);
        if (!normalized) return;
        const cal = Number(calories) || 0;
        try {
            const existing = await this.db.select(
                `SELECT food_name FROM unique_foods WHERE food_name = $1`,
                [normalized]
            );
            if (existing && existing.length > 0) {
                await this.db.execute(
                    `UPDATE unique_foods SET food_calories = $1 WHERE food_name = $2`,
                    [cal, normalized]
                );
            } else {
                await this.db.execute(
                    `INSERT INTO unique_foods (food_name, food_calories) VALUES ($1, $2)`,
                    [normalized, cal]
                );
            }
        } catch (error) {
            console.error('Failed to save unique food:', error);
        }
    }

    async getMatchingUniqueFoods(rawQuery, limit = 3) {
        if (!rawQuery) return [];
        try {
            const allFoods = await this.db.select(
                `SELECT food_name, food_calories FROM unique_foods`
            );
            if (!allFoods || allFoods.length === 0) return [];
            return rankFoodMatches(rawQuery, allFoods, limit);
        } catch (error) {
            console.error('Failed to query matching unique foods:', error);
            return [];
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