import type { AdminRole } from "@prisma/client";
import type { AdminLocale } from "@/lib/admin-i18n";

export type AdminPermission =
  | "dashboard.read"
  | "content.read"
  | "content.write"
  | "users.read"
  | "users.write"
  | "audit.read"
  | "settings.read"
  | "settings.write";

export const roleLabels: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer"
};

export const permissionLabels: Record<AdminPermission, string> = {
  "dashboard.read": "查看后台总览",
  "content.read": "查看内容",
  "content.write": "新增/编辑内容",
  "users.read": "查看管理员",
  "users.write": "新增/编辑/禁用管理员",
  "audit.read": "查看审计日志",
  "settings.read": "查看站点设置",
  "settings.write": "系统设置"
};

const permissionLabelTranslations: Record<AdminPermission, Record<AdminLocale, string>> = {
  "dashboard.read": { ja: "管理画面を表示", zh: "查看后台总览", en: "View dashboard" },
  "content.read": { ja: "コンテンツを表示", zh: "查看内容", en: "View content" },
  "content.write": { ja: "コンテンツを追加・編集", zh: "新增/编辑内容", en: "Create/edit content" },
  "users.read": { ja: "管理者を表示", zh: "查看管理员", en: "View admins" },
  "users.write": { ja: "管理者を追加・編集・停止", zh: "新增/编辑/禁用管理员", en: "Create/edit/disable admins" },
  "audit.read": { ja: "監査ログを表示", zh: "查看审计日志", en: "View audit logs" },
  "settings.read": { ja: "サイト設定を表示", zh: "查看站点设置", en: "View site settings" },
  "settings.write": { ja: "システム設定を変更", zh: "系统设置", en: "Change system settings" }
};

export const rolePermissions: Record<AdminRole, AdminPermission[]> = {
  super_admin: ["dashboard.read", "content.read", "content.write", "users.read", "users.write", "audit.read", "settings.read", "settings.write"],
  admin: ["dashboard.read", "content.read", "content.write", "users.read", "audit.read", "settings.read"],
  editor: ["dashboard.read", "content.read", "content.write"],
  viewer: ["dashboard.read", "content.read"]
};

export function hasPermission(role: AdminRole | undefined, permission: AdminPermission) {
  return role ? rolePermissions[role].includes(permission) : false;
}

export function permissionLabel(permission: AdminPermission, locale: AdminLocale = "zh") {
  return permissionLabelTranslations[permission][locale];
}

export function explainPermission(role: AdminRole | undefined, permission: AdminPermission, locale: AdminLocale = "zh") {
  const roleName = role ? roleLabels[role] : locale === "ja" ? "現在の権限" : locale === "en" ? "Current role" : "当前角色";
  const permissionName = permissionLabel(permission, locale);

  if (hasPermission(role, permission)) {
    if (locale === "ja") {
      return `${roleName} は実行できます：${permissionName}`;
    }
    if (locale === "en") {
      return `${roleName} can perform: ${permissionName}`;
    }
    return `${roleName} 可执行：${permissionName}`;
  }

  if (locale === "ja") {
    return `現在の権限では実行できません：${permissionName}`;
  }
  if (locale === "en") {
    return `Current role cannot perform: ${permissionName}`;
  }
  return `当前角色无权执行：${permissionName}`;
}
