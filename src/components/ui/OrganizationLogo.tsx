import { cn } from "@/lib/cn";

interface OrganizationLogoProps {
  src: string;
  alt: string;
  className?: string;
}

export function OrganizationLogo({
  src,
  alt,
  className,
}: OrganizationLogoProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={32}
      height={32}
      loading="lazy"
      decoding="async"
      className={cn(
        "mb-5 inline-block size-8 rounded-full bg-white object-cover ring-1 ring-border/70",
        className,
      )}
    />
  );
}
