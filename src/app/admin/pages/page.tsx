import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { adminMediaAlt } from "@/lib/admin-media";
import { AdminPageBlocksManager } from "@/components/admin-page-blocks-manager";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getPageBlocksForAdmin } from "@/lib/page-blocks";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "页面模块 | 玉林軒 CMS",
  description: "编辑布局、首页、About、Appraisal、Purchase Guide、FAQ、Contact、Access 的 page_blocks 三语模块。"
};

export default async function AdminPagesPage() {
  noStore();
  const session = await requireAdmin();
  const readOnly = session.user.role === "viewer";
  const [rows, mediaRows] = await Promise.all([
    getPageBlocksForAdmin(),
    prisma.media.findMany({
      select: { id: true, url: true, urlWebp: true, urlThumb: true, originalName: true, filename: true, altText: true },
      orderBy: { createdAt: "desc" },
      take: 60
    })
  ]);
  const clientRows = rows.map((row) => ({
    ...row,
    record: row.record
      ? {
          content: row.record.content,
          sortOrder: row.record.sortOrder,
          isActive: row.record.isActive,
          updatedAt: row.record.updatedAt.toISOString()
        }
      : null
  }));
  const media = mediaRows.map((item) => ({
    ...item,
    id: item.id.toString(),
    altText: adminMediaAlt(item.altText)
  }));

  return (
    <AdminShell
      title="页面模块"
      description="维护顶部导航、页脚、首页、About、鉴定、购买方法、FAQ、Contact / Access 的说明文案、图片、排序和发布状态。未创建的模块会由前台自动使用三语默认内容。"
    >
      {readOnly ? (
        <p className="mt-8 border border-[color:var(--border)] bg-[color:var(--paper)] px-4 py-3 text-sm text-[color:var(--muted)]">
          Viewer 账号为只读模式，可以查看模块内容但不能保存。
        </p>
      ) : null}
      <AdminPageBlocksManager rows={clientRows} media={media} readOnly={readOnly} />
    </AdminShell>
  );
}
