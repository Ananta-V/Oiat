import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "oiai_admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "sweetadmin2026";
}

function getSecretKey(): string {
  const pwd = getAdminPassword();
  const extra = process.env.SUPABASE_SERVICE_ROLE_KEY || "oiai-admin-salt-key";
  return crypto.createHash("sha256").update(`${pwd}:${extra}`).digest("hex");
}

export function verifyAdminPassword(input: string): boolean {
  if (!input) return false;
  const expected = getAdminPassword();
  try {
    const a = Buffer.from(input);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return input === expected;
  }
}

export function createAdminSessionToken(): string {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac("sha256", getSecretKey()).update(timestamp).digest("hex");
  return `${timestamp}.${hmac}`;
}

export function isValidAdminSession(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestampStr, signature] = parts;
  const timestamp = Number(timestampStr);

  if (isNaN(timestamp) || Date.now() - timestamp > SESSION_DURATION_MS || timestamp > Date.now() + 60000) {
    return false;
  }

  const expectedHmac = crypto.createHmac("sha256", getSecretKey()).update(timestampStr).digest("hex");
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expectedHmac);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return signature === expectedHmac;
  }
}

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return isValidAdminSession(token);
}

