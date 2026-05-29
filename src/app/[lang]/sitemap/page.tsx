import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  FileText,
  Globe2,
  Landmark,
  LockKeyhole,
  PenLine,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { collectionImages } from "@/lib/collection-data";
import { getLanguage, type Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";

type SitemapLink = {
  href: string;
  label: string;
  description: string;
  status?: string;
};

type SitemapGroup = {
  title: string;
  eyebrow: string;
  description: string;
  icon: "front" | "service" | "company" | "content";
  links: SitemapLink[];
};

type SitemapCopy = {
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
    note: string;
  };
  quick: {
    title: string;
    links: { href: string; label: string }[];
  };
  groups: SitemapGroup[];
  admin: {
    eyebrow: string;
    title: string;
    text: string;
    login: string;
    items: string[];
  };
  seo: {
    eyebrow: string;
    title: string;
    text: string;
    items: string[];
  };
};

const copy: Record<Language, SitemapCopy> = {
  ja: {
    seoTitle: "サイトマップ | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社公式サイトのサイトマップです。蔵品紹介、鑑定・買取、ご購入方法、ブログ、新着情報、会社情報、管理画面をご案内します。",
    banner: {
      eyebrow: "SITEMAP",
      title: "サイトマップ",
      subtitle: "蔵品、鑑定、購入案内、会社情報まで、玉林軒の主要ページを一覧でご確認いただけます。",
      breadcrumbHome: "ホーム"
    },
    intro: {
      eyebrow: "INFORMATION ARCHITECTURE",
      title: "目的のページへ、静かに迷わずたどり着ける入口を整えました。",
      text: "前台公開ページ、鑑定・購入サービス、会社情報、今後拡張する管理画面の位置づけを、三語サイトの構成に沿って整理しています。",
      note: "一部のコンテンツページは段階開発中です。公開前のページも、情報設計上の入口として記載しています。"
    },
    quick: {
      title: "主要入口",
      links: [
        { href: "/collection", label: "蔵品紹介" },
        { href: "/appraisal", label: "鑑定・買取" },
        { href: "/contact", label: "お問い合わせ" },
        { href: "/access", label: "アクセス" }
      ]
    },
    groups: [
      {
        title: "前台ページ",
        eyebrow: "PUBLIC",
        description: "来訪者が閲覧する公開ページです。蔵品、特選品、記事、ニュースを中心に構成します。",
        icon: "front",
        links: [
          { href: "/", label: "トップページ", description: "玉林軒のブランド導入、蔵品分類、新入荷、鑑定導線を集約します。" },
          { href: "/collection", label: "蔵品紹介", description: "公開中の蔵品を分類、条件、並び順で閲覧する一覧ページです。" },
          { href: "/collection/japanese-art", label: "日本美術", description: "陶磁器、掛軸、仏教美術、茶道具などの分類入口です。" },
          { href: "/collection/chinese-art", label: "中国美術", description: "中国陶磁、玉器、書画などの分類入口です。" },
          { href: "/new-arrivals", label: "新入荷・特選品", description: "新着品と特選品をまとめてご覧いただくページです。" },
          { href: "/blog", label: "鑑定士ブログ", description: "鑑定コラム、入荷紹介、展覧会情報を掲載します。", status: "準備中" },
          { href: "/news", label: "新着情報", description: "休業案内、イベント、お知らせを掲載します。", status: "準備中" }
        ]
      },
      {
        title: "サービス入口",
        eyebrow: "SERVICE",
        description: "鑑定、買取、購入、相談に関する導線です。来店前の確認にも利用できます。",
        icon: "service",
        links: [
          { href: "/appraisal", label: "鑑定・買取", description: "店頭鑑定、出張鑑定、写真鑑定、電話相談の説明ページです。" },
          { href: "/appraisal/form", label: "鑑定申込", description: "写真添付、希望日、品目情報を送信する申込フォームです。" },
          { href: "/purchase-guide", label: "ご購入方法", description: "問い合わせから支払い、配送、返品方針までの購入案内です。" },
          { href: "/faq", label: "よくある質問", description: "購入、鑑定、配送、海外対応などの質問をまとめています。" },
          { href: "/contact", label: "お問い合わせ", description: "来店、購入、作品確認、取材等の一般お問い合わせ窓口です。" }
        ]
      },
      {
        title: "会社情報",
        eyebrow: "COMPANY",
        description: "玉林軒の会社情報、アクセス、法務関連ページです。",
        icon: "company",
        links: [
          { href: "/about", label: "玉林軒について", description: "ブランドストーリー、代表挨拶、理念、許可情報を掲載します。" },
          { href: "/access", label: "アクセス", description: "住所、交通方式、営業時間、地図を確認できます。" },
          { href: "/privacy", label: "プライバシーポリシー", description: "個人情報、Cookie、開示請求等の取り扱いを記載しています。" },
          { href: "/sitemap", label: "サイトマップ", description: "現在ご覧のページです。公開ページを一覧化しています。" }
        ]
      }
    ],
    admin: {
      eyebrow: "ADMIN",
      title: "管理画面",
      text: "管理画面は公開サイトとは分離し、認証後に蔵品、分類、ブログ、ニュース、フォーム、SEO、設定を管理する想定です。",
      login: "管理画面ログイン",
      items: ["ダッシュボード", "蔵品・分類管理", "ブログ・ニュース管理", "鑑定申込・問い合わせ管理", "SEO・サイト設定", "ユーザー権限・操作ログ"]
    },
    seo: {
      eyebrow: "SEO",
      title: "三語 SEO と機械可読情報",
      text: "各ページは言語別 URL、canonical、hreflang、OGP、構造化データを段階的に整備します。",
      items: ["JA / ZH / EN の言語別 URL", "BreadcrumbList 構造化データ", "管理画面を robots から除外", "XML Sitemap 生成予定"]
    }
  },
  zh: {
    seoTitle: "网站地图 | 玉林軒株式会社",
    seoDescription:
      "玉林軒株式会社官方网站地图。整理藏品介绍、鉴定收购、购买方法、博客资讯、公司信息与后台管理占位说明。",
    banner: {
      eyebrow: "SITEMAP",
      title: "网站地图",
      subtitle: "从藏品、鉴定、购买说明到公司信息，可在此快速确认玉林軒主要页面入口。",
      breadcrumbHome: "首页"
    },
    intro: {
      eyebrow: "INFORMATION ARCHITECTURE",
      title: "将所有入口清晰整理，让访客安静而准确地抵达目标页面。",
      text: "本页按照三语网站结构，整理前台公开页面、鉴定与购买服务、公司信息，以及后续扩展后台的功能位置。",
      note: "部分内容页面仍处于阶段开发中。尚未公开的页面也会作为信息架构入口保留说明。"
    },
    quick: {
      title: "主要入口",
      links: [
        { href: "/collection", label: "藏品介绍" },
        { href: "/appraisal", label: "鉴定・收购" },
        { href: "/contact", label: "联系我们" },
        { href: "/access", label: "交通指引" }
      ]
    },
    groups: [
      {
        title: "前台页面",
        eyebrow: "PUBLIC",
        description: "访客浏览的公开页面，以藏品、精选、文章与资讯为核心。",
        icon: "front",
        links: [
          { href: "/", label: "首页", description: "品牌介绍、藏品分类、新入荷、鉴定入口与店铺信息的综合入口。" },
          { href: "/collection", label: "藏品介绍", description: "按分类、条件与排序浏览已公开藏品的列表页面。" },
          { href: "/collection/japanese-art", label: "日本美术", description: "陶磁器、挂轴、佛教美术、茶道具等分类入口。" },
          { href: "/collection/chinese-art", label: "中国美术", description: "中国陶瓷、玉器、书画等分类入口。" },
          { href: "/new-arrivals", label: "新入荷・精选", description: "集中展示新到藏品与重点精选藏品。" },
          { href: "/blog", label: "鉴定师博客", description: "发布鉴定专栏、入荷介绍与展览活动内容。", status: "准备中" },
          { href: "/news", label: "最新资讯", description: "发布休业通知、活动与网站公告。", status: "准备中" }
        ]
      },
      {
        title: "服务入口",
        eyebrow: "SERVICE",
        description: "与鉴定、收购、购买和咨询相关的访问路径，便于来店前确认。",
        icon: "service",
        links: [
          { href: "/appraisal", label: "鉴定・收购", description: "说明店头鉴定、上门鉴定、照片鉴定与电话咨询。" },
          { href: "/appraisal/form", label: "鉴定申请", description: "可提交照片、希望日期、品类与说明的申请表单。" },
          { href: "/purchase-guide", label: "购买方法", description: "介绍咨询、付款、配送、取货与退换政策。" },
          { href: "/faq", label: "常见问题", description: "整理购买、鉴定、配送、支付、海外客户相关问题。" },
          { href: "/contact", label: "联系我们", description: "来店、购买、作品确认、采访等一般咨询入口。" }
        ]
      },
      {
        title: "公司信息",
        eyebrow: "COMPANY",
        description: "玉林軒的公司介绍、交通、法务与辅助页面。",
        icon: "company",
        links: [
          { href: "/about", label: "关于我们", description: "展示品牌故事、代表致辞、理念与古物商许可。" },
          { href: "/access", label: "交通指引", description: "确认地址、路线、营业时间与地图。" },
          { href: "/privacy", label: "隐私政策", description: "说明个人信息、Cookie 与公开更正请求等处理方式。" },
          { href: "/sitemap", label: "网站地图", description: "当前页面，列出公开页面和规划中的站点入口。" }
        ]
      }
    ],
    admin: {
      eyebrow: "ADMIN",
      title: "后台管理占位说明",
      text: "后台与公开网站分离，登录后预计管理藏品、分类、博客、资讯、表单、SEO 与站点设置。",
      login: "后台登录",
      items: ["控制台总览", "藏品・分类管理", "博客・资讯管理", "鉴定申请・联系表单管理", "SEO・站点设置", "用户权限・操作日志"]
    },
    seo: {
      eyebrow: "SEO",
      title: "三语 SEO 与机器可读信息",
      text: "各页面将按语言 URL、canonical、hreflang、OGP 与结构化数据逐步完善。",
      items: ["JA / ZH / EN 独立语言 URL", "BreadcrumbList 结构化数据", "robots 排除后台路径", "XML Sitemap 生成计划"]
    }
  },
  en: {
    seoTitle: "Sitemap | Gyokurinken Co., Ltd.",
    seoDescription:
      "Sitemap for Gyokurinken Co., Ltd., organizing collection, appraisal, purchase guide, journal, news, company information, and admin areas.",
    banner: {
      eyebrow: "SITEMAP",
      title: "Sitemap",
      subtitle: "A clear index of Gyokurinken pages, from collection and appraisal services to company information.",
      breadcrumbHome: "Home"
    },
    intro: {
      eyebrow: "INFORMATION ARCHITECTURE",
      title: "A quiet index for reaching each page without losing the thread.",
      text: "This page organizes public pages, appraisal and purchase services, company information, and future admin areas within the trilingual site structure.",
      note: "Some content pages are still being developed. Planned pages are listed as information architecture entries before publication."
    },
    quick: {
      title: "Primary Links",
      links: [
        { href: "/collection", label: "Collection" },
        { href: "/appraisal", label: "Appraisal" },
        { href: "/contact", label: "Contact" },
        { href: "/access", label: "Access" }
      ]
    },
    groups: [
      {
        title: "Public Pages",
        eyebrow: "PUBLIC",
        description: "Public-facing pages for visitors, centered on works, featured arrivals, articles, and news.",
        icon: "front",
        links: [
          { href: "/", label: "Home", description: "Brand introduction, collection categories, new arrivals, appraisal paths, and shop information." },
          { href: "/collection", label: "Collection", description: "Browse published works by category, filters, and sorting." },
          { href: "/collection/japanese-art", label: "Japanese Art", description: "Entry point for ceramics, hanging scrolls, Buddhist art, tea utensils, and related works." },
          { href: "/collection/chinese-art", label: "Chinese Art", description: "Entry point for Chinese ceramics, jade, paintings, and calligraphy." },
          { href: "/new-arrivals", label: "New Arrivals", description: "A curated view of newly arrived and featured works." },
          { href: "/blog", label: "Appraiser Blog", description: "Appraisal columns, arrival notes, exhibitions, and events.", status: "Planned" },
          { href: "/news", label: "News", description: "Holiday notices, events, and official announcements.", status: "Planned" }
        ]
      },
      {
        title: "Service Entrances",
        eyebrow: "SERVICE",
        description: "Paths for appraisal, purchase, and consultation, useful before visiting or making an inquiry.",
        icon: "service",
        links: [
          { href: "/appraisal", label: "Appraisal & Purchase", description: "In-store appraisal, visiting appraisal, photo appraisal, and phone consultation." },
          { href: "/appraisal/form", label: "Appraisal Form", description: "Submit photos, preferred date, category, and item details." },
          { href: "/purchase-guide", label: "Purchase Guide", description: "Inquiry, payment, shipping, pickup, and return policy guidance." },
          { href: "/faq", label: "FAQ", description: "Questions about purchase, appraisal, delivery, payment, and overseas clients." },
          { href: "/contact", label: "Contact", description: "General inquiries for visits, purchase consultation, work confirmation, and media requests." }
        ]
      },
      {
        title: "Company Information",
        eyebrow: "COMPANY",
        description: "Company profile, access, legal, and utility pages for Gyokurinken.",
        icon: "company",
        links: [
          { href: "/about", label: "About", description: "Brand story, representative message, philosophy, and antique dealer license." },
          { href: "/access", label: "Access", description: "Address, directions, opening hours, and map." },
          { href: "/privacy", label: "Privacy Policy", description: "Personal information, cookies, and disclosure request handling." },
          { href: "/sitemap", label: "Sitemap", description: "This page, listing public pages and planned site areas." }
        ]
      }
    ],
    admin: {
      eyebrow: "ADMIN",
      title: "Admin Area",
      text: "The admin area is separated from the public site. After authentication, it is planned to manage works, categories, blog, news, forms, SEO, and settings.",
      login: "Admin Login",
      items: ["Dashboard overview", "Item and category management", "Blog and news management", "Appraisal and contact form management", "SEO and site settings", "User permissions and audit logs"]
    },
    seo: {
      eyebrow: "SEO",
      title: "Trilingual SEO and Machine-Readable Data",
      text: "Language-specific URLs, canonical links, hreflang, OGP, and structured data are prepared progressively across pages.",
      items: ["JA / ZH / EN language URLs", "BreadcrumbList structured data", "Admin paths excluded from robots", "XML Sitemap generation planned"]
    }
  }
};

