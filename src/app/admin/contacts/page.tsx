import Link from "next/link";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import type { Prisma, RequestStatus } from "@prisma/client";
import { Download, Filter, Mail, MessageSquareReply, Phone, Search } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText, type AdminText } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";
import { updateContactAction } from "@/lib/contact-actions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "联系表单管理 | 玉林軒 CMS",
  description: "管理联系表单留言的列表、搜索、筛选、状态流转、回复备注、CSV 导出与审计记录。"
};

const pageSize = 12;
const statusOptions: { value: RequestStatus; label: AdminText; tone: string }[] = [
  { value: "unread", label: { ja: "未読", zh: "未读", en: "Unread" }, tone: "border-[color:var(--red-seal)] text-[color:var(--red-seal)]" },
  { value: "in_progress", label: { ja: "対応中", zh: "处理中", en: "In progress" }, tone: "border-[color:var(--gold)] text-[color:var(--gold-dark)]" },
  { value: "replied", label: { ja: "返信済み", zh: "已回复", en: "Replied" }, tone: "border-[#758d6a] text-[#4f6d45]" },
  { value: "completed", label: { ja: "完了", zh: "已完成", en: "Completed" }, tone: "border-[#607d8b] text-[#455a64]" },
  { value: "archived", label: { ja: "アーカイブ", zh: "归档", en: "Archived" }, tone: "border-[color:var(--border)] text-[color:var(--muted)]" }
];
const statusTones = Object.fromEntries(statusOptions.map((item) => [item.value, item.tone])) as Record<RequestStatus, string>;
const statusText = Object.fromEntries(statusOptions.map((item) => [item.value, item.label])) as Record<RequestStatus, AdminText>;

function stringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(value);
}

