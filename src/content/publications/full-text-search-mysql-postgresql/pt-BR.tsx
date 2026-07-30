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
  User["Usuario digita busca"]
  Api["API monta consulta"]
  Like["LIKE com wildcard"]
  SeqScan["Escaneamento completo"]
  BadRel["Baixa relevancia"]
  BadPerf["Custo cresce com volume"]

  User --> Api
  Api --> Like
  Like --> SeqScan
  SeqScan --> BadRel
  SeqScan --> BadPerf`;

const FTS_CHART = `flowchart TB
  Source["Nome + descricao"]
  Token["Tokenizacao"]
  Inverted["Indice invertido"]
  Query["Termo da busca"]
  Rank["Ranqueamento por relevancia"]
  Result["Resultados melhores e mais rapidos"]

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

export function FullTextSearchMysqlPostgresqlContentPt() {
  return (
    <>
      <ArticleH2>1. Contexto e créditos</ArticleH2>

      <ArticleP>
        Este artigo é um guia prático sobre busca inteligente em banco relacional
        com <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink> e{" "}
        <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>.
      </ArticleP>

      <ArticleP>
        O texto serve como documentação técnica do vídeo{" "}
        <a
          href={VIDEO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          O QUE NINGUEM TE ENSINOU SOBRE BUSCAS INTELIGENTES NO BANCO DE DADOS
        </a>
        . A base de conteúdo, os exemplos e a sequência conceitual vêm dessa aula.
      </ArticleP>

      <ArticleCallout variant="note" title="Credito da fonte">
        <ArticleP>
          Fonte principal:{" "}
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            video original no YouTube
          </a>
          . Este post reorganiza o material em formato de referência rápida para
          consulta durante implementação.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Aqui o foco é objetivo: quando <ArticleCode>LIKE</ArticleCode> quebra,
        como <TermLink href={MYSQL_FTS_URL}>Full Text Search</TermLink> corrige
        relevância e performance, e o que muda entre{" "}
        <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink> e{" "}
        <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>.
      </ArticleP>

      <ArticleH2>2. Por que LIKE falha em busca de produto e texto</ArticleH2>

      <ArticleP>
        <ArticleCode>LIKE</ArticleCode> com wildcard resolve filtros simples por
        substring. O problema aparece quando você precisa de busca semântica no
        dia a dia do produto.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Relevância ruim: encontra caracteres, não intenção de busca.
        </ArticleLi>
        <ArticleLi>
          Muitos falsos positivos: "anel" traz "panela", "capa" traz "capacete".
        </ArticleLi>
        <ArticleLi>
          Busca composta frágil: ordem, plural e variações linguísticas quebram
          com facilidade.
        </ArticleLi>
        <ArticleLi>
          Custo alto: o banco varre linha por linha para achar matches.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        O impacto é direto na experiência do usuário e no custo de banco. Em
        cenários concorrentes, o volume de leitura cresce rapidamente.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Fluxo com LIKE gera escaneamento completo e baixa relevancia"
        chart={WHY_CHART}
      />

      <ArticleH3>Sinal técnico no plano de execução</ArticleH3>

      <ArticleP>
        Em <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink>, o
        padrão de <ArticleCode>LIKE '%termo%'</ArticleCode> costuma aparecer com
        escaneamento amplo de tabela.
      </ArticleP>

      <ArticleCode block>
        {`EXPLAIN ANALYZE
SELECT id, name
FROM products
WHERE name LIKE '%anel%';`}
      </ArticleCode>

      <ArticleP>
        Quando isso roda em tabela grande e sob concorrência, a consulta vira
        gargalo previsível.
      </ArticleP>

      <ArticleH2>3. Full Text Search no MySQL</ArticleH2>

      <ArticleP>
        No <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink>, a porta de entrada é
        criar índice <ArticleCode>FULLTEXT</ArticleCode> e consultar com{" "}
        <ArticleCode>MATCH ... AGAINST</ArticleCode>.
      </ArticleP>

      <ArticleP>
        Fluxo mínimo:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          criar índice full text nas colunas relevantes
        </ArticleLi>
        <ArticleLi>trocar LIKE por MATCH AGAINST</ArticleLi>
        <ArticleLi>validar relevância e custo com EXPLAIN ANALYZE</ArticleLi>
      </ArticleOl>

      <ArticleCode block>
        {`CREATE FULLTEXT INDEX search_idx
ON products (name, description);

SELECT id, name, description
FROM products
WHERE MATCH(name, description) AGAINST('fone bluetooth' IN NATURAL LANGUAGE MODE);`}
      </ArticleCode>

      <ArticleP>
        O ganho típico é duplo: melhores resultados no topo e menor custo de
        leitura na base.
      </ArticleP>

      <ArticleH3>Tradeoffs no MySQL</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Excelente para sair do LIKE com pouco esforço.
        </ArticleLi>
        <ArticleLi>
          Ranking nativo ajuda em catálogo e conteúdo.
        </ArticleLi>
        <ArticleLi>
          Recursos linguísticos são mais limitados que no{" "}
          <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>4. Full Text Search no PostgreSQL</ArticleH2>

      <ArticleP>
        O <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink> tem stack mais
        rica para busca textual: <ArticleCode>to_tsvector</ArticleCode>,{" "}
        <ArticleCode>to_tsquery</ArticleCode> e índice{" "}
        <TermLink href={POSTGRES_GIN_URL}>GIN</TermLink>.
      </ArticleP>

      <ArticleP>
        Estrutura mínima:
      </ArticleP>

      <ArticleCode block>
        {`CREATE INDEX products_search_idx
ON products
USING GIN (to_tsvector('portuguese', coalesce(name, '') || ' ' || coalesce(description, '')));

SELECT id, name, description
FROM products
WHERE to_tsvector('portuguese', coalesce(name, '') || ' ' || coalesce(description, ''))
@@ to_tsquery('portuguese', 'anel & prata');`}
      </ArticleCode>

      <ArticleP>
        Com isso, o banco passa a usar índice textual para recuperar candidatos
        e ranquear com muito menos custo do que varrer tabela inteira.
      </ArticleP>

      <ArticleH3>Por que o PostgreSQL costuma ser mais flexível</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Melhor suporte a idioma e normalização de termos.
        </ArticleLi>
        <ArticleLi>
          Stemming e léxicos dão mais controle de relevância.
        </ArticleLi>
        <ArticleLi>
          Configurações avançadas de dicionário, incluindo sinônimos, permitem
          ajuste fino por domínio.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>5. O que acontece por baixo dos panos</ArticleH2>

      <ArticleP>
        O núcleo da busca textual é simples: transformar texto em termos
        pesquisáveis e mapear onde cada termo aparece.
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          tokenização: quebra texto em unidades úteis
        </ArticleLi>
        <ArticleLi>
          remoção de stop words: remove palavras com pouco valor para ranking
        </ArticleLi>
        <ArticleLi>
          índice invertido: mapeia termo para lista de documentos
        </ArticleLi>
        <ArticleLi>
          ranking: ordena por proximidade e frequência dos termos buscados
        </ArticleLi>
      </ArticleOl>

      <ArticleMermaid
        ariaLabel="Pipeline interno de full text search com tokenizacao e indice invertido"
        chart={FTS_CHART}
      />

      <ArticleH3>Lexema no PostgreSQL</ArticleH3>

      <ArticleP>
        No <TermLink href={POSTGRES_TEXTSEARCH_URL}>PostgreSQL text search</TermLink>,
        palavras relacionadas podem convergir para a mesma raiz lexical. Isso
        ajuda o mecanismo a entender singular, plural e variações de escrita.
      </ArticleP>

      <ArticleCode block>
        {`SELECT to_tsvector('portuguese', 'programador programando programacao programadores');`}
      </ArticleCode>

      <ArticleP>
        Esse comportamento aumenta recall sem perder totalmente a precisão.
      </ArticleP>

      <ArticleH2>6. Qualidade de busca na prática</ArticleH2>

      <ArticleP>
        Depois que o FTS básico funciona, a qualidade final depende de como você
        transforma a entrada do usuário em consulta e como você ordena os
        resultados.
      </ArticleP>

      <ArticleH3>Consultas que reduzem ruído</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Busca por frase: evita trazer registros com termos soltos e sem
          contexto.
        </ArticleLi>
        <ArticleLi>
          Busca por prefixo: ajuda autocomplete e variações de início de palavra.
        </ArticleLi>
        <ArticleLi>
          Busca composta tolerante: aceita ordem diferente dos termos sem perder
          precisão.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        No <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>, três funções
        costumam cobrir a maior parte dos casos:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>plainto_tsquery</ArticleCode>: simples e segura para texto
          livre.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>to_tsquery</ArticleCode>: modo avançado com operadores
          explícitos.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>websearch_to_tsquery</ArticleCode>: experiência parecida
          com buscador web para o usuário final.
        </ArticleLi>
      </ArticleUl>

      <ArticleCode block>
        {`SELECT id, name,
  ts_rank_cd(
    setweight(to_tsvector('portuguese', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(description, '')), 'B'),
    websearch_to_tsquery('portuguese', 'anel prata')
  ) AS score
FROM products
WHERE (
  setweight(to_tsvector('portuguese', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('portuguese', coalesce(description, '')), 'B')
) @@ websearch_to_tsquery('portuguese', 'anel prata')
ORDER BY score DESC, id DESC
LIMIT 20 OFFSET 0;`}
      </ArticleCode>

      <ArticleP>
        O uso de <TermLink href={POSTGRES_RANK_URL}>ts_rank_cd</TermLink> com{" "}
        <ArticleCode>setweight</ArticleCode> resolve um problema comum:
        priorizar título sobre descrição sem abandonar os resultados secundários.
      </ArticleP>

      <ArticleH3>Acento, caixa e typo</ArticleH3>

      <ArticleP>
        O usuário nem sempre digita igual ao texto indexado. Para português, vale
        tratar acento e caixa na camada de indexação e consulta. No PostgreSQL, a
        extensão <TermLink href={POSTGRES_UNACCENT_URL}>unaccent</TermLink>{" "}
        costuma entrar nesse ajuste.
      </ArticleP>

      <ArticleP>
        Typo tolerance mais agressiva não é ponto forte do FTS nativo. Se typo é
        requisito central de produto, essa decisão pesa na arquitetura da seção
        8.
      </ArticleP>

      <ArticleH2>7. Operação e benchmark confiável</ArticleH2>

      <ArticleP>
        Resultado de benchmark só vale quando compara cenário equivalente. O erro
        mais comum é comparar query fria com cache aquecido ou plano diferente.
      </ArticleP>

      <ArticleH3>Checklist de medição</ArticleH3>

      <ArticleOl>
        <ArticleLi>Fixar dataset e volume de concorrência.</ArticleLi>
        <ArticleLi>Comparar LIKE e FTS no mesmo ambiente.</ArticleLi>
        <ArticleLi>
          Medir p50/p95 de latência, não apenas uma execução isolada.
        </ArticleLi>
        <ArticleLi>
          Validar plano com <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink>.
        </ArticleLi>
      </ArticleOl>

      <ArticleH3>Custos operacionais que entram na conta</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Índice full text acelera leitura, mas aumenta custo de escrita e update.
        </ArticleLi>
        <ArticleLi>
          Reindex e manutenção precisam janela operacional planejada.
        </ArticleLi>
        <ArticleLi>
          Paginação por score exige desempate estável (ex.: score + id).
        </ArticleLi>
        <ArticleLi>
          Limite de tamanho da query evita consultas abusivas em texto livre.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Segurança de implementação">
        <ArticleP>
          Nunca concatene string de busca direto no SQL. Use parâmetros no driver
          e sanitize de entrada para proteger contra injeção e consulta maliciosa.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>8. Quando FTS nativo basta e quando migrar de stack</ArticleH2>

      <ArticleTable caption="Decisão arquitetural para mecanismo de busca">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Cenário</ArticleTh>
            <ArticleTh>FTS nativo</ArticleTh>
            <ArticleTh>Engine dedicada</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Catálogo médio com filtros simples</ArticleTd>
            <ArticleTd>Costuma bastar</ArticleTd>
            <ArticleTd>Opcional</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Ranking avançado + typo tolerance forte</ArticleTd>
            <ArticleTd>Limitado</ArticleTd>
            <ArticleTd>Recomendado</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Facetas complexas e busca multilíngue pesada</ArticleTd>
            <ArticleTd>Pode sofrer</ArticleTd>
            <ArticleTd>Recomendado</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Quando o produto pede features de busca mais profundas, ferramentas como{" "}
        <TermLink href={ELASTIC_URL}>Elasticsearch</TermLink>,{" "}
        <TermLink href={OPENSEARCH_URL}>OpenSearch</TermLink> ou{" "}
        <TermLink href={MEILI_URL}>Meilisearch</TermLink> entram por clareza de
        propósito. A troca aumenta complexidade operacional e exige pipeline de
        indexação dedicado.
      </ArticleP>

      <ArticleP>
        Comece com FTS nativo enquanto ele atende qualidade e latência. Migre
        quando os requisitos de busca virarem um subsistema próprio do produto.
      </ArticleP>

      <ArticleH2>9. Como decidir entre LIKE, MySQL FTS e PostgreSQL FTS</ArticleH2>

      <ArticleTable caption="Resumo de decisão para busca textual">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Cenário</ArticleTh>
            <ArticleTh>Escolha sugerida</ArticleTh>
            <ArticleTh>Motivo</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Filtro simples e volume baixo</ArticleTd>
            <ArticleTd>LIKE</ArticleTd>
            <ArticleTd>Implementação curta, sem requisito de ranking</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Busca de catálogo com stack em MySQL</ArticleTd>
            <ArticleTd>MySQL Full Text Search</ArticleTd>
            <ArticleTd>Melhora relevância e reduz custo sem mudar banco</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Busca textual com regras linguísticas avançadas</ArticleTd>
            <ArticleTd>PostgreSQL Full Text Search</ArticleTd>
            <ArticleTd>Mais controle de idioma, léxico e ranking</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Se a busca impacta conversão, descoberta de conteúdo ou suporte ao
        usuário, trate busca como feature de produto e não como query auxiliar.
      </ArticleP>

      <ArticleH3>Pontos-chave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>LIKE</ArticleCode> serve para substring. Não é mecanismo
          de busca inteligente.
        </ArticleLi>
        <ArticleLi>
          Full text resolve os dois problemas críticos: relevância e
          performance.
        </ArticleLi>
        <ArticleLi>
          No <TermLink href={MYSQL_FTS_URL}>MySQL</TermLink>,{" "}
          <ArticleCode>MATCH AGAINST</ArticleCode> já entrega salto grande com
          baixa fricção.
        </ArticleLi>
        <ArticleLi>
          No <TermLink href={POSTGRES_FTS_URL}>PostgreSQL</TermLink>,{" "}
          <ArticleCode>to_tsvector</ArticleCode>,{" "}
          <ArticleCode>to_tsquery</ArticleCode> e{" "}
          <TermLink href={POSTGRES_GIN_URL}>GIN</TermLink> liberam recursos
          avançados de linguagem.
        </ArticleLi>
        <ArticleLi>
          Sempre valide plano de execução com{" "}
          <TermLink href={MYSQL_EXPLAIN_URL}>EXPLAIN ANALYZE</TermLink> antes de
          publicar a feature.
        </ArticleLi>
        <ArticleLi>
          Este post documenta o conteúdo do{" "}
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            vídeo original
          </a>{" "}
          para consulta rápida em implementação real.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusão</ArticleH3>

      <ArticleP>
        Busca textual boa não depende de truque. Depende da modelagem correta do
        problema.
      </ArticleP>

      <ArticleP>
        A decisão madura é simples: sair do <ArticleCode>LIKE</ArticleCode> no
        momento em que a busca passa a ser parte central da experiência. A partir
        daí, usar full text nativo do banco que você já opera, medir custo real e
        evoluir ranking com dados de produção.
      </ArticleP>
    </>
  );
}
