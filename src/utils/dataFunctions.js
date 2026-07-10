import Database from '@tauri-apps/plugin-sql';
import { formatDateForDB } from './helperFunctions';

// Ensures both Sleep and Food point to the exact same DB file defined in lib.rs
const DB_NAME = 'sqlite:butterfly.db';

class Service {
    constructor(db) {
        this.db = db;
    }
    static async create() {
        const db = await Database.load(DB_NAME);
        const instance = new Service(db);
        // await instance.databaseShift();
        return instance;
    }

    // async databaseShift() {
    //     try {
    //         const result = await this.db.select(
    //             `SELECT * FROM sleep_records`
    //         );
    //         if (result.length > 0) {
    //             for (let i = 0; i < result.length; i++) {
    //                 const entry = result[i];
    //                 const data = {
    //                     sleep_start_time: entry.sleep_start_time || '',
    //                     sleep_end_time: entry.sleep_end_time || '',
    //                     rem_sleep_duration: entry.rem_sleep_duration || 0,
    //                     deep_sleep_duration: entry.deep_sleep_duration || 0,
    //                     light_sleep_duration: entry.light_sleep_duration || 0,
    //                     awake_duration: entry.awake_duration || 0,
    //                     sleep_quality_rating: entry.sleep_quality_rating || '',
    //                     notes: entry.notes || ''
    //                 }
    //                 this.saveRecord(entry.date, data, "sleep_records_v2");
    //             }
    //         }
    //     }
    //     catch (error) {
    //         console.error("Failed to migrate sleep_records tables");
    //         throw error;
    //     } finally {
    //         console.log("Completed");
    //     }
    //     try {
    //         const result = await this.db.select(
    //             `SELECT * FROM food_records`
    //         );
    //         if (result.length > 0) {
    //             for (let i = 0; i < result.length; i++) {
    //                 const entry = result[i];
    //                 const data = {
    //                     food_list: typeof entry.food_info === 'string'
    //                         ? JSON.parse(entry.food_info)
    //                         : (entry.food_info || {}),
    //                     notes: entry.notes || '',
    //                 }
    //                 this.saveRecord(entry.date, data, "food_records_v2");
    //             }
    //         }
    //     }
    //     catch (error) {
    //         console.error("Failed to migrate food_records tables");
    //         throw error;
    //     } finally {
    //         console.log("Completed");
    //     }
    //     try {
    //         const result = await this.db.select(
    //             `SELECT * FROM vitals_record`
    //         );
    //         if (result.length > 0) {
    //             for (let i = 0; i < result.length; i++) {
    //                 const entry = result[i];
    //                 const data = {
    //                     blood_oxygen: entry.blood_oxygen || '',
    //                     resting_heart_rate: entry.resting_heart_rate || '',
    //                     heart_rate_low: entry.heart_rate_low || '',
    //                     heart_rate_high: entry.heart_rate_high || '',
    //                     heart_rate_variability: entry.heart_rate_variability || '',
    //                     breathing_rate: entry.breathing_rate || '',
    //                     blood_pressure: entry.blood_pressure || '',
    //                     body_fat_percentage: entry.body_fat_percentage || '',
    //                     body_weight: entry.body_weight || '',
    //                     oxygen_saturation: entry.oxygen_saturation || '',
    //                     skin_temperature_variation: entry.skin_temperature_variation || '',
    //                     notes: entry.notes || '',
    //                 }
    //                 this.saveRecord(entry.date, data, "vitals_records_v2");
    //             }
    //         }
    //     }
    //     catch (error) {
    //         console.error("Failed to migrate vitals_records tables");
    //         throw error;
    //     } finally {
    //         console.log("Completed");
    //     }

    // }

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
        serviceInstance = await Service.create();
    }
    return serviceInstance;
}