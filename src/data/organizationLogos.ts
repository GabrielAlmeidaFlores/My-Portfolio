export const organizationLogos = {
  pucpr: "/images/organizations/pucpr.png",
  uniso: "/images/organizations/uniso.png",
} as const;

export const educationLogoById: Record<string, string> = {
  "pucpr-postgrad": organizationLogos.pucpr,
  "uniso-graduation": organizationLogos.uniso,
};
