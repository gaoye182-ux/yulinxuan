import { collectionImages } from "@/lib/collection-data";
import type { Language } from "@/lib/i18n";

type LocalizedText = Record<Language, string>;

export type ContentKind = "blog" | "news";

export type ContentEntry = {
  id?: string;
  slug: string;
  kind: ContentKind;
  title: LocalizedText;
  excerpt: LocalizedText;
  content?: LocalizedText;
  category: LocalizedText;
  date: string;
  month: string;
  tags: LocalizedText[];
  image?: string;
  coverMediaId?: string;
  featured?: boolean;
  status?: "draft" | "published" | "archived";
  readTime?: LocalizedText;
};

export type ContentDetailCopy = {
  backToList: string;
  publishedAt: string;
  author: string;
  overview: string;
  sections: string[];
  quote: string;
  related: string;
  contactCta: string;
  contactText: string;
  contactButton: string;
};

export type ContentListCopy = {
  seoTitle: string;
  seoDescription: string;
  banner: {
    eyebrow: string;
    title: string;
    subtitle: string;
    breadcrumbHome: string;
  };
  controls: {
    categories: string;
    tags: string;
    archives: string;
    search: string;
    searchPlaceholder: string;
    all: string;
    reset: string;
  };
  labels: {
    featured: string;
    latest: string;
    readMore: string;
    readTime: string;
    monthArchive: string;
  };
  empty: {
    title: string;
    text: string;
    action: string;
  };
};

export const blogCopy: Record<Language, ContentListCopy> = {
  ja: {
    seoTitle: "鑑定士ブログ | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社の鑑定士ブログです。骨董・古美術の見方、新入荷紹介、展覧会・イベント、日々の仕事を三語で発信します。",
    banner: {
      eyebrow: "APPRAISER BLOG",
      title: "鑑定士ブログ",
      subtitle: "器物の見どころ、扱いの注意、入荷品の背景を、鑑定士の視点から静かに綴ります。",
      breadcrumbHome: "ホーム"
    },
    controls: {
      categories: "カテゴリ",
      tags: "タグ",
      archives: "月別アーカイブ",
      search: "検索",
      searchPlaceholder: "記事を検索",
      all: "すべて",
      reset: "条件をリセット"
    },
    labels: {
      featured: "注目記事",
      latest: "最新記事",
      readMore: "記事を読む",
      readTime: "読了目安",
      monthArchive: "月の記事"
    },
    empty: {
      title: "該当する記事はまだありません",
      text: "カテゴリ、タグ、月別アーカイブの絞り込みは公開データ接続後に有効化します。",
      action: "すべての記事へ戻る"
    }
  },
  zh: {
    seoTitle: "鉴定师博客 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社鉴定师博客。发布骨董古美术鉴赏方法、新入荷介绍、展览活动与日常工作记录。",
    banner: {
      eyebrow: "APPRAISER BLOG",
      title: "鉴定师博客",
      subtitle: "从鉴定师视角，安静记录器物看点、保存注意事项与入荷作品背后的时间。",
      breadcrumbHome: "首页"
    },
    controls: {
      categories: "分类",
      tags: "标签",
      archives: "月份归档",
      search: "搜索",
      searchPlaceholder: "搜索文章",
      all: "全部",
      reset: "重置条件"
    },
    labels: {
      featured: "推荐文章",
      latest: "最新文章",
      readMore: "阅读文章",
      readTime: "阅读时间",
      monthArchive: "本月文章"
    },
    empty: {
      title: "暂无符合条件的文章",
      text: "分类、标签与月份归档筛选将在连接后台数据后启用。",
      action: "返回全部文章"
    }
  },
  en: {
    seoTitle: "Appraiser Blog | Gyokurinken Co., Ltd.",
    seoDescription:
      "The Gyokurinken appraiser blog shares perspectives on antiques, fine art, new arrivals, exhibitions, and daily gallery work.",
    banner: {
      eyebrow: "APPRAISER BLOG",
      title: "Appraiser Blog",
      subtitle: "Notes on looking, handling, provenance, and new arrivals from the quiet viewpoint of an appraiser.",
      breadcrumbHome: "Home"
    },
    controls: {
      categories: "Categories",
      tags: "Tags",
      archives: "Monthly Archive",
      search: "Search",
      searchPlaceholder: "Search articles",
      all: "All",
      reset: "Reset Filters"
    },
    labels: {
      featured: "Featured",
      latest: "Latest Articles",
      readMore: "Read Article",
      readTime: "Read Time",
      monthArchive: "Posts This Month"
    },
    empty: {
      title: "No matching articles yet",
      text: "Category, tag, and month filters will become active after the CMS data connection.",
      action: "Back to all articles"
    }
  }
};

