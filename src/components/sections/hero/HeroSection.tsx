import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { heroCode } from "@/data/heroCode";
import { useTranslations } from "@/hooks/useTranslations";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { Button } from "@/components/ui/Button";
import { BodyText } from "@/components/ui/BodyText";
import { GridBackground } from "@/components/ui/GridBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function HeroSection() {
  const { displayed, isComplete } = useTypingAnimation(heroCode, 24, 600);
  const { copy, profile } = useTranslations();
  const heroCopy = copy.hero;

  return (
    <section
      id="hero"
      aria-label={heroCopy.ariaLabel}
      className="relative isolate flex min-h-screen items-center overflow-hidden pt-[var(--navbar-total-offset)]"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <GridBackground />
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary-500/15 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-secondary-500/12 blur-[120px]" />
      </div>

      <div className="container-app relative z-10 grid min-h-[calc(100vh-var(--navbar-total-offset))] items-center gap-16 py-20 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full min-w-0"
        >
          <p className="font-mono text-sm text-primary-500">{heroCopy.eyebrow}</p>
          <h1 className="text-safe mt-6 w-full text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            {profile.fullName.split(" ").slice(0, 2).join(" ")}
            <span className="block text-foreground">
              {profile.fullName.split(" ").slice(2).join(" ")}
            </span>
          </h1>
          <p className="text-safe mt-6 w-full text-lg text-muted">{profile.role}</p>
          <BodyText className="mt-4">{profile.tagline}</BodyText>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="#experiencia">{heroCopy.cta.journey}</Button>
            <Button href="#projetos" variant="secondary">
              {heroCopy.cta.projects}
            </Button>
            <Button href={profile.cvUrl} variant="secondary" download>
              {heroCopy.cta.cv}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative w-full min-w-0"
        >
          <SpotlightCard className="code-block">
            <div className="relative">
              <pre className="invisible whitespace-pre-wrap" aria-hidden="true">
                <code>{heroCode}</code>
              </pre>
              <pre className="absolute inset-0 whitespace-pre-wrap text-foreground">
                <code>{displayed}</code>
                {!isComplete && (
                  <span className="animate-pulse text-primary-500">|</span>
                )}
              </pre>
            </div>
          </SpotlightCard>

          <div className="absolute -right-1 -bottom-16 z-10 sm:-right-2 sm:-bottom-20 lg:-right-4 lg:-bottom-8">
            <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-[var(--shadow-card)] sm:h-44 sm:w-36 lg:h-52 lg:w-44">
              <img
                src={profile.photo}
                alt={heroCopy.photoAlt}
                className="h-full w-full object-cover object-[center_18%]"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#experiencia"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-label={heroCopy.scrollLabel}
      >
        <ChevronDown size={28} aria-hidden="true" />
      </motion.a>
    </section>
  );
}
