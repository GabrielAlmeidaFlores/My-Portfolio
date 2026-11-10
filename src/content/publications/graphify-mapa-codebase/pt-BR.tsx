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
  Code@{ shape: card, label: "Código e manifests" } --> Local["Extração local com tree-sitter"]
  Docs@{ shape: doc, label: "Docs, PDFs e mídia" } --> Semantic["Extração semântica"]
  Local --> Merge["Resolução e merge"]
  Semantic --> Merge
  Merge --> Communities["Detecção de comunidades"]
  Communities --> Graph[("graph.json")]
  Graph --> Queries["query, path e explain"]`;

const DECISION_CHART = `flowchart TB
  Start(["A pergunta atravessa vários arquivos?"]) -->|"Sim"| Size{"Repo grande ou pouco conhecido?"}
  Size -->|"Sim"| Use(["Graphify"])
  Size -->|"Não"| Grep["grep e leitura dirigida"]
  Start -->|"Não"| Grep`;

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

export function GraphifyMapaCodebaseContentPt() {
  return (
    <>
      <ArticleH2>1. O problema: grep não entende estrutura</ArticleH2>

      <ArticleP>
        Um agente de IA abre o repositório, lê vinte arquivos, responde uma
        pergunta e encerra a sessão. Na conversa seguinte, o mesmo agente começa
        do zero. O contexto do codebase não ficou em lugar nenhum.
      </ArticleP>

      <ArticleP>
        O <TermLink href={GREP_URL}>grep</TermLink> ajuda a achar texto, mas
        não entende relação. Uma pergunta como “como o login chega ao banco?”
        exige seguir imports, chamadas, interfaces e configuração. Cada arquivo
        encontrado puxa outro, e o agente gasta contexto lendo trechos que não
        respondem à pergunta.
      </ArticleP>

      <ArticleP>
        O <TermLink href={GRAPHIFY_WHAT_URL}>Graphify</TermLink> propõe outra
        abordagem: transformar o repositório em um grafo de conhecimento
        persistente. Em vez de reler arquivos a cada sessão, o agente consulta
        nós e arestas que representam funções, classes, arquivos, conceitos de
        documentação e as relações entre eles.
      </ArticleP>

      <ArticleP>
        Este post cobre o que o Graphify é, como instalar e executar, como
        consultar o grafo, quando o Graphify ajuda de verdade, o que os benchmarks do
        projeto mostram e quais limites aparecem no uso real. As fontes oficiais
        ficam no fim do texto.
      </ArticleP>

      <ArticleCallout variant="note" title="O que este post não promete">
        <ArticleP>
          O Graphify não substitui compilador, testes, revisão de código ou
          leitura do arquivo final. O Graphify entrega um mapa com evidências. A
          decisão continua sendo de quem lê o mapa. O próprio projeto avisa que
          dispatch dinâmico, código gerado e varreduras desatualizadas deixam
          lacunas.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>2. Conceitos que aparecem no post</ArticleH2>

      <ArticleP>
        Antes dos comandos, vale fixar o vocabulário. Cada termo abaixo aparece
        nos exemplos e nas decisões:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>Codebase:</strong> conjunto de arquivos, configurações e
          documentação de um projeto. Exemplo: o repositório inteiro do seu
          serviço, não só a pasta <ArticleCode>src</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <strong>Grafo:</strong> estrutura de nós ligados por arestas. Exemplo:
          a função <ArticleCode>login</ArticleCode> é um nó, e a chamada dela
          para <ArticleCode>UserRepository</ArticleCode> é uma aresta.
        </ArticleLi>
        <ArticleLi>
          <strong>Nó:</strong> uma entidade do mapa, como função, classe,
          arquivo, tabela, documento ou conceito. Exemplo:{" "}
          <ArticleCode>AuthService</ArticleCode> e{" "}
          <ArticleCode>DatabasePool</ArticleCode> são nós.
        </ArticleLi>
        <ArticleLi>
          <strong>Aresta:</strong> a relação entre dois nós. Exemplo:{" "}
          <ArticleCode>AuthService</ArticleCode> usa{" "}
          <ArticleCode>DatabasePool</ArticleCode>, então existe uma aresta
          “uses” entre os dois.
        </ArticleLi>
        <ArticleLi>
          <strong>AST:</strong> representação estruturada do código gerada por
          um parser. Exemplo: o parser enxerga uma declaração de função, seus
          parâmetros e o corpo, em vez de enxergar apenas texto.
        </ArticleLi>
        <ArticleLi>
          <strong>Tree-sitter:</strong> biblioteca de parsing incremental usada
          para gerar a AST de várias linguagens. Exemplo: o Graphify usa
          tree-sitter para ler código local sem chamar um modelo.
        </ArticleLi>
        <ArticleLi>
          <strong>EXTRACTED e INFERRED:</strong> rótulos de confiança das
          arestas. <ArticleCode>EXTRACTED</ArticleCode> veio direto da sintaxe;{" "}
          <ArticleCode>INFERRED</ArticleCode> foi resolvido por inferência e
          merece conferência.
        </ArticleLi>
        <ArticleLi>
          <strong>Comunidade:</strong> grupo de nós densamente conectados, que
          costuma representar um subsistema. Exemplo: autenticação, cobrança e
          notificação podem virar comunidades separadas.
        </ArticleLi>
        <ArticleLi>
          <strong>Leiden e Louvain:</strong> algoritmos de detecção de
          comunidades em grafos. O Graphify tenta Leiden e usa Louvain como
          fallback quando o extra não está instalado.
        </ArticleLi>
        <ArticleLi>
          <strong>MCP:</strong> protocolo que expõe ferramentas e contexto para
          agentes de IA. Exemplo: um servidor MCP do Graphify permite que o
          agente consulte o grafo por tool calls.
        </ArticleLi>
        <ArticleLi>
          <strong>Skill:</strong> instrução empacotada para um agente, como o
          comando <ArticleCode>/graphify</ArticleCode> dentro do assistente.
        </ArticleLi>
        <ArticleLi>
          <strong>Vector store:</strong> banco especializado em embeddings. O
          Graphify se posiciona como grafo, não como{" "}
          <TermLink href={VECTOR_DB_URL}>vector store</TermLink>. A consulta
          navega por nós e arestas, não por uma lista de chunks.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={EMBEDDING_URL}>Embedding</TermLink>:</strong>{" "}
          representação numérica de um texto que permite comparar significado.
          Exemplo: “login” e “autenticação” ficam próximos no espaço vetorial.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={LLM_URL}>LLM</TermLink>:</strong> modelo de
          linguagem grande, como GPT, Claude ou Gemini, usado para gerar texto e
          avaliar respostas. Exemplo: o modelo do assistente que resume o
          relatório do grafo.
        </ArticleLi>
        <ArticleLi>
          <strong>Token:</strong> unidade de texto que o modelo processa. O
          orçamento de contexto é contado em tokens. Exemplo: uma resposta com
          1.500 tokens ocupa mais janela que uma com 300.
        </ArticleLi>
        <ArticleLi>
          <strong>Snapshot:</strong> foto do estado do repositório em um
          momento. Exemplo: um grafo gerado ontem não reflete o commit de hoje
          até rodar uma atualização.
        </ArticleLi>
        <ArticleLi>
          <strong>Hook de git:</strong> script que o git executa em eventos como
          commit e checkout. Exemplo: o hook do Graphify reconstrói o grafo
          depois do commit. Veja a documentação de{" "}
          <TermLink href={GIT_HOOKS_URL}>hooks do git</TermLink>.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>3. O que é o Graphify</ArticleH2>

      <ArticleP>
        O <TermLink href={GRAPHIFY_URL}>Graphify</TermLink> é uma ferramenta
        open-source de mapa de codebase. A ferramenta lê código, documentação, SQL,
        configurações, PDFs e mídia, extrai conceitos e relações, monta um grafo
        e grava o resultado em arquivos que podem ser consultados depois.
      </ArticleP>

      <ArticleP>
        Existem duas formas de uso. A primeira é a CLI local, instalada pelo
        pacote <TermLink href={PYPI_URL}>graphifyy</TermLink>, que também
        registra uma skill no agente. A segunda é o{" "}
        <TermLink href={CLOUD_URL}>Graphify Cloud</TermLink>, que hospeda o
        grafo e expõe um servidor{" "}
        <TermLink href={MCP_URL}>MCP</TermLink>.
      </ArticleP>

      <ArticleP>
        O fluxo de construção tem duas rotas. Código passa por extração
        estrutural local. Documentos, PDFs, imagens e vídeos passam por uma
        etapa semântica opcional, que pode usar o modelo do assistente ou um
        backend configurado.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Fluxo do Graphify: código e manifests passam por extração local com tree-sitter; docs e mídia passam por extração semântica; os dois se juntam em resolução, comunidades e graph.json, consultado por query, path e explain"
        chart={PIPELINE_CHART}
      />

      <ArticleP>
        O resultado principal é uma pasta <ArticleCode>graphify-out/</ArticleCode>{" "}
        com quatro arquivos úteis:
      </ArticleP>

      <ArticleTable caption="Saídas do Graphify e para que servem">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Arquivo</ArticleTh>
            <ArticleTh>O que é</ArticleTh>
            <ArticleTh>Uso prático</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>graph.json</ArticleCode>
            </ArticleTd>
            <ArticleTd>Grafo completo com nós, arestas e metadados</ArticleTd>
            <ArticleTd>
              Base para <ArticleCode>query</ArticleCode>,{" "}
              <ArticleCode>path</ArticleCode> e <ArticleCode>explain</ArticleCode>
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>graph.html</ArticleCode>
            </ArticleTd>
            <ArticleTd>Visualização interativa do grafo</ArticleTd>
            <ArticleTd>Explorar comunidades, buscar e clicar em nós</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>GRAPH_REPORT.md</ArticleCode>
            </ArticleTd>
            <ArticleTd>Resumo com nós principais, comunidades e conexões</ArticleTd>
            <ArticleTd>Leitura rápida de arquitetura antes de investigar</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>manifest.json</ArticleCode>
            </ArticleTd>
            <ArticleTd>Metadados da extração e do conjunto analisado</ArticleTd>
            <ArticleTd>Auditar o que entrou no grafo</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>cache/</ArticleCode>
            </ArticleTd>
            <ArticleTd>Cache para atualizações incrementais</ArticleTd>
            <ArticleTd>Não commitar; serve para reconstruir mais rápido</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        O ponto central é que o grafo é persistente. O agente não precisa
        redescobrir a estrutura do repositório em cada sessão. O agente pode consultar
        o mapa que já foi construído.
      </ArticleP>

      <ArticleCallout variant="tip" title="Grafo não é resumo">
        <ArticleP>
          Um resumo em Markdown perde arestas. O grafo guarda a relação entre
          dois pontos e permite perguntar “qual o caminho entre A e B?”. Essa é
          a diferença entre ler um texto sobre o sistema e navegar pela
          estrutura dele.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>4. Como o grafo é construído</ArticleH2>

      <ArticleP>
        A construção acontece em etapas. Entender a ordem ajuda a interpretar o
        resultado e a diagnosticar um grafo incompleto:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          O Graphify lista os arquivos relevantes e aplica regras de ignore,
          como <ArticleCode>.gitignore</ArticleCode> e{" "}
          <ArticleCode>.graphifyignore</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Cada arquivo de código passa por um parser{" "}
          <TermLink href={TREE_SITTER_URL}>tree-sitter</TermLink> e vira uma{" "}
          <TermLink href={AST_URL}>AST</TermLink>. Funções, classes, imports,
          chamadas e heranças são extraídos.
        </ArticleLi>
        <ArticleLi>
          Documentos, PDFs, imagens e transcrições podem passar por uma etapa
          semântica, que identifica conceitos e relações fora do código.
        </ArticleLi>
        <ArticleLi>
          As relações entre arquivos e símbolos são resolvidas. Uma chamada
          para <ArticleCode>send()</ArticleCode> em outro arquivo vira uma
          aresta entre os nós correspondentes.
        </ArticleLi>
        <ArticleLi>
          O grafo é dividido em comunidades com{" "}
          <TermLink href={LEIDEN_URL}>Leiden</TermLink> ou{" "}
          <TermLink href={LOUVAIN_URL}>Louvain</TermLink>, e os grupos recebem
          nomes.
        </ArticleLi>
        <ArticleLi>
          O resultado é gravado em <ArticleCode>graph.json</ArticleCode>,{" "}
          <ArticleCode>graph.html</ArticleCode> e{" "}
          <ArticleCode>GRAPH_REPORT.md</ArticleCode>.
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        Segundo a documentação, a extração local cobre cerca de 40 linguagens.
        SQL e Terraform têm extractors próprios, e formatos ambíguos podem ser
        declarados no <ArticleCode>.graphifyrc</ArticleCode> para o parser não
        escolher a linguagem errada.
      </ArticleP>

      <ArticleH3>EXTRACTED não é INFERRED</ArticleH3>

      <ArticleP>
        Cada aresta carrega uma etiqueta de proveniência.{" "}
        <ArticleCode>EXTRACTED</ArticleCode> significa que a relação foi lida
        diretamente da sintaxe. Exemplo: um <ArticleCode>import</ArticleCode>{" "}
        explícito de <ArticleCode>AuthService</ArticleCode> para{" "}
        <ArticleCode>TokenService</ArticleCode>.
      </ArticleP>

      <ArticleP>
        <ArticleCode>INFERRED</ArticleCode> significa que a relação veio de uma
        etapa de resolução. Exemplo: uma chamada dinâmica que o resolvedor
        associou a uma função provável. A documentação do projeto deixa claro
        que <ArticleCode>INFERRED</ArticleCode> não significa
        necessariamente “criado por <TermLink href={LLM_URL}>LLM</TermLink>”. Pode ser inferência estática.
      </ArticleP>

      <ArticleP>
        A consequência prática é simples: arestas extraídas são mais fortes;
        arestas inferidas precisam de conferência no código antes de virar
        conclusão. O próprio Graphify expõe essa diferença no{" "}
        <TermLink href={PROVENANCE_URL}>modelo de proveniência</TermLink>.
      </ArticleP>

      <ArticleH3>O que o grafo não vê</ArticleH3>

      <ArticleP>
        Dispatch dinâmico (quando o método chamado só é decidido em tempo de
        execução), reflection (quando o código inspeciona tipos e membros em
        runtime), código gerado, templates e dependências resolvidas em runtime
        podem ficar fora. Um grafo incompleto é um mapa parcial, não um grafo
        errado. A fonte final continua sendo o arquivo e o teste.
      </ArticleP>

      <ArticleH2>5. Instalação e primeiro grafo</ArticleH2>

      <ArticleP>
        O Graphify exige <TermLink href={PYTHON_URL}>Python</TermLink> 3.10 ou
        mais novo. O caminho recomendado usa{" "}
        <TermLink href={UV_URL}>uv</TermLink>;{" "}
        <TermLink href={PIPX_URL}>pipx</TermLink> também funciona. O pacote
        oficial no PyPI é <ArticleCode>graphifyy</ArticleCode>, com dois “y”.
        O comando instalado é <ArticleCode>graphify</ArticleCode>.
      </ArticleP>

      <ArticleCode block language="bash">
        {`uv tool install graphifyy