export const newsCopy: Record<Language, ContentListCopy> = {
  ja: {
    seoTitle: "新着情報 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社の新着情報です。営業案内、イベント、入荷のお知らせ、サイト更新情報を掲載します。",
    banner: {
      eyebrow: "NEWS",
      title: "新着情報",
      subtitle: "営業日、展示、入荷、サイト更新など、玉林軒からのお知らせを一覧でご案内します。",
      breadcrumbHome: "ホーム"
    },
    controls: {
      categories: "種別",
      tags: "関連タグ",
      archives: "月別アーカイブ",
      search: "検索",
      searchPlaceholder: "お知らせを検索",
      all: "すべて",
      reset: "条件をリセット"
    },
    labels: {
      featured: "重要なお知らせ",
      latest: "お知らせ一覧",
      readMore: "詳細を見る",
      readTime: "確認目安",
      monthArchive: "月のお知らせ"
    },
    empty: {
      title: "該当するお知らせはありません",
      text: "種別、タグ、月別アーカイブの絞り込みは公開データ接続後に有効化します。",
      action: "すべてのお知らせへ戻る"
    }
  },
  zh: {
    seoTitle: "最新资讯 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社最新资讯。发布营业安排、活动、新入荷通知与网站更新。",
    banner: {
      eyebrow: "NEWS",
      title: "最新资讯",
      subtitle: "集中发布营业日期、展览活动、入荷与网站更新等玉林軒官方通知。",
      breadcrumbHome: "首页"
    },
    controls: {
      categories: "类型",
      tags: "相关标签",
      archives: "月份归档",
      search: "搜索",
      searchPlaceholder: "搜索资讯",
      all: "全部",
      reset: "重置条件"
    },
    labels: {
      featured: "重要通知",
      latest: "资讯列表",
      readMore: "查看详情",
      readTime: "确认时间",
      monthArchive: "本月资讯"
    },
    empty: {
      title: "暂无符合条件的资讯",
      text: "类型、标签与月份归档筛选将在连接后台数据后启用。",
      action: "返回全部资讯"
    }
  },
  en: {
    seoTitle: "News | Gyokurinken Co., Ltd.",
    seoDescription:
      "News from Gyokurinken Co., Ltd., including business notices, events, new arrivals, and website updates.",
    banner: {
      eyebrow: "NEWS",
      title: "News",
      subtitle: "Business notices, exhibitions, arrival updates, and website announcements from Gyokurinken.",
      breadcrumbHome: "Home"
    },
    controls: {
      categories: "Types",
      tags: "Related Tags",
      archives: "Monthly Archive",
      search: "Search",
      searchPlaceholder: "Search news",
      all: "All",
      reset: "Reset Filters"
    },
    labels: {
      featured: "Important Notice",
      latest: "News List",
      readMore: "View Details",
      readTime: "Check Time",
      monthArchive: "News This Month"
    },
    empty: {
      title: "No matching news yet",
      text: "Type, tag, and month filters will become active after the CMS data connection.",
      action: "Back to all news"
    }
  }
};

