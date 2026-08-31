import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "./db";

const COOKIE_NAME = "session";
const RAW_SECRET = process.env.AUTH_SECRET;

if (!RAW_SECRET) {
  throw new Error("AUTH_SECRET environment variable is not set");
}

const SECRET: string = RAW_SECRET;

function sign(userId: string) {
  const sig = crypto.createHmac("sha256", SECRET).update(userId).digest("hex");
  return `${userId}.${sig}`;
}

function verify(value: string): string | null {
  const idx = value.lastIndexOf(".");
  if (idx === -1) return null;
  const userId = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(userId).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return userId;
}

export async function setSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, sign(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const userId = verify(raw);
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("You need to be logged in to do that.");
  return user;
}
