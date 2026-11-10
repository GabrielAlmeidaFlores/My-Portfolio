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
  ArticleUl,
} from "@/components/article";
import type { ReactNode } from "react";

const PIPELINE_CHART = `flowchart LR
  Code@{ shape: card, label: "Código y manifests" } --> Local["Extracción local con tree-sitter"]
  Docs@{ shape: doc, label: "Docs, PDFs y multimedia" } --> Semantic["Extracción semántica"]
  Local --> Merge["Resolución y merge"]
  Semantic --> Merge
  Merge --> Communities["Detección de comunidades"]
  Communities --> Graph[("graph.json")]
  Graph --> Queries["query, path y explain"]`;

const DECISION_CHART = `flowchart TB
  Start(["¿La pregunta cruza varios archivos?"]) -->|"Sí"| Size{"¿Repo grande o poco conocido?"}
  Size -->|"Si"| Use(["Graphify"])
  Size -->|"No"| Grep["grep y lectura dirigida"]
  Start -->|"No"| Grep`;

const linkClass =
  "font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300";

const GRAPHIFY_URL = "https://graphify.com/";
const GRAPHIFY_WHAT_URL = "https://graphify.com/what-is-graphify";
const DOCS_URL = "https://docs.graphify.com/";
const INSTALL_URL = "https://docs.graphify.com/installation";
const QUICKSTART_URL = "https://docs.graphify.com/open-source/quickstart";
const QUERYING_URL = "https://docs.graphify.com/guides/querying";
const ARCHITECTURE_URL = "https://docs.graphify.com/concepts/architecture";
const GITHUB_URL = "https://github.com/Graphify-Labs/graphify";
const PYPI_URL = "https://pypi.org/project/graphifyy/";
const BENCHMARKS_URL =
  "https://github.com/Graphify-Labs/graphify/blob/v8/BENCHMARKS.md";
const CLOUD_URL = "https://app.graphify.com/";
const MCP_URL = "https://modelcontextprotocol.io/";
const TREE_SITTER_URL = "https://tree-sitter.github.io/tree-sitter/";
const AST_URL = "https://en.wikipedia.org/wiki/Abstract_syntax_tree";
const KNOWLEDGE_GRAPH_URL = "https://en.wikipedia.org/wiki/Knowledge_graph";
const LEIDEN_URL = "https://en.wikipedia.org/wiki/Leiden_algorithm";
const LOUVAIN_URL = "https://en.wikipedia.org/wiki/Louvain_method";
const VECTOR_DB_URL = "https://en.wikipedia.org/wiki/Vector_database";
const EMBEDDING_URL = "https://en.wikipedia.org/wiki/Word_embedding";
const LLM_URL = "https://en.wikipedia.org/wiki/Large_language_model";
const GREP_URL = "https://en.wikipedia.org/wiki/Grep";
const UV_URL = "https://docs.astral.sh/uv/";
const PIPX_URL = "https://pipx.pypa.io/stable/";
const PYTHON_URL = "https://www.python.org/";
const INCREMENTAL_URL =
  "https://docs.graphify.com/open-source/features/incremental-updates";
const PROVENANCE_URL = "https://docs.graphify.com/concepts/provenance";
const ALWAYS_ON_URL =
  "https://docs.graphify.com/cookbooks/make-agents-use-the-graph";
const LOCOMO_URL = "https://github.com/snap-research/locomo";
const LONGMEMEVAL_URL = "https://github.com/xiaowu0162/LongMemEval";
const BM25_URL = "https://en.wikipedia.org/wiki/Okapi_BM25";
const RAG_URL = "https://en.wikipedia.org/wiki/Retrieval-augmented_generation";
const MEM0_URL = "https://github.com/mem0ai/mem0";
const SUPERMEMORY_URL = "https://supermemory.ai/";
const ERPNEXT_URL = "https://github.com/frappe/erpnext";
const GIT_HOOKS_URL =
  "https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks";

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

