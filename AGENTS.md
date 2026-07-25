# Agents | Guia de Boas Práticas

Este documento define as convenções do projeto **Gabriel-Flores-Portfolio**. Agentes de IA e desenvolvedores devem seguir estas diretrizes para manter a estrutura organizada, o código consistente e a qualidade alta.

---

## 1. Visão geral do projeto

Landing page profissional em **React** (com rotas para publicações) para Gabriel. Prioridades:

1. **Clareza**: código legível e fácil de manter
2. **Performance**: carregamento rápido e experiência fluida
3. **Acessibilidade**: utilizável por todos
4. **Escopo mínimo**: resolver o problema sem over-engineering
5. **Impacto visual**: animações discretas, sem prejudicar performance

### Regras críticas (sempre)

| Regra | Detalhe |
|---|---|
| Sem comentários no código | Proibido `//`, `/* */`, `/** */`, `{/* */}` |
| i18n completo | Todo conteúdo/UI novo em **pt-BR**, **en** e **es** |
| Arquivo de regras | Sempre `AGENTS.md` (uppercase) |
| Package manager | **Somente Yarn**: nunca `npm`; lockfile único: `yarn.lock` |
| Sem Vercel | Não usar `vercel.json` nem assumir deploy na Vercel |
| Sem código morto | Seção/data/type só existe se montada em `HomePage` ou rotas de `App` |
| Docs = código | Mudou ordem/seções → atualizar `AGENTS.md` e `README` na mesma tarefa |
| Tema compartilhado | Só via `ThemeProvider`: proibido estado de tema local no toggle |
| Deps pesadas | Mermaid e libs grandes com `import()` dinâmico; rotas com `React.lazy` |
| Sem exports legados | Proibido `export const x = xByLocale["pt-BR"]` |
| Dados fora de componentes | Conteúdo em `data/` / `content/`, tipado em `types/` |
| Publicações | JSX + kit `article/`; mesma margem lateral; corpo nos 3 idiomas |
| Prosa de publicações | Leitura leve e completa; storytelling; diagrama após o texto e com blocos compactos; termos explicados na 1ª menção e linkados em toda ocorrência legível |
| `max-w-*` | Exige token `--max-width-*` em `@theme` (não misturar com `--spacing-*`) |
| Sem travessão (`—`) | Proibido em **todo** o site: UI, `data/`, meta SEO, README e publicações. Preferir ponto, vírgula, dois pontos, `|` ou hífen simples em ranges/títulos oficiais |
| Sem se apresentar como Tech Lead | Não usar "Tech Lead" / "Líder Técnico" fora da experiência na **Ousion** |
| Atualizar `AGENTS.md` | Toda regra nova descrita pelo usuário deve ser registrada aqui |

---

## 2. Stack

| Camada | Tecnologia |
|---|---|
| Framework | React |
| Build | Vite |
| Linguagem | TypeScript |
| Estilos | Tailwind CSS |
| Animações | Framer Motion (UI) + GSAP/ScrollTrigger (scroll) |
| Roteamento | React Router |
| Diagramas | Mermaid (lazy / dynamic import) |
| Package manager | Yarn (`yarn.lock` apenas) |
| Tema | `ThemeProvider` compartilhado |
| Lint | Oxlint |
| Ícones | Lucide React (tree-shakeable) |

### Package manager (Yarn only)

- Usar **apenas Yarn** para instalar, adicionar, remover e rodar scripts
- Comandos permitidos: `yarn`, `yarn add`, `yarn remove`, `yarn install`, `yarn dev`, `yarn build`, `yarn lint`, `yarn preview`, etc.
- **Proibido** `npm`, `npm install`, `npm run`, `npx` (exceto quando não houver equivalente Yarn e for inevitável: preferir `yarn dlx`)
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
│   ├── theme/               # ThemeProvider + themeContext
│   ├── i18n/                # LocaleProvider + localeContext
│   ├── hooks/               # useTheme, useModal, useTypingAnimation...
│   ├── lib/                 # Utilitários, validações, constantes
│   ├── styles/              # globals.css, tokens, tema claro/escuro
│   ├── types/               # Um arquivo por entidade de dados
│   ├── data/                # Conteúdo estático (fatiar se > ~300 linhas)
│   │   └── software-pipelines/
│   ├── App.tsx              # Rotas + shell (Header/Footer)
│   └── main.tsx
├── AGENTS.md
└── README.md
```

### Mapeamento `sections/` (apenas seções montadas)

```
sections/
├── hero/
│   └── HeroSection.tsx
├── experience/
│   └── ExperienceSection.tsx
├── projects/
│   ├── ProjectsSection.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectCarousel.tsx
│   └── ProjectModal.tsx
├── technologies/
│   └── TechnologiesSection.tsx
├── software-engineering/
│   ├── SoftwareEngineeringSection.tsx
│   └── SoftwareEngineeringCarousel.tsx
├── certifications/
│   ├── CertificationsSection.tsx
│   └── CertificationBadge.tsx
├── education/
│   └── EducationSection.tsx
├── publications/
│   ├── PublicationsSection.tsx
│   └── PublicationCard.tsx
└── contact/
    └── ContactSection.tsx
