import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Filter, Search, SlidersHorizontal } from "lucide-react";
import type { Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";
import { queryString, type CollectionFilters, type Pagination } from "@/lib/listing-filters";
import {
  categoryOrder,
  collectionCategories,
  type CategoryKey,
  type CollectionCopy,
  type CollectionItem
} from "@/lib/collection-data";

type CollectionListingProps = {
  lang: Language;
  copy: CollectionCopy;
  title: string;
  subtitle: string;
  items: CollectionItem[];
  totalItems: number;
  activeCategory?: CategoryKey;
  basePath: string;
  filters: CollectionFilters;
  pagination: Pagination;
};

type CollectionItemCardProps = {
  lang: Language;
  copy: Pick<CollectionCopy, "card">;
  item: CollectionItem;
};

function SelectField({
  label,
  name,
  value,
  options
}: {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="grid gap-2 text-xs tracking-[0.12em] text-[color:var(--gold-dark)]">
      {label}
      <select
        name={name}
        defaultValue={value}
        className="h-11 w-full min-w-0 border border-[color:var(--border)] bg-[color:var(--paper)] px-3 text-sm tracking-normal text-[color:var(--ink)] outline-none transition hover:border-[color:var(--gold)]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function collectionHref(lang: Language, basePath: string, filters: CollectionFilters, override: Partial<CollectionFilters> = {}) {
  const next = { ...filters, ...override };
  return `${localizedPath(lang, basePath)}${queryString(next)}`;
}

export function CollectionItemCard({ lang, copy, item }: CollectionItemCardProps) {
  const category = collectionCategories.find((entry) => entry.key === item.category);
  const primaryImage = item.images.find((image) => image.isPrimary) ?? item.images[0];
  const categoryName = item.categoryName?.[lang] ?? category?.name[lang];

  return (
    <Link
      href={localizedPath(lang, `/item/${item.slug}`)}
      className="group min-w-0 border border-[color:var(--border)] bg-[color:var(--paper)] transition hover:-translate-y-1 hover:border-[color:var(--gold)] hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--ivory-dark)]">
        <Image
          src={primaryImage.url}
          alt={primaryImage.alt?.[lang] ?? item.name[lang]}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 bg-[rgba(255,253,248,0.92)] px-3 py-1 text-[11px] tracking-[0.14em] text-[color:var(--gold-dark)]">
          {categoryName}
        </div>
      </div>
      <div className="min-w-0 p-3 md:p-5">
        <h2 className="break-words font-serif text-lg font-light leading-snug text-[color:var(--ink)] md:text-2xl">
          {item.name[lang]}
        </h2>
        <dl className="mt-4 grid gap-2 text-xs leading-5 text-[color:var(--muted)] md:text-sm">
          <div className="grid grid-cols-[3.5em_1fr] gap-2">
            <dt className="text-[color:var(--gold-dark)]">{copy.card.era}</dt>
            <dd className="min-w-0 break-words">{item.era[lang]}</dd>
          </div>
          <div className="grid grid-cols-[3.5em_1fr] gap-2">
            <dt className="text-[color:var(--gold-dark)]">{copy.card.origin}</dt>
            <dd className="min-w-0 break-words">{item.origin[lang]}</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag.en}
              className="border border-[color:var(--border)] px-2 py-1 text-[11px] text-[color:var(--muted)]"
            >
              {tag[lang]}
            </span>
          ))}
        </div>
        <p className="mt-4 border-t border-[color:var(--border)] pt-3 text-xs tracking-[0.14em] text-[color:var(--gold-dark)] md:text-sm">
          {item.priceStatus[lang]}
        </p>
      </div>
    </Link>
  );
}

