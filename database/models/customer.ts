import { randomUUID } from "expo-crypto";
import { getDB } from "../utils/db";

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

export const addCustomer = async (customer: CustomerPayload) => {
  const db = getDB();
  const id = randomUUID();
  const created_at = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO customer (id, merchant_id, name, address, phone_number, email, gender, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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

export const getCustomers = async (): Promise<Customer[]> => {
  const db = getDB();
  return await db.getAllAsync<Customer>("SELECT * FROM customer ORDER BY created_at DESC");
};