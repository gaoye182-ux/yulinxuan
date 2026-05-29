import type { Metadata } from "next";
import { ContentListing } from "@/components/content-listing";
import { newsCopy } from "@/lib/content-data";
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
  const page = newsCopy[lang];
  const entries = await getCmsContentEntries("news");
  const featured = entries.find((entry) => entry.featured) ?? entries[0];

  return pageMetadata({ settings, lang, path: "/news", title: page.seoTitle, description: page.seoDescription, image: featured?.image });
}

export default async function NewsPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<SearchParamsInput>;
}) {
  const { lang: rawLang } = await params;
  const rawSearchParams = await searchParams;
  const lang = getLanguage(rawLang);
  const page = newsCopy[lang];
  const allEntries = await getCmsContentEntries("news");
  const filters = parseContentFilters(rawSearchParams);
  const { items: entries, pagination } = filterContentEntries(allEntries, filters, lang);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: page.banner.breadcrumbHome, item: `/${lang}` },
      { "@type": "ListItem", position: 2, name: page.banner.title, item: `/${lang}/news` }
    ]
  };
  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.banner.title,
    description: page.seoDescription,
    url: `/${lang}/news`,
    hasPart: entries.map((entry) => ({
      "@type": "NewsArticle",
      headline: entry.title[lang],
      description: entry.excerpt[lang],
      datePublished: entry.date,
      url: `/${lang}/news/${entry.slug}`,
      publisher: {
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }} />
      <ContentListing lang={lang} kind="news" copy={page} entries={entries} allEntries={allEntries} filters={filters} pagination={pagination} />
    </>
  );
}
