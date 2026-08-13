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
            sql: "CREATE TABLE IF NOT EXISTS sleep_records_v2 (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Date TEXT NOT NULL UNIQUE,
            Info TEXT
         );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_food_records_table",
            sql: "CREATE TABLE IF NOT EXISTS food_records_v2 (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Date TEXT NOT NULL UNIQUE,
            Info TEXT
        );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_vitals_record_table",
            sql: "CREATE TABLE IF NOT EXISTS vitals_records_v2 (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Date TEXT NOT NULL UNIQUE,
            Info TEXT
        );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_journal_records_table",
            sql: "CREATE TABLE IF NOT EXISTS journal_records (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Date TEXT NOT NULL UNIQUE,
            Info TEXT
        );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "create_unique_foods_table",
            sql: "CREATE TABLE IF NOT EXISTS unique_foods (
            food_name TEXT PRIMARY KEY,
            food_calories INTEGER
        );",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:butterfly.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
