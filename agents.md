# Agents — Guia de Boas Práticas

Este documento define as convenções do projeto **Gabriel-Flores-Portfolio**. Agentes de IA e desenvolvedores devem seguir estas diretrizes para manter a estrutura organizada, o código consistente e a qualidade alta.

---

## 1. Visão geral do projeto

Landing page profissional em **React** (single page) para Gabriel. Prioridades:

1. **Clareza** — código legível e fácil de manter
2. **Performance** — carregamento rápido e experiência fluida
3. **Acessibilidade** — utilizável por todos
4. **Escopo mínimo** — resolver o problema sem over-engineering
5. **Impacto visual** — animações discretas, sem prejudicar performance

---

## 2. Stack

| Camada | Tecnologia |
|---|---|
| Framework | React |
| Build | Vite |
| Linguagem | TypeScript |
| Estilos | Tailwind CSS |
| Animações | Framer Motion |
| Deploy | Vercel |
| Lint | ESLint + Prettier |
| Ícones | Lucide React (tree-shakeable) |

---

## 3. Estrutura de pastas

```
Gabriel-Flores-Portfolio/
├── public/
│   ├── images/              # Fotos, projetos, logos, badges
│   ├── fonts/
│   └── cv/                  # Currículo em PDF
├── src/
│   ├── components/
│   │   ├── ui/              # Button, Card, Modal, Badge, Counter, Slider...
│   │   ├── layout/          # Header, Footer, ThemeToggle, SectionWrapper
│   │   └── sections/        # Uma subpasta por seção (ver seção 4)
│   ├── hooks/               # useTheme, useScrollSpy, useInView, useCounter
│   ├── lib/                 # Utilitários, validações, constantes
│   ├── styles/              # globals.css, tokens, tema claro/escuro
│   ├── types/               # Um arquivo por entidade de dados
│   ├── data/                # Conteúdo estático da landing page
│   ├── App.tsx              # Composição das seções na ordem correta
│   └── main.tsx
├── agents.md
└── README.md
```

### Mapeamento `sections/`

Cada seção da landing page tem sua própria pasta em `components/sections/`:

```
sections/
├── hero/
│   └── HeroSection.tsx
├── about/
│   └── AboutSection.tsx
├── stats/
│   └── StatsSection.tsx
├── experience/
│   └── ExperienceSection.tsx
├── projects/
│   ├── ProjectsSection.tsx
│   ├── ProjectCard.tsx
│   └── ProjectModal.tsx
├── technologies/
│   └── TechnologiesSection.tsx
├── certifications/
│   ├── CertificationsSection.tsx
│   └── CertificationBadge.tsx
├── results/
│   └── ResultsSection.tsx
├── education/
│   └── EducationSection.tsx
├── testimonials/
│   ├── TestimonialsSection.tsx
│   └── TestimonialCard.tsx
├── specializations/
│   └── SpecializationsSection.tsx
├── work-process/
│   └── WorkProcessSection.tsx
├── cta/
│   └── CtaSection.tsx
└── contact/
    └── ContactSection.tsx
```

### Regras de organização

| Onde colocar | Critério |
|---|---|
| `components/ui/` | Componente genérico usado em 2+ seções |
| `components/sections/` | Bloco visual de uma seção específica |
| `components/layout/` | Header, Footer, navegação, wrapper global |
| `hooks/` | Lógica reutilizável com estado ou efeitos |
| `lib/` | Funções puras, formatadores, validações |
| `data/` | Arrays/objetos de conteúdo estático |
| `types/` | Interfaces e tipos compartilhados |

**Não criar** pastas genéricas como `utils/`, `helpers/` e `misc/` — usar apenas `lib/`.

---

## 4. Seções da Landing Page

### Ordem na página (`App.tsx`)

```tsx
<Header />
<main>
  <HeroSection />
  <AboutSection />
  <StatsSection />
  <ExperienceSection />
  <ProjectsSection />
  <TechnologiesSection />
  <CertificationsSection />
  <ResultsSection />
  <EducationSection />
  <TestimonialsSection />
  <SpecializationsSection />
  <WorkProcessSection />
  <CtaSection />
  <ContactSection />
</main>
<Footer />
```

---

### 4.1 Hero (primeira dobra)

**Objetivo:** excelente primeira impressão.

