import type { AdminRole } from "@prisma/client";

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

export const rolePermissions: Record<AdminRole, AdminPermission[]> = {
  super_admin: ["dashboard.read", "content.read", "content.write", "users.read", "users.write", "audit.read", "settings.read", "settings.write"],
  admin: ["dashboard.read", "content.read", "content.write", "users.read", "audit.read", "settings.read"],
  editor: ["dashboard.read", "content.read", "content.write"],
  viewer: ["dashboard.read", "content.read"]
};

export function hasPermission(role: AdminRole | undefined, permission: AdminPermission) {
  return role ? rolePermissions[role].includes(permission) : false;
}

export function explainPermission(role: AdminRole | undefined, permission: AdminPermission) {
  if (hasPermission(role, permission)) {
    return `${role ? roleLabels[role] : "当前角色"} 可执行：${permissionLabels[permission]}`;
  }

  return `当前角色无权执行：${permissionLabels[permission]}`;
}
