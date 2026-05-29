import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  ChevronRight,
  Phone,
  Scale,
  ShieldCheck,
  Store,
  Truck
} from "lucide-react";
import { collectionImages } from "@/lib/collection-data";
import { getCachedSiteSettings, pageMetadata } from "@/lib/frontend-site";
import { getLanguage, type Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";
import { getPageBlock } from "@/lib/page-blocks";

type AppraisalCopy = {
  seoTitle: string;
  seoDescription: string;
  breadcrumbHome: string;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    cta: string;
    secondary: string;
    badge: string;
  };
  services: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { title: string; text: string; action: string; icon: "store" | "truck" | "camera" | "phone" }[];
  };
  purchaseItems: {
    eyebrow: string;
    title: string;
    lead: string;
    items: string[];
  };
  strengths: {
    eyebrow: string;
    title: string;
    items: { title: string; text: string; icon: "shield" | "badge" | "scale" }[];
  };
  flow: {
    eyebrow: string;
    title: string;
    steps: { title: string; text: string }[];
  };
  notes: {
    eyebrow: string;
    title: string;
    items: { question: string; answer: string }[];
  };
  cta: {
    title: string;
    text: string;
    primary: string;
    phone: string;
  };
};

const heroImage = collectionImages.bronze;

const copy: Record<Language, AppraisalCopy> = {
  ja: {
    seoTitle: "鑑定・買取 | 玉林軒株式会社",
    seoDescription:
      "骨董品・古美術品の鑑定、買取は玉林軒株式会社へ。店頭鑑定、出張鑑定、写真鑑定、電話相談に対応し、陶磁器、掛軸、茶道具、工芸品、家具などを丁寧に拝見します。",
    breadcrumbHome: "ホーム",
    hero: {
      eyebrow: "APPRAISAL & PURCHASE",
      title: "骨董品・古美術品の鑑定・買取",
      lead:
        "陶磁器、書画、茶道具、工芸、時代家具まで、品物の背景と状態を丁寧に確認し、売却前のご相談から買取まで誠実に承ります。",
      cta: "鑑定を申し込む",
      secondary: "買取品目を見る",
      badge: "初回相談無料 / 全国出張相談"
    },
    services: {
      eyebrow: "METHOD",
      title: "ご相談方法",
      lead: "品物の種類、点数、ご希望に合わせて、無理のない方法をお選びいただけます。",
      items: [
        { title: "店頭鑑定", text: "店舗で実物を拝見し、状態、時代、来歴、市場性を確認します。", action: "来店相談", icon: "store" },
        { title: "出張鑑定", text: "大型家具や点数が多い場合、ご自宅や保管場所へ伺います。", action: "出張相談", icon: "truck" },
        { title: "写真鑑定", text: "全体、底部、銘、傷などの写真から初期判断を行います。", action: "写真で相談", icon: "camera" },
        { title: "電話相談", text: "売却前の小さな疑問や、持ち込み前の確認にも対応します。", action: "電話で相談", icon: "phone" }
      ]
    },
    purchaseItems: {
      eyebrow: "ITEMS",
      title: "主な買取品目",
      lead: "掲載以外の品物も拝見できる場合があります。判断に迷う品は、まず写真でご相談ください。",
      items: ["陶磁器", "掛軸", "屏風", "茶道具", "絵画", "古書画", "鉄瓶", "銀瓶", "金工", "彫刻", "仏像", "蒔絵", "人形", "時計"]
    },
    strengths: {
      eyebrow: "VALUE",
      title: "玉林軒が大切にすること",
      items: [
        { title: "信頼ある説明", text: "鑑定の根拠、状態、評価の幅をできる限りわかりやすくお伝えします。", icon: "shield" },
        { title: "取扱実績", text: "日本・中国・朝鮮美術を中心に、器物ごとの市場性を踏まえて拝見します。", icon: "badge" },
        { title: "適正な評価", text: "高価買取だけを強調せず、状態と需要に基づいた納得感ある評価を行います。", icon: "scale" }
      ]
    },
    flow: {
      eyebrow: "FLOW",
      title: "鑑定・買取の流れ",
      steps: [
        { title: "お問い合わせ", text: "品物の種類、点数、鑑定方法のご希望をお知らせください。" },
        { title: "初期確認", text: "写真や概要から、拝見方法と必要な情報をご案内します。" },
        { title: "鑑定", text: "実物または写真を確認し、時代、状態、来歴、市場性を見立てます。" },
        { title: "お見積り", text: "買取可能な場合は評価額をご提示し、内容をご説明します。" },
        { title: "成立・返却", text: "ご納得いただけた場合のみ成立します。不成立の場合も無理な勧誘は行いません。" }
      ]
    },
    notes: {
      eyebrow: "NOTES",
      title: "ご確認事項",
      items: [
        { question: "写真鑑定だけで価格は確定しますか。", answer: "写真では初期判断となります。最終評価は実物確認後に変わる場合があります。" },
        { question: "一点だけでも相談できますか。", answer: "一点から承ります。小品、箱、付属品がある場合もあわせてお知らせください。" },
        { question: "出張鑑定の対応地域はどこですか。", answer: "品物の内容と点数により全国対応を検討します。まずは地域と概要をご相談ください。" },
        { question: "買取できない場合もありますか。", answer: "状態、真贋、需要、法令上の理由によりお受けできない場合があります。" }
      ]
    },
    cta: {
      title: "売却前の不安も、まずは静かにご相談ください。",
      text: "品物の写真、寸法、入手経緯がわかる範囲で構いません。担当者が順に確認いたします。",
      primary: "鑑定を申し込む",
      phone: "電話相談"
    }
  },
  zh: {
    seoTitle: "鉴定・收购 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社提供骨董古美术鉴定与收购，支持店头鉴定、出张鉴定、照片鉴定和电话咨询，涵盖陶瓷、挂轴、茶道具、工艺品与时代家具。",
    breadcrumbHome: "首页",
    hero: {
      eyebrow: "APPRAISAL & PURCHASE",
      title: "骨董品・古美术品鉴定・收购",
      lead:
        "从陶瓷、书画、茶道具、工艺品到时代家具，我们会细致确认器物背景与状态，为出售前咨询和收购提供清晰说明。",
      cta: "提交鉴定咨询",
      secondary: "查看收购品类",
      badge: "初次咨询免费 / 可咨询日本全国出张"
    },
    services: {
      eyebrow: "METHOD",
      title: "咨询方式",
      lead: "可根据物品种类、数量与所在地，选择适合的鉴定方式。",
      items: [
        { title: "店头鉴定", text: "到店查看实物，确认状态、时代、来源与市场情况。", action: "预约来店", icon: "store" },
        { title: "出张鉴定", text: "大型家具或数量较多时，可前往住宅或保管地点确认。", action: "咨询出张", icon: "truck" },
        { title: "照片鉴定", text: "通过整体、底部、款识、伤痕等照片进行初步判断。", action: "发送照片", icon: "camera" },
        { title: "电话咨询", text: "出售前的小问题、到店前的确认，也可以先通过电话咨询。", action: "电话咨询", icon: "phone" }
      ]
    },
    purchaseItems: {
      eyebrow: "ITEMS",
      title: "主要收购品类",
      lead: "未列出的物品也可能可以确认。若不确定类别，建议先发送照片咨询。",
      items: ["陶瓷器", "挂轴", "屏风", "茶道具", "绘画", "古书画", "铁瓶", "银瓶", "金工", "雕刻", "佛像", "莳绘", "人偶", "钟表"]
    },
    strengths: {
      eyebrow: "VALUE",
      title: "玉林軒重视的原则",
      items: [
        { title: "可信赖的说明", text: "尽可能清楚说明鉴定依据、状态与评价范围。", icon: "shield" },
        { title: "经手实绩", text: "以日本、中国、朝鲜美术为中心，结合不同器物的市场性判断。", icon: "badge" },
        { title: "适正评估", text: "不只强调高价，而是根据状态与需求给出可理解的评价。", icon: "scale" }
      ]
    },
    flow: {
      eyebrow: "FLOW",
      title: "鉴定・收购流程",
      steps: [
        { title: "咨询联系", text: "请告知物品类别、数量，以及希望的鉴定方式。" },
        { title: "初步确认", text: "根据照片或概要，说明适合的确认方式与所需信息。" },
        { title: "鉴定确认", text: "通过实物或照片确认时代、状态、来源与市场性。" },
        { title: "报价说明", text: "如可收购，会提示评估金额并说明判断内容。" },
        { title: "成交或返还", text: "仅在您认可后成交。如未成交，也不会强行劝说。" }
      ]
    },
    notes: {
      eyebrow: "NOTES",
      title: "注意事项",
      items: [
        { question: "仅凭照片可以确定价格吗？", answer: "照片鉴定为初步判断，最终评价可能在实物确认后调整。" },
        { question: "只有一件也可以咨询吗？", answer: "可以。从一件开始受理，如有箱、附件，也请一并告知。" },
        { question: "出张鉴定可对应哪些地区？", answer: "会根据物品内容与数量综合判断。请先告知所在地与物品概要。" },
        { question: "也有无法收购的情况吗？", answer: "根据状态、真伪、市场需求或法规原因，可能无法收购。" }
      ]
    },
    cta: {
      title: "出售前的不安，也欢迎先安静地聊一聊。",
      text: "照片、尺寸、入手经过只需在知道的范围内提供即可。担当人员会依次确认。",
      primary: "提交鉴定咨询",
      phone: "电话咨询"
    }
  },
  en: {
    seoTitle: "Appraisal & Purchase | Gyokurinken Co., Ltd.",
    seoDescription:
      "Gyokurinken provides appraisal and purchase consultation for antiques and fine art, including in-store, on-site, photo, and phone consultation for ceramics, scrolls, tea wares, crafts, and furniture.",
    breadcrumbHome: "Home",
    hero: {
      eyebrow: "APPRAISAL & PURCHASE",
      title: "Antique and Fine Art Appraisal",
      lead:
        "From ceramics, paintings, and tea wares to craft works and period furniture, we review each piece with attention to condition, background, and current market context.",
      cta: "Request Appraisal",
      secondary: "View Accepted Items",
      badge: "Free initial consultation / On-site visits in Japan"
    },
    services: {
      eyebrow: "METHOD",
      title: "Consultation Methods",
      lead: "Choose the method that best suits the object, quantity, location, and stage of your decision.",
      items: [
        { title: "In-store Appraisal", text: "Bring the work to us for a careful review of condition, age, provenance, and marketability.", action: "Book a Visit", icon: "store" },
        { title: "On-site Appraisal", text: "For large furniture or multiple works, we can discuss visiting your home or storage location.", action: "Ask About Visit", icon: "truck" },
        { title: "Photo Appraisal", text: "Send overall, base, signature, and condition photos for a preliminary opinion.", action: "Send Photos", icon: "camera" },
        { title: "Phone Consultation", text: "Useful for early questions before bringing in or selling a work.", action: "Call Us", icon: "phone" }
      ]
    },
    purchaseItems: {
      eyebrow: "ITEMS",
      title: "Accepted Item Categories",
      lead: "Items not listed here may also be reviewed. When unsure, please begin with photos.",
      items: ["Ceramics", "Hanging Scrolls", "Folding Screens", "Tea Wares", "Paintings", "Old Calligraphy", "Iron Kettles", "Silver Kettles", "Metalwork", "Sculpture", "Buddhist Figures", "Maki-e", "Dolls", "Clocks"]
    },
    strengths: {
      eyebrow: "VALUE",
      title: "What We Value",
      items: [
        { title: "Clear Explanation", text: "We explain the basis of appraisal, condition, and valuation range as clearly as possible.", icon: "shield" },
        { title: "Handling Experience", text: "Our review reflects market context across Japanese, Chinese, and Korean art.", icon: "badge" },
        { title: "Fair Assessment", text: "We avoid empty promises and evaluate works according to condition and demand.", icon: "scale" }
      ]
    },
    flow: {
      eyebrow: "FLOW",
      title: "Appraisal and Purchase Flow",
      steps: [
        { title: "Inquiry", text: "Tell us the object type, quantity, and preferred appraisal method." },
        { title: "Initial Review", text: "We review photos or summary details and explain the next steps." },
        { title: "Appraisal", text: "We assess age, condition, provenance, and marketability from photos or in person." },
        { title: "Estimate", text: "When purchase is possible, we present a valuation and explain the reasoning." },
        { title: "Completion or Return", text: "A sale proceeds only if you agree. There is no pressure if you decline." }
      ]
    },
    notes: {
      eyebrow: "NOTES",
      title: "Before You Contact Us",
      items: [
        { question: "Can a price be fixed from photos alone?", answer: "Photo appraisal is preliminary. Final valuation may change after in-person inspection." },
        { question: "Can I ask about a single item?", answer: "Yes. We accept inquiries from one item. Please mention boxes or accessories if available." },
        { question: "Where are on-site appraisals available?", answer: "We consider visits based on item type and quantity. Please first share your area and item summary." },
        { question: "Are there items you cannot purchase?", answer: "Yes. Condition, authenticity, demand, or legal restrictions may prevent purchase." }
      ]
    },
    cta: {
      title: "Start with a quiet consultation before deciding to sell.",
      text: "Photos, dimensions, and known background are enough to begin. Our staff will review your inquiry in order.",
      primary: "Request Appraisal",
      phone: "Call for Advice"
    }
  }
};

