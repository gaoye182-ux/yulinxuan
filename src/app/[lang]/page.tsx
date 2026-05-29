import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Camera, MapPin, MessageCircle, Phone, Store } from "lucide-react";
import {
  getCachedSiteSettings,
  localBusinessJsonLd,
  mapEmbedUrl,
  mapSearchUrl,
  pageMetadata,
  telHref
} from "@/lib/frontend-site";
import { getLanguage, localize, type Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";
import { getPageBlock } from "@/lib/page-blocks";
import { getHomeCollectionCategoryCards } from "@/lib/collection-repository";

type HomeContent = {
  seoTitle: string;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    cta: string;
    secondary: string;
    badge: string;
    image?: string;
  };
  stats: { value: string; label: string }[];
  sections: Record<
    | "collection"
    | "arrivals"
    | "appraisal"
    | "journal"
    | "about"
    | "access",
    { eyebrow: string; title: string; lead?: string; action?: string }
  >;
  categories: { name: string; subtitle: string; image: string; large?: boolean }[];
  arrivals: {
    feature: { title: string; subtitle: string; tag: string; image?: string };
    items: { name: string; era: string; text: string; status: string; image: string }[];
  };
  appraisal: {
    title: string;
    text: string;
    action: string;
    icon: "store" | "map" | "camera";
    image: string;
  }[];
  quickLinks: { title: string; text: string; href: string }[];
  news: { date: string; type: string; title: string }[];
  about: { text: string; facts: string[]; image?: string };
  shop: { company: string; address: string; hours: string; tel: string; email: string };
};

const image = {
  hero:
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1400&q=85",
  nihon:
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=85",
  korean:
    "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=700&q=85",
  chinese:
    "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=700&q=85",
  furniture:
    "https://images.unsplash.com/photo-1615800002234-05c4d488696c?auto=format&fit=crop&w=700&q=85",
  craft:
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=700&q=85",
  arrival:
    "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=1200&q=85",
  vessel:
    "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=700&q=85",
  scroll:
    "https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&w=700&q=85",
  bronze:
    "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=700&q=85",
  appraisalStore:
    "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=85",
  appraisalVisit:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=85",
  appraisalPhoto:
    "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=800&q=85",
  journal:
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=85",
  about:
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1000&q=85"
};

