import Link from "next/link";
import {
  Archive,
  ClipboardCheck,
  FileText,
  FolderTree,
  History,
  Home,
  ImageIcon,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  PanelsTopLeft,
  PenTool,
  Search,
  Settings,
  ShieldCheck,
  UserRound
} from "lucide-react";
import { auth } from "@/auth";
import { AdminLanguageSwitcher } from "@/components/admin-language-switcher";
import { adminText, type AdminText } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";
import { explainPermission, hasPermission, roleLabels, type AdminPermission } from "@/lib/admin-permissions";

const adminNav = [
  { href: "/admin", label: { ja: "概要", zh: "总览", en: "Overview" }, icon: LayoutDashboard, permission: "dashboard.read" },
  { href: "/admin/items", label: { ja: "蔵品管理", zh: "藏品管理", en: "Collection" }, icon: Archive, permission: "content.read" },
  { href: "/admin/categories", label: { ja: "分類管理", zh: "分类管理", en: "Categories" }, icon: FolderTree, permission: "content.read" },
  { href: "/admin/appraisals", label: { ja: "鑑定依頼", zh: "鉴定申请", en: "Appraisals" }, icon: ClipboardCheck, permission: "content.read" },
  { href: "/admin/contacts", label: { ja: "お問い合わせ", zh: "联系留言", en: "Contacts" }, icon: Mail, permission: "content.read" },
  { href: "/admin/blog", label: { ja: "ブログ", zh: "博客管理", en: "Blog" }, icon: PenTool, permission: "content.read" },
  { href: "/admin/news", label: { ja: "新着情報", zh: "资讯管理", en: "News" }, icon: Newspaper, permission: "content.read" },
  { href: "/admin/pages", label: { ja: "ページ", zh: "页面模块", en: "Page Blocks" }, icon: PanelsTopLeft, permission: "content.read" },
  { href: "/admin/media", label: { ja: "メディア", zh: "媒体库", en: "Media" }, icon: ImageIcon, permission: "content.read" },
  { href: "/admin/seo", label: { ja: "SEO 管理", zh: "SEO 管理", en: "SEO" }, icon: Search, permission: "settings.read" },
  { href: "/admin/security", label: { ja: "ログイン安全", zh: "登录安全", en: "Login Security" }, icon: KeyRound, permission: "dashboard.read" },
  { href: "/admin/settings", label: { ja: "サイト設定", zh: "站点设置", en: "Site Settings" }, icon: Settings, permission: "settings.read" },
  { href: "/admin/users", label: { ja: "管理者", zh: "管理员", en: "Admins" }, icon: ShieldCheck, permission: "users.read" },
  { href: "/admin/audit-logs", label: { ja: "監査ログ", zh: "审计日志", en: "Audit Logs" }, icon: History, permission: "audit.read" }
];

type AdminShellProps = {
  eyebrow?: AdminText;
  title: AdminText;
  description: AdminText;
  action?: {
    href: string;
    label: AdminText;
  };
  children: React.ReactNode;
};

