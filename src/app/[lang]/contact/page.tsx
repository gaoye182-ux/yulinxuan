import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { ContactForm, type ContactFormCopy } from "@/components/contact-form";
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

type ContactPageCopy = ContactFormCopy & {
  seoTitle: string;
  seoDescription: string;
  banner: {
    eyebrow: string;
    title: string;
    subtitle: string;
    breadcrumbHome: string;
  };
  info: {
    eyebrow: string;
    title: string;
    lead: string;
    addressLabel: string;
    address: string;
    phoneLabel: string;
    phone: string;
    emailLabel: string;
    email: string;
    hoursLabel: string;
    hours: string;
    accessLabel: string;
    access: string;
  };
  map: {
    eyebrow: string;
    title: string;
    text: string;
    action: string;
  };
};

const copy: Record<Language, ContactPageCopy> = {
  ja: {
    seoTitle: "お問い合わせ | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社へのお問い合わせページです。古美術品の購入、鑑定、買取、来店予約、海外配送などをご相談ください。",
    banner: {
      eyebrow: "CONTACT",
      title: "お問い合わせ",
      subtitle: "古美術品のご購入、鑑定、買取、来店予約について、わかる範囲で静かにお聞かせください。",
      breadcrumbHome: "ホーム"
    },
    form: {
      eyebrow: "INQUIRY FORM",
      title: "お問い合わせ内容",
      lead: "必須項目をご入力ください。内容は管理画面に保存され、担当者が確認します。",
      required: "必須",
      name: "お名前",
      namePlaceholder: "例：山田 太郎",
      email: "メールアドレス",
      emailPlaceholder: "example@gyokurinken.co.jp",
      phone: "電話番号",
      phonePlaceholder: "例：075-000-0000",
      category: "お問い合わせ分類",
      message: "内容",
      messagePlaceholder: "品名、来店希望日時、ご相談内容などをご記入ください。",
      privacy: "プライバシーポリシーに同意します。",
      privacyLink: "内容を確認",
      submit: "お問い合わせ",
      successTitle: "お問い合わせを受け付けました",
      successText: "内容を確認のうえ、必要に応じて担当者よりご連絡します。",
      errors: {
        name: "お名前を入力してください。",
        email: "メールアドレスを入力してください。",
        emailFormat: "メールアドレスの形式を確認してください。",
        message: "お問い合わせ内容を入力してください。",
        privacy: "プライバシーポリシーへの同意が必要です。"
      }
    },
    options: {
      categories: ["購入相談", "鑑定・買取", "来店予約", "海外配送", "取材・法人相談", "その他"]
    },
    info: {
      eyebrow: "SHOP INFORMATION",
      title: "店舗情報",
      lead: "掲載品の状態確認やご来店は、事前にお問い合わせいただくとスムーズです。",
      addressLabel: "住所",
      address: "京都府京都市伏見区深草下川原町130番地4 華信ビル201号",
      phoneLabel: "電話",
      phone: "お問い合わせフォームをご利用ください",
      emailLabel: "メール",
      email: "お問い合わせフォームをご利用ください",
      hoursLabel: "営業時間",
      hours: "11:00 - 18:00 / 水曜定休",
      accessLabel: "アクセス",
      access: "京都市伏見区の事務所です。大型品や鑑定品をお持ち込みの場合は事前にご連絡ください。"
    },
    map: {
      eyebrow: "MAP",
      title: "Google Maps",
      text: "所在地をもとに Google Maps を表示します。ご来店前に必ずご予約ください。",
      action: "Google Maps で開く"
    }
  },
  zh: {
    seoTitle: "联系我们 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社联系页面。可咨询古美术品购买、鉴定、收购、预约来店、海外配送等事项。",
    banner: {
      eyebrow: "CONTACT",
      title: "联系我们",
      subtitle: "关于古美术品购买、鉴定、收购与预约来店，请在已知范围内告诉我们。",
      breadcrumbHome: "首页"
    },
    form: {
      eyebrow: "INQUIRY FORM",
      title: "咨询内容",
      lead: "请填写必填项目。内容会保存到管理后台，由负责人确认。",
      required: "必填",
      name: "姓名",
      namePlaceholder: "例：王 小林",
      email: "邮箱",
      emailPlaceholder: "example@gyokurinken.co.jp",
      phone: "电话",
      phonePlaceholder: "例：+81-75-000-0000",
      category: "问题分类",
      message: "内容",
      messagePlaceholder: "请填写藏品名称、希望来店时间、咨询内容等。",
      privacy: "我同意隐私政策。",
      privacyLink: "查看内容",
      submit: "联系我们",
      successTitle: "咨询已提交",
      successText: "我们会确认内容，如有需要将由负责人联系您。",
      errors: {
        name: "请输入姓名。",
        email: "请输入邮箱。",
        emailFormat: "请确认邮箱格式。",
        message: "请输入咨询内容。",
        privacy: "必须同意隐私政策。"
      }
    },
    options: {
      categories: ["购买咨询", "鉴定・收购", "预约来店", "海外配送", "采访・法人咨询", "其他"]
    },
    info: {
      eyebrow: "SHOP INFORMATION",
      title: "店铺信息",
      lead: "如需确认藏品状态或来店查看，建议事前联系我们，以便妥善安排。",
      addressLabel: "地址",
      address: "京都府京都市伏见区深草下川原町130番地4 华信ビル201号",
      phoneLabel: "电话",
      phone: "请使用咨询表单联系",
      emailLabel: "邮箱",
      email: "请使用咨询表单联系",
      hoursLabel: "营业时间",
      hours: "11:00 - 18:00 / 周三定休",
      accessLabel: "访问说明",
      access: "事务所位于京都市伏见区。如携带大型物品或鉴定品来店，请提前联系。"
    },
    map: {
      eyebrow: "MAP",
      title: "Google Maps",
      text: "根据所在地显示 Google Maps。来店前请务必预约。",
      action: "在 Google Maps 打开"
    }
  },
  en: {
    seoTitle: "Contact | Gyokurinken Co., Ltd.",
    seoDescription:
      "Contact Gyokurinken for antique and fine art purchase inquiries, appraisal, purchase consultation, store visits, and overseas shipping.",
    banner: {
      eyebrow: "CONTACT",
      title: "Contact",
      subtitle: "Please tell us what you know about your purchase, appraisal, visit, or overseas shipping inquiry.",
      breadcrumbHome: "Home"
    },
    form: {
      eyebrow: "INQUIRY FORM",
      title: "Send an Inquiry",
      lead: "Please complete the required fields. Your inquiry will be saved for staff review.",
      required: "Required",
      name: "Name",
      namePlaceholder: "Jane Smith",
      email: "Email",
      emailPlaceholder: "example@gyokurinken.co.jp",
      phone: "Phone",
      phonePlaceholder: "+81-75-000-0000",
      category: "Inquiry Category",
      message: "Message",
      messagePlaceholder: "Please include the work name, preferred visit time, or details of your inquiry.",
      privacy: "I agree to the privacy policy.",
      privacyLink: "Review policy",
      submit: "Send Inquiry",
      successTitle: "Inquiry Received",
      successText: "We will review your message and contact you if follow-up is needed.",
      errors: {
        name: "Please enter your name.",
        email: "Please enter your email address.",
        emailFormat: "Please check the email format.",
        message: "Please enter your message.",
        privacy: "Agreement to the privacy policy is required."
      }
    },
    options: {
      categories: ["Purchase Inquiry", "Appraisal & Purchase", "Store Visit", "Overseas Shipping", "Press & Business", "Other"]
    },
    info: {
      eyebrow: "SHOP INFORMATION",
      title: "Shop Information",
      lead: "For condition checks or in-store viewing, contacting us in advance helps us prepare properly.",
      addressLabel: "Address",
      address: "Kashin Building 201, 130-4 Fukakusa Shimogawaracho, Fushimi-ku, Kyoto-shi, Kyoto",
      phoneLabel: "Phone",
      phone: "Please use the inquiry form",
      emailLabel: "Email",
      email: "Please use the inquiry form",
      hoursLabel: "Hours",
      hours: "11:00 - 18:00 / Closed Wednesday",
      accessLabel: "Access",
      access: "Located in Fushimi-ku, Kyoto. Please contact us before bringing large works or appraisal items."
    },
    map: {
      eyebrow: "MAP",
      title: "Google Maps",
      text: "Google Maps is shown from the office address. Please make an appointment before visiting.",
      action: "Open in Google Maps"
    }
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
  const page = copy[lang];
  const bannerBlock = await getPageBlock("contact", "banner", lang, page.banner);

  return pageMetadata({ settings, lang, path: "/contact", title: page.seoTitle, description: bannerBlock.content.subtitle || page.seoDescription, image: collectionImages.imari });
}

function InfoItem({
  icon: Icon,
  label,
  children
}: {
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean; className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 gap-4 border-b border-[color:var(--border)] py-5 last:border-b-0">
      <div className="flex size-11 shrink-0 items-center justify-center border border-[color:var(--gold)] text-[color:var(--gold-dark)]">
        <Icon aria-hidden size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs tracking-[0.18em] text-[color:var(--gold)]">{label}</p>
        <div className="mt-2 break-words text-sm leading-7 text-[color:var(--muted)]">{children}</div>
      </div>
    </div>
  );
}

export default async function ContactPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const fallbackPage = copy[lang];
  const [bannerBlock, infoBlock, mapBlock] = await Promise.all([
    getPageBlock("contact", "banner", lang, fallbackPage.banner),
    getPageBlock("contact", "info", lang, fallbackPage.info),
    getPageBlock("contact", "map", lang, fallbackPage.map)
  ]);
  const page = {
    ...fallbackPage,
    banner: bannerBlock.content,
    info: infoBlock.content,
    map: mapBlock.content
  };
  const shop = {
    company: localize(settings.company.legalName, lang),
    address: localize(settings.contact.address, lang) || page.info.address,
    phone: settings.contact.phone || page.info.phone,
    email: settings.contact.email || page.info.email,
    hours: `${localize(settings.businessHours.weekdays, lang)} / ${localize(settings.businessHours.holidays, lang)}`.trim(),
    note: localize(settings.businessHours.note, lang)
  };
  const mapsHref = mapSearchUrl(settings, lang);
  const phoneHref = telHref(shop.phone);
  const emailHref = settings.contact.email ? `mailto:${settings.contact.email}` : undefined;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: page.banner.breadcrumbHome, item: `/${lang}` },
      { "@type": "ListItem", position: 2, name: page.banner.title, item: `/${lang}/contact` }
    ]
  };
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: page.banner.title,
    url: `/${lang}/contact`,
    mainEntity: localBusinessJsonLd(settings, lang, "/contact")
  };

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
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

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <ContactForm copy={page} lang={lang} />

        <aside className="grid gap-5 self-start lg:sticky lg:top-28">
          <div className="border border-[color:var(--border)] bg-[color:var(--paper)] p-6">
            <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.info.eyebrow}</p>
            <h2 className="mt-3 break-words font-serif text-3xl font-light">{page.info.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{page.info.lead}</p>

            <div className="mt-4">
              <InfoItem icon={MapPin} label={page.info.addressLabel}>
                <address className="not-italic">{shop.address}</address>
              </InfoItem>
              <InfoItem icon={Phone} label={page.info.phoneLabel}>
                {phoneHref ? (
                  <a href={phoneHref} className="inline-flex min-h-11 items-center break-all hover:text-[color:var(--gold-dark)]">
                    {shop.phone}
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 items-center break-all">{shop.phone}</span>
                )}
              </InfoItem>
              <InfoItem icon={Mail} label={page.info.emailLabel}>
                {emailHref ? (
                  <a href={emailHref} className="inline-flex min-h-11 items-center break-all hover:text-[color:var(--gold-dark)]">
                    {shop.email}
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 items-center break-all">{shop.email}</span>
                )}
              </InfoItem>
              <InfoItem icon={Clock} label={page.info.hoursLabel}>
                {shop.hours || page.info.hours}
              </InfoItem>
              <InfoItem icon={Navigation} label={page.info.accessLabel}>
                {shop.note || page.info.access}
              </InfoItem>
            </div>
          </div>
        </aside>
      </section>

      <section className="bg-[color:var(--ivory-dark)] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid min-h-[320px] overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)] md:grid-cols-[0.42fr_0.58fr]">
            <div className="flex min-w-0 flex-col justify-center p-6 md:p-10">
              <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.map.eyebrow}</p>
              <h2 className="mt-3 break-words font-serif text-3xl font-light md:text-4xl">{page.map.title}</h2>
              <p className="mt-5 text-sm leading-8 text-[color:var(--muted)]">{page.map.text}</p>
              <a
                href={mapsHref}
                className="mt-7 inline-flex min-h-12 w-fit items-center gap-3 border border-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-[color:var(--gold-dark)] transition hover:bg-[color:var(--gold)] hover:text-white"
              >
                {page.map.action}
                <Navigation aria-hidden size={16} />
              </a>
            </div>
            <div className="relative min-h-[280px] overflow-hidden border-t border-[color:var(--border)] bg-[color:var(--ivory)] md:border-l md:border-t-0">
              <iframe
                title="Gyokurinken contact map"
                src={mapEmbedUrl(settings, lang)}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
              />
              <div className="pointer-events-none absolute bottom-5 left-5 right-5 border border-[color:var(--border)] bg-[rgba(255,253,248,0.92)] p-4">
                <p className="font-serif text-2xl font-light text-[color:var(--ink)]">{shop.company}</p>
                <p className="mt-2 break-words text-xs leading-5 tracking-[0.12em] text-[color:var(--muted)]">
                  {shop.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
