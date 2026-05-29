import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  FolderOpen,
  Search,
  Tag
} from "lucide-react";
import type { Language } from "@/lib/i18n";
import { queryString, type ContentFilters, type Pagination } from "@/lib/listing-filters";
import { localizedPath } from "@/lib/navigation";
import {
  getArchiveMonths,
  getUniqueLocalizedValues,
  type ContentEntry,
  type ContentKind,
  type ContentListCopy
} from "@/lib/content-data";

type ContentListingProps = {
  lang: Language;
  kind: ContentKind;
  copy: ContentListCopy;
  entries: ContentEntry[];
  allEntries: ContentEntry[];
  filters: ContentFilters;
  pagination: Pagination;
};

function formatDisplayDate(date: string, lang: Language) {
  return new Intl.DateTimeFormat(
    lang === "ja" ? "ja-JP" : lang === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "short", day: "2-digit" }
  ).format(new Date(`${date}T00:00:00`));
}

function ArchiveLabel({ month, lang }: { month: string; lang: Language }) {
  const [year, rawMonth] = month.split("-");
  const monthNumber = Number(rawMonth);
  const label =
    lang === "en" ? `${new Date(`${month}-01T00:00:00`).toLocaleString("en-US", { month: "long" })} ${year}` : `${year}.${monthNumber.toString().padStart(2, "0")}`;

  return <>{label}</>;
}

function contentHref(
  lang: Language,
  kind: ContentKind,
  filters: ContentFilters,
  override: Partial<ContentFilters> = {}
) {
  return `${localizedPath(lang, `/${kind}`)}${queryString({ ...filters, ...override })}`;
}

function filterChipClass(active = false) {
  return `min-h-10 border px-3 text-sm transition ${
    active
      ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-white"
      : "border-[color:var(--border)] px-3 text-[color:var(--ink)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
  }`;
}

