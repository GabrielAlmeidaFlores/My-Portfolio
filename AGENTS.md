# Agents — Guia de Boas Práticas

Este documento define as convenções do projeto **Gabriel-Flores-Portfolio**. Agentes de IA e desenvolvedores devem seguir estas diretrizes para manter a estrutura organizada, o código consistente e a qualidade alta.

---

## 1. Visão geral do projeto

Landing page profissional em **React** (com rotas para publicações) para Gabriel. Prioridades:

1. **Clareza** — código legível e fácil de manter
2. **Performance** — carregamento rápido e experiência fluida
3. **Acessibilidade** — utilizável por todos
4. **Escopo mínimo** — resolver o problema sem over-engineering
5. **Impacto visual** — animações discretas, sem prejudicar performance

### Regras críticas (sempre)

| Regra | Detalhe |
|---|---|
| Sem comentários no código | Proibido `//`, `/* */`, `/** */`, `{/* */}` |
| i18n completo | Todo conteúdo/UI novo em **pt-BR**, **en** e **es** |
| Arquivo de regras | Sempre `AGENTS.md` (uppercase) |
| Package manager | **Somente Yarn** — nunca `npm`; lockfile único: `yarn.lock` |
| Sem Vercel | Não usar `vercel.json` nem assumir deploy na Vercel |
| Dados fora de componentes | Conteúdo em `data/` / `content/`, tipado em `types/` |
| Publicações | JSX + kit `article/`; mesma margem lateral; corpo nos 3 idiomas |
| `max-w-*` | Exige token `--max-width-*` em `@theme` (não misturar com `--spacing-*`) |
| Atualizar `AGENTS.md` | Toda regra nova descrita pelo usuário deve ser registrada aqui |

---

## 2. Stack

| Camada | Tecnologia |
|---|---|
| Framework | React |
| Build | Vite |
| Linguagem | TypeScript |
| Estilos | Tailwind CSS |
| Animações | Framer Motion |
| Roteamento | React Router |
| Diagramas | Mermaid |
| Package manager | Yarn (`yarn.lock` apenas) |
| Lint | Oxlint |
| Ícones | Lucide React (tree-shakeable) |

### Package manager (Yarn only)

- Usar **apenas Yarn** para instalar, adicionar, remover e rodar scripts
- Comandos permitidos: `yarn`, `yarn add`, `yarn remove`, `yarn install`, `yarn dev`, `yarn build`, `yarn lint`, `yarn preview`, etc.
- **Proibido** `npm`, `npm install`, `npm run`, `npx` (exceto quando não houver equivalente Yarn e for inevitável — preferir `yarn dlx`)
- Lockfile versionado: **somente** `yarn.lock`
- **Não** criar nem commitar `package-lock.json` ou `pnpm-lock.yaml`
- `package-lock.json` está no `.gitignore`
- Se `package-lock.json` aparecer, apagar e reinstalar com `yarn`

---

## 3. Estrutura de pastas

