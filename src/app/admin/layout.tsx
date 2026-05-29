import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[color:var(--ink)]">
      {children}
    </main>
  );
}
