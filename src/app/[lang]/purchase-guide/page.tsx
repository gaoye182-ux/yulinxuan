import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Banknote,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Globe2,
  Landmark,
  PackageCheck,
  ShieldCheck,
  Store,
  Truck
} from "lucide-react";
import { collectionImages } from "@/lib/collection-data";
import { getCachedSiteSettings, pageMetadata } from "@/lib/frontend-site";
import { getLanguage, type Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";
import { getPageBlock } from "@/lib/page-blocks";

type PurchaseGuideCopy = {
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
    badge: string;
  };
  flow: {
    eyebrow: string;
    title: string;
    steps: { title: string; text: string }[];
  };
  payment: {
    eyebrow: string;
    title: string;
    lead: string;
    methods: { title: string; text: string; icon: "bank" | "card" | "cash" | "store" }[];
  };
  delivery: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { title: string; text: string; icon: "truck" | "globe" | "package" | "shield" }[];
  };
  policy: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { question: string; answer: string }[];
  };
  faq: {
    title: string;
    text: string;
    action: string;
    contact: string;
  };
};

const copy: Record<Language, PurchaseGuideCopy> = {
  ja: {
    seoTitle: "ご購入方法 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社の古美術品ご購入方法。お問い合わせから状態確認、決済、配送または店頭受け取り、返品・キャンセルポリシーまでご案内します。",
    banner: {
      eyebrow: "PURCHASE GUIDE",
      title: "ご購入方法",
      subtitle: "一点ものの古美術品を安心してお選びいただくため、状態確認からお渡しまで丁寧にご案内します。",
      breadcrumbHome: "ホーム"
    },
    intro: {
      title: "古美術品の特性を踏まえ、購入前の確認を大切にしています。",
      text: "掲載品は時代を経た一点ものです。写真だけでは伝わりにくい景色、肌、修復、付属品の有無などを、ご購入前にできる限り明確にお伝えします。",
      badge: "国内配送 / 店頭受取 / 海外配送相談"
    },
    flow: {
      eyebrow: "FLOW",
      title: "ご購入の流れ",
      steps: [
        { title: "お問い合わせ", text: "商品ページまたはお電話より、品名やご希望内容をお知らせください。" },
        { title: "状態確認", text: "追加写真、寸法、付属品、傷や修復の有無を確認し、必要に応じて詳細をご案内します。" },
        { title: "お支払い", text: "銀行振込、クレジットカード、店頭現金など、ご相談のうえ決済方法を確定します。" },
        { title: "配送・店頭受取", text: "梱包、保険、配送日を調整し、店頭受取の場合は来店日時を確認します。" }
      ]
    },
    payment: {
      eyebrow: "PAYMENT",
      title: "お支払い方法",
      lead: "作品の金額、受け取り方法、国内外のご住所に応じて、適切な決済方法をご案内します。",
      methods: [
        { title: "銀行振込", text: "ご請求内容を確認後、指定口座へお振込みください。入金確認後に発送準備へ進みます。", icon: "bank" },
        { title: "クレジットカード", text: "店頭または対応可能な決済方法をご案内します。高額品は事前確認をお願いする場合があります。", icon: "card" },
        { title: "現金", text: "店頭受け取り時のお支払いに対応します。事前に来店日時をご相談ください。", icon: "cash" },
        { title: "その他", text: "法人購入、海外送金、分割配送などは個別にご相談ください。", icon: "store" }
      ]
    },
    delivery: {
      eyebrow: "DELIVERY",
      title: "配送・お渡し",
      lead: "器物の素材、サイズ、壊れやすさに合わせて梱包方法を選び、必要に応じて保険や専門配送を検討します。",
      items: [
        { title: "国内配送", text: "陶磁器、小品、書画などは状態に合わせて梱包し、追跡可能な方法でお送りします。", icon: "truck" },
        { title: "海外配送", text: "輸出可否、通関、保険、送料を確認したうえで個別にご案内します。", icon: "globe" },
        { title: "梱包", text: "箱、裂、額装など付属品を含め、作品を保護する梱包を行います。", icon: "package" },
        { title: "保険・大型品", text: "大型家具や高額品は専門配送、保険、搬入経路を事前に確認します。", icon: "shield" }
      ]
    },
    policy: {
      eyebrow: "POLICY",
      title: "返品・キャンセルについて",
      lead: "古美術品は一点もののため、状態確認と合意内容を重視しています。購入前に必ずご確認ください。",
      items: [
        { question: "購入後の返品はできますか。", answer: "お客様都合による返品は原則としてお受けしておりません。商品説明と異なる重大な瑕疵がある場合は速やかにご連絡ください。" },
        { question: "キャンセルはいつまで可能ですか。", answer: "発送前またはお渡し前で、決済・梱包状況により個別に確認します。発送後のキャンセルは原則お受けできません。" },
        { question: "古い傷や修復は返品理由になりますか。", answer: "事前に説明済みの時代傷、擦れ、修復、経年変化は返品対象外です。気になる点は購入前にお問い合わせください。" },
        { question: "配送中の破損はどうなりますか。", answer: "到着時の状態を写真で保管し、梱包材を捨てずに速やかにご連絡ください。配送会社、保険条件に沿って確認します。" }
      ]
    },
    faq: {
      title: "購入前の小さな不安もご相談ください。",
      text: "追加写真、状態説明、海外配送、支払い方法など、よくある質問をまとめています。",
      action: "FAQを見る",
      contact: "お問い合わせ"
    }
  },
  zh: {
    seoTitle: "购买方法 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社古美术品购买指南。说明咨询、状态确认、支付、配送或店头取货、退货与取消政策。",
    banner: {
      eyebrow: "PURCHASE GUIDE",
      title: "购买方法",
      subtitle: "为了让您安心选择独一件古美术品，我们会从状态确认到交付进行细致说明。",
      breadcrumbHome: "首页"
    },
    intro: {
      title: "购买前，我们重视对古美术品状态与特性的确认。",
      text: "刊载品多为经历岁月的一点物。照片难以完整呈现的釉色、肌理、修复、附件等信息，我们会在购买前尽可能清楚说明。",
      badge: "日本国内配送 / 店头取货 / 海外配送咨询"
    },
    flow: {
      eyebrow: "FLOW",
      title: "购买流程",
      steps: [
        { title: "咨询联系", text: "请通过商品页面或电话告知品名与希望确认的内容。" },
        { title: "确认状态", text: "可确认追加照片、尺寸、附件、伤痕或修复情况，并根据需要补充说明。" },
        { title: "支付", text: "根据情况确认银行转账、信用卡、店头现金等支付方式。" },
        { title: "配送或取货", text: "安排包装、保险、配送日期；店头取货时确认来店时间。" }
      ]
    },
    payment: {
      eyebrow: "PAYMENT",
      title: "支付方式",
      lead: "根据作品金额、取货方式、收货地址与所在国家地区，我们会说明合适的付款方式。",
      methods: [
        { title: "银行转账", text: "确认请款内容后汇款至指定账户。入账确认后进入发货准备。", icon: "bank" },
        { title: "信用卡", text: "可根据店头或可对应的支付方式说明。高金额作品可能需要事前确认。", icon: "card" },
        { title: "现金", text: "店头取货时可现金支付。请提前预约来店时间。", icon: "cash" },
        { title: "其他方式", text: "法人购买、海外汇款、分批配送等可个别咨询。", icon: "store" }
      ]
    },
    delivery: {
      eyebrow: "DELIVERY",
      title: "配送・交付",
      lead: "我们会根据器物材质、尺寸与脆弱程度选择包装方式，并视情况确认保险或专业配送。",
      items: [
        { title: "日本国内配送", text: "陶瓷、小件、书画等会按状态包装，并采用可追踪方式配送。", icon: "truck" },
        { title: "海外配送", text: "会先确认出口可否、通关、保险与运费，再个别说明。", icon: "globe" },
        { title: "包装", text: "含箱、裂、框装等附件在内，尽量以保护作品为前提包装。", icon: "package" },
        { title: "保险・大型品", text: "大型家具或高价品会提前确认专业配送、保险与搬入路线。", icon: "shield" }
      ]
    },
    policy: {
      eyebrow: "POLICY",
      title: "退货・取消政策",
      lead: "古美术品为独一件商品，因此购买前的状态确认与双方确认内容非常重要。",
      items: [
        { question: "购买后可以退货吗？", answer: "因客户个人原因的退货原则上无法受理。若与商品说明存在重大差异，请尽快联系我们。" },
        { question: "什么时候可以取消？", answer: "发货或交付前，会根据支付与包装进度个别确认。发货后原则上无法取消。" },
        { question: "旧伤或修复可以作为退货理由吗？", answer: "购买前已说明的时代伤、擦痕、修复与经年变化不属于退货对象。介意之处请务必在购买前确认。" },
        { question: "配送途中破损怎么办？", answer: "请保留到货状态照片与包装材料，并尽快联系我们。将依据配送公司与保险条件确认。" }
      ]
    },
    faq: {
      title: "购买前的小疑问，也欢迎先咨询。",
      text: "追加照片、状态说明、海外配送和支付方式等常见问题已整理在 FAQ 中。",
      action: "查看 FAQ",
      contact: "联系我们"
    }
  },
  en: {
    seoTitle: "Purchase Guide | Gyokurinken Co., Ltd.",
    seoDescription:
      "Gyokurinken purchase guide for antiques and fine art, including inquiry, condition confirmation, payment, delivery or in-store pickup, returns, and cancellation policy.",
    banner: {
      eyebrow: "PURCHASE GUIDE",
      title: "Purchase Guide",
      subtitle: "A clear guide from condition confirmation to payment, delivery, and pickup for one-of-a-kind antique works.",
      breadcrumbHome: "Home"
    },
    intro: {
      title: "We value careful confirmation before a purchase is made.",
      text: "Most listed works are unique antique pieces. Before purchase, we explain condition, surface, restoration, accessories, and details that may not be fully visible in photos.",
      badge: "Domestic delivery / In-store pickup / Overseas shipping consultation"
    },
    flow: {
      eyebrow: "FLOW",
      title: "Purchase Flow",
      steps: [
        { title: "Inquiry", text: "Contact us from the item page or by phone with the work name and your questions." },
        { title: "Condition Review", text: "We confirm additional photos, dimensions, accessories, damage, and restoration details when needed." },
        { title: "Payment", text: "We agree on bank transfer, credit card, cash in store, or another suitable payment method." },
        { title: "Delivery or Pickup", text: "We arrange packing, insurance, delivery timing, or an in-store pickup appointment." }
      ]
    },
    payment: {
      eyebrow: "PAYMENT",
      title: "Payment Methods",
      lead: "We propose an appropriate payment method based on the work, price, pickup method, and destination.",
      methods: [
        { title: "Bank Transfer", text: "After invoice confirmation, please transfer to the designated account. Shipping preparation begins after receipt.", icon: "bank" },
        { title: "Credit Card", text: "Available methods will be explained in store or individually. High-value works may require advance confirmation.", icon: "card" },
        { title: "Cash", text: "Cash payment is available for in-store pickup. Please arrange your visit in advance.", icon: "cash" },
        { title: "Other Methods", text: "Corporate purchase, overseas transfer, and split delivery can be discussed case by case.", icon: "store" }
      ]
    },
    delivery: {
      eyebrow: "DELIVERY",
      title: "Delivery and Handover",
      lead: "Packing is chosen according to material, size, and fragility, with insurance or specialist delivery considered where appropriate.",
      items: [
        { title: "Domestic Delivery", text: "Ceramics, small objects, and works on paper are packed carefully and shipped with tracking.", icon: "truck" },
        { title: "Overseas Shipping", text: "Export eligibility, customs, insurance, and shipping cost are confirmed individually.", icon: "globe" },
        { title: "Packing", text: "Boxes, textiles, frames, and accessories are handled with protection of the work in mind.", icon: "package" },
        { title: "Insurance and Large Works", text: "Large furniture and high-value works may require specialist delivery, insurance, and route checks.", icon: "shield" }
      ]
    },
    policy: {
      eyebrow: "POLICY",
      title: "Returns and Cancellations",
      lead: "Because antique works are unique, condition confirmation and agreed details before purchase are especially important.",
      items: [
        { question: "Can I return a purchased item?", answer: "Returns for customer convenience are generally not accepted. Please contact us promptly if there is a serious discrepancy from the item description." },
        { question: "When can I cancel?", answer: "Before shipping or handover, cancellation is reviewed case by case according to payment and packing status. After shipping, cancellation is generally not accepted." },
        { question: "Are old marks or restoration grounds for return?", answer: "Age-related wear, scratches, restoration, and patina explained before purchase are not grounds for return. Please ask before purchase if concerned." },
        { question: "What if damage occurs during delivery?", answer: "Please photograph the arrival condition, keep all packing materials, and contact us promptly. We review according to carrier and insurance terms." }
      ]
    },
    faq: {
      title: "Small questions before purchase are welcome.",
      text: "Additional photos, condition details, overseas shipping, and payment questions are collected in the FAQ.",
      action: "View FAQ",
      contact: "Contact"
    }
  }
};

