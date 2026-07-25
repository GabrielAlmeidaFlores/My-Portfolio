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
import type { ReactNode } from "react";

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


const OPTION_B_CHART = `flowchart LR
  Ag["Agente"] --> Mcp["MCP pronto"]
  Mcp --> Sx["SearXNG local"]
  Sx --> Eng["Engines"]
  Eng --> Sx
  Sx --> Mcp
  Mcp --> Ag`;

const SCRAPER_VS_SEARXNG_CHART = `flowchart TB
  subgraph Scraper["Scraper MCP"]
    direction TB
    S1["Agente"] --> S2["MCP"]
    S2 --> S3["1 engine HTML"]
    S3 --> S4["CAPTCHA / 429"]
  end

  subgraph Meta["SearXNG local"]
    direction TB
    M1["Agente"] --> M2["MCP"]
    M2 --> M3["JSON 127.0.0.1"]
    M3 --> M4["Varias engines"]
    M4 --> M5["Agrega resultado"]
  end`;

const SETUP_CHART = `flowchart LR
  F1["1. SearXNG Docker"] --> F2["2. MCP no cliente"]
  F2 --> F3["3. Aceite rapido"]`;

const linkClass =
  "font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300";

const SIMPLEQA_URL = "https://openai.com/index/introducing-simpleqa/";
const FRAMES_URL =
  "https://parallel.ai/articles/how-to-reduce-llm-hallucinations-by-connecting-your-app-to-real-time-web-search";
const GROUNDING_URL = "https://brave.com/blog/ai-grounding/";

function TermLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
    >
      {children}
    </a>
  );
}

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
        local em Docker. Três nomes que você vai ver o tempo todo:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <a
            href="https://modelcontextprotocol.io/"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            MCP
          </a>
          : protocolo que deixa o agente chamar tools (buscar, ler URL) no
          Cursor/Copilot, em vez de “abrir o navegador sozinho”
        </ArticleLi>
        <ArticleLi>
          <a
            href="https://docs.searxng.org/"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            SearXNG
          </a>
          :{" "}
          <a
            href="https://en.wikipedia.org/wiki/Metasearch_engine"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            metasearch
          </a>{" "}
          open source que você hospeda; consulta vários buscadores e devolve
          um resultado unificado (no meu caso, em JSON)
        </ArticleLi>
        <ArticleLi>
          engine: o buscador externo de onde vêm os hits (Google, Bing,
          DuckDuckGo…). O SearXNG fala com as engines; o MCP fala com o SearXNG
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Atalho">
        <ArticleP>
          Quer o checklist de montagem agora? Pule para a{" "}
          <a href="#3-como-eu-montei-na-pratica" className={linkClass}>
            seção 3
          </a>
          .
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Se preferir o porquê antes do como, continue aqui.
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
        Eu comparei API paga, scraper MCP e metasearch local. Fiquei com o
        metasearch. A seguir, o que quebra nos outros dois.
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
        No MCP, tool é uma ação nomeada (nome + inputs + resultado). O agente
        pede; o host executa; o modelo continua.
      </ArticleP>

      <ArticleP>
        Neste pacote, duas tools importam:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>search_web</ArticleCode>: busca na web e devolve títulos,
          links e snippets
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>fetch_url</ArticleCode> (quando existe no pacote): abre
          uma URL específica e devolve o conteúdo para leitura
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Na prática o fluxo do scraper é este:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          o agente pede a tool <ArticleCode>search_web</ArticleCode>
        </ArticleLi>
        <ArticleLi>o servidor MCP baixa a página por HTTP</ArticleLi>
        <ArticleLi>o servidor MCP tenta parsear HTML</ArticleLi>
        <ArticleLi>
          o servidor MCP devolve links e snippets ao modelo
        </ArticleLi>
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
          Você hospeda SearXNG + MCP. A internet e as engines externas
          continuam. O que muda: porta, secret e ciclo de vida ficam no seu
          domínio.
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
        Queria a opção mais estável no dia a dia, com ownership baixo. Três
        rotas:
      </ArticleP>

      <ArticleH3>Opção A: MCP pronto com scraper público direto</ArticleH3>

      <ArticleP>
        Instala um MCP de busca via{" "}
        <a
          href="https://docs.npmjs.com/cli/v10/commands/npm-exec"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          npx
        </a>
        . Sem Docker. Sem metasearch. Em minutos o agente ganha{" "}
        <ArticleCode>search_web</ArticleCode>.
      </ArticleP>

      <ArticleP>
        Por baixo, o pacote costuma ser scraper: HTTP num motor público, HTML,
        parser. Setup quase zero. Ótimo para smoke test.
      </ArticleP>

      <ArticleP>
        Em uso contínuo quebra:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <a
            href="https://pt.wikipedia.org/wiki/CAPTCHA"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            CAPTCHA
          </a>{" "}
          e{" "}
          <a
            href="https://en.wikipedia.org/wiki/Rate_limiting"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            rate-limit
          </a>
        </ArticleLi>
        <ArticleLi>HTML muda e o parser silencia</ArticleLi>
        <ArticleLi>rajada de agente = padrão que o anti-abuso pune</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Usei como experimento. Descartei como linha principal.
      </ArticleP>

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
        <ArticleLi>
          o agente pede a tool <ArticleCode>search_web</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          o servidor MCP monta um GET/POST para{" "}
          <ArticleCode>http://127.0.0.1:…/search?format=json</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          o SearXNG espalha a consulta por várias engines (buscadores externos)
        </ArticleLi>
        <ArticleLi>o SearXNG agrega, deduplica e devolve JSON unificado</ArticleLi>
        <ArticleLi>
          o MCP entrega o resultado de <ArticleCode>search_web</ArticleCode> de
          volta ao modelo
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        O agente nunca “abre o Chrome”. O agente só consome o resultado da tool{" "}
        <ArticleCode>search_web</ArticleCode> (e, se precisar ler uma página,
        pode pedir <ArticleCode>fetch_url</ArticleCode> em seguida).
      </ArticleP>

      <ArticleP>
        SearXNG é{" "}
        <a
          href="https://en.wikipedia.org/wiki/Metasearch_engine"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          metasearch
        </a>
        : orquestra Google, Bing, DuckDuckGo e afins numa resposta só.
      </ArticleP>

      <ArticleP>
        Em Docker na loopback (<ArticleCode>127.0.0.1</ArticleCode>):
      </ArticleP>

      <ArticleUl>
        <ArticleLi>custo zero de API de search</ArticleLi>
        <ArticleLi>query passa primeiro pela sua máquina</ArticleLi>
        <ArticleLi>você controla porta, secret e ciclo de vida</ArticleLi>
        <ArticleLi>preço = operação (container + JSON ligado)</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Uma engine ruim raramente derruba o metasearch inteiro. Foi a linha que
        sobreviveu no dia a dia.
      </ArticleP>

      <ArticleP>
        “Não é só outro scraper?” Resposta curta na seção 4.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Fluxo da opção B: agente, MCP, SearXNG local e engines"
        chart={OPTION_B_CHART}
      />

      <ArticleH3>Opção C: MCP custom com o SDK</ArticleH3>

      <ArticleP>
        Escrever o próprio servidor com{" "}
        <ArticleCode>@modelcontextprotocol/sdk</ArticleCode> (em geral via{" "}
        <a
          href="https://modelcontextprotocol.io/specification/2025-06-18/basic/transports"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          stdio
        </a>
        ). Viável. Ownership alto.
      </ArticleP>

      <ArticleP>
        Você vira dono de timeout, parsing, 403/429, payload e changelog. Frente
        a MCP pronto + SearXNG, o ganho líquido costuma ser baixo.
      </ArticleP>

      <ArticleP>
        Descartei a C. SDK só volta se a tool for bem específica (policy,
        filtro, telemetria).
      </ArticleP>

      <ArticleP>
        Resumo visual da decisão e da tabela logo abaixo:
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
          Fiquei com a B: estabilidade e privacidade sem virar produto interno
          eterno. É a menor arquitetura que aguenta uma semana real, não só um
          demo.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. Como eu montei na prática</ArticleH2>

      <ArticleP>
        Três fases. Diagrama = mapa. Texto = checklist.
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

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>DEFAULT_SEARCH_PROVIDER=searxng</ArticleCode> evita o
          scraper default
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>SEARXNG_URL</ArticleCode> aponta para a instância local
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>HTTP_TIMEOUT</ArticleCode> evita morte precoce na
          agregação
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Salvou? Recarregue o host e confira o servidor na UI de tools.
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

      <ArticleH2>4. Como a stack se encaixa (e vs scraper)</ArticleH2>

      <ArticleP>
        Quatro peças. Quatro jobs.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Cliente MCP (Cursor/Copilot): descobre tools e decide quando chamar
        </ArticleLi>
        <ArticleLi>
          Servidor MCP (
          <a
            href="https://www.npmjs.com/package/@zhafron/mcp-web-search"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            @zhafron/mcp-web-search
          </a>
          ): sobe com <ArticleCode>npx</ArticleCode>, fala JSON-RPC/stdio, vira
          HTTP local
        </ArticleLi>
        <ArticleLi>
          SearXNG em <ArticleCode>127.0.0.1</ArticleCode>: metasearch e JSON
          unificado
        </ArticleLi>
        <ArticleLi>
          Engines externas (Google, Bing, DuckDuckGo…): na internet pública
        </ArticleLi>
      </ArticleUl>

      <ArticleMermaid
        ariaLabel="Arquitetura ponta a ponta cliente MCP, SearXNG e engines"
        chart={ARCHITECTURE_CHART}
      />

      <ArticleH3>SearXNG vs scraper</ArticleH3>

      <ArticleP>
        Desenho diferente. SearXNG também não é imune a bloqueio. O que muda é
        quem falha.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Opção A: MCP raspa uma engine HTML. CAPTCHA/429 derruba a tool.
        </ArticleLi>
        <ArticleLi>
          Opção B: MCP só fala com SearXNG local. SearXNG fala com várias
          engines.
        </ArticleLi>
        <ArticleLi>
          Uma engine ruim vira “menos fontes”, não roleta total.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="note" title="IP e rate-limit: o corte honesto">
        <ArticleP>
          O pedido às engines ainda sai do seu IP. SearXNG não te torna
          invisível.
        </ArticleP>
        <ArticleP>
          O que a stack evita é falha total típica do scraper: um único HTML
          público martelado até o anti-abuso fechar a porta.
        </ArticleP>
      </ArticleCallout>

      <ArticleMermaid
        ariaLabel="Contraste: scraper MCP com uma engine HTML versus SearXNG local com várias engines"
        chart={SCRAPER_VS_SEARXNG_CHART}
      />

      <ArticleP>
        Nuances rápidas:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          JSON em <ArticleCode>settings.yml</ArticleCode>, senão 403
        </ArticleLi>
        <ArticleLi>Local ≠ offline: engines usam a internet pública</ArticleLi>
        <ArticleLi>
          Repo:{" "}
          <a
            href="https://github.com/searxng/searxng"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            searxng/searxng
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
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>5. O que melhora, o que custa e onde aperta</ArticleH2>

      <ArticleP>
        O que melhora:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>zero API de busca</ArticleLi>
        <ArticleLi>menos SaaS no caminho da query</ArticleLi>
        <ArticleLi>uma engine ruim não derruba o metasearch</ArticleLi>
        <ArticleLi>porta, formatos e secrets sob o seu comando</ArticleLi>
      </ArticleUl>

      <ArticleP>
        O que custa:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>atenção de Docker na workstation</ArticleLi>
        <ArticleLi>latência de agregação</ArticleLi>
        <ArticleLi>engines que degradam de vez em quando</ArticleLi>
        <ArticleLi>CPU/rede em rajada de busca</ArticleLi>
      </ArticleUl>

      <ArticleH3>Benchmarks: o que a busca muda de fato</ArticleH3>

      <ArticleP>
        No dia a dia, o que eu sinto com busca no agente não é “score de
        leaderboard”. É atrito de sessão:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>menos endpoint inventado</ArticleLi>
        <ArticleLi>menos versão velha de lib</ArticleLi>
        <ArticleLi>menos “certeza” sobre issue que abriu ontem</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Isso é{" "}
        <TermLink href={GROUNDING_URL}>grounding</TermLink>: amarrar a resposta
        a evidência externa.
      </ArticleP>

      <ArticleP>
        Sem busca, o modelo completa o que soa plausível. Com busca, pode citar
        o que acabou de ler. Sobe factualidade e frescor. Não “melhora o prompt”
        sozinho em tarefa que o repo já resolve.
      </ArticleP>

      <ArticleP>
        O fluxo que faz isso funcionar na prática:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          <ArticleCode>search_web</ArticleCode>: achar fontes
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>fetch_url</ArticleCode>: ler a melhor página
        </ArticleLi>
        <ArticleLi>síntese: responder com base no que foi lido</ArticleLi>
      </ArticleOl>

      <ArticleP>
        A indústria mede isso com{" "}
        <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> (perguntas curtas de
        fato, OpenAI).
      </ArticleP>

      <ArticleP>
        MCP + SearXNG local não tem score próprio nesses testes. Os números
        abaixo são referência da classe “modelo + busca web”, não certificado
        do seu Docker:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Sem busca: GPT-4o ficou abaixo de ~40% no paper do{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>
        </ArticleLi>
        <ArticleLi>
          Com grounding: Brave reportou F1 de 94,1% no{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> com{" "}
          <TermLink href={GROUNDING_URL}>AI Grounding</TermLink>
        </ArticleLi>
        <ArticleLi>
          Em análises de vendors (
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> e{" "}
          <TermLink href={FRAMES_URL}>FRAMES</TermLink>
          ): ganho típico de +25 a +40 pontos percentuais
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Pontos percentuais não são “% relativa”: sair de 40% para 70% é +30
        pontos, não multiplicar por 1,3.
      </ArticleP>

      <ArticleImg
        src="/images/publications/busca-web-local-mcp-searxng/brave-simpleqa-grounding.jpg"
        alt="Gráfico SimpleQA da Brave mostrando desempenho alto com AI Grounding frente a baselines"
        caption={
          <>
            Referência visual: salto de factualidade com grounding. Fonte: Brave
            Search (
            <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>
            ).
          </>
        }
      />

      <ArticleCallout variant="note" title="O que eu não estou prometendo">
        <ArticleP>
          Esses números não certificam que o seu SearXNG local vai bater 94% no{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>. Medem grounding com
          busca em avaliações públicas. O ganho que eu otimizo é o atrito da
          sessão, não o leaderboard.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>Para quem isso é útil (e para quem não)</ArticleH3>

      <ArticleP>
        A stack ajuda quando o agente precisa de informação atual fora do
        repositório.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>docs que mudaram na semana</ArticleLi>
        <ArticleLi>changelog de SDK</ArticleLi>
        <ArticleLi>issue aberta ontem</ArticleLi>
        <ArticleLi>CVE recente</ArticleLi>
        <ArticleLi>comparação de APIs</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Aí a memória de treino é o lugar errado para apostar.
      </ArticleP>

      <ArticleP>
        O retorno é fraco quando a tarefa já está resolvida pelo workspace:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>refatorar um módulo</ArticleLi>
        <ArticleLi>seguir um padrão do repo</ArticleLi>
        <ArticleLi>escrever teste em cima do código aberto</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Busca web nesses casos vira ruído. Um prompt ruim também continua ruim:
        grounding não “melhora a precisão do prompt”. Grounding melhora a base
        factual quando a verdade está fora do contexto local.
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

      <ArticleH2>6. Operação do dia a dia e o que fazer quando quebra</ArticleH2>

      <ArticleP>
        Trate container e MCP como infra de workstation, não como plugin
        mágico.
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
          Dia a dia: MCP pronto + SearXNG local (B). Não scraper direto nem MCP
          custom genérico.
        </ArticleLi>
        <ArticleLi>
          Scraper MCP: smoke test. Em sessão longa vira CAPTCHA/rate-limit.
        </ArticleLi>
        <ArticleLi>
          SearXNG ≠ scraper MCP: JSON local + várias engines. Bloqueio vira
          degradação. Não é imune a rate-limit/IP.
        </ArticleLi>
        <ArticleLi>
          SDK custom só para tool bem específica; senão o ownership engole o
          ganho.
        </ArticleLi>
        <ArticleLi>
          SearXNG: JSON em <ArticleCode>search.formats</ArticleCode>, bind em{" "}
          <ArticleCode>127.0.0.1</ArticleCode>, engines degradando = normal.
        </ArticleLi>
        <ArticleLi>
          Agente: search → fetch → síntese. Pouco ruído no contexto.
        </ArticleLi>
        <ArticleLi>
          Grounding sobe factualidade/frescor. Não “melhora o prompt” sozinho.
        </ArticleLi>
        <ArticleLi>
          Local ≠ offline: você controla o serviço; a internet alimenta as
          engines.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusão</ArticleH3>

      <ArticleP>
        Eu não escolhi construir mais software. Escolhi a menor arquitetura que
        aguenta uso real.
      </ArticleP>

      <ArticleP>
        MCP pronto + SearXNG local: custo zero de API, serviço na sua máquina,
        mais estável que scraper. Overhead ok se você já vive em Docker.
      </ArticleP>

      <ArticleP>
        O ganho que importa é o do grounding: factualidade e frescor quando a
        verdade está na web. Não um “prompt magicamente mais preciso”.
      </ArticleP>

      <ArticleP>
        Se o objetivo é agente com busca confiável de segunda a sexta, a opção B
        não é atalho. É a linha que eu deixaria rodando na minha máquina e
        recomendaria para alguém do time sem vergonha nenhuma.
      </ArticleP>
    </>
  );
}