function GroupIcon({ icon }: { icon: SitemapGroup["icon"] }) {
  const Icon = icon === "front" ? Globe2 : icon === "service" ? Landmark : icon === "company" ? Building2 : ScrollText;
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
      canonical: `/${lang}/sitemap`,
      languages: {
        ja: "/ja/sitemap",
        zh: "/zh/sitemap",
        en: "/en/sitemap",
        "x-default": "/ja/sitemap"
      }
    },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      type: "website",
      images: [collectionImages.scroll]
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.seoDescription,
      images: [collectionImages.scroll]
    }
  };
}

export default async function SitemapPage({
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
      { "@type": "ListItem", position: 2, name: page.banner.title, item: `/${lang}/sitemap` }
    ]
  };
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.banner.title,
    description: page.seoDescription,
    url: `/${lang}/sitemap`,
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

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:py-14 lg:grid-cols-[minmax(0,0.78fr)_minmax(280px,0.22fr)] lg:px-8">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.intro.eyebrow}</p>
          <h2 className="mt-4 break-words font-serif text-3xl font-light leading-tight md:text-5xl">
            {page.intro.title}
          </h2>
          <p className="mt-6 max-w-4xl text-sm leading-8 text-[color:var(--muted)] md:text-base">
            {page.intro.text}
          </p>
          <p className="mt-5 border-l border-[color:var(--gold)] bg-[color:var(--paper)] px-4 py-3 text-sm leading-7 text-[color:var(--muted)]">
            {page.intro.note}
          </p>
        </div>

        <aside className="self-start border border-[color:var(--gold)] bg-[color:var(--paper)] p-5">
          <div className="flex items-center gap-3">
            <Search aria-hidden size={22} className="shrink-0 text-[color:var(--gold-dark)]" />
            <p className="font-serif text-2xl font-light">{page.quick.title}</p>
          </div>
          <div className="mt-5 grid gap-2">
            {page.quick.links.map((item) => (
              <Link
                key={item.href}
                href={localizedPath(lang, item.href)}
                className="group flex min-h-11 items-center justify-between gap-4 border-b border-[color:var(--border)] py-2 text-sm text-[color:var(--muted)] last:border-b-0 hover:text-[color:var(--gold-dark)]"
              >
                <span className="break-words">{item.label}</span>
                <ArrowRight aria-hidden size={15} className="shrink-0 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="bg-[color:var(--ivory-dark)] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-3">
            {page.groups.map((group) => (
              <section key={group.title} className="min-w-0 border border-[color:var(--border)] bg-[color:var(--paper)]">
                <div className="border-b border-[color:var(--border)] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center border border-[color:var(--gold)] text-[color:var(--gold-dark)]">
                      <GroupIcon icon={group.icon} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs tracking-[0.26em] text-[color:var(--gold)]">{group.eyebrow}</p>
                      <h2 className="mt-2 break-words font-serif text-2xl font-light">{group.title}</h2>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">{group.description}</p>
                </div>

                <div className="divide-y divide-[color:var(--border)]">
                  {group.links.map((item) => (
                    <Link
                      key={`${group.title}-${item.href}-${item.label}`}
                      href={localizedPath(lang, item.href)}
                      className="group block min-w-0 p-5 transition hover:bg-[color:var(--ivory)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-words font-serif text-xl font-light text-[color:var(--ink)]">
                              {item.label}
                            </h3>
                            {item.status ? (
                              <span className="border border-[color:var(--gold)] px-2 py-1 text-[10px] tracking-[0.14em] text-[color:var(--gold-dark)]">
                                {item.status}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-2 break-words text-sm leading-7 text-[color:var(--muted)]">
                            {item.description}
                          </p>
                        </div>
                        <ArrowRight aria-hidden size={16} className="mt-1 shrink-0 text-[color:var(--gold)] transition group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:py-16 lg:grid-cols-[1fr_1fr] lg:px-8">
        <section className="min-w-0 border border-[color:var(--border)] bg-[color:var(--paper)] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <LockKeyhole aria-hidden size={24} className="shrink-0 text-[color:var(--gold-dark)]" />
            <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{page.admin.eyebrow}</p>
          </div>
          <h2 className="mt-4 break-words font-serif text-3xl font-light">{page.admin.title}</h2>
          <p className="mt-5 text-sm leading-8 text-[color:var(--muted)]">{page.admin.text}</p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex min-h-12 items-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
          >
            {page.admin.login}
            <ShieldCheck aria-hidden size={16} />
          </Link>
          <ul className="mt-7 grid gap-3 text-sm leading-7 text-[color:var(--muted)] sm:grid-cols-2">
            {page.admin.items.map((item) => (
              <li key={item} className="border-l border-[color:var(--gold)] bg-[color:var(--ivory)] px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="min-w-0 border border-[color:var(--border)] bg-[color:var(--wood)] p-6 text-[color:var(--ivory)] md:p-8">
          <div className="flex items-center gap-3">
            <Sparkles aria-hidden size={24} className="shrink-0 text-[color:var(--gold-light)]" />
            <p className="text-xs tracking-[0.3em] text-[color:var(--gold-light)]">{page.seo.eyebrow}</p>
          </div>
          <h2 className="mt-4 break-words font-serif text-3xl font-light">{page.seo.title}</h2>
          <p className="mt-5 text-sm leading-8 text-white/72">{page.seo.text}</p>
          <ul className="mt-7 grid gap-3 text-sm leading-7 text-white/72 sm:grid-cols-2">
            {page.seo.items.map((item) => (
              <li key={item} className="border-l border-[color:var(--gold)] bg-white/5 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={localizedPath(lang, "/privacy")}
              className="inline-flex min-h-12 items-center gap-3 border border-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-[color:var(--gold-light)]"
            >
              <FileText aria-hidden size={16} />
              Privacy
            </Link>
            <Link
              href={localizedPath(lang, "/contact")}
              className="inline-flex min-h-12 items-center gap-3 border border-white/20 px-5 text-sm tracking-[0.14em] text-white"
            >
              <PenLine aria-hidden size={16} />
              Contact
            </Link>
          </div>
        </section>
      </section>
    </div>
  );
}
