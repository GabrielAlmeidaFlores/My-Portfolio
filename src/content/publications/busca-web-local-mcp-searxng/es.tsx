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

const SEARXNG_COMPARE_CHART = `flowchart TB
  subgraph Direct["A: scraper directo"]
    direction TB
    A1["Agente"] --> A2["1 engine"]
    A2 --> A3["Bloqueo / CAPTCHA"]
  end

  subgraph Paid["B: API SaaS"]
    direction TB
    B1["Agente"] --> B2["Proveedor de pago"]
    B2 --> B3["Costo + cuota"]
  end

  subgraph Meta["C: SearXNG local"]
    direction TB
    C1["Agente + MCP"] --> C2["SearXNG"]
    C2 --> C3["Varias engines + JSON"]
  end

  Direct --> Pick["Eleccion: C"]
  Paid --> Pick
  Meta --> Pick`;

const DECISION_CHART = `flowchart TB
  Start["Busqueda web en el agente"]

  Start --> A["A: scraper MCP"]
  Start --> B["B: MCP + SearXNG"]
  Start --> C["C: MCP custom"]

  A --> ResultA["Smoke test"]
  B --> ResultB["Uso diario"]
  C --> ResultC["Alto esfuerzo"]

  ResultB --> Decide["Decision: B"]`;

const PROBLEM_CHART = `flowchart TB
  Need["El agente necesita la web"]
  Need --> Paid["API de busqueda de pago"]
  Need --> Scrape["MCP scraper directo"]
  Paid --> PainPaid["Cuota / costo / privacidad"]
  Scrape --> PainScrape["CAPTCHA / bloqueo / HTML"]
  PainPaid --> Gap["Falta busqueda local estable"]
  PainScrape --> Gap`;

const OPTION_A_CHART = `flowchart LR
  Ag["Agente"] --> Mcp["MCP listo"]
  Mcp --> Http["HTTP al engine"]
  Http --> Html["HTML / endpoint"]
  Html --> Parse["Parser"]
  Parse --> Out["Snippets"]
  Html -.-> Fail["CAPTCHA / 429"]`;

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

const OPTION_C_CHART = `flowchart LR
  Ag["Agente"] -->|"stdio"| Custom["Tu MCP SDK"]
  Custom --> Code["Tu codigo"]
  Code --> Web["HTTP / scraper / API"]`;

