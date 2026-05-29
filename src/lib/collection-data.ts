import type { Language } from "@/lib/i18n";

export type CategoryKey =
  | "all"
  | "japanese"
  | "korean"
  | "chinese"
  | "furniture"
  | "craft"
  | "featured";

export type LocalizedText = Record<Language, string>;

export type CollectionImage = {
  url: string;
  alt?: Partial<LocalizedText>;
  isPrimary?: boolean;
};

export type CollectionItem = {
  slug: string;
  name: LocalizedText;
  era: LocalizedText;
  origin: LocalizedText;
  artist: LocalizedText;
  dimensions: string;
  condition: LocalizedText;
  category: Exclude<CategoryKey, "all">;
  categorySlug?: string;
  categoryName?: LocalizedText;
  tags: LocalizedText[];
  priceStatus: LocalizedText;
  priceDisplay: "visible" | "inquiry" | "hidden";
  price?: number;
  currency?: "JPY" | "USD" | "CNY";
  isNew: boolean;
  isFeatured: boolean;
  description: LocalizedText;
  notes: LocalizedText[];
  images: CollectionImage[];
};

export type CollectionCategory = {
  key: CategoryKey;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
};

export type CollectionCopy = {
  seoTitle: string;
  seoDescription: string;
  banner: {
    eyebrow: string;
    title: string;
    subtitle: string;
    breadcrumbHome: string;
  };
  filters: {
    title: string;
    reset: string;
    era: string;
    origin: string;
    price: string;
    flag: string;
    sort: string;
    options: {
      allEra: string;
      edo: string;
      meiji: string;
      joseon: string;
      china: string;
      allOrigin: string;
      japan: string;
      korea: string;
      chinaOrigin: string;
      allPrice: string;
      inquiry: string;
      available: string;
      newOnly: string;
      featuredOnly: string;
      latest: string;
      recommended: string;
      name: string;
    };
  };
  card: {
    era: string;
    origin: string;
  };
  pagination: {
    previous: string;
    next: string;
  };
  empty: {
    title: string;
    text: string;
    action: string;
  };
  detail: {
    collection: string;
    category: string;
    era: string;
    origin: string;
    artist: string;
    dimensions: string;
    condition: string;
    priceStatus: string;
    description: string;
    notes: string;
    inquiry: string;
    appraisal: string;
    related: string;
    thumbnails: string;
  };
};

export const collectionImages = {
  imari:
    "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=1200&q=86",
  scroll:
    "https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&w=1200&q=86",
  celadon:
    "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=1200&q=86",
  jar:
    "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1200&q=86",
  chest:
    "https://images.unsplash.com/photo-1615800002234-05c4d488696c?auto=format&fit=crop&w=1200&q=86",
  lacquer:
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=86",
  bronze:
    "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=86",
  tea:
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=86",
  jade:
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1200&q=86"
};

export function media(url: string, alt?: Partial<LocalizedText>, isPrimary = false): CollectionImage {
  return { url, alt, isPrimary };
}

export const categoryOrder: CategoryKey[] = [
  "all",
  "japanese",
  "korean",
  "chinese",
  "furniture",
  "craft",
  "featured"
];

