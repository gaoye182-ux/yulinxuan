import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Cookie, FileText, LockKeyhole, Mail, ShieldCheck, UserCheck } from "lucide-react";
import { collectionImages } from "@/lib/collection-data";
import { getLanguage, type Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";

type PolicySection = {
  title: string;
  body: string;
  items?: string[];
};

type PrivacyCopy = {
  seoTitle: string;
  seoDescription: string;
  banner: {
    eyebrow: string;
    title: string;
    subtitle: string;
    breadcrumbHome: string;
  };
  intro: {
    eyebrow: string;
    title: string;
    text: string;
    updatedLabel: string;
    updatedDate: string;
  };
  summary: {
    title: string;
    cards: { title: string; text: string; icon: "form" | "cookie" | "lock" | "contact" }[];
  };
  sections: PolicySection[];
  contact: {
    eyebrow: string;
    title: string;
    text: string;
    company: string;
    address: string;
    email: string;
    phone: string;
    action: string;
  };
};

const copy: Record<Language, PrivacyCopy> = {
  ja: {
    seoTitle: "プライバシーポリシー | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社のプライバシーポリシーです。お問い合わせ、鑑定申込、購入相談等で取得する個人情報の利用目的、管理、第三者提供、Cookie等についてご案内します。",
    banner: {
      eyebrow: "PRIVACY POLICY",
      title: "プライバシーポリシー",
      subtitle: "お問い合わせ、鑑定申込、ご購入相談における個人情報の取り扱いについてご案内します。",
      breadcrumbHome: "ホーム"
    },
    intro: {
      eyebrow: "POLICY",
      title: "大切な情報を、必要な範囲で丁寧にお預かりします。",
      text: "玉林軒株式会社は、骨董品・古美術品の鑑定、買取、販売、来店予約、各種お問い合わせに際して取得する個人情報を、法令および本ポリシーに従い適切に取り扱います。",
      updatedLabel: "最終更新",
      updatedDate: "2026年5月27日"
    },
    summary: {
      title: "主な取り扱い",
      cards: [
        { title: "フォーム情報", text: "氏名、メール、電話番号、相談内容、鑑定申込内容を確認と返信のために利用します。", icon: "form" },
        { title: "Cookie・解析", text: "閲覧状況の把握、利便性向上、サイト改善のために利用する場合があります。", icon: "cookie" },
        { title: "安全管理", text: "不正アクセス、紛失、改ざん、漏えいを防ぐため、必要な管理措置を講じます。", icon: "lock" },
        { title: "開示・訂正", text: "ご本人からの開示、訂正、利用停止等のご依頼には、確認のうえ対応します。", icon: "contact" }
      ]
    },
    sections: [
      {
        title: "1. 個人情報の取得",
        body: "当社は、お問い合わせ、鑑定申込、購入相談、来店予約、メールまたは電話でのご連絡に際し、必要な範囲で個人情報を取得します。",
        items: ["氏名、メールアドレス、電話番号", "住所、所在地区、希望来店日時", "お問い合わせ内容、鑑定品の説明、写真、関連資料", "取引、配送、支払い、本人確認に必要な情報"]
      },
      {
        title: "2. 利用目的",
        body: "取得した個人情報は、以下の目的の範囲で利用します。",
        items: ["お問い合わせ、鑑定申込、購入相談への回答", "品物の確認、見積り、来店予約、配送手配", "本人確認、取引管理、アフターサポート", "サイト運営、品質向上、不正利用防止", "法令または行政機関の要請への対応"]
      },
      {
        title: "3. 第三者提供",
        body: "法令に基づく場合、本人の同意がある場合、配送会社や決済事業者など業務遂行に必要な委託先へ提供する場合を除き、個人情報を第三者へ提供しません。"
      },
      {
        title: "4. 業務委託",
        body: "メール配信、サーバー管理、決済、配送、アクセス解析等を外部事業者に委託する場合があります。この場合、委託先を適切に選定し、必要な監督を行います。"
      },
      {
        title: "5. Cookie・アクセス解析",
        body: "当サイトでは、利便性向上、アクセス状況の把握、コンテンツ改善のため、Cookieや類似技術を利用する場合があります。ブラウザ設定によりCookieを無効にできますが、一部機能が利用できない場合があります。"
      },
      {
        title: "6. 安全管理措置",
        body: "当社は、個人情報の漏えい、紛失、改ざん、不正アクセスを防ぐため、アクセス管理、権限管理、通信保護、保存期間の見直し等、必要かつ適切な安全管理措置を講じます。"
      },
      {
        title: "7. 開示・訂正・利用停止",
        body: "ご本人から個人情報の開示、訂正、追加、削除、利用停止、第三者提供停止等の請求があった場合、本人確認のうえ、法令に従って対応します。"
      },
      {
        title: "8. ポリシーの変更",
        body: "本ポリシーは、法令改正、サービス内容の変更、運用改善に応じて変更する場合があります。重要な変更は当サイト上で告知します。"
      }
    ],
    contact: {
      eyebrow: "CONTACT",
      title: "個人情報に関するお問い合わせ",
      text: "本ポリシーや個人情報の取り扱いに関するご相談は、下記窓口までお問い合わせください。",
      company: "玉林軒株式会社",
      address: "京都府京都市伏見区深草下川原町130番地4 華信ビル201号",
      email: "お問い合わせフォームをご利用ください",
      phone: "お問い合わせフォームをご利用ください",
      action: "お問い合わせ"
    }
  },
  zh: {
    seoTitle: "隐私政策 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社隐私政策。说明咨询、鉴定申请、购买咨询等场景中个人信息的取得、使用目的、管理、第三方提供与 Cookie 使用。",
    banner: {
      eyebrow: "PRIVACY POLICY",
      title: "隐私政策",
      subtitle: "关于咨询、鉴定申请与购买咨询中个人信息的处理方式，请在此确认。",
      breadcrumbHome: "首页"
    },
    intro: {
      eyebrow: "POLICY",
      title: "我们仅在必要范围内，谨慎保管您的重要信息。",
      text: "玉林軒株式会社在进行骨董古美术品鉴定、收购、销售、预约来店与各类咨询时，会依照相关法规及本政策妥善处理取得的个人信息。",
      updatedLabel: "最后更新",
      updatedDate: "2026年5月27日"
    },
    summary: {
      title: "主要处理内容",
      cards: [
        { title: "表单信息", text: "姓名、邮箱、电话、咨询内容与鉴定申请内容将用于确认与回复。", icon: "form" },
        { title: "Cookie・访问解析", text: "可能用于掌握访问情况、提升便利性与改善网站内容。", icon: "cookie" },
        { title: "安全管理", text: "为防止未经授权访问、遗失、篡改或泄露，我们会采取必要管理措施。", icon: "lock" },
        { title: "公开・更正", text: "本人提出公开、更正、停止使用等请求时，我们会确认身份后处理。", icon: "contact" }
      ]
    },
    sections: [
      {
        title: "1. 个人信息的取得",
        body: "本公司在咨询、鉴定申请、购买咨询、预约来店、邮件或电话联系时，会在必要范围内取得个人信息。",
        items: ["姓名、邮箱地址、电话号码", "地址、所在地区、希望来店时间", "咨询内容、鉴定物品说明、照片及相关资料", "交易、配送、支付、本人确认所需信息"]
      },
      {
        title: "2. 使用目的",
        body: "取得的个人信息将用于以下目的范围。",
        items: ["回复咨询、鉴定申请与购买咨询", "确认物品、估价、预约来店、安排配送", "本人确认、交易管理与售后支持", "网站运营、质量提升、防止不正当使用", "应对法规或行政机关要求"]
      },
      {
        title: "3. 第三方提供",
        body: "除依法提供、取得本人同意，或向配送公司、支付服务商等业务所需委托方提供外，本公司不会向第三方提供个人信息。"
      },
      {
        title: "4. 业务委托",
        body: "本公司可能将邮件发送、服务器管理、支付、配送、访问解析等业务委托给外部服务商。此时会适当选择委托方，并进行必要监督。"
      },
      {
        title: "5. Cookie・访问解析",
        body: "本网站可能使用 Cookie 或类似技术，用于提升便利性、掌握访问情况与改善内容。您可通过浏览器设置禁用 Cookie，但部分功能可能无法使用。"
      },
      {
        title: "6. 安全管理措施",
        body: "为防止个人信息泄露、遗失、篡改与未经授权访问，本公司会采取访问管理、权限管理、通信保护、保存期限审查等必要且适当的安全管理措施。"
      },
      {
        title: "7. 公开・更正・停止使用",
        body: "若本人要求公开、更正、追加、删除、停止使用或停止向第三方提供个人信息，本公司会在确认身份后依照法规处理。"
      },
      {
        title: "8. 政策变更",
        body: "本政策可能因法规修订、服务内容变更或运营改善而调整。重要变更将于本网站公布。"
      }
    ],
    contact: {
      eyebrow: "CONTACT",
      title: "关于个人信息的咨询",
      text: "如对本政策或个人信息处理方式有疑问，请通过以下窗口联系我们。",
      company: "玉林軒株式会社",
      address: "京都府京都市伏见区深草下川原町130番地4 华信ビル201号",
      email: "请使用咨询表单联系",
      phone: "请使用咨询表单联系",
      action: "联系我们"
    }
  },
  en: {
    seoTitle: "Privacy Policy | Gyokurinken Co., Ltd.",
    seoDescription:
      "Privacy policy of Gyokurinken Co., Ltd. covering personal information collected through inquiries, appraisal requests, purchase consultation, cookies, security, and disclosure requests.",
    banner: {
      eyebrow: "PRIVACY POLICY",
      title: "Privacy Policy",
      subtitle: "How we handle personal information for inquiries, appraisal requests, and purchase consultation.",
      breadcrumbHome: "Home"
    },
    intro: {
      eyebrow: "POLICY",
      title: "We handle important information carefully and only as needed.",
      text: "Gyokurinken Co., Ltd. handles personal information obtained through antique and fine art appraisal, purchase, sales, store visits, and inquiries in accordance with applicable laws and this policy.",
      updatedLabel: "Last updated",
      updatedDate: "May 27, 2026"
    },
    summary: {
      title: "Key Practices",
      cards: [
        { title: "Form Data", text: "Name, email, phone number, inquiry details, and appraisal request details are used for confirmation and reply.", icon: "form" },
        { title: "Cookies and Analytics", text: "Cookies may be used to understand visits, improve convenience, and refine website content.", icon: "cookie" },
        { title: "Security", text: "We take necessary measures to prevent unauthorized access, loss, alteration, and leakage.", icon: "lock" },
        { title: "Disclosure Requests", text: "Requests for disclosure, correction, or suspension are handled after identity confirmation.", icon: "contact" }
      ]
    },
    sections: [
      {
        title: "1. Collection of Personal Information",
        body: "We collect personal information within the necessary scope when you contact us, request appraisal, consult about purchase, book a visit, or communicate by email or phone.",
        items: ["Name, email address, and phone number", "Address, region, and preferred visit time", "Inquiry details, appraisal item descriptions, photos, and related materials", "Information needed for transactions, delivery, payment, and identity confirmation"]
      },
      {
        title: "2. Purpose of Use",
        body: "Personal information is used within the following purposes.",
        items: ["Replying to inquiries, appraisal requests, and purchase consultation", "Confirming items, estimates, store visits, and delivery arrangements", "Identity confirmation, transaction management, and after-sales support", "Website operation, quality improvement, and prevention of misuse", "Responding to legal or administrative requests"]
      },
      {
        title: "3. Provision to Third Parties",
        body: "We do not provide personal information to third parties except where required by law, with consent, or where necessary for business operations such as delivery companies and payment providers."
      },
      {
        title: "4. Outsourcing",
        body: "We may outsource email delivery, server management, payment, delivery, analytics, and similar operations. In such cases, we select vendors appropriately and provide necessary supervision."
      },
      {
        title: "5. Cookies and Access Analytics",
        body: "This website may use cookies and similar technologies to improve convenience, understand access trends, and improve content. You may disable cookies in your browser, but some functions may not work properly."
      },
      {
        title: "6. Security Measures",
        body: "We take necessary and appropriate security measures, including access control, permission management, communication protection, and review of retention periods, to prevent leakage, loss, alteration, and unauthorized access."
      },
      {
        title: "7. Disclosure, Correction, and Suspension",
        body: "When we receive a request from the individual for disclosure, correction, addition, deletion, suspension of use, or suspension of third-party provision, we respond in accordance with law after identity confirmation."
      },
      {
        title: "8. Changes to This Policy",
        body: "This policy may be changed in response to legal updates, service changes, or operational improvements. Important changes will be announced on this website."
      }
    ],
    contact: {
      eyebrow: "CONTACT",
      title: "Personal Information Inquiries",
      text: "For questions about this policy or our handling of personal information, please contact us below.",
      company: "Gyokurinken Co., Ltd.",
      address: "Kashin Building 201, 130-4 Fukakusa Shimogawaracho, Fushimi-ku, Kyoto-shi, Kyoto",
      email: "Please use the inquiry form",
      phone: "Please use the inquiry form",
      action: "Contact"
    }
  }
};

function SummaryIcon({ icon }: { icon: PrivacyCopy["summary"]["cards"][number]["icon"] }) {
  const Icon = icon === "form" ? FileText : icon === "cookie" ? Cookie : icon === "lock" ? LockKeyhole : UserCheck;
  return <Icon aria-hidden size={24} />;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const page = copy[lang];

  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: {
        ja: "/ja/privacy",
        zh: "/zh/privacy",
        en: "/en/privacy",
        "x-default": "/ja/privacy"
      }
    },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      type: "website",
      images: [collectionImages.bronze]
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.seoDescription,
      images: [collectionImages.bronze]
    }
  };
}

