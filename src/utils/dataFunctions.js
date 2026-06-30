import Database from '@tauri-apps/plugin-sql';
import { formatDateForDB } from './helperFunctions';

// Ensures both Sleep and Food point to the exact same DB file defined in lib.rs
const DB_NAME = 'sqlite:butterfly.db';

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

class Vitals {
    constructor(db) {
        this.db = db;
    }

    static async create() {
        const db = await Database.load(DB_NAME);
        return new Vitals(db);
    }

    async getVitalsRecord(date) {
        const dateString = formatDateForDB(date);

        try {
            const result = await this.db.select(
                'SELECT * FROM vitals_record WHERE date = $1',
                [dateString]
            );

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('Failed to get vitals record:', error);
            throw error;
        }
    }

    async saveVitalsRecord(date, vitalsData) {
        try {
            const dateString = formatDateForDB(date);
            const exists = await this.getVitalsRecord(date);

            if (exists) {
                await this.db.execute(
                    `UPDATE vitals_record
                    SET blood_oxygen = $1,
                        resting_heart_rate = $2,
                        heart_rate_low = $3,
                        heart_rate_high = $4,
                        heart_rate_variability = $5,
                        breathing_rate = $6,
                        blood_pressure = $7,
                        body_fat_percentage = $8,
                        body_weight = $9,
                        oxygen_saturation = $10,
                        skin_temperature_variation = $11,
                        notes = $12
                    WHERE date = $13`,
                    [
                        vitalsData.blood_oxygen,
                        vitalsData.resting_heart_rate,
                        vitalsData.heart_rate_low,
                        vitalsData.heart_rate_high,
                        vitalsData.heart_rate_variability,
                        vitalsData.breathing_rate,
                        vitalsData.blood_pressure,
                        vitalsData.body_fat_percentage,
                        vitalsData.body_weight,
                        vitalsData.oxygen_saturation,
                        vitalsData.skin_temperature_variation,
                        vitalsData.notes,
                        dateString
                    ]
                );
            } else {
                await this.db.execute(
                    `INSERT INTO vitals_record (
                        date,
                        blood_oxygen,
                        resting_heart_rate,
                        heart_rate_low,
                        heart_rate_high,
                        heart_rate_variability,
                        breathing_rate,
                        blood_pressure,
                        body_fat_percentage,
                        body_weight,
                        oxygen_saturation,
                        skin_temperature_variation,
                        notes
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6,
                        $7, $8, $9, $10, $11,
                        $12, $13
                    )`,
                    [
                        dateString,
                        vitalsData.blood_oxygen,
                        vitalsData.resting_heart_rate,
                        vitalsData.heart_rate_low,
                        vitalsData.heart_rate_high,
                        vitalsData.heart_rate_variability,
                        vitalsData.breathing_rate,
                        vitalsData.blood_pressure,
                        vitalsData.body_fat_percentage,
                        vitalsData.body_weight,
                        vitalsData.oxygen_saturation,
                        vitalsData.skin_temperature_variation,
                        vitalsData.notes
                    ]
                );
            }
        } catch (error) {
            console.error('Failed to save vitals record:', error);
            throw error;
        }
    }

    getDefaultVitalsRecord() {
        return {
            blood_oxygen: '',
            resting_heart_rate: '',
            heart_rate_low: '',
            heart_rate_high: '',
            heart_rate_variability: '',
            breathing_rate: '',
            blood_pressure: '',
            body_fat_percentage: '',
            body_weight: '',
            oxygen_saturation: '',
            skin_temperature_variation: '',
            notes: '',
        };
    }
}

let sleepInstance = null;
let foodInstance = null;
let vitalsInstance = null;

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

export async function getVitalsService() {
    if (!vitalsInstance) {
        vitalsInstance = await Vitals.create();
    }
    return vitalsInstance;
}