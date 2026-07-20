export type TechFilter =
  | "all"
  | "cloud"
  | "backend"
  | "frontend"
  | "devops"
  | "database"
  | "tools";

export interface Technology {
  id: string;
  name: string;
  category: Exclude<TechFilter, "all">;
  description: string;
  relatedProjects: string[];
  relatedCertifications: string[];
  relatedExperiences: string[];
  isFeatured?: boolean;
}
