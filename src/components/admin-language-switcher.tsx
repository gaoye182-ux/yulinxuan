"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setAdminLocaleAction } from "@/lib/admin-locale-actions";
import { adminLocaleLabels, type AdminLocale } from "@/lib/admin-i18n";
import { languages } from "@/lib/i18n";

type AdminLanguageSwitcherProps = {
  activeLocale: AdminLocale;
};

export function AdminLanguageSwitcher({ activeLocale }: AdminLanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(locale: AdminLocale) {
    startTransition(async () => {
      await setAdminLocaleAction(locale);
      router.refresh();
    });
  }

  return (
    <div className="inline-flex min-h-11 overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory)]">
      {languages.map((locale) => (
        <button
          key={locale}
          type="button"
          disabled={isPending}
          onClick={() => switchLocale(locale)}
          className={`px-3 text-xs tracking-[0.12em] transition ${
            activeLocale === locale
              ? "bg-[color:var(--gold)] text-white"
              : "text-[color:var(--muted)] hover:bg-white hover:text-[color:var(--gold-dark)]"
          }`}
        >
          {adminLocaleLabels[locale]}
        </button>
      ))}
    </div>
  );
}
