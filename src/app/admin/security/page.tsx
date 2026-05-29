import Image from "next/image";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import QRCode from "qrcode";
import { KeyRound, RefreshCcw, ShieldCheck, ShieldOff } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { auth } from "@/auth";
import { adminText, type AdminLocale, type AdminText } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";
import { prisma } from "@/lib/prisma";
import { getLoginSecurityPolicy } from "@/lib/site-settings";
import { createOtpAuthUri } from "@/lib/totp";
import { disableOwnTotpAction, enableOwnTotpAction, regenerateOwnBackupCodesAction, startOwnTotpSetupAction } from "@/lib/admin-security-actions";

export const metadata: Metadata = {
  title: "登录安全 | 玉林軒 CMS",
  description: "管理员自助启用、关闭 TOTP 二步验证，查看 otpauth URI、二维码与一次性备用码。"
};

const errorText: Record<string, string> = {
  TotpNotStarted: "请先生成二步验证密钥。",
  TotpInvalid: "验证码不正确，请确认手机时间同步后重试。"
};

const noticeText: Record<string, string> = {
  TotpSetupStarted: "已生成二步验证密钥，请扫码并输入验证码启用。",
  TotpEnabled: "二步验证已启用，请立即保存备用码。",
  TotpDisabled: "二步验证已关闭。",
  BackupCodesRegenerated: "备用码已重新生成，旧备用码已全部失效。"
};

function formatDate(value: Date | null, locale: AdminLocale) {
  if (!value) {
    return adminText("未记录", locale);
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value);
}

