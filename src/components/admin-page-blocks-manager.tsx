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
import { adminText, type AdminLocale, type AdminText } from "@/lib/admin-i18n";
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
  locale: AdminLocale;
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

const fieldLabels: Record<string, AdminText> = {
  eyebrow: { ja: "アイブロウ", zh: "眉题", en: "Eyebrow" },
  title: "标题",
  subtitle: { ja: "サブタイトル", zh: "副标题", en: "Subtitle" },
  lead: { ja: "説明", zh: "说明", en: "Lead" },
  text: { ja: "本文", zh: "正文", en: "Body text" },
  cta: { ja: "主ボタン", zh: "主按钮", en: "Primary button" },
  secondary: { ja: "副ボタン", zh: "次按钮", en: "Secondary button" },
  badge: { ja: "バッジ", zh: "徽章", en: "Badge" },
  image: { ja: "画像", zh: "图片", en: "Image" },
  value: { ja: "数値", zh: "数值", en: "Value" },
  label: { ja: "ラベル", zh: "标签", en: "Label" },
  name: "名称",
  era: "时代",
  status: "状态",
  action: { ja: "ボタン文言", zh: "按钮文案", en: "Button text" },
  href: { ja: "リンク先", zh: "链接路径", en: "Link path" },
  icon: { ja: "アイコン", zh: "图标", en: "Icon" },
  address: "地址",
  phone: "电话",
  email: "邮箱",
  hours: "营业时间",
  closed: { ja: "定休日", zh: "定休日", en: "Closed days" },
  google: { ja: "Google Maps ボタン", zh: "Google Maps 按钮", en: "Google Maps button" },
  apple: { ja: "Apple Maps ボタン", zh: "Apple Maps 按钮", en: "Apple Maps button" },
  breadcrumbHome: { ja: "パンくず ホーム", zh: "面包屑首页", en: "Breadcrumb home" },
  seoTitle: { ja: "SEO タイトル", zh: "SEO 标题", en: "SEO title" },
  seoDescription: { ja: "SEO 説明", zh: "SEO 描述", en: "SEO description" }
};

const pageLabels: Record<string, AdminText> = {
  layout: { ja: "レイアウト", zh: "布局", en: "Layout" },
  home: { ja: "ホーム", zh: "首页", en: "Home" },
  contact: { ja: "Contact", zh: "Contact", en: "Contact" },
  access: { ja: "Access", zh: "Access", en: "Access" },
  about: { ja: "About", zh: "About", en: "About" },
  appraisal: { ja: "鑑定・買取", zh: "鉴定・收购", en: "Appraisal" },
  "purchase-guide": { ja: "購入方法", zh: "购买方法", en: "Purchase Guide" },
  faq: { ja: "FAQ", zh: "FAQ", en: "FAQ" }
};

const blockLabels: Record<string, AdminText> = {
  "layout:navigation": { ja: "ナビゲーションメニュー", zh: "导航菜单", en: "Navigation Menu" },
  "layout:footer": { ja: "フッターリンクと著作権", zh: "页脚链接与版权", en: "Footer Links & Copyright" },
  "home:hero": { ja: "Hero メインビジュアル", zh: "Hero 英雄区", en: "Hero" },
  "home:stats": { ja: "統計バー", zh: "统计条", en: "Stats Bar" },
  "home:sections": { ja: "セクション見出し文案", zh: "区块标题文案", en: "Section Copy" },
  "home:categories": { ja: "蔵品分類コラージュ", zh: "藏品分类拼贴", en: "Category Collage" },
  "home:arrivals": { ja: "新入荷モジュール", zh: "新入荷模块", en: "New Arrivals Module" },
  "home:appraisal": { ja: "鑑定導線", zh: "鉴定入口", en: "Appraisal Entry" },
  "home:quick_links": { ja: "購入・ブログ・相談導線", zh: "购买/博客/咨询入口", en: "Purchase / Blog / Contact Links" },
  "home:about": { ja: "About セクション", zh: "关于区块", en: "About Section" },
  "contact:banner": { ja: "Contact バナー", zh: "Contact Banner", en: "Contact Banner" },
  "contact:info": { ja: "Contact 説明と店舗情報", zh: "Contact 说明与店铺信息", en: "Contact Info & Store Details" },
  "contact:map": { ja: "Contact 地図文案", zh: "Contact Map 文案", en: "Contact Map Copy" },
  "access:content": { ja: "Access 全ページ内容", zh: "Access 全页说明", en: "Access Full Page" },
  "about:content": { ja: "About 全ページ内容", zh: "About 全页内容", en: "About Full Page" },
  "appraisal:content": { ja: "鑑定・買取 全ページ内容", zh: "鉴定・收购全页内容", en: "Appraisal Full Page" },
  "purchase-guide:content": { ja: "購入方法 全ページ内容", zh: "购买方法全页内容", en: "Purchase Guide Full Page" },
  "faq:content": { ja: "FAQ 全ページ内容", zh: "FAQ 全页内容", en: "FAQ Full Page" }
};

