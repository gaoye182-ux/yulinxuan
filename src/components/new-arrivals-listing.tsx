import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Filter, SlidersHorizontal } from "lucide-react";
import { CollectionItemCard } from "@/components/collection-listing";
import type { Language } from "@/lib/i18n";
import { queryString, type ArrivalFilters, type Pagination } from "@/lib/listing-filters";
import { localizedPath } from "@/lib/navigation";
import {
  collectionCategories,
  type CollectionCopy,
  type CollectionItem
} from "@/lib/collection-data";

export type NewArrivalsCopy = {
  seoTitle: string;
  seoDescription: string;
  banner: {
    eyebrow: string;
    title: string;
    subtitle: string;
    breadcrumbHome: string;
  };
  featured: {
    eyebrow: string;
    title: string;
    cta: string;
  };
  filters: {
    title: string;
    all: string;
    new: string;
    featured: string;
    categories: string;
    sort: string;
    latest: string;
    recommended: string;
    name: string;
  };
  empty: {
    title: string;
    text: string;
    action: string;
  };
  pagination: {
    previous: string;
    next: string;
  };
};

const visibleCategoryKeys = ["japanese", "korean", "chinese", "furniture", "craft"] as const;

function chipClass(active = false) {
  return `inline-flex min-h-11 shrink-0 items-center border px-4 text-sm transition ${
    active
      ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-white"
      : "border-[color:var(--border)] bg-[color:var(--paper)] text-[color:var(--ink)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
  }`;
}

function arrivalsHref(lang: Language, filters: ArrivalFilters, override: Partial<ArrivalFilters> = {}) {
  return `${localizedPath(lang, "/new-arrivals")}${queryString({ ...filters, ...override })}`;
}

