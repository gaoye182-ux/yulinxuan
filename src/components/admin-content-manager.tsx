"use client";

import Image from "next/image";
import Link from "next/link";
import { Bold, CalendarClock, Eye, FilePenLine, Filter, Globe2, Heading2, ImageIcon, Italic, Quote, Search, Tag } from "lucide-react";
import { useState } from "react";
import { AdminMediaPicker, type AdminMediaItem } from "@/components/admin-media-picker";
import type { Language } from "@/lib/i18n";
import { languages } from "@/lib/i18n";
import type { ContentEntry, ContentKind } from "@/lib/content-data";
import { saveBlogPostAction, saveNewsAction } from "@/lib/cms-actions";

type AdminContentManagerProps = {
  kind: ContentKind;
  entries: ContentEntry[];
  readOnly?: boolean;
};

type AdminContentFormProps = {
  kind: ContentKind;
  mode: "new" | "edit";
  entry?: ContentEntry;
  media?: AdminMediaItem[];
  readOnly?: boolean;
};

const kindConfig = {
  blog: {
    listTitle: "博客内容",
    typeLabel: "分类",
    newLabel: "新增博客",
    editLabel: "编辑博客",
    previewBase: "/blog",
    placeholderCategory: "鑑定コラム"
  },
  news: {
    listTitle: "资讯内容",
    typeLabel: "类型",
    newLabel: "新增资讯",
    editLabel: "编辑资讯",
    previewBase: "/news",
    placeholderCategory: "お知らせ"
  }
} satisfies Record<
  ContentKind,
  {
    listTitle: string;
    typeLabel: string;
    newLabel: string;
    editLabel: string;
    previewBase: string;
    placeholderCategory: string;
  }
>;

const statusTone = {
  published: "border-[color:var(--gold)] text-[color:var(--gold-dark)]",
  draft: "border-[color:var(--border)] text-[color:var(--muted)]",
  scheduled: "border-[color:var(--red-seal)] text-[color:var(--red-seal)]"
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(`${date}T00:00:00`)
  );
}

function getAdminStatus(entry: ContentEntry) {
  if (entry.status === "draft") {
    return { label: "draft", text: "草稿" };
  }

  if (entry.featured) {
    return { label: "published", text: "已发布 / 推荐" };
  }

  if (entry.date > todayIsoDate()) {
    return { label: "scheduled", text: "定时发布" };
  }

  return { label: "published", text: "已发布" };
}

function joinLocalizedTags(entry: ContentEntry, lang: Language) {
  return entry.tags.map((tag) => tag[lang]).join(", ");
}

