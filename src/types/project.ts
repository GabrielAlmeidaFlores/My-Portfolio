export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  image: string;
  technologies: string[];
  results: string[];
  challenge: string;
  solution: string;
  architecture: string;
  images?: string[];
  videoUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
}