export const contentDetailCopy: Record<Language, Record<ContentKind, ContentDetailCopy>> = {
  ja: {
    blog: {
      backToList: "ブログ一覧へ戻る",
      publishedAt: "公開日",
      author: "玉林軒 鑑定士",
      overview: "記事概要",
      sections: ["見どころ", "確認の手順", "保管と次の相談"],
      quote: "古美術の価値は、目立つ特徴だけでなく、静かな痕跡の積み重ねにも宿ります。",
      related: "関連記事",
      contactCta: "記事に関連するお品のご相談",
      contactText: "写真鑑定、来店予約、購入相談まで、内容に合わせて丁寧にご案内します。",
      contactButton: "お問い合わせ"
    },
    news: {
      backToList: "新着情報一覧へ戻る",
      publishedAt: "掲載日",
      author: "玉林軒株式会社",
      overview: "お知らせ内容",
      sections: ["概要", "対象となる内容", "今後のご案内"],
      quote: "正式情報が確定次第、こちらの新着情報にて順次お知らせいたします。",
      related: "関連するお知らせ",
      contactCta: "お知らせに関するお問い合わせ",
      contactText: "来店予定、鑑定相談、掲載内容についてご不明点がありましたらご連絡ください。",
      contactButton: "お問い合わせ"
    }
  },
  zh: {
    blog: {
      backToList: "返回博客列表",
      publishedAt: "发布日期",
      author: "玉林軒 鉴定师",
      overview: "文章概要",
      sections: ["看点", "确认步骤", "保存与后续咨询"],
      quote: "古美术的价值不只存在于醒目的特征，也藏在安静痕迹的累积之中。",
      related: "相关文章",
      contactCta: "咨询与文章相关的藏品",
      contactText: "从照片鉴定、来店预约到购买咨询，我们会根据内容谨慎说明。",
      contactButton: "联系我们"
    },
    news: {
      backToList: "返回资讯列表",
      publishedAt: "发布日期",
      author: "玉林軒株式会社",
      overview: "资讯内容",
      sections: ["概要", "相关内容", "后续说明"],
      quote: "正式信息确定后，将通过最新资讯陆续发布。",
      related: "相关资讯",
      contactCta: "关于本资讯的咨询",
      contactText: "如需确认来店、鉴定咨询或公告内容，欢迎联系我们。",
      contactButton: "联系我们"
    }
  },
  en: {
    blog: {
      backToList: "Back to Blog",
      publishedAt: "Published",
      author: "Gyokurinken Appraiser",
      overview: "Overview",
      sections: ["What to Notice", "How We Review It", "Care and Next Consultation"],
      quote: "The value of antique art lives not only in prominent features, but also in quiet accumulated traces.",
      related: "Related Articles",
      contactCta: "Consult Us About a Related Work",
      contactText: "We can guide photo appraisal, visit appointments, and purchase consultation according to your situation.",
      contactButton: "Contact"
    },
    news: {
      backToList: "Back to News",
      publishedAt: "Published",
      author: "Gyokurinken Co., Ltd.",
      overview: "Notice Details",
      sections: ["Summary", "Relevant Details", "Next Updates"],
      quote: "Once official details are confirmed, they will be announced here in the news section.",
      related: "Related News",
      contactCta: "Questions About This Notice",
      contactText: "Please contact us for visit schedules, appraisal consultation, or clarification about this notice.",
      contactButton: "Contact"
    }
  }
};

