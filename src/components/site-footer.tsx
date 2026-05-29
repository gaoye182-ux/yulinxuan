import Link from "next/link";
import { mapSearchUrl, telHref } from "@/lib/frontend-site";
import { localize, type Language } from "@/lib/i18n";
import { localizedPath, mainNav } from "@/lib/navigation";
import type { SiteSettings } from "@/lib/site-settings";

type SiteFooterProps = {
  lang: Language;
  settings: SiteSettings;
  navigation?: {
    items?: { href: string; label: string }[];
  };
  footer?: {
    siteTitle?: string;
    serviceTitle?: string;
    contactTitle?: string;
    serviceLinks?: { href: string; label: string }[];
    copyright?: string;
  };
};

export function SiteFooter({ lang, settings, navigation, footer }: SiteFooterProps) {
  const brandName = localize(settings.company.legalName, lang);
  const brandSubLabel = "Gyokurinken Co., Ltd.";
  const address = localize(settings.contact.address, lang);
  const hours = localize(settings.businessHours.weekdays, lang);
  const holidays = localize(settings.businessHours.holidays, lang);
  const note = localize(settings.businessHours.note, lang);
  const phoneHref = telHref(settings.contact.phone);
  const lineHref = settings.contact.lineUrl || localizedPath(lang, "/contact");
  const mapsHref = mapSearchUrl(settings, lang);
  const navItems = (navigation?.items?.length
    ? navigation.items
    : mainNav.map((item) => ({ href: item.href, label: item.label[lang] })))
    .filter((item) => item.href !== "/blog");
  const serviceLinks = footer?.serviceLinks?.length
    ? footer.serviceLinks
    : [
        { href: "/appraisal", label: lang === "ja" ? "鑑定・買取" : lang === "zh" ? "鉴定・收购" : "Appraisal" },
        { href: "/purchase-guide", label: lang === "ja" ? "ご購入方法" : lang === "zh" ? "购买方法" : "Purchase Guide" },
        { href: "/faq", label: "FAQ" },
        { href: "/access", label: lang === "ja" ? "アクセス" : lang === "zh" ? "交通指引" : "Access" },
        { href: "/privacy", label: lang === "ja" ? "プライバシーポリシー" : lang === "zh" ? "隐私政策" : "Privacy Policy" },
        { href: "/sitemap", label: lang === "ja" ? "サイトマップ" : lang === "zh" ? "网站地图" : "Sitemap" }
      ];

  return (
    <footer className="bg-[color:var(--wood)] pb-16 text-[color:var(--ivory)] md:pb-0">
      <div className={`fixed bottom-0 left-0 right-0 z-30 grid border-t border-[color:var(--border)] bg-[color:var(--paper)] text-xs text-[color:var(--ink)] md:hidden ${phoneHref ? "grid-cols-3" : "grid-cols-2"}`}>
        {phoneHref ? (
          <a href={phoneHref} className="flex min-h-14 items-center justify-center border-r border-[color:var(--border)]">
            TEL
          </a>
        ) : null}
        <a href={mapsHref} className="flex min-h-14 items-center justify-center border-r border-[color:var(--border)]">
          MAP
        </a>
        <Link href={localizedPath(lang, "/contact")} className="flex min-h-14 items-center justify-center bg-[color:var(--gold)] text-white">
          MAIL
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-serif text-2xl tracking-[0.18em]">{brandName}</p>
          <p className="mt-2 text-xs tracking-[0.35em] text-[color:var(--gold-light)]">
            {brandSubLabel}
          </p>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">{localize(settings.company.tagline, lang)}</p>
          {settings.contact.lineUrl ? (
            <a href={lineHref} className="mt-4 inline-flex text-sm text-[color:var(--gold-light)] hover:text-white">
              LINE
            </a>
          ) : null}
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-[color:var(--gold-light)]">
            {footer?.siteTitle || "SITE"}
          </p>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={localizedPath(lang, item.href)} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-[color:var(--gold-light)]">
            {footer?.serviceTitle || "SERVICE"}
          </p>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            {serviceLinks.map((item) => (
              <li key={item.href}>
                <Link href={localizedPath(lang, item.href)} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-[color:var(--gold-light)]">
            {footer?.contactTitle || "CONTACT"}
          </p>
          <address className="mt-5 not-italic text-sm leading-7 text-white/70">
            {address}
            <br />
            {settings.contact.phone ? (
              <>
                Tel. {settings.contact.phone}
                <br />
              </>
            ) : null}
            {settings.contact.email ? (
              <>
                {settings.contact.email}
                <br />
              </>
            ) : null}
            {hours} / {holidays}
            <br />
            {note}
          </address>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/45">
        {footer?.copyright || "Copyright © Gyokurinken Co., Ltd. All Rights Reserved."}
      </div>
    </footer>
  );
}
