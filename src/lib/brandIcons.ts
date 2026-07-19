import { siGoogle, siLinux } from "simple-icons";

export type CertificationBrand = "aws" | "google-cloud" | "linux";

export type BrandIconData = {
  title: string;
  hex: string;
  path?: string;
  lucide?: "cloud";
};

const brandIcons: Record<CertificationBrand, BrandIconData> = {
  aws: {
    title: "Amazon Web Services",
    hex: "FF9900",
    lucide: "cloud",
  },
  "google-cloud": {
    title: siGoogle.title,
    path: siGoogle.path,
    hex: siGoogle.hex,
  },
  linux: {
    title: siLinux.title,
    path: siLinux.path,
    hex: siLinux.hex,
  },
};

export function getBrandIcon(brand: CertificationBrand): BrandIconData {
  return brandIcons[brand];
}