export const blogEntries: ContentEntry[] = [
  {
    slug: "how-to-read-imari-glaze",
    kind: "blog",
    title: {
      ja: "伊万里の釉景を読むための三つの視点",
      zh: "读懂伊万里釉色景致的三个视角",
      en: "Three Ways to Read the Glaze of Imari Ware"
    },
    excerpt: {
      ja: "肌理、釉だまり、口縁の摩耗から、器が過ごしてきた時間を確かめるための基本をまとめます。",
      zh: "从胎釉肌理、积釉与口沿磨耗出发，整理确认器物时间感的基本方法。",
      en: "A calm look at texture, pooled glaze, and rim wear as clues to the time carried by a vessel."
    },
    category: { ja: "鑑定コラム", zh: "鉴定专栏", en: "Appraisal Column" },
    date: "2026-05-20",
    month: "2026-05",
    tags: [
      { ja: "陶磁器", zh: "陶瓷", en: "Ceramics" },
      { ja: "伊万里", zh: "伊万里", en: "Imari" }
    ],
    image: collectionImages.imari,
    featured: true,
    readTime: { ja: "5分", zh: "5分钟", en: "5 min" }
  },
  {
    slug: "new-arrival-korean-celadon",
    kind: "blog",
    title: {
      ja: "高麗青磁小壺の入荷と、淡い青の見どころ",
      zh: "高丽青瓷小壶入荷，以及淡青色的看点",
      en: "A Small Goryeo Celadon Jar and the Beauty of Pale Blue"
    },
    excerpt: {
      ja: "控えめな姿の中にある釉色、貫入、口造りの表情を、入荷記録としてご紹介します。",
      zh: "作为入荷记录，介绍釉色、开片与口部造型在克制器形中的表现。",
      en: "Arrival notes on glaze color, crackle, and rim expression within a restrained form."
    },
    category: { ja: "新入荷情報", zh: "入荷信息", en: "New Arrival" },
    date: "2026-05-12",
    month: "2026-05",
    tags: [
      { ja: "朝鮮美術", zh: "朝鲜美术", en: "Korean Art" },
      { ja: "青磁", zh: "青瓷", en: "Celadon" }
    ],
    image: collectionImages.celadon,
    readTime: { ja: "4分", zh: "4分钟", en: "4 min" }
  },
  {
    slug: "scroll-storage-season",
    kind: "blog",
    title: {
      ja: "掛軸を季節の湿度から守る小さな習慣",
      zh: "保护挂轴免受季节湿气影响的小习惯",
      en: "Small Habits for Protecting Scrolls from Seasonal Humidity"
    },
    excerpt: {
      ja: "開閉の頻度、桐箱の置き場所、虫干しの考え方など、日常の保管で見直したい点を整理します。",
      zh: "整理开合频率、桐箱放置位置、虫干思路等日常保存中值得重新确认的要点。",
      en: "Storage notes on opening frequency, paulownia boxes, airing, and seasonal care."
    },
    category: { ja: "日々のこと", zh: "日常记录", en: "Daily Notes" },
    date: "2026-04-28",
    month: "2026-04",
    tags: [
      { ja: "掛軸", zh: "挂轴", en: "Scrolls" },
      { ja: "保存", zh: "保存", en: "Care" }
    ],
    image: collectionImages.scroll,
    readTime: { ja: "6分", zh: "6分钟", en: "6 min" }
  },
  {
    slug: "spring-antique-fair-note",
    kind: "blog",
    title: {
      ja: "春の古美術展で出会った、静かな茶道具",
      zh: "春季古美术展中遇见的静谧茶道具",
      en: "Quiet Tea Utensils Found at a Spring Antique Fair"
    },
    excerpt: {
      ja: "展覧会・イベントの現場で感じた、作品と空間の距離についての短い記録です。",
      zh: "关于展览活动现场中作品与空间距离感的一则简短记录。",
      en: "A brief note on the distance between works and space at an exhibition venue."
    },
    category: { ja: "展覧会・イベント", zh: "展览・活动", en: "Exhibitions" },
    date: "2026-04-16",
    month: "2026-04",
    tags: [
      { ja: "茶道具", zh: "茶道具", en: "Tea Ware" },
      { ja: "イベント", zh: "活动", en: "Event" }
    ],
    image: collectionImages.tea,
    readTime: { ja: "3分", zh: "3分钟", en: "3 min" }
  }
];