```
Gabriel-Flores-Portfolio/
├── public/
│   ├── images/              # Fotos, projetos, logos, badges
│   │   └── publications/    # Imagens das publicações (por slug)
│   ├── fonts/
│   └── cv/                  # Currículo em PDF
├── src/
│   ├── components/
│   │   ├── article/         # Kit tipográfico para publicações (Article, Img, Mermaid...)
│   │   ├── ui/              # Button, Card, Modal, Badge, Counter, Slider...
│   │   ├── layout/          # Header, Footer, ThemeToggle, SectionWrapper
│   │   └── sections/        # Uma subpasta por seção (ver seção 4)
│   ├── content/
│   │   └── publications/    # Corpo das publicações em TSX/JSX
│   ├── pages/               # HomePage, PublicationPage
│   ├── hooks/               # useTheme, useScrollSpy, useInView, useCounter
│   ├── lib/                 # Utilitários, validações, constantes
│   ├── styles/              # globals.css, tokens, tema claro/escuro
│   ├── types/               # Um arquivo por entidade de dados
│   ├── data/                # Conteúdo estático da landing page
│   ├── App.tsx              # Rotas + shell (Header/Footer)
│   └── main.tsx
├── AGENTS.md
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
├── publications/
│   ├── PublicationsSection.tsx
│   └── PublicationCard.tsx
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
| `components/article/` | Componentes tipográficos reutilizáveis em publicações |
| `components/sections/` | Bloco visual de uma seção específica |
| `components/layout/` | Header, Footer, navegação, wrapper global |
| `content/publications/` | Corpo JSX de cada publicação |
| `pages/` | Páginas com rota própria (home, publicação) |
| `hooks/` | Lógica reutilizável com estado ou efeitos |
| `lib/` | Funções puras, formatadores, validações |
| `data/` | Arrays/objetos de conteúdo estático |
| `types/` | Interfaces e tipos compartilhados |

**Não criar** pastas genéricas como `utils/`, `helpers/` e `misc/` — usar apenas `lib/`.

---

## 4. Seções da Landing Page

### Ordem na página (`HomePage` / rota `/`)

```tsx
<Header />
<main>
  <HeroSection />
  <ExperienceSection />
  <ProjectsSection />
  <TechnologiesSection />
  <SoftwareEngineeringSection />
  <CertificationsSection />
  <EducationSection />
  <PublicationsSection />
  <ContactSection />
</main>
<Footer />
```

Rotas adicionais:

- `/publicacoes/:slug` → `PublicationPage` (leitura completa do artigo)

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

### 4.15 Publicações

**Objetivo:** artigos e notas técnicas estilo documentação, com página dedicada.

**Listagem (landing):** cards com capa, título, resumo, data e tags → link para `/publicacoes/:slug`

**Página de leitura (`PublicationPage` / rota `/publicacoes/:slug`):**
- Botão voltar para `/#publicacoes`
- Metadados + capa + corpo do artigo
- Corpo escrito em **JSX** (HTML + componentes React) — não strings HTML cruas nem Markdown
- Usar apenas o kit `components/article/` (`Article`, `ArticleH2`, `ArticleH3`, `ArticleP`, listas, `ArticleImg`, `ArticleCode`, `ArticleCallout`, `ArticleMermaid`)
- Imagens locais em `public/images/publications/<slug>/`
- Diagramas via `ArticleMermaid` (prop `chart` + `ariaLabel` obrigatório, traduzido)
- `ArticleCallout` exige `title` explícito (traduzido) — sem labels hardcoded em um único idioma

**Layout / margens da página de publicação:**
- Botão voltar, título, capa e corpo devem compartilhar a **mesma margem lateral** (mesma coluna)
- Não usar larguras diferentes entre capa e texto (ex.: capa full-width e texto `max-w-3xl`)
- Mobile: padding lateral compacto (`px-4`)
- Desktop: margens laterais maiores, preferencialmente em `vw` (ex.: `lg:px-[12vw] xl:px-[16vw] 2xl:px-[18vw]`), para o espaço até as bordas da tela crescer com o viewport

**Roteamento:**
- `react-router-dom`: `/` = landing, `/publicacoes/:slug` = leitura
- **Não** manter `vercel.json` — o site não é publicado na Vercel
- No host escolhido, configurar fallback SPA (`index.html`) se deep links de `/publicacoes/:slug` forem necessários
- Fora da home, links do Header apontam para `/#secao`; logo aponta para `/`

**i18n obrigatório (pt-BR, en, es):**
- `title`, `summary`, `tags` e `Content` nos **três** idiomas em `src/data/publications.ts`
- Tipo `Publication.Content` é `Record<Locale, ComponentType>` — sem fallback parcial
- Corpo do artigo: um componente por locale (ex.: `ArquiteturaCloudContentPt` / `En` / `Es`)
- Textos, `alt`, captions, títulos de callout e labels do Mermaid traduzidos

**Como adicionar uma publicação:**
1. Criar o conteúdo em `src/content/publications/<slug>.tsx` com versões **pt-BR**, **en** e **es**
2. Registrar metadados (`title`, `summary`, `tags`, `Content`) nos três idiomas em `src/data/publications.ts`
3. Colocar imagens em `public/images/publications/<slug>/`

