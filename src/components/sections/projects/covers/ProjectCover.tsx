import type { Project } from "@/types/project";
import { HttpCliCover } from "@/components/sections/projects/covers/HttpCliCover";
import { hasCustomProjectCover } from "@/components/sections/projects/covers/hasCustomProjectCover";

interface ProjectCoverProps {
  project: Project;
  openUrl?: string;
  accessLabel: string;
}

export function ProjectCover({
  project,
  openUrl,
  accessLabel,
}: ProjectCoverProps) {
  if (!hasCustomProjectCover(project.id)) {
    return null;
  }

  switch (project.id) {
    case "http-cli":
      return (
        <HttpCliCover
          title={project.title}
          openUrl={openUrl}
          accessLabel={accessLabel}
        />
      );
    default:
      return null;
  }
}
