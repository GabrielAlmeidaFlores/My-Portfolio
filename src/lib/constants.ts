export const SITE_CONFIG = {
  name: "João Gabriel",
  email: "gabrielalmeidaflores@hotmail.com",
  linkedin: "https://www.linkedin.com/in/joao-gabriel-flores/",
  github: "https://github.com/GabrielAlmeidaFlores",
  whatsappNumber: "5515997752074",
} as const;

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
