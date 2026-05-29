import { cookies } from "next/headers";
import { adminLocaleCookie, type AdminLocale } from "@/lib/admin-i18n";
import { isLanguage } from "@/lib/i18n";

export async function getAdminLocale(): Promise<AdminLocale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(adminLocaleCookie)?.value;

  return isLanguage(value) ? value : "zh";
}
