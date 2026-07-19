import type { CertificationBrand } from "@/lib/brandIcons";

export interface Certification {
  id: string;
  name: string;
  year: number;
  brand: CertificationBrand;
  certificateUrl?: string;
}
