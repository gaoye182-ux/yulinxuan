"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { languages, localize, type Language } from "@/lib/i18n";
import { localizedPath, mainNav } from "@/lib/navigation";
import type { SiteSettings } from "@/lib/site-settings";

type SiteHeaderProps = {
  lang: Language;
  settings: SiteSettings;
  navigation?: {
    contactLabel?: string;
    items?: { href: string; label: string }[];
  };
};

const contactLabel: Record<Language, string> = {
  ja: "お問い合わせ",
  zh: "联系我们",
  en: "Contact"
};

const languageNames: Record<Language, string> = {
  ja: "日本語",
  zh: "中文",
  en: "English"
};

function telHref(phone: string) {
  const compact = phone.replace(/[^\d+]/g, "");

  return compact ? `tel:${compact}` : undefined;
}

export function SiteHeader({ lang, settings, navigation }: SiteHeaderProps) {
  const brandName = localize(settings.company.name, lang);
  const brandSubLabel = localize(settings.company.legalName, "en").toUpperCase();
  const phoneHref = telHref(settings.contact.phone);
  const navItems = navigation?.items?.length
    ? navigation.items
    : mainNav.map((item) => ({ href: item.href, label: item.label[lang] }));
  const contactText = navigation?.contactLabel || contactLabel[lang];

  function handleLanguageChange(language: string) {
    window.location.href = localizedPath(language as Language);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--gold)]/35 bg-[rgba(249,245,238,0.97)] backdrop-blur">
      <div className="site-header-inner mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href={localizedPath(lang)} className="group flex flex-col leading-none">
          <span className="font-serif text-2xl tracking-[0.12em] text-[color:var(--ink)]">
            {brandName}
          </span>
          <span className="mt-1 text-[10px] tracking-[0.38em] text-[color:var(--gold)]">
            {brandSubLabel}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-[color:var(--ink)] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={localizedPath(lang, item.href)}
              className="underline-offset-8 transition hover:text-[color:var(--gold)] hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <div className="relative">
            <select
              value={lang}
              onChange={(event) => handleLanguageChange(event.target.value)}
              aria-label="Language"
              className="h-10 appearance-none border border-[color:var(--border)] bg-[color:var(--paper)] pl-4 pr-9 text-xs tracking-[0.08em] text-[color:var(--ink)] outline-none transition hover:border-[color:var(--gold)]"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {languageNames[language]}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--gold)]"
            />
          </div>
          <Link
            href={localizedPath(lang, "/contact")}
            className="border border-[color:var(--gold)] px-5 py-3 text-xs tracking-[0.18em] text-[color:var(--gold)] transition hover:bg-[color:var(--gold)] hover:text-white"
          >
            {contactText}
          </Link>
        </div>

        <input id="site-menu-toggle" type="checkbox" className="peer sr-only" />
        <label
          htmlFor="site-menu-toggle"
          className="inline-flex size-11 cursor-pointer items-center justify-center border border-[color:var(--border)] text-[color:var(--ink)] lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </label>

        <div className="fixed inset-0 z-50 hidden bg-[color:var(--ivory)] px-5 py-5 peer-checked:block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={localizedPath(lang)} className="flex flex-col leading-none">
              <span className="font-serif text-2xl tracking-[0.12em]">{brandName}</span>
              <span className="mt-1 text-[10px] tracking-[0.38em] text-[color:var(--gold)]">
                {brandSubLabel}
              </span>
            </Link>
            <label
              htmlFor="site-menu-toggle"
              className="inline-flex size-11 cursor-pointer items-center justify-center border border-[color:var(--border)]"
              aria-label="Close menu"
            >
              <X size={20} />
            </label>
          </div>

          <nav className="mt-12 grid gap-1 border-y border-[color:var(--border)] py-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={localizedPath(lang, item.href)}
                className="min-h-12 py-3 font-serif text-2xl text-[color:var(--ink)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={localizedPath(lang, "/contact")}
              className="min-h-12 py-3 font-serif text-2xl text-[color:var(--ink)]"
            >
              {contactText}
            </Link>
          </nav>

          <div className="relative mt-8 max-w-xs">
            <select
              value={lang}
              onChange={(event) => handleLanguageChange(event.target.value)}
              aria-label="Language"
              className="h-12 w-full appearance-none border border-[color:var(--border)] bg-[color:var(--paper)] pl-4 pr-10 text-sm text-[color:var(--ink)] outline-none"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {languageNames[language]}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--gold)]"
            />
          </div>

          <div className={`absolute bottom-6 left-5 right-5 grid gap-3 ${phoneHref ? "grid-cols-2" : "grid-cols-1"}`}>
            {phoneHref ? (
              <a
                href={phoneHref}
                className="flex min-h-12 items-center justify-center border border-[color:var(--gold)] text-sm text-[color:var(--gold-dark)]"
              >
                {settings.contact.phone}
              </a>
            ) : null}
            <Link
              href={localizedPath(lang, "/contact")}
              className="flex min-h-12 items-center justify-center bg-[color:var(--gold)] text-sm text-white"
            >
              {contactText}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
