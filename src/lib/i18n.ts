export const languages = ["ja", "zh", "en"] as const;

export type Language = (typeof languages)[number];

export const defaultLanguage: Language = "ja";

export const languageLabels: Record<Language, string> = {
  ja: "JA",
  zh: "ZH",
  en: "EN"
};

export function isLanguage(value: string | undefined): value is Language {
  return Boolean(value && languages.includes(value as Language));
}

export function getLanguage(value: string | undefined): Language {
  return isLanguage(value) ? value : defaultLanguage;
}

export function localize<T extends Record<Language, string>>(
  value: Partial<T> | null | undefined,
  lang: Language
) {
  const localized = value?.[lang]?.trim();
  const fallback = value?.ja?.trim();

  return localized || fallback || "";
}
