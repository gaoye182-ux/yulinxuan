import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarClock,
  Car,
  ChevronRight,
  Clock,
  ExternalLink,
  Footprints,
  Map,
  MapPin,
  Navigation,
  Phone,
  Train,
  TriangleAlert
} from "lucide-react";
import { collectionImages } from "@/lib/collection-data";
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

type AccessCopy = {
  seoTitle: string;
  seoDescription: string;
  banner: {
    eyebrow: string;
    title: string;
    subtitle: string;
    breadcrumbHome: string;
  };
  overview: {
    eyebrow: string;
    title: string;
    lead: string;
    addressLabel: string;
    address: string;
    phoneLabel: string;
    phone: string;
    hoursLabel: string;
    hours: string;
    closedLabel: string;
    closed: string;
  };
  transport: {
    eyebrow: string;
    title: string;
    lead: string;
    routes: { title: string; text: string; time: string }[];
  };
  parking: {
    eyebrow: string;
    title: string;
    text: string;
    items: string[];
  };
  hours: {
    eyebrow: string;
    title: string;
    rows: { label: string; value: string }[];
  };
  notes: {
    eyebrow: string;
    title: string;
    items: { title: string; text: string }[];
  };
  map: {
    eyebrow: string;
    title: string;
    text: string;
    staticLabel: string;
    google: string;
    apple: string;
    placeholder: string;
  };
  cta: {
    title: string;
    text: string;
    contact: string;
    appraisal: string;
  };
};

