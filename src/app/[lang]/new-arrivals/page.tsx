import type { Metadata } from "next";
import { NewArrivalsListing, type NewArrivalsCopy } from "@/components/new-arrivals-listing";
import {
  collectionCopy,
  collectionImages
} from "@/lib/collection-data";
import { getCachedSiteSettings, pageMetadata } from "@/lib/frontend-site";
import { getCollectionItemsWithFallback } from "@/lib/collection-repository";
import { filterArrivalItems, parseArrivalFilters, type SearchParamsInput } from "@/lib/listing-filters";
import { getLanguage } from "@/lib/i18n";

const newArrivalsCopy: Record<"ja" | "zh" | "en", NewArrivalsCopy> = {
  ja: {
    seoTitle: "新入荷・特選品 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社が近時入荷した古美術品と、特におすすめする日本美術、朝鮮美術、中国美術、箪笥・家具、工芸品をご紹介します。",
    banner: {
      eyebrow: "NEW ARRIVALS",
      title: "新入荷・特選品",
      subtitle: "近時入荷した品と、玉林軒が状態・景色・取り合わせから選んだ一品をご覧ください。",
      breadcrumbHome: "ホーム"
    },
    featured: {
      eyebrow: "FEATURED PIECE",
      title: "主推の一品",
      cta: "詳細を見る"
    },
    filters: {
      title: "表示を切り替える",
      all: "全部",
      new: "新入荷",
      featured: "特選品",
      categories: "分類で見る",
      sort: "並び替え",
      latest: "新着順",
      recommended: "おすすめ順",
      name: "品名順"
    },
    empty: {
      title: "現在公開中の新入荷・特選品はありません",
      text: "準備中の品もございます。お探しの分野がありましたら、お気軽にお問い合わせください。",
      action: "蔵品紹介を見る"
    },
    pagination: { previous: "前へ", next: "次へ" }
  },
  zh: {
    seoTitle: "新入荷・精选 | 玉林軒株式会社",
    seoDescription:
      "查看玉林軒株式会社近期新入荷古美术品及精选推荐，涵盖日本美术、朝鲜美术、中国美术、箪笥家具与工艺品。",
    banner: {
      eyebrow: "NEW ARRIVALS",
      title: "新入荷・精选",
      subtitle: "汇集近期入荷藏品，以及玉林軒根据状态、气韵与陈列价值特别推荐的精选器物。",
      breadcrumbHome: "首页"
    },
    featured: {
      eyebrow: "FEATURED PIECE",
      title: "主推藏品",
      cta: "查看详情"
    },
    filters: {
      title: "筛选显示",
      all: "全部",
      new: "新入荷",
      featured: "精选",
      categories: "按分类查看",
      sort: "排序",
      latest: "最新顺",
      recommended: "推荐顺",
      name: "品名顺"
    },
    empty: {
      title: "当前暂无公开的新入荷・精选藏品",
      text: "部分藏品仍在整理中。如有正在寻找的类别，欢迎直接咨询。",
      action: "查看藏品介绍"
    },
    pagination: { previous: "上一页", next: "下一页" }
  },
  en: {
    seoTitle: "New Arrivals | Gyokurinken Co., Ltd.",
    seoDescription:
      "Browse Gyokurinken's recent acquisitions and featured selections across Japanese, Korean, and Chinese art, period furniture, and craft works.",
    banner: {
      eyebrow: "NEW ARRIVALS",
      title: "New Arrivals",
      subtitle: "Recent acquisitions and selected works chosen for condition, presence, and the quiet strength of their materials.",
      breadcrumbHome: "Home"
    },
    featured: {
      eyebrow: "FEATURED PIECE",
      title: "Featured Work",
      cta: "View Details"
    },
    filters: {
      title: "Refine View",
      all: "All",
      new: "New Arrivals",
      featured: "Featured",
      categories: "Browse by Category",
      sort: "Sort",
      latest: "Newest",
      recommended: "Recommended",
      name: "Name"
    },
    empty: {
      title: "No new or featured works are currently listed",
      text: "Some pieces may still be in preparation. Please contact us if you are looking for a specific field.",
      action: "View Collection"
    },
    pagination: { previous: "Previous", next: "Next" }
  }
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const page = newArrivalsCopy[lang];

  return pageMetadata({ settings, lang, path: "/new-arrivals", title: page.seoTitle, description: page.seoDescription, image: collectionImages.bronze });
}

export default async function NewArrivalsPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<SearchParamsInput>;
}) {
  const { lang: rawLang } = await params;
  const rawSearchParams = await searchParams;
  const lang = getLanguage(rawLang);
  const collectionItems = await getCollectionItemsWithFallback();
  const baseItems = collectionItems.filter((item) => item.isNew || item.isFeatured);
  const filters = parseArrivalFilters(rawSearchParams);
  const { items, pagination } = filterArrivalItems(collectionItems, filters, lang);
  const featuredItem = baseItems.find((item) => item.isFeatured) ?? baseItems.find((item) => item.isNew);

  return (
    <NewArrivalsListing
      lang={lang}
      copy={newArrivalsCopy[lang]}
      collectionCopy={collectionCopy[lang]}
      items={items}
      featuredItem={featuredItem}
      totalItems={baseItems.length}
      filters={filters}
      pagination={pagination}
    />
  );
}
