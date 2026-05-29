# 玉林軒株式会社 网站设计与功能规格书

版本：v1.1  
项目：日本骨董古美术网站「玉林軒株式会社」  
语言：日文（默认）/ 中文 / 英文  
主色：金色 `#B08D57`  
设计方向：日系高端、留白充足、古美术画廊感、低饱和象牙白背景、金线细节、高清器物摄影

---

## 1. 项目目标

建设一个完整的三语古美术企业网站，面向日本本地客户、中文藏家及海外买家。网站需要同时承担品牌展示、藏品介绍、鉴定收购咨询、资讯发布、博客内容沉淀和线索收集功能。

后台必须支持非技术人员在线维护所有文字、图片、藏品、分类、博客、资讯、SEO、表单申请和站点基础信息。

参考站点 `okasen.co.jp` 的功能结构：藏品介绍、鉴定收购、鉴定士博客、购买方法、常见问题、联系方式等。首页视觉参考用户提供截图：首屏左右分栏、金色统计条、藏品分类拼贴、新入荷特选大图、鉴定入口、新闻列表、关于区块、地图与深色页脚。

---

## 2. 设计系统

### 2.1 色彩

| 变量 | 色值 | 用途 |
|---|---:|---|
| `--gold` | `#B08D57` | 主色、按钮、细线、数字、强调 |
| `--gold-light` | `#CDB07A` | Hover、浅金背景 |
| `--gold-dark` | `#8A6D3F` | Active、深色金 |
| `--ink` | `#1A1A1A` | 标题、正文主色 |
| `--muted` | `#5C564E` | 次级文字 |
| `--ivory` | `#F9F5EE` | 主背景 |
| `--ivory-dark` | `#EDE8DE` | 分区背景 |
| `--paper` | `#FFFDF8` | 内容底色 |
| `--wood` | `#2C2416` | 深色统计条、页脚 |
| `--border` | `#D4C9B0` | 细边框 |
| `--red-seal` | `#8F2E24` | 印章装饰 |

### 2.2 字体

| 场景 | 日文 | 中文 | 英文 |
|---|---|---|---|
| 大标题 | Noto Serif JP | Noto Serif SC | Cormorant Garamond |
| 正文 | Noto Sans JP | Noto Sans SC | EB Garamond / Inter |
| 数字年份 | Cormorant Garamond Italic | Cormorant Garamond Italic | Cormorant Garamond Italic |

### 2.3 版式

- 最大内容宽度：`1200px`
- 基础间距：`8px`
- 桌面章节上下间距：`80px`
- 移动端章节上下间距：`48px`
- 卡片圆角：`4px`
- 按钮圆角：`2px`
- 图片比例：藏品卡片 `4:5`，横幅 `16:9`，首页拼贴按设计固定比例
- 装饰：细金线、和纸纹理、朱红印章、水平方向低速淡入动画

---

## 3. 网站所有页面列表

### 3.1 前台页面

| 编号 | 路径 | 页面名（日/中/英） | 说明 |
|---|---|---|---|
| P01 | `/` 或 `/ja/` | トップページ / 首页 / Home | 品牌首页 |
| P02 | `/collection/` | 蔵品紹介 / 藏品介绍 / Collection | 全部藏品列表 |
| P03 | `/collection/[category]/` | カテゴリ一覧 / 分类列表 / Category | 分类藏品列表 |
| P04 | `/item/[slug]/` | 商品詳細 / 藏品详情 / Item Detail | 单件藏品详情 |
| P05 | `/new-arrivals/` | 新入荷・特選品 / 新入荷・精选 / New Arrivals | 新品与精选 |
| P06 | `/appraisal/` | 鑑定・買取 / 鉴定・收购 / Appraisal & Purchase | 鉴定收购说明 |
| P07 | `/appraisal/form/` | 鑑定申込 / 鉴定申请 / Appraisal Form | 申请表单 |
| P08 | `/purchase-guide/` | ご購入方法 / 购买方法 / Purchase Guide | 购买流程 |
| P09 | `/faq/` | よくある質問 / 常见问题 / FAQ | 常见问题 |
| P10 | `/blog/` | 鑑定士ブログ / 鉴定师博客 / Blog | 博客列表 |
| P11 | `/blog/[slug]/` | ブログ詳細 / 博客详情 / Blog Post | 博客详情 |
| P12 | `/news/` | 新着情報 / 最新资讯 / News | 资讯列表 |
| P13 | `/news/[slug]/` | お知らせ詳細 / 资讯详情 / News Detail | 资讯详情 |
| P14 | `/about/` | 玉林軒について / 关于我们 / About | 公司介绍 |
| P15 | `/contact/` | お問い合わせ / 联系我们 / Contact | 联系表单 |
| P16 | `/access/` | アクセス / 交通指引 / Access | 地址地图 |
| P17 | `/privacy/` | プライバシーポリシー / 隐私政策 / Privacy Policy | 隐私政策 |
| P18 | `/sitemap/` | サイトマップ / 网站地图 / Sitemap | 网站地图 |

