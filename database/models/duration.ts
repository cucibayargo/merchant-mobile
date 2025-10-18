import { getDB } from "../utils/db";
import { unauthorizedMessage, UnauthorizedMessageType } from "../utils/message";
import { getActiveSession } from "./auth";

export type Duration = {
  id: number;
  duration?: number | null;
  merchant_id?: string | null;
  created_at: string;
  name?: string | null;
  type?: string | null;
};

export type DurationPayload = {
  duration: number;
  merchant_id: string;
  name: string;
  type: string;
};

type PaginationResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

// Add duration
export const addDuration = async (payload: DurationPayload) => {
  const session = await getActiveSession();
  if (!session) return unauthorizedMessage;

  const db = await getDB();
  await db.runAsync(
    `INSERT INTO duration (duration, merchant_id, name, type) 
     VALUES (?, ?, ?, ?)`,
    [
      payload.duration,
      payload.merchant_id,
      payload.name,
      payload.type
    ]
  );

  return payload;
};

// Get all durations with pagination
export const getDurations = async (
  page = 1,
  pageSize = 10
): Promise<PaginationResult<Duration> | UnauthorizedMessageType> => {
  const session = await getActiveSession();
  if (!session) return unauthorizedMessage;

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
export const getDurationById = async (id: number): Promise<Duration | UnauthorizedMessageType | null> => {
  const session = await getActiveSession();
  if (!session) return unauthorizedMessage;

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
): Promise<UnauthorizedMessageType | boolean> => {
  const session = await getActiveSession();
  if (!session) return unauthorizedMessage;

  const db = await getDB();

  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(updates);

  await db.runAsync(
    `UPDATE duration SET ${fields} WHERE id = ?`,
    [...values, id]
  );

  return true
};

// Delete duration
export const deleteDuration = async (id: number): Promise<void | UnauthorizedMessageType> => {
  const session = await getActiveSession();
  if (!session) return unauthorizedMessage;

  const db = await getDB();
  await db.runAsync("DELETE FROM duration WHERE id = ?", [id]);
};

// Filter duration by name or type with pagination
export const filterDurations = async (
  keyword: string,
  page = 1,
  pageSize = 10
): Promise<PaginationResult<Duration> | UnauthorizedMessageType> => {
  const session = await getActiveSession();
  if (!session) return unauthorizedMessage;

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
