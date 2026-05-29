import type { Metadata } from "next";
import { AdminItemForm } from "@/components/admin-item-form";
import { AdminShell } from "@/components/admin-shell";
import { adminMediaAlt } from "@/lib/admin-media";
import { requireContentEditor } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "新增藏品 | 玉林軒 CMS",
  description: "新增玉林軒株式会社藏品。"
};

function localized(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as { ja?: string; zh?: string; en?: string } : {};
}

export default async function AdminItemNewPage() {
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
      title="新增藏品"
      description="创建三语藏品记录，设置分类、价格显示、发布状态、推荐标记和媒体库图片。"
    >
      <AdminItemForm mode="new" categories={categories} media={media} />
    </AdminShell>
  );
}
