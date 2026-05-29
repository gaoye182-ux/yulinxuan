"use server";

import type { AdminRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { hasPermission } from "@/lib/admin-permissions";
import { writeAuditLog } from "@/lib/audit-log";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { generateBackupCodes, generateTotpSecret, hashBackupCodes, verifyTotpCode } from "@/lib/totp";

const roleSchema = z.enum(["viewer", "editor", "admin", "super_admin"]);

const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().trim().email().max(255),
  name: z.string().trim().max(100).optional(),
  role: roleSchema,
  isActive: z.boolean(),
  password: z.string().optional()
});

function canAssignRole(actorRole: AdminRole, targetRole: AdminRole) {
  if (actorRole === "super_admin") {
    return true;
  }

  return actorRole === "admin" && ["viewer", "editor"].includes(targetRole);
}

async function requireUserWriter() {
  const session = await requireAdmin(["super_admin", "admin"]);

  if (!hasPermission(session.user.role, "users.write")) {
    throw new Error("Forbidden");
  }

  return session;
}

function usersRedirect(params: Record<string, string>): never {
  redirect(`/admin/users?${new URLSearchParams(params).toString()}`);
}

function parseUserForm(formData: FormData) {
  return userSchema.parse({
    id: String(formData.get("id") ?? "") || undefined,
    email: formData.get("email"),
    name: String(formData.get("name") ?? ""),
    role: formData.get("role"),
    isActive: formData.get("isActive") === "on",
    password: String(formData.get("password") ?? "")
  });
}

export async function saveAdminUserAction(formData: FormData) {
  const session = await requireUserWriter();
  const values = parseUserForm(formData);
  const actorRole = session.user.role;

  if (!canAssignRole(actorRole, values.role)) {
    usersRedirect({ error: "CannotAssignRole" });
  }

  const existing = values.id
    ? await prisma.adminUser.findUnique({ where: { id: BigInt(values.id) } })
    : await prisma.adminUser.findUnique({ where: { email: values.email.toLowerCase() } });

  if (!values.id && (!values.password || values.password.length < 12)) {
    usersRedirect({ error: "PasswordTooShort" });
  }

  if (existing && !canAssignRole(actorRole, existing.role)) {
    usersRedirect({ error: "CannotEditRole" });
  }

  if (existing?.id.toString() === session.user.id && !values.isActive) {
    usersRedirect({ error: "CannotDisableSelf" });
  }

  const data = {
    email: values.email.toLowerCase(),
    name: values.name || null,
    role: values.role,
    isActive: values.isActive,
    failedLoginCount: values.isActive ? 0 : existing?.failedLoginCount ?? 0,
    lockedUntil: values.isActive ? null : existing?.lockedUntil ?? null,
    ...(values.password
      ? {
          passwordHash: hashPassword(values.password),
          failedLoginCount: 0,
          lockedUntil: null,
          lastFailedLoginAt: null
        }
      : {})
  };

  const saved = existing
    ? await prisma.adminUser.update({ where: { id: existing.id }, data })
    : await prisma.adminUser.create({ data: { ...data, passwordHash: hashPassword(values.password ?? "") } });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: existing ? "admin_user_updated" : "admin_user_created",
    targetType: "admin_user",
    targetId: saved.id.toString(),
    beforeData: existing,
    afterData: {
      id: saved.id,
      email: saved.email,
      role: saved.role,
      isActive: saved.isActive,
      passwordChanged: Boolean(values.password)
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  usersRedirect({ notice: existing ? "UserSaved" : "UserCreated" });
}

export async function toggleAdminUserActiveAction(formData: FormData) {
  const session = await requireUserWriter();
  const id = String(formData.get("id") ?? "");
  const user = await prisma.adminUser.findUnique({ where: { id: BigInt(id) } });

  if (!user) {
    usersRedirect({ error: "UserNotFound" });
  }

  if (user.id.toString() === session.user.id) {
    usersRedirect({ error: "CannotDisableSelf" });
  }

  if (!canAssignRole(session.user.role, user.role)) {
    usersRedirect({ error: "CannotEditRole" });
  }

  const saved = await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      isActive: !user.isActive,
      failedLoginCount: !user.isActive ? 0 : user.failedLoginCount,
      lockedUntil: !user.isActive ? null : user.lockedUntil,
      lastFailedLoginAt: !user.isActive ? null : user.lastFailedLoginAt
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: saved.isActive ? "admin_user_enabled" : "admin_user_disabled",
    targetType: "admin_user",
    targetId: saved.id.toString(),
    beforeData: user,
    afterData: { id: saved.id, email: saved.email, isActive: saved.isActive }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  usersRedirect({ notice: saved.isActive ? "UserEnabled" : "UserDisabled" });
}

export async function startTotpSetupAction(formData: FormData) {
  const session = await requireUserWriter();
  const id = String(formData.get("id") ?? "");
  const user = await prisma.adminUser.findUnique({ where: { id: BigInt(id) } });

  if (!user) {
    usersRedirect({ error: "UserNotFound" });
  }

  if (!canAssignRole(session.user.role, user.role)) {
    usersRedirect({ error: "CannotEditRole" });
  }

  const secret = generateTotpSecret();
  const updated = await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      totpSecret: secret,
      totpEnabled: false,
      totpVerifiedAt: null,
      totpBackupCodes: []
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "admin_user_totp_setup_started",
    targetType: "admin_user",
    targetId: updated.id.toString(),
    beforeData: { totpEnabled: user.totpEnabled },
    afterData: { totpEnabled: updated.totpEnabled, hasSecret: Boolean(updated.totpSecret) }
  });

  revalidatePath("/admin/users");
  usersRedirect({ setupTotp: updated.id.toString(), notice: "TotpSetupStarted" });
}

