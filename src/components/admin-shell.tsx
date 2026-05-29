import Link from "next/link";
import { Archive, ClipboardCheck, FileText, FolderTree, History, Home, ImageIcon, KeyRound, LayoutDashboard, LogOut, Mail, Newspaper, PanelsTopLeft, PenTool, Search, Settings, ShieldCheck, UserRound } from "lucide-react";
import { auth } from "@/auth";
import { explainPermission, hasPermission, roleLabels, type AdminPermission } from "@/lib/admin-permissions";

const adminNav = [
  { href: "/admin", label: "总览", icon: LayoutDashboard, permission: "dashboard.read" },
  { href: "/admin/items", label: "藏品管理", icon: Archive, permission: "content.read" },
  { href: "/admin/categories", label: "分类管理", icon: FolderTree, permission: "content.read" },
  { href: "/admin/appraisals", label: "鉴定申请", icon: ClipboardCheck, permission: "content.read" },
  { href: "/admin/contacts", label: "联系留言", icon: Mail, permission: "content.read" },
  { href: "/admin/blog", label: "博客管理", icon: PenTool, permission: "content.read" },
  { href: "/admin/news", label: "资讯管理", icon: Newspaper, permission: "content.read" },
  { href: "/admin/pages", label: "页面模块", icon: PanelsTopLeft, permission: "content.read" },
  { href: "/admin/media", label: "媒体库", icon: ImageIcon, permission: "content.read" },
  { href: "/admin/seo", label: "SEO 管理", icon: Search, permission: "settings.read" },
  { href: "/admin/security", label: "登录安全", icon: KeyRound, permission: "dashboard.read" },
  { href: "/admin/settings", label: "站点设置", icon: Settings, permission: "settings.read" },
  { href: "/admin/users", label: "管理员", icon: ShieldCheck, permission: "users.read" },
  { href: "/admin/audit-logs", label: "审计日志", icon: History, permission: "audit.read" }
];

type AdminShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: {
    href: string;
    label: string;
  };
  children: React.ReactNode;
};

export async function AdminShell({ eyebrow = "GYOKURINKEN CMS", title, description, action, children }: AdminShellProps) {
  const session = await auth();
  const isViewer = session?.user?.role === "viewer";
  const role = session?.user?.role;

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[color:var(--ink)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <Link href="/admin" className="min-w-0">
            <p className="text-xs tracking-[0.28em] text-[color:var(--gold)]">{eyebrow}</p>
            <p className="mt-1 font-serif text-2xl font-light">玉林軒 管理后台</p>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/ja"
              className="inline-flex min-h-11 items-center gap-2 border border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
            >
              <Home aria-hidden size={15} />
              前台
            </Link>
            {session?.user ? (
              <>
                <div className="inline-flex min-h-11 items-center gap-2 border border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)]">
                  <UserRound aria-hidden size={15} className="text-[color:var(--gold-dark)]" />
                  <span className="max-w-[180px] truncate">{session.user.name ?? session.user.email}</span>
                  <span className="text-[color:var(--gold-dark)]">{roleLabels[session.user.role]}</span>
                </div>
                <Link
                  href="/api/auth/signout?callbackUrl=/admin/login"
                  className="inline-flex min-h-11 items-center gap-2 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)] transition hover:bg-[color:var(--gold)] hover:text-white"
                >
                  <LogOut aria-hidden size={15} />
                  退出
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <aside className="self-start border border-[color:var(--border)] bg-[color:var(--paper)] p-3 lg:sticky lg:top-6">
          <nav className="grid gap-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const allowed = hasPermission(role, item.permission as AdminPermission);
              const className = `flex min-h-11 items-center gap-3 px-3 text-sm transition ${
                allowed
                  ? "text-[color:var(--muted)] hover:bg-[color:var(--ivory)] hover:text-[color:var(--gold-dark)]"
                  : "cursor-not-allowed text-[color:var(--muted)] opacity-50"
              }`;

              return allowed ? (
                <Link
                  key={item.href}
                  href={item.href}
                  title={explainPermission(role, item.permission as AdminPermission)}
                  className={className}
                >
                  <Icon aria-hidden size={16} className="shrink-0 text-[color:var(--gold-dark)]" />
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.href}
                  title={explainPermission(role, item.permission as AdminPermission)}
                  className={className}
                >
                  <Icon aria-hidden size={16} className="shrink-0 text-[color:var(--gold-dark)]" />
                  <span className="min-w-0 flex-1">{item.label}</span>
                  <span className="text-[11px]">无权限</span>
                </span>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-[color:var(--border)] pt-4">
            <div className="flex items-start gap-3 px-3 text-xs leading-6 text-[color:var(--muted)]">
              <FileText aria-hidden size={16} className="mt-1 shrink-0 text-[color:var(--gold-dark)]" />
              <p>权限按 viewer / editor / admin / super_admin 控制页面与操作；登录安全页支持 TOTP、备用码和失败锁定审计。</p>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[color:var(--border)] pb-6">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.28em] text-[color:var(--gold)]">{eyebrow}</p>
              <h1 className="mt-3 break-words font-serif text-3xl font-light md:text-4xl">{title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">{description}</p>
            </div>
            {action && !isViewer ? (
              <Link
                href={action.href}
                className="inline-flex min-h-12 items-center justify-center border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
              >
                {action.label}
              </Link>
            ) : action && isViewer ? (
              <span className="inline-flex min-h-12 items-center justify-center border border-[color:var(--border)] px-5 text-sm tracking-[0.14em] text-[color:var(--muted)] opacity-70">
                Viewer 只读
              </span>
            ) : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
