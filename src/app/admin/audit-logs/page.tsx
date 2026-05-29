import Link from "next/link";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import type { Prisma } from "@prisma/client";
import { AdminShell } from "@/components/admin-shell";
import { requirePermission } from "@/lib/admin-auth";
import { adminText, type AdminText } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "审计日志 | 玉林軒 CMS",
  description: "筛选与分页查看玉林軒株式会社后台登录、权限与内容保存操作日志。"
};

const actionLabels: Record<string, string> = {
  login_success: "登录成功",
  login_failed: "登录失败",
  login_locked: "登录锁定",
  login_failed_locked: "锁定中登录",
  login_totp_required: "需要二步验证",
  login_totp_failed: "二步验证失败",
  login_totp_policy_blocked: "TOTP 策略阻止登录",
  blog_post_created: "新增博客",
  blog_post_updated: "保存博客",
  news_created: "新增资讯",
  news_updated: "保存资讯",
  admin_user_created: "新增管理员",
  admin_user_updated: "编辑管理员 / 重置密码",
  admin_user_enabled: "启用管理员",
  admin_user_disabled: "禁用管理员",
  admin_user_totp_setup_started: "生成 TOTP 密钥",
  admin_user_totp_enabled: "启用 TOTP",
  admin_user_totp_disabled: "关闭 TOTP",
  admin_user_totp_enable_failed: "启用 TOTP 失败",
  admin_user_totp_disable_failed: "关闭 TOTP 失败",
  admin_user_totp_backup_regenerated: "重置 TOTP 备用码",
  media_created: "新增媒体",
  media_uploaded: "上传媒体",
  media_replaced_keep_url: "替换媒体保持 URL",
  unused_media_cleaned: "清理未使用媒体",
  site_settings_updated: "保存站点设置",
  seo_settings_updated: "保存 SEO 配置",
  appraisal_request_updated: "更新鉴定申请",
  contact_message_updated: "更新联系留言",
  items_bulk_updated: "批量更新藏品",
  item_duplicated: "复制藏品"
};

const pageSize = 20;

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(value);
}

function pageHref(params: Record<string, string | undefined>, page: number) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      search.set(key, value);
    }
  }

  search.set("page", page.toString());
  return `/admin/audit-logs?${search.toString()}`;
}

