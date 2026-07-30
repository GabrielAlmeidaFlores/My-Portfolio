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

const WHY_CHART = `flowchart TB
  User["Usuario escribe busqueda"]
  Api["API arma consulta"]
  Like["LIKE con wildcard"]
  SeqScan["Escaneo completo"]
  BadRel["Baja relevancia"]
  BadPerf["Costo crece con trafico"]

  User --> Api
  Api --> Like
  Like --> SeqScan
  SeqScan --> BadRel
  SeqScan --> BadPerf`;

const FTS_CHART = `flowchart TB
  Source["Nombre + descripcion"]
  Token["Tokenizacion"]
  Inverted["Indice invertido"]
  Query["Termino buscado"]
  Rank["Ranking por relevancia"]
  Result["Resultados mejores y mas rapidos"]

  Source --> Token
  Token --> Inverted
  Query --> Inverted
  Inverted --> Rank
  Rank --> Result`;

const VIDEO_URL = "https://www.youtube.com/watch?v=UYOr-rpQs1I";
const MYSQL_FTS_URL =
  "https://dev.mysql.com/doc/refman/8.0/en/fulltext-search.html";
const MYSQL_EXPLAIN_URL =
  "https://dev.mysql.com/doc/refman/8.0/en/explain.html";
const POSTGRES_FTS_URL =
  "https://www.postgresql.org/docs/current/textsearch-intro.html";
const POSTGRES_GIN_URL =
  "https://www.postgresql.org/docs/current/gin.html";
const POSTGRES_TEXTSEARCH_URL =
  "https://www.postgresql.org/docs/current/functions-textsearch.html";
const POSTGRES_RANK_URL =
  "https://www.postgresql.org/docs/current/textsearch-controls.html";
const POSTGRES_UNACCENT_URL =
  "https://www.postgresql.org/docs/current/unaccent.html";
const ELASTIC_URL = "https://www.elastic.co/guide/index.html";
const OPENSEARCH_URL = "https://docs.opensearch.org/latest/";
const MEILI_URL = "https://www.meilisearch.com/docs";

const linkClass =
  "font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300";

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

