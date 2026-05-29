import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { languages, localize, type Language } from "@/lib/i18n";
import { getSiteSettings, type SiteSettings } from "@/lib/site-settings";

export const siteSettingsCacheTag = "site-settings";

export const getCachedSiteSettings = unstable_cache(
  async () => getSiteSettings(),
  ["site-settings"],
  { revalidate: 300, tags: [siteSettingsCacheTag] }
);

function normalizeBaseUrl(value?: string) {
  const raw = value?.trim().replace(/\/$/, "");

  if (!raw) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const parsed = new URL(withProtocol);

  if (["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
    return "";
  }

  return withProtocol;
}

export function siteBaseUrl(settings: SiteSettings) {
  return (
    normalizeBaseUrl(settings.seo.canonicalBaseUrl) ||
    normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeBaseUrl(process.env.NEXTAUTH_URL) ||
    normalizeBaseUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeBaseUrl(process.env.VERCEL_URL) ||
    "http://localhost:3001"
  );
}

export function absoluteUrl(settings: SiteSettings, path = "") {
  const baseUrl = siteBaseUrl(settings);
  let normalized = path.startsWith("/") ? path : `/${path}`;
  if (settings.seo.canonicalTrailingSlash && !normalized.endsWith("/") && !/\.[a-z0-9]+$/i.test(normalized)) {
    normalized = `${normalized}/`;
  }

  return `${baseUrl}${normalized}`;
}

export function localizedAbsoluteUrl(settings: SiteSettings, lang: Language, path = "") {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

  return absoluteUrl(settings, `/${lang}${normalized}`);
}

export function languageAlternates(settings: SiteSettings, path = "") {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

  return Object.fromEntries([
    ...languages.map((lang) => [lang, localizedAbsoluteUrl(settings, lang, normalized)]),
    ["x-default", localizedAbsoluteUrl(settings, "ja", normalized)]
  ]);
}

export function defaultOgImage(settings: SiteSettings) {
  const image = settings.seo.ogImage.trim();

  if (!image) {
    return undefined;
  }

  return image.startsWith("http") ? image : absoluteUrl(settings, image);
}

export function pageMetadata({
  settings,
  lang,
  path = "",
  title,
  description,
  image,
  type = "website"
}: {
  settings: SiteSettings;
  lang: Language;
  path?: string;
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const pageTitle = title?.trim() || localize(settings.seo.defaultTitle, lang);
  const pageDescription = description?.trim() || localize(settings.seo.defaultDescription, lang);
  const ogImage = image || defaultOgImage(settings);
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const noindex = (settings.seo.noindexPaths ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .some((rule) => {
      const pattern = rule.endsWith("*") ? rule.slice(0, -1) : rule;
      return rule.endsWith("*") ? normalizedPath.startsWith(pattern) : normalizedPath === pattern;
    });

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: localize(settings.seo.defaultKeywords, lang),
    robots: noindex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: localizedAbsoluteUrl(settings, lang, path),
      languages: languageAlternates(settings, path)
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type,
      url: localizedAbsoluteUrl(settings, lang, path),
      images: ogImage ? [ogImage] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: ogImage ? [ogImage] : undefined
    }
  };
}

export function telHref(phone: string) {
  const compact = phone.replace(/[^\d+]/g, "");

  return compact ? `tel:${compact}` : undefined;
}

export function mapSearchUrl(settings: SiteSettings, lang: Language, provider: "google" | "apple" = "google") {
  const configured = settings.contact.mapUrl.trim();

  if (provider === "google" && configured && !configured.includes("output=embed")) {
    return configured;
  }

  const query = encodeURIComponent(localize(settings.contact.address, lang) || localize(settings.company.legalName, lang));

  return provider === "apple"
    ? `https://maps.apple.com/?q=${query}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function mapEmbedUrl(settings: SiteSettings, lang: Language) {
  const configured = settings.contact.mapUrl.trim();

  if (configured.includes("google.com/maps") && (configured.includes("output=embed") || configured.includes("/embed"))) {
    return configured;
  }

  const query = encodeURIComponent(localize(settings.contact.address, lang) || localize(settings.company.legalName, lang));

  return `https://www.google.com/maps?q=${query}&output=embed`;
}

export function localBusinessJsonLd(settings: SiteSettings, lang: Language, path = "") {
  const image = defaultOgImage(settings);

  return {
    "@context": "https://schema.org",
    "@type": "AntiquesStore",
    name: localize(settings.company.legalName, lang),
    alternateName: localize(settings.company.name, lang),
    url: localizedAbsoluteUrl(settings, lang, path),
    image,
    ...(settings.contact.phone ? { telephone: settings.contact.phone } : {}),
    ...(settings.contact.email ? { email: settings.contact.email } : {}),
    address: localize(settings.contact.address, lang),
    openingHours: localize(settings.businessHours.weekdays, lang),
    description: localize(settings.seo.defaultDescription, lang)
  };
}
