import Image from "next/image";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { FileImage, ImageIcon, LinkIcon, Plus, Search, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { cleanupUnusedMediaAction, createMediaFromUrlAction, deleteMediaAction, getMediaReferenceCount, replaceMediaFileAction, updateMediaAltAction, uploadMediaAction } from "@/lib/media-actions";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { languages } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "媒体库 | 玉林軒 CMS",
  description: "管理玉林軒株式会社后台媒体上传、缩略图、WebP、alt 文本和引用保护。"
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value);
}

export default async function AdminMediaPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  noStore();
  const session = await requireAdmin();
  const readOnly = session.user.role === "viewer";
  const { q = "" } = await searchParams;
  const query = q.trim();
  const mediaRows = await prisma.media.findMany({
    where: query
      ? {
          OR: [
            { filename: { contains: query, mode: "insensitive" } },
            { originalName: { contains: query, mode: "insensitive" } },
            { url: { contains: query, mode: "insensitive" } }
          ]
        }
      : undefined,
    include: { uploadedBy: { select: { email: true, name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100
  });
  const media = await Promise.all(
    mediaRows.map(async (item) => ({
      ...item,
      referenceCount: await getMediaReferenceCount(item.id, [item.url, item.urlWebp, item.urlThumb].filter(Boolean) as string[])
    }))
  );

  return (
    <AdminShell
      title="媒体库"
      description="上传图片后自动保留原图，生成 WebP 展示图和缩略图；支持 JA / ZH / EN alt 文本、搜索筛选和引用保护删除。"
    >
      {!readOnly ? (
        <form action={uploadMediaAction} className="mt-8 grid gap-5 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <div className="flex items-center gap-3">
            <FileImage aria-hidden size={18} className="text-[color:var(--gold-dark)]" />
            <h2 className="font-serif text-2xl font-light">上传图片</h2>
          </div>
          <label className="block min-w-0">
            <span className="text-sm text-[color:var(--muted)]">图片文件（JPG / PNG / WebP / HEIC，最大 5MB）</span>
            <input name="file" type="file" required accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif" className="mt-2 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 py-3 text-base outline-none file:mr-4 file:min-h-10 file:border-0 file:bg-[color:var(--gold)] file:px-4 file:text-sm file:text-white focus:border-[color:var(--gold)]" />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            {languages.map((lang) => (
              <label key={lang} className="block min-w-0">
                <span className="text-sm text-[color:var(--muted)]">Alt {lang.toUpperCase()}</span>
                <input name={`altText_${lang}`} className="mt-2 h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none focus:border-[color:var(--gold)]" />
              </label>
            ))}
          </div>
          <button className="inline-flex min-h-12 w-fit items-center justify-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-white">
            <Plus aria-hidden size={16} />
            上传并生成 WebP
          </button>
        </form>
      ) : (
        <p className="mt-8 border border-[color:var(--border)] bg-[color:var(--paper)] px-4 py-3 text-sm text-[color:var(--muted)]">
          Viewer 账号为只读模式，不能上传新媒体。
        </p>
      )}

      {!readOnly ? (
        <form action={createMediaFromUrlAction} className="mt-5 grid gap-5 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
          <div className="flex items-center gap-3">
            <LinkIcon aria-hidden size={16} />
            <h2 className="font-serif text-2xl font-light">登记外部 URL</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
            <label className="block min-w-0">
              <span className="text-sm text-[color:var(--muted)]">Image URL</span>
              <input name="url" required placeholder="/images/example.jpg" className="mt-2 h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none focus:border-[color:var(--gold)]" />
            </label>
            <label className="block min-w-0">
              <span className="text-sm text-[color:var(--muted)]">Original name</span>
              <input name="originalName" placeholder="example.jpg" className="mt-2 h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none focus:border-[color:var(--gold)]" />
            </label>
            <label className="block min-w-0">
              <span className="text-sm text-[color:var(--muted)]">MIME</span>
              <input name="mimeType" placeholder="image/jpeg" className="mt-2 h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none focus:border-[color:var(--gold)]" />
            </label>
          </div>
          <button className="inline-flex min-h-12 w-fit items-center justify-center gap-2 border border-[color:var(--gold)] px-5 text-sm tracking-[0.14em] text-[color:var(--gold-dark)]">
            <LinkIcon aria-hidden size={16} />
            保存 URL
          </button>
        </form>
      ) : null}

      <form className="mt-8 flex min-h-12 items-center gap-3 border border-[color:var(--border)] bg-[color:var(--paper)] px-4">
        <Search aria-hidden size={17} className="shrink-0 text-[color:var(--gold-dark)]" />
        <input name="q" defaultValue={query} placeholder="搜索文件名、URL" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[color:var(--muted)]/70" />
        <button className="min-h-10 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)]">筛选</button>
      </form>

      {!readOnly ? (
        <form action={cleanupUnusedMediaAction} className="mt-4 border border-[color:var(--border)] bg-[color:var(--paper)] p-4">
          <button className="min-h-11 border border-[color:var(--red-seal)] px-4 text-sm text-[color:var(--red-seal)]">
            清理未使用媒体
          </button>
          <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">只删除引用数为 0 的媒体记录和本地上传文件；被藏品、分类、页面模块、博客或资讯引用的媒体会保留。</p>
        </form>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {media.length ? (
          media.map((item) => (
            <article key={item.id.toString()} className="min-w-0 border border-[color:var(--border)] bg-[color:var(--paper)] p-4">
              <div className="relative aspect-[16/10] overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory)]">
                {item.url ? (
                  <Image src={item.urlThumb ?? item.urlWebp ?? item.url} alt={String(item.originalName ?? item.filename)} fill sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw" className="object-cover" unoptimized />
                ) : (
                  <div className="grid h-full place-items-center text-[color:var(--muted)]">
                    <ImageIcon aria-hidden size={24} />
                  </div>
                )}
              </div>
              <h3 className="mt-4 break-words font-serif text-xl font-light">{item.originalName ?? item.filename}</h3>
              <p className="mt-2 break-words text-xs leading-6 text-[color:var(--muted)]">{item.url}</p>
              {item.urlWebp ? <p className="mt-1 break-words text-xs leading-6 text-[color:var(--muted)]">WebP: {item.urlWebp}</p> : null}
              <dl className="mt-4 grid gap-2 border-t border-[color:var(--border)] pt-3 text-xs text-[color:var(--muted)]">
                <div className="flex justify-between gap-3">
                  <dt className="text-[color:var(--gold-dark)]">Size</dt>
                  <dd>{item.width && item.height ? `${item.width} x ${item.height}` : "-"} / {item.fileSize ? `${Math.round(item.fileSize / 1024)} KB` : "-"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[color:var(--gold-dark)]">References</dt>
                  <dd>{item.referenceCount}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[color:var(--gold-dark)]">Uploaded</dt>
                  <dd>{formatDate(item.createdAt)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[color:var(--gold-dark)]">By</dt>
                  <dd className="min-w-0 break-words text-right">{item.uploadedBy?.name ?? item.uploadedBy?.email ?? "-"}</dd>
                </div>
              </dl>
              <form action={updateMediaAltAction} className="mt-4 grid gap-3 border-t border-[color:var(--border)] pt-4">
                <input type="hidden" name="id" value={item.id.toString()} />
                {languages.map((lang) => {
                  const altText = item.altText && typeof item.altText === "object" && !Array.isArray(item.altText) ? item.altText as Record<string, unknown> : {};
                  return (
                    <label key={lang} className="block min-w-0">
                      <span className="text-xs text-[color:var(--muted)]">Alt {lang.toUpperCase()}</span>
                      <input name={`altText_${lang}`} defaultValue={String(altText[lang] ?? "")} disabled={readOnly} className="mt-1 h-10 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none focus:border-[color:var(--gold)] disabled:opacity-70" />
                    </label>
                  );
                })}
                {!readOnly ? (
                  <div className="flex flex-wrap gap-2">
                    <button className="min-h-10 flex-1 border border-[color:var(--gold)] px-3 text-sm text-[color:var(--gold-dark)]">保存 alt</button>
                    <button formAction={deleteMediaAction} className="inline-flex min-h-10 items-center justify-center gap-2 border border-[color:var(--red-seal)] px-3 text-sm text-[color:var(--red-seal)]">
                      <Trash2 size={15} />
                      删除
                    </button>
                  </div>
                ) : null}
              </form>
              {!readOnly ? (
                <form action={replaceMediaFileAction} className="mt-4 grid gap-3 border-t border-[color:var(--border)] pt-4">
                  <input type="hidden" name="id" value={item.id.toString()} />
                  <label className="block min-w-0">
                    <span className="text-xs text-[color:var(--muted)]">替换图片并保持当前 URL</span>
                    <input name="file" type="file" required accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif" className="mt-1 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-[color:var(--gold)] file:px-3 file:py-2 file:text-white" />
                  </label>
                  <button className="min-h-10 border border-[color:var(--gold)] px-3 text-sm text-[color:var(--gold-dark)]">替换文件</button>
                </form>
              ) : null}
            </article>
          ))
        ) : (
          <p className="border border-[color:var(--border)] bg-[color:var(--paper)] p-6 text-sm text-[color:var(--muted)] md:col-span-2 xl:col-span-3">
            暂无媒体记录。登记 URL 后可用于 Blog / News 的封面或 OGP 图片。
          </p>
        )}
      </section>
    </AdminShell>
  );
}
