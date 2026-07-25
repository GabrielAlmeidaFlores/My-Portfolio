import {
  ArticleCallout,
  ArticleCode,
  ArticleH2,
  ArticleH3,
  ArticleImg,
  ArticleLi,
  ArticleMermaid,
  ArticleOl,
  ArticleP,
  ArticleTable,
  ArticleTbody,
  ArticleTd,
  ArticleTh,
  ArticleThead,
  ArticleTr,
  ArticleUl,
} from "@/components/article";

const ARCHITECTURE_CHART = `flowchart TB
  Client["1. Cliente MCP / Agente"]
  MCP["2. Servidor MCP"]
  SearX["3. SearXNG local"]
  Engines["4. Engines externas"]

  Client -->|"search_web / fetch_url"| MCP
  MCP -->|"HTTP JSON local"| SearX
  SearX -->|"consulta"| Engines
  Engines -->|"hits"| SearX
  SearX -->|"JSON unificado"| MCP
  MCP -->|"contexto"| Client`;

const SEARXNG_COMPARE_CHART = `flowchart TB
  subgraph Direct["A: scraper direto"]
    direction TB
    A1["Agente"] --> A2["1 engine"]
    A2 --> A3["Bloqueio / CAPTCHA"]
  end

  subgraph Paid["B: API SaaS"]
    direction TB
    B1["Agente"] --> B2["Provedor pago"]
    B2 --> B3["Custo + cota"]
  end

  subgraph Meta["C: SearXNG local"]
    direction TB
    C1["Agente + MCP"] --> C2["SearXNG"]
    C2 --> C3["Varias engines + JSON"]
  end

  Direct --> Escolha["Escolha: C"]
  Paid --> Escolha
  Meta --> Escolha`;

const DECISION_CHART = `flowchart TB
  Start["Busca web no agente"]

  Start --> A["A: scraper MCP"]
  Start --> B["B: MCP + SearXNG"]
  Start --> C["C: MCP custom"]

  A --> ResultA["Smoke test"]
  B --> ResultB["Uso diario"]
  C --> ResultC["Alto esforco"]

  ResultB --> Pick["Decisao: B"]`;

const PROBLEM_CHART = `flowchart TB
  Need["Agente precisa da web"]
  Need --> Paid["API de busca paga"]
  Need --> Scrape["MCP scraper direto"]
  Paid --> PainPaid["Cota / custo / privacidade"]
  Scrape --> PainScrape["CAPTCHA / bloqueio / HTML"]
  PainPaid --> Gap["Falta busca local estavel"]
  PainScrape --> Gap`;

const OPTION_A_CHART = `flowchart LR
  Ag["Agente"] --> Mcp["MCP pronto"]
  Mcp --> Http["HTTP na engine"]
  Http --> Html["HTML / endpoint"]
  Html --> Parse["Parser"]
  Parse --> Out["Snippets"]
  Html -.-> Fail["CAPTCHA / 429"]`;

const OPTION_B_CHART = `flowchart LR
  Ag["Agente"] --> Mcp["MCP pronto"]
  Mcp --> Sx["SearXNG local"]
  Sx --> Eng["Engines"]
  Eng --> Sx
  Sx --> Mcp
  Mcp --> Ag`;

const OPTION_C_CHART = `flowchart LR
  Ag["Agente"] -->|"stdio"| Custom["Seu MCP SDK"]
  Custom --> Code["Seu codigo"]
  Code --> Web["HTTP / scraper / API"]`;

const MCP_ROLES_CHART = `flowchart TB
  Host["Host: Cursor / Copilot"]
  Client["Cliente MCP"]
  Server["Servidor MCP"]
  Host --> Client
  Client -->|"tools / JSON-RPC"| Server`;

const SETUP_CHART = `flowchart LR
  F1["1. SearXNG Docker"] --> F2["2. MCP no cliente"]
  F2 --> F3["3. Aceite rapido"]`;

const linkClass =
  "font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300";

