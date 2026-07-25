import {
  ArticleCallout,
  ArticleCode,
  ArticleH2,
  ArticleH3,
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
} from "@/components/article";

const ARCHITECTURE_CHART = `flowchart LR
  Cursor[Cursor / Agente IA]
  MCP[MCP Server<br/>mcp-web-search]
  SearX[SearXNG<br/>127.0.0.1:8099]
  Engines[Engines<br/>Google Bing DDG]

  Cursor -->|JSON-RPC stdio| MCP
  MCP -->|HTTP JSON local| SearX
  SearX -->|consultas agregadas| Engines
  Engines -->|resultados| SearX
  SearX -->|JSON limpio| MCP
  MCP -->|tools search_web fetch_url| Cursor`;

const DECISION_CHART = `flowchart TD
  Need[Necesito busqueda web en el agente]
  A[Opcion A: MCP scraper listo]
  B[Opcion B: MCP + SearXNG local]
  C[Opcion C: MCP custom desde cero]
  Prod[Uso diario en sesiones largas]

  Need --> A
  Need --> B
  Need --> C
  A -->|bloqueos y rate-limit| Prod
  C -->|alto costo de mantenimiento| Prod
  B -->|costo cero + control en el borde| Prod`;

export function BuscaWebLocalMcpSearxngContentEs() {
  return (
    <>
      <ArticleH2>1. El problema que apareció en la práctica</ArticleH2>

      <ArticleP>
        Si usas un agente de IA de verdad en el día a día, la búsqueda web deja
        de ser un “extra simpático” y se vuelve parte del flujo. La
        documentación cambia de un día para otro, las APIs se rompen sin aviso y
        ese bug molesto solo aparece en un issue abierto ayer. Cuando el modelo
        queda atrapado en el conocimiento de entrenamiento y en lo que ya está
        en el repositorio, la sesión empieza a girar en vacío.
      </ArticleP>

      <ArticleP>
        Lo sentí con fuerza en sesiones largas de Cursor. El agente necesita
        buscar, leer un buen tramo, aplicar y validar. Cuando la búsqueda falla,
        reintenta, inventa o simplemente te interrumpe. El costo ya no es solo
        dinero. Es fricción, contexto perdido y tiempo que no recuperas.
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
        A ese ritmo, el precio sube rápido, la cuota aprieta y el rate-limit
        aparece justo cuando quieres velocidad. También está la privacidad:
        términos de búsqueda con nombres de cliente, stack interna o
        incidentes salen de tu máquina hacia un SaaS de terceros. Y si el
        proveedor cambia precio, política o disponibilidad, tu flujo local se
        rompe junto.
      </ArticleP>

      <ArticleH3>Scrapers “gratis” y la falsa sensación de victoria</ArticleH3>

      <ArticleP>
        La otra tentación obvia es tomar un MCP listo que raspa un motor
        público directo (DuckDuckGo y compañía). En un smoke test parece magia.
        En uso continuo, la historia cambia. El IP se bloquea, aparece CAPTCHA,
        la latencia se vuelve ruleta y la tasa de falla sube exactamente en el
        patrón de un agente autónomo: muchas consultas en ráfaga, durante horas.
      </ArticleP>

      <ArticleCallout variant="note" title="Qué llamo “local” aquí">
        <ArticleP>
          Local no significa offline. Significa control en el borde. Quitas el
          intermediario SaaS de búsqueda y hospedas la orquestación (SearXNG +
          MCP) en tu máquina. Internet sigue existiendo, los engines externos
          siguen siendo consultados, pero la capa que el agente ve queda bajo tu
          dominio: puerto, secret, ciclo de vida y superficie de exposición.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Si quieres la base oficial del protocolo y del metasearch:{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className="font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Model Context Protocol
        </a>{" "}
        y la{" "}
        <a
          href="https://docs.searxng.org/"
          className="font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
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
        rutas aparecieron de forma natural.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Flujo de decisión entre opciones A, B y C"
        chart={DECISION_CHART}
      />

      <ArticleH3>Opción A: MCP listo con scraper público directo</ArticleH3>

      <ArticleP>
        Setup casi cero, cero infra local, resultado inmediato. Genial para
        validar la idea en quince minutos. Muy malo como base continua. Anti-bot,
        CAPTCHA y rate-limit convierten la herramienta en ruleta, y las
        sesiones largas sufren primero. Lo usé como experimento rápido y lo
        descarté como línea principal.
      </ArticleP>

      <ArticleH3>Opción B: MCP listo + SearXNG local en Docker</ArticleH3>

      <ArticleP>
        Aquí el MCP deja de “raspar la web solo”. Habla con un metasearch que
        tú hospedas. SearXNG agrega engines, limpia buena parte del ruido y
        devuelve JSON en el loopback de la máquina. Ganas pragmatismo, costo
        cero de API, mejor privacidad y control operativo, sin reinventar el
        protocolo MCP desde cero.
      </ArticleP>

      <ArticleH3>Opción C: MCP custom con el SDK</ArticleH3>

      <ArticleP>
        Construir un servidor MCP en TypeScript con{" "}
        <ArticleCode>@modelcontextprotocol/sdk</ArticleCode> es totalmente
        viable. El problema no es capacidad técnica. Es valor. Para el objetivo
        “búsqueda web estable en el agente”, te quedas dueño de timeout,
        parsing, fallback, bug y changelog. Mucho esfuerzo para poco
        diferenciador de negocio. Lo descarté por ROI, no por miedo a código.
      </ArticleP>

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
        SearXNG es un metasearch engine open source y autoalojable. No es “otro
        Google”. Agrega resultados de varios servicios y bases (Google, Bing,
        DuckDuckGo y decenas de otros, según la config) y devuelve una vista
        unificada. Buscas una vez; por debajo reparte la consulta y junta la
        respuesta.
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
        volverse un scraper frágil de HTML. Segundo, la API JSON es lo bastante
        directa para que un agente la consuma sin trucos. Tercero, la comunidad
        mantiene una imagen Docker y documentación lo suficientemente sólidas
        para levantarlo en minutos y operarlo día a día sin convertir esto en
        un side project eterno.
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
        Repositorio oficial:{" "}
        <a
          href="https://github.com/searxng/searxng"
          className="font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/searxng/searxng
        </a>
        . Docs:{" "}
        <a
          href="https://docs.searxng.org/"
          className="font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          docs.searxng.org
        </a>
        .
      </ArticleP>

      <ArticleH2>4. Cómo encaja el stack</ArticleH2>

      <ArticleP>
        La arquitectura es simple a propósito. Cada pieza tiene un trabajo
        claro, y eso ayuda a la hora de depurar: cuando algo falla, sabes en qué
        capa mirar primero.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Arquitectura de extremo a extremo: Cursor, MCP, SearXNG y engines"
        chart={ARCHITECTURE_CHART}
      />

      <ArticleH3>Cursor / agente</ArticleH3>

      <ArticleP>
        Cursor es el cliente MCP. Descubre las tools, decide cuándo llamarlas y
        mete el payload estructurado en la ventana de contexto del modelo. El
        agente no “abre Chrome”. Usa tools. Eso deja la búsqueda auditable,
        repetible y enchufable en otros clientes MCP más adelante.
      </ArticleP>

      <ArticleH3>Servidor MCP (`@zhafron/mcp-web-search`)</ArticleH3>

      <ArticleP>
        Un proceso Node arranca vía <ArticleCode>npx</ArticleCode> y habla con
        Cursor por JSON-RPC en <ArticleCode>stdio</ArticleCode>. Su trabajo es
        traducir un pedido de tool a HTTP local, aplicar timeout (
        <ArticleCode>HTTP_TIMEOUT</ArticleCode>) y devolver un resultado
        estructurado. También expone <ArticleCode>fetch_url</ArticleCode>, que
        es el paso siguiente natural: encontrar la buena fuente y leer el
        contenido de verdad, sin tragar la página entera a ciegas.
      </ArticleP>

      <ArticleH3>SearXNG como metasearch local</ArticleH3>

      <ArticleP>
        En el stack, SearXNG es la pieza que agrega engines y sirve JSON en{" "}
        <ArticleCode>127.0.0.1:8099</ArticleCode>. El bind en loopback es
        deliberado: la API queda accesible solo en la máquina local. Menos
        superficie expuesta, menos dolor de cabeza. En la punta final siguen
        Google, Bing, DuckDuckGo y lo que habilites. SearXNG orquesta. Tú
        controlas el borde.
      </ArticleP>

      <ArticleP>
        El contrato mental es simple: Cursor habla MCP, MCP habla SearXNG,
        SearXNG habla con la web. Rompe un eslabón y el síntoma cambia. Por eso
        el troubleshooting tiene que ser por capa, no “reinicia todo y reza”.
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
          className="font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          documentación Docker de SearXNG
        </a>
        .
      </ArticleP>

      <ArticleH3>Fase 2: MCP en Cursor</ArticleH3>

      <ArticleP>
        Configura el MCP global en <ArticleCode>~/.cursor/mcp.json</ArticleCode>{" "}
        o por proyecto en <ArticleCode>.cursor/mcp.json</ArticleCode>. El bloque
        de abajo fuerza el proveedor local y apunta al contenedor.
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
        <ArticleCode>DEFAULT_SEARCH_PROVIDER=searxng</ArticleCode> evita caer en
        el scraper default. <ArticleCode>SEARXNG_URL</ArticleCode> apunta a la
        instancia local. <ArticleCode>HTTP_TIMEOUT</ArticleCode> evita una
        muerte temprana cuando la agregación tarda un poco más. Después de
        editar el archivo, reinicia Cursor y confirma que el servidor aparece
        conectado en la UI de tools.
      </ArticleP>

      <ArticleH3>Fase 3: Aceptación rápida</ArticleH3>

      <ArticleOl>
        <ArticleLi>Reiniciar Cursor después de guardar mcp.json.</ArticleLi>
        <ArticleLi>Confirmar el servidor MCP conectado en settings.</ArticleLi>
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
            <ArticleTd>MCP no sube en Cursor</ArticleTd>
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

      <ArticleH3>Conclusión</ArticleH3>

      <ArticleP>
        No elegí construir más software. Elegí la menor arquitectura que aguanta
        uso real. MCP listo + SearXNG local entrega costo cero de API,
        privacidad en el borde y mejor estabilidad que un scraper frágil, con un
        overhead operativo aceptable para quien ya vive en Docker día a día.
      </ArticleP>

      <ArticleP>
        Si el objetivo es un agente con búsqueda confiable de lunes a viernes,
        la opción B no es un atajo. Es la línea que dejaría corriendo en mi
        máquina y recomendaría a alguien del equipo sin ninguna vergüenza.
      </ArticleP>
    </>
  );
}
