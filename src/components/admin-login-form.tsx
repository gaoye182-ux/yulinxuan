"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import type { AdminLocale } from "@/lib/admin-i18n";

const failureText: Record<string, Record<AdminLocale, string>> = {
  CredentialsSignin: {
    ja: "メールアドレスまたはパスワードが正しくありません。",
    zh: "邮箱或密码不正确，请确认后重试。",
    en: "The email or password is incorrect."
  },
  AccountLocked: {
    ja: "ログイン失敗回数が多いため、アカウントは一時ロックされています。15 分後に再試行してください。",
    zh: "登录失败次数过多，账号已临时锁定。请 15 分钟后再试。",
    en: "Too many failed attempts. The account is temporarily locked. Try again in 15 minutes."
  },
  SessionRequired: {
    ja: "管理画面にアクセスするにはログインしてください。",
    zh: "请先登录后访问管理后台。",
    en: "Please sign in before accessing the admin area."
  },
  TwoFactorRequired: {
    ja: "6 桁の二段階認証コード、またはバックアップコードを入力してください。",
    zh: "请输入 6 位二步验证码，或使用一个备用码。",
    en: "Enter the 6-digit two-factor code or a backup code."
  },
  TwoFactorInvalid: {
    ja: "二段階認証コードまたはバックアップコードが正しくありません。",
    zh: "二步验证码或备用码不正确，请确认后重试。",
    en: "The two-factor code or backup code is incorrect."
  },
  TotpRequiredByPolicy: {
    ja: "現在のセキュリティポリシーでは、Admin 以上の権限に TOTP 二段階認証が必要です。",
    zh: "当前安全策略要求 Admin 以上角色先启用 TOTP 二步验证。",
    en: "The current security policy requires TOTP for Admin roles and above."
  }
};

const loginCopy: Record<AdminLocale, {
  genericError: string;
  twoFactorEyebrow: string;
  twoFactorTitle: string;
  twoFactorHelp: string;
  twoFactorLabel: string;
  twoFactorPlaceholder: string;
  back: string;
  email: string;
  password: string;
  signingIn: string;
  verify: string;
  login: string;
}> = {
  ja: {
    genericError: "ログインに失敗しました。時間をおいて再試行してください。",
    twoFactorEyebrow: "TWO-FACTOR",
    twoFactorTitle: "二段階認証",
    twoFactorHelp: "認証アプリの 6 桁コードを入力してください。利用できない場合は、一度だけ使えるバックアップコードも使用できます。",
    twoFactorLabel: "Two-factor code",
    twoFactorPlaceholder: "123456 またはバックアップコード",
    back: "メール・パスワードに戻る",
    email: "Email",
    password: "Password",
    signingIn: "SIGNING IN",
    verify: "VERIFY",
    login: "LOGIN"
  },
  zh: {
    genericError: "登录失败，请稍后再试。",
    twoFactorEyebrow: "TWO-FACTOR",
    twoFactorTitle: "二步验证",
    twoFactorHelp: "请输入认证器中的 6 位验证码；如无法使用认证器，可输入一个一次性备用码。",
    twoFactorLabel: "Two-factor code",
    twoFactorPlaceholder: "123456 或备用码",
    back: "返回邮箱密码",
    email: "Email",
    password: "Password",
    signingIn: "SIGNING IN",
    verify: "VERIFY",
    login: "LOGIN"
  },
  en: {
    genericError: "Sign-in failed. Please try again later.",
    twoFactorEyebrow: "TWO-FACTOR",
    twoFactorTitle: "Two-Factor Authentication",
    twoFactorHelp: "Enter the 6-digit code from your authenticator. If needed, you can use a one-time backup code.",
    twoFactorLabel: "Two-factor code",
    twoFactorPlaceholder: "123456 or backup code",
    back: "Back to email and password",
    email: "Email",
    password: "Password",
    signingIn: "SIGNING IN",
    verify: "VERIFY",
    login: "LOGIN"
  }
};

export function AdminLoginForm({ locale }: { locale: AdminLocale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(searchParams.get("error") ?? "");
  const [requiresTotp, setRequiresTotp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const copy = loginCopy[locale];

  function handleSubmit(formData: FormData) {
    setError("");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        totpCode: String(formData.get("totpCode") ?? ""),
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        setError(result.error);
        setRequiresTotp(result.error === "TwoFactorRequired" || result.error === "TwoFactorInvalid");
        return;
      }

      const nextUrl = result?.url ? new URL(result.url, window.location.origin) : new URL(callbackUrl, window.location.origin);
      const safePath = nextUrl.origin === window.location.origin ? `${nextUrl.pathname}${nextUrl.search}` : callbackUrl;

      router.push(safePath);
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-5">
      {error && (
        <p className="border border-[color:var(--red-seal)] bg-[#fff7f4] px-4 py-3 text-sm leading-6 text-[color:var(--red-seal)]">
          {failureText[error]?.[locale] ?? copy.genericError}
        </p>
      )}

      {requiresTotp ? (
        <div className="border border-[color:var(--border)] bg-[color:var(--paper)] p-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="password" value={password} />
          <p className="text-xs tracking-[0.22em] text-[color:var(--gold)]">{copy.twoFactorEyebrow}</p>
          <h2 className="mt-2 font-serif text-2xl font-light">{copy.twoFactorTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            {copy.twoFactorHelp}
          </p>
          <label className="mt-4 block">
            <span className="text-sm text-[color:var(--muted)]">{copy.twoFactorLabel}</span>
            <input
              name="totpCode"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              required
              className="mt-2 h-12 w-full min-w-0 border border-[color:var(--border)] px-4 text-base outline-none focus:border-[color:var(--gold)]"
              placeholder={copy.twoFactorPlaceholder}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setRequiresTotp(false);
              setError("");
            }}
            className="mt-3 text-sm text-[color:var(--muted)] underline-offset-4 hover:text-[color:var(--gold-dark)] hover:underline"
          >
            {copy.back}
          </button>
        </div>
      ) : (
        <>
          <label className="block">
            <span className="text-sm text-[color:var(--muted)]">{copy.email}</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 h-12 w-full min-w-0 border border-[color:var(--border)] px-4 text-base outline-none focus:border-[color:var(--gold)]"
              placeholder="admin@example.com"
            />
          </label>
          <label className="block">
            <span className="text-sm text-[color:var(--muted)]">{copy.password}</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 h-12 w-full min-w-0 border border-[color:var(--border)] px-4 text-base outline-none focus:border-[color:var(--gold)]"
              placeholder="Password"
            />
          </label>
        </>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="h-12 w-full bg-[color:var(--gold)] text-sm tracking-[0.18em] text-white disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? copy.signingIn : requiresTotp ? copy.verify : copy.login}
      </button>
    </form>
  );
}
