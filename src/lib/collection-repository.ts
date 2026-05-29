import { prisma } from "@/lib/prisma";
import {
  collectionCategories,
  collectionItems,
  type CategoryKey,
  type CollectionCategory,
  type CollectionImage,
  type CollectionItem,
  type LocalizedText
} from "@/lib/collection-data";
import type { Language } from "@/lib/i18n";

type JsonObject = Record<string, unknown>;

const categorySlugToKey: Record<string, Exclude<CategoryKey, "all">> = {
  "japanese-art": "japanese",
  "korean-art": "korean",
  "chinese-art": "chinese",
  furniture: "furniture",
  "craft-works": "craft",
  "new-featured": "featured"
};

function localized(value: unknown, fallback = ""): LocalizedText {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const object = value as JsonObject;
    const ja = String(object.ja ?? object.zh ?? object.en ?? fallback);
    return {
      ja,
      zh: String(object.zh ?? ja),
      en: String(object.en ?? ja)
    };
  }

  return { ja: fallback, zh: fallback, en: fallback };
}

function priceStatus(item: {
  priceDisplay: "show" | "hidden" | "inquiry";
  price: { toString(): string } | null;
  currency: string;
}): LocalizedText {
  if (item.priceDisplay === "show" && item.price) {
    const amount = Number(item.price.toString());
    const formatted = new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: item.currency || "JPY",
      maximumFractionDigits: 0
    }).format(amount);
    return { ja: formatted, zh: formatted, en: formatted };
  }

  if (item.priceDisplay === "hidden") {
    return { ja: "お問い合わせ", zh: "请咨询", en: "Inquire" };
  }

  return { ja: "価格応相談", zh: "价格咨询", en: "Price on Request" };
}

function dbCategoryToStaticKey(category?: { slug: string } | null): Exclude<CategoryKey, "all"> {
  if (!category) {
    return "craft";
  }

  return categorySlugToKey[category.slug] ?? "craft";
}

function dbImagesToCollectionImages(
  images: Array<{
    url: string;
    urlWebp: string | null;
    urlThumb: string | null;
    altText: unknown;
    isPrimary: boolean;
  }>
): CollectionImage[] {
  return images.map((image) => ({
    url: image.urlWebp || image.url || image.urlThumb || "",
    alt: localized(image.altText),
    isPrimary: image.isPrimary
  }));
}

function dbItemToCollectionItem(item: {
  slug: string;
  name: unknown;
  description: unknown;
  era: unknown;
  origin: unknown;
  artist: string | null;
  dimensions: string | null;
  condition: unknown;
  price: { toString(): string } | null;
  currency: string;
  priceDisplay: "show" | "hidden" | "inquiry";
  isNew: boolean;
  isFeatured: boolean;
  category: { slug: string; name: unknown } | null;
  images: Array<{
    url: string;
    urlWebp: string | null;
    urlThumb: string | null;
    altText: unknown;
    isPrimary: boolean;
  }>;
}): CollectionItem {
  const name = localized(item.name, item.slug);
  const images = dbImagesToCollectionImages(item.images);
  const primaryFallback = collectionItems[0]?.images[0];

  return {
    slug: item.slug,
    name,
    era: localized(item.era),
    origin: localized(item.origin),
    artist: { ja: item.artist || "不詳", zh: item.artist || "不详", en: item.artist || "Unknown" },
    dimensions: item.dimensions || "-",
    condition: localized(item.condition),
    category: dbCategoryToStaticKey(item.category),
    categorySlug: item.category?.slug,
    categoryName: item.category ? localized(item.category.name) : undefined,
    tags: [
      item.isNew ? { ja: "新入荷", zh: "新入荷", en: "New" } : null,
      item.isFeatured ? { ja: "特選", zh: "精选", en: "Featured" } : null
    ].filter(Boolean) as LocalizedText[],
    priceStatus: priceStatus(item),
    priceDisplay: item.priceDisplay === "show" ? "visible" : item.priceDisplay,
    price: item.price ? Number(item.price.toString()) : undefined,
    currency: item.currency as "JPY" | "USD" | "CNY",
    isNew: item.isNew,
    isFeatured: item.isFeatured,
    description: localized(item.description),
    notes: [
      {
        ja: "古美術品のため、状態は写真と現物確認をおすすめします。",
        zh: "因属于古美术品，建议结合照片与实物确认状态。",
        en: "As an antique work, condition should be confirmed by photos and in person."
      }
    ],
    images: images.length ? images : primaryFallback ? [primaryFallback] : []
  };
}