**Conteúdo:**
- Foto profissional
- Nome completo
- Cargo principal
- Especializações (ex: `Software Engineer | Cloud Architect | DevOps Specialist`)
- Frase de impacto
- Botões: Ver Projetos, Baixar Currículo, Entrar em Contato
- Ícones das certificações principais (AWS, Azure, GCP)
- Estatísticas rápidas (anos de experiência, projetos, certificações, clientes)

**Componentes:** `HeroSection`, `StatItem` (ui)

---

### 4.2 Sobre Mim

**Objetivo:** seção mais humana, diferente da hero.

**Conteúdo:**
- Foto diferente da hero
- **Minha História** — como começou
- **Minha Missão** — como ajuda empresas
- Cards rápidos: Liderança, Arquitetura Cloud, Desenvolvimento, DevOps, IA, Gestão de Projetos

**Componentes:** `AboutSection`, `SkillCard` (ui)

---

### 4.3 Estatísticas

**Objetivo:** métricas com animação ao entrar na viewport.

**Exemplos:** +50 Projetos, +15 Certificações, +8 Anos, 99% Clientes satisfeitos, +20 Tecnologias

**Componentes:** `StatsSection`, `Counter` (ui), hook `useCounter`

---

### 4.4 Experiência Profissional (Timeline)

**Objetivo:** histórico profissional em formato timeline interativo.

**Cada item:**
- Empresa, cargo, período
- Descrição das responsabilidades
- Tecnologias utilizadas
- Resultados alcançados

**Componentes:** `ExperienceSection`, `TimelineItem` (ui)

---

### 4.5 Projetos em Destaque

**Objetivo:** seção mais importante — grid de cards com modal detalhado.

**Card:**
- Imagem, nome, descrição curta
- Tags de tecnologias (React, AWS, Docker, Node, Terraform...)
- Botões: Ver detalhes, GitHub, Demo
- Hover revelando tecnologias e resultados

**Modal (ao clicar em Ver detalhes):**
- Desafio, solução, arquitetura
- Resultados, imagens, vídeo (opcional)

**Componentes:** `ProjectsSection`, `ProjectCard`, `ProjectModal`

---

### 4.6 Tecnologias

**Objetivo:** grid visual com ícones agrupados por categoria.

**Categorias:**
- **Cloud:** AWS, Azure, GCP
- **Desenvolvimento:** React, Node, Flutter, Java, Python
- **Banco:** MongoDB, PostgreSQL, MySQL
- **DevOps:** Docker, Kubernetes, Terraform, GitHub Actions, CI/CD

**Componentes:** `TechnologiesSection`, `TechIcon` (ui)

---

### 4.7 Certificações

**Objetivo:** badges visuais, estilo credencial.

**Exemplos:** AWS Solutions Architect, AWS Developer, Cloud Practitioner, Azure Fundamentals, GCP Digital Leader, Terraform Associate, Scrum Master

**Ao clicar no badge:**
- Data, instituição, competências
- Link para certificado PDF

**Componentes:** `CertificationsSection`, `CertificationBadge`, `CertificationModal` (ui)

---

### 4.8 Resultados Alcançados

**Objetivo:** mostrar impacto de negócio, não só tecnologias.

**Cards:** Redução de custos Cloud, Migração de sistemas, Automação, Performance, Disponibilidade

**Exemplos:**
- ⬆️ 45% aumento de performance
- ⬇️ 30% redução de custos AWS
- 99.9% disponibilidade
- 20 pipelines CI/CD

**Componentes:** `ResultsSection`, `ResultCard` (ui)

---

### 4.9 Formação

**Objetivo:** trajetória acadêmica em cards.

**Conteúdo:** Graduação, pós, MBA, cursos relevantes

**Componentes:** `EducationSection`, `EducationCard` (ui)

---

### 4.10 Depoimentos / Recomendações

**Objetivo:** credibilidade social estilo LinkedIn.

**Cada card:** foto, nome, cargo, empresa, comentário, avaliação (★★★★★)

**Comportamento:** carrossel/slider automático com animação suave

**Componentes:** `TestimonialsSection`, `TestimonialCard`, `Slider` (ui)

---

### 4.11 Áreas de Especialização

**Objetivo:** cards grandes destacando áreas de atuação.

**Exemplos:** Cloud Architecture, Software Engineering, DevOps, IA, UX, Arquitetura de Sistemas, Consultoria, Mentoria

