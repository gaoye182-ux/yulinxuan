import Image from "next/image";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import QRCode from "qrcode";
import { KeyRound, ShieldAlert, ShieldCheck, UserPlus } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { roleLabels, rolePermissions, permissionLabels, hasPermission } from "@/lib/admin-permissions";
import { requirePermission } from "@/lib/admin-auth";
import { disableTotpAction, enableTotpAction, saveAdminUserAction, startTotpSetupAction, toggleAdminUserActiveAction } from "@/lib/admin-user-actions";
import { prisma } from "@/lib/prisma";
import { createOtpAuthUri } from "@/lib/totp";

export const metadata: Metadata = {
  title: "管理员与权限 | 玉林軒 CMS",
  description: "管理玉林軒株式会社后台管理员账号、角色权限、登录安全与二步验证。"
};

const editableRoles = ["viewer", "editor", "admin", "super_admin"] as const;

const errorText: Record<string, string> = {
  CannotAssignRole: "当前角色不能分配该权限级别。",
  CannotEditRole: "当前角色不能编辑该管理员。",
  CannotDisableSelf: "不能禁用当前登录账号。",
  PasswordTooShort: "新增管理员或重置密码时，密码至少需要 12 位。",
  UserNotFound: "管理员不存在或已被删除。",
  TotpNotStarted: "请先生成二步验证密钥。",
  TotpInvalid: "二步验证码不正确，请确认手机时间同步后重试。"
};

const noticeText: Record<string, string> = {
  UserSaved: "管理员资料已保存。",
  UserCreated: "管理员已新增。",
  UserEnabled: "管理员已启用。",
  UserDisabled: "管理员已禁用。",
  TotpSetupStarted: "已生成二步验证密钥，请扫码并输入验证码启用。",
  TotpEnabled: "二步验证已启用，请立即保存备用码。",
  TotpDisabled: "二步验证已关闭。"
};

function formatDate(value: Date | null) {
  if (!value) {
    return "未记录";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value);
}