export const collectionCategories: CollectionCategory[] = [
  {
    key: "all",
    slug: "all",
    name: { ja: "全部", zh: "全部", en: "All" },
    description: {
      ja: "玉林軒が扱う古美術、骨董、工芸、家具を横断してご覧いただけます。",
      zh: "横向浏览玉林軒经营的古美术、骨董、工艺与家具。",
      en: "Browse all antiques, fine art, craft works, and furniture handled by Gyokurinken."
    }
  },
  {
    key: "japanese",
    slug: "japanese-art",
    name: { ja: "日本美術", zh: "日本美术", en: "Japanese Art" },
    description: {
      ja: "陶磁器、茶道具、掛軸、書画など、日本の美意識が宿る品々。",
      zh: "陶瓷、茶道具、挂轴、书画等承载日本审美的器物。",
      en: "Ceramics, tea wares, scrolls, and paintings shaped by Japanese aesthetics."
    }
  },
  {
    key: "korean",
    slug: "korean-art",
    name: { ja: "朝鮮美術", zh: "朝鲜美术", en: "Korean Art" },
    description: {
      ja: "高麗青磁、李朝白磁を中心に、静謐な線と釉調を備えた朝鮮美術。",
      zh: "以高丽青瓷、李朝白瓷为中心，呈现安静线条与釉色之美。",
      en: "Korean works centered on Goryeo celadon and Joseon white porcelain."
    }
  },
  {
    key: "chinese",
    slug: "chinese-art",
    name: { ja: "中国美術", zh: "中国美术", en: "Chinese Art" },
    description: {
      ja: "中国陶磁、玉器、書画など、長い時代を映す美術品をご紹介します。",
      zh: "中国陶瓷、玉器、书画等映照悠久时代的美术品。",
      en: "Chinese ceramics, jade, painting, and works carrying long historical memory."
    }
  },
  {
    key: "furniture",
    slug: "furniture",
    name: { ja: "箪笥・家具", zh: "箪笥・家具", en: "Furniture" },
    description: {
      ja: "時代箪笥や木工家具など、暮らしと手仕事の美を備えた品々。",
      zh: "时代箪笥与木工家具，呈现生活器物与手工之美。",
      en: "Period chests and wood furniture with the beauty of daily craft."
    }
  },
  {
    key: "craft",
    slug: "craft-works",
    name: { ja: "工芸品", zh: "工艺品", en: "Craft Works" },
    description: {
      ja: "漆器、金工、硝子工芸など、素材と技法の細やかさを伝える工芸品。",
      zh: "漆器、金工、玻璃工艺等展现材料与技法细节的工艺品。",
      en: "Lacquer, metalwork, glass, and other works where material and technique meet."
    }
  },
  {
    key: "featured",
    slug: "new-featured",
    name: { ja: "新入荷・特選品", zh: "新入荷・精选", en: "New & Featured" },
    description: {
      ja: "近時入荷した品と、玉林軒が特におすすめする一品を集めました。",
      zh: "汇集近期入荷藏品与玉林軒特别推荐的精选品。",
      en: "Recently acquired works and pieces specially recommended by Gyokurinken."
    }
  }
];

