import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { Clock, Globe2, LockKeyhole, MapPinned, Search, Settings2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { requirePermission } from "@/lib/admin-auth";
import { adminText, type AdminText } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";
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
  const locale = await getAdminLocale();
  const t = (value: AdminText) => adminText(value, locale);
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
          {t({ ja: "現在の権限ではサイト設定を閲覧できますが、保存は Super Admin のみ可能です。", zh: "当前角色可查看站点设置；保存修改仅限 Super Admin。", en: "Your role can view Site Settings; saving changes is limited to Super Admin." })}
        </p>
      ) : null}
      {params.notice ? (
        <p className="mt-8 border border-[color:var(--gold)] bg-[color:var(--paper)] px-4 py-3 text-sm leading-6 text-[color:var(--gold-dark)]">
          {t(noticeText[params.notice] ?? "操作已完成。")}
        </p>
      ) : null}

      <form action={canWrite ? saveSiteSettingsAction : undefined}>
        <Section icon={Settings2} title={t("公司基础信息")} description={t({ ja: "フロントサイトのフッター、About ブロック、ローカルビジネス構造化データ、管理画面ブランド表示に使用します。", zh: "用于前台页脚、关于区块、本地商家结构化数据和后台品牌识别。", en: "Used for the frontend footer, About blocks, local business structured data, and admin branding." })}>
          <LocalizedFields label={t("品牌名")} name="company.name" value={settings.company.name} disabled={!canWrite} />
          <LocalizedFields label={t("法人名称")} name="company.legalName" value={settings.company.legalName} disabled={!canWrite} />
          <LocalizedFields label={t("品牌标语")} name="company.tagline" value={settings.company.tagline} disabled={!canWrite} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t("古物商许可 / 登记信息")} name="company.registration" defaultValue={settings.company.registration} disabled={!canWrite} />
            <Field label={t("创立年份")} name="company.foundingYear" defaultValue={settings.company.foundingYear} disabled={!canWrite} />
          </div>
        </Section>

        <Section icon={MapPinned} title={t("联系方式与地图")} description={t({ ja: "電話、メール、LINE、三語住所、地図埋め込み URL を管理し、Contact / Access / Footer で再利用します。", zh: "维护电话、邮箱、LINE、三语地址和地图嵌入 URL，供 Contact / Access / Footer 复用。", en: "Manage phone, email, LINE, trilingual address, and map embed URL for Contact / Access / Footer." })}>
          <LocalizedFields label={t("地址")} name="contact.address" value={settings.contact.address} disabled={!canWrite} multiline />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t("电话")} name="contact.phone" defaultValue={settings.contact.phone} disabled={!canWrite} />
            <Field label={t("邮箱")} name="contact.email" defaultValue={settings.contact.email} disabled={!canWrite} type="email" />
            <Field label="LINE URL" name="contact.lineUrl" defaultValue={settings.contact.lineUrl} disabled={!canWrite} />
            <Field label={t({ ja: "Google Maps / 埋め込み URL", zh: "Google Maps / 嵌入 URL", en: "Google Maps / Embed URL" })} name="contact.mapUrl" defaultValue={settings.contact.mapUrl} disabled={!canWrite} />
          </div>
        </Section>

        <Section icon={Clock} title={t("营业时间")} description={t({ ja: "三語の営業時間、休業日、予約案内を管理し、モバイルの店舗情報カードにも使用します。", zh: "三语营业时间、休业日和预约提示，移动端会作为门店信息卡片内容来源。", en: "Trilingual hours, holidays, and appointment notes used by mobile store info cards." })}>
          <LocalizedFields label={t("营业时间")} name="businessHours.weekdays" value={settings.businessHours.weekdays} disabled={!canWrite} />
          <LocalizedFields label={t("休业日")} name="businessHours.holidays" value={settings.businessHours.holidays} disabled={!canWrite} />
          <LocalizedFields label={t("补充说明")} name="businessHours.note" value={settings.businessHours.note} disabled={!canWrite} multiline />
        </Section>

        <Section icon={Search} title={t("SEO 默认值")} description={t({ ja: "ページ、蔵品、ブログ、新着情報に個別 SEO がない場合、このデフォルト値を使用します。", zh: "当页面、藏品、博客或资讯没有单独填写 SEO 时，使用这些默认标题、描述、关键词和 OGP 图。", en: "Default title, description, keywords, and OGP image used when pages, items, blog, or news lack specific SEO." })}>
          <LocalizedFields label={t("默认标题")} name="seo.defaultTitle" value={settings.seo.defaultTitle} disabled={!canWrite} />
          <LocalizedFields label={t("默认描述")} name="seo.defaultDescription" value={settings.seo.defaultDescription} disabled={!canWrite} multiline />
          <LocalizedFields label={t("默认关键词")} name="seo.defaultKeywords" value={settings.seo.defaultKeywords} disabled={!canWrite} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t("OGP 默认图片")} name="seo.ogImage" defaultValue={settings.seo.ogImage} disabled={!canWrite} />
            <Field label="Canonical Base URL" name="seo.canonicalBaseUrl" defaultValue={settings.seo.canonicalBaseUrl} disabled={!canWrite} />
          </div>
          <Toggle label={t("Canonical 使用尾斜杠")} name="seo.canonicalTrailingSlash" defaultChecked={settings.seo.canonicalTrailingSlash} disabled={!canWrite} />
          <TextArea label={t("Noindex 路径（一行一个）")} name="seo.noindexPaths" defaultValue={settings.seo.noindexPaths} disabled={!canWrite} rows={4} />
          <TextArea label={t("重定向规则（from => to，一行一个）")} name="seo.redirectRules" defaultValue={settings.seo.redirectRules} disabled={!canWrite} rows={4} />
        </Section>

        <Section icon={Globe2} title="Robots / Sitemap" description={t({ ja: "/robots.txt と /sitemap.xml の出力を制御します。デフォルトで検索エンジンの管理画面クロールを禁止します。", zh: "控制 /robots.txt 与 /sitemap.xml 输出，默认禁止搜索引擎抓取后台路径。", en: "Controls /robots.txt and /sitemap.xml output. By default, search engines are blocked from crawling admin paths." })}>
          <div className="grid gap-3 md:grid-cols-2">
            <Toggle label={t("启用 robots.txt")} name="robots.enabled" defaultChecked={settings.robots.enabled} disabled={!canWrite} />
            <Toggle label={t("禁止 /admin")} name="robots.disallowAdmin" defaultChecked={settings.robots.disallowAdmin} disabled={!canWrite} />
          </div>
          <TextArea label={t({ ja: "robots.txt 内容", zh: "robots.txt 内容", en: "robots.txt content" })} name="robots.rules" defaultValue={settings.robots.rules} disabled={!canWrite} rows={7} />
          <div className="grid gap-3 md:grid-cols-2">
            <Toggle label={t("启用 sitemap.xml")} name="sitemap.enabled" defaultChecked={settings.sitemap.enabled} disabled={!canWrite} />
            <Toggle label={t("包含博客")} name="sitemap.includeBlog" defaultChecked={settings.sitemap.includeBlog} disabled={!canWrite} />
            <Toggle label={t("包含资讯")} name="sitemap.includeNews" defaultChecked={settings.sitemap.includeNews} disabled={!canWrite} />
            <Toggle label={t("包含藏品")} name="sitemap.includeItems" defaultChecked={settings.sitemap.includeItems} disabled={!canWrite} />
          </div>
        </Section>

        <Section icon={LockKeyhole} title={t("登录安全策略")} description={t({ ja: "これらの値は管理画面ログインで読み込まれます。失敗ロックと二段階認証イベントは監査ログに記録されます。", zh: "这些参数会被后台登录流程读取；失败锁定和二步验证事件会继续写入审计日志。", en: "These values are used by admin login. Lockout and two-factor events continue to be written to audit logs." })}>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label={t("失败锁定阈值")} name="security.maxFailedLogins" defaultValue={settings.security.maxFailedLogins} disabled={!canWrite} type="number" />
            <Field label={t("锁定分钟数")} name="security.lockMinutes" defaultValue={settings.security.lockMinutes} disabled={!canWrite} type="number" />
            <Field label={t({ ja: "セッション時間", zh: "Session 小时数", en: "Session hours" })} name="security.sessionMaxAgeHours" defaultValue={settings.security.sessionMaxAgeHours} disabled={!canWrite} type="number" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Toggle label={t("强密码策略")} name="security.requireStrongPassword" defaultChecked={settings.security.requireStrongPassword} disabled={!canWrite} help={t({ ja: "管理者パスワードの追加またはリセット時は引き続き 12 文字以上が必要です。", zh: "新增或重置管理员密码仍要求至少 12 位。", en: "New or reset admin passwords still require at least 12 characters." })} />
            <Toggle label={t("要求 Admin 启用 TOTP")} name="security.requireTotpForAdmins" defaultChecked={settings.security.requireTotpForAdmins} disabled={!canWrite} help={t({ ja: "有効化すると、TOTP 未設定の super_admin/admin はログインポリシーでブロックされ監査ログに記録されます。", zh: "启用后，super_admin/admin 未开启 TOTP 时会被登录策略阻断并写入审计日志。", en: "When enabled, super_admin/admin accounts without TOTP are blocked by login policy and recorded in audit logs." })} />
          </div>
        </Section>

        <div className="sticky bottom-0 mt-8 border border-[color:var(--border)] bg-[rgba(255,253,248,0.96)] p-4 backdrop-blur">
          <button
            type="submit"
            disabled={!canWrite}
            className="min-h-12 w-full border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)] disabled:bg-transparent disabled:text-[color:var(--muted)] disabled:opacity-70 md:w-auto"
          >
            {canWrite ? t("保存站点设置") : t("当前角色只读")}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
