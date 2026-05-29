import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const envPath = resolve(process.cwd(), ".env");

if (existsSync(envPath)) {
  const envText = readFileSync(envPath, "utf8");
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) {
      continue;
    }
    process.env[match[1]] = match[2].replace(/^"|"$/g, "");
  }
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed page_blocks.");
}

const image = {
  hero: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1400&q=85",
  nihon: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=85",
  korean: "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=700&q=85",
  chinese: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=700&q=85",
  furniture: "https://images.unsplash.com/photo-1615800002234-05c4d488696c?auto=format&fit=crop&w=700&q=85",
  craft: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=700&q=85",
  arrival: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=1200&q=85",
  vessel: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=700&q=85",
  scroll: "https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&w=700&q=85",
  bronze: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=700&q=85",
  appraisalStore: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=85",
  appraisalVisit: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=85",
  appraisalPhoto: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=800&q=85",
  about: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1000&q=85"
};

const home = {
  hero: {
    ja: { eyebrow: "GYOKURINKEN CO., LTD.", title: "古の美を、未来へ紡ぐ。", lead: "日本・中国・朝鮮の古美術を中心に、鑑定、買取、販売まで一貫して承ります。静かな眼差しで、器物に宿る時間と物語を次代へ届けます。", cta: "蔵品を見る", secondary: "鑑定を相談", badge: "古美術商として培った審美眼", image: image.hero },
    zh: { eyebrow: "GYOKURINKEN CO., LTD.", title: "传承古典之美，编织未来。", lead: "以日本、中国、朝鲜古美术为中心，提供鉴定、收购与销售服务。我们以安静而准确的眼光，将器物承载的时间与故事交给下一位藏家。", cta: "查看藏品", secondary: "咨询鉴定", badge: "源自古美术商的审美与经验", image: image.hero },
    en: { eyebrow: "GYOKURINKEN CO., LTD.", title: "Bridging the Beauty of the Past to the Future.", lead: "We curate, appraise, purchase, and present Japanese, Chinese, and Korean antiques with a quiet gallery sensibility and careful scholarship.", cta: "View Collection", secondary: "Request Appraisal", badge: "A discerning eye for antique art", image: image.hero }
  },
  stats: {
    ja: [{ value: "30+", label: "年の実務経験" }, { value: "5,000+", label: "取扱実績" }, { value: "3", label: "鑑定方法" }, { value: "無料", label: "初回相談" }, { value: "全国", label: "出張対応" }],
    zh: [{ value: "30+", label: "年实务经验" }, { value: "5,000+", label: "经手实绩" }, { value: "3", label: "鉴定方式" }, { value: "免费", label: "初次咨询" }, { value: "全国", label: "出张对应" }],
    en: [{ value: "30+", label: "Years Experience" }, { value: "5,000+", label: "Handled Works" }, { value: "3", label: "Appraisal Methods" }, { value: "Free", label: "Initial Consultation" }, { value: "Japan", label: "Nationwide Visits" }]
  },
  sections: {
    ja: { collection: { eyebrow: "COLLECTION", title: "蔵品紹介", lead: "陶磁器、書画、工芸、家具まで、余白と品格を大切に選び抜いた古美術をご覧いただけます。", action: "分類を見る" }, arrivals: { eyebrow: "NEW ARRIVALS", title: "新入荷・特選品", lead: "近時入荷した器物と、玉林軒が特におすすめする一品を紹介します。", action: "もっと見る" }, appraisal: { eyebrow: "APPRAISAL", title: "鑑定・買取", lead: "店頭、出張、写真鑑定から状況に合わせてお選びください。売却前のご相談も承ります。" }, journal: { eyebrow: "JOURNAL", title: "ブログ・新着情報", action: "一覧へ" }, about: { eyebrow: "ABOUT", title: "玉林軒について", action: "詳しくはこちら" }, access: { eyebrow: "ACCESS", title: "店舗情報", action: "Google Maps" } },
    zh: { collection: { eyebrow: "COLLECTION", title: "藏品介绍", lead: "从陶瓷、书画、工艺到家具，以留白与品格为线索呈现精选古美术。", action: "查看分类" }, arrivals: { eyebrow: "NEW ARRIVALS", title: "新入荷・精选", lead: "介绍近期入荷器物，以及玉林軒特别推荐的重点藏品。", action: "查看更多" }, appraisal: { eyebrow: "APPRAISAL", title: "鉴定・收购", lead: "可选择店头、出张或照片鉴定。出售前的初步咨询也欢迎联系。" }, journal: { eyebrow: "JOURNAL", title: "博客 / 最新资讯", action: "查看列表" }, about: { eyebrow: "ABOUT", title: "关于玉林軒", action: "了解更多" }, access: { eyebrow: "ACCESS", title: "店铺信息", action: "Google Maps" } },
    en: { collection: { eyebrow: "COLLECTION", title: "Collection", lead: "Ceramics, paintings, craft, and furniture selected for presence, condition, and quiet dignity.", action: "Browse Categories" }, arrivals: { eyebrow: "NEW ARRIVALS", title: "New Arrivals & Featured Works", lead: "Recently acquired pieces and works specially recommended by Gyokurinken.", action: "View More" }, appraisal: { eyebrow: "APPRAISAL", title: "Appraisal & Purchase", lead: "Choose an in-store, on-site, or photo appraisal. Early consultation before selling is welcome." }, journal: { eyebrow: "JOURNAL", title: "Journal & News", action: "View All" }, about: { eyebrow: "ABOUT", title: "About Gyokurinken", action: "Read More" }, access: { eyebrow: "ACCESS", title: "Shop Information", action: "Google Maps" } }
  },
  categories: {
    ja: [{ name: "日本美術", subtitle: "茶道具、掛軸、仏教美術", image: image.nihon, large: true }, { name: "朝鮮美術", subtitle: "高麗青磁、李朝白磁", image: image.korean }, { name: "中国美術", subtitle: "陶磁、玉器、書画", image: image.chinese }, { name: "箪笥・家具", subtitle: "時代箪笥、木工芸", image: image.furniture }, { name: "工芸品", subtitle: "漆器、金工、硝子", image: image.craft }],
    zh: [{ name: "日本美术", subtitle: "茶道具、挂轴、佛教美术", image: image.nihon, large: true }, { name: "朝鲜美术", subtitle: "高丽青瓷、李朝白瓷", image: image.korean }, { name: "中国美术", subtitle: "陶瓷、玉器、书画", image: image.chinese }, { name: "箪笥・家具", subtitle: "时代家具、木工艺", image: image.furniture }, { name: "工艺品", subtitle: "漆器、金工、玻璃", image: image.craft }],
    en: [{ name: "Japanese Art", subtitle: "Tea wares, scrolls, Buddhist art", image: image.nihon, large: true }, { name: "Korean Art", subtitle: "Goryeo celadon, Joseon white porcelain", image: image.korean }, { name: "Chinese Art", subtitle: "Ceramics, jade, painting", image: image.chinese }, { name: "Furniture", subtitle: "Period chests and wood craft", image: image.furniture }, { name: "Craft Works", subtitle: "Lacquer, metal, glass", image: image.craft }]
  },
  arrivals: {
    ja: { feature: { title: "李朝白磁壺", subtitle: "端正な姿と柔らかな白を湛えた、静謐な一品。", tag: "今月の特選", image: image.arrival }, items: [{ name: "古伊万里 染付皿", era: "江戸後期", text: "余白の美しい藍が映える器。", status: "価格応相談", image: image.vessel }, { name: "山水図 掛軸", era: "明治期", text: "軽やかな筆致と保存状態の良さ。", status: "販売中", image: image.scroll }, { name: "銅花入", era: "昭和初期", text: "茶席にも合う落ち着いた肌合い。", status: "新入荷", image: image.bronze }] },
    zh: { feature: { title: "李朝白瓷壶", subtitle: "姿态端正、白色温润的静谧一品。", tag: "本月精选", image: image.arrival }, items: [{ name: "古伊万里 染付盘", era: "江户后期", text: "蓝白留白清雅。", status: "价格咨询", image: image.vessel }, { name: "山水图 挂轴", era: "明治期", text: "笔致轻盈，保存状态良好。", status: "销售中", image: image.scroll }, { name: "铜花入", era: "昭和初期", text: "肌理沉稳，也适合茶席。", status: "新入荷", image: image.bronze }] },
    en: { feature: { title: "Joseon White Porcelain Jar", subtitle: "A tranquil work with poised form and soft white glaze.", tag: "Featured This Month", image: image.arrival }, items: [{ name: "Ko-Imari Blue-and-White Dish", era: "Late Edo", text: "Elegant cobalt with generous quiet space.", status: "Price on Request", image: image.vessel }, { name: "Landscape Hanging Scroll", era: "Meiji", text: "Light brushwork in fine condition.", status: "Available", image: image.scroll }, { name: "Bronze Flower Vessel", era: "Early Showa", text: "A calm surface suited for tea settings.", status: "New Arrival", image: image.bronze }] }
  },
  appraisal: {
    ja: [{ title: "店頭鑑定", text: "実物を拝見し、状態や来歴を丁寧に確認します。", action: "来店予約", icon: "store", image: image.appraisalStore }, { title: "出張鑑定", text: "大型家具や点数が多い場合もご相談ください。", action: "出張相談", icon: "map", image: image.appraisalVisit }, { title: "写真鑑定", text: "まずは写真から、おおよその見立てをお伝えします。", action: "写真を送る", icon: "camera", image: image.appraisalPhoto }],
    zh: [{ title: "店头鉴定", text: "查看实物，确认状态、来历与市场价值。", action: "预约来店", icon: "store", image: image.appraisalStore }, { title: "出张鉴定", text: "大型家具或数量较多时，可咨询上门鉴定。", action: "咨询出张", icon: "map", image: image.appraisalVisit }, { title: "照片鉴定", text: "先通过照片进行初步判断。", action: "发送照片", icon: "camera", image: image.appraisalPhoto }],
    en: [{ title: "In-store Appraisal", text: "We examine the work, condition, and provenance in person.", action: "Book Visit", icon: "store", image: image.appraisalStore }, { title: "On-site Appraisal", text: "For large furniture or multiple works, we can visit you.", action: "Ask Visit", icon: "map", image: image.appraisalVisit }, { title: "Photo Appraisal", text: "Send photos for a preliminary assessment.", action: "Send Photos", icon: "camera", image: image.appraisalPhoto }]
  },
  quick_links: {
    ja: [{ title: "ご購入方法", text: "お支払い、配送、返品について。", href: "/purchase-guide" }, { title: "鑑定士ブログ", text: "器物の見方や市場の話題。", href: "/blog" }, { title: "無料相談", text: "売却前の小さな疑問にも。", href: "/contact" }],
    zh: [{ title: "购买方法", text: "支付、配送、退换说明。", href: "/purchase-guide" }, { title: "鉴定师博客", text: "器物知识与市场观察。", href: "/blog" }, { title: "免费咨询", text: "出售前的小问题也可联系。", href: "/contact" }],
    en: [{ title: "Purchase Guide", text: "Payment, delivery, and return policy.", href: "/purchase-guide" }, { title: "Appraiser Blog", text: "Notes on objects and the market.", href: "/blog" }, { title: "Free Consultation", text: "Ask before selling or buying.", href: "/contact" }]
  },
  about: {
    ja: { text: "玉林軒は、骨董・古美術に宿る時間の重なりを尊び、次の持ち主へ正しく橋渡しすることを大切にしています。鑑定から販売、買取まで、透明性ある説明と静かな展示体験を心がけています。", facts: ["古物商許可 京都府公安委員会 第611092430039号", "日本・中国・朝鮮美術を中心に取扱", "店頭鑑定、出張鑑定、写真鑑定に対応"], image: image.about },
    zh: { text: "玉林軒尊重骨董古美术中沉积的时间，并致力于将其准确交付给下一位藏家。从鉴定到销售、收购，我们重视透明说明与安静从容的观赏体验。", facts: ["古物商许可 京都府公安委员会 第 611092430039 号", "以日本、中国、朝鲜美术为中心", "支持店头、出张、照片鉴定"], image: image.about },
    en: { text: "Gyokurinken values the layered time held within antiques and fine art. Through clear explanation, careful appraisal, and a calm viewing experience, we connect works with their next keeper.", facts: ["Antique dealer license: Kyoto Prefectural Public Safety Commission No. 611092430039", "Focused on Japanese, Chinese, and Korean art", "In-store, on-site, and photo appraisal available"], image: image.about }
  }
};