export async function enableTotpAction(formData: FormData) {
  const session = await requireUserWriter();
  const id = String(formData.get("id") ?? "");
  const code = String(formData.get("totpCode") ?? "");
  const user = await prisma.adminUser.findUnique({ where: { id: BigInt(id) } });

  if (!user) {
    usersRedirect({ error: "UserNotFound" });
  }

  if (!user.totpSecret) {
    usersRedirect({ error: "TotpNotStarted" });
  }

  if (!canAssignRole(session.user.role, user.role)) {
    usersRedirect({ error: "CannotEditRole" });
  }

  if (!verifyTotpCode(user.totpSecret, code)) {
    usersRedirect({ setupTotp: user.id.toString(), error: "TotpInvalid" });
  }

  const backupCodes = generateBackupCodes();
  const updated = await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      totpEnabled: true,
      totpVerifiedAt: new Date(),
      totpBackupCodes: hashBackupCodes(backupCodes)
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "admin_user_totp_enabled",
    targetType: "admin_user",
    targetId: updated.id.toString(),
    beforeData: { totpEnabled: user.totpEnabled },
    afterData: { totpEnabled: updated.totpEnabled, backupCodeCount: backupCodes.length }
  });

  revalidatePath("/admin/users");
  usersRedirect({ backupCodes: backupCodes.join(","), notice: "TotpEnabled" });
}

export async function disableTotpAction(formData: FormData) {
  const session = await requireUserWriter();
  const id = String(formData.get("id") ?? "");
  const user = await prisma.adminUser.findUnique({ where: { id: BigInt(id) } });

  if (!user) {
    usersRedirect({ error: "UserNotFound" });
  }

  if (!canAssignRole(session.user.role, user.role)) {
    usersRedirect({ error: "CannotEditRole" });
  }

  const updated = await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      totpSecret: null,
      totpEnabled: false,
      totpVerifiedAt: null,
      totpBackupCodes: []
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "admin_user_totp_disabled",
    targetType: "admin_user",
    targetId: updated.id.toString(),
    beforeData: { totpEnabled: user.totpEnabled },
    afterData: { totpEnabled: updated.totpEnabled }
  });

  revalidatePath("/admin/users");
  usersRedirect({ notice: "TotpDisabled" });
}
