import { useMemo } from "react";
import { useLocale } from "@/i18n/localeContext";
import { siteCopy } from "@/data/copy";
import { siteMeta } from "@/data/siteMeta";
import { profiles } from "@/data/profile";
import { getNavLinks, getSocialLinks } from "@/data/navigation";
import { experiencesByLocale } from "@/data/experiences";
import { projectsByLocale } from "@/data/projects";
import { educationByLocale } from "@/data/education";
import { testimonialsByLocale } from "@/data/testimonials";
import { contactOpportunitiesByLocale } from "@/data/contact";
import { statsByLocale } from "@/data/stats";
import { aboutValuesByLocale } from "@/data/heroCode";
import {
  getTechFilters,
  getTechnologies,
} from "@/data/technologies";
import { getSoftwarePipelines } from "@/data/softwarePipelines";
import { certifications } from "@/data/certifications";

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
      testimonials: testimonialsByLocale[locale],
      contactOpportunities: contactOpportunitiesByLocale[locale],
      stats: statsByLocale[locale],
      aboutValues: aboutValuesByLocale[locale],
      techFilters: getTechFilters(locale),
      technologies: getTechnologies(locale),
      softwarePipelines: getSoftwarePipelines(locale),
      certifications,
    }),
    [locale, setLocale],
  );
}
