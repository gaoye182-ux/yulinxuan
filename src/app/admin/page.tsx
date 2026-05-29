import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { getCmsDashboardCounts } from "@/lib/cms-content";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminDashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const counts = await getCmsDashboardCounts();
  const [adminUserCount, auditLogCount, appraisalCount, contactCount] = await Promise.all([
    prisma.adminUser.count().catch(() => 0),
    prisma.auditLog.count().catch(() => 0),
    prisma.appraisalRequest.count().catch(() => 0),
    prisma.contactMessage.count().catch(() => 0)
  ]);
  const dashboardCards = [
    { label: "鉴定申请", value: appraisalCount.toString(), href: "/admin/appraisals" },
    { label: "联系留言", value: contactCount.toString(), href: "/admin/contacts" },
    { label: "博客文章", value: counts.blogCount.toString(), href: "/admin/blog" },
    { label: "资讯条目", value: counts.newsCount.toString(), href: "/admin/news" },
    { label: "管理员", value: adminUserCount.toString(), href: "/admin/users" },
    { label: "审计日志", value: auditLogCount.toString(), href: "/admin/audit-logs" },
    { label: "站点设置", value: "SEO", href: "/admin/seo" }
  ];

  return (
    <AdminShell
      title="管理后台总览"
      description="当前阶段已接入登录成功/失败审计、临时锁定、TOTP 二步验证、Blog / News 保存审计、媒体库、角色权限矩阵、管理员新增编辑禁用与审计日志筛选分页。"
    >
      {params?.error === "forbidden" ? (
        <p className="mt-8 border border-[color:var(--red-seal)] bg-[#fff7f4] px-4 py-3 text-sm leading-6 text-[color:var(--red-seal)]">
          当前账号没有执行该操作的权限。
        </p>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {dashboardCards.map((card) => (
          <Link key={card.label} href={card.href} className="border border-[color:var(--border)] bg-[color:var(--paper)] p-6 transition hover:border-[color:var(--gold)] hover:bg-white">
            <p className="text-sm text-[color:var(--muted)]">{card.label}</p>
            <p className="mt-4 font-serif text-4xl text-[color:var(--gold)]">
              {card.value}
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-8 border border-[color:var(--border)] bg-[color:var(--paper)] p-6">
        <h2 className="font-serif text-2xl font-light">内容管理入口</h2>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
          Blog / News 管理页面已提供数据库列表、预览、编辑、新增、三语字段、发布状态、推荐显示、OG 图与 SEO 区域；viewer 账号只能查看，不能进入新增或编辑保存动作。
          媒体库已支持 URL 登记和三语 alt 文本。站点设置页已支持公司信息、联系方式、营业时间、地图、SEO、robots/sitemap 与登录安全策略配置。
          登录安全页支持二维码、一次性备用码和失败锁定；管理员与审计日志页面已按角色显示页面级和操作级权限提示。
          当前数据源：{counts.isDatabaseBacked ? "Prisma PostgreSQL" : "静态样例回退（数据库未连接）"}。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/admin/blog" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            博客管理
          </Link>
          <Link href="/admin/news" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            资讯管理
          </Link>
          <Link href="/admin/appraisals" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            鉴定申请
          </Link>
          <Link href="/admin/contacts" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            联系留言
          </Link>
          <Link href="/admin/audit-logs" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            审计日志
          </Link>
          <Link href="/admin/media" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            媒体库
          </Link>
          <Link href="/admin/security" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            登录安全
          </Link>
          <Link href="/admin/settings" className="min-h-11 border border-[color:var(--gold)] px-4 py-3 text-sm text-[color:var(--gold-dark)]">
            站点设置
          </Link>
        </div>
      </section>
    </AdminShell>
  );
}
