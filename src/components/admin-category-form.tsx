"use client";

import Image from "next/image";
import { useState } from "react";
import { Globe2, ImageIcon, Save, Trash2 } from "lucide-react";
import { AdminMediaPicker, type AdminMediaItem } from "@/components/admin-media-picker";
import { disableCategoryAction, saveCategoryAction } from "@/lib/category-actions";
import { languages } from "@/lib/i18n";

type Localized = { ja?: string; zh?: string; en?: string };

export type AdminCategoryOption = {
  id: string;
  slug: string;
  name: Localized;
};

export type AdminCategoryFormValue = {
  id?: string;
  slug?: string;
  name?: Localized;
  description?: Localized;
  parentId?: string | null;
  coverMediaId?: string | null;
  coverMedia?: AdminMediaItem | null;
  isActive?: boolean;
  showOnHome?: boolean;
  sortOrder?: number;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm text-[color:var(--muted)]">{children}</span>;
}

function TextField({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text"
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block min-w-0">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="mt-2 h-12 w-full min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 text-base outline-none focus:border-[color:var(--gold)]"
      />
    </label>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="block min-w-0">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={3}
        className="mt-2 w-full min-w-0 resize-y border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 py-3 text-base leading-7 outline-none focus:border-[color:var(--gold)]"
      />
    </label>
  );
}

function mediaUrl(media: AdminMediaItem) {
  return media.urlWebp || media.urlThumb || media.url;
}

export function AdminCategoryForm({
  mode,
  category,
  categories,
  media
}: {
  mode: "new" | "edit";
  category?: AdminCategoryFormValue;
  categories: AdminCategoryOption[];
  media: AdminMediaItem[];
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<AdminMediaItem | null>(category?.coverMedia ?? null);
  const title = mode === "new" ? "新增分类" : "编辑分类";
  const availableParents = categories.filter((entry) => entry.id !== category?.id);
  const previewUrl = selectedMedia ? mediaUrl(selectedMedia) : "";

  return (
    <form action={saveCategoryAction} className="grid gap-6 py-6">
      <input type="hidden" name="id" value={category?.id ?? ""} />
      <input type="hidden" name="coverMediaId" value={selectedMedia?.id ?? ""} />

      <section className="grid gap-5 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] pb-4">
          <div>
            <p className="text-xs tracking-[0.24em] text-[color:var(--gold)]">CATEGORY</p>
            <h2 className="mt-2 font-serif text-2xl font-light">{title}</h2>
          </div>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm text-white">
            <Save size={16} />
            保存分类
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid min-w-0 gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField name="slug" label="Slug" defaultValue={category?.slug} placeholder="japanese-art" />
              <TextField name="sortOrder" label="排序" type="number" defaultValue={category?.sortOrder ?? 0} />
            </div>

            <div className="grid gap-5">
              {languages.map((lang) => (
                <section key={lang} className="min-w-0 border border-[color:var(--border)] bg-white p-4">
                  <div className="flex items-center gap-2 border-b border-[color:var(--border)] pb-3">
                    <Globe2 aria-hidden size={16} className="text-[color:var(--gold-dark)]" />
                    <h3 className="font-serif text-xl font-light">{lang.toUpperCase()} 内容</h3>
                  </div>
                  <div className="mt-4 grid gap-4">
                    <TextField name={`name_${lang}`} label="分类名称" defaultValue={category?.name?.[lang]} />
                    <TextAreaField name={`description_${lang}`} label="分类说明" defaultValue={category?.description?.[lang]} />
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="grid content-start gap-5">
            <section className="border border-[color:var(--border)] bg-white p-4">
              <h3 className="font-serif text-xl font-light">层级与显示</h3>
              <div className="mt-4 grid gap-4">
                <label className="block">
                  <FieldLabel>父级分类</FieldLabel>
                  <select name="parentId" defaultValue={category?.parentId ?? ""} className="mt-2 h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
                    <option value="">无父级</option>
                    {availableParents.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.name.ja || entry.slug}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex min-h-10 items-center gap-3 text-sm text-[color:var(--muted)]">
                  <input name="isActive" type="checkbox" defaultChecked={category?.isActive ?? true} className="h-4 w-4 accent-[color:var(--gold)]" />
                  启用分类
                </label>
                <label className="flex min-h-10 items-center gap-3 text-sm text-[color:var(--muted)]">
                  <input name="showOnHome" type="checkbox" defaultChecked={category?.showOnHome ?? true} className="h-4 w-4 accent-[color:var(--gold)]" />
                  首页展示
                </label>
              </div>
            </section>

            <section className="border border-[color:var(--border)] bg-white p-4">
              <div className="flex items-center gap-2">
                <ImageIcon aria-hidden size={17} className="text-[color:var(--gold-dark)]" />
                <h3 className="font-serif text-xl font-light">分类封面</h3>
              </div>
              <div className="relative mt-4 aspect-[4/3] overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory)]">
                {previewUrl ? (
                  <Image src={previewUrl} alt={selectedMedia?.altText?.ja || selectedMedia?.filename || "Category cover"} fill sizes="340px" className="object-cover" unoptimized />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-[color:var(--muted)]">选择媒体库图片</div>
                )}
              </div>
              <button type="button" onClick={() => setPickerOpen(true)} className="mt-3 min-h-11 w-full border border-[color:var(--border)] text-sm text-[color:var(--muted)]">
                从媒体库选择
              </button>
              {selectedMedia ? (
                <button type="button" onClick={() => setSelectedMedia(null)} className="mt-2 min-h-10 w-full border border-[color:var(--red-seal)] text-sm text-[color:var(--red-seal)]">
                  清除封面
                </button>
              ) : null}
            </section>
          </aside>
        </div>
      </section>

      {mode === "edit" && category?.id ? (
        <section className="border border-[color:var(--red-seal)] bg-[color:var(--paper)] p-5">
          <h2 className="font-serif text-2xl font-light text-[color:var(--red-seal)]">停用分类</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">停用后前台分类筛选与首页分类模块不再展示该分类，已有藏品仍保留分类关联。</p>
          <button formAction={disableCategoryAction} name="id" value={category.id} className="mt-4 inline-flex min-h-11 items-center gap-2 border border-[color:var(--red-seal)] px-4 text-sm text-[color:var(--red-seal)]">
            <Trash2 size={15} />
            停用分类
          </button>
        </section>
      ) : null}

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
