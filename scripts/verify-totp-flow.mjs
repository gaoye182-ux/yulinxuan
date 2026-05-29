import { createHmac, randomBytes, scryptSync } from "node:crypto";
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

const baseUrl = (process.env.NEXTAUTH_URL ?? "http://127.0.0.1:3000").replace(/\/+$/g, "");
const databaseUrl = process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL ?? "admin@gyokurinken.local";
const password = process.env.ADMIN_PASSWORD ?? "ChangeMe-2026!";
const testSecret = "JBSWY3DPEHPK3PXP";
const backupCode = "ABCD-1234";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

function hashPassword(value) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(value, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function normalizeBackupCode(value) {
  return value.replace(/[^a-z0-9]/gi, "").toUpperCase();
}

function decodeBase32(value) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  const bytes = [];

  for (const char of value.replace(/=+$/g, "").toUpperCase()) {
    const index = alphabet.indexOf(char);

    if (index < 0) {
      throw new Error("Invalid base32 secret.");
    }

    bits += index.toString(2).padStart(5, "0");
  }

  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  }

  return Buffer.from(bytes);
}

function totpCode(secret) {
  const counter = Math.floor(Date.now() / 1000 / 30);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));

  const digest = createHmac("sha1", decodeBase32(secret)).update(buffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return String(binary % 1_000_000).padStart(6, "0");
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

async function login(totpCodeValue = "") {
  const jar = {};
  let response = await fetch(`${baseUrl}/api/auth/csrf`, {
    headers: { cookie: cookieHeader(jar) }
  });

  if (!response.ok) {
    throw new Error(`Cannot reach ${baseUrl}. Start the dev server first.`);
  }

  mergeSetCookie(jar, response);
  const { csrfToken } = await response.json();
  const body = new URLSearchParams({
    csrfToken,
    email,
    password,
    totpCode: totpCodeValue,
    callbackUrl: `${baseUrl}/admin`,
    json: "true"
  });

  response = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      cookie: cookieHeader(jar)
    },
    body,
    redirect: "manual"
  });
  mergeSetCookie(jar, response);

  return {
    body: await response.text(),
    jar
  };
}

async function pageStatus(jar, path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { cookie: cookieHeader(jar) },
    redirect: "manual"
  });

  return response.status;
}

function expectBody(name, body, expected) {
  if (!body.includes(expected)) {
    throw new Error(`${name} expected ${expected}, got ${body}`);
  }
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl)
});

const original = await prisma.adminUser.findUnique({
  where: { email },
  select: {
    totpSecret: true,
    totpEnabled: true,
    totpVerifiedAt: true,
    totpBackupCodes: true,
    failedLoginCount: true,
    lastFailedLoginAt: true,
    lockedUntil: true
  }
});

if (!original) {
  throw new Error(`Admin user not found: ${email}`);
}

try {
  await prisma.adminUser.update({
    where: { email },
    data: {
      totpSecret: testSecret,
      totpEnabled: true,
      totpVerifiedAt: new Date(),
      totpBackupCodes: [hashPassword(normalizeBackupCode(backupCode))],
      failedLoginCount: 0,
      lastFailedLoginAt: null,
      lockedUntil: null
    }
  });

  const noCode = await login();
  expectBody("missing TOTP", noCode.body, "TwoFactorRequired");

  const badCode = await login("000000");
  expectBody("invalid TOTP", badCode.body, "TwoFactorInvalid");

  const validTotp = await login(totpCode(testSecret));
  if ((await pageStatus(validTotp.jar, "/admin")) !== 200) {
    throw new Error("valid TOTP did not create an admin session.");
  }

  await prisma.adminUser.update({
    where: { email },
    data: { totpBackupCodes: [hashPassword(normalizeBackupCode(backupCode))] }
  });

  const validBackup = await login(backupCode);
  if ((await pageStatus(validBackup.jar, "/admin")) !== 200) {
    throw new Error("backup code did not create an admin session.");
  }

  const reusedBackup = await login(backupCode);
  expectBody("reused backup code", reusedBackup.body, "TwoFactorInvalid");

  console.log("TOTP flow verified: missing code, invalid code, valid TOTP, backup consumption, and backup reuse failure.");
} finally {
  await prisma.adminUser.update({
    where: { email },
    data: original
  });
  await prisma.$disconnect();
}
