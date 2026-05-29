import type { Metadata } from "next";
import { AdminContentManager } from "@/components/admin-content-manager";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminLocale } from "@/lib/admin-locale";
import { getCmsContentEntries } from "@/lib/cms-content";

export const metadata: Metadata = {
  title: "博客管理 | 玉林軒 CMS",
  description: "管理玉林軒株式会社鉴定师博客的三语内容、分类、标签、发布状态与 SEO。"
};

export default async function AdminBlogPage() {
  const session = await requireAdmin();
  const locale = await getAdminLocale();
  const entries = await getCmsContentEntries("blog", { admin: true });
  const readOnly = session?.user?.role === "viewer";

  return (
    <AdminShell
      title="博客管理"
      description="维护鉴定师博客文章。支持 JA / ZH / EN 三语标题、摘要、富文本正文、分类、标签、封面、发布状态和 SEO 设置。"
      action={{ href: "/admin/blog/new", label: "新增博客" }}
    >
      <AdminContentManager kind="blog" entries={entries} readOnly={readOnly} locale={locale} />
    </AdminShell>
  );
}
