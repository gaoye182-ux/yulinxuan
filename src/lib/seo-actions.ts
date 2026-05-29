"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/admin-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { siteSettingsCacheTag } from "@/lib/frontend-site";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function bool(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function localized(formData: FormData, prefix: string) {
  return {
    ja: text(formData, `${prefix}.ja`),
    zh: text(formData, `${prefix}.zh`),
    en: text(formData, `${prefix}.en`)
  };
}

export async function saveSeoSettingsAction(formData: FormData) {
  const session = await requirePermission("settings.write");
  const before = await getSiteSettings();
  const after = {
    ...before,
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
    }
  };

  await saveSiteSettings(after);
  await writeAuditLog({
    adminUserId: session.user.id,
    action: "seo_settings_updated",
    targetType: "site_settings",
    targetId: "seo",
    beforeData: { seo: before.seo, robots: before.robots, sitemap: before.sitemap },
    afterData: { seo: after.seo, robots: after.robots, sitemap: after.sitemap }
  });

  revalidatePath("/admin/seo");
  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");
  revalidateTag(siteSettingsCacheTag, "max");
  redirect("/admin/seo?notice=SeoSaved");
}