export default async function AdminAuditLogsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  noStore();
  await requirePermission("audit.read");
  const locale = await getAdminLocale();
  const t = (value: AdminText) => adminText(value, locale);
  const params = (await searchParams) ?? {};
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const action = params.action?.trim();
  const targetType = params.targetType?.trim();
  const user = params.user?.trim();
  const from = params.from?.trim();
  const to = params.to?.trim();

  const where: Prisma.AuditLogWhereInput = {
    ...(action ? { action } : {}),
    ...(targetType ? { targetType } : {}),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: new Date(`${from}T00:00:00+09:00`) } : {}),
            ...(to ? { lte: new Date(`${to}T23:59:59+09:00`) } : {})
          }
        }
      : {}),
    ...(user
      ? {
          adminUser: {
            is: {
              OR: [
                { email: { contains: user, mode: "insensitive" } },
                { name: { contains: user, mode: "insensitive" } }
              ]
            }
          }
        }
      : {})
  };

  const [logs, total, actions, targetTypes] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { adminUser: { select: { email: true, name: true, role: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({ select: { action: true }, distinct: ["action"], orderBy: { action: "asc" } }),
    prisma.auditLog.findMany({ select: { targetType: true }, distinct: ["targetType"], orderBy: { targetType: "asc" } })
  ]);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminShell
      title="审计日志"
      description="按操作、对象、管理员和日期筛选后台登录、锁定、内容保存、用户管理事件；每页 20 条，便于上线前追踪权限行为。"
    >
      <form className="mt-8 grid gap-3 border border-[color:var(--border)] bg-[color:var(--paper)] p-5 lg:grid-cols-[180px_180px_minmax(0,1fr)_150px_150px_auto]">
        <select name="action" defaultValue={action ?? ""} className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
          <option value="">{t({ ja: "操作：すべて", zh: "操作：全部", en: "Action: all" })}</option>
          {actions.map((item) => (
            <option key={item.action} value={item.action}>{t(actionLabels[item.action] ?? item.action)}</option>
          ))}
        </select>
        <select name="targetType" defaultValue={targetType ?? ""} className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
          <option value="">{t({ ja: "対象：すべて", zh: "对象：全部", en: "Target: all" })}</option>
          {targetTypes.filter((item) => item.targetType).map((item) => (
            <option key={item.targetType ?? ""} value={item.targetType ?? ""}>{item.targetType}</option>
          ))}
        </select>
        <input name="user" defaultValue={user ?? ""} placeholder={t({ ja: "管理者名 / メール", zh: "管理员姓名 / 邮箱", en: "Admin name / email" })} className="h-12 min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none" />
        <input name="from" defaultValue={from ?? ""} type="date" className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none" />
        <input name="to" defaultValue={to ?? ""} type="date" className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none" />
        <button className="min-h-12 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white">
          {t("筛选")}
        </button>
      </form>

      <section className="mt-6 overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] p-5">
          <h2 className="font-serif text-2xl font-light">{t({ ja: "ログ記録", zh: "日志记录", en: "Log Records" })}</h2>
          <p className="text-sm text-[color:var(--muted)]">{t({ ja: `全 ${total} 件、${page} / ${pageCount} ページ`, zh: `共 ${total} 条，第 ${page} / ${pageCount} 页`, en: `${total} total, page ${page} / ${pageCount}` })}</p>
        </div>
        <div className="grid gap-0">
          {logs.length ? (
            logs.map((log) => (
              <article key={log.id.toString()} className="grid gap-4 border-b border-[color:var(--border)] p-5 last:border-b-0 lg:grid-cols-[180px_minmax(0,1fr)_170px_120px]">
                <div>
                  <p className="text-xs text-[color:var(--gold-dark)]">Time</p>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">{formatDate(log.createdAt)}</p>
                </div>
                <div className="min-w-0">
                  <p className="break-words font-serif text-2xl font-light">{t(actionLabels[log.action] ?? log.action)}</p>
                  <p className="mt-2 break-words text-sm text-[color:var(--muted)]">
                    {log.adminUser?.name ?? log.adminUser?.email ?? t({ ja: "システム / 不明ユーザー", zh: "系统/未知用户", en: "System / unknown user" })}
                    {log.targetType ? ` · ${log.targetType}` : ""}
                    {log.targetId ? ` #${log.targetId}` : ""}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[color:var(--gold-dark)]">IP</p>
                  <p className="mt-2 break-words text-sm text-[color:var(--muted)]">{log.ipAddress ?? t("未记录")}</p>
                </div>
                <div>
                  <p className="text-xs text-[color:var(--gold-dark)]">Role</p>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">{log.adminUser?.role ?? "-"}</p>
                </div>
              </article>
            ))
          ) : (
            <p className="p-6 text-sm text-[color:var(--muted)]">{t({ ja: "条件に一致する監査ログはありません。", zh: "暂无符合筛选条件的审计日志。", en: "No matching audit logs." })}</p>
          )}
        </div>
      </section>

      <nav className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={pageHref(params, Math.max(1, page - 1))}
          className={`min-h-11 border border-[color:var(--border)] px-4 py-3 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : "text-[color:var(--gold-dark)]"}`}
        >
          {t("上一页")}
        </Link>
        <Link
          href={pageHref(params, Math.min(pageCount, page + 1))}
          className={`min-h-11 border border-[color:var(--border)] px-4 py-3 text-sm ${page >= pageCount ? "pointer-events-none opacity-50" : "text-[color:var(--gold-dark)]"}`}
        >
          {t("下一页")}
        </Link>
      </nav>
    </AdminShell>
  );
}
