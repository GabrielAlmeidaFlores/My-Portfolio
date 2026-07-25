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
  Start["Busqueda web en el agente"]

  Start --> A["A: scraper MCP"]
  Start --> B["B: MCP + SearXNG"]
  Start --> C["C: MCP custom"]

  A --> ResultA["Smoke test"]
  B --> ResultB["Uso diario"]
  C --> ResultC["Alto esfuerzo"]

  ResultB --> Pick["Decision: B"]`;

const PROBLEM_CHART = `flowchart TB
  Need["El agente necesita la web"]
  Need --> Paid["API de busqueda de pago"]
  Need --> Scrape["MCP scraper directo"]
  Paid --> PainPaid["Cuota / costo / privacidad"]
  Scrape --> PainScrape["CAPTCHA / bloqueo / HTML"]
  PainPaid --> Gap["Falta busqueda local estable"]
  PainScrape --> Gap`;

const OPTION_B_CHART = `flowchart LR
  Ag["Agente"] --> Mcp["MCP listo"]
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
  F1["1. SearXNG Docker"] --> F2["2. MCP en el cliente"]
  F2 --> F3["3. Aceptacion rapida"]`;

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

export function BuscaWebLocalMcpSearxngContentEs() {
  return (
    <>
      <ArticleH2>1. El problema que apareció en la práctica</ArticleH2>

      <ArticleP>
        Este post cuenta cómo armé búsqueda web estable para el agente de IA en
        mi máquina. Sin API de search de pago. Sin scraper frágil.
      </ArticleP>

      <ArticleP>
        El stack es{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>{" "}
        listo +{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>{" "}
        local en Docker. Tres nombres que verás todo el tiempo:
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
          : protocolo que deja al agente llamar tools (buscar, leer URL) en
          Cursor/Copilot, en lugar de “abrir el navegador solo”
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
          open source que hospedas; consulta varios buscadores y devuelve un
          resultado unificado (JSON en mi caso)
        </ArticleLi>
        <ArticleLi>
          engine: el buscador externo de donde vienen los hits (Google, Bing,
          DuckDuckGo…). SearXNG habla con las engines; el MCP habla con SearXNG
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Atajo">
        <ArticleP>
          ¿Quieres el checklist de montaje ahora? Salta a la{" "}
          <a href="#3-como-lo-arme-en-la-practica" className={linkClass}>
            sección 3
          </a>
          .
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Si prefieres el porqué antes del cómo, sigue aquí.
      </ArticleP>

      <ArticleP>
        En el día a día el agente necesita información que no está en el
        repositorio ni en la memoria de entrenamiento del modelo:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>documentación que cambió ayer</ArticleLi>
        <ArticleLi>changelog de SDK</ArticleLi>
        <ArticleLi>issue abierto de madrugada</ArticleLi>
        <ArticleLi>endpoint que la API deprecó</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Sin acceso confiable a la web, el agente adivina la versión equivocada,
        inventa un detalle o se queda pidiendo confirmación. La sesión se traba.
      </ArticleP>

      <ArticleP>
        El flujo que quiero es directo:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>buscar</ArticleLi>
        <ArticleLi>leer un buen tramo</ArticleLi>
        <ArticleLi>aplicar en el código</ArticleLi>
        <ArticleLi>validar</ArticleLi>
      </ArticleOl>

      <ArticleP>
        Cuando la búsqueda falla a mitad de camino, el resto se viene abajo. El
        agente reintenta, alucina o te interrumpe. En sesiones largas eso se
        vuelve fricción real.
      </ArticleP>

      <ArticleP>
        Comparé API de pago, scraper MCP y metasearch local. Me quedé con el
        metasearch. A continuación, qué se rompe en los otros dos.
      </ArticleP>

      <ArticleH3>Dónde empiezan a doler las APIs de búsqueda de pago</ArticleH3>

      <ArticleP>
        Las APIs comerciales funcionan bien cuando el volumen es bajo y la
        previsibilidad importa más que la factura a fin de mes.
      </ArticleP>

      <ArticleP>
        El desarrollo con agente no son “dos queries al día”. Es exploración:
        abrir varios frentes, comparar docs, cazar issues y retroceder cuando la
        hipótesis no se sostiene.
      </ArticleP>

      <ArticleP>
        A ese ritmo, tres cosas aprietan:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>el precio sube rápido</ArticleLi>
        <ArticleLi>
          la cuota y el{" "}
          <a
            href="https://en.wikipedia.org/wiki/Rate_limiting"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            rate-limit
          </a>{" "}
          llegan cuando quieres velocidad
        </ArticleLi>
        <ArticleLi>
          términos sensibles (cliente, stack, incidente) salen de tu máquina
          hacia un{" "}
          <a
            href="https://en.wikipedia.org/wiki/Software_as_a_service"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            SaaS
          </a>{" "}
          de terceros
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Si el proveedor cambia precio, política o disponibilidad, tu flujo local
        se rompe junto.
      </ArticleP>

      <ArticleH3>Scrapers “gratis” y la falsa sensación de victoria</ArticleH3>

      <ArticleP>
        Otro camino común es un paquete{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>{" "}
        listo que raspa un motor público directo (DuckDuckGo y compañía).
      </ArticleP>

      <ArticleP>
        En MCP, tool es una acción con nombre (nombre + inputs + resultado). El
        agente pide; el host ejecuta; el modelo continúa.
      </ArticleP>

      <ArticleP>
        En este paquete de búsqueda, dos tools importan:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>search_web</ArticleCode>: busca en la web y devuelve
          títulos, links y snippets
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>fetch_url</ArticleCode> (cuando el paquete la tiene): abre
          una URL específica y devuelve el contenido para leer
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        En la práctica el flujo del scraper es este:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          el agente pide la tool <ArticleCode>search_web</ArticleCode>
        </ArticleLi>
        <ArticleLi>el servidor MCP baja la página por HTTP</ArticleLi>
        <ArticleLi>el servidor MCP intenta parsear HTML</ArticleLi>
        <ArticleLi>
          el servidor MCP devuelve links y snippets al modelo
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        En un smoke test parece magia: cero cuenta, cero Docker, respuesta al
        momento.
      </ArticleP>

      <ArticleP>
        En uso continuo, la historia cambia:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>el IP se bloquea</ArticleLi>
        <ArticleLi>
          aparece{" "}
          <a
            href="https://es.wikipedia.org/wiki/CAPTCHA"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            CAPTCHA
          </a>
        </ArticleLi>
        <ArticleLi>el layout de la página cambia y el parser se rompe</ArticleLi>
        <ArticleLi>la latencia se vuelve ruleta</ArticleLi>
      </ArticleUl>

      <ArticleP>
        La tasa de falla sube en el patrón de un agente autónomo: muchas
        consultas en ráfaga, durante horas. Es el mismo mecanismo de la opción
        A en la sección siguiente.
      </ArticleP>

      <ArticleP>
        El diagrama abajo resume lo que acabas de leer:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>el agente necesita consultar la web</ArticleLi>
        <ArticleLi>
          la API de pago falla en uso continuo por cuota y privacidad
        </ArticleLi>
        <ArticleLi>
          el scraper MCP público falla por bloqueo y CAPTCHA
        </ArticleLi>
        <ArticleLi>
          la salida que busqué: SearXNG + MCP en mi máquina, y el agente habla
          con ese servicio local
        </ArticleLi>
      </ArticleUl>

      <ArticleMermaid
        ariaLabel="Problema: API de pago y scraper MCP fallan; falta un servicio de búsqueda local estable"
        chart={PROBLEM_CHART}
      />

      <ArticleCallout variant="note" title="Qué llamo “local” aquí">
        <ArticleP>
          Local no significa offline. Significa que SearXNG y el MCP corren en
          tu máquina.
        </ArticleP>
        <ArticleP>
          Hospedas SearXNG + MCP. Internet y las engines externas siguen. Lo
          que cambia: puerto, secret y ciclo de vida quedan bajo tu dominio.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Si quieres la base oficial del protocolo y del metasearch:{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Model Context Protocol
        </a>{" "}
        y la{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          documentación de SearXNG
        </a>
        .
      </ArticleP>

      <ArticleH2>2. Tres caminos que puse sobre la mesa</ArticleH2>

      <ArticleP>
        Quería la opción más estable para el día a día, con ownership bajo. Tres
        rutas:
      </ArticleP>

      <ArticleH3>Opción A: MCP listo con scraper público directo</ArticleH3>

      <ArticleP>
        Instalas un MCP de búsqueda vía{" "}
        <a
          href="https://docs.npmjs.com/cli/v10/commands/npm-exec"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          npx
        </a>
        . Sin Docker. Sin metasearch. En minutos el agente gana{" "}
        <ArticleCode>search_web</ArticleCode>.
      </ArticleP>

      <ArticleP>
        Por debajo, el paquete suele ser scraper: HTTP a un motor público, HTML,
        parser. Setup casi cero. Genial para smoke test.
      </ArticleP>

      <ArticleP>
        En uso continuo se rompe:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <a
            href="https://es.wikipedia.org/wiki/CAPTCHA"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            CAPTCHA
          </a>{" "}
          y{" "}
          <a
            href="https://en.wikipedia.org/wiki/Rate_limiting"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            rate-limit
          </a>
        </ArticleLi>
        <ArticleLi>el HTML cambia y el parser se calla</ArticleLi>
        <ArticleLi>ráfaga de agente = patrón que el anti-abuso castiga</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Lo usé como experimento. Lo descarté como línea principal.
      </ArticleP>

      <ArticleH3>Opción B: MCP listo + SearXNG local en Docker</ArticleH3>

      <ArticleP>
        Aquí el flujo cambia de rol. El paquete{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>{" "}
        deja de “raspar la web solo”. El paquete MCP se vuelve cliente HTTP de
        un servicio que <em>tú</em> hospedas: el{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>
        . En la práctica el flujo es este:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          el agente pide la tool <ArticleCode>search_web</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          el servidor MCP arma un GET/POST a{" "}
          <ArticleCode>http://127.0.0.1:…/search?format=json</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          SearXNG reparte la consulta por varias engines (buscadores externos)
        </ArticleLi>
        <ArticleLi>
          SearXNG agrega, deduplica y devuelve JSON unificado
        </ArticleLi>
        <ArticleLi>
          el MCP entrega el resultado de <ArticleCode>search_web</ArticleCode>{" "}
          de vuelta al modelo
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        El agente nunca “abre Chrome”. El agente solo consume el resultado de la
        tool <ArticleCode>search_web</ArticleCode> (y, si necesita leer una
        página, puede pedir <ArticleCode>fetch_url</ArticleCode> después).
      </ArticleP>

      <ArticleP>
        SearXNG es un{" "}
        <a
          href="https://en.wikipedia.org/wiki/Metasearch_engine"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          metasearch
        </a>
        : orquesta Google, Bing, DuckDuckGo y similares en una sola respuesta.
      </ArticleP>

      <ArticleP>
        En Docker en loopback (<ArticleCode>127.0.0.1</ArticleCode>):
      </ArticleP>

      <ArticleUl>
        <ArticleLi>cero costo de API de search</ArticleLi>
        <ArticleLi>la query pasa primero por tu máquina</ArticleLi>
        <ArticleLi>controlas puerto, secret y ciclo de vida</ArticleLi>
        <ArticleLi>precio = operación (contenedor + JSON conectado)</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Un engine malo rara vez tumba el metasearch entero. Fue la línea que
        sobrevivió en el día a día.
      </ArticleP>

      <ArticleP>
        “¿No es solo otro scraper?” Respuesta corta en la sección 4.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Flujo de la opción B: agente, MCP, SearXNG local y engines"
        chart={OPTION_B_CHART}
      />

      <ArticleH3>Opción C: MCP custom con el SDK</ArticleH3>

      <ArticleP>
        Escribir tu propio servidor con{" "}
        <ArticleCode>@modelcontextprotocol/sdk</ArticleCode> (en general vía{" "}
        <a
          href="https://modelcontextprotocol.io/specification/2025-06-18/basic/transports"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          stdio
        </a>
        ). Viable. Ownership alto.
      </ArticleP>

      <ArticleP>
        Pasas a ser dueño de timeout, parsing, 403/429, payload y changelog.
        Frente a MCP listo + SearXNG, la ganancia neta suele ser baja.
      </ArticleP>

      <ArticleP>
        Descarté la C. El SDK solo vuelve si la tool es muy específica (policy,
        filtro, telemetría).
      </ArticleP>

      <ArticleP>
        Resumen visual de la decisión y de la tabla justo abajo:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Flujo de decisión entre opciones A, B y C"
        chart={DECISION_CHART}
      />

      <ArticleTable caption="Comparativo rápido de las tres opciones">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Criterio</ArticleTh>
            <ArticleTh>A: Scraper MCP</ArticleTh>
            <ArticleTh>B: MCP + SearXNG</ArticleTh>
            <ArticleTh>C: MCP custom</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Costo financiero</ArticleTd>
            <ArticleTd>Bajo hasta que falla</ArticleTd>
            <ArticleTd>Cero de API</ArticleTd>
            <ArticleTd>Alto en tiempo de ingeniería</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Estabilidad / rate-limit</ArticleTd>
            <ArticleTd>Frágil</ArticleTd>
            <ArticleTd>Buena, con agregación</ArticleTd>
            <ArticleTd>Depende de la implementación</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Esfuerzo para ponerlo en aire</ArticleTd>
            <ArticleTd>Mínimo</ArticleTd>
            <ArticleTd>Moderado</ArticleTd>
            <ArticleTd>Alto</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Privacidad</ArticleTd>
            <ArticleTd>Baja a media</ArticleTd>
            <ArticleTd>Alta (servicio en tu máquina)</ArticleTd>
            <ArticleTd>Alta, si está bien hecho</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>¿Encaja en el objetivo real?</ArticleTd>
            <ArticleTd>Solo smoke test</ArticleTd>
            <ArticleTd>Uso diario</ArticleTd>
            <ArticleTd>Overengineering</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleCallout variant="tip" title="La decisión">
        <ArticleP>
          Me quedé con la B: estabilidad y privacidad sin transformar la solución
          en un producto interno eterno. Es la menor arquitectura que sobrevive a
          una semana real, no solo a un demo.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. Cómo lo armé en la práctica</ArticleH2>

      <ArticleP>
        Tres fases. Diagrama = mapa. Texto = checklist.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Tres fases de montaje: SearXNG en Docker, MCP en el cliente y aceptación rápida"
        chart={SETUP_CHART}
      />

      <ArticleH3>Fase 1: SearXNG en Docker</ArticleH3>

      <ArticleP>
        Creé un directorio local (en mi caso,{" "}
        <ArticleCode>~/searxng</ArticleCode>) y preparé el{" "}
        <ArticleCode>settings.yml</ArticleCode>. El detalle que más gente olvida
        es el formato JSON. Sin el formato JSON, la API responde 403 y el MCP
        parece “roto” sin motivo aparente.
      </ArticleP>

      <ArticleP>
        Genera secrets fuertes con{" "}
        <ArticleCode>openssl rand -hex 32</ArticleCode> y no dejes placeholder
        en el archivo. Un extracto mínimo queda así:
      </ArticleP>

      <ArticleCode block>
        {`# settings.yml (extracto esencial)
