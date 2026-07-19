import { Cloud } from "lucide-react";
import type { CertificationBrand } from "@/lib/brandIcons";
import { getBrandIcon } from "@/lib/brandIcons";
import { cn } from "@/lib/cn";

interface BrandIconProps {
  brand: CertificationBrand;
  size?: number;
  className?: string;
}

export function BrandIcon({ brand, size = 28, className }: BrandIconProps) {
  const icon = getBrandIcon(brand);

  if (icon.lucide === "cloud") {
    return (
      <Cloud
        size={size}
        strokeWidth={2}
        aria-label={icon.title}
        className={cn("shrink-0", className)}
        style={{ color: `#${icon.hex}` }}
      />
    );
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-label={icon.title}
      className={cn("shrink-0", className)}
    >
      <title>{icon.title}</title>
      <path fill={`#${icon.hex}`} d={icon.path} />
    </svg>
  );
}