export function CollectionListing({
  lang,
  copy,
  title,
  subtitle,
  items,
  totalItems,
  activeCategory = "all",
  basePath,
  filters,
  pagination
}: CollectionListingProps) {
  const emptyVisible = items.length === 0;
  const pageNumbers = Array.from({ length: pagination.totalPages }, (_, index) => index + 1);
  const resultStart = pagination.totalItems ? (pagination.page - 1) * pagination.pageSize + 1 : 0;
  const resultEnd = Math.min(pagination.page * pagination.pageSize, pagination.totalItems);

  return (
    <div className="overflow-hidden">
      <section className="border-b border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
            <Link href={localizedPath(lang)} className="hover:text-[color:var(--gold-dark)]">
              {copy.banner.breadcrumbHome}
            </Link>
            <ChevronRight aria-hidden size={14} className="text-[color:var(--gold)]" />
            <Link
              href={localizedPath(lang, "/collection")}
              className="hover:text-[color:var(--gold-dark)]"
            >
              {copy.banner.title}
            </Link>
            {activeCategory !== "all" ? (
              <>
                <ChevronRight aria-hidden size={14} className="text-[color:var(--gold)]" />
                <span className="text-[color:var(--ink)]">{title}</span>
              </>
            ) : null}
          </nav>
          <div className="mt-10 grid gap-7 md:grid-cols-[0.7fr_1fr] md:items-end">
            <div>
              <p className="text-xs tracking-[0.34em] text-[color:var(--gold)]">
                {copy.banner.eyebrow}
              </p>
              <h1 className="mt-4 break-words font-serif text-4xl font-light tracking-[0.14em] md:text-6xl">
                {title}
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-[color:var(--muted)] md:justify-self-end md:text-base">
              {subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:py-14 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[color:var(--border)] py-5">
          <div className="inline-flex items-center gap-3 text-sm tracking-[0.18em] text-[color:var(--ink)]">
            <Filter aria-hidden size={17} className="text-[color:var(--gold-dark)]" />
            {copy.filters.title}
          </div>
          <Link
            href={localizedPath(lang, basePath)}
            className="inline-flex min-h-11 items-center border border-[color:var(--border)] px-4 text-xs tracking-[0.16em] text-[color:var(--gold-dark)] transition hover:border-[color:var(--gold)] hover:bg-[color:var(--paper)]"
          >
            {copy.filters.reset}
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categoryOrder.map((categoryKey) => {
            const category = collectionCategories.find((entry) => entry.key === categoryKey);
            if (!category) {
              return null;
            }
            const href =
              category.key === "all"
                ? collectionHref(lang, "/collection", filters, { page: 1 })
                : collectionHref(lang, `/collection/${category.slug}`, filters, { page: 1 });

            return (
              <Link
                key={category.key}
                href={href}
                className={`inline-flex min-h-11 shrink-0 items-center border px-4 text-sm transition ${
                  category.key === activeCategory
                    ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-white"
                    : "border-[color:var(--border)] bg-[color:var(--paper)] text-[color:var(--ink)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
                }`}
              >
                {category.name[lang]}
              </Link>
            );
          })}
        </div>

        <form
          action={localizedPath(lang, basePath)}
          className="mt-5 grid gap-3 border border-[color:var(--border)] bg-[rgba(255,253,248,0.72)] p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_repeat(5,minmax(0,1fr))_auto]"
        >
          <label className="grid gap-2 text-xs tracking-[0.12em] text-[color:var(--gold-dark)]">
            SEARCH
            <span className="relative">
              <Search aria-hidden size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--gold-dark)]" />
              <input
                name="search"
                defaultValue={filters.search}
                placeholder={copy.filters.title}
                className="h-11 w-full min-w-0 border border-[color:var(--border)] bg-[color:var(--paper)] pl-9 pr-3 text-sm tracking-normal text-[color:var(--ink)] outline-none transition placeholder:text-[color:var(--muted)]/65 hover:border-[color:var(--gold)]"
              />
            </span>
          </label>
          <SelectField
            label={copy.filters.era}
            name="era"
            value={filters.era}
            options={[
              { value: "all", label: copy.filters.options.allEra },
              { value: "edo", label: copy.filters.options.edo },
              { value: "meiji", label: copy.filters.options.meiji },
              { value: "joseon", label: copy.filters.options.joseon },
              { value: "china", label: copy.filters.options.china }
            ]}
          />
          <SelectField
            label={copy.filters.origin}
            name="origin"
            value={filters.origin}
            options={[
              { value: "all", label: copy.filters.options.allOrigin },
              { value: "japan", label: copy.filters.options.japan },
              { value: "korea", label: copy.filters.options.korea },
              { value: "china", label: copy.filters.options.chinaOrigin }
            ]}
          />
          <SelectField
            label={copy.filters.price}
            name="price"
            value={filters.price}
            options={[
              { value: "all", label: copy.filters.options.allPrice },
              { value: "inquiry", label: copy.filters.options.inquiry },
              { value: "available", label: copy.filters.options.available }
            ]}
          />
          <SelectField
            label={copy.filters.flag}
            name="flag"
            value={filters.flag}
            options={[
              { value: "all", label: copy.filters.options.allPrice },
              { value: "new", label: copy.filters.options.newOnly },
              { value: "featured", label: copy.filters.options.featuredOnly }
            ]}
          />
          <SelectField
            label={copy.filters.sort}
            name="sort"
            value={filters.sort}
            options={[
              { value: "recommended", label: copy.filters.options.recommended },
              { value: "latest", label: copy.filters.options.latest },
              { value: "name", label: copy.filters.options.name }
            ]}
          />
          <button className="min-h-11 self-end border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 text-sm tracking-[0.14em] text-white transition hover:bg-[color:var(--gold-dark)]">
            {copy.filters.title}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between gap-4 text-sm text-[color:var(--muted)]">
          <p>
            <span className="font-serif text-2xl text-[color:var(--gold-dark)]">{pagination.totalItems}</span>{" "}
            / {totalItems}
            {pagination.totalItems ? (
              <span className="ml-2 text-xs">
                ({resultStart}-{resultEnd})
              </span>
            ) : null}
          </p>
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.18em] text-[color:var(--gold-dark)]">
            <SlidersHorizontal aria-hidden size={15} />
            {copy.filters.sort}
          </div>
        </div>

        <div className={emptyVisible ? "hidden" : "mt-6 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3"}>
          {items.map((item) => (
            <CollectionItemCard key={item.slug} lang={lang} copy={copy} item={item} />
          ))}
        </div>

        <div className={emptyVisible ? "hidden" : "mt-10 flex items-center justify-center gap-2"}>
          <Link
            href={collectionHref(lang, basePath, filters, { page: Math.max(1, pagination.page - 1) })}
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
              href={collectionHref(lang, basePath, filters, { page: pageNumber })}
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
            href={collectionHref(lang, basePath, filters, { page: Math.min(pagination.totalPages, pagination.page + 1) })}
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
