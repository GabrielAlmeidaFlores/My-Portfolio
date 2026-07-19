import type { Project } from "@/types/project";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!isOpen || !project) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes do projeto ${project.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-background p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-2xl font-bold">{project.title}</h2>
        <p className="mt-4 text-muted">{project.challenge}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 text-sm text-primary"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
