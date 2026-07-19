import { createContext, useContext } from "react";
import type { Locale } from "@/types/locale";
import { DEFAULT_LOCALE } from "@/i18n/config";

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }

  return context;
}

export function useLocaleSafe(): Locale {
  const context = useContext(LocaleContext);
  return context?.locale ?? DEFAULT_LOCALE;
}