use_default_settings: true

general:
  instance_name: "searxng-local"

server:
  secret_key: "REEMPLAZA_CON_OPENSSL_RAND_HEX_32"
  limiter: false
  image_proxy: true

search:
  formats:
    - html
    - json`}
      </ArticleCode>

      <ArticleCallout variant="warning" title="Sin JSON, te comes un 403">
        <ArticleP>
          Si <ArticleCode>json</ArticleCode> no está en{" "}
          <ArticleCode>search.formats</ArticleCode>, la API rechaza la respuesta
          y el MCP aparenta falla de integración. La mayoría de las veces el
          problema está solo en esa línea.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>El compose con bind restringido al loopback:</ArticleP>

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
        Sube con <ArticleCode>docker compose up -d</ArticleCode> y valida con un
        curl simple. Si vuelve JSON, la capa SearXNG está ok.
      </ArticleP>

      <ArticleCode block>
        {`docker compose up -d

curl -s "http://127.0.0.1:8099/search?q=model+context+protocol&format=json" | head`}
      </ArticleCode>

      <ArticleP>
        La UI local queda en <ArticleCode>http://127.0.0.1:8099</ArticleCode>. La
        referencia oficial de instalación está en la{" "}
        <a
          href="https://docs.searxng.org/admin/installation-docker.html"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          documentación Docker de SearXNG
        </a>
        .
      </ArticleP>

      <ArticleH3>Fase 2: MCP en el cliente (Cursor o Copilot)</ArticleH3>

      <ArticleP>
        El paquete MCP es el mismo. Lo que cambia es el archivo de configuración
        del host. En Cursor, usa el MCP global en{" "}
        <ArticleCode>~/.cursor/mcp.json</ArticleCode> o por proyecto en{" "}
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
        En VS Code con GitHub Copilot, el equivalente queda en{" "}
        <ArticleCode>.vscode/mcp.json</ArticleCode> (workspace) o en la config
        de usuario vía Command Palette (
        <ArticleCode>MCP: Open User Configuration</ArticleCode>). La clave raíz
        es <ArticleCode>servers</ArticleCode>, no{" "}
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
          <ArticleCode>DEFAULT_SEARCH_PROVIDER=searxng</ArticleCode> evita caer
          en el scraper default
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>SEARXNG_URL</ArticleCode> apunta a la instancia local
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>HTTP_TIMEOUT</ArticleCode> evita muerte temprana en la
          agregación
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        ¿Guardaste? Recarga el host y confirma que el servidor aparece conectado
        en la UI de tools.
      </ArticleP>

      <ArticleH3>Fase 3: Aceptación rápida</ArticleH3>

      <ArticleOl>
        <ArticleLi>Recargar el cliente MCP después de guardar la config.</ArticleLi>
        <ArticleLi>Confirmar el servidor MCP conectado en settings/tools.</ArticleLi>
        <ArticleLi>
          Correr <ArticleCode>search_web</ArticleCode> con una query objetiva.
        </ArticleLi>
        <ArticleLi>
          Correr <ArticleCode>fetch_url</ArticleCode> en la mejor fuente y pedir
          una síntesis corta.
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        Dos prompts que uso para validar el flujo de punta a punta:
      </ArticleP>

      <ArticleCode block>
        {`Usa search_web para encontrar la documentación oficial del Model Context Protocol.
