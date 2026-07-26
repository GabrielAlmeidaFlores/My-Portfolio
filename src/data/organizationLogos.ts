export const organizationLogos = {
  ousion: "/images/organizations/ousion.svg",
  pucpr: "/images/organizations/pucpr.png",
  uniso: "/images/organizations/uniso.png",
} as const;

export const experienceLogoById: Record<string, string> = {
  "ousion-tech-lead": organizationLogos.ousion,
  "ousion-pleno": organizationLogos.ousion,
  "ousion-junior": organizationLogos.ousion,
};

export const educationLogoById: Record<string, string> = {
  "pucpr-postgrad": organizationLogos.pucpr,
  "uniso-graduation": organizationLogos.uniso,
};
