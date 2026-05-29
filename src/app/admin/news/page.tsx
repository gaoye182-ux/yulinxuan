import type { Metadata } from "next";
import { AdminContentManager } from "@/components/admin-content-manager";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getCmsContentEntries } from "@/lib/cms-content";

export const metadata: Metadata = {
  title: "资讯管理 | 玉林軒 CMS",
  description: "管理玉林軒株式会社最新资讯的三语内容、类型、标签、发布状态与 SEO。"
};

export default async function AdminNewsPage() {
  const session = await requireAdmin();
  const entries = await getCmsContentEntries("news", { admin: true });
  const readOnly = session?.user?.role === "viewer";

  return (
    <AdminShell
      title="资讯管理"
      description="维护官网新着情報。支持公告、新入荷、活动、营业安排等类型，并预留定时发布、预览、SEO 与媒体库封面入口。"
      action={{ href: "/admin/news/new", label: "新增资讯" }}
    >
      <AdminContentManager kind="news" entries={entries} readOnly={readOnly} />
    </AdminShell>
  );
}
