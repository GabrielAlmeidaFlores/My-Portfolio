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
  experience: {
    title: string;
    subtitle: string;
    ariaLabel: string;
    others: string;
    showLess: string;
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
  publications: {
    title: string;
    subtitle: string;
    ariaLabel: string;
    readMore: string;
    backToList: string;
    notFoundTitle: string;
    notFoundDescription: string;
    publishedOn: string;
    tableOfContents: string;
    tableOfContentsAria: string;
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
    previousPublication: string;
    nextPublication: string;
    projects: string;
    publications: string;
    projectAria: string;
    publicationAria: string;
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
  experience: {
    title: "Experiência Profissional",
    subtitle:
      "Trajetória em empresas de tecnologia, com foco em arquitetura, cloud e engenharia de software.",
    ariaLabel: "Experiência profissional",
    others: "Outras",
    showLess: "Ver menos",
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
  publications: {
    title: "Publicações",
    subtitle:
      "Artigos e notas técnicas sobre arquitetura, cloud, engenharia e processo de trabalho.",
    ariaLabel: "Publicações",
    readMore: "Ler publicação",
    backToList: "Voltar às publicações",
    notFoundTitle: "Publicação não encontrada",
    notFoundDescription:
      "O conteúdo que você procura não existe ou foi movido.",
    publishedOn: "Publicado em",
    tableOfContents: "Neste artigo",
    tableOfContentsAria: "Índice do artigo",
  },
  contact: {
    eyebrow: "// vamos construir",
    titleBefore: "Vamos construir algo",
    titleHighlight: "juntos?",
    subtitle:
      "Disponível para oportunidades em arquitetura de software, engenharia cloud, DevOps, SysAdmin e consultoria.",
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
    previousPublication: "Publicação anterior",
    nextPublication: "Próxima publicação",
    projects: "Projetos",
    publications: "Publicações",
    projectAria: "{title}, projeto {current} de {total}",
    publicationAria: "{title}, publicação {current} de {total}",
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
  experience: {
    title: "Professional Experience",
    subtitle:
      "Career path in technology companies, focused on architecture, cloud, and software engineering.",
    ariaLabel: "Professional experience",
    others: "Others",
    showLess: "Show less",
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
  publications: {
    title: "Publications",
    subtitle:
      "Articles and technical notes on architecture, cloud, engineering, and working process.",
    ariaLabel: "Publications",
    readMore: "Read publication",
    backToList: "Back to publications",
    notFoundTitle: "Publication not found",
    notFoundDescription:
      "The content you are looking for does not exist or has been moved.",
    publishedOn: "Published on",
    tableOfContents: "In this article",
    tableOfContentsAria: "Article table of contents",
  },
  contact: {
    eyebrow: "// let's build",
    titleBefore: "Shall we build something",
    titleHighlight: "together?",
    subtitle:
      "Open to opportunities in software architecture, cloud engineering, DevOps, SysAdmin, and consulting.",
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
    previousPublication: "Previous publication",
    nextPublication: "Next publication",
    projects: "Projects",
    publications: "Publications",
    projectAria: "{title}, project {current} of {total}",
    publicationAria: "{title}, publication {current} of {total}",
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
  experience: {
    title: "Experiencia Profesional",
    subtitle:
      "Trayectoria en empresas de tecnología, con foco en arquitectura, cloud e ingeniería de software.",
    ariaLabel: "Experiencia profesional",
    others: "Otras",
    showLess: "Ver menos",
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
  publications: {
    title: "Publicaciones",
    subtitle:
      "Artículos y notas técnicas sobre arquitectura, cloud, ingeniería y proceso de trabajo.",
    ariaLabel: "Publicaciones",
    readMore: "Leer publicación",
    backToList: "Volver a publicaciones",
    notFoundTitle: "Publicación no encontrada",
    notFoundDescription:
      "El contenido que buscas no existe o ha sido movido.",
    publishedOn: "Publicado el",
    tableOfContents: "En este artículo",
    tableOfContentsAria: "Índice del artículo",
  },
  contact: {
    eyebrow: "// construyamos",
    titleBefore: "¿Construimos algo",
    titleHighlight: "juntos?",
    subtitle:
      "Disponible para oportunidades en arquitectura de software, ingeniería cloud, DevOps, SysAdmin y consultoría.",
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
    previousPublication: "Publicación anterior",
    nextPublication: "Siguiente publicación",
    projects: "Proyectos",
    publications: "Publicaciones",
    projectAria: "{title}, proyecto {current} de {total}",
    publicationAria: "{title}, publicación {current} de {total}",
  },
};

export const siteCopy: Record<Locale, SiteCopy> = {
  "pt-BR": ptBR,
  en,
  es,
};