const contact = {
  banner: {
    ja: { eyebrow: "CONTACT", title: "お問い合わせ", subtitle: "古美術品のご購入、鑑定、買取、来店予約について、わかる範囲で静かにお聞かせください。", breadcrumbHome: "ホーム" },
    zh: { eyebrow: "CONTACT", title: "联系我们", subtitle: "关于古美术品购买、鉴定、收购与预约来店，请在已知范围内告诉我们。", breadcrumbHome: "首页" },
    en: { eyebrow: "CONTACT", title: "Contact", subtitle: "Please tell us what you know about your purchase, appraisal, visit, or overseas shipping inquiry.", breadcrumbHome: "Home" }
  },
  info: {
    ja: { eyebrow: "SHOP INFORMATION", title: "店舗情報", lead: "掲載品の状態確認やご来店は、事前にお問い合わせいただくとスムーズです。", addressLabel: "住所", address: "京都府京都市伏見区深草下川原町130番地4 華信ビル201号", phoneLabel: "電話", phone: "お問い合わせフォームをご利用ください", emailLabel: "メール", email: "お問い合わせフォームをご利用ください", hoursLabel: "営業時間", hours: "11:00 - 18:00 / 水曜定休", accessLabel: "アクセス", access: "鑑定品や大型品をお持ち込みの場合は事前にご連絡ください。" },
    zh: { eyebrow: "SHOP INFORMATION", title: "店铺信息", lead: "如需确认藏品状态或来店查看，建议事前联系我们，以便妥善安排。", addressLabel: "地址", address: "京都府京都市伏见区深草下川原町130番地4 华信ビル201号", phoneLabel: "电话", phone: "请使用咨询表单联系", emailLabel: "邮箱", email: "请使用咨询表单联系", hoursLabel: "营业时间", hours: "11:00 - 18:00 / 周三定休", accessLabel: "访问说明", access: "如携带大型物品或鉴定品来店，请提前联系。" },
    en: { eyebrow: "SHOP INFORMATION", title: "Shop Information", lead: "For condition checks or in-store viewing, contacting us in advance helps us prepare properly.", addressLabel: "Address", address: "Kashin Building 201, 130-4 Fukakusa Shimogawaracho, Fushimi-ku, Kyoto-shi, Kyoto", phoneLabel: "Phone", phone: "Please use the inquiry form", emailLabel: "Email", email: "Please use the inquiry form", hoursLabel: "Hours", hours: "11:00 - 18:00 / Closed Wednesday", accessLabel: "Access", access: "Please contact us before bringing large works or appraisal items." }
  },
  map: {
    ja: { eyebrow: "MAP", title: "Google Maps", text: "所在地をもとに Google Maps を表示します。ご来店前に必ずご予約ください。", action: "Google Maps で開く" },
    zh: { eyebrow: "MAP", title: "Google Maps", text: "根据所在地显示 Google Maps。来店前请务必预约。", action: "在 Google Maps 打开" },
    en: { eyebrow: "MAP", title: "Google Maps", text: "Google Maps is shown from the office address. Please make an appointment before visiting.", action: "Open in Google Maps" }
  }
};