function buildHref(path: string, params: Record<string, string | undefined>, page?: number) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page") {
      search.set(key, value);
    }
  }
  if (page) {
    search.set("page", page.toString());
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

function replyTemplate(row: { name: string; category: string | null; lang: string }) {
  if (row.lang === "zh") {
    return `您好 ${row.name}：\n\n感谢您联系玉林軒株式会社。关于「${row.category ?? "咨询"}」的内容我们已收到，将确认后回复您。\n\n玉林軒株式会社`;
  }
  if (row.lang === "en") {
    return `Dear ${row.name},\n\nThank you for contacting Gyokurinken Co., Ltd. We have received your ${row.category ?? "inquiry"} and will review it before replying.\n\nGyokurinken Co., Ltd.`;
  }
  return `${row.name} 様\n\n玉林軒株式会社へお問い合わせいただき、誠にありがとうございます。「${row.category ?? "お問い合わせ"}」の内容を確認のうえ、担当者よりご連絡いたします。\n\n玉林軒株式会社`;
}

function mailtoHref(row: { name: string; email: string; category: string | null; lang: string }) {
  const subject = row.lang === "en" ? "Inquiry to Gyokurinken" : row.lang === "zh" ? "玉林軒咨询回复" : "玉林軒へのお問い合わせ";
  const params = new URLSearchParams({ subject, body: replyTemplate(row) });
  return `mailto:${row.email}?${params.toString()}`;
}

export default async function AdminContactsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  noStore();
  const session = await requireAdmin();
  const locale = await getAdminLocale();
  const t = (value: AdminText) => adminText(value, locale);
  const readOnly = session.user.role === "viewer";
  const rawParams = (await searchParams) ?? {};
  const q = stringParam(rawParams.q)?.trim();
  const status = stringParam(rawParams.status)?.trim() as RequestStatus | undefined;
  const category = stringParam(rawParams.category)?.trim();
  const lang = stringParam(rawParams.lang)?.trim();
  const page = Math.max(1, Number(stringParam(rawParams.page) ?? 1) || 1);
  const normalizedParams = { q, status, category, lang };
  const statusFilter = statusOptions.some((item) => item.value === status) ? status : undefined;
  const where: Prisma.ContactMessageWhereInput = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(category ? { category } : {}),
    ...(lang ? { lang } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
            { message: { contains: q, mode: "insensitive" } },
            { adminNote: { contains: q, mode: "insensitive" } },
            { replyNote: { contains: q, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const [rows, total, statusCounts, categoryRows] = await Promise.all([
    prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.contactMessage.findMany({ where: { category: { not: null } }, select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } })
  ]);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const countByStatus = new Map(statusCounts.map((item) => [item.status, item._count._all]));

  return (
    <AdminShell title="联系表单管理" description="前台 Contact 表单已真实写入 contact_messages；此处可搜索、按状态/分类/语言筛选、更新处理状态与备注，并导出当前筛选结果 CSV。">
      <section className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {statusOptions.map((item) => (
          <div key={item.value} className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
            <p className="text-sm text-[color:var(--muted)]">{t(item.label)}</p>
            <p className="mt-3 font-serif text-4xl font-light text-[color:var(--gold-dark)]">{countByStatus.get(item.value) ?? 0}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
        <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="min-w-0 md:col-span-2 xl:col-span-5">
            <span className="sr-only">{t("搜索")}</span>
            <div className="flex min-h-12 items-center gap-3 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4">
              <Search aria-hidden size={17} className="shrink-0 text-[color:var(--gold-dark)]" />
              <input name="q" defaultValue={q ?? ""} placeholder={t({ ja: "氏名 / メール / 電話 / 内容 / メモ", zh: "姓名 / 邮箱 / 电话 / 内容 / 备注", en: "Name / email / phone / content / notes" })} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[color:var(--muted)]/70" />
            </div>
          </label>
          <select name="status" defaultValue={statusFilter ?? ""} className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
            <option value="">{t({ ja: "状態：すべて", zh: "状态：全部", en: "Status: all" })}</option>
            {statusOptions.map((item) => <option key={item.value} value={item.value}>{t(item.label)}</option>)}
          </select>
          <select name="category" defaultValue={category ?? ""} className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
            <option value="">{t({ ja: "分類：すべて", zh: "分类：全部", en: "Category: all" })}</option>
            {categoryRows.map((item) => item.category ? <option key={item.category} value={item.category}>{item.category}</option> : null)}
          </select>
          <select name="lang" defaultValue={lang ?? ""} className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
            <option value="">{t("语言")}</option>
            <option value="ja">JA</option>
            <option value="zh">ZH</option>
            <option value="en">EN</option>
          </select>
          <button className="inline-flex min-h-12 items-center justify-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 text-sm text-white">
            <Filter aria-hidden size={16} />
            {t("筛选")}
          </button>
          <Link href={buildHref("/admin/contacts/export", normalizedParams)} className="inline-flex min-h-12 items-center justify-center gap-2 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)]">
            <Download aria-hidden size={16} />
            CSV
          </Link>
        </form>
      </section>

      <section className="mt-6 overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] p-5">
          <h2 className="font-serif text-2xl font-light">{t({ ja: "お問い合わせ記録", zh: "留言记录", en: "Message Records" })}</h2>
          <p className="text-sm text-[color:var(--muted)]">{t({ ja: `全 ${total} 件、${page} / ${pageCount} ページ`, zh: `共 ${total} 条，第 ${page} / ${pageCount} 页`, en: `${total} total, page ${page} / ${pageCount}` })}</p>
        </div>
        {rows.length ? rows.map((row) => (
          <article key={row.id.toString()} className="grid gap-5 border-b border-[color:var(--border)] p-5 last:border-b-0 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`border px-2 py-1 text-xs ${statusTones[row.status]}`}>{t(statusText[row.status])}</span>
                <span className="border border-[color:var(--border)] px-2 py-1 text-xs text-[color:var(--muted)]">{row.category ?? t("未分类")}</span>
                <span className="border border-[color:var(--border)] px-2 py-1 text-xs uppercase text-[color:var(--muted)]">{row.lang}</span>
              </div>
              <h3 className="mt-3 break-words font-serif text-2xl font-light">{row.name}</h3>
              <div className="mt-3 grid gap-2 text-sm leading-6 text-[color:var(--muted)] md:grid-cols-2">
                <p className="flex min-w-0 items-start gap-2"><Mail aria-hidden size={15} className="mt-1 shrink-0 text-[color:var(--gold-dark)]" /><span className="min-w-0 break-all">{row.email}</span></p>
                <p className="flex min-w-0 items-start gap-2"><Phone aria-hidden size={15} className="mt-1 shrink-0 text-[color:var(--gold-dark)]" /><span className="min-w-0 break-all">{row.phone ?? "-"}</span></p>
                <p>{t("提交时间")}：{formatDate(row.createdAt)}</p>
                <p className="min-w-0 break-words">IP：{row.ipAddress ?? "-"}</p>
              </div>
              <p className="mt-4 whitespace-pre-wrap break-words border-l border-[color:var(--gold)] pl-4 text-sm leading-7 text-[color:var(--ink)]">{row.message}</p>
              <Link href={mailtoHref(row)} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)]">
                <MessageSquareReply aria-hidden size={16} />
                {t("打开邮件回复模板")}
              </Link>
            </div>
            <form action={updateContactAction} className="grid content-start gap-3 border border-[color:var(--border)] bg-white p-4">
              <input type="hidden" name="id" value={row.id.toString()} />
              <label className="grid gap-2 text-sm">
                <span className="text-[color:var(--muted)]">{t("处理状态")}</span>
                <select name="status" defaultValue={row.status} disabled={readOnly} className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none disabled:opacity-70">
                  {statusOptions.map((item) => <option key={item.value} value={item.value}>{t(item.label)}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm">
                <span className="text-[color:var(--muted)]">{t("回复备注")}</span>
                <textarea name="replyNote" defaultValue={row.replyNote ?? replyTemplate(row)} disabled={readOnly} rows={5} className="w-full resize-y border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 py-2 text-base leading-7 outline-none disabled:opacity-70" />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="text-[color:var(--muted)]">{t("管理员备注")}</span>
                <textarea name="adminNote" defaultValue={row.adminNote ?? ""} disabled={readOnly} rows={4} className="w-full resize-y border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 py-2 text-base leading-7 outline-none disabled:opacity-70" placeholder={t({ ja: "電話連絡、見積方向、引き継ぎ担当などの内部情報を記録します。", zh: "记录电话联系、报价方向、转交人员等内部信息。", en: "Record phone follow-up, quotation direction, handoff owner, and other internal notes." })} />
              </label>
              {!readOnly ? <button className="min-h-11 border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 text-sm text-white">{t("保存状态与备注")}</button> : null}
            </form>
          </article>
        )) : (
          <p className="p-8 text-sm text-[color:var(--muted)]">{t({ ja: "条件に一致するお問い合わせはありません。", zh: "暂无符合筛选条件的联系留言。", en: "No matching contact messages." })}</p>
        )}
      </section>

      <nav className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Link href={buildHref("/admin/contacts", normalizedParams, Math.max(1, page - 1))} className={`min-h-11 border border-[color:var(--border)] px-4 py-3 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : "text-[color:var(--gold-dark)]"}`}>{t("上一页")}</Link>
        <Link href={buildHref("/admin/contacts", normalizedParams, Math.min(pageCount, page + 1))} className={`min-h-11 border border-[color:var(--border)] px-4 py-3 text-sm ${page >= pageCount ? "pointer-events-none opacity-50" : "text-[color:var(--gold-dark)]"}`}>{t("下一页")}</Link>
      </nav>
    </AdminShell>
  );
}
