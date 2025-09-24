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

// Get all customers
export const getCustomers = async (): Promise<Customer[]> => {
  const db = getDB();
  return await db.getAllAsync<Customer>(
    "SELECT * FROM customer ORDER BY created_at DESC"
  );
};

// Get a single customer by ID
export const getCustomerById = async (id: string): Promise<Customer | null> => {
  const db = getDB();
  return await db.getFirstAsync<Customer>(
    "SELECT * FROM customer WHERE id = ?",
    [id]
  );
};

// Update customer
export const updateCustomer = async (
  id: string,
  updates: Partial<CustomerPayload>
): Promise<Customer | null> => {
  const db = getDB();

  // Build dynamic SQL query for fields to update
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

// Delete customer
export const deleteCustomer = async (id: string): Promise<void> => {
  const db = getDB();
  await db.runAsync("DELETE FROM customer WHERE id = ?", [id]);
};

// Filter customers by name, phone number, or email
export const filterCustomers = async (keyword: string): Promise<Customer[]> => {
  const db = getDB();

  const query = `
    SELECT * FROM customer
    WHERE name LIKE ? 
       OR phone_number LIKE ? 
       OR email LIKE ?
    ORDER BY created_at DESC
  `;

  const param = `%${keyword}%`;

  return await db.getAllAsync<Customer>(query, [param, param, param]);
};