### 3.2 后台页面

| 编号 | 路径 | 功能 |
|---|---|---|
| A01 | `/admin/login` | 后台登录 |
| A02 | `/admin` | 控制台总览 |
| A03 | `/admin/items` | 藏品管理 |
| A04 | `/admin/items/new` | 新增藏品 |
| A05 | `/admin/items/[id]/edit` | 编辑藏品 |
| A06 | `/admin/categories` | 分类管理 |
| A07 | `/admin/blog` | 博客管理 |
| A08 | `/admin/news` | 资讯管理 |
| A09 | `/admin/appraisals` | 鉴定申请管理 |
| A10 | `/admin/contacts` | 联系表单管理 |
| A11 | `/admin/pages` | 首页/关于/鉴定等页面模块编辑 |
| A12 | `/admin/media` | 媒体库 |
| A13 | `/admin/seo` | SEO 管理 |
| A14 | `/admin/settings` | 站点设置 |
| A15 | `/admin/users` | 管理员用户与权限 |
| A16 | `/admin/audit-logs` | 操作日志 |

---

## 4. 页面内容与设计要求

### P01 首页

首页采用截图风格：首屏左文右图，浅象牙白背景，主视觉为真实店铺或藏品照片。整体避免电商感，更接近高端古美术画廊。

区块顺序：

1. 顶部导航
2. Hero 英雄区
3. 金色/深木色统计条
4. 蔵品紹介分类拼贴
5. 新入荷・特選品大图模块
6. 鑑定・買取三入口
7. 购买/博客/免费咨询横向入口
8. 新着情報列表
9. 关于玉林軒
10. 店铺信息与地图
11. 页脚

导航要求：

- 左侧 Logo：`玉林軒` + `GYOKURINKEN`
- 中间菜单：藏品介绍、新入荷・特選品、鉴定・收购、博客、资讯、关于、联系
- 右侧：语言切换 `JA / ZH / EN` 和联系按钮
- 滚动后固定顶部，背景变为 `rgba(249,245,238,.97)`，底部出现金线
- 移动端变为汉堡菜单，全屏覆盖层菜单

Hero 要求：

- 桌面：左 45% 文案，右 55% 图片
- 标题：
  - JA：古の美を、未来へ紡ぐ。
  - ZH：传承古典之美，编织未来。
  - EN：Bridging the Beauty of the Past to the Future.
- CTA：藏品を見る / 查看藏品 / View Collection
- 背景图、标题、副标题、CTA 文案均后台可编辑
- 图片可叠加小金牌显示创立年份或代表信息

统计条：

- 4-5 个指标，后台可维护
- 示例：創業年数、取扱実績、鑑定方法、相談無料、全国対応
- 数字用大号衬线字体，单位小字，金色强调

藏品介绍：

- 标题：蔵品紹介
- 桌面采用 1 大图 + 4 小图拼贴
- 分类初始值：日本美術、朝鮮美術、中国美術、箪笥・家具、工芸品、新入荷・特選品
- 卡片包含图片、分类名、简短副标题、链接
- Hover：图片轻微放大，金色下划线出现