export const newsEntries: ContentEntry[] = [
  {
    slug: "opening-preparation-notice",
    kind: "news",
    title: {
      ja: "三語公式サイト公開準備のお知らせ",
      zh: "三语官方网站公开准备通知",
      en: "Trilingual Official Website in Preparation"
    },
    excerpt: {
      ja: "玉林軒株式会社の公式サイトは、日本語・中文・英語での公開に向けて段階的に整備しています。",
      zh: "玉林軒株式会社官方网站正在面向日文、中文、英文公开进行阶段性准备。",
      en: "The official Gyokurinken website is being prepared progressively in Japanese, Chinese, and English."
    },
    category: { ja: "お知らせ", zh: "公告", en: "Notice" },
    date: "2026-05-24",
    month: "2026-05",
    tags: [{ ja: "サイト更新", zh: "网站更新", en: "Website" }],
    featured: true,
    readTime: { ja: "1分", zh: "1分钟", en: "1 min" }
  },
  {
    slug: "may-new-arrivals",
    kind: "news",
    title: {
      ja: "五月の新入荷予定について",
      zh: "关于五月新入荷计划",
      en: "May New Arrival Schedule"
    },
    excerpt: {
      ja: "陶磁器、掛軸、工芸品を中心に、新入荷・特選品ページへ順次掲載予定です。",
      zh: "以陶瓷、挂轴与工艺品为中心，将陆续发布至新入荷・精选页面。",
      en: "Ceramics, scrolls, and craft works will be added gradually to the New Arrivals page."
    },
    category: { ja: "新入荷", zh: "新入荷", en: "New Arrivals" },
    date: "2026-05-18",
    month: "2026-05",
    tags: [{ ja: "蔵品", zh: "藏品", en: "Collection" }],
    readTime: { ja: "1分", zh: "1分钟", en: "1 min" }
  },
  {
    slug: "appointment-only-consultation",
    kind: "news",
    title: {
      ja: "鑑定相談は予約制で承ります",
      zh: "鉴定咨询采取预约制",
      en: "Appraisal Consultations by Appointment"
    },
    excerpt: {
      ja: "大切なお品を落ち着いて確認するため、店頭鑑定と写真鑑定は事前予約をお願いしています。",
      zh: "为能安静确认重要藏品，店头鉴定与照片鉴定请提前预约。",
      en: "In-store and photo appraisals are handled by appointment so each work can be reviewed carefully."
    },
    category: { ja: "休業案内", zh: "营业安排", en: "Business Notice" },
    date: "2026-05-08",
    month: "2026-05",
    tags: [{ ja: "鑑定", zh: "鉴定", en: "Appraisal" }],
    readTime: { ja: "1分", zh: "1分钟", en: "1 min" }
  },
  {
    slug: "early-summer-event-plan",
    kind: "news",
    title: {
      ja: "初夏の小展示を準備中です",
      zh: "初夏小型展览正在准备中",
      en: "Early Summer Small Exhibition in Planning"
    },
    excerpt: {
      ja: "茶道具と掛軸を中心に、季節のしつらえを感じる小展示を準備しています。",
      zh: "以茶道具与挂轴为中心，准备呈现具有季节陈设感的小型展览。",
      en: "A small seasonal exhibition centered on tea utensils and scrolls is currently in planning."
    },
    category: { ja: "イベント", zh: "活动", en: "Event" },
    date: "2026-04-30",
    month: "2026-04",
    tags: [{ ja: "展示", zh: "展览", en: "Exhibition" }],
    readTime: { ja: "1分", zh: "1分钟", en: "1 min" }
  }
];

export function getUniqueLocalizedValues(entries: ContentEntry[], lang: Language, field: "category" | "tags") {
  const values = entries.flatMap((entry) =>
    field === "category" ? [entry.category[lang]] : entry.tags.map((tag) => tag[lang])
  );

  return Array.from(new Set(values));
}

export function getArchiveMonths(entries: ContentEntry[]) {
  return Array.from(new Set(entries.map((entry) => entry.month)));
}

export function getContentEntries(kind: ContentKind) {
  return kind === "blog" ? blogEntries : newsEntries;
}

export function getContentEntry(kind: ContentKind, slug: string) {
  return getContentEntries(kind).find((entry) => entry.slug === slug);
}

export function getRelatedContent(entry: ContentEntry, entries = getContentEntries(entry.kind)) {
  return entries
    .filter((candidate) => candidate.slug !== entry.slug)
    .slice(0, 3);
}
