const CUSTOM_PROJECT_COVER_IDS = new Set(["http-cli"]);

export function hasCustomProjectCover(projectId: string): boolean {
  return CUSTOM_PROJECT_COVER_IDS.has(projectId);
}