const MCP_ROLES_CHART = `flowchart TB
  Host["Host: Cursor / Copilot"]
  Client["Cliente MCP"]
  Server["Servidor MCP"]
  Host --> Client
  Client -->|"tools / JSON-RPC"| Server`;

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
        local en Docker. Antes del setup, el problema que me trajo hasta aquí.
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
        Sin acceso confiable a la web, el agente adivina la versión equivocada, inventa un
        detalle o se queda pidiendo confirmación. La sesión se traba.
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
        Cuando la búsqueda falla a mitad de camino, el resto se viene abajo.
        El agente reintenta, alucina o te interrumpe. En sesiones largas eso se vuelve
        fricción real.
      </ArticleP>

      <ArticleP>
        Comparé tres caminos y me quedé con el tercero: API de pago, scraper
        MCP, metasearch local. A continuación: qué duele en las APIs
        comerciales, por qué un scraper “gratis” engaña en el smoke test, y qué
        significa “local” en este texto.
      </ArticleP>

      <ArticleH3>Dónde empiezan a doler las APIs de búsqueda de pago</ArticleH3>

      <ArticleP>
        Las APIs comerciales funcionan bien cuando el volumen es bajo y la
        previsibilidad importa más que la factura a fin de mes.
      </ArticleP>

      <ArticleP>
        El desarrollo con agente no son “dos queries al día”. Es exploración:
        abrir varios frentes, comparar docs, cazar issues y retroceder cuando
        la hipótesis no se sostiene.
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
        Aquí “tool” no es una herramienta genérica. En{" "}
        <a
          href="https://modelcontextprotocol.io/docs/concepts/tools"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>
        , tool es una acción con nombre que el agente puede pedir al host:
        nombre, inputs y un resultado estructurado. El modelo no abre el
        navegador solo. El agente pide la tool, el host ejecuta el servidor MCP
        y el texto vuelve para que el modelo continúe.
      </ArticleP>

      <ArticleP>
        En este paquete de búsqueda, las tools que importan son estas:
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
          Quitas el intermediario SaaS de búsqueda y hospedas la orquestación (
          <a
            href="https://docs.searxng.org/"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            SearXNG
          </a>{" "}
          + MCP) ahí. Internet sigue existiendo. Los engines externos siguen
          siendo consultados. La diferencia: la capa que el agente ve queda bajo
          tu dominio (puerto, secret, ciclo de vida y lo que queda expuesto en
          la red).
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
        No estaba cazando la arquitectura más sofisticada. Quería la opción más
        estable para uso diario, con el menor costo de ownership posible. Tres
        rutas aparecieron de forma natural. Antes del diagrama, vale entender
        cada una en texto.
      </ArticleP>

      <ArticleH3>Opción A: MCP listo con scraper público directo</ArticleH3>

      <ArticleP>
        En esta opción instalas un paquete MCP de búsqueda listo (vía{" "}
        <a
          href="https://docs.npmjs.com/cli/v10/commands/npm-exec"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          npx
        </a>{" "}
        / Node) y apuntas el cliente del agente hacia el pacote MCP. No levantas Docker, no
        configuras metasearch, no escribes servidor. En pocos minutos el agente
        gana una tool del tipo <ArticleCode>search_web</ArticleCode>: el agente pide una
        query, el servidor MCP hace la búsqueda y devuelve títulos, links y
        snippets para que el modelo los use en el siguiente paso.
      </ArticleP>

      <ArticleP>
        El detalle que importa es <em>cómo</em> ese paquete busca. En general el
        paquete actúa como scraper: abre (por HTTP) la página o endpoint “público” de
        un motor (DuckDuckGo y similares), lee HTML o una respuesta
        semi-estructurada, e intenta extraer resultados. No hay una API oficial
        estable en el medio. El MCP es solo el adaptador que traduce “tool del
        agente” en “pedido HTTP + parsing”. Setup casi cero, cero infra local,
        resultado inmediato. Genial para validar la idea en quince minutos.
      </ArticleP>

      <ArticleP>
        Como base continua, esa línea se rompe rápido. Los sitios de búsqueda
        defienden la superficie con anti-bot,{" "}
        <a
          href="https://es.wikipedia.org/wiki/CAPTCHA"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          CAPTCHA
        </a>{" "}
        (desafío para probar que quien consulta es humano) y{" "}
        <a
          href="https://en.wikipedia.org/wiki/Rate_limiting"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          rate-limit
        </a>{" "}
        (techo de pedidos por IP/tiempo). El HTML cambia sin aviso y el parser
        se calla. En sesión larga el agente dispara muchas queries en ráfaga:
        exactamente el patrón que el anti-abuso castiga primero. La herramienta
        se vuelve ruleta. Lo usé como experimento rápido y lo descarté como
        línea principal.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Flujo de la opción A: agente, MCP scraper, HTML y fallo por CAPTCHA o rate-limit"
        chart={OPTION_A_CHART}
      />

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
        deja de “raspar la web solo”. El pacote MCP se vuelve cliente HTTP de un servicio que{" "}
        <em>tú</em> hospedas: el{" "}
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
          SearXNG reparte la consulta por varias engines
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
        : en lugar de ser otro Google, el SearXNG orquesta buscadores y fuentes (Google,
        Bing, DuckDuckGo y otros, según la config) y limpia buena parte del
        ruido en una sola respuesta. Correr eso en{" "}
        <a
          href="https://docs.docker.com/get-started/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Docker
        </a>{" "}
        en el{" "}
        <a
          href="https://en.wikipedia.org/wiki/Localhost"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          loopback
        </a>{" "}
        (<ArticleCode>127.0.0.1</ArticleCode>) significa: el proceso queda
        aislado en un contenedor, sube con compose, y la API JSON solo escucha
        en tu máquina. Ganas pragmatismo (MCP maduro, sin reinventar el
        protocolo), costo cero de API de search, mejor privacidad porque la
        query pasa primero por tu máquina, y control de puerto, secret y ciclo
        de vida.
      </ArticleP>

      <ArticleP>
        El precio es operativo, no de factura SaaS: mantener el contenedor al
        aire, habilitar el formato JSON, aceptar que engines externas aún pueden
        degradarse. Aun así, un engine malo rara vez tumba el metasearch entero.
        Para uso diario de agente, esa fue la línea que sobrevivió.
      </ArticleP>

      <ArticleP>
        Si la duda es “¿no es solo otro scraper?” o “¿por qué el{" "}
        <a
          href="https://en.wikipedia.org/wiki/Rate_limiting"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          rate-limit
        </a>{" "}
        y el IP no matan igual?”, la respuesta corta está en la sección
        siguiente, en el bloque SearXNG vs scraper.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Flujo de la opción B: agente, MCP, SearXNG local y engines"
        chart={OPTION_B_CHART}
      />

      <ArticleH3>Opción C: MCP custom con el SDK</ArticleH3>

      <ArticleP>
        La tercera ruta es escribir tu propio servidor MCP. En TypeScript eso
        suele pasar por el paquete oficial{" "}
        <ArticleCode>@modelcontextprotocol/sdk</ArticleCode>: levantas un
        proceso Node, registras tools (nombre, schema de input, handler) y
        hablas con el cliente del agente por el transporte del protocolo (en
        desktop, en general{" "}
        <a
          href="https://modelcontextprotocol.io/specification/2025-06-18/basic/transports"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          stdio
        </a>
        , o sea, la app del agente inicia el proceso e intercambia mensajes por
        la entrada/salida estándar). Por dentro, cada “búsqueda” se vuelve
        código tuyo: HTTP a SearXNG, a una API de pago, o scraper casero.
      </ArticleP>

      <ArticleP>
        Es totalmente viable. La cuestión es foco y ownership. Para el objetivo
        “búsqueda web estable en el agente”, pasas a ser dueño de timeout,
        parsing, fallback entre engines, tratamiento de 403/429, tamaño de
        payload, bug report y changelog de tu servidor. Cualquier mejora que un
        paquete MCP maduro ya resuelve se vuelve ticket interno. Frente a “MCP
        listo + SearXNG”, la ganancia neta suele ser baja: reconstruyes el mismo
        puente con más superficie para mantener.
      </ArticleP>

      <ArticleP>
        Descarté la C por pragmatismo. Quiero ownership bajo y resultado día a
        día, no otra pieza interna cuya única ventaja era “nosotros lo
        escribimos”. Si más adelante necesito una tool muy específica (policy
        interna, filtro de dominio, telemetría), ahí sí el SDK vuelve a la mesa.
        Para búsqueda web genérica y estable, no.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Flujo de la opción C: agente, MCP custom con SDK y código propio hasta la web"
        chart={OPTION_C_CHART}
      />

      <ArticleP>
        Con las tres opciones en papel, el flujo abajo solo resume la decisión.
        Si leíste los párrafos anteriores, el diagrama debería parecer obvio, no
        misterioso.
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
          Me quedé con la B. La opción B resuelve estabilidad y privacidad sin transformar
          la solución en un producto interno eterno de mantenimiento. La opción B es la
          menor arquitectura que sobrevive a una semana de uso real, no solo a
          un demo de viernes.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. Qué es SearXNG (y por qué el SearXNG entra en juego)</ArticleH2>

      <ArticleP>
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>{" "}
        es un{" "}
        <a
          href="https://en.wikipedia.org/wiki/Metasearch_engine"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          metasearch
        </a>{" "}
        engine open source y autoalojable. No es “otro Google”. Agrega
        resultados de varios servicios y bases (Google, Bing, DuckDuckGo y
        decenas de otros, según la config) y devuelve una vista unificada.
        Buscas una vez; por debajo el SearXNG reparte la consulta y junta la respuesta.
      </ArticleP>

      <ArticleP>
        El proyecto nació con foco en privacidad: la instancia no necesita
        rastrear ni perfilar al usuario como lo hace un buscador comercial por
        defecto. En uso local eso queda aún más claro. La orquestación vive en
        tu máquina, el historial sensible no tiene que atravesar un SaaS de
        search, y tú decides qué queda expuesto.
      </ArticleP>

      <ArticleP>
        Elegí SearXNG por tres motivos prácticos. Primero, el SearXNG ya resuelve
        agregación y normalización de resultados, así que el MCP no tiene que
        volverse un scraper frágil de HTML. Segundo, la API{" "}
        <a
          href="https://www.json.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          JSON
        </a>{" "}
        es lo bastante directa para que un agente la consuma sin trucos. Tercero,
        la comunidad mantiene una imagen Docker y documentación lo suficientemente
        sólidas para levantarlo en minutos y operarlo día a día sin convertir
        esto en un side project eterno.
      </ArticleP>

      <ArticleH3>SearXNG vs scraper: qué cambia en el bloqueo</ArticleH3>

      <ArticleP>
        La duda que más escucho: ¿el{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>{" "}
        no es solo otro scraper? ¿Por qué el{" "}
        <a
          href="https://en.wikipedia.org/wiki/Rate_limiting"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          rate-limit
        </a>{" "}
        y el IP no matan la tool igual?
      </ArticleP>

      <ArticleP>
        Respuesta corta: el diseño es otro. Y el SearXNG tampoco es inmune al
        bloqueo. Lo que cambia es quién falla y cómo la falla aparece en la
        sesión.
      </ArticleP>

      <ArticleP>
        En el scraper MCP (opción A), el servidor MCP va directo a un motor
        público, baja HTML (o un endpoint “público”) e intenta parsear. Un
        engine. Un parser. Un punto único. En ráfaga de agente, eso parece bot:{" "}
        <a
          href="https://es.wikipedia.org/wiki/CAPTCHA"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          CAPTCHA
        </a>
        , 429 e IP marcado. Si ese motor cierra la puerta, la tool entera muere.
      </ArticleP>

      <ArticleP>
        En la opción B el rol de cada pieza cambia. El paquete{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>{" "}
        deja de ir a la web pública. El MCP pasa a ser solo un puente local
        hasta{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>
        .
      </ArticleP>

      <ArticleP>
        El proceso, del pedido del agente hasta la respuesta, es este:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          el agente pide la tool <ArticleCode>search_web</ArticleCode> con una
          query
        </ArticleLi>
        <ArticleLi>
          el servidor MCP arma un HTTP local al SearXNG en{" "}
          <a
            href="https://en.wikipedia.org/wiki/Localhost"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            127.0.0.1
          </a>{" "}
          (solo esta máquina), pidiendo JSON, no HTML
        </ArticleLi>
        <ArticleLi>
          el SearXNG, como{" "}
          <a
            href="https://en.wikipedia.org/wiki/Metasearch_engine"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            metasearch
          </a>
          , reenvía la misma query a varias engines (Google, Bing, DuckDuckGo y
          otras que habilitaste)
        </ArticleLi>
        <ArticleLi>
          cada engine devuelve hits; el SearXNG junta, quita duplicados y arma
          un JSON único
        </ArticleLi>
        <ArticleLi>
          el MCP entrega ese JSON al modelo como resultado de{" "}
          <ArticleCode>search_web</ArticleCode>
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        En una frase: el MCP no “raspa Google”. El MCP solo habla con el SearXNG
        en tu máquina. Quien habla con internet es el SearXNG.
      </ArticleP>

      <ArticleP>
        Por eso el bloqueo duele menos en el día a día:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          el MCP no depende de un HTML público único para sobrevivir
        </ArticleLi>
        <ArticleLi>
          si un engine aprieta (Google, por ejemplo), otros engines activos
          aún pueden responder
        </ArticleLi>
        <ArticleLi>
          el parser frágil sale del paquete MCP; la agregación queda en SearXNG
        </ArticleLi>
        <ArticleLi>
          la falla se vuelve degradación parcial (“menos fuentes”), no ruleta
          total de la tool
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="note" title="IP y rate-limit: el corte honesto">
        <ArticleP>
          El pedido a los engines sigue saliendo de tu IP (casa, oficina, VPN).
          Un engine específico puede limitar, degradar o pedir CAPTCHA. El
          SearXNG no te vuelve invisible.
        </ArticleP>
        <ArticleP>
          Lo que la stack evita es la falla total típica del scraper: martillar
          un único endpoint HTML público hasta que el anti-abuso cierre la
          puerta. Con varias engines y JSON local estable, la tool del agente
          sigue útil aunque una fuente se ponga mala.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        El diagrama abajo solo contrasta los dos diseños que acabas de leer:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Contraste: scraper MCP con una engine HTML versus SearXNG local con varias engines"
        chart={SCRAPER_VS_SEARXNG_CHART}
      />

      <ArticleP>
        Hay matices importantes. Los engines externos cambian y pueden
        degradarse; eso forma parte del modelo. El formato JSON tiene que estar
        habilitado en <ArticleCode>settings.yml</ArticleCode>, si no la API
        responde 403 y el MCP parece roto. Y “local” sigue dependiendo de
        internet pública para hablar con los engines. Lo que ganas no es offline
        total. Es el servicio de búsqueda corriendo en tu máquina, costo cero de
        API de búsqueda y una capa
        estable entre el agente y la web.
      </ArticleP>

      <ArticleP>
        Si ya acompañaste el problema (scraper frágil vs API paga vs SearXNG
        local), el diagrama abajo solo cierra el razonamiento visualmente. No
        introduce ideas nuevas: organiza lo que acabas de leer.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Comparativo visual: scraper directo, API SaaS y SearXNG local"
        chart={SEARXNG_COMPARE_CHART}
      />

      <ArticleP>
        Repositorio oficial:{" "}
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

      <ArticleH2>4. Cómo encaja el stack</ArticleH2>

      <ArticleP>
        La arquitectura es simple a propósito. Cuatro piezas, cuatro trabajos.
        Cuando algo falla, miras la capa correcta en lugar de “reiniciar todo”.
      </ArticleP>

      <ArticleP>
        El cliente MCP (Cursor, Copilot u otro host) descubre tools y decide
        cuándo llamarlas. El servidor MCP arranca con{" "}
        <ArticleCode>npx</ArticleCode>, habla por{" "}
        <a
          href="https://www.jsonrpc.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          JSON-RPC
        </a>{" "}
        en stdio y traduce el pedido a HTTP local. SearXNG, en loopback, agrega
        engines y devuelve JSON. Los engines externos (Google, Bing,
        DuckDuckGo…) siguen en internet pública. El agente no raspa HTML: el agente usa
        tools.
      </ArticleP>

      <ArticleP>
        Con ese mapa mental, el diagrama abajo queda solo como refuerzo visual
        del flujo de punta a punta.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Arquitectura de extremo a extremo: cliente MCP, SearXNG y engines"
        chart={ARCHITECTURE_CHART}
      />

      <ArticleH3>Cliente MCP / agente</ArticleH3>

      <ArticleP>
        El “cliente MCP” es la app donde hablas con el agente. Puede ser{" "}
        <a
          href="https://cursor.com/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cursor
        </a>
        ,{" "}
        <a
          href="https://docs.github.com/en/copilot"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Copilot
        </a>{" "}
        en{" "}
        <a
          href="https://code.visualstudio.com/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          VS Code
        </a>
        , u otro host que hable el protocolo. “Host” aquí solo significa el
        programa que embebe el modelo y puede llamar tools.
      </ArticleP>

      <ArticleP>
        En MCP, las{" "}
        <a
          href="https://modelcontextprotocol.io/docs/concepts/tools"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          tools
        </a>{" "}
        son acciones que el modelo puede pedir: buscar en la web, leer una URL,
        etc. El cliente descubre qué tools existen, decide cuándo usarlas y
        recibe la respuesta estructurada (el “payload”: el paquete de datos que
        vuelve). Esa respuesta entra en la ventana de contexto del modelo, o
        sea, en el texto que el modelo usa para seguir razonando.
      </ArticleP>

      <ArticleP>
        El punto práctico: el agente no “abre Chrome” por su cuenta. El agente pide una
        tool, el host la ejecuta y el resultado vuelve de forma auditable y
        repetible. Cambiar Cursor por Copilot no cambia la idea; solo cambia
        dónde se guarda la config del servidor MCP.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Roles en MCP: host, cliente y servidor"
        chart={MCP_ROLES_CHART}
      />

      <ArticleH3>Servidor MCP (`@zhafron/mcp-web-search`)</ArticleH3>

      <ArticleP>
        El servidor MCP es un programita aparte que ofrece las tools. En este
        post usamos el paquete{" "}
        <a
          href="https://www.npmjs.com/package/@zhafron/mcp-web-search"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          @zhafron/mcp-web-search
        </a>
        . El paquete corre en{" "}
        <a
          href="https://nodejs.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Node.js
        </a>{" "}
        y arranca con{" "}
        <a
          href="https://docs.npmjs.com/cli/v10/commands/npx"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          npx
        </a>
        : npm descarga/ejecuta el paquete sin que lo instales global a mano.
      </ArticleP>

      <ArticleP>
        El servidor MCP habla con el cliente usando{" "}
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
        (entrada/salida estándar del proceso: el mismo canal de un programa de
        terminal). En la práctica: Cursor/Copilot habla con ese proceso local, y
        el proceso traduce el pedido de tool en una llamada{" "}
        <a
          href="https://developer.mozilla.org/es/docs/Web/HTTP"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          HTTP
        </a>{" "}
        a SearXNG en tu máquina.
      </ArticleP>

      <ArticleP>
        Dos tools importan en el día a día. <ArticleCode>search_web</ArticleCode>{" "}
        devuelve resultados de búsqueda. <ArticleCode>fetch_url</ArticleCode>{" "}
        abre una URL concreta y trae el contenido para leer.{" "}
        <ArticleCode>HTTP_TIMEOUT</ArticleCode> es el tiempo máximo de espera de
        la llamada HTTP: si la agregación tarda demasiado, la tool falla en vez
        de congelar la sesión para siempre.
      </ArticleP>

      <ArticleH3>SearXNG como metasearch local</ArticleH3>

      <ArticleP>
        Aquí SearXNG es el metasearch que hospedas. El SearXNG recibe la query, consulta
        varias engines (Google, Bing, DuckDuckGo y otras que habilites) y
        devuelve un JSON único. “Engine”, en este texto, es solo el buscador
        externo de donde salen los resultados.
      </ArticleP>

      <ArticleP>
        La API escucha en <ArticleCode>127.0.0.1:8099</ArticleCode>.{" "}
        <a
          href="https://en.wikipedia.org/wiki/Localhost"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          127.0.0.1
        </a>{" "}
        (localhost/loopback) significa “esta máquina”, no internet abierta. El
        “bind” en loopback es la decisión de escuchar solo en esa dirección: la
        API no queda expuesta a otros dispositivos en la red. Menos superficie,
        menos dolor de cabeza.
      </ArticleP>

      <ArticleP>
        El contrato mental sigue simple: el cliente habla MCP, el MCP habla
        SearXNG, SearXNG habla con la web. Rompe un eslabón y el síntoma
        cambia. Por eso el troubleshooting es por capa, no “reinicia todo y
        reza”.
      </ArticleP>

      <ArticleH2>5. Qué mejora, qué cuesta y dónde aprieta</ArticleH2>

      <ArticleP>
        La ganancia más obvia es la factura: cero API de búsqueda. Justo detrás
        viene la privacidad, porque términos sensibles no necesitan atravesar un
        SaaS de search. También hay resiliencia práctica: un engine malo no
        tumba el metasearch entero. Y hay control operativo. Puerto, formatos,
        secrets y ciclo de vida del contenedor quedan bajo tu mando.
      </ArticleP>

      <ArticleP>
        El costo existe, claro. Docker en la workstation no es “gratis” en
        atención. La agregación tiene latencia. Los engines cambian HTML y API y
        de vez en cuando se degradan. En ráfagas de búsqueda, CPU y red locales
        lo sienten. Nada de eso inviabiliza el stack, pero ignora esos puntos y
        la operación se vuelve una sorpresa fea.
      </ArticleP>

      <ArticleH3>Benchmarks: qué cambia de verdad la búsqueda</ArticleH3>

      <ArticleP>
        Antes de los números, un corte honesto. MCP + SearXNG local no tiene un
        score propietario en un leaderboard.
      </ArticleP>

      <ArticleP>
        <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> es un benchmark de
        factualidad de OpenAI: un conjunto de preguntas cortas, con una
        respuesta correcta fácil de juzgar. Sirve para medir si el modelo acierta
        hechos o los inventa. Nadie publicó "SearXNG local = X% en{" "}
        <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>".
      </ArticleP>

      <ArticleP>
        Lo que la industria mide es otra cosa: el efecto de{" "}
        <TermLink href={GROUNDING_URL}>grounding</TermLink> con búsqueda web. El
        stack de este post entrega la misma clase de capacidad (el agente busca
        y lee fragmentos reales). El resultado aún depende de la query, de los
        engines y del flujo del agente.
      </ArticleP>

      <ArticleP>
        Grounding, en lenguaje simple, es amarrar la respuesta a evidencia
        externa.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Sin grounding: el modelo completa el texto con lo que suena plausible
        </ArticleLi>
        <ArticleLi>
          Con búsqueda: el modelo puede citar lo que acaba de leer
        </ArticleLi>
        <ArticleLi>
          Lo que sube: factualidad y frescura (información actual)
        </ArticleLi>
        <ArticleLi>
          Lo que no sube solo: "seguir mejor el prompt" ni razonamiento en
          tarea cerrada solo con el código del repo
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        El flujo del agente que hace funcionar el grounding en la práctica:
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

      <ArticleImg
        src="/images/publications/busca-web-local-mcp-searxng/brave-ai-grounding.jpg"
        alt="Diagrama de Brave AI Grounding: respuestas del modelo ancladas en búsqueda web verificable"
        caption={
          <>
            Concepto de grounding con búsqueda web. Fuente: Brave Search, post{" "}
            <TermLink href={GROUNDING_URL}>AI Grounding</TermLink>.
          </>
        }
      />

      <ArticleP>
        Números públicos que importan para esta conversación (muchos usan{" "}
        <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> como regla):
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Sin búsqueda: en el paper de{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>, GPT-4o quedó por
          debajo de ~40% de acierto
        </ArticleLi>
        <ArticleLi>
          Con grounding: Brave reportó F1 de 94,1% en{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> con{" "}
          <TermLink href={GROUNDING_URL}>AI Grounding</TermLink>
        </ArticleLi>
        <ArticleLi>
          En análisis de vendors (
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> y{" "}
          <TermLink href={FRAMES_URL}>FRAMES</TermLink>, benchmark de
          razonamiento multi-hop con varias fuentes): ganancia típica de +25 a
          +40 puntos porcentuales frente al modelo sin grounding
        </ArticleLi>
        <ArticleLi>
          En queries factuales en producción (orden de magnitud citado en esas
          guías): ~15-25% de respuestas malas lo bastante como para importar,
          sin grounding
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Un detalle de lectura: puntos porcentuales no son "% relativa". Pasar de
        40% a 70% es +30 puntos, no "multiplicar por 1,3".
      </ArticleP>

      <ArticleImg
        src="/images/publications/busca-web-local-mcp-searxng/brave-simpleqa-grounding.jpg"
        alt="Gráfico SimpleQA de Brave mostrando alto rendimiento con AI Grounding frente a baselines"
        caption={
          <>
            <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> con grounding:
            referencia visual del salto de factualidad. Fuente: Brave Search.
          </>
        }
      />

      <ArticleTable caption="Resumen de los números (no es score de SearXNG)">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Métrica</ArticleTh>
            <ArticleTh>Sin búsqueda</ArticleTh>
            <ArticleTh>Con grounding</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> (OpenAI / Brave)
            </ArticleTd>
            <ArticleTd>GPT-4o &lt; ~40%</ArticleTd>
            <ArticleTd>
              F1 94,1% (Brave{" "}
              <TermLink href={GROUNDING_URL}>AI Grounding</TermLink>)
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> /{" "}
              <TermLink href={FRAMES_URL}>FRAMES</TermLink> (vendors)
            </ArticleTd>
            <ArticleTd>Baseline sin grounding</ArticleTd>
            <ArticleTd>+25 a +40 puntos porcentuales</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Queries factuales malas (orden de magnitud)</ArticleTd>
            <ArticleTd>~15-25%</ArticleTd>
            <ArticleTd>
              Baja con buena recuperación y uso del contexto
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleCallout variant="note" title="Lo que no estoy prometiendo">
        <ArticleP>
          Esos números miden grounding con búsqueda web en evaluaciones
          públicas. No certifican que tu SearXNG local va a pegar 94% en{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>.
        </ArticleP>
        <ArticleP>
          La ganancia que veo al día a día es otra:
        </ArticleP>
        <ArticleUl>
          <ArticleLi>menos endpoint inventado</ArticleLi>
          <ArticleLi>menos versión vieja de lib</ArticleLi>
          <ArticleLi>
            menos "certeza" sobre un issue que abrió ayer
          </ArticleLi>
        </ArticleUl>
        <ArticleP>
          Es la misma clase de beneficio de los benchmarks, medida en fricción de
          sesión, no en leaderboard.
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

      <ArticleH2>6. Cómo lo armé en la práctica</ArticleH2>

      <ArticleP>
        El montaje cabe en tres fases. El diagrama es el mapa; el resto de esta
        sección es el checklist ejecutable.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Tres fases de montaje: SearXNG en Docker, MCP en el cliente y aceptación rápida"
        chart={SETUP_CHART}
      />

      <ArticleH3>Fase 1: SearXNG en Docker</ArticleH3>

      <ArticleP>
        Creé un directorio local (en mi caso,{" "}
        <ArticleCode>~/searxng</ArticleCode>) y preparé el{" "}
        <ArticleCode>settings.yml</ArticleCode>. El detalle que más gente
        olvida es el formato JSON. Sin el formato JSON, la API responde 403 y el MCP parece
        “roto” sin motivo aparente.
      </ArticleP>

      <ArticleP>
        Genera secrets fuertes con{" "}
        <ArticleCode>openssl rand -hex 32</ArticleCode> y no dejes
        placeholder en el archivo. Un extracto mínimo queda así:
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

      <ArticleP>
        <ArticleCode>DEFAULT_SEARCH_PROVIDER=searxng</ArticleCode> evita caer en
        el scraper default. <ArticleCode>SEARXNG_URL</ArticleCode> apunta a la
        instancia local. <ArticleCode>HTTP_TIMEOUT</ArticleCode> evita una
        muerte temprana cuando la agregación tarda un poco más. Después de
        editar el archivo, recarga el host (Cursor o VS Code/Copilot) y
        confirma que el servidor aparece conectado en la UI de tools.
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

      <ArticleH2>7. Operación del día a día y qué hacer cuando se rompe</ArticleH2>

      <ArticleP>
        El stack se mantiene estable cuando tratas el contenedor y el MCP como
        infraestructura de workstation, no como plugin mágico. ¿Reiniciaste la
        máquina? Sube el compose y valida con curl. ¿Se cayó el contenedor?
        Mira <ArticleCode>docker ps -a</ArticleCode>, lee el log y súbelo de
        nuevo. ¿UI de SearXNG vacía? Abre el puerto local, prueba engines y
        revisa el settings.
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
          Para búsqueda web estable en el agente día a día, la línea que
          sobrevive es MCP listo + SearXNG local (opción B), no scraper directo
          ni MCP custom genérico.
        </ArticleLi>
        <ArticleLi>
          Un scraper MCP público sirve para smoke test. En sesión larga,
          CAPTCHA, rate-limit y HTML inestable se vuelven ruleta.
        </ArticleLi>
        <ArticleLi>
          SearXNG no es scraper MCP: el MCP habla JSON local; el metasearch
          reparte la query. El bloqueo de un engine se vuelve degradación, no
          falla total. El SearXNG no es inmune a rate-limit ni a IP.
        </ArticleLi>
        <ArticleLi>
          MCP custom con SDK solo vale cuando la tool es demasiado específica;
          para búsqueda genérica el ownership se come la ganancia.
        </ArticleLi>
        <ArticleLi>
          En SearXNG: habilita JSON en <ArticleCode>search.formats</ArticleCode>
          , bind en <ArticleCode>127.0.0.1</ArticleCode> y trata engines que
          degradan como operación normal.
        </ArticleLi>
        <ArticleLi>
          Enseña al agente a buscar poco y leer bien en este flujo: search,
          después fetch, después síntesis. No llenar el contexto de ruido.
        </ArticleLi>
        <ArticleLi>
          El grounding con búsqueda sube factualidad y frescura. No “mejora el
          prompt” en una tarea que el workspace ya resuelve.
        </ArticleLi>
        <ArticleLi>
          Local ≠ offline: controlas el servicio de búsqueda en tu máquina;
          internet pública sigue
          alimentando los engines.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusión</ArticleH3>

      <ArticleP>
        No elegí construir más software. Elegí la menor arquitectura que aguanta
        uso real. MCP listo + SearXNG local entrega costo cero de API,
        privacidad con el servicio en tu máquina y mejor estabilidad que un
        scraper frágil, con un
        overhead operativo aceptable para quien ya vive en Docker día a día. En
        el eje de calidad, la ganancia que importa es la misma de la literatura
        de grounding: factualidad y frescura cuando la verdad está en la web, no
        un “prompt mágicamente más preciso”.
      </ArticleP>

      <ArticleP>
        Si el objetivo es un agente con búsqueda confiable de lunes a viernes,
        la opción B no es un atajo. Es la línea que dejaría corriendo en mi
        máquina y recomendaría a alguien del equipo sin ninguna vergüenza.
      </ArticleP>
    </>
  );
}
