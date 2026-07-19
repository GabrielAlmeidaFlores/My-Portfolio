export function isExternalHref(href: string): boolean {
  return /^(https?:|tel:)/i.test(href);
}

export function getExternalLinkProps(href: string) {
  if (!isExternalHref(href)) {
    return {};
  }

  return {
    target: "_blank" as const,
    rel: "noopener noreferrer",
  };
}