export default async function PrivacyPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const page = copy[lang];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: page.banner.breadcrumbHome, item: `/${lang}` },
      { "@type": "ListItem", position: 2, name: page.banner.title, item: `/${lang}/privacy` }
    ]
  };
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.banner.title,
    description: page.seoDescription,
    url: `/${lang}/privacy`,
    publisher: {
      "@type": "Organization",
      name: "玉林軒株式会社"
    }
  };

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
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

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:py-14 lg:grid-cols-[0.78fr_0.22fr] lg:px-8">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.intro.eyebrow}</p>
          <h2 className="mt-4 break-words font-serif text-3xl font-light leading-tight md:text-5xl">
            {page.intro.title}
          </h2>
          <p className="mt-6 max-w-4xl text-sm leading-8 text-[color:var(--muted)] md:text-base">
            {page.intro.text}
          </p>
        </div>
        <div className="self-start border border-[color:var(--gold)] bg-[color:var(--paper)] p-5">
          <p className="text-xs tracking-[0.22em] text-[color:var(--gold)]">{page.intro.updatedLabel}</p>
          <p className="mt-3 font-serif text-2xl font-light text-[color:var(--ink)]">{page.intro.updatedDate}</p>
        </div>
      </section>

      <section className="bg-[color:var(--ivory-dark)] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">SUMMARY</p>
            <h2 className="section-title mt-3 font-serif text-3xl font-light md:text-5xl">{page.summary.title}</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {page.summary.cards.map((card) => (
              <div key={card.title} className="border border-[color:var(--border)] bg-[color:var(--paper)] p-6">
                <div className="flex size-12 items-center justify-center border border-[color:var(--gold)] text-[color:var(--gold-dark)]">
                  <SummaryIcon icon={card.icon} />
                </div>
                <h2 className="mt-6 break-words font-serif text-2xl font-light">{card.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:py-16 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="self-start border border-[color:var(--border)] bg-[color:var(--paper)] p-5 lg:sticky lg:top-28">
          <div className="flex items-center gap-3">
            <ShieldCheck aria-hidden size={22} className="text-[color:var(--gold-dark)]" />
            <p className="font-serif text-2xl font-light">Policy</p>
          </div>
          <nav className="mt-5 grid gap-2 text-sm text-[color:var(--muted)]">
            {page.sections.map((section, index) => (
              <a
                key={section.title}
                href={`#policy-${index + 1}`}
                className="min-h-11 border-l border-[color:var(--border)] px-3 py-2 leading-6 hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="grid min-w-0 gap-5">
          {page.sections.map((section, index) => (
            <section
              key={section.title}
              id={`policy-${index + 1}`}
              className="scroll-mt-28 border border-[color:var(--border)] bg-[color:var(--paper)] p-5 md:p-7"
            >
              <h2 className="break-words font-serif text-2xl font-light md:text-3xl">{section.title}</h2>
              <p className="mt-4 text-sm leading-8 text-[color:var(--muted)] md:text-base">{section.body}</p>
              {section.items ? (
                <ul className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--muted)]">
                  {section.items.map((item) => (
                    <li key={item} className="border-l border-[color:var(--gold)] bg-[color:var(--ivory)] px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12 md:pb-16 lg:px-8">
        <div className="grid gap-8 border border-[color:var(--gold)] bg-[color:var(--wood)] p-6 text-[color:var(--ivory)] md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div className="min-w-0">
            <p className="text-xs tracking-[0.3em] text-[color:var(--gold-light)]">{page.contact.eyebrow}</p>
            <h2 className="mt-3 break-words font-serif text-3xl font-light md:text-4xl">{page.contact.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/72 md:text-base">{page.contact.text}</p>
            <address className="mt-5 grid gap-1 not-italic text-sm leading-7 text-white/72">
              <span>{page.contact.company}</span>
              <span>{page.contact.address}</span>
              <span className="w-fit break-all">{page.contact.email}</span>
              <span className="w-fit">{page.contact.phone}</span>
            </address>
          </div>
          <Link
            href={localizedPath(lang, "/contact")}
            className="inline-flex min-h-12 items-center justify-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
          >
            {page.contact.action}
            <Mail aria-hidden size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