export function GraphifyMapaCodebaseContentEs() {
  return (
    <>
      <ArticleH2>1. El problema: grep no entiende estructura</ArticleH2>

      <ArticleP>
        Un agente de IA abre el repositorio, lee veinte archivos, responde una
        pregunta y termina la sesión. En la conversación siguiente, el mismo
        agente empieza desde cero. El contexto del codebase no quedó en ningún
        lugar.
      </ArticleP>

      <ArticleP>
        <TermLink href={GREP_URL}>grep</TermLink> ayuda a encontrar texto, pero
        no entiende relaciones. Una pregunta como “¿cómo llega el login a la
        base?” exige seguir imports, llamadas, interfaces y configuración. Cada
        archivo encontrado arrastra otro, y el agente gasta contexto leyendo
        fragmentos que no responden a la pregunta.
      </ArticleP>

      <ArticleP>
        <TermLink href={GRAPHIFY_WHAT_URL}>Graphify</TermLink> propone otro
        enfoque: transformar el repositorio en un grafo de conocimiento
        persistente. En vez de releer archivos en cada sesión, el agente
        consulta nodos y aristas que representan funciones, clases, archivos,
        conceptos de documentación y las relaciones entre ellos.
      </ArticleP>

      <ArticleP>
        Este post cubre qué es Graphify, cómo instalar y ejecutar, cómo
        consultar el grafo, cuándo ayuda de verdad, qué muestran los benchmarks
        del proyecto y qué límites aparecen en el uso real. Las fuentes
        oficiales quedan al final.
      </ArticleP>

      <ArticleCallout variant="note" title="Lo que este post no promete">
        <ArticleP>
          Graphify no reemplaza compilador, pruebas, revisión de código ni la
          lectura del archivo final. Entrega un mapa con evidencias. La decisión
          sigue siendo de quien lee el mapa. El propio proyecto avisa que el
          dispatch dinámico, el código generado y los escaneos desactualizados
          dejan huecos.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>2. Conceptos que aparecen en el post</ArticleH2>

      <ArticleP>
        Antes de los comandos, conviene fijar el vocabulario. Cada término de
        abajo aparece en los ejemplos y en las decisiones:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>Codebase:</strong> conjunto de archivos, configuración y
          documentación de un proyecto. Ejemplo: el repositorio completo del
          servicio, no solo la carpeta <ArticleCode>src</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <strong>Grafo:</strong> estructura de nodos conectados por aristas.
          Ejemplo: la función <ArticleCode>login</ArticleCode> es un nodo, y su
          llamada a <ArticleCode>UserRepository</ArticleCode> es una arista.
        </ArticleLi>
        <ArticleLi>
          <strong>Nodo:</strong> una entidad del mapa, como función, clase,
          archivo, tabla, documento o concepto. Ejemplo:{" "}
          <ArticleCode>AuthService</ArticleCode> y{" "}
          <ArticleCode>DatabasePool</ArticleCode> son nodos.
        </ArticleLi>
        <ArticleLi>
          <strong>Arista:</strong> la relación entre dos nodos. Ejemplo:{" "}
          <ArticleCode>AuthService</ArticleCode> usa{" "}
          <ArticleCode>DatabasePool</ArticleCode>, así que existe una arista
          “uses” entre ambos.
        </ArticleLi>
        <ArticleLi>
          <strong>AST:</strong> representación estructurada del código generada
          por un parser. Ejemplo: el parser ve una declaración de función, sus
          parámetros y su cuerpo, en vez de ver solo texto.
        </ArticleLi>
        <ArticleLi>
          <strong>Tree-sitter:</strong> biblioteca de parsing incremental usada
          para generar la AST de varios lenguajes. Ejemplo: Graphify usa
          tree-sitter para leer código local sin llamar a un modelo.
        </ArticleLi>
        <ArticleLi>
          <strong>EXTRACTED e INFERRED:</strong> etiquetas de confianza de las
          aristas. <ArticleCode>EXTRACTED</ArticleCode> vino directo de la
          sintaxis; <ArticleCode>INFERRED</ArticleCode> fue resuelto por
          inferencia y merece revisión.
        </ArticleLi>
        <ArticleLi>
          <strong>Comunidad:</strong> grupo de nodos densamente conectados, que
          suele representar un subsistema. Ejemplo: autenticación, cobro y
          notificación pueden formar comunidades separadas.
        </ArticleLi>
        <ArticleLi>
          <strong>Leiden y Louvain:</strong> algoritmos de detección de
          comunidades en grafos. Graphify intenta Leiden y usa Louvain como
          fallback cuando el extra no está instalado.
        </ArticleLi>
        <ArticleLi>
          <strong>MCP:</strong> protocolo que expone herramientas y contexto a
          agentes de IA. Ejemplo: un servidor MCP de Graphify permite que el
          agente consulte el grafo mediante tool calls.
        </ArticleLi>
        <ArticleLi>
          <strong>Skill:</strong> instrucción empaquetada para un agente, como
          el comando <ArticleCode>/graphify</ArticleCode> dentro del asistente.
        </ArticleLi>
        <ArticleLi>
          <strong>Vector store:</strong> base especializada en embeddings.
          Graphify se posiciona como grafo, no como{" "}
          <TermLink href={VECTOR_DB_URL}>vector store</TermLink>. La consulta
          navega por nodos y aristas, no por una lista de chunks.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={EMBEDDING_URL}>Embedding</TermLink>:</strong>{" "}
          representación numérica de un texto que permite comparar significado.
          Ejemplo: “login” y “autenticación” quedan cerca en el espacio
          vectorial.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={LLM_URL}>LLM</TermLink>:</strong> modelo de
          lenguaje grande, como GPT, Claude o Gemini, usado para generar texto y
          evaluar respuestas. Ejemplo: el modelo del asistente que resume el
          informe del grafo.
        </ArticleLi>
        <ArticleLi>
          <strong>Token:</strong> unidad de texto que el modelo procesa. El
          presupuesto de contexto se cuenta en tokens. Ejemplo: una respuesta de
          1.500 tokens ocupa más ventana que una de 300.
        </ArticleLi>
        <ArticleLi>
          <strong>Snapshot:</strong> foto del estado del repositorio en un
          momento. Ejemplo: un grafo generado ayer no refleja el commit de hoy
          hasta ejecutar una actualización.
        </ArticleLi>
        <ArticleLi>
          <strong>Hook de git:</strong> script que git ejecuta en eventos como
          commit y checkout. Ejemplo: el hook de Graphify reconstruye el grafo
          después del commit. Consulta la{" "}
          <TermLink href={GIT_HOOKS_URL}>documentación de hooks de git</TermLink>.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>3. Qué es Graphify</ArticleH2>

      <ArticleP>
        <TermLink href={GRAPHIFY_URL}>Graphify</TermLink> es una herramienta
        open-source de mapa de codebase. Lee código, documentación, SQL,
        configuración, PDFs y multimedia, extrae conceptos y relaciones, arma un
        grafo y graba el resultado en archivos que pueden consultarse después.
      </ArticleP>

      <ArticleP>
        Hay dos formas de uso. La primera es la CLI local, instalada desde el
        paquete <TermLink href={PYPI_URL}>graphifyy</TermLink>, que también
        registra una skill en el agente. La segunda es{" "}
        <TermLink href={CLOUD_URL}>Graphify Cloud</TermLink>, que aloja el grafo
        y expone un servidor <TermLink href={MCP_URL}>MCP</TermLink>.
      </ArticleP>

      <ArticleP>
        El flujo de construcción tiene dos rutas. El código pasa por extracción
        estructural local. Documentos, PDFs, imágenes y video pasan por una
        etapa semántica opcional, que puede usar el modelo del asistente o un
        backend configurado.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Flujo de Graphify: código y manifests pasan por extracción local con tree-sitter; docs y multimedia pasan por extracción semántica; ambos se unen en resolución, comunidades y graph.json, consultado por query, path y explain"
        chart={PIPELINE_CHART}
      />

      <ArticleP>
        La salida principal es una carpeta{" "}
        <ArticleCode>graphify-out/</ArticleCode> con cuatro archivos útiles:
      </ArticleP>

      <ArticleTable caption="Salidas de Graphify y para qué sirven">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Archivo</ArticleTh>
            <ArticleTh>Qué es</ArticleTh>
            <ArticleTh>Uso práctico</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>graph.json</ArticleCode>
            </ArticleTd>
            <ArticleTd>Grafo completo con nodos, aristas y metadatos</ArticleTd>
            <ArticleTd>
              Base para <ArticleCode>query</ArticleCode>,{" "}
              <ArticleCode>path</ArticleCode> y <ArticleCode>explain</ArticleCode>
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>graph.html</ArticleCode>
            </ArticleTd>
            <ArticleTd>Visualización interactiva del grafo</ArticleTd>
            <ArticleTd>Explorar comunidades, buscar y hacer clic en nodos</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>GRAPH_REPORT.md</ArticleCode>
            </ArticleTd>
            <ArticleTd>Resumen con nodos principales, comunidades y conexiones</ArticleTd>
            <ArticleTd>Lectura rápida de arquitectura antes de investigar</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>manifest.json</ArticleCode>
            </ArticleTd>
            <ArticleTd>Metadatos de la extracción y del conjunto analizado</ArticleTd>
            <ArticleTd>Auditar qué entró en el grafo</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>cache/</ArticleCode>
            </ArticleTd>
            <ArticleTd>Caché para actualizaciones incrementales</ArticleTd>
            <ArticleTd>No commitear; sirve para reconstruir más rápido</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        El punto central es que el grafo es persistente. El agente no necesita
        redescubrir la estructura del repositorio en cada sesión. Puede consultar
        el mapa que ya fue construido.
      </ArticleP>

      <ArticleCallout variant="tip" title="Un grafo no es un resumen">
        <ArticleP>
          Un resumen en Markdown pierde aristas. El grafo guarda la relación
          entre dos puntos y permite preguntar “¿cuál es el camino entre A y B?”.
          Esa es la diferencia entre leer un texto sobre el sistema y navegar por
          su estructura.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>4. Cómo se construye el grafo</ArticleH2>

      <ArticleP>
        La construcción ocurre en etapas. Entender el orden ayuda a interpretar
        el resultado y a diagnosticar un grafo incompleto:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          Graphify lista los archivos relevantes y aplica reglas de ignore, como{" "}
          <ArticleCode>.gitignore</ArticleCode> y{" "}
          <ArticleCode>.graphifyignore</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Cada archivo de código pasa por un parser{" "}
          <TermLink href={TREE_SITTER_URL}>tree-sitter</TermLink> y se convierte
          en una <TermLink href={AST_URL}>AST</TermLink>. Se extraen funciones,
          clases, imports, llamadas y herencias.
        </ArticleLi>
        <ArticleLi>
          Documentos, PDFs, imágenes y transcripciones pueden pasar por una etapa
          semántica que identifica conceptos y relaciones fuera del código.
        </ArticleLi>
        <ArticleLi>
          Las relaciones entre archivos y símbolos se resuelven. Una llamada a{" "}
          <ArticleCode>send()</ArticleCode> en otro archivo se convierte en una
          arista entre los nodos correspondientes.
        </ArticleLi>
        <ArticleLi>
          El grafo se divide en comunidades con{" "}
          <TermLink href={LEIDEN_URL}>Leiden</TermLink> o{" "}
          <TermLink href={LOUVAIN_URL}>Louvain</TermLink>, y los grupos reciben
          nombres.
        </ArticleLi>
        <ArticleLi>
          El resultado se graba en <ArticleCode>graph.json</ArticleCode>,{" "}
          <ArticleCode>graph.html</ArticleCode> y{" "}
          <ArticleCode>GRAPH_REPORT.md</ArticleCode>.
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        Según la documentación, la extracción local cubre cerca de 40 lenguajes.
        SQL y Terraform tienen extractores propios, y los formatos ambiguos
        pueden declararse en <ArticleCode>.graphifyrc</ArticleCode> para que el
        parser no elija el lenguaje equivocado.
      </ArticleP>

      <ArticleH3>EXTRACTED no es INFERRED</ArticleH3>

      <ArticleP>
        Cada arista lleva una etiqueta de procedencia.{" "}
        <ArticleCode>EXTRACTED</ArticleCode> significa que la relación se leyó
        directamente de la sintaxis. Ejemplo: un{" "}
        <ArticleCode>import</ArticleCode> explícito de{" "}
        <ArticleCode>AuthService</ArticleCode> a{" "}
        <ArticleCode>TokenService</ArticleCode>.
      </ArticleP>

      <ArticleP>
        <ArticleCode>INFERRED</ArticleCode> significa que la relación vino de una
        etapa de resolución. Ejemplo: una llamada dinámica que el resolvedor
        asoció a una función probable. La documentación del proyecto aclara que{" "}
        <ArticleCode>INFERRED</ArticleCode> no significa necesariamente “creado
        por <TermLink href={LLM_URL}>LLM</TermLink>”. Puede ser inferencia estática.
      </ArticleP>

      <ArticleP>
        La consecuencia práctica es simple: las aristas extraídas son más
        fuertes; las inferidas necesitan revisión en el código antes de
        convertirse en conclusión. Graphify expone esa diferencia en su{" "}
        <TermLink href={PROVENANCE_URL}>modelo de procedencia</TermLink>.
      </ArticleP>

      <ArticleH3>Lo que el grafo no ve</ArticleH3>

      <ArticleP>
        Dispatch dinámico (cuando el método llamado solo se decide en tiempo de
        ejecución), reflection (cuando el código inspecciona tipos y miembros en
        runtime), código generado, templates y dependencias resueltas en runtime
        pueden quedar afuera. Un grafo incompleto es un mapa parcial, no un grafo
        equivocado. La fuente final sigue siendo el archivo y la prueba.
      </ArticleP>

      <ArticleH2>5. Instalación y primer grafo</ArticleH2>

      <ArticleP>
        Graphify exige <TermLink href={PYTHON_URL}>Python</TermLink> 3.10 o
        superior. El camino recomendado usa{" "}
        <TermLink href={UV_URL}>uv</TermLink>;{" "}
        <TermLink href={PIPX_URL}>pipx</TermLink> también funciona. El paquete
        oficial en PyPI es <ArticleCode>graphifyy</ArticleCode>, con dos “y”. El
        comando instalado es <ArticleCode>graphify</ArticleCode>.
      </ArticleP>

      <ArticleCode block language="bash">
        {`uv tool install graphifyy
graphify install`}
      </ArticleCode>

      <ArticleP>
        El primer comando instala la CLI en un ambiente aislado. El segundo
        detecta el asistente y registra la skill. Para elegir el asistente, pasa
        la plataforma:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify install --platform opencode
graphify install --platform codex
graphify install --platform gemini`}
      </ArticleCode>

      <ArticleP>
        En el asistente, el comando de la skill construye el grafo de la carpeta
        actual:
      </ArticleP>

      <ArticleCode block language="bash">
        {`/graphify .
/graphify query "how does authentication reach the database"`}
      </ArticleCode>

      <ArticleP>
        Si quieres solo el grafo de código, sin enviar documentación a ningún
        modelo, ejecuta la CLI en modo <ArticleCode>--code-only</ArticleCode>:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify extract . --code-only`}
      </ArticleCode>

      <ArticleP>
        Esa es la primera prueba que haría. Responde a la pregunta más
        importante: ¿el parser entiende la estructura de tu proyecto? Si el
        grafo de código ya resulta útil, la etapa semántica de docs pasa a ser un
        extra, no una dependencia.
      </ArticleP>

      <ArticleH3>Extras opcionales</ArticleH3>

      <ArticleP>
        La instalación base no cubre todos los formatos. Los extras se instalan
        bajo demanda:
      </ArticleP>

      <ArticleTable caption="Extras útiles de Graphify">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Extra</ArticleTh>
            <ArticleTh>Agrega</ArticleTh>
            <ArticleTh>Cuándo tiene sentido</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>mcp</ArticleCode>
            </ArticleTd>
            <ArticleTd>Servidor MCP local</ArticleTd>
            <ArticleTd>Agente que consume tools en vez de CLI</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>watch</ArticleCode>
            </ArticleTd>
            <ArticleTd>Reconstrucción al detectar cambios</ArticleTd>
            <ArticleTd>Desarrollo activo con grafo siempre fresco</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>pdf</ArticleCode>
            </ArticleTd>
            <ArticleTd>Lectura de PDFs</ArticleTd>
            <ArticleTd>Repositorio con especificaciones y papers</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>sql</ArticleCode>
            </ArticleTd>
            <ArticleTd>Extracción de esquema SQL</ArticleTd>
            <ArticleTd>El modelo de datos debe entrar en el mapa</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>office</ArticleCode>
            </ArticleTd>
            <ArticleTd>DOCX y XLSX</ArticleTd>
            <ArticleTd>Documentación de negocio en documentos y planillas</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>leiden</ArticleCode>
            </ArticleTd>
            <ArticleTd>Detección de comunidades con Leiden</ArticleTd>
            <ArticleTd>Grafo grande donde importa la calidad de los grupos</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>ollama</ArticleCode>
            </ArticleTd>
            <ArticleTd>Backend local para la etapa semántica</ArticleTd>
            <ArticleTd>Contenido sensible que no puede salir de la máquina</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>video</ArticleCode>
            </ArticleTd>
            <ArticleTd>Transcripción de video y audio</ArticleTd>
            <ArticleTd>Repositorio con grabaciones y demostraciones</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleCallout variant="warning" title="Privacidad de la etapa semántica">
        <ArticleP>
          El código se procesa localmente con tree-sitter. Documentos, PDFs e
          imágenes pueden enviarse al modelo del asistente o al backend
          configurado. Si el repositorio tiene contenido restringido, usa{" "}
          <ArticleCode>--code-only</ArticleCode> o un backend local como Ollama
          antes de ejecutar la extracción completa.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>6. Consultando el grafo</ArticleH2>

      <ArticleP>
        Existen tres comandos de consulta. Responden a preguntas diferentes, y
        elegir el comando correcto ahorra tiempo:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>query</ArticleCode>: encuentra nodos relevantes y recorre
          relaciones desde ellos. Úsalo para preguntas amplias, como “¿cómo llega
          la autenticación a la base?”.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>path</ArticleCode>: traza el camino más corto entre dos
          nodos. Úsalo para saber cómo se conectan dos puntos.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>explain</ArticleCode>: detalla un nodo, su origen,
          comunidad y conexiones. Úsalo después de encontrar un nombre en el
          resultado.
        </ArticleLi>
      </ArticleUl>

      <ArticleCode block language="bash">
        {`graphify query "authentication and session storage" --budget 1500
graphify path "login" "normalize_email"
graphify explain "normalize_email"`}
      </ArticleCode>

      <ArticleP>
        <ArticleCode>query</ArticleCode> usa búsqueda en anchura por defecto. El
        flag <ArticleCode>--dfs</ArticleCode> sigue una cadena más profunda, y{" "}
        <ArticleCode>--budget</ArticleCode> limita el tamaño de la respuesta en
        tokens:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify query "request validation" --dfs --budget 1500
graphify query "who calls send" --context calls
graphify query "what raises timeouts" --seed "TimeoutException" --budget 300`}
      </ArticleCode>

      <ArticleP>
        <ArticleCode>--seed</ArticleCode> empieza por un nodo que ya conoces.{" "}
        <ArticleCode>--context</ArticleCode> limita el tipo de arista, como{" "}
        <ArticleCode>calls</ArticleCode>. Esos dos flags evitan que la consulta
        se expanda por todo el grafo.
      </ArticleP>

      <ArticleH3>Cómo hacer una buena pregunta</ArticleH3>

      <ArticleP>
        Una pregunta demasiado amplia se convierte en un volcado de nodos. Una
        pregunta demasiado específica no encuentra el nodo. El punto medio es
        empezar por un subsistema y ajustar el alcance:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Buena: “¿cómo llega el middleware de autenticación al repositorio de
          usuarios?”. El grafo tiene puntos de partida claros y una dirección de
          llamada.
        </ArticleLi>
        <ArticleLi>
          Débil: “explícame el sistema”. La consulta no sabe dónde empezar y
          devuelve un subgrafo enorme o irrelevante.
        </ArticleLi>
        <ArticleLi>
          Buena: “¿quién llama a <ArticleCode>send()</ArticleCode>?” con{" "}
          <ArticleCode>--context calls</ArticleCode>. La arista limita el
          resultado.
        </ArticleLi>
        <ArticleLi>
          Débil: “¿dónde hay código de autenticación?”. Eso es una búsqueda
          léxica, no una pregunta estructural.{" "}
          <TermLink href={GREP_URL}>grep</TermLink> lo resuelve mejor.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Los comandos de consulta no llaman a un <TermLink href={LLM_URL}>LLM</TermLink>. Leen{" "}
        <ArticleCode>graph.json</ArticleCode> localmente. El código de salida
        ayuda a la automatización: <ArticleCode>0</ArticleCode> para respuesta,{" "}
        <ArticleCode>3</ArticleCode> para nombre ambiguo y{" "}
        <ArticleCode>4</ArticleCode> para ningún nodo encontrado.
      </ArticleP>

      <ArticleH2>7. Manteniendo el grafo actualizado</ArticleH2>

      <ArticleP>
        Un grafo desactualizado es peor que un grafo ausente, porque parece
        confiable. Después del primer build, instala los hooks de git (scripts que git ejecuta en eventos como commit y checkout):
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify hook install
graphify hook status`}
      </ArticleCode>

      <ArticleP>
        Los hooks reconstruyen el grafo de código después de commits, cambio de
        branch, merge, pull y rebase. Para cambios en documentación e imágenes,
        ejecuta la actualización desde el asistente o la CLI:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify update .
