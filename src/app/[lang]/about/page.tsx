import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  ChevronRight,
  FileCheck2,
  Handshake,
  Landmark,
  MapPin,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Store,
  Users
} from "lucide-react";
import { collectionImages } from "@/lib/collection-data";
import { getCachedSiteSettings, pageMetadata } from "@/lib/frontend-site";
import { getLanguage, type Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";
import { getPageBlock } from "@/lib/page-blocks";

type IconName = "eye" | "trust" | "bridge";

type AboutCopy = {
  seoTitle: string;
  seoDescription: string;
  banner: {
    eyebrow: string;
    title: string;
    subtitle: string;
    breadcrumbHome: string;
  };
  story: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string[];
    facts: { value: string; label: string }[];
  };
  greeting: {
    eyebrow: string;
    title: string;
    name: string;
    role: string;
    body: string[];
  };
  philosophy: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { title: string; text: string; icon: IconName }[];
  };
  timeline: {
    eyebrow: string;
    title: string;
    entries: { year: string; title: string; text: string }[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    lead: string;
    images: { src: string; title: string; text: string }[];
  };
  credentials: {
    eyebrow: string;
    title: string;
    lead: string;
    licenseTitle: string;
    licenseRows: { label: string; value: string }[];
    organizationsTitle: string;
    organizations: string[];
  };
  cta: {
    title: string;
    text: string;
    collection: string;
    contact: string;
  };
};