graphify install`}
      </ArticleCode>

      <ArticleP>
        O primeiro comando instala a CLI em um ambiente isolado. O segundo
        detecta o assistente e registra a skill. Para escolher o assistente,
        passe a plataforma:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify install --platform opencode
graphify install --platform codex
graphify install --platform gemini`}
      </ArticleCode>

      <ArticleP>
        No assistente, o comando da skill constrói o grafo da pasta atual:
      </ArticleP>

      <ArticleCode block language="bash">
        {`/graphify .
/graphify query "how does authentication reach the database"`}
      </ArticleCode>

      <ArticleP>
        Se você quer só o grafo de código, sem enviar documentação para modelo
        nenhum, rode a CLI em modo <ArticleCode>--code-only</ArticleCode>:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify extract . --code-only`}
      </ArticleCode>

      <ArticleP>
        Esse é o primeiro teste que eu faria. O teste responde à pergunta mais
        importante: o parser entende a estrutura do seu projeto? Se o grafo de
        código já ficar útil, a etapa semântica de docs passa a ser um extra,
        não uma dependência.
      </ArticleP>

      <ArticleH3>Extras opcionais</ArticleH3>

      <ArticleP>
        A instalação base não cobre todos os formatos. Os extras são
        instalados sob demanda:
      </ArticleP>

      <ArticleTable caption="Extras úteis do Graphify">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Extra</ArticleTh>
            <ArticleTh>Adiciona</ArticleTh>
            <ArticleTh>Quando faz sentido</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>mcp</ArticleCode>
            </ArticleTd>
            <ArticleTd>Servidor MCP local</ArticleTd>
            <ArticleTd>Agente que consome tools em vez de CLI</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>watch</ArticleCode>
            </ArticleTd>
            <ArticleTd>Reconstrução ao detectar mudanças</ArticleTd>
            <ArticleTd>Desenvolvimento ativo com grafo sempre fresco</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>pdf</ArticleCode>
            </ArticleTd>
            <ArticleTd>Leitura de PDFs</ArticleTd>
            <ArticleTd>Repositório com especificações e papers</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>sql</ArticleCode>
            </ArticleTd>
            <ArticleTd>Extração de schema SQL</ArticleTd>
            <ArticleTd>Modelo de dados precisa entrar no mapa</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>office</ArticleCode>
            </ArticleTd>
            <ArticleTd>DOCX e XLSX</ArticleTd>
            <ArticleTd>Documentação de negócio em planilhas e documentos</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>leiden</ArticleCode>
            </ArticleTd>
            <ArticleTd>Detecção de comunidades com Leiden</ArticleTd>
            <ArticleTd>Grafo grande em que a qualidade dos grupos importa</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>ollama</ArticleCode>
            </ArticleTd>
            <ArticleTd>Backend local para a etapa semântica</ArticleTd>
            <ArticleTd>Conteúdo sensível que não pode sair da máquina</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>video</ArticleCode>
            </ArticleTd>
            <ArticleTd>Transcrição de vídeo e áudio</ArticleTd>
            <ArticleTd>Repositório com gravações e demonstrações</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleCallout variant="warning" title="Privacidade da etapa semântica">
        <ArticleP>
          Código é processado localmente com tree-sitter. Documentos, PDFs e
          imagens podem ser enviados ao modelo do assistente ou ao backend
          configurado. Se o repositório tiver conteúdo restrito, use{" "}
          <ArticleCode>--code-only</ArticleCode> ou um backend local como
          Ollama antes de rodar a extração completa.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>6. Consultando o grafo</ArticleH2>

      <ArticleP>
        Existem três comandos de consulta. Eles respondem a perguntas
        diferentes, e escolher o comando certo economiza tempo:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>query</ArticleCode>: encontra nós relevantes e percorre
          relações a partir deles. Use para perguntas amplas, como “como a
          autenticação chega ao banco?”.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>path</ArticleCode>: traça o caminho mais curto entre dois
          nós. Use para saber como dois pontos se conectam.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>explain</ArticleCode>: detalha um nó, sua origem,
          comunidade e conexões. Use depois de encontrar um nome no resultado.
        </ArticleLi>
      </ArticleUl>

      <ArticleCode block language="bash">
        {`graphify query "authentication and session storage" --budget 1500
