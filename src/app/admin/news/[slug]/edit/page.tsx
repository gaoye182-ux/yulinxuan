import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { adminMediaAlt } from "@/lib/admin-media";
import { AdminContentForm } from "@/components/admin-content-manager";
import { AdminShell } from "@/components/admin-shell";
import { requireContentEditor } from "@/lib/admin-auth";
import { newsEntries } from "@/lib/content-data";
import { getCmsContentEntry } from "@/lib/cms-content";
import { prisma } from "@/lib/prisma";

export function generateStaticParams() {
  return newsEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getCmsContentEntry("news", slug, { admin: true });

  return {
    title: entry ? `编辑资讯：${entry.title.ja} | 玉林軒 CMS` : "编辑资讯 | 玉林軒 CMS",
    description: "编辑玉林軒株式会社官方资讯。"
  };
}

export default async function AdminNewsEditPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireContentEditor();
  const [entry, mediaRows] = await Promise.all([
    getCmsContentEntry("news", slug, { admin: true }),
    prisma.media.findMany({
      select: { id: true, url: true, urlWebp: true, urlThumb: true, originalName: true, filename: true, altText: true },
      orderBy: { createdAt: "desc" },
      take: 80
    })
  ]);
  const media = mediaRows.map((item) => ({ ...item, id: item.id.toString(), altText: adminMediaAlt(item.altText) }));

  if (!entry) {
    notFound();
  }

  return (
    <AdminShell
      title="编辑资讯"
      description="编辑三语资讯内容、类型标签、发布状态和 SEO。保存后写入 Prisma news。"
    >
      <AdminContentForm kind="news" mode="edit" entry={entry} media={media} />
    </AdminShell>
  );
}
