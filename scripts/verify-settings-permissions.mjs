import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const envPath = resolve(process.cwd(), ".env");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);

    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^"|"$/g, "");
    }
  }
}

const baseUrl = (process.env.NEXTAUTH_URL ?? "http://127.0.0.1:3001").replace(/\/+$/g, "");
const databaseUrl = process.env.DATABASE_URL;
const password = "RoleTest-2026!";
const roles = ["super_admin", "admin", "editor", "viewer"];
const roleEmails = roles.map((role) => `${role}@gyokurinken.local`);

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

function hashPassword(value) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(value, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function mergeSetCookie(jar, response) {
  const raw = response.headers.get("set-cookie");

  if (!raw) {
    return jar;
  }

  for (const part of raw.split(/,(?=\s*[^;]+=)/g)) {
    const pair = part.split(";")[0].trim();
    const equals = pair.indexOf("=");

    if (equals > 0) {
      jar[pair.slice(0, equals)] = pair.slice(equals + 1);
    }
  }

  return jar;
}

function cookieHeader(jar) {
  return Object.entries(jar)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
}

async function login(email) {
  const jar = {};
  let response = await fetch(`${baseUrl}/api/auth/csrf`, {
    headers: { cookie: cookieHeader(jar) }
  });

  if (!response.ok) {
    throw new Error(`Cannot reach ${baseUrl}. Start the dev server first.`);
  }

  mergeSetCookie(jar, response);
  const { csrfToken } = await response.json();

  response = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      cookie: cookieHeader(jar)
    },
    body: new URLSearchParams({
      csrfToken,
      email,
      password,
      callbackUrl: `${baseUrl}/admin/settings`,
      json: "true"
    }),
    redirect: "manual"
  });
  mergeSetCookie(jar, response);

  const body = await response.text();

  if (!body.includes(`${baseUrl}/admin/settings`) && !response.headers.get("location")?.includes("/admin/settings")) {
    throw new Error(`${email} login failed: ${body}`);
  }

  return jar;
}

async function page(jar, path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { cookie: cookieHeader(jar) },
    redirect: "manual"
  });

  return {
    status: response.status,
    location: response.headers.get("location") ?? "",
    body: await response.text()
  };
}

async function sessionInfo(jar) {
  const response = await fetch(`${baseUrl}/api/auth/session`, {
    headers: { cookie: cookieHeader(jar) },
    redirect: "manual"
  });

  return response.json();
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl)
});

try {
  for (const role of roles) {
    await prisma.adminUser.upsert({
      where: { email: `${role}@gyokurinken.local` },
      create: {
        email: `${role}@gyokurinken.local`,
        name: `Role Test ${role}`,
        role,
        passwordHash: hashPassword(password),
        isActive: true
      },
      update: {
        name: `Role Test ${role}`,
        role,
        passwordHash: hashPassword(password),
        isActive: true,
        totpSecret: null,
        totpEnabled: false,
        totpVerifiedAt: null,
        totpBackupCodes: [],
        failedLoginCount: 0,
        lockedUntil: null,
        lastFailedLoginAt: null
      }
    });
  }
} finally {
  await prisma.$disconnect();
}

const unauthenticated = await page({}, "/admin/settings");
if (unauthenticated.status !== 307 || !unauthenticated.location.includes("/admin/login")) {
  throw new Error(`Unauthenticated settings access expected 307 to login, got ${unauthenticated.status} ${unauthenticated.location}`);
}

for (const role of roles) {
  const jar = await login(`${role}@gyokurinken.local`);
  const result = await page(jar, "/admin/settings");

  if (role === "super_admin") {
    if (result.status !== 200 || !result.body.includes("保存站点设置")) {
      throw new Error("super_admin should access settings with write controls.");
    }
    const session = await sessionInfo(jar);
    if (typeof session.adminSessionExpiresAt !== "number" || !session.expires) {
      throw new Error("super_admin session should expose DB-driven adminSessionExpiresAt.");
    }
    console.log("super_admin: /admin/settings 200, writable controls visible");
  } else if (role === "admin") {
    if (result.status !== 200 || !result.body.includes("当前角色可查看站点设置")) {
      throw new Error("admin should access settings read-only.");
    }
    console.log("admin: /admin/settings 200, read-only notice visible");
  } else {
    if (result.status !== 307 || !result.location.includes("/admin?error=forbidden")) {
      throw new Error(`${role} should be redirected from settings, got ${result.status} ${result.location}`);
    }
    console.log(`${role}: /admin/settings redirected to forbidden`);
  }
}

const cleanupPrisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl)
});

try {
  await cleanupPrisma.adminUser.deleteMany({
    where: { email: { in: roleEmails } }
  });
} finally {
  await cleanupPrisma.$disconnect();
}

console.log("Settings permission verification passed.");
