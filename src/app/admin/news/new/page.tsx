import type { Metadata } from "next";
import { adminMediaAlt } from "@/lib/admin-media";
import { AdminContentForm } from "@/components/admin-content-manager";
import { AdminShell } from "@/components/admin-shell";
import { requireContentEditor } from "@/lib/admin-auth";
import { getAdminLocale } from "@/lib/admin-locale";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "新增资讯 | 玉林軒 CMS",
  description: "新增玉林軒株式会社官方资讯。"
};

export default async function AdminNewsNewPage() {
  await requireContentEditor();
  const locale = await getAdminLocale();
  const mediaRows = await prisma.media.findMany({
    select: { id: true, url: true, urlWebp: true, urlThumb: true, originalName: true, filename: true, altText: true },
    orderBy: { createdAt: "desc" },
    take: 80
  });
  const media = mediaRows.map((item) => ({ ...item, id: item.id.toString(), altText: adminMediaAlt(item.altText) }));

  return (
    <AdminShell
      title="新增资讯"
      description="创建新的官网资讯。提交后将保存为 Prisma news 记录，并同步前台三语 News 页面。"
    >
      <AdminContentForm kind="news" mode="new" media={media} locale={locale} />
    </AdminShell>
  );
}
