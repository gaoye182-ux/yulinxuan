import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuditPayload = {
  adminUserId?: bigint | string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  beforeData?: unknown;
  afterData?: unknown;
  ipAddress?: string | null;
};

function toJsonValue(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined) {
    return undefined;
  }

  return JSON.parse(
    JSON.stringify(value, (_key, item) => (typeof item === "bigint" ? item.toString() : item))
  ) as Prisma.InputJsonValue;
}

export async function writeAuditLog({
  adminUserId,
  action,
  targetType,
  targetId,
  beforeData,
  afterData,
  ipAddress
}: AuditPayload) {
  try {
    const resolvedAdminUserId = adminUserId ? BigInt(adminUserId) : null;
    const adminUserExists = resolvedAdminUserId
      ? await prisma.adminUser.findUnique({ where: { id: resolvedAdminUserId }, select: { id: true } })
      : null;

    await prisma.auditLog.create({
      data: {
        adminUserId: adminUserExists ? resolvedAdminUserId : null,
        action,
        targetType,
        targetId,
        beforeData: toJsonValue(beforeData),
        afterData: toJsonValue(afterData),
        ipAddress
      }
    });
  } catch (error) {
    console.error("Failed to write audit log", error);
  }
}
