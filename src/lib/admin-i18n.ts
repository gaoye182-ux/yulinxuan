import type { Language } from "@/lib/i18n";

export type AdminLocale = Language;
export type AdminText = string | Partial<Record<AdminLocale, string>>;

export const adminLocaleCookie = "admin_lang";

export const adminLocaleLabels: Record<AdminLocale, string> = {
  ja: "日本語",
  zh: "中文",
  en: "English"
};

const adminStringMap: Record<string, Record<AdminLocale, string>> = {
  "管理后台总览": {
    ja: "管理画面の概要",
    zh: "管理后台总览",
    en: "Admin Overview"
  },
  "当前阶段已接入登录成功/失败审计、临时锁定、TOTP 二步验证、Blog / News 保存审计、媒体库、角色权限矩阵、管理员新增编辑禁用与审计日志筛选分页。": {
    ja: "ログイン監査、一時ロック、TOTP 二段階認証、Blog / News 保存監査、メディア管理、権限管理、管理者管理、監査ログの検索とページングを利用できます。",
    zh: "当前阶段已接入登录成功/失败审计、临时锁定、TOTP 二步验证、Blog / News 保存审计、媒体库、角色权限矩阵、管理员新增编辑禁用与审计日志筛选分页。",
    en: "Login audit, temporary lockout, TOTP two-factor authentication, Blog / News save audit, media library, role permissions, admin user management, and searchable audit logs are enabled."
  },
  "鉴定申请管理": {
    ja: "鑑定依頼管理",
    zh: "鉴定申请管理",
    en: "Appraisal Requests"
  },
  "查看鉴定申请详情与图片，按状态、类型、语言和日期筛选，维护处理状态与内部备注，并导出当前筛选结果 CSV。": {
    ja: "鑑定依頼の詳細と画像を確認し、状態・種類・言語・日付で絞り込み、処理状況と内部メモを管理して CSV を出力できます。",
    zh: "查看鉴定申请详情与图片，按状态、类型、语言和日期筛选，维护处理状态与内部备注，并导出当前筛选结果 CSV。",
    en: "Review appraisal request details and images, filter by status, type, language, and date, update internal notes, and export the filtered CSV."
  },
  "联系表单管理": {
    ja: "お問い合わせ管理",
    zh: "联系表单管理",
    en: "Contact Messages"
  },
  "前台 Contact 表单已真实写入 contact_messages；此处可搜索、按状态/分类/语言筛选、更新处理状态与备注，并导出当前筛选结果 CSV。": {
    ja: "前台のお問い合わせフォームは contact_messages に保存されます。ここで検索、状態・分類・言語の絞り込み、対応状況とメモ更新、CSV 出力ができます。",
    zh: "前台 Contact 表单已真实写入 contact_messages；此处可搜索、按状态/分类/语言筛选、更新处理状态与备注，并导出当前筛选结果 CSV。",
    en: "Frontend contact submissions are stored in contact_messages. Search, filter by status/category/language, update handling notes, and export the filtered CSV."
  },
  "藏品管理": {
    ja: "蔵品管理",
    zh: "藏品管理",
    en: "Collection Items"
  },
  "支持新增、编辑、软删除、搜索筛选分页、发布状态、推荐标记和媒体库图片管理。": {
    ja: "新規作成、編集、ソフト削除、検索と絞り込み、公開状態、推薦フラグ、メディア画像管理に対応します。",
    zh: "支持新增、编辑、软删除、搜索筛选分页、发布状态、推荐标记和媒体库图片管理。",
    en: "Create, edit, soft-delete, search, filter, paginate, manage publish state, featured flags, and media images."
  },
  "新增藏品": {
    ja: "蔵品を追加",
    zh: "新增藏品",
    en: "New Item"
  },
  "创建三语藏品记录，设置分类、价格显示、发布状态、推荐标记和媒体库图片。": {
    ja: "三語の蔵品情報を作成し、分類、価格表示、公開状態、推薦フラグ、メディア画像を設定します。",
    zh: "创建三语藏品记录，设置分类、价格显示、发布状态、推荐标记和媒体库图片。",
    en: "Create a trilingual item record with category, price display, publish state, featured flags, and media images."
  },
  "编辑藏品": {
    ja: "蔵品を編集",
    zh: "编辑藏品",
    en: "Edit Item"
  },
  "更新藏品三语内容、分类、价格、发布状态、推荐标记、图片排序和 alt 文本。": {
    ja: "蔵品の三語内容、分類、価格、公開状態、推薦フラグ、画像順、alt テキストを更新します。",
    zh: "更新藏品三语内容、分类、价格、发布状态、推荐标记、图片排序和 alt 文本。",
    en: "Update trilingual item content, category, price, publish state, featured flags, image order, and alt text."
  },
  "分类管理": {
    ja: "分類管理",
    zh: "分类管理",
    en: "Categories"
  },
  "支持分类新增、编辑、父子级、三语名称/说明、封面媒体库选择、首页展示开关、启用状态、排序与停用。": {
    ja: "分類の追加、編集、親子関係、三語名称・説明、カバー画像、首页表示、状態、並び順、停止を管理します。",
    zh: "支持分类新增、编辑、父子级、三语名称/说明、封面媒体库选择、首页展示开关、启用状态、排序与停用。",
    en: "Manage category creation, editing, hierarchy, trilingual names/descriptions, cover media, home visibility, state, order, and disabling."
  },
  "新增分类": {
    ja: "分類を追加",
    zh: "新增分类",
    en: "New Category"
  },
  "创建三语分类，设置父级、封面图、排序、启用状态和首页展示。": {
    ja: "三語分類を作成し、親分類、カバー画像、並び順、有効状態、首页表示を設定します。",
    zh: "创建三语分类，设置父级、封面图、排序、启用状态和首页展示。",
    en: "Create a trilingual category with parent, cover image, sort order, active state, and home visibility."
  },
  "编辑分类": {
    ja: "分類を編集",
    zh: "编辑分类",
    en: "Edit Category"
  },
  "更新分类三语内容、父级、封面图、排序、启用状态和首页展示。": {
    ja: "分類の三語内容、親分類、カバー画像、並び順、有効状態、首页表示を更新します。",
    zh: "更新分类三语内容、父级、封面图、排序、启用状态和首页展示。",
    en: "Update trilingual category content, parent, cover image, sort order, active state, and home visibility."
  },
  "博客管理": {
    ja: "ブログ管理",
    zh: "博客管理",
    en: "Blog"
  },
  "维护鉴定师博客文章。支持 JA / ZH / EN 三语标题、摘要、富文本正文、分类、标签、封面、发布状态和 SEO 设置。": {
    ja: "鑑定士ブログを管理します。JA / ZH / EN のタイトル、概要、本文、分類、タグ、カバー、公開状態、SEO 設定に対応します。",
    zh: "维护鉴定师博客文章。支持 JA / ZH / EN 三语标题、摘要、富文本正文、分类、标签、封面、发布状态和 SEO 设置。",
    en: "Manage appraiser blog posts with JA / ZH / EN titles, excerpts, rich text body, categories, tags, covers, publish state, and SEO."
  },
  "新增博客": {
    ja: "ブログを追加",
    zh: "新增博客",
    en: "New Blog Post"
  },
  "创建新的鉴定师博客。提交后将保存为 Prisma blog_posts 记录，并同步前台三语 Blog 页面。": {
    ja: "新しい鑑定士ブログを作成します。保存後は Prisma blog_posts に記録され、前台の三語 Blog ページに反映されます。",
    zh: "创建新的鉴定师博客。提交后将保存为 Prisma blog_posts 记录，并同步前台三语 Blog 页面。",
    en: "Create a new appraiser blog post. It is saved to Prisma blog_posts and reflected on the trilingual frontend Blog pages."
  },
  "编辑博客": {
    ja: "ブログを編集",
    zh: "编辑博客",
    en: "Edit Blog Post"
  },
  "编辑三语博客内容、封面、分类标签、发布状态和 SEO。保存后写入 Prisma blog_posts。": {
    ja: "三語ブログ内容、カバー、分類タグ、公開状態、SEO を編集します。保存後は Prisma blog_posts に書き込まれます。",
    zh: "编辑三语博客内容、封面、分类标签、发布状态和 SEO。保存后写入 Prisma blog_posts。",
    en: "Edit trilingual blog content, cover, category tags, publish state, and SEO. Saves to Prisma blog_posts."
  },
  "资讯管理": {
    ja: "新着情報管理",
    zh: "资讯管理",
    en: "News"
  },
  "维护官网新着情報。支持公告、新入荷、活动、营业安排等类型，并预留定时发布、预览、SEO 与媒体库封面入口。": {
    ja: "公式サイトの新着情報を管理します。お知らせ、新入荷、イベント、営業案内などに対応し、予約公開、プレビュー、SEO、メディアカバーに備えています。",
    zh: "维护官网新着情報。支持公告、新入荷、活动、营业安排等类型，并预留定时发布、预览、SEO 与媒体库封面入口。",
    en: "Manage official news, including notices, new arrivals, events, and business updates, with room for scheduled publishing, preview, SEO, and cover media."
  },
  "新增资讯": {
    ja: "新着情報を追加",
    zh: "新增资讯",
    en: "New News"
  },
  "创建新的官网资讯。提交后将保存为 Prisma news 记录，并同步前台三语 News 页面。": {
    ja: "新しい公式新着情報を作成します。保存後は Prisma news に記録され、前台の三語 News ページに反映されます。",
    zh: "创建新的官网资讯。提交后将保存为 Prisma news 记录，并同步前台三语 News 页面。",
    en: "Create a new official news entry. It is saved to Prisma news and reflected on the trilingual frontend News pages."
  },
  "编辑资讯": {
    ja: "新着情報を編集",
    zh: "编辑资讯",
    en: "Edit News"
  },
  "编辑三语资讯内容、类型标签、发布状态和 SEO。保存后写入 Prisma news。": {
    ja: "三語新着情報、種類タグ、公開状態、SEO を編集します。保存後は Prisma news に書き込まれます。",
    zh: "编辑三语资讯内容、类型标签、发布状态和 SEO。保存后写入 Prisma news。",
    en: "Edit trilingual news content, type tags, publish state, and SEO. Saves to Prisma news."
  },
  "页面模块": {
    ja: "ページモジュール",
    zh: "页面模块",
    en: "Page Blocks"
  },
  "维护顶部导航、页脚、首页、About、鉴定、购买方法、FAQ、Contact / Access 的说明文案、图片、排序和发布状态。未创建的模块会由前台自动使用三语默认内容。": {
    ja: "ナビゲーション、フッター、首页、About、鑑定、購入方法、FAQ、Contact / Access の文案、画像、並び順、公開状態を管理します。未作成モジュールは前台の三語デフォルトを使用します。",
    zh: "维护顶部导航、页脚、首页、About、鉴定、购买方法、FAQ、Contact / Access 的说明文案、图片、排序和发布状态。未创建的模块会由前台自动使用三语默认内容。",
    en: "Manage navigation, footer, home, About, Appraisal, Purchase Guide, FAQ, Contact / Access copy, images, order, and publish state. Missing blocks use trilingual frontend defaults."
  },
  "媒体库": {
    ja: "メディアライブラリ",
    zh: "媒体库",
    en: "Media Library"
  },
  "上传图片后自动保留原图，生成 WebP 展示图和缩略图；支持 JA / ZH / EN alt 文本、搜索筛选和引用保护删除。": {
    ja: "画像アップロード後に原图を保持し、WebP 表示图とサムネイルを生成します。JA / ZH / EN alt、検索、参照保護削除に対応します。",
    zh: "上传图片后自动保留原图，生成 WebP 展示图和缩略图；支持 JA / ZH / EN alt 文本、搜索筛选和引用保护删除。",
    en: "Uploaded images keep originals and generate WebP display and thumbnails. Supports JA / ZH / EN alt text, search, filtering, and protected deletion."
  },
  "SEO 管理": {
    ja: "SEO 管理",
    zh: "SEO 管理",
    en: "SEO"
  },
  "集中维护全站默认 Meta、OGP、canonical、多语言索引策略、robots.txt、sitemap.xml 与部署前重定向清单。": {
    ja: "サイト全体のデフォルト Meta、OGP、canonical、多言語インデックス方針、robots.txt、sitemap.xml、公開前リダイレクト一覧を管理します。",
    zh: "集中维护全站默认 Meta、OGP、canonical、多语言索引策略、robots.txt、sitemap.xml 与部署前重定向清单。",
    en: "Manage default Meta, OGP, canonical, multilingual indexing policy, robots.txt, sitemap.xml, and pre-release redirect list."
  },
  "登录安全": {
    ja: "ログインセキュリティ",
    zh: "登录安全",
    en: "Login Security"
  },
  "为当前管理员账号启用 TOTP 二步验证。登录时可使用认证器 6 位验证码，备用码只能使用一次；失败次数会计入临时锁定策略。": {
    ja: "現在の管理者アカウントに TOTP 二段階認証を設定します。ログイン時は認証アプリの 6 桁コードを使用でき、备用コードは一度だけ使えます。失敗回数は一時ロック策略に反映されます。",
    zh: "为当前管理员账号启用 TOTP 二步验证。登录时可使用认证器 6 位验证码，备用码只能使用一次；失败次数会计入临时锁定策略。",
    en: "Enable TOTP two-factor authentication for the current admin account. Use a 6-digit authenticator code at login; backup codes are one-time use. Failed attempts count toward temporary lockout."
  },
  "站点设置": {
    ja: "サイト設定",
    zh: "站点设置",
    en: "Site Settings"
  },
  "维护公司基础信息、联系方式、营业时间、Google Maps 嵌入、SEO 默认值、robots/sitemap 输出，以及可配置的登录失败锁定策略。": {
    ja: "会社基本情報、連絡先、営業時間、Google Maps 埋め込み、SEO デフォルト、robots/sitemap 出力、ログイン失敗ロック策略を管理します。",
    zh: "维护公司基础信息、联系方式、营业时间、Google Maps 嵌入、SEO 默认值、robots/sitemap 输出，以及可配置的登录失败锁定策略。",
    en: "Manage company profile, contact details, business hours, Google Maps embed, SEO defaults, robots/sitemap output, and configurable login lockout policy."
  },
  "管理员与权限": {
    ja: "管理者と権限",
    zh: "管理员与权限",
    en: "Admins & Permissions"
  },
  "新增、编辑、禁用管理员账号，重置密码，并查看 viewer / editor / admin / super_admin 的页面级与操作级权限。Super Admin 可为账号生成或重置 TOTP，所有管理员也可在登录安全页自助管理。": {
    ja: "管理者アカウントの追加、編集、停止、パスワードリセットを行い、viewer / editor / admin / super_admin のページ権限と操作権限を確認します。Super Admin は TOTP の作成・リセットも可能です。",
    zh: "新增、编辑、禁用管理员账号，重置密码，并查看 viewer / editor / admin / super_admin 的页面级与操作级权限。Super Admin 可为账号生成或重置 TOTP，所有管理员也可在登录安全页自助管理。",
    en: "Create, edit, disable admin accounts, reset passwords, and review page/action permissions for viewer / editor / admin / super_admin. Super Admins can generate or reset TOTP."
  },
  "审计日志": {
    ja: "監査ログ",
    zh: "审计日志",
    en: "Audit Logs"
  },
  "按操作、对象、管理员和日期筛选后台登录、锁定、内容保存、用户管理事件；每页 20 条，便于上线前追踪权限行为。": {
    ja: "操作、対象、管理者、日付で后台ログイン、ロック、内容保存、ユーザー管理イベントを絞り込みます。1 ページ 20 件で権限動作を追跡できます。",
    zh: "按操作、对象、管理员和日期筛选后台登录、锁定、内容保存、用户管理事件；每页 20 条，便于上线前追踪权限行为。",
    en: "Filter backend login, lockout, content save, and user management events by action, target, admin, and date. Shows 20 records per page."
  }
};

export function adminText(value: AdminText, locale: AdminLocale) {
  if (typeof value !== "string") {
    return value[locale] || value.zh || value.ja || value.en || "";
  }

  return adminStringMap[value]?.[locale] || value;
}