Después usa fetch_url en la mejor fuente y resume en 5 bullets accionables.`}
      </ArticleCode>

      <ArticleCode block>
        {`Busca issues recientes sobre error 403 en SearXNG con format=json.
Cita links y separa causa de configuración de bloqueo de engine.`}
      </ArticleCode>

      <ArticleH2>4. Cómo encaja el stack (y vs scraper)</ArticleH2>

      <ArticleP>
        Cuatro piezas. Cuatro trabajos.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Cliente MCP (Cursor/Copilot): descubre tools y decide cuándo llamarlas
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
          ): arranca con <ArticleCode>npx</ArticleCode>, habla JSON-RPC/stdio,
          se vuelve HTTP local
        </ArticleLi>
        <ArticleLi>
          SearXNG en <ArticleCode>127.0.0.1</ArticleCode>: metasearch y JSON
          unificado
        </ArticleLi>
        <ArticleLi>
          Engines externas (Google, Bing, DuckDuckGo…): en internet pública
        </ArticleLi>
      </ArticleUl>

      <ArticleMermaid
        ariaLabel="Arquitectura de extremo a extremo: cliente MCP, SearXNG y engines"
        chart={ARCHITECTURE_CHART}
      />

      <ArticleH3>SearXNG vs scraper</ArticleH3>

      <ArticleP>
        Diseño distinto. SearXNG tampoco es inmune al bloqueo. Lo que cambia es
        quién falla.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Opción A: el MCP raspa una engine HTML. CAPTCHA/429 tumba la tool.
        </ArticleLi>
        <ArticleLi>
          Opción B: el MCP solo habla con SearXNG local. SearXNG habla con varias
          engines.
        </ArticleLi>
        <ArticleLi>
          Un engine malo se vuelve “menos fuentes”, no ruleta total.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="note" title="IP y rate-limit: el corte honesto">
        <ArticleP>
          El pedido a los engines sigue saliendo de tu IP. SearXNG no te vuelve
          invisible.
        </ArticleP>
        <ArticleP>
          Lo que la stack evita es la falla total típica del scraper: martillar
          un único endpoint HTML público hasta que el anti-abuso cierre la
          puerta.
        </ArticleP>
      </ArticleCallout>

      <ArticleMermaid
        ariaLabel="Contraste: scraper MCP con una engine HTML versus SearXNG local con varias engines"
        chart={SCRAPER_VS_SEARXNG_CHART}
      />

      <ArticleP>
        Matices rápidos:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          JSON en <ArticleCode>settings.yml</ArticleCode>, si no 403
        </ArticleLi>
        <ArticleLi>Local ≠ offline: engines usan internet pública</ArticleLi>
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

      <ArticleH2>5. Qué mejora, qué cuesta y dónde aprieta</ArticleH2>

      <ArticleP>
        Qué mejora:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>cero API de búsqueda</ArticleLi>
        <ArticleLi>menos SaaS en el camino de la query</ArticleLi>
        <ArticleLi>un engine malo no tumba el metasearch</ArticleLi>
        <ArticleLi>puerto, formatos y secrets bajo tu mando</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Qué cuesta:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>atención de Docker en la workstation</ArticleLi>
        <ArticleLi>latencia de agregación</ArticleLi>
        <ArticleLi>engines que se degradan de vez en cuando</ArticleLi>
        <ArticleLi>CPU/red en ráfaga de búsqueda</ArticleLi>
      </ArticleUl>

      <ArticleH3>Benchmarks: qué cambia de verdad la búsqueda</ArticleH3>

      <ArticleP>
        En el día a día, lo que siento con búsqueda en el agente no es un
        “score de leaderboard”. Es fricción de sesión:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>menos endpoint inventado</ArticleLi>
        <ArticleLi>menos versión vieja de lib</ArticleLi>
        <ArticleLi>
          menos “certeza” sobre un issue que abrió ayer
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Eso es{" "}
        <TermLink href={GROUNDING_URL}>grounding</TermLink>: amarrar la
        respuesta a evidencia externa.
      </ArticleP>

      <ArticleP>
        Sin búsqueda, el modelo completa con lo que suena plausible. Con
        búsqueda, puede citar lo que acaba de leer. Sube factualidad y frescura.
        No sube solo “seguir mejor el prompt” en una tarea que el repo ya
        resuelve.
      </ArticleP>

      <ArticleP>
        El flujo que hace funcionar esto en la práctica:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          <ArticleCode>search_web</ArticleCode>: encontrar fuentes
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>fetch_url</ArticleCode>: leer la mejor página
        </ArticleLi>
        <ArticleLi>síntesis: responder con base en lo leído</ArticleLi>
      </ArticleOl>

      <ArticleP>
        La industria lo mide con{" "}
        <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> (preguntas cortas de
        hecho, OpenAI).
      </ArticleP>

      <ArticleP>
        MCP + SearXNG local no tiene score propio en esos tests. Los números
        abajo son referencia de la clase “modelo + búsqueda web”, no certificado
        de tu Docker:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Sin búsqueda: en el paper de{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>, GPT-4o quedó por
          debajo de ~40%
        </ArticleLi>
        <ArticleLi>
          Con grounding: Brave reportó F1 de 94,1% en{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> con{" "}
          <TermLink href={GROUNDING_URL}>AI Grounding</TermLink>
        </ArticleLi>
        <ArticleLi>
          En análisis de vendors (
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> y{" "}
          <TermLink href={FRAMES_URL}>FRAMES</TermLink>
          ): ganancia típica de +25 a +40 puntos porcentuales
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Puntos porcentuales no son “% relativa”: pasar de 40% a 70% es +30
        puntos, no multiplicar por 1,3.
      </ArticleP>

      <ArticleImg
        src="/images/publications/busca-web-local-mcp-searxng/brave-simpleqa-grounding.jpg"
        alt="Gráfico SimpleQA de Brave mostrando alto rendimiento con AI Grounding frente a baselines"
        caption={
          <>
            Referencia visual: salto de factualidad con grounding. Fuente: Brave
            Search (
            <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>
            ).
          </>
        }
      />

      <ArticleCallout variant="note" title="Lo que no estoy prometiendo">
        <ArticleP>
          Esos números no certifican que tu SearXNG local va a pegar 94% en{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>. Miden grounding con
          búsqueda en evaluaciones públicas. La ganancia que optimizo es la
          fricción de sesión, no el leaderboard.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>Para quién es útil (y para quién no)</ArticleH3>

      <ArticleP>
        El stack ayuda cuando el agente necesita información actual fuera del
        repositorio.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>docs que cambiaron en la semana</ArticleLi>
        <ArticleLi>changelog de SDK</ArticleLi>
        <ArticleLi>issue abierto ayer</ArticleLi>
        <ArticleLi>CVE reciente</ArticleLi>
        <ArticleLi>comparación de APIs</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Ahí la memoria de entrenamiento es el lugar equivocado para apostar.
      </ArticleP>

      <ArticleP>
        El retorno es débil cuando la tarea ya está resuelta por el workspace:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>refactorizar un módulo</ArticleLi>
        <ArticleLi>seguir un patrón del repo</ArticleLi>
        <ArticleLi>escribir un test sobre el código abierto</ArticleLi>
      </ArticleUl>

      <ArticleP>
        La búsqueda web en esos casos se vuelve ruido. Un prompt malo también
        sigue malo: el grounding no "mejora la precisión del prompt". El
        grounding mejora la base factual cuando la verdad está fuera del
        contexto local.
      </ArticleP>

      <ArticleTable caption="Quién gana y quién casi no lo siente">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Perfil</ArticleTh>
            <ArticleTh>Qué cambia en la práctica</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Dev con agente en el flujo diario</ArticleTd>
            <ArticleTd>
              Menos alucinación de API/docs; la sesión inventa y reza menos
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Quien caza issue, CVE, changelog</ArticleTd>
            <ArticleTd>
              La frescura gana al cutoff de entrenamiento; se puede pedir link
              y fragmento
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Quien evita API paga de search</ArticleTd>
            <ArticleTd>
              Misma clase de ganancia de grounding, con costo de API cero y
              query en tu máquina
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Solo edición en repo cerrado</ArticleTd>
            <ArticleTd>
              Ganancia baja; el contexto del proyecto ya suele bastar
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleTable caption="Cuellos de botella que ya vi y cómo los mitigé">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Cuello de botella</ArticleTh>
            <ArticleTh>Síntoma</ArticleTh>
            <ArticleTh>Mitigación</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Timeouts</ArticleTd>
            <ArticleTd>La tool falla bajo carga</ArticleTd>
            <ArticleTd>
              Subir <ArticleCode>HTTP_TIMEOUT</ArticleCode> y reducir engines
              activos
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Payload grande</ArticleTd>
            <ArticleTd>El contexto del LLM se desborda</ArticleTd>
            <ArticleTd>
              Pedir síntesis y usar <ArticleCode>fetch_url</ArticleCode> selectivo
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Cold start</ArticleTd>
            <ArticleTd>Primera búsqueda lenta</ArticleTd>
            <ArticleTd>
              Mantener el contenedor up y healthcheck en el compose
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Loops de búsqueda</ArticleTd>
            <ArticleTd>El agente investiga de más</ArticleTd>
            <ArticleTd>
              Limitar en el prompt y validar hipótesis antes de la siguiente
              query
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH2>6. Operación del día a día y qué hacer cuando se rompe</ArticleH2>

      <ArticleP>
        Trata el contenedor y el MCP como infraestructura de workstation, no
        como plugin mágico.
      </ArticleP>

      <ArticleTable caption="Troubleshooting que más aparece">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Escenario</ArticleTh>
            <ArticleTh>Qué hago</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>La máquina reinició</ArticleTd>
            <ArticleTd>
              <ArticleCode>docker compose up -d</ArticleCode> + curl de sanidad
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>El contenedor cayó</ArticleTd>
            <ArticleTd>
              Status con <ArticleCode>docker ps -a</ArticleCode>, logs y restart
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>MCP no sube en el cliente</ArticleTd>
            <ArticleTd>
              Revisar PATH de Node/npx en la app gráfica y probar{" "}
              <ArticleCode>npx -y @zhafron/mcp-web-search</ArticleCode> en la
              terminal
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>403 en format=json</ArticleTd>
            <ArticleTd>
              Confirmar <ArticleCode>json</ArticleCode> en{" "}
              <ArticleCode>search.formats</ArticleCode> y recrear el contenedor
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Resultados flojos</ArticleTd>
            <ArticleTd>
              Ajustar engines, cortar loops y preferir{" "}
              <ArticleCode>fetch_url</ArticleCode> en fuentes oficiales
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Algunas prácticas que pagan el almuerzo:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>mantener SearXNG en 127.0.0.1</ArticleLi>
        <ArticleLi>generar secrets de verdad con openssl</ArticleLi>
        <ArticleLi>
          enseñar al agente a buscar poco y leer bien, en este flujo:
        </ArticleLi>
      </ArticleUl>

      <ArticleOl>
        <ArticleLi>search</ArticleLi>
        <ArticleLi>fetch</ArticleLi>
        <ArticleLi>síntesis</ArticleLi>
      </ArticleOl>

      <ArticleP>
        Trata la degradación de engine como operación normal. Los engines
        cambian. Eso no es incidente raro. Es el juego.
      </ArticleP>

      <ArticleH3>Puntos clave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Día a día: MCP listo + SearXNG local (B). No scraper directo ni MCP
          custom genérico.
        </ArticleLi>
        <ArticleLi>
          Scraper MCP: smoke test. En sesión larga vira CAPTCHA / rate-limit.
        </ArticleLi>
        <ArticleLi>
          SearXNG ≠ scraper MCP: JSON local + varios engines. El bloqueo vira
          degradación. No es inmune a rate-limit / IP.
        </ArticleLi>
        <ArticleLi>
          SDK custom solo para tool bien específica; si no, el ownership se come
          la ganancia.
        </ArticleLi>
        <ArticleLi>
          SearXNG: JSON en <ArticleCode>search.formats</ArticleCode>, bind en{" "}
          <ArticleCode>127.0.0.1</ArticleCode>, engines que degradan = normal.
        </ArticleLi>
        <ArticleLi>
          Agente: search → fetch → síntesis. Poco ruido en el contexto.
        </ArticleLi>
        <ArticleLi>
          Grounding sube factualidad / frescura. No “mejora el prompt” solo.
        </ArticleLi>
        <ArticleLi>
          Local ≠ offline: controlas el servicio; internet alimenta los engines.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusión</ArticleH3>

      <ArticleP>
        No elegí construir más software. Elegí la menor arquitectura que aguanta
        uso real.
      </ArticleP>

      <ArticleP>
        MCP listo + SearXNG local: costo cero de API, servicio en tu máquina,
        más estable que scraper. Overhead aceptable si ya vives en Docker.
      </ArticleP>

      <ArticleP>
        La ganancia que importa es la del grounding: factualidad y frescura
        cuando la verdad está en la web. No un “prompt mágicamente más preciso”.
      </ArticleP>

      <ArticleP>
        Si el objetivo es un agente con búsqueda confiable de lunes a viernes,
        la opción B no es un atajo. Es la línea que dejaría corriendo en mi
        máquina y recomendaría a alguien del equipo sin ninguna vergüenza.
      </ArticleP>
    </>
  );
}