const content: Record<Language, HomeContent> = {
  ja: {
    seoTitle: "玉林軒株式会社 | 骨董・古美術の鑑定、買取、販売",
    hero: {
      eyebrow: "GYOKURINKEN CO., LTD.",
      title: "古の美を、未来へ紡ぐ。",
      lead:
        "日本・中国・朝鮮の古美術を中心に、鑑定、買取、販売まで一貫して承ります。静かな眼差しで、器物に宿る時間と物語を次代へ届けます。",
      cta: "蔵品を見る",
      secondary: "鑑定を相談",
      badge: "古美術商として培った審美眼"
    },
    stats: [
      { value: "30+", label: "年の実務経験" },
      { value: "5,000+", label: "取扱実績" },
      { value: "3", label: "鑑定方法" },
      { value: "無料", label: "初回相談" },
      { value: "全国", label: "出張対応" }
    ],
    sections: {
      collection: {
        eyebrow: "COLLECTION",
        title: "蔵品紹介",
        lead: "陶磁器、書画、工芸、家具まで、余白と品格を大切に選び抜いた古美術をご覧いただけます。",
        action: "分類を見る"
      },
      arrivals: {
        eyebrow: "NEW ARRIVALS",
        title: "新入荷・特選品",
        lead: "近時入荷した器物と、玉林軒が特におすすめする一品を紹介します。",
        action: "もっと見る"
      },
      appraisal: {
        eyebrow: "APPRAISAL",
        title: "鑑定・買取",
        lead: "店頭、出張、写真鑑定から状況に合わせてお選びください。売却前のご相談も承ります。"
      },
      journal: {
        eyebrow: "JOURNAL",
        title: "ブログ・新着情報",
        action: "一覧へ"
      },
      about: {
        eyebrow: "ABOUT",
        title: "玉林軒について",
        action: "詳しくはこちら"
      },
      access: {
        eyebrow: "ACCESS",
        title: "店舗情報",
        action: "Google Maps"
      }
    },
    categories: [
      { name: "日本美術", subtitle: "茶道具、掛軸、仏教美術", image: image.nihon, large: true },
      { name: "朝鮮美術", subtitle: "高麗青磁、李朝白磁", image: image.korean },
      { name: "中国美術", subtitle: "陶磁、玉器、書画", image: image.chinese },
      { name: "箪笥・家具", subtitle: "時代箪笥、木工芸", image: image.furniture },
      { name: "工芸品", subtitle: "漆器、金工、硝子", image: image.craft }
    ],
    arrivals: {
      feature: {
        title: "李朝白磁壺",
        subtitle: "端正な姿と柔らかな白を湛えた、静謐な一品。",
        tag: "今月の特選"
      },
      items: [
        { name: "古伊万里 染付皿", era: "江戸後期", text: "余白の美しい藍が映える器。", status: "価格応相談", image: image.vessel },
        { name: "山水図 掛軸", era: "明治期", text: "軽やかな筆致と保存状態の良さ。", status: "販売中", image: image.scroll },
        { name: "銅花入", era: "昭和初期", text: "茶席にも合う落ち着いた肌合い。", status: "新入荷", image: image.bronze }
      ]
    },
    appraisal: [
      { title: "店頭鑑定", text: "実物を拝見し、状態や来歴を丁寧に確認します。", action: "来店予約", icon: "store", image: image.appraisalStore },
      { title: "出張鑑定", text: "大型家具や点数が多い場合もご相談ください。", action: "出張相談", icon: "map", image: image.appraisalVisit },
      { title: "写真鑑定", text: "まずは写真から、おおよその見立てをお伝えします。", action: "写真を送る", icon: "camera", image: image.appraisalPhoto }
    ],
    quickLinks: [
      { title: "ご購入方法", text: "お支払い、配送、返品について。", href: "/purchase-guide" },
      { title: "鑑定士ブログ", text: "器物の見方や市場の話題。", href: "/blog" },
      { title: "無料相談", text: "売却前の小さな疑問にも。", href: "/contact" }
    ],
    news: [
      { date: "2026.05.27", type: "新入荷", title: "李朝白磁と古伊万里の特選品を掲載しました" },
      { date: "2026.05.18", type: "ブログ", title: "掛軸をお持ち込みいただく際の確認ポイント" },
      { date: "2026.05.02", type: "お知らせ", title: "六月の店頭鑑定予約について" },
      { date: "2026.04.20", type: "イベント", title: "初夏の古美術相談会を開催します" },
      { date: "2026.04.08", type: "お知らせ", title: "大型家具の出張買取エリアを拡大しました" }
    ],
    about: {
      text:
        "玉林軒は、骨董・古美術に宿る時間の重なりを尊び、次の持ち主へ正しく橋渡しすることを大切にしています。鑑定から販売、買取まで、透明性ある説明と静かな展示体験を心がけています。",
      facts: ["古物商許可 京都府公安委員会 第611092430039号", "日本・中国・朝鮮美術を中心に取扱", "店頭鑑定、出張鑑定、写真鑑定に対応"]
    },
    shop: {
      company: "玉林軒株式会社",
      address: "京都府京都市伏見区深草下川原町130番地4 華信ビル201号",
      hours: "11:00-18:00 / 水曜定休",
      tel: "お問い合わせフォームをご利用ください",
      email: "お問い合わせフォームをご利用ください"
    }
  },
  zh: {
    seoTitle: "玉林軒株式会社 | 骨董古美术鉴定、收购、销售",
    hero: {
      eyebrow: "GYOKURINKEN CO., LTD.",
      title: "传承古典之美，编织未来。",
      lead:
        "以日本、中国、朝鲜古美术为中心，提供鉴定、收购与销售服务。我们以安静而准确的眼光，将器物承载的时间与故事交给下一位藏家。",
      cta: "查看藏品",
      secondary: "咨询鉴定",
      badge: "源自古美术商的审美与经验"
    },
    stats: [
      { value: "30+", label: "年实务经验" },
      { value: "5,000+", label: "经手实绩" },
      { value: "3", label: "鉴定方式" },
      { value: "免费", label: "初次咨询" },
      { value: "全国", label: "出张对应" }
    ],
    sections: {
      collection: {
        eyebrow: "COLLECTION",
        title: "藏品介绍",
        lead: "从陶瓷、书画、工艺到家具，以留白与品格为线索呈现精选古美术。",
        action: "查看分类"
      },
      arrivals: {
        eyebrow: "NEW ARRIVALS",
        title: "新入荷・精选",
        lead: "介绍近期入荷器物，以及玉林軒特别推荐的重点藏品。",
        action: "查看更多"
      },
      appraisal: {
        eyebrow: "APPRAISAL",
        title: "鉴定・收购",
        lead: "可选择店头、出张或照片鉴定。出售前的初步咨询也欢迎联系。"
      },
      journal: { eyebrow: "JOURNAL", title: "博客 / 最新资讯", action: "查看列表" },
      about: { eyebrow: "ABOUT", title: "关于玉林軒", action: "了解更多" },
      access: { eyebrow: "ACCESS", title: "店铺信息", action: "Google Maps" }
    },
    categories: [
      { name: "日本美术", subtitle: "茶道具、挂轴、佛教美术", image: image.nihon, large: true },
      { name: "朝鲜美术", subtitle: "高丽青瓷、李朝白瓷", image: image.korean },
      { name: "中国美术", subtitle: "陶瓷、玉器、书画", image: image.chinese },
      { name: "箪笥・家具", subtitle: "时代家具、木工艺", image: image.furniture },
      { name: "工艺品", subtitle: "漆器、金工、玻璃", image: image.craft }
    ],
    arrivals: {
      feature: { title: "李朝白瓷壶", subtitle: "姿态端正、白色温润的静谧一品。", tag: "本月精选" },
      items: [
        { name: "古伊万里 染付盘", era: "江户后期", text: "蓝白留白清雅。", status: "价格咨询", image: image.vessel },
        { name: "山水图 挂轴", era: "明治期", text: "笔致轻盈，保存状态良好。", status: "销售中", image: image.scroll },
        { name: "铜花入", era: "昭和初期", text: "肌理沉稳，也适合茶席。", status: "新入荷", image: image.bronze }
      ]
    },
    appraisal: [
      { title: "店头鉴定", text: "查看实物，确认状态、来历与市场价值。", action: "预约来店", icon: "store", image: image.appraisalStore },
      { title: "出张鉴定", text: "大型家具或数量较多时，可咨询上门鉴定。", action: "咨询出张", icon: "map", image: image.appraisalVisit },
      { title: "照片鉴定", text: "先通过照片进行初步判断。", action: "发送照片", icon: "camera", image: image.appraisalPhoto }
    ],
    quickLinks: [
      { title: "购买方法", text: "支付、配送、退换说明。", href: "/purchase-guide" },
      { title: "鉴定师博客", text: "器物知识与市场观察。", href: "/blog" },
      { title: "免费咨询", text: "出售前的小问题也可联系。", href: "/contact" }
    ],
    news: [
      { date: "2026.05.27", type: "新入荷", title: "已刊载李朝白瓷与古伊万里精选品" },
      { date: "2026.05.18", type: "博客", title: "携带挂轴到店时的确认重点" },
      { date: "2026.05.02", type: "通知", title: "六月店头鉴定预约说明" },
      { date: "2026.04.20", type: "活动", title: "初夏古美术咨询会即将举办" },
      { date: "2026.04.08", type: "通知", title: "大型家具出张收购区域扩大" }
    ],
    about: {
      text:
        "玉林軒尊重骨董古美术中沉积的时间，并致力于将其准确交付给下一位藏家。从鉴定到销售、收购，我们重视透明说明与安静从容的观赏体验。",
      facts: ["古物商许可 京都府公安委员会 第 611092430039 号", "以日本、中国、朝鲜美术为中心", "支持店头、出张、照片鉴定"]
    },
    shop: {
      company: "玉林軒株式会社",
      address: "京都府京都市伏见区深草下川原町130番地4 华信ビル201号",
      hours: "11:00-18:00 / 周三定休",
      tel: "请使用咨询表单联系",
      email: "请使用咨询表单联系"
    }
  },
  en: {
    seoTitle: "Gyokurinken Co., Ltd. | Antique and Fine Art Appraisal",
    hero: {
      eyebrow: "GYOKURINKEN CO., LTD.",
      title: "Bridging the Beauty of the Past to the Future.",
      lead:
        "We curate, appraise, purchase, and present Japanese, Chinese, and Korean antiques with a quiet gallery sensibility and careful scholarship.",
      cta: "View Collection",
      secondary: "Request Appraisal",
      badge: "A discerning eye for antique art"
    },
    stats: [
      { value: "30+", label: "Years Experience" },
      { value: "5,000+", label: "Handled Works" },
      { value: "3", label: "Appraisal Methods" },
      { value: "Free", label: "Initial Consultation" },
      { value: "Japan", label: "Nationwide Visits" }
    ],
    sections: {
      collection: {
        eyebrow: "COLLECTION",
        title: "Collection",
        lead: "Ceramics, paintings, craft, and furniture selected for presence, condition, and quiet dignity.",
        action: "Browse Categories"
      },
      arrivals: {
        eyebrow: "NEW ARRIVALS",
        title: "New Arrivals & Featured Works",
        lead: "Recently acquired pieces and works specially recommended by Gyokurinken.",
        action: "View More"
      },
      appraisal: {
        eyebrow: "APPRAISAL",
        title: "Appraisal & Purchase",
        lead: "Choose an in-store, on-site, or photo appraisal. Early consultation before selling is welcome."
      },
      journal: { eyebrow: "JOURNAL", title: "Journal & News", action: "View All" },
      about: { eyebrow: "ABOUT", title: "About Gyokurinken", action: "Read More" },
      access: { eyebrow: "ACCESS", title: "Shop Information", action: "Google Maps" }
    },
    categories: [
      { name: "Japanese Art", subtitle: "Tea wares, scrolls, Buddhist art", image: image.nihon, large: true },
      { name: "Korean Art", subtitle: "Goryeo celadon, Joseon white porcelain", image: image.korean },
      { name: "Chinese Art", subtitle: "Ceramics, jade, painting", image: image.chinese },
      { name: "Furniture", subtitle: "Period chests and wood craft", image: image.furniture },
      { name: "Craft Works", subtitle: "Lacquer, metal, glass", image: image.craft }
    ],
    arrivals: {
      feature: { title: "Joseon White Porcelain Jar", subtitle: "A tranquil work with poised form and soft white glaze.", tag: "Featured This Month" },
      items: [
        { name: "Ko-Imari Blue-and-White Dish", era: "Late Edo", text: "Elegant cobalt with generous quiet space.", status: "Price on Request", image: image.vessel },
        { name: "Landscape Hanging Scroll", era: "Meiji", text: "Light brushwork in fine condition.", status: "Available", image: image.scroll },
        { name: "Bronze Flower Vessel", era: "Early Showa", text: "A calm surface suited for tea settings.", status: "New Arrival", image: image.bronze }
      ]
    },
    appraisal: [
      { title: "In-store Appraisal", text: "We examine the work, condition, and provenance in person.", action: "Book Visit", icon: "store", image: image.appraisalStore },
      { title: "On-site Appraisal", text: "For large furniture or multiple works, we can visit you.", action: "Ask Visit", icon: "map", image: image.appraisalVisit },
      { title: "Photo Appraisal", text: "Send photos for a preliminary assessment.", action: "Send Photos", icon: "camera", image: image.appraisalPhoto }
    ],
    quickLinks: [
      { title: "Purchase Guide", text: "Payment, delivery, and return policy.", href: "/purchase-guide" },
      { title: "Appraiser Blog", text: "Notes on objects and the market.", href: "/blog" },
      { title: "Free Consultation", text: "Ask before selling or buying.", href: "/contact" }
    ],
    news: [
      { date: "2026.05.27", type: "Arrival", title: "Joseon porcelain and Ko-Imari featured works are now online" },
      { date: "2026.05.18", type: "Blog", title: "What to check before bringing in a hanging scroll" },
      { date: "2026.05.02", type: "Notice", title: "June in-store appraisal reservations" },
      { date: "2026.04.20", type: "Event", title: "Early summer antique consultation event" },
      { date: "2026.04.08", type: "Notice", title: "Expanded on-site purchase area for large furniture" }
    ],
    about: {
      text:
        "Gyokurinken values the layered time held within antiques and fine art. Through clear explanation, careful appraisal, and a calm viewing experience, we connect works with their next keeper.",
      facts: ["Antique dealer license: Kyoto Prefectural Public Safety Commission No. 611092430039", "Focused on Japanese, Chinese, and Korean art", "In-store, on-site, and photo appraisal available"]
    },
    shop: {
      company: "Gyokurinken Co., Ltd.",
      address: "Kashin Building 201, 130-4 Fukakusa Shimogawaracho, Fushimi-ku, Kyoto-shi, Kyoto",
      hours: "11:00-18:00 / Closed Wednesday",
      tel: "Please use the inquiry form",
      email: "Please use the inquiry form"
    }
  }
};

