import { collectionCategories, type CollectionItem } from "@/lib/collection-data";
import type { ContentEntry } from "@/lib/content-data";
import type { Language } from "@/lib/i18n";

export type SearchParamsInput = Record<string, string | string[] | undefined> | undefined;

export type CollectionFilters = {
  search: string;
  era: "all" | "edo" | "meiji" | "joseon" | "china";
  origin: "all" | "japan" | "korea" | "china";
  price: "all" | "inquiry" | "available";
  flag: "all" | "new" | "featured";
  sort: "recommended" | "latest" | "name";
  page: number;
};

export type ArrivalFilters = {
  flag: "all" | "new" | "featured";
  category: "all" | string;
  sort: "recommended" | "latest" | "name";
  page: number;
};

export type ContentFilters = {
  search: string;
  category: string;
  tag: string;
  month: string;
  page: number;
};

export type Pagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

const collectionPageSize = 12;
const contentPageSize = 6;

function firstParam(searchParams: SearchParamsInput, key: string) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function oneOf<T extends string>(value: string, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function pageParam(searchParams: SearchParamsInput) {
  const page = Number(firstParam(searchParams, "page"));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function pageSlice<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    pagination: {
      page: safePage,
      pageSize,
      totalItems: items.length,
      totalPages
    }
  };
}

function localizedText(values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ").toLowerCase();
}

function itemHaystack(item: CollectionItem, lang: Language) {
  return localizedText([
    item.name[lang],
    item.name.ja,
    item.name.en,
    item.era[lang],
    item.era.ja,
    item.era.en,
    item.origin[lang],
    item.origin.ja,
    item.origin.en,
    item.artist[lang],
    item.categoryName?.[lang],
    item.description[lang],
    ...item.tags.flatMap((tag) => [tag[lang], tag.ja, tag.en])
  ]);
}

function matchesAny(haystack: string, terms: string[]) {
  return terms.some((term) => haystack.includes(term));
}

function compareName(lang: Language) {
  return (a: CollectionItem, b: CollectionItem) => a.name[lang].localeCompare(b.name[lang], lang);
}

function sortCollectionItems(items: CollectionItem[], sort: CollectionFilters["sort"], lang: Language) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      if (sort === "name") {
        return compareName(lang)(a.item, b.item) || a.index - b.index;
      }

      if (sort === "latest") {
        return Number(b.item.isNew) - Number(a.item.isNew) || Number(b.item.isFeatured) - Number(a.item.isFeatured) || a.index - b.index;
      }

      return Number(b.item.isFeatured) - Number(a.item.isFeatured) || Number(b.item.isNew) - Number(a.item.isNew) || a.index - b.index;
    })
    .map(({ item }) => item);
}

export function parseCollectionFilters(searchParams: SearchParamsInput): CollectionFilters {
  return {
    search: firstParam(searchParams, "search").trim(),
    era: oneOf(firstParam(searchParams, "era"), ["all", "edo", "meiji", "joseon", "china"] as const, "all"),
    origin: oneOf(firstParam(searchParams, "origin"), ["all", "japan", "korea", "china"] as const, "all"),
    price: oneOf(firstParam(searchParams, "price"), ["all", "inquiry", "available"] as const, "all"),
    flag: oneOf(firstParam(searchParams, "flag"), ["all", "new", "featured"] as const, "all"),
    sort: oneOf(firstParam(searchParams, "sort"), ["recommended", "latest", "name"] as const, "recommended"),
    page: pageParam(searchParams)
  };
}

