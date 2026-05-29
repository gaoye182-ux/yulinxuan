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
    ja: "フロントサイトのお問い合わせフォームは contact_messages に保存されます。ここで検索、状態・分類・言語の絞り込み、対応状況とメモ更新、CSV 出力ができます。",
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
    ja: "分類の追加、編集、親子関係、三語名称・説明、カバー画像、ホーム表示、状態、並び順、停止を管理します。",
    zh: "支持分类新增、编辑、父子级、三语名称/说明、封面媒体库选择、首页展示开关、启用状态、排序与停用。",
    en: "Manage category creation, editing, hierarchy, trilingual names/descriptions, cover media, home visibility, state, order, and disabling."
  },
  "新增分类": {
    ja: "分類を追加",
    zh: "新增分类",
    en: "New Category"
  },
  "创建三语分类，设置父级、封面图、排序、启用状态和首页展示。": {
    ja: "三語分類を作成し、親分類、カバー画像、並び順、有効状態、ホーム表示を設定します。",
    zh: "创建三语分类，设置父级、封面图、排序、启用状态和首页展示。",
    en: "Create a trilingual category with parent, cover image, sort order, active state, and home visibility."
  },
  "编辑分类": {
    ja: "分類を編集",
    zh: "编辑分类",
    en: "Edit Category"
  },
  "更新分类三语内容、父级、封面图、排序、启用状态和首页展示。": {
    ja: "分類の三語内容、親分類、カバー画像、並び順、有効状態、ホーム表示を更新します。",
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
    ja: "新しい鑑定士ブログを作成します。保存後は Prisma blog_posts に記録され、フロントサイトの三語 Blog ページに反映されます。",
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
    ja: "新しい公式新着情報を作成します。保存後は Prisma news に記録され、フロントサイトの三語 News ページに反映されます。",
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
    ja: "ナビゲーション、フッター、ホーム、About、鑑定、購入方法、FAQ、Contact / Access の文案、画像、並び順、公開状態を管理します。未作成モジュールはフロントサイトの三語デフォルトを使用します。",
    zh: "维护顶部导航、页脚、首页、About、鉴定、购买方法、FAQ、Contact / Access 的说明文案、图片、排序和发布状态。未创建的模块会由前台自动使用三语默认内容。",
    en: "Manage navigation, footer, home, About, Appraisal, Purchase Guide, FAQ, Contact / Access copy, images, order, and publish state. Missing blocks use trilingual frontend defaults."
  },
  "媒体库": {
    ja: "メディアライブラリ",
    zh: "媒体库",
    en: "Media Library"
  },
  "上传图片后自动保留原图，生成 WebP 展示图和缩略图；支持 JA / ZH / EN alt 文本、搜索筛选和引用保护删除。": {
    ja: "画像アップロード後に原画像を保持し、WebP 表示画像とサムネイルを生成します。JA / ZH / EN alt、検索、参照保護削除に対応します。",
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
    ja: "現在の管理者アカウントに TOTP 二段階認証を設定します。ログイン時は認証アプリの 6 桁コードを使用でき、バックアップコードは一度だけ使えます。失敗回数は一時ロックポリシーに反映されます。",
    zh: "为当前管理员账号启用 TOTP 二步验证。登录时可使用认证器 6 位验证码，备用码只能使用一次；失败次数会计入临时锁定策略。",
    en: "Enable TOTP two-factor authentication for the current admin account. Use a 6-digit authenticator code at login; backup codes are one-time use. Failed attempts count toward temporary lockout."
  },
  "站点设置": {
    ja: "サイト設定",
    zh: "站点设置",
    en: "Site Settings"
  },
  "维护公司基础信息、联系方式、营业时间、Google Maps 嵌入、SEO 默认值、robots/sitemap 输出，以及可配置的登录失败锁定策略。": {
    ja: "会社基本情報、連絡先、営業時間、Google Maps 埋め込み、SEO デフォルト、robots/sitemap 出力、ログイン失敗ロックポリシーを管理します。",
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
    ja: "操作、対象、管理者、日付で管理画面ログイン、ロック、内容保存、ユーザー管理イベントを絞り込みます。1 ページ 20 件で権限動作を追跡できます。",
    zh: "按操作、对象、管理员和日期筛选后台登录、锁定、内容保存、用户管理事件；每页 20 条，便于上线前追踪权限行为。",
    en: "Filter backend login, lockout, content save, and user management events by action, target, admin, and date. Shows 20 records per page."
  },
  "搜索": { ja: "検索", zh: "搜索", en: "Search" },
  "筛选": { ja: "絞り込み", zh: "筛选", en: "Filter" },
  "状态": { ja: "状態", zh: "状态", en: "Status" },
  "全部": { ja: "すべて", zh: "全部", en: "All" },
  "只读": { ja: "読み取り専用", zh: "只读", en: "Read only" },
  "预览": { ja: "プレビュー", zh: "预览", en: "Preview" },
  "编辑": { ja: "編集", zh: "编辑", en: "Edit" },
  "复制": { ja: "コピー", zh: "复制", en: "Duplicate" },
  "删除": { ja: "削除", zh: "删除", en: "Delete" },
  "软删除": { ja: "ソフト削除", zh: "软删除", en: "Soft delete" },
  "上一页": { ja: "前のページ", zh: "上一页", en: "Previous" },
  "下一页": { ja: "次のページ", zh: "下一页", en: "Next" },
  "语言": { ja: "言語", zh: "语言", en: "Language" },
  "未记录": { ja: "記録なし", zh: "未记录", en: "Not recorded" },
  "操作已完成。": { ja: "操作が完了しました。", zh: "操作已完成。", en: "Operation completed." },
  "操作失败，请稍后再试。": { ja: "操作に失敗しました。後でもう一度お試しください。", zh: "操作失败，请稍后再试。", en: "Operation failed. Please try again later." },
  "当前角色不能分配该权限级别。": { ja: "現在の権限ではこのロールを割り当てられません。", zh: "当前角色不能分配该权限级别。", en: "The current role cannot assign this permission level." },
  "当前角色不能编辑该管理员。": { ja: "現在の権限ではこの管理者を編集できません。", zh: "当前角色不能编辑该管理员。", en: "The current role cannot edit this admin." },
  "不能禁用当前登录账号。": { ja: "現在ログイン中のアカウントは無効化できません。", zh: "不能禁用当前登录账号。", en: "You cannot disable the currently signed-in account." },
  "新增管理员或重置密码时，密码至少需要 12 位。": { ja: "管理者の追加またはパスワードリセットには 12 文字以上のパスワードが必要です。", zh: "新增管理员或重置密码时，密码至少需要 12 位。", en: "New admins and password resets require at least 12 characters." },
  "管理员不存在或已被删除。": { ja: "管理者が存在しないか削除されています。", zh: "管理员不存在或已被删除。", en: "The admin does not exist or has been deleted." },
  "请先生成二步验证密钥。": { ja: "先に二段階認証キーを生成してください。", zh: "请先生成二步验证密钥。", en: "Generate a two-factor secret first." },
  "验证码不正确，请确认手机时间同步后重试。": { ja: "確認コードが正しくありません。端末の時刻同期を確認して再試行してください。", zh: "验证码不正确，请确认手机时间同步后重试。", en: "The verification code is incorrect. Check device time sync and try again." },
  "二步验证码不正确，请确认手机时间同步后重试。": { ja: "二段階認証コードが正しくありません。端末の時刻同期を確認して再試行してください。", zh: "二步验证码不正确，请确认手机时间同步后重试。", en: "The two-factor code is incorrect. Check device time sync and try again." },
  "站点设置已保存，并写入审计日志。": { ja: "サイト設定を保存し、監査ログに記録しました。", zh: "站点设置已保存，并写入审计日志。", en: "Site settings were saved and written to the audit log." },
  "管理员资料已保存。": { ja: "管理者情報を保存しました。", zh: "管理员资料已保存。", en: "Admin profile saved." },
  "管理员已新增。": { ja: "管理者を追加しました。", zh: "管理员已新增。", en: "Admin created." },
  "管理员已启用。": { ja: "管理者を有効化しました。", zh: "管理员已启用。", en: "Admin enabled." },
  "管理员已禁用。": { ja: "管理者を無効化しました。", zh: "管理员已禁用。", en: "Admin disabled." },
  "已生成二步验证密钥，请扫码并输入验证码启用。": { ja: "二段階認証キーを生成しました。QR を読み取り、確認コードを入力して有効化してください。", zh: "已生成二步验证密钥，请扫码并输入验证码启用。", en: "A two-factor secret was generated. Scan the QR code and enter the verification code to enable it." },
  "二步验证已启用，请立即保存备用码。": { ja: "二段階認証を有効化しました。バックアップコードをすぐ保存してください。", zh: "二步验证已启用，请立即保存备用码。", en: "Two-factor authentication is enabled. Save the backup codes now." },
  "二步验证已关闭。": { ja: "二段階認証を無効化しました。", zh: "二步验证已关闭。", en: "Two-factor authentication is disabled." },
  "备用码已重新生成，旧备用码已全部失效。": { ja: "バックアップコードを再生成しました。以前のコードはすべて無効です。", zh: "备用码已重新生成，旧备用码已全部失效。", en: "Backup codes were regenerated. All previous codes are now invalid." },
  "当前结果": { ja: "現在の結果", zh: "当前结果", en: "Current results" },
  "本页显示": { ja: "このページ", zh: "本页显示", en: "Shown on page" },
  "当前页": { ja: "現在ページ", zh: "当前页", en: "Current page" },
  "总页数": { ja: "総ページ数", zh: "总页数", en: "Total pages" },
  "总条目": { ja: "総件数", zh: "总条目", en: "Total entries" },
  "已发布": { ja: "公開済み", zh: "已发布", en: "Published" },
  "推荐显示": { ja: "推薦表示", zh: "推荐显示", en: "Featured" },
  "分类/类型": { ja: "分類 / 種類", zh: "分类/类型", en: "Categories / types" },
  "分类": { ja: "分類", zh: "分类", en: "Category" },
  "类别": { ja: "分類", zh: "类别", en: "Category" },
  "未分类": { ja: "未分類", zh: "未分类", en: "Uncategorized" },
  "排序": { ja: "並び順", zh: "排序", en: "Sort order" },
  "父级": { ja: "親分類", zh: "父级", en: "Parent" },
  "关联": { ja: "関連", zh: "关联", en: "Relations" },
  "前台": { ja: "サイト", zh: "前台", en: "Site" },
  "启用": { ja: "有効", zh: "启用", en: "Enable" },
  "停用": { ja: "停止", zh: "停用", en: "Disable" },
  "内容": { ja: "内容", zh: "内容", en: "Content" },
  "标题": { ja: "タイトル", zh: "标题", en: "Title" },
  "摘要": { ja: "概要", zh: "摘要", en: "Excerpt" },
  "名称": { ja: "名称", zh: "名称", en: "Name" },
  "时代": { ja: "時代", zh: "时代", en: "Era" },
  "产地": { ja: "産地", zh: "产地", en: "Origin" },
  "状态说明": { ja: "状態説明", zh: "状态说明", en: "Condition Notes" },
  "描述": { ja: "説明", zh: "描述", en: "Description" },
  "价格": { ja: "価格", zh: "价格", en: "Price" },
  "币种": { ja: "通貨", zh: "币种", en: "Currency" },
  "价格显示": { ja: "価格表示", zh: "价格显示", en: "Price display" },
  "询价": { ja: "問い合わせ", zh: "询价", en: "Inquiry" },
  "显示价格": { ja: "価格を表示", zh: "显示价格", en: "Show price" },
  "隐藏": { ja: "非表示", zh: "隐藏", en: "Hidden" },
  "作家": { ja: "作家", zh: "作家", en: "Artist" },
  "尺寸": { ja: "寸法", zh: "尺寸", en: "Dimensions" },
  "重量": { ja: "重量", zh: "重量", en: "Weight" },
  "选择媒体库图片": { ja: "メディアライブラリから画像を選択", zh: "选择媒体库图片", en: "Select an image from media" },
  "从媒体库选择": { ja: "メディアから選択", zh: "从媒体库选择", en: "Choose from Media" },
  "保存主图": { ja: "メイン画像を保存", zh: "保存主图", en: "Save Main Image" },
  "主图": { ja: "メイン画像", zh: "主图", en: "Main" },
  "上移": { ja: "上へ", zh: "上移", en: "Move up" },
  "下移": { ja: "下へ", zh: "下移", en: "Move down" },
  "移除": { ja: "削除", zh: "移除", en: "Remove" },
  "添加": { ja: "追加", zh: "添加", en: "Add" },
  "关闭": { ja: "閉じる", zh: "关闭", en: "Close" },
  "小标题": { ja: "小見出し", zh: "小标题", en: "Heading" },
  "粗体": { ja: "太字", zh: "粗体", en: "Bold" },
  "斜体": { ja: "斜体", zh: "斜体", en: "Italic" },
  "引用": { ja: "引用", zh: "引用", en: "Quote" },
  "插入图片": { ja: "画像を挿入", zh: "插入图片", en: "Insert image" },
  "打开邮件回复模板": { ja: "メール返信テンプレートを開く", zh: "打开邮件回复模板", en: "Open Reply Email Template" },
  "处理状态": { ja: "対応状況", zh: "处理状态", en: "Handling Status" },
  "回复备注": { ja: "返信メモ", zh: "回复备注", en: "Reply Note" },
  "管理员备注": { ja: "管理者メモ", zh: "管理员备注", en: "Admin Note" },
  "保存状态与备注": { ja: "状態とメモを保存", zh: "保存状态与备注", en: "Save Status & Notes" },
  "提交时间": { ja: "送信日時", zh: "提交时间", en: "Submitted" },
  "提交": { ja: "送信", zh: "提交", en: "submitted" },
  "地区": { ja: "地域", zh: "地区", en: "Region" },
  "上传图片": { ja: "画像をアップロード", zh: "上传图片", en: "Upload Image" },
  "一次性备用码": { ja: "ワンタイムバックアップコード", zh: "一次性备用码", en: "One-time Backup Codes" },
  "备用码": { ja: "バックアップコード", zh: "备用码", en: "Backup Codes" },
  "账号": { ja: "アカウント", zh: "账号", en: "Account" },
  "已启用": { ja: "有効", zh: "已启用", en: "Enabled" },
  "未启用": { ja: "未有効", zh: "未启用", en: "Not enabled" },
  "待验证启用": { ja: "検証待ち", zh: "待验证启用", en: "Pending verification" },
  "验证时间": { ja: "検証日時", zh: "验证时间", en: "Verified at" },
  "剩余备用码": { ja: "残りバックアップコード", zh: "剩余备用码", en: "Backup codes left" },
  "生成二维码": { ja: "QR コードを生成", zh: "生成二维码", en: "Generate QR Code" },
  "登录限制": { ja: "ログイン制限", zh: "登录限制", en: "Login Limits" },
  "认证器信息": { ja: "認証アプリ情報", zh: "认证器信息", en: "Authenticator Info" },
  "启用 TOTP 二步验证": { ja: "TOTP 二段階認証を有効化", zh: "启用 TOTP 二步验证", en: "Enable TOTP Two-factor" },
  "6 位验证码": { ja: "6 桁コード", zh: "6 位验证码", en: "6-digit code" },
  "6 位验证码或备用码": { ja: "6 桁コードまたはバックアップコード", zh: "6 位验证码或备用码", en: "6-digit code or backup code" },
  "重新生成备用码": { ja: "バックアップコードを再生成", zh: "重新生成备用码", en: "Regenerate Backup Codes" },
  "重新生成": { ja: "再生成", zh: "重新生成", en: "Regenerate" },
  "关闭二步验证": { ja: "二段階認証を無効化", zh: "关闭二步验证", en: "Disable Two-factor" },
  "关闭 TOTP": { ja: "TOTP を無効化", zh: "关闭 TOTP", en: "Disable TOTP" },
  "公司基础信息": { ja: "会社基本情報", zh: "公司基础信息", en: "Company Profile" },
  "品牌名": { ja: "ブランド名", zh: "品牌名", en: "Brand Name" },
  "法人名称": { ja: "法人名", zh: "法人名称", en: "Legal Name" },
  "品牌标语": { ja: "ブランドタグライン", zh: "品牌标语", en: "Brand Tagline" },
  "古物商许可 / 登记信息": { ja: "古物商許可 / 登録情報", zh: "古物商许可 / 登记信息", en: "Antique Dealer License / Registration" },
  "创立年份": { ja: "創業年", zh: "创立年份", en: "Founding Year" },
  "联系方式与地图": { ja: "連絡先と地図", zh: "联系方式与地图", en: "Contact & Map" },
  "地址": { ja: "住所", zh: "地址", en: "Address" },
  "电话": { ja: "電話", zh: "电话", en: "Phone" },
  "邮箱": { ja: "メール", zh: "邮箱", en: "Email" },
  "营业时间": { ja: "営業時間", zh: "营业时间", en: "Business Hours" },
  "休业日": { ja: "休業日", zh: "休业日", en: "Holidays" },
  "补充说明": { ja: "補足説明", zh: "补充说明", en: "Additional Notes" },
  "SEO 默认值": { ja: "SEO デフォルト", zh: "SEO 默认值", en: "SEO Defaults" },
  "默认标题": { ja: "デフォルトタイトル", zh: "默认标题", en: "Default Title" },
  "默认描述": { ja: "デフォルト説明", zh: "默认描述", en: "Default Description" },
  "默认关键词": { ja: "デフォルトキーワード", zh: "默认关键词", en: "Default Keywords" },
  "OGP 默认图片": { ja: "OGP デフォルト画像", zh: "OGP 默认图片", en: "Default OGP Image" },
  "Canonical 使用尾斜杠": { ja: "Canonical に末尾スラッシュを使用", zh: "Canonical 使用尾斜杠", en: "Use trailing slash for canonical" },
  "Noindex 路径（一行一个）": { ja: "Noindex パス（1 行に 1 つ）", zh: "Noindex 路径（一行一个）", en: "Noindex paths (one per line)" },
  "重定向规则（from => to，一行一个）": { ja: "リダイレクト規則（from => to、1 行に 1 つ）", zh: "重定向规则（from => to，一行一个）", en: "Redirect rules (from => to, one per line)" },
  "启用 robots.txt": { ja: "robots.txt を有効化", zh: "启用 robots.txt", en: "Enable robots.txt" },
  "禁止 /admin": { ja: "/admin を禁止", zh: "禁止 /admin", en: "Disallow /admin" },
  "启用 sitemap.xml": { ja: "sitemap.xml を有効化", zh: "启用 sitemap.xml", en: "Enable sitemap.xml" },
  "包含博客": { ja: "ブログを含める", zh: "包含博客", en: "Include blog" },
  "包含资讯": { ja: "新着情報を含める", zh: "包含资讯", en: "Include news" },
  "包含藏品": { ja: "蔵品を含める", zh: "包含藏品", en: "Include items" },
  "登录安全策略": { ja: "ログインセキュリティポリシー", zh: "登录安全策略", en: "Login Security Policy" },
  "失败锁定阈值": { ja: "失敗ロック閾値", zh: "失败锁定阈值", en: "Lockout threshold" },
  "锁定分钟数": { ja: "ロック分数", zh: "锁定分钟数", en: "Lock minutes" },
  "强密码策略": { ja: "強力なパスワードポリシー", zh: "强密码策略", en: "Strong password policy" },
  "要求 Admin 启用 TOTP": { ja: "Admin に TOTP を要求", zh: "要求 Admin 启用 TOTP", en: "Require TOTP for Admins" },
  "保存站点设置": { ja: "サイト設定を保存", zh: "保存站点设置", en: "Save Site Settings" },
  "当前角色只读": { ja: "現在の権限は読み取り専用", zh: "当前角色只读", en: "Current role is read-only" },
  "角色权限矩阵": { ja: "ロール権限マトリクス", zh: "角色权限矩阵", en: "Role Permission Matrix" },
  "新增管理员": { ja: "管理者を追加", zh: "新增管理员", en: "New Admin" },
  "显示名称": { ja: "表示名", zh: "显示名称", en: "Display name" },
  "初始密码（至少 12 位）": { ja: "初期パスワード（12 文字以上）", zh: "初始密码（至少 12 位）", en: "Initial password (at least 12 characters)" },
  "新增": { ja: "追加", zh: "新增", en: "Create" },
  "启用中": { ja: "有効中", zh: "启用中", en: "Active" },
  "已禁用": { ja: "無効", zh: "已禁用", en: "Disabled" },
  "TOTP 未启用": { ja: "TOTP 未有効", zh: "TOTP 未启用", en: "TOTP not enabled" },
  "TOTP 二步验证": { ja: "TOTP 二段階認証", zh: "TOTP 二步验证", en: "TOTP Two-factor" },
  "已生成密钥，等待扫码校验启用。": { ja: "キーは生成済みです。QR 読み取りと検証待ちです。", zh: "已生成密钥，等待扫码校验启用。", en: "Secret generated, waiting for QR scan and verification." },
  "未生成密钥。": { ja: "キー未生成です。", zh: "未生成密钥。", en: "Secret not generated." },
  "留空不改密码": { ja: "空欄ならパスワード変更なし", zh: "留空不改密码", en: "Leave blank to keep password" },
  "启用账号": { ja: "アカウントを有効化", zh: "启用账号", en: "Enable account" },
  "禁用账号": { ja: "アカウントを無効化", zh: "禁用账号", en: "Disable account" },
  "保存 / 重置密码": { ja: "保存 / パスワードリセット", zh: "保存 / 重置密码", en: "Save / Reset Password" },
  "关闭 / 重置 TOTP": { ja: "TOTP を無効化 / リセット", zh: "关闭 / 重置 TOTP", en: "Disable / Reset TOTP" },
  "设置 TOTP": { ja: "TOTP を設定", zh: "设置 TOTP", en: "Set TOTP" },
  "无操作权限": { ja: "操作権限なし", zh: "无操作权限", en: "No action permission" },
  "父级分类": { ja: "親分類", zh: "父级分类", en: "Parent category" },
  "无父级": { ja: "親なし", zh: "无父级", en: "No parent" },
  "启用分类": { ja: "分類を有効化", zh: "启用分类", en: "Enable category" },
  "首页展示": { ja: "ホーム表示", zh: "首页展示", en: "Show on home" },
  "分类封面": { ja: "分類カバー", zh: "分类封面", en: "Category cover" },
  "清除封面": { ja: "カバーをクリア", zh: "清除封面", en: "Clear cover" },
  "停用分类": { ja: "分類を停止", zh: "停用分类", en: "Disable category" },
  "模块排序": { ja: "モジュール順", zh: "模块排序", en: "Block sort order" },
  "发布到前台": { ja: "サイトに公開", zh: "发布到前台", en: "Publish to site" },
  "保存模块": { ja: "モジュールを保存", zh: "保存模块", en: "Save Block" },
  "店铺": { ja: "店舗", zh: "店铺", en: "Store" },
  "地图": { ja: "地図", zh: "地图", en: "Map" },
  "相机": { ja: "カメラ", zh: "相机", en: "Camera" },
  "登录成功": { ja: "ログイン成功", zh: "登录成功", en: "Login success" },
  "登录失败": { ja: "ログイン失敗", zh: "登录失败", en: "Login failed" },
  "登录锁定": { ja: "ログインロック", zh: "登录锁定", en: "Login locked" },
  "锁定中登录": { ja: "ロック中ログイン", zh: "锁定中登录", en: "Login while locked" },
  "需要二步验证": { ja: "二段階認証が必要", zh: "需要二步验证", en: "Two-factor required" },
  "二步验证失败": { ja: "二段階認証失敗", zh: "二步验证失败", en: "Two-factor failed" },
  "TOTP 策略阻止登录": { ja: "TOTP ポリシーによるログインブロック", zh: "TOTP 策略阻止登录", en: "TOTP policy blocked login" },
  "保存博客": { ja: "ブログを保存", zh: "保存博客", en: "Save blog" },
  "保存资讯": { ja: "新着情報を保存", zh: "保存资讯", en: "Save news" },
  "编辑管理员 / 重置密码": { ja: "管理者編集 / パスワードリセット", zh: "编辑管理员 / 重置密码", en: "Edit admin / reset password" },
  "启用管理员": { ja: "管理者を有効化", zh: "启用管理员", en: "Enable admin" },
  "禁用管理员": { ja: "管理者を無効化", zh: "禁用管理员", en: "Disable admin" },
  "生成 TOTP 密钥": { ja: "TOTP キー生成", zh: "生成 TOTP 密钥", en: "Generate TOTP secret" },
  "启用 TOTP": { ja: "TOTP 有効化", zh: "启用 TOTP", en: "Enable TOTP" },
  "启用 TOTP 失败": { ja: "TOTP 有効化失敗", zh: "启用 TOTP 失败", en: "TOTP enable failed" },
  "关闭 TOTP 失败": { ja: "TOTP 無効化失敗", zh: "关闭 TOTP 失败", en: "TOTP disable failed" },
  "重置 TOTP 备用码": { ja: "TOTP バックアップコードをリセット", zh: "重置 TOTP 备用码", en: "Reset TOTP backup codes" },
  "新增媒体": { ja: "メディア追加", zh: "新增媒体", en: "New media" },
  "上传媒体": { ja: "メディアアップロード", zh: "上传媒体", en: "Media uploaded" },
  "替换媒体保持 URL": { ja: "URL 維持でメディア差し替え", zh: "替换媒体保持 URL", en: "Replace media keeping URL" },
  "清理未使用媒体": { ja: "未使用メディア削除", zh: "清理未使用媒体", en: "Clean unused media" },
  "保存 SEO 配置": { ja: "SEO 設定を保存", zh: "保存 SEO 配置", en: "Save SEO settings" },
  "更新鉴定申请": { ja: "鑑定申請を更新", zh: "更新鉴定申请", en: "Update appraisal request" },
  "更新联系留言": { ja: "お問い合わせを更新", zh: "更新联系留言", en: "Update contact message" },
  "批量更新藏品": { ja: "蔵品を一括更新", zh: "批量更新藏品", en: "Bulk update items" },
  "复制藏品": { ja: "蔵品をコピー", zh: "复制藏品", en: "Duplicate item" }
};

export function adminText(value: AdminText, locale: AdminLocale) {
  if (typeof value !== "string") {
    return value[locale] || value.zh || value.ja || value.en || "";
  }

  return adminStringMap[value]?.[locale] || value;
}
