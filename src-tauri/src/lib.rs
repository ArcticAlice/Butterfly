use tauri_plugin_sql::{Migration, MigrationKind};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_sleep_records_table",
            sql: "CREATE TABLE IF NOT EXISTS sleep_records (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             date TEXT NOT NULL UNIQUE,
             sleep_start_time TEXT,
             sleep_end_time TEXT,
             rem_sleep_duration INTEGER,
             deep_sleep_duration INTEGER,
             light_sleep_duration INTEGER,
             awake_duration INTEGER,
             sleep_quality_rating TEXT,
             notes TEXT
         );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_food_records_table",
            sql: "CREATE TABLE IF NOT EXISTS food_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL UNIQUE,
            food_info TEXT,
            notes TEXT
        );
        CREATE TABLE IF NOT EXISTS unique_foods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            food_name TEXT,
            food_calories
        );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_vitals_record_table",
            sql: "CREATE TABLE IF NOT EXISTS vitals_record (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL UNIQUE,
            blood_oxygen TEXT,
            resting_heart_rate TEXT,
            heart_rate_low TEXT,
            heart_rate_high TEXT,
            heart_rate_variability TEXT,
            breathing_rate TEXT,
            blood_pressure TEXT,
            body_fat_percentage TEXT,
            body_weight TEXT,
            oxygen_saturation TEXT,
            skin_temperature_variation TEXT,
            notes TEXT
        );",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:butterflyTemp.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
