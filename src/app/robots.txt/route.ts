import { getSiteSettings } from "@/lib/site-settings";
import { siteBaseUrl } from "@/lib/frontend-site";

export async function GET() {
  const settings = await getSiteSettings();
  const baseUrl = siteBaseUrl(settings);
  const rules = settings.robots.enabled
    ? settings.robots.rules
        .replace(/Sitemap:\s*\S+/i, `Sitemap: ${baseUrl}/sitemap.xml`)
        .concat(settings.robots.disallowAdmin && !settings.robots.rules.includes("Disallow: /admin") ? "\nDisallow: /admin" : "")
    : "User-agent: *\nDisallow: /";

  return new Response(rules.trimEnd() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300"
    }
  });
}
