import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { writeAuditLog } from "@/lib/audit-log";
import { consumeBackupCode, verifyTotpCode } from "@/lib/totp";
import { getLoginSecurityPolicy } from "@/lib/site-settings";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  totpCode: z.string().optional()
});

function getIpAddress(request: unknown) {
  const headers = (request as { headers?: Record<string, string | string[] | undefined> } | undefined)?.headers;
  const forwardedFor = headers?.["x-forwarded-for"];
  const realIp = headers?.["x-real-ip"];
  const raw = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;

  return (raw?.split(",")[0] ?? (Array.isArray(realIp) ? realIp[0] : realIp) ?? null)?.trim() || null;
}

async function recordFailedLogin(
  admin: { id: bigint; failedLoginCount: number },
  ipAddress: string | null,
  policy: { maxFailedLogins: number; lockMinutes: number },
  action = "login_failed"
) {
  const now = new Date();
  const failedLoginCount = admin.failedLoginCount + 1;
  const lockedUntil = failedLoginCount >= policy.maxFailedLogins ? new Date(now.getTime() + policy.lockMinutes * 60 * 1000) : null;

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      failedLoginCount,
      lastFailedLoginAt: now,
      lockedUntil
    }
  });

  await writeAuditLog({
    adminUserId: admin.id,
    action: lockedUntil ? "login_locked" : action,
    targetType: "admin_user",
    targetId: admin.id.toString(),
    afterData: { failedLoginCount, lockedUntil, maxFailedLogins: policy.maxFailedLogins, lockMinutes: policy.lockMinutes },
    ipAddress
  });

  return lockedUntil;
}

export const authOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24 * 30
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login"
  },
  providers: [
    Credentials({
      name: "Admin credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "Two-factor code", type: "text" }
      },
      async authorize(rawCredentials, request) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        const ipAddress = getIpAddress(request);
        const policy = await getLoginSecurityPolicy();

        if (!parsed.success) {
          await writeAuditLog({
            action: "login_failed",
            targetType: "admin_user",
            afterData: { reason: "invalid_credentials_payload" },
            ipAddress
          });
          return null;
        }

        const email = parsed.data.email.toLowerCase();
        const admin = await prisma.adminUser.findUnique({
          where: { email }
        });

        if (!admin) {
          await writeAuditLog({
            action: "login_failed",
            targetType: "admin_user",
            targetId: email,
            afterData: { reason: "unknown_email" },
            ipAddress
          });
          return null;
        }

        const now = new Date();

        if (admin.lockedUntil && admin.lockedUntil > now) {
          await writeAuditLog({
            adminUserId: admin.id,
            action: "login_failed_locked",
            targetType: "admin_user",
            targetId: admin.id.toString(),
            afterData: { lockedUntil: admin.lockedUntil, failedLoginCount: admin.failedLoginCount },
            ipAddress
          });
          throw new Error("AccountLocked");
        }

        if (!admin.isActive) {
          await writeAuditLog({
            adminUserId: admin.id,
            action: "login_failed",
            targetType: "admin_user",
            targetId: admin.id.toString(),
            afterData: { reason: "inactive_user" },
            ipAddress
          });
          return null;
        }

        if (!verifyPassword(parsed.data.password, admin.passwordHash)) {
          const lockedUntil = await recordFailedLogin(admin, ipAddress, policy);

          if (lockedUntil) {
            throw new Error("AccountLocked");
          }

          return null;
        }

        if (policy.requireTotpForAdmins && ["super_admin", "admin"].includes(admin.role) && !admin.totpEnabled) {
          await writeAuditLog({
            adminUserId: admin.id,
            action: "login_totp_policy_blocked",
            targetType: "admin_user",
            targetId: admin.id.toString(),
            afterData: { email: admin.email, role: admin.role, requireTotpForAdmins: true },
            ipAddress
          });
          throw new Error("TotpRequiredByPolicy");
        }

        if (admin.totpEnabled) {
          const totpCode = parsed.data.totpCode?.trim() ?? "";

          if (!totpCode) {
            await writeAuditLog({
              adminUserId: admin.id,
              action: "login_totp_required",
              targetType: "admin_user",
              targetId: admin.id.toString(),
              afterData: { email: admin.email, role: admin.role },
              ipAddress
            });
            throw new Error("TwoFactorRequired");
          }

          const isTotpValid = admin.totpSecret ? verifyTotpCode(admin.totpSecret, totpCode) : false;
          const remainingBackupCodes = !isTotpValid ? consumeBackupCode(totpCode, admin.totpBackupCodes) : null;

          if (!isTotpValid && !remainingBackupCodes) {
            const lockedUntil = await recordFailedLogin(admin, ipAddress, policy, "login_totp_failed");

            if (lockedUntil) {
              throw new Error("AccountLocked");
            }

            throw new Error("TwoFactorInvalid");
          }

          if (remainingBackupCodes) {
            await prisma.adminUser.update({
              where: { id: admin.id },
              data: { totpBackupCodes: remainingBackupCodes }
            });
          }
        }

        await prisma.adminUser.update({
          where: { id: admin.id },
          data: {
            lastLoginAt: now,
            failedLoginCount: 0,
            lastFailedLoginAt: null,
            lockedUntil: null
          }
        });

        await writeAuditLog({
          adminUserId: admin.id,
          action: "login_success",
          targetType: "admin_user",
          targetId: admin.id.toString(),
          afterData: { email: admin.email, role: admin.role },
          ipAddress
        });

        return {
          id: admin.id.toString(),
          email: admin.email,
          name: admin.name ?? admin.email,
          image: admin.avatar,
          role: admin.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const policy = await getLoginSecurityPolicy();
        const issuedAt = Math.floor(Date.now() / 1000);

        token.role = user.role;
        token.adminSessionIssuedAt = issuedAt;
        token.adminSessionMaxAgeHours = policy.sessionMaxAgeHours;
        token.adminSessionExpiresAt = issuedAt + policy.sessionMaxAgeHours * 60 * 60;
      } else if (token.adminSessionIssuedAt) {
        const policy = await getLoginSecurityPolicy();

        token.adminSessionMaxAgeHours = policy.sessionMaxAgeHours;
        token.adminSessionExpiresAt = token.adminSessionIssuedAt + policy.sessionMaxAgeHours * 60 * 60;
      }

      if (token.adminSessionExpiresAt && token.adminSessionExpiresAt <= Math.floor(Date.now() / 1000)) {
        delete token.role;
        delete token.adminSessionIssuedAt;
        delete token.adminSessionExpiresAt;
        delete token.adminSessionMaxAgeHours;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.role) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role;
      }

      if (token.adminSessionExpiresAt) {
        session.adminSessionExpiresAt = token.adminSessionExpiresAt;
        session.expires = new Date(token.adminSessionExpiresAt * 1000).toISOString();
      }

      return session;
    }
  }
} satisfies NextAuthOptions;

export function auth() {
  return getServerSession(authOptions);
}
