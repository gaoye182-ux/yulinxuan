import type { Language } from "@/lib/i18n";

export type NavItem = {
  href: string;
  label: Record<Language, string>;
};

export const mainNav: NavItem[] = [
  {
    href: "/",
    label: { ja: "ホーム", zh: "首页", en: "Home" }
  },
  {
    href: "/collection",
    label: { ja: "蔵品紹介", zh: "藏品介绍", en: "Collection" }
  },
  {
    href: "/new-arrivals",
    label: { ja: "新入荷・特選品", zh: "新入荷・精选", en: "New Arrivals" }
  },
  {
    href: "/appraisal",
    label: { ja: "鑑定・買取", zh: "鉴定・收购", en: "Appraisal" }
  },
  {
    href: "/news",
    label: { ja: "新着情報", zh: "资讯", en: "News" }
  },
  {
    href: "/about",
    label: { ja: "玉林軒について", zh: "关于我们", en: "About" }
  }
];

export function localizedPath(lang: Language, href = "/") {
  const normalized = href === "/" ? "" : href;
  return `/${lang}${normalized}`;
}
