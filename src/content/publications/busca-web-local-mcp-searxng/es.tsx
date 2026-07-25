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
  PainPaid --> Gap["Falta borde local estable"]
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

export function BuscaWebLocalMcpSearxngContentEs() {
  return (
    <>
      <ArticleH2>1. El problema que apareció en la práctica</ArticleH2>

      <ArticleP>
        Este post cuenta cómo armé búsqueda web estable para el agente de IA en
        mi máquina, sin API de search de pago y sin scraper frágil. El stack es{" "}
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
        repositorio ni en la memoria de entrenamiento del modelo: documentación
        que cambió ayer, changelog de SDK, issue abierto de madrugada, endpoint
        que la API deprecó. Sin acceso confiable a la web, adivina la versión
        equivocada, inventa un detalle o se queda pidiendo confirmación. La
        sesión se traba.
      </ArticleP>

      <ArticleP>
        El flujo que quiero es directo: buscar → leer un buen tramo → aplicar en
        el código → validar. Cuando la búsqueda falla a mitad de camino, el
        resto se viene abajo. Reintenta, alucina o te interrumpe. En sesiones
        largas eso se vuelve fricción real: contexto perdido y tiempo que no
        vuelve. Comparé tres caminos (API de pago, scraper MCP, metasearch
        local) y me quedé con el tercero. A continuación: qué duele en las APIs
        comerciales, por qué un scraper “gratis” engaña en el smoke test, y qué
        significa “local” en este texto.
      </ArticleP>

      <ArticleH3>Dónde empiezan a doler las APIs de búsqueda de pago</ArticleH3>

      <ArticleP>
        Las APIs comerciales funcionan bien cuando el volumen es bajo y la
        previsibilidad importa más que la factura. El desarrollo con agente no
        son “dos queries al día”. Es exploración. Abres varios frentes,
        comparas docs, cazas issues y retrocedes cuando la hipótesis no se
        sostiene.
      </ArticleP>

      <ArticleP>
        A ese ritmo, el precio sube rápido, la cuota aprieta y el{" "}
        <a
          href="https://en.wikipedia.org/wiki/Rate_limiting"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          rate-limit
        </a>{" "}
        aparece justo cuando quieres velocidad. También está la privacidad:
        términos de búsqueda con nombres de cliente, stack interna o
        incidentes salen de tu máquina hacia un{" "}
        <a
          href="https://en.wikipedia.org/wiki/Software_as_a_service"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SaaS
        </a>{" "}
        de terceros. Y si el proveedor cambia precio, política o disponibilidad,
        tu flujo local se rompe junto.
      </ArticleP>

      <ArticleH3>Scrapers “gratis” y la falsa sensación de victoria</ArticleH3>

      <ArticleP>
        Otro camino común es tomar un{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>{" "}
        listo que raspa un motor público directo (DuckDuckGo y compañía). En la
        práctica el agente llama una tool de búsqueda, el servidor MCP baja la
        página (o un endpoint semi-público) por HTTP, intenta parsear HTML y
        devuelve links y snippets. En un smoke test parece magia: cero cuenta,
        cero Docker, respuesta al momento.
      </ArticleP>

      <ArticleP>
        En uso continuo, la historia cambia. El IP se bloquea, aparece{" "}
        <a
          href="https://es.wikipedia.org/wiki/CAPTCHA"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          CAPTCHA
        </a>
        , el layout de la página cambia y el parser se rompe, la latencia se
        vuelve ruleta. La tasa de falla sube exactamente en el patrón de un
        agente autónomo: muchas consultas en ráfaga, durante horas. Es el mismo
        mecanismo de la opción A en la sección siguiente; aquí solo registro el
        síntoma que me empujó a comparar alternativas de verdad.
      </ArticleP>

      <ArticleP>
        El diagrama abajo resume el callejón: la web es necesaria, pero los dos
        atajos obvios duelen. La salida que busqué después es estabilizar el
        borde local.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Problema: API de pago y scraper MCP empujan a la falta de borde local estable"
        chart={PROBLEM_CHART}
      />

      <ArticleCallout variant="note" title="Qué llamo “local” aquí">
        <ArticleP>
          Local no significa offline. Significa control en el borde. Quitas el
          intermediario SaaS de búsqueda y hospedas la orquestación (
          <a
            href="https://docs.searxng.org/"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            SearXNG
          </a>{" "}
          + MCP) en tu máquina. Internet sigue existiendo, los engines externos
          siguen siendo consultados, pero la capa que el agente ve queda bajo tu
          dominio: puerto, secret, ciclo de vida y superficie de exposición.
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
        / Node) y apuntas el cliente del agente hacia él. No levantas Docker, no
        configuras metasearch, no escribes servidor. En pocos minutos el agente
        gana una tool del tipo <ArticleCode>search_web</ArticleCode>: pide una
        query, el servidor MCP hace la búsqueda y devuelve títulos, links y
        snippets para que el modelo los use en el siguiente paso.
      </ArticleP>

      <ArticleP>
        El detalle que importa es <em>cómo</em> ese paquete busca. En general
        actúa como scraper: abre (por HTTP) la página o endpoint “público” de
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
        deja de “raspar la web solo”. Se vuelve cliente HTTP de un servicio que{" "}
        <em>tú</em> hospedas: el{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>
        . En la práctica: el agente llama la tool → el servidor MCP arma un
        GET/POST a <ArticleCode>http://127.0.0.1:…/search?format=json</ArticleCode>{" "}
        → SearXNG reparte la consulta por varias engines → agrega, deduplica y
        devuelve JSON unificado → el MCP entrega eso de vuelta al modelo. El
        agente nunca “abre Chrome”; solo consume el resultado de la tool.
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
        : en lugar de ser otro Google, orquesta buscadores y fuentes (Google,
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
        protocolo), costo cero de API de search, mejor privacidad en el borde y
        control de puerto, secret y ciclo de vida.
      </ArticleP>

      <ArticleP>
        El precio es operativo, no de factura SaaS: mantener el contenedor al
        aire, habilitar el formato JSON, aceptar que engines externas aún pueden
        degradarse. Aun así, un engine malo rara vez tumba el metasearch entero.
        Para uso diario de agente, esa fue la línea que sobrevivió.
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
            <ArticleTd>Alta en el borde</ArticleTd>
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
          Me quedé con la B. Resuelve estabilidad y privacidad sin transformar
          la solución en un producto interno eterno de mantenimiento. Es la
          menor arquitectura que sobrevive a una semana de uso real, no solo a
          un demo de viernes.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. Qué es SearXNG (y por qué entra en juego)</ArticleH2>

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
        Buscas una vez; por debajo reparte la consulta y junta la respuesta.
      </ArticleP>

      <ArticleP>
        El proyecto nació con foco en privacidad: la instancia no necesita
        rastrear ni perfilar al usuario como lo hace un buscador comercial por
        defecto. En uso local eso queda aún más claro. La orquestación vive en
        tu máquina, el historial sensible no tiene que atravesar un SaaS de
        search, y tú decides qué queda expuesto.
      </ArticleP>

      <ArticleP>
        Elegí SearXNG por tres motivos prácticos. Primero, ya resuelve
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

      <ArticleP>
        Hay matices importantes. Los engines externos cambian y pueden
        degradarse; eso forma parte del modelo. El formato JSON tiene que estar
        habilitado en <ArticleCode>settings.yml</ArticleCode>, si no la API
        responde 403 y el MCP parece roto. Y “local” sigue dependiendo de
        internet pública para hablar con los engines. Lo que ganas no es offline
        total. Es control del borde, costo cero de API de búsqueda y una capa
        estable entre el agente y la web.
      </ArticleP>

      <ArticleP>
        Si ya acompañaste el problema (scraper frágil vs API paga vs borde
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
        DuckDuckGo…) siguen en internet pública. El agente no raspa HTML: usa
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
        sea, en el texto que usa para seguir razonando.
      </ArticleP>

      <ArticleP>
        El punto práctico: el agente no “abre Chrome” por su cuenta. Pide una
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
        . Corre en{" "}
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
        Habla con el cliente usando{" "}
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
        Aquí SearXNG es el metasearch que hospedas. Recibe la query, consulta
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
        score propietario en un leaderboard. Lo que la industria mide es el
        efecto de{" "}
        <a
          href="https://brave.com/blog/ai-grounding/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          grounding
        </a>{" "}
        con búsqueda web: la respuesta deja de depender solo de la memoria de
        entrenamiento y pasa a apoyarse en fragmentos recuperados en el momento.
        El stack de este post entrega esa misma clase de capacidad. El score
        final aún depende de la calidad de la query, de los engines activos y de
        que el agente haga search → fetch → síntesis, en lugar de llenar el
        contexto de basura.
      </ArticleP>

      <ArticleImg
        src="/images/publications/busca-web-local-mcp-searxng/brave-ai-grounding.jpg"
        alt="Diagrama de Brave AI Grounding: respuestas del modelo ancladas en búsqueda web verificable"
        caption="Concepto de grounding con búsqueda web. Fuente: Brave Search, post AI Grounding."
      />

      <ArticleP>
        Grounding, en lenguaje simple, es amarrar la respuesta a evidencia
        externa. Sin eso, el modelo completa el texto con lo que suena
        plausible. Con búsqueda, puede citar lo que acaba de leer. Eso sube
        factualidad y frescura. No sube mágicamente “seguir mejor el prompt”,
        ni el razonamiento abstracto en una tarea cerrada. Si la pregunta es
        solo sobre el código que ya está en el workspace, la ganancia suele ser
        baja.
      </ArticleP>

      <ArticleP>
        El{" "}
        <a
          href="https://openai.com/index/introducing-simpleqa/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          SimpleQA
        </a>{" "}
        de OpenAI es un benchmark de factualidad en preguntas cortas, con
        respuesta única y fácil de juzgar. En el paper original, los modelos
        frontier sin búsqueda externa aún fallaban mucho: GPT-4o quedó por
        debajo de ~40% de acierto. Cuando el mismo tipo de pregunta gana
        grounding con búsqueda, los números saltan. Brave reportó un F1 de
        94,1% en SimpleQA con su servicio de{" "}
        <a
          href="https://brave.com/blog/ai-grounding/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          AI Grounding
        </a>
        . Guías de vendors que agregan SimpleQA y{" "}
        <a
          href="https://parallel.ai/articles/how-to-reduce-llm-hallucinations-by-connecting-your-app-to-real-time-web-search"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          FRAMES
        </a>{" "}
        (razonamiento multi-hop con varias fuentes) hablan de ganancias típicas
        de 25 a 40 puntos porcentuales frente al baseline sin grounding. Puntos
        porcentuales no son “% de mejora relativa”: pasar de 40% a 70% es +30
        puntos, no “+30% en el sentido de multiplicar por 1,3”.
      </ArticleP>

      <ArticleImg
        src="/images/publications/busca-web-local-mcp-searxng/brave-simpleqa-grounding.jpg"
        alt="Gráfico SimpleQA de Brave mostrando alto rendimiento con AI Grounding frente a baselines"
        caption="SimpleQA con grounding: referencia visual del salto de factualidad. Fuente: Brave Search."
      />

      <ArticleTable caption="Orden de magnitud en benchmarks públicos (no es score de SearXNG)">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Escenario</ArticleTh>
            <ArticleTh>Sin búsqueda / solo modelo</ArticleTh>
            <ArticleTh>Con grounding web</ArticleTh>
            <ArticleTh>Lectura útil</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>SimpleQA (hechos cortos)</ArticleTd>
            <ArticleTd>GPT-4o &lt; ~40% en el paper de OpenAI</ArticleTd>
            <ArticleTd>Brave: F1 94,1% con AI Grounding</ArticleTd>
            <ArticleTd>
              La búsqueda cambia el juego cuando la verdad está en la web, no
              en el entrenamiento
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>SimpleQA / FRAMES (agregado de vendors)</ArticleTd>
            <ArticleTd>Baseline sin grounding</ArticleTd>
            <ArticleTd>+25 a +40 puntos porcentuales</ArticleTd>
            <ArticleTd>
              Rango citado en análisis de grounding con búsqueda en tiempo real
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Queries factuales en producción (orden de magnitud)</ArticleTd>
            <ArticleTd>~15-25% de respuestas malas lo bastante como para importar</ArticleTd>
            <ArticleTd>
              Baja cuando la recuperación es buena y el modelo usa el contexto
            </ArticleTd>
            <ArticleTd>
              No es “prompt más preciso”; es factualidad y frescura
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleCallout variant="note" title="Lo que no estoy prometiendo">
        <ArticleP>
          Esos números miden grounding con búsqueda web en setups de evaluación.
          No son un certificado de que tu SearXNG local va a pegar 94% en
          SimpleQA. El metasearch local hereda la calidad de los engines,
          bloqueos y ruido. La ganancia práctica que veo al día a día es otra:
          menos endpoint inventado, menos versión vieja de lib, menos “certeza”
          sobre un issue que abrió ayer. Es la misma clase de beneficio de los
          benchmarks, medida en fricción de sesión, no en leaderboard.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>Para quién es útil (y para quién no)</ArticleH3>

      <ArticleP>
        El stack vale la pena cuando el agente necesita mundo externo
        actualizado. Docs que cambiaron esta semana, changelog de SDK, issue
        abierto ayer, CVE reciente, comparación de APIs. Ahí la memoria de
        entrenamiento es exactamente el lugar equivocado para apostar. Quien
        vive en sesiones largas de agente, quien quiere citar fuente y quien no
        quiere pagar por query de search SaaS está en el público objetivo.
      </ArticleP>

      <ArticleP>
        El retorno es débil cuando la tarea ya está resuelta por el workspace:
        refactorizar un módulo, seguir un patrón del repo, escribir un test
        sobre el código abierto. La búsqueda web ahí se vuelve ruido y loop.
        Tampoco “mejora la precisión del prompt” en el sentido de instrucción:
        un prompt malo sigue malo. Lo que mejora es la base factual sobre la
        que el modelo responde, cuando la verdad está fuera del contexto local.
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
              query en el borde
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
        olvida es el formato JSON. Sin él, la API responde 403 y el MCP parece
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
        Algunas prácticas que pagan el almuerzo: mantener SearXNG en 127.0.0.1,
        generar secrets de verdad con openssl, enseñar al agente a buscar poco
        y leer bien (search → fetch → síntesis) y tratar la degradación de
        engine como operación normal. Los engines cambian. Eso no es incidente
        raro. Es el juego.
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
          MCP custom con SDK solo vale cuando la tool es demasiado específica;
          para búsqueda genérica el ownership se come la ganancia.
        </ArticleLi>
        <ArticleLi>
          En SearXNG: habilita JSON en <ArticleCode>search.formats</ArticleCode>
          , bind en <ArticleCode>127.0.0.1</ArticleCode> y trata engines que
          degradan como operación normal.
        </ArticleLi>
        <ArticleLi>
          Enseña al agente a buscar poco y leer bien: search → fetch → síntesis,
          no llenar el contexto de ruido.
        </ArticleLi>
        <ArticleLi>
          El grounding con búsqueda sube factualidad y frescura. No “mejora el
          prompt” en una tarea que el workspace ya resuelve.
        </ArticleLi>
        <ArticleLi>
          Local ≠ offline: controlas el borde; internet pública sigue
          alimentando los engines.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusión</ArticleH3>

      <ArticleP>
        No elegí construir más software. Elegí la menor arquitectura que aguanta
        uso real. MCP listo + SearXNG local entrega costo cero de API,
        privacidad en el borde y mejor estabilidad que un scraper frágil, con un
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
