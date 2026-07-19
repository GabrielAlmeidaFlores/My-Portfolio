import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { MOTION_DURATION, MOTION_EASE } from "@/lib/motion";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";
import { useTranslations } from "@/hooks/useTranslations";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleToggle } from "@/components/layout/LocaleToggle";
import { cn } from "@/lib/cn";

export function Header() {
  const isScrolled = useScrollNavbar(32);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { copy, navLinks } = useTranslations();

  function closeMobileMenu() {
    setIsMobileOpen(false);
  }

  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-50 flex justify-center px-4 pt-[var(--navbar-float-top)]">
      <div className="pointer-events-auto flex w-full max-w-[1080px] flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: MOTION_EASE }}
          className={cn("nav-pill w-full", isScrolled && "nav-pill-scrolled")}
        >
          <a href="#hero" className="nav-pill-logo" onClick={closeMobileMenu}>
            {SITE_CONFIG.name}
          </a>

          <nav aria-label={copy.header.navAriaLabel} className="nav-pill-links">
            <ul className="flex items-center gap-0.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className="nav-pill-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-pill-actions">
            <span className="nav-pill-divider" aria-hidden="true" />
            <LocaleToggle compact />
            <ThemeToggle compact />
            <button
              type="button"
              className="nav-pill-menu-btn"
              aria-label={
                isMobileOpen ? copy.header.closeMenu : copy.header.openMenu
              }
              aria-expanded={isMobileOpen}
              onClick={() => setIsMobileOpen((open) => !open)}
            >
              {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isMobileOpen && (
            <motion.nav
              key="mobile-menu"
              aria-label={copy.header.mobileNavAriaLabel}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: MOTION_DURATION, ease: MOTION_EASE }}
              className="nav-pill-mobile-menu w-full p-2 lg:hidden"
            >
              <ul className="flex flex-col gap-0.5">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: MOTION_DURATION,
                      ease: MOTION_EASE,
                      delay: index * 0.04,
                    }}
                  >
                    <a
                      href={link.href}
                      className="nav-pill-mobile-link"
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