新入荷・特選品：

- 左侧大横幅图带标题叠字
- 右侧展示 2-3 件重点藏品
- 每件包含：图片、品名、时代、短描述、价格或询价状态
- 入口：もっと見る

鑑定・買取入口：

- 三列：店頭鑑定、出張鑑定、写真鑑定
- 每列图片或线性图标、说明、申请按钮
- 附加入口：购买方法、鉴定士博客、免费咨询

新着情報：

- 最新 5 条，左右两列或列表
- 每条显示日期、类型、标题
- 类型包括：お知らせ、ブログ、新入荷、イベント

关于玉林軒：

- 左侧代表藏品图片，右侧品牌说明
- 显示成立年份、经营理念、古物商许可、所属组织
- 按钮：詳しくはこちら

店铺信息与地图：

- 公司名、地址、电话、营业时间
- Google Maps 嵌入
- 移动端提供拨号按钮和地图 App 打开按钮

### P02/P03 藏品列表与分类页

- 顶部为小型页面 Banner：标题、英文副标题、面包屑
- 分类筛选：全部、日本美術、朝鮮美術、中国美術、箪笥・家具、工芸品、新入荷・特選品
- 筛选条件：时代、产地、价格区间、是否新入荷、是否特选、排序
- 桌面 3 列网格，平板 2 列，手机 2 列
- 卡片展示：主图、品名、时代、产地、标签、价格状态
- 支持分页，默认每页 12 件
- 空状态显示优雅提示和返回分类入口

### P04 藏品详情页

- 左侧图片画廊，支持缩略图、全屏放大、左右切换
- 右侧信息：
  - 品名
  - 分类、时代、产地、作家、尺寸、重量、状态
  - 价格显示：显示价格 / 询价 / 隐藏
  - 富文本说明
  - CTA：お問い合わせ、鑑定を依頼
- 下方：详细说明、注意事项、相关藏品
- 分享：LINE、X、Facebook、复制链接、微信二维码
- SEO 使用 Product JSON-LD

### P05 新入荷・特選品

- 列表只显示 `is_new=true` 或 `is_featured=true` 的藏品
- 顶部可放一件主推藏品大图
- 支持按新入荷、特选、分类筛选
- 后台可设置排序权重

### P06 鑑定・買取

- Hero：古美术器物或店内陈列大图
- 核心文案：骨董品・古美術品の鑑定・買取
- 服务类型：
  - 店頭鑑定
  - 出張鑑定
  - 写真鑑定
  - 電話相談
- 買取品目：陶磁器、掛軸、屏風、茶道具、絵画、古書画、鉄瓶、銀瓶、金工、彫刻、仏像、蒔絵、人形、時計等
- 三大优势：信赖、实绩、高价/适正评估
- 流程：咨询 → 初步确认 → 鉴定 → 报价 → 成交/返还
- 注意事项使用手风琴组件
- 主 CTA：鑑定を申し込む

### P07 鉴定申请表单

字段：

- 姓名（必填）
- 邮箱（必填）
- 电话
- 申请类型：店头、出张、照片、电话咨询
- 所在地区
- 物品类别
- 物品说明
- 期望日期
- 图片上传，最多 5 张，每张不超过 5MB，支持 JPG/PNG/HEIC
- 隐私政策同意（必填）

提交后：

- 前后端验证
- 自动生成申请编号
- 发送用户确认邮件
- 发送管理员通知邮件
- 跳转感谢页

### P08 购买方法

- 购买流程：咨询 → 确认状态 → 支付 → 配送/店头取货
- 支付方式：银行转账、信用卡、现金、其他可配置方式
- 配送说明：国内配送、海外配送、保险、包装方式
- 返品・キャンセルポリシー
- 常见问题入口

### P09 FAQ

- 分类：购买、鉴定、配送、支付、海外客户、藏品状态
- 手风琴组件
- 后台可新增、编辑、排序、设置语言内容

### P10/P11 博客

