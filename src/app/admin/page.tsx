import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { getCmsDashboardCounts } from "@/lib/cms-content";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";

export default async function AdminDashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const locale = await getAdminLocale();
  const params = await searchParams;
  const counts = await getCmsDashboardCounts();
  const [adminUserCount, auditLogCount, appraisalCount, contactCount] = await Promise.all([
    prisma.adminUser.count().catch(() => 0),
    prisma.auditLog.count().catch(() => 0),
    prisma.appraisalRequest.count().catch(() => 0),
    prisma.contactMessage.count().catch(() => 0)
  ]);
  const dashboardCards = [
    { label: { ja: "鑑定依頼", zh: "鉴定申请", en: "Appraisals" }, value: appraisalCount.toString(), href: "/admin/appraisals" },
    { label: { ja: "お問い合わせ", zh: "联系留言", en: "Contacts" }, value: contactCount.toString(), href: "/admin/contacts" },
    { label: { ja: "ブログ記事", zh: "博客文章", en: "Blog Posts" }, value: counts.blogCount.toString(), href: "/admin/blog" },
    { label: { ja: "新着情報", zh: "资讯条目", en: "News Entries" }, value: counts.newsCount.toString(), href: "/admin/news" },
    { label: { ja: "管理者", zh: "管理员", en: "Admins" }, value: adminUserCount.toString(), href: "/admin/users" },
    { label: { ja: "監査ログ", zh: "审计日志", en: "Audit Logs" }, value: auditLogCount.toString(), href: "/admin/audit-logs" },
    { label: { ja: "サイト設定", zh: "站点设置", en: "Site Settings" }, value: "SEO", href: "/admin/seo" }
  ];

  return (
    <AdminShell
      title="管理后台总览"
      description="当前阶段已接入登录成功/失败审计、临时锁定、TOTP 二步验证、Blog / News 保存审计、媒体库、角色权限矩阵、管理员新增编辑禁用与审计日志筛选分页。"
    >
      {params?.error === "forbidden" ? (
        <p className="mt-8 border border-[color:var(--red-seal)] bg-[#fff7f4] px-4 py-3 text-sm leading-6 text-[color:var(--red-seal)]">
          {adminText({ ja: "現在のアカウントにはこの操作を実行する権限がありません。", zh: "当前账号没有执行该操作的权限。", en: "The current account does not have permission to perform this action." }, locale)}
        </p>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {dashboardCards.map((card) => (
          <Link key={card.href} href={card.href} className="border border-[color:var(--border)] bg-[color:var(--paper)] p-6 transition hover:border-[color:var(--gold)] hover:bg-white">
            <p className="text-sm text-[color:var(--muted)]">{adminText(card.label, locale)}</p>
            <p className="mt-4 font-serif text-4xl text-[color:var(--gold)]">
              {card.value}
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-8 border border-[color:var(--border)] bg-[color:var(--paper)] p-6">
        <h2 className="font-serif text-2xl font-light">
          {adminText({ ja: "コンテンツ管理入口", zh: "内容管理入口", en: "Content Management" }, locale)}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
          {adminText({
            ja: "Blog / News 管理はデータベース一覧、プレビュー、編集、新規作成、三語フィールド、公開状態、推薦表示、OG 画像、SEO に対応しています。viewer は閲覧専用です。メディアライブラリは URL 登録と三語 alt を扱えます。サイト設定では会社情報、連絡先、営業時間、地図、SEO、robots/sitemap、ログインセキュリティポリシーを管理できます。",
            zh: "Blog / News 管理页面已提供数据库列表、预览、编辑、新增、三语字段、发布状态、推荐显示、OG 图与 SEO 区域；viewer 账号只能查看，不能进入新增或编辑保存动作。媒体库已支持 URL 登记和三语 alt 文本。站点设置页已支持公司信息、联系方式、营业时间、地图、SEO、robots/sitemap 与登录安全策略配置。",
            en: "Blog / News management supports database lists, preview, edit, create, trilingual fields, publish state, featured display, OG images, and SEO. Viewer accounts are read-only. The media library supports URL registration and trilingual alt text. Site Settings covers company info, contact details, business hours, maps, SEO, robots/sitemap, and login security policy."
          }, locale)}
          {" "}
          {adminText({ ja: "現在のデータソース：", zh: "当前数据源：", en: "Current data source: " }, locale)}
          {counts.isDatabaseBacked ? "Prisma PostgreSQL" : adminText({ ja: "静的サンプル回退（DB 未接続）", zh: "静态样例回退（数据库未连接）", en: "Static sample fallback (database not connected)" }, locale)}
          。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/admin/blog" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            {adminText("博客管理", locale)}
          </Link>
          <Link href="/admin/news" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            {adminText("资讯管理", locale)}
          </Link>
          <Link href="/admin/appraisals" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            {adminText({ ja: "鑑定依頼", zh: "鉴定申请", en: "Appraisals" }, locale)}
          </Link>
          <Link href="/admin/contacts" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            {adminText({ ja: "お問い合わせ", zh: "联系留言", en: "Contacts" }, locale)}
          </Link>
          <Link href="/admin/audit-logs" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            {adminText("审计日志", locale)}
          </Link>
          <Link href="/admin/media" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            {adminText("媒体库", locale)}
          </Link>
          <Link href="/admin/security" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            {adminText("登录安全", locale)}
          </Link>
          <Link href="/admin/settings" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            {adminText("站点设置", locale)}
          </Link>
        </div>
      </section>
    </AdminShell>
  );
}
