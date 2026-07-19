import type { Locale } from "@/types/locale";
import type { Testimonial } from "@/types/testimonial";

export const testimonialsByLocale: Record<Locale, Testimonial[]> = {
  "pt-BR": [
    {
      id: "rafael-menck",
      name: "Rafael Menck de Almeida",
      role: "CEO e Fundador",
      company: "Innovatox",
      photo: "/images/testimonials/placeholder.jpg",
      comment: "Depoimento em breve.",
      rating: 5,
    },
    {
      id: "reinaldo-menck",
      name: "Reinaldo Menck",
      role: "A definir",
      company: "",
      photo: "/images/testimonials/placeholder.jpg",
      comment: "Depoimento em breve.",
      rating: 5,
    },
    {
      id: "felipe-flores",
      name: "Felipe Flores",
      role: "Investidor Imobiliário",
      company: "",
      photo: "/images/testimonials/placeholder.jpg",
      comment: "Depoimento em breve.",
      rating: 5,
    },
  ],
  en: [
    {
      id: "rafael-menck",
      name: "Rafael Menck de Almeida",
      role: "CEO and Founder",
      company: "Innovatox",
      photo: "/images/testimonials/placeholder.jpg",
      comment: "Testimonial coming soon.",
      rating: 5,
    },
    {
      id: "reinaldo-menck",
      name: "Reinaldo Menck",
      role: "To be defined",
      company: "",
      photo: "/images/testimonials/placeholder.jpg",
      comment: "Testimonial coming soon.",
      rating: 5,
    },
    {
      id: "felipe-flores",
      name: "Felipe Flores",
      role: "Real Estate Investor",
      company: "",
      photo: "/images/testimonials/placeholder.jpg",
      comment: "Testimonial coming soon.",
      rating: 5,
    },
  ],
  es: [
    {
      id: "rafael-menck",
      name: "Rafael Menck de Almeida",
      role: "CEO y Fundador",
      company: "Innovatox",
      photo: "/images/testimonials/placeholder.jpg",
      comment: "Testimonio próximamente.",
      rating: 5,
    },
    {
      id: "reinaldo-menck",
      name: "Reinaldo Menck",
      role: "Por definir",
      company: "",
      photo: "/images/testimonials/placeholder.jpg",
      comment: "Testimonio próximamente.",
      rating: 5,
    },
    {
      id: "felipe-flores",
      name: "Felipe Flores",
      role: "Inversor Inmobiliario",
      company: "",
      photo: "/images/testimonials/placeholder.jpg",
      comment: "Testimonio próximamente.",
      rating: 5,
    },
  ],
};

/** @deprecated Prefer testimonialsByLocale[locale] */
export const testimonials = testimonialsByLocale["pt-BR"];
