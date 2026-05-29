import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const envPath = resolve(process.cwd(), ".env");

if (existsSync(envPath)) {
  const envText = readFileSync(envPath, "utf8");

  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);

    if (!match || process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = match[2].replace(/^"|"$/g, "");
  }
}

const email = process.env.ADMIN_EMAIL ?? "admin@gyokurinken.local";
const password = process.env.ADMIN_PASSWORD ?? "ChangeMe-2026!";
const name = process.env.ADMIN_NAME ?? "Gyokurinken Admin";
const role = process.env.ADMIN_ROLE ?? "super_admin";
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the default admin user.");
}

function hashPassword(value) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(value, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl)
});

await prisma.adminUser.upsert({
  where: { email },
  create: {
    email,
    passwordHash: hashPassword(password),
    name,
    role,
    isActive: true
  },
  update: {
    name,
    role,
    isActive: true
  }
});

await prisma.$disconnect();

console.log(`Seeded admin user: ${email}`);
