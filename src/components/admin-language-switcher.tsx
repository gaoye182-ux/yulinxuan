"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { setAdminLocaleAction } from "@/lib/admin-locale-actions";
import { adminLocaleLabels, type AdminLocale } from "@/lib/admin-i18n";
import { languages } from "@/lib/i18n";

type AdminLanguageSwitcherProps = {
  activeLocale: AdminLocale;
  className?: string;
  selectClassName?: string;
};

export function AdminLanguageSwitcher({ activeLocale, className = "", selectClassName = "" }: AdminLanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(locale: AdminLocale) {
    startTransition(async () => {
      await setAdminLocaleAction(locale);
      router.refresh();
    });
  }

  return (
    <div className={`relative ${className}`}>
      <select
        value={activeLocale}
        disabled={isPending}
        aria-label="Admin language"
        onChange={(event) => switchLocale(event.target.value as AdminLocale)}
        className={`h-11 min-w-36 appearance-none border border-[color:var(--border)] bg-[color:var(--ivory)] pl-3 pr-9 text-sm text-[color:var(--ink)] outline-none transition hover:border-[color:var(--gold)] disabled:opacity-60 ${selectClassName}`}
      >
        {languages.map((locale) => (
          <option key={locale} value={locale}>
            {adminLocaleLabels[locale]}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--gold-dark)]"
      />
    </div>
  );
}
