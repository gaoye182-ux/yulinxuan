"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Globe2, ImageIcon, Save, Trash2 } from "lucide-react";
import { AdminMediaPicker, type AdminMediaItem } from "@/components/admin-media-picker";
import { saveItemAction, softDeleteItemAction } from "@/lib/item-actions";
import { languages } from "@/lib/i18n";

type Localized = { ja?: string; zh?: string; en?: string };

export type AdminItemFormCategory = {
  id: string;
  slug: string;
  name: Localized;
};

export type AdminItemFormImage = {
  id?: string;
  mediaId?: string | null;
  url: string;
  urlWebp?: string | null;
  urlThumb?: string | null;
  altText?: Localized | null;
};

export type AdminItemFormValue = {
  id?: string;
  slug?: string;
  name?: Localized;
  description?: Localized;
  era?: Localized;
  origin?: Localized;
  condition?: Localized;
  artist?: string | null;
  dimensions?: string | null;
  weight?: string | null;
  price?: string | null;
  currency?: string;
  priceDisplay?: "show" | "inquiry" | "hidden";
  categoryId?: string | null;
  status?: "draft" | "published" | "archived";
  publishedAt?: string | null;
  isNew?: boolean;
  isFeatured?: boolean;
  showOnHome?: boolean;
  sortOrder?: number;
  metaTitle?: Localized;
  metaDescription?: Localized;
  images?: AdminItemFormImage[];
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
  defaultValue,
  rows = 4,
  placeholder
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block min-w-0">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full min-w-0 resize-y border border-[color:var(--border)] bg-[color:var(--ivory)] px-4 py-3 text-base leading-7 outline-none focus:border-[color:var(--gold)]"
      />
    </label>
  );
}

function imageDisplayUrl(image: AdminItemFormImage) {
  return image.urlWebp || image.urlThumb || image.url;
}

function mediaToImage(media: AdminMediaItem): AdminItemFormImage {
  return {
    mediaId: media.id,
    url: media.url,
    urlWebp: media.urlWebp,
    urlThumb: media.urlThumb,
    altText: media.altText
  };
}

