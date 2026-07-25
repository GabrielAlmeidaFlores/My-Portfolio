import type { Project } from "@/types/project";
import { HttpCliCover } from "@/components/sections/projects/covers/HttpCliCover";

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

export function hasCustomProjectCover(projectId: string): boolean {
  return projectId === "http-cli";
}
