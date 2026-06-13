import { type SQLiteDatabase } from "expo-sqlite";

const DATABASE_VERSION = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const row = await db.getFirstAsync<{ user_version: number }>(
        "PRAGMA user_version"
    );

    let currentDbVersion = row?.user_version ?? 0;

    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    };

    if (currentDbVersion === 0) {
        await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS snippets (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              code_content TEXT NOT NULL,
              language TEXT NOT NULL,
              tags TEXT,
              is_favorite INTEGER DEFAULT 0,
              screenshot_path TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS files (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              snippet_id INTEGER,
              file_name TEXT NOT NULL,
              file_path TEXT NOT NULL,
              file_type TEXT NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
            );
            
            CREATE TABLE IF NOT EXISTS ai_explanations (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              snippet_id INTEGER NOT NULL,
              explanation TEXT,
              summary TEXT,
              suggestions TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
            );
        `);
        currentDbVersion = 1;
    }


    await db.execAsync(`PRAGMA user_version = ${currentDbVersion}`);
}