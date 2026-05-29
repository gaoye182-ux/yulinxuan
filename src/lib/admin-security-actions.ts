"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { prisma } from "@/lib/prisma";
import { consumeBackupCode, generateBackupCodes, generateTotpSecret, hashBackupCodes, verifyTotpCode } from "@/lib/totp";

function securityRedirect(params: Record<string, string>): never {
  redirect(`/admin/security?${new URLSearchParams(params).toString()}`);
}

async function getCurrentAdmin() {
  const session = await requireAdmin();
  const user = await prisma.adminUser.findUnique({ where: { id: BigInt(session.user.id) } });

  if (!user) {
    redirect("/admin/login?error=SessionRequired");
  }

  return { session, user };
}

export async function startOwnTotpSetupAction() {
  const { session, user } = await getCurrentAdmin();
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
    beforeData: { selfService: true, totpEnabled: user.totpEnabled },
    afterData: { selfService: true, totpEnabled: updated.totpEnabled, hasSecret: Boolean(updated.totpSecret) }
  });

  revalidatePath("/admin/security");
  securityRedirect({ notice: "TotpSetupStarted" });
}

export async function enableOwnTotpAction(formData: FormData) {
  const { session, user } = await getCurrentAdmin();
  const code = String(formData.get("totpCode") ?? "");

  if (!user.totpSecret) {
    securityRedirect({ error: "TotpNotStarted" });
  }

  const secret = user.totpSecret;

  if (!verifyTotpCode(secret, code)) {
    await writeAuditLog({
      adminUserId: session.user.id,
      action: "admin_user_totp_enable_failed",
      targetType: "admin_user",
      targetId: user.id.toString(),
      afterData: { selfService: true }
    });
    securityRedirect({ error: "TotpInvalid" });
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
    beforeData: { selfService: true, totpEnabled: user.totpEnabled },
    afterData: { selfService: true, totpEnabled: updated.totpEnabled, backupCodeCount: backupCodes.length }
  });

  revalidatePath("/admin/security");
  securityRedirect({ backupCodes: backupCodes.join(","), notice: "TotpEnabled" });
}

export async function regenerateOwnBackupCodesAction(formData: FormData) {
  const { session, user } = await getCurrentAdmin();
  const code = String(formData.get("totpCode") ?? "");

  if (!user.totpEnabled || !user.totpSecret) {
    securityRedirect({ error: "TotpNotStarted" });
  }

  const secret = user.totpSecret;

  if (!verifyTotpCode(secret, code)) {
    securityRedirect({ error: "TotpInvalid" });
  }

  const backupCodes = generateBackupCodes();
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { totpBackupCodes: hashBackupCodes(backupCodes) }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "admin_user_totp_backup_regenerated",
    targetType: "admin_user",
    targetId: user.id.toString(),
    afterData: { selfService: true, backupCodeCount: backupCodes.length }
  });

  revalidatePath("/admin/security");
  securityRedirect({ backupCodes: backupCodes.join(","), notice: "BackupCodesRegenerated" });
}

export async function disableOwnTotpAction(formData: FormData) {
  const { session, user } = await getCurrentAdmin();
  const code = String(formData.get("totpCode") ?? "");

  if (!user.totpEnabled || !user.totpSecret) {
    securityRedirect({ error: "TotpNotStarted" });
  }

  const secret = user.totpSecret;
  const remainingBackupCodes = verifyTotpCode(secret, code) ? user.totpBackupCodes : consumeBackupCode(code, user.totpBackupCodes);

  if (!remainingBackupCodes) {
    await writeAuditLog({
      adminUserId: session.user.id,
      action: "admin_user_totp_disable_failed",
      targetType: "admin_user",
      targetId: user.id.toString(),
      afterData: { selfService: true }
    });
    securityRedirect({ error: "TotpInvalid" });
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
    beforeData: { selfService: true, totpEnabled: user.totpEnabled },
    afterData: { selfService: true, totpEnabled: updated.totpEnabled }
  });

  revalidatePath("/admin/security");
  securityRedirect({ notice: "TotpDisabled" });
}
