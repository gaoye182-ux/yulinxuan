import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Globe2, Save, Search } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { requirePermission } from "@/lib/admin-auth";
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
  const canWrite = session.user.role === "super_admin";
  const params = await searchParams;
  const settings = await getSiteSettings();

  return (
    <AdminShell title="SEO 管理" description="集中维护全站默认 Meta、OGP、canonical、多语言索引策略、robots.txt、sitemap.xml 与部署前重定向清单。">
      {params?.notice === "SeoSaved" ? (
        <p className="mt-8 border border-[color:var(--gold)] bg-[rgba(176,141,87,0.08)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">SEO 配置已保存。</p>
      ) : null}

      <form action={saveSeoSettingsAction} className="mt-8 grid gap-6">
        <section className="grid gap-5 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <div className="flex items-center gap-3">
            <Search aria-hidden size={18} className="text-[color:var(--gold-dark)]" />
            <h2 className="font-serif text-2xl font-light">Meta / OGP / Canonical</h2>
          </div>
          <LocalizedFields label="默认 Meta Title" name="seo.defaultTitle" value={settings.seo.defaultTitle} disabled={!canWrite} />
          <LocalizedFields label="默认 Meta Description" name="seo.defaultDescription" value={settings.seo.defaultDescription} multiline disabled={!canWrite} />
          <LocalizedFields label="默认 Keywords" name="seo.defaultKeywords" value={settings.seo.defaultKeywords} disabled={!canWrite} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="OGP 默认图片 URL" name="seo.ogImage" defaultValue={settings.seo.ogImage} disabled={!canWrite} />
            <Field label="Canonical Base URL" name="seo.canonicalBaseUrl" defaultValue={settings.seo.canonicalBaseUrl} disabled={!canWrite} />
          </div>
          <Toggle label="Canonical URL 使用尾斜杠" name="seo.canonicalTrailingSlash" defaultChecked={settings.seo.canonicalTrailingSlash} disabled={!canWrite} />
        </section>

        <section className="grid gap-5 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <div className="flex items-center gap-3">
            <Globe2 aria-hidden size={18} className="text-[color:var(--gold-dark)]" />
            <h2 className="font-serif text-2xl font-light">Index / Robots / Sitemap</h2>
          </div>
          <TextArea label="Noindex 路径（一行一个，支持 /path/*）" name="seo.noindexPaths" defaultValue={settings.seo.noindexPaths} rows={5} disabled={!canWrite} />
          <TextArea label="重定向清单（from => to，一行一个，部署时转入 next.config 或边缘规则）" name="seo.redirectRules" defaultValue={settings.seo.redirectRules} rows={5} disabled={!canWrite} />
          <div className="grid gap-3 md:grid-cols-2">
            <Toggle label="启用 robots.txt" name="robots.enabled" defaultChecked={settings.robots.enabled} disabled={!canWrite} />
            <Toggle label="robots 默认禁止 /admin" name="robots.disallowAdmin" defaultChecked={settings.robots.disallowAdmin} disabled={!canWrite} />
          </div>
          <TextArea label="robots.txt 内容" name="robots.rules" defaultValue={settings.robots.rules} rows={7} disabled={!canWrite} />
          <div className="grid gap-3 md:grid-cols-4">
            <Toggle label="启用 sitemap.xml" name="sitemap.enabled" defaultChecked={settings.sitemap.enabled} disabled={!canWrite} />
            <Toggle label="包含博客" name="sitemap.includeBlog" defaultChecked={settings.sitemap.includeBlog} disabled={!canWrite} />
            <Toggle label="包含资讯" name="sitemap.includeNews" defaultChecked={settings.sitemap.includeNews} disabled={!canWrite} />
            <Toggle label="包含藏品" name="sitemap.includeItems" defaultChecked={settings.sitemap.includeItems} disabled={!canWrite} />
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          {canWrite ? (
            <button className="inline-flex min-h-12 items-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white">
              <Save aria-hidden size={16} />
              保存 SEO 配置
            </button>
          ) : (
            <p className="border border-[color:var(--border)] px-4 py-3 text-sm text-[color:var(--muted)]">只有 super_admin 可修改 SEO 系统配置。</p>
          )}
          <Link href="/sitemap.xml" className="inline-flex min-h-12 items-center border border-[color:var(--border)] px-5 text-sm text-[color:var(--gold-dark)]">查看 sitemap.xml</Link>
          <Link href="/robots.txt" className="inline-flex min-h-12 items-center border border-[color:var(--border)] px-5 text-sm text-[color:var(--gold-dark)]">查看 robots.txt</Link>
        </div>
      </form>
    </AdminShell>
  );
}