const accessContent = {
  ja: {
    seoTitle: "アクセス | 玉林軒株式会社",
    seoDescription: "玉林軒株式会社へのアクセス案内です。京都市伏見区の住所、交通、駐車場、営業時間、ご来店時の注意事項、Google Maps をご確認いただけます。",
    banner: { eyebrow: "ACCESS", title: "アクセス", subtitle: "ご来店、鑑定品のお持ち込み、大型品のご相談は、事前予約のうえお越しください。", breadcrumbHome: "ホーム" },
    overview: { eyebrow: "SHOP ACCESS", title: "京都市伏見区の事務所で、古美術をご案内します。", lead: "京都市伏見区の事務所へは、事前予約のうえお越しください。鑑定品や大型品をお持ち込みの場合は、事前に内容をお知らせください。", addressLabel: "住所", address: "京都府京都市伏見区深草下川原町130番地4 華信ビル201号", phoneLabel: "電話", phone: "お問い合わせフォームをご利用ください", hoursLabel: "営業時間", hours: "11:00 - 18:00", closedLabel: "定休日", closed: "水曜日 / 年末年始" },
    transport: { eyebrow: "ROUTE", title: "交通方式", lead: "ご来店は予約制です。最寄駅からの詳しい経路は、ご予約時に個別にご案内します。", routes: [{ title: "京都市営地下鉄・京阪沿線", text: "京都市伏見区深草下川原町の事務所まで、公共交通機関からの経路をご案内します。", time: "予約時に案内" }, { title: "京都駅方面から", text: "京都駅方面からお越しの場合は、来店時間に合わせて乗換と徒歩経路をご確認ください。", time: "予約時に案内" }, { title: "お車でお越しの場合", text: "近隣道路と駐車場状況を事前にご確認ください。大型品の搬入は必ず事前相談をお願いします。", time: "事前相談" }] },
    parking: { eyebrow: "PARKING", title: "駐車場について", text: "専用駐車場は現在未設定です。お車でお越しの場合は近隣の時間貸し駐車場をご利用ください。", items: ["大型品の搬入・搬出は事前にご相談ください。", "雨天時や高額品のお持ち込みは、到着時間をお知らせください。", "近隣道路での長時間停車はお控えください。"] },
    hours: { eyebrow: "HOURS", title: "営業時間", rows: [{ label: "月・火・木・金", value: "11:00 - 18:00" }, { label: "土・日・祝", value: "予約優先 / 11:00 - 17:00" }, { label: "水曜日", value: "定休日" }, { label: "鑑定品のお持ち込み", value: "事前予約制" }] },
    notes: { eyebrow: "VISIT NOTES", title: "ご来店時のお願い", items: [{ title: "来店予約", text: "店頭確認、商談、鑑定品のお持ち込みは、できるだけ事前にご予約ください。" }, { title: "鑑定品の持参", text: "箱、証書、付属品、入手経緯の資料がある場合は一緒にお持ちください。" }, { title: "撮影について", text: "店内および作品の撮影は、作品保護と権利確認のためスタッフにお声がけください。" }] },
    map: { eyebrow: "MAP", title: "Google Maps", text: "京都市伏見区の所在地をもとに Google Maps を表示します。ご来店前に必ずご予約ください。", staticLabel: "静的地図プレビュー", google: "Google Maps で開く", apple: "Apple Maps で開く", placeholder: "GYOKURINKEN / KYOTO" },
    cta: { title: "ご来店前に、作品名やご相談内容をお知らせください。", text: "店頭確認、鑑定品のお持ち込み、大型品の搬入は、準備のため事前連絡をおすすめします。", contact: "お問い合わせ", appraisal: "鑑定を申し込む" }
  },
  zh: {
    seoTitle: "交通指引 | 玉林軒株式会社",
    seoDescription: "玉林軒株式会社交通指引页面。可确认京都市伏见区地址、交通、停车信息、营业时间、来店注意事项与 Google Maps。",
    banner: { eyebrow: "ACCESS", title: "交通指引", subtitle: "来店、携带鉴定品或咨询大型物品时，建议提前预约后再前往。", breadcrumbHome: "首页" },
    overview: { eyebrow: "SHOP ACCESS", title: "在京都市伏见区事务所，为您介绍古美术。", lead: "到访京都市伏见区事务所前，请提前预约。如携带鉴定品或大型物品，请事先告知内容。", addressLabel: "地址", address: "京都府京都市伏见区深草下川原町130番地4 华信ビル201号", phoneLabel: "电话", phone: "请使用咨询表单联系", hoursLabel: "营业时间", hours: "11:00 - 18:00", closedLabel: "定休日", closed: "周三 / 年末年初" },
    transport: { eyebrow: "ROUTE", title: "交通方式", lead: "来店采取预约制。最近车站与步行路线会在预约时个别说明。", routes: [{ title: "京都市营地下铁・京阪沿线", text: "我们会说明前往京都市伏见区深草下川原町事务所的公共交通路线。", time: "预约时说明" }, { title: "从京都站方向", text: "从京都站方向来访时，请配合预约时间确认换乘与步行路线。", time: "预约时说明" }, { title: "驾车来访", text: "请提前确认附近道路和停车场情况。大型物品搬入请务必事前咨询。", time: "事前咨询" }] },
    parking: { eyebrow: "PARKING", title: "停车信息", text: "目前未设置专用停车场。如驾车来店，请使用附近的计时停车场。", items: ["大型物品搬入或搬出请提前咨询。", "雨天或携带高价物品来店时，请告知预计到达时间。", "请避免在附近道路长时间停车。"] },
    hours: { eyebrow: "HOURS", title: "营业时间", rows: [{ label: "周一・周二・周四・周五", value: "11:00 - 18:00" }, { label: "周六・周日・节假日", value: "预约优先 / 11:00 - 17:00" }, { label: "周三", value: "定休日" }, { label: "携带鉴定品来店", value: "需提前预约" }] },
    notes: { eyebrow: "VISIT NOTES", title: "来店注意事项", items: [{ title: "来店预约", text: "店头确认、商谈、携带鉴定品来店时，建议尽量提前预约。" }, { title: "鉴定品资料", text: "如有箱、证书、附件或取得经过资料，请一并携带。" }, { title: "拍摄说明", text: "店内及作品拍摄涉及作品保护与权利确认，请先咨询工作人员。" }] },
    map: { eyebrow: "MAP", title: "Google Maps", text: "根据京都市伏见区所在地显示 Google Maps。来店前请务必预约。", staticLabel: "静态地图预览", google: "在 Google Maps 打开", apple: "在 Apple Maps 打开", placeholder: "GYOKURINKEN / KYOTO" },
    cta: { title: "来店前，请先告知作品名或咨询内容。", text: "店头确认、携带鉴定品、大型物品搬入等事项，建议提前联系以便准备。", contact: "联系我们", appraisal: "提交鉴定申请" }
  },
  en: {
    seoTitle: "Access | Gyokurinken Co., Ltd.",
    seoDescription: "Access information for Gyokurinken, including the Fushimi-ku Kyoto address, directions, parking, opening hours, visit notes, and Google Maps.",
    banner: { eyebrow: "ACCESS", title: "Access", subtitle: "Please make an appointment before visiting, bringing appraisal items, or consulting about large works.", breadcrumbHome: "Home" },
    overview: { eyebrow: "SHOP ACCESS", title: "Antique art consultations at our Fushimi-ku, Kyoto office.", lead: "Please make an appointment before visiting our Fushimi-ku, Kyoto office, especially when bringing appraisal items or large works.", addressLabel: "Address", address: "Kashin Building 201, 130-4 Fukakusa Shimogawaracho, Fushimi-ku, Kyoto-shi, Kyoto", phoneLabel: "Phone", phone: "Please use the inquiry form", hoursLabel: "Hours", hours: "11:00 - 18:00", closedLabel: "Closed", closed: "Wednesday / Year-end holidays" },
    transport: { eyebrow: "ROUTE", title: "Directions", lead: "Visits are by appointment. Detailed routes from nearby rail lines are provided when your visit is arranged.", routes: [{ title: "Kyoto Subway and Keihan lines", text: "We will guide the public transit route to the Fukakusa Shimogawaracho office in Fushimi-ku, Kyoto.", time: "By appointment" }, { title: "From Kyoto Station", text: "Please confirm transfers and walking routes according to your appointment time.", time: "By appointment" }, { title: "By car", text: "Please check nearby roads and parking in advance. Large-item loading must be discussed before visiting.", time: "Consult first" }] },
    parking: { eyebrow: "PARKING", title: "Parking", text: "A dedicated parking area is not currently listed. If visiting by car, please use nearby coin-operated parking.", items: ["Please contact us in advance for loading or unloading large works.", "For rainy days or high-value items, please tell us your arrival time.", "Please avoid stopping for extended periods on nearby roads."] },
    hours: { eyebrow: "HOURS", title: "Opening Hours", rows: [{ label: "Mon, Tue, Thu, Fri", value: "11:00 - 18:00" }, { label: "Sat, Sun, Holidays", value: "Appointment priority / 11:00 - 17:00" }, { label: "Wednesday", value: "Closed" }, { label: "Appraisal item visits", value: "By appointment" }] },
    notes: { eyebrow: "VISIT NOTES", title: "Before Your Visit", items: [{ title: "Appointments", text: "Please book in advance when viewing works, discussing purchase, or bringing appraisal items." }, { title: "Appraisal Materials", text: "Please bring boxes, certificates, accessories, or background documents if available." }, { title: "Photography", text: "Please ask staff before photographing the shop or works for conservation and rights reasons." }] },
    map: { eyebrow: "MAP", title: "Google Maps", text: "Google Maps is shown from the Fushimi-ku, Kyoto office address. Please make an appointment before visiting.", staticLabel: "Static map preview", google: "Open in Google Maps", apple: "Open in Apple Maps", placeholder: "GYOKURINKEN / KYOTO" },
    cta: { title: "Please tell us the work name or purpose before visiting.", text: "Advance contact helps us prepare for viewing, appraisal items, and loading or unloading larger works.", contact: "Contact", appraisal: "Request Appraisal" }
  }
};

const blocks = [
  ["home", "hero", home.hero, 10],
  ["home", "stats", home.stats, 20],
  ["home", "sections", home.sections, 30],
  ["home", "categories", home.categories, 40],
  ["home", "arrivals", home.arrivals, 50],
  ["home", "appraisal", home.appraisal, 60],
  ["home", "quick_links", home.quick_links, 70],
  ["home", "about", home.about, 80],
  ["contact", "banner", contact.banner, 10],
  ["contact", "info", contact.info, 20],
  ["contact", "map", contact.map, 30],
  ["access", "content", accessContent, 10]
];

const prisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl)
});

for (const [pageKey, blockKey, content, sortOrder] of blocks) {
  await prisma.pageBlock.upsert({
    where: { pageKey_blockKey: { pageKey, blockKey } },
    create: { pageKey, blockKey, content, sortOrder, isActive: true },
    update: { content, sortOrder, isActive: true }
  });
}

await prisma.$disconnect();

console.log(`Seeded ${blocks.length} page_blocks.`);
