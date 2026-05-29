import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { adminMediaAlt } from "@/lib/admin-media";
import { AdminContentForm } from "@/components/admin-content-manager";
import { AdminShell } from "@/components/admin-shell";
import { requireContentEditor } from "@/lib/admin-auth";
import { blogEntries } from "@/lib/content-data";
import { getCmsContentEntry } from "@/lib/cms-content";
import { prisma } from "@/lib/prisma";

export function generateStaticParams() {
  return blogEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getCmsContentEntry("blog", slug, { admin: true });

  return {
    title: entry ? `编辑博客：${entry.title.ja} | 玉林軒 CMS` : "编辑博客 | 玉林軒 CMS",
    description: "编辑玉林軒株式会社鉴定师博客文章。"
  };
}

export default async function AdminBlogEditPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireContentEditor();
  const [entry, mediaRows] = await Promise.all([
    getCmsContentEntry("blog", slug, { admin: true }),
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
      title="编辑博客"
      description="编辑三语博客内容、封面、分类标签、发布状态和 SEO。保存后写入 Prisma blog_posts。"
    >
      <AdminContentForm kind="blog" mode="edit" entry={entry} media={media} />
    </AdminShell>
  );
}