```

### Regras de organização

| Onde colocar | Critério |
|---|---|
| `components/ui/` | Componente genérico usado em 2+ seções |
| `components/article/` | Componentes tipográficos reutilizáveis em publicações |
| `components/sections/` | Bloco visual de uma seção **montada** na HomePage |
| `components/layout/` | Header, Footer, navegação, wrapper global |
| `content/publications/` | Corpo JSX de cada publicação |
| `pages/` | Páginas com rota própria (home, publicação) |
| `theme/` | Provider e contexto de tema claro/escuro |
| `hooks/` | Lógica reutilizável com estado ou efeitos |
| `lib/` | Funções puras, formatadores, validações |
| `data/` | Arrays/objetos de conteúdo estático |
| `types/` | Interfaces e tipos compartilhados |

**Não criar** pastas genéricas como `utils/`, `helpers/` e `misc/`: usar apenas `lib/`.

**Não manter** seção, data ou type no repositório se não estiver em uso na `HomePage` ou em rotas de `App`. Ao desativar uma seção, deletar código e dados na mesma alteração.

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
  <CertificationsSection />
  <EducationSection />
  <PublicationsSection />
  <SoftwareEngineeringSection />
  <ContactSection />
</main>
<Footer />
```

Rotas adicionais:

- `/publicacoes/:slug` → `PublicationPage` (leitura completa do artigo)

---

### 4.1 Hero

**Objetivo:** primeira impressão.

**Conteúdo:** nome, cargo, tagline, CTAs (trajetória, projetos, CV, contato), foto, bloco de código animado.

**Componentes:** `HeroSection`

---

### 4.2 Experiência Profissional

**Objetivo:** timeline / cards de carreira.

**Cada item:** empresa, cargo, período, responsabilidades, stack.

**Componentes:** `ExperienceSection`

---

### 4.3 Projetos em Destaque

**Objetivo:** carrossel de projetos com detalhe.

**Componentes:** `ProjectsSection`, `ProjectCarousel`, `ProjectCard`, `ProjectModal`

---

### 4.4 Tecnologias

**Objetivo:** stack filtrável com modal de relações (projetos, certificações, experiências).

**Componentes:** `TechnologiesSection`

---

### 4.5 Certificações

**Objetivo:** badges de credenciais.

**i18n:** nomes oficiais da emissora podem permanecer em inglês; labels de UI (`copy.certifications.*`) sempre nos 3 idiomas.

**Componentes:** `CertificationsSection`, `CertificationBadge`

---

### 4.6 Formação

**Objetivo:** trajetória acadêmica.

**Componentes:** `EducationSection`

---

### 4.7 Publicações

**Objetivo:** artigos e notas técnicas estilo documentação, com página dedicada.

**Listagem (landing):** cards com capa, título, resumo, data e tags → link para `/publicacoes/:slug`

**Página de leitura (`PublicationPage` / rota `/publicacoes/:slug`):**
- Botão voltar para `/#publicacoes`
- Metadados + capa + corpo do artigo
- Corpo em **JSX** com kit `components/article/`
- Imagens em `public/images/publications/<slug>/` via `ArticleImg` (`alt` obrigatório; preferir baixar da web/docs oficiais a hotlink)
- Diagramas via `ArticleMermaid` (`import()` dinâmico; `ariaLabel` obrigatório); usar quando não houver imagem pronta adequada
- Em cada H2/H3: aplicar o **teste visual** (imagem da web primeiro; Mermaid como fallback)
- Antes da Conclusão: seção **Key takeaways** / Pontos-chave / Puntos clave (lista curta)
- `ArticleCallout` exige `title` traduzido

