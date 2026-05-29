import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { Clock, Globe2, LockKeyhole, MapPinned, Search, Settings2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { requirePermission } from "@/lib/admin-auth";
import { hasPermission } from "@/lib/admin-permissions";
import { saveSiteSettingsAction } from "@/lib/admin-settings-actions";
import { getSiteSettings, type LocalizedText } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "站点设置 | 玉林軒 CMS",
  description: "配置玉林軒株式会社公司基础信息、联系方式、营业时间、地图、SEO、robots、sitemap 与登录安全策略。"
};

const noticeText: Record<string, string> = {
  SettingsSaved: "站点设置已保存，并写入审计日志。"
};

function Field({
  label,
  name,
  defaultValue,
  disabled,
  type = "text",
  placeholder
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  disabled: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm text-[color:var(--muted)]">
      <span className="text-xs tracking-[0.16em] text-[color:var(--gold-dark)]">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        placeholder={placeholder}
        className="h-12 min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base text-[color:var(--ink)] outline-none disabled:opacity-70"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  disabled,
  rows = 4
}: {
  label: string;
  name: string;
  defaultValue: string;
  disabled: boolean;
  rows?: number;
}) {
  return (
    <label className="grid gap-2 text-sm text-[color:var(--muted)]">
      <span className="text-xs tracking-[0.16em] text-[color:var(--gold-dark)]">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        rows={rows}
        className="min-h-28 min-w-0 resize-y border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 py-3 text-base leading-7 text-[color:var(--ink)] outline-none disabled:opacity-70"
      />
    </label>
  );
}

function LocalizedFields({
  label,
  name,
  value,
  disabled,
  multiline = false
}: {
  label: string;
  name: string;
  value: LocalizedText;
  disabled: boolean;
  multiline?: boolean;
}) {
  const items = [
    ["ja", "JA"],
    ["zh", "ZH"],
    ["en", "EN"]
  ] as const;

  return (
    <div className="grid gap-3">
      <p className="text-xs tracking-[0.16em] text-[color:var(--gold-dark)]">{label}</p>
      <div className="grid gap-3 lg:grid-cols-3">
        {items.map(([lang, langLabel]) =>
          multiline ? (
            <TextArea key={lang} label={langLabel} name={`${name}.${lang}`} defaultValue={value[lang]} disabled={disabled} rows={3} />
          ) : (
            <Field key={lang} label={langLabel} name={`${name}.${lang}`} defaultValue={value[lang]} disabled={disabled} />
          )
        )}
      </div>
    </div>
  );
}

