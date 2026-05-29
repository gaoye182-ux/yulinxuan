import Link from "next/link";
import type { Metadata } from "next";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
  Phone,
  ShieldCheck
} from "lucide-react";
import { AppraisalForm, type AppraisalFormCopy } from "@/components/appraisal-form";
import { collectionImages } from "@/lib/collection-data";
import { getCachedSiteSettings, pageMetadata } from "@/lib/frontend-site";
import { getLanguage, type Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";

type AppraisalFormPageCopy = AppraisalFormCopy & {
  seoTitle: string;
  seoDescription: string;
  banner: {
    eyebrow: string;
    title: string;
    subtitle: string;
    breadcrumbHome: string;
    breadcrumbAppraisal: string;
  };
  guide: {
    flowTitle: string;
    flow: string[];
    notesTitle: string;
    notes: string[];
    contactTitle: string;
    phone: string;
    email: string;
    hours: string;
  };
};

const copy: Record<Language, AppraisalFormPageCopy> = {
  ja: {
    seoTitle: "鑑定申込 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社の鑑定申込フォームです。店頭、出張、写真、電話相談から選び、骨董品・古美術品の写真や概要をお送りください。",
    banner: {
      eyebrow: "APPRAISAL FORM",
      title: "鑑定申込",
      subtitle: "骨董品・古美術品の状態、来歴、写真をもとに、担当者が順に確認いたします。",
      breadcrumbHome: "ホーム",
      breadcrumbAppraisal: "鑑定・買取"
    },
    form: {
      title: "ご相談内容をお知らせください",
      lead: "必須項目と、わかる範囲の品物情報をご入力ください。写真は最大5枚まで送信できます。",
      required: "必須",
      name: "お名前",
      namePlaceholder: "例：山田 太郎",
      email: "メールアドレス",
      emailPlaceholder: "example@gyokurinken.jp",
      phone: "電話番号",
      phonePlaceholder: "例：075-000-0000",
      type: "申込種別",
      region: "所在地区",
      regionPlaceholder: "例：東京都港区 / 大阪府 / 海外",
      category: "品物カテゴリ",
      categoryPlaceholder: "例：伊万里焼、掛軸、茶道具など",
      description: "品物説明",
      descriptionPlaceholder: "寸法、点数、箱書き、入手経緯、傷や修復の有無などをご記入ください。",
      preferredDate: "ご希望日",
      upload: "画像アップロード",
      uploadHelp: "写真を選択してください",
      privacy: "プライバシーポリシーに同意します。",
      privacyLink: "内容を確認",
      submit: "鑑定申込を送信",
      successTitle: "鑑定申込を受け付けました",
      successText: "受付番号を発行し、管理画面に保存しました。",
      errors: {
        name: "お名前を入力してください。",
        email: "メールアドレスを入力してください。",
        emailFormat: "メールアドレスの形式を確認してください。",
        privacy: "プライバシーポリシーへの同意が必要です。",
        fileCount: "画像は最大5枚まで選択できます。",
        fileSize: "各画像は5MB以下にしてください。",
        fileType: "JPG、PNG、HEIC形式の画像を選択してください。"
      }
    },
    options: {
      types: ["店頭鑑定", "出張鑑定", "写真鑑定", "電話相談"],
      categories: ["陶磁器", "掛軸・書画", "茶道具", "箪笥・家具", "金工・工芸品", "仏教美術", "その他"]
    },
    guide: {
      flowTitle: "お申し込み後の流れ",
      flow: ["内容確認", "写真・概要の初期確認", "鑑定方法のご案内", "実物確認またはお見積り"],
      notesTitle: "ご確認事項",
      notes: [
        "写真鑑定は初期判断です。最終評価は実物確認後に変わる場合があります。",
        "箱、証書、付属品、修復箇所がある場合は一緒にお知らせください。",
        "法令、状態、真贋、市場需要によりお受けできない場合があります。"
      ],
      contactTitle: "お急ぎのご相談",
      phone: "お問い合わせフォームをご利用ください",
      email: "お問い合わせフォームをご利用ください",
      hours: "10:00 - 18:00 / 不定休"
    }
  },
  zh: {
    seoTitle: "鉴定申请 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社鉴定申请表。可选择店头、出张、照片或电话咨询，提交骨董古美术品照片、类别、说明与期望日期。",
    banner: {
      eyebrow: "APPRAISAL FORM",
      title: "鉴定申请",
      subtitle: "请提供物品状态、来源、照片与希望咨询方式，担当人员会依次确认。",
      breadcrumbHome: "首页",
      breadcrumbAppraisal: "鉴定・收购"
    },
    form: {
      title: "请填写咨询内容",
      lead: "请填写必填项目，以及已知范围内的物品信息。图片最多可发送5张。",
      required: "必填",
      name: "姓名",
      namePlaceholder: "例：王 小林",
      email: "邮箱",
      emailPlaceholder: "example@gyokurinken.jp",
      phone: "电话",
      phonePlaceholder: "例：+81-75-000-0000",
      type: "申请类型",
      region: "所在地区",
      regionPlaceholder: "例：东京港区 / 上海 / 海外",
      category: "物品类别",
      categoryPlaceholder: "例：伊万里烧、挂轴、茶道具等",
      description: "物品说明",
      descriptionPlaceholder: "可填写尺寸、数量、箱书、取得经过、伤痕或修复情况等。",
      preferredDate: "期望日期",
      upload: "图片上传",
      uploadHelp: "请选择照片",
      privacy: "我同意隐私政策。",
      privacyLink: "查看内容",
      submit: "提交鉴定申请",
      successTitle: "鉴定申请已受理",
      successText: "已生成申请编号并保存到管理后台。",
      errors: {
        name: "请输入姓名。",
        email: "请输入邮箱。",
        emailFormat: "请确认邮箱格式。",
        privacy: "必须同意隐私政策。",
        fileCount: "图片最多可选择5张。",
        fileSize: "每张图片请控制在5MB以内。",
        fileType: "请选择 JPG、PNG、HEIC 格式图片。"
      }
    },
    options: {
      types: ["店头鉴定", "出张鉴定", "照片鉴定", "电话咨询"],
      categories: ["陶瓷器", "挂轴・书画", "茶道具", "箪笥・家具", "金工・工艺品", "佛教美术", "其他"]
    },
    guide: {
      flowTitle: "申请后的流程",
      flow: ["确认内容", "照片与概要初步判断", "说明适合的鉴定方式", "实物确认或报价"],
      notesTitle: "注意事项",
      notes: [
        "照片鉴定为初步判断，最终评价可能在实物确认后调整。",
        "如有箱、证书、附件或修复位置，请一并告知。",
        "根据法规、状态、真伪或市场需求，可能无法受理。"
      ],
      contactTitle: "紧急咨询",
      phone: "请使用咨询表单联系",
      email: "请使用咨询表单联系",
      hours: "10:00 - 18:00 / 不定休"
    }
  },
  en: {
    seoTitle: "Appraisal Form | Gyokurinken Co., Ltd.",
    seoDescription:
      "Request an antique and fine art appraisal from Gyokurinken. Choose in-store, on-site, photo, or phone consultation and share item details, photos, and preferred dates.",
    banner: {
      eyebrow: "APPRAISAL FORM",
      title: "Appraisal Form",
      subtitle: "Share the object's condition, background, photos, and preferred consultation method. Our staff will review your request in order.",
      breadcrumbHome: "Home",
      breadcrumbAppraisal: "Appraisal & Purchase"
    },
    form: {
      title: "Tell us about your request",
      lead: "Please complete the required fields and any object details you know. You may send up to five photos.",
      required: "Required",
      name: "Name",
      namePlaceholder: "Jane Smith",
      email: "Email",
      emailPlaceholder: "example@gyokurinken.jp",
      phone: "Phone",
      phonePlaceholder: "+81-75-000-0000",
      type: "Request Type",
      region: "Region",
      regionPlaceholder: "Tokyo / Osaka / Overseas",
      category: "Item Category",
      categoryPlaceholder: "Imari ware, scroll, tea ware, etc.",
      description: "Item Description",
      descriptionPlaceholder: "Please include size, quantity, box inscriptions, provenance, damage, or restoration if known.",
      preferredDate: "Preferred Date",
      upload: "Photo Upload",
      uploadHelp: "Choose photos",
      privacy: "I agree to the privacy policy.",
      privacyLink: "Review policy",
      submit: "Submit Appraisal Request",
      successTitle: "Appraisal Request Received",
      successText: "A request number has been issued and saved in the admin system.",
      errors: {
        name: "Please enter your name.",
        email: "Please enter your email address.",
        emailFormat: "Please check the email format.",
        privacy: "Agreement to the privacy policy is required.",
        fileCount: "Please choose up to 5 photos.",
        fileSize: "Each photo must be 5MB or less.",
        fileType: "Please choose JPG, PNG, or HEIC images."
      }
    },
    options: {
      types: ["In-store Appraisal", "On-site Appraisal", "Photo Appraisal", "Phone Consultation"],
      categories: ["Ceramics", "Scrolls & Paintings", "Tea Wares", "Furniture", "Metalwork & Crafts", "Buddhist Art", "Other"]
    },
    guide: {
      flowTitle: "After You Apply",
      flow: ["Review request", "Check photos and summary", "Suggest appraisal method", "Inspect or estimate"],
      notesTitle: "Notes",
      notes: [
        "Photo appraisal is preliminary. Final valuation may change after in-person inspection.",
        "Please mention boxes, certificates, accessories, damage, or restoration if available.",
        "Some items cannot be accepted because of law, condition, authenticity, or market demand."
      ],
      contactTitle: "Urgent Contact",
      phone: "Please use the inquiry form",
      email: "Please use the inquiry form",
      hours: "10:00 - 18:00 / Irregular holidays"
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

  return pageMetadata({ settings, lang, path: "/appraisal/form", title: page.seoTitle, description: page.seoDescription, image: collectionImages.imari });
}

export default async function AppraisalFormPage({
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
      { "@type": "ListItem", position: 2, name: page.banner.breadcrumbAppraisal, item: `/${lang}/appraisal` },
      { "@type": "ListItem", position: 3, name: page.banner.title, item: `/${lang}/appraisal/form` }
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
            <Link href={localizedPath(lang, "/appraisal")} className="hover:text-[color:var(--gold-dark)]">
              {page.banner.breadcrumbAppraisal}
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

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <AppraisalForm copy={page} lang={lang} />

        <aside className="grid gap-5 self-start lg:sticky lg:top-28">
          <div className="border border-[color:var(--border)] bg-[color:var(--paper)] p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 aria-hidden size={22} className="text-[color:var(--gold-dark)]" />
              <h2 className="font-serif text-2xl font-light">{page.guide.flowTitle}</h2>
            </div>
            <ol className="mt-6 grid gap-3">
              {page.guide.flow.map((step, index) => (
                <li key={step} className="grid grid-cols-[2.5rem_1fr] items-center gap-3 text-sm text-[color:var(--ink)]">
                  <span className="flex size-10 items-center justify-center border border-[color:var(--gold)] font-serif text-lg text-[color:var(--gold-dark)]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 break-words">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border border-[color:var(--border)] bg-[color:var(--ivory-dark)] p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle aria-hidden size={22} className="text-[color:var(--gold-dark)]" />
              <h2 className="font-serif text-2xl font-light">{page.guide.notesTitle}</h2>
            </div>
            <ul className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--muted)]">
              {page.guide.notes.map((note) => (
                <li key={note} className="border-l border-[color:var(--gold)] pl-4">
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-[color:var(--gold)] bg-[color:var(--wood)] p-6 text-[color:var(--ivory)]">
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden size={22} className="text-[color:var(--gold-light)]" />
              <h2 className="font-serif text-2xl font-light">{page.guide.contactTitle}</h2>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-white/78">
              <p className="flex min-h-11 items-center gap-3 break-all">
                <Phone aria-hidden size={17} className="shrink-0 text-[color:var(--gold-light)]" />
                {page.guide.phone}
              </p>
              <p className="flex min-h-11 items-center gap-3 break-all">
                <Mail aria-hidden size={17} className="shrink-0 text-[color:var(--gold-light)]" />
                {page.guide.email}
              </p>
              <p className="flex min-h-11 items-center gap-3">
                <Clock aria-hidden size={17} className="shrink-0 text-[color:var(--gold-light)]" />
                {page.guide.hours}
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
