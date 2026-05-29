import { unstable_noStore as noStore } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Language } from "@/lib/i18n";
import { languages } from "@/lib/i18n";

type JsonRecord = Record<string, unknown>;

export type PageBlockState<T> = {
  content: T;
  isActive: boolean;
  sortOrder: number;
};

export type PageBlockDefinition = {
  pageKey: string;
  blockKey: string;
  pageLabel: string;
  blockLabel: string;
  description: string;
  defaultContent: Record<Language, unknown>;
  defaultSortOrder: number;
  imageHints?: string[];
};

export const pageBlockDefinitions: PageBlockDefinition[] = [
  {
    pageKey: "layout",
    blockKey: "navigation",
    pageLabel: "Layout",
    blockLabel: "导航菜单",
    description: "前台顶部导航、移动菜单和联系按钮文案。数组项支持 href、label。",
    defaultContent: {
      ja: {
        contactLabel: "お問い合わせ",
        items: [
          { href: "/", label: "ホーム" },
          { href: "/collection", label: "蔵品紹介" },
          { href: "/new-arrivals", label: "新入荷・特選品" },
          { href: "/appraisal", label: "鑑定・買取" },
          { href: "/news", label: "新着情報" },
          { href: "/about", label: "玉林軒について" }
        ]
      },
      zh: {
        contactLabel: "联系我们",
        items: [
          { href: "/", label: "首页" },
          { href: "/collection", label: "藏品介绍" },
          { href: "/new-arrivals", label: "新入荷・精选" },
          { href: "/appraisal", label: "鉴定・收购" },
          { href: "/news", label: "资讯" },
          { href: "/about", label: "关于我们" }
        ]
      },
      en: {
        contactLabel: "Contact",
        items: [
          { href: "/", label: "Home" },
          { href: "/collection", label: "Collection" },
          { href: "/new-arrivals", label: "New Arrivals" },
          { href: "/appraisal", label: "Appraisal" },
          { href: "/news", label: "News" },
          { href: "/about", label: "About" }
        ]
      }
    },
    defaultSortOrder: 1
  },
  {
    pageKey: "layout",
    blockKey: "footer",
    pageLabel: "Layout",
    blockLabel: "页脚链接与版权",
    description: "页脚分组标题、服务链接和版权文案。",
    defaultContent: {
      ja: {
        siteTitle: "SITE",
        serviceTitle: "SERVICE",
        contactTitle: "CONTACT",
        serviceLinks: [
          { href: "/appraisal", label: "鑑定・買取" },
          { href: "/purchase-guide", label: "ご購入方法" },
          { href: "/faq", label: "FAQ" },
          { href: "/access", label: "アクセス" },
          { href: "/privacy", label: "プライバシーポリシー" },
          { href: "/sitemap", label: "サイトマップ" }
        ],
        copyright: "Copyright © Gyokurinken Co., Ltd. All Rights Reserved."
      },
      zh: {
        siteTitle: "SITE",
        serviceTitle: "SERVICE",
        contactTitle: "CONTACT",
        serviceLinks: [
          { href: "/appraisal", label: "鉴定・收购" },
          { href: "/purchase-guide", label: "购买方法" },
          { href: "/faq", label: "常见问题" },
          { href: "/access", label: "交通指引" },
          { href: "/privacy", label: "隐私政策" },
          { href: "/sitemap", label: "网站地图" }
        ],
        copyright: "Copyright © Gyokurinken Co., Ltd. All Rights Reserved."
      },
      en: {
        siteTitle: "SITE",
        serviceTitle: "SERVICE",
        contactTitle: "CONTACT",
        serviceLinks: [
          { href: "/appraisal", label: "Appraisal" },
          { href: "/purchase-guide", label: "Purchase Guide" },
          { href: "/faq", label: "FAQ" },
          { href: "/access", label: "Access" },
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/sitemap", label: "Sitemap" }
        ],
        copyright: "Copyright © Gyokurinken Co., Ltd. All Rights Reserved."
      }
    },
    defaultSortOrder: 2
  },
  {
    pageKey: "home",
    blockKey: "hero",
    pageLabel: "首页",
    blockLabel: "Hero 英雄区",
    description: "首页首屏标题、副标题、CTA、徽章和主视觉图片。",
    defaultContent: {
      ja: { eyebrow: "", title: "古の美を、未来へ紡ぐ。", lead: "日本・中国・朝鮮の古美術を中心に、鑑定、買取、販売まで一貫して承ります。", cta: "蔵品を見る", secondary: "鑑定を相談", badge: "古美術商として培った審美眼" },
      zh: { eyebrow: "", title: "传承古典之美，编织未来。", lead: "以日本、中国、朝鲜古美术为中心，提供鉴定、收购与销售服务。", cta: "查看藏品", secondary: "咨询鉴定", badge: "源自古美术商的审美与经验" },
      en: { eyebrow: "", title: "Bridging the Beauty of the Past to the Future.", lead: "We curate, appraise, purchase, and present Japanese, Chinese, and Korean antiques.", cta: "View Collection", secondary: "Request Appraisal", badge: "A discerning eye for antique art" }
    },
    defaultSortOrder: 10,
    imageHints: ["image"]
  },
  {
    pageKey: "home",
    blockKey: "stats",
    pageLabel: "首页",
    blockLabel: "统计条",
    description: "深木色统计条，数组格式：[{ value, label }]。",
    defaultContent: {
      ja: [{ value: "30+", label: "年の実務経験" }, { value: "5,000+", label: "取扱実績" }, { value: "3", label: "鑑定方法" }, { value: "無料", label: "初回相談" }, { value: "全国", label: "出張対応" }],
      zh: [{ value: "30+", label: "年实务经验" }, { value: "5,000+", label: "经手实绩" }, { value: "3", label: "鉴定方式" }, { value: "免费", label: "初次咨询" }, { value: "全国", label: "出张对应" }],
      en: [{ value: "30+", label: "Years Experience" }, { value: "5,000+", label: "Handled Works" }, { value: "3", label: "Appraisal Methods" }, { value: "Free", label: "Initial Consultation" }, { value: "Japan", label: "Nationwide Visits" }]
    },
    defaultSortOrder: 20
  },
  {
    pageKey: "home",
    blockKey: "sections",
    pageLabel: "首页",
    blockLabel: "区块标题文案",
    description: "首页 collection / arrivals / appraisal / journal / about / access 的标题、说明和按钮文案。",
    defaultContent: { ja: {}, zh: {}, en: {} },
    defaultSortOrder: 30
  },
  {
    pageKey: "home",
    blockKey: "categories",
    pageLabel: "首页",
    blockLabel: "藏品分类拼贴",
    description: "分类拼贴数组，支持 name、subtitle、image、large。",
    defaultContent: { ja: [], zh: [], en: [] },
    defaultSortOrder: 40,
    imageHints: ["0.image", "1.image", "2.image", "3.image", "4.image"]
  },
  {
    pageKey: "home",
    blockKey: "arrivals",
    pageLabel: "首页",
    blockLabel: "新入荷模块",
    description: "首页新入荷大图与右侧重点藏品。支持 feature 与 items。",
    defaultContent: { ja: {}, zh: {}, en: {} },
    defaultSortOrder: 50,
    imageHints: ["image", "items.0.image", "items.1.image", "items.2.image"]
  },
  {
    pageKey: "home",
    blockKey: "appraisal",
    pageLabel: "首页",
    blockLabel: "鉴定入口",
    description: "店头、出张、照片鉴定三入口数组。",
    defaultContent: { ja: [], zh: [], en: [] },
    defaultSortOrder: 60,
    imageHints: ["0.image", "1.image", "2.image"]
  },
  {
    pageKey: "home",
    blockKey: "quick_links",
    pageLabel: "首页",
    blockLabel: "购买/博客/咨询入口",
    description: "首页鉴定区下方三个横向入口。",
    defaultContent: { ja: [], zh: [], en: [] },
    defaultSortOrder: 70
  },
  {
    pageKey: "home",
    blockKey: "about",
    pageLabel: "首页",
    blockLabel: "关于区块",
    description: "首页关于玉林軒说明、事实列表与图片。",
    defaultContent: { ja: {}, zh: {}, en: {} },
    defaultSortOrder: 80,
    imageHints: ["image"]
  },
  {
    pageKey: "contact",
    blockKey: "banner",
    pageLabel: "Contact",
    blockLabel: "Contact Banner",
    description: "Contact 顶部标题、说明和面包屑文案。",
    defaultContent: { ja: {}, zh: {}, en: {} },
    defaultSortOrder: 10
  },
  {
    pageKey: "contact",
    blockKey: "info",
    pageLabel: "Contact",
    blockLabel: "Contact 说明与店铺信息",
    description: "Contact 侧栏说明、标签、地址、电话、邮箱、营业时间、访问说明。",
    defaultContent: { ja: {}, zh: {}, en: {} },
    defaultSortOrder: 20
  },
  {
    pageKey: "contact",
    blockKey: "map",
    pageLabel: "Contact",
    blockLabel: "Contact Map 文案",
    description: "Contact 地图说明和按钮文案。",
    defaultContent: { ja: {}, zh: {}, en: {} },
    defaultSortOrder: 30
  },
  {
    pageKey: "access",
    blockKey: "content",
    pageLabel: "Access",
    blockLabel: "Access 全页说明",
    description: "Access 页面 banner、overview、transport、parking、hours、notes、map、cta。",
    defaultContent: { ja: {}, zh: {}, en: {} },
    defaultSortOrder: 10
  },
  {
    pageKey: "about",
    blockKey: "content",
    pageLabel: "About",
    blockLabel: "About 全页内容",
    description: "关于页面的 banner、story、代表挨拶、理念、年表、gallery、许可和 CTA。保存的 JSON 会覆盖前台默认内容。",
    defaultContent: {
      ja: { seoTitle: "", seoDescription: "", banner: {}, story: {}, greeting: {}, philosophy: {}, timeline: {}, gallery: {}, credentials: {}, cta: {} },
      zh: { seoTitle: "", seoDescription: "", banner: {}, story: {}, greeting: {}, philosophy: {}, timeline: {}, gallery: {}, credentials: {}, cta: {} },
      en: { seoTitle: "", seoDescription: "", banner: {}, story: {}, greeting: {}, philosophy: {}, timeline: {}, gallery: {}, credentials: {}, cta: {} }
    },
    defaultSortOrder: 10,
    imageHints: ["gallery.images.0.src", "gallery.images.1.src", "gallery.images.2.src"]
  },
  {
    pageKey: "appraisal",
    blockKey: "content",
    pageLabel: "Appraisal",
    blockLabel: "鉴定・收购全页内容",
    description: "鉴定收购页面的 hero、服务、收购品目、优势、流程、注意事项和 CTA。",
    defaultContent: {
      ja: { seoTitle: "", seoDescription: "", breadcrumbHome: "", hero: {}, services: {}, purchaseItems: {}, strengths: {}, flow: {}, notes: {}, cta: {} },
      zh: { seoTitle: "", seoDescription: "", breadcrumbHome: "", hero: {}, services: {}, purchaseItems: {}, strengths: {}, flow: {}, notes: {}, cta: {} },
      en: { seoTitle: "", seoDescription: "", breadcrumbHome: "", hero: {}, services: {}, purchaseItems: {}, strengths: {}, flow: {}, notes: {}, cta: {} }
    },
    defaultSortOrder: 10,
    imageHints: ["hero.image"]
  },
  {
    pageKey: "purchase-guide",
    blockKey: "content",
    pageLabel: "Purchase Guide",
    blockLabel: "购买方法全页内容",
    description: "购买方法页面的 banner、intro、流程、支付、配送、退换政策和 FAQ CTA。",
    defaultContent: {
      ja: { seoTitle: "", seoDescription: "", banner: {}, intro: {}, flow: {}, payment: {}, delivery: {}, policy: {}, faq: {} },
      zh: { seoTitle: "", seoDescription: "", banner: {}, intro: {}, flow: {}, payment: {}, delivery: {}, policy: {}, faq: {} },
      en: { seoTitle: "", seoDescription: "", banner: {}, intro: {}, flow: {}, payment: {}, delivery: {}, policy: {}, faq: {} }
    },
    defaultSortOrder: 10
  },
  {
    pageKey: "faq",
    blockKey: "content",
    pageLabel: "FAQ",
    blockLabel: "FAQ 全页内容",
    description: "FAQ 页面 banner、导语、分类问答和 CTA。问答分类数组可排序。",
    defaultContent: {
      ja: { seoTitle: "", seoDescription: "", banner: {}, intro: {}, categories: [], cta: {} },
      zh: { seoTitle: "", seoDescription: "", banner: {}, intro: {}, categories: [], cta: {} },
      en: { seoTitle: "", seoDescription: "", banner: {}, intro: {}, categories: [], cta: {} }
    },
    defaultSortOrder: 10
  }
];

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function deepMerge<T>(fallback: T, override: unknown): T {
  if (Array.isArray(fallback)) {
    return Array.isArray(override) ? (override as T) : fallback;
  }

  if (isRecord(fallback)) {
    if (!isRecord(override)) {
      return fallback;
    }

    const merged: JsonRecord = { ...fallback };
    for (const [key, value] of Object.entries(override)) {
      merged[key] = key in merged ? deepMerge(merged[key], value) : value;
    }
    return merged as T;
  }

  if (typeof fallback === "string" && typeof override === "string" && !override.trim()) {
    return fallback;
  }

  return (override ?? fallback) as T;
}