graphify path "login" "normalize_email"
graphify explain "normalize_email"`}
      </ArticleCode>

      <ArticleP>
        O <ArticleCode>query</ArticleCode> usa busca em largura por padrão. O
        flag <ArticleCode>--dfs</ArticleCode> segue uma cadeia mais funda, e{" "}
        <ArticleCode>--budget</ArticleCode> limita o tamanho da resposta em
        tokens:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify query "request validation" --dfs --budget 1500
graphify query "who calls send" --context calls
graphify query "what raises timeouts" --seed "TimeoutException" --budget 300`}
      </ArticleCode>

      <ArticleP>
        O <ArticleCode>--seed</ArticleCode> começa por um nó que você já
        conhece. O <ArticleCode>--context</ArticleCode> limita o tipo de aresta,
        como <ArticleCode>calls</ArticleCode>. Esses dois flags evitam que a
        consulta se espalhe pelo grafo inteiro.
      </ArticleP>

      <ArticleH3>Como fazer uma boa pergunta</ArticleH3>

      <ArticleP>
        Pergunta ampla demais vira despejo de nós. Pergunta específica demais
        não encontra o nó. O meio-termo é começar por um subsistema e apertar o
        escopo:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Boa: “como o middleware de autenticação chega ao repositório de
          usuários?”. O grafo tem pontos de partida claros e uma direção de
          chamada.
        </ArticleLi>
        <ArticleLi>
          Fraca: “me explica o sistema”. A consulta não sabe onde começar e
          devolve um subgrafo enorme ou irrelevante.
        </ArticleLi>
        <ArticleLi>
          Boa: “quem chama <ArticleCode>send()</ArticleCode>?” com{" "}
          <ArticleCode>--context calls</ArticleCode>. A aresta limita o
          resultado.
        </ArticleLi>
        <ArticleLi>
          Fraca: “onde tem código de autenticação?”. Essa pergunta é uma busca lexical,
          não uma pergunta estrutural. O <TermLink href={GREP_URL}>grep</TermLink>{" "}
          resolve melhor.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Os comandos de consulta não chamam <TermLink href={LLM_URL}>LLM</TermLink>. Eles leem{" "}
        <ArticleCode>graph.json</ArticleCode> localmente. O código de saída
        ajuda a automação: <ArticleCode>0</ArticleCode> para resposta,{" "}
        <ArticleCode>3</ArticleCode> para nome ambíguo e{" "}
        <ArticleCode>4</ArticleCode> para nenhum nó encontrado.
      </ArticleP>

      <ArticleH2>7. Mantendo o grafo atualizado</ArticleH2>

      <ArticleP>
        Grafo desatualizado é pior que grafo ausente, porque o grafo parece
        confiável. Depois do primeiro build, instale os hooks de git (scripts que o git executa em eventos como commit e checkout):
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify hook install
graphify hook status`}
      </ArticleCode>

      <ArticleP>
        Os hooks reconstroem o grafo de código depois de commits, troca de
        branch, merge, pull e rebase. Para mudanças em documentação e imagens,
        rode a atualização pelo assistente ou pela CLI:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify update .
graphify extract . --update`}
      </ArticleCode>

      <ArticleP>
        O cache fica em <ArticleCode>graphify-out/cache/</ArticleCode> e não
        deve ser commitado. O guia de{" "}
        <TermLink href={INCREMENTAL_URL}>atualização incremental</TermLink>{" "}
        explica o que cada gatilho cobre.
      </ArticleP>

      <ArticleH3>Ignore o que não deve entrar</ArticleH3>

      <ArticleP>
        O Graphify respeita <ArticleCode>.gitignore</ArticleCode> e aceita um{" "}
        <ArticleCode>.graphifyignore</ArticleCode> próprio. Use para excluir
        build, dependências e artefatos:
      </ArticleP>

      <ArticleCode block language="plaintext">
        {`node_modules/
dist/
coverage/
.next/`}
      </ArticleCode>

      <ArticleP>
        Configurações do projeto podem ir para um{" "}
        <ArticleCode>.graphifyrc</ArticleCode>, como orçamento e profundidade
        padrão da consulta:
      </ArticleP>

      <ArticleCode block language="ini">
        {`query_budget=4000
query_depth=3`}
      </ArticleCode>

      <ArticleH2>8. Skills, MCP e Graphify Cloud</ArticleH2>

      <ArticleP>
        A skill e o MCP resolvem o mesmo problema por caminhos diferentes. A
        skill ensina o assistente a rodar a CLI local. O{" "}
        <TermLink href={MCP_URL}>MCP</TermLink> expõe ferramentas para o agente
        consultar o grafo sem depender de linha de comando.
      </ArticleP>

      <ArticleP>
        A documentação do Graphify lista suporte a Claude Code, Cursor, Codex,
        Gemini CLI, GitHub Copilot, OpenCode e outros assistentes. O comando de
        instalação muda por plataforma:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify install --platform opencode
