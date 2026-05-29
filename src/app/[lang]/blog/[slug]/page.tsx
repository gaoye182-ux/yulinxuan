import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentDetail } from "@/components/content-detail";
import { blogCopy, blogEntries } from "@/lib/content-data";
import { getCmsContentEntries, getCmsContentEntry } from "@/lib/cms-content";
import { getCachedSiteSettings, pageMetadata } from "@/lib/frontend-site";
import { getLanguage, languages } from "@/lib/i18n";

export function generateStaticParams() {
  return languages.flatMap((lang) => blogEntries.map((entry) => ({ lang, slug: entry.slug })));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const entry = await getCmsContentEntry("blog", slug);

  if (!entry) {
    return {};
  }

  const title = `${entry.title[lang]} | ${blogCopy[lang].banner.title} | 玉林軒株式会社`;
  const description = entry.excerpt[lang];
  const path = `/blog/${entry.slug}`;

  return pageMetadata({ settings, lang, path, title, description, image: entry.image, type: "article" });
}

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = getLanguage(rawLang);
  const [entry, entries] = await Promise.all([getCmsContentEntry("blog", slug), getCmsContentEntries("blog")]);

  if (!entry) {
    notFound();
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: blogCopy[lang].banner.breadcrumbHome, item: `/${lang}` },
      { "@type": "ListItem", position: 2, name: blogCopy[lang].banner.title, item: `/${lang}/blog` },
      { "@type": "ListItem", position: 3, name: entry.title[lang], item: `/${lang}/blog/${entry.slug}` }
    ]
  };
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title[lang],
    description: entry.excerpt[lang],
    image: entry.image,
    datePublished: entry.date,
    dateModified: entry.date,
    mainEntityOfPage: `/${lang}/blog/${entry.slug}`,
    author: {
      "@type": "Organization",
      name: "玉林軒株式会社"
    },
    publisher: {
      "@type": "Organization",
      name: "玉林軒株式会社"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <ContentDetail lang={lang} kind="blog" listCopy={blogCopy[lang]} entry={entry} entries={entries} />
    </>
  );
}
