"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";

const failureText: Record<string, string> = {
  CredentialsSignin: "邮箱或密码不正确，请确认后重试。",
  AccountLocked: "登录失败次数过多，账号已临时锁定。请 15 分钟后再试。",
  SessionRequired: "请先登录后访问管理后台。",
  TwoFactorRequired: "请输入 6 位二步验证码，或使用一个备用码。",
  TwoFactorInvalid: "二步验证码或备用码不正确，请确认后重试。",
  TotpRequiredByPolicy: "当前安全策略要求 Admin 以上角色先启用 TOTP 二步验证。"
};

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(searchParams.get("error") ?? "");
  const [requiresTotp, setRequiresTotp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

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
          {failureText[error] ?? "登录失败，请稍后再试。"}
        </p>
      )}

      {requiresTotp ? (
        <div className="border border-[color:var(--border)] bg-[color:var(--paper)] p-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="password" value={password} />
          <p className="text-xs tracking-[0.22em] text-[color:var(--gold)]">TWO-FACTOR</p>
          <h2 className="mt-2 font-serif text-2xl font-light">二步验证</h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            请输入认证器中的 6 位验证码；如无法使用认证器，可输入一个一次性备用码。
          </p>
          <label className="mt-4 block">
            <span className="text-sm text-[color:var(--muted)]">Two-factor code</span>
            <input
              name="totpCode"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              required
              className="mt-2 h-12 w-full min-w-0 border border-[color:var(--border)] px-4 text-base outline-none focus:border-[color:var(--gold)]"
              placeholder="123456 或备用码"
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
            返回邮箱密码
          </button>
        </div>
      ) : (
        <>
          <label className="block">
            <span className="text-sm text-[color:var(--muted)]">Email</span>
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
            <span className="text-sm text-[color:var(--muted)]">Password</span>
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
        {isPending ? "SIGNING IN" : requiresTotp ? "VERIFY" : "LOGIN"}
      </button>
    </form>
  );
}
