import type { Project } from "@/types/project";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0">
      <div className="relative aspect-video overflow-hidden bg-hover">
        <div className="flex h-full items-center justify-center text-sm text-muted transition-transform duration-500 group-hover:scale-105">
          Imagem do projeto
        </div>
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 opacity-0 transition-opacity duration-350 group-hover:opacity-100">
          <Button variant="secondary">Detalhes</Button>
          {project.githubUrl && (
            <Button href={project.githubUrl} variant="ghost">
              GitHub
            </Button>
          )}
          {project.demoUrl && (
            <Button href={project.demoUrl} variant="ghost">
              Demo
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-lg font-bold">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {project.shortDescription}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
