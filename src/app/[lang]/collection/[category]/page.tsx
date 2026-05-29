import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CollectionListing } from "@/components/collection-listing";
import {
  collectionCategories,
  collectionCopy,
  collectionImages,
  getCategoryBySlug
} from "@/lib/collection-data";
import { getCachedSiteSettings, pageMetadata } from "@/lib/frontend-site";
import { getCollectionItemsByCategoryWithFallback, getDbCollectionCategories } from "@/lib/collection-repository";
import { getLanguage, languages } from "@/lib/i18n";
import { filterCollectionItems, parseCollectionFilters, type SearchParamsInput } from "@/lib/listing-filters";

export function generateStaticParams() {
  return languages.flatMap((lang) =>
    collectionCategories
      .filter((category) => category.key !== "all")
      .map((category) => ({ lang, category: category.slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; category: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, category: slug } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const categories = await getDbCollectionCategories();
  const category = categories.find((entry) => entry.slug === slug) ?? getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  const title = `${category.name[lang]} | ${collectionCopy[lang].banner.title} | 玉林軒株式会社`;
  const description = category.description[lang];
  const path = `/collection/${category.slug}`;

  return pageMetadata({ settings, lang, path, title, description, image: collectionImages.imari });
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: string; category: string }>;
  searchParams?: Promise<SearchParamsInput>;
}) {
  const { lang: rawLang, category: slug } = await params;
  const rawSearchParams = await searchParams;
  const lang = getLanguage(rawLang);
  const categories = await getDbCollectionCategories();
  const category = categories.find((entry) => entry.slug === slug) ?? getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }
  const categoryItems = await getCollectionItemsByCategoryWithFallback(category.slug);
  const filters = parseCollectionFilters(rawSearchParams);
  const { items, pagination } = filterCollectionItems(categoryItems, filters, lang);

  return (
    <CollectionListing
      lang={lang}
      copy={collectionCopy[lang]}
      title={category.name[lang]}
      subtitle={category.description[lang]}
      items={items}
      totalItems={categoryItems.length}
      activeCategory={category.key}
      basePath={`/collection/${category.slug}`}
      filters={filters}
      pagination={pagination}
    />
  );
}
