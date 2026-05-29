import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { hashPassword, verifyPassword } from "@/lib/password";

const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const codeDigits = 6;
const periodSeconds = 30;

export function generateTotpSecret() {
  const bytes = randomBytes(20);
  let bits = "";
  let output = "";

  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, "0");
  }

  for (let index = 0; index < bits.length; index += 5) {
    const chunk = bits.slice(index, index + 5).padEnd(5, "0");
    output += base32Alphabet[Number.parseInt(chunk, 2)];
  }

  return output;
}

function decodeBase32(value: string) {
  const clean = value.replace(/=+$/g, "").replace(/\s+/g, "").toUpperCase();
  let bits = "";
  const bytes: number[] = [];

  for (const char of clean) {
    const index = base32Alphabet.indexOf(char);

    if (index === -1) {
      throw new Error("InvalidBase32Secret");
    }

    bits += index.toString(2).padStart(5, "0");
  }

  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  }

  return Buffer.from(bytes);
}

function generateCode(secret: string, counter: number) {
  const key = decodeBase32(secret);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));

  const digest = createHmac("sha1", key).update(buffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return String(binary % 10 ** codeDigits).padStart(codeDigits, "0");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyTotpCode(secret: string, code: string) {
  const normalized = code.replace(/\s+/g, "");

  if (!/^\d{6}$/.test(normalized)) {
    return false;
  }

  const counter = Math.floor(Date.now() / 1000 / periodSeconds);

  return [-1, 0, 1].some((window) => safeEqual(generateCode(secret, counter + window), normalized));
}

export function createOtpAuthUri({
  email,
  secret,
  issuer = "Gyokurinken CMS"
}: {
  email: string;
  secret: string;
  issuer?: string;
}) {
  const label = `${issuer}:${email}`;
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: "SHA1",
    digits: codeDigits.toString(),
    period: periodSeconds.toString()
  });

  return `otpauth://totp/${encodeURIComponent(label)}?${params.toString()}`;
}

export function generateBackupCodes() {
  return Array.from({ length: 8 }, () => randomBytes(4).toString("hex").toUpperCase().match(/.{1,4}/g)?.join("-") ?? "");
}

export function hashBackupCodes(codes: string[]) {
  return codes.map((code) => hashPassword(normalizeBackupCode(code)));
}

export function normalizeBackupCode(code: string) {
  return code.replace(/[^a-z0-9]/gi, "").toUpperCase();
}

export function consumeBackupCode(code: string, hashedCodes: string[]) {
  const normalized = normalizeBackupCode(code);
  const index = hashedCodes.findIndex((stored) => verifyPassword(normalized, stored));

  if (index === -1) {
    return null;
  }

  return hashedCodes.filter((_value, itemIndex) => itemIndex !== index);
}
