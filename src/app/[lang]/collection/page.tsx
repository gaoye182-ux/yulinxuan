import type { Metadata } from "next";
import { CollectionListing } from "@/components/collection-listing";
import {
  collectionCopy,
  collectionImages,
  collectionCategories
} from "@/lib/collection-data";
import { getCachedSiteSettings, pageMetadata } from "@/lib/frontend-site";
import { getCollectionItemsWithFallback } from "@/lib/collection-repository";
import { filterCollectionItems, parseCollectionFilters, type SearchParamsInput } from "@/lib/listing-filters";
import { getLanguage } from "@/lib/i18n";

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const page = collectionCopy[lang];

  return pageMetadata({ settings, lang, path: "/collection", title: page.seoTitle, description: page.seoDescription, image: collectionImages.imari });
}

export default async function CollectionPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<SearchParamsInput>;
}) {
  const { lang: rawLang } = await params;
  const rawSearchParams = await searchParams;
  const lang = getLanguage(rawLang);
  const page = collectionCopy[lang];
  const allCategory = collectionCategories[0];
  const allItems = await getCollectionItemsWithFallback();
  const filters = parseCollectionFilters(rawSearchParams);
  const { items, pagination } = filterCollectionItems(allItems, filters, lang);

  return (
    <CollectionListing
      lang={lang}
      copy={page}
      title={page.banner.title}
      subtitle={allCategory.description[lang]}
      items={items}
      totalItems={allItems.length}
      activeCategory="all"
      basePath="/collection"
      filters={filters}
      pagination={pagination}
    />
  );
}
