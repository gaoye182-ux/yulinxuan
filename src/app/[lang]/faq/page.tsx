import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Globe2,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck
} from "lucide-react";
import { collectionImages } from "@/lib/collection-data";
import { getCachedSiteSettings, pageMetadata } from "@/lib/frontend-site";
import { getLanguage, type Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";
import { getPageBlock } from "@/lib/page-blocks";

type FaqCategoryKey = "purchase" | "appraisal" | "delivery" | "payment" | "overseas" | "condition";

type FaqCopy = {
  seoTitle: string;
  seoDescription: string;
  banner: {
    eyebrow: string;
    title: string;
    subtitle: string;
    breadcrumbHome: string;
  };
  intro: {
    title: string;
    text: string;
    contact: string;
    appraisal: string;
  };
  categories: {
    key: FaqCategoryKey;
    label: string;
    title: string;
    lead: string;
    items: { question: string; answer: string }[];
  }[];
  cta: {
    title: string;
    text: string;
    contact: string;
    purchaseGuide: string;
  };
};

const copy: Record<Language, FaqCopy> = {
  ja: {
    seoTitle: "よくある質問 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社のよくある質問。古美術品の購入、鑑定、配送、支払い、海外対応、状態確認についてご案内します。",
    banner: {
      eyebrow: "FAQ",
      title: "よくある質問",
      subtitle: "ご購入、鑑定、配送、海外対応など、事前に確認いただきたい内容をまとめました。",
      breadcrumbHome: "ホーム"
    },
    intro: {
      title: "古美術品は一点ごとに状態も背景も異なります。",
      text: "掲載内容で解決しない場合は、品名、写真、ご希望内容を添えてお問い合わせください。担当者が順に確認いたします。",
      contact: "お問い合わせ",
      appraisal: "鑑定を申し込む"
    },
    categories: [
      {
        key: "purchase",
        label: "購入",
        title: "購入について",
        lead: "ご購入前の確認、取り置き、店頭確認に関する質問です。",
        items: [
          { question: "掲載品はすべて購入できますか。", answer: "販売中、価格応相談、商談中など状態が異なります。気になる品は商品名を添えてお問い合わせください。" },
          { question: "購入前に実物を確認できますか。", answer: "店頭確認が可能な品はご予約のうえご覧いただけます。保管場所が異なる場合がありますので事前にご相談ください。" },
          { question: "取り置きはできますか。", answer: "品物と商談状況により短期間の取り置きを検討します。長期取り置きは原則として承っておりません。" }
        ]
      },
      {
        key: "appraisal",
        label: "鑑定",
        title: "鑑定・買取について",
        lead: "店頭、出張、写真、電話相談に関する質問です。",
        items: [
          { question: "写真だけで鑑定できますか。", answer: "写真では初期判断となります。最終的な評価や買取可否は実物確認後に変わる場合があります。" },
          { question: "一点だけでも相談できますか。", answer: "一点から承ります。箱、証書、付属品、入手経緯がある場合はあわせてお知らせください。" },
          { question: "出張鑑定は全国対応ですか。", answer: "品物の内容、点数、地域により検討します。まずは所在地と品物概要をお知らせください。" }
        ]
      },
      {
        key: "delivery",
        label: "配送",
        title: "配送・受け取りについて",
        lead: "梱包、保険、店頭受け取り、大型品配送に関する質問です。",
        items: [
          { question: "配送方法は選べますか。", answer: "品物の素材、サイズ、壊れやすさに応じて安全な方法をご案内します。大型品は専門配送を検討します。" },
          { question: "店頭受け取りは可能ですか。", answer: "可能です。ご来店日時を事前に確認し、状態説明とお渡しを行います。" },
          { question: "配送中の破損が心配です。", answer: "必要に応じて保険、追跡、専門梱包をご案内します。到着時は梱包材を保管し、状態をご確認ください。" }
        ]
      },
      {
        key: "payment",
        label: "支払い",
        title: "お支払いについて",
        lead: "銀行振込、カード、現金、法人購入に関する質問です。",
        items: [
          { question: "支払い方法を教えてください。", answer: "銀行振込、店頭での現金、対応可能なクレジットカード決済などをご案内します。品物により個別確認となります。" },
          { question: "領収書は発行できますか。", answer: "発行可能です。宛名、但し書き、法人名が必要な場合は事前にお知らせください。" },
          { question: "海外送金は可能ですか。", answer: "内容により個別に確認します。手数料、着金確認、本人確認が必要になる場合があります。" }
        ]
      },
      {
        key: "overseas",
        label: "海外",
        title: "海外のお客様へ",
        lead: "海外配送、通関、言語対応、支払いに関する質問です。",
        items: [
          { question: "海外へ発送できますか。", answer: "輸出可否、通関、保険、送料を確認したうえで個別にご案内します。品物により発送できない場合があります。" },
          { question: "英語や中国語で相談できますか。", answer: "英語、中国語での基本的なご相談に対応します。専門的な内容は確認にお時間をいただく場合があります。" },
          { question: "関税や輸入手続きは誰が負担しますか。", answer: "輸入国側の関税、税金、通関手続きは原則としてお客様負担となります。" }
        ]
      },
      {
        key: "condition",
        label: "状態",
        title: "品物の状態について",
        lead: "古美術品特有の傷、修復、付属品、真贋確認に関する質問です。",
        items: [
          { question: "古い傷や修復はありますか。", answer: "時代を経た品物には擦れ、窯傷、修復、経年変化がある場合があります。確認できる範囲で説明します。" },
          { question: "追加写真は依頼できますか。", answer: "可能です。口縁、底部、銘、箱、修復箇所など、気になる部分をお知らせください。" },
          { question: "真贋保証はありますか。", answer: "品物ごとの説明内容、資料、確認範囲に基づいてご案内します。保証条件がある場合は購入前に明示します。" }
        ]
      }
    ],
    cta: {
      title: "解決しないご質問は、静かにお聞かせください。",
      text: "品名、写真、購入または鑑定のご希望を添えていただくと、より正確にご案内できます。",
      contact: "お問い合わせ",
      purchaseGuide: "ご購入方法を見る"
    }
  },
  zh: {
    seoTitle: "常见问题 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社常见问题，涵盖古美术品购买、鉴定、配送、支付、海外客户与状态确认。",
    banner: {
      eyebrow: "FAQ",
      title: "常见问题",
      subtitle: "整理购买、鉴定、配送、海外对应等事前可确认的问题。",
      breadcrumbHome: "首页"
    },
    intro: {
      title: "古美术品每一件的状态与背景都不同。",
      text: "若页面内容无法解答您的疑问，请附上品名、照片与希望咨询的内容联系我们。",
      contact: "联系我们",
      appraisal: "提交鉴定申请"
    },
    categories: [
      {
        key: "purchase",
        label: "购买",
        title: "关于购买",
        lead: "购买前确认、保留、店头看实物相关问题。",
        items: [
          { question: "刊载品都可以购买吗？", answer: "销售中、价格咨询、商谈中等状态可能不同。请附上品名咨询。" },
          { question: "购买前可以看实物吗？", answer: "可店头确认的藏品可预约查看。部分藏品保管地点不同，请提前咨询。" },
          { question: "可以保留吗？", answer: "会根据藏品与商谈状态考虑短期保留，原则上不接受长期保留。" }
        ]
      },
      {
        key: "appraisal",
        label: "鉴定",
        title: "关于鉴定・收购",
        lead: "店头、出张、照片、电话咨询相关问题。",
        items: [
          { question: "只凭照片可以鉴定吗？", answer: "照片为初步判断。最终评价或是否可收购，可能在实物确认后调整。" },
          { question: "只有一件也可以咨询吗？", answer: "可以。从一件开始受理，如有箱、证书、附件、取得经过，也请一并告知。" },
          { question: "出张鉴定可日本全国对应吗？", answer: "会根据物品内容、数量和地区综合判断。请先告知所在地与物品概要。" }
        ]
      },
      {
        key: "delivery",
        label: "配送",
        title: "关于配送・取货",
        lead: "包装、保险、店头取货、大型品配送相关问题。",
        items: [
          { question: "可以选择配送方式吗？", answer: "会根据物品材质、尺寸、脆弱程度说明安全的配送方式。大型品可能需要专业配送。" },
          { question: "可以店头取货吗？", answer: "可以。请提前确认来店时间，我们会进行状态说明并交付。" },
          { question: "担心配送中破损怎么办？", answer: "可根据需要说明保险、追踪和专业包装。到货时请保留包装材料并确认状态。" }
        ]
      },
      {
        key: "payment",
        label: "支付",
        title: "关于支付",
        lead: "银行转账、信用卡、现金、法人购买相关问题。",
        items: [
          { question: "有哪些支付方式？", answer: "可说明银行转账、店头现金、可对应的信用卡支付等。具体方式会根据藏品个别确认。" },
          { question: "可以开收据吗？", answer: "可以。若需要指定抬头、但书或法人名称，请提前告知。" },
          { question: "可以海外汇款吗？", answer: "根据内容个别确认。可能需要确认手续费、到账情况和本人信息。" }
        ]
      },
      {
        key: "overseas",
        label: "海外",
        title: "面向海外客户",
        lead: "海外配送、通关、语言对应、支付相关问题。",
        items: [
          { question: "可以发往海外吗？", answer: "会确认出口可否、通关、保险和运费后个别说明。部分物品可能无法配送。" },
          { question: "可以用中文或英文咨询吗？", answer: "可对应基本中文和英文咨询。专业内容可能需要更多确认时间。" },
          { question: "关税和进口手续由谁承担？", answer: "进口国侧关税、税费和通关手续原则上由客户承担。" }
        ]
      },
      {
        key: "condition",
        label: "状态",
        title: "关于物品状态",
        lead: "古美术品特有伤痕、修复、附件、真伪确认相关问题。",
        items: [
          { question: "会有旧伤或修复吗？", answer: "经历时代的物品可能有擦痕、窑伤、修复和经年变化。我们会在可确认范围内说明。" },
          { question: "可以要求追加照片吗？", answer: "可以。请告知口沿、底部、款识、箱、修复位置等想确认的部分。" },
          { question: "有真伪保证吗？", answer: "会根据每件物品的说明内容、资料和确认范围进行说明。如有保证条件，会在购买前明确。" }
        ]
      }
    ],
    cta: {
      title: "仍未解决的问题，欢迎安静地告诉我们。",
      text: "请附上品名、照片，以及购买或鉴定意向，我们可以更准确地回复。",
      contact: "联系我们",
      purchaseGuide: "查看购买方法"
    }
  },
  en: {
    seoTitle: "FAQ | Gyokurinken Co., Ltd.",
    seoDescription:
      "Frequently asked questions about purchasing, appraisal, delivery, payment, overseas orders, and condition review at Gyokurinken.",
    banner: {
      eyebrow: "FAQ",
      title: "FAQ",
      subtitle: "Questions to review before purchase, appraisal, shipping, and overseas consultation.",
      breadcrumbHome: "Home"
    },
    intro: {
      title: "Every antique work has its own condition and background.",
      text: "If these answers do not resolve your question, please contact us with the work name, photos, and what you would like to confirm.",
      contact: "Contact",
      appraisal: "Request Appraisal"
    },
    categories: [
      {
        key: "purchase",
        label: "Purchase",
        title: "Purchasing",
        lead: "Questions about availability, viewing, and temporary holds.",
        items: [
          { question: "Are all listed works available for purchase?", answer: "Availability varies by status, such as available, price on request, or under negotiation. Please inquire with the work name." },
          { question: "Can I view a work before purchasing?", answer: "Works available for in-store viewing can be seen by appointment. Some works may be stored off-site, so please contact us first." },
          { question: "Can you hold an item?", answer: "A short hold may be considered depending on the work and negotiation status. Long-term holds are generally not available." }
        ]
      },
      {
        key: "appraisal",
        label: "Appraisal",
        title: "Appraisal and Purchase",
        lead: "Questions about in-store, on-site, photo, and phone consultation.",
        items: [
          { question: "Can you appraise from photos only?", answer: "Photo review is preliminary. Final valuation and purchase availability may change after in-person inspection." },
          { question: "Can I ask about a single item?", answer: "Yes. We accept inquiries from one item. Please include boxes, certificates, accessories, and background if known." },
          { question: "Are on-site appraisals available nationwide?", answer: "We consider visits based on item type, quantity, and location. Please first share your area and item summary." }
        ]
      },
      {
        key: "delivery",
        label: "Delivery",
        title: "Delivery and Pickup",
        lead: "Questions about packing, insurance, in-store pickup, and large works.",
        items: [
          { question: "Can I choose the delivery method?", answer: "We recommend a safe method based on material, size, and fragility. Large works may require specialist delivery." },
          { question: "Can I pick up in store?", answer: "Yes. Please arrange your visit in advance so we can explain condition and hand over the work." },
          { question: "What if I am worried about damage in transit?", answer: "Insurance, tracking, and specialist packing can be discussed. Please keep all packing materials and check condition on arrival." }
        ]
      },
      {
        key: "payment",
        label: "Payment",
        title: "Payment",
        lead: "Questions about bank transfer, cards, cash, and corporate purchase.",
        items: [
          { question: "What payment methods are available?", answer: "Bank transfer, cash in store, and available credit card options can be explained. Methods are confirmed individually by work." },
          { question: "Can you issue a receipt?", answer: "Yes. Please tell us the recipient name, description, or company name in advance if needed." },
          { question: "Can I pay by overseas transfer?", answer: "This is reviewed case by case. Fees, receipt confirmation, and identity confirmation may be required." }
        ]
      },
      {
        key: "overseas",
        label: "Overseas",
        title: "For Overseas Customers",
        lead: "Questions about international shipping, customs, language support, and payment.",
        items: [
          { question: "Can you ship overseas?", answer: "Export eligibility, customs, insurance, and shipping cost are confirmed individually. Some works cannot be shipped overseas." },
          { question: "Can I consult in English or Chinese?", answer: "Basic consultation is available in English and Chinese. Specialist details may require additional confirmation time." },
          { question: "Who handles customs and import duties?", answer: "Import duties, taxes, and customs procedures in the destination country are generally the customer's responsibility." }
        ]
      },
      {
        key: "condition",
        label: "Condition",
        title: "Condition of Works",
        lead: "Questions about wear, restoration, accessories, and authenticity review.",
        items: [
          { question: "Do antique works have old marks or restoration?", answer: "Age-related wear, kiln marks, restoration, and patina may be present. We explain what can be confirmed." },
          { question: "Can I request additional photos?", answer: "Yes. Please tell us which parts you want to confirm, such as rim, base, signature, box, or restoration areas." },
          { question: "Is authenticity guaranteed?", answer: "We explain each work based on description, references, and review scope. Any guarantee conditions are stated before purchase." }
        ]
      }
    ],
    cta: {
      title: "Tell us quietly if a question remains.",
      text: "Including the work name, photos, and whether your inquiry is about purchase or appraisal helps us answer more accurately.",
      contact: "Contact",
      purchaseGuide: "View Purchase Guide"
    }
  }
};

const categoryIcons: Record<FaqCategoryKey, React.ComponentType<{ size?: number; "aria-hidden"?: boolean; className?: string }>> = {
  purchase: Sparkles,
  appraisal: ShieldCheck,
  delivery: Truck,
  payment: CreditCard,
  overseas: Globe2,
  condition: PackageCheck
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const pageBlock = await getPageBlock("faq", "content", lang, copy[lang]);
  const page = pageBlock.content;

  return pageMetadata({ settings, lang, path: "/faq", title: page.seoTitle, description: page.seoDescription, image: collectionImages.bronze });
}

export default async function FaqPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const pageBlock = await getPageBlock("faq", "content", lang, copy[lang]);
  const page = pageBlock.content;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: page.banner.breadcrumbHome, item: `/${lang}` },
      { "@type": "ListItem", position: 2, name: page.banner.title, item: `/${lang}/faq` }
    ]
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.categories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    )
  };

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">QUESTION GUIDE</p>
          <h2 className="mt-4 break-words font-serif text-3xl font-light leading-tight md:text-5xl">
            {page.intro.title}
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-[color:var(--muted)] md:text-base">
            {page.intro.text}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={localizedPath(lang, "/contact")}
              className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
            >
              {page.intro.contact}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={localizedPath(lang, "/appraisal/form")}
              className="inline-flex min-h-12 items-center border border-[color:var(--border)] px-5 text-sm tracking-[0.14em] text-[color:var(--ink)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
            >
              {page.intro.appraisal}
            </Link>
          </div>
        </div>
        <div className="grid content-start gap-3 sm:grid-cols-2">
          {page.categories.map((category) => {
            const Icon = categoryIcons[category.key];
            return (
              <a
                key={category.key}
                href={`#${category.key}`}
                className="flex min-h-16 items-center gap-3 border border-[color:var(--border)] bg-[color:var(--paper)] px-4 text-sm text-[color:var(--ink)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
              >
                <Icon aria-hidden size={20} className="shrink-0 text-[color:var(--gold-dark)]" />
                <span className="min-w-0 break-words">{category.label}</span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="bg-[color:var(--ivory-dark)] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:px-8">
          {page.categories.map((category) => {
            const Icon = categoryIcons[category.key];
            return (
              <section
                key={category.key}
                id={category.key}
                className="grid scroll-mt-28 gap-6 border border-[color:var(--border)] bg-[color:var(--paper)] p-5 md:p-7 lg:grid-cols-[0.36fr_0.64fr]"
              >
                <div className="min-w-0">
                  <div className="flex size-12 items-center justify-center border border-[color:var(--gold)] text-[color:var(--gold-dark)]">
                    <Icon aria-hidden size={24} />
                  </div>
                  <p className="mt-6 text-xs tracking-[0.3em] text-[color:var(--gold)]">{category.label}</p>
                  <h2 className="mt-3 break-words font-serif text-3xl font-light">{category.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{category.lead}</p>
                </div>
                <div className="divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
                  {category.items.map((item, index) => (
                    <details key={item.question} className="group px-4 py-5 open:bg-[rgba(249,245,238,0.68)]">
                      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-[color:var(--ink)]">
                        <span className="min-w-0 break-words">
                          {String(index + 1).padStart(2, "0")} / {item.question}
                        </span>
                        <span className="shrink-0 text-xl text-[color:var(--gold-dark)] group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
        <div className="grid gap-8 border border-[color:var(--gold)] bg-[color:var(--wood)] p-6 text-[color:var(--ivory)] md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <CircleHelp aria-hidden size={24} className="shrink-0 text-[color:var(--gold-light)]" />
              <h2 className="break-words font-serif text-3xl font-light md:text-4xl">{page.cta.title}</h2>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/72 md:text-base">{page.cta.text}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href={localizedPath(lang, "/contact")}
              className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
            >
              {page.cta.contact}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={localizedPath(lang, "/purchase-guide")}
              className="inline-flex min-h-12 items-center border border-white/25 px-5 text-sm tracking-[0.14em] text-white"
            >
              {page.cta.purchaseGuide}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