export async function AdminShell({ eyebrow = "GYOKURINKEN CMS", title, description, action, children }: AdminShellProps) {
  const locale = await getAdminLocale();
  const session = await auth();
  const isViewer = session?.user?.role === "viewer";
  const role = session?.user?.role;
  const frontendHref = locale === "zh" ? "/zh" : locale === "en" ? "/en" : "/ja";
  const t = (value: AdminText) => adminText(value, locale);
  const permissionNote = t({
    ja: "権限は viewer / editor / admin / super_admin ごとにページと操作を制御します。ログイン安全ページでは TOTP、バックアップコード、失敗ロック監査を管理できます。",
    zh: "权限按 viewer / editor / admin / super_admin 控制页面与操作；登录安全页支持 TOTP、备用码和失败锁定审计。",
    en: "Permissions are controlled by viewer / editor / admin / super_admin for pages and actions. Login Security supports TOTP, backup codes, and lockout audit."
  });
  const renderAdminNav = () =>
    adminNav.map((item) => {
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
          title={explainPermission(role, item.permission as AdminPermission, locale)}
          className={className}
        >
          <Icon aria-hidden size={16} className="shrink-0 text-[color:var(--gold-dark)]" />
          {t(item.label)}
        </Link>
      ) : (
        <span
          key={item.href}
          title={explainPermission(role, item.permission as AdminPermission, locale)}
          className={className}
        >
          <Icon aria-hidden size={16} className="shrink-0 text-[color:var(--gold-dark)]" />
          <span className="min-w-0 flex-1">{t(item.label)}</span>
          <span className="text-[11px]">{t({ ja: "権限なし", zh: "无权限", en: "No access" })}</span>
        </span>
      );
    });

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[color:var(--ink)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <Link href="/admin" className="min-w-0">
              <p className="text-xs tracking-[0.28em] text-[color:var(--gold)]">{t(eyebrow)}</p>
              <p className="mt-1 break-words font-serif text-2xl font-light">
                {t({ ja: "玉林軒 管理画面", zh: "玉林軒 管理后台", en: "Gyokurinken Admin" })}
              </p>
            </Link>
            <details className="relative shrink-0 lg:hidden">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)] [&::-webkit-details-marker]:hidden">
                <Menu aria-hidden size={16} />
                {t({ ja: "メニュー", zh: "菜单", en: "Menu" })}
              </summary>
              <div className="absolute right-0 z-50 mt-2 w-[min(82vw,320px)] border border-[color:var(--border)] bg-[color:var(--paper)] p-2 shadow-xl">
                <nav className="grid gap-1">{renderAdminNav()}</nav>
              </div>
            </details>
          </div>
          <div className="flex w-full flex-col items-stretch gap-2 justify-self-end lg:w-[380px]">
            <div className={`grid w-full gap-2 ${session?.user ? "grid-cols-3" : "grid-cols-2"}`}>
              <AdminLanguageSwitcher activeLocale={locale} className="min-w-0" selectClassName="w-full !min-w-0 text-xs sm:text-sm" />
              <Link
                href={frontendHref}
                className="inline-flex min-h-11 items-center justify-center gap-1 whitespace-nowrap border border-[color:var(--border)] px-1 text-xs text-[color:var(--muted)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)] sm:gap-2 sm:px-2 sm:text-sm"
              >
                <Home aria-hidden size={15} />
                {t({ ja: "サイト", zh: "前台", en: "Site" })}
              </Link>
              {session?.user ? (
                <Link
                  href="/api/auth/signout?callbackUrl=/admin/login"
                  className="inline-flex min-h-11 items-center justify-center gap-1 whitespace-nowrap border border-[color:var(--gold)] px-1 text-xs text-[color:var(--gold-dark)] transition hover:bg-[color:var(--gold)] hover:text-white sm:gap-2 sm:px-2 sm:text-sm"
                >
                  <LogOut aria-hidden size={15} />
                  {t({ ja: "ログアウト", zh: "退出", en: "Sign Out" })}
                </Link>
              ) : null}
            </div>
            {session?.user ? (
              <>
                <div className="flex min-h-11 w-full items-center gap-2 border border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)]">
                  <UserRound aria-hidden size={15} className="shrink-0 text-[color:var(--gold-dark)]" />
                  <span className="min-w-0 flex-1 truncate">{session.user.email ?? session.user.name}</span>
                  <span className="shrink-0 text-[color:var(--gold-dark)]">{roleLabels[session.user.role]}</span>
                </div>
                <div className="flex w-full items-start gap-3 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 py-3 text-xs leading-6 text-[color:var(--muted)]">
                  <FileText aria-hidden size={16} className="mt-1 shrink-0 text-[color:var(--gold-dark)]" />
                  <p>{permissionNote}</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden self-start border border-[color:var(--border)] bg-[color:var(--paper)] p-3 lg:sticky lg:top-6 lg:block">
          <nav className="grid gap-1">
            {renderAdminNav()}
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[color:var(--border)] pb-6">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.28em] text-[color:var(--gold)]">{t(eyebrow)}</p>
              <h1 className="mt-3 break-words font-serif text-3xl font-light md:text-4xl">{t(title)}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">{t(description)}</p>
            </div>
            {action && !isViewer ? (
              <Link
                href={action.href}
                className="inline-flex min-h-12 items-center justify-center border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
              >
                {t(action.label)}
              </Link>
            ) : action && isViewer ? (
              <span className="inline-flex min-h-12 items-center justify-center border border-[color:var(--border)] px-5 text-sm tracking-[0.14em] text-[color:var(--muted)] opacity-70">
                {t({ ja: "Viewer 読み取り専用", zh: "Viewer 只读", en: "Viewer read only" })}
              </span>
            ) : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