function PaymentIcon({ icon }: { icon: PurchaseGuideCopy["payment"]["methods"][number]["icon"] }) {
  const Icon = icon === "bank" ? Landmark : icon === "card" ? CreditCard : icon === "cash" ? Banknote : Store;
  return <Icon aria-hidden size={24} />;
}

function DeliveryIcon({ icon }: { icon: PurchaseGuideCopy["delivery"]["items"][number]["icon"] }) {
  const Icon = icon === "truck" ? Truck : icon === "globe" ? Globe2 : icon === "package" ? PackageCheck : ShieldCheck;
  return <Icon aria-hidden size={24} />;
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
  const pageBlock = await getPageBlock("purchase-guide", "content", lang, copy[lang]);
  const page = pageBlock.content;

  return pageMetadata({ settings, lang, path: "/purchase-guide", title: page.seoTitle, description: page.seoDescription, image: collectionImages.imari });
}

export default async function PurchaseGuidePage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const pageBlock = await getPageBlock("purchase-guide", "content", lang, copy[lang]);
  const page = pageBlock.content;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: page.banner.breadcrumbHome, item: `/${lang}` },
      { "@type": "ListItem", position: 2, name: page.banner.title, item: `/${lang}/purchase-guide` }
    ]
  };

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="min-w-0 self-center">
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">GUIDANCE</p>
          <h2 className="mt-4 break-words font-serif text-3xl font-light leading-tight md:text-5xl">
            {page.intro.title}
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-[color:var(--muted)] md:text-base">
            {page.intro.text}
          </p>
          <p className="mt-7 w-fit border-l border-[color:var(--gold)] bg-[rgba(255,253,248,0.74)] px-4 py-3 text-xs tracking-[0.14em] text-[color:var(--gold-dark)]">
            {page.intro.badge}
          </p>
        </div>
        <div className="relative min-h-[300px] overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory-dark)] md:min-h-[430px]">
          <Image
            src={collectionImages.imari}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(44,36,22,0.62)] via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 border border-white/30 bg-[rgba(255,253,248,0.9)] px-5 py-4">
            <p className="font-serif text-3xl font-light text-[color:var(--gold-dark)]">Purchase</p>
            <p className="mt-2 text-xs leading-5 tracking-[0.16em] text-[color:var(--muted)]">GYOKURINKEN CO., LTD.</p>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--ivory-dark)] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle eyebrow={page.flow.eyebrow} title={page.flow.title} />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {page.flow.steps.map((step, index) => (
              <div key={step.title} className="border border-[color:var(--border)] bg-[color:var(--paper)] p-6">
                <p className="font-serif text-5xl leading-none text-[color:var(--gold)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-6 break-words font-serif text-2xl font-light">{step.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
        <SectionTitle eyebrow={page.payment.eyebrow} title={page.payment.title} lead={page.payment.lead} />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {page.payment.methods.map((method) => (
            <div key={method.title} className="flex min-w-0 gap-5 border border-[color:var(--border)] bg-[color:var(--paper)] p-6">
              <div className="flex size-12 shrink-0 items-center justify-center border border-[color:var(--gold)] text-[color:var(--gold-dark)]">
                <PaymentIcon icon={method.icon} />
              </div>
              <div className="min-w-0">
                <h2 className="break-words font-serif text-2xl font-light">{method.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{method.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[color:var(--paper)] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle eyebrow={page.delivery.eyebrow} title={page.delivery.title} lead={page.delivery.lead} />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {page.delivery.items.map((item) => (
              <div key={item.title} className="border border-[color:var(--border)] bg-[color:var(--ivory)] p-6">
                <div className="flex size-12 items-center justify-center bg-[color:var(--wood)] text-[color:var(--gold-light)]">
                  <DeliveryIcon icon={item.icon} />
                </div>
                <h2 className="mt-6 break-words font-serif text-2xl font-light">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:py-16 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.policy.eyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl font-light md:text-5xl">{page.policy.title}</h2>
          <p className="mt-6 text-sm leading-8 text-[color:var(--muted)] md:text-base">{page.policy.lead}</p>
        </div>
        <div className="divide-y divide-[color:var(--border)] border-y border-[color:var(--border)] bg-[color:var(--paper)]">
          {page.policy.items.map((item, index) => (
            <details key={item.question} className="group px-5 py-5 open:bg-[rgba(249,245,238,0.62)]">
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

      <section className="mx-auto max-w-7xl px-5 pb-12 md:pb-16 lg:px-8">
        <div className="grid gap-8 border border-[color:var(--gold)] bg-[color:var(--wood)] p-6 text-[color:var(--ivory)] md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <CircleHelp aria-hidden size={24} className="shrink-0 text-[color:var(--gold-light)]" />
              <h2 className="break-words font-serif text-3xl font-light md:text-4xl">{page.faq.title}</h2>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/72 md:text-base">{page.faq.text}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href={localizedPath(lang, "/faq")}
              className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
            >
              {page.faq.action}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={localizedPath(lang, "/contact")}
              className="inline-flex min-h-12 items-center border border-white/25 px-5 text-sm tracking-[0.14em] text-white"
            >
              {page.faq.contact}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