**Componentes:** `SpecializationsSection`, `SpecializationCard` (ui)

---

### 4.12 Processo de Trabalho

**Objetivo:** timeline horizontal do fluxo de trabalho.

**Etapas:** 01 Entendimento → 02 Planejamento → 03 Arquitetura → 04 Desenvolvimento → 05 Entrega → 06 Suporte

**Componentes:** `WorkProcessSection`, `ProcessStep` (ui)

---

### 4.13 CTA

**Objetivo:** chamada forte para ação.

**Conteúdo:** "Vamos construir algo incrível?"
**Botões:** Agendar conversa, LinkedIn, GitHub, E-mail

**Componentes:** `CtaSection`

---

### 4.14 Contato

**Objetivo:** formulário simples + links diretos.

**Formulário:** Nome, Empresa, Email, Telefone, Mensagem

**Ao lado:** WhatsApp, LinkedIn, GitHub, Localização

**Componentes:** `ContactSection`, validação em `lib/validateContact.ts`

---

### 4.15 Footer

**Conteúdo:** Logo, menu de navegação, redes sociais, copyright

**Componentes:** `Footer` (em `layout/`)

---

## 5. Diferenciais visuais

- Timeline interativa com destaque no item ativo
- Hover nos cards de projetos revelando tecnologias e resultados
- Contadores animados com `useInView` + `useCounter`
- Carrossel automático de depoimentos (pausar no hover)
- Modais acessíveis para projetos e certificações (foco preso, ESC para fechar)
- Animações de entrada com Framer Motion (`fadeIn`, `slideUp`) — respeitar `prefers-reduced-motion`
- Modo escuro/claro via `useTheme` + `ThemeToggle`
- Logos de empresas atendidas (opcional, dentro de Experience ou seção dedicada)

---

## 6. Convenções de nomenclatura

### Arquivos e pastas

- **Componentes React:** `PascalCase.tsx` — ex: `ProjectCard.tsx`
- **Pastas de seção:** `kebab-case` — ex: `work-process/`
- **Hooks:** `camelCase.ts` com prefixo `use` — ex: `useScrollSpy.ts`
- **Utilitários e tipos:** `camelCase.ts` — ex: `formatDate.ts`, `project.ts`
- **Dados:** `camelCase.ts` plural — ex: `projects.ts`, `certifications.ts`

### Código

- **Componentes:** `PascalCase` — `function HeroSection()`
- **Funções e variáveis:** `camelCase`
- **Tipos e interfaces:** `PascalCase`
- **Booleanos:** prefixo `is`, `has`, `can`
- **Event handlers:** prefixo `handle`
- **IDs de seção:** kebab-case para âncoras — `id="sobre-mim"`, `id="projetos"`

### Idioma

- **Código** (variáveis, funções, tipos): inglês
- **Conteúdo visível ao usuário** (textos da UI): português
- **Commits e PRs:** português ou inglês — manter consistência

---

## 7. Tipos de dados (`src/types/`)

Cada entidade da landing page deve ter seu tipo:

```ts
// profile.ts
export interface Profile {
  fullName: string;
  role: string;
  specializations: string[];
  tagline: string;
  photo: string;
  aboutPhoto: string;
  story: string;
  mission: string;
  cvUrl: string;
}

// stat.ts
export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

// experience.ts
export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
  results: string[];
}

// project.ts
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

// certification.ts
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  skills: string[];
  badgeImage: string;
  certificateUrl?: string;
}

// testimonial.ts
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  photo: string;
  comment: string;
  rating: number;
}

// education.ts, result.ts, specialization.ts, tech-category.ts, process-step.ts
// — seguir o mesmo padrão
```

Conteúdo estático correspondente em `src/data/` — um arquivo por entidade.

---

## 8. Componentes

### Princípios

1. **Um componente, uma responsabilidade** — dividir se passar de ~150 linhas
2. **Composição sobre props complexas** — preferir `children` a dezenas de props
3. **Dados vêm de `data/`** — componentes não hardcodam conteúdo
4. **Lógica em hooks** — animações, tema, scroll, contadores
5. **Seções são containers** — recebem dados e delegam renderização a subcomponentes

### Estrutura interna

```tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { profile } from "@/data/profile";
import type { Profile } from "@/types/profile";

interface HeroSectionProps {
  data?: Profile;
}

export function HeroSection({ data = profile }: HeroSectionProps) {
  return (
    <section id="hero" aria-label="Apresentação">
      {/* ... */}
    </section>
  );
}
```