graphify extract . --update`}
      </ArticleCode>

      <ArticleP>
        La caché vive en <ArticleCode>graphify-out/cache/</ArticleCode> y no debe
        commitearse. La guía de{" "}
        <TermLink href={INCREMENTAL_URL}>actualización incremental</TermLink>{" "}
        explica qué cubre cada disparador.
      </ArticleP>

      <ArticleH3>Ignora lo que no debe entrar</ArticleH3>

      <ArticleP>
        Graphify respeta <ArticleCode>.gitignore</ArticleCode> y acepta un{" "}
        <ArticleCode>.graphifyignore</ArticleCode> propio. Úsalo para excluir
        build, dependencias y artefactos:
      </ArticleP>

      <ArticleCode block language="plaintext">
        {`node_modules/
dist/
coverage/
.next/`}
      </ArticleCode>

      <ArticleP>
        La configuración del proyecto puede ir en un{" "}
        <ArticleCode>.graphifyrc</ArticleCode>, como presupuesto y profundidad
        por defecto de la consulta:
      </ArticleP>

      <ArticleCode block language="ini">
        {`query_budget=4000
query_depth=3`}
      </ArticleCode>

      <ArticleH2>8. Skills, MCP y Graphify Cloud</ArticleH2>

      <ArticleP>
        La skill y MCP resuelven el mismo problema por caminos diferentes. La
        skill enseña al asistente a ejecutar la CLI local.{" "}
        <TermLink href={MCP_URL}>MCP</TermLink> expone herramientas para que el
        agente consulte el grafo sin depender de la línea de comandos.
      </ArticleP>

      <ArticleP>
        La documentación de Graphify lista soporte para Claude Code, Cursor,
        Codex, Gemini CLI, GitHub Copilot, OpenCode y otros asistentes. El
        comando de instalación cambia por plataforma:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify install --platform opencode
graphify install --platform codex
graphify install --platform gemini`}
      </ArticleCode>

      <ArticleP>
        Graphify Cloud ofrece el grafo alojado, con servidor MCP en{" "}
        <ArticleCode>https://api.graphify.com/mcp</ArticleCode> usando Streamable
        HTTP, OAuth y sin API key. El plan gratuito cubre hasta tres
        repositorios, según la documentación. Para uso local y offline, la CLI
        open-source sigue siendo el camino.
      </ArticleP>

      <ArticleP>
        Si usas ambos, elige qué grafo es la fuente principal. La propia
        documentación recomienda no copiar dos bloques de instrucción
        incondicionales al <ArticleCode>AGENTS.md</ArticleCode> del proyecto. La guía para{" "}
        <TermLink href={ALWAYS_ON_URL}>que el agente use el grafo</TermLink>{" "}
        muestra qué escribe cada integración.
      </ArticleP>

      <ArticleH2>9. Benchmarks: qué mejora y qué no prueba</ArticleH2>

      <ArticleP>
        El proyecto publica benchmarks en un harness propio, con el mismo
        modelo, presupuesto y juez para las herramientas comparadas. Harness,
        aquí, es el ambiente estandarizado que ejecuta todos los sistemas; el
        juez es el modelo que evalúa las respuestas contra hechos esperados.
      </ArticleP>

      <ArticleP>
        Antes de los números, conviene entender qué mide cada nombre. Sin eso,
        la tabla se vuelve un ranking suelto:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong><TermLink href={LOCOMO_URL}>LOCOMO</TermLink>:</strong>{" "}
          dataset público de memoria conversacional con varias sesiones.
          Ejemplo: preguntas que dependen de hechos dichos en conversaciones
          anteriores.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={LONGMEMEVAL_URL}>LongMemEval-S</TermLink>:</strong>{" "}
          dataset de memoria de largo plazo con preguntas que exigen recordar
          información distante.
        </ArticleLi>
        <ArticleLi>
          <strong>recall@10:</strong> de los 10 primeros resultados recuperados,
          cuántos contienen la respuesta correcta. Cuanto más alto, mejor.
        </ArticleLi>
        <ArticleLi>
          <strong>Precisión de QA:</strong> porcentaje de respuestas finales
          correctas, evaluadas por un juez contra hechos esperados.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={ERPNEXT_URL}>ERPNext</TermLink>:</strong>{" "}
          sistema ERP open-source usado como repositorio grande en la prueba de
          inteligencia de código.
        </ArticleLi>
        <ArticleLi>
          <strong>Cobertura de hechos:</strong> cuántos hechos clave esperados
          aparecen en la respuesta del agente.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={BM25_URL}>BM25</TermLink>:</strong> algoritmo
          clásico de búsqueda léxica por frecuencia de términos. Ejemplo:
          encuentra documentos que repiten las palabras de la pregunta, pero no
          entiende relaciones.
        </ArticleLi>
        <ArticleLi>
          <strong>dense RAG:</strong> recuperación por embeddings, que busca
          fragmentos semánticamente parecidos. RAG significa Retrieval-Augmented
          Generation, o generación aumentada por recuperación. Consulta{" "}
          <TermLink href={RAG_URL}>RAG</TermLink>.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={MEM0_URL}>mem0</TermLink> y{" "}
          <TermLink href={SUPERMEMORY_URL}>supermemory</TermLink>:</strong>{" "}
          sistemas de memoria para agentes usados como comparación.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        La tabla de abajo resume los números divulgados:
      </ArticleP>

      <ArticleTable caption="Benchmarks publicados por el proyecto Graphify">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Suite</ArticleTh>
            <ArticleTh>Métrica</ArticleTh>
            <ArticleTh>Graphify</ArticleTh>
            <ArticleTh>Comparación</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>LOCOMO</ArticleTd>
            <ArticleTd>recall@10</ArticleTd>
            <ArticleTd>0.497</ArticleTd>
            <ArticleTd>BM25 0.362; mem0 0.048</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>LOCOMO</ArticleTd>
            <ArticleTd>Precisión de QA</ArticleTd>
            <ArticleTd>45.3%</ArticleTd>
            <ArticleTd>supermemory 49.7% con cerca de 11x el costo; mem0 27.3%</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>LongMemEval-S</ArticleTd>
            <ArticleTd>Precisión de QA</ArticleTd>
            <ArticleTd>76%</ArticleTd>
            <ArticleTd>Empata con dense RAG</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>ERPNext</ArticleTd>
            <ArticleTd>Cobertura de hechos en código</ArticleTd>
            <ArticleTd>82.0%</ArticleTd>
            <ArticleTd>grep y lectura 70.8%</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Costo de build</ArticleTd>
            <ArticleTd>Créditos de <TermLink href={LLM_URL}>LLM</TermLink></ArticleTd>
            <ArticleTd>0</ArticleTd>
            <ArticleTd>Competidores pagan ingest por token</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Los números de LOCOMO y LongMemEval vienen de datasets de memoria
        conversacional. La prueba de ERPNext usa un repositorio Python de gran
        porte y mide cobertura de hechos con un agente fijo. El benchmark también
        reporta cerca de 140 mil tokens por consulta en el escenario de código y
        un costo de ingest de aproximadamente US$ 1,40 en LOCOMO.
      </ArticleP>

      <ArticleP>
        Lo que esos datos sugieren: un grafo persistente puede recuperar
        contexto con menos lectura bruta y mantener la estructura entre sesiones.
        Lo que no prueban: que Graphify será mejor en tu repositorio, tu lenguaje
        y tu tipo de pregunta. El harness es del propio proyecto, y un benchmark
        de proveedor no reemplaza la medición local.
      </ArticleP>

      <ArticleCallout variant="note" title="Sobre el número de 80%">
        <ArticleP>
          El material de divulgación habla de recortar hasta 80% del gasto de
          tokens de agentes. Trata ese número como afirmación de producto. El
          dato verificable en el benchmark de código es otro: 82.0% de cobertura
          contra 70.8% de grep y lectura, con el costo de contexto descrito en el
          informe. Mide tu caso antes de prometer la misma ganancia.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>10. Cuándo usarlo y cuándo evitarlo</ArticleH2>

      <ArticleP>
        Graphify brilla cuando la pregunta cruza archivos y la estructura importa
        más que el texto. El flujo resume la primera decisión:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Decisión de uso: si la pregunta cruza varios archivos y el repositorio es grande o poco conocido, usar Graphify; si no, grep y lectura dirigida"
        chart={DECISION_CHART}
      />

      <ArticleH3>Señales de que vale la pena</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Onboarding en un repositorio grande: el grafo muestra comunidades y
          conceptos centrales antes de que abras veinte archivos.
        </ArticleLi>
        <ArticleLi>
          Monorepo (un repositorio con varios proyectos y servicios): las preguntas de impacto y los caminos
          entre módulos se vuelven más baratos.
        </ArticleLi>
        <ArticleLi>
          Revisión de arquitectura: <ArticleCode>GRAPH_REPORT.md</ArticleCode> y{" "}
          <ArticleCode>graph.html</ArticleCode> dan una vista que el diff no da.
        </ArticleLi>
        <ArticleLi>
          Agente que repite la misma lectura: el grafo persistente evita
          redescubrir la estructura en cada sesión.
        </ArticleLi>
        <ArticleLi>
          Código y documentación en el mismo mapa: decisiones registradas en ADR
          (registros de decisión de arquitectura) o RFC (propuestas técnicas)
          ganan nodos propios.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Señales de que no vale</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Repositorio pequeño y conocido:{" "}
          <TermLink href={GREP_URL}>grep</TermLink> y lectura dirigida resuelven
          sin ceremonia.
        </ArticleLi>
        <ArticleLi>
          Código generado o muy dinámico: el parser ve menos de lo que hace el
          runtime, y el grafo queda con huecos.
        </ArticleLi>
        <ArticleLi>
          Necesidad de verdad exacta en tiempo real: el grafo es un snapshot. El
          archivo y la prueba siguen siendo la fuente.
        </ArticleLi>
        <ArticleLi>
          Contenido restringido que no puede pasar por un modelo: la etapa
          semántica de docs puede enviar datos al backend. Usa{" "}
          <ArticleCode>--code-only</ArticleCode> o un modelo local.
        </ArticleLi>
        <ArticleLi>
          Equipo sin rutina de actualización: un grafo viejo engaña. Si nadie
          ejecuta hooks ni updates, el mapa pierde valor.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Regla práctica">
        <ArticleP>
          Si la pregunta cabe en una búsqueda textual, usa grep. Si la pregunta
          depende de relaciones entre partes, prueba el grafo. Si el grafo
          responde sin que abras el archivo, pagó su costo. Si abres el archivo
          igual, el grafo sirvió como índice, no como respuesta.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>11. Flujo recomendado</ArticleH2>

      <ArticleP>
        El orden de abajo evita empezar por el camino más caro. El primer
        objetivo es probar que el parser entiende el proyecto, no armar el grafo
        más completo posible:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          Instala <ArticleCode>graphifyy</ArticleCode> con uv o pipx y ejecuta{" "}
          <ArticleCode>graphify install</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Construye el grafo de código con{" "}
          <ArticleCode>graphify extract . --code-only</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Abre <ArticleCode>graph.html</ArticleCode> y lee{" "}
          <ArticleCode>GRAPH_REPORT.md</ArticleCode> para revisar si los nodos
          principales tienen sentido.
        </ArticleLi>
        <ArticleLi>
          Prueba tres preguntas reales con <ArticleCode>query</ArticleCode>,{" "}
          <ArticleCode>path</ArticleCode> y <ArticleCode>explain</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Si el resultado ayuda, agrega docs y PDFs con los extras y configura el
          backend semántico.
        </ArticleLi>
        <ArticleLi>
          Instala <ArticleCode>graphify hook install</ArticleCode> y confirma
          con <ArticleCode>graphify hook status</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Para el equipo, versiona <ArticleCode>graph.json</ArticleCode> y{" "}
          <ArticleCode>GRAPH_REPORT.md</ArticleCode>; deja{" "}
          <ArticleCode>cache/</ArticleCode> fuera de git.
        </ArticleLi>
        <ArticleLi>
          Elige entre skill local y MCP, y registra solo el camino de consulta que
          el agente realmente usa.
        </ArticleLi>
      </ArticleOl>

      <ArticleH2>12. Errores comunes</ArticleH2>

      <ArticleUl>
        <ArticleLi>
          <strong>Tratar INFERRED como hecho.</strong> La arista inferida es
          pista, no prueba. Abre el archivo citado antes de tomar una decisión de
          arquitectura.
        </ArticleLi>
        <ArticleLi>
          <strong>Preguntar de forma demasiado amplia.</strong> “Explica el
          sistema” devuelve un subgrafo enorme. Empieza por un subsistema y usa{" "}
          <ArticleCode>--budget</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <strong>Olvidar la actualización.</strong> Sin hook o{" "}
          <ArticleCode>update</ArticleCode>, el grafo envejece y apunta a código
          que cambió.
        </ArticleLi>
        <ArticleLi>
          <strong>Commitear la caché.</strong> La caché acelera el build local,
          pero no es un artefacto de equipo. Versiona el grafo y el informe.
        </ArticleLi>
        <ArticleLi>
          <strong>Creer que los docs son locales por defecto.</strong> El código
          es local. La etapa semántica de documentos puede usar el modelo del
          asistente o un backend configurado.
        </ArticleLi>
        <ArticleLi>
          <strong>Usar el grafo como reemplazo de pruebas.</strong> El mapa
          muestra relaciones, no comportamiento. La prueba sigue siendo prueba.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Puntos clave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <TermLink href={GRAPHIFY_URL}>Graphify</TermLink> transforma el
          codebase en un grafo consultable, no en otro chat.
        </ArticleLi>
        <ArticleLi>
          El código se extrae localmente con tree-sitter; docs y multimedia usan
          una etapa semántica opcional.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>query</ArticleCode>, <ArticleCode>path</ArticleCode> y{" "}
          <ArticleCode>explain</ArticleCode> responden a preguntas diferentes.
          Elige según el tipo de pregunta.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>EXTRACTED</ArticleCode> es más fuerte que{" "}
          <ArticleCode>INFERRED</ArticleCode>. Revisa las aristas inferidas en
          el código.
        </ArticleLi>
        <ArticleLi>
          El grafo necesita actualización. Hooks y{" "}
          <ArticleCode>update</ArticleCode> evitan un mapa viejo.
        </ArticleLi>
        <ArticleLi>
          Los benchmarks del proyecto muestran ganancia en recall y cobertura,
          pero no reemplazan la medición en tu repositorio.
        </ArticleLi>
        <ArticleLi>
          Úsalo en repositorio grande, pregunta estructural y contexto que debe
          persistir. En búsqueda textual simple, grep sigue ganando.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusión</ArticleH3>

      <ArticleP>
        <TermLink href={GRAPHIFY_URL}>Graphify</TermLink> resuelve un problema
        concreto: el agente olvida la estructura del proyecto entre sesiones y
        gasta contexto redescubriendo lo obvio. El grafo persistente da un mapa
        estable, con procedencia y consultas por relación.
      </ArticleP>

      <ArticleP>
        El valor no viene de cambiar grep por una herramienta nueva. Viene de
        usar la herramienta correcta para la pregunta correcta. Búsqueda textual
        para texto. Grafo para relación. Archivo y prueba para la verdad final.
      </ArticleP>

      <ArticleH3>Fuentes y lecturas</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <TermLink href={GRAPHIFY_WHAT_URL}>Graphify: qué es</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={DOCS_URL}>Documentación oficial</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={INSTALL_URL}>Instalación y extras</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={QUICKSTART_URL}>Quickstart con skill</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={QUERYING_URL}>Guía de consultas</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={ARCHITECTURE_URL}>Cómo se construye el grafo</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={GITHUB_URL}>Repositorio en GitHub</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={PYPI_URL}>Paquete graphifyy en PyPI</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={BENCHMARKS_URL}>Benchmarks del proyecto</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={CLOUD_URL}>Graphify Cloud</TermLink>,{" "}
          <TermLink href={PROVENANCE_URL}>procedencia</TermLink>,{" "}
          <TermLink href={INCREMENTAL_URL}>actualización incremental</TermLink>{" "}
          y <TermLink href={ALWAYS_ON_URL}>agente usando el grafo</TermLink>
        </ArticleLi>
        <ArticleLi>
          Datasets y comparaciones:{" "}
          <TermLink href={LOCOMO_URL}>LOCOMO</TermLink>,{" "}
          <TermLink href={LONGMEMEVAL_URL}>LongMemEval</TermLink>,{" "}
          <TermLink href={ERPNEXT_URL}>ERPNext</TermLink>,{" "}
          <TermLink href={BM25_URL}>BM25</TermLink>,{" "}
          <TermLink href={RAG_URL}>RAG</TermLink>,{" "}
          <TermLink href={MEM0_URL}>mem0</TermLink> y{" "}
          <TermLink href={SUPERMEMORY_URL}>supermemory</TermLink>
        </ArticleLi>
        <ArticleLi>
          Herramientas y conceptos: <TermLink href={UV_URL}>uv</TermLink>,{" "}
          <TermLink href={PIPX_URL}>pipx</TermLink>,{" "}
          <TermLink href={PYTHON_URL}>Python</TermLink>,{" "}
          <TermLink href={EMBEDDING_URL}>embedding</TermLink>,{" "}
          <TermLink href={LLM_URL}>LLM</TermLink>,{" "}
          <TermLink href={VECTOR_DB_URL}>vector store</TermLink> y{" "}
          <TermLink href={GIT_HOOKS_URL}>git hooks</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={MCP_URL}>Model Context Protocol</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={TREE_SITTER_URL}>Tree-sitter</TermLink> y{" "}
          <TermLink href={AST_URL}>AST</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={KNOWLEDGE_GRAPH_URL}>Knowledge graph</TermLink>,{" "}
          <TermLink href={LEIDEN_URL}>Leiden</TermLink> y{" "}
          <TermLink href={LOUVAIN_URL}>Louvain</TermLink>
        </ArticleLi>
      </ArticleUl>
    </>
  );
}
