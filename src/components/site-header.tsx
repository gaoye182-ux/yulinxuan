"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

const languageShortNames: Record<Language, string> = {
  ja: "JA",
  zh: "中文",
  en: "EN"
};

const menuLabels: Record<Language, { open: string; close: string; language: string }> = {
  ja: { open: "メニューを開く", close: "メニューを閉じる", language: "言語" },
  zh: { open: "打开菜单", close: "关闭菜单", language: "语言" },
  en: { open: "Open menu", close: "Close menu", language: "Language" }
};

const brandLogoSrc = "/brand/gyokurinken-user-logo-gold.png";
const brandSubLabel = "GYOKURINKEN";

function telHref(phone: string) {
  const compact = phone.replace(/[^\d+]/g, "");

  return compact ? `tel:${compact}` : undefined;
}

export function SiteHeader({ lang, settings, navigation }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const brandName = localize(settings.company.name, lang);
  const phoneHref = telHref(settings.contact.phone);
  const navItems = (navigation?.items?.length
    ? navigation.items
    : mainNav.map((item) => ({ href: item.href, label: item.label[lang] })))
    .filter((item) => item.href !== "/blog");
  const contactText = navigation?.contactLabel || contactLabel[lang];
  const menuCopy = menuLabels[lang];

  function languagePath(language: Language) {
    const currentPrefix = `/${lang}`;

    if (pathname === currentPrefix) {
      return localizedPath(language);
    }

    if (pathname.startsWith(`${currentPrefix}/`)) {
      return `/${language}${pathname.slice(currentPrefix.length)}`;
    }

    return localizedPath(language);
  }

  function handleLanguageChange(language: string) {
    window.location.href = languagePath(language as Language);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[color:var(--gold)]/35 bg-[rgba(249,245,238,0.97)] backdrop-blur">
        <div className="site-header-inner mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href={localizedPath(lang)} className="group flex min-w-0 items-center gap-2.5 leading-none sm:gap-3">
            <Image
              src={brandLogoSrc}
              alt=""
              width={90}
              height={90}
              priority
              className="size-11 shrink-0 object-contain sm:size-12 lg:size-14"
            />
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-serif text-xl tracking-[0.1em] text-[color:var(--ink)] sm:text-2xl sm:tracking-[0.12em]">
                {brandName}
              </span>
              <span className="mt-1 block truncate text-[9px] tracking-[0.2em] text-[color:var(--gold-dark)] sm:text-[10px] sm:tracking-[0.28em]">
                {brandSubLabel}
              </span>
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
                aria-label={menuCopy.language}
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

          <div className="flex items-center gap-2 lg:hidden">
            <div className="relative">
              <select
                value={lang}
                onChange={(event) => handleLanguageChange(event.target.value)}
                aria-label={menuCopy.language}
                className="h-11 appearance-none border border-[color:var(--border)] bg-[color:var(--paper)] pl-3 pr-7 text-xs text-[color:var(--ink)] outline-none"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {languageNames[language]}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                size={13}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--gold)]"
              />
            </div>
            <button
              type="button"
              className="inline-flex size-11 cursor-pointer items-center justify-center border border-[color:var(--border)] text-[color:var(--ink)]"
              aria-label={menuCopy.open}
              aria-controls="site-mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen ? (
        <div
          id="site-mobile-menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[color:var(--ivory)] px-5 py-5 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={menuCopy.open}
        >
          <div className="flex items-center justify-between">
            <a href={localizedPath(lang)} className="flex min-w-0 items-center gap-3 leading-none">
              <Image
                src={brandLogoSrc}
                alt=""
                width={96}
                height={96}
                className="size-14 shrink-0 object-contain"
              />
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-serif text-2xl tracking-[0.12em]">
                  {brandName}
                </span>
                <span className="mt-1 truncate text-[10px] tracking-[0.28em] text-[color:var(--gold-dark)]">
                  {brandSubLabel}
                </span>
              </span>
            </a>
            <button
              type="button"
              className="inline-flex size-11 cursor-pointer items-center justify-center border border-[color:var(--border)]"
              aria-label={menuCopy.close}
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="mt-10 grid gap-1 border-y border-[color:var(--border)] py-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={localizedPath(lang, item.href)}
                className="min-h-12 py-3 font-serif text-2xl text-[color:var(--ink)]"
              >
                {item.label}
              </a>
            ))}
            <a
              href={localizedPath(lang, "/contact")}
              className="min-h-12 py-3 font-serif text-2xl text-[color:var(--ink)]"
            >
              {contactText}
            </a>
          </nav>

          <div className="mt-8">
            <p className="text-xs tracking-[0.18em] text-[color:var(--muted)]">{menuCopy.language}</p>
            <div className="mt-3 grid grid-cols-3 border border-[color:var(--border)] bg-[color:var(--paper)]">
              {languages.map((language) => (
                <a
                  key={language}
                  href={languagePath(language)}
                  className={`flex min-h-12 items-center justify-center border-r border-[color:var(--border)] text-sm last:border-r-0 ${
                    language === lang
                      ? "bg-[color:var(--gold)] text-white"
                    : "text-[color:var(--ink)]"
                  }`}
                >
                  {languageShortNames[language]}
                </a>
              ))}
            </div>
          </div>

          <div className={`mt-auto grid gap-3 pt-8 ${phoneHref ? "grid-cols-2" : "grid-cols-1"}`}>
            {phoneHref ? (
              <a
                href={phoneHref}
                className="flex min-h-12 items-center justify-center border border-[color:var(--gold)] text-sm text-[color:var(--gold-dark)]"
              >
                {settings.contact.phone}
              </a>
            ) : null}
            <a
              href={localizedPath(lang, "/contact")}
              className="flex min-h-12 items-center justify-center bg-[color:var(--gold)] text-sm text-white"
            >
              {contactText}
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