**Layout:** botão, título, capa e corpo com a **mesma margem lateral**; mobile `px-4`; desktop paddings em `vw`

**Roteamento:** sem `vercel.json`; lazy load de `PublicationPage`; fora da home, Header usa `/#secao`

**i18n:** `title`, `summary`, `tags`, `Content` nos três locales: sem fallback parcial

**Componentes:** `PublicationsSection`, `PublicationCard`, `PublicationPage`, kit `article/`

#### Tom e prosa das publicações (obrigatório)

Escrever como desenvolvedor sênior em blog pessoal ou post técnico no LinkedIn: experiência real, voz humana, ritmo agradável. O leitor precisa sentir que alguém viveu o problema e está contando a decisão.

**Objetivo da leitura (norte):**

Proporcionar uma **leitura leve**, mas **completa**. O leitor deve ir entendendo o objetivo do post conforme avança, sem quebrar a cabeça. Tudo que importa fica explícito e explicado. A sensação final é: “entendi de verdade o que foi decidido e por quê”, não “li um monte de jargão e um diagrama bonito”.

**Storytelling (ordem da compreensão):**

1. Começar pelo **problema vivido** (o que doeu, em que contexto), com **introdução que conecta**.
2. Explicar **conceitos e termos** na hora em que aparecem, em linguagem clara.
3. Mostrar **alternativas** e o raciocínio de escolha.
4. Só então usar **diagrama, tabela ou código** como reforço visual/prático.
5. Antes da conclusão, uma seção **Key takeaways** (obrigatória em todo post).
6. Fechar com **Conclusão** em prosa (nunca “Executive summary”).

O post guia o leitor. Cada seção prepara a seguinte. Nada assume que o leitor “já sabe”.

**Introdução (obrigatória, clara e conectada):**

A abertura do post (primeiro H2 e os parágrafos iniciais, antes das subseções) precisa passar conexão, não só atmosfera. Em poucas linhas o leitor deve conseguir responder:
1. **Sobre o que é este post?** (tese / o que foi montado ou decidido)
2. **Por que isso importa agora?** (situação concreta do dia a dia)
3. **Qual o fio até o resto do texto?** (o que vem a seguir: alternativas, setup, etc.)

Proibido abrir com metáforas soltas, frases de efeito sem âncora (“gira em falso”, “plus legal”, “borda local”) ou dois parágrafos que listam sintomas sem dizer o que o artigo resolve. Preferir: contexto → dor concreta → o que você fez / o que o post cobre → ponte para a próxima seção. Se a introdução não sobreviver ao teste “um colega lê só isso e sabe para onde o texto vai”, reescrever. A mesma clareza vale para ponteiros antes de diagrama: o parágrafo deve dizer em português/inglês/espanhol plain o que o desenho resume, sem jargão novo.

**Regras de ouro:**

1. **Proibido travessão (`—`) em qualquer lugar do site.** Vale para publicações, copy de UI, dados (`data/`), meta SEO (`index.html`, `siteMeta`), README e textos de componentes. Preferir ponto, vírgula, dois pontos, `|` em títulos, ou “a”/“to”/“-” em períodos (ex.: `Abril 2024 a Atual`). Hífen em compostos técnicos (`cloud-native`, `rate-limit`) permanece ok. Nomes oficiais com travessão (ex. certificações AWS) devem usar hífen simples (`Developer - Associate`).
2. **Parágrafos simples, uma ideia por bloco.** Preferir parágrafos curtos (em geral 1 a 3 frases) com **uma ideia principal**. Proibido amontoar tese + dor + três caminhos + ponte para a próxima seção no mesmo parágrafo. Se o bloco mistura 3+ assuntos distintos, quebrar em parágrafos menores ou em lista.
3. **Ritmo:** variar tamanho de frase. Misturar frases curtas e diretas com períodos um pouco mais longos que descrevem o porquê. Evitar período único com várias cláusulas separadas por ponto e vírgula encadeando ideias diferentes.
4. **Lista quando houver várias ideias paralelas ou um fluxo em passos.** Se o trecho compara opções, enumera falhas, resume um diagrama, lista sintomas/caminhos **ou descreve um fluxo** (pesquisar, ler, aplicar, validar), **use lista** (`ArticleUl` / `ArticleOl`). Fica mais legível que um parágrafo complexo. Narrativa contínua fica para explicar um mecanismo único em prosa curta. Troubleshooting, takeaways, comparativos e pontes antes de diagrama são candidatos naturais a lista.
   - **Proibido cadeia com seta (`→`) no corpo do post.** Não escrever `pesquisar → ler → aplicar → validar` nem `search → fetch → síntese`. Preferir `ArticleOl` / `ArticleUl`. A seta `→` em Mermaid (`A --> B`), em tabelas de docs internas do `AGENTS.md`, ou em código/config, não conta. Vale para o texto legível pelo leitor nas publicações (`pt-BR` / `en` / `es`).
