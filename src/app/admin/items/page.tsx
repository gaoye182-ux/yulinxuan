import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { Copy, Eye, FilePenLine, Filter, ImageIcon, Plus, Search } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { bulkUpdateItemsAction, duplicateItemAction, softDeleteItemAction } from "@/lib/item-actions";
import { requireAdmin } from "@/lib/admin-auth";
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

function statusLabel(status: string, deletedAt?: Date | null) {
  if (deletedAt) {
    return "已删除";
  }
  if (status === "published") {
    return "已发布";
  }
  if (status === "archived") {
    return "归档";
  }
  return "草稿";
}

export default async function AdminItemsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  noStore();
  const session = await requireAdmin();
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
              <p className="text-sm text-[color:var(--muted)]">{item.label}</p>
              <p className="mt-3 font-serif text-4xl font-light text-[color:var(--gold-dark)]">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <form className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_auto_auto]">
            <label className="min-w-0">
              <span className="sr-only">搜索</span>
              <div className="flex min-h-12 items-center gap-3 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4">
                <Search aria-hidden size={17} className="shrink-0 text-[color:var(--gold-dark)]" />
                <input name="q" defaultValue={query} placeholder="搜索 slug、作家" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[color:var(--muted)]/70" />
              </div>
            </label>
            <label>
              <span className="sr-only">状态</span>
              <select name="status" defaultValue={status} className="h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
                <option value="active">未删除</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
                <option value="archived">归档</option>
                <option value="deleted">已删除</option>
              </select>
            </label>
            <button className="inline-flex min-h-12 items-center justify-center gap-2 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)]">
              <Filter aria-hidden size={16} />
              筛选
            </button>
            {readOnly ? (
              <span className="inline-flex min-h-12 items-center justify-center border border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)]">只读</span>
            ) : (
              <Link href="/admin/items/new" className="inline-flex min-h-12 items-center justify-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 text-sm text-white">
                <Plus aria-hidden size={16} />
                新增藏品
              </Link>
            )}
          </form>
        </section>

        <section className="overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] px-5 py-4">
            <h2 className="font-serif text-2xl font-light">藏品列表</h2>
            <p className="text-sm text-[color:var(--muted)]">按排序值和更新时间显示，编辑入口进入完整三语表单。</p>
          </div>

          <form id="bulk-items-form" action={bulkUpdateItemsAction} className="border-b border-[color:var(--border)] bg-[color:var(--ivory)] p-4">
            <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)_auto]">
              <select name="operation" disabled={readOnly} className="h-11 border border-[color:var(--border)] bg-[color:var(--paper)] px-3 text-sm outline-none disabled:opacity-70">
                <option value="publish">批量发布</option>
                <option value="draft">批量下架为草稿</option>
                <option value="archive">批量归档</option>
                <option value="category">批量分类</option>
              </select>
              <select name="categoryId" disabled={readOnly} className="h-11 border border-[color:var(--border)] bg-[color:var(--paper)] px-3 text-sm outline-none disabled:opacity-70">
                <option value="">分类：不设置 / 清空</option>
                {categories.map((category) => {
                  const name = localizedName(category.name);
                  return <option key={category.id.toString()} value={category.id.toString()}>{name.ja ?? category.slug}</option>;
                })}
              </select>
              <button disabled={readOnly} className="min-h-11 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)] disabled:opacity-60">执行批量操作</button>
            </div>
            <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">勾选下方藏品后执行；发布会写入当前时间作为公开时间，分类操作使用右侧分类值。</p>
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
                        <Image src={image.urlWebp || image.urlThumb || image.url} alt={name.ja ?? item.slug} fill sizes="96px" className="object-cover" unoptimized />
                      ) : (
                        <div className="grid h-full place-items-center text-[color:var(--gold-dark)]">
                          <ImageIcon aria-hidden size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="border border-[color:var(--gold)] px-2 py-1 text-[color:var(--gold-dark)]">{statusLabel(item.status, item.deletedAt)}</span>
                      {item.isNew ? <span className="border border-[color:var(--border)] px-2 py-1 text-[color:var(--muted)]">新入荷</span> : null}
                      {item.isFeatured ? <span className="border border-[color:var(--border)] px-2 py-1 text-[color:var(--muted)]">特选</span> : null}
                      {item.showOnHome ? <span className="border border-[color:var(--border)] px-2 py-1 text-[color:var(--muted)]">首页</span> : null}
                    </div>
                    <h3 className="mt-3 break-words font-serif text-2xl font-light">{name.ja ?? item.slug}</h3>
                    <p className="mt-2 break-words text-sm text-[color:var(--muted)]">{item.slug}</p>
                  </div>
                  <dl className="grid content-start gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-[color:var(--gold-dark)]">分类</dt>
                      <dd className="mt-1 break-words text-[color:var(--muted)]">{category.ja ?? item.category?.slug ?? "未分类"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[color:var(--gold-dark)]">排序</dt>
                      <dd className="mt-1 text-[color:var(--muted)]">{item.sortOrder}</dd>
                    </div>
                  </dl>
                  <div className="flex flex-wrap content-start gap-2 lg:justify-end">
                    <Link href={`/ja/item/${item.slug}`} className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted)] hover:border-[color:var(--gold)]">
                      <Eye aria-hidden size={15} />
                      预览
                    </Link>
                    {readOnly ? null : (
                      <Link href={`/admin/items/${item.id.toString()}/edit`} className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--gold)] px-3 text-sm text-[color:var(--gold-dark)] hover:bg-[color:var(--gold)] hover:text-white">
                        <FilePenLine aria-hidden size={15} />
                        编辑
                      </Link>
                    )}
                    {!readOnly ? (
                      <form action={duplicateItemAction}>
                        <input type="hidden" name="id" value={item.id.toString()} />
                        <button className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted)]">
                          <Copy aria-hidden size={15} />
                          复制
                        </button>
                      </form>
                    ) : null}
                    {!readOnly && !item.deletedAt ? (
                      <form action={softDeleteItemAction}>
                        <input type="hidden" name="id" value={item.id.toString()} />
                        <button className="inline-flex min-h-10 items-center border border-[color:var(--red-seal)] px-3 text-sm text-[color:var(--red-seal)]">软删除</button>
                      </form>
                    ) : null}
                  </div>
                </article>
              );
            }) : (
              <p className="p-8 text-sm text-[color:var(--muted)]">没有符合条件的藏品。</p>
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
