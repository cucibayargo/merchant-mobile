import * as SQLite from "expo-sqlite";

export const getDB = () => SQLite.openDatabaseSync("app.db");