function ServiceIcon({ icon }: { icon: AppraisalCopy["services"]["items"][number]["icon"] }) {
  const Icon = icon === "store" ? Store : icon === "truck" ? Truck : icon === "camera" ? Camera : Phone;
  return <Icon aria-hidden size={24} />;
}

function StrengthIcon({ icon }: { icon: AppraisalCopy["strengths"]["items"][number]["icon"] }) {
  const Icon = icon === "shield" ? ShieldCheck : icon === "badge" ? BadgeCheck : Scale;
  return <Icon aria-hidden size={26} />;
}

function SectionTitle({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{eyebrow}</p>
      <h2 className="section-title mt-3 font-serif text-3xl font-light md:text-5xl">{title}</h2>
      {lead ? <p className="mt-7 text-sm leading-8 text-[color:var(--muted)] md:text-base">{lead}</p> : null}
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
  const pageBlock = await getPageBlock("appraisal", "content", lang, copy[lang]);
  const page = pageBlock.content;

  return pageMetadata({ settings, lang, path: "/appraisal", title: page.seoTitle, description: page.seoDescription, image: heroImage });
}

export default async function AppraisalPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const pageBlock = await getPageBlock("appraisal", "content", lang, copy[lang]);
  const page = pageBlock.content;
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.hero.title,
    provider: {
      "@type": "Organization",
      name: "玉林軒株式会社"
    },
    serviceType: "Antique and fine art appraisal and purchase",
    areaServed: "Japan",
    description: page.seoDescription
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: page.breadcrumbHome, item: `/${lang}` },
      { "@type": "ListItem", position: 2, name: page.hero.title, item: `/${lang}/appraisal` }
    ]
  };

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="border-b border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
            <Link href={localizedPath(lang)} className="hover:text-[color:var(--gold-dark)]">
              {page.breadcrumbHome}
            </Link>
            <ChevronRight aria-hidden size={14} className="text-[color:var(--gold)]" />
            <span className="text-[color:var(--ink)]">{page.hero.title}</span>
          </nav>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 md:grid-cols-[0.9fr_1.1fr] md:py-14 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.34em] text-[color:var(--gold)]">{page.hero.eyebrow}</p>
          <h1 className="mt-5 break-words font-serif text-4xl font-light leading-tight text-[color:var(--ink)] md:text-6xl">
            {page.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-8 text-[color:var(--muted)] md:text-base">
            {page.hero.lead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={localizedPath(lang, "/appraisal/form")}
              className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-6 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
            >
              {page.hero.cta}
              <ArrowRight size={16} />
            </Link>
            <a
              href="#items"
              className="inline-flex min-h-12 items-center border border-[color:var(--border)] px-6 text-sm tracking-[0.14em] text-[color:var(--ink)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
            >
              {page.hero.secondary}
            </a>
          </div>
          <p className="mt-6 w-fit border-l border-[color:var(--gold)] bg-[rgba(255,253,248,0.72)] px-4 py-3 text-xs tracking-[0.14em] text-[color:var(--gold-dark)]">
            {page.hero.badge}
          </p>
        </div>

        <div className="relative min-h-[360px] overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory-dark)] md:min-h-[520px]">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(44,36,22,0.68)] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 border border-white/30 bg-[rgba(255,253,248,0.9)] px-5 py-4 text-[color:var(--ink)] backdrop-blur">
            <p className="font-serif text-3xl font-light text-[color:var(--gold-dark)]">
              Appraisal
            </p>
            <p className="mt-2 text-xs leading-5 tracking-[0.16em] text-[color:var(--muted)]">
              GYOKURINKEN
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--ivory-dark)] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle {...page.services} />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {page.services.items.map((service) => (
              <Link
                key={service.title}
                href={localizedPath(lang, service.icon === "phone" ? "/contact" : "/appraisal/form")}
                className="group flex min-w-0 flex-col border border-[color:var(--border)] bg-[color:var(--paper)] p-6 transition hover:-translate-y-1 hover:border-[color:var(--gold)] hover:shadow-xl"
              >
                <div className="flex size-12 items-center justify-center border border-[color:var(--gold)] text-[color:var(--gold-dark)]">
                  <ServiceIcon icon={service.icon} />
                </div>
                <h2 className="mt-6 break-words font-serif text-2xl font-light text-[color:var(--ink)]">
                  {service.title}
                </h2>
                <p className="mt-4 flex-1 text-sm leading-7 text-[color:var(--muted)]">
                  {service.text}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm tracking-[0.14em] text-[color:var(--gold-dark)]">
                  {service.action}
                  <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="items" className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.purchaseItems.eyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl font-light md:text-5xl">{page.purchaseItems.title}</h2>
          <p className="mt-6 text-sm leading-8 text-[color:var(--muted)] md:text-base">
            {page.purchaseItems.lead}
          </p>
          <div className="relative mt-8 aspect-[4/3] overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory-dark)]">
            <Image
              src={collectionImages.imari}
              alt=""
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="grid content-start gap-3 sm:grid-cols-2">
          {page.purchaseItems.items.map((item) => (
            <div
              key={item}
              className="flex min-h-14 items-center gap-3 border border-[color:var(--border)] bg-[color:var(--paper)] px-4 text-sm text-[color:var(--ink)]"
            >
              <CheckCircle2 aria-hidden size={17} className="shrink-0 text-[color:var(--gold-dark)]" />
              <span className="min-w-0 break-words">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[color:var(--paper)] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle eyebrow={page.strengths.eyebrow} title={page.strengths.title} />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {page.strengths.items.map((strength) => (
              <div key={strength.title} className="border border-[color:var(--border)] bg-[color:var(--ivory)] p-7">
                <div className="flex size-14 items-center justify-center bg-[color:var(--wood)] text-[color:var(--gold-light)]">
                  <StrengthIcon icon={strength.icon} />
                </div>
                <h2 className="mt-6 font-serif text-2xl font-light">{strength.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{strength.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
        <SectionTitle eyebrow={page.flow.eyebrow} title={page.flow.title} />
        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {page.flow.steps.map((step, index) => (
            <div key={step.title} className="relative border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
              <p className="font-display text-4xl leading-none text-[color:var(--gold)]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-5 font-serif text-xl font-light">{step.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[color:var(--ivory-dark)] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.74fr_1.26fr] lg:px-8">
          <div>
            <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.notes.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-light md:text-5xl">{page.notes.title}</h2>
          </div>
          <div className="divide-y divide-[color:var(--border)] border-y border-[color:var(--border)] bg-[color:var(--paper)]">
            {page.notes.items.map((note, index) => (
              <details key={note.question} className="group px-5 py-5 open:bg-[rgba(249,245,238,0.62)]">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-[color:var(--ink)]">
                  <span className="min-w-0 break-words">
                    {String(index + 1).padStart(2, "0")} / {note.question}
                  </span>
                  <span className="shrink-0 text-xl text-[color:var(--gold-dark)] group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{note.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
        <div className="grid gap-8 border border-[color:var(--gold)] bg-[color:var(--wood)] p-6 text-[color:var(--ivory)] md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 className="break-words font-serif text-3xl font-light md:text-4xl">{page.cta.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/72 md:text-base">{page.cta.text}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href={localizedPath(lang, "/appraisal/form")}
              className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
            >
              {page.cta.primary}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={localizedPath(lang, "/contact")}
              className="inline-flex min-h-12 items-center gap-3 border border-white/25 px-5 text-sm tracking-[0.14em] text-white"
            >
              <Phone size={16} />
              {page.cta.phone}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