const copy: Record<Language, AccessCopy> = {
  ja: {
    seoTitle: "アクセス | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社へのアクセス案内です。京都市伏見区の住所、交通、駐車場、営業時間、ご来店時の注意事項、Google Maps をご確認いただけます。",
    banner: {
      eyebrow: "ACCESS",
      title: "アクセス",
      subtitle: "ご来店、鑑定品のお持ち込み、大型品のご相談は、事前予約のうえお越しください。",
      breadcrumbHome: "ホーム"
    },
    overview: {
      eyebrow: "SHOP ACCESS",
      title: "京都市伏見区の事務所で、古美術をご案内します。",
      lead: "京都市伏見区の事務所へは、事前予約のうえお越しください。鑑定品や大型品をお持ち込みの場合は、事前に内容をお知らせください。",
      addressLabel: "住所",
      address: "京都府京都市伏見区深草下川原町130番地4 華信ビル201号",
      phoneLabel: "電話",
      phone: "お問い合わせフォームをご利用ください",
      hoursLabel: "営業時間",
      hours: "11:00 - 18:00",
      closedLabel: "定休日",
      closed: "水曜日 / 年末年始"
    },
    transport: {
      eyebrow: "ROUTE",
      title: "交通方式",
      lead: "ご来店は予約制です。最寄駅からの詳しい経路は、ご予約時に個別にご案内します。",
      routes: [
        { title: "京都市営地下鉄・京阪沿線", text: "京都市伏見区深草下川原町の事務所まで、公共交通機関からの経路をご案内します。", time: "予約時に案内" },
        { title: "京都駅方面から", text: "京都駅方面からお越しの場合は、来店時間に合わせて乗換と徒歩経路をご確認ください。", time: "予約時に案内" },
        { title: "お車でお越しの場合", text: "近隣道路と駐車場状況を事前にご確認ください。大型品の搬入は必ず事前相談をお願いします。", time: "事前相談" }
      ]
    },
    parking: {
      eyebrow: "PARKING",
      title: "駐車場について",
      text: "専用駐車場は現在未設定です。お車でお越しの場合は近隣の時間貸し駐車場をご利用ください。",
      items: ["大型品の搬入・搬出は事前にご相談ください。", "雨天時や高額品のお持ち込みは、到着時間をお知らせください。", "近隣道路での長時間停車はお控えください。"]
    },
    hours: {
      eyebrow: "HOURS",
      title: "営業時間",
      rows: [
        { label: "月・火・木・金", value: "11:00 - 18:00" },
        { label: "土・日・祝", value: "予約優先 / 11:00 - 17:00" },
        { label: "水曜日", value: "定休日" },
        { label: "鑑定品のお持ち込み", value: "事前予約制" }
      ]
    },
    notes: {
      eyebrow: "VISIT NOTES",
      title: "ご来店時のお願い",
      items: [
        { title: "来店予約", text: "店頭確認、商談、鑑定品のお持ち込みは、できるだけ事前にご予約ください。" },
        { title: "鑑定品の持参", text: "箱、証書、付属品、入手経緯の資料がある場合は一緒にお持ちください。" },
        { title: "撮影について", text: "店内および作品の撮影は、作品保護と権利確認のためスタッフにお声がけください。" }
      ]
    },
    map: {
      eyebrow: "MAP",
      title: "Google Maps",
      text: "京都市伏見区の所在地をもとに Google Maps を表示します。ご来店前に必ずご予約ください。",
      staticLabel: "静的地図プレビュー",
      google: "Google Maps で開く",
      apple: "Apple Maps で開く",
      placeholder: "GYOKURINKEN / KYOTO"
    },
    cta: {
      title: "ご来店前に、作品名やご相談内容をお知らせください。",
      text: "店頭確認、鑑定品のお持ち込み、大型品の搬入は、準備のため事前連絡をおすすめします。",
      contact: "お問い合わせ",
      appraisal: "鑑定を申し込む"
    }
  },
  zh: {
    seoTitle: "交通指引 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社交通指引页面。可确认京都市伏见区地址、交通、停车信息、营业时间、来店注意事项与 Google Maps。",
    banner: {
      eyebrow: "ACCESS",
      title: "交通指引",
      subtitle: "来店、携带鉴定品或咨询大型物品时，建议提前预约后再前往。",
      breadcrumbHome: "首页"
    },
    overview: {
      eyebrow: "SHOP ACCESS",
      title: "在京都市伏见区事务所，为您介绍古美术。",
      lead: "到访京都市伏见区事务所前，请提前预约。如携带鉴定品或大型物品，请事先告知内容。",
      addressLabel: "地址",
      address: "京都府京都市伏见区深草下川原町130番地4 华信ビル201号",
      phoneLabel: "电话",
      phone: "请使用咨询表单联系",
      hoursLabel: "营业时间",
      hours: "11:00 - 18:00",
      closedLabel: "定休日",
      closed: "周三 / 年末年初"
    },
    transport: {
      eyebrow: "ROUTE",
      title: "交通方式",
      lead: "来店采取预约制。最近车站与步行路线会在预约时个别说明。",
      routes: [
        { title: "京都市营地下铁・京阪沿线", text: "我们会说明前往京都市伏见区深草下川原町事务所的公共交通路线。", time: "预约时说明" },
        { title: "从京都站方向", text: "从京都站方向来访时，请配合预约时间确认换乘与步行路线。", time: "预约时说明" },
        { title: "驾车来访", text: "请提前确认附近道路和停车场情况。大型物品搬入请务必事前咨询。", time: "事前咨询" }
      ]
    },
    parking: {
      eyebrow: "PARKING",
      title: "停车信息",
      text: "目前未设置专用停车场。如驾车来店，请使用附近的计时停车场。",
      items: ["大型物品搬入或搬出请提前咨询。", "雨天或携带高价物品来店时，请告知预计到达时间。", "请避免在附近道路长时间停车。"]
    },
    hours: {
      eyebrow: "HOURS",
      title: "营业时间",
      rows: [
        { label: "周一・周二・周四・周五", value: "11:00 - 18:00" },
        { label: "周六・周日・节假日", value: "预约优先 / 11:00 - 17:00" },
        { label: "周三", value: "定休日" },
        { label: "携带鉴定品来店", value: "需提前预约" }
      ]
    },
    notes: {
      eyebrow: "VISIT NOTES",
      title: "来店注意事项",
      items: [
        { title: "来店预约", text: "店头确认、商谈、携带鉴定品来店时，建议尽量提前预约。" },
        { title: "鉴定品资料", text: "如有箱、证书、附件或取得经过资料，请一并携带。" },
        { title: "拍摄说明", text: "店内及作品拍摄涉及作品保护与权利确认，请先咨询工作人员。" }
      ]
    },
    map: {
      eyebrow: "MAP",
      title: "Google Maps",
      text: "根据京都市伏见区所在地显示 Google Maps。来店前请务必预约。",
      staticLabel: "静态地图预览",
      google: "在 Google Maps 打开",
      apple: "在 Apple Maps 打开",
      placeholder: "GYOKURINKEN / KYOTO"
    },
    cta: {
      title: "来店前，请先告知作品名或咨询内容。",
      text: "店头确认、携带鉴定品、大型物品搬入等事项，建议提前联系以便准备。",
      contact: "联系我们",
      appraisal: "提交鉴定申请"
    }
  },
  en: {
    seoTitle: "Access | Gyokurinken Co., Ltd.",
    seoDescription:
      "Access information for Gyokurinken, including the Fushimi-ku Kyoto address, directions, parking, opening hours, visit notes, and Google Maps.",
    banner: {
      eyebrow: "ACCESS",
      title: "Access",
      subtitle: "Please make an appointment before visiting, bringing appraisal items, or consulting about large works.",
      breadcrumbHome: "Home"
    },
    overview: {
      eyebrow: "SHOP ACCESS",
      title: "Antique art consultations at our Fushimi-ku, Kyoto office.",
      lead: "Please make an appointment before visiting our Fushimi-ku, Kyoto office, especially when bringing appraisal items or large works.",
      addressLabel: "Address",
      address: "Kashin Building 201, 130-4 Fukakusa Shimogawaracho, Fushimi-ku, Kyoto-shi, Kyoto",
      phoneLabel: "Phone",
      phone: "Please use the inquiry form",
      hoursLabel: "Hours",
      hours: "11:00 - 18:00",
      closedLabel: "Closed",
      closed: "Wednesday / Year-end holidays"
    },
    transport: {
      eyebrow: "ROUTE",
      title: "Directions",
      lead: "Visits are by appointment. Detailed routes from nearby rail lines are provided when your visit is arranged.",
      routes: [
        { title: "Kyoto Subway and Keihan lines", text: "We will guide the public transit route to the Fukakusa Shimogawaracho office in Fushimi-ku, Kyoto.", time: "By appointment" },
        { title: "From Kyoto Station", text: "Please confirm transfers and walking routes according to your appointment time.", time: "By appointment" },
        { title: "By car", text: "Please check nearby roads and parking in advance. Large-item loading must be discussed before visiting.", time: "Consult first" }
      ]
    },
    parking: {
      eyebrow: "PARKING",
      title: "Parking",
      text: "A dedicated parking area is not currently listed. If visiting by car, please use nearby coin-operated parking.",
      items: ["Please contact us in advance for loading or unloading large works.", "For rainy days or high-value items, please tell us your arrival time.", "Please avoid stopping for extended periods on nearby roads."]
    },
    hours: {
      eyebrow: "HOURS",
      title: "Opening Hours",
      rows: [
        { label: "Mon, Tue, Thu, Fri", value: "11:00 - 18:00" },
        { label: "Sat, Sun, Holidays", value: "Appointment priority / 11:00 - 17:00" },
        { label: "Wednesday", value: "Closed" },
        { label: "Appraisal item visits", value: "By appointment" }
      ]
    },
    notes: {
      eyebrow: "VISIT NOTES",
      title: "Before Your Visit",
      items: [
        { title: "Appointments", text: "Please book in advance when viewing works, discussing purchase, or bringing appraisal items." },
        { title: "Appraisal Materials", text: "Please bring boxes, certificates, accessories, or background documents if available." },
        { title: "Photography", text: "Please ask staff before photographing the shop or works for conservation and rights reasons." }
      ]
    },
    map: {
      eyebrow: "MAP",
      title: "Google Maps",
      text: "Google Maps is shown from the Fushimi-ku, Kyoto office address. Please make an appointment before visiting.",
      staticLabel: "Static map preview",
      google: "Open in Google Maps",
      apple: "Open in Apple Maps",
      placeholder: "GYOKURINKEN / KYOTO"
    },
    cta: {
      title: "Please tell us the work name or purpose before visiting.",
      text: "Advance contact helps us prepare for viewing, appraisal items, and loading or unloading larger works.",
      contact: "Contact",
      appraisal: "Request Appraisal"
    }
  }
};

