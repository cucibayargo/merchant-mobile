// database/schema.ts
import { getDB } from "./utils/db";

export const initDB = async () => {
  const db = await getDB();

  console.log("🧹 Resetting database schema...");

  // Drop tables in reverse dependency order (foreign keys last)
  await db.execAsync(`
    PRAGMA foreign_keys = OFF;

    DROP TABLE IF EXISTS session;
    DROP TABLE IF EXISTS user_mode;
    DROP TABLE IF EXISTS user;
    DROP TABLE IF EXISTS duration;
    DROP TABLE IF EXISTS customer;

    PRAGMA foreign_keys = ON;
  `);

  console.log("✅ Old tables dropped. Recreating schema...");

  // Recreate all tables
  await db.execAsync(`
    CREATE TABLE user (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone_number TEXT,
      created_at TEXT NOT NULL,
      mode TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE user_mode (
      user_id TEXT PRIMARY KEY,
      mode TEXT CHECK(mode IN ('offline', 'online')) NOT NULL,
      device_id TEXT,
      FOREIGN KEY (user_id) REFERENCES user(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE customer (
      id TEXT PRIMARY KEY NOT NULL,
      merchant_id TEXT,
      name TEXT,
      address TEXT,
      phone_number TEXT,
      email TEXT,
      gender TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await db.execAsync(`
    CREATE TABLE duration (
      id TEXT PRIMARY KEY NOT NULL,
      duration REAL,
      merchant_id TEXT,
      name TEXT,
      type TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await db.execAsync(`
    CREATE TABLE session (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      is_logged_in INTEGER DEFAULT 0,
      last_login TEXT,
      FOREIGN KEY (user_id) REFERENCES user(id)
    );
  `);

  console.log("🎉 Database initialized successfully!");
};
