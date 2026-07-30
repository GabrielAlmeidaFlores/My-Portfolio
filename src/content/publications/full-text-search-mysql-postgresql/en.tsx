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
  User["User types search"]
  Api["API builds query"]
  Like["LIKE with wildcard"]
  SeqScan["Full table scan"]
  BadRel["Low relevance"]
  BadPerf["Cost grows with traffic"]

  User --> Api
  Api --> Like
  Like --> SeqScan
  SeqScan --> BadRel
  SeqScan --> BadPerf`;

const FTS_CHART = `flowchart TB
  Source["Name + description"]
  Token["Tokenization"]
  Inverted["Inverted index"]
  Query["Search term"]
  Rank["Relevance ranking"]
  Result["Better and faster results"]

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

export function FullTextSearchMysqlPostgresqlContentEn() {
  return (
    <>
      <ArticleH2>1. Context and credits</ArticleH2>

      <ArticleP>
        This article is a practical guide to intelligent search in relational
        databases with <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink> and{" "}
        <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>.
      </ArticleP>

      <ArticleP>
        This post is technical documentation for the video{" "}
        <a
          href={VIDEO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          O QUE NINGUEM TE ENSINOU SOBRE BUSCAS INTELIGENTES NO BANCO DE DADOS
        </a>
        . The structure, examples, and conceptual flow come from that lesson.
      </ArticleP>

      <ArticleCallout variant="note" title="Source credit">
        <ArticleP>
          Main source:{" "}
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            original YouTube video
          </a>
          . This post reorganizes the content into a reference format for daily
          implementation work.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        The focus is direct: when <ArticleCode>LIKE</ArticleCode> breaks, how{" "}
        <TermLink href={MYSQL_FTS_URL}>Full Text Search</TermLink> improves
        relevance and performance, and what changes between{" "}
        <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink> and{" "}
        <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>.
      </ArticleP>

      <ArticleH2>2. Why LIKE fails for real search</ArticleH2>

      <ArticleP>
        <ArticleCode>LIKE</ArticleCode> with wildcard is fine for simple
        substring filters. It fails when search quality becomes a product
        requirement.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Weak relevance: <ArticleCode>LIKE</ArticleCode> matches characters, not
          intent. Example: a search for "bluetooth headset" can return rows just
          because "bluetooth" and "headset" appear somewhere, even when they are
          not the product the user wants.
        </ArticleLi>
        <ArticleLi>
          False positives: a substring inside another word still counts as a
          match. Example: searching "ring" can return unrelated products whose
          names only contain that character sequence.
        </ArticleLi>
        <ArticleLi>
          Fragile multi-word behavior: order, plural, and language variations
          break easily. Example: "bluetooth headsets" can miss catalog rows
          stored as "bluetooth headset" in the singular.
        </ArticleLi>
        <ArticleLi>
          High cost: the database scans row by row to find matches. Example: on a
          1 million product table, each{" "}
          <ArticleCode>LIKE '%term%'</ArticleCode> search often reads the whole
          table.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        This directly hurts user experience and infrastructure cost. Under
        concurrency, read volume rises quickly.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="LIKE flow leads to full scan and poor relevance"
        chart={WHY_CHART}
      />

      <ArticleH3>Execution plan signal</ArticleH3>

      <ArticleP>
        In <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink>,{" "}
        <ArticleCode>LIKE '%term%'</ArticleCode> often appears with broad table
        scanning.
      </ArticleP>

      <ArticleCode block>
        {`EXPLAIN ANALYZE
SELECT id, name
FROM products
WHERE name LIKE '%ring%';`}
      </ArticleCode>

      <ArticleH2>3. Full Text Search in MySQL</ArticleH2>

      <ArticleP>
        In <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink>, the basic path is a{" "}
        <ArticleCode>FULLTEXT</ArticleCode> index plus{" "}
        <ArticleCode>MATCH ... AGAINST</ArticleCode>.
      </ArticleP>

      <ArticleCode block>
        {`CREATE FULLTEXT INDEX search_idx
ON products (name, description);

SELECT id, name, description
FROM products
WHERE MATCH(name, description) AGAINST('bluetooth headset' IN NATURAL LANGUAGE MODE);`}
      </ArticleCode>

      <ArticleP>
        This usually improves top-result relevance and reduces query cost.
      </ArticleP>

      <ArticleH3>MySQL tradeoffs</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Fast upgrade path away from <ArticleCode>LIKE</ArticleCode>: with
          little code you improve relevance and reduce full-table scans.
        </ArticleLi>
        <ArticleLi>
          Native ranking helps catalog and content search. Example: products
          whose title matches the query rise above items that only mention the
          term deep in a long description.
        </ArticleLi>
        <ArticleLi>
          Language-level controls are more limited than{" "}
          <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>. Example:
          domain synonyms such as "headset" = "earphone" usually need more
          manual work in MySQL.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>4. Full Text Search in PostgreSQL</ArticleH2>

      <ArticleP>
        <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink> offers a richer
        stack with <ArticleCode>to_tsvector</ArticleCode>,{" "}
        <ArticleCode>to_tsquery</ArticleCode>, and{" "}
        <TermLink href={POSTGRES_GIN_URL}>GIN</TermLink> indexes.
      </ArticleP>

      <ArticleCode block>
        {`CREATE INDEX products_search_idx
ON products
USING GIN (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

SELECT id, name, description
FROM products
WHERE to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
@@ to_tsquery('english', 'ring & silver');`}
      </ArticleCode>

      <ArticleH3>Why PostgreSQL can go deeper</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Better language support and normalization. Example: using the{" "}
          <ArticleCode>english</ArticleCode> dictionary handles plurals and word
          forms with less application-side logic.
        </ArticleLi>
        <ArticleLi>
          Stemming and lexicons give more ranking control. Example: "developer"
          and "developing" can collapse to a shared root and improve recall
          without <ArticleCode>LIKE</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Advanced dictionary configuration, including synonyms, supports
          domain tuning. Example: mapping "headset" and "earphone" to the same
          catalog concept.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>5. What happens internally</ArticleH2>

      <ArticleP>
        Full text search works by transforming raw text into searchable terms and
        mapping where those terms appear.
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          Tokenization splits text into useful units. Example: "Pro Bluetooth
          Headset" becomes terms such as "pro", "bluetooth", and "headset".
        </ArticleLi>
        <ArticleLi>
          Stop words are removed from ranking logic. Example: words like "the"
          and "a" stop competing with terms that actually discriminate results.
        </ArticleLi>
        <ArticleLi>
          An inverted index maps each term to the documents that contain it.
          Example: "bluetooth" points to the product IDs where that word appears.
        </ArticleLi>
        <ArticleLi>
          The engine ranks results by relevance. Example: a title with
          "bluetooth headset" ranks above a description that only mentions
          "bluetooth" once in the middle of a long paragraph.
        </ArticleLi>
      </ArticleOl>

      <ArticleMermaid
        ariaLabel="Full text pipeline with tokenization and inverted index"
        chart={FTS_CHART}
      />

      <ArticleH3>Lexeme behavior in PostgreSQL</ArticleH3>

      <ArticleP>
        In <TermLink href={POSTGRES_TEXTSEARCH_URL}>PostgreSQL text search</TermLink>,
        related word forms can collapse into a common lexical root.
      </ArticleP>

      <ArticleCode block>
        {`SELECT to_tsvector('english', 'developer developing development developers');`}
      </ArticleCode>

      <ArticleH2>6. Search quality in production</ArticleH2>

      <ArticleP>
        After basic FTS works, final quality depends on query modeling and ranking
        strategy.
      </ArticleP>

      <ArticleH3>Query modes that reduce noise</ArticleH3>

      <ArticleP>
        Not every search should treat user terms the same way. The query mode
        decides how strictly the database requires word proximity and how much
        input variation it tolerates.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Phrase search: the user wants the terms together and in order. Example:
          "silver ring" should prioritize that exact expression, not a gold ring
          that only mentions "silver" in another field.
        </ArticleLi>
        <ArticleLi>
          Prefix search: the user is still typing. Example: "blue tooth hea"
          should complete toward "bluetooth headset" in autocomplete without
          requiring the full word.
        </ArticleLi>
        <ArticleLi>
          Tolerant multi-term search: the user types several words in any order.
          Example: "ring silver" and "silver ring" should return the same
          relevant set, without requiring exact phrase order.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        In <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>, these modes
        usually cover most products:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>plainto_tsquery</ArticleCode>: takes free-form user text
          and builds a safe query without requiring operator syntax.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>to_tsquery</ArticleCode>: supports explicit operators such
          as <ArticleCode>&</ArticleCode>, <ArticleCode>|</ArticleCode>, and{" "}
          <ArticleCode>!</ArticleCode> when the application controls the query.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>websearch_to_tsquery</ArticleCode>: accepts web-like syntax
          (quotes, <ArticleCode>-</ArticleCode>, <ArticleCode>or</ArticleCode>),
          useful for a product search box.
        </ArticleLi>
      </ArticleUl>

      <ArticleCode block>
        {`SELECT id, name,
  ts_rank_cd(
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B'),
    websearch_to_tsquery('english', 'silver ring')
  ) AS score
FROM products
WHERE (
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B')
) @@ websearch_to_tsquery('english', 'silver ring')
ORDER BY score DESC, id DESC
LIMIT 20 OFFSET 0;`}
      </ArticleCode>

      <ArticleP>
        <TermLink href={POSTGRES_RANK_URL}>ts_rank_cd</TermLink> plus field
        weights fixes a common ranking issue: title should rank above long
        description when both match.
      </ArticleP>

      <ArticleH3>Accent, case, and typo behavior</ArticleH3>

      <ArticleP>
        Real users do not type normalized strings. For multilingual products,
        accent and case normalization should be explicit in indexing and query
        layers. In PostgreSQL, <TermLink href={POSTGRES_UNACCENT_URL}>unaccent</TermLink>{" "}
        is often part of this setup.
      </ArticleP>

      <ArticleP>
        Aggressive typo tolerance is still limited in native FTS. If typo
        tolerance is a top-level requirement, architecture should reflect it as a
        first-class decision.
      </ArticleP>

      <ArticleH2>7. Operations and reliable benchmarking</ArticleH2>

      <ArticleP>
        Benchmark numbers only matter when the comparison is fair. Cold vs warm
        cache comparisons and mismatched plans create misleading conclusions.
      </ArticleP>

      <ArticleH3>Measurement checklist</ArticleH3>

      <ArticleOl>
        <ArticleLi>
          Lock dataset size and concurrency profile. Example: measure with the
          same product volume and the same number of concurrent searches.
        </ArticleLi>
        <ArticleLi>
          Compare <ArticleCode>LIKE</ArticleCode> and FTS in the same
          environment, with equivalent cache and hardware.
        </ArticleLi>
        <ArticleLi>
          Track p50 and p95 latency, not one isolated run. A single warm query
          hides behavior under load.
        </ArticleLi>
        <ArticleLi>
          Validate plans with{" "}
          <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink> to confirm
          the full text index is actually used.
        </ArticleLi>
      </ArticleOl>

      <ArticleH3>Operational costs to account for</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Full text indexes improve reads but increase write/update cost.
          Example: every change to <ArticleCode>description</ArticleCode> also
          updates the search index.
        </ArticleLi>
        <ArticleLi>
          Reindex and index maintenance need explicit operational windows. On a
          large table, rebuilding a full text index can block writes if done
          carelessly.
        </ArticleLi>
        <ArticleLi>
          Score pagination needs deterministic tie-break ordering. Example:
          order by <ArticleCode>score DESC, id DESC</ArticleCode> to avoid pages
          that skip or repeat rows when scores collide.
        </ArticleLi>
        <ArticleLi>
          Query length and token limits protect your search endpoints. Example:
          reject searches with thousands of characters or dozens of useless
          tokens.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Implementation safety">
        <ArticleP>
          Never concatenate raw user search strings into SQL. Use parameterized
          queries and sanitize input to reduce injection and abuse risk.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>8. When native FTS is enough and when to move</ArticleH2>

      <ArticleTable caption="Architectural decision guide for search stack">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Scenario</ArticleTh>
            <ArticleTh>Native FTS</ArticleTh>
            <ArticleTh>Dedicated engine</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Mid-size catalog and simple filters</ArticleTd>
            <ArticleTd>Usually enough</ArticleTd>
            <ArticleTd>Optional</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Heavy typo tolerance and advanced ranking</ArticleTd>
            <ArticleTd>Limited</ArticleTd>
            <ArticleTd>Recommended</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Complex facets and large multilingual search</ArticleTd>
            <ArticleTd>Can struggle</ArticleTd>
            <ArticleTd>Recommended</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        When search requirements become broader, tools like{" "}
        <TermLink href={ELASTIC_URL}>Elasticsearch</TermLink>,{" "}
        <TermLink href={OPENSEARCH_URL}>OpenSearch</TermLink>, or{" "}
        <TermLink href={MEILI_URL}>Meilisearch</TermLink> are often clearer fits.
        The tradeoff is operational overhead and dedicated indexing pipelines.
      </ArticleP>

      <ArticleP>
        Start with native FTS while it meets relevance and latency goals. Move
        when search itself becomes a dedicated product subsystem.
      </ArticleP>

      <ArticleH2>9. Decision guide for production</ArticleH2>

      <ArticleTable caption="Decision summary for text search">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Scenario</ArticleTh>
            <ArticleTh>Suggested choice</ArticleTh>
            <ArticleTh>Reason</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Simple filter, low volume</ArticleTd>
            <ArticleTd>LIKE</ArticleTd>
            <ArticleTd>Low complexity, no ranking requirement</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Catalog search on MySQL stack</ArticleTd>
            <ArticleTd>MySQL Full Text Search</ArticleTd>
            <ArticleTd>Better relevance and lower cost without DB migration</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Language-heavy search requirements</ArticleTd>
            <ArticleTd>PostgreSQL Full Text Search</ArticleTd>
            <ArticleTd>More linguistic and ranking controls</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH3>Key takeaways</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>LIKE</ArticleCode> is a substring operator, not an
          intelligent search engine.
        </ArticleLi>
        <ArticleLi>
          Full text addresses both relevance and performance.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink> gives a quick upgrade
          path with <ArticleCode>MATCH AGAINST</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink> offers deeper
          language and ranking controls.
        </ArticleLi>
        <ArticleLi>
          Validate every decision with{" "}
          <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink> using
          real data volume.
        </ArticleLi>
        <ArticleLi>
          This article documents the{" "}
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            original video
          </a>{" "}
          in written reference form.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusion</ArticleH3>

      <ArticleP>
        Intelligent search is not about query tricks. It is about choosing the
        right retrieval model for your product context.
      </ArticleP>

      <ArticleP>
        As soon as search quality impacts conversion, content discovery, or user
        support, move beyond <ArticleCode>LIKE</ArticleCode>. Use native full text
        capabilities in your current database, measure execution plans, and tune
        ranking with production feedback.
      </ArticleP>
    </>
  );
}