### O que evitar

- Conteúdo hardcoded dentro de componentes de seção
- Props com `any`
- Animações pesadas em todos os elementos — animar só o necessário
- `useEffect` para derivar estado que pode ser calculado diretamente

---

## 9. Estilos e design

- **Tokens centralizados** em `styles/` — cores, espaçamentos, tipografia
- **Tema claro/escuro** via CSS variables + classe `dark` no `<html>`
- **Mobile first** — base mobile, breakpoints para telas maiores
- **Seções** com padding consistente via `SectionWrapper` (layout)
- **Contraste** mínimo WCAG AA

```css
/* ✅ Usar tokens */
padding: var(--spacing-section);
color: var(--color-text-primary);

/* ❌ Evitar valores soltos repetidos */
padding: 80px 0;
color: #333;
```

---

## 10. Animações (Framer Motion)

- Usar `motion` apenas em elementos que se beneficiam de animação
- Padrão de entrada: `opacity: 0 → 1`, `y: 20 → 0`
- Contadores: animar só quando visível (`useInView` com `once: true`)
- Carrossel: transição suave, pausar no hover
- **Sempre** respeitar `prefers-reduced-motion`:

```tsx
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

---

## 11. Acessibilidade (a11y)

- HTML semântico: `header`, `nav`, `main`, `section`, `article`, `footer`
- Cada `<section>` com `id` para navegação por âncora e `aria-label` descritivo
- Imagens com `alt` descritivo
- Modais: foco preso, `role="dialog"`, `aria-modal="true"`, fechar com ESC
- Formulário: labels associados, mensagens de erro acessíveis
- `lang="pt-BR"` no `<html>`
- Navegação por teclado em todos os interativos

---

## 12. Performance

- Imagens: WebP/AVIF, dimensões definidas, lazy loading abaixo da dobra
- Fonts: subset e `font-display: swap`
- Framer Motion: importar apenas o que usar (`motion`, `AnimatePresence`)
- Code splitting por seção se o bundle crescer (`React.lazy`)
- Meta Lighthouse: Performance ≥ 90

---

## 13. Git e versionamento

### Commits

```
tipo(escopo): descrição curta no imperativo

feat(hero): adiciona seção de apresentação
feat(projects): implementa modal de detalhes
fix(contact): corrige validação do formulário
style(ui): ajusta tema escuro
```

Tipos: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`, `test`

Escopos sugeridos: `hero`, `about`, `projects`, `contact`, `ui`, `theme`, `data`

### O que não commitar

- `.env`, chaves de API, credenciais
- `node_modules/`, `dist/`
- Arquivos gerados automaticamente

---

## 14. Instruções para agentes de IA

### Antes de codar

1. Ler este `agents.md` e o `README.md`
2. Identificar qual seção está sendo implementada (seção 4)
3. Seguir convenções e estrutura de pastas existentes

### Durante a implementação

1. **Escopo mínimo** — implementar só a seção ou feature pedida
2. **Dados em `data/`** — nunca hardcodar conteúdo nos componentes
3. **Reutilizar** componentes de `ui/` antes de criar novos
4. **Não over-engineer** — sem abstrações prematuras
5. **Não commitar** a menos que o usuário peça explicitamente

### Checklist antes de finalizar

- [ ] Seção na ordem correta em `App.tsx`
- [ ] `id` de âncora definido na seção
- [ ] Dados tipados em `types/` e separados em `data/`
- [ ] Animações respeitam `prefers-reduced-motion`
- [ ] Componentes acessíveis (semântica, alt, foco, labels)
- [ ] Responsivo (mobile first)
- [ ] Sem `any` desnecessário
- [ ] Mudança mínima e focada no pedido

### O que não fazer

- Reorganizar todas as seções sem solicitação
- Adicionar bibliotecas sem justificativa (ex: outra lib de animação além do Framer Motion)
- Hardcodar textos, projetos ou métricas nos componentes
- Criar componentes monolíticos com toda a landing page
- Alterar formatação de arquivos não relacionados à tarefa

---

## 15. Evolução deste documento

- Atualizar quando novas seções ou convenções forem adotadas
- Regras muito específicas podem ir para `.cursor/rules/*.mdc`
- Manter este arquivo como fonte única de verdade para organização e qualidade
