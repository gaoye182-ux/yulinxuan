import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { EyeOff, FilePenLine, Filter, FolderTree, ImageIcon, Plus, Search } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { disableCategoryAction } from "@/lib/category-actions";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText, type AdminLocale, type AdminText } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "分类管理 | 玉林軒 CMS",
  description: "管理玉林軒株式会社藏品分类、封面图、层级、排序和首页展示。"
};

function localizedName(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as { ja?: string; zh?: string; en?: string };
  }

  return {};
}

function localizedValue(value: { ja?: string; zh?: string; en?: string }, locale: AdminLocale, fallback = "") {
  return value[locale] || value.ja || value.zh || value.en || fallback;
}

export default async function AdminCategoriesPage({
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
    ...(status === "active" ? { isActive: true } : status === "inactive" ? { isActive: false } : {}),
    ...(query
      ? {
          OR: [
            { slug: { contains: query, mode: "insensitive" as const } }
          ]
        }
      : {})
  };

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      include: {
        parent: { select: { slug: true, name: true } },
        coverMedia: true,
        _count: { select: { items: true, children: true } }
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.category.count({ where })
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminShell
      title="分类管理"
      description="支持分类新增、编辑、父子级、三语名称/说明、封面媒体库选择、首页展示开关、启用状态、排序与停用。"
      action={readOnly ? undefined : { href: "/admin/categories/new", label: "新增分类" }}
    >
      <div className="grid gap-6 py-6">
        <section className="grid gap-4 md:grid-cols-4">
          {[
            { label: "当前结果", value: total },
            { label: "本页显示", value: categories.length },
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
                <input name="q" defaultValue={query} placeholder={t({ ja: "slug を検索", zh: "搜索 slug", en: "Search slug" })} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[color:var(--muted)]/70" />
              </div>
            </label>
            <label>
              <span className="sr-only">{t("状态")}</span>
              <select name="status" defaultValue={status} className="h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
                <option value="active">{t("启用")}</option>
                <option value="inactive">{t("停用")}</option>
                <option value="all">{t("全部")}</option>
              </select>
            </label>
            <button className="inline-flex min-h-12 items-center justify-center gap-2 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)]">
              <Filter aria-hidden size={16} />
              {t("筛选")}
            </button>
            {readOnly ? (
              <span className="inline-flex min-h-12 items-center justify-center border border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)]">{t("只读")}</span>
            ) : (
              <Link href="/admin/categories/new" className="inline-flex min-h-12 items-center justify-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 text-sm text-white">
                <Plus aria-hidden size={16} />
                {t("新增分类")}
              </Link>
            )}
          </form>
        </section>

        <section className="overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] px-5 py-4">
            <h2 className="font-serif text-2xl font-light">{t({ ja: "分類一覧", zh: "分类列表", en: "Category List" })}</h2>
            <p className="text-sm text-[color:var(--muted)]">{t({ ja: "ホーム表示とフロントサイトのフィルターは有効な分類のみを読み込みます。", zh: "首页展示和前台筛选只读取启用分类。", en: "Home display and frontend filters only use active categories." })}</p>
          </div>

          <div className="grid gap-0">
            {categories.length ? categories.map((category) => {
              const name = localizedName(category.name);
              const description = localizedName(category.description);
              const parent = localizedName(category.parent?.name);
              const imageUrl = category.coverMedia?.urlThumb || category.coverMedia?.urlWebp || category.coverMedia?.url;
              return (
                <article key={category.id.toString()} className="grid min-w-0 gap-4 border-b border-[color:var(--border)] p-5 last:border-b-0 lg:grid-cols-[96px_minmax(0,1fr)_190px_220px]">
                  <div className="relative h-24 w-24 overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory)]">
                    {imageUrl ? (
                      <Image src={imageUrl} alt={localizedValue(name, locale, category.slug)} fill sizes="96px" className="object-cover" unoptimized />
                    ) : (
                      <div className="grid h-full place-items-center text-[color:var(--gold-dark)]">
                        <ImageIcon aria-hidden size={24} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`border px-2 py-1 ${category.isActive ? "border-[color:var(--gold)] text-[color:var(--gold-dark)]" : "border-[color:var(--red-seal)] text-[color:var(--red-seal)]"}`}>
                        {category.isActive ? t("启用") : t("停用")}
                      </span>
                      {category.showOnHome ? <span className="border border-[color:var(--border)] px-2 py-1 text-[color:var(--muted)]">{t({ ja: "ホーム表示", zh: "首页展示", en: "Home display" })}</span> : null}
                      {category.parent ? <span className="border border-[color:var(--border)] px-2 py-1 text-[color:var(--muted)]">{t({ ja: "子分類", zh: "子分类", en: "Child category" })}</span> : null}
                    </div>
                    <h3 className="mt-3 break-words font-serif text-2xl font-light">{localizedValue(name, locale, category.slug)}</h3>
                    <p className="mt-2 break-words text-sm text-[color:var(--muted)]">{localizedValue(description, locale, category.slug)}</p>
                  </div>
                  <dl className="grid content-start gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-[color:var(--gold-dark)]">Slug</dt>
                      <dd className="mt-1 break-words text-[color:var(--muted)]">{category.slug}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[color:var(--gold-dark)]">{t("父级")}</dt>
                      <dd className="mt-1 break-words text-[color:var(--muted)]">{localizedValue(parent, locale, category.parent?.slug ?? "-")}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[color:var(--gold-dark)]">{t("关联")}</dt>
                      <dd className="mt-1 text-[color:var(--muted)]">
                        {t({ ja: `${category._count.items} 蔵品 / ${category._count.children} 子分類`, zh: `${category._count.items} 藏品 / ${category._count.children} 子类`, en: `${category._count.items} items / ${category._count.children} children` })}
                      </dd>
                    </div>
                  </dl>
                  <div className="flex flex-wrap content-start gap-2 lg:justify-end">
                    <Link href={`/${locale}/collection/${category.slug}`} className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted)] hover:border-[color:var(--gold)]">
                      <FolderTree aria-hidden size={15} />
                      {t("前台")}
                    </Link>
                    {readOnly ? null : (
                      <Link href={`/admin/categories/${category.id.toString()}/edit`} className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--gold)] px-3 text-sm text-[color:var(--gold-dark)] hover:bg-[color:var(--gold)] hover:text-white">
                        <FilePenLine aria-hidden size={15} />
                        {t("编辑")}
                      </Link>
                    )}
                    {!readOnly && category.isActive ? (
                      <form action={disableCategoryAction}>
                        <input type="hidden" name="id" value={category.id.toString()} />
                        <button className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--red-seal)] px-3 text-sm text-[color:var(--red-seal)]">
                          <EyeOff aria-hidden size={15} />
                          {t("停用")}
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              );
            }) : (
              <p className="p-8 text-sm text-[color:var(--muted)]">{t({ ja: "条件に一致する分類はありません。", zh: "没有符合条件的分类。", en: "No matching categories." })}</p>
            )}
          </div>
        </section>

        <nav className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <Link
              key={pageNumber}
              href={`/admin/categories?q=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}&page=${pageNumber}`}
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
