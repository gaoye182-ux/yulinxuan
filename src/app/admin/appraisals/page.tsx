import Link from "next/link";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import type { Prisma, RequestStatus } from "@prisma/client";
import { CalendarDays, Download, FileImage, Filter, Mail, MessageSquareReply, Phone, Search, ShieldAlert } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText, type AdminText } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";
import { updateAppraisalAction } from "@/lib/appraisal-actions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "鉴定申请管理 | 玉林軒 CMS",
  description: "管理玉林軒株式会社鉴定申请的状态、图片、备注、回复模板与 CSV 导出。"
};

const pageSize = 10;
const statusOptions: { value: RequestStatus; label: AdminText; tone: string }[] = [
  { value: "unread", label: { ja: "未読", zh: "未读", en: "Unread" }, tone: "border-[color:var(--red-seal)] text-[color:var(--red-seal)]" },
  { value: "in_progress", label: { ja: "対応中", zh: "处理中", en: "In progress" }, tone: "border-[color:var(--gold)] text-[color:var(--gold-dark)]" },
  { value: "replied", label: { ja: "返信済み", zh: "已回复", en: "Replied" }, tone: "border-[#758d6a] text-[#4f6d45]" },
  { value: "completed", label: { ja: "完了", zh: "已完成", en: "Completed" }, tone: "border-[#607d8b] text-[#455a64]" },
  { value: "rejected", label: { ja: "不採用", zh: "不采用", en: "Rejected" }, tone: "border-[color:var(--border)] text-[color:var(--muted)]" },
  { value: "archived", label: { ja: "アーカイブ", zh: "归档", en: "Archived" }, tone: "border-[color:var(--border)] text-[color:var(--muted)]" }
];

const statusTones = Object.fromEntries(statusOptions.map((item) => [item.value, item.tone])) as Record<RequestStatus, string>;
const statusText = Object.fromEntries(statusOptions.map((item) => [item.value, item.label])) as Record<RequestStatus, AdminText>;

function stringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: Date | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value);
}

function formatDateOnly(value: Date | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(value);
}

function pageHref(params: Record<string, string | undefined>, page: number) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page") {
      search.set(key, value);
    }
  }

  search.set("page", page.toString());
  return `/admin/appraisals?${search.toString()}`;
}

function exportHref(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page") {
      search.set(key, value);
    }
  }

  return `/admin/appraisals/export?${search.toString()}`;
}

function replyTemplate(row: {
  requestNo: string;
  name: string;
  type: string;
  itemCategory: string | null;
  lang: string;
}) {
  if (row.lang === "zh") {
    return `您好 ${row.name}：\n\n感谢您提交鉴定申请（${row.requestNo}）。我们已收到关于${row.itemCategory ?? "藏品"}的资料，将先确认照片与说明内容。如需追加尺寸、底款、箱书或取得经过等信息，我们会再次联系。\n\n玉林軒株式会社`;
  }

  if (row.lang === "en") {
    return `Dear ${row.name},\n\nThank you for your appraisal request (${row.requestNo}). We have received the details for your ${row.itemCategory ?? "item"} and will review the photos and description first. If dimensions, marks, boxes, certificates, or provenance details are needed, we will contact you again.\n\nGyokurinken Co., Ltd.`;
  }

  return `${row.name} 様\n\nこの度は鑑定申込（${row.requestNo}）をお送りいただき、誠にありがとうございます。${row.itemCategory ?? "お品物"}の写真と概要を確認のうえ、必要に応じて寸法、銘、箱書、入手経緯などの追加情報をお願いする場合がございます。\n\n玉林軒株式会社`;
}

function mailtoHref(row: {
  requestNo: string;
  name: string;
  email: string;
  type: string;
  itemCategory: string | null;
  lang: string;
}) {
  const subject = row.lang === "en" ? `Appraisal Request ${row.requestNo}` : row.lang === "zh" ? `鉴定申请 ${row.requestNo}` : `鑑定申込 ${row.requestNo}`;
  const params = new URLSearchParams({
    subject,
    body: replyTemplate(row)
  });

  return `mailto:${row.email}?${params.toString()}`;
}