5. **Diagramas são complementares, nunca a primeira explicação.**
   - Antes de qualquer Mermaid (ou figura), o texto já deve ter apresentado os assuntos, termos e relações que o diagrama mostra.
   - O diagrama reforça, resume e torna o fluxo **chamativo e completo**, mas não substitui a prosa.
   - Se o leitor pular o diagrama, ainda precisa conseguir entender o ponto só com o texto.
   - Se o leitor olhar só o diagrama depois de ler o trecho, ele deve reconhecer o que acabou de ler (não descobrir conceito novo pela primeira vez).
   - O parágrafo (ou lista) imediatamente antes do diagrama deve ser **simples e escaneável**, não um resumo denso de tudo.
   - **Blocos compactos:** nós do Mermaid não podem ficar exageradamente grandes. Preferir rótulos curtos (1 linha de título + no máximo 1 linha de apoio). Detalhe longo fica no texto ao redor, não dentro do retângulo. Evitar parágrafos inteiros dentro do nó; se precisar de explicação, usar um nó “dica/leitura” separado e curto, ou só a prosa.
6. **Teste visual por seção (obrigatório ao escrever ou revisar cada H2/H3).** Enquanto redige, a IA deve se perguntar: “Um reforço visual ajudaria o leitor a entender o que esta seção acabou de explicar?” Se sim, adicionar. Se o trecho já é óbvio com prosa curta (ex.: um callout de troubleshooting), pode ficar só texto.
   - **Prioridade 1: imagem pronta da web.** Buscar diagrama, screenshot oficial, figura de documentação ou ilustração já existente que esclareça o conceito. Baixar para `public/images/publications/<slug>/` (não hotlink frágil) e usar `ArticleImg` com `alt` descritivo e `caption` quando fizer sentido. Preferir fontes oficiais/docs; respeitar licença e atribuição quando exigida.
   - **Prioridade 2: Mermaid (`ArticleMermaid`).** Só se não houver imagem boa e estável na web, ou se o fluxo for específico demais deste post (decisão A/B/C, arquitetura desta stack). Continua valendo a regra 5 (texto antes; blocos compactos; `ariaLabel` obrigatório).
   - Não encher o post de visual por obrigação: um reforço por ideia densa basta. Evitar duplicar a mesma informação em imagem e Mermaid na mesma subseção.
7. **Tabelas** seguem a mesma lógica: comparar depois de explicar; não abrir a seção com tabela crua.
8. **Termos e tecnologias: explicar + linkar (obrigatório).**
   - Na primeira menção relevante de um termo, tecnologia, protocolo, ferramenta ou benchmark que o leitor possa não dominar, fazer **duas coisas**: (a) explicar em linguagem simples o que é e para que serve neste contexto; (b) linkar a documentação oficial ou página confiável.
   - **Toda ocorrência legível** desse termo no corpo do post também leva o mesmo link (parágrafos, listas, tabelas, callouts, legendas/`caption`). Exceção: atributo `alt` de imagem (texto plano, sem HTML).
   - Exemplos: MCP, SearXNG, SimpleQA, FRAMES, grounding, metasearch, rate-limit, loopback, Docker, SaaS, CAPTCHA, JSON-RPC, stdio, npx, Node.js, tools do agente, timeout HTTP, etc.
   - Proibido soltar jargão (“payload”, “stdio”, “bind”, “engine”, “borda”, “edge”, “SimpleQA”) como se fosse óbvio sem uma frase de apoio na primeira menção.
   - Proibido metáfora técnica sem âncora (“borda local”, “beco”, “gira em falso”) no lugar de uma frase concreta. Se a ideia é “rodar o serviço de busca na minha máquina”, escrever isso. O leitor não precisa adivinhar o que a metáfora quis dizer.
   - Links com `target="_blank"` e `rel="noopener noreferrer"`. Uma URL de referência boa por termo; o link se repete em cada ocorrência do nome.