const copy: Record<Language, AboutCopy> = {
  ja: {
    seoTitle: "玉林軒について | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社の会社紹介ページです。骨董・古美術に向き合う姿勢、代表者挨拶、経営理念、沿革、古物商許可、所属組織をご案内します。",
    banner: {
      eyebrow: "ABOUT GYOKURINKEN",
      title: "玉林軒について",
      subtitle: "器物に宿る時間を読み解き、次の持ち主へ誠実に橋渡しする古美術商でありたいと考えています。",
      breadcrumbHome: "ホーム"
    },
    story: {
      eyebrow: "OUR STORY",
      title: "古美術の静けさを、暮らしと次代へ。",
      lead:
        "玉林軒は、日本・中国・朝鮮の陶磁器、書画、工芸、家具を中心に、鑑定、買取、販売を行う古美術商です。",
      body: [
        "作品の価値は、年代や作家名だけで決まるものではありません。手に取ったときの重み、釉薬の景色、直しの痕跡、前の持ち主が大切にしてきた時間まで含めて、一点ごとに丁寧に見立てます。",
        "私たちは、売るために急がせるのではなく、わかることとわからないことを分けて説明し、納得できる取引と静かな鑑賞体験を大切にしています。"
      ],
      facts: [
        { value: "30+", label: "年の実務経験" },
        { value: "5,000+", label: "取扱・相談実績" },
        { value: "3", label: "鑑定方法" }
      ]
    },
    greeting: {
      eyebrow: "MESSAGE",
      title: "代表者挨拶",
      name: "代表取締役 山田 玉泉",
      role: "古美術鑑定士 / 古物商",
      body: [
        "古美術に向き合う時間は、ものを所有するだけではなく、過去の手仕事と現在の暮らしを結ぶ時間でもあります。",
        "玉林軒では、初めて骨董品をご相談される方にも、長く蒐集されている方にも、同じ温度で丁寧にご案内することを心がけています。大切なお品の売却、購入、保管、次世代への継承について、どうぞ安心してご相談ください。"
      ]
    },
    philosophy: {
      eyebrow: "PHILOSOPHY",
      title: "経営理念",
      lead: "作品の背景を尊重し、透明性ある説明と誠実な評価で、古美術の価値を未来へつなぎます。",
      items: [
        { title: "静かな眼差し", text: "時代、状態、来歴、素材を落ち着いて確認し、過度な演出ではなく作品そのものの力を伝えます。", icon: "eye" },
        { title: "誠実な説明", text: "確かな点、推定にとどまる点、今後確認すべき点を分け、納得できる判断材料を提供します。", icon: "trust" },
        { title: "次代への橋渡し", text: "売買だけでなく、保存、配送、継承まで見据えて、器物が長く大切にされる道を整えます。", icon: "bridge" }
      ]
    },
    timeline: {
      eyebrow: "TIMELINE",
      title: "沿革",
      entries: [
        { year: "1968", title: "創業の礎", text: "陶磁器と茶道具の扱いを中心に、古美術商としての歩みを始める。" },
        { year: "1989", title: "取扱分野の拡大", text: "掛軸、書画、箪笥、工芸品まで相談領域を広げる。" },
        { year: "2008", title: "鑑定・買取体制の整備", text: "店頭、出張、写真鑑定の受付体制を強化し、遠方からの相談にも対応。" },
        { year: "2026", title: "三語サイト公開準備", text: "日本語、中国語、英語で情報を整備し、国内外の蒐集家へ発信を開始。" }
      ]
    },
    gallery: {
      eyebrow: "GALLERY",
      title: "店内・展厅イメージ",
      lead: "正式写真公開前のため、現在は世界観を示す参考ビジュアルです。公開時には店内、展示棚、相談席の写真へ差し替えます。",
      images: [
        { src: collectionImages.scroll, title: "掛軸と余白", text: "床の間や壁面展示を意識した静かな見せ方。" },
        { src: collectionImages.tea, title: "茶道具の手触り", text: "手に取る距離で状態と景色を確認します。" },
        { src: collectionImages.chest, title: "家具と空間", text: "大型品の質感、寸法、搬入導線まで確認します。" }
      ]
    },
    credentials: {
      eyebrow: "CREDENTIALS",
      title: "許可・所属組織",
      lead: "正式情報は公開前のため、一部は仮情報です。営業開始時に正確な許可番号、所在地、所属団体へ更新します。",
      licenseTitle: "古物商許可",
      licenseRows: [
        { label: "会社名", value: "玉林軒株式会社" },
        { label: "許可番号", value: "京都府公安委員会 第611092430039号" },
        { label: "取扱品目", value: "美術品類、道具類、家具類" },
        { label: "所在地", value: "京都府京都市伏見区深草下川原町130番地4 華信ビル201号" }
      ],
      organizationsTitle: "所属・連携",
      organizations: ["全国美術商連合会 参加予定", "地域骨董商組合 参加予定", "配送・保険事業者との連携体制", "専門修復家・表具師との相談ネットワーク"]
    },
    cta: {
      title: "作品のこと、売却のこと、まずは静かにお聞かせください。",
      text: "来店予約、写真鑑定、購入相談、法人・相続整理のご相談まで、内容に合わせてご案内します。",
      collection: "蔵品を見る",
      contact: "お問い合わせ"
    }
  },
  zh: {
    seoTitle: "关于我们 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社公司介绍页面。介绍我们面对骨董古美术的态度、代表致辞、经营理念、沿革、古物商许可与所属组织。",
    banner: {
      eyebrow: "ABOUT GYOKURINKEN",
      title: "关于玉林軒",
      subtitle: "我们希望成为能够读懂器物时间，并诚实交付给下一位藏家的古美术商。",
      breadcrumbHome: "首页"
    },
    story: {
      eyebrow: "OUR STORY",
      title: "将古美术的静谧，带入生活与未来。",
      lead:
        "玉林軒以日本、中国、朝鲜陶瓷、书画、工艺、家具为中心，提供鉴定、收购与销售服务。",
      body: [
        "作品价值并不只由年代或作者名称决定。手中的重量、釉色的景色、修补痕迹，以及上一位持有人珍惜它的时间，都需要被逐一谨慎看见。",
        "我们不以促成交易为唯一目标，而是区分可以确认的事实与仍需推定的部分，重视让客户理解并安心的说明过程。"
      ],
      facts: [
        { value: "30+", label: "年实务经验" },
        { value: "5,000+", label: "经手与咨询实绩" },
        { value: "3", label: "鉴定方式" }
      ]
    },
    greeting: {
      eyebrow: "MESSAGE",
      title: "代表致辞",
      name: "代表董事 山田 玉泉",
      role: "古美术鉴定士 / 古物商",
      body: [
        "面对古美术的时间，并不只是拥有一件物品，也是将过去的手工艺与当下生活连接起来。",
        "无论是第一次咨询骨董品的客户，还是长期收藏的藏家，玉林軒都希望以同样谨慎的态度提供说明。关于重要藏品的出售、购买、保存与传承，欢迎安心咨询。"
      ]
    },
    philosophy: {
      eyebrow: "PHILOSOPHY",
      title: "经营理念",
      lead: "尊重作品背景，以透明说明与诚实评价，将古美术价值连接到未来。",
      items: [
        { title: "安静的眼光", text: "冷静确认时代、状态、来历与材质，不依靠过度包装，而让作品自身说话。", icon: "eye" },
        { title: "诚实的说明", text: "区分确定事实、合理推定与仍需确认的部分，为客户提供可判断的信息。", icon: "trust" },
        { title: "通向未来的交付", text: "不只关注买卖，也考虑保存、配送与传承，让器物继续被珍惜。", icon: "bridge" }
      ]
    },
    timeline: {
      eyebrow: "TIMELINE",
      title: "沿革",
      entries: [
        { year: "1968", title: "创业基础", text: "以陶瓷与茶道具为中心，开始古美术商的经营。" },
        { year: "1989", title: "经营范围扩大", text: "逐步扩展到挂轴、书画、箪笥、工艺品等咨询领域。" },
        { year: "2008", title: "鉴定・收购体制完善", text: "强化店头、上门与照片鉴定接待，也对应远方咨询。" },
        { year: "2026", title: "三语网站准备公开", text: "以日文、中文、英文整理信息，开始面向国内外藏家发信。" }
      ]
    },
    gallery: {
      eyebrow: "GALLERY",
      title: "店铺・展厅印象",
      lead: "正式照片公开前，当前使用符合世界观的参考视觉。公开时将替换为店内、展柜与咨询席照片。",
      images: [
        { src: collectionImages.scroll, title: "挂轴与留白", text: "重视壁面与床之间陈列的安静观看方式。" },
        { src: collectionImages.tea, title: "茶道具的手感", text: "在近距离确认器物状态与釉色景色。" },
        { src: collectionImages.chest, title: "家具与空间", text: "确认大型物品的质感、尺寸与搬入路径。" }
      ]
    },
    credentials: {
      eyebrow: "CREDENTIALS",
      title: "许可・所属组织",
      lead: "正式信息尚未公开，部分为占位内容。营业开始时将更新准确许可编号、所在地与所属团体。",
      licenseTitle: "古物商许可",
      licenseRows: [
        { label: "公司名", value: "玉林軒株式会社" },
        { label: "许可编号", value: "京都府公安委员会 第 611092430039 号" },
        { label: "经营品目", value: "美术品类、道具类、家具类" },
        { label: "所在地", value: "京都府京都市伏见区深草下川原町130番地4 华信ビル201号" }
      ],
      organizationsTitle: "所属・合作",
      organizations: ["全国美术商联合会 计划加入", "地域骨董商组合 计划加入", "配送与保险服务合作体制", "专业修复师、表具师咨询网络"]
    },
    cta: {
      title: "关于作品与出售意向，欢迎先安静地告诉我们。",
      text: "来店预约、照片鉴定、购买咨询、法人或继承整理等，我们会根据内容为您说明。",
      collection: "查看藏品",
      contact: "联系我们"
    }
  },
  en: {
    seoTitle: "About | Gyokurinken Co., Ltd.",
    seoDescription:
      "About Gyokurinken Co., Ltd. Learn about our approach to antique and fine art, representative message, philosophy, timeline, license, and affiliations.",
    banner: {
      eyebrow: "ABOUT GYOKURINKEN",
      title: "About Gyokurinken",
      subtitle: "We aim to read the time held in each work and pass it honestly to its next keeper.",
      breadcrumbHome: "Home"
    },
    story: {
      eyebrow: "OUR STORY",
      title: "Quiet antique art, carried into life and the future.",
      lead:
        "Gyokurinken appraises, purchases, and presents Japanese, Chinese, and Korean ceramics, paintings, craft works, and furniture.",
      body: [
        "The value of a work is not decided by age or authorship alone. Weight in the hand, glaze movement, restoration marks, and the care of previous owners all deserve careful attention.",
        "We do not rush decisions. We separate what can be confirmed from what remains an informed judgment, helping clients understand each work with calm confidence."
      ],
      facts: [
        { value: "30+", label: "Years Experience" },
        { value: "5,000+", label: "Works and Consultations" },
        { value: "3", label: "Appraisal Methods" }
      ]
    },
    greeting: {
      eyebrow: "MESSAGE",
      title: "Representative Message",
      name: "Gyokusen Yamada",
      role: "Representative Director / Antique Art Appraiser",
      body: [
        "Spending time with antique art is not only about owning an object. It is also a way of connecting past craftsmanship with present life.",
        "Whether you are consulting about an antique for the first time or have collected for many years, Gyokurinken offers the same careful attention. Please feel welcome to discuss selling, buying, preservation, or succession of important works."
      ]
    },
    philosophy: {
      eyebrow: "PHILOSOPHY",
      title: "Philosophy",
      lead: "We respect each work's background and connect antique art to the future through transparent explanation and sincere appraisal.",
      items: [
        { title: "A Quiet Eye", text: "We consider age, condition, provenance, and material calmly, letting the work itself carry the focus.", icon: "eye" },
        { title: "Clear Explanation", text: "We distinguish confirmed facts, informed judgment, and points that need further review.", icon: "trust" },
        { title: "A Bridge Forward", text: "Beyond sale and purchase, we consider preservation, delivery, and succession so works continue to be valued.", icon: "bridge" }
      ]
    },
    timeline: {
      eyebrow: "TIMELINE",
      title: "Timeline",
      entries: [
        { year: "1968", title: "Founding Roots", text: "Began as an antique art dealer centered on ceramics and tea utensils." },
        { year: "1989", title: "Expanded Fields", text: "Extended consultation to scrolls, painting, furniture, and craft works." },
        { year: "2008", title: "Appraisal Structure", text: "Strengthened in-store, on-site, and photo appraisal for clients across Japan." },
        { year: "2026", title: "Trilingual Site Preparation", text: "Preparing Japanese, Chinese, and English information for collectors in Japan and overseas." }
      ]
    },
    gallery: {
      eyebrow: "GALLERY",
      title: "Shop and Viewing Atmosphere",
      lead: "Official photographs are not yet published. Current visuals are references for the intended atmosphere and will be replaced with shop, display shelf, and consultation area photography.",
      images: [
        { src: collectionImages.scroll, title: "Scrolls and Space", text: "Quiet wall and alcove presentation for careful viewing." },
        { src: collectionImages.tea, title: "Tea Ware in Hand", text: "Condition and glaze character are checked at close distance." },
        { src: collectionImages.chest, title: "Furniture and Room", text: "Texture, dimensions, and delivery routes are considered for large works." }
      ]
    },
    credentials: {
      eyebrow: "CREDENTIALS",
      title: "License and Affiliations",
      lead: "Some information is temporary before official publication. Accurate license, address, and affiliation details will be updated at launch.",
      licenseTitle: "Antique Dealer License",
      licenseRows: [
        { label: "Company", value: "Gyokurinken Co., Ltd." },
        { label: "License No.", value: "Kyoto Prefectural Public Safety Commission No. 611092430039" },
        { label: "Handled Items", value: "Fine art, utensils, furniture" },
        { label: "Address", value: "Kashin Building 201, 130-4 Fukakusa Shimogawaracho, Fushimi-ku, Kyoto-shi, Kyoto" }
      ],
      organizationsTitle: "Affiliations and Partners",
      organizations: ["National art dealer association participation planned", "Regional antique dealer group participation planned", "Delivery and insurance partner framework", "Network of restoration and mounting specialists"]
    },
    cta: {
      title: "Tell us about the work, the sale, or the question at your own pace.",
      text: "We can guide store visits, photo appraisal, purchase consultation, estate organization, and corporate inquiries according to your situation.",
      collection: "View Collection",
      contact: "Contact"
    }
  }
};

