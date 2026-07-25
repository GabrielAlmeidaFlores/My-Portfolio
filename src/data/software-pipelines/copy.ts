import type { Locale } from "@/types/locale";
import type { PipelineCopy } from "@/data/software-pipelines/pipelineCopy";
import { pipelineCopyPtBR } from "@/data/software-pipelines/copy.pt-BR";
import { pipelineCopyEn } from "@/data/software-pipelines/copy.en";
import { pipelineCopyEs } from "@/data/software-pipelines/copy.es";

export const copy: Record<Locale, PipelineCopy> = {
  "pt-BR": pipelineCopyPtBR,
  en: pipelineCopyEn,
  es: pipelineCopyEs,
};
