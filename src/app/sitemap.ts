import type { MetadataRoute } from "next";
import { siteBaseUrl } from "@/lib/frontend-site";
import { languages } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";

const staticPaths = [
  "",
  "/collection",
  "/new-arrivals",
  "/appraisal",
  "/appraisal/form",
  "/purchase-guide",
  "/faq",
  "/blog",
  "/news",
  "/about",
  "/contact",
  "/access",
  "/privacy",
  "/sitemap"
];

function localizedUrls(baseUrl: string, path: string, lastModified = new Date()) {
  return languages.map((lang) => ({
    url: `${baseUrl}/${lang}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path ? 0.7 : 1
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();

  if (!settings.sitemap.enabled) {
    return [];
  }

  const baseUrl = siteBaseUrl(settings);
  const entries: MetadataRoute.Sitemap = staticPaths.flatMap((path) => localizedUrls(baseUrl, path));

  try {
    const [blogPosts, newsPosts, items] = await Promise.all([
      settings.sitemap.includeBlog
        ? prisma.blogPost.findMany({
            where: { status: "published", OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] },
            select: { slug: true, updatedAt: true }
          })
        : [],
      settings.sitemap.includeNews
        ? prisma.news.findMany({
            where: { status: "published", OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] },
            select: { slug: true, updatedAt: true }
          })
        : [],
      settings.sitemap.includeItems
        ? prisma.item.findMany({
            where: { status: "published", deletedAt: null, OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] },
            select: { slug: true, updatedAt: true }
          })
        : []
    ]);

    entries.push(...blogPosts.flatMap((post) => localizedUrls(baseUrl, `/blog/${post.slug}`, post.updatedAt)));
    entries.push(...newsPosts.flatMap((post) => localizedUrls(baseUrl, `/news/${post.slug}`, post.updatedAt)));
    entries.push(...items.flatMap((item) => localizedUrls(baseUrl, `/item/${item.slug}`, item.updatedAt)));
  } catch {
    return entries;
  }

  return entries;
}
