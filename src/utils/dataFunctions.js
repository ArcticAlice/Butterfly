import Database from '@tauri-apps/plugin-sql';
import { formatDateForDB } from './helperFunctions'

export class Sleep {
    constructor(db) {
        this.db = db;
    }

    static async create() {
        const db = await Database.load('sqlite:butterflyTemp.db');
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

    async updateSleepField(date, sleepData) {
        try {
            await this.db.execute(
                `UPDATE sleep_records 
                SET sleep_start_time = $1,
                    sleep_end_time = $2,
                    rem_sleep_duration = $3,
                    deep_sleep_duration = $4,
                    light_sleep_duration = $5,
                    awake_duration = $6,
                    sleep_quality_rating = $7,
                    notes = $8
                WHERE date = $9`,
                [
                    sleepData.sleep_start_time,
                    sleepData.sleep_end_time,
                    sleepData.rem_sleep_duration,
                    sleepData.deep_sleep_duration,
                    sleepData.light_sleep_duration,
                    sleepData.awake_duration,
                    sleepData.sleep_quality_rating,
                    sleepData.notes,
                    date
                ]
            );

            console.log("Updated Data");
        } catch (error) {
            console.error("Failed To Update Data", error);
            throw error;
        }
    }

    async deleteSleepRecord(date) {
        try {
            const dateString = formatDateForDB(date);

            await this.db.execute(
                'DELETE FROM sleep_records WHERE date = $1',
                [dateString]
            );

            console.log(`Sleep record deleted for ${dateString}`);
        } catch (error) {
            console.error('Failed to delete sleep record:', error);
            throw error;
        }
    }

    async saveSleepRecord(date, sleepData) {
        try {
            const dateString = formatDateForDB(date);
            const exists = await this.getSleepRecord(dateString);

            if (exists) {
                await this.updateSleepField(date, sleepData)
            } else {
                await this.db.execute(
                    `INSERT INTO sleep_records (
                    date, sleep_start_time, sleep_end_time,
                    rem_sleep_duration, deep_sleep_duration,
                    light_sleep_duration, awake_duration,
                    sleep_quality_rating, notes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [
                        dateString,
                        sleepData.sleep_start_time,
                        sleepData.sleep_end_time,
                        sleepData.rem_sleep_duration,
                        sleepData.deep_sleep_duration,
                        sleepData.light_sleep_duration,
                        sleepData.awake_duration,
                        sleepData.sleep_quality_rating,
                        sleepData.notes
                    ]
                );
            }
            console.log(`Sleep record saved for ${dateString}`);
        } catch (error) {
            console.error('Failed to save sleep record:', error);
            throw error;
        }

    }

    getDefaultSleepRecord() {
        return {
            sleep_start_time: '',
            sleep_end_time: '',
            rem_sleep_duration: 0,
            deep_sleep_duration: 0,
            light_sleep_duration: 0,
            awake_duration: 0,
            sleep_quality_rating: '',
            notes: ''
        };
    }
}