"use server";

import { cookies } from "next/headers";
import { adminLocaleCookie, type AdminLocale } from "@/lib/admin-i18n";
import { isLanguage } from "@/lib/i18n";

export async function setAdminLocaleAction(locale: AdminLocale) {
  if (!isLanguage(locale)) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(adminLocaleCookie, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax"
  });
}