function mergeDbCategories(categories: CollectionCategory[]) {
  const existingSlugs = new Set(collectionCategories.map((category) => category.slug));
  return [
    ...collectionCategories,
    ...categories.filter((category) => !existingSlugs.has(category.slug))
  ];
}

export async function getDbCollectionCategories(): Promise<CollectionCategory[]> {
  try {
    const rows = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { slug: true, name: true, description: true }
    });

    return mergeDbCategories(
      rows.map((category) => ({
        key: categorySlugToKey[category.slug] ?? "craft",
        slug: category.slug,
        name: localized(category.name),
        description: localized(category.description)
      }))
    );
  } catch {
    return collectionCategories;
  }
}

export async function getHomeCollectionCategoryCards(
  lang: Language,
  fallback: { name: string; subtitle: string; image: string; large?: boolean }[]
) {
  try {
    const rows = await prisma.category.findMany({
      where: { isActive: true, showOnHome: true },
      include: { coverMedia: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      take: 5
    });

    if (!rows.length) {
      return fallback;
    }

    const dbCards = rows.map((category, index) => {
      const name = localized(category.name);
      const description = localized(category.description);
      const fallbackImage = fallback[index]?.image ?? fallback[0]?.image ?? "";

      return {
        name: localizedValue(name, lang, category.slug),
        subtitle: localizedValue(description, lang, ""),
        image: category.coverMedia?.urlWebp || category.coverMedia?.url || category.coverMedia?.urlThumb || fallbackImage,
        large: index === 0
      };
    });

    return dbCards.length >= fallback.length ? dbCards : [...dbCards, ...fallback.slice(dbCards.length)];
  } catch {
    return fallback;
  }
}

export async function getCollectionItemsWithFallback(): Promise<CollectionItem[]> {
  try {
    const rows = await prisma.item.findMany({
      where: { status: "published", deletedAt: null, OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] },
      include: {
        category: { select: { slug: true, name: true } },
        images: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
    });

    return rows.length ? rows.map(dbItemToCollectionItem) : collectionItems;
  } catch {
    return collectionItems;
  }
}

export async function getCollectionItemsByCategoryWithFallback(categorySlug?: string) {
  const items = await getCollectionItemsWithFallback();
  if (!categorySlug) {
    return items;
  }

  const staticCategory = collectionCategories.find((category) => category.slug === categorySlug);
  if (staticCategory?.key === "featured") {
    return items.filter((item) => item.isNew || item.isFeatured);
  }

  return items.filter((item) => item.categorySlug === categorySlug || item.category === staticCategory?.key);
}

export async function getCollectionItemBySlugWithFallback(slug: string) {
  const items = await getCollectionItemsWithFallback();
  return items.find((item) => item.slug === slug) ?? collectionItems.find((item) => item.slug === slug);
}

export async function getRelatedCollectionItemsWithFallback(item: CollectionItem, limit = 3) {
  const items = await getCollectionItemsWithFallback();
  const sameCategory = items.filter((candidate) => candidate.slug !== item.slug && candidate.category === item.category);
  const fallback = items.filter((candidate) => candidate.slug !== item.slug);
  const seen = new Set<string>();

  return [...sameCategory, ...fallback]
    .filter((candidate) => {
      if (seen.has(candidate.slug)) {
        return false;
      }
      seen.add(candidate.slug);
      return true;
    })
    .slice(0, limit);
}

export function localizedValue(value: Partial<LocalizedText> | undefined, lang: Language, fallback = "") {
  return value?.[lang] || value?.ja || value?.zh || value?.en || fallback;
}
