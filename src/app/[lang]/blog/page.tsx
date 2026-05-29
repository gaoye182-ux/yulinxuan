import type { Metadata } from "next";
import { ContentListing } from "@/components/content-listing";
import { blogCopy } from "@/lib/content-data";
import { getCmsContentEntries } from "@/lib/cms-content";
import { getCachedSiteSettings, pageMetadata } from "@/lib/frontend-site";
import { getLanguage } from "@/lib/i18n";
import { filterContentEntries, parseContentFilters, type SearchParamsInput } from "@/lib/listing-filters";

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const page = blogCopy[lang];
  const entries = await getCmsContentEntries("blog");
  const featured = entries.find((entry) => entry.featured) ?? entries[0];

  return pageMetadata({ settings, lang, path: "/blog", title: page.seoTitle, description: page.seoDescription, image: featured?.image });
}

export default async function BlogPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<SearchParamsInput>;
}) {
  const { lang: rawLang } = await params;
  const rawSearchParams = await searchParams;
  const lang = getLanguage(rawLang);
  const page = blogCopy[lang];
  const allEntries = await getCmsContentEntries("blog");
  const filters = parseContentFilters(rawSearchParams);
  const { items: entries, pagination } = filterContentEntries(allEntries, filters, lang);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: page.banner.breadcrumbHome, item: `/${lang}` },
      { "@type": "ListItem", position: 2, name: page.banner.title, item: `/${lang}/blog` }
    ]
  };
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: page.banner.title,
    description: page.seoDescription,
    url: `/${lang}/blog`,
    blogPost: entries.map((entry) => ({
      "@type": "BlogPosting",
      headline: entry.title[lang],
      description: entry.excerpt[lang],
      datePublished: entry.date,
      url: `/${lang}/blog/${entry.slug}`,
      image: entry.image,
      author: {
        "@type": "Organization",
        name: "玉林軒株式会社"
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <ContentListing lang={lang} kind="blog" copy={page} entries={entries} allEntries={allEntries} filters={filters} pagination={pagination} />
    </>
  );
}