graphify install --platform codex
graphify install --platform gemini`}
      </ArticleCode>

      <ArticleP>
        O Graphify Cloud oferece o grafo hospedado, com servidor MCP em{" "}
        <ArticleCode>https://api.graphify.com/mcp</ArticleCode> usando
        Streamable HTTP (transporte HTTP do MCP), OAuth (autorização delegada) e sem API key. O plano gratuito cobre até três
        repositórios, segundo a documentação. Para uso local e offline, a CLI
        open-source continua sendo o caminho.
      </ArticleP>

      <ArticleP>
        Se você usa os dois, escolha qual grafo é a fonte principal. A própria
        documentação recomenda não copiar dois blocos de instrução
        incondicionais para o <ArticleCode>AGENTS.md</ArticleCode> do projeto.
        O guia para{" "}
        <TermLink href={ALWAYS_ON_URL}>fazer o agente usar o grafo</TermLink>{" "}
        mostra o que cada integração escreve.
      </ArticleP>

      <ArticleH2>9. Benchmarks: o que melhora e o que não prova</ArticleH2>

      <ArticleP>
        O projeto publica benchmarks em um harness próprio, com o mesmo modelo,
        orçamento e juiz para as ferramentas comparadas. Harness, aqui, é o
        ambiente padronizado que roda todos os sistemas; o juiz é o modelo que
        avalia as respostas contra fatos esperados.
      </ArticleP>

      <ArticleP>
        Antes dos números, vale entender o que cada nome mede. Sem isso, a
        tabela vira um ranking solto:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong><TermLink href={LOCOMO_URL}>LOCOMO</TermLink>:</strong>{" "}
          dataset público de memória conversacional com várias sessões. Exemplo:
          perguntas que dependem de fatos ditos em conversas anteriores.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={LONGMEMEVAL_URL}>LongMemEval-S</TermLink>:</strong>{" "}
          dataset de memória de longo prazo, com perguntas que exigem lembrar
          informação distante.
        </ArticleLi>
        <ArticleLi>
          <strong>recall@10:</strong> dos 10 primeiros resultados recuperados,
          quantos contêm a resposta certa. Quanto maior, melhor.
        </ArticleLi>
        <ArticleLi>
          <strong>Precisão de QA:</strong> percentual de respostas finais
          corretas, medidas por um juiz contra os fatos esperados.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={ERPNEXT_URL}>ERPNext</TermLink>:</strong>{" "}
          sistema ERP open-source usado como repositório grande no teste de
          inteligência de código.
        </ArticleLi>
        <ArticleLi>
          <strong>Cobertura de fatos:</strong> quantos fatos-chave esperados
          aparecem na resposta do agente.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={BM25_URL}>BM25</TermLink>:</strong> algoritmo
          clássico de busca lexical por frequência de termos. Exemplo: encontra
          documentos que repetem as palavras da pergunta, mas não entende
          relação.
        </ArticleLi>
        <ArticleLi>
          <strong>dense RAG:</strong> recuperação por embeddings, que busca
          trechos semanticamente parecidos. RAG significa Retrieval-Augmented
          Generation, ou geração aumentada por recuperação. Veja{" "}
          <TermLink href={RAG_URL}>RAG</TermLink>.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={MEM0_URL}>mem0</TermLink> e{" "}
          <TermLink href={SUPERMEMORY_URL}>supermemory</TermLink>:</strong>{" "}
          sistemas de memória para agentes usados como comparação.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        A tabela abaixo resume os números divulgados:
      </ArticleP>

      <ArticleTable caption="Benchmarks publicados pelo projeto Graphify">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Suite</ArticleTh>
            <ArticleTh>Métrica</ArticleTh>
            <ArticleTh>Graphify</ArticleTh>
            <ArticleTh>Comparação</ArticleTh>
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
            <ArticleTd>Precisão de QA</ArticleTd>
            <ArticleTd>45.3%</ArticleTd>
            <ArticleTd>supermemory 49.7% com cerca de 11x o custo; mem0 27.3%</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>LongMemEval-S</ArticleTd>
            <ArticleTd>Precisão de QA</ArticleTd>
            <ArticleTd>76%</ArticleTd>
            <ArticleTd>Empata com dense RAG</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>ERPNext</ArticleTd>
            <ArticleTd>Cobertura de fatos no código</ArticleTd>
            <ArticleTd>82.0%</ArticleTd>
            <ArticleTd>grep e leitura 70.8%</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Custo de build</ArticleTd>
            <ArticleTd>Créditos de <TermLink href={LLM_URL}>LLM</TermLink></ArticleTd>
            <ArticleTd>0</ArticleTd>
            <ArticleTd>Concorrentes pagam ingest por token</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Os números de LOCOMO e LongMemEval vêm de datasets de memória
        conversacional. O teste de ERPNext usa um repositório Python de grande
        porte e mede cobertura de fatos com um agente fixo. O benchmark também
        reporta cerca de 140 mil tokens por consulta no cenário de código e um
        custo de ingest de aproximadamente US$ 1,40 no LOCOMO.
      </ArticleP>

      <ArticleP>
        O que esses dados sugerem: um grafo persistente pode recuperar contexto
        com menos leitura bruta e manter a estrutura entre sessões. O que eles
        não provam: que o Graphify será melhor no seu repositório, na sua
        linguagem e no seu tipo de pergunta. O harness é do próprio projeto, e
        benchmark de fornecedor não substitui medição local.
      </ArticleP>

      <ArticleCallout variant="note" title="Sobre o número de 80%">
        <ArticleP>
          O material de divulgação fala em cortar até 80% do gasto de tokens de
          agentes. Trate esse número como alegação de produto. O dado verificável
          no benchmark de código é outro: 82.0% de cobertura contra 70.8% do
          grep e leitura, com o custo de contexto descrito no relatório. Meça no
          seu caso antes de prometer o mesmo ganho.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>10. Quando usar e quando evitar</ArticleH2>

      <ArticleP>
        O Graphify brilha quando a pergunta atravessa arquivos e a estrutura
        importa mais que o texto. O fluxograma resume a primeira decisão:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Decisão de uso: se a pergunta atravessa vários arquivos e o repositório é grande ou pouco conhecido, usar Graphify; caso contrário, grep e leitura dirigida"
        chart={DECISION_CHART}
      />

      <ArticleH3>Sinais de que vale a pena</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Onboarding em um repositório grande: o grafo mostra comunidades e
          conceitos centrais antes de você abrir vinte arquivos.
        </ArticleLi>
        <ArticleLi>
          Monorepo (um repositório com vários projetos e serviços): perguntas de impacto e caminhos entre
          módulos ficam mais baratas.
        </ArticleLi>
        <ArticleLi>
          Revisão de arquitetura: <ArticleCode>GRAPH_REPORT.md</ArticleCode> e{" "}
          <ArticleCode>graph.html</ArticleCode> dão uma visão que o diff não dá.
        </ArticleLi>
        <ArticleLi>
          Agente que repete a mesma leitura: o grafo persistente evita
          redescobrir a estrutura a cada sessão.
        </ArticleLi>
        <ArticleLi>
          Código e documentação no mesmo mapa: decisões registradas em ADR (registro de decisão de arquitetura) ou
          RFC (proposta técnica) ganham nós próprios.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Sinais de que não vale</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Repositório pequeno e conhecido: <TermLink href={GREP_URL}>grep</TermLink>{" "}
          e leitura dirigida resolvem sem cerimônia.
        </ArticleLi>
        <ArticleLi>
          Código gerado ou altamente dinâmico: o parser vê menos do que o runtime
          faz, e o grafo fica com lacunas.
        </ArticleLi>
        <ArticleLi>
          Necessidade de verdade exata em tempo real: o grafo é um snapshot. O
          arquivo e o teste continuam sendo a fonte.
        </ArticleLi>
        <ArticleLi>
          Conteúdo restrito que não pode passar por modelo: a etapa semântica de
          docs pode enviar dados ao backend. Use{" "}
          <ArticleCode>--code-only</ArticleCode> ou um modelo local.
        </ArticleLi>
        <ArticleLi>
          Time sem rotina de atualização: grafo velho engana. Se ninguém roda
          hook nem update, o mapa perde valor.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Regra prática">
        <ArticleP>
          Se a pergunta cabe em uma busca textual, use grep. Se a pergunta
          depende de relação entre partes, tente o grafo. Se o grafo responder
          sem você abrir o arquivo, o grafo pagou o custo. Se você abrir o arquivo
          de qualquer forma, o grafo serviu como índice, não como resposta.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>11. Fluxo recomendado</ArticleH2>

      <ArticleP>
        A ordem abaixo evita começar pelo caminho mais caro. O primeiro objetivo
        é provar que o parser entende o projeto, não montar o grafo mais
        completo possível:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          Instale <ArticleCode>graphifyy</ArticleCode> com uv ou pipx e rode{" "}
          <ArticleCode>graphify install</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Construa o grafo de código com{" "}
          <ArticleCode>graphify extract . --code-only</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Abra <ArticleCode>graph.html</ArticleCode> e leia{" "}
          <ArticleCode>GRAPH_REPORT.md</ArticleCode> para conferir se os nós
          principais fazem sentido.
        </ArticleLi>
        <ArticleLi>
          Teste três perguntas reais com <ArticleCode>query</ArticleCode>,{" "}
          <ArticleCode>path</ArticleCode> e <ArticleCode>explain</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Se o resultado ajudar, adicione docs e PDFs com os extras e configure
          o backend semântico.
        </ArticleLi>
        <ArticleLi>
          Instale <ArticleCode>graphify hook install</ArticleCode> e confirme
          com <ArticleCode>graphify hook status</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Para o time, versione <ArticleCode>graph.json</ArticleCode> e{" "}
          <ArticleCode>GRAPH_REPORT.md</ArticleCode>; deixe{" "}
          <ArticleCode>cache/</ArticleCode> fora do git.
        </ArticleLi>
        <ArticleLi>
          Escolha entre skill local e MCP, e registre apenas o caminho de
          consulta que o agente realmente usa.
        </ArticleLi>
      </ArticleOl>

      <ArticleH2>12. Erros comuns</ArticleH2>

      <ArticleUl>
        <ArticleLi>
          <strong>Tratar INFERRED como fato.</strong> A aresta inferida é pista,
          não prova. Abra o arquivo citado antes de tomar decisão de arquitetura.
        </ArticleLi>
        <ArticleLi>
          <strong>Perguntar de forma ampla demais.</strong> “Explique o
          sistema” devolve um subgrafo enorme. Comece por um subsistema e use{" "}
          <ArticleCode>--budget</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <strong>Esquecer a atualização.</strong> Sem hook ou{" "}
          <ArticleCode>update</ArticleCode>, o grafo envelhece e aponta para
          código que mudou.
        </ArticleLi>
        <ArticleLi>
          <strong>Commitar o cache.</strong> O cache acelera o build local, mas
          não é artefato de time. Versione o grafo e o relatório.
        </ArticleLi>
        <ArticleLi>
          <strong>Achar que docs são locais por padrão.</strong> Código é local.
          A etapa semântica de documentos pode usar o modelo do assistente ou um
          backend configurado.
        </ArticleLi>
        <ArticleLi>
          <strong>Usar o grafo como substituto de teste.</strong> O mapa mostra
          relação, não comportamento. Teste continua sendo teste.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Pontos-chave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <TermLink href={GRAPHIFY_URL}>Graphify</TermLink> transforma o
          codebase em um grafo consultável, não em mais um chat.
        </ArticleLi>
        <ArticleLi>
          Código é extraído localmente com tree-sitter; docs e mídia usam uma
          etapa semântica opcional.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>query</ArticleCode>,{" "}
          <ArticleCode>path</ArticleCode> e <ArticleCode>explain</ArticleCode>{" "}
          respondem a perguntas diferentes. Escolha pelo tipo de pergunta.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>EXTRACTED</ArticleCode> é mais forte que{" "}
          <ArticleCode>INFERRED</ArticleCode>. Confira arestas inferidas no
          código.
        </ArticleLi>
        <ArticleLi>
          O grafo precisa de atualização. Hooks e{" "}
          <ArticleCode>update</ArticleCode> evitam mapa velho.
        </ArticleLi>
        <ArticleLi>
          Os benchmarks do projeto mostram ganho em recall e cobertura, mas não
          substituem medição no seu repositório.
        </ArticleLi>
        <ArticleLi>
          Use em repositório grande, pergunta estrutural e contexto que precisa
          persistir. Em busca textual simples, grep ainda ganha.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusão</ArticleH3>

      <ArticleP>
        O <TermLink href={GRAPHIFY_URL}>Graphify</TermLink> resolve um problema
        concreto: o agente esquece a estrutura do projeto entre sessões e gasta
        contexto redescobrindo o óbvio. O grafo persistente dá um mapa estável,
        com proveniência e consultas por relação.
      </ArticleP>

      <ArticleP>
        O valor não vem de trocar o grep por uma ferramenta nova. Vem de usar a
        ferramenta certa para a pergunta certa. Busca textual para texto.
        Grafo para relação. Arquivo e teste para a verdade final.
      </ArticleP>

      <ArticleH3>Fontes e leituras</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <TermLink href={GRAPHIFY_WHAT_URL}>Graphify: o que é</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={DOCS_URL}>Documentação oficial</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={INSTALL_URL}>Instalação e extras</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={QUICKSTART_URL}>Quickstart com skill</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={QUERYING_URL}>Guia de consultas</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={ARCHITECTURE_URL}>Como o grafo é construído</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={GITHUB_URL}>Repositório no GitHub</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={PYPI_URL}>Pacote graphifyy no PyPI</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={BENCHMARKS_URL}>Benchmarks do projeto</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={CLOUD_URL}>Graphify Cloud</TermLink>,{" "}
          <TermLink href={PROVENANCE_URL}>proveniência</TermLink>,{" "}
          <TermLink href={INCREMENTAL_URL}>atualização incremental</TermLink> e{" "}
          <TermLink href={ALWAYS_ON_URL}>agente usando o grafo</TermLink>
        </ArticleLi>
        <ArticleLi>
          Datasets e comparações:{" "}
          <TermLink href={LOCOMO_URL}>LOCOMO</TermLink>,{" "}
          <TermLink href={LONGMEMEVAL_URL}>LongMemEval</TermLink>,{" "}
          <TermLink href={ERPNEXT_URL}>ERPNext</TermLink>,{" "}
          <TermLink href={BM25_URL}>BM25</TermLink>,{" "}
          <TermLink href={RAG_URL}>RAG</TermLink>,{" "}
          <TermLink href={MEM0_URL}>mem0</TermLink> e{" "}
          <TermLink href={SUPERMEMORY_URL}>supermemory</TermLink>
        </ArticleLi>
        <ArticleLi>
          Ferramentas e conceitos: <TermLink href={UV_URL}>uv</TermLink>,{" "}
          <TermLink href={PIPX_URL}>pipx</TermLink>,{" "}
          <TermLink href={PYTHON_URL}>Python</TermLink>,{" "}
          <TermLink href={EMBEDDING_URL}>embedding</TermLink>,{" "}
          <TermLink href={LLM_URL}>LLM</TermLink>,{" "}
          <TermLink href={VECTOR_DB_URL}>vector store</TermLink> e{" "}
          <TermLink href={GIT_HOOKS_URL}>git hooks</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={MCP_URL}>Model Context Protocol</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={TREE_SITTER_URL}>Tree-sitter</TermLink> e{" "}
          <TermLink href={AST_URL}>AST</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={KNOWLEDGE_GRAPH_URL}>Knowledge graph</TermLink>,{" "}
          <TermLink href={LEIDEN_URL}>Leiden</TermLink> e{" "}
          <TermLink href={LOUVAIN_URL}>Louvain</TermLink>
        </ArticleLi>
      </ArticleUl>
    </>
  );
}
