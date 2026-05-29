import { unstable_noStore as noStore } from "next/cache";
import type { Prisma } from "@prisma/client";
import { blogEntries, getContentEntry, getContentEntries, newsEntries, type ContentEntry, type ContentKind } from "@/lib/content-data";
import type { Language } from "@/lib/i18n";
import { languages } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

type LocalizedText = Record<Language, string>;

type CmsContentRecord = {
  id: bigint;
  slug: string;
  title: Prisma.JsonValue;
  excerpt?: Prisma.JsonValue | null;
  content?: Prisma.JsonValue | null;
  category?: string | null;
  type?: string | null;
  tags: string[];
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  metaDescription?: Prisma.JsonValue | null;
  ogImage?: string | null;
  coverMediaId?: bigint | null;
  coverMedia?: { url: string | null; urlWebp?: string | null } | null;
};

const fallbackReadTime: LocalizedText = {
  ja: "3分",
  zh: "3分钟",
  en: "3 min"
};

function localizedJson(value: Prisma.JsonValue | null | undefined, fallback = ""): LocalizedText {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const ja = typeof record.ja === "string" ? record.ja : fallback;
    return {
      ja,
      zh: typeof record.zh === "string" ? record.zh : ja,
      en: typeof record.en === "string" ? record.en : ja
    };
  }

  return { ja: fallback, zh: fallback, en: fallback };
}

function sharedLocalized(value: string | null | undefined): LocalizedText {
  const text = value?.trim() || "お知らせ";
  return { ja: text, zh: text, en: text };
}

function dateParts(date: Date | null | undefined) {
  const value = date ?? new Date();
  const iso = value.toISOString().slice(0, 10);
  return { date: iso, month: iso.slice(0, 7) };
}

function tagsToLocalized(tags: string[]): LocalizedText[] {
  return tags.filter(Boolean).map((tag) => ({ ja: tag, zh: tag, en: tag }));
}

function recordToEntry(kind: ContentKind, record: CmsContentRecord): ContentEntry {
  const published = dateParts(record.publishedAt ?? record.createdAt);
  const title = localizedJson(record.title, record.slug);
  const excerpt = localizedJson(record.excerpt ?? record.metaDescription, title.ja);
  const image = record.coverMedia?.urlWebp ?? record.coverMedia?.url ?? record.ogImage ?? undefined;

  return {
    id: record.id.toString(),
    slug: record.slug,
    kind,
    title,
    excerpt,
    content: localizedJson(record.content, excerpt.ja),
    category: sharedLocalized(kind === "blog" ? record.category : record.type),
    date: published.date,
    month: published.month,
    tags: tagsToLocalized(record.tags),
    image,
    coverMediaId: record.coverMediaId?.toString(),
    featured: record.isFeatured,
    status: record.status,
    readTime: fallbackReadTime
  };
}

function publicWhere(now = new Date()) {
  return {
    status: "published" as const,
    OR: [{ publishedAt: null }, { publishedAt: { lte: now } }]
  };
}

export async function getCmsContentEntries(kind: ContentKind, options: { admin?: boolean; fallback?: boolean } = {}) {
  noStore();

  try {
    if (kind === "blog") {
      const records = await prisma.blogPost.findMany({
        where: options.admin ? undefined : publicWhere(),
        include: { coverMedia: { select: { url: true, urlWebp: true } } },
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }]
      });
      const entries = records.map((record) => recordToEntry("blog", record));
      return entries.length || options.admin || options.fallback === false ? entries : getContentEntries(kind);
    }

    const records = await prisma.news.findMany({
      where: options.admin ? undefined : publicWhere(),
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }]
    });
    const entries = records.map((record) => recordToEntry("news", record));
    return entries.length || options.admin || options.fallback === false ? entries : getContentEntries(kind);
  } catch (error) {
    if (options.fallback ?? true) {
      return getContentEntries(kind);
    }

    throw error;
  }
}

export async function getCmsContentEntry(kind: ContentKind, slug: string, options: { admin?: boolean; fallback?: boolean } = {}) {
  noStore();

  try {
    if (kind === "blog") {
      const record = await prisma.blogPost.findFirst({
        where: { slug, ...(options.admin ? {} : publicWhere()) },
        include: { coverMedia: { select: { url: true, urlWebp: true } } }
      });
      if (record) {
        return recordToEntry("blog", record);
      }
      return options.admin || options.fallback === false ? null : (getContentEntry(kind, slug) ?? null);
    }

    const record = await prisma.news.findFirst({
      where: { slug, ...(options.admin ? {} : publicWhere()) }
    });
    if (record) {
      return recordToEntry("news", record);
    }
    return options.admin || options.fallback === false ? null : (getContentEntry(kind, slug) ?? null);
  } catch (error) {
    if (options.fallback ?? true) {
      return getContentEntry(kind, slug) ?? null;
    }

    throw error;
  }
}

export async function getCmsDashboardCounts() {
  noStore();

  try {
    const [blogCount, newsCount, featuredBlogCount, featuredNewsCount] = await Promise.all([
      prisma.blogPost.count(),
      prisma.news.count(),
      prisma.blogPost.count({ where: { isFeatured: true } }),
      prisma.news.count({ where: { isFeatured: true } })
    ]);

    return {
      blogCount,
      newsCount,
      featuredCount: featuredBlogCount + featuredNewsCount,
      trilingualPages: (blogCount + newsCount) * languages.length,
      isDatabaseBacked: true
    };
  } catch {
    return {
      blogCount: blogEntries.length,
      newsCount: newsEntries.length,
      featuredCount: [...blogEntries, ...newsEntries].filter((entry) => entry.featured).length,
      trilingualPages: (blogEntries.length + newsEntries.length) * languages.length,
      isDatabaseBacked: false
    };
  }
}
