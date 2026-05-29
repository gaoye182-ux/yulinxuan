import type { Metadata } from "next";
import { adminMediaAlt } from "@/lib/admin-media";
import { AdminContentForm } from "@/components/admin-content-manager";
import { AdminShell } from "@/components/admin-shell";
import { requireContentEditor } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "新增博客 | 玉林軒 CMS",
  description: "新增玉林軒株式会社鉴定师博客文章。"
};

export default async function AdminBlogNewPage() {
  await requireContentEditor();
  const mediaRows = await prisma.media.findMany({
    select: { id: true, url: true, urlWebp: true, urlThumb: true, originalName: true, filename: true, altText: true },
    orderBy: { createdAt: "desc" },
    take: 80
  });
  const media = mediaRows.map((item) => ({ ...item, id: item.id.toString(), altText: adminMediaAlt(item.altText) }));

  return (
    <AdminShell
      title="新增博客"
      description="创建新的鉴定师博客。提交后将保存为 Prisma blog_posts 记录，并同步前台三语 Blog 页面。"
    >
      <AdminContentForm kind="blog" mode="new" media={media} />
    </AdminShell>
  );
}
