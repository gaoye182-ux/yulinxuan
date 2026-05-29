"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  GripVertical,
  ImageIcon,
  ListPlus,
  PanelTop,
  Save,
  ToggleLeft,
  Trash2
} from "lucide-react";
import { AdminMediaPicker, type AdminMediaItem } from "@/components/admin-media-picker";
import { savePageBlockAction } from "@/lib/page-block-actions";
import { type PageBlockDefinition } from "@/lib/page-blocks";
import { languages, type Language } from "@/lib/i18n";

type JsonObject = Record<string, unknown>;
type JsonArray = unknown[];

type AdminPageBlockRow = {
  definition: PageBlockDefinition;
  record: {
    content: unknown;
    sortOrder: number;
    isActive: boolean;
    updatedAt: string;
  } | null;
};

type AdminPageBlocksManagerProps = {
  rows: AdminPageBlockRow[];
  media: AdminMediaItem[];
  readOnly?: boolean;
};

type EditorState = Record<
  string,
  {
    content: Record<Language, unknown>;
    sortOrder: number;
    isActive: boolean;
  }
>;

const langLabel: Record<Language, string> = {
  ja: "日本語",
  zh: "中文",
  en: "English"
};

const fieldLabels: Record<string, string> = {
  eyebrow: "眉题",
  title: "标题",
  subtitle: "副标题",
  lead: "说明",
  text: "正文",
  cta: "主按钮",
  secondary: "次按钮",
  badge: "徽章",
  image: "图片",
  value: "数值",
  label: "标签",
  name: "名称",
  era: "时代",
  status: "状态",
  action: "按钮文案",
  href: "链接路径",
  icon: "图标",
  address: "地址",
  phone: "电话",
  email: "邮箱",
  hours: "营业时间",
  closed: "定休日",
  google: "Google Maps 按钮",
  apple: "Apple Maps 按钮",
  breadcrumbHome: "面包屑首页",
  seoTitle: "SEO 标题",
  seoDescription: "SEO 描述"
};

function isObject(value: unknown): value is JsonObject {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value ?? null)) as T;
}

function blockId(row: AdminPageBlockRow) {
  return `${row.definition.pageKey}:${row.definition.blockKey}`;
}

function localizedContent(row: AdminPageBlockRow, lang: Language) {
  const content = row.record?.content;
  if (isObject(content) && lang in content) {
    return clone(content[lang]);
  }

  return clone(row.definition.defaultContent[lang]);
}

function initialState(rows: AdminPageBlockRow[]): EditorState {
  return rows.reduce((acc, row) => {
    acc[blockId(row)] = {
      content: languages.reduce(
        (localized, lang) => {
          localized[lang] = localizedContent(row, lang);
          return localized;
        },
        {} as Record<Language, unknown>
      ),
      sortOrder: row.record?.sortOrder ?? row.definition.defaultSortOrder,
      isActive: row.record?.isActive ?? true
    };
    return acc;
  }, {} as EditorState);
}

function labelFor(key: string) {
  return fieldLabels[key] ?? key.replace(/([A-Z])/g, " $1").replace(/_/g, " ");
}

function previewHref(pageKey: string) {
  if (pageKey === "home" || pageKey === "layout") {
    return "/ja";
  }

  return `/ja/${pageKey}`;
}

function defaultValueForArray(items: JsonArray) {
  const sample = items.find((item) => isObject(item) || Array.isArray(item));
  if (Array.isArray(sample)) {
    return [];
  }
  if (isObject(sample)) {
    return Object.entries(sample).reduce((acc, [key, value]) => {
      acc[key] = typeof value === "boolean" ? false : Array.isArray(value) ? [] : isObject(value) ? {} : "";
      return acc;
    }, {} as JsonObject);
  }

  return "";
}

function setAtPath(value: unknown, path: (string | number)[], nextValue: unknown): unknown {
  if (!path.length) {
    return nextValue;
  }

  const [head, ...rest] = path;
  if (Array.isArray(value)) {
    const next = [...value];
    next[Number(head)] = setAtPath(next[Number(head)], rest, nextValue);
    return next;
  }

  const next = isObject(value) ? { ...value } : {};
  next[String(head)] = setAtPath(next[String(head)], rest, nextValue);
  return next;
}

