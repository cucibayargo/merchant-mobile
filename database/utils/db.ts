import * as SQLite from "expo-sqlite";

export const getDB = () => SQLite.openDatabaseAsync("app.db");