function Toggle({
  label,
  name,
  defaultChecked,
  disabled,
  help
}: {
  label: string;
  name: string;
  defaultChecked: boolean;
  disabled: boolean;
  help?: string;
}) {
  return (
    <label className="flex min-h-12 items-start gap-3 border border-[color:var(--border)] bg-[color:var(--ivory)] p-3 text-sm text-[color:var(--muted)]">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} disabled={disabled} className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--gold)] disabled:opacity-70" />
      <span className="min-w-0">
        <span className="block text-[color:var(--ink)]">{label}</span>
        {help ? <span className="mt-1 block leading-6">{help}</span> : null}
      </span>
    </label>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  children
}: {
  icon: typeof Settings2;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
      <div className="flex items-start gap-3">
        <Icon aria-hidden size={20} className="mt-1 shrink-0 text-[color:var(--gold-dark)]" />
        <div className="min-w-0">
          <h2 className="font-serif text-2xl font-light">{title}</h2>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{description}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

export default async function AdminSettingsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  noStore();
  const session = await requirePermission("settings.read");
  const canWrite = hasPermission(session.user.role, "settings.write");
  const params = (await searchParams) ?? {};
  const settings = await getSiteSettings();

  return (
    <AdminShell
      title="站点设置"
      description="维护公司基础信息、联系方式、营业时间、Google Maps 嵌入、SEO 默认值、robots/sitemap 输出，以及可配置的登录失败锁定策略。"
    >
      {!canWrite ? (
        <p className="mt-8 border border-[color:var(--border)] bg-[color:var(--paper)] px-4 py-3 text-sm leading-6 text-[color:var(--muted)]">
          当前角色可查看站点设置；保存修改仅限 Super Admin。
        </p>
      ) : null}
      {params.notice ? (
        <p className="mt-8 border border-[color:var(--gold)] bg-[color:var(--paper)] px-4 py-3 text-sm leading-6 text-[color:var(--gold-dark)]">
          {noticeText[params.notice] ?? "操作已完成。"}
        </p>
      ) : null}

      <form action={canWrite ? saveSiteSettingsAction : undefined}>
        <Section icon={Settings2} title="公司基础信息" description="用于前台页脚、关于区块、本地商家结构化数据和后台品牌识别。">
          <LocalizedFields label="品牌名" name="company.name" value={settings.company.name} disabled={!canWrite} />
          <LocalizedFields label="法人名称" name="company.legalName" value={settings.company.legalName} disabled={!canWrite} />
          <LocalizedFields label="品牌标语" name="company.tagline" value={settings.company.tagline} disabled={!canWrite} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="古物商许可 / 登记信息" name="company.registration" defaultValue={settings.company.registration} disabled={!canWrite} />
            <Field label="创立年份" name="company.foundingYear" defaultValue={settings.company.foundingYear} disabled={!canWrite} />
          </div>
        </Section>

        <Section icon={MapPinned} title="联系方式与地图" description="维护电话、邮箱、LINE、三语地址和地图嵌入 URL，供 Contact / Access / Footer 复用。">
          <LocalizedFields label="地址" name="contact.address" value={settings.contact.address} disabled={!canWrite} multiline />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="电话" name="contact.phone" defaultValue={settings.contact.phone} disabled={!canWrite} />
            <Field label="邮箱" name="contact.email" defaultValue={settings.contact.email} disabled={!canWrite} type="email" />
            <Field label="LINE URL" name="contact.lineUrl" defaultValue={settings.contact.lineUrl} disabled={!canWrite} />
            <Field label="Google Maps / 嵌入 URL" name="contact.mapUrl" defaultValue={settings.contact.mapUrl} disabled={!canWrite} />
          </div>
        </Section>

        <Section icon={Clock} title="营业时间" description="三语营业时间、休业日和预约提示，移动端会作为门店信息卡片内容来源。">
          <LocalizedFields label="营业时间" name="businessHours.weekdays" value={settings.businessHours.weekdays} disabled={!canWrite} />
          <LocalizedFields label="休业日" name="businessHours.holidays" value={settings.businessHours.holidays} disabled={!canWrite} />
          <LocalizedFields label="补充说明" name="businessHours.note" value={settings.businessHours.note} disabled={!canWrite} multiline />
        </Section>

        <Section icon={Search} title="SEO 默认值" description="当页面、藏品、博客或资讯没有单独填写 SEO 时，使用这些默认标题、描述、关键词和 OGP 图。">
          <LocalizedFields label="默认标题" name="seo.defaultTitle" value={settings.seo.defaultTitle} disabled={!canWrite} />
          <LocalizedFields label="默认描述" name="seo.defaultDescription" value={settings.seo.defaultDescription} disabled={!canWrite} multiline />
          <LocalizedFields label="默认关键词" name="seo.defaultKeywords" value={settings.seo.defaultKeywords} disabled={!canWrite} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="OGP 默认图片" name="seo.ogImage" defaultValue={settings.seo.ogImage} disabled={!canWrite} />
            <Field label="Canonical Base URL" name="seo.canonicalBaseUrl" defaultValue={settings.seo.canonicalBaseUrl} disabled={!canWrite} />
          </div>
          <Toggle label="Canonical 使用尾斜杠" name="seo.canonicalTrailingSlash" defaultChecked={settings.seo.canonicalTrailingSlash} disabled={!canWrite} />
          <TextArea label="Noindex 路径（一行一个）" name="seo.noindexPaths" defaultValue={settings.seo.noindexPaths} disabled={!canWrite} rows={4} />
          <TextArea label="重定向规则（from => to，一行一个）" name="seo.redirectRules" defaultValue={settings.seo.redirectRules} disabled={!canWrite} rows={4} />
        </Section>

        <Section icon={Globe2} title="Robots / Sitemap" description="控制 /robots.txt 与 /sitemap.xml 输出，默认禁止搜索引擎抓取后台路径。">
          <div className="grid gap-3 md:grid-cols-2">
            <Toggle label="启用 robots.txt" name="robots.enabled" defaultChecked={settings.robots.enabled} disabled={!canWrite} />
            <Toggle label="禁止 /admin" name="robots.disallowAdmin" defaultChecked={settings.robots.disallowAdmin} disabled={!canWrite} />
          </div>
          <TextArea label="robots.txt 内容" name="robots.rules" defaultValue={settings.robots.rules} disabled={!canWrite} rows={7} />
          <div className="grid gap-3 md:grid-cols-2">
            <Toggle label="启用 sitemap.xml" name="sitemap.enabled" defaultChecked={settings.sitemap.enabled} disabled={!canWrite} />
            <Toggle label="包含博客" name="sitemap.includeBlog" defaultChecked={settings.sitemap.includeBlog} disabled={!canWrite} />
            <Toggle label="包含资讯" name="sitemap.includeNews" defaultChecked={settings.sitemap.includeNews} disabled={!canWrite} />
            <Toggle label="包含藏品" name="sitemap.includeItems" defaultChecked={settings.sitemap.includeItems} disabled={!canWrite} />
          </div>
        </Section>

        <Section icon={LockKeyhole} title="登录安全策略" description="这些参数会被后台登录流程读取；失败锁定和二步验证事件会继续写入审计日志。">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="失败锁定阈值" name="security.maxFailedLogins" defaultValue={settings.security.maxFailedLogins} disabled={!canWrite} type="number" />
            <Field label="锁定分钟数" name="security.lockMinutes" defaultValue={settings.security.lockMinutes} disabled={!canWrite} type="number" />
            <Field label="Session 小时数" name="security.sessionMaxAgeHours" defaultValue={settings.security.sessionMaxAgeHours} disabled={!canWrite} type="number" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Toggle label="强密码策略" name="security.requireStrongPassword" defaultChecked={settings.security.requireStrongPassword} disabled={!canWrite} help="新增或重置管理员密码仍要求至少 12 位。" />
            <Toggle label="要求 Admin 启用 TOTP" name="security.requireTotpForAdmins" defaultChecked={settings.security.requireTotpForAdmins} disabled={!canWrite} help="启用后，super_admin/admin 未开启 TOTP 时会被登录策略阻断并写入审计日志。" />
          </div>
        </Section>

        <div className="sticky bottom-0 mt-8 border border-[color:var(--border)] bg-[rgba(255,253,248,0.96)] p-4 backdrop-blur">
          <button
            type="submit"
            disabled={!canWrite}
            className="min-h-12 w-full border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)] disabled:bg-transparent disabled:text-[color:var(--muted)] disabled:opacity-70 md:w-auto"
          >
            {canWrite ? "保存站点设置" : "当前角色只读"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