export default async function AdminSecurityPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  noStore();
  const session = await auth();
  const locale = await getAdminLocale();
  const t = (value: AdminText) => adminText(value, locale);
  const params = (await searchParams) ?? {};
  const backupCodes = params.backupCodes?.split(",").filter(Boolean) ?? [];
  const securityPolicy = await getLoginSecurityPolicy();
  const user = session?.user?.id
    ? await prisma.adminUser.findUnique({ where: { id: BigInt(session.user.id) } })
    : null;

  if (!user) {
    return null;
  }

  const otpAuthUri = user.totpSecret ? createOtpAuthUri({ email: user.email, secret: user.totpSecret }) : null;
  const qrCode = otpAuthUri
    ? await QRCode.toDataURL(otpAuthUri, {
        margin: 1,
        width: 208,
        color: {
          dark: "#1A1A1A",
          light: "#FFFDF8"
        }
      })
    : null;

  return (
    <AdminShell
      title="登录安全"
      description="为当前管理员账号启用 TOTP 二步验证。登录时可使用认证器 6 位验证码，备用码只能使用一次；失败次数会计入临时锁定策略。"
    >
      {params.error ? (
        <p className="mt-8 border border-[color:var(--red-seal)] bg-[#fff7f4] px-4 py-3 text-sm leading-6 text-[color:var(--red-seal)]">
          {t(errorText[params.error] ?? "操作失败，请稍后再试。")}
        </p>
      ) : null}
      {params.notice ? (
        <p className="mt-8 border border-[color:var(--gold)] bg-[color:var(--paper)] px-4 py-3 text-sm leading-6 text-[color:var(--gold-dark)]">
          {t(noticeText[params.notice] ?? "操作已完成。")}
        </p>
      ) : null}
      {backupCodes.length ? (
        <section className="mt-8 border border-[color:var(--gold)] bg-[color:var(--paper)] p-5">
          <h2 className="font-serif text-2xl font-light">{t("一次性备用码")}</h2>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{t({ ja: "これらのバックアップコードは一度だけ表示されます。パスワード管理ツールに保存してください。各コードはログイン成功後すぐ無効になります。", zh: "这些备用码只显示一次。请保存到密码管理器；每个备用码登录成功后会立即失效。", en: "These backup codes are shown only once. Save them in a password manager; each code is invalidated immediately after successful login." })}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            {backupCodes.map((code) => (
              <code key={code} className="border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 py-2 text-center text-sm text-[color:var(--ink)]">
                {code}
              </code>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck aria-hidden size={18} className="text-[color:var(--gold-dark)]" />
            <h2 className="font-serif text-2xl font-light">{t({ ja: "TOTP 状態", zh: "TOTP 状态", en: "TOTP Status" })}</h2>
          </div>
          <dl className="mt-5 grid gap-4 text-sm text-[color:var(--muted)] sm:grid-cols-2">
            <div className="border border-[color:var(--border)] bg-[color:var(--ivory)] p-4">
              <dt className="text-xs text-[color:var(--gold-dark)]">{t("账号")}</dt>
              <dd className="mt-2 break-words">{user.email}</dd>
            </div>
            <div className="border border-[color:var(--border)] bg-[color:var(--ivory)] p-4">
              <dt className="text-xs text-[color:var(--gold-dark)]">{t("状态")}</dt>
              <dd className="mt-2">{user.totpEnabled ? t("已启用") : user.totpSecret ? t("待验证启用") : t("未启用")}</dd>
            </div>
            <div className="border border-[color:var(--border)] bg-[color:var(--ivory)] p-4">
              <dt className="text-xs text-[color:var(--gold-dark)]">{t("验证时间")}</dt>
              <dd className="mt-2">{formatDate(user.totpVerifiedAt, locale)}</dd>
            </div>
            <div className="border border-[color:var(--border)] bg-[color:var(--ivory)] p-4">
              <dt className="text-xs text-[color:var(--gold-dark)]">{t("剩余备用码")}</dt>
              <dd className="mt-2">{t({ ja: `${user.totpBackupCodes.length} 個`, zh: `${user.totpBackupCodes.length} 个`, en: `${user.totpBackupCodes.length}` })}</dd>
            </div>
          </dl>

          {!user.totpSecret ? (
            <form action={startOwnTotpSetupAction} className="mt-5">
              <button className="inline-flex min-h-12 items-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white" type="submit">
                <KeyRound aria-hidden size={16} />
                {t("生成二维码")}
              </button>
            </form>
          ) : null}
        </article>

        <aside className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <h2 className="font-serif text-2xl font-light">{t("登录限制")}</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
            {t({ ja: `パスワードまたは二段階認証コードが連続 ${securityPolicy.maxFailedLogins} 回失敗すると、アカウントは ${securityPolicy.lockMinutes} 分間一時ロックされます。成功、失敗、有効化、無効化の操作はすべて監査ログに記録されます。`, zh: `密码或二步验证码连续失败 ${securityPolicy.maxFailedLogins} 次后，账号会临时锁定 ${securityPolicy.lockMinutes} 分钟。所有成功、失败、启用和关闭操作都会写入审计日志。`, en: `After ${securityPolicy.maxFailedLogins} consecutive password or two-factor failures, the account is locked for ${securityPolicy.lockMinutes} minutes. Successful, failed, enabled, and disabled actions are written to audit logs.` })}
          </p>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
            {t({ ja: `現在のポリシーはサイト設定で管理されます。新しい JWT セッションは ${securityPolicy.sessionMaxAgeHours} 時間有効で、middleware と管理画面権限ガードで強制期限切れになります。強力なパスワードポリシーは${securityPolicy.requireStrongPassword ? "有効" : "無効"}です。`, zh: `当前策略由站点设置维护；新登录 JWT 会话有效期为 ${securityPolicy.sessionMaxAgeHours} 小时，middleware 与后台权限守卫都会按该时间强制过期。强密码策略${securityPolicy.requireStrongPassword ? "已启用" : "未启用"}。`, en: `The current policy is maintained in Site Settings. New JWT sessions are valid for ${securityPolicy.sessionMaxAgeHours} hours and enforced by middleware and admin permission guards. Strong password policy is ${securityPolicy.requireStrongPassword ? "enabled" : "disabled"}.` })}
          </p>
        </aside>
      </section>

      {user.totpSecret && qrCode ? (
        <section className="mt-8 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <div className="flex items-center gap-2">
            <KeyRound aria-hidden size={18} className="text-[color:var(--gold-dark)]" />
            <h2 className="font-serif text-2xl font-light">{user.totpEnabled ? t("认证器信息") : t("启用 TOTP 二步验证")}</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-[236px_minmax(0,1fr)]">
            <div className="w-fit border border-[color:var(--border)] bg-white p-3">
              <Image src={qrCode} alt="TOTP QR Code" width={208} height={208} unoptimized />
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-7 text-[color:var(--muted)]">
                {t({ ja: "Google Authenticator、1Password、Microsoft Authenticator などのアプリで QR コードを読み取ってください。読み取れない場合は otpauth URI を手動でコピーできます。", zh: "使用 Google Authenticator、1Password、Microsoft Authenticator 等应用扫描二维码。无法扫码时，可手动复制 otpauth URI。", en: "Scan the QR code with Google Authenticator, 1Password, Microsoft Authenticator, or a similar app. If scanning fails, copy the otpauth URI manually." })}
              </p>
              <p className="mt-3 break-all border border-dashed border-[color:var(--border)] bg-[color:var(--ivory)] p-3 text-xs text-[color:var(--muted)]">
                {otpAuthUri}
              </p>
              {!user.totpEnabled ? (
                <form action={enableOwnTotpAction} className="mt-4 flex flex-wrap gap-3">
                  <input name="totpCode" inputMode="numeric" autoComplete="one-time-code" required className="h-12 min-w-0 flex-1 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none" placeholder={t("6 位验证码")} />
                  <button className="min-h-12 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white" type="submit">
                    {t("启用")}
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {user.totpEnabled ? (
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <form action={regenerateOwnBackupCodesAction} className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
            <div className="flex items-center gap-2">
              <RefreshCcw aria-hidden size={18} className="text-[color:var(--gold-dark)]" />
              <h2 className="font-serif text-2xl font-light">{t("重新生成备用码")}</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{t({ ja: "現在の認証アプリコードを入力すると新しいバックアップコード 8 個を生成し、旧コードはすぐ無効になります。", zh: "输入当前认证器验证码后生成 8 个新备用码，旧备用码会立即失效。", en: "Enter the current authenticator code to generate 8 new backup codes. Old codes are immediately invalidated." })}</p>
            <input name="totpCode" inputMode="numeric" autoComplete="one-time-code" required className="mt-4 h-12 w-full min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none" placeholder={t("6 位验证码")} />
            <button className="mt-3 min-h-12 border border-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-[color:var(--gold-dark)]" type="submit">
              {t("重新生成")}
            </button>
          </form>

          <form action={disableOwnTotpAction} className="border border-[color:var(--red-seal)] bg-[#fffaf8] p-5">
            <div className="flex items-center gap-2">
              <ShieldOff aria-hidden size={18} className="text-[color:var(--red-seal)]" />
              <h2 className="font-serif text-2xl font-light">{t("关闭二步验证")}</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{t({ ja: "無効化には認証アプリコードまたはバックアップコードが必要です。無効化後はメールとパスワードのみでログインします。", zh: "关闭前需要输入认证器验证码或一个备用码。关闭后登录只校验邮箱和密码。", en: "Disabling requires an authenticator code or backup code. After disabling, login only checks email and password." })}</p>
            <input name="totpCode" inputMode="numeric" autoComplete="one-time-code" required className="mt-4 h-12 w-full min-w-0 border border-[color:var(--border)] bg-white px-4 text-base outline-none" placeholder={t("6 位验证码或备用码")} />
            <button className="mt-3 min-h-12 border border-[color:var(--red-seal)] px-5 text-sm tracking-[0.14em] text-[color:var(--red-seal)]" type="submit">
              {t("关闭 TOTP")}
            </button>
          </form>
        </section>
      ) : null}
    </AdminShell>
  );
}
