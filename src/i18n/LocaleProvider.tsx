import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "@/types/locale";
import {
  getHtmlLang,
  getStoredLocale,
  LOCALE_STORAGE_KEY,
} from "@/i18n/config";
import { LocaleContext } from "@/i18n/localeContext";
import { siteMeta } from "@/data/siteMeta";

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  useEffect(() => {
    const meta = siteMeta[locale];
    const htmlLang = getHtmlLang(locale);

    document.documentElement.lang = htmlLang;
    document.title = meta.title;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", meta.description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", meta.title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", meta.description);
    }

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute("content", meta.ogLocale);
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute("content", meta.title);
    }

    const twitterDescription = document.querySelector(
      'meta[name="twitter:description"]',
    );
    if (twitterDescription) {
      twitterDescription.setAttribute("content", meta.twitterDescription);
    }
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