function languageContent<T>(content: Prisma.JsonValue, lang: Language, fallback: T): T {
  if (isRecord(content)) {
    const localized = content[lang] ?? content.ja;
    return deepMerge(fallback, localized);
  }

  return fallback;
}

export async function getPageBlock<T>(
  pageKey: string,
  blockKey: string,
  lang: Language,
  fallback: T
): Promise<PageBlockState<T>> {
  noStore();

  try {
    const block = await prisma.pageBlock.findUnique({
      where: { pageKey_blockKey: { pageKey, blockKey } }
    });

    if (!block) {
      return { content: fallback, isActive: true, sortOrder: 0 };
    }

    return {
      content: languageContent(block.content, lang, fallback),
      isActive: block.isActive,
      sortOrder: block.sortOrder
    };
  } catch {
    return { content: fallback, isActive: true, sortOrder: 0 };
  }
}

export async function getPageBlocksForAdmin() {
  noStore();

  const records = await prisma.pageBlock.findMany({
    orderBy: [{ pageKey: "asc" }, { sortOrder: "asc" }, { blockKey: "asc" }]
  });
  const byKey = new Map(records.map((record) => [`${record.pageKey}:${record.blockKey}`, record]));

  return pageBlockDefinitions.map((definition) => ({
    definition,
    record: byKey.get(`${definition.pageKey}:${definition.blockKey}`) ?? null
  }));
}

export function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function parseLocalizedJson(raw: Record<Language, string>) {
  return languages.reduce(
    (acc, lang) => {
      acc[lang] = raw[lang].trim() ? JSON.parse(raw[lang]) : {};
      return acc;
    },
    {} as Record<Language, unknown>
  );
}

export function setPath(value: unknown, path: string, nextValue: string) {
  if (!path.trim() || !nextValue.trim()) {
    return value;
  }

  const root = Array.isArray(value) ? [...value] : isRecord(value) ? { ...value } : {};
  const parts = path.split(".").map((part) => part.trim()).filter(Boolean);
  let cursor: JsonRecord | unknown[] = root as JsonRecord | unknown[];

  parts.forEach((part, index) => {
    const isLast = index === parts.length - 1;
    const key = Number.isInteger(Number(part)) ? Number(part) : part;

    if (isLast) {
      (cursor as Record<string | number, unknown>)[key] = nextValue;
      return;
    }

    const current = (cursor as Record<string | number, unknown>)[key];
    const next = Array.isArray(current) ? [...current] : isRecord(current) ? { ...current } : {};
    (cursor as Record<string | number, unknown>)[key] = next;
    cursor = next as JsonRecord | unknown[];
  });

  return root;
}
