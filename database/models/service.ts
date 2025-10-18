import { getDB } from "../utils/db";
import { unauthorizedMessage, UnauthorizedMessageType } from "../utils/message";
import { getActiveSession } from "./auth";

export type Service = {
  id: number;
  merchant_id: number;
  name: string;
  unit: string | null;
  created_at?: string;
};

export type ServicePayload = {
  merchant_id: number;
  name: string;
  unit: string;
};

type PaginationResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export const addService = async (
  service: ServicePayload
): Promise<Service | UnauthorizedMessageType> => {
  const session = await getActiveSession();
  if (!session) return unauthorizedMessage;

  const db = await getDB();

  const result = await db.runAsync(
    `INSERT INTO service (merchant_id, name, unit) 
     VALUES (?, ?, ?)`,
    [service.merchant_id, service.name, service.unit]
  );

  // result.lastInsertRowId contains the new id
  return {
    id: result.lastInsertRowId,
    ...service,
  } as Service;
};

export const getServices = async (
  page = 1,
  pageSize = 10
): Promise<PaginationResult<Service> | UnauthorizedMessageType> => {
  const session = await getActiveSession();
  if (!session) return unauthorizedMessage;

  const db = await getDB();
  const offset = (page - 1) * pageSize;

  const data = await db.getAllAsync<Service>(
    `SELECT * FROM service ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [pageSize, offset]
  );

  const totalRow = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM service`
  );

  return {
    data,
    total: totalRow?.count ?? 0,
    page,
    pageSize,
  };
};

export const getServiceById = async (id: number): Promise<Service | UnauthorizedMessageType | null> => {
  const session = await getActiveSession();
  if (!session) return unauthorizedMessage;

  const db = await getDB();
  return await db.getFirstAsync<Service>(
    `SELECT * FROM service WHERE id = ?`,
    [id]
  );
};

export const updateService = async (
  id: number,
  updates: Partial<ServicePayload>
): Promise<boolean | UnauthorizedMessageType> => {
  const session = await getActiveSession();
  if (!session) return unauthorizedMessage;

  const db = await getDB();

  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(updates);

  await db.runAsync(
    `UPDATE service SET ${fields} WHERE id = ?`,
    [...values, id]
  );

  return true;
};

export const deleteService = async (id: number): Promise<void | UnauthorizedMessageType> => {
  const session = await getActiveSession();
  if (!session) return unauthorizedMessage;

  const db = await getDB();
  await db.runAsync(`DELETE FROM service WHERE id = ?`, [id]);
};

export const filterServices = async (
  keyword: string,
  page = 1,
  pageSize = 10
): Promise<PaginationResult<Service> | UnauthorizedMessageType> => {
  const session = await getActiveSession();
  if (!session) return unauthorizedMessage;

  const db = await getDB();
  const param = `%${keyword}%`;
  const offset = (page - 1) * pageSize;

  const data = await db.getAllAsync<Service>(
    `
      SELECT * FROM service
      WHERE name LIKE ? 
         OR unit LIKE ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `,
    [param, param, pageSize, offset]
  );

  const totalRow = await db.getFirstAsync<{ count: number }>(
    `
      SELECT COUNT(*) as count
      FROM service
      WHERE name LIKE ? 
         OR unit LIKE ?
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

export async function runServiceTests() {
  console.log("=== SERVICE MODULE TEST START ===");

  try {
    // 1️⃣ Add new service
    const newService = await addService({
      merchant_id: 1,
      name: "Test Cleaning Service",
      unit: "hour",
    }) as Service;
    console.log("✅ Added Service:", newService);

    const id = newService.id;

    // 2️⃣ Get all services (pagination)
    const allServices = await getServices(1, 5);
    console.log("✅ All Services (page 1):", allServices);

    // 3️⃣ Get service by ID
    const fetchedService = await getServiceById(id);
    console.log("✅ Fetched Service by ID:", fetchedService);

    // 4️⃣ Update service
    const updated = await updateService(id, {
      name: "Updated Cleaning Service",
      unit: "session",
    });
    console.log("✅ Updated Service:", updated);

    // 5️⃣ Filter services by keyword
    const filtered = await filterServices("Cleaning", 1, 5);
    console.log("✅ Filtered Services:", filtered);

    // 6️⃣ Delete service
    await deleteService(id);
    console.log("✅ Deleted Service ID:", id);

    // 7️⃣ Confirm deletion
    const afterDelete = await getServiceById(id);
    console.log("✅ After Deletion (should be null):", afterDelete);

    console.log("=== ALL TESTS COMPLETED SUCCESSFULLY ===");
  } catch (error) {
    console.error("❌ Error during tests:", error);
  }
}

