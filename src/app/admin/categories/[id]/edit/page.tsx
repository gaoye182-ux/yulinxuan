import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminCategoryForm } from "@/components/admin-category-form";
import { AdminShell } from "@/components/admin-shell";
import { adminMediaAlt } from "@/lib/admin-media";
import { requireContentEditor } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "编辑分类 | 玉林軒 CMS",
  description: "编辑玉林軒株式会社藏品分类。"
};

function localized(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as { ja?: string; zh?: string; en?: string } : {};
}

export default async function AdminCategoryEditPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireContentEditor();
  const { id } = await params;
  const categoryId = BigInt(id);
  const [category, categoryRows, mediaRows] = await Promise.all([
    prisma.category.findUnique({
      where: { id: categoryId },
      include: { coverMedia: true }
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, slug: true, name: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    }),
    prisma.media.findMany({
      select: { id: true, url: true, urlWebp: true, urlThumb: true, originalName: true, filename: true, altText: true },
      orderBy: { createdAt: "desc" },
      take: 120
    })
  ]);

  if (!category) {
    notFound();
  }

  const categories = categoryRows.map((entry) => ({
    id: entry.id.toString(),
    slug: entry.slug,
    name: localized(entry.name)
  }));
  const media = mediaRows.map((item) => ({ ...item, id: item.id.toString(), altText: adminMediaAlt(item.altText) }));
  const coverMedia = category.coverMedia
    ? {
        id: category.coverMedia.id.toString(),
        url: category.coverMedia.url,
        urlWebp: category.coverMedia.urlWebp,
        urlThumb: category.coverMedia.urlThumb,
        originalName: category.coverMedia.originalName,
        filename: category.coverMedia.filename,
        altText: adminMediaAlt(category.coverMedia.altText)
      }
    : null;
  const formCategory = {
    id: category.id.toString(),
    slug: category.slug,
    name: localized(category.name),
    description: localized(category.description),
    parentId: category.parentId?.toString() ?? "",
    coverMediaId: category.coverMediaId?.toString() ?? "",
    coverMedia,
    isActive: category.isActive,
    showOnHome: category.showOnHome,
    sortOrder: category.sortOrder
  };

  return (
    <AdminShell
      title="编辑分类"
      description="更新分类三语内容、父级、封面图、排序、启用状态和首页展示。"
    >
      <AdminCategoryForm mode="edit" category={formCategory} categories={categories} media={media} />
    </AdminShell>
  );
}