export const collectionCopy: Record<Language, CollectionCopy> = {
  ja: {
    seoTitle: "蔵品紹介 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社が扱う日本美術、朝鮮美術、中国美術、箪笥・家具、工芸品、新入荷・特選品の蔵品一覧です。",
    banner: {
      eyebrow: "COLLECTION",
      title: "蔵品紹介",
      subtitle: "器物の静けさ、時代の手触り、受け継がれる美を丁寧にご紹介します。",
      breadcrumbHome: "ホーム"
    },
    filters: {
      title: "絞り込み",
      reset: "条件をクリア",
      era: "時代",
      origin: "産地",
      price: "価格区分",
      flag: "表示",
      sort: "並び替え",
      options: {
        allEra: "すべての時代",
        edo: "江戸・明治",
        meiji: "近代",
        joseon: "高麗・李朝",
        china: "明・清",
        allOrigin: "すべての産地",
        japan: "日本",
        korea: "朝鮮半島",
        chinaOrigin: "中国",
        allPrice: "すべて",
        inquiry: "価格応相談",
        available: "販売中",
        newOnly: "新入荷のみ",
        featuredOnly: "特選品のみ",
        latest: "新着順",
        recommended: "おすすめ順",
        name: "品名順"
      }
    },
    card: { era: "時代", origin: "産地" },
    pagination: { previous: "前へ", next: "次へ" },
    empty: {
      title: "該当する蔵品はありません",
      text: "条件を変更して、もう一度お探しください。公開準備中の蔵品についてはお問い合わせください。",
      action: "すべての蔵品を見る"
    },
    detail: {
      collection: "蔵品紹介",
      category: "分類",
      era: "時代",
      origin: "産地",
      artist: "作家",
      dimensions: "寸法",
      condition: "状態",
      priceStatus: "価格",
      description: "詳細説明",
      notes: "ご確認事項",
      inquiry: "この品について問い合わせる",
      appraisal: "鑑定・買取を相談",
      related: "関連する蔵品",
      thumbnails: "画像一覧"
    }
  },
  zh: {
    seoTitle: "藏品介绍 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社藏品列表，涵盖日本美术、朝鲜美术、中国美术、箪笥家具、工艺品及新入荷精选品。",
    banner: {
      eyebrow: "COLLECTION",
      title: "藏品介绍",
      subtitle: "以安静的陈列呈现器物之美、时代质感与可被继续传承的故事。",
      breadcrumbHome: "首页"
    },
    filters: {
      title: "筛选",
      reset: "清除条件",
      era: "时代",
      origin: "产地",
      price: "价格状态",
      flag: "显示",
      sort: "排序",
      options: {
        allEra: "全部时代",
        edo: "江户・明治",
        meiji: "近现代",
        joseon: "高丽・李朝",
        china: "明・清",
        allOrigin: "全部产地",
        japan: "日本",
        korea: "朝鲜半岛",
        chinaOrigin: "中国",
        allPrice: "全部",
        inquiry: "价格咨询",
        available: "销售中",
        newOnly: "仅新入荷",
        featuredOnly: "仅精选品",
        latest: "最新顺",
        recommended: "推荐顺",
        name: "品名顺"
      }
    },
    card: { era: "时代", origin: "产地" },
    pagination: { previous: "上一页", next: "下一页" },
    empty: {
      title: "暂无符合条件的藏品",
      text: "请调整筛选条件后再次查看。尚未公开的藏品，也欢迎直接咨询。",
      action: "查看全部藏品"
    },
    detail: {
      collection: "藏品介绍",
      category: "分类",
      era: "时代",
      origin: "产地",
      artist: "作家",
      dimensions: "尺寸",
      condition: "状态",
      priceStatus: "价格",
      description: "详情说明",
      notes: "注意事项",
      inquiry: "咨询此藏品",
      appraisal: "咨询鉴定・收购",
      related: "相关藏品",
      thumbnails: "图片列表"
    }
  },
  en: {
    seoTitle: "Collection | Gyokurinken Co., Ltd.",
    seoDescription:
      "Browse Gyokurinken's collection of Japanese, Korean, and Chinese art, period furniture, craft works, new arrivals, and featured pieces.",
    banner: {
      eyebrow: "COLLECTION",
      title: "Collection",
      subtitle: "A quiet catalogue of works selected for presence, provenance, condition, and lasting beauty.",
      breadcrumbHome: "Home"
    },
    filters: {
      title: "Filters",
      reset: "Clear Filters",
      era: "Era",
      origin: "Origin",
      price: "Price Status",
      flag: "Display",
      sort: "Sort",
      options: {
        allEra: "All eras",
        edo: "Edo / Meiji",
        meiji: "Modern",
        joseon: "Goryeo / Joseon",
        china: "Ming / Qing",
        allOrigin: "All origins",
        japan: "Japan",
        korea: "Korean Peninsula",
        chinaOrigin: "China",
        allPrice: "All",
        inquiry: "Price on request",
        available: "Available",
        newOnly: "New arrivals only",
        featuredOnly: "Featured only",
        latest: "Newest",
        recommended: "Recommended",
        name: "Name"
      }
    },
    card: { era: "Era", origin: "Origin" },
    pagination: { previous: "Previous", next: "Next" },
    empty: {
      title: "No works match these filters",
      text: "Please adjust the conditions and browse again. Unlisted works may also be available by inquiry.",
      action: "View All Works"
    },
    detail: {
      collection: "Collection",
      category: "Category",
      era: "Era",
      origin: "Origin",
      artist: "Artist",
      dimensions: "Dimensions",
      condition: "Condition",
      priceStatus: "Price",
      description: "Description",
      notes: "Notes",
      inquiry: "Inquire About This Work",
      appraisal: "Request Appraisal",
      related: "Related Works",
      thumbnails: "Thumbnails"
    }
  }
};

