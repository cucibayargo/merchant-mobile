import * as Crypto from "expo-crypto";
import { randomUUID } from "expo-crypto";
import { getDB } from "../utils/db";

export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone_number?: string | null;
  created_at: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  phone_number?: string | null;
  mode: "offline" | "online";
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const signupOffline = async (payload: SignupPayload) => {
  console.log("Signing up user with payload:", payload);

  try { 
    const db = await getDB();

    const existingUser = await db.getFirstAsync<any>(
      `SELECT id FROM user WHERE LOWER(email) = LOWER(?)`,
      [payload.email]
    );

    if (existingUser) {
      console.warn("Email already registered:", payload.email);
      throw new Error("Email already registered. Please log in instead.");
    }

    const id = randomUUID();
    const created_at = new Date().toISOString();

    const passwordHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      payload.password
    );

    console.log("🔐 Password hash generated:", passwordHash);

    await db.runAsync(
      `INSERT INTO user (id, name, email, password, phone_number, created_at, mode)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, payload.name, payload.email, passwordHash, payload.phone_number ?? null, created_at, payload.mode]
    );

    console.log("✅ Signup successful for user ID:", id);

    return {
      success: true,
      message: "Signup successful",
      user: { id, ...payload, created_at },
    };
  } catch (error: any) {
    console.error("Signup failed:", error);

    if (error.message.includes("already registered")) {
      return { success: false, message: error.message };
    }

    if (error.message.includes("UNIQUE constraint failed")) {
      return { success: false, message: "Email already registered." };
    }

    return { success: false, message: "Signup failed. Please try again.", error: error.message };
  }
};

export const InsertMode = async (userId: string, mode: "offline" | "online") => {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO user_mode (user_id, mode, synced) VALUES (?, ?, ?)`,
    [userId, mode, 0]
  );
  return { userId, mode };
}

export const loginOffline = async (payload: LoginPayload) => {
  try {
    // Ensure DB is properly opened
    const db = await getDB();
    if (!db) {
      throw new Error("Database not initialized");
    }

    const passwordHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      payload.password
    );

    console.log("🔍 Checking user for email:", payload.email);

    console.log("db:", db);

    // Make sure query string and table exist
    const user = await db.getFirstAsync<any>(
      "SELECT * FROM user",
      [payload.email]
    );

    console.log("user query result:", user);
    

    if (!user) {
      console.warn("⚠️ User not found for email:", payload.email);
      throw new Error("User not found");
    }

    // Make sure to check correct column name in your DB
    if (user.password_hash !== passwordHash) {
      console.warn("⚠️ Invalid password for user:", payload.email);
      throw new Error("Invalid password");
    }

    const mode = await db.getFirstAsync<{ mode: string }>(
      "SELECT mode FROM user_mode WHERE user_id = ?",
      [user.id]
    );

    await createSession(user.id);

    console.log("✅ Login successful for:", user.email);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      mode: mode?.mode ?? "offline",
    };
  } catch (error: any) {
    console.error("❌ Login failed:", error?.message || error);
    throw new Error(error?.message || "Login failed due to an unexpected error");
  }
};



export const createSession = async (userId: string) => {
  const db = await getDB();

  await db.runAsync("DELETE FROM session");

  const id = randomUUID();
  const last_login = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO session (id, user_id, is_logged_in, last_login)
     VALUES (?, ?, ?, ?)`,
    [id, userId, 1, last_login]
  );
};

export const getActiveSession = async () => {
  const db = await getDB();
  const session = await db.getFirstAsync<any>(
    "SELECT * FROM session WHERE is_logged_in = 1"
  );

  if (!session) return null;

  const user = await db.getFirstAsync<any>(
    "SELECT * FROM user WHERE id = ?",
    [session.user_id]
  );

  return user ? { ...user, session_id: session.id } : null;
};

export const logout = async () => {
  const db = await getDB();
  await db.runAsync("DELETE FROM session");
};
