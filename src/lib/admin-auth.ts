import { redirect } from "next/navigation";
import type { AdminRole } from "@prisma/client";
import { auth } from "@/auth";
import { hasPermission, type AdminPermission } from "@/lib/admin-permissions";

const contentRoles = new Set<AdminRole>(["super_admin", "admin", "editor"]);

export async function requireAdmin(allowedRoles?: AdminRole[]) {
  const session = await auth();
  const role = session?.user?.role;
  const expiresAt = session?.adminSessionExpiresAt;

  if (!session?.user || !role || (expiresAt && expiresAt <= Math.floor(Date.now() / 1000))) {
    redirect("/admin/login?callbackUrl=/admin");
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    redirect("/admin?error=forbidden");
  }

  return session;
}

export async function requireContentEditor() {
  const session = await requireAdmin();

  if (!contentRoles.has(session.user.role)) {
    redirect("/admin?error=forbidden");
  }

  return session;
}

export async function requirePermission(permission: AdminPermission) {
  const session = await requireAdmin();

  if (!hasPermission(session.user.role, permission)) {
    redirect("/admin?error=forbidden");
  }

  return session;
}
