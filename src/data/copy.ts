import type { Locale } from "@/types/locale";

export interface SiteCopy {
  hero: {
    eyebrow: string;
    cta: {
      journey: string;
      projects: string;
      cv: string;
      contact: string;
    };
    photoAlt: string;
    scrollLabel: string;
    ariaLabel: string;
  };
  about: {
    title: string;
    values: {
      title: string;
      subtitle: string;
    };
    specialties: {
      title: string;
      subtitle: string;
    };
    stats: {
      title: string;
      subtitle: string;
    };
    scrollHint: string;
    photoAlt: string;
  };
  experience: {
    title: string;
    subtitle: string;
    ariaLabel: string;
  };
  projects: {
    title: string;
    subtitle: string;
    imagePlaceholder: string;
    noMedia: string;
    details: string;
    github: string;
    demo: string;
    clientProject: string;
    openSite: string;
    access: string;
    ariaLabel: string;
  };
  technologies: {
    title: string;
    subtitle: string;
    ariaLabel: string;
    modal: {
      relatedProjects: string;
      certifications: string;
      experiences: string;
      close: string;
    };
  };
  engineering: {
    title: string;
    subtitle: string;
    ariaLabel: string;
  };
  certifications: {
    title: string;
    subtitle: string;
    badge: string;
    viewCredential: string;
    ariaLabel: string;
  };
  education: {
    title: string;
    subtitle: string;
    ariaLabel: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    photoAlt: string;
    placeholder: string;
    ariaLabel: string;
  };
  contact: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    subtitle: string;
    email: string;
    ariaLabel: string;
  };
  footer: {
    copyright: string;
    socialAriaLabel: string;
  };
  common: {
    photo: string;
  };
  header: {
    navAriaLabel: string;
    mobileNavAriaLabel: string;
    openMenu: string;
    closeMenu: string;
  };
  theme: {
    light: string;
    dark: string;
  };
  backToTop: string;
  carousel: {
    previousProject: string;
    nextProject: string;
    previousTopic: string;
    nextTopic: string;
    projects: string;
    topics: string;
    projectAria: string;
    topicAria: string;
  };
}

const ptBR: SiteCopy = {
  hero: {
    eyebrow: "// engenheiro cloud-native",
    cta: {
      journey: "Conheça minha trajetória",
      projects: "Ver projetos",
      cv: "Baixar currículo",
      contact: "Entrar em contato",
    },
    photoAlt: "Foto profissional",
    scrollLabel: "Rolar para a seção de experiência",
    ariaLabel: "Apresentação",
  },
  about: {
    title: "Sobre Mim",
    values: {
      title: "Valores",
      subtitle: "Princípios que orientam cada decisão técnica e de liderança.",
    },
    specialties: {
      title: "Especialidades",
      subtitle: "Áreas em que atuo com maior profundidade e entrega de valor.",
    },
    stats: {
      title: "Em números",
      subtitle: "Resultados que refletem experiência, dedicação e impacto.",
    },
    scrollHint: "role ↓",
    photoAlt: "Foto profissional",
  },
  experience: {
    title: "Experiência Profissional",
    subtitle:
      "Trajetória em empresas de tecnologia, com foco em arquitetura, cloud e liderança de equipes.",
    ariaLabel: "Experiência profissional",
  },
  projects: {
    title: "Projetos em Destaque",
    subtitle:
      "Soluções reais em cloud, infraestrutura e plataformas corporativas.",
    imagePlaceholder: "Imagem do projeto",
    noMedia: "Este projeto não tem imagem ou vídeo",
    details: "Ver detalhes",
    github: "GitHub",
    demo: "Abrir site",
    clientProject: "Projeto contratado",
    openSite: "Abrir site",
    access: "Acessar",
    ariaLabel: "Projetos em destaque",
  },
  technologies: {
    title: "Stack Tecnológica",
    subtitle:
      "Selecione uma tecnologia para explorar projetos, certificações e experiências relacionadas.",
    ariaLabel: "Tecnologias",
    modal: {
      relatedProjects: "Projetos relacionados",
      certifications: "Certificações",
      experiences: "Experiências",
      close: "Fechar",
    },
  },
  engineering: {
    title: "Como eu construo software",
    subtitle:
      "Da concepção à produção: como penso, desenho e entrego soluções em cada camada da stack.",
    ariaLabel: "Engenharia de software",
  },
  certifications: {
    title: "Certificações",
    subtitle:
      "Credenciais validadas pelas principais plataformas de cloud e infraestrutura.",
    badge: "Certificação profissional",
    viewCredential: "Ver credencial",
    ariaLabel: "Certificações",
  },
  education: {
    title: "Formação Acadêmica",
    subtitle: "Trajetória acadêmica e especialização contínua.",
    ariaLabel: "Formação acadêmica",
  },
  testimonials: {
    title: "Recomendações",
    subtitle: "Depoimentos de colegas, gestores e parceiros de projeto.",
    photoAlt: "Foto",
    placeholder:
      "Novas recomendações do LinkedIn podem ser adicionadas em breve.",
    ariaLabel: "Depoimentos",
  },
  contact: {
    eyebrow: "// vamos construir",
    titleBefore: "Vamos construir algo",
    titleHighlight: "juntos?",
    subtitle:
      "Disponível para oportunidades em liderança técnica, arquitetura de software, engenharia cloud e consultoria.",
    email: "Enviar e-mail",
    ariaLabel: "Contato",
  },
  footer: {
    copyright: "Todos os direitos reservados",
    socialAriaLabel: "Redes sociais",
  },
  common: {
    photo: "Foto",
  },
  header: {
    navAriaLabel: "Navegação principal",
    mobileNavAriaLabel: "Navegação mobile",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
  },
  theme: {
    light: "Ativar modo claro",
    dark: "Ativar modo escuro",
  },
  backToTop: "Voltar ao topo",
  carousel: {
    previousProject: "Projeto anterior",
    nextProject: "Próximo projeto",
    previousTopic: "Tópico anterior",
    nextTopic: "Próximo tópico",
    projects: "Projetos",
    topics: "Tópicos",
    projectAria: "{title}, projeto {current} de {total}",
    topicAria: "{title}, tópico {current} de {total}",
  },
};

