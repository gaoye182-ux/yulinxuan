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
  requestNo: string;
  appraisal: string;
  contact: string;
}> = {
  ja: {
    seoTitle: "鑑定申込完了 | 玉林軒株式会社",
    seoDescription: "玉林軒株式会社への鑑定申込を受け付けました。",
    home: "ホーム",
    title: "鑑定申込を受け付けました",
    text: "受付番号を発行し、管理画面に保存しました。内容を確認のうえ担当者よりご連絡します。",
    requestNo: "受付番号",
    appraisal: "鑑定ページへ戻る",
    contact: "お問い合わせ"
  },
  zh: {
    seoTitle: "鉴定申请提交完成 | 玉林軒株式会社",
    seoDescription: "玉林軒株式会社已收到您的鉴定申请。",
    home: "首页",
    title: "鉴定申请已受理",
    text: "已生成申请编号并保存到管理后台。负责人确认内容后会与您联系。",
    requestNo: "申请编号",
    appraisal: "返回鉴定页面",
    contact: "联系我们"
  },
  en: {
    seoTitle: "Appraisal Request Received | Gyokurinken Co., Ltd.",
    seoDescription: "Your appraisal request to Gyokurinken has been received.",
    home: "Home",
    title: "Appraisal Request Received",
    text: "A request number has been issued and saved in the admin system. Our staff will review the details.",
    requestNo: "Request No.",
    appraisal: "Back to Appraisal",
    contact: "Contact"
  }
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const page = copy[lang];

  return pageMetadata({ settings, lang, path: "/appraisal/form/thanks", title: page.seoTitle, description: page.seoDescription });
}

export default async function AppraisalThanksPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ requestNo?: string }>;
}) {
  const { lang: rawLang } = await params;
  const { requestNo } = (await searchParams) ?? {};
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
            {requestNo ? (
              <p className="mx-auto mt-6 w-fit border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 py-3 text-sm tracking-[0.12em] text-[color:var(--gold-dark)]">
                {page.requestNo}: {requestNo}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={localizedPath(lang, "/appraisal")}
                className="inline-flex min-h-12 items-center border border-[color:var(--border)] px-5 text-sm tracking-[0.14em] text-[color:var(--ink)]"
              >
                {page.appraisal}
              </Link>
              <Link
                href={localizedPath(lang, "/contact")}
                className="inline-flex min-h-12 items-center border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white"
              >
                {page.contact}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