- 列表：首页式首篇置顶，其余左图右文
- 分类：鑑定コラム、新入荷情報、展覧会・イベント、日々のこと
- 支持归档月份、标签、搜索
- 详情页支持富文本、图片、引用、小标题、相关文章
- SEO 使用 BlogPosting JSON-LD

### P12/P13 新闻

- 列表显示日期、类型、标题
- 类型：お知らせ、新入荷、イベント、休業案内
- 详情为简洁富文本
- 支持定时发布

### P14 关于我们

- 品牌故事
- 代表者挨拶
- 年表 Timeline
- 店铺/展厅照片
- 古物商许可
- 所属组织
- 经营理念

### P15 联系我们

- 表单字段：姓名、邮箱、电话、问题分类、内容、隐私同意
- 侧边显示地址、电话、邮箱、营业时间
- Google Maps
- 提交后邮件通知与后台留存

### P16 Access

- 地址、交通方式、停车信息
- 地图嵌入
- 移动端地图 App 跳转

---

## 5. 管理后台功能列表

### 5.1 通用后台要求

- 后台所有内容支持 JA / ZH / EN 三语言 Tab
- 所有图片可上传、替换、排序、删除
- 所有列表支持搜索、筛选、分页
- 所有删除默认软删除
- 重要操作写入操作日志
- 支持草稿、预览、发布、定时发布

### 5.2 Dashboard

- 今日鉴定申请数
- 今日联系表单数
- 待处理申请数
- 藏品总数、已发布数、草稿数
- 最近申请、最近留言、最近发布内容
- Google Analytics 基础访问数据

### 5.3 藏品管理

功能：

- 新增、编辑、删除、复制藏品
- 批量上下架
- 批量修改分类
- 拖拽排序
- 图片上传、压缩、WebP 生成
- 设置新入荷、特选、推荐到首页
- 设置价格显示方式

字段：

- 多语言：名称、描述、时代、产地、状态说明、SEO
- 基本：slug、分类、标签、作家、尺寸、重量、数量
- 价格：价格、币种、显示/询价/隐藏
- 状态：草稿、发布、归档
- 图片：主图、附图、alt 文本

### 5.4 分类管理

- 分类名称三语
- slug
- 父级分类，最多二级
- 分类封面图
- 首页展示开关
- 排序

### 5.5 博客与资讯管理

- 富文本编辑器
- 封面图
- 分类、标签
- 摘要
- 定时发布
- 预览
- SEO 设置

### 5.6 静态页面模块编辑

可编辑内容：

- 首页 Hero
- 首页统计条
- 首页藏品分类模块
- 首页新入荷模块
- 首页鉴定入口
- 首页关于区块
- 关于页面
- 鉴定页面
- 购买方法
- FAQ
- Footer
- 导航菜单显示文字

### 5.7 媒体库

- 上传图片/文件
- 自动生成缩略图和 WebP
- 搜索、筛选、按日期归档
- 查看引用位置
- 替换图片并保持 URL
- 批量删除未使用文件

### 5.8 鉴定申请管理

- 状态：未读、处理中、已回复、已完成、不采用
- 查看申请详情与图片
- 管理员备注
- 邮件模板回复
- 导出 CSV
- 防垃圾提交标记

### 5.9 联系表单管理

- 状态：未读、处理中、已回复、归档
- 分类筛选
- 邮件回复
- 导出 CSV

### 5.10 SEO 管理

- 每页 Meta Title / Description / Keywords
- OGP 图片
- Canonical URL
- Sitemap 生成
- robots.txt 设置
- 重定向管理

### 5.11 用户与权限

角色：

- `super_admin`：全部权限
- `admin`：内容与申请管理
- `editor`：内容编辑，不可管理用户与系统设置
- `viewer`：只读

安全：

- 强密码
- TOTP 二步验证
- 登录失败锁定
- Session 过期
- 操作日志

---

## 6. 数据库表结构

数据库建议：PostgreSQL + Prisma。多语言字段使用 JSONB：

```json
{
  "ja": "日本美術",
  "zh": "日本美术",
  "en": "Japanese Art"
}
```

### 6.1 `items`