const en: SiteCopy = {
  hero: {
    eyebrow: "// cloud-native engineer",
    cta: {
      journey: "Explore my journey",
      projects: "View projects",
      cv: "Download resume",
      contact: "Get in touch",
    },
    photoAlt: "Professional photo",
    scrollLabel: "Scroll to experience section",
    ariaLabel: "Introduction",
  },
  about: {
    title: "About Me",
    values: {
      title: "Values",
      subtitle: "Principles that guide every technical and leadership decision.",
    },
    specialties: {
      title: "Specialties",
      subtitle: "Areas where I deliver the deepest expertise and business value.",
    },
    stats: {
      title: "By the numbers",
      subtitle: "Results that reflect experience, dedication, and impact.",
    },
    scrollHint: "scroll ↓",
    photoAlt: "Professional photo",
  },
  experience: {
    title: "Professional Experience",
    subtitle:
      "Career path in technology companies, focused on architecture, cloud, and team leadership.",
    ariaLabel: "Professional experience",
  },
  projects: {
    title: "Featured Projects",
    subtitle:
      "Real-world solutions in cloud, infrastructure, and enterprise platforms.",
    imagePlaceholder: "Project image",
    noMedia: "This project has no image or video",
    details: "View details",
    github: "GitHub",
    demo: "Open site",
    clientProject: "Contracted project",
    openSite: "Open site",
    access: "Access",
    ariaLabel: "Featured projects",
  },
  technologies: {
    title: "Tech Stack",
    subtitle:
      "Select a technology to explore related projects, certifications, and experience.",
    ariaLabel: "Technologies",
    modal: {
      relatedProjects: "Related projects",
      certifications: "Certifications",
      experiences: "Experience",
      close: "Close",
    },
  },
  engineering: {
    title: "How I build software",
    subtitle:
      "From concept to production: how I think, design, and deliver solutions across every layer of the stack.",
    ariaLabel: "Software engineering",
  },
  certifications: {
    title: "Certifications",
    subtitle:
      "Credentials validated by leading cloud and infrastructure platforms.",
    badge: "Professional certification",
    viewCredential: "View credential",
    ariaLabel: "Certifications",
  },
  education: {
    title: "Education",
    subtitle: "Academic background and continuous specialization.",
    ariaLabel: "Education",
  },
  testimonials: {
    title: "Recommendations",
    subtitle: "Testimonials from colleagues, managers, and project partners.",
    photoAlt: "Photo",
    placeholder: "New LinkedIn recommendations may be added soon.",
    ariaLabel: "Testimonials",
  },
  contact: {
    eyebrow: "// let's build",
    titleBefore: "Shall we build something",
    titleHighlight: "together?",
    subtitle:
      "Open to opportunities in technical leadership, software architecture, cloud engineering, and consulting.",
    email: "Send email",
    ariaLabel: "Contact",
  },
  footer: {
    copyright: "All rights reserved",
    socialAriaLabel: "Social links",
  },
  common: {
    photo: "Photo",
  },
  header: {
    navAriaLabel: "Main navigation",
    mobileNavAriaLabel: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  theme: {
    light: "Switch to light mode",
    dark: "Switch to dark mode",
  },
  backToTop: "Back to top",
  carousel: {
    previousProject: "Previous project",
    nextProject: "Next project",
    previousTopic: "Previous topic",
    nextTopic: "Next topic",
    projects: "Projects",
    topics: "Topics",
    projectAria: "{title}, project {current} of {total}",
    topicAria: "{title}, topic {current} of {total}",
  },
};

const es: SiteCopy = {
  hero: {
    eyebrow: "// ingeniero cloud-native",
    cta: {
      journey: "Conoce mi trayectoria",
      projects: "Ver proyectos",
      cv: "Descargar currículum",
      contact: "Contactar",
    },
    photoAlt: "Foto profesional",
    scrollLabel: "Ir a la sección de experiencia",
    ariaLabel: "Presentación",
  },
  about: {
    title: "Sobre mí",
    values: {
      title: "Valores",
      subtitle: "Principios que guían cada decisión técnica y de liderazgo.",
    },
    specialties: {
      title: "Especialidades",
      subtitle: "Áreas en las que aporto mayor profundidad y valor de negocio.",
    },
    stats: {
      title: "En números",
      subtitle: "Resultados que reflejan experiencia, dedicación e impacto.",
    },
    scrollHint: "desplázate ↓",
    photoAlt: "Foto profesional",
  },
  experience: {
    title: "Experiencia Profesional",
    subtitle:
      "Trayectoria en empresas de tecnología, con foco en arquitectura, cloud y liderazgo de equipos.",
    ariaLabel: "Experiencia profesional",
  },
  projects: {
    title: "Proyectos Destacados",
    subtitle:
      "Soluciones reales en cloud, infraestructura y plataformas corporativas.",
    imagePlaceholder: "Imagen del proyecto",
    noMedia: "Este proyecto no tiene imagen ni video",
    details: "Ver detalles",
    github: "GitHub",
    demo: "Abrir sitio",
    clientProject: "Proyecto contratado",
    openSite: "Abrir sitio",
    access: "Acceder",
    ariaLabel: "Proyectos destacados",
  },
  technologies: {
    title: "Stack Tecnológico",
    subtitle:
      "Selecciona una tecnología para explorar proyectos, certificaciones y experiencias relacionadas.",
    ariaLabel: "Tecnologías",
    modal: {
      relatedProjects: "Proyectos relacionados",
      certifications: "Certificaciones",
      experiences: "Experiencias",
      close: "Cerrar",
    },
  },
  engineering: {
    title: "Cómo construyo software",
    subtitle:
      "De la concepción a producción: cómo pienso, diseño y entrego soluciones en cada capa del stack.",
    ariaLabel: "Ingeniería de software",
  },
  certifications: {
    title: "Certificaciones",
    subtitle:
      "Credenciales validadas por las principales plataformas de cloud e infraestructura.",
    badge: "Certificación profesional",
    viewCredential: "Ver credencial",
    ariaLabel: "Certificaciones",
  },
  education: {
    title: "Formación Académica",
    subtitle: "Trayectoria académica y especialización continua.",
    ariaLabel: "Formación académica",
  },
  testimonials: {
    title: "Recomendaciones",
    subtitle: "Testimonios de colegas, gestores y socios de proyecto.",
    photoAlt: "Foto",
    placeholder:
      "Nuevas recomendaciones de LinkedIn pueden añadirse pronto.",
    ariaLabel: "Testimonios",
  },
  contact: {
    eyebrow: "// construyamos",
    titleBefore: "¿Construimos algo",
    titleHighlight: "juntos?",
    subtitle:
      "Disponible para oportunidades en liderazgo técnico, arquitectura de software, ingeniería cloud y consultoría.",
    email: "Enviar correo",
    ariaLabel: "Contacto",
  },
  footer: {
    copyright: "Todos los derechos reservados",
    socialAriaLabel: "Redes sociales",
  },
  common: {
    photo: "Foto",
  },
  header: {
    navAriaLabel: "Navegación principal",
    mobileNavAriaLabel: "Navegación móvil",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  theme: {
    light: "Activar modo claro",
    dark: "Activar modo oscuro",
  },
  backToTop: "Volver arriba",
  carousel: {
    previousProject: "Proyecto anterior",
    nextProject: "Siguiente proyecto",
    previousTopic: "Tema anterior",
    nextTopic: "Siguiente tema",
    projects: "Proyectos",
    topics: "Temas",
    projectAria: "{title}, proyecto {current} de {total}",
    topicAria: "{title}, tema {current} de {total}",
  },
};

export const siteCopy: Record<Locale, SiteCopy> = {
  "pt-BR": ptBR,
  en,
  es,
};
