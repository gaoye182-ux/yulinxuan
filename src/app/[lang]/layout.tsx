import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCachedSiteSettings } from "@/lib/frontend-site";
import { getLanguage, isLanguage, type Language } from "@/lib/i18n";
import { getPageBlock } from "@/lib/page-blocks";

export function generateStaticParams() {
  return [{ lang: "ja" }, { lang: "zh" }, { lang: "en" }];
}

export default async function LangLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang: rawLang } = await params;

  if (!isLanguage(rawLang)) {
    notFound();
  }

  const lang: Language = getLanguage(rawLang);
  const [settings, navigationBlock, footerBlock] = await Promise.all([
    getCachedSiteSettings(),
    getPageBlock("layout", "navigation", lang, { contactLabel: "", items: [] as { href: string; label: string }[] }),
    getPageBlock("layout", "footer", lang, {
      siteTitle: "",
      serviceTitle: "",
      contactTitle: "",
      serviceLinks: [] as { href: string; label: string }[],
      copyright: ""
    })
  ]);

  return (
    <>
      <SiteHeader lang={lang} settings={settings} navigation={navigationBlock.content} />
      <main>{children}</main>
      <SiteFooter lang={lang} settings={settings} navigation={navigationBlock.content} footer={footerBlock.content} />
    </>
  );
}