export default async function AdminAppraisalsPage({
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
  const type = stringParam(rawParams.type)?.trim();
  const lang = stringParam(rawParams.lang)?.trim();
  const from = stringParam(rawParams.from)?.trim();
  const to = stringParam(rawParams.to)?.trim();
  const page = Math.max(1, Number(stringParam(rawParams.page) ?? 1) || 1);
  const normalizedParams = { q, status, type, lang, from, to };
  const statusFilter = statusOptions.some((item) => item.value === status) ? status : undefined;
  const where: Prisma.AppraisalRequestWhereInput = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(type ? { type } : {}),
    ...(lang ? { lang } : {}),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: new Date(`${from}T00:00:00+09:00`) } : {}),
            ...(to ? { lte: new Date(`${to}T23:59:59+09:00`) } : {})
          }
        }
      : {}),
    ...(q
      ? {
          OR: [
            { requestNo: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { region: { contains: q, mode: "insensitive" } },
            { itemCategory: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const [rows, total, statusCounts, typeRows] = await Promise.all([
    prisma.appraisalRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.appraisalRequest.count({ where }),
    prisma.appraisalRequest.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.appraisalRequest.findMany({ select: { type: true }, distinct: ["type"], orderBy: { type: "asc" } })
  ]);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const countByStatus = new Map(statusCounts.map((item) => [item.status, item._count._all]));

  return (
    <AdminShell
      title="鉴定申请管理"
      description="查看鉴定申请详情与图片，按状态、类型、语言和日期筛选，维护处理状态与内部备注，并导出当前筛选结果 CSV。"
    >
      <section className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {statusOptions.map((item) => (
          <div key={item.value} className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
            <p className="text-sm text-[color:var(--muted)]">{t(item.label)}</p>
            <p className="mt-3 font-serif text-4xl font-light text-[color:var(--gold-dark)]">{countByStatus.get(item.value) ?? 0}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
        <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="min-w-0 md:col-span-2 xl:col-span-4">
            <span className="sr-only">{t("搜索")}</span>
            <div className="flex min-h-12 items-center gap-3 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4">
              <Search aria-hidden size={17} className="shrink-0 text-[color:var(--gold-dark)]" />
              <input name="q" defaultValue={q ?? ""} placeholder={t({ ja: "申込番号 / 氏名 / メール / 説明", zh: "申请编号 / 姓名 / 邮箱 / 说明", en: "Request no. / name / email / description" })} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[color:var(--muted)]/70" />
            </div>
          </label>
          <select name="status" defaultValue={statusFilter ?? ""} className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
            <option value="">{t({ ja: "状態：すべて", zh: "状态：全部", en: "Status: all" })}</option>
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>{t(item.label)}</option>
            ))}
          </select>
          <select name="type" defaultValue={type ?? ""} className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
            <option value="">{t({ ja: "種類：すべて", zh: "类型：全部", en: "Type: all" })}</option>
            {typeRows.map((item) => (
              <option key={item.type} value={item.type}>{item.type}</option>
            ))}
          </select>
          <select name="lang" defaultValue={lang ?? ""} className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
            <option value="">{t("语言")}</option>
            <option value="ja">JA</option>
            <option value="zh">ZH</option>
            <option value="en">EN</option>
          </select>
          <input name="from" defaultValue={from ?? ""} type="date" className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none" />
          <input name="to" defaultValue={to ?? ""} type="date" className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none" />
          <button className="inline-flex min-h-12 items-center justify-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 text-sm text-white">
            <Filter aria-hidden size={16} />
            {t("筛选")}
          </button>
          <Link href={exportHref(normalizedParams)} className="inline-flex min-h-12 items-center justify-center gap-2 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)]">
            <Download aria-hidden size={16} />
            CSV
          </Link>
        </form>
      </section>

      <section className="mt-6 overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] p-5">
          <h2 className="font-serif text-2xl font-light">{t({ ja: "申請記録", zh: "申请记录", en: "Request Records" })}</h2>
          <p className="text-sm text-[color:var(--muted)]">{t({ ja: `全 ${total} 件、${page} / ${pageCount} ページ`, zh: `共 ${total} 条，第 ${page} / ${pageCount} 页`, en: `${total} total, page ${page} / ${pageCount}` })}</p>
        </div>

        <div className="grid gap-0">
          {rows.length ? rows.map((row) => (
            <article key={row.id.toString()} className="grid gap-5 border-b border-[color:var(--border)] p-5 last:border-b-0">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`border px-2 py-1 text-xs ${statusTones[row.status]}`}>{t(statusText[row.status])}</span>
                    <span className="border border-[color:var(--border)] px-2 py-1 text-xs text-[color:var(--muted)]">{row.type}</span>
                    <span className="border border-[color:var(--border)] px-2 py-1 text-xs uppercase text-[color:var(--muted)]">{row.lang}</span>
                  </div>
                  <h3 className="mt-3 break-words font-serif text-2xl font-light">{row.requestNo} · {row.name}</h3>
                  <div className="mt-3 grid gap-2 text-sm leading-6 text-[color:var(--muted)] md:grid-cols-2">
                    <p className="flex min-w-0 items-start gap-2">
                      <Mail aria-hidden size={15} className="mt-1 shrink-0 text-[color:var(--gold-dark)]" />
                      <span className="min-w-0 break-all">{row.email}</span>
                    </p>
                    <p className="flex min-w-0 items-start gap-2">
                      <Phone aria-hidden size={15} className="mt-1 shrink-0 text-[color:var(--gold-dark)]" />
                      <span className="min-w-0 break-all">{row.phone ?? "-"}</span>
                    </p>
                    <p className="flex min-w-0 items-start gap-2">
                      <CalendarDays aria-hidden size={15} className="mt-1 shrink-0 text-[color:var(--gold-dark)]" />
                      <span>{formatDate(row.createdAt)} {t("提交")} / {t({ ja: "希望日", zh: "希望日", en: "Preferred" })} {formatDateOnly(row.preferredDate)}</span>
                    </p>
                    <p className="min-w-0 break-words">{t("地区")}：{row.region ?? "-"} / {t("类别")}：{row.itemCategory ?? "-"}</p>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap break-words border-l border-[color:var(--gold)] pl-4 text-sm leading-7 text-[color:var(--ink)]">
                    {row.description || t({ ja: "品物説明は未入力です。", zh: "未填写物品说明。", en: "No item description was provided." })}
                  </p>
                </div>

                <div className="grid content-start gap-3">
                  <Link href={mailtoHref(row)} className="inline-flex min-h-11 items-center justify-center gap-2 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)]">
                    <MessageSquareReply aria-hidden size={16} />
                    {t("打开邮件回复模板")}
                  </Link>
                  <details className="border border-[color:var(--border)] bg-[color:var(--ivory)] p-3">
                    <summary className="cursor-pointer text-sm text-[color:var(--gold-dark)]">{t({ ja: "テンプレート本文を見る", zh: "查看模板正文", en: "View template body" })}</summary>
                    <pre className="mt-3 whitespace-pre-wrap break-words text-xs leading-6 text-[color:var(--muted)]">{replyTemplate(row)}</pre>
                  </details>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                <section className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileImage aria-hidden size={17} className="text-[color:var(--gold-dark)]" />
                    <h4 className="font-serif text-xl font-light">{t({ ja: "申請画像", zh: "申请图片", en: "Request Images" })}</h4>
                  </div>
                  {row.images.length ? (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {row.images.map((image) => (
                        <a key={image} href={image} target="_blank" rel="noreferrer" className="group block min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={image} alt={`${row.requestNo} appraisal image`} className="aspect-[4/3] w-full object-cover" />
                          <span className="block truncate px-3 py-2 text-xs text-[color:var(--muted)] group-hover:text-[color:var(--gold-dark)]">{image}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 flex min-h-16 items-center gap-2 border border-dashed border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)]">
                      <ShieldAlert aria-hidden size={16} className="text-[color:var(--gold-dark)]" />
                      {t({ ja: "画像はアップロードされていません。電話相談や店頭予約として処理できます。", zh: "未上传图片。电话咨询或店头预约可继续处理。", en: "No images uploaded. Phone inquiries or in-store appointments can still be processed." })}
                    </p>
                  )}
                </section>

                <form action={updateAppraisalAction} className="grid content-start gap-3 border border-[color:var(--border)] bg-white p-4">
                  <input type="hidden" name="id" value={row.id.toString()} />
                  <label className="grid gap-2 text-sm">
                    <span className="text-[color:var(--muted)]">{t("处理状态")}</span>
                    <select name="status" defaultValue={row.status} disabled={readOnly} className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none disabled:opacity-70">
                      {statusOptions.map((item) => (
                        <option key={item.value} value={item.value}>{t(item.label)}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm">
                    <span className="text-[color:var(--muted)]">{t("管理员备注")}</span>
                    <textarea name="adminNote" defaultValue={row.adminNote ?? ""} disabled={readOnly} rows={5} className="w-full resize-y border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 py-2 text-base leading-7 outline-none disabled:opacity-70" placeholder={t({ ja: "電話連絡、追加画像、見積方向、受付不可理由などを記録します。", zh: "记录已电话联系、需补图、估价方向、拒收原因等内部信息。", en: "Record phone follow-up, needed images, valuation direction, rejection reason, and internal notes." })} />
                  </label>
                  {readOnly ? (
                    <p className="border border-[color:var(--border)] px-3 py-2 text-sm text-[color:var(--muted)]">{t({ ja: "Viewer は読み取り専用のため、状態やメモを更新できません。", zh: "Viewer 只读，不能更新状态或备注。", en: "Viewer is read-only and cannot update status or notes." })}</p>
                  ) : (
                    <button className="min-h-11 border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 text-sm text-white">
                      {t("保存状态与备注")}
                    </button>
                  )}
                </form>
              </div>
            </article>
          )) : (
            <p className="p-8 text-sm text-[color:var(--muted)]">{t({ ja: "条件に一致する鑑定申請はありません。", zh: "暂无符合筛选条件的鉴定申请。", en: "No matching appraisal requests." })}</p>
          )}
        </div>
      </section>

      <nav className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={pageHref(normalizedParams, Math.max(1, page - 1))}
          className={`min-h-11 border border-[color:var(--border)] px-4 py-3 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : "text-[color:var(--gold-dark)]"}`}
        >
          {t("上一页")}
        </Link>
        <Link
          href={pageHref(normalizedParams, Math.min(pageCount, page + 1))}
          className={`min-h-11 border border-[color:var(--border)] px-4 py-3 text-sm ${page >= pageCount ? "pointer-events-none opacity-50" : "text-[color:var(--gold-dark)]"}`}
        >
          {t("下一页")}
        </Link>
      </nav>
    </AdminShell>
  );
}