9. **Proibido seção rasa.** Se um H2/H3 apresenta uma peça da arquitetura (cliente, servidor, serviço, tool) **ou uma alternativa de decisão** (opção A/B/C, caminho X vs Y), o texto precisa dizer o que é, o que faz, **como funciona na prática** (fluxo: quem chama quem, o que volta), por que existe na stack e como se conecta ao restante. Um parágrafo genérico de três frases com só veredito (“bom para demo, ruim no dia a dia”) não basta.
10. **Teste do leitor (obrigatório em toda seção nova ou reescrita).** Ao criar ou revisar um H2/H3, perguntar sempre: “Será que o usuário vai entender o que estou falando, ou preciso detalhar mais?” Em concreto: alguém sem o contexto da conversa consegue explicar de volta o mecanismo, não só o slogan? Se a resposta for dudosa, expandir com passo a passo, exemplo do dia a dia e o que quebra. Preferir uma seção um pouco mais longa e clara a uma seção curta que pressupõe que o leitor “já sabe”.
11. **Explicitar o óbvio técnico quando ele for a chave da compreensão.** Ex.: “local ≠ offline”, “JSON precisa estar habilitado”, “o agente usa tools, não abre o navegador”.
12. **Pronome com referente explícito (obrigatório).** Proibido “ele / ela / isso / it” como atalho quando o leitor puder perguntar “quem?” ou “o quê?”. Preferir repetir o sujeito pelo nome: “o agente”, “o SearXNG”, “o pacote MCP”, “o modelo”. Vale sobretudo depois de lista, parágrafo com vários substantivos, ou início de frase nova. Ex.: errado: “Sem acesso à web, ele chuta versão errada.” Certo: “Sem acesso à web, o agente chuta versão errada.”
13. **Tom:** coloquial profissional, técnico e direto. Contar o que falhou, o que foi descartado e por quê. Sem marketing, sem autoajuda.
14. **Proibido tom de “medo/incapacidade”.** Não escrever frases que soem como defesa pessoal (“não por medo de código”, “não é falta de capacidade técnica”, “não tenho medo de implementar”). Justificar decisões por foco, ownership, custo de manutenção, prazo ou encaixe no objetivo.
15. **Proibido vocabulário pejorativo ou moralizante.** Evitar palavras como “tentação”, “pecado”, “preguiça”, “atalho sujo” e similares para descrever escolhas técnicas. Preferir neutro: “caminho comum”, “alternativa”, “opção rápida”, “atalho operacional”.
16. **Proibido clichês de IA / copy genérica**, inclusive (lista não exaustiva): "no cenário atual", "além disso", "além do mais", "crucial", "em suma", "vale ressaltar", "cabe destacar", "portanto", "neste contexto", "é importante destacar", "sem mais delongas", "journey", "unlock", "game-changer", "robust solution", "seamless", "leverage".
17. **Proibido** apresentar o autor como Tech Lead / Líder Técnico (ver regra de identidade).
18. **i18n:** as mesmas regras de prosa valem para `pt-BR`, `en` e `es`. Adaptar idioma; não traduzir palavra a palavra de forma engessada.
19. **Código e configs:** blocos reais, copiáveis, com o mínimo necessário. Explicar o “porquê” no parágrafo anterior ou seguinte, não com comentários dentro do snippet (código do repo também não leva comentários).
20. **Key takeaways antes da Conclusão (obrigatório em todo post).** Todo artigo termina com uma seção H3 de takeaways imediatamente **antes** da Conclusão. Títulos: **Pontos-chave** (`pt-BR`), **Key takeaways** (`en`), **Puntos clave** (`es`). Conteúdo: lista curta (tipicamente 4 a 7 itens) com o que o leitor deve lembrar ou fazer; cada item em uma frase acionável, sem repetir a conclusão em prosa. Aqui a lista é bem-vinda (é checklist de retenção, não narrativa). Não inventar ponto novo que o post não defendeu.
21. **Fechamento = Conclusão, nunca “Executive summary”.** Proibido títulos ou seções no estilo *Executive summary* / *Resumo executivo* / *Resumen ejecutivo*. Preferir **Conclusão** (`pt-BR`), **Conclusion** (`en`), **Conclusión** (`es`): fechamento humano, em prosa, sem tom de relatório corporativo. A Conclusão vem **depois** dos Key takeaways.

