import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Globe2, Save, Search } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { requirePermission } from "@/lib/admin-auth";
import { adminText, type AdminText } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";
import { saveSeoSettingsAction } from "@/lib/seo-actions";
import { getSiteSettings } from "@/lib/site-settings";
import { languages } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "SEO 管理 | 玉林軒 CMS",
  description: "管理 Meta、OGP、canonical、noindex、robots、sitemap 和重定向配置。"
};

function LocalizedFields({ label, name, value, multiline, disabled }: { label: string; name: string; value: Record<string, string>; multiline?: boolean; disabled?: boolean }) {
  return (
    <div className="grid gap-3">
      <p className="text-sm text-[color:var(--gold-dark)]">{label}</p>
      <div className="grid gap-3 md:grid-cols-3">
        {languages.map((lang) => (
          <label key={lang} className="block min-w-0">
            <span className="text-xs uppercase text-[color:var(--muted)]">{lang}</span>
            {multiline ? (
              <textarea name={`${name}.${lang}`} defaultValue={value[lang] ?? ""} disabled={disabled} rows={4} className="mt-1 w-full resize-y border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 py-2 text-base leading-7 outline-none disabled:opacity-70" />
            ) : (
              <input name={`${name}.${lang}`} defaultValue={value[lang] ?? ""} disabled={disabled} className="mt-1 h-11 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-base outline-none disabled:opacity-70" />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function Field({ label, name, defaultValue, disabled }: { label: string; name: string; defaultValue: string; disabled?: boolean }) {
  return (
    <label className="block min-w-0">
      <span className="text-sm text-[color:var(--muted)]">{label}</span>
      <input name={name} defaultValue={defaultValue} disabled={disabled} className="mt-2 h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none disabled:opacity-70" />
    </label>
  );
}

function Toggle({ label, name, defaultChecked, disabled }: { label: string; name: string; defaultChecked: boolean; disabled?: boolean }) {
  return (
    <label className="flex min-h-12 items-center gap-3 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-sm">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} disabled={disabled} className="size-5 accent-[color:var(--gold)] disabled:opacity-70" />
      {label}
    </label>
  );
}

function TextArea({ label, name, defaultValue, rows = 5, disabled }: { label: string; name: string; defaultValue: string; rows?: number; disabled?: boolean }) {
  return (
    <label className="block min-w-0">
      <span className="text-sm text-[color:var(--muted)]">{label}</span>
      <textarea name={name} defaultValue={defaultValue} disabled={disabled} rows={rows} className="mt-2 w-full resize-y border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 py-3 text-base leading-7 outline-none disabled:opacity-70" />
    </label>
  );
}

export default async function AdminSeoPage({
  searchParams
}: {
  searchParams?: Promise<{ notice?: string }>;
}) {
  noStore();
  const session = await requirePermission("settings.read");
  const locale = await getAdminLocale();
  const t = (value: AdminText) => adminText(value, locale);
  const canWrite = session.user.role === "super_admin";
  const params = await searchParams;
  const settings = await getSiteSettings();

  return (
    <AdminShell title="SEO 管理" description="集中维护全站默认 Meta、OGP、canonical、多语言索引策略、robots.txt、sitemap.xml 与部署前重定向清单。">
      {params?.notice === "SeoSaved" ? (
        <p className="mt-8 border border-[color:var(--gold)] bg-[rgba(176,141,87,0.08)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">{t({ ja: "SEO 設定を保存しました。", zh: "SEO 配置已保存。", en: "SEO settings saved." })}</p>
      ) : null}

      <form action={saveSeoSettingsAction} className="mt-8 grid gap-6">
        <section className="grid gap-5 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <div className="flex items-center gap-3">
            <Search aria-hidden size={18} className="text-[color:var(--gold-dark)]" />
            <h2 className="font-serif text-2xl font-light">Meta / OGP / Canonical</h2>
          </div>
          <LocalizedFields label={t({ ja: "デフォルト Meta Title", zh: "默认 Meta Title", en: "Default Meta Title" })} name="seo.defaultTitle" value={settings.seo.defaultTitle} disabled={!canWrite} />
          <LocalizedFields label={t({ ja: "デフォルト Meta Description", zh: "默认 Meta Description", en: "Default Meta Description" })} name="seo.defaultDescription" value={settings.seo.defaultDescription} multiline disabled={!canWrite} />
          <LocalizedFields label={t({ ja: "デフォルト Keywords", zh: "默认 Keywords", en: "Default Keywords" })} name="seo.defaultKeywords" value={settings.seo.defaultKeywords} disabled={!canWrite} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t({ ja: "OGP デフォルト画像 URL", zh: "OGP 默认图片 URL", en: "Default OGP Image URL" })} name="seo.ogImage" defaultValue={settings.seo.ogImage} disabled={!canWrite} />
            <Field label="Canonical Base URL" name="seo.canonicalBaseUrl" defaultValue={settings.seo.canonicalBaseUrl} disabled={!canWrite} />
          </div>
          <Toggle label={t({ ja: "Canonical URL に末尾スラッシュを使用", zh: "Canonical URL 使用尾斜杠", en: "Use trailing slash for canonical URLs" })} name="seo.canonicalTrailingSlash" defaultChecked={settings.seo.canonicalTrailingSlash} disabled={!canWrite} />
        </section>

        <section className="grid gap-5 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <div className="flex items-center gap-3">
            <Globe2 aria-hidden size={18} className="text-[color:var(--gold-dark)]" />
            <h2 className="font-serif text-2xl font-light">Index / Robots / Sitemap</h2>
          </div>
          <TextArea label={t({ ja: "Noindex パス（1 行に 1 つ、/path/* 対応）", zh: "Noindex 路径（一行一个，支持 /path/*）", en: "Noindex paths (one per line, supports /path/*)" })} name="seo.noindexPaths" defaultValue={settings.seo.noindexPaths} rows={5} disabled={!canWrite} />
          <TextArea label={t({ ja: "リダイレクト一覧（from => to、1 行に 1 つ）", zh: "重定向清单（from => to，一行一个，部署时转入 next.config 或边缘规则）", en: "Redirect list (from => to, one per line)" })} name="seo.redirectRules" defaultValue={settings.seo.redirectRules} rows={5} disabled={!canWrite} />
          <div className="grid gap-3 md:grid-cols-2">
            <Toggle label={t({ ja: "robots.txt を有効化", zh: "启用 robots.txt", en: "Enable robots.txt" })} name="robots.enabled" defaultChecked={settings.robots.enabled} disabled={!canWrite} />
            <Toggle label={t({ ja: "robots で /admin を禁止", zh: "robots 默认禁止 /admin", en: "Disallow /admin in robots" })} name="robots.disallowAdmin" defaultChecked={settings.robots.disallowAdmin} disabled={!canWrite} />
          </div>
          <TextArea label={t({ ja: "robots.txt 内容", zh: "robots.txt 内容", en: "robots.txt content" })} name="robots.rules" defaultValue={settings.robots.rules} rows={7} disabled={!canWrite} />
          <div className="grid gap-3 md:grid-cols-4">
            <Toggle label={t({ ja: "sitemap.xml を有効化", zh: "启用 sitemap.xml", en: "Enable sitemap.xml" })} name="sitemap.enabled" defaultChecked={settings.sitemap.enabled} disabled={!canWrite} />
            <Toggle label={t({ ja: "ブログを含める", zh: "包含博客", en: "Include blog" })} name="sitemap.includeBlog" defaultChecked={settings.sitemap.includeBlog} disabled={!canWrite} />
            <Toggle label={t({ ja: "新着情報を含める", zh: "包含资讯", en: "Include news" })} name="sitemap.includeNews" defaultChecked={settings.sitemap.includeNews} disabled={!canWrite} />
            <Toggle label={t({ ja: "蔵品を含める", zh: "包含藏品", en: "Include items" })} name="sitemap.includeItems" defaultChecked={settings.sitemap.includeItems} disabled={!canWrite} />
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          {canWrite ? (
            <button className="inline-flex min-h-12 items-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white">
              <Save aria-hidden size={16} />
              {t({ ja: "SEO 設定を保存", zh: "保存 SEO 配置", en: "Save SEO Settings" })}
            </button>
          ) : (
            <p className="border border-[color:var(--border)] px-4 py-3 text-sm text-[color:var(--muted)]">{t({ ja: "SEO システム設定を変更できるのは super_admin のみです。", zh: "只有 super_admin 可修改 SEO 系统配置。", en: "Only super_admin can modify SEO system settings." })}</p>
          )}
          <Link href="/sitemap.xml" className="inline-flex min-h-12 items-center border border-[color:var(--border)] px-5 text-sm text-[color:var(--gold-dark)]">{t({ ja: "sitemap.xml を見る", zh: "查看 sitemap.xml", en: "View sitemap.xml" })}</Link>
          <Link href="/robots.txt" className="inline-flex min-h-12 items-center border border-[color:var(--border)] px-5 text-sm text-[color:var(--gold-dark)]">{t({ ja: "robots.txt を見る", zh: "查看 robots.txt", en: "View robots.txt" })}</Link>
        </div>
      </form>
    </AdminShell>
  );
}
