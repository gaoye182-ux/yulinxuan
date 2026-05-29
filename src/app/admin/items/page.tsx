import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { Copy, Eye, FilePenLine, Filter, ImageIcon, Plus, Search } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { bulkUpdateItemsAction, duplicateItemAction, softDeleteItemAction } from "@/lib/item-actions";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText, type AdminLocale, type AdminText } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "藏品管理 | 玉林軒 CMS",
  description: "管理玉林軒株式会社藏品 CRUD、发布状态、媒体图片与前台展示。"
};

function localizedName(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as { ja?: string; zh?: string; en?: string };
  }

  return {};
}

function text(value: AdminText, locale: AdminLocale) {
  return adminText(value, locale);
}

function localizedValue(value: { ja?: string; zh?: string; en?: string }, locale: AdminLocale, fallback = "") {
  return value[locale] || value.ja || value.zh || value.en || fallback;
}

function statusLabel(status: string, deletedAt: Date | null | undefined, locale: AdminLocale) {
  if (deletedAt) {
    return text({ ja: "削除済み", zh: "已删除", en: "Deleted" }, locale);
  }
  if (status === "published") {
    return text({ ja: "公開済み", zh: "已发布", en: "Published" }, locale);
  }
  if (status === "archived") {
    return text({ ja: "アーカイブ", zh: "归档", en: "Archived" }, locale);
  }
  return text({ ja: "下書き", zh: "草稿", en: "Draft" }, locale);
}