**Checklist rápido de prosa:**

- [ ] Leitura leve e completa: o leitor entende o objetivo sem quebrar a cabeça
- [ ] Pronomes com referente explícito (agente, SearXNG, pacote…, não “ele” solto)
- [ ] Parágrafos simples (uma ideia por bloco); lista quando houver várias ideias paralelas ou fluxo em passos
- [ ] Sem cadeia com seta (`→`) no corpo do post; fluxo vira lista
- [ ] Introdução conectada: tese + dor concreta + para onde o post vai (sem metáfora solta)
- [ ] Storytelling: problema → conceitos → alternativas → reforço visual/código → key takeaways → conclusão
- [ ] Key takeaways (H3) imediatamente antes da Conclusão; lista curta e acionável
- [ ] Nenhum diagrama/imagem antes do texto que explica o que ele mostra
- [ ] Teste visual por seção: imagem da web (baixada em `public/…`) ou Mermaid se fizer falta; sem visual inútil
- [ ] Diagrama complementar, completo, legível e com blocos compactos (sem nós exagerados)
- [ ] Toda tecnologia/termo novo: explicação simples na primeira menção + link em **todas** as ocorrências legíveis
- [ ] Nenhuma subseção rasa (o quê / como funciona / para quê / como se conecta)
- [ ] Teste do leitor: alguém de fora consegue explicar o mecanismo de volta
- [ ] Nenhum travessão (`—`) em lugar nenhum do site (UI, data, meta, artigos)
- [ ] Parágrafos com contexto suficiente (não só frases soltas)
- [ ] Poucas muralhas densas; onde houver várias ideias paralelas, preferir lista
- [ ] Zero clichês da lista acima
- [ ] Sem “Executive summary” / “Resumo executivo”; fechamento como Conclusão (depois dos Key takeaways)
- [ ] Soa como alguém contando uma decisão técnica real

---

### 4.8 Engenharia de Software

**Objetivo:** pipelines / fluxos (cloud, arquitetura, devops, security). Seção “Como eu construo software”: última da home antes do contato.

**Dados:** `src/data/softwarePipelines.ts` (barrel) + `src/data/software-pipelines/`

**Componentes:** `SoftwareEngineeringSection`, `SoftwareEngineeringCarousel`

---

### 4.9 Contato

**Objetivo:** CTA de contato + links sociais / oportunidades.

**Componentes:** `ContactSection`

---

### 4.10 Footer

**Conteúdo:** nome, descrição, copyright, redes.

**Componentes:** `Footer` (em `layout/`)

---

## 5. Diferenciais visuais e animações

- Timeline / carrosséis de projetos e engenharia
- Animações de entrada com Framer Motion: respeitar `prefers-reduced-motion`
- Scroll-driven com GSAP + ScrollTrigger + Lenis (`SmoothScrollProvider`)
- **Framer Motion** = UI/entrada; **GSAP** = scroll: não adicionar terceira lib de animação
- Tema claro/escuro via `ThemeProvider` + `ThemeToggle` + `useTheme`
- Publicações com Mermaid lazy-loaded
- Modais acessíveis onde existirem

---

## 6. Convenções de nomenclatura

### Arquivos e pastas

- **Componentes React:** `PascalCase.tsx`: ex: `ProjectCard.tsx`
- **Pastas de seção:** `kebab-case`: ex: `software-engineering/`
- **Hooks:** `camelCase.ts` com prefixo `use`: ex: `useScrollSpy.ts`
- **Utilitários e tipos:** `camelCase.ts`: ex: `formatDate.ts`, `project.ts`
- **Dados:** `camelCase.ts` plural: ex: `projects.ts`, `certifications.ts`

### Código

- **Componentes:** `PascalCase`: `function HeroSection()`
- **Funções e variáveis:** `camelCase`
- **Tipos e interfaces:** `PascalCase`
- **Booleanos:** prefixo `is`, `has`, `can`
- **Event handlers:** prefixo `handle`
- **IDs de seção:** kebab-case para âncoras: `id="sobre-mim"`, `id="projetos"`

### Idioma e i18n

Locales suportados: **`pt-BR`**, **`en`**, **`es`**. Toda página e seção visível ao usuário deve funcionar nos três.

