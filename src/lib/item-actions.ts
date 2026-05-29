"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireContentEditor } from "@/lib/admin-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { languages, type Language } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

const itemStatusSchema = z.enum(["draft", "published", "archived"]);
const priceDisplaySchema = z.enum(["show", "inquiry", "hidden"]);

const itemSchema = z.object({
  id: z.string().trim().optional(),
  slug: z.string().trim().min(2).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().trim().optional(),
  artist: z.string().trim().optional(),
  dimensions: z.string().trim().optional(),
  weight: z.string().trim().optional(),
  price: z.string().trim().optional(),
  currency: z.string().trim().min(3).max(3),
  priceDisplay: priceDisplaySchema,
  status: itemStatusSchema,
  publishedAt: z.string().trim().optional(),
  isNew: z.boolean(),
  isFeatured: z.boolean(),
  showOnHome: z.boolean(),
  sortOrder: z.coerce.number().int(),
  name: z.record(z.enum(languages), z.string().trim().min(1)),
  description: z.record(z.enum(languages), z.string().trim().optional()),
  era: z.record(z.enum(languages), z.string().trim().optional()),
  origin: z.record(z.enum(languages), z.string().trim().optional()),
  condition: z.record(z.enum(languages), z.string().trim().optional()),
  metaTitle: z.record(z.enum(languages), z.string().trim().optional()),
  metaDescription: z.record(z.enum(languages), z.string().trim().optional())
});

function localizedField(formData: FormData, field: string) {
  return languages.reduce(
    (acc, lang) => {
      acc[lang] = String(formData.get(`${field}_${lang}`) ?? "").trim();
      return acc;
    },
    {} as Record<Language, string>
  );
}

function parseImages(formData: FormData) {
  const count = z.coerce.number().int().min(0).max(24).parse(formData.get("imageCount") ?? 0);
  return Array.from({ length: count }, (_, index) => {
    const mediaId = String(formData.get(`image_${index}_mediaId`) ?? "").trim();
    const url = String(formData.get(`image_${index}_url`) ?? "").trim();
    const urlWebp = String(formData.get(`image_${index}_urlWebp`) ?? "").trim();
    const urlThumb = String(formData.get(`image_${index}_urlThumb`) ?? "").trim();
    const altText = localizedField(formData, `image_${index}_altText`);

    return {
      mediaId: mediaId ? BigInt(mediaId) : null,
      url,
      urlWebp: urlWebp || null,
      urlThumb: urlThumb || null,
      altText,
      isPrimary: index === 0,
      sortOrder: index
    };
  }).filter((image) => image.url);
}

function parseItemForm(formData: FormData) {
  return itemSchema.parse({
    id: formData.get("id"),
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    artist: formData.get("artist"),
    dimensions: formData.get("dimensions"),
    weight: formData.get("weight"),
    price: formData.get("price"),
    currency: formData.get("currency") || "JPY",
    priceDisplay: formData.get("priceDisplay"),
    status: formData.get("status"),
    publishedAt: formData.get("publishedAt"),
    isNew: formData.get("isNew") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    showOnHome: formData.get("showOnHome") === "on",
    sortOrder: formData.get("sortOrder") || 0,
    name: localizedField(formData, "name"),
    description: localizedField(formData, "description"),
    era: localizedField(formData, "era"),
    origin: localizedField(formData, "origin"),
    condition: localizedField(formData, "condition"),
    metaTitle: localizedField(formData, "metaTitle"),
    metaDescription: localizedField(formData, "metaDescription")
  });
}

