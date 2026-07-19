# Portfólio — Gabriel

Landing page profissional em React para apresentar perfil, experiência, projetos, certificações e formas de contato.

## Sobre o projeto

Site de página única (single page) com foco em primeira impressão, credibilidade técnica e conversão. Prioridades: performance, acessibilidade, animações discretas e código fácil de manter.

## Stack

| Camada      | Tecnologia              |
|-------------|-------------------------|
| Framework   | React                   |
| Build       | Vite                    |
| Linguagem   | TypeScript              |
| Estilos     | Tailwind CSS            |
| Animações   | Framer Motion           |
| Deploy      | Vercel                  |
| Lint/Format | ESLint + Prettier       |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- npm, pnpm ou yarn

## Como rodar localmente

```bash
git clone <url-do-repositorio>
cd portifolio-gabriel
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

## Scripts disponíveis

| Comando        | Descrição                          |
|----------------|------------------------------------|
| `npm run dev`  | Servidor de desenvolvimento        |
| `npm run build`| Build de produção                  |
| `npm run preview` | Preview do build de produção    |
| `npm run lint` | Verificação com Oxlint             |

## Estrutura da Landing Page

Ordem das seções na página:

| # | Seção | Componente |
|---|-------|------------|
| 1 | Hero | `HeroSection` |
| 2 | Sobre Mim | `AboutSection` |
| 3 | Estatísticas | `StatsSection` |
| 4 | Experiência Profissional | `ExperienceSection` |
| 5 | Projetos em Destaque | `ProjectsSection` |
| 6 | Tecnologias | `TechnologiesSection` |
| 7 | Certificações | `CertificationsSection` |
| 8 | Resultados Alcançados | `ResultsSection` |
| 9 | Formação | `EducationSection` |
| 10 | Depoimentos | `TestimonialsSection` |
| 11 | Áreas de Especialização | `SpecializationsSection` |
| 12 | Processo de Trabalho | `WorkProcessSection` |
| 13 | CTA | `CtaSection` |
| 14 | Contato | `ContactSection` |
| 15 | Footer | `Footer` |

Detalhes de conteúdo, tipos de dados e convenções estão em [`agents.md`](./agents.md).

## Estrutura de pastas

```
portifolio-gabriel/
├── public/
│   ├── images/
│   ├── fonts/
│   └── cv/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── sections/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   ├── types/
│   ├── data/
│   ├── App.tsx
│   └── main.tsx
├── agents.md
└── README.md
```

## Diferenciais visuais

- Timeline interativa de experiência profissional
- Cards de projetos com hover revelando tecnologias e resultados
- Contadores animados ao entrar na viewport
- Carrossel automático de depoimentos
- Modais detalhados para projetos e certificações
- Animações discretas com Framer Motion
- Modo escuro/claro com preferência do sistema

## Convenções

- **Código** em inglês (variáveis, funções, tipos)
- **Interface** em português (textos visíveis ao usuário)
- **Commits** no formato `tipo(escopo): descrição` — ex: `feat(hero): adiciona seção de apresentação`
- Branch principal: `main`
- Features: `feat/nome-da-feature`

## Deploy

Deploy recomendado na [Vercel](https://vercel.com/), conectando o repositório Git. Cada push na branch `main` pode gerar um deploy automático.

## Licença

Projeto pessoal. Todos os direitos reservados.