- **Código** (variáveis, funções, tipos, nomes de arquivo): inglês
- **Conteúdo da UI** (títulos, subtítulos, labels, aria, botões): nos três locales via `src/data/copy.ts` + `useTranslations()`
- **Dados de domínio** (projetos, experiências, publicações, etc.): tipados por locale (`*ByLocale` / `Record<Locale, …>`)
- **Certificações:** nomes oficiais da emissora podem permanecer em inglês; labels de UI sempre localizados
- **Não** hardcodar texto de UI em um único idioma dentro de componentes
- **Não** deixar fallback silencioso para `pt-BR` em conteúdo novo: implementar os três idiomas
- **Não** criar `export const x = xByLocale["pt-BR"]`: consumidores usam `useTranslations` / locale explícito
- Troca de idioma via `LocaleToggle` deve atualizar landing **e** páginas de rota (ex.: publicação)
- Commits e PRs: português ou inglês: manter consistência

### Arquivos de data e performance

- Preferir arquivos de data com menos de **~300 linhas**; fatiar por entidade, locale ou grupo (ex.: `software-pipelines/`)
- Dependências pesadas (Mermaid, etc.): sempre `import()` dinâmico
- Páginas de rota com conteúdo pesado: `React.lazy` + `Suspense`
- Não instalar `@types/*` que conflitam com pacotes que já exportam tipos (ex.: React Router v7)

### Tema

- Estado de tema **somente** via `ThemeProvider` (`src/theme/`) + `useTheme()`
- Proibido `useState` de tema dentro de `ThemeToggle` ou outros controles isolados

### Comentários no código

- **Proibido** comentários no código-fonte: `//`, `/* */`, `/** */`, `{/* */}`
- Isso inclui JSDoc (`@deprecated`, etc.) e comentários em CSS
- Exceção: strings de conteúdo que apenas **parecem** comentário (ex.: eyebrow `"// engenheiro cloud-native"`): são copy, não comentário de código
- Preferir nomes claros e estrutura legível em vez de explicar com comentários

### Apresentação profissional (cargo / identidade)

- **Proibido** apresentar Gabriel como Tech Lead / Líder Técnico em hero, role, highlights, meta SEO, footer, contato, README, schema.org ou copy genérica
- Títulos permitidos na apresentação: Software Developer, Cloud Architect, SysAdmin, DevOps, Arquiteto de Software, etc.
- **Exceção:** o cargo "Líder Técnico" / "Tech Lead" pode aparecer **somente** no item de experiência da empresa **Ousion Soluções em Tecnologia** (`experiences.ts`)
- Não oferecer "Tech Lead" / "Líder Técnico" como oportunidade de contato / interesse profissional
- Evitar frases genéricas de "liderança técnica" / "technical leadership" fora do contexto factual da experiência Ousion

---

## 7. Tipos de dados (`src/types/`)

Cada entidade viva deve ter tipo próprio. Exemplos atuais: `profile.ts`, `experience.ts`, `project.ts`, `certification.ts`, `education.ts`, `publication.ts`, `technology.ts`, `techCategory.ts`, `processPipeline.ts`, `navigation.ts`.

Publicações (sempre com os três locales):

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

Conteúdo estático em `src/data/`: um arquivo (ou pasta fatiada) por entidade.
Corpo das publicações em `src/content/publications/`.

---

## 8. Componentes

### Princípios

1. **Um componente, uma responsabilidade**: dividir se passar de ~150 linhas
2. **Composição sobre props complexas**: preferir `children` a dezenas de props
3. **Dados vêm de `data/`**: componentes não hardcodam conteúdo
4. **Lógica em hooks**: animações, tema, scroll, contadores
5. **Seções são containers**: recebem dados e delegam renderização a subcomponentes

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
- Animações pesadas em todos os elementos: animar só o necessário
- `useEffect` para derivar estado que pode ser calculado diretamente

---

## 9. Estilos e design

- **Tokens centralizados** em `styles/`: cores, espaçamentos, tipografia
- **Tema claro/escuro** via CSS variables + classe `dark` no `<html>`
- **Mobile first**: base mobile, breakpoints para telas maiores
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

### Tailwind v4 | `max-w-*` vs `--spacing-*`

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
- Contadores/animações de entrada: só quando visível (`once: true` / intersection observer)
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
3. Quando o usuário definir uma regra, preferência ou convenção nova (mesmo em conversa informal), **atualizar imediatamente este `AGENTS.md`** na mesma tarefa: não esperar pedido explícito de documentação
4. Manter a tabela de **Regras críticas** e as seções relevantes alinhadas à prática real do repo