function SectionHeading({
  eyebrow,
  title,
  lead
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs tracking-[0.28em] text-[color:var(--gold)]">{eyebrow}</p>
      <h2 className="section-title mt-3 font-serif text-3xl font-light md:text-5xl">
        {title}
      </h2>
      {lead ? (
        <p className="mt-7 text-sm leading-8 text-[color:var(--muted)] md:text-base">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

function AppraisalIcon({ icon }: { icon: "store" | "map" | "camera" }) {
  const Icon = icon === "store" ? Store : icon === "map" ? MapPin : Camera;
  return <Icon aria-hidden size={26} />;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const copy = content[lang];
  const settings = await getCachedSiteSettings();
  const heroBlock = await getPageBlock("home", "hero", lang, copy.hero);

  return pageMetadata({
    settings,
    lang,
    path: "/",
    title: localize(settings.seo.defaultTitle, lang) || copy.seoTitle,
    description: localize(settings.seo.defaultDescription, lang) || heroBlock.content.lead,
    image: heroBlock.content.image || image.hero
  });
}

export default async function HomePage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const copy = content[lang];
  const [
    heroBlock,
    statsBlock,
    sectionsBlock,
    categoriesBlock,
    arrivalsBlock,
    appraisalBlock,
    quickLinksBlock,
    aboutBlock
  ] = await Promise.all([
    getPageBlock("home", "hero", lang, copy.hero),
    getPageBlock("home", "stats", lang, copy.stats),
    getPageBlock("home", "sections", lang, copy.sections),
    getPageBlock("home", "categories", lang, copy.categories),
    getPageBlock("home", "arrivals", lang, copy.arrivals),
    getPageBlock("home", "appraisal", lang, copy.appraisal),
    getPageBlock("home", "quick_links", lang, copy.quickLinks),
    getPageBlock("home", "about", lang, copy.about)
  ]);
  const hero = heroBlock.content;
  const stats = statsBlock.content;
  const sections = sectionsBlock.content;
  const categories = await getHomeCollectionCategoryCards(lang, categoriesBlock.content);
  const arrivals = arrivalsBlock.content;
  const appraisalEntries = appraisalBlock.content;
  const quickLinks = quickLinksBlock.content;
  const about = aboutBlock.content;
  const heroImage = hero.image || image.hero;
  const arrivalFeatureImage = arrivals.feature.image || image.arrival;
  const aboutImage = about.image || image.about;
  const shop = {
    company: localize(settings.company.legalName, lang) || copy.shop.company,
    address: localize(settings.contact.address, lang) || copy.shop.address,
    hours: localize(settings.businessHours.weekdays, lang) || copy.shop.hours,
    holidays: localize(settings.businessHours.holidays, lang),
    note: localize(settings.businessHours.note, lang),
    tel: settings.contact.phone || copy.shop.tel,
    email: settings.contact.email || copy.shop.email
  };
  const mapsHref = mapSearchUrl(settings, lang);
  const phoneHref = telHref(shop.tel);
  const jsonLd = localBusinessJsonLd(settings, lang, "/");

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="home-hero mx-auto grid max-w-7xl items-center gap-8 px-5 py-9 md:grid-cols-[0.86fr_1.14fr] md:py-10 lg:px-8">
        <div className="relative z-10">
          <p className="text-xs tracking-[0.36em] text-[color:var(--gold)]">
            {hero.eyebrow}
          </p>
          <h1 className="home-hero-title mt-5 max-w-2xl font-serif text-4xl font-light leading-tight text-[color:var(--ink)] md:text-5xl lg:text-[3.75rem]">
            {hero.title}
          </h1>
          <p className="home-hero-lead mt-6 max-w-xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
            {hero.lead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={localizedPath(lang, "/collection")}
              className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-7 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
            >
              {hero.cta}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={localizedPath(lang, "/appraisal")}
              className="inline-flex min-h-12 items-center border border-[color:var(--border)] px-7 text-sm tracking-[0.14em] text-[color:var(--ink)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
            >
              {hero.secondary}
            </Link>
          </div>
        </div>

        <div className="home-hero-image relative h-[clamp(340px,52vh,430px)] md:h-[clamp(400px,62vh,500px)]">
          <div className="absolute inset-x-4 bottom-0 top-8 border border-[color:var(--gold)]/45" />
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(44,36,22,0.55)] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 max-w-[260px] bg-[rgba(255,253,248,0.92)] px-5 py-3 shadow-xl backdrop-blur">
            <p className="font-serif text-3xl text-[color:var(--gold-dark)]">令和5年</p>
            <p className="mt-1 text-xs leading-5 tracking-[0.16em] text-[color:var(--muted)]">
              {hero.badge}
            </p>
          </div>
        </div>
      </section>

      <section className="home-stats bg-[color:var(--wood)]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-white/10 px-5 py-1 text-center text-[color:var(--ivory)] md:grid-cols-5 md:divide-y-0 lg:px-8">
          {statsBlock.isActive ? stats.map((stat) => (
            <div key={stat.label} className="px-3 py-4">
              <p className="font-serif text-3xl leading-none text-[color:var(--gold-light)] md:text-[2.35rem]">
                {stat.value}
              </p>
              <p className="mt-2 text-[11px] tracking-[0.16em] text-white/68">{stat.label}</p>
            </div>
          )) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
        <SectionHeading {...sections.collection} />
        <div className="mt-8 grid auto-rows-[220px] gap-4 md:grid-cols-4 md:auto-rows-[212px]">
          {categoriesBlock.isActive ? categories.map((category) => (
            <Link
              key={category.name}
              href={localizedPath(lang, "/collection")}
              className={`group relative min-h-[220px] overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)] ${
                category.large ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes={category.large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,26,0.7)] via-[rgba(26,26,26,0.16)] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-serif text-2xl font-light">{category.name}</h3>
                <p className="mt-2 text-sm text-white/75">{category.subtitle}</p>
                <span className="mt-5 block h-px w-0 bg-[color:var(--gold-light)] transition-all group-hover:w-24" />
              </div>
            </Link>
          )) : null}
        </div>
      </section>

      <section className="bg-[color:var(--ivory-dark)] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading {...sections.arrivals} />
          <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Link
              href={localizedPath(lang, "/new-arrivals")}
              className="group relative block min-h-[320px] overflow-hidden border border-[color:var(--border)] lg:h-full"
            >
              <Image
                src={arrivalFeatureImage}
                alt={arrivals.feature.title}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="scale-[1.18] object-cover object-[center_100%] transition duration-700 group-hover:scale-[1.24]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(44,36,22,0.82)] via-[rgba(44,36,22,0.18)] to-transparent" />
              <div className="absolute bottom-0 left-0 max-w-xl p-8 text-white">
                <p className="text-xs tracking-[0.22em] text-[color:var(--gold-light)]">
                  {arrivals.feature.tag}
                </p>
                <h3 className="mt-4 font-serif text-4xl font-light">
                  {arrivals.feature.title}
                </h3>
                <p className="mt-4 leading-7 text-white/78">{arrivals.feature.subtitle}</p>
              </div>
            </Link>
            <div className="grid gap-4">
              {arrivals.items.map((item) => (
                <Link
                  key={item.name}
                  href={localizedPath(lang, "/new-arrivals")}
                  className="grid grid-cols-[104px_1fr] gap-4 border border-[color:var(--border)] bg-[color:var(--paper)] p-3 transition hover:border-[color:var(--gold)]"
                >
                  <div className="relative h-28 w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="116px"
                      className="object-cover"
                    />
                  </div>
                  <div className="py-1">
                    <p className="text-xs tracking-[0.18em] text-[color:var(--gold)]">
                      {item.era}
                    </p>
                    <h3 className="mt-2 font-serif text-xl">{item.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{item.text}</p>
                    <p className="mt-3 text-xs tracking-[0.16em] text-[color:var(--gold-dark)]">
                      {item.status}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
        <SectionHeading {...sections.appraisal} />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {appraisalBlock.isActive ? appraisalEntries.map((entry) => (
            <Link
              key={entry.title}
              href={localizedPath(lang, "/appraisal")}
              className="group overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)] transition hover:-translate-y-1 hover:border-[color:var(--gold)] hover:shadow-xl"
            >
              <div className="relative h-36 overflow-hidden">
                <Image
                  src={entry.image}
                  alt={entry.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(44,36,22,0.58)] to-transparent" />
                <div className="absolute bottom-4 left-4 flex size-12 items-center justify-center border border-[color:var(--gold-light)] bg-[rgba(255,253,248,0.9)] text-[color:var(--gold-dark)]">
                  <AppraisalIcon icon={entry.icon} />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-light">{entry.title}</h3>
                <p className="mt-3 min-h-12 text-sm leading-6 text-[color:var(--muted)]">
                  {entry.text}
                </p>
                <span className="mt-4 flex items-center justify-end gap-3 text-sm tracking-[0.14em] text-[color:var(--gold-dark)]">
                  {entry.action}
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          )) : null}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {quickLinksBlock.isActive ? quickLinks.map((link) => (
            <Link
              key={link.title}
              href={localizedPath(lang, link.href)}
              className="border border-[color:var(--border)] px-5 py-4 transition hover:border-[color:var(--gold)] hover:bg-[color:var(--paper)]"
            >
              <p className="font-serif text-xl">{link.title}</p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{link.text}</p>
            </Link>
          )) : null}
        </div>
      </section>

      <section className="bg-[color:var(--paper)] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 lg:grid-cols-[0.82fr_1fr] lg:px-8">
          <div className="h-full">
            <p className="text-xs tracking-[0.28em] text-[color:var(--gold)]">
              {sections.journal.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-4xl font-light">{sections.journal.title}</h2>
            <Link
              href={localizedPath(lang, "/blog")}
              className="group mt-8 block overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory)]"
            >
              <div className="relative h-[367px] overflow-hidden">
                <Image
                  src={image.journal}
                  alt={sections.journal.title}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(44,36,22,0.62)] to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs tracking-[0.2em] text-[color:var(--gold-light)]">
                    PICK UP
                  </p>
                  <p className="mt-2 font-serif text-2xl font-light">
                    {copy.news[1].title}
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href={localizedPath(lang, "/news")}
              className="mt-8 inline-flex items-center gap-3 border border-[color:var(--gold)] px-6 py-3 text-sm tracking-[0.14em] text-[color:var(--gold-dark)] hover:bg-[color:var(--gold)] hover:text-white"
            >
              {sections.journal.action}
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="divide-y divide-[color:var(--border)] border-y border-[color:var(--border)] lg:mt-[100px]">
            {copy.news.map((entry) => (
              <Link
                key={`${entry.date}-${entry.title}`}
                href={localizedPath(lang, "/news")}
                className="grid min-h-[73px] gap-3 py-4 transition hover:bg-[color:var(--ivory)] md:grid-cols-[120px_110px_1fr] md:items-center"
              >
                <time className="font-display text-sm text-[color:var(--muted)]">
                  {entry.date}
                </time>
                <span className="w-fit border border-[color:var(--gold)] px-3 py-1 text-xs text-[color:var(--gold-dark)]">
                  {entry.type}
                </span>
                <span className="text-sm leading-6 text-[color:var(--ink)]">{entry.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="relative min-h-[420px] overflow-hidden border border-[color:var(--border)]">
          <Image
            src={aboutImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover"
          />
          <div className="absolute right-6 top-6 border border-[color:var(--gold)] bg-[rgba(255,253,248,0.9)] px-5 py-4 text-center">
            <p className="font-serif text-4xl text-[color:var(--gold-dark)]">玉</p>
            <p className="text-xs tracking-[0.18em] text-[color:var(--muted)]">GYOKURINKEN</p>
          </div>
        </div>
        <div className="self-center">
          <p className="text-xs tracking-[0.28em] text-[color:var(--gold)]">
            {sections.about.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-4xl font-light md:text-5xl">
            {sections.about.title}
          </h2>
          <p className="mt-8 text-base leading-8 text-[color:var(--muted)]">{about.text}</p>
          <ul className="mt-8 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
            {about.facts.map((fact) => (
              <li key={fact} className="border-l border-[color:var(--gold)] pl-4">
                {fact}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex justify-end">
            <Link
              href={localizedPath(lang, "/about")}
              className="inline-flex items-center gap-3 border border-[color:var(--gold)] px-6 py-3 text-sm tracking-[0.14em] text-[color:var(--gold-dark)] hover:bg-[color:var(--gold)] hover:text-white"
            >
              {sections.about.action}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[color:var(--gold)]/35 bg-[color:var(--wood)] py-12 text-[color:var(--ivory)] md:py-16">
        <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-5 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <p className="text-xs tracking-[0.28em] text-[color:var(--gold-light)]">
              {sections.access.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-4xl font-light">{sections.access.title}</h2>
            <dl className="mt-8 space-y-3 text-sm leading-6 text-white/72">
              <div>
                <dt className="text-[color:var(--gold-light)]">Company</dt>
                <dd>{shop.company}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--gold-light)]">Address</dt>
                <dd>{shop.address}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--gold-light)]">Hours</dt>
                <dd>{shop.hours}{shop.holidays ? ` / ${shop.holidays}` : ""}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--gold-light)]">Contact</dt>
                <dd>{shop.tel} / {shop.email}</dd>
              </div>
              {shop.note ? (
                <div>
                  <dt className="text-[color:var(--gold-light)]">Note</dt>
                  <dd>{shop.note}</dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              {phoneHref ? (
                <a
                  href={phoneHref}
                  className="inline-flex min-h-11 items-center gap-2 border border-white/20 px-5 text-sm text-white"
                >
                  <Phone size={16} />
                  {shop.tel}
                </a>
              ) : null}
              <a
                href={mapsHref}
                className="inline-flex min-h-11 items-center gap-2 border border-white/20 px-5 text-sm text-white"
              >
                <MapPin size={16} />
                {sections.access.action}
              </a>
              <Link
                href={localizedPath(lang, "/contact")}
                className="inline-flex min-h-11 items-center gap-2 border border-[color:var(--gold)] px-5 text-sm text-[color:var(--gold-light)]"
              >
                <MessageCircle size={16} />
                Contact
              </Link>
            </div>
          </div>
          <div className="min-h-[300px] overflow-hidden border border-white/15 bg-white/5 lg:mt-[104px] lg:h-[calc(100%-104px)] lg:min-h-0">
            <iframe
              title="Gyokurinken map"
              src={mapEmbedUrl(settings, lang)}
              className="h-full min-h-[300px] w-full lg:min-h-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
