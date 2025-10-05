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

type PaginationResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

// Add duration
export const addDuration = async (payload: DurationPayload) => {
  const db = await getDB();
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

// Get all durations with pagination
export const getDurations = async (
  page = 1,
  pageSize = 10
): Promise<PaginationResult<Duration>> => {
  const db = await getDB();
  const offset = (page - 1) * pageSize;

  const data = await db.getAllAsync<Duration>(
    "SELECT * FROM duration ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [pageSize, offset]
  );

  const totalRow = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM duration"
  );

  return {
    data,
    total: totalRow?.count ?? 0,
    page,
    pageSize,
  };
};

// Get single duration by ID
export const getDurationById = async (id: string): Promise<Duration | null> => {
  const db = await getDB();
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
  const db = await getDB();

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
  const db = await getDB();
  await db.runAsync("DELETE FROM duration WHERE id = ?", [id]);
};

// Filter duration by name or type with pagination
export const filterDurations = async (
  keyword: string,
  page = 1,
  pageSize = 10
): Promise<PaginationResult<Duration>> => {
  const db = await getDB();
  const param = `%${keyword}%`;
  const offset = (page - 1) * pageSize;

  const data = await db.getAllAsync<Duration>(
    `
      SELECT * FROM duration
      WHERE name LIKE ?
         OR type LIKE ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `,
    [param, param, pageSize, offset]
  );

  const totalRow = await db.getFirstAsync<{ count: number }>(
    `
      SELECT COUNT(*) as count
      FROM duration
      WHERE name LIKE ?
         OR type LIKE ?
    `,
    [param, param]
  );

  return {
    data,
    total: totalRow?.count ?? 0,
    page,
    pageSize,
  };
};