export function AdminContentManager({ kind, entries, readOnly = false }: AdminContentManagerProps) {
  const config = kindConfig[kind];
  const featuredCount = entries.filter((entry) => entry.featured).length;
  const categories = Array.from(new Set(entries.map((entry) => entry.category.ja)));

  return (
    <div className="grid gap-6 py-6">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "总条目", value: entries.length },
          { label: "已发布", value: entries.length },
          { label: "推荐显示", value: featuredCount },
          { label: "分类/类型", value: categories.length }
        ].map((item) => (
          <div key={item.label} className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
            <p className="text-sm text-[color:var(--muted)]">{item.label}</p>
            <p className="mt-3 font-serif text-4xl font-light text-[color:var(--gold-dark)]">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
          <label className="min-w-0">
            <span className="sr-only">搜索</span>
            <div className="flex min-h-12 items-center gap-3 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4">
              <Search aria-hidden size={17} className="shrink-0 text-[color:var(--gold-dark)]" />
              <input
                placeholder="搜索标题、slug、标签"
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[color:var(--muted)]/70"
              />
            </div>
          </label>
          <label className="min-w-0">
            <span className="sr-only">{config.typeLabel}</span>
            <select className="h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
              <option>{config.typeLabel}：全部</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="min-w-0">
            <span className="sr-only">状态</span>
            <select className="h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
              <option>状态：全部</option>
              <option>已发布</option>
              <option>草稿</option>
              <option>定时发布</option>
            </select>
          </label>
          <button className="inline-flex min-h-12 items-center justify-center gap-2 border border-[color:var(--gold)] px-4 text-sm text-[color:var(--gold-dark)]">
            <Filter aria-hidden size={16} />
            筛选
          </button>
        </div>
      </section>

      <section className="overflow-hidden border border-[color:var(--border)] bg-[color:var(--paper)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] px-5 py-4">
          <h2 className="font-serif text-2xl font-light">{config.listTitle}</h2>
          <p className="text-sm text-[color:var(--muted)]">
            {readOnly ? "Viewer 权限为只读模式，编辑与新增入口已禁用" : "支持搜索、筛选、分页、预览与编辑入口"}
          </p>
        </div>

        <div className="grid gap-0">
          {entries.map((entry) => {
            const status = getAdminStatus(entry);
            return (
              <article
                key={entry.slug}
                className="grid min-w-0 gap-4 border-b border-[color:var(--border)] p-5 last:border-b-0 lg:grid-cols-[96px_minmax(0,1fr)_170px_180px]"
              >
                <div className="relative h-24 w-24 overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory)]">
                  {entry.image ? (
                    <Image src={entry.image} alt={entry.title.ja} fill sizes="96px" className="object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-[color:var(--gold-dark)]">
                      <ImageIcon aria-hidden size={24} />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
                    <span className="border border-[color:var(--gold)] px-2 py-1 text-[color:var(--gold-dark)]">
                      {entry.category.ja}
                    </span>
                    <span className={`border px-2 py-1 ${statusTone[status.label as keyof typeof statusTone]}`}>
                      {status.text}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock aria-hidden size={13} />
                      {formatDate(entry.date)}
                    </span>
                  </div>
                  <h3 className="mt-3 break-words font-serif text-2xl font-light">{entry.title.ja}</h3>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{entry.excerpt.ja}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
                    {languages.map((lang) => (
                      <span key={lang} className="inline-flex items-center gap-1 border border-[color:var(--border)] px-2 py-1">
                        <Globe2 aria-hidden size={12} />
                        {lang.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                <dl className="grid content-start gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-[color:var(--gold-dark)]">Slug</dt>
                    <dd className="mt-1 min-w-0 break-words text-[color:var(--muted)]">{entry.slug}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[color:var(--gold-dark)]">Tags</dt>
                    <dd className="mt-1 min-w-0 break-words text-[color:var(--muted)]">{joinLocalizedTags(entry, "ja")}</dd>
                  </div>
                </dl>

                <div className="flex flex-wrap content-start gap-2 lg:justify-end">
                  <Link
                    href={`/ja${config.previewBase}/${entry.slug}`}
                    className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted)] hover:border-[color:var(--gold)]"
                  >
                    <Eye aria-hidden size={15} />
                    预览
                  </Link>
                  {readOnly ? (
                    <span className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted)] opacity-70">
                      <FilePenLine aria-hidden size={15} />
                      只读
                    </span>
                  ) : (
                    <Link
                      href={`/admin/${kind}/${entry.slug}/edit`}
                      className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--gold)] px-3 text-sm text-[color:var(--gold-dark)] hover:bg-[color:var(--gold)] hover:text-white"
                    >
                      <FilePenLine aria-hidden size={15} />
                      编辑
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm text-[color:var(--muted)]">{children}</span>;
}

function TextField({
  label,
  name,
  defaultValue,
  placeholder
}: {
  label: string;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block min-w-0">
      <FieldLabel>{label}</FieldLabel>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 h-12 w-full min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none focus:border-[color:var(--gold)]"
      />
    </label>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  rows = 4,
  placeholder
}: {
  label: string;
  name?: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block min-w-0">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full min-w-0 resize-y border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 py-3 text-base leading-7 outline-none focus:border-[color:var(--gold)]"
      />
    </label>
  );
}

function RichTextField({
  label,
  name,
  defaultValue,
  placeholder,
  imageUrl
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  imageUrl?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [preview, setPreview] = useState(false);

  function append(snippet: string) {
    setValue((current) => `${current}${current.endsWith("\n") || !current ? "" : "\n"}${snippet}`);
  }

  return (
    <div className="block min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <FieldLabel>{label}</FieldLabel>
        <div className="flex flex-wrap gap-1">
          <button type="button" onClick={() => append("## ")} className="grid size-9 place-items-center border border-[color:var(--border)] text-[color:var(--gold-dark)]" title="小标题"><Heading2 size={15} /></button>
          <button type="button" onClick={() => append("**太字**")} className="grid size-9 place-items-center border border-[color:var(--border)] text-[color:var(--gold-dark)]" title="粗体"><Bold size={15} /></button>
          <button type="button" onClick={() => append("*斜体*")} className="grid size-9 place-items-center border border-[color:var(--border)] text-[color:var(--gold-dark)]" title="斜体"><Italic size={15} /></button>
          <button type="button" onClick={() => append("> 引用文")} className="grid size-9 place-items-center border border-[color:var(--border)] text-[color:var(--gold-dark)]" title="引用"><Quote size={15} /></button>
          <button type="button" onClick={() => append(`![image](${imageUrl || "/uploads/media/example.webp"})`)} className="grid size-9 place-items-center border border-[color:var(--border)] text-[color:var(--gold-dark)]" title="插入图片"><ImageIcon size={15} /></button>
          <button type="button" onClick={() => setPreview((current) => !current)} className="min-h-9 border border-[color:var(--border)] px-3 text-xs text-[color:var(--muted)]">{preview ? "编辑" : "预览"}</button>
        </div>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={9}
        placeholder={placeholder}
        className="mt-2 w-full min-w-0 resize-y border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 py-3 text-base leading-7 outline-none focus:border-[color:var(--gold)]"
      />
      {preview ? (
        <div className="mt-3 border border-[color:var(--border)] bg-white p-4 text-sm leading-7 text-[color:var(--muted)]">
          {value.split(/\n{2,}/).map((block, index) => {
            if (block.startsWith("## ")) {
              return <h4 key={index} className="mt-3 font-serif text-xl font-light text-[color:var(--ink)] first:mt-0">{block.replace(/^##\s*/, "")}</h4>;
            }
            if (block.startsWith("> ")) {
              return <blockquote key={index} className="border-l border-[color:var(--gold)] pl-4 text-[color:var(--ink)]">{block.replace(/^>\s*/, "")}</blockquote>;
            }
            if (/^!\[.*\]\(.+\)$/.test(block.trim())) {
              const src = block.replace(/^!\[.*\]\((.+)\)$/, "$1");
              {/* eslint-disable-next-line @next/next/no-img-element */}
              return <img key={index} src={src} alt="" className="max-h-72 w-full object-cover" />;
            }
            return <p key={index} className="whitespace-pre-wrap">{block}</p>;
          })}
        </div>
      ) : null}
    </div>
  );
}

export function AdminContentForm({ kind, mode, entry, media = [], readOnly = false }: AdminContentFormProps) {
  const config = kindConfig[kind];
  const action = kind === "blog" ? saveBlogPostAction : saveNewsAction;
  const title = mode === "new" ? config.newLabel : config.editLabel;
  const defaultSlug = entry?.slug ?? "";
  const defaultCategory = entry?.category.ja ?? config.placeholderCategory;
  const defaultTags = entry ? joinLocalizedTags(entry, "ja") : "";
  const defaultStatus = entry?.status ?? "published";
  const [selectedMedia, setSelectedMedia] = useState<AdminMediaItem | null>(() => {
    if (!entry?.image) {
      return null;
    }

    return media.find((item) => item.id === entry.coverMediaId || item.url === entry.image || item.urlWebp === entry.image) ?? {
      id: entry.coverMediaId ?? "",
      url: entry.image,
      originalName: "Current image",
      filename: entry.image
    };
  });
  const [pickerOpen, setPickerOpen] = useState(false);
  const imageUrl = selectedMedia?.url ?? entry?.image ?? "";

  return (
    <form action={action} className="grid gap-6 py-6">
      <input type="hidden" name="existingSlug" value={entry?.slug ?? ""} />
      <input type="hidden" name="coverMediaId" value={selectedMedia?.id ?? ""} />
      <section className="grid gap-5 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] pb-4">
          <div>
            <p className="text-xs tracking-[0.24em] text-[color:var(--gold)]">CONTENT</p>
            <h2 className="mt-2 font-serif text-2xl font-light">{title}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {readOnly ? (
              <span className="inline-flex min-h-11 items-center border border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)]">
                Viewer 只读，保存按钮已禁用
              </span>
            ) : (
              <>
            <button
              type="submit"
              name="status"
              value="draft"
              className="min-h-11 border border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)]"
            >
              保存草稿
            </button>
            <button
              type="submit"
              name="status"
              value="published"
              className="min-h-11 border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 text-sm text-white"
            >
              发布
            </button>
              </>
            )}
          </div>
        </div>

        <fieldset disabled={readOnly} className="grid gap-5 disabled:opacity-75 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid min-w-0 gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField name="slug" label="Slug" defaultValue={defaultSlug} placeholder="english-lowercase-slug" />
              <TextField name="category" label={config.typeLabel} defaultValue={defaultCategory} placeholder={config.placeholderCategory} />
            </div>
            <TextField name="tags" label="标签（逗号分隔）" defaultValue={defaultTags} placeholder="陶磁器, 伊万里" />

            <div className="grid gap-5">
              {languages.map((lang) => (
                <section key={lang} className="min-w-0 border border-[color:var(--border)] bg-white p-4">
                  <div className="flex items-center gap-2 border-b border-[color:var(--border)] pb-3">
                    <Globe2 aria-hidden size={16} className="text-[color:var(--gold-dark)]" />
                    <h3 className="font-serif text-xl font-light">{lang.toUpperCase()} 内容</h3>
                  </div>
                  <div className="mt-4 grid gap-4">
                    <TextField
                      name={`title_${lang}`}
                      label="标题"
                      defaultValue={entry?.title[lang]}
                      placeholder={lang === "en" ? "Article title" : lang === "zh" ? "文章标题" : "記事タイトル"}
                    />
                    <TextAreaField
                      name={`excerpt_${lang}`}
                      label="摘要"
                      defaultValue={entry?.excerpt[lang]}
                      rows={3}
                      placeholder={lang === "en" ? "Short excerpt" : lang === "zh" ? "列表与 SEO 摘要" : "一覧・SEO 用の概要"}
                    />
                    <RichTextField
                      name={`content_${lang}`}
                      label="富文本正文"
                      defaultValue={
                        entry?.content?.[lang]
                          ? entry.content[lang]
                          : entry
                            ? `${entry.excerpt[lang]}\n\n## 見出し\n本文をここに入力します。画像、引用、小标题、段落结构将在 TipTap 接入后保存为 JSON。`
                          : ""
                      }
                      imageUrl={imageUrl}
                      placeholder="支持段落、小标题、引用、图片插入和预览；以 Markdown 结构保存，前台按等价富文本渲染。"
                    />
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="grid content-start gap-5">
            <section className="border border-[color:var(--border)] bg-white p-4">
              <div className="flex items-center gap-2">
                <CalendarClock aria-hidden size={17} className="text-[color:var(--gold-dark)]" />
                <h3 className="font-serif text-xl font-light">发布设置</h3>
              </div>
              <div className="mt-4 grid gap-4">
                <label className="block">
                  <FieldLabel>状态</FieldLabel>
                  <select
                    name="status"
                    defaultValue={defaultStatus}
                    className="mt-2 h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none"
                  >
                    <option value="published">已发布</option>
                    <option value="draft">草稿</option>
                    <option value="published">定时发布</option>
                  </select>
                </label>
                <TextField name="publishedAt" label="发布时间" defaultValue={entry?.date ?? todayIsoDate()} placeholder="YYYY-MM-DD" />
                <label className="flex min-h-11 items-center gap-3 text-sm text-[color:var(--muted)]">
                  <input name="isFeatured" type="checkbox" defaultChecked={entry?.featured} className="h-4 w-4 accent-[color:var(--gold)]" />
                  推荐显示
                </label>
              </div>
            </section>

            <section className="border border-[color:var(--border)] bg-white p-4">
              <div className="flex items-center gap-2">
                <ImageIcon aria-hidden size={17} className="text-[color:var(--gold-dark)]" />
                <h3 className="font-serif text-xl font-light">封面图</h3>
              </div>
              <div className="mt-4 overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory)]">
                <div className="relative aspect-[16/10]">
                  {entry?.image ? (
                    <Image src={imageUrl} alt={entry.title.ja} fill sizes="320px" className="object-cover" unoptimized />
                  ) : (
                    imageUrl ? <Image src={imageUrl} alt="Selected cover" fill sizes="320px" className="object-cover" unoptimized /> : <div className="grid h-full place-items-center text-sm text-[color:var(--muted)]">选择媒体库图片</div>
                  )}
                </div>
              </div>
              <button type="button" disabled={readOnly} onClick={() => setPickerOpen(true)} className="mt-3 min-h-11 w-full border border-[color:var(--border)] text-sm text-[color:var(--muted)] disabled:opacity-60">
                从媒体库选择
              </button>
            </section>

            <section className="border border-[color:var(--border)] bg-white p-4">
              <div className="flex items-center gap-2">
                <Tag aria-hidden size={17} className="text-[color:var(--gold-dark)]" />
                <h3 className="font-serif text-xl font-light">SEO</h3>
              </div>
              <div className="mt-4 grid gap-4">
                {languages.map((lang) => (
                  <TextField key={lang} name={`metaTitle_${lang}`} label={`Meta Title ${lang.toUpperCase()}`} defaultValue={entry?.title[lang]} />
                ))}
                {languages.map((lang) => (
                  <TextAreaField key={lang} name={`metaDescription_${lang}`} label={`Meta Description ${lang.toUpperCase()}`} defaultValue={entry?.excerpt[lang]} rows={3} />
                ))}
                <label className="block min-w-0">
                  <FieldLabel>OG Image URL</FieldLabel>
                  <input type="hidden" name="ogImage" value={imageUrl} />
                  <input value={imageUrl} readOnly placeholder="/images/ogp.jpg" className="mt-2 h-12 w-full min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none" />
                </label>
              </div>
            </section>
          </aside>
        </fieldset>
      </section>
      {pickerOpen ? (
        <AdminMediaPicker
          media={media}
          onClose={() => setPickerOpen(false)}
          onSelect={(item) => setSelectedMedia(item)}
        />
      ) : null}
    </form>
  );
}
