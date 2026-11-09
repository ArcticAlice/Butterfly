import Database from '@tauri-apps/plugin-sql';
import { formatDateForDB, normalizeFoodName, rankFoodMatches, capitalizeWords } from './helperFunctions';

const DB_NAME = 'sqlite:butterflyTemp.db';

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
        if (!rawName) return null;
        const normTarget = normalizeFoodName(rawName);
        if (!normTarget) return null;
        try {
            const allFoods = await this.db.select(
                `SELECT food_name, food_calories FROM unique_foods`
            );
            const match = allFoods.find(f => normalizeFoodName(f.food_name) === normTarget);
            if (match) {
                return {
                    food_name: match.food_name,
                    food_calories: Number(match.food_calories) || 0
                };
            }
            return null;
        } catch (error) {
            console.error('Failed to get unique food:', error);
            return null;
        }
    }

    async saveUniqueFood(rawName, calories) {
        if (!rawName) return;
        const displayName = capitalizeWords(rawName.trim());
        const normTarget = normalizeFoodName(displayName);
        if (!normTarget) return;
        const cal = Number(calories) || 0;
        try {
            const allFoods = await this.db.select(
                `SELECT food_name FROM unique_foods`
            );
            const existing = allFoods.find(f => normalizeFoodName(f.food_name) === normTarget);
            if (existing) {
                if (existing.food_name !== displayName) {
                    await this.db.execute(`DELETE FROM unique_foods WHERE food_name = $1`, [existing.food_name]);
                }
                await this.db.execute(
                    `INSERT OR REPLACE INTO unique_foods (food_name, food_calories) VALUES ($1, $2)`,
                    [displayName, cal]
                );
            } else {
                await this.db.execute(
                    `INSERT INTO unique_foods (food_name, food_calories) VALUES ($1, $2)`,
                    [displayName, cal]
                );
            }
        } catch (error) {
            console.error('Failed to save unique food:', error);
        }
    }

    async migrateUniqueFoodsTable() {
        try {
            let foodRecords = [];
            try {
                foodRecords = await this.db.select(`SELECT Info FROM food_records_v2`);
            } catch (err) {}

            const realFoodsMap = new Map();
            if (foodRecords && foodRecords.length > 0) {
                for (const row of foodRecords) {
                    if (!row.Info) continue;
                    try {
                        const parsed = JSON.parse(row.Info);
                        if (parsed && parsed.food_list) {
                            for (const [name, cals] of Object.entries(parsed.food_list)) {
                                const trimmed = name.trim();
                                const norm = normalizeFoodName(trimmed);
                                if (norm) {
                                    if (!realFoodsMap.has(norm) || trimmed.includes(' ')) {
                                        realFoodsMap.set(norm, {
                                            food_name: capitalizeWords(trimmed),
                                            food_calories: Number(cals) || 0
                                        });
                                    }
                                }
                            }
                        }
                    } catch (e) {}
                }
            }

            const existingUnique = await this.db.select(`SELECT food_name, food_calories FROM unique_foods`);

            for (const row of existingUnique) {
                const norm = normalizeFoodName(row.food_name);
                if (!norm) continue;

                if (realFoodsMap.has(norm)) {
                    const real = realFoodsMap.get(norm);
                    if (row.food_name !== real.food_name) {
                        await this.db.execute(`DELETE FROM unique_foods WHERE food_name = $1`, [row.food_name]);
                        await this.db.execute(
                            `INSERT OR REPLACE INTO unique_foods (food_name, food_calories) VALUES ($1, $2)`,
                            [real.food_name, real.food_calories || Number(row.food_calories) || 0]
                        );
                    }
                } else if (!row.food_name.includes(' ') && row.food_name === row.food_name.toLowerCase()) {
                    const formatted = capitalizeWords(row.food_name);
                    if (formatted !== row.food_name) {
                        await this.db.execute(`DELETE FROM unique_foods WHERE food_name = $1`, [row.food_name]);
                        await this.db.execute(
                            `INSERT OR REPLACE INTO unique_foods (food_name, food_calories) VALUES ($1, $2)`,
                            [formatted, Number(row.food_calories) || 0]
                        );
                    }
                }
            }

            for (const [, real] of realFoodsMap.entries()) {
                const check = await this.db.select(`SELECT food_name FROM unique_foods WHERE food_name = $1`, [real.food_name]);
                if (!check || check.length === 0) {
                    await this.db.execute(
                        `INSERT OR REPLACE INTO unique_foods (food_name, food_calories) VALUES ($1, $2)`,
                        [real.food_name, real.food_calories]
                    );
                }
            }
        } catch (error) {
            console.error('Failed to migrate unique_foods table:', error);
        }
    }

    async getMatchingUniqueFoods(rawQuery, limit = 3) {
        if (!rawQuery) return [];
        try {
            const allFoods = await this.db.select(
                `SELECT food_name, food_calories FROM unique_foods`
            );
            if (!allFoods || allFoods.length === 0) return [];

            const formattedFoods = allFoods.map(f => ({
                ...f,
                food_name: f.food_name ? capitalizeWords(f.food_name.replace(/([a-z])([A-Z])/g, '$1 $2')) : ''
            }));

            return rankFoodMatches(rawQuery, formattedFoods, limit);
        } catch (error) {
            console.error('Failed to query matching unique foods:', error);
            return [];
        }
    }

    async getAllUniqueFoods() {
        try {
            const foods = await this.db.select(
                `SELECT food_name, food_calories FROM unique_foods ORDER BY food_name COLLATE NOCASE ASC`
            );
            return (foods || []).map(f => ({
                food_name: f.food_name ? capitalizeWords(f.food_name) : '',
                food_calories: Number(f.food_calories) || 0
            }));
        } catch (error) {
            console.error('Failed to get all unique foods:', error);
            return [];
        }
    }

    async deleteUniqueFood(rawName) {
        if (!rawName) return false;
        try {
            await this.db.execute(
                `DELETE FROM unique_foods WHERE food_name = $1 COLLATE NOCASE`,
                [rawName.trim()]
            );
            return true;
        } catch (error) {
            console.error('Failed to delete unique food:', error);
            return false;
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