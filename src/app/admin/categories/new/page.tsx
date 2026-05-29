import type { Metadata } from "next";
import { AdminCategoryForm } from "@/components/admin-category-form";
import { AdminShell } from "@/components/admin-shell";
import { adminMediaAlt } from "@/lib/admin-media";
import { requireContentEditor } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "新增分类 | 玉林軒 CMS",
  description: "新增玉林軒株式会社藏品分类。"
};

function localized(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as { ja?: string; zh?: string; en?: string } : {};
}

export default async function AdminCategoryNewPage() {
  await requireContentEditor();
  const [categoryRows, mediaRows] = await Promise.all([
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
  const categories = categoryRows.map((category) => ({
    id: category.id.toString(),
    slug: category.slug,
    name: localized(category.name)
  }));
  const media = mediaRows.map((item) => ({ ...item, id: item.id.toString(), altText: adminMediaAlt(item.altText) }));

  return (
    <AdminShell
      title="新增分类"
      description="创建三语分类，设置父级、封面图、排序、启用状态和首页展示。"
    >
      <AdminCategoryForm mode="new" categories={categories} media={media} />
    </AdminShell>
  );
}
