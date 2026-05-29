import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  FolderOpen,
  MessageCircle,
  PenLine,
  Tag
} from "lucide-react";
import type { Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";
import {
  contentDetailCopy,
  getRelatedContent,
  type ContentEntry,
  type ContentKind,
  type ContentListCopy
} from "@/lib/content-data";

type ContentDetailProps = {
  lang: Language;
  kind: ContentKind;
  listCopy: ContentListCopy;
  entry: ContentEntry;
  entries?: ContentEntry[];
};

function formatDisplayDate(date: string, lang: Language) {
  return new Intl.DateTimeFormat(
    lang === "ja" ? "ja-JP" : lang === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "long", day: "2-digit" }
  ).format(new Date(`${date}T00:00:00`));
}

function buildParagraphs(entry: ContentEntry, lang: Language, kind: ContentKind) {
  const savedContent = entry.content?.[lang]?.trim();
  if (savedContent) {
    const paragraphs = savedContent
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.replace(/^#+\s*/, "").trim())
      .filter(Boolean);

    if (paragraphs.length >= 3) {
      return paragraphs.slice(0, 3);
    }

    return [...paragraphs, entry.excerpt[lang], entry.excerpt[lang]].slice(0, 3);
  }

  if (kind === "news") {
    return [
      `${entry.excerpt[lang]} ${lang === "en" ? "This notice is prepared as part of the current public information area for Gyokurinken." : lang === "zh" ? "本资讯作为玉林軒当前公开信息区域的一部分进行整理。" : "本お知らせは、玉林軒の公開情報領域として整理している内容です。"}`,
      lang === "en"
        ? "Please check the category and publication date before planning a visit or consultation. Details may be updated as official information is finalized."
        : lang === "zh"
          ? "请在安排来店或咨询前确认资讯类型与发布日期。正式信息确定后，内容可能继续更新。"
          : "ご来店やご相談の前に、種別と掲載日をご確認ください。正式情報の確定に合わせて内容を更新する場合があります。",
      lang === "en"
        ? "For questions about this notice, appointments, or appraisal requests, please contact us through the inquiry page."
        : lang === "zh"
          ? "关于本资讯、预约或鉴定申请的疑问，请通过咨询页面联系我们。"
          : "本お知らせ、来店予約、鑑定申込に関するご質問は、お問い合わせページよりご連絡ください。"
    ];
  }

  return [
    `${entry.excerpt[lang]} ${lang === "en" ? "The following notes organize the key points we would first observe in a gallery or appraisal setting." : lang === "zh" ? "以下内容整理了我们在展厅或鉴定场景中首先会观察的重点。" : "以下では、店頭や鑑定の場でまず確認したい要点を整理します。"}`,
    lang === "en"
      ? "Condition, material, handling marks, and the balance between form and surface all need to be considered together. A single feature rarely tells the whole story."
      : lang === "zh"
        ? "状态、材质、使用痕迹，以及器形与表面景色之间的平衡，需要放在一起判断。单一特征很少能说明全部。"
        : "状態、素材、扱われてきた痕跡、形と表面の景色の釣り合いを合わせて見ることが大切です。一つの特徴だけで全体を判断することはできません。",
    lang === "en"
      ? "When bringing a work for consultation, clear photographs, dimensions, box inscriptions, and any known history help us provide a more careful first response."
      : lang === "zh"
        ? "咨询时如能准备清晰照片、尺寸、箱书以及已知来历，将有助于我们给出更谨慎的初步说明。"
        : "ご相談の際は、鮮明な写真、寸法、箱書、わかる範囲の来歴をご用意いただくと、より丁寧な初期回答につながります。"
  ];
}

function buildKeyPoints(entry: ContentEntry, lang: Language, kind: ContentKind) {
  if (kind === "news") {
    return [
      lang === "en"
        ? `Type: ${entry.category[lang]}`
        : lang === "zh"
          ? `类型：${entry.category[lang]}`
          : `種別：${entry.category[lang]}`,
      lang === "en"
        ? "Please confirm the latest notice before arranging a visit."
        : lang === "zh"
          ? "安排来店前，请以本资讯与后续更新为准。"
          : "ご来店前には、本お知らせと今後の更新をご確認ください。",
      lang === "en"
        ? "For appraisal or purchase questions, use the contact page."
        : lang === "zh"
          ? "鉴定或购买相关问题可通过咨询页面联系。"
          : "鑑定・ご購入に関するご質問はお問い合わせページより承ります。"
    ];
  }

  return [
    entry.tags.map((tag) => tag[lang]).join(" / "),
    lang === "en"
      ? "Observe material, form, surface, and condition together rather than judging from a single feature."
      : lang === "zh"
        ? "将材质、器形、表面景色与状态放在一起观察，而不是只凭单一特征判断。"
        : "素材、形、表面の景色、状態を合わせて見て、一つの特徴だけで判断しないことが大切です。",
    lang === "en"
      ? "Clear photographs, dimensions, and known provenance help the first appraisal response."
      : lang === "zh"
        ? "清晰照片、尺寸与已知来历，会帮助我们给出更谨慎的初步说明。"
        : "鮮明な写真、寸法、わかる範囲の来歴があると初期回答がより丁寧になります。"
  ];
}

const detailLabels: Record<
  Language,
  {
    authorLabel: string;
    categoryLabel: string;
    tagsLabel: string;
    tableOfContents: string;
    keyPoints: string;
  }
> = {
  ja: {
    authorLabel: "執筆",
    categoryLabel: "カテゴリ",
    tagsLabel: "タグ",
    tableOfContents: "本文構成",
    keyPoints: "要点"
  },
  zh: {
    authorLabel: "作者",
    categoryLabel: "分类",
    tagsLabel: "标签",
    tableOfContents: "正文结构",
    keyPoints: "要点"
  },
  en: {
    authorLabel: "Author",
    categoryLabel: "Category",
    tagsLabel: "Tags",
    tableOfContents: "Article Sections",
    keyPoints: "Key Points"
  }
};

export function ContentDetail({ lang, kind, listCopy, entry, entries }: ContentDetailProps) {
  const detailCopy = contentDetailCopy[lang][kind];
  const related = getRelatedContent(entry, entries);
  const paragraphs = buildParagraphs(entry, lang, kind);
  const keyPoints = buildKeyPoints(entry, lang, kind);
  const labels = detailLabels[lang];
  const listPath = `/${kind}`;

  return (
    <div className="overflow-hidden">
      <section className="border-b border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="mx-auto max-w-7xl px-5 py-10 md:py-12 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
            <Link href={localizedPath(lang)} className="hover:text-[color:var(--gold-dark)]">
              {listCopy.banner.breadcrumbHome}
            </Link>
            <ChevronRight aria-hidden size={14} className="text-[color:var(--gold)]" />
            <Link href={localizedPath(lang, listPath)} className="hover:text-[color:var(--gold-dark)]">
              {listCopy.banner.title}
            </Link>
            <ChevronRight aria-hidden size={14} className="text-[color:var(--gold)]" />
            <span className="min-w-0 break-words text-[color:var(--ink)]">{entry.title[lang]}</span>
          </nav>
          <div className="mt-8 grid gap-5 md:grid-cols-[0.72fr_1fr] md:items-end">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.28em] text-[color:var(--gold)]">{listCopy.banner.eyebrow}</p>
              <p className="mt-3 font-serif text-3xl font-light tracking-[0.08em] text-[color:var(--ink)] md:text-5xl">
                {listCopy.banner.title}
              </p>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-[color:var(--muted)] md:justify-self-end">
              {listCopy.banner.subtitle}
            </p>
          </div>
        </div>
      </section>

      <article>
        <header className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:py-14 lg:grid-cols-[minmax(0,0.94fr)_minmax(300px,0.46fr)] lg:px-8">
          <div className="min-w-0">
            <Link
              href={localizedPath(lang, listPath)}
              className="inline-flex min-h-11 items-center gap-3 border border-[color:var(--border)] bg-[color:var(--paper)] px-4 text-sm text-[color:var(--gold-dark)] transition hover:border-[color:var(--gold)]"
            >
              <ArrowLeft aria-hidden size={15} />
              {detailCopy.backToList}
            </Link>
            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs leading-6 text-[color:var(--muted)]">
              <span className="border border-[color:var(--gold)] px-2 py-1 text-[color:var(--gold-dark)]">
                {entry.category[lang]}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays aria-hidden size={14} />
                {detailCopy.publishedAt} {formatDisplayDate(entry.date, lang)}
              </span>
              {entry.readTime ? (
                <span className="inline-flex items-center gap-1">
                  <Clock3 aria-hidden size={14} />
                  {entry.readTime[lang]}
                </span>
              ) : null}
            </div>
            <h1 className="mt-6 break-words font-serif text-4xl font-light leading-tight text-[color:var(--ink)] md:text-6xl">
              {entry.title[lang]}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[color:var(--muted)] md:text-lg">
              {entry.excerpt[lang]}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag.en}
                  className="inline-flex min-h-9 max-w-full items-center gap-2 break-words border border-[color:var(--border)] bg-[color:var(--paper)] px-3 text-xs text-[color:var(--muted)]"
                >
                  <Tag aria-hidden size={13} className="text-[color:var(--gold-dark)]" />
                  {tag[lang]}
                </span>
              ))}
            </div>
          </div>

          <aside className="self-start border border-[color:var(--gold)] bg-[color:var(--paper)] p-5">
            <div className="flex items-center gap-3">
              <PenLine aria-hidden size={21} className="shrink-0 text-[color:var(--gold-dark)]" />
              <p className="font-serif text-2xl font-light">{detailCopy.overview}</p>
            </div>
            <dl className="mt-5 divide-y divide-[color:var(--border)] border-y border-[color:var(--border)] text-sm">
              <div className="grid grid-cols-[6em_1fr] gap-3 py-3">
                <dt className="text-[color:var(--gold-dark)]">{labels.authorLabel}</dt>
                <dd className="min-w-0 break-words text-[color:var(--muted)]">{detailCopy.author}</dd>
              </div>
              <div className="grid grid-cols-[6em_1fr] gap-3 py-3">
                <dt className="text-[color:var(--gold-dark)]">{labels.categoryLabel}</dt>
                <dd className="min-w-0 break-words text-[color:var(--muted)]">{entry.category[lang]}</dd>
              </div>
              <div className="grid grid-cols-[6em_1fr] gap-3 py-3">
                <dt className="text-[color:var(--gold-dark)]">{labels.tagsLabel}</dt>
                <dd className="min-w-0 break-words text-[color:var(--muted)]">
                  {entry.tags.map((tag) => tag[lang]).join(" / ")}
                </dd>
              </div>
            </dl>
          </aside>
        </header>

        {entry.image ? (
          <section className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="relative aspect-[16/9] overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory-dark)]">
              <Image
                src={entry.image}
                alt={entry.title[lang]}
                fill
                sizes="(min-width: 1024px) 1200px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </section>
        ) : null}

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:py-16 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
          <aside className="hidden self-start border-l border-[color:var(--gold)] pl-5 text-sm text-[color:var(--muted)] lg:block">
            <p className="font-serif text-2xl font-light text-[color:var(--ink)]">{labels.tableOfContents}</p>
            <ol className="mt-5 grid gap-3">
              {detailCopy.sections.map((section, index) => (
                <li key={section}>
                  {String(index + 1).padStart(2, "0")} / {section}
                </li>
              ))}
            </ol>
          </aside>

          <div className="min-w-0">
            <div className="border border-[color:var(--border)] bg-[color:var(--paper)] p-6 md:p-10">
              <div className="grid gap-10">
                {detailCopy.sections.map((section, index) => (
                  <section key={section} className="min-w-0">
                    <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-3 break-words font-serif text-3xl font-light">{section}</h2>
                    <p className="mt-5 text-sm leading-8 text-[color:var(--muted)] md:text-base">
                      {paragraphs[index]}
                    </p>
                    {index === 1 ? (
                      <div className="mt-6 border border-[color:var(--border)] bg-[color:var(--ivory)] p-5">
                        <div className="flex items-center gap-3">
                          <FolderOpen aria-hidden size={17} className="shrink-0 text-[color:var(--gold-dark)]" />
                          <h3 className="font-serif text-xl font-light">{labels.keyPoints}</h3>
                        </div>
                        <ul className="mt-4 grid gap-3 text-sm leading-7 text-[color:var(--muted)]">
                          {keyPoints.map((point) => (
                            <li key={point} className="grid grid-cols-[16px_minmax(0,1fr)] gap-3">
                              <span className="mt-3 h-px bg-[color:var(--gold)]" />
                              <span className="min-w-0 break-words">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </section>
                ))}
              </div>

              <blockquote className="mt-10 break-words border-l border-[color:var(--gold)] bg-[color:var(--ivory)] px-5 py-5 font-serif text-2xl font-light leading-relaxed text-[color:var(--ink)]">
                {detailCopy.quote}
              </blockquote>
            </div>

            <div className="mt-8 grid gap-6 border border-[color:var(--gold)] bg-[color:var(--wood)] p-6 text-[color:var(--ivory)] md:grid-cols-[1fr_auto] md:items-center md:p-8">
              <div className="min-w-0">
                <h2 className="break-words font-serif text-3xl font-light">{detailCopy.contactCta}</h2>
                <p className="mt-3 text-sm leading-7 text-white/72">{detailCopy.contactText}</p>
              </div>
              <Link
                href={localizedPath(lang, "/contact")}
                className="inline-flex min-h-12 items-center justify-center gap-3 border border-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-[color:var(--gold-light)] transition hover:bg-[color:var(--gold)] hover:text-white"
              >
                <MessageCircle aria-hidden size={16} />
                {detailCopy.contactButton}
              </Link>
            </div>
          </div>
        </section>
      </article>

      <section className="bg-[color:var(--paper)] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">
                {kind === "blog" ? "RELATED POSTS" : "RELATED NEWS"}
              </p>
              <h2 className="mt-3 break-words font-serif text-3xl font-light">{detailCopy.related}</h2>
            </div>
            <Link
              href={localizedPath(lang, listPath)}
              className="inline-flex min-h-11 items-center gap-2 border border-[color:var(--border)] px-4 text-sm text-[color:var(--gold-dark)]"
            >
              {detailCopy.backToList}
              <ArrowRight aria-hidden size={15} />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={localizedPath(lang, `/${item.kind}/${item.slug}`)}
                className="group min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] p-5 transition hover:border-[color:var(--gold)] hover:bg-white"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-[color:var(--muted)]">
                  <span className="border border-[color:var(--border)] px-2 py-1 text-[color:var(--gold-dark)]">
                    {item.category[lang]}
                  </span>
                  <span>{formatDisplayDate(item.date, lang)}</span>
                </div>
                <h3 className="mt-4 break-words font-serif text-2xl font-light leading-snug">
                  {item.title[lang]}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{item.excerpt[lang]}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-[color:var(--gold-dark)]">
                  {listCopy.labels.readMore}
                  <ArrowRight aria-hidden size={14} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