export function AdminItemForm({
  mode,
  item,
  categories,
  media
}: {
  mode: "new" | "edit";
  item?: AdminItemFormValue;
  categories: AdminItemFormCategory[];
  media: AdminMediaItem[];
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [images, setImages] = useState<AdminItemFormImage[]>(() => item?.images ?? []);
  const title = mode === "new" ? "新增藏品" : "编辑藏品";
  const defaultStatus = item?.status ?? "draft";
  const previewImage = images[0];

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ ...category, label: category.name.ja || category.slug })),
    [categories]
  );

  function moveImage(index: number, direction: -1 | 1) {
    setImages((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) {
        return current;
      }
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <form action={saveItemAction} className="grid gap-6 py-6">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <input type="hidden" name="imageCount" value={images.length} />

      <section className="grid gap-5 border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] pb-4">
          <div>
            <p className="text-xs tracking-[0.24em] text-[color:var(--gold)]">COLLECTION ITEM</p>
            <h2 className="mt-2 font-serif text-2xl font-light">{title}</h2>
          </div>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-5 text-sm text-white">
            <Save size={16} />
            保存藏品
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid min-w-0 gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField name="slug" label="Slug" defaultValue={item?.slug} placeholder="ko-imari-blue-white-dish" />
              <TextField name="sortOrder" label="排序" type="number" defaultValue={item?.sortOrder ?? 0} />
            </div>

            <div className="grid gap-5">
              {languages.map((lang) => (
                <section key={lang} className="min-w-0 border border-[color:var(--border)] bg-white p-4">
                  <div className="flex items-center gap-2 border-b border-[color:var(--border)] pb-3">
                    <Globe2 aria-hidden size={16} className="text-[color:var(--gold-dark)]" />
                    <h3 className="font-serif text-xl font-light">{lang.toUpperCase()} 内容</h3>
                  </div>
                  <div className="mt-4 grid gap-4">
                    <TextField name={`name_${lang}`} label="名称" defaultValue={item?.name?.[lang]} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField name={`era_${lang}`} label="时代" defaultValue={item?.era?.[lang]} />
                      <TextField name={`origin_${lang}`} label="产地" defaultValue={item?.origin?.[lang]} />
                    </div>
                    <TextAreaField name={`condition_${lang}`} label="状态说明" defaultValue={item?.condition?.[lang]} rows={3} />
                    <TextAreaField name={`description_${lang}`} label="描述" defaultValue={item?.description?.[lang]} rows={5} />
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="grid content-start gap-5">
            <section className="border border-[color:var(--border)] bg-white p-4">
              <h3 className="font-serif text-xl font-light">发布与分类</h3>
              <div className="mt-4 grid gap-4">
                <label className="block">
                  <FieldLabel>分类</FieldLabel>
                  <select name="categoryId" defaultValue={item?.categoryId ?? ""} className="mt-2 h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
                    <option value="">未分类</option>
                    {categoryOptions.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <FieldLabel>状态</FieldLabel>
                  <select name="status" defaultValue={defaultStatus} className="mt-2 h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
                    <option value="draft">草稿</option>
                    <option value="published">发布</option>
                    <option value="archived">归档</option>
                  </select>
                </label>
                <TextField name="publishedAt" label="预约/公开时间" type="datetime-local" defaultValue={item?.publishedAt ?? ""} />
                <div className="grid gap-3 text-sm text-[color:var(--muted)]">
                  <label className="flex min-h-10 items-center gap-3">
                    <input name="isNew" type="checkbox" defaultChecked={item?.isNew} className="h-4 w-4 accent-[color:var(--gold)]" />
                    新入荷
                  </label>
                  <label className="flex min-h-10 items-center gap-3">
                    <input name="isFeatured" type="checkbox" defaultChecked={item?.isFeatured} className="h-4 w-4 accent-[color:var(--gold)]" />
                    特选
                  </label>
                  <label className="flex min-h-10 items-center gap-3">
                    <input name="showOnHome" type="checkbox" defaultChecked={item?.showOnHome} className="h-4 w-4 accent-[color:var(--gold)]" />
                    首页推荐
                  </label>
                </div>
              </div>
            </section>

            <section className="border border-[color:var(--border)] bg-white p-4">
              <h3 className="font-serif text-xl font-light">价格与规格</h3>
              <div className="mt-4 grid gap-4">
                <div className="grid grid-cols-[1fr_90px] gap-3">
                  <TextField name="price" label="价格" defaultValue={item?.price} placeholder="180000" />
                  <TextField name="currency" label="币种" defaultValue={item?.currency ?? "JPY"} />
                </div>
                <label className="block">
                  <FieldLabel>价格显示</FieldLabel>
                  <select name="priceDisplay" defaultValue={item?.priceDisplay ?? "inquiry"} className="mt-2 h-12 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none">
                    <option value="inquiry">询价</option>
                    <option value="show">显示价格</option>
                    <option value="hidden">隐藏</option>
                  </select>
                </label>
                <TextField name="artist" label="作家" defaultValue={item?.artist} />
                <TextField name="dimensions" label="尺寸" defaultValue={item?.dimensions} />
                <TextField name="weight" label="重量" defaultValue={item?.weight} />
              </div>
            </section>

            <section className="border border-[color:var(--border)] bg-white p-4">
              <div className="flex items-center gap-2">
                <ImageIcon aria-hidden size={17} className="text-[color:var(--gold-dark)]" />
                <h3 className="font-serif text-xl font-light">主图预览</h3>
              </div>
              <div className="mt-4 relative aspect-[4/5] overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory)]">
                {previewImage ? (
                  <Image src={imageDisplayUrl(previewImage)} alt={previewImage.altText?.ja || item?.name?.ja || "Item image"} fill sizes="340px" className="object-cover" unoptimized />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-[color:var(--muted)]">选择媒体库图片</div>
                )}
              </div>
              <button type="button" onClick={() => setPickerOpen(true)} className="mt-3 min-h-11 w-full border border-[color:var(--border)] text-sm text-[color:var(--muted)]">
                从媒体库追加图片
              </button>
            </section>
          </aside>
        </div>
      </section>

      <section className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] pb-4">
          <h2 className="font-serif text-2xl font-light">图片排序与 Alt</h2>
          <p className="text-sm text-[color:var(--muted)]">第一张图片将作为主图。</p>
        </div>
        <div className="mt-5 grid gap-4">
          {images.length ? images.map((image, index) => (
            <div key={`${image.url}-${index}`} className="grid gap-4 border border-[color:var(--border)] bg-white p-4 lg:grid-cols-[110px_minmax(0,1fr)_120px]">
              <input type="hidden" name={`image_${index}_mediaId`} value={image.mediaId ?? ""} />
              <input type="hidden" name={`image_${index}_url`} value={image.url} />
              <input type="hidden" name={`image_${index}_urlWebp`} value={image.urlWebp ?? ""} />
              <input type="hidden" name={`image_${index}_urlThumb`} value={image.urlThumb ?? ""} />
              <div className="relative aspect-[4/5] overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory)]">
                <Image src={imageDisplayUrl(image)} alt={image.altText?.ja || "Item image"} fill sizes="110px" className="object-cover" unoptimized />
                {index === 0 ? <span className="absolute left-2 top-2 bg-[color:var(--gold)] px-2 py-1 text-[11px] text-white">主图</span> : null}
              </div>
              <div className="grid min-w-0 gap-3 md:grid-cols-3">
                {languages.map((lang) => (
                  <TextField key={lang} name={`image_${index}_altText_${lang}`} label={`Alt ${lang.toUpperCase()}`} defaultValue={image.altText?.[lang]} />
                ))}
              </div>
              <div className="flex flex-wrap content-start gap-2 lg:grid">
                <button type="button" onClick={() => moveImage(index, -1)} className="inline-flex min-h-10 items-center justify-center gap-2 border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted)]">
                  <ArrowUp size={15} />
                  上移
                </button>
                <button type="button" onClick={() => moveImage(index, 1)} className="inline-flex min-h-10 items-center justify-center gap-2 border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted)]">
                  <ArrowDown size={15} />
                  下移
                </button>
                <button type="button" onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} className="inline-flex min-h-10 items-center justify-center gap-2 border border-[color:var(--red-seal)] px-3 text-sm text-[color:var(--red-seal)]">
                  <Trash2 size={15} />
                  移除
                </button>
              </div>
            </div>
          )) : (
            <p className="border border-[color:var(--border)] bg-[color:var(--ivory)] p-6 text-sm text-[color:var(--muted)]">
              尚未选择图片。可保存无图草稿，但发布前建议至少设置一张主图。
            </p>
          )}
        </div>
      </section>

      <section className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5">
        <h2 className="font-serif text-2xl font-light">SEO</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {languages.map((lang) => (
            <TextField key={lang} name={`metaTitle_${lang}`} label={`Meta Title ${lang.toUpperCase()}`} defaultValue={item?.metaTitle?.[lang]} />
          ))}
          {languages.map((lang) => (
            <TextAreaField key={lang} name={`metaDescription_${lang}`} label={`Meta Description ${lang.toUpperCase()}`} defaultValue={item?.metaDescription?.[lang]} rows={3} />
          ))}
        </div>
      </section>

      {mode === "edit" && item?.id ? (
        <section className="border border-[color:var(--red-seal)] bg-[color:var(--paper)] p-5">
          <h2 className="font-serif text-2xl font-light text-[color:var(--red-seal)]">软删除</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">软删除后藏品会归档并从前台隐藏，数据库记录与媒体引用仍保留。</p>
          <button formAction={softDeleteItemAction} name="id" value={item.id} className="mt-4 inline-flex min-h-11 items-center gap-2 border border-[color:var(--red-seal)] px-4 text-sm text-[color:var(--red-seal)]">
            <Trash2 size={15} />
            软删除藏品
          </button>
        </section>
      ) : null}

      {pickerOpen ? (
        <AdminMediaPicker
          media={media}
          onClose={() => setPickerOpen(false)}
          onSelect={(selected) => setImages((current) => [...current, mediaToImage(selected)])}
        />
      ) : null}
    </form>
  );
}
