import { SITE_CONFIG } from "@/lib/constants";
import { useTranslations } from "@/hooks/useTranslations";
import { getExternalLinkProps } from "@/lib/externalLink";
import { BodyText } from "@/components/ui/BodyText";

export function Footer() {
  const year = new Date().getFullYear();
  const { copy, meta, socialLinks } = useTranslations();

  return (
    <footer className="w-full border-t border-border py-12">
      <div className="container-app content-block flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full text-center sm:text-left">
          <p className="text-lg font-semibold">{SITE_CONFIG.name}</p>
          <BodyText className="mt-1 text-sm">{meta.footerDescription[0]}</BodyText>
          <BodyText className="text-sm">{meta.footerDescription[1]}</BodyText>
          <p className="mt-2 font-mono text-xs text-muted">
            © {year} — {copy.footer.copyright}
          </p>
        </div>

        <nav aria-label={copy.footer.socialAriaLabel} className="w-full sm:w-auto">
          <ul className="flex flex-wrap items-center justify-center gap-6 sm:justify-end">
            {socialLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="nav-link text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                  {...getExternalLinkProps(link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