export function NewArrivalsListing({
  lang,
  copy,
  collectionCopy,
  items,
  featuredItem,
  totalItems,
  filters,
  pagination
}: {
  lang: Language;
  copy: NewArrivalsCopy;
  collectionCopy: CollectionCopy;
  items: CollectionItem[];
  featuredItem?: CollectionItem;
  totalItems: number;
  filters: ArrivalFilters;
  pagination: Pagination;
}) {
  const emptyVisible = items.length === 0;
  const featuredImage = featuredItem?.images.find((image) => image.isPrimary) ?? featuredItem?.images[0];
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
            <div>
              <p className="text-xs tracking-[0.34em] text-[color:var(--gold)]">
                {copy.banner.eyebrow}
              </p>
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

      {featuredItem && featuredImage ? (
        <section className="mx-auto max-w-7xl px-5 py-10 md:py-14 lg:px-8">
          <div className="grid overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)] lg:grid-cols-[1.12fr_0.88fr]">
            <Link
              href={localizedPath(lang, `/item/${featuredItem.slug}`)}
              className="group relative min-h-[320px] overflow-hidden bg-[color:var(--ivory-dark)] md:min-h-[440px]"
            >
              <Image
                src={featuredImage.url}
                alt={featuredImage.alt?.[lang] ?? featuredItem.name[lang]}
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(44,36,22,0.72)] to-transparent p-5 text-white md:p-8">
                <p className="text-xs tracking-[0.3em]">{copy.featured.eyebrow}</p>
              </div>
            </Link>
            <div className="flex min-w-0 flex-col justify-center p-6 md:p-10">
              <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">
                {copy.featured.title}
              </p>
              <h2 className="mt-4 break-words font-serif text-3xl font-light leading-tight text-[color:var(--ink)] md:text-5xl">
                {featuredItem.name[lang]}
              </h2>
              <dl className="mt-7 grid gap-3 border-y border-[color:var(--border)] py-5 text-sm leading-6">
                <div className="grid grid-cols-[4em_1fr] gap-4">
                  <dt className="text-[color:var(--gold-dark)]">{collectionCopy.card.era}</dt>
                  <dd className="min-w-0 break-words text-[color:var(--ink)]">
                    {featuredItem.era[lang]}
                  </dd>
                </div>
                <div className="grid grid-cols-[4em_1fr] gap-4">
                  <dt className="text-[color:var(--gold-dark)]">{collectionCopy.card.origin}</dt>
                  <dd className="min-w-0 break-words text-[color:var(--ink)]">
                    {featuredItem.origin[lang]}
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-sm leading-8 text-[color:var(--muted)] md:text-base">
                {featuredItem.description[lang]}
              </p>
              <Link
                href={localizedPath(lang, `/item/${featuredItem.slug}`)}
                className="mt-8 inline-flex min-h-12 w-fit items-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]"
              >
                {copy.featured.cta}
                <ArrowRight aria-hidden size={16} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-5 pb-12 md:pb-16 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[color:var(--border)] py-5">
          <div className="inline-flex items-center gap-3 text-sm tracking-[0.18em] text-[color:var(--ink)]">
            <Filter aria-hidden size={17} className="text-[color:var(--gold-dark)]" />
            {copy.filters.title}
          </div>
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.18em] text-[color:var(--gold-dark)]">
            <SlidersHorizontal aria-hidden size={15} />
            {copy.filters.sort}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={arrivalsHref(lang, filters, { flag: "all", page: 1 })} className={chipClass(filters.flag === "all")}>
            {copy.filters.all}
          </Link>
          <Link href={arrivalsHref(lang, filters, { flag: "new", page: 1 })} className={chipClass(filters.flag === "new")}>
            {copy.filters.new}
          </Link>
          <Link href={arrivalsHref(lang, filters, { flag: "featured", page: 1 })} className={chipClass(filters.flag === "featured")}>
            {copy.filters.featured}
          </Link>
        </div>

        <div className="mt-5">
          <p className="text-xs tracking-[0.2em] text-[color:var(--gold-dark)]">
            {copy.filters.categories}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {visibleCategoryKeys.map((key) => {
              const category = collectionCategories.find((entry) => entry.key === key);
              return category ? (
                <Link
                  key={key}
                  href={arrivalsHref(lang, filters, { category: category.slug, page: 1 })}
                  className={chipClass(filters.category === category.slug || filters.category === category.key)}
                >
                  {category.name[lang]}
                </Link>
              ) : null;
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-3 border border-[color:var(--border)] bg-[rgba(255,253,248,0.72)] p-4 sm:grid-cols-3">
          {[
            { value: "latest" as const, label: copy.filters.latest },
            { value: "recommended" as const, label: copy.filters.recommended },
            { value: "name" as const, label: copy.filters.name }
          ].map((option) => (
            <Link
              key={option.value}
              href={arrivalsHref(lang, filters, { sort: option.value, page: 1 })}
              className={`min-h-11 border px-4 text-sm transition ${
                filters.sort === option.value
                  ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-white"
                  : "border-[color:var(--border)] bg-[color:var(--paper)] text-[color:var(--ink)] hover:border-[color:var(--gold)]"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 text-sm text-[color:var(--muted)]">
          <p>
            <span className="font-serif text-2xl text-[color:var(--gold-dark)]">{pagination.totalItems}</span>{" "}
            / {totalItems}
          </p>
        </div>

        <div className={emptyVisible ? "hidden" : "mt-6 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3"}>
          {items.map((item) => (
            <CollectionItemCard key={item.slug} lang={lang} copy={collectionCopy} item={item} />
          ))}
        </div>

        <div className={emptyVisible ? "hidden" : "mt-10 flex items-center justify-center gap-2"}>
          <Link
            href={arrivalsHref(lang, filters, { page: Math.max(1, pagination.page - 1) })}
            aria-disabled={pagination.page <= 1}
            className={`hidden min-h-11 border border-[color:var(--border)] px-4 text-sm sm:inline-flex sm:items-center ${
              pagination.page <= 1 ? "pointer-events-none text-[color:var(--muted)] opacity-45" : "text-[color:var(--ink)]"
            }`}
          >
            {copy.pagination.previous}
          </Link>
          {pageNumbers.map((pageNumber) => (
            <Link
              key={pageNumber}
              href={arrivalsHref(lang, filters, { page: pageNumber })}
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
            href={arrivalsHref(lang, filters, { page: Math.min(pagination.totalPages, pagination.page + 1) })}
            aria-disabled={pagination.page >= pagination.totalPages}
            className={`inline-flex min-h-11 items-center border border-[color:var(--border)] px-4 text-sm ${
              pagination.page >= pagination.totalPages ? "pointer-events-none text-[color:var(--muted)] opacity-45" : "text-[color:var(--ink)]"
            }`}
          >
            {copy.pagination.next}
          </Link>
        </div>

        <div className={emptyVisible ? "mt-12" : "hidden"}>
          <div className="mx-auto max-w-2xl border border-[color:var(--border)] bg-[color:var(--paper)] px-6 py-12 text-center">
            <p className="font-serif text-3xl font-light text-[color:var(--ink)]">
              {copy.empty.title}
            </p>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[color:var(--muted)]">
              {copy.empty.text}
            </p>
            <Link
              href={localizedPath(lang, "/collection")}
              className="mt-7 inline-flex min-h-11 items-center border border-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-[color:var(--gold-dark)]"
            >
              {copy.empty.action}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
