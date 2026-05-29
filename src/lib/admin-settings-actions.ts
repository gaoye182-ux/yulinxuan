"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { SiteSettings } from "@/lib/site-settings";
import { requirePermission } from "@/lib/admin-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { siteSettingsCacheTag } from "@/lib/frontend-site";
import { getSiteSettings, saveSiteSettings, siteSettingsSchema } from "@/lib/site-settings";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function bool(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function intValue(formData: FormData, name: string, fallback: number) {
  const value = Number.parseInt(text(formData, name), 10);
  return Number.isFinite(value) ? value : fallback;
}

function localized(formData: FormData, prefix: string) {
  return {
    ja: text(formData, `${prefix}.ja`),
    zh: text(formData, `${prefix}.zh`),
    en: text(formData, `${prefix}.en`)
  };
}

function parseSettings(formData: FormData): SiteSettings {
  return siteSettingsSchema.parse({
    company: {
      name: localized(formData, "company.name"),
      legalName: localized(formData, "company.legalName"),
      tagline: localized(formData, "company.tagline"),
      registration: text(formData, "company.registration"),
      foundingYear: text(formData, "company.foundingYear")
    },
    contact: {
      address: localized(formData, "contact.address"),
      phone: text(formData, "contact.phone"),
      email: text(formData, "contact.email"),
      lineUrl: text(formData, "contact.lineUrl"),
      mapUrl: text(formData, "contact.mapUrl")
    },
    businessHours: {
      weekdays: localized(formData, "businessHours.weekdays"),
      holidays: localized(formData, "businessHours.holidays"),
      note: localized(formData, "businessHours.note")
    },
    seo: {
      defaultTitle: localized(formData, "seo.defaultTitle"),
      defaultDescription: localized(formData, "seo.defaultDescription"),
      defaultKeywords: localized(formData, "seo.defaultKeywords"),
      ogImage: text(formData, "seo.ogImage"),
      canonicalBaseUrl: text(formData, "seo.canonicalBaseUrl"),
      canonicalTrailingSlash: bool(formData, "seo.canonicalTrailingSlash"),
      noindexPaths: text(formData, "seo.noindexPaths"),
      redirectRules: text(formData, "seo.redirectRules")
    },
    robots: {
      enabled: bool(formData, "robots.enabled"),
      rules: text(formData, "robots.rules"),
      disallowAdmin: bool(formData, "robots.disallowAdmin")
    },
    sitemap: {
      enabled: bool(formData, "sitemap.enabled"),
      includeBlog: bool(formData, "sitemap.includeBlog"),
      includeNews: bool(formData, "sitemap.includeNews"),
      includeItems: bool(formData, "sitemap.includeItems")
    },
    security: {
      maxFailedLogins: intValue(formData, "security.maxFailedLogins", 5),
      lockMinutes: intValue(formData, "security.lockMinutes", 15),
      sessionMaxAgeHours: intValue(formData, "security.sessionMaxAgeHours", 24),
      requireStrongPassword: bool(formData, "security.requireStrongPassword"),
      requireTotpForAdmins: bool(formData, "security.requireTotpForAdmins")
    }
  });
}

export async function saveSiteSettingsAction(formData: FormData) {
  const session = await requirePermission("settings.write");
  const before = await getSiteSettings();
  const after = parseSettings(formData);

  await saveSiteSettings(after);
  await writeAuditLog({
    adminUserId: session.user.id,
    action: "site_settings_updated",
    targetType: "site_settings",
    targetId: "site",
    beforeData: before,
    afterData: after
  });

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");
  revalidateTag(siteSettingsCacheTag, "max");
  for (const lang of ["ja", "zh", "en"]) {
    revalidatePath(`/${lang}`);
    revalidatePath(`/${lang}/contact`);
    revalidatePath(`/${lang}/access`);
  }
  redirect("/admin/settings?notice=SettingsSaved");
}