function FilterPanel({
  lang,
  kind,
  copy,
  entries,
  filters
}: {
  lang: Language;
  kind: ContentKind;
  copy: ContentListCopy;
  entries: ContentEntry[];
  filters: ContentFilters;
}) {
  const categories = getUniqueLocalizedValues(entries, lang, "category");
  const tags = getUniqueLocalizedValues(entries, lang, "tags");
  const months = getArchiveMonths(entries);

  return (
    <aside className="grid min-w-0 gap-4 self-start lg:sticky lg:top-28">
      <section className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
        <div className="flex items-center gap-3">
          <Search aria-hidden size={18} className="shrink-0 text-[color:var(--gold-dark)]" />
          <h2 className="font-serif text-2xl font-light">{copy.controls.search}</h2>
        </div>
        <form action={localizedPath(lang, `/${kind}`)} className="mt-4 grid gap-3">
          {filters.category ? <input type="hidden" name="category" value={filters.category} /> : null}
          {filters.tag ? <input type="hidden" name="tag" value={filters.tag} /> : null}
          {filters.month ? <input type="hidden" name="month" value={filters.month} /> : null}
          <label className="block">
          <span className="sr-only">{copy.controls.search}</span>
          <input
            name="search"
            defaultValue={filters.search}
            placeholder={copy.controls.searchPlaceholder}
            className="h-12 w-full min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none transition placeholder:text-[color:var(--muted)]/70 hover:border-[color:var(--gold)]"
          />
          </label>
          <button className="min-h-11 w-full border border-[color:var(--gold)] text-sm tracking-[0.14em] text-[color:var(--gold-dark)] transition hover:bg-[color:var(--gold)] hover:text-white">
            {copy.controls.search}
          </button>
        </form>
        <Link
          href={localizedPath(lang, `/${kind}`)}
          className="mt-3 flex min-h-11 w-full items-center justify-center border border-[color:var(--border)] text-sm tracking-[0.14em] text-[color:var(--gold-dark)] transition hover:border-[color:var(--gold)]"
        >
          {copy.controls.reset}
        </Link>
      </section>

      <section className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
        <div className="flex items-center gap-3">
          <FolderOpen aria-hidden size={18} className="shrink-0 text-[color:var(--gold-dark)]" />
          <h2 className="font-serif text-2xl font-light">{copy.controls.categories}</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={contentHref(lang, kind, filters, { category: "", page: 1 })} className={filterChipClass(!filters.category)}>
            {copy.controls.all}
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={contentHref(lang, kind, filters, { category, page: 1 })}
              className={filterChipClass(filters.category === category)}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
        <div className="flex items-center gap-3">
          <Tag aria-hidden size={18} className="shrink-0 text-[color:var(--gold-dark)]" />
          <h2 className="font-serif text-2xl font-light">{copy.controls.tags}</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={contentHref(lang, kind, filters, { tag: filters.tag === tag ? "" : tag, page: 1 })}
              className={`min-h-9 border px-3 text-xs transition ${
                filters.tag === tag
                  ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-white"
                  : "border-[color:var(--border)] bg-[color:var(--ivory)] text-[color:var(--muted)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
              }`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </section>

      <section className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
        <div className="flex items-center gap-3">
          <CalendarDays aria-hidden size={18} className="shrink-0 text-[color:var(--gold-dark)]" />
          <h2 className="font-serif text-2xl font-light">{copy.controls.archives}</h2>
        </div>
        <div className="mt-4 grid gap-2">
          {months.map((month) => (
            <Link
              key={month}
              href={contentHref(lang, kind, filters, { month: filters.month === month ? "" : month, page: 1 })}
              className={`flex min-h-11 items-center justify-between gap-3 border-b border-[color:var(--border)] py-2 text-left text-sm last:border-b-0 hover:text-[color:var(--gold-dark)] ${
                filters.month === month ? "text-[color:var(--gold-dark)]" : "text-[color:var(--muted)]"
              }`}
            >
              <span>
                <ArchiveLabel month={month} lang={lang} />
              </span>
              <span className="shrink-0 text-xs text-[color:var(--gold-dark)]">
                {entries.filter((entry) => entry.month === month).length}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}

function FeaturedArticle({
  lang,
  kind,
  copy,
  entry
}: {
  lang: Language;
  kind: ContentKind;
  copy: ContentListCopy;
  entry: ContentEntry;
}) {
  const href = localizedPath(lang, `/${kind}/${entry.slug}`);

  return (
    <Link
      href={href}
      className="group grid min-w-0 overflow-hidden border border-[color:var(--gold)] bg-[color:var(--paper)] transition hover:-translate-y-1 hover:shadow-xl md:grid-cols-[0.92fr_1.08fr]"
    >
      <div className="relative min-h-[260px] overflow-hidden bg-[color:var(--ivory-dark)] md:min-h-[390px]">
        {entry.image ? (
          <Image
            src={entry.image}
            alt={entry.title[lang]}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[color:var(--wood)]" />
        )}
        <div className="absolute left-4 top-4 bg-[rgba(255,253,248,0.92)] px-3 py-1 text-xs tracking-[0.16em] text-[color:var(--gold-dark)]">
          {copy.labels.featured}
        </div>
      </div>
      <div className="min-w-0 p-6 md:p-9">
        <div className="flex flex-wrap items-center gap-3 text-xs leading-6 text-[color:var(--muted)]">
          <span className="border border-[color:var(--gold)] px-2 py-1 text-[color:var(--gold-dark)]">
            {entry.category[lang]}
          </span>
          <span>{formatDisplayDate(entry.date, lang)}</span>
          {entry.readTime ? (
            <span className="inline-flex items-center gap-1">
              <Clock3 aria-hidden size={13} />
              {copy.labels.readTime} {entry.readTime[lang]}
            </span>
          ) : null}
        </div>
        <h2 className="mt-6 break-words font-serif text-3xl font-light leading-tight md:text-5xl">
          {entry.title[lang]}
        </h2>
        <p className="mt-5 text-sm leading-8 text-[color:var(--muted)] md:text-base">{entry.excerpt[lang]}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag.en}
              className="border border-[color:var(--border)] bg-[color:var(--ivory)] px-2 py-1 text-xs text-[color:var(--muted)]"
            >
              #{tag[lang]}
            </span>
          ))}
        </div>
        <span className="mt-8 inline-flex min-h-11 items-center gap-3 border-b border-[color:var(--gold)] text-sm tracking-[0.14em] text-[color:var(--gold-dark)]">
          {copy.labels.readMore}
          <ArrowRight aria-hidden size={16} className="transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function ArticleListItem({
  lang,
  kind,
  entry
}: {
  lang: Language;
  kind: ContentKind;
  entry: ContentEntry;
}) {
  return (
    <Link
      href={localizedPath(lang, `/${kind}/${entry.slug}`)}
      className={`group grid min-w-0 border border-[color:var(--border)] bg-[color:var(--paper)] transition hover:border-[color:var(--gold)] hover:bg-white ${
        kind === "blog" ? "sm:grid-cols-[180px_minmax(0,1fr)]" : ""
      }`}
    >
      {kind === "blog" && entry.image ? (
        <div className="relative aspect-[4/3] min-h-44 overflow-hidden bg-[color:var(--ivory-dark)] sm:aspect-auto">
          <Image
            src={entry.image}
            alt={entry.title[lang]}
            fill
            sizes="(min-width: 768px) 180px, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="min-w-0 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs leading-6 text-[color:var(--muted)]">
          <span className="border border-[color:var(--border)] px-2 py-1 text-[color:var(--gold-dark)]">
            {entry.category[lang]}
          </span>
          <span>{formatDisplayDate(entry.date, lang)}</span>
          {entry.readTime ? (
            <span className="inline-flex items-center gap-1">
              <Clock3 aria-hidden size={13} />
              {entry.readTime[lang]}
            </span>
          ) : null}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="break-words font-serif text-2xl font-light leading-snug md:text-3xl">
              {entry.title[lang]}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{entry.excerpt[lang]}</p>
          </div>
          <ArrowRight aria-hidden size={17} className="mt-2 shrink-0 text-[color:var(--gold)] transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export function ContentListing({ lang, kind, copy, entries, allEntries, filters, pagination }: ContentListingProps) {
  const featured = entries.find((entry) => entry.featured) ?? entries[0];
  const rest = entries.filter((entry) => entry.slug !== featured?.slug);
  const emptyVisible = entries.length === 0;
  const pageNumbers = Array.from({ length: pagination.totalPages }, (_, index) => index + 1);

  return (
    <div className="overflow-hidden">
      <section className="border-b border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
            <Link href={localizedPath(lang)} className="hover:text-[color:var(--gold-dark)]">
              {copy.banner.breadcrumbHome}
            </Link>
            <ChevronRight aria-hidden size={14} className="text-[color:var(--gold)]" />
            <span className="text-[color:var(--ink)]">{copy.banner.title}</span>
          </nav>
          <div className="mt-10 grid gap-7 md:grid-cols-[0.7fr_1fr] md:items-end">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.34em] text-[color:var(--gold)]">{copy.banner.eyebrow}</p>
              <h1 className="mt-4 break-words font-serif text-4xl font-light tracking-[0.14em] md:text-6xl">
                {copy.banner.title}
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-[color:var(--muted)] md:justify-self-end md:text-base">
              {copy.banner.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="min-w-0">
          {featured && !emptyVisible ? (
            <FeaturedArticle lang={lang} kind={kind} copy={copy} entry={featured} />
          ) : (
            <div className="border border-[color:var(--border)] bg-[color:var(--paper)] px-6 py-12 text-center">
              <p className="font-serif text-3xl font-light">{copy.empty.title}</p>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[color:var(--muted)]">{copy.empty.text}</p>
              <Link
                href={localizedPath(lang, `/${kind}`)}
                className="mt-7 inline-flex min-h-11 items-center border border-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-[color:var(--gold-dark)]"
              >
                {copy.empty.action}
              </Link>
            </div>
          )}

          <div className="mt-10 border-y border-[color:var(--border)] py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-serif text-3xl font-light">{copy.labels.latest}</h2>
              <p className="text-sm text-[color:var(--muted)]">
                <span className="font-serif text-3xl text-[color:var(--gold-dark)]">{pagination.totalItems}</span>{" "}
                {kind === "blog" ? copy.controls.categories : copy.controls.archives}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {rest.map((entry) => (
              <ArticleListItem key={entry.slug} lang={lang} kind={kind} entry={entry} />
            ))}
          </div>
          {!emptyVisible ? (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Link
                href={contentHref(lang, kind, filters, { page: Math.max(1, pagination.page - 1) })}
                aria-disabled={pagination.page <= 1}
                className={`hidden min-h-11 border border-[color:var(--border)] px-4 text-sm sm:inline-flex sm:items-center ${
                  pagination.page <= 1 ? "pointer-events-none text-[color:var(--muted)] opacity-45" : "text-[color:var(--ink)]"
                }`}
              >
                Previous
              </Link>
              {pageNumbers.map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={contentHref(lang, kind, filters, { page: pageNumber })}
                  className={`flex size-11 items-center justify-center border text-sm ${
                    pageNumber === pagination.page
                      ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-white"
                      : "border-[color:var(--border)] bg-[color:var(--paper)] text-[color:var(--ink)]"
                  }`}
                >
                  {pageNumber}
                </Link>
              ))}
              <Link
                href={contentHref(lang, kind, filters, { page: Math.min(pagination.totalPages, pagination.page + 1) })}
                aria-disabled={pagination.page >= pagination.totalPages}
                className={`inline-flex min-h-11 items-center border border-[color:var(--border)] px-4 text-sm ${
                  pagination.page >= pagination.totalPages ? "pointer-events-none text-[color:var(--muted)] opacity-45" : "text-[color:var(--ink)]"
                }`}
              >
                Next
              </Link>
            </div>
          ) : null}
        </div>

        <FilterPanel lang={lang} kind={kind} copy={copy} entries={allEntries} filters={filters} />
      </section>
    </div>
  );
}
