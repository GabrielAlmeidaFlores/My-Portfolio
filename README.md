<p align="center">
  <img src="./public/images/memoji-contact.png" alt="Gabriel Flores" width="140" />
</p>

<h1 align="center">João Gabriel Almeida Flores</h1>

<p align="center">
  <strong>Software Developer · Cloud Architect · SysAdmin · DevOps</strong>
</p>

<p align="center">
  I turn complex challenges into scalable, secure, cloud-native platforms:
  from architecture to production, with a focus on infrastructure and continuous delivery of value.
</p>

<p align="center">
  <a href="https://gabrielflores.kybers.com.br">
    <img src="https://img.shields.io/badge/Visit_site-2567A8?style=for-the-badge" alt="Visit site" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/GabrielAlmeidaFlores">GitHub</a>
  ·
  <a href="https://www.linkedin.com/in/joao-gabriel-flores/">LinkedIn</a>
  ·
  <a href="mailto:gabrielalmeidaflores@hotmail.com">Email</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

---

## Why this portfolio?

This is not a generic “just another developer” website. It is a professional showcase for architecture, cloud, and engineering work, with real projects, a current stack, and a focus on business impact.

**What you will find here**

- Experience in cloud-native platforms (AWS & Azure), CI/CD, and multi-tenant systems, including work at Ousion
- Product and open-source projects: **Pulse**, **XCheck**, **HTTP-CLI**
- Full stack coverage: backend, frontend, DevOps, databases, and observability
- AWS, GCP, and Linux certifications
- Direct contact for conversations about architecture, cloud, and opportunities

If you are looking for someone who connects **code, infrastructure, and architecture**, this is the right place.

---

## About the project

A React single-page landing designed for a strong first impression, technical credibility, and conversion. Priorities: performance, accessibility, subtle animations, and maintainable code.

| Layer         | Technology            |
|---------------|-----------------------|
| Framework     | React                 |
| Build         | Vite                  |
| Language      | TypeScript            |
| Styles        | Tailwind CSS          |
| Animations    | Framer Motion + GSAP  |
| Routing       | React Router          |
| Diagrams      | Mermaid (lazy loaded) |
| Highlights    | Prism                 |
| Package mgr   | Yarn                  |
| Lint          | Oxlint                |

---

## Getting started

```bash
git clone <repository-url>
cd Gabriel-Flores-Portfolio
yarn
yarn dev
```

Open [http://localhost:5173](http://localhost:5173).

| Command        | Description              |
|----------------|--------------------------|
| `yarn`         | Install dependencies     |
| `yarn dev`     | Development server       |
| `yarn build`   | Production build         |
| `yarn preview` | Preview the build        |
| `yarn lint`    | Lint with Oxlint         |

This project uses **Yarn only** (`yarn.lock`). Do not use `npm` or create a `package-lock.json`.

---

## Landing sections

| #  | Section           |
|----|-------------------|
| 1  | Hero              |
| 2  | Experience        |
| 3  | Featured Projects |
| 4  | Posts             |
| 5  | Certifications    |
| 6  | Technologies      |
| 7  | Education         |
| 8  | Contact           |

Additional route:

- `/publicacoes/:slug` renders the full publication page.

Conventions and implementation details: [`AGENTS.md`](./AGENTS.md).

---

## Structure

```
Gabriel-Flores-Portfolio/
├── public/                    # assets, CV, icons
│   └── images/publications/   # covers and post images
├── src/
│   ├── components/            # article, layout, sections, ui
│   ├── content/publications/  # post bodies by slug and locale
│   ├── data/                  # typed content
│   ├── hooks/
│   ├── i18n/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   ├── theme/
│   └── types/
├── AGENTS.md
└── README.md
```

---

## Publications

Technical notes rendered from JSX with the `article/` kit:

- Desktop grid paginated at 4 posts per page; mobile keeps the carousel
- Dedicated reading page at `/publicacoes/:slug`
- Table of contents with active heading tracking on desktop
- Code blocks with Prism highlighting themed through `--syntax-*` tokens and a copy button
- Mermaid-only post diagrams with semantic color/shape roles and an animated viewer for zoom, pan, reset, and SVG download
- External benchmark data presented as tables with source links
- Mermaid diagrams loaded lazily
- Cover and image text always in English
- Body content in pt-BR, en, and es

---

## UX highlights

- Experience timeline with stack pills
- Project carousel with preview and CTA
- Light/dark theme
- Lightweight animations (Framer Motion + GSAP)
- i18n (pt-BR / en / es)
- Accessible modals and keyboard navigation

---

<p align="center">
  <sub>Personal project · João Gabriel Almeida Flores · All rights reserved</sub>
</p>
