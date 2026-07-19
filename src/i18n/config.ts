import type { Locale, LocaleOption } from "@/types/locale";

export const DEFAULT_LOCALE: Locale = "pt-BR";

export const LOCALE_STORAGE_KEY = "locale";

export const localeOptions: LocaleOption[] = [
  { code: "pt-BR", label: "Português", shortLabel: "PT", htmlLang: "pt-BR" },
  { code: "en", label: "English", shortLabel: "EN", htmlLang: "en" },
  { code: "es", label: "Español", shortLabel: "ES", htmlLang: "es" },
];

export function isLocale(value: string | null): value is Locale {
  return value === "pt-BR" || value === "en" || value === "es";
}

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

export function getHtmlLang(locale: Locale): string {
  return localeOptions.find((option) => option.code === locale)?.htmlLang ?? "pt-BR";
}
