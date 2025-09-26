import { randomUUID } from "expo-crypto";
import { getDB } from "../utils/db";

export type Duration = {
  id: string;
  duration?: number | null;
  merchant_id?: string | null;
  created_at: string;
  name?: string | null;
  type?: string | null;
};

export type DurationPayload = {
  duration?: number | null;
  merchant_id?: string | null;
  name?: string | null;
  type?: string | null;
};

// Add duration
export const addDuration = async (payload: DurationPayload) => {
  const db = getDB();
  const id = randomUUID();
  const created_at = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO duration (id, duration, merchant_id, name, type, created_at) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      payload.duration ?? null,
      payload.merchant_id ?? null,
      payload.name ?? null,
      payload.type ?? null,
      created_at,
    ]
  );

  return { ...payload, id, created_at };
};

// Get all durations
export const getDurations = async (): Promise<Duration[]> => {
  const db = getDB();
  return await db.getAllAsync<Duration>(
    "SELECT * FROM duration ORDER BY created_at DESC"
  );
};

// Get single duration by ID
export const getDurationById = async (id: string): Promise<Duration | null> => {
  const db = getDB();
  return await db.getFirstAsync<Duration>(
    "SELECT * FROM duration WHERE id = ?",
    [id]
  );
};

// Update duration
export const updateDuration = async (
  id: string,
  updates: Partial<DurationPayload>
): Promise<Duration | null> => {
  const db = getDB();

  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(updates);

  if (fields.length === 0) return getDurationById(id);

  await db.runAsync(
    `UPDATE duration SET ${fields} WHERE id = ?`,
    [...values, id]
  );

  return await getDurationById(id);
};

// Delete duration
export const deleteDuration = async (id: string): Promise<void> => {
  const db = getDB();
  await db.runAsync("DELETE FROM duration WHERE id = ?", [id]);
};

// Filter duration by name or type
export const filterDurations = async (keyword: string): Promise<Duration[]> => {
  const db = getDB();
  const param = `%${keyword}%`;

  const query = `
    SELECT * FROM duration
    WHERE name LIKE ?
       OR type LIKE ?
    ORDER BY created_at DESC
  `;

  return await db.getAllAsync<Duration>(query, [param, param]);
};