**Componentes:** `PublicationsSection`, `PublicationCard`, `PublicationPage`, kit `article/`

---

### 4.16 Footer

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
- Publicações com páginas dedicadas e diagramas Mermaid
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

### Idioma e i18n

Locales suportados: **`pt-BR`**, **`en`**, **`es`**. Toda página e seção visível ao usuário deve funcionar nos três.

- **Código** (variáveis, funções, tipos, nomes de arquivo): inglês
- **Conteúdo da UI** (títulos, subtítulos, labels, aria, botões): nos três locales via `src/data/copy.ts` + `useTranslations()`
- **Dados de domínio** (projetos, experiências, publicações, etc.): tipados por locale (`*ByLocale` / `Record<Locale, …>`)
- **Não** hardcodar texto de UI em um único idioma dentro de componentes
- **Não** deixar fallback silencioso para `pt-BR` em conteúdo novo — implementar os três idiomas
- Troca de idioma via `LocaleToggle` deve atualizar landing **e** páginas de rota (ex.: publicação)
- Commits e PRs: português ou inglês — manter consistência

### Comentários no código

- **Proibido** comentários no código-fonte: `//`, `/* */`, `/** */`, `{/* */}`
- Isso inclui JSDoc (`@deprecated`, etc.) e comentários em CSS
- Exceção: strings de conteúdo que apenas **parecem** comentário (ex.: eyebrow `"// engenheiro cloud-native"`) — são copy, não comentário de código
- Preferir nomes claros e estrutura legível em vez de explicar com comentários

### Nome deste documento

- O arquivo de convenções chama-se **`AGENTS.md`** (sempre uppercase)
- Em macOS (FS case-insensitive), renomear no Git com dois passos: `git mv agents.md temp.md && git mv temp.md AGENTS.md`
- Referências em README e docs devem usar `AGENTS.md`

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

