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
  User["Usuario escribe búsqueda"]
  Api["API arma consulta"]
  Like["LIKE con wildcard"]
  SeqScan["Escaneo completo"]
  BadRel["Baja relevancia"]
  BadPerf["Costo crece con tráfico"]

  User --> Api
  Api --> Like
  Like --> SeqScan
  SeqScan --> BadRel
  SeqScan --> BadPerf`;

const FTS_CHART = `flowchart TB
  Source["Nombre + descripción"]
  Token["Tokenización"]
  Inverted["Índice invertido"]
  Query["Término buscado"]
  Rank["Ranking por relevancia"]
  Result["Resultados mejores y más rápidos"]

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
      <ArticleH2>1. Contexto y créditos</ArticleH2>

      <ArticleP>
        Este artículo es una guía práctica sobre búsqueda inteligente en bases
        relacionales con <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink> y{" "}
        <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>.
      </ArticleP>

      <ArticleP>
        Este post funciona como documentación técnica del video{" "}
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

      <ArticleCallout variant="note" title="Crédito de la fuente">
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
          . Aquí se reorganiza el material en formato de referencia para aplicar
          en proyectos reales.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        El foco es directo: cuando <ArticleCode>LIKE</ArticleCode> falla, qué es{" "}
        <TermLink href={MYSQL_FTS_URL}>Full Text Search</TermLink>, cómo el
        mecanismo mejora relevancia y performance, y qué cambia entre{" "}
        <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink> y{" "}
        <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>.
      </ArticleP>

      <ArticleP>
        El orden del post es deliberado: primero el problema de{" "}
        <ArticleCode>LIKE</ArticleCode>, después el concepto de Full Text Search,
        luego la implementación en cada base, y solo entonces operación,
        calidad y decisión de arquitectura.
      </ArticleP>

      <ArticleH2>2. Por qué LIKE falla en búsqueda real</ArticleH2>

      <ArticleP>
        <ArticleCode>LIKE</ArticleCode> con wildcard sirve para filtros por
        substring. Falla cuando necesitas relevancia de verdad para usuarios.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Baja relevancia: <ArticleCode>LIKE</ArticleCode> compara caracteres, no
          intención. Ejemplo: quien busca "auricular bluetooth" puede recibir
          filas solo porque aparecen "auricular" y "bluetooth" en algún lugar,
          aunque no sean el producto deseado.
        </ArticleLi>
        <ArticleLi>
          Muchos falsos positivos: un substring dentro de otra palabra cuenta
          como match. Ejemplo: buscar "aro" puede traer "barro"; buscar "sol"
          puede traer "consola".
        </ArticleLi>
        <ArticleLi>
          Búsqueda compuesta frágil: orden, plural y variaciones de lenguaje se
          rompen con facilidad. Ejemplo: "auriculares bluetooth" puede fallar si
          el catálogo guarda "auricular bluetooth" en singular.
        </ArticleLi>
        <ArticleLi>
          Costo alto: el banco escanea fila por fila para encontrar matches.
          Ejemplo: en una tabla de 1 millón de productos, cada{" "}
          <ArticleCode>LIKE '%término%'</ArticleCode> suele leer la tabla
          entera.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        El impacto es directo en experiencia de usuario y costo operativo. Bajo
        concurrencia, el volumen de lectura crece rápido.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Flujo con LIKE termina en escaneo completo y baja relevancia"
        chart={WHY_CHART}
      />

      <ArticleH3>Señal en el plan de ejecución</ArticleH3>

      <ArticleP>
        En <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink>,{" "}
        <ArticleCode>LIKE '%término%'</ArticleCode> suele mostrar lectura amplia
        de tabla.
      </ArticleP>

      <ArticleCode block>
        {`EXPLAIN ANALYZE
SELECT id, name
FROM products
WHERE name LIKE '%anillo%';`}
      </ArticleCode>

      <ArticleP>
        Cuando esto corre en una tabla grande y bajo concurrencia, la consulta
        se vuelve un cuello de botella previsible.
      </ArticleP>

      <ArticleH2>3. Qué es Full Text Search</ArticleH2>

      <ArticleP>
        <TermLink href={MYSQL_FTS_URL}>Full Text Search</TermLink> (FTS) es el
        mecanismo nativo de la base relacional para buscar texto por términos y
        relevancia, no por coincidencia ciega de caracteres.
      </ArticleP>

      <ArticleP>
        En lenguaje simple: en lugar de preguntar "¿esta string contiene estos
        caracteres?", la base pregunta "¿qué registros hablan de estos términos
        y cuáles combinan mejor con la búsqueda?".
      </ArticleP>

      <ArticleP>
        Ejemplo: en la búsqueda "auricular bluetooth", el FTS trata "auricular" y
        "bluetooth" como términos buscables, encuentra productos relacionados y
        puede ordenar el resultado según cuánto cada registro combina con la
        intención del usuario.
      </ArticleP>

      <ArticleP>
        Qué cambia en la práctica frente a <ArticleCode>LIKE</ArticleCode>:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Índice textual dedicado: la base prepara los términos con
          anticipación. Ejemplo: en lugar de escanear 1 millón de filas en cada
          búsqueda, consulta un índice que ya sabe dónde aparece "bluetooth".
        </ArticleLi>
        <ArticleLi>
          Relevancia: el resultado puede ordenarse por score, no solo por
          "coincidió o no". Ejemplo: un título "Auricular Bluetooth Pro" sube
          antes que una descripción que solo cita "bluetooth" en medio del
          texto.
        </ArticleLi>
        <ArticleLi>
          Apoyo lingüístico: stemming (reducir variaciones a la raíz de la
          palabra), stop words (ignorar palabras poco discriminantes como "de" y
          "la") y diccionarios ayudan con plural y variaciones. Ejemplo:
          "auriculares" y "auricular" pueden tratarse como el mismo concepto,
          algo que <ArticleCode>LIKE</ArticleCode> no hace solo.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        El modelo mental del FTS tiene tres pasos:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          Indexar: transformar campos como nombre y descripción en términos
          buscables.
        </ArticleLi>
        <ArticleLi>
          Consultar: transformar el texto del usuario en una query de términos.
        </ArticleLi>
        <ArticleLi>
          Ranquear: devolver primero los registros que mejor combinan con la
          búsqueda.
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        En las siguientes secciones, la implementación en{" "}
        <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink> y{" "}
        <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>. Después, qué
        pasa por debajo: tokenización, índice invertido y ranking.
      </ArticleP>

      <ArticleH2>4. Full Text Search en MySQL</ArticleH2>

      <ArticleP>
        En <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink>, el camino base es
        índice <ArticleCode>FULLTEXT</ArticleCode> y consulta{" "}
        <ArticleCode>MATCH ... AGAINST</ArticleCode>.
      </ArticleP>

      <ArticleP>
        Flujo mínimo:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          Crear índice full text en las columnas que el usuario realmente busca
          (por ejemplo <ArticleCode>name</ArticleCode> y{" "}
          <ArticleCode>description</ArticleCode>).
        </ArticleLi>
        <ArticleLi>
          Cambiar <ArticleCode>LIKE</ArticleCode> por{" "}
          <ArticleCode>MATCH ... AGAINST</ArticleCode> en la query de búsqueda.
        </ArticleLi>
        <ArticleLi>
          Validar relevancia y costo con{" "}
          <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink> antes de
          publicar.
        </ArticleLi>
      </ArticleOl>

      <ArticleCode block>
        {`CREATE FULLTEXT INDEX search_idx
ON products (name, description);

SELECT id, name, description
FROM products
WHERE MATCH(name, description) AGAINST('auricular bluetooth' IN NATURAL LANGUAGE MODE);`}
      </ArticleCode>

      <ArticleP>
        La ganancia típica es doble: mejores resultados arriba y menor costo de
        lectura en la base.
      </ArticleP>

      <ArticleH3>Tradeoffs en MySQL</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Buena salida de <ArticleCode>LIKE</ArticleCode>: con poco código ya
          mejoras relevancia y reduces el escaneo completo.
        </ArticleLi>
        <ArticleLi>
          Ranking nativo útil para catálogo y contenido. Ejemplo: productos cuyo
          título coincide con la búsqueda suben antes que ítems que solo citan el
          término en una descripción larga.
        </ArticleLi>
        <ArticleLi>
          Menos control lingüístico que{" "}
          <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>. Ejemplo:
          sinónimos de dominio ("auricular" = "headset") suelen exigir más
          trabajo manual en MySQL.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>5. Full Text Search en PostgreSQL</ArticleH2>

      <ArticleP>
        <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink> ofrece una capa
        más avanzada con <ArticleCode>to_tsvector</ArticleCode>,{" "}
        <ArticleCode>to_tsquery</ArticleCode> e índice{" "}
        <TermLink href={POSTGRES_GIN_URL}>GIN</TermLink>. GIN es un tipo de índice
        pensado para valores con muchos componentes, como las listas de términos
        del full text search.
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

      <ArticleP>
        Con esto, la base usa un índice textual para recuperar candidatos y
        ranquearlos con mucho menos costo que escanear la tabla entera.
      </ArticleP>

      <ArticleH3>Por qué PostgreSQL suele ser más flexible</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Mejor soporte de idioma y normalización. Ejemplo: usar el diccionario{" "}
          <ArticleCode>spanish</ArticleCode> trata plural y variaciones con menos
          lógica en la aplicación.
        </ArticleLi>
        <ArticleLi>
          Stemming y léxicos dan más control de ranking. Ejemplo: "programador" y
          "programando" pueden caer en la misma raíz y subir el recall sin{" "}
          <ArticleCode>LIKE</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Configuración avanzada de diccionarios y sinónimos por dominio.
          Ejemplo: mapear "auricular" y "headset" al mismo concepto del
          catálogo.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>6. Qué pasa por debajo</ArticleH2>

      <ArticleP>
        El motor de búsqueda textual sigue un pipeline simple y potente.
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          Tokenización: parte el texto en unidades útiles. Ejemplo: "Auricular
          Bluetooth Pro" se convierte en términos como "auricular", "bluetooth" y
          "pro".
        </ArticleLi>
        <ArticleLi>
          Eliminación de stop words: quita palabras con poco valor para ranking.
          Ejemplo: "de", "la", "el" dejan de competir con términos que de verdad
          discriminan el resultado.
        </ArticleLi>
        <ArticleLi>
          Índice invertido: mapea cada término a la lista de documentos donde
          aparece. Ejemplo: "bluetooth" apunta a los IDs de productos que
          contienen esa palabra.
        </ArticleLi>
        <ArticleLi>
          Ranking: ordena por proximidad y frecuencia de los términos buscados.
          Ejemplo: un título con "auricular bluetooth" sube por encima de una
          descripción que solo cita "bluetooth" una vez.
        </ArticleLi>
      </ArticleOl>

      <ArticleMermaid
        ariaLabel="Pipeline de full text con tokenización e índice invertido"
        chart={FTS_CHART}
      />

      <ArticleH3>Lexema en PostgreSQL</ArticleH3>

      <ArticleP>
        En <TermLink href={POSTGRES_TEXTSEARCH_URL}>PostgreSQL text search</TermLink>,
        formas relacionadas de una palabra pueden caer en una misma raíz lexical.
      </ArticleP>

      <ArticleCode block>
        {`SELECT to_tsvector('spanish', 'programador programando programacion programadores');`}
      </ArticleCode>

      <ArticleH2>7. Calidad de búsqueda en producción</ArticleH2>

      <ArticleP>
        Cuando el FTS base ya funciona, la calidad final depende de cómo armas la
        query y de cómo ordenas por relevancia.
      </ArticleP>

      <ArticleH3>Modos de consulta que reducen ruido</ArticleH3>

      <ArticleP>
        No toda búsqueda debe tratar los términos del usuario de la misma forma.
        El modo de consulta define cuánto exige el banco de proximidad entre
        palabras y cuánto tolera variación de entrada.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Búsqueda por frase: el usuario quiere los términos juntos y en orden.
          Ejemplo: "anillo de plata" debe priorizar ese producto, no un anillo
          de oro que solo menciona "plata" en otro campo.
        </ArticleLi>
        <ArticleLi>
          Búsqueda por prefijo: el usuario todavía está escribiendo. Ejemplo:
          "auri blu" debe completar hacia "auricular bluetooth" en autocomplete,
          sin exigir la palabra completa.
        </ArticleLi>
        <ArticleLi>
          Búsqueda compuesta tolerante: el usuario escribe varios términos en
          cualquier orden. Ejemplo: "plata anillo" y "anillo plata" deben
          devolver el mismo conjunto relevante, sin exigir el orden exacto de la
          frase.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        En <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>, estas
        funciones suelen cubrir la mayoria de casos:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>plainto_tsquery</ArticleCode>: recibe texto libre del
          usuario y arma la consulta con seguridad, sin exigir sintaxis de
          operadores.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>to_tsquery</ArticleCode>: permite operadores explícitos
          como <ArticleCode>&</ArticleCode>, <ArticleCode>|</ArticleCode> y{" "}
          <ArticleCode>!</ArticleCode> cuando la aplicación controla la query.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>websearch_to_tsquery</ArticleCode>: acepta sintaxis estilo
          buscador (comillas, <ArticleCode>-</ArticleCode>,{" "}
          <ArticleCode>or</ArticleCode>), útil para el campo de búsqueda del
          producto.
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
        campo corrige un problema típico: el nombre debe pesar más que una
        descripción larga.
      </ArticleP>

      <ArticleH3>Acento, mayúsculas y typo</ArticleH3>

      <ArticleP>
        El usuario real no escribe texto normalizado. En escenarios multilenguaje,
        conviene normalizar acentos y caja en indexación y consulta. En
        PostgreSQL, <TermLink href={POSTGRES_UNACCENT_URL}>unaccent</TermLink>{" "}
        suele formar parte de la solución.
      </ArticleP>

      <ArticleP>
        Tolerancia fuerte a typo no es el punto más fuerte del FTS nativo. Si ese
        requisito es central, la decisión de arquitectura cambia.
      </ArticleP>

      <ArticleH2>8. Operación y benchmark confiable</ArticleH2>

      <ArticleP>
        Un benchmark solo sirve si comparas en condiciones equivalentes. Medir
        cache fría contra cache caliente da conclusiones engañosas.
      </ArticleP>

      <ArticleH3>Checklist de medición</ArticleH3>

      <ArticleOl>
        <ArticleLi>
          Fijar tamaño de dataset y concurrencia. Ejemplo: medir con el mismo
          volumen de productos y el mismo número de búsquedas simultaneas.
        </ArticleLi>
        <ArticleLi>
          Comparar <ArticleCode>LIKE</ArticleCode> y FTS en el mismo entorno, con
          cache y hardware equivalentes.
        </ArticleLi>
        <ArticleLi>
          Medir p50 y p95, no una sola corrida. Una query aislada "caliente"
          esconde el comportamiento bajo carga.
        </ArticleLi>
        <ArticleLi>
          Revisar plan con{" "}
          <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink> para
          confirmar que el índice full text se usa de verdad.
        </ArticleLi>
      </ArticleOl>

      <ArticleH3>Costos operativos que debes asumir</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Índice full text acelera lectura, pero aumenta costo de escritura.
          Ejemplo: cada cambio en <ArticleCode>description</ArticleCode> también
          actualiza el índice de búsqueda.
        </ArticleLi>
        <ArticleLi>
          Reindex y mantenimiento de índice requieren ventana operativa. En
          tablas grandes, reconstruir el índice puede bloquear escrituras si se
          hace sin cuidado.
        </ArticleLi>
        <ArticleLi>
          Paginación por score necesita desempate estable. Ejemplo: ordenar por{" "}
          <ArticleCode>score DESC, id DESC</ArticleCode> evita páginas que saltan
          o repiten filas cuando varios scores empatan.
        </ArticleLi>
        <ArticleLi>
          Limitar tamaño de query protege endpoints de búsqueda. Ejemplo:
          bloquear búsquedas con miles de caracteres o docenas de tokens
          inútiles.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Seguridad de implementación">
        <ArticleP>
          No concatenes texto de usuario directo en SQL. Usa queries
          parametrizadas y validación de entrada para reducir riesgo de inyección.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>9. Cuando FTS nativo alcanza y cuando migrar</ArticleH2>

      <ArticleTable caption="Decisión arquitectónica para stack de búsqueda">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Escenario</ArticleTh>
            <ArticleTh>FTS nativo</ArticleTh>
            <ArticleTh>Engine dedicada</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Catálogo medio con filtros simples</ArticleTd>
            <ArticleTd>Suele alcanzar</ArticleTd>
            <ArticleTd>Opcional</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Typo tolerance fuerte y ranking avanzado</ArticleTd>
            <ArticleTd>Limitado</ArticleTd>
            <ArticleTd>Recomendado</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Facetas complejas y búsqueda multilenguaje masiva</ArticleTd>
            <ArticleTd>Puede sufrir</ArticleTd>
            <ArticleTd>Recomendado</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Cuando la búsqueda crece en complejidad, herramientas como{" "}
        <TermLink href={ELASTIC_URL}>Elasticsearch</TermLink>,{" "}
        <TermLink href={OPENSEARCH_URL}>OpenSearch</TermLink> o{" "}
        <TermLink href={MEILI_URL}>Meilisearch</TermLink> suelen encajar mejor.
        El costo es operación extra y pipeline dedicado de indexación.
      </ArticleP>

      <ArticleP>
        Empieza con FTS nativo mientras cumpla calidad y latencia. Migra cuando
        la búsqueda se convierta en un subsistema propio del producto.
      </ArticleP>

      <ArticleH2>10. Cómo elegir en producción</ArticleH2>

      <ArticleTable caption="Resumen de decisión para búsqueda textual">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Escenario</ArticleTh>
            <ArticleTh>Elección sugerida</ArticleTh>
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
            <ArticleTd>Búsqueda de catálogo en MySQL</ArticleTd>
            <ArticleTd>MySQL Full Text Search</ArticleTd>
            <ArticleTd>Mejor relevancia sin migrar de base</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Búsqueda con requisitos lingüísticos fuertes</ArticleTd>
            <ArticleTd>PostgreSQL Full Text Search</ArticleTd>
            <ArticleTd>Mayor control de idioma y ranking</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH3>Puntos clave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>LIKE</ArticleCode> es operador de substring, no motor de
          búsqueda inteligente.
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
          lingüística más avanzada.
        </ArticleLi>
        <ArticleLi>
          Valida cada decisión con{" "}
          <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink> en datos
          reales.
        </ArticleLi>
        <ArticleLi>
          Este artículo documenta el{" "}
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
        La búsqueda inteligente no depende de hacks de consulta. Depende de
        elegir el modelo correcto para el problema del producto.
      </ArticleP>

      <ArticleP>
        Cuando la búsqueda impacta conversión o descubrimiento, salir de{" "}
        <ArticleCode>LIKE</ArticleCode> deja de ser opción. El camino práctico es
        usar full text nativo, medir planes de ejecución y ajustar relevancia con
        feedback real.
      </ArticleP>
    </>
  );
}
