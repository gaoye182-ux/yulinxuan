import Link from "next/link";
import { Suspense } from "react";
import { AdminLanguageSwitcher } from "@/components/admin-language-switcher";
import { AdminLoginForm } from "@/components/admin-login-form";
import { adminText } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";

export default async function AdminLoginPage() {
  const locale = await getAdminLocale();
  const frontendHref = locale === "zh" ? "/zh" : locale === "en" ? "/en" : "/ja";

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-md border border-[color:var(--border)] bg-white p-8">
        <div className="mb-5 flex justify-center">
          <AdminLanguageSwitcher activeLocale={locale} />
        </div>
        <p className="text-center text-xs tracking-[0.32em] text-[color:var(--gold)]">
          GYOKURINKEN CMS
        </p>
        <h1 className="mt-4 text-center font-serif text-3xl">
          {adminText({ ja: "管理画面ログイン", zh: "管理后台登录", en: "Admin Login" }, locale)}
        </h1>

        <Suspense>
          <AdminLoginForm locale={locale} />
        </Suspense>

        <Link
          href={frontendHref}
          className="mt-6 block text-center text-sm text-[color:var(--muted)] hover:text-[color:var(--gold)]"
        >
          {adminText({ ja: "前台へ戻る", zh: "返回前台", en: "Back to site" }, locale)}
        </Link>
      </div>
    </div>
  );
}
