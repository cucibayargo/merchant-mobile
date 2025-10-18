// database/schema.ts
import { getDB } from "./utils/db";

export const initDB = async () => {
  const db = await getDB();

  // Check if database already initialized
  const tables = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='user';"
  );

  if (tables.length > 0) {
    console.log("✅ Database schema already initialized. Skipping reset...");
    return;
  }

  console.log("🧹 Resetting and initializing database schema...");

  await db.execAsync(`
    PRAGMA foreign_keys = OFF;

    DROP TABLE IF EXISTS session;
    DROP TABLE IF EXISTS user_mode;
    DROP TABLE IF EXISTS user;
    DROP TABLE IF EXISTS duration;
    DROP TABLE IF EXISTS customer;
    DROP TABLE IF EXISTS service;

    PRAGMA foreign_keys = ON;
  `);

  await db.execAsync(`
    CREATE TABLE user (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone_number TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      mode TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE user_mode (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      mode TEXT CHECK(mode IN ('offline', 'online')) NOT NULL,
      device_id TEXT,
      FOREIGN KEY (user_id) REFERENCES user(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE customer (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      merchant_id INTEGER,
      name TEXT,
      address TEXT,
      phone_number TEXT,
      email TEXT,
      gender TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (merchant_id) REFERENCES user(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE duration (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      duration REAL,
      merchant_id INTEGER,
      name TEXT,
      type TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (merchant_id) REFERENCES user(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE session (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      user_id INTEGER NOT NULL,
      is_logged_in INTEGER DEFAULT 0,
      last_login TEXT,
      FOREIGN KEY (user_id) REFERENCES user(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE service (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      merchant_id INTEGER,
      name TEXT,
      FOREIGN KEY (merchant_id) REFERENCES user(id)
    );
  `);

  console.log("🎉 Database initialized successfully!");
};