function SecurityStatus({
  isActive,
  lockedUntil,
  failedLoginCount,
  totpEnabled,
  totpVerifiedAt
}: {
  isActive: boolean;
  lockedUntil: Date | null;
  failedLoginCount: number;
  totpEnabled: boolean;
  totpVerifiedAt: Date | null;
}) {
  const isLocked = lockedUntil ? lockedUntil > new Date() : false;

  return (
    <div className="grid gap-2 text-sm text-[color:var(--muted)]">
      <p className={isActive ? "text-[color:var(--gold-dark)]" : "text-[color:var(--red-seal)]"}>
        {isActive ? "启用中" : "已禁用"}
      </p>
      <p className={isLocked ? "text-[color:var(--red-seal)]" : ""}>
        {isLocked ? `临时锁定至 ${formatDate(lockedUntil)}` : `登录失败 ${failedLoginCount} 次`}
      </p>
      <p>{totpEnabled ? `TOTP 已启用：${formatDate(totpVerifiedAt)}` : "TOTP 未启用"}</p>
    </div>
  );
}

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  noStore();
  const session = await requirePermission("users.read");
  const canWriteUsers = hasPermission(session.user.role, "users.write");
  const params = (await searchParams) ?? {};
  const setupTotpUserId = params.setupTotp;
  const backupCodes = params.backupCodes?.split(",").filter(Boolean) ?? [];

  const users = await prisma.adminUser.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "desc" }]
  });
  const setupTotpUser = setupTotpUserId ? users.find((user) => user.id.toString() === setupTotpUserId) : null;
  const setupTotpQr =
    setupTotpUser?.totpSecret
      ? await QRCode.toDataURL(createOtpAuthUri({ email: setupTotpUser.email, secret: setupTotpUser.totpSecret }), {
          margin: 1,
          width: 192,
          color: {
            dark: "#1A1A1A",
            light: "#FFFDF8"
          }
        })
      : null;
  const setupTotpUri = setupTotpUser?.totpSecret ? createOtpAuthUri({ email: setupTotpUser.email, secret: setupTotpUser.totpSecret }) : null;

  return (
    <AdminShell
      title="管理员与权限"
      description="新增、编辑、禁用管理员账号，重置密码，并查看 viewer / editor / admin / super_admin 的页面级与操作级权限。Super Admin 可为账号生成或重置 TOTP，所有管理员也可在登录安全页自助管理。"
    >
      {!canWriteUsers ? (
        <p className="mt-8 border border-[color:var(--border)] bg-[color:var(--paper)] px-4 py-3 text-sm leading-6 text-[color:var(--muted)]">
          当前角色可查看管理员与权限矩阵，但新增、编辑、禁用和密码重置仅限 Super Admin。
        </p>
      ) : null}
      {params.error ? (
        <p className="mt-8 border border-[color:var(--red-seal)] bg-[#fff7f4] px-4 py-3 text-sm leading-6 text-[color:var(--red-seal)]">
          {errorText[params.error] ?? "操作失败，请稍后再试。"}
        </p>
      ) : null}
      {params.notice ? (
        <p className="mt-8 border border-[color:var(--gold)] bg-[color:var(--paper)] px-4 py-3 text-sm leading-6 text-[color:var(--gold-dark)]">
          {noticeText[params.notice] ?? "操作已完成。"}
        </p>
      ) : null}
      {backupCodes.length ? (
        <section className="mt-8 border border-[color:var(--gold)] bg-[color:var(--paper)] p-5">
          <h2 className="font-serif text-2xl font-light">备用码</h2>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">这些备用码只显示一次。每个备用码登录成功后会立即失效。</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            {backupCodes.map((code) => (
              <code key={code} className="border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 py-2 text-center text-sm text-[color:var(--ink)]">
                {code}
              </code>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8 overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="border-b border-[color:var(--border)] p-5">
          <p className="text-xs tracking-[0.24em] text-[color:var(--gold)]">ROLE MATRIX</p>
          <h2 className="mt-2 font-serif text-2xl font-light">角色权限矩阵</h2>
        </div>
        <div className="grid gap-0 md:grid-cols-4">
          {editableRoles.map((role) => (
            <article key={role} className="border-b border-[color:var(--border)] p-5 md:border-r md:last:border-r-0">
              <p className="font-serif text-2xl font-light">{roleLabels[role]}</p>
              <div className="mt-4 grid gap-2">
                {Object.entries(permissionLabels).map(([permission, label]) => {
                  const allowed = rolePermissions[role].includes(permission as keyof typeof permissionLabels);
                  return (
                    <p key={permission} className={`flex min-h-8 items-center gap-2 text-sm ${allowed ? "text-[color:var(--gold-dark)]" : "text-[color:var(--muted)] opacity-55"}`}>
                      {allowed ? <ShieldCheck aria-hidden size={15} /> : <ShieldAlert aria-hidden size={15} />}
                      {label}
                    </p>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      {canWriteUsers ? (
        <section className="mt-8 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <div className="flex items-center gap-2">
            <UserPlus aria-hidden size={18} className="text-[color:var(--gold-dark)]" />
            <h2 className="font-serif text-2xl font-light">新增管理员</h2>
          </div>
          <form action={saveAdminUserAction} className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_160px_150px]">
            <input className="h-12 min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none" name="email" type="email" placeholder="email@example.com" required />
            <input className="h-12 min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none" name="name" placeholder="显示名称" />
            <select name="role" defaultValue="editor" className="h-12 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
              {editableRoles.map((role) => (
                <option key={role} value={role}>{roleLabels[role]}</option>
              ))}
            </select>
            <label className="flex min-h-12 items-center gap-2 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm text-[color:var(--muted)]">
              <input name="isActive" type="checkbox" defaultChecked className="h-4 w-4 accent-[color:var(--gold)]" />
              启用
            </label>
            <input className="h-12 min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none lg:col-span-3" name="password" type="password" placeholder="初始密码（至少 12 位）" required minLength={12} />
            <button className="min-h-12 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white" type="submit">
              新增
            </button>
          </form>
        </section>
      ) : null}

      {canWriteUsers && setupTotpUser && setupTotpQr ? (
        <section className="mt-8 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <div className="flex items-center gap-2">
            <KeyRound aria-hidden size={18} className="text-[color:var(--gold-dark)]" />
            <h2 className="font-serif text-2xl font-light">启用 TOTP 二步验证</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
            <div className="w-fit border border-[color:var(--border)] bg-white p-3">
              <Image src={setupTotpQr} alt={`${setupTotpUser.email} TOTP QR Code`} width={192} height={192} unoptimized />
            </div>
            <div className="min-w-0">
              <p className="break-words text-sm leading-7 text-[color:var(--muted)]">
                使用 Google Authenticator、1Password、Microsoft Authenticator 等应用扫描二维码，然后输入 6 位验证码确认启用。
              </p>
              <p className="mt-3 break-all border border-dashed border-[color:var(--border)] bg-[color:var(--ivory)] p-3 text-xs text-[color:var(--muted)]">
                {setupTotpUri}
              </p>
              <form action={enableTotpAction} className="mt-4 flex flex-wrap gap-3">
                <input type="hidden" name="id" value={setupTotpUser.id.toString()} />
                <input name="totpCode" inputMode="numeric" autoComplete="one-time-code" required className="h-12 min-w-0 flex-1 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none" placeholder="6 位验证码" />
                <button className="min-h-12 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white" type="submit">
                  启用
                </button>
              </form>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-8 overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="grid gap-0">
          {users.map((user) => (
            <article key={user.id.toString()} className="grid gap-5 border-b border-[color:var(--border)] p-5 last:border-b-0 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_220px]">
              <div className="min-w-0">
                <p className="break-words font-serif text-2xl font-light">{user.name ?? user.email}</p>
                <p className="mt-2 break-words text-sm text-[color:var(--muted)]">{user.email}</p>
                <p className="mt-3 text-sm text-[color:var(--gold-dark)]">{roleLabels[user.role]}</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">Last login: {formatDate(user.lastLoginAt)}</p>
              </div>

              <div className="min-w-0">
                <SecurityStatus
                  isActive={user.isActive}
                  lockedUntil={user.lockedUntil}
                  failedLoginCount={user.failedLoginCount}
                  totpEnabled={user.totpEnabled}
                  totpVerifiedAt={user.totpVerifiedAt}
                />
                <div className="mt-4 border border-dashed border-[color:var(--border)] bg-[color:var(--ivory)] p-3 text-sm leading-6 text-[color:var(--muted)]">
                  <span className="inline-flex items-center gap-2 text-[color:var(--gold-dark)]">
                    <KeyRound aria-hidden size={15} />
                    TOTP 二步验证
                  </span>
                  <p className="mt-1">
                    {user.totpEnabled
                      ? `登录时需要验证码；剩余备用码 ${user.totpBackupCodes.length} 个。`
                      : user.totpSecret
                        ? "已生成密钥，等待扫码校验启用。"
                        : "未生成密钥。"}
                  </p>
                </div>
              </div>

              <div className="grid content-start gap-3">
                {canWriteUsers ? (
                  <>
                    <form action={saveAdminUserAction} className="grid gap-2">
                      <input type="hidden" name="id" value={user.id.toString()} />
                      <input className="h-11 min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none" name="email" defaultValue={user.email} required />
                      <input className="h-11 min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none" name="name" defaultValue={user.name ?? ""} placeholder="显示名称" />
                      <select name="role" defaultValue={user.role} className="h-11 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
                        {editableRoles.map((role) => (
                          <option key={role} value={role}>{roleLabels[role]}</option>
                        ))}
                      </select>
                      <input className="h-11 min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none" name="password" type="password" placeholder="留空不改密码" minLength={12} />
                      <label className="flex min-h-10 items-center gap-2 text-sm text-[color:var(--muted)]">
                        <input name="isActive" type="checkbox" defaultChecked={user.isActive} className="h-4 w-4 accent-[color:var(--gold)]" />
                        启用账号
                      </label>
                      <button className="min-h-11 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)]" type="submit">
                        保存 / 重置密码
                      </button>
                    </form>
                    <form action={toggleAdminUserActiveAction}>
                      <input type="hidden" name="id" value={user.id.toString()} />
                      <button className="min-h-11 w-full border border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)]" type="submit">
                        {user.isActive ? "禁用账号" : "启用账号"}
                      </button>
                    </form>
                    <form action={user.totpEnabled || user.totpSecret ? disableTotpAction : startTotpSetupAction}>
                      <input type="hidden" name="id" value={user.id.toString()} />
                      <button className="min-h-11 w-full border border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)]" type="submit">
                        {user.totpEnabled || user.totpSecret ? "关闭 / 重置 TOTP" : "设置 TOTP"}
                      </button>
                    </form>
                  </>
                ) : (
                  <span className="inline-flex min-h-11 items-center justify-center border border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)] opacity-70">
                    无操作权限
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
