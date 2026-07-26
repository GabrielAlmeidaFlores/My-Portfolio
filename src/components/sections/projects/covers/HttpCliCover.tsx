import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const LOGO_SRC = "/images/projects/http-cli/logo.png";

const METHODS = [
  { label: "GET", className: "text-[#39ff14]" },
  { label: "POST", className: "text-[#f5e642]" },
  { label: "PUT", className: "text-[#5cc8ff]" },
  { label: "DELETE", className: "text-[#ff5c5c]" },
] as const;

interface HttpCliCoverProps {
  title: string;
  openUrl?: string;
  accessLabel: string;
  className?: string;
}

export function HttpCliCover({
  title,
  openUrl,
  accessLabel,
  className,
}: HttpCliCoverProps) {
  return (
    <div
      className={cn("http-cli-cover absolute inset-0 overflow-hidden", className)}
      role="img"
      aria-label={title}
    >
      <div className="http-cli-cover__grid" aria-hidden="true" />
      <div className="http-cli-cover__glow" aria-hidden="true" />

      <div className="relative z-[1] flex h-full flex-col p-4 sm:p-5">
        <div className="http-cli-cover__window flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="http-cli-cover__titlebar">
            <span className="http-cli-cover__dot http-cli-cover__dot--red" />
            <span className="http-cli-cover__dot http-cli-cover__dot--yellow" />
            <span className="http-cli-cover__dot http-cli-cover__dot--green" />
            <span className="http-cli-cover__path font-mono text-[10px] sm:text-xs">
              ~/http-cli
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 px-4 py-6 sm:gap-6 sm:px-6">
            <img
              src={LOGO_SRC}
              alt=""
              width={220}
              height={218}
              decoding="async"
              className="http-cli-cover__logo h-auto w-[min(52%,11rem)] object-contain sm:w-[min(48%,13rem)]"
            />

            <div className="flex flex-wrap items-center justify-center gap-2">
              {METHODS.map((method) => (
                <span
                  key={method.label}
                  className={cn(
                    "rounded border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide sm:text-xs",
                    method.className,
                  )}
                >
                  {method.label}
                </span>
              ))}
            </div>

            <p className="font-mono text-[10px] text-[#39ff14]/80 sm:text-xs">
              <span className="text-[#39ff14]">$</span> http-cli
              <span className="http-cli-cover__cursor" aria-hidden="true">
                _
              </span>
            </p>
          </div>
        </div>
      </div>

      {openUrl && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/75 opacity-0 transition-opacity duration-350 focus-within:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100">
          <Button href={openUrl} variant="secondary" className="gap-2 leading-none">
            <Search className="size-4 shrink-0 translate-y-px" aria-hidden="true" />
            <span className="leading-none">{accessLabel}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
