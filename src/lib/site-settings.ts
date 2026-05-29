import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { languages, type Language } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export type LocalizedText = Record<Language, string>;

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

const localizedTextSchema = z.object({
  ja: z.string(),
  zh: z.string(),
  en: z.string()
});

export const siteSettingsSchema = z.object({
  company: z.object({
    name: localizedTextSchema,
    legalName: localizedTextSchema,
    tagline: localizedTextSchema,
    registration: z.string(),
    foundingYear: z.string()
  }),
  contact: z.object({
    address: localizedTextSchema,
    phone: z.string(),
    email: z.string().email().or(z.literal("")),
    lineUrl: z.string(),
    mapUrl: z.string()
  }),
  businessHours: z.object({
    weekdays: localizedTextSchema,
    holidays: localizedTextSchema,
    note: localizedTextSchema
  }),
  seo: z.object({
    defaultTitle: localizedTextSchema,
    defaultDescription: localizedTextSchema,
    defaultKeywords: localizedTextSchema,
    ogImage: z.string(),
    canonicalBaseUrl: z.string(),
    canonicalTrailingSlash: z.boolean(),
    noindexPaths: z.string(),
    redirectRules: z.string()
  }),
  robots: z.object({
    enabled: z.boolean(),
    rules: z.string(),
    disallowAdmin: z.boolean()
  }),
  sitemap: z.object({
    enabled: z.boolean(),
    includeBlog: z.boolean(),
    includeNews: z.boolean(),
    includeItems: z.boolean()
  }),
  security: z.object({
    maxFailedLogins: z.number().int().min(3).max(20),
    lockMinutes: z.number().int().min(1).max(1440),
    sessionMaxAgeHours: z.number().int().min(1).max(720),
    requireStrongPassword: z.boolean(),
    requireTotpForAdmins: z.boolean()
  })
});

export const defaultSiteSettings: SiteSettings = {
  company: {
    name: { ja: "玉林軒", zh: "玉林轩", en: "Gyokurinken" },
    legalName: { ja: "玉林軒株式会社", zh: "玉林轩株式会社", en: "Gyokurinken Co., Ltd." },
    tagline: { ja: "古の美を、未来へ紡ぐ。", zh: "传承古典之美，编织未来。", en: "Bridging the Beauty of the Past to the Future." },
    registration: "京都府公安委員会 第611092430039号",
    foundingYear: "令和5年6月6日"
  },
  contact: {
    address: {
      ja: "京都府京都市伏見区深草下川原町130番地4 華信ビル201号",
      zh: "京都府京都市伏见区深草下川原町130番地4 华信ビル201号",
      en: "Kashin Building 201, 130-4 Fukakusa Shimogawaracho, Fushimi-ku, Kyoto-shi, Kyoto"
    },
    phone: "",
    email: "",
    lineUrl: "",
    mapUrl: ""
  },
  businessHours: {
    weekdays: { ja: "11:00 - 18:00", zh: "11:00 - 18:00", en: "11:00 - 18:00" },
    holidays: { ja: "水曜日 / 年末年始", zh: "周三 / 年末年初", en: "Wednesday / Year-end holidays" },
    note: { ja: "ご来店前にご予約ください。", zh: "到店前请预约。", en: "Please make an appointment before visiting." }
  },
  seo: {
    defaultTitle: { ja: "玉林軒株式会社 | 骨董・古美術", zh: "玉林轩株式会社 | 骨董古美术", en: "Gyokurinken Co., Ltd. | Antiques & Fine Art" },
    defaultDescription: {
      ja: "骨董・古美術の鑑定、買取、販売を行う玉林軒株式会社の公式サイトです。",
      zh: "玉林轩株式会社官方网站，提供骨董古美术鉴定、收购与销售。",
      en: "Official website of Gyokurinken Co., Ltd., offering appraisal, purchase, and sales of antiques and fine art."
    },
    defaultKeywords: { ja: "骨董,古美術,鑑定,買取", zh: "骨董,古美术,鉴定,收购", en: "antiques,fine art,appraisal,purchase" },
    ogImage: "/og-default.jpg",
    canonicalBaseUrl: "http://localhost:3001",
    canonicalTrailingSlash: false,
    noindexPaths: "/admin\n/admin/*",
    redirectRules: ""
  },
  robots: {
    enabled: true,
    rules: "User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: http://localhost:3001/sitemap.xml",
    disallowAdmin: true
  },
  sitemap: {
    enabled: true,
    includeBlog: true,
    includeNews: true,
    includeItems: true
  },
  security: {
    maxFailedLogins: 5,
    lockMinutes: 15,
    sessionMaxAgeHours: 24,
    requireStrongPassword: true,
    requireTotpForAdmins: false
  }
};

const legacyBusinessHours = {
  weekdays: { ja: "10:00-18:00", zh: "10:00-18:00", en: "10:00-18:00" },
  holidays: { ja: "日曜・祝日", zh: "周日及日本法定假日", en: "Sundays and national holidays" }
} satisfies Partial<SiteSettings["businessHours"]>;

function replaceLegacyLocalized(
  value: SiteSettings["businessHours"]["weekdays"],
  legacy: SiteSettings["businessHours"]["weekdays"],
  replacement: SiteSettings["businessHours"]["weekdays"]
) {
  return languages.every((lang) => value[lang] === legacy[lang]) ? replacement : value;
}

export function mergeSiteSettings(value: unknown): SiteSettings {
  const incoming = value && typeof value === "object" && !Array.isArray(value) ? (value as Partial<SiteSettings>) : {};
  const merged = {
    company: { ...defaultSiteSettings.company, ...incoming.company },
    contact: { ...defaultSiteSettings.contact, ...incoming.contact },
    businessHours: { ...defaultSiteSettings.businessHours, ...incoming.businessHours },
    seo: { ...defaultSiteSettings.seo, ...incoming.seo },
    robots: { ...defaultSiteSettings.robots, ...incoming.robots },
    sitemap: { ...defaultSiteSettings.sitemap, ...incoming.sitemap },
    security: { ...defaultSiteSettings.security, ...incoming.security }
  };
  const parsed = siteSettingsSchema.safeParse(merged);

  if (!parsed.success) {
    return defaultSiteSettings;
  }

  return {
    ...parsed.data,
    businessHours: {
      ...parsed.data.businessHours,
      weekdays: replaceLegacyLocalized(parsed.data.businessHours.weekdays, legacyBusinessHours.weekdays, defaultSiteSettings.businessHours.weekdays),
      holidays: replaceLegacyLocalized(parsed.data.businessHours.holidays, legacyBusinessHours.holidays, defaultSiteSettings.businessHours.holidays)
    }
  };
}

export async function getSiteSettings() {
  try {
    const record = await prisma.siteSetting.findUnique({ where: { key: "site" } });
    return mergeSiteSettings(record?.value);
  } catch {
    return defaultSiteSettings;
  }
}

export async function saveSiteSettings(settings: SiteSettings) {
  return prisma.siteSetting.upsert({
    where: { key: "site" },
    create: { key: "site", value: settings as unknown as Prisma.InputJsonValue },
    update: { value: settings as unknown as Prisma.InputJsonValue }
  });
}

export async function getLoginSecurityPolicy() {
  const settings = await getSiteSettings();

  return settings.security;
}