export function BuscaWebLocalMcpSearxngContentPt() {
  return (
    <>
      <ArticleH2>1. O problema que apareceu na prática</ArticleH2>

      <ArticleP>
        Este post conta como eu montei busca web estável para o agente de IA na
        minha máquina. Sem API paga de search. Sem scraper frágil.
      </ArticleP>

      <ArticleP>
        A stack é{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>{" "}
        pronto +{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>{" "}
        local em Docker. Antes do setup, o problema que me trouxe até aqui.
      </ArticleP>

      <ArticleP>
        No dia a dia o agente precisa de informação que não está no repositório
        nem na memória de treino do modelo:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>documentação que mudou ontem</ArticleLi>
        <ArticleLi>changelog de SDK</ArticleLi>
        <ArticleLi>issue aberta na madrugada</ArticleLi>
        <ArticleLi>endpoint que a API deprecateou</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Sem acesso confiável à web, o agente chuta versão errada, inventa detalhe
        ou fica pedindo confirmação. A sessão trava.
      </ArticleP>

      <ArticleP>
        O fluxo que eu quero é direto:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>pesquisar</ArticleLi>
        <ArticleLi>ler um trecho bom</ArticleLi>
        <ArticleLi>aplicar no código</ArticleLi>
        <ArticleLi>validar</ArticleLi>
      </ArticleOl>

      <ArticleP>
        Quando a busca falha no meio, o resto desanda: retenta, alucina ou te
        interrompe. Em sessões longas isso vira atrito real.
      </ArticleP>

      <ArticleP>
        Eu comparei três caminhos e fiquei com o terceiro: API paga, scraper
        MCP, metasearch local. A seguir: o que dói nas APIs comerciais, por que
        scraper “grátis” engana no smoke test, e o que “local” significa neste
        texto.
      </ArticleP>

      <ArticleH3>O que quebra nas APIs de busca pagas</ArticleH3>

      <ArticleP>
        APIs comerciais funcionam bem quando o volume é baixo e a previsibilidade
        importa mais que a conta no fim do mês.
      </ArticleP>

      <ArticleP>
        Desenvolvimento com agente não é “duas queries por dia”. É exploração:
        abrir várias frentes, comparar docs, caçar issues e voltar atrás quando
        a hipótese não se sustenta.
      </ArticleP>

      <ArticleP>
        Nesse ritmo, três coisas apertam:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>preço sobe rápido</ArticleLi>
        <ArticleLi>
          a cota e o{" "}
          <a
            href="https://en.wikipedia.org/wiki/Rate_limiting"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            rate-limit
          </a>{" "}
          chegam quando você quer velocidade
        </ArticleLi>
        <ArticleLi>
          termos sensíveis (cliente, stack, incidente) saem da sua máquina para
          um{" "}
          <a
            href="https://en.wikipedia.org/wiki/Software_as_a_service"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            SaaS
          </a>{" "}
          de terceiros
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Se o fornecedor muda preço, política ou disponibilidade, o seu fluxo
        local quebra junto.
      </ArticleP>

      <ArticleH3>Scrapers “gratuitos” e a falsa sensação de vitória</ArticleH3>

      <ArticleP>
        Outro caminho comum é um pacote{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>{" "}
        pronto que raspa motor público direto (DuckDuckGo e afins).
      </ArticleP>

      <ArticleP>
        Na prática o fluxo é este:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>o agente chama uma tool de busca</ArticleLi>
        <ArticleLi>o servidor MCP baixa a página por HTTP</ArticleLi>
        <ArticleLi>tenta parsear HTML</ArticleLi>
        <ArticleLi>devolve links e snippets</ArticleLi>
      </ArticleOl>

      <ArticleP>
        No smoke test parece mágica: zero conta, zero Docker, resposta na hora.
      </ArticleP>

      <ArticleP>
        Em uso contínuo a história muda:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>IP bloqueia</ArticleLi>
        <ArticleLi>
          <a
            href="https://pt.wikipedia.org/wiki/CAPTCHA"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            CAPTCHA
          </a>{" "}
          aparece
        </ArticleLi>
        <ArticleLi>o layout da página muda e o parser quebra</ArticleLi>
        <ArticleLi>latência vira roleta</ArticleLi>
      </ArticleUl>

      <ArticleP>
        A taxa de falha sobe no padrão de um agente autônomo: muitas consultas
        em rajada, durante horas. É o mesmo mecanismo da opção A na seção
        seguinte.
      </ArticleP>

      <ArticleP>
        O diagrama abaixo resume o que você acabou de ler:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>o agente precisa consultar a web</ArticleLi>
        <ArticleLi>
          API paga falha no uso contínuo por cota e privacidade
        </ArticleLi>
        <ArticleLi>
          scraper MCP público falha por bloqueio e CAPTCHA
        </ArticleLi>
        <ArticleLi>
          a saída que eu busquei: SearXNG + MCP na minha máquina, e o agente
          fala com esse serviço local
        </ArticleLi>
      </ArticleUl>

      <ArticleMermaid
        ariaLabel="Problema: API paga e scraper MCP falham; falta um serviço de busca local estável"
        chart={PROBLEM_CHART}
      />

      <ArticleCallout variant="note" title="O que eu chamo de “local” aqui">
        <ArticleP>
          Local não significa offline. Significa que o SearXNG e o MCP rodam na
          sua máquina.
        </ArticleP>
        <ArticleP>
          Você tira o intermediário SaaS de busca e hospeda a orquestração (
          <a
            href="https://docs.searxng.org/"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            SearXNG
          </a>{" "}
          + MCP) aí. A internet continua existindo. Engines externas continuam
          sendo consultadas. A diferença: a camada que o agente enxerga fica sob
          o seu domínio (porta, secret, ciclo de vida e o que fica exposto na
          rede).
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Se quiser a base oficial do protocolo e do metasearch:{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Model Context Protocol
        </a>{" "}
        e{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          documentação do SearXNG
        </a>
        .
      </ArticleP>

      <ArticleH2>2. Três caminhos que eu coloquei na mesa</ArticleH2>

      <ArticleP>
        Eu não estava caçando a arquitetura mais sofisticada. Queria a opção
        mais estável para uso diário, com o menor custo de ownership possível.
        Três rotas apareceram naturalmente. Antes do desenho, vale entender cada
        uma em texto.
      </ArticleP>

      <ArticleH3>Opção A: MCP pronto com scraper público direto</ArticleH3>

      <ArticleP>
        Nesta opção você instala um pacote MCP de busca pronto (via{" "}
        <a
          href="https://docs.npmjs.com/cli/v10/commands/npm-exec"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          npx
        </a>{" "}
        / Node) e aponta o cliente do agente para o pacote MCP. Não sobe Docker, não
        configura metasearch, não escreve servidor. Em poucos minutos o agente
        ganha uma tool do tipo <ArticleCode>search_web</ArticleCode>: o agente pede
        uma query, o servidor MCP faz a busca e devolve títulos, links e
        snippets para o modelo usar no próximo passo.
      </ArticleP>

      <ArticleP>
        O detalhe que importa é <em>como</em> esse pacote busca. Em geral o pacote
        age como scraper: abre (por HTTP) a página ou endpoint “público” de um
        motor (DuckDuckGo e afins), lê HTML ou uma resposta semi-estruturada, e
        tenta extrair resultados. Não há uma API oficial estável no meio do
        caminho. O MCP é só o adaptador que traduz “tool do agente” em “pedido
        HTTP + parsing”. Setup quase zero, zero infra local, resultado
        imediato. Ótimo para validar a ideia em quinze minutos.
      </ArticleP>

      <ArticleP>
        Como base contínua, essa linha quebra rápido. Sites de busca defendem
        a superfície com anti-bot,{" "}
        <a
          href="https://pt.wikipedia.org/wiki/CAPTCHA"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          CAPTCHA
        </a>{" "}
        (desafio para provar que quem consulta é humano) e{" "}
        <a
          href="https://en.wikipedia.org/wiki/Rate_limiting"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          rate-limit
        </a>{" "}
        (teto de pedidos por IP/tempo). O HTML muda sem aviso e o parser
        silencia. Em sessão longa o agente dispara muitas queries em rajada: é
        exatamente o padrão que o anti-abuso pune primeiro. A ferramenta vira
        roleta. Eu usei como experimento rápido e descartei como linha
        principal.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Fluxo da opção A: agente, MCP scraper, HTML e falha por CAPTCHA ou rate-limit"
        chart={OPTION_A_CHART}
      />

      <ArticleH3>Opção B: MCP pronto + SearXNG local em Docker</ArticleH3>

      <ArticleP>
        Aqui o fluxo muda de papel. O pacote{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>{" "}
        deixa de “raspar a web sozinho”. O pacote MCP vira cliente HTTP de um serviço
        que <em>você</em> hospeda: o{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>
        . Na prática o fluxo é este:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>o agente chama a tool</ArticleLi>
        <ArticleLi>
          o servidor MCP monta um GET/POST para{" "}
          <ArticleCode>http://127.0.0.1:…/search?format=json</ArticleCode>
        </ArticleLi>
        <ArticleLi>o SearXNG espalha a consulta por várias engines</ArticleLi>
        <ArticleLi>agrega, deduplica e devolve JSON unificado</ArticleLi>
        <ArticleLi>o MCP entrega isso de volta ao modelo</ArticleLi>
      </ArticleOl>

      <ArticleP>
        O agente nunca “abre o Chrome”; o agente só consome o resultado da tool.
      </ArticleP>

      <ArticleP>
        SearXNG é um{" "}
        <a
          href="https://en.wikipedia.org/wiki/Metasearch_engine"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          metasearch
        </a>
        : em vez de ser mais um Google, o SearXNG orquestra buscadores e fontes (Google,
        Bing, DuckDuckGo e outros, conforme a config) e limpa boa parte do
        ruído numa resposta só. Rodar isso em{" "}
        <a
          href="https://docs.docker.com/get-started/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Docker
        </a>{" "}
        na{" "}
        <a
          href="https://en.wikipedia.org/wiki/Localhost"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          loopback
        </a>{" "}
        (<ArticleCode>127.0.0.1</ArticleCode>) significa: o processo fica isolado
        num container, sobe com compose, e a API JSON só escuta na sua máquina.
        Você ganha pragmatismo (MCP maduro, sem reinventar protocolo), custo
        zero de API de search, privacidade melhor porque a query passa primeiro
        pela sua máquina, e controle de porta, secret e ciclo de vida.
      </ArticleP>

      <ArticleP>
        O preço é operacional, não financeiro de SaaS: manter o container no
        ar, habilitar formato JSON, aceitar que engines externas ainda podem
        degradar. Mesmo assim, uma engine ruim raramente derruba o metasearch
        inteiro.         Para uso diário de agente, essa foi a linha que sobreviveu.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Fluxo da opção B: agente, MCP, SearXNG local e engines"
        chart={OPTION_B_CHART}
      />

      <ArticleH3>Opção C: MCP custom com o SDK</ArticleH3>

      <ArticleP>
        A terceira rota é escrever o seu próprio servidor MCP. Em TypeScript
        isso normalmente passa pelo pacote oficial{" "}
        <ArticleCode>@modelcontextprotocol/sdk</ArticleCode>: você sobe um
        processo Node, registra tools (nome, schema de input, handler) e fala
        com o cliente do agente pelo transporte do protocolo (em desktop, em
        geral{" "}
        <a
          href="https://modelcontextprotocol.io/specification/2025-06-18/basic/transports"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          stdio
        </a>
        , ou seja, o app do agente inicia o processo e troca mensagens pela
        entrada/saída padrão). Por dentro, cada “busca” vira código seu: HTTP
        para SearXNG, para uma API paga, ou scraper caseiro.
      </ArticleP>

      <ArticleP>
        É totalmente viável. A questão é foco e ownership. Para o objetivo
        “busca web estável no agente”, você passa a ser dono de timeout,
        parsing, fallback entre engines, tratamento de 403/429, shape de
        payload, bug report e changelog do seu servidor. Qualquer melhoria que
        um pacote MCP maduro já resolve vira ticket interno. Frente a “MCP
        pronto + SearXNG”, o ganho líquido costuma ser baixo: você reconstrói a
        mesma ponte com mais superfície para manter.
      </ArticleP>

      <ArticleP>
        Eu descartei a C por pragmatismo. Quero ownership baixo e resultado no
        dia a dia, não mais uma peça interna cuja única vantagem era “nós
        escrevemos”. Se no futuro precisar de uma tool muito específica (policy
        interna, filtro de domínio, telemetria), aí sim o SDK volta à mesa. Para
        busca web genérica e estável, não.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Fluxo da opção C: agente, MCP custom com SDK e código próprio até a web"
        chart={OPTION_C_CHART}
      />

      <ArticleP>
        Com as três opções no papel, o fluxo abaixo só resume a decisão. Se você
        leu os parágrafos anteriores, o diagrama deve parecer óbvio, não
        misterioso.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Fluxo de decisão entre opções A, B e C"
        chart={DECISION_CHART}
      />

      <ArticleTable caption="Comparativo rápido das três opções">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Critério</ArticleTh>
            <ArticleTh>A: Scraper MCP</ArticleTh>
            <ArticleTh>B: MCP + SearXNG</ArticleTh>
            <ArticleTh>C: MCP custom</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Custo financeiro</ArticleTd>
            <ArticleTd>Baixo até falhar</ArticleTd>
            <ArticleTd>Zero de API</ArticleTd>
            <ArticleTd>Alto em tempo de engenharia</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Estabilidade / rate-limit</ArticleTd>
            <ArticleTd>Frágil</ArticleTd>
            <ArticleTd>Boa, com agregação</ArticleTd>
            <ArticleTd>Depende da implementação</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Esforço para colocar no ar</ArticleTd>
            <ArticleTd>Mínimo</ArticleTd>
            <ArticleTd>Moderado</ArticleTd>
            <ArticleTd>Alto</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Privacidade</ArticleTd>
            <ArticleTd>Baixa a média</ArticleTd>
            <ArticleTd>Alta (serviço na sua máquina)</ArticleTd>
            <ArticleTd>Alta, se bem feito</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Encaixa no objetivo real?</ArticleTd>
            <ArticleTd>Só smoke test</ArticleTd>
            <ArticleTd>Uso diário</ArticleTd>
            <ArticleTd>Overengineering</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleCallout variant="tip" title="A decisão">
        <ArticleP>
          Fiquei com a B. A opção B resolve estabilidade e privacidade sem transformar
          a solução num produto interno eterno de manutenção. A opção B é a menor
          arquitetura que sobrevive a uma semana de uso real, não só a um demo
          de sexta-feira.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. O que é o SearXNG (e por que o SearXNG entra na jogada)</ArticleH2>

      <ArticleP>
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>{" "}
        é um{" "}
        <a
          href="https://en.wikipedia.org/wiki/Metasearch_engine"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          metasearch
        </a>{" "}
        open source e auto-hospedável. Em vez de ser “mais um Google”, o SearXNG
        agrega resultados de vários serviços e bases (Google, Bing, DuckDuckGo e
        dezenas de outros, conforme a config) e devolve uma visão unificada.
        Você pesquisa uma vez; por baixo o SearXNG espalha a consulta e junta o
        retorno.
      </ArticleP>

      <ArticleP>
        O projeto nasceu com foco em privacidade: a instância não precisa
        rastrear nem perfilar o usuário da forma que um buscador comercial faz
        por padrão. No uso local isso fica ainda mais claro. A orquestração
        mora na sua máquina, o histórico sensível não precisa atravessar um SaaS
        de search, e você decide o que fica exposto.
      </ArticleP>

      <ArticleP>
        Eu escolhi o SearXNG por três motivos práticos. Primeiro, o SearXNG já resolve
        agregação e normalização de resultados, então o MCP não precisa virar
        um parser frágil de HTML. Segundo, a API{" "}
        <a
          href="https://www.json.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          JSON
        </a>{" "}
        é direta o suficiente para um agente consumir sem gambiarra. Terceiro, a
        comunidade mantém imagem Docker e documentação boas o bastante para
        subir em minutos e operar no dia a dia sem transformar isso num side
        project eterno.
      </ArticleP>

      <ArticleP>
        Tem nuances importantes. Engines externas mudam e podem degradar; isso
        faz parte do modelo. O formato JSON precisa estar habilitado no{" "}
        <ArticleCode>settings.yml</ArticleCode>, senão a API responde 403 e o
        MCP parece quebrado. E “local” continua dependendo da internet pública
        para falar com as engines. O que você ganha não é offline total. É
        o serviço de busca rodando na sua máquina, custo zero de API de busca e
        uma camada estável entre o agente e a web.
      </ArticleP>

      <ArticleP>
        Se você já acompanhou o problema (scraper frágil vs API paga vs SearXNG
        local), o diagrama abaixo só fecha o raciocínio visualmente. Não
        introduz ideia nova: organiza o que você acabou de ler.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Comparativo visual: scraper direto, API SaaS e SearXNG local"
        chart={SEARXNG_COMPARE_CHART}
      />

      <ArticleP>
        Repositório oficial:{" "}
        <a
          href="https://github.com/searxng/searxng"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/searxng/searxng
        </a>
        . Docs:{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          docs.searxng.org
        </a>
        .
      </ArticleP>

      <ArticleH2>4. Como a stack se encaixa</ArticleH2>

      <ArticleP>
        A arquitetura é simples de propósito. Quatro peças, quatro jobs. Quando
        algo falha, você olha a camada certa em vez de “reiniciar tudo”.
      </ArticleP>

      <ArticleP>
        O cliente MCP (Cursor, Copilot ou outro host) descobre tools e decide
        quando chamar. O servidor MCP sobe com <ArticleCode>npx</ArticleCode>,
        fala por{" "}
        <a
          href="https://www.jsonrpc.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          JSON-RPC
        </a>{" "}
        em stdio e traduz o pedido em HTTP local. O SearXNG, na loopback, agrega
        engines e devolve JSON. As engines externas (Google, Bing, DuckDuckGo…)
        continuam na internet pública. O agente não raspa HTML: o agente usa tools.
      </ArticleP>

      <ArticleP>
        Com esse mapa mental, o diagrama abaixo fica só como reforço visual do
        fluxo de ponta a ponta.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Arquitetura ponta a ponta cliente MCP, SearXNG e engines"
        chart={ARCHITECTURE_CHART}
      />

      <ArticleH3>Cliente MCP / agente</ArticleH3>

      <ArticleP>
        O “cliente MCP” é o app onde você conversa com o agente. Pode ser o{" "}
        <a
          href="https://cursor.com/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cursor
        </a>
        , o{" "}
        <a
          href="https://docs.github.com/en/copilot"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Copilot
        </a>{" "}
        no{" "}
        <a
          href="https://code.visualstudio.com/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          VS Code
        </a>
        , ou outro host que fale o protocolo. “Host” aqui só significa o
        programa que embute o modelo e consegue chamar tools.
      </ArticleP>

      <ArticleP>
        No MCP,{" "}
        <a
          href="https://modelcontextprotocol.io/docs/concepts/tools"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          tools
        </a>{" "}
        são ações que o modelo pode pedir: buscar na web, ler uma URL, etc. O
        cliente descobre quais tools existem, decide quando usar e recebe o
        retorno estruturado (o “payload”: o pacote de dados da resposta). Esse
        retorno entra na janela de contexto do modelo, ou seja, no texto que o modelo
        usa para continuar raciocinando.
      </ArticleP>

      <ArticleP>
        O ponto prático: o agente não “abre o Chrome” por conta própria. O agente
        pede uma tool, o host executa, e o resultado volta de forma auditável e
        repetível. Trocar Cursor por Copilot não muda a ideia; muda só onde a
        config do servidor MCP fica salva.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Papéis no MCP: host, cliente e servidor"
        chart={MCP_ROLES_CHART}
      />

      <ArticleH3>Servidor MCP (`@zhafron/mcp-web-search`)</ArticleH3>

      <ArticleP>
        O servidor MCP é um programinha separado que oferece as tools. Neste
        post usamos o pacote{" "}
        <a
          href="https://www.npmjs.com/package/@zhafron/mcp-web-search"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          @zhafron/mcp-web-search
        </a>
        . O pacote roda em{" "}
        <a
          href="https://nodejs.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Node.js
        </a>{" "}
        e sobe com{" "}
        <a
          href="https://docs.npmjs.com/cli/v10/commands/npx"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          npx
        </a>
        : o npm baixa/executa o pacote sem você precisar instalar globalmente na
        mão.
      </ArticleP>

      <ArticleP>
        A conversa com o cliente usa{" "}
        <a
          href="https://www.jsonrpc.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          JSON-RPC
        </a>{" "}
        por{" "}
        <a
          href="https://en.wikipedia.org/wiki/Standard_streams"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          stdio
        </a>{" "}
        (entrada/saída padrão do processo: o mesmo canal de um programa de
        terminal). Na prática: o Cursor/Copilot fala com esse processo local, e
        o processo traduz o pedido de tool em uma chamada{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTTP"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          HTTP
        </a>{" "}
        para o SearXNG na sua máquina.
      </ArticleP>

      <ArticleP>
        Duas tools importam no dia a dia. <ArticleCode>search_web</ArticleCode>{" "}
        devolve resultados de busca. <ArticleCode>fetch_url</ArticleCode> abre
        uma URL específica e traz o conteúdo para leitura. O{" "}
        <ArticleCode>HTTP_TIMEOUT</ArticleCode> é o tempo máximo de espera da
        chamada HTTP: se a agregação demora demais, a tool falha em vez de
        travar a sessão para sempre.
      </ArticleP>

      <ArticleH3>SearXNG no papel de metasearch local</ArticleH3>

      <ArticleP>
        Aqui o SearXNG é o metasearch que você hospeda. O SearXNG recebe a query,
        consulta várias engines (Google, Bing, DuckDuckGo e outras que você
        habilitar) e devolve um JSON único. “Engine”, neste texto, é só o
        buscador externo de onde os resultados vêm.
      </ArticleP>

      <ArticleP>
        A API sobe em <ArticleCode>127.0.0.1:8099</ArticleCode>.{" "}
        <a
          href="https://en.wikipedia.org/wiki/Localhost"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          127.0.0.1
        </a>{" "}
        (localhost/loopback) significa “esta máquina”, não a internet aberta. O
        “bind” em loopback é a escolha de escutar só nesse endereço: a API não
        fica exposta para outros dispositivos na rede. Menos superfície, menos
        dor de cabeça.
      </ArticleP>

      <ArticleP>
        O contrato mental continua simples: o cliente fala MCP, o MCP fala
        SearXNG, o SearXNG fala com a web. Quebre um elo e o sintoma muda. Por
        isso o troubleshooting é por camada, não “reinicia tudo e reza”.
      </ArticleP>

      <ArticleH2>5. O que melhora, o que custa e onde aperta</ArticleH2>

      <ArticleP>
        O ganho mais óbvio é a fatura: zero API de busca. Logo atrás vem
        privacidade, porque termos sensíveis não precisam atravessar um SaaS de
        search. Tem também resiliência prática: uma engine ruim não derruba o
        metasearch inteiro. E tem o controle operacional. Porta, formatos,
        secrets e ciclo de vida do container ficam sob o seu comando.
      </ArticleP>

      <ArticleP>
        O custo existe, claro. Docker na workstation não é “grátis” em
        atenção. Agregação tem latência. Engines mudam HTML e API e de vez em
        quando degradam. Em rajadas de busca, CPU e rede locais sentem. Nada
        disso inviabiliza a stack, mas ignora esses pontos e a operação vira
        surpresa ruim.
      </ArticleP>

      <ArticleH3>Benchmarks: o que a busca muda de fato</ArticleH3>

      <ArticleP>
        Antes dos números, um corte honesto. MCP + SearXNG local não tem um
        score proprietário num leaderboard. O que a indústria mede é o efeito
        de{" "}
        <a
          href="https://brave.com/blog/ai-grounding/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          grounding
        </a>{" "}
        com busca web: a resposta deixa de depender só da memória de treino e
        passa a se apoiar em trechos recuperados na hora. A stack deste post
        entrega essa mesma classe de capacidade. O score final ainda depende da
        qualidade da query, das engines ativas e de o agente fazer o fluxo
        certo, em vez de encher o contexto de lixo:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>search</ArticleLi>
        <ArticleLi>fetch</ArticleLi>
        <ArticleLi>síntese</ArticleLi>
      </ArticleOl>

      <ArticleImg
        src="/images/publications/busca-web-local-mcp-searxng/brave-ai-grounding.jpg"
        alt="Diagrama do Brave AI Grounding: respostas do modelo ancoradas em busca web verificável"
        caption="Conceito de grounding com busca web. Fonte: Brave Search, post AI Grounding."
      />

      <ArticleP>
        Grounding, em linguagem simples, é amarrar a resposta a evidência
        externa. Sem grounding, o modelo completa o texto com o que soa plausível.
        Com busca, o modelo pode citar o que acabou de ler. Isso sobe factualidade e
        frescor. Não sobe magicamente “seguir o prompt melhor”, nem raciocínio
        abstrato em tarefa fechada. Se a pergunta é só sobre o código que já
        está no workspace, o ganho costuma ser baixo.
      </ArticleP>

      <ArticleP>
        O{" "}
        <a
          href="https://openai.com/index/introducing-simpleqa/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          SimpleQA
        </a>{" "}
        da OpenAI é um benchmark de factualidade em perguntas curtas, com
        resposta única e fácil de julgar. No paper original, modelos frontier
        sem busca externa ainda erravam bastante: o GPT-4o ficou abaixo de ~40%
        de acerto. Quando o mesmo tipo de pergunta ganha grounding com busca,
        os números saltam. A Brave reportou F1 de 94,1% no SimpleQA com o
        serviço de{" "}
        <a
          href="https://brave.com/blog/ai-grounding/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          AI Grounding
        </a>
        . Guias de vendors que agregam SimpleQA e{" "}
        <a
          href="https://parallel.ai/articles/how-to-reduce-llm-hallucinations-by-connecting-your-app-to-real-time-web-search"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          FRAMES
        </a>{" "}
        (raciocínio multi-hop com várias fontes) falam em ganhos típicos de 25
        a 40 pontos percentuais frente ao baseline sem grounding. Pontos
        percentuais não são “% de melhoria relativa”: sair de 40% para 70% é
        +30 pontos, não “+30% a mais no sentido de multiplicar por 1,3”.
      </ArticleP>

      <ArticleImg
        src="/images/publications/busca-web-local-mcp-searxng/brave-simpleqa-grounding.jpg"
        alt="Gráfico SimpleQA da Brave mostrando desempenho alto com AI Grounding frente a baselines"
        caption="SimpleQA com grounding: referência visual do salto de factualidade. Fonte: Brave Search."
      />

      <ArticleTable caption="Ordem de grandeza em benchmarks públicos (não é score do SearXNG)">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Cenário</ArticleTh>
            <ArticleTh>Sem busca / só modelo</ArticleTh>
            <ArticleTh>Com grounding web</ArticleTh>
            <ArticleTh>Leitura útil</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>SimpleQA (fatos curtos)</ArticleTd>
            <ArticleTd>GPT-4o &lt; ~40% no paper OpenAI</ArticleTd>
            <ArticleTd>Brave: F1 94,1% com AI Grounding</ArticleTd>
            <ArticleTd>
              Busca muda o jogo quando a verdade está na web, não no treino
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>SimpleQA / FRAMES (agregado de vendors)</ArticleTd>
            <ArticleTd>Baseline sem grounding</ArticleTd>
            <ArticleTd>+25 a +40 pontos percentuais</ArticleTd>
            <ArticleTd>
              Faixa citada em análises de grounding com busca em tempo real
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Queries factuais em produção (ordem de grandeza)</ArticleTd>
            <ArticleTd>~15-25% de respostas ruins o bastante para importar</ArticleTd>
            <ArticleTd>Cai quando a recuperação é boa e o modelo usa o contexto</ArticleTd>
            <ArticleTd>
              Não é “prompt mais preciso”; é factualidade e frescor
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleCallout variant="note" title="O que eu não estou prometendo">
        <ArticleP>
          Esses números medem grounding com busca web em setups de avaliação.
          Eles não são um certificado de que o seu SearXNG local vai bater 94%
          no SimpleQA. Meta-search local herda a qualidade das engines, bloqueios
          e ruído. O ganho prático que eu vejo no dia a dia é outro: menos
          endpoint inventado, menos versão velha de lib, menos “certeza” sobre
          issue que abriu ontem. Isso é o mesmo tipo de benefício dos
          benchmarks, medido em atrito de sessão, não em leaderboard.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>Para quem isso é útil (e para quem não)</ArticleH3>

      <ArticleP>
        A stack paga o almoço quando o agente precisa de mundo externo atual.
        Docs que mudaram na semana, changelog de SDK, issue aberta ontem, CVE
        recente, comparação de APIs. Aí a memória de treino é exatamente o
        lugar errado para apostar. Quem vive em sessão longa de agente, quem
        quer citar fonte e quem não quer pagar por query de search SaaS está no
        público-alvo.
      </ArticleP>

      <ArticleP>
        O retorno é fraco quando a tarefa já está resolvida pelo workspace:
        refatorar um módulo, seguir um padrão do repo, escrever teste em cima
        do código aberto. Busca web ali vira ruído e loop. Também não “melhora
        a precisão do prompt” no sentido de instrução: um prompt ruim continua
        ruim. O que melhora é a base factual sobre a qual o modelo responde,
        quando a verdade está fora do contexto local.
      </ArticleP>

      <ArticleTable caption="Quem ganha e quem quase não sente">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Perfil</ArticleTh>
            <ArticleTh>O que muda na prática</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Dev com agente no fluxo diário</ArticleTd>
            <ArticleTd>
              Menos alucinação de API/docs; menos inventar e torcer na sessão
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Quem caça issue, CVE, changelog</ArticleTd>
            <ArticleTd>
              Frescor vence cutoff de treino; dá para pedir link e trecho
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Quem evita API paga de search</ArticleTd>
            <ArticleTd>
              Mesma classe de ganho de grounding, com custo de API zero e query
              na sua máquina
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Só edição em repo fechado</ArticleTd>
            <ArticleTd>
              Ganho baixo; o contexto do projeto já costuma bastar
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleTable caption="Gargalos que eu já vi e como mitiguei">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Gargalo</ArticleTh>
            <ArticleTh>Sintoma</ArticleTh>
            <ArticleTh>Mitigação</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Timeouts</ArticleTd>
            <ArticleTd>Tool falha sob carga</ArticleTd>
            <ArticleTd>
              Subir <ArticleCode>HTTP_TIMEOUT</ArticleCode> e reduzir engines
              ativas
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Payload grande</ArticleTd>
            <ArticleTd>Contexto do LLM estoura</ArticleTd>
            <ArticleTd>
              Pedir síntese e usar <ArticleCode>fetch_url</ArticleCode> seletivo
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Cold start</ArticleTd>
            <ArticleTd>Primeira busca lenta</ArticleTd>
            <ArticleTd>
              Manter o container up e healthcheck no compose
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Loops de busca</ArticleTd>
            <ArticleTd>Agente pesquisa demais</ArticleTd>
            <ArticleTd>
              Limitar no prompt e validar hipótese antes da próxima query
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH2>6. Como eu montei na prática</ArticleH2>

      <ArticleP>
        A montagem cabe em três fases. O diagrama é o mapa; o resto desta seção
        é o checklist executável.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Três fases de montagem: SearXNG no Docker, MCP no cliente e aceite rápido"
        chart={SETUP_CHART}
      />

      <ArticleH3>Fase 1: SearXNG no Docker</ArticleH3>

      <ArticleP>
        Criei um diretório local (no meu caso,{" "}
        <ArticleCode>~/searxng</ArticleCode>) e preparei o{" "}
        <ArticleCode>settings.yml</ArticleCode>. O detalhe que mais gente
        esquece é o formato JSON. Sem o formato JSON, a API responde 403 e o MCP parece
        “quebrado” sem motivo aparente.
      </ArticleP>

      <ArticleP>
        Gere secrets fortes com{" "}
        <ArticleCode>openssl rand -hex 32</ArticleCode> e não deixe
        placeholder no arquivo. Um trecho mínimo fica assim:
      </ArticleP>

      <ArticleCode block>
        {`# settings.yml (trecho essencial)
use_default_settings: true

general:
  instance_name: "searxng-local"

server:
  secret_key: "SUBSTITUA_COM_OPENSSL_RAND_HEX_32"
  limiter: false
  image_proxy: true

search:
  formats:
    - html
    - json`}
      </ArticleCode>

      <ArticleCallout variant="warning" title="Sem JSON, você leva 403">
        <ArticleP>
          Se <ArticleCode>json</ArticleCode> não estiver em{" "}
          <ArticleCode>search.formats</ArticleCode>, a API recusa a resposta e o
          MCP aparenta falha de integração. Na maioria das vezes o problema está
          só nessa linha.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        O compose com bind restrito à loopback:
      </ArticleP>

      <ArticleCode block>
        {`services:
  searxng:
    image: searxng/searxng:latest
    container_name: searxng
    ports:
      - "127.0.0.1:8099:8080"
    volumes:
      - ./settings.yml:/etc/searxng/settings.yml:ro
    restart: unless-stopped`}
      </ArticleCode>

      <ArticleP>
        Suba com <ArticleCode>docker compose up -d</ArticleCode> e valide com um
        curl simples. Se voltar JSON, a camada SearXNG está ok.
      </ArticleP>

      <ArticleCode block>
        {`docker compose up -d

curl -s "http://127.0.0.1:8099/search?q=model+context+protocol&format=json" | head`}
      </ArticleCode>

      <ArticleP>
        A UI local fica em <ArticleCode>http://127.0.0.1:8099</ArticleCode>. A
        referência oficial de instalação está na{" "}
        <a
          href="https://docs.searxng.org/admin/installation-docker.html"
          className="font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          documentação Docker do SearXNG
        </a>
        .
      </ArticleP>

      <ArticleH3>Fase 2: MCP no cliente (Cursor ou Copilot)</ArticleH3>

      <ArticleP>
        O pacote MCP é o mesmo. O que muda é o arquivo de configuração do host.
        No Cursor, use o MCP global em{" "}
        <ArticleCode>~/.cursor/mcp.json</ArticleCode> ou por projeto em{" "}
        <ArticleCode>.cursor/mcp.json</ArticleCode>:
      </ArticleP>

      <ArticleCode block>
        {`{
  "mcpServers": {
    "web-search": {
      "command": "npx",
      "args": ["-y", "@zhafron/mcp-web-search"],
      "env": {
        "DEFAULT_SEARCH_PROVIDER": "searxng",
        "SEARXNG_URL": "http://127.0.0.1:8099",
        "HTTP_TIMEOUT": "20000"
      }
    }
  }
}`}
      </ArticleCode>

      <ArticleP>
        No VS Code com GitHub Copilot, o equivalente fica em{" "}
        <ArticleCode>.vscode/mcp.json</ArticleCode> (workspace) ou na config de
        usuário via Command Palette (<ArticleCode>MCP: Open User Configuration</ArticleCode>).
        A chave raiz é <ArticleCode>servers</ArticleCode>, não{" "}
        <ArticleCode>mcpServers</ArticleCode>:
      </ArticleP>

      <ArticleCode block>
        {`{
  "servers": {
    "web-search": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@zhafron/mcp-web-search"],
      "env": {
        "DEFAULT_SEARCH_PROVIDER": "searxng",
        "SEARXNG_URL": "http://127.0.0.1:8099",
        "HTTP_TIMEOUT": "20000"
      }
    }
  }
}`}
      </ArticleCode>

      <ArticleP>
        <ArticleCode>DEFAULT_SEARCH_PROVIDER=searxng</ArticleCode> evita cair no
        scraper default. <ArticleCode>SEARXNG_URL</ArticleCode> aponta para a
        instância local. <ArticleCode>HTTP_TIMEOUT</ArticleCode> evita morte
        precoce quando a agregação demora um pouco mais. Depois de editar o
        arquivo, recarregue o host (Cursor ou VS Code/Copilot) e confira se o
        servidor aparece conectado na UI de tools.
      </ArticleP>

      <ArticleH3>Fase 3: Aceite rápido</ArticleH3>

      <ArticleOl>
        <ArticleLi>Recarregar o cliente MCP após salvar a config.</ArticleLi>
        <ArticleLi>Confirmar o servidor MCP conectado nas settings/tools.</ArticleLi>
        <ArticleLi>
          Rodar <ArticleCode>search_web</ArticleCode> com uma query objetiva.
        </ArticleLi>
        <ArticleLi>
          Rodar <ArticleCode>fetch_url</ArticleCode> na melhor fonte e pedir uma
          síntese curta.
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        Dois prompts que eu uso para validar o fluxo de ponta a ponta:
      </ArticleP>

      <ArticleCode block>
        {`Use search_web para encontrar a documentação oficial do Model Context Protocol.
Depois use fetch_url na melhor fonte e resuma em 5 bullets acionáveis.`}
      </ArticleCode>

      <ArticleCode block>
        {`Pesquise issues recentes sobre erro 403 no SearXNG com format=json.
Cite links e separe causa de configuração de bloqueio de engine.`}
      </ArticleCode>

      <ArticleH2>7. Operação do dia a dia e o que fazer quando quebra</ArticleH2>

      <ArticleP>
        A stack fica estável quando você trata container e MCP como
        infraestrutura de workstation, não como plugin mágico. Reiniciou a
        máquina? Sobe o compose e valida com curl. Container caiu? Olha{" "}
        <ArticleCode>docker ps -a</ArticleCode>, lê o log e sobe de novo. UI do
        SearXNG vazia? Abre a porta local, testa engines e revisa o settings.
      </ArticleP>

      <ArticleTable caption="Troubleshooting que mais aparece">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Cenário</ArticleTh>
            <ArticleTh>O que eu faço</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Máquina reiniciou</ArticleTd>
            <ArticleTd>
              <ArticleCode>docker compose up -d</ArticleCode> + curl de sanidade
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Container caiu</ArticleTd>
            <ArticleTd>
              Status com <ArticleCode>docker ps -a</ArticleCode>, logs e restart
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>MCP não sobe no cliente</ArticleTd>
            <ArticleTd>
              Checar PATH do Node/npx no app gráfico e testar{" "}
              <ArticleCode>npx -y @zhafron/mcp-web-search</ArticleCode> no
              terminal
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>403 em format=json</ArticleTd>
            <ArticleTd>
              Confirmar <ArticleCode>json</ArticleCode> em{" "}
              <ArticleCode>search.formats</ArticleCode> e recriar o container
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Resultados fracos</ArticleTd>
            <ArticleTd>
              Ajustar engines, cortar loops e preferir{" "}
              <ArticleCode>fetch_url</ArticleCode> em fontes oficiais
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Algumas práticas que pagam o almoço:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>manter SearXNG em 127.0.0.1</ArticleLi>
        <ArticleLi>gerar secrets de verdade com openssl</ArticleLi>
        <ArticleLi>
          ensinar o agente a buscar pouco e ler bem, neste fluxo:
        </ArticleLi>
      </ArticleUl>

      <ArticleOl>
        <ArticleLi>search</ArticleLi>
        <ArticleLi>fetch</ArticleLi>
        <ArticleLi>síntese</ArticleLi>
      </ArticleOl>

      <ArticleP>
        Trate degradação de engine como operação normal. Engines mudam. Isso não
        é incidente raro. É o jogo.
      </ArticleP>

      <ArticleH3>Pontos-chave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Para busca web estável no agente no dia a dia, a linha que sobrevive é
          MCP pronto + SearXNG local (opção B), não scraper direto nem MCP
          custom genérico.
        </ArticleLi>
        <ArticleLi>
          Scraper MCP público serve para smoke test. Em sessão longa, CAPTCHA,
          rate-limit e HTML instável viram roleta.
        </ArticleLi>
        <ArticleLi>
          MCP custom com SDK só vale quando a tool é específica demais; para
          busca genérica o ownership engole o ganho.
        </ArticleLi>
        <ArticleLi>
          No SearXNG: habilite JSON em <ArticleCode>search.formats</ArticleCode>
          , bind em <ArticleCode>127.0.0.1</ArticleCode> e trate engines
          degradando como operação normal.
        </ArticleLi>
        <ArticleLi>
          Ensine o agente a buscar pouco e ler bem neste fluxo: search, depois
          fetch, depois síntese. Não encher o contexto de ruído.
        </ArticleLi>
        <ArticleLi>
          Grounding com busca sobe factualidade e frescor. Não “melhora o
          prompt” em tarefa que o workspace já resolve.
        </ArticleLi>
        <ArticleLi>
          Local ≠ offline: você controla o serviço de busca na sua máquina; a
          internet pública continua alimentando as engines.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusão</ArticleH3>

      <ArticleP>
        Eu não escolhi construir mais software. Escolhi a menor arquitetura que
        aguenta uso real. MCP pronto + SearXNG local entrega custo zero de API,
        privacidade com o serviço na sua máquina e estabilidade melhor que
        scraper frágil, com um
        overhead operacional aceitável para quem já vive em Docker no dia a dia.
        No eixo de qualidade, o ganho que importa é o mesmo da literatura de
        grounding: factualidade e frescor quando a verdade está na web, não um
        “prompt magicamente mais preciso”.
      </ArticleP>

      <ArticleP>
        Se o objetivo é agente com busca confiável de segunda a sexta, a opção B
        não é atalho. É a linha que eu deixaria rodando na minha máquina e
        recomendaria para alguém do time sem vergonha nenhuma.
      </ArticleP>
    </>
  );
}
