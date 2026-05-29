"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { ContentKind } from "@/lib/content-data";
import { languages, type Language } from "@/lib/i18n";
import { requireContentEditor } from "@/lib/admin-auth";
import { writeAuditLog } from "@/lib/audit-log";

const contentStatusSchema = z.enum(["draft", "published", "archived"]);

const contentActionSchema = z.object({
  slug: z.string().trim().min(2).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens."),
  category: z.string().trim().min(1).max(100),
  tags: z.string().trim().optional(),
  status: contentStatusSchema,
  publishedAt: z.string().trim().optional(),
  isFeatured: z.boolean(),
  coverMediaId: z.string().trim().optional(),
  ogImage: z.string().trim().optional(),
  title: z.record(z.enum(languages), z.string().trim().min(1)),
  excerpt: z.record(z.enum(languages), z.string().trim().optional()),
  content: z.record(z.enum(languages), z.string().trim().optional()),
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

function parsePublishedAt(value: string | undefined, status: z.infer<typeof contentStatusSchema>) {
  if (status === "draft") {
    return null;
  }

  if (!value) {
    return new Date();
  }

  return new Date(`${value}T00:00:00+09:00`);
}

function parseTags(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseContentForm(formData: FormData) {
  return contentActionSchema.parse({
    slug: formData.get("slug"),
    category: formData.get("category"),
    tags: formData.get("tags"),
    status: formData.get("status"),
    publishedAt: formData.get("publishedAt"),
    isFeatured: formData.get("isFeatured") === "on",
    coverMediaId: formData.get("coverMediaId"),
    ogImage: formData.get("ogImage"),
    title: localizedField(formData, "title"),
    excerpt: localizedField(formData, "excerpt"),
    content: localizedField(formData, "content"),
    metaTitle: localizedField(formData, "metaTitle"),
    metaDescription: localizedField(formData, "metaDescription")
  });
}

function refreshContentPaths(kind: ContentKind, slug: string) {
  revalidatePath("/admin");
  revalidatePath(`/admin/${kind}`);
  revalidatePath(`/admin/${kind}/${slug}/edit`);

  for (const lang of languages) {
    revalidatePath(`/${lang}/${kind}`);
    revalidatePath(`/${lang}/${kind}/${slug}`);
  }
}

export async function saveBlogPostAction(formData: FormData) {
  const session = await requireContentEditor();
  const values = parseContentForm(formData);
  const publishedAt = parsePublishedAt(values.publishedAt, values.status);
  const tags = parseTags(values.tags);
  const coverMediaId = values.coverMediaId ? BigInt(values.coverMediaId) : null;
  const existingSlug = String(formData.get("existingSlug") ?? "");
  const authorId = BigInt(session.user.id);
  const beforeData = existingSlug
    ? await prisma.blogPost.findUnique({ where: { slug: existingSlug } })
    : null;

  const saved = await prisma.blogPost.upsert({
    where: { slug: existingSlug || values.slug },
    create: {
      slug: values.slug,
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      category: values.category,
      tags,
      authorId,
      status: values.status,
      isFeatured: values.isFeatured,
      coverMediaId,
      publishedAt,
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
      ogImage: values.ogImage || null
    },
    update: {
      slug: values.slug,
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      category: values.category,
      tags,
      authorId,
      status: values.status,
      isFeatured: values.isFeatured,
      coverMediaId,
      publishedAt,
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
      ogImage: values.ogImage || null
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: beforeData ? "blog_post_updated" : "blog_post_created",
    targetType: "blog_post",
    targetId: saved.id.toString(),
    beforeData,
    afterData: saved
  });

  refreshContentPaths("blog", values.slug);
  redirect("/admin/blog");
}

export async function saveNewsAction(formData: FormData) {
  const session = await requireContentEditor();
  const values = parseContentForm(formData);
  const publishedAt = parsePublishedAt(values.publishedAt, values.status);
  const tags = parseTags(values.tags);
  const coverMediaUrl = values.ogImage || null;
  const existingSlug = String(formData.get("existingSlug") ?? "");
  const beforeData = existingSlug
    ? await prisma.news.findUnique({ where: { slug: existingSlug } })
    : null;

  const saved = await prisma.news.upsert({
    where: { slug: existingSlug || values.slug },
    create: {
      slug: values.slug,
      title: values.title,
      content: values.content,
      type: values.category,
      tags,
      status: values.status,
      isFeatured: values.isFeatured,
      publishedAt,
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
      ogImage: coverMediaUrl
    },
    update: {
      slug: values.slug,
      title: values.title,
      content: values.content,
      type: values.category,
      tags,
      status: values.status,
      isFeatured: values.isFeatured,
      publishedAt,
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
      ogImage: coverMediaUrl
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: beforeData ? "news_updated" : "news_created",
    targetType: "news",
    targetId: saved.id.toString(),
    beforeData,
    afterData: saved
  });

  refreshContentPaths("news", values.slug);
  redirect("/admin/news");
}
