import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminItemForm } from "@/components/admin-item-form";
import { AdminShell } from "@/components/admin-shell";
import { adminMediaAlt } from "@/lib/admin-media";
import { requireContentEditor } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "编辑藏品 | 玉林軒 CMS",
  description: "编辑玉林軒株式会社藏品。"
};

function localized(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as { ja?: string; zh?: string; en?: string } : {};
}

export default async function AdminItemEditPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireContentEditor();
  const { id } = await params;
  const itemId = BigInt(id);
  const [item, categoryRows, mediaRows] = await Promise.all([
    prisma.item.findUnique({
      where: { id: itemId },
      include: { images: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } }
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

  if (!item) {
    notFound();
  }

  const categories = categoryRows.map((category) => ({
    id: category.id.toString(),
    slug: category.slug,
    name: localized(category.name)
  }));
  const media = mediaRows.map((row) => ({ ...row, id: row.id.toString(), altText: adminMediaAlt(row.altText) }));
  const formItem = {
    id: item.id.toString(),
    slug: item.slug,
    name: localized(item.name),
    description: localized(item.description),
    era: localized(item.era),
    origin: localized(item.origin),
    condition: localized(item.condition),
    artist: item.artist,
    dimensions: item.dimensions,
    weight: item.weight,
    price: item.price?.toString() ?? "",
    currency: item.currency,
    priceDisplay: item.priceDisplay,
    categoryId: item.categoryId?.toString() ?? "",
    status: item.status,
    publishedAt: item.publishedAt ? item.publishedAt.toISOString().slice(0, 16) : "",
    isNew: item.isNew,
    isFeatured: item.isFeatured,
    showOnHome: item.showOnHome,
    sortOrder: item.sortOrder,
    metaTitle: localized(item.metaTitle),
    metaDescription: localized(item.metaDescription),
    images: item.images.map((image) => ({
      id: image.id.toString(),
      mediaId: image.mediaId?.toString() ?? null,
      url: image.url,
      urlWebp: image.urlWebp,
      urlThumb: image.urlThumb,
      altText: localized(image.altText)
    }))
  };

  return (
    <AdminShell
      title="编辑藏品"
      description="更新藏品三语内容、分类、价格、发布状态、推荐标记、图片排序和 alt 文本。"
    >
      <AdminItemForm mode="edit" item={formItem} categories={categories} media={media} />
    </AdminShell>
  );
}