function PhilosophyIcon({ icon }: { icon: IconName }) {
  const Icon = icon === "eye" ? Sparkles : icon === "trust" ? Handshake : Landmark;
  return <Icon aria-hidden size={24} />;
}

function FactIcon({ icon: Icon }: { icon: ComponentType<{ size?: number; "aria-hidden"?: boolean; className?: string }> }) {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center border border-[color:var(--gold)] text-[color:var(--gold-dark)]">
      <Icon aria-hidden size={20} />
    </div>
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const pageBlock = await getPageBlock("about", "content", lang, copy[lang]);
  const page = pageBlock.content;

  return pageMetadata({ settings, lang, path: "/about", title: page.seoTitle, description: page.seoDescription, image: collectionImages.jade });
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const pageBlock = await getPageBlock("about", "content", lang, copy[lang]);
  const page = pageBlock.content;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: page.banner.breadcrumbHome, item: `/${lang}` },
      { "@type": "ListItem", position: 2, name: page.banner.title, item: `/${lang}/about` }
    ]
  };
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: lang === "en" ? "Gyokurinken Co., Ltd." : "玉林軒株式会社",
    url: `/${lang}/about`,
    logo: "玉林軒",
    address: page.credentials.licenseRows.find((row) => row.label === "所在地" || row.label === "Address")?.value,
    knowsAbout: ["Antiques", "Fine Art", "Ceramics", "Hanging Scrolls", "Japanese Art"]
  };

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <section className="border-b border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
            <Link href={localizedPath(lang)} className="hover:text-[color:var(--gold-dark)]">
              {page.banner.breadcrumbHome}
            </Link>
            <ChevronRight aria-hidden size={14} className="text-[color:var(--gold)]" />
            <span className="text-[color:var(--ink)]">{page.banner.title}</span>
          </nav>
          <div className="mt-10 grid gap-7 md:grid-cols-[0.7fr_1fr] md:items-end">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.34em] text-[color:var(--gold)]">{page.banner.eyebrow}</p>
              <h1 className="mt-4 break-words font-serif text-4xl font-light tracking-[0.14em] md:text-6xl">
                {page.banner.title}
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-[color:var(--muted)] md:justify-self-end md:text-base">
              {page.banner.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.58fr)] lg:px-8">
        <div className="min-w-0 self-center">
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.story.eyebrow}</p>
          <h2 className="mt-4 break-words font-serif text-3xl font-light leading-tight md:text-5xl">
            {page.story.title}
          </h2>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[color:var(--ink)]">{page.story.lead}</p>
          <div className="mt-6 grid gap-4 text-sm leading-8 text-[color:var(--muted)] md:text-base">
            {page.story.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {page.story.facts.map((fact) => (
              <div key={fact.label} className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
                <p className="font-serif text-4xl font-light text-[color:var(--gold-dark)]">{fact.value}</p>
                <p className="mt-2 text-xs leading-5 tracking-[0.14em] text-[color:var(--muted)]">{fact.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[430px] overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)]">
          <Image
            src={collectionImages.jade}
            alt={page.story.title}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(44,36,22,0.62)] via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 border border-[color:var(--gold)] bg-[rgba(255,253,248,0.92)] p-5">
            <p className="font-serif text-3xl font-light text-[color:var(--ink)]">玉林軒</p>
            <p className="mt-2 text-xs leading-5 tracking-[0.2em] text-[color:var(--gold-dark)]">
              GYOKURINKEN CO., LTD.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--ivory-dark)] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[340px_minmax(0,1fr)] lg:px-8">
          <aside className="self-start border border-[color:var(--gold)] bg-[color:var(--paper)] p-6">
            <FactIcon icon={Users} />
            <p className="mt-6 text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.greeting.eyebrow}</p>
            <h2 className="mt-3 break-words font-serif text-3xl font-light">{page.greeting.title}</h2>
            <div className="mt-6 border-l border-[color:var(--gold)] pl-4">
              <p className="break-words font-serif text-2xl font-light text-[color:var(--ink)]">{page.greeting.name}</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{page.greeting.role}</p>
            </div>
          </aside>
          <div className="min-w-0 border border-[color:var(--border)] bg-[color:var(--paper)] p-6 md:p-9">
            <ScrollText aria-hidden size={34} className="text-[color:var(--gold-dark)]" />
            <div className="mt-6 grid gap-5 text-sm leading-8 text-[color:var(--muted)] md:text-base">
              {page.greeting.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.philosophy.eyebrow}</p>
          <h2 className="section-title mt-3 font-serif text-3xl font-light md:text-5xl">{page.philosophy.title}</h2>
          <p className="mt-7 text-sm leading-8 text-[color:var(--muted)] md:text-base">{page.philosophy.lead}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {page.philosophy.items.map((item) => (
            <div key={item.title} className="min-w-0 border border-[color:var(--border)] bg-[color:var(--paper)] p-6 md:p-7">
              <div className="flex size-12 items-center justify-center border border-[color:var(--gold)] text-[color:var(--gold-dark)]">
                <PhilosophyIcon icon={item.icon} />
              </div>
              <h3 className="mt-6 break-words font-serif text-2xl font-light">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[color:var(--paper)] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.timeline.eyebrow}</p>
              <h2 className="mt-3 break-words font-serif text-3xl font-light md:text-5xl">{page.timeline.title}</h2>
            </div>
            <div className="grid min-w-0 gap-4">
              {page.timeline.entries.map((entry) => (
                <div key={entry.year} className="grid gap-4 border border-[color:var(--border)] bg-[color:var(--ivory)] p-5 sm:grid-cols-[120px_minmax(0,1fr)] md:p-6">
                  <p className="font-display text-4xl leading-none text-[color:var(--gold-dark)]">{entry.year}</p>
                  <div className="min-w-0 border-l border-[color:var(--gold)] pl-5">
                    <h3 className="break-words font-serif text-2xl font-light">{entry.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{entry.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.gallery.eyebrow}</p>
          <h2 className="section-title mt-3 font-serif text-3xl font-light md:text-5xl">{page.gallery.title}</h2>
          <p className="mt-7 text-sm leading-8 text-[color:var(--muted)] md:text-base">{page.gallery.lead}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {page.gallery.images.map((image) => (
            <div key={image.title} className="min-w-0 overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)]">
              <div className="relative aspect-[4/5]">
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="break-words font-serif text-2xl font-light">{image.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{image.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[color:var(--ivory-dark)] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
          <div className="min-w-0 border border-[color:var(--border)] bg-[color:var(--paper)] p-6 md:p-8">
            <div className="flex items-center gap-3">
              <FileCheck2 aria-hidden size={24} className="shrink-0 text-[color:var(--gold-dark)]" />
              <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.credentials.eyebrow}</p>
            </div>
            <h2 className="mt-4 break-words font-serif text-3xl font-light">{page.credentials.title}</h2>
            <p className="mt-5 text-sm leading-8 text-[color:var(--muted)]">{page.credentials.lead}</p>
            <div className="mt-8 flex items-center gap-3 border-l border-[color:var(--gold)] pl-4">
              <ShieldCheck aria-hidden size={24} className="shrink-0 text-[color:var(--gold-dark)]" />
              <p className="font-serif text-2xl font-light">{page.credentials.licenseTitle}</p>
            </div>
            <dl className="mt-5 divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
              {page.credentials.licenseRows.map((row) => (
                <div key={row.label} className="grid gap-2 py-4 text-sm leading-7 sm:grid-cols-[0.34fr_0.66fr]">
                  <dt className="text-[color:var(--ink)]">{row.label}</dt>
                  <dd className="break-words text-[color:var(--muted)]">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="min-w-0 border border-[color:var(--gold)] bg-[color:var(--wood)] p-6 text-[color:var(--ivory)] md:p-8">
            <div className="flex items-center gap-3">
              <Award aria-hidden size={24} className="shrink-0 text-[color:var(--gold-light)]" />
              <h2 className="break-words font-serif text-3xl font-light">{page.credentials.organizationsTitle}</h2>
            </div>
            <ul className="mt-8 grid gap-3 text-sm leading-7 text-white/72 sm:grid-cols-2">
              {page.credentials.organizations.map((item) => (
                <li key={item} className="border-l border-[color:var(--gold)] bg-white/5 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-4 border border-white/15 bg-white/5 p-5 sm:grid-cols-2">
              <div className="flex min-w-0 gap-3">
                <FactIcon icon={Store} />
                <div className="min-w-0">
                  <p className="text-xs tracking-[0.2em] text-[color:var(--gold-light)]">SHOP</p>
                  <p className="mt-2 break-words text-sm leading-7 text-white/72">Kyoto / appointment preferred</p>
                </div>
              </div>
              <div className="flex min-w-0 gap-3">
                <FactIcon icon={MapPin} />
                <div className="min-w-0">
                  <p className="text-xs tracking-[0.2em] text-[color:var(--gold-light)]">AREA</p>
                  <p className="mt-2 break-words text-sm leading-7 text-white/72">Japan-wide consultation</p>
                </div>
              </div>
              <div className="flex min-w-0 gap-3">
                <FactIcon icon={BookOpen} />
                <div className="min-w-0">
                  <p className="text-xs tracking-[0.2em] text-[color:var(--gold-light)]">FIELD</p>
                  <p className="mt-2 break-words text-sm leading-7 text-white/72">Ceramics / scrolls / craft</p>
                </div>
              </div>
              <div className="flex min-w-0 gap-3">
                <FactIcon icon={Building2} />
                <div className="min-w-0">
                  <p className="text-xs tracking-[0.2em] text-[color:var(--gold-light)]">COMPANY</p>
                  <p className="mt-2 break-words text-sm leading-7 text-white/72">Gyokurinken Co., Ltd.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
        <div className="grid gap-8 border border-[color:var(--gold)] bg-[color:var(--paper)] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div className="min-w-0">
            <h2 className="break-words font-serif text-3xl font-light md:text-4xl">{page.cta.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-[color:var(--muted)] md:text-base">{page.cta.text}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href={localizedPath(lang, "/collection")}
              className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-[color:var(--gold-dark)] transition hover:bg-[color:var(--gold)] hover:text-white"
            >
              {page.cta.collection}
              <ArrowRight aria-hidden size={16} />
            </Link>
            <Link
              href={localizedPath(lang, "/contact")}
              className="inline-flex min-h-12 items-center border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
            >
              {page.cta.contact}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
