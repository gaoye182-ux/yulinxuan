import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, ChevronRight, MessageCircle, ScrollText } from "lucide-react";
import { ItemGallery } from "@/components/item-gallery";
import {
  collectionCategories,
  collectionCopy,
  getCategoryByKey,
  collectionItems
} from "@/lib/collection-data";
import { getCachedSiteSettings, pageMetadata } from "@/lib/frontend-site";
import { getCollectionItemBySlugWithFallback, getRelatedCollectionItemsWithFallback } from "@/lib/collection-repository";
import { getLanguage, languages } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";

export function generateStaticParams() {
  return languages.flatMap((lang) =>
    collectionItems.map((item) => ({ lang, slug: item.slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = getLanguage(rawLang);
  const settings = await getCachedSiteSettings();
  const item = await getCollectionItemBySlugWithFallback(slug);

  if (!item) {
    return {};
  }

  const title = `${item.name[lang]} | ${collectionCopy[lang].detail.collection} | 玉林軒株式会社`;
  const description = item.description[lang];
  const path = `/item/${item.slug}`;

  return pageMetadata({ settings, lang, path, title, description, image: item.images[0].url });
}

export default async function ItemDetailPage({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = getLanguage(rawLang);
  const item = await getCollectionItemBySlugWithFallback(slug);

  if (!item) {
    notFound();
  }

  const copy = collectionCopy[lang];
  const category = item.categoryName
    ? { ...(getCategoryByKey(item.category) ?? collectionCategories[0]), name: item.categoryName, slug: item.categorySlug ?? item.category }
    : getCategoryByKey(item.category) ?? collectionCategories[0];
  const relatedItems = await getRelatedCollectionItemsWithFallback(item);
  const itemPath = `/item/${item.slug}`;
  const categoryPath = `/collection/${category.slug}`;
  const visiblePrice = item.priceDisplay === "visible" && item.price;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name[lang],
    image: item.images.map((image) => image.url),
    description: item.description[lang],
    category: category.name[lang],
    brand: {
      "@type": "Organization",
      name: "玉林軒株式会社"
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: item.currency ?? "JPY",
      ...(visiblePrice ? { price: String(item.price) } : {}),
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: item.currency ?? "JPY",
        ...(visiblePrice ? { price: String(item.price) } : {}),
        valueAddedTaxIncluded: true
      }
    }
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: copy.banner.breadcrumbHome,
        item: `/${lang}`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: copy.detail.collection,
        item: `/${lang}/collection`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name[lang],
        item: `/${lang}${categoryPath}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: item.name[lang],
        item: `/${lang}${itemPath}`
      }
    ]
  };

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="border-b border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
            <Link href={localizedPath(lang)} className="hover:text-[color:var(--gold-dark)]">
              {copy.banner.breadcrumbHome}
            </Link>
            <ChevronRight aria-hidden size={14} className="text-[color:var(--gold)]" />
            <Link
              href={localizedPath(lang, "/collection")}
              className="hover:text-[color:var(--gold-dark)]"
            >
              {copy.detail.collection}
            </Link>
            <ChevronRight aria-hidden size={14} className="text-[color:var(--gold)]" />
            <Link
              href={localizedPath(lang, categoryPath)}
              className="hover:text-[color:var(--gold-dark)]"
            >
              {category.name[lang]}
            </Link>
            <ChevronRight aria-hidden size={14} className="text-[color:var(--gold)]" />
            <span className="text-[color:var(--ink)]">{item.name[lang]}</span>
          </nav>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <ItemGallery
          images={item.images}
          lang={lang}
          fallbackAlt={item.name[lang]}
          thumbnailsLabel={copy.detail.thumbnails}
        />

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">
            {category.name[lang]}
          </p>
          <h1 className="mt-4 break-words font-serif text-4xl font-light leading-tight text-[color:var(--ink)] md:text-5xl">
            {item.name[lang]}
          </h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag.en}
                className="border border-[color:var(--border)] bg-[color:var(--paper)] px-3 py-1 text-xs text-[color:var(--muted)]"
              >
                {tag[lang]}
              </span>
            ))}
          </div>

          <dl className="mt-8 divide-y divide-[color:var(--border)] border-y border-[color:var(--border)] bg-[rgba(255,253,248,0.68)]">
            {[
              [copy.detail.category, category.name[lang]],
              [copy.detail.era, item.era[lang]],
              [copy.detail.origin, item.origin[lang]],
              [copy.detail.artist, item.artist[lang]],
              [copy.detail.dimensions, item.dimensions],
              [copy.detail.condition, item.condition[lang]],
              [copy.detail.priceStatus, item.priceStatus[lang]]
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[6.5em_1fr] gap-4 px-4 py-4 text-sm">
                <dt className="text-[color:var(--gold-dark)]">{label}</dt>
                <dd className="min-w-0 break-words leading-6 text-[color:var(--ink)]">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href={localizedPath(lang, "/contact")}
              className="inline-flex min-h-12 items-center justify-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.12em] text-white transition hover:bg-[color:var(--gold-dark)]"
            >
              <MessageCircle size={17} />
              {copy.detail.inquiry}
            </Link>
            <Link
              href={localizedPath(lang, "/appraisal")}
              className="inline-flex min-h-12 items-center justify-center gap-3 border border-[color:var(--border)] bg-[color:var(--paper)] px-5 text-sm tracking-[0.12em] text-[color:var(--ink)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
            >
              <ScrollText size={17} />
              {copy.detail.appraisal}
            </Link>
          </div>
        </aside>
      </section>

      <section className="bg-[color:var(--paper)] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">DETAIL</p>
            <h2 className="mt-3 font-serif text-3xl font-light">{copy.detail.description}</h2>
          </div>
          <div className="text-sm leading-8 text-[color:var(--muted)] md:text-base">
            <p>{item.description[lang]}</p>
            <div className="mt-10 border border-[color:var(--border)] bg-[color:var(--ivory)] p-5">
              <h3 className="font-serif text-2xl font-light text-[color:var(--ink)]">
                {copy.detail.notes}
              </h3>
              <ul className="mt-4 grid gap-3 text-sm leading-7">
                {item.notes.map((note) => (
                  <li key={note.en} className="border-l border-[color:var(--gold)] pl-4">
                    {note[lang]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">RELATED</p>
            <h2 className="mt-3 font-serif text-3xl font-light">{copy.detail.related}</h2>
          </div>
          <Link
            href={localizedPath(lang, categoryPath)}
            className="hidden items-center gap-2 text-sm text-[color:var(--gold-dark)] md:inline-flex"
          >
            {category.name[lang]}
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3">
          {relatedItems.map((related) => (
            <Link
              key={related.slug}
              href={localizedPath(lang, `/item/${related.slug}`)}
              className="group min-w-0 border border-[color:var(--border)] bg-[color:var(--paper)] transition hover:-translate-y-1 hover:border-[color:var(--gold)] hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--ivory-dark)]">
                <Image
                  src={related.images[0].url}
                  alt={related.images[0].alt?.[lang] ?? related.name[lang]}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-3 md:p-5">
                <h3 className="break-words font-serif text-lg font-light md:text-2xl">
                  {related.name[lang]}
                </h3>
                <p className="mt-3 text-xs leading-5 text-[color:var(--muted)] md:text-sm">
                  {related.era[lang]} / {related.origin[lang]}
                </p>
                <p className="mt-4 border-t border-[color:var(--border)] pt-3 text-xs tracking-[0.14em] text-[color:var(--gold-dark)]">
                  {related.priceStatus[lang]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