export function FullTextSearchMysqlPostgresqlContentEs() {
  return (
    <>
      <ArticleH2>1. Contexto y creditos</ArticleH2>

      <ArticleP>
        Este articulo es una guia practica sobre busqueda inteligente en bases
        relacionales con <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink> y{" "}
        <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>.
      </ArticleP>

      <ArticleP>
        Este post funciona como documentacion tecnica del video{" "}
        <a
          href={VIDEO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          O QUE NINGUEM TE ENSINOU SOBRE BUSCAS INTELIGENTES NO BANCO DE DADOS
        </a>
        . La secuencia y los ejemplos parten de ese material.
      </ArticleP>

      <ArticleCallout variant="note" title="Credito de la fuente">
        <ArticleP>
          Fuente principal:{" "}
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            video original en YouTube
          </a>
          . Aqui se reorganiza el material en formato de referencia para aplicar
          en proyectos reales.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        El foco es directo: cuando <ArticleCode>LIKE</ArticleCode> falla, como{" "}
        <TermLink href={MYSQL_FTS_URL}>Full Text Search</TermLink> mejora
        relevancia y performance, y que cambia entre{" "}
        <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink> y{" "}
        <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>.
      </ArticleP>

      <ArticleH2>2. Por que LIKE falla en busqueda real</ArticleH2>

      <ArticleP>
        <ArticleCode>LIKE</ArticleCode> con wildcard sirve para filtros por
        substring. Falla cuando necesitas relevancia de verdad para usuarios.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>Coincide caracteres, no intencion de busqueda.</ArticleLi>
        <ArticleLi>Genera falsos positivos con frecuencia.</ArticleLi>
        <ArticleLi>
          Se rompe con busquedas compuestas y variaciones de lenguaje.
        </ArticleLi>
        <ArticleLi>
          Tiende a escaneo completo y sube mucho el costo bajo concurrencia.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        El impacto es directo en experiencia de usuario y costo operativo. Bajo
        concurrencia, el volumen de lectura crece rapido.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Flujo con LIKE termina en escaneo completo y baja relevancia"
        chart={WHY_CHART}
      />

      <ArticleH3>Senal en el plan de ejecucion</ArticleH3>

      <ArticleP>
        En <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink>,{" "}
        <ArticleCode>LIKE '%termino%'</ArticleCode> suele mostrar lectura amplia
        de tabla.
      </ArticleP>

      <ArticleCode block>
        {`EXPLAIN ANALYZE
SELECT id, name
FROM products
WHERE name LIKE '%anillo%';`}
      </ArticleCode>

      <ArticleH2>3. Full Text Search en MySQL</ArticleH2>

      <ArticleP>
        En <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink>, el camino base es
        indice <ArticleCode>FULLTEXT</ArticleCode> y consulta{" "}
        <ArticleCode>MATCH ... AGAINST</ArticleCode>.
      </ArticleP>

      <ArticleCode block>
        {`CREATE FULLTEXT INDEX search_idx
ON products (name, description);

SELECT id, name, description
FROM products
WHERE MATCH(name, description) AGAINST('auricular bluetooth' IN NATURAL LANGUAGE MODE);`}
      </ArticleCode>

      <ArticleH3>Tradeoffs en MySQL</ArticleH3>

      <ArticleUl>
        <ArticleLi>Mejora fuerte frente a LIKE con bajo esfuerzo.</ArticleLi>
        <ArticleLi>Ranking nativo util para catalogo y contenido.</ArticleLi>
        <ArticleLi>
          Menos control linguistico que{" "}
          <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>4. Full Text Search en PostgreSQL</ArticleH2>

      <ArticleP>
        <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink> ofrece una capa
        mas avanzada con <ArticleCode>to_tsvector</ArticleCode>,{" "}
        <ArticleCode>to_tsquery</ArticleCode> e indice{" "}
        <TermLink href={POSTGRES_GIN_URL}>GIN</TermLink>.
      </ArticleP>

      <ArticleCode block>
        {`CREATE INDEX products_search_idx
ON products
USING GIN (to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, '')));

SELECT id, name, description
FROM products
WHERE to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, ''))
@@ to_tsquery('spanish', 'anillo & plata');`}
      </ArticleCode>

      <ArticleH3>Por que PostgreSQL suele ser mas flexible</ArticleH3>

      <ArticleUl>
        <ArticleLi>Mejor soporte de idioma y normalizacion.</ArticleLi>
        <ArticleLi>Control mas fino de stemming y ranking.</ArticleLi>
        <ArticleLi>
          Configuracion avanzada de diccionarios y sinonimos por dominio.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>5. Que pasa por debajo</ArticleH2>

      <ArticleP>
        El motor de busqueda textual sigue un pipeline simple y potente.
      </ArticleP>

      <ArticleOl>
        <ArticleLi>tokenizacion del texto</ArticleLi>
        <ArticleLi>eliminacion de stop words</ArticleLi>
        <ArticleLi>indice invertido termino a documentos</ArticleLi>
        <ArticleLi>ranking por relevancia</ArticleLi>
      </ArticleOl>

      <ArticleMermaid
        ariaLabel="Pipeline de full text con tokenizacion e indice invertido"
        chart={FTS_CHART}
      />

      <ArticleH3>Lexema en PostgreSQL</ArticleH3>

      <ArticleP>
        En <TermLink href={POSTGRES_TEXTSEARCH_URL}>PostgreSQL text search</TermLink>,
        formas relacionadas de una palabra pueden caer en una misma raiz lexical.
      </ArticleP>

      <ArticleCode block>
        {`SELECT to_tsvector('spanish', 'programador programando programacion programadores');`}
      </ArticleCode>

      <ArticleH2>6. Calidad de busqueda en produccion</ArticleH2>

      <ArticleP>
        Cuando el FTS base ya funciona, la calidad final depende de como armas la
        query y de como ordenas por relevancia.
      </ArticleP>

      <ArticleH3>Modos de consulta que reducen ruido</ArticleH3>

      <ArticleUl>
        <ArticleLi>Busqueda por frase para subir precision contextual.</ArticleLi>
        <ArticleLi>Prefijo para flujos de autocomplete.</ArticleLi>
        <ArticleLi>
          Parsing tolerante para consultas compuestas del usuario.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        En <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>, estas
        funciones suelen cubrir la mayoria de casos:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>plainto_tsquery</ArticleCode> para entrada simple.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>to_tsquery</ArticleCode> para operadores explicitos.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>websearch_to_tsquery</ArticleCode> para sintaxis estilo
          buscador.
        </ArticleLi>
      </ArticleUl>

      <ArticleCode block>
        {`SELECT id, name,
  ts_rank_cd(
    setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(description, '')), 'B'),
    websearch_to_tsquery('spanish', 'anillo plata')
  ) AS score
FROM products
WHERE (
  setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('spanish', coalesce(description, '')), 'B')
) @@ websearch_to_tsquery('spanish', 'anillo plata')
ORDER BY score DESC, id DESC
LIMIT 20 OFFSET 0;`}
      </ArticleCode>

      <ArticleP>
        <TermLink href={POSTGRES_RANK_URL}>ts_rank_cd</TermLink> con pesos por
        campo corrige un problema tipico: el nombre debe pesar mas que una
        descripcion larga.
      </ArticleP>

      <ArticleH3>Acento, mayusculas y typo</ArticleH3>

      <ArticleP>
        El usuario real no escribe texto normalizado. En escenarios multilenguaje,
        conviene normalizar acentos y caja en indexacion y consulta. En
        PostgreSQL, <TermLink href={POSTGRES_UNACCENT_URL}>unaccent</TermLink>{" "}
        suele formar parte de la solucion.
      </ArticleP>

      <ArticleP>
        Tolerancia fuerte a typo no es el punto mas fuerte del FTS nativo. Si ese
        requisito es central, la decision de arquitectura cambia.
      </ArticleP>

      <ArticleH2>7. Operacion y benchmark confiable</ArticleH2>

      <ArticleP>
        Un benchmark solo sirve si comparas en condiciones equivalentes. Medir
        cache fria contra cache caliente da conclusiones engañosas.
      </ArticleP>

      <ArticleH3>Checklist de medicion</ArticleH3>

      <ArticleOl>
        <ArticleLi>Fijar tamaño de dataset y concurrencia.</ArticleLi>
        <ArticleLi>Comparar LIKE y FTS en el mismo entorno.</ArticleLi>
        <ArticleLi>Medir p50 y p95, no una sola corrida.</ArticleLi>
        <ArticleLi>
          Revisar plan con{" "}
          <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink>.
        </ArticleLi>
      </ArticleOl>

      <ArticleH3>Costos operativos que debes asumir</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Indice full text acelera lectura, pero aumenta costo de escritura.
        </ArticleLi>
        <ArticleLi>
          Reindex y mantenimiento de indice requieren ventana operativa.
        </ArticleLi>
        <ArticleLi>
          Paginacion por score necesita desempate estable.
        </ArticleLi>
        <ArticleLi>
          Limitar tamaño de query protege endpoints de busqueda.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Seguridad de implementacion">
        <ArticleP>
          No concatenes texto de usuario directo en SQL. Usa queries
          parametrizadas y validacion de entrada para reducir riesgo de inyeccion.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>8. Cuando FTS nativo alcanza y cuando migrar</ArticleH2>

      <ArticleTable caption="Decision arquitectonica para stack de busqueda">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Escenario</ArticleTh>
            <ArticleTh>FTS nativo</ArticleTh>
            <ArticleTh>Engine dedicada</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Catalogo medio con filtros simples</ArticleTd>
            <ArticleTd>Suele alcanzar</ArticleTd>
            <ArticleTd>Opcional</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Typo tolerance fuerte y ranking avanzado</ArticleTd>
            <ArticleTd>Limitado</ArticleTd>
            <ArticleTd>Recomendado</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Facetas complejas y busqueda multilenguaje masiva</ArticleTd>
            <ArticleTd>Puede sufrir</ArticleTd>
            <ArticleTd>Recomendado</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Cuando la busqueda crece en complejidad, herramientas como{" "}
        <TermLink href={ELASTIC_URL}>Elasticsearch</TermLink>,{" "}
        <TermLink href={OPENSEARCH_URL}>OpenSearch</TermLink> o{" "}
        <TermLink href={MEILI_URL}>Meilisearch</TermLink> suelen encajar mejor.
        El costo es operacion extra y pipeline dedicado de indexacion.
      </ArticleP>

      <ArticleP>
        Empieza con FTS nativo mientras cumpla calidad y latencia. Migra cuando
        la busqueda se convierta en un subsistema propio del producto.
      </ArticleP>

      <ArticleH2>9. Como elegir en produccion</ArticleH2>

      <ArticleTable caption="Resumen de decision para busqueda textual">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Escenario</ArticleTh>
            <ArticleTh>Eleccion sugerida</ArticleTh>
            <ArticleTh>Motivo</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Filtro simple y volumen bajo</ArticleTd>
            <ArticleTd>LIKE</ArticleTd>
            <ArticleTd>Baja complejidad, sin ranking exigente</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Busqueda de catalogo en MySQL</ArticleTd>
            <ArticleTd>MySQL Full Text Search</ArticleTd>
            <ArticleTd>Mejor relevancia sin migrar de base</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Busqueda con requisitos linguisticos fuertes</ArticleTd>
            <ArticleTd>PostgreSQL Full Text Search</ArticleTd>
            <ArticleTd>Mayor control de idioma y ranking</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH3>Puntos clave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>LIKE</ArticleCode> es operador de substring, no motor de
          busqueda inteligente.
        </ArticleLi>
        <ArticleLi>
          Full text mejora relevancia y performance al mismo tiempo.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink> acelera la salida de
          LIKE con <ArticleCode>MATCH AGAINST</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink> entrega capa
          linguistica mas avanzada.
        </ArticleLi>
        <ArticleLi>
          Valida cada decision con{" "}
          <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink> en datos
          reales.
        </ArticleLi>
        <ArticleLi>
          Este articulo documenta el{" "}
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            video original
          </a>{" "}
          como referencia escrita.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusión</ArticleH3>

      <ArticleP>
        La busqueda inteligente no depende de hacks de consulta. Depende de
        elegir el modelo correcto para el problema del producto.
      </ArticleP>

      <ArticleP>
        Cuando la busqueda impacta conversion o descubrimiento, salir de{" "}
        <ArticleCode>LIKE</ArticleCode> deja de ser opcion. El camino practico es
        usar full text nativo, medir planes de ejecucion y ajustar relevancia con
        feedback real.
      </ArticleP>
    </>
  );
}
