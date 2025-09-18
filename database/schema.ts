// database/schema.ts
import * as SQLite from "expo-sqlite";

export const getDB = () => {
  return SQLite.openDatabaseSync("cucibayargo.db");
};

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
};