function parsePublishedAt(value: string | undefined, status: "draft" | "published" | "archived") {
  if (!value) {
    return status === "published" ? new Date() : null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function refreshItemPaths(slug: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/items");
  for (const lang of languages) {
    revalidatePath(`/${lang}`);
    revalidatePath(`/${lang}/collection`);
    revalidatePath(`/${lang}/new-arrivals`);
    revalidatePath(`/${lang}/item/${slug}`);
  }
}

export async function saveItemAction(formData: FormData) {
  const session = await requireContentEditor();
  const values = parseItemForm(formData);
  const images = parseImages(formData);
  const id = values.id ? BigInt(values.id) : null;
  const beforeData = id
    ? await prisma.item.findUnique({ where: { id }, include: { images: true } })
    : null;
  const categoryId = values.categoryId ? BigInt(values.categoryId) : null;
  const price = values.price ? values.price.replace(/[^\d]/g, "") : "";
  const publishedAt = parsePublishedAt(values.publishedAt, values.status);

  const saved = await prisma.$transaction(async (tx) => {
    const item = id
      ? await tx.item.update({
          where: { id },
          data: {
            slug: values.slug,
            name: values.name,
            description: values.description,
            era: values.era,
            origin: values.origin,
            artist: values.artist || null,
            dimensions: values.dimensions || null,
            weight: values.weight || null,
            condition: values.condition,
            price: price ? price : null,
            currency: values.currency,
            priceDisplay: values.priceDisplay,
            categoryId,
            status: values.status,
            publishedAt,
            isNew: values.isNew,
            isFeatured: values.isFeatured,
            showOnHome: values.showOnHome,
            sortOrder: values.sortOrder,
            metaTitle: values.metaTitle,
            metaDescription: values.metaDescription,
            ogImage: images[0]?.urlWebp || images[0]?.url || null,
            deletedAt: null
          }
        })
      : await tx.item.create({
          data: {
            slug: values.slug,
            name: values.name,
            description: values.description,
            era: values.era,
            origin: values.origin,
            artist: values.artist || null,
            dimensions: values.dimensions || null,
            weight: values.weight || null,
            condition: values.condition,
            price: price ? price : null,
            currency: values.currency,
            priceDisplay: values.priceDisplay,
            categoryId,
            status: values.status,
            publishedAt,
            isNew: values.isNew,
            isFeatured: values.isFeatured,
            showOnHome: values.showOnHome,
            sortOrder: values.sortOrder,
            metaTitle: values.metaTitle,
            metaDescription: values.metaDescription,
            ogImage: images[0]?.urlWebp || images[0]?.url || null
          }
        });

    await tx.itemImage.deleteMany({ where: { itemId: item.id } });
    if (images.length) {
      await tx.itemImage.createMany({
        data: images.map((image) => ({ ...image, itemId: item.id }))
      });
    }

    return item;
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: beforeData ? "item_updated" : "item_created",
    targetType: "item",
    targetId: saved.id.toString(),
    beforeData,
    afterData: { ...saved, imageCount: images.length }
  });

  refreshItemPaths(values.slug);
  redirect("/admin/items");
}

export async function softDeleteItemAction(formData: FormData) {
  const session = await requireContentEditor();
  const id = z.coerce.bigint().parse(formData.get("id"));
  const beforeData = await prisma.item.findUnique({ where: { id }, include: { images: true } });

  if (!beforeData) {
    throw new Error("藏品不存在。");
  }

  const saved = await prisma.item.update({
    where: { id },
    data: { deletedAt: new Date(), status: "archived" }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "item_soft_deleted",
    targetType: "item",
    targetId: id.toString(),
    beforeData,
    afterData: saved
  });

  refreshItemPaths(beforeData.slug);
  redirect("/admin/items");
}

const bulkItemSchema = z.object({
  ids: z.array(z.coerce.bigint()).min(1),
  operation: z.enum(["publish", "draft", "archive", "category"]),
  categoryId: z.string().trim().optional()
});

export async function bulkUpdateItemsAction(formData: FormData) {
  const session = await requireContentEditor();
  const values = bulkItemSchema.parse({
    ids: formData.getAll("ids"),
    operation: formData.get("operation"),
    categoryId: formData.get("categoryId")
  });
  const beforeData = await prisma.item.findMany({ where: { id: { in: values.ids } }, select: { id: true, slug: true, status: true, categoryId: true } });
  const data =
    values.operation === "category"
      ? { categoryId: values.categoryId ? BigInt(values.categoryId) : null }
      : {
          status: values.operation === "publish" ? "published" as const : values.operation === "draft" ? "draft" as const : "archived" as const,
          ...(values.operation === "publish" ? { publishedAt: new Date() } : {})
        };

  await prisma.item.updateMany({ where: { id: { in: values.ids }, deletedAt: null }, data });
  await writeAuditLog({
    adminUserId: session.user.id,
    action: "items_bulk_updated",
    targetType: "item",
    targetId: values.ids.map(String).join(","),
    beforeData,
    afterData: { operation: values.operation, data }
  });

  revalidatePath("/admin/items");
  for (const lang of languages) {
    revalidatePath(`/${lang}/collection`);
    revalidatePath(`/${lang}/new-arrivals`);
  }
}

export async function duplicateItemAction(formData: FormData) {
  const session = await requireContentEditor();
  const id = z.coerce.bigint().parse(formData.get("id"));
  const source = await prisma.item.findUnique({ where: { id }, include: { images: true } });
  if (!source) {
    throw new Error("藏品不存在。");
  }

  const copySlug = `${source.slug}-copy-${Date.now().toString(36)}`;
  const saved = await prisma.item.create({
    data: {
      slug: copySlug,
      name: source.name ?? {},
      description: source.description ?? {},
      era: source.era ?? {},
      origin: source.origin ?? {},
      artist: source.artist,
      dimensions: source.dimensions,
      weight: source.weight,
      condition: source.condition ?? {},
      price: source.price,
      currency: source.currency,
      priceDisplay: source.priceDisplay,
      categoryId: source.categoryId,
      status: "draft",
      isNew: false,
      isFeatured: false,
      showOnHome: false,
      sortOrder: source.sortOrder + 1,
      metaTitle: source.metaTitle ?? {},
      metaDescription: source.metaDescription ?? {},
      ogImage: source.ogImage,
      images: {
        create: source.images.map((image) => ({
          mediaId: image.mediaId,
          url: image.url,
          urlWebp: image.urlWebp,
          urlThumb: image.urlThumb,
          altText: image.altText ?? {},
          isPrimary: image.isPrimary,
          sortOrder: image.sortOrder
        }))
      }
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "item_duplicated",
    targetType: "item",
    targetId: saved.id.toString(),
    beforeData: { sourceId: source.id, sourceSlug: source.slug },
    afterData: saved
  });

  revalidatePath("/admin/items");
  redirect(`/admin/items/${saved.id.toString()}/edit`);
}
