import { randomUUID } from "expo-crypto";
import { getDB } from "../utils/db";
import { getActiveSession } from "./auth";

export type Customer = {
  id: string;
  merchant_id: string;
  name: string | null;
  address?: string | null;
  phone_number?: string | null;
  email?: string | null;
  gender: string;
  created_at?: string;
};

export type CustomerPayload = {
  merchant_id: string;
  name: string | null;
  address?: string | null;
  phone_number?: string | null;
  email?: string | null;
  gender: string;
};

type PaginationResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export const addCustomer = async (customer: CustomerPayload) => {
  const session = await getActiveSession();
  if (!session) throw new Error("You must be logged in to add customers.");

  const db = await getDB();
  const id = randomUUID();
  const created_at = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO customer (id, merchant_id, name, address, phone_number, email, gender, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      customer.merchant_id,
      customer.name,
      customer.address ?? null,
      customer.phone_number ?? null,
      customer.email ?? null,
      customer.gender,
      created_at
    ]
  );

  return { ...customer, created_at, id };
};

export const getCustomers = async (
  page = 1,
  pageSize = 10
): Promise<PaginationResult<Customer>> => {
  const db = await getDB();
  const offset = (page - 1) * pageSize;

  const data = await db.getAllAsync<Customer>(
    "SELECT * FROM customer ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [pageSize, offset]
  );

  const totalRow = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM customer"
  );

  return {
    data,
    total: totalRow?.count ?? 0,
    page,
    pageSize,
  };
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  const db = await getDB();
  return await db.getFirstAsync<Customer>(
    "SELECT * FROM customer WHERE id = ?",
    [id]
  );
};

export const updateCustomer = async (
  id: string,
  updates: Partial<CustomerPayload>
): Promise<Customer | null> => {
  const db = await getDB();
  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(updates);
  if (fields.length === 0) return getCustomerById(id);
  await db.runAsync(
    `UPDATE customer SET ${fields} WHERE id = ?`,
    [...values, id]
  );
  return await getCustomerById(id);
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.runAsync("DELETE FROM customer WHERE id = ?", [id]);
};

export const filterCustomers = async (
  keyword: string,
  page = 1,
  pageSize = 10
): Promise<PaginationResult<Customer>> => {
  const db = await getDB();
  const param = `%${keyword}%`;
  const offset = (page - 1) * pageSize;

  const data = await db.getAllAsync<Customer>(
    `
      SELECT * FROM customer
      WHERE name LIKE ? 
         OR phone_number LIKE ? 
         OR email LIKE ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `,
    [param, param, param, pageSize, offset]
  );

  const totalRow = await db.getFirstAsync<{ count: number }>(
    `
      SELECT COUNT(*) as count
      FROM customer
      WHERE name LIKE ? 
         OR phone_number LIKE ? 
         OR email LIKE ?
    `,
    [param, param, param]
  );

  return {
    data,
    total: totalRow?.count ?? 0,
    page,
    pageSize,
  };
};
