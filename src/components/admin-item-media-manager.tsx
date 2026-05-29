"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon, Save } from "lucide-react";
import { AdminMediaPicker, type AdminMediaItem } from "@/components/admin-media-picker";
import { setItemPrimaryMediaAction } from "@/lib/item-media-actions";

type AdminItemRow = {
  id: string;
  slug: string;
  name: { ja?: string; zh?: string; en?: string };
  primaryImage?: {
    url: string;
    urlWebp?: string | null;
    urlThumb?: string | null;
    altText?: { ja?: string; zh?: string; en?: string } | null;
  } | null;
};

export function AdminItemMediaManager({
  items,
  media,
  readOnly = false
}: {
  items: AdminItemRow[];
  media: AdminMediaItem[];
  readOnly?: boolean;
}) {
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, AdminMediaItem>>({});

  if (!items.length) {
    return (
      <p className="mt-8 border border-[color:var(--border)] bg-[color:var(--paper)] p-6 text-sm leading-7 text-[color:var(--muted)]">
        当前数据库中还没有藏品记录。媒体库已可用于藏品主图；新增藏品 CRUD 接入后会复用同一选择器。
      </p>
    );
  }

  return (
    <div className="grid gap-5 py-6">
      {items.map((item) => {
        const picked = selected[item.id];
        const imageUrl = picked?.url ?? item.primaryImage?.urlWebp ?? item.primaryImage?.urlThumb ?? item.primaryImage?.url;
        const altText = item.primaryImage?.altText ?? {};

        return (
          <form key={item.id} action={setItemPrimaryMediaAction} className="grid gap-5 border border-[color:var(--border)] bg-[color:var(--paper)] p-5 lg:grid-cols-[180px_minmax(0,1fr)_260px]">
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="mediaId" value={picked?.id ?? ""} />
            <div className="relative aspect-[4/5] overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory)]">
              {imageUrl ? (
                <Image src={imageUrl} alt={item.name.ja ?? item.slug} fill sizes="180px" className="object-cover" unoptimized />
              ) : (
                <div className="grid h-full place-items-center text-[color:var(--muted)]">
                  <ImageIcon size={24} />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs tracking-[0.18em] text-[color:var(--gold)]">COLLECTION ITEM</p>
              <h2 className="mt-2 break-words font-serif text-2xl font-light">{item.name.ja ?? item.slug}</h2>
              <p className="mt-2 break-words text-sm text-[color:var(--muted)]">{item.slug}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {(["ja", "zh", "en"] as const).map((lang) => (
                  <label key={lang} className="block min-w-0">
                    <span className="text-xs text-[color:var(--muted)]">Alt {lang.toUpperCase()}</span>
                    <input name={`altText_${lang}`} defaultValue={altText?.[lang] ?? ""} disabled={readOnly} className="mt-1 h-10 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-sm outline-none focus:border-[color:var(--gold)] disabled:opacity-70" />
                  </label>
                ))}
              </div>
            </div>
            <div className="grid content-start gap-3">
              <button type="button" disabled={readOnly} onClick={() => setPickerFor(item.id)} className="min-h-11 border border-[color:var(--border)] px-4 text-sm text-[color:var(--muted)] disabled:opacity-60">
                从媒体库选择
              </button>
              <button disabled={readOnly || !picked} className="inline-flex min-h-11 items-center justify-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 text-sm text-white disabled:border-[color:var(--border)] disabled:bg-transparent disabled:text-[color:var(--muted)]">
                <Save size={15} />
                保存主图
              </button>
            </div>
          </form>
        );
      })}

      {pickerFor ? (
        <AdminMediaPicker
          media={media}
          onClose={() => setPickerFor(null)}
          onSelect={(item) => setSelected((current) => ({ ...current, [pickerFor]: item }))}
        />
      ) : null}
    </div>
  );
}