```sql
CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name JSONB NOT NULL,
  description JSONB,
  era JSONB,
  origin JSONB,
  artist VARCHAR(255),
  dimensions VARCHAR(255),
  weight VARCHAR(100),
  condition JSONB,
  price DECIMAL(12,0),
  currency VARCHAR(3) DEFAULT 'JPY',
  price_display VARCHAR(20) DEFAULT 'inquiry',
  category_id BIGINT REFERENCES categories(id),
  status VARCHAR(20) DEFAULT 'draft',
  is_new BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  show_on_home BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  meta_title JSONB,
  meta_description JSONB,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
```

### 6.2 `item_images`

```sql
CREATE TABLE item_images (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT REFERENCES items(id) ON DELETE CASCADE,
  media_id BIGINT REFERENCES media(id),
  url TEXT NOT NULL,
  url_webp TEXT,
  url_thumb TEXT,
  alt_text JSONB,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.3 `categories`

```sql
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name JSONB NOT NULL,
  description JSONB,
  parent_id BIGINT REFERENCES categories(id),
  cover_media_id BIGINT REFERENCES media(id),
  is_active BOOLEAN DEFAULT TRUE,
  show_on_home BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.4 `tags` 与 `item_tag_relations`

```sql
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name JSONB NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE item_tag_relations (
  item_id BIGINT REFERENCES items(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, tag_id)
);
```

### 6.5 `blog_posts`

```sql
CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title JSONB NOT NULL,
  excerpt JSONB,
  content JSONB,
  cover_media_id BIGINT REFERENCES media(id),
  author_id BIGINT REFERENCES admin_users(id),
  category VARCHAR(100),
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  meta_title JSONB,
  meta_description JSONB,
  og_image TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.6 `news`

```sql
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title JSONB NOT NULL,
  content JSONB,
  type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  meta_title JSONB,
  meta_description JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.7 `appraisal_requests`

```sql
CREATE TABLE appraisal_requests (
  id BIGSERIAL PRIMARY KEY,
  request_no VARCHAR(32) UNIQUE NOT NULL,
  type VARCHAR(30) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(40),
  region VARCHAR(100),
  item_category VARCHAR(100),
  description TEXT,
  preferred_date DATE,
  images TEXT[],
  status VARCHAR(20) DEFAULT 'unread',
  admin_note TEXT,
  lang VARCHAR(5) DEFAULT 'ja',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.8 `contact_messages`

```sql
CREATE TABLE contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(40),
  category VARCHAR(50),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread',
  lang VARCHAR(5) DEFAULT 'ja',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.9 `page_blocks`

```sql
CREATE TABLE page_blocks (
  id BIGSERIAL PRIMARY KEY,
  page_key VARCHAR(100) NOT NULL,
  block_key VARCHAR(100) NOT NULL,
  content JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (page_key, block_key)
);
```

### 6.10 `media`

```sql
CREATE TABLE media (
  id BIGSERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  url TEXT NOT NULL,
  url_webp TEXT,
  url_thumb TEXT,
  mime_type VARCHAR(100),
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  alt_text JSONB,
  uploaded_by BIGINT REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.11 `admin_users`

```sql
CREATE TABLE admin_users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(100),
  role VARCHAR(30) DEFAULT 'editor',
  avatar TEXT,
  totp_secret TEXT,
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.12 `site_settings`

```sql
CREATE TABLE site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.13 `audit_logs`

```sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_user_id BIGINT REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(100),
  target_id VARCHAR(100),
  before_data JSONB,
  after_data JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. 多语言要求

推荐 URL：

```txt
/ja/
/zh/
/en/
/ja/item/edo-imari-plate-001/
/zh/item/edo-imari-plate-001/
/en/item/edo-imari-plate-001/
```

规则：

- 默认语言为日文
- 用户切换语言后写入 Cookie
- 内容缺失时回退到日文
- 固定 UI 文案放入 locale 文件
- 用户生成表单记录提交语言
- 每个语言版本输出独立 canonical 与 hreflang

---

## 8. SEO 要求

### 8.1 基础 SEO

