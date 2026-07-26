interface OrganizationLogoProps {
  src: string;
  alt: string;
}

export function OrganizationLogo({ src, alt }: OrganizationLogoProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={32}
      height={32}
      loading="lazy"
      decoding="async"
      className="mb-5 block size-8 rounded-full bg-white object-cover ring-1 ring-border/70"
    />
  );
}
