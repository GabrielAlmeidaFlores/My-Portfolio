export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  responsibilitiesLabel: string;
  /** Full list of responsibilities / stack pills */
  responsibilities: string[];
  /** Shown by default; remaining items appear under "Others" */
  featuredResponsibilities?: string[];
}
