import Link from "next/link";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-md border border-[color:var(--border)] bg-white p-8">
        <p className="text-center text-xs tracking-[0.32em] text-[color:var(--gold)]">
          GYOKURINKEN CMS
        </p>
        <h1 className="mt-4 text-center font-serif text-3xl">管理后台登录</h1>

        <Suspense>
          <AdminLoginForm />
        </Suspense>

        <Link
          href="/ja"
          className="mt-6 block text-center text-sm text-[color:var(--muted)] hover:text-[color:var(--gold)]"
        >
          前台へ戻る
        </Link>
      </div>
    </div>
  );
}
