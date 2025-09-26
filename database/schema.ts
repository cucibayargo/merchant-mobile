// database/schema.ts
import { getDB } from "./utils/db";

export const initDB = async () => {
  const db = getDB();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS customer (
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
    CREATE TABLE IF NOT EXISTS duration (
      id TEXT PRIMARY KEY NOT NULL,
      duration REAL,
      merchant_id TEXT,
      name TEXT,
      type TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
};