// education.ts, result.ts, specialization.ts, tech-category.ts, process-step.ts, publication.ts
// — seguir o mesmo padrão
```

Conteúdo estático correspondente em `src/data/` — um arquivo por entidade.

Corpo das publicações em `src/content/publications/` (TSX), registradas em `src/data/publications.ts`.

Exemplo de tipo de publicação (sempre com os três locales):

```ts
export interface Publication {
  id: string;
  slug: string;
  publishedAt: string;
  tags: Record<Locale, string[]>;
  coverImage: string;
  title: PublicationLocalizedText;
  summary: PublicationLocalizedText;
  Content: Record<Locale, ComponentType>;
}
```

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

Usar tokens:

```css
padding: var(--spacing-section);
color: var(--color-text-primary);
```

Evitar valores soltos repetidos:

```css
padding: 80px 0;
color: #333;
```

### Tailwind v4 — `max-w-*` vs `--spacing-*`

Neste projeto, tokens `--spacing-md`, `--spacing-xl`, `--spacing-3xl`, etc. estão definidos em `@theme`.

Sem tokens `--max-width-*` explícitos, utilitários como `max-w-3xl` **caem no spacing** (ex.: `max-w-3xl` → `64px`) e esmagam o layout.

**Regra:** manter em `globals.css` / `@theme` a escala:

```css
--max-width-md: 28rem;
--max-width-lg: 32rem;
--max-width-xl: 36rem;
--max-width-2xl: 42rem;
--max-width-3xl: 48rem;
--max-width-4xl: 56rem;
--max-width-5xl: 64rem;
--max-width-prose: 65ch;
```

Antes de usar `max-w-*` novo, confirmar que o token `--max-width-*` correspondente existe.

Containers de leitura/publicação: preferir padding lateral explícito (e `vw` no desktop) em vez de depender só de `max-w-*` para “margem até a borda da tela”.

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
- `lang` do `<html>` alinhado ao locale ativo (`pt-BR` / `en` / `es`)
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

Escopos sugeridos: `hero`, `about`, `projects`, `publications`, `contact`, `ui`, `theme`, `data`, `i18n`

### O que não commitar

- `.env`, chaves de API, credenciais
- `node_modules/`, `dist/`
- Arquivos gerados automaticamente

---

## 14. Instruções para agentes de IA

### Fonte de verdade

1. **Sempre** ler e seguir este `AGENTS.md` antes de implementar
2. Em conflito entre memória/treino e este arquivo, **prevalece o `AGENTS.md`**
3. Quando o usuário definir uma regra, preferência ou convenção nova (mesmo em conversa informal), **atualizar imediatamente este `AGENTS.md`** na mesma tarefa — não esperar pedido explícito de documentação
4. Manter a tabela de **Regras críticas** e as seções relevantes alinhadas à prática real do repo

### Antes de codar

1. Ler este `AGENTS.md` e o `README.md`
2. Identificar qual seção está sendo implementada (seção 4)
3. Seguir convenções e estrutura de pastas existentes
4. Usar Yarn (nunca npm) para qualquer operação de pacotes ou scripts

### Durante a implementação

1. **Escopo mínimo** — implementar só a seção ou feature pedida
2. **Dados em `data/`** — nunca hardcodar conteúdo nos componentes
3. **i18n completo** — pt-BR, en e es para todo texto novo visível
4. **Reutilizar** componentes de `ui/` / `article/` antes de criar novos
5. **Sem comentários** no código-fonte
6. **Não over-engineer** — sem abstrações prematuras
7. **Não commitar** a menos que o usuário peça explicitamente
8. **Registrar regras novas** neste `AGENTS.md` assim que o usuário as descrever

### Checklist antes de finalizar

- [ ] Seção na ordem correta em `HomePage` / rotas em `App.tsx`
- [ ] `id` de âncora definido na seção (quando aplicável)
- [ ] Dados tipados em `types/` e separados em `data/` / `content/`
- [ ] Conteúdo e UI nos três locales (pt-BR, en, es)
- [ ] Animações respeitam `prefers-reduced-motion`
- [ ] Componentes acessíveis (semântica, alt, foco, labels)
- [ ] Responsivo (mobile first); páginas de publicação com mesma margem lateral em todos os blocos
- [ ] Sem comentários no código alterado
- [ ] Sem `any` desnecessário
- [ ] Mudança mínima e focada no pedido
- [ ] Se usou `max-w-*`, o token `--max-width-*` correspondente existe em `@theme`
- [ ] Dependências/scripts via Yarn; sem `package-lock.json` gerado
- [ ] Regras novas do usuário refletidas neste `AGENTS.md` (se houver)

### O que não fazer

- Reorganizar todas as seções sem solicitação
- Adicionar bibliotecas sem justificativa (ex.: outra lib de animação além do Framer Motion)
- Hardcodar textos, projetos ou métricas nos componentes (e em um único idioma)
- Criar publicação só em pt-BR com fallback implícito
- Usar `max-w-3xl` (etc.) sem garantir `--max-width-3xl` no tema
- Deixar capa/botão/texto da publicação com larguras laterais diferentes
- Adicionar comentários no código
- Renomear este arquivo para `agents.md` (lowercase)
- Usar `npm` / gerar `package-lock.json`
- Criar ou manter `vercel.json` (deploy não é na Vercel)
- Ignorar este `AGENTS.md` ou deixar de atualizá-lo quando o usuário criar uma regra nova
- Criar componentes monolíticos com toda a landing page
- Alterar formatação de arquivos não relacionados à tarefa

---

## 15. Evolução deste documento

- Atualizar quando novas seções ou convenções forem adotadas
- **Sempre que o usuário descrever uma regra** (preferência de ferramenta, estilo, i18n, git, UI, etc.), incorporá-la neste arquivo na mesma alteração
- Regras muito específicas podem ir para `.cursor/rules/*.mdc`, mas **este `AGENTS.md` permanece a fonte principal**
- Manter o nome do arquivo sempre como `AGENTS.md` (uppercase)
- Manter este arquivo como fonte única de verdade para organização e qualidade
