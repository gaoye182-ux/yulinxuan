"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ImageIcon, Search, X } from "lucide-react";
import { adminText, type AdminLocale, type AdminText } from "@/lib/admin-i18n";

export type AdminMediaItem = {
  id: string;
  url: string;
  urlWebp?: string | null;
  urlThumb?: string | null;
  originalName: string | null;
  filename: string;
  altText?: { ja?: string; zh?: string; en?: string } | null;
};

type AdminMediaPickerProps = {
  media: AdminMediaItem[];
  onSelect: (item: AdminMediaItem) => void;
  onClose: () => void;
  locale: AdminLocale;
};

function displayUrl(item: AdminMediaItem) {
  return item.urlWebp || item.url;
}

function thumbnailUrl(item: AdminMediaItem) {
  return item.urlThumb || item.urlWebp || item.url;
}

export function AdminMediaPicker({ media, onSelect, onClose, locale }: AdminMediaPickerProps) {
  const [query, setQuery] = useState("");
  const t = (value: AdminText) => adminText(value, locale);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return media;
    }

    return media.filter((item) =>
      [item.originalName, item.filename, item.url, item.altText?.ja, item.altText?.zh, item.altText?.en]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle))
    );
  }, [media, query]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(26,26,26,0.42)] p-4">
      <div className="max-h-[86vh] w-full max-w-5xl overflow-y-auto border border-[color:var(--gold)] bg-[color:var(--paper)] p-5 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] pb-4">
          <div>
            <p className="text-xs tracking-[0.28em] text-[color:var(--gold)]">MEDIA LIBRARY</p>
            <h2 className="mt-2 font-serif text-3xl font-light">{t({ ja: "画像を選択", zh: "图片选择", en: "Select Image" })}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-11 place-items-center border border-[color:var(--border)]" aria-label={t("关闭")}>
            <X size={18} />
          </button>
        </div>

        <label className="mt-5 flex min-h-12 items-center gap-3 border border-[color:var(--border)] bg-[color:var(--ivory)] px-4">
          <Search aria-hidden size={17} className="shrink-0 text-[color:var(--gold-dark)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t({ ja: "ファイル名・URL・alt を検索", zh: "搜索文件名、URL、alt", en: "Search filename, URL, or alt" })}
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[color:var(--muted)]/70"
          />
        </label>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.length ? filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect({ ...item, url: displayUrl(item) });
                onClose();
              }}
              className="min-w-0 border border-[color:var(--border)] bg-[color:var(--ivory)] p-3 text-left transition hover:border-[color:var(--gold)]"
            >
              <span className="relative block aspect-[4/3] overflow-hidden border border-[color:var(--border)] bg-white">
                <Image src={thumbnailUrl(item)} alt={item.altText?.[locale] || item.altText?.ja || item.originalName || item.filename} fill sizes="240px" className="object-cover" unoptimized />
              </span>
              <span className="mt-3 block truncate text-sm text-[color:var(--ink)]">{item.originalName ?? item.filename}</span>
              <span className="mt-1 block truncate text-xs text-[color:var(--muted)]">{displayUrl(item)}</span>
            </button>
          )) : (
            <p className="grid min-h-40 place-items-center border border-[color:var(--border)] bg-[color:var(--ivory)] text-sm leading-7 text-[color:var(--muted)] sm:col-span-2 lg:col-span-4">
              <span className="inline-flex items-center gap-2">
                <ImageIcon size={18} className="text-[color:var(--gold-dark)]" />
                {t({ ja: "条件に一致するメディアはありません。", zh: "没有符合条件的媒体。", en: "No matching media." })}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
