"use server";

import { revalidatePath } from "next/cache";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireContentEditor } from "@/lib/admin-auth";
import { languages, type Language } from "@/lib/i18n";
import { writeAuditLog } from "@/lib/audit-log";

const maxUploadBytes = 5 * 1024 * 1024;
const uploadDir = path.join(process.cwd(), "public", "uploads", "media");
const publicUploadBase = "/uploads/media";
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
const extensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heic"
};

const mediaSchema = z.object({
  url: z.string().trim().min(1).max(2048),
  originalName: z.string().trim().max(255).optional(),
  mimeType: z.string().trim().max(100).optional(),
  altText: z.record(z.enum(languages), z.string().trim().optional())
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

function filenameFromUrl(url: string) {
  try {
    const parsed = new URL(url, "https://gyokurinken.local");
    return parsed.pathname.split("/").filter(Boolean).pop() || "media-url";
  } catch {
    return "media-url";
  }
}

function slugPart(value: string) {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "media";
}

function mediaPaths(filename: string) {
  return {
    disk: path.join(uploadDir, filename),
    public: `${publicUploadBase}/${filename}`
  };
}

async function processImage(buffer: Buffer, baseName: string, originalExtension: string) {
  const sharpModule = await import("sharp");
  const sharp = sharpModule.default;
  const originalFilename = `${baseName}.${originalExtension}`;
  const webpFilename = `${baseName}.webp`;
  const thumbFilename = `${baseName}-thumb.webp`;
  const original = mediaPaths(originalFilename);
  const webp = mediaPaths(webpFilename);
  const thumb = mediaPaths(thumbFilename);

  const image = sharp(buffer, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  await mkdir(uploadDir, { recursive: true });

  await Promise.all([
    writeFile(original.disk, buffer),
    sharp(buffer, { failOn: "none" })
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(webp.disk),
    sharp(buffer, { failOn: "none" })
      .rotate()
      .resize(480, 360, { fit: "cover" })
      .webp({ quality: 76 })
      .toFile(thumb.disk)
  ]);

  return {
    filename: originalFilename,
    url: original.public,
    urlWebp: webp.public,
    urlThumb: thumb.public,
    width: metadata.width ?? null,
    height: metadata.height ?? null
  };
}

async function mediaReferenceCount(id: bigint, urls: string[]) {
  const [categories, itemImages, blogPosts, pageBlocks, news] = await Promise.all([
    prisma.category.count({ where: { coverMediaId: id } }),
    prisma.itemImage.count({ where: { mediaId: id } }),
    prisma.blogPost.count({ where: { coverMediaId: id } }),
    prisma.pageBlock.findMany({ select: { content: true } }).then((blocks) => blocks.filter((block) => urls.some((url) => jsonContains(block.content, url))).length),
    prisma.news.count({ where: { ogImage: { in: urls } } })
  ]);

  return categories + itemImages + blogPosts + pageBlocks + news;
}

export async function getMediaReferenceCount(id: bigint, urls: string[]) {
  return mediaReferenceCount(id, urls);
}

function jsonContains(value: unknown, needle: string): boolean {
  if (typeof value === "string") {
    return value === needle;
  }
  if (Array.isArray(value)) {
    return value.some((item) => jsonContains(item, needle));
  }
  if (value && typeof value === "object") {
    return Object.values(value).some((item) => jsonContains(item, needle));
  }

  return false;
}

export async function createMediaFromUrlAction(formData: FormData) {
  const session = await requireContentEditor();
  const values = mediaSchema.parse({
    url: formData.get("url"),
    originalName: formData.get("originalName"),
    mimeType: formData.get("mimeType"),
    altText: localizedField(formData, "altText")
  });

  const filename = filenameFromUrl(values.url);
  const saved = await prisma.media.create({
    data: {
      filename,
      originalName: values.originalName || filename,
      url: values.url,
      mimeType: values.mimeType || null,
      altText: values.altText,
      uploadedById: BigInt(session.user.id)
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "media_created",
    targetType: "media",
    targetId: saved.id.toString(),
    afterData: saved
  });

  revalidatePath("/admin/media");
}

export async function uploadMediaAction(formData: FormData) {
  const session = await requireContentEditor();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("请选择要上传的图片文件。");
  }

  if (file.size > maxUploadBytes) {
    throw new Error("图片不能超过 5MB。");
  }

  if (!allowedImageTypes.has(file.type)) {
    throw new Error("仅支持 JPG、PNG、WebP、HEIC/HEIF 图片。");
  }

  const values = {
    originalName: file.name,
    altText: localizedField(formData, "altText")
  };
  const extension = extensionByType[file.type] ?? "jpg";
  const baseName = `${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${slugPart(file.name)}-${randomUUID().slice(0, 8)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const processed = await processImage(buffer, baseName, extension);

  const saved = await prisma.media.create({
    data: {
      filename: processed.filename,
      originalName: values.originalName,
      url: processed.url,
      urlWebp: processed.urlWebp,
      urlThumb: processed.urlThumb,
      mimeType: file.type,
      fileSize: file.size,
      width: processed.width,
      height: processed.height,
      altText: values.altText,
      uploadedById: BigInt(session.user.id)
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "media_uploaded",
    targetType: "media",
    targetId: saved.id.toString(),
    afterData: saved
  });

  revalidatePath("/admin/media");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/news");
}

export async function updateMediaAltAction(formData: FormData) {
  const session = await requireContentEditor();
  const id = z.coerce.bigint().parse(formData.get("id"));
  const beforeData = await prisma.media.findUnique({ where: { id } });

  if (!beforeData) {
    throw new Error("媒体不存在。");
  }

  const saved = await prisma.media.update({
    where: { id },
    data: { altText: localizedField(formData, "altText") }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "media_alt_updated",
    targetType: "media",
    targetId: saved.id.toString(),
    beforeData,
    afterData: saved
  });

  revalidatePath("/admin/media");
}

export async function deleteMediaAction(formData: FormData) {
  const session = await requireContentEditor();
  const id = z.coerce.bigint().parse(formData.get("id"));
  const beforeData = await prisma.media.findUnique({ where: { id } });

  if (!beforeData) {
    throw new Error("媒体不存在。");
  }

  const references = await mediaReferenceCount(id, [beforeData.url, beforeData.urlWebp, beforeData.urlThumb].filter(Boolean) as string[]);
  if (references > 0) {
    throw new Error(`该媒体仍被 ${references} 处内容引用，不能删除。请先替换引用。`);
  }

  await prisma.media.delete({ where: { id } });
  await writeAuditLog({
    adminUserId: session.user.id,
    action: "media_deleted",
    targetType: "media",
    targetId: beforeData.id.toString(),
    beforeData
  });

  revalidatePath("/admin/media");
}

export async function replaceMediaFileAction(formData: FormData) {
  const session = await requireContentEditor();
  const id = z.coerce.bigint().parse(formData.get("id"));
  const file = formData.get("file");
  const beforeData = await prisma.media.findUnique({ where: { id } });

  if (!beforeData) {
    throw new Error("媒体不存在。");
  }
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("请选择替换图片。");
  }
  if (file.size > maxUploadBytes) {
    throw new Error("图片不能超过 5MB。");
  }
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("仅支持 JPG、PNG、WebP、HEIC/HEIF 图片。");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sharpModule = await import("sharp");
  const sharp = sharpModule.default;
  await mkdir(uploadDir, { recursive: true });

  async function writeIfLocal(url: string | null | undefined, writer: (disk: string) => Promise<unknown>) {
    if (!url?.startsWith(publicUploadBase)) {
      return;
    }
    await writer(path.join(process.cwd(), "public", url));
  }

  await Promise.all([
    writeIfLocal(beforeData.url, (disk) => writeFile(disk, buffer)),
    writeIfLocal(beforeData.urlWebp, (disk) =>
      sharp(buffer, { failOn: "none" }).rotate().resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(disk)
    ),
    writeIfLocal(beforeData.urlThumb, (disk) =>
      sharp(buffer, { failOn: "none" }).rotate().resize(480, 360, { fit: "cover" }).webp({ quality: 76 }).toFile(disk)
    )
  ]);
  const metadata = await sharp(buffer, { failOn: "none" }).metadata();
  const saved = await prisma.media.update({
    where: { id },
    data: {
      originalName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      width: metadata.width ?? beforeData.width,
      height: metadata.height ?? beforeData.height
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "media_replaced_keep_url",
    targetType: "media",
    targetId: saved.id.toString(),
    beforeData,
    afterData: saved
  });

  revalidatePath("/admin/media");
}

export async function cleanupUnusedMediaAction() {
  const session = await requireContentEditor();
  const rows = await prisma.media.findMany({ take: 500 });
  const unused: bigint[] = [];

  for (const row of rows) {
    const urls = [row.url, row.urlWebp, row.urlThumb].filter(Boolean) as string[];
    const references = await mediaReferenceCount(row.id, urls);
    if (references === 0) {
      unused.push(row.id);
      for (const url of urls) {
        if (url.startsWith(publicUploadBase)) {
          await unlink(path.join(process.cwd(), "public", url)).catch(() => undefined);
        }
      }
    }
  }

  if (unused.length) {
    await prisma.media.deleteMany({ where: { id: { in: unused } } });
  }

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "unused_media_cleaned",
    targetType: "media",
    targetId: unused.map(String).join(","),
    afterData: { count: unused.length }
  });

  revalidatePath("/admin/media");
}