- 每页必须有唯一 `title` 和 `description`
- 商品、博客、资讯可在后台单独设置 SEO
- 未填写时自动根据标题和摘要生成
- URL slug 使用英文小写连字符
- 自动生成 canonical

### 8.2 多语言 SEO

每个公开页面输出：

```html
<link rel="alternate" hreflang="ja" href="https://example.com/ja/...">
<link rel="alternate" hreflang="zh" href="https://example.com/zh/...">
<link rel="alternate" hreflang="en" href="https://example.com/en/...">
<link rel="alternate" hreflang="x-default" href="https://example.com/ja/...">
```

### 8.3 OGP

- `og:title`
- `og:description`
- `og:image`，建议 `1200x630`
- `og:type`
- `twitter:card=summary_large_image`

### 8.4 结构化数据

- 首页：`AntiquesStore` / `LocalBusiness`
- 藏品详情：`Product`
- 博客详情：`BlogPosting`
- 公司页：`Organization`
- 面包屑：`BreadcrumbList`

### 8.5 Sitemap / Robots

- 自动生成 `/sitemap.xml`
- 包含所有公开页面及三语版本
- `/robots.txt` 禁止 `/admin`
- 可后台设置 noindex 页面

### 8.6 性能 SEO

- LCP < 2.5s
- CLS < 0.1
- 图片使用 WebP/AVIF，提供 JPEG fallback
- 首屏图片优先加载，其他图片 lazy load
- 字体 `font-display: swap`
- 静态页面使用 ISR 或缓存

---

## 9. 移动端适配要求

### 9.1 断点

| 名称 | 宽度 |
|---|---:|
| `xs` | `<480px` |
| `sm` | `480-767px` |
| `md` | `768-1023px` |
| `lg` | `1024-1279px` |
| `xl` | `>=1280px` |

### 9.2 导航

- 手机端使用汉堡菜单
- 展开后为全屏菜单
- 菜单底部显示语言切换和联系方式
- 固定底部快捷联系栏：电话、LINE、邮件

### 9.3 布局

| 区域 | 桌面 | 移动端 |
|---|---|---|
| Hero | 左文右图 | 上文下图 |
| 藏品拼贴 | 1 大 + 多小 | 双列卡片 |
| 藏品列表 | 3 列 | 2 列 |
| 商品详情 | 左图库右信息 | 上图库下信息 |
| 鉴定服务 | 3 列 | 单列 |
| 博客列表 | 左图右文 | 单列 |
| 筛选器 | 侧边栏 | 底部抽屉 |

### 9.4 触控

- 点击区域最小 `44px`
- 表单字号不小于 `16px`
- 图片画廊支持滑动
- 上传图片支持手机相机
- 地图支持跳转 Google Maps / Apple Maps

---

## 10. 技术建议

推荐：

- Next.js 14+ App Router
- TypeScript
- Tailwind CSS + CSS Variables
- PostgreSQL
- Prisma
- NextAuth/Auth.js
- TipTap 富文本
- Cloudflare R2 或 S3 图片存储
- Sharp 图片处理
- Resend / AWS SES 邮件
- Vercel + Neon/Supabase

---

## 11. 初始分类

```txt
日本美術
  - 陶磁器
  - 絵画・浮世絵
  - 掛軸・書
  - 仏教美術
  - 甲冑・刀剣
  - 茶道具

朝鮮美術
  - 高麗青磁
  - 李朝白磁

中国美術
  - 中国陶磁
  - 翡翠・玉器
  - 書画

箪笥・家具

工芸品
  - 漆器
  - 金工品
  - ガラス工芸

新入荷・特選品
```

---

## 12. 验收标准

- 前台所有页面具备 JA/ZH/EN 三语切换
- 后台可在线修改所有页面文案、图片、藏品、博客、新闻、SEO
- 表单提交有前后端校验、邮件通知、后台记录
- 移动端无横向滚动、无文字溢出、图片比例稳定
- 首页视觉接近参考截图的高端日系古美术风格
- SEO 基础标签、hreflang、sitemap、结构化数据完整
- 后台权限、登录安全、上传安全、操作日志完整