export const collectionItems: CollectionItem[] = [
  {
    slug: "ko-imari-blue-white-dish",
    name: { ja: "古伊万里 染付輪花皿", zh: "古伊万里 染付轮花盘", en: "Ko-Imari Blue-and-White Dish" },
    era: { ja: "江戸後期", zh: "江户后期", en: "Late Edo" },
    origin: { ja: "肥前", zh: "肥前", en: "Hizen, Japan" },
    artist: { ja: "不詳", zh: "不详", en: "Unknown" },
    dimensions: "D 24.5cm x H 4.2cm",
    condition: { ja: "経年による小擦れあり、全体良好", zh: "有年代细微擦痕，整体良好", en: "Minor age wear, overall good condition" },
    category: "japanese",
    tags: [{ ja: "陶磁器", zh: "陶瓷", en: "Ceramic" }, { ja: "新入荷", zh: "新入荷", en: "New" }],
    priceStatus: { ja: "価格応相談", zh: "价格咨询", en: "Price on Request" },
    priceDisplay: "inquiry",
    currency: "JPY",
    isNew: true,
    isFeatured: false,
    description: {
      ja: "藍の濃淡と余白の調和が美しい古伊万里の輪花皿です。静かな絵付けと端正な形が、日常の器でありながら鑑賞にも耐える品格を備えています。",
      zh: "这件古伊万里轮花盘以蓝色浓淡与留白的平衡见长。器形端正，绘付安静，可作日常器物，也适合陈列观赏。",
      en: "A Ko-Imari dish with elegant cobalt tones and generous quiet space. Its poised form and restrained decoration make it suitable for both display and use."
    },
    notes: [
      { ja: "古美術品のため、状態は写真と現物確認をおすすめします。", zh: "因属于古美术品，建议结合照片与实物确认状态。", en: "As an antique work, condition should be confirmed by photos and in person." },
      { ja: "価格、配送、海外発送についてはお問い合わせください。", zh: "价格、配送及海外発送请另行咨询。", en: "Please inquire about pricing, delivery, and overseas shipping." }
    ],
    images: [
      media(collectionImages.imari, { ja: "古伊万里 染付輪花皿 正面", zh: "古伊万里 染付轮花盘 正面", en: "Ko-Imari dish front" }, true),
      media(collectionImages.tea, { ja: "古伊万里 染付輪花皿 詳細", zh: "古伊万里 染付轮花盘 细节", en: "Ko-Imari dish detail" }),
      media(collectionImages.jar, { ja: "古伊万里 染付輪花皿 参考画像", zh: "古伊万里 染付轮花盘 参考图", en: "Ko-Imari dish reference" })
    ]
  },
  {
    slug: "landscape-hanging-scroll",
    name: { ja: "山水図 掛軸", zh: "山水图 挂轴", en: "Landscape Hanging Scroll" },
    era: { ja: "明治期", zh: "明治期", en: "Meiji Period" },
    origin: { ja: "日本", zh: "日本", en: "Japan" },
    artist: { ja: "不詳", zh: "不详", en: "Unknown" },
    dimensions: "W 42cm x H 186cm",
    condition: { ja: "表装に時代感あり、画面良好", zh: "装裱有时代感，画面状态良好", en: "Mounting shows age, image area in good condition" },
    category: "japanese",
    tags: [{ ja: "書画", zh: "书画", en: "Painting" }, { ja: "特選", zh: "精选", en: "Featured" }],
    priceStatus: { ja: "販売中", zh: "销售中", en: "Available" },
    priceDisplay: "visible",
    price: 180000,
    currency: "JPY",
    isNew: false,
    isFeatured: true,
    description: {
      ja: "淡い筆致で遠景を描いた山水図です。床の間や茶室にも合わせやすい落ち着いた気配を持ちます。",
      zh: "以淡雅笔致描绘远景山水，气息沉稳，适合床之间、茶室或书斋陈列。",
      en: "A quiet landscape scroll rendered with light brushwork, suitable for a tokonoma, tea room, or study."
    },
    notes: [
      { ja: "掛軸は湿度管理のうえ保管してください。", zh: "挂轴请注意湿度管理并妥善保管。", en: "Scrolls should be stored with careful humidity control." },
      { ja: "詳細画像をご希望の場合はお問い合わせください。", zh: "如需细节图片，请联系我们。", en: "Additional detail images are available on request." }
    ],
    images: [
      media(collectionImages.scroll, { ja: "山水図 掛軸 全体", zh: "山水图 挂轴 全体", en: "Landscape hanging scroll full view" }, true),
      media(collectionImages.lacquer, { ja: "山水図 掛軸 表装", zh: "山水图 挂轴 装裱", en: "Landscape hanging scroll mounting" }),
      media(collectionImages.bronze, { ja: "山水図 掛軸 詳細", zh: "山水图 挂轴 细节", en: "Landscape hanging scroll detail" })
    ]
  },
  {
    slug: "goryeo-celadon-jar",
    name: { ja: "高麗青磁 小壺", zh: "高丽青瓷 小壶", en: "Goryeo Celadon Jar" },
    era: { ja: "高麗時代", zh: "高丽时代", en: "Goryeo Dynasty" },
    origin: { ja: "朝鮮半島", zh: "朝鲜半岛", en: "Korean Peninsula" },
    artist: { ja: "不詳", zh: "不详", en: "Unknown" },
    dimensions: "W 11cm x H 13cm",
    condition: { ja: "釉調良好、口縁に小傷あり", zh: "釉色良好，口沿有小伤", en: "Fine glaze tone, small rim nick" },
    category: "korean",
    tags: [{ ja: "青磁", zh: "青瓷", en: "Celadon" }],
    priceStatus: { ja: "価格応相談", zh: "价格咨询", en: "Price on Request" },
    priceDisplay: "inquiry",
    currency: "JPY",
    isNew: false,
    isFeatured: false,
    description: {
      ja: "柔らかな青磁釉と小ぶりな姿が魅力の小壺です。掌中で鑑賞できる穏やかな存在感があります。",
      zh: "小壶釉色柔和，器形小巧，具有适合掌中把玩的安静存在感。",
      en: "A small celadon jar with a soft glaze tone and calm hand-held presence."
    },
    notes: [
      { ja: "時代判定は現物確認と資料照合を前提としています。", zh: "时代判断以实物确认与资料比对为前提。", en: "Dating is subject to in-person review and reference comparison." },
      { ja: "店頭でのご確認予約を承ります。", zh: "可预约到店确认。", en: "In-store viewing can be arranged." }
    ],
    images: [
      media(collectionImages.celadon, { ja: "高麗青磁 小壺 正面", zh: "高丽青瓷 小壶 正面", en: "Goryeo celadon jar front" }, true),
      media(collectionImages.jar, { ja: "高麗青磁 小壺 釉調", zh: "高丽青瓷 小壶 釉色", en: "Goryeo celadon jar glaze" }),
      media(collectionImages.imari, { ja: "高麗青磁 小壺 参考画像", zh: "高丽青瓷 小壶 参考图", en: "Goryeo celadon jar reference" })
    ]
  },
  {
    slug: "blue-white-floral-vase",
    name: { ja: "青花 花鳥文瓶", zh: "青花花鸟纹瓶", en: "Blue-and-White Floral Vase" },
    era: { ja: "清代", zh: "清代", en: "Qing Dynasty" },
    origin: { ja: "中国", zh: "中国", en: "China" },
    artist: { ja: "不詳", zh: "不详", en: "Unknown" },
    dimensions: "W 18cm x H 31cm",
    condition: { ja: "胴部良好、底部に経年汚れ", zh: "器身良好，底部有年代污痕", en: "Body in good condition, aged wear to foot" },
    category: "chinese",
    tags: [{ ja: "中国陶磁", zh: "中国陶瓷", en: "Chinese Ceramic" }],
    priceStatus: { ja: "お問い合わせ", zh: "请咨询", en: "Inquire" },
    priceDisplay: "inquiry",
    currency: "JPY",
    isNew: false,
    isFeatured: false,
    description: {
      ja: "花鳥文を伸びやかに配した青花瓶です。棚飾りとして空間に凛とした縦の線を添えます。",
      zh: "青花瓶以花鸟纹舒展布局，作为陈列器可为空间带来清朗的纵向线条。",
      en: "A blue-and-white vase with floral and bird motifs, bringing a clear vertical presence to display."
    },
    notes: [
      { ja: "輸出入や海外配送は個別に確認いたします。", zh: "出口及海外配送需个别确认。", en: "Export and overseas shipping require individual confirmation." },
      { ja: "口縁、底部の詳細写真をご用意できます。", zh: "可提供口沿、底部细节图片。", en: "Rim and foot detail images can be provided." }
    ],
    images: [
      media(collectionImages.jar, { ja: "青花 花鳥文瓶 正面", zh: "青花花鸟纹瓶 正面", en: "Blue-and-white floral vase front" }, true),
      media(collectionImages.jade, { ja: "青花 花鳥文瓶 文様", zh: "青花花鸟纹瓶 纹样", en: "Blue-and-white floral vase motif" }),
      media(collectionImages.celadon, { ja: "青花 花鳥文瓶 参考画像", zh: "青花花鸟纹瓶 参考图", en: "Blue-and-white floral vase reference" })
    ]
  },
  {
    slug: "period-merchant-chest",
    name: { ja: "時代帳場箪笥", zh: "时代帐场箪笥", en: "Period Merchant Chest" },
    era: { ja: "明治期", zh: "明治期", en: "Meiji Period" },
    origin: { ja: "日本", zh: "日本", en: "Japan" },
    artist: { ja: "不詳", zh: "不详", en: "Unknown" },
    dimensions: "W 88cm x D 42cm x H 91cm",
    condition: { ja: "金具に経年変化、使用に支障なし", zh: "金具有年代变化，不影响使用", en: "Aged fittings, structurally usable" },
    category: "furniture",
    tags: [{ ja: "箪笥", zh: "箪笥", en: "Chest" }, { ja: "家具", zh: "家具", en: "Furniture" }],
    priceStatus: { ja: "販売中", zh: "销售中", en: "Available" },
    priceDisplay: "visible",
    price: 320000,
    currency: "JPY",
    isNew: true,
    isFeatured: false,
    description: {
      ja: "帳場で使われた堅牢な時代箪笥です。木味と金具の表情が深く、店舗什器としても存在感があります。",
      zh: "用于帐场的坚实时代箪笥，木味与金具表情深厚，也适合作为空间陈列家具。",
      en: "A sturdy merchant chest with expressive wood grain and fittings, suitable as both furniture and display."
    },
    notes: [
      { ja: "大型品のため配送費は地域により異なります。", zh: "大型物件配送费用因地区而异。", en: "Delivery cost varies by area due to size." },
      { ja: "現物確認、採寸の追加相談を承ります。", zh: "可咨询实物确认与追加测量。", en: "Viewing and additional measurements are available on request." }
    ],
    images: [
      media(collectionImages.chest, { ja: "時代帳場箪笥 正面", zh: "时代帐场箪笥 正面", en: "Period merchant chest front" }, true),
      media(collectionImages.lacquer, { ja: "時代帳場箪笥 金具", zh: "时代帐场箪笥 金具", en: "Period merchant chest fittings" }),
      media(collectionImages.bronze, { ja: "時代帳場箪笥 木味", zh: "时代帐场箪笥 木味", en: "Period merchant chest wood grain" })
    ]
  },
  {
    slug: "maki-e-writing-box",
    name: { ja: "蒔絵 文箱", zh: "莳绘 文箱", en: "Maki-e Writing Box" },
    era: { ja: "大正期", zh: "大正期", en: "Taisho Period" },
    origin: { ja: "日本", zh: "日本", en: "Japan" },
    artist: { ja: "不詳", zh: "不详", en: "Unknown" },
    dimensions: "W 26cm x D 20cm x H 7cm",
    condition: { ja: "蓋表に小擦れ、内部良好", zh: "盖面有轻微擦痕，内部良好", en: "Minor wear to lid, interior good" },
    category: "craft",
    tags: [{ ja: "漆器", zh: "漆器", en: "Lacquer" }],
    priceStatus: { ja: "価格応相談", zh: "价格咨询", en: "Price on Request" },
    priceDisplay: "inquiry",
    currency: "JPY",
    isNew: false,
    isFeatured: false,
    description: {
      ja: "落ち着いた蒔絵文様を持つ文箱です。漆の艶と細やかな装飾が、手元で見る工芸の魅力を伝えます。",
      zh: "带有沉稳莳绘纹样的文箱，漆面光泽与细致装饰呈现近距离观赏的工艺魅力。",
      en: "A writing box with restrained maki-e decoration, showing the intimate appeal of lacquer craft."
    },
    notes: [
      { ja: "漆器は直射日光、高湿度を避けてください。", zh: "漆器请避免直射日光与高湿环境。", en: "Lacquer should be kept away from direct sunlight and high humidity." },
      { ja: "細部状態は追加写真でご案内できます。", zh: "细节状态可通过追加照片说明。", en: "Condition details can be shown in additional photos." }
    ],
    images: [
      media(collectionImages.lacquer, { ja: "蒔絵 文箱 正面", zh: "莳绘 文箱 正面", en: "Maki-e writing box front" }, true),
      media(collectionImages.chest, { ja: "蒔絵 文箱 蓋表", zh: "莳绘 文箱 盖面", en: "Maki-e writing box lid" }),
      media(collectionImages.jade, { ja: "蒔絵 文箱 詳細", zh: "莳绘 文箱 细节", en: "Maki-e writing box detail" })
    ]
  },
  {
    slug: "bronze-flower-vessel",
    name: { ja: "銅花入", zh: "铜花入", en: "Bronze Flower Vessel" },
    era: { ja: "昭和初期", zh: "昭和初期", en: "Early Showa" },
    origin: { ja: "日本", zh: "日本", en: "Japan" },
    artist: { ja: "不詳", zh: "不详", en: "Unknown" },
    dimensions: "W 9cm x H 24cm",
    condition: { ja: "肌合い良好、水漏れ確認済み", zh: "肌理良好，已确认不漏水", en: "Fine surface, checked for water leakage" },
    category: "featured",
    tags: [{ ja: "金工", zh: "金工", en: "Metalwork" }, { ja: "新入荷", zh: "新入荷", en: "New" }],
    priceStatus: { ja: "新入荷", zh: "新入荷", en: "New Arrival" },
    priceDisplay: "inquiry",
    currency: "JPY",
    isNew: true,
    isFeatured: true,
    description: {
      ja: "茶席にも合わせやすい銅花入です。控えめな肌合いと細い姿が、花を静かに引き立てます。",
      zh: "适合茶席陈列的铜花入，肌理克制，器形修长，可安静衬托花材。",
      en: "A bronze flower vessel suited to tea settings, with a restrained surface and slender form."
    },
    notes: [
      { ja: "水漏れ確認済みですが、使用前に再確認ください。", zh: "虽已确认不漏水，使用前仍建议再次确认。", en: "Water leakage has been checked, but please confirm before use." },
      { ja: "花材は付属しません。", zh: "不附花材。", en: "Flowers are not included." }
    ],
    images: [
      media(collectionImages.bronze, { ja: "銅花入 正面", zh: "铜花入 正面", en: "Bronze flower vessel front" }, true),
      media(collectionImages.lacquer, { ja: "銅花入 肌合い", zh: "铜花入 肌理", en: "Bronze flower vessel surface" }),
      media(collectionImages.scroll, { ja: "銅花入 参考画像", zh: "铜花入 参考图", en: "Bronze flower vessel reference" })
    ]
  },
  {
    slug: "iron-glazed-tea-bowl",
    name: { ja: "茶碗 鉄釉", zh: "铁釉茶碗", en: "Iron-Glazed Tea Bowl" },
    era: { ja: "江戸期", zh: "江户期", en: "Edo Period" },
    origin: { ja: "日本", zh: "日本", en: "Japan" },
    artist: { ja: "不詳", zh: "不详", en: "Unknown" },
    dimensions: "D 12cm x H 8cm",
    condition: { ja: "高台に小欠け、景色良好", zh: "高台有小缺，景色良好", en: "Small foot chip, pleasing glaze character" },
    category: "japanese",
    tags: [{ ja: "茶道具", zh: "茶道具", en: "Tea Ware" }],
    priceStatus: { ja: "販売中", zh: "销售中", en: "Available" },
    priceDisplay: "visible",
    price: 86000,
    currency: "JPY",
    isNew: false,
    isFeatured: false,
    description: {
      ja: "鉄釉の深い色味が魅力の茶碗です。手取りがよく、茶席での実用にも鑑賞にも向きます。",
      zh: "铁釉色调深沉，手感良好，适合茶席实用与观赏。",
      en: "A tea bowl with a deep iron glaze, pleasing in the hand and suitable for tea use or display."
    },
    notes: [
      { ja: "使用前には水通しと状態確認をおすすめします。", zh: "使用前建议过水并确认状态。", en: "Rinsing and condition confirmation are recommended before use." },
      { ja: "共箱は付属しません。", zh: "不附共箱。", en: "No signed box is included." }
    ],
    images: [
      media(collectionImages.tea, { ja: "茶碗 鉄釉 正面", zh: "铁釉茶碗 正面", en: "Iron-glazed tea bowl front" }, true),
      media(collectionImages.imari, { ja: "茶碗 鉄釉 見込み", zh: "铁釉茶碗 内部", en: "Iron-glazed tea bowl interior" }),
      media(collectionImages.bronze, { ja: "茶碗 鉄釉 高台", zh: "铁釉茶碗 高台", en: "Iron-glazed tea bowl foot" })
    ]
  },
  {
    slug: "small-jade-ornament",
    name: { ja: "翡翠 小置物", zh: "翡翠小摆件", en: "Small Jade Ornament" },
    era: { ja: "清代", zh: "清代", en: "Qing Dynasty" },
    origin: { ja: "中国", zh: "中国", en: "China" },
    artist: { ja: "不詳", zh: "不详", en: "Unknown" },
    dimensions: "W 8cm x H 6cm",
    condition: { ja: "小擦れあり、欠損なし", zh: "有轻微擦痕，无缺损", en: "Minor wear, no loss" },
    category: "chinese",
    tags: [{ ja: "玉器", zh: "玉器", en: "Jade" }, { ja: "特選", zh: "精选", en: "Featured" }],
    priceStatus: { ja: "お問い合わせ", zh: "请咨询", en: "Inquire" },
    priceDisplay: "hidden",
    currency: "JPY",
    isNew: false,
    isFeatured: true,
    description: {
      ja: "翡翠の色味と小さな彫りの表情を楽しめる置物です。飾り棚の小品として扱いやすいサイズです。",
      zh: "可欣赏翡翠色泽与小型雕刻表情，尺寸适合作为陈列柜小品。",
      en: "A small jade ornament with pleasing color and carving, well sized for cabinet display."
    },
    notes: [
      { ja: "素材判定は現物確認を前提とします。", zh: "材质判断以实物确认为前提。", en: "Material assessment is subject to in-person confirmation." },
      { ja: "展示台は撮影用です。", zh: "展示台仅为拍摄用。", en: "Display stand is for photography only." }
    ],
    images: [
      media(collectionImages.jade, { ja: "翡翠 小置物 正面", zh: "翡翠小摆件 正面", en: "Small jade ornament front" }, true),
      media(collectionImages.jar, { ja: "翡翠 小置物 彫り", zh: "翡翠小摆件 雕刻", en: "Small jade ornament carving" }),
      media(collectionImages.celadon, { ja: "翡翠 小置物 参考画像", zh: "翡翠小摆件 参考图", en: "Small jade ornament reference" })
    ]
  }
];

export function getCategoryByKey(key: CategoryKey) {
  return collectionCategories.find((category) => category.key === key);
}

export function getCategoryBySlug(slug: string) {
  return collectionCategories.find((category) => category.slug === slug && category.key !== "all");
}

export function getItemBySlug(slug: string) {
  return collectionItems.find((item) => item.slug === slug);
}

export function getItemsByCategory(category: CategoryKey) {
  if (category === "all") {
    return collectionItems;
  }

  if (category === "featured") {
    return collectionItems.filter((item) => item.isNew || item.isFeatured);
  }

  return collectionItems.filter((item) => item.category === category);
}

export function getRelatedItems(item: CollectionItem, limit = 3) {
  const sameCategory = collectionItems.filter(
    (candidate) => candidate.slug !== item.slug && candidate.category === item.category
  );
  const fallback = collectionItems.filter((candidate) => candidate.slug !== item.slug);
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