const blockDescriptions: Record<string, AdminText> = {
  "layout:navigation": {
    ja: "前台のトップナビ、モバイルメニュー、お問い合わせボタン文言です。配列項目は href と label に対応します。",
    zh: "前台顶部导航、移动菜单和联系按钮文案。数组项支持 href、label。",
    en: "Frontend header navigation, mobile menu, and contact button copy. Array items support href and label."
  },
  "layout:footer": {
    ja: "フッターのグループ見出し、サービスリンク、著作権文言です。",
    zh: "页脚分组标题、服务链接和版权文案。",
    en: "Footer group headings, service links, and copyright copy."
  },
  "home:hero": {
    ja: "ホームのファーストビュー見出し、リード、CTA、バッジ、メインビジュアルです。",
    zh: "首页首屏标题、副标题、CTA、徽章和主视觉图片。",
    en: "Homepage first-view title, lead, CTA, badge, and main visual."
  },
  "home:stats": {
    ja: "濃い木色の統計バー。配列形式：[{ value, label }]。",
    zh: "深木色统计条，数组格式：[{ value, label }]。",
    en: "Dark wood stats bar. Array format: [{ value, label }]."
  },
  "home:sections": {
    ja: "ホームの collection / arrivals / appraisal / journal / about / access の見出し、説明、ボタン文言です。",
    zh: "首页 collection / arrivals / appraisal / journal / about / access 的标题、说明和按钮文案。",
    en: "Homepage collection / arrivals / appraisal / journal / about / access titles, descriptions, and button text."
  },
  "home:categories": {
    ja: "分類コラージュ配列。name、subtitle、image、large に対応します。",
    zh: "分类拼贴数组，支持 name、subtitle、image、large。",
    en: "Category collage array supporting name, subtitle, image, and large."
  },
  "home:arrivals": {
    ja: "ホーム新入荷の大画像と右側重点蔵品です。feature と items に対応します。",
    zh: "首页新入荷大图与右侧重点藏品。支持 feature 与 items。",
    en: "Homepage new-arrivals feature image and highlighted items. Supports feature and items."
  },
  "home:appraisal": {
    ja: "店頭、出張、写真鑑定の 3 つの導線配列です。",
    zh: "店头、出张、照片鉴定三入口数组。",
    en: "Three-entry array for in-store, visit, and photo appraisal."
  },
  "home:quick_links": {
    ja: "ホーム鑑定エリア下の 3 つの横長導線です。",
    zh: "首页鉴定区下方三个横向入口。",
    en: "Three horizontal links below the homepage appraisal section."
  },
  "home:about": {
    ja: "ホームの玉林軒紹介、事実リスト、画像です。",
    zh: "首页关于玉林軒说明、事实列表与图片。",
    en: "Homepage Gyokurinken introduction, fact list, and image."
  },
  "contact:banner": {
    ja: "Contact 上部タイトル、説明、パンくず文言です。",
    zh: "Contact 顶部标题、说明和面包屑文案。",
    en: "Contact page top title, description, and breadcrumb copy."
  },
  "contact:info": {
    ja: "Contact サイドバー説明、ラベル、住所、電話、メール、営業時間、アクセス説明です。",
    zh: "Contact 侧栏说明、标签、地址、电话、邮箱、营业时间、访问说明。",
    en: "Contact sidebar copy, labels, address, phone, email, hours, and access notes."
  },
  "contact:map": {
    ja: "Contact 地図説明とボタン文言です。",
    zh: "Contact 地图说明和按钮文案。",
    en: "Contact map description and button text."
  },
  "access:content": {
    ja: "Access ページの banner、overview、transport、parking、hours、notes、map、cta です。",
    zh: "Access 页面 banner、overview、transport、parking、hours、notes、map、cta。",
    en: "Access page banner, overview, transport, parking, hours, notes, map, and CTA."
  },
  "about:content": {
    ja: "About ページの banner、story、代表挨拶、理念、年表、gallery、許可、CTA です。保存 JSON は前台デフォルトを上書きします。",
    zh: "关于页面的 banner、story、代表挨拶、理念、年表、gallery、许可和 CTA。保存的 JSON 会覆盖前台默认内容。",
    en: "About page banner, story, greeting, philosophy, timeline, gallery, credentials, and CTA. Saved JSON overrides frontend defaults."
  },
  "appraisal:content": {
    ja: "鑑定買取ページの hero、サービス、買取品目、強み、流れ、注意事項、CTA です。",
    zh: "鉴定收购页面的 hero、服务、收购品目、优势、流程、注意事项和 CTA。",
    en: "Appraisal page hero, services, purchase items, strengths, flow, notes, and CTA."
  },
  "purchase-guide:content": {
    ja: "購入方法ページの banner、intro、流れ、支払い、配送、返品交換ポリシー、FAQ CTA です。",
    zh: "购买方法页面的 banner、intro、流程、支付、配送、退换政策和 FAQ CTA。",
    en: "Purchase guide banner, intro, flow, payment, delivery, policy, and FAQ CTA."
  },
  "faq:content": {
    ja: "FAQ ページの banner、導入、分類別 Q&A、CTA です。Q&A 分類配列は並び替えできます。",
    zh: "FAQ 页面 banner、导语、分类问答和 CTA。问答分类数组可排序。",
    en: "FAQ page banner, intro, categorized Q&A, and CTA. Q&A category arrays can be reordered."
  }
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

function labelFor(key: string, locale: AdminLocale) {
  return adminText(fieldLabels[key] ?? key.replace(/([A-Z])/g, " $1").replace(/_/g, " "), locale);
}

function pageLabelFor(pageKey: string, fallback: string, locale: AdminLocale) {
  return adminText(pageLabels[pageKey] ?? fallback, locale);
}

function blockLabelFor(row: AdminPageBlockRow, locale: AdminLocale) {
  return adminText(blockLabels[blockId(row)] ?? row.definition.blockLabel, locale);
}

function blockDescriptionFor(row: AdminPageBlockRow, locale: AdminLocale) {
  return adminText(blockDescriptions[blockId(row)] ?? row.definition.description, locale);
}

function previewHref(pageKey: string, locale: AdminLocale) {
  if (pageKey === "home" || pageKey === "layout") {
    return `/${locale}`;
  }

  return `/${locale}/${pageKey}`;
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

export function AdminPageBlocksManager({ rows, media, readOnly = false, locale }: AdminPageBlocksManagerProps) {
  const [activeLang, setActiveLang] = useState<Language>(locale);
  const [state, setState] = useState<EditorState>(() => initialState(rows));
  const [picker, setPicker] = useState<null | { block: string; lang: Language; path: (string | number)[] }>(null);
  const [dragging, setDragging] = useState<null | { block: string; lang: Language; path: (string | number)[]; index: number }>(null);
  const t = (value: AdminText) => adminText(value, locale);

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
    const label = labelFor(key, locale);

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
              {t("添加")}
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
                    <button type="button" disabled={readOnly || index === 0} onClick={() => moveArrayItem(block, lang, path, index, index - 1)} className="grid size-9 place-items-center border border-[color:var(--border)] disabled:opacity-40" aria-label={t("上移")}>
                      <ArrowUp size={15} />
                    </button>
                    <button type="button" disabled={readOnly || index === value.length - 1} onClick={() => moveArrayItem(block, lang, path, index, index + 1)} className="grid size-9 place-items-center border border-[color:var(--border)] disabled:opacity-40" aria-label={t("下移")}>
                      <ArrowDown size={15} />
                    </button>
                    <button type="button" disabled={readOnly} onClick={() => updateContent(block, lang, path, value.filter((_, itemIndex) => itemIndex !== index))} className="grid size-9 place-items-center border border-[color:var(--border)] text-[color:var(--red-seal)] disabled:opacity-40" aria-label={t("删除")}>
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
            <option value="store">{t("店铺")}</option>
            <option value="map">{t("地图")}</option>
            <option value="camera">{t("相机")}</option>
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
                {t("媒体库")}
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
        <p className="text-xs leading-5 text-[color:var(--muted)]">{t({ ja: "フィールド編集は保存用 JSON を同期生成します。配列カードはドラッグまたはボタンで並び替えできます。", zh: "字段化编辑会同步生成保存用 JSON；数组卡片可拖拽或按钮排序。", en: "Field editing syncs the JSON used for saving. Array cards can be reordered by drag or buttons." })}</p>
      </div>

      {Object.entries(grouped).map(([pageKey, pageRows]) => (
        <section key={pageKey} className="grid gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.28em] text-[color:var(--gold)]">PAGE BLOCKS</p>
              <h2 className="mt-2 font-serif text-3xl font-light">{pageLabelFor(pageKey, pageRows[0]?.definition.pageLabel ?? pageKey, locale)}</h2>
            </div>
            <Link href={previewHref(pageKey, locale)} target="_blank" className="inline-flex min-h-11 items-center gap-2 border border-[color:var(--gold)] px-4 text-sm tracking-[0.14em] text-[color:var(--gold-dark)]">
              <Eye size={16} />
              {t("预览")}
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
                        {current.isActive ? t({ ja: "公開済み", zh: "已发布", en: "Published" }) : t({ ja: "未公開", zh: "未发布", en: "Unpublished" })}
                      </span>
                    </div>
                    <h3 className="mt-3 break-words font-serif text-2xl font-light">{blockLabelFor(row, locale)}</h3>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{blockDescriptionFor(row, locale)}</p>
                  </div>

                  <fieldset disabled={readOnly} className="grid gap-3 disabled:opacity-70">
                    <label className="block min-w-0">
                      <span className="text-sm text-[color:var(--muted)]">{t("模块排序")}</span>
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
                      {t("发布到前台")}
                    </label>
                    <button
                      disabled={readOnly}
                      className="inline-flex min-h-11 items-center justify-center gap-2 border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 text-sm tracking-[0.14em] text-white disabled:border-[color:var(--border)] disabled:bg-transparent disabled:text-[color:var(--muted)]"
                    >
                      <Save size={15} />
                      {t("保存模块")}
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
          locale={locale}
          onClose={() => setPicker(null)}
          onSelect={(item) => updateContent(picker.block, picker.lang, picker.path, item.url)}
        />
      ) : null}
    </div>
  );
}
