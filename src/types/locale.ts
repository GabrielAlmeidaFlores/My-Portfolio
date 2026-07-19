export type Locale = "pt-BR" | "en" | "es";

export interface LocaleOption {
  code: Locale;
  label: string;
  shortLabel: string;
  htmlLang: string;
}