function arrayMove(items: JsonArray, from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function AdminPageBlocksManager({ rows, media, readOnly = false }: AdminPageBlocksManagerProps) {
  const [activeLang, setActiveLang] = useState<Language>("ja");
  const [state, setState] = useState<EditorState>(() => initialState(rows));
  const [picker, setPicker] = useState<null | { block: string; lang: Language; path: (string | number)[] }>(null);
  const [dragging, setDragging] = useState<null | { block: string; lang: Language; path: (string | number)[]; index: number }>(null);

  const grouped = useMemo(
    () =>
      rows.reduce((acc, row) => {
        const key = row.definition.pageKey;
        acc[key] = [...(acc[key] ?? []), row];
        return acc;
      }, {} as Record<string, AdminPageBlockRow[]>),
    [rows]
  );

  function updateContent(block: string, lang: Language, path: (string | number)[], nextValue: unknown) {
    setState((current) => ({
      ...current,
      [block]: {
        ...current[block],
        content: {
          ...current[block].content,
          [lang]: setAtPath(current[block].content[lang], path, nextValue)
        }
      }
    }));
  }

  function moveArrayItem(block: string, lang: Language, path: (string | number)[], from: number, to: number) {
    const current = path.reduce((acc, part) => (Array.isArray(acc) || isObject(acc) ? (acc as Record<string | number, unknown>)[part] : undefined), state[block].content[lang]);
    if (!Array.isArray(current) || to < 0 || to >= current.length) {
      return;
    }
    updateContent(block, lang, path, arrayMove(current, from, to));
  }

  function renderField(block: string, lang: Language, path: (string | number)[], key: string, value: unknown): ReactNode {
    const dottedPath = path.join(".");
    const label = labelFor(key);

    if (Array.isArray(value)) {
      return (
        <div key={dottedPath} className="grid gap-3 border border-[color:var(--border)] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-[color:var(--ink)]">{label}</p>
            <button
              type="button"
              disabled={readOnly}
              onClick={() => updateContent(block, lang, path, [...value, defaultValueForArray(value)])}
              className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--gold)] px-3 text-xs tracking-[0.12em] text-[color:var(--gold-dark)] disabled:opacity-50"
            >
              <ListPlus size={14} />
              添加
            </button>
          </div>
          <div className="grid gap-3">
            {value.map((item, index) => (
              <div
                key={`${dottedPath}-${index}`}
                draggable={!readOnly}
                onDragStart={() => setDragging({ block, lang, path, index })}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragging && dragging.block === block && dragging.lang === lang && dragging.path.join(".") === path.join(".")) {
                    moveArrayItem(block, lang, path, dragging.index, index);
                  }
                  setDragging(null);
                }}
                className="grid gap-3 border border-[color:var(--border)] bg-[color:var(--ivory)] p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex min-h-9 items-center gap-2 text-xs tracking-[0.12em] text-[color:var(--muted)]">
                    <GripVertical size={15} />
                    {label} #{index + 1}
                  </span>
                  <div className="flex gap-2">
                    <button type="button" disabled={readOnly || index === 0} onClick={() => moveArrayItem(block, lang, path, index, index - 1)} className="grid size-9 place-items-center border border-[color:var(--border)] disabled:opacity-40" aria-label="上移">
                      <ArrowUp size={15} />
                    </button>
                    <button type="button" disabled={readOnly || index === value.length - 1} onClick={() => moveArrayItem(block, lang, path, index, index + 1)} className="grid size-9 place-items-center border border-[color:var(--border)] disabled:opacity-40" aria-label="下移">
                      <ArrowDown size={15} />
                    </button>
                    <button type="button" disabled={readOnly} onClick={() => updateContent(block, lang, path, value.filter((_, itemIndex) => itemIndex !== index))} className="grid size-9 place-items-center border border-[color:var(--border)] text-[color:var(--red-seal)] disabled:opacity-40" aria-label="删除">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {renderField(block, lang, [...path, index], `${index}`, item)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isObject(value)) {
      return (
        <div key={dottedPath} className="grid gap-4 border border-[color:var(--border)] bg-white p-4">
          {key === "0" || Number.isInteger(Number(key)) ? null : <p className="text-sm font-medium text-[color:var(--ink)]">{label}</p>}
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(value).map(([childKey, childValue]) => renderField(block, lang, [...path, childKey], childKey, childValue))}
          </div>
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <label key={dottedPath} className="inline-flex min-h-11 items-center gap-3 text-sm text-[color:var(--muted)]">
          <input type="checkbox" checked={value} disabled={readOnly} onChange={(event) => updateContent(block, lang, path, event.target.checked)} className="h-4 w-4 accent-[color:var(--gold)]" />
          {label}
        </label>
      );
    }

    if (key === "icon") {
      return (
        <label key={dottedPath} className="block min-w-0">
          <span className="text-sm text-[color:var(--muted)]">{label}</span>
          <select
            value={String(value ?? "")}
            disabled={readOnly}
            onChange={(event) => updateContent(block, lang, path, event.target.value)}
            className="mt-2 h-11 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-base outline-none focus:border-[color:var(--gold)]"
          >
            <option value="store">店铺</option>
            <option value="map">地图</option>
            <option value="camera">相机</option>
          </select>
        </label>
      );
    }

    const isLongText = ["lead", "text", "subtitle", "seoDescription", "description", "access"].includes(key);
    const isImage = key.toLowerCase().includes("image");

    return (
      <label key={dottedPath} className="block min-w-0">
        <span className="text-sm text-[color:var(--muted)]">{label}</span>
        {isLongText ? (
          <textarea
            value={String(value ?? "")}
            rows={4}
            disabled={readOnly}
            onChange={(event) => updateContent(block, lang, path, event.target.value)}
            className="mt-2 w-full resize-y border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 py-3 text-base leading-7 outline-none focus:border-[color:var(--gold)]"
          />
        ) : (
          <div className={isImage ? "mt-2 grid gap-2 sm:grid-cols-[1fr_auto]" : ""}>
            <input
              value={String(value ?? "")}
              type={key === "href" || isImage ? "url" : "text"}
              disabled={readOnly}
              onChange={(event) => updateContent(block, lang, path, event.target.value)}
              className={`${isImage ? "" : "mt-2"} h-11 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-base outline-none focus:border-[color:var(--gold)]`}
            />
            {isImage ? (
              <button
                type="button"
                disabled={readOnly}
                onClick={() => setPicker({ block, lang, path })}
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[color:var(--gold)] px-4 text-sm tracking-[0.12em] text-[color:var(--gold-dark)] disabled:opacity-50"
              >
                <ImageIcon size={15} />
                媒体库
              </button>
            ) : null}
          </div>
        )}
      </label>
    );
  }

  return (
    <div className="grid gap-8 py-6">
      <div className="sticky top-0 z-20 -mx-2 flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] bg-[rgba(249,245,238,0.96)] px-2 py-3 backdrop-blur">
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`min-h-10 border px-4 text-sm tracking-[0.14em] ${activeLang === lang ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-white" : "border-[color:var(--border)] text-[color:var(--muted)]"}`}
            >
              {langLabel[lang]}
            </button>
          ))}
        </div>
        <p className="text-xs leading-5 text-[color:var(--muted)]">字段化编辑会同步生成保存用 JSON；数组卡片可拖拽或按钮排序。</p>
      </div>

      {Object.entries(grouped).map(([pageKey, pageRows]) => (
        <section key={pageKey} className="grid gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.28em] text-[color:var(--gold)]">PAGE BLOCKS</p>
              <h2 className="mt-2 font-serif text-3xl font-light">{pageRows[0]?.definition.pageLabel}</h2>
            </div>
            <Link href={previewHref(pageKey)} target="_blank" className="inline-flex min-h-11 items-center gap-2 border border-[color:var(--gold)] px-4 text-sm tracking-[0.14em] text-[color:var(--gold-dark)]">
              <Eye size={16} />
              预览
            </Link>
          </div>

          {pageRows.map((row) => {
            const id = blockId(row);
            const current = state[id];
            const activeContent = current.content[activeLang];

            return (
              <form
                key={id}
                action={savePageBlockAction}
                className="grid gap-5 border border-[color:var(--border)] bg-[color:var(--paper)] p-5"
              >
                <input type="hidden" name="pageKey" value={row.definition.pageKey} />
                <input type="hidden" name="blockKey" value={row.definition.blockKey} />
                {languages.map((lang) => (
                  <input key={lang} type="hidden" name={`content_${lang}`} value={JSON.stringify(current.content[lang] ?? {})} />
                ))}

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex min-h-8 items-center gap-2 border border-[color:var(--gold)] px-3 text-xs tracking-[0.12em] text-[color:var(--gold-dark)]">
                        <PanelTop aria-hidden size={14} />
                        {row.definition.pageKey}.{row.definition.blockKey}
                      </span>
                      <span className={`inline-flex min-h-8 items-center border px-3 text-xs ${current.isActive ? "border-[color:var(--gold)] text-[color:var(--gold-dark)]" : "border-[color:var(--border)] text-[color:var(--muted)]"}`}>
                        {current.isActive ? "已发布" : "未发布"}
                      </span>
                    </div>
                    <h3 className="mt-3 break-words font-serif text-2xl font-light">{row.definition.blockLabel}</h3>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{row.definition.description}</p>
                  </div>

                  <fieldset disabled={readOnly} className="grid gap-3 disabled:opacity-70">
                    <label className="block min-w-0">
                      <span className="text-sm text-[color:var(--muted)]">模块排序</span>
                      <input
                        name="sortOrder"
                        type="number"
                        min="0"
                        value={current.sortOrder}
                        onChange={(event) =>
                          setState((next) => ({
                            ...next,
                            [id]: { ...next[id], sortOrder: Number(event.target.value) }
                          }))
                        }
                        className="mt-2 h-11 w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 text-base outline-none focus:border-[color:var(--gold)]"
                      />
                    </label>
                    <label className="inline-flex min-h-11 items-center gap-3 text-sm text-[color:var(--muted)]">
                      <input
                        name="isActive"
                        type="checkbox"
                        checked={current.isActive}
                        onChange={(event) =>
                          setState((next) => ({
                            ...next,
                            [id]: { ...next[id], isActive: event.target.checked }
                          }))
                        }
                        className="h-4 w-4 accent-[color:var(--gold)]"
                      />
                      <ToggleLeft aria-hidden size={16} className="text-[color:var(--gold-dark)]" />
                      发布到前台
                    </label>
                    <button
                      disabled={readOnly}
                      className="inline-flex min-h-11 items-center justify-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 text-sm tracking-[0.14em] text-white disabled:border-[color:var(--border)] disabled:bg-transparent disabled:text-[color:var(--muted)]"
                    >
                      <Save size={15} />
                      保存模块
                    </button>
                  </fieldset>
                </div>

                <fieldset disabled={readOnly} className="grid gap-4 disabled:opacity-70">
                  <div className="grid gap-4">
                    {isObject(activeContent) ? (
                      Object.entries(activeContent).map(([key, value]) => renderField(id, activeLang, [key], key, value))
                    ) : Array.isArray(activeContent) ? (
                      renderField(id, activeLang, [], row.definition.blockKey, activeContent)
                    ) : (
                      <textarea
                        value={String(activeContent ?? "")}
                        onChange={(event) => updateContent(id, activeLang, [], event.target.value)}
                        rows={8}
                        className="w-full border border-[color:var(--border)] bg-[color:var(--ivory)] px-3 py-3 text-base leading-7 outline-none focus:border-[color:var(--gold)]"
                      />
                    )}
                  </div>
                </fieldset>
              </form>
            );
          })}
        </section>
      ))}

      {picker ? (
        <AdminMediaPicker
          media={media}
          onClose={() => setPicker(null)}
          onSelect={(item) => updateContent(picker.block, picker.lang, picker.path, item.url)}
        />
      ) : null}
    </div>
  );
}
