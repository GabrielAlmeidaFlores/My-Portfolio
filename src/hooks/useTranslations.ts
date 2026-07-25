import { useMemo } from "react";
import { useLocale } from "@/i18n/localeContext";
import { siteCopy } from "@/data/copy";
import { siteMeta } from "@/data/siteMeta";
import { profiles } from "@/data/profile";
import { getNavLinks, getSocialLinks } from "@/data/navigation";
import { experiencesByLocale } from "@/data/experiences";
import { projectsByLocale } from "@/data/projects";
import { educationByLocale } from "@/data/education";
import { contactOpportunitiesByLocale } from "@/data/contact";
import {
  getTechFilters,
  getTechnologies,
} from "@/data/technologies";
import { certifications } from "@/data/certifications";
import { getPublications } from "@/data/publications";

export function useTranslations() {
  const { locale, setLocale } = useLocale();

  return useMemo(
    () => ({
      locale,
      setLocale,
      copy: siteCopy[locale],
      meta: siteMeta[locale],
      profile: profiles[locale],
      navLinks: getNavLinks(locale),
      socialLinks: getSocialLinks(locale),
      experiences: experiencesByLocale[locale],
      projects: projectsByLocale[locale],
      education: educationByLocale[locale],
      contactOpportunities: contactOpportunitiesByLocale[locale],
      techFilters: getTechFilters(locale),
      technologies: getTechnologies(locale),
      certifications,
      publications: getPublications(locale),
    }),
    [locale, setLocale],
  );
}