### Antes de codar

1. Ler este `AGENTS.md` e o `README.md`
2. Identificar qual seção está sendo implementada (seção 4)
3. Seguir convenções e estrutura de pastas existentes
4. Usar Yarn (nunca npm) para qualquer operação de pacotes ou scripts

### Durante a implementação

1. **Escopo mínimo**: implementar só a seção ou feature pedida
2. **Dados em `data/`**: nunca hardcodar conteúdo nos componentes
3. **i18n completo**: pt-BR, en e es para todo texto novo visível
4. **Reutilizar** componentes de `ui/` / `article/` antes de criar novos
5. **Sem comentários** no código-fonte
6. **Sem código morto**: não deixar seções/data órfãs
7. **Não over-engineer**: sem abstrações prematuras
8. **Não commitar** a menos que o usuário peça explicitamente
9. **Registrar regras novas** neste `AGENTS.md` assim que o usuário as descrever
10. Usar Yarn; ThemeProvider; lazy/dynamic import para deps pesadas

### Checklist antes de finalizar

- [ ] Seção na ordem correta em `HomePage` / rotas em `App.tsx`
- [ ] `id` de âncora definido na seção (quando aplicável)
- [ ] Dados tipados em `types/` e separados em `data/` / `content/`
- [ ] Conteúdo e UI nos três locales (pt-BR, en, es)
- [ ] Sem seções/data/types órfãos (tudo montado ou deletado)
- [ ] `AGENTS.md` / `README` atualizados se a estrutura mudou
- [ ] Animações respeitam `prefers-reduced-motion`
- [ ] Componentes acessíveis (semântica, alt, foco, labels)
- [ ] Responsivo (mobile first); publicações com mesma margem lateral
- [ ] Sem comentários no código alterado
- [ ] Sem exports `x = xByLocale["pt-BR"]`
- [ ] Sem `any` desnecessário
- [ ] Mudança mínima e focada no pedido
- [ ] Se usou `max-w-*`, o token `--max-width-*` correspondente existe em `@theme`
- [ ] Dependências/scripts via Yarn; sem `package-lock.json`
- [ ] Regras novas do usuário refletidas neste `AGENTS.md` (se houver)
- [ ] Publicações: intro conectada; prosa simples; referente explícito (sem “ele” solto); sem seta `→` em fluxo; key takeaways antes da conclusão; teste visual; diagrama após texto; termos explicados na 1ª menção + link em toda ocorrência legível; teste do leitor; sem seção rasa / Executive summary
- [ ] Sem travessão (`—`) em nenhum conteúdo do site (UI, data, meta, README, artigos)

### O que não fazer

- Reorganizar todas as seções sem solicitação
- Adicionar bibliotecas sem justificativa (ex.: terceira lib de animação)
- Hardcodar textos em um único idioma
- Criar publicação só em pt-BR com fallback implícito
- Usar travessão (`—`) em qualquer conteúdo do site (UI, data, meta, README, publicações)
- Escrever publicação com clichês de IA ou prosa telegráfica/staccato
- Colocar diagrama/tabela antes de explicar no texto o que eles mostram
- Encher nó de Mermaid com parágrafo longo (blocos exageradamente grandes)
- Citar tecnologia/jargão sem explicar em linguagem simples na primeira menção, ou sem link em cada ocorrência legível do termo
- Deixar subseção de arquitetura rasa (só nomes, sem o quê / para quê / como se conecta)
- Usar tom de “medo de código” / “falta de capacidade” para justificar decisão técnica
- Usar vocabulário pejorativo/moralizante (“tentação”, etc.) para escolhas técnicas
- Fechar publicação com “Executive summary” / “Resumo executivo” (usar Conclusão)
- Usar `max-w-3xl` sem `--max-width-3xl` no tema
- Deixar capa/botão/texto da publicação com larguras laterais diferentes
- Adicionar comentários no código
- Renomear este arquivo para `agents.md` (lowercase)
- Apresentar como Tech Lead / Líder Técnico fora da experiência Ousion
- Usar `npm` / gerar `package-lock.json`
- Criar ou manter `vercel.json`
- Manter seção/data/type não montados na HomePage/rotas
- Estado de tema local fora do `ThemeProvider`
- Import estático de Mermaid (ou deps equivalentes pesadas)
- Instalar `@types/react-router-dom` junto com React Router v7
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