function OverviewItem({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean; className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 gap-4 border-b border-[color:var(--border)] py-5 last:border-b-0">
      <div className="flex size-11 shrink-0 items-center justify-center border border-[color:var(--gold)] text-[color:var(--gold-dark)]">
        <Icon aria-hidden size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs tracking-[0.18em] text-[color:var(--gold)]">{label}</p>
        <div className="mt-2 break-words text-sm leading-7 text-[color:var(--muted)]">{value}</div>
      </div>
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
  const page = copy[lang];
  const pageBlock = await getPageBlock("access", "content", lang, page);

  return pageMetadata({ settings, lang, path: "/access", title: pageBlock.content.seoTitle, description: pageBlock.content.seoDescription, image: collectionImages.imari });
}

export default async function AccessPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const pageBlock = await getPageBlock("access", "content", lang, copy[lang]);
  const page = pageBlock.content;
  const shop = {
    company: localize(settings.company.legalName, lang),
    address: localize(settings.contact.address, lang) || page.overview.address,
    phone: settings.contact.phone || page.overview.phone,
    hours: localize(settings.businessHours.weekdays, lang) || page.overview.hours,
    closed: localize(settings.businessHours.holidays, lang) || page.overview.closed,
    note: localize(settings.businessHours.note, lang)
  };
  const googleMapsUrl = mapSearchUrl(settings, lang);
  const appleMapsUrl = mapSearchUrl(settings, lang, "apple");
  const phoneHref = telHref(shop.phone);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: page.banner.breadcrumbHome, item: `/${lang}` },
      { "@type": "ListItem", position: 2, name: page.banner.title, item: `/${lang}/access` }
    ]
  };
  const businessJsonLd = localBusinessJsonLd(settings, lang, "/access");

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
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

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:py-14 lg:grid-cols-[minmax(0,0.95fr)_390px] lg:px-8">
        <div className="min-w-0 self-center">
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.overview.eyebrow}</p>
          <h2 className="mt-4 break-words font-serif text-3xl font-light leading-tight md:text-5xl">
            {page.overview.title}
          </h2>
          <p className="mt-6 max-w-3xl text-sm leading-8 text-[color:var(--muted)] md:text-base">
            {page.overview.lead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={googleMapsUrl}
              className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
            >
              {page.map.google}
              <ExternalLink aria-hidden size={16} />
            </a>
            {phoneHref ? (
              <a
                href={phoneHref}
                className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--border)] px-5 text-sm tracking-[0.14em] text-[color:var(--ink)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
              >
                {page.overview.phoneLabel}
                <Phone aria-hidden size={16} />
              </a>
            ) : null}
          </div>
        </div>

        <aside className="border border-[color:var(--border)] bg-[color:var(--paper)] p-6">
          <OverviewItem icon={MapPin} label={page.overview.addressLabel} value={<address className="not-italic">{shop.address}</address>} />
          <OverviewItem
            icon={Phone}
            label={page.overview.phoneLabel}
            value={
              phoneHref ? (
                <a href={phoneHref} className="inline-flex min-h-11 items-center break-all hover:text-[color:var(--gold-dark)]">{shop.phone}</a>
              ) : (
                <span className="inline-flex min-h-11 items-center break-all">{shop.phone}</span>
              )
            }
          />
          <OverviewItem icon={Clock} label={page.overview.hoursLabel} value={shop.hours} />
          <OverviewItem icon={CalendarClock} label={page.overview.closedLabel} value={shop.closed} />
        </aside>
      </section>

      <section className="bg-[color:var(--ivory-dark)] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.transport.eyebrow}</p>
            <h2 className="section-title mt-3 font-serif text-3xl font-light md:text-5xl">{page.transport.title}</h2>
            <p className="mt-7 text-sm leading-8 text-[color:var(--muted)] md:text-base">{page.transport.lead}</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {page.transport.routes.map((route, index) => (
              <div key={route.title} className="border border-[color:var(--border)] bg-[color:var(--paper)] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex size-12 items-center justify-center border border-[color:var(--gold)] text-[color:var(--gold-dark)]">
                    {index === 0 ? <Train aria-hidden size={24} /> : <Footprints aria-hidden size={24} />}
                  </div>
                  <p className="shrink-0 border-l border-[color:var(--gold)] pl-4 font-serif text-xl text-[color:var(--gold-dark)]">
                    {route.time}
                  </p>
                </div>
                <h2 className="mt-6 break-words font-serif text-2xl font-light">{route.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{route.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:py-16 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.map.eyebrow}</p>
          <h2 className="mt-3 break-words font-serif text-3xl font-light md:text-5xl">{page.map.title}</h2>
          <p className="mt-6 text-sm leading-8 text-[color:var(--muted)] md:text-base">{page.map.text}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={googleMapsUrl}
              className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
            >
              {page.map.google}
              <Navigation aria-hidden size={16} />
            </a>
            <a
              href={appleMapsUrl}
              className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--border)] px-5 text-sm tracking-[0.14em] text-[color:var(--ink)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
            >
              {page.map.apple}
              <Map aria-hidden size={16} />
            </a>
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory)]">
          <iframe
            title="Gyokurinken access map"
            src={mapEmbedUrl(settings, lang)}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
          />
          <div className="absolute left-5 top-5 border border-[color:var(--gold)] bg-[rgba(255,253,248,0.92)] px-4 py-3 text-xs tracking-[0.18em] text-[color:var(--gold-dark)]">
            {page.map.staticLabel}
          </div>
          <div className="absolute bottom-5 left-5 right-5 border border-[color:var(--border)] bg-[rgba(255,253,248,0.94)] p-4">
            <p className="break-words font-serif text-2xl font-light text-[color:var(--ink)]">{shop.company}</p>
            <p className="mt-2 break-words text-xs leading-5 tracking-[0.12em] text-[color:var(--muted)]">
              {shop.address}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--paper)] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 lg:px-8">
          <div className="border border-[color:var(--border)] bg-[color:var(--ivory)] p-6 md:p-8">
            <div className="flex items-center gap-3">
              <Car aria-hidden size={24} className="shrink-0 text-[color:var(--gold-dark)]" />
              <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.parking.eyebrow}</p>
            </div>
            <h2 className="mt-4 break-words font-serif text-3xl font-light">{page.parking.title}</h2>
            <p className="mt-5 text-sm leading-8 text-[color:var(--muted)]">{page.parking.text}</p>
            <ul className="mt-6 grid gap-3 text-sm leading-7 text-[color:var(--muted)]">
              {page.parking.items.map((item) => (
                <li key={item} className="border-l border-[color:var(--gold)] bg-[color:var(--paper)] px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-[color:var(--border)] bg-[color:var(--ivory)] p-6 md:p-8">
            <div className="flex items-center gap-3">
              <Clock aria-hidden size={24} className="shrink-0 text-[color:var(--gold-dark)]" />
              <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.hours.eyebrow}</p>
            </div>
            <h2 className="mt-4 break-words font-serif text-3xl font-light">{page.hours.title}</h2>
            <div className="mt-6 divide-y divide-[color:var(--border)] border-y border-[color:var(--border)] bg-[color:var(--paper)]">
              {page.hours.rows.map((row) => (
                <div key={row.label} className="grid gap-2 px-4 py-4 text-sm leading-7 sm:grid-cols-[0.45fr_0.55fr]">
                  <p className="text-[color:var(--ink)]">{row.label}</p>
                  <p className="break-words text-[color:var(--muted)] sm:text-right">{row.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.notes.eyebrow}</p>
          <h2 className="section-title mt-3 font-serif text-3xl font-light md:text-5xl">{page.notes.title}</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {page.notes.items.map((item) => (
            <div key={item.title} className="border border-[color:var(--border)] bg-[color:var(--paper)] p-6">
              <div className="flex size-12 items-center justify-center bg-[color:var(--wood)] text-[color:var(--gold-light)]">
                <TriangleAlert aria-hidden size={22} />
              </div>
              <h2 className="mt-6 break-words font-serif text-2xl font-light">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12 md:pb-16 lg:px-8">
        <div className="grid gap-8 border border-[color:var(--gold)] bg-[color:var(--wood)] p-6 text-[color:var(--ivory)] md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div className="min-w-0">
            <h2 className="break-words font-serif text-3xl font-light md:text-4xl">{page.cta.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/72 md:text-base">{page.cta.text}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href={localizedPath(lang, "/contact")}
              className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
            >
              {page.cta.contact}
              <ArrowRight aria-hidden size={16} />
            </Link>
            <Link
              href={localizedPath(lang, "/appraisal/form")}
              className="inline-flex min-h-12 items-center border border-white/25 px-5 text-sm tracking-[0.14em] text-white"
            >
              {page.cta.appraisal}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
