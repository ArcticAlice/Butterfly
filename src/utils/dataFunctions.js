import Database from '@tauri-apps/plugin-sql';
import { formatDateForDB } from './helperFunctions';

// Ensures both Sleep and Food point to the exact same DB file defined in lib.rs
const DB_NAME = 'sqlite:butterflyTemp.db'; 

class Sleep {
    constructor(db) {
        this.db = db;
    }

    static async create() {
        const db = await Database.load(DB_NAME);
        return new Sleep(db);
    }

    async getSleepRecord(date) {
        const dateString = formatDateForDB(date);
        try {
            const result = await this.db.select(
                'SELECT * FROM sleep_records WHERE date = $1',
                [dateString]
            );
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('Failed to get sleep record:', error);
            throw error;
        }
    }

    async saveSleepRecord(date, sleepData) {
        try {
            const dateString = formatDateForDB(date);
            const exists = await this.getSleepRecord(date);

            if (exists) {
                await this.db.execute(
                    `UPDATE sleep_records 
                    SET sleep_start_time = $1, sleep_end_time = $2, rem_sleep_duration = $3,
                        deep_sleep_duration = $4, light_sleep_duration = $5, awake_duration = $6,
                        sleep_quality_rating = $7, notes = $8
                    WHERE date = $9`,
                    [
                        sleepData.sleep_start_time, sleepData.sleep_end_time, sleepData.rem_sleep_duration,
                        sleepData.deep_sleep_duration, sleepData.light_sleep_duration, sleepData.awake_duration,
                        sleepData.sleep_quality_rating, sleepData.notes, dateString
                    ]
                );
            } else {
                await this.db.execute(
                    `INSERT INTO sleep_records (
                        date, sleep_start_time, sleep_end_time, rem_sleep_duration, 
                        deep_sleep_duration, light_sleep_duration, awake_duration, sleep_quality_rating, notes
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [
                        dateString, sleepData.sleep_start_time, sleepData.sleep_end_time,
                        sleepData.rem_sleep_duration, sleepData.deep_sleep_duration,
                        sleepData.light_sleep_duration, sleepData.awake_duration,
                        sleepData.sleep_quality_rating, sleepData.notes
                    ]
                );
            }
        } catch (error) {
            console.error('Failed to save sleep record:', error);
            throw error;
        }
    }

    getDefaultSleepRecord() {
        return {
            sleep_start_time: '', sleep_end_time: '', rem_sleep_duration: 0,
            deep_sleep_duration: 0, light_sleep_duration: 0, awake_duration: 0,
            sleep_quality_rating: '', notes: ''
        };
    }
}

class Food {
    constructor(db) {
        this.db = db;
    }

    static async create() {
        const db = await Database.load(DB_NAME);
        return new Food(db); // Fixed: was returning "new Sleep(db)"
    }

    async getFoodRecord(date) {
        const dateString = formatDateForDB(date);
        try {
            const result = await this.db.select(
                'SELECT * FROM food_records WHERE date = $1',
                [dateString]
            );

            if (result.length > 0) {
                let record = result[0];
                // Convert the SQLite Text back into a Javascript Object
                record.food_info = record.food_info ? JSON.parse(record.food_info) : {};
                return record;
            }
            return null;
        } catch (error) {
            console.error('Failed to get food record:', error);
            throw error;
        }
    }

    async saveFoodRecord(date, food_data) {
        try {
            const dateString = formatDateForDB(date);
            const exists = await this.getFoodRecord(date);
            
            // Convert the Javascript Object into a Text string for SQLite
            const serializedFoodInfo = JSON.stringify(food_data.food_info || {});

            if (exists) {
                await this.db.execute(
                    `UPDATE food_records SET food_info = $1, notes = $2 WHERE date = $3`,
                    [serializedFoodInfo, food_data.notes, dateString]
                );
            } else {
                await this.db.execute(
                    `INSERT INTO food_records (date, food_info, notes) VALUES ($1, $2, $3)`,
                    [dateString, serializedFoodInfo, food_data.notes]
                );
            }
        } catch (error) {
            console.error('Failed to save food record:', error);
            throw error;
        }
    }

    getDefaultFoodRecord() {
        // Switched from Map() to a standard object for easier React state management
        return {
            food_info: {}, 
            notes: ''
        };
    }
}

let sleepInstance = null;
let foodInstance = null; // Fixed: previously was undefined 'foodService'

export async function getSleepService() {
    if (!sleepInstance) {
        sleepInstance = await Sleep.create();
    }
    return sleepInstance;
}

export async function getFoodService() {
    if (!foodInstance) {
        foodInstance = await Food.create();
    }
    return foodInstance;
}