import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { getCachedSiteSettings, pageMetadata } from "@/lib/frontend-site";
import { getLanguage, type Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";

const copy: Record<Language, {
  seoTitle: string;
  seoDescription: string;
  home: string;
  title: string;
  text: string;
  contact: string;
  collection: string;
}> = {
  ja: {
    seoTitle: "お問い合わせ完了 | 玉林軒株式会社",
    seoDescription: "玉林軒株式会社へのお問い合わせを受け付けました。",
    home: "ホーム",
    title: "お問い合わせを受け付けました",
    text: "内容を確認のうえ、必要に応じて担当者よりご連絡します。",
    contact: "お問い合わせへ戻る",
    collection: "蔵品を見る"
  },
  zh: {
    seoTitle: "咨询提交完成 | 玉林軒株式会社",
    seoDescription: "玉林軒株式会社已收到您的咨询。",
    home: "首页",
    title: "咨询已提交",
    text: "我们会确认内容，如有需要将由负责人联系您。",
    contact: "返回联系页面",
    collection: "查看藏品"
  },
  en: {
    seoTitle: "Inquiry Received | Gyokurinken Co., Ltd.",
    seoDescription: "Your inquiry to Gyokurinken has been received.",
    home: "Home",
    title: "Inquiry Received",
    text: "We will review your message and contact you if follow-up is needed.",
    contact: "Back to Contact",
    collection: "View Collection"
  }
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const page = copy[lang];

  return pageMetadata({ settings, lang, path: "/contact/thanks", title: page.seoTitle, description: page.seoDescription });
}

export default async function ContactThanksPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const page = copy[lang];

  return (
    <div className="overflow-hidden">
      <section className="border-b border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="mx-auto max-w-4xl px-5 py-12 md:py-16 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
            <Link href={localizedPath(lang)} className="hover:text-[color:var(--gold-dark)]">
              {page.home}
            </Link>
            <ChevronRight aria-hidden size={14} className="text-[color:var(--gold)]" />
            <span className="text-[color:var(--ink)]">{page.title}</span>
          </nav>
          <div className="mt-10 border border-[color:var(--gold)] bg-[color:var(--paper)] p-6 text-center md:p-10">
            <CheckCircle2 aria-hidden size={42} className="mx-auto text-[color:var(--gold-dark)]" />
            <h1 className="mt-5 break-words font-serif text-4xl font-light text-[color:var(--ink)] md:text-5xl">
              {page.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[color:var(--muted)] md:text-base">
              {page.text}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={localizedPath(lang, "/contact")}
                className="inline-flex min-h-12 items-center border border-[color:var(--border)] px-5 text-sm tracking-[0.14em] text-[color:var(--ink)]"
              >
                {page.contact}
              </Link>
              <Link
                href={localizedPath(lang, "/collection")}
                className="inline-flex min-h-12 items-center border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white"
              >
                {page.collection}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