export default async function AdminItemsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  noStore();
  const session = await requireAdmin();
  const locale = await getAdminLocale();
  const t = (value: AdminText) => adminText(value, locale);
  const readOnly = session.user.role === "viewer";
  const params = (await searchParams) ?? {};
  const query = String(params.q ?? "").trim();
  const status = String(params.status ?? "active");
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const pageSize = 12;

  const where = {
    ...(status === "deleted" ? { deletedAt: { not: null } } : { deletedAt: null }),
    ...(status && !["active", "deleted", "all"].includes(status) ? { status: status as "draft" | "published" | "archived" } : {}),
    ...(query
      ? {
          OR: [
            { slug: { contains: query, mode: "insensitive" as const } },
            { artist: { contains: query, mode: "insensitive" as const } }
          ]
        }
      : {})
  };

  const [items, total, categories] = await Promise.all([
    prisma.item.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        images: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          take: 1
        }
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.item.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, select: { id: true, slug: true, name: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] })
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminShell
      title="藏品管理"
      description="支持新增、编辑、软删除、搜索筛选分页、发布状态、推荐标记和媒体库图片管理。"
    >
      <div className="grid gap-6 py-6">
        <section className="grid gap-4 md:grid-cols-4">
          {[
            { label: "当前结果", value: total },
            { label: "本页显示", value: items.length },
            { label: "当前页", value: page },
            { label: "总页数", value: totalPages }
          ].map((item) => (
            <div key={item.label} className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
              <p className="text-sm text-[color:var(--muted)]">{t(item.label)}</p>
              <p className="mt-3 font-serif text-4xl font-light text-[color:var(--gold-dark)]">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <form className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_auto_auto]">
            <label className="min-w-0">
              <span className="sr-only">{t("搜索")}</span>
              <div className="flex min-h-12 items-center gap-3 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4">
                <Search aria-hidden size={17} className="shrink-0 text-[color:var(--gold-dark)]" />
                <input name="q" defaultValue={query} placeholder={t({ ja: "slug・作家を検索", zh: "搜索 slug、作家", en: "Search slug or artist" })} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[color:var(--muted)]/70" />
              </div>
            </label>
            <label>
              <span className="sr-only">{t("状态")}</span>
              <select name="status" defaultValue={status} className="h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
                <option value="active">{t({ ja: "未削除", zh: "未删除", en: "Not deleted" })}</option>
                <option value="published">{t({ ja: "公開済み", zh: "已发布", en: "Published" })}</option>
                <option value="draft">{t({ ja: "下書き", zh: "草稿", en: "Draft" })}</option>
                <option value="archived">{t({ ja: "アーカイブ", zh: "归档", en: "Archived" })}</option>
                <option value="deleted">{t({ ja: "削除済み", zh: "已删除", en: "Deleted" })}</option>
              </select>
            </label>
            <button className="inline-flex min-h-12 items-center justify-center gap-2 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)]">
              <Filter aria-hidden size={16} />
              {t("筛选")}
            </button>
            {readOnly ? (
              <span className="inline-flex min-h-12 items-center justify-center border border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)]">{t("只读")}</span>
            ) : (
              <Link href="/admin/items/new" className="inline-flex min-h-12 items-center justify-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 text-sm text-white">
                <Plus aria-hidden size={16} />
                {t("新增藏品")}
              </Link>
            )}
          </form>
        </section>

        <section className="overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] px-5 py-4">
            <h2 className="font-serif text-2xl font-light">{t({ ja: "蔵品一覧", zh: "藏品列表", en: "Item List" })}</h2>
            <p className="text-sm text-[color:var(--muted)]">{t({ ja: "並び順と更新時刻で表示します。編集から三語フォームへ進みます。", zh: "按排序值和更新时间显示，编辑入口进入完整三语表单。", en: "Shown by sort order and update time. Edit opens the full trilingual form." })}</p>
          </div>

          <form id="bulk-items-form" action={bulkUpdateItemsAction} className="border-b border-[color:var(--border)] bg-[color:var(--ivory)] p-4">
            <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)_auto]">
              <select name="operation" disabled={readOnly} className="h-11 border border-[color:var(--border)] bg-[color:var(--paper)] px-3 text-sm outline-none disabled:opacity-70">
                <option value="publish">{t({ ja: "一括公開", zh: "批量发布", en: "Bulk publish" })}</option>
                <option value="draft">{t({ ja: "一括下書き化", zh: "批量下架为草稿", en: "Bulk set draft" })}</option>
                <option value="archive">{t({ ja: "一括アーカイブ", zh: "批量归档", en: "Bulk archive" })}</option>
                <option value="category">{t({ ja: "一括分類", zh: "批量分类", en: "Bulk category" })}</option>
              </select>
              <select name="categoryId" disabled={readOnly} className="h-11 border border-[color:var(--border)] bg-[color:var(--paper)] px-3 text-sm outline-none disabled:opacity-70">
                <option value="">{t({ ja: "分類：未設定 / クリア", zh: "分类：不设置 / 清空", en: "Category: unset / clear" })}</option>
                {categories.map((category) => {
                  const name = localizedName(category.name);
                  return <option key={category.id.toString()} value={category.id.toString()}>{localizedValue(name, locale, category.slug)}</option>;
                })}
              </select>
              <button disabled={readOnly} className="min-h-11 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)] disabled:opacity-60">{t({ ja: "一括操作を実行", zh: "执行批量操作", en: "Run bulk action" })}</button>
            </div>
            <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">{t({ ja: "下の蔵品を選択して実行します。公開時は現在時刻を公開日時として保存し、分類操作は右側の分類値を使用します。", zh: "勾选下方藏品后执行；发布会写入当前时间作为公开时间，分类操作使用右侧分类值。", en: "Select items below before running. Publish writes the current time as the publish time; category actions use the selected category." })}</p>
          </form>

          <div className="grid gap-0">
            {items.length ? items.map((item) => {
              const name = localizedName(item.name);
              const category = localizedName(item.category?.name);
              const image = item.images[0];
              return (
                <article key={item.id.toString()} className="grid min-w-0 gap-4 border-b border-[color:var(--border)] p-5 last:border-b-0 lg:grid-cols-[96px_minmax(0,1fr)_170px_220px]">
                  <div className="flex items-start gap-3">
                    <input form="bulk-items-form" name="ids" value={item.id.toString()} type="checkbox" className="mt-1 size-5 accent-[color:var(--gold)]" />
                    <div className="relative h-24 w-24 overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory)]">
                      {image ? (
                        <Image src={image.urlWebp || image.urlThumb || image.url} alt={localizedValue(name, locale, item.slug)} fill sizes="96px" className="object-cover" unoptimized />
                      ) : (
                        <div className="grid h-full place-items-center text-[color:var(--gold-dark)]">
                          <ImageIcon aria-hidden size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="border border-[color:var(--gold)] px-2 py-1 text-[color:var(--gold-dark)]">{statusLabel(item.status, item.deletedAt, locale)}</span>
                      {item.isNew ? <span className="border border-[color:var(--border)] px-2 py-1 text-[color:var(--muted)]">{t({ ja: "新入荷", zh: "新到", en: "New" })}</span> : null}
                      {item.isFeatured ? <span className="border border-[color:var(--border)] px-2 py-1 text-[color:var(--muted)]">{t({ ja: "特選", zh: "精选", en: "Featured" })}</span> : null}
                      {item.showOnHome ? <span className="border border-[color:var(--border)] px-2 py-1 text-[color:var(--muted)]">{t({ ja: "ホーム表示", zh: "首页", en: "Home" })}</span> : null}
                    </div>
                    <h3 className="mt-3 break-words font-serif text-2xl font-light">{localizedValue(name, locale, item.slug)}</h3>
                    <p className="mt-2 break-words text-sm text-[color:var(--muted)]">{item.slug}</p>
                  </div>
                  <dl className="grid content-start gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-[color:var(--gold-dark)]">{t("分类")}</dt>
                      <dd className="mt-1 break-words text-[color:var(--muted)]">{localizedValue(category, locale, item.category?.slug ?? t("未分类"))}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[color:var(--gold-dark)]">{t("排序")}</dt>
                      <dd className="mt-1 text-[color:var(--muted)]">{item.sortOrder}</dd>
                    </div>
                  </dl>
                  <div className="flex flex-wrap content-start gap-2 lg:justify-end">
                    <Link href={`/${locale}/item/${item.slug}`} className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted)] hover:border-[color:var(--gold)]">
                      <Eye aria-hidden size={15} />
                      {t("预览")}
                    </Link>
                    {readOnly ? null : (
                      <Link href={`/admin/items/${item.id.toString()}/edit`} className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--gold)] px-3 text-sm text-[color:var(--gold-dark)] hover:bg-[color:var(--gold)] hover:text-white">
                        <FilePenLine aria-hidden size={15} />
                        {t("编辑")}
                      </Link>
                    )}
                    {!readOnly ? (
                      <form action={duplicateItemAction}>
                        <input type="hidden" name="id" value={item.id.toString()} />
                        <button className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted)]">
                          <Copy aria-hidden size={15} />
                          {t("复制")}
                        </button>
                      </form>
                    ) : null}
                    {!readOnly && !item.deletedAt ? (
                      <form action={softDeleteItemAction}>
                        <input type="hidden" name="id" value={item.id.toString()} />
                        <button className="inline-flex min-h-10 items-center border border-[color:var(--red-seal)] px-3 text-sm text-[color:var(--red-seal)]">{t("软删除")}</button>
                      </form>
                    ) : null}
                  </div>
                </article>
              );
            }) : (
              <p className="p-8 text-sm text-[color:var(--muted)]">{t({ ja: "条件に一致する蔵品はありません。", zh: "没有符合条件的藏品。", en: "No matching items." })}</p>
            )}
          </div>
        </section>

        <nav className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <Link
              key={pageNumber}
              href={`/admin/items?q=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}&page=${pageNumber}`}
              className={`flex size-11 items-center justify-center border text-sm ${
                pageNumber === page ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-white" : "border-[color:var(--border)] bg-[color:var(--paper)] text-[color:var(--ink)]"
              }`}
            >
              {pageNumber}
            </Link>
          ))}
        </nav>
      </div>
    </AdminShell>
  );
}