export function filterCollectionItems(items: CollectionItem[], filters: CollectionFilters, lang: Language) {
  const search = filters.search.toLowerCase();
  const filtered = items.filter((item) => {
    const haystack = itemHaystack(item, lang);

    if (search && !haystack.includes(search)) {
      return false;
    }

    if (filters.era !== "all") {
      const eraText = localizedText([item.era[lang], item.era.ja, item.era.en, item.era.zh]);
      const eraMatches = {
        edo: ["江戸", "edo", "明治", "meiji"],
        meiji: ["明治", "大正", "昭和", "meiji", "taisho", "showa", "modern"],
        joseon: ["高麗", "李朝", "goryeo", "joseon", "朝鮮"],
        china: ["明", "清", "ming", "qing"]
      }[filters.era];
      if (!matchesAny(eraText, eraMatches)) {
        return false;
      }
    }

    if (filters.origin !== "all") {
      const originText = localizedText([item.origin[lang], item.origin.ja, item.origin.en, item.origin.zh]);
      const originMatches = {
        japan: ["日本", "japan", "hizen"],
        korea: ["朝鮮", "korea", "korean", "goryeo", "joseon"],
        china: ["中国", "china", "chinese"]
      }[filters.origin];
      if (!matchesAny(originText, originMatches)) {
        return false;
      }
    }

    if (filters.price === "available" && item.priceDisplay !== "visible") {
      return false;
    }

    if (filters.price === "inquiry" && item.priceDisplay === "visible") {
      return false;
    }

    if (filters.flag === "new" && !item.isNew) {
      return false;
    }

    if (filters.flag === "featured" && !item.isFeatured) {
      return false;
    }

    return true;
  });

  return pageSlice(sortCollectionItems(filtered, filters.sort, lang), filters.page, collectionPageSize);
}

export function parseArrivalFilters(searchParams: SearchParamsInput): ArrivalFilters {
  return {
    flag: oneOf(firstParam(searchParams, "flag"), ["all", "new", "featured"] as const, "all"),
    category: firstParam(searchParams, "category").trim() || "all",
    sort: oneOf(firstParam(searchParams, "sort"), ["recommended", "latest", "name"] as const, "latest"),
    page: pageParam(searchParams)
  };
}

export function filterArrivalItems(items: CollectionItem[], filters: ArrivalFilters, lang: Language) {
  const staticCategory = collectionCategories.find((category) => category.slug === filters.category);
  const categoryKey = staticCategory?.key;
  const filtered = items.filter((item) => {
    if (filters.flag === "new" && !item.isNew) {
      return false;
    }

    if (filters.flag === "featured" && !item.isFeatured) {
      return false;
    }

    if (filters.category !== "all" && item.categorySlug !== filters.category && item.category !== filters.category && item.category !== categoryKey) {
      return false;
    }

    return item.isNew || item.isFeatured;
  });

  return pageSlice(sortCollectionItems(filtered, filters.sort, lang), filters.page, collectionPageSize);
}

export function parseContentFilters(searchParams: SearchParamsInput): ContentFilters {
  return {
    search: firstParam(searchParams, "search").trim(),
    category: firstParam(searchParams, "category").trim(),
    tag: firstParam(searchParams, "tag").trim(),
    month: firstParam(searchParams, "month").trim(),
    page: pageParam(searchParams)
  };
}

function contentHaystack(entry: ContentEntry, lang: Language) {
  return localizedText([
    entry.title[lang],
    entry.title.ja,
    entry.title.en,
    entry.excerpt[lang],
    entry.excerpt.ja,
    entry.excerpt.en,
    entry.content?.[lang],
    entry.category[lang],
    entry.category.ja,
    entry.category.en,
    ...entry.tags.flatMap((tag) => [tag[lang], tag.ja, tag.en])
  ]);
}

export function filterContentEntries(entries: ContentEntry[], filters: ContentFilters, lang: Language) {
  const search = filters.search.toLowerCase();
  const filtered = entries.filter((entry) => {
    if (search && !contentHaystack(entry, lang).includes(search)) {
      return false;
    }

    if (filters.category && entry.category[lang] !== filters.category) {
      return false;
    }

    if (filters.tag && !entry.tags.some((tag) => tag[lang] === filters.tag)) {
      return false;
    }

    if (filters.month && entry.month !== filters.month) {
      return false;
    }

    return true;
  });

  return pageSlice(filtered, filters.page, contentPageSize);
}

export function queryString(values: Record<string, string | number | undefined>, omit: string[] = []) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (omit.includes(key) || value === undefined || value === "" || value === "all" || value === 1) {
      continue;
    }
    query.set(key, String(value));
  }

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}
