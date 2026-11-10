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
  Code@{ shape: card, label: "Code and manifests" } --> Local["Local tree-sitter extraction"]
  Docs@{ shape: doc, label: "Docs, PDFs and media" } --> Semantic["Semantic extraction"]
  Local --> Merge["Resolution and merge"]
  Semantic --> Merge
  Merge --> Communities["Community detection"]
  Communities --> Graph[("graph.json")]
  Graph --> Queries["query, path and explain"]`;

const DECISION_CHART = `flowchart TB
  Start(["Does the question cross several files?"]) -->|"Yes"| Size{"Large or unfamiliar repo?"}
  Size -->|"Yes"| Use(["Graphify"])
  Size -->|"No"| Grep["grep and targeted reading"]
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

export function GraphifyMapaCodebaseContentEn() {
  return (
    <>
      <ArticleH2>1. The problem: grep does not understand structure</ArticleH2>

      <ArticleP>
        An AI agent opens the repository, reads twenty files, answers a
        question, and ends the session. In the next chat, the same agent starts
        from scratch. The codebase context did not persist anywhere.
      </ArticleP>

      <ArticleP>
        <TermLink href={GREP_URL}>grep</TermLink> helps find text, but it does
        not understand relationships. A question like "how does login reach the
        database?" requires following imports, calls, interfaces, and
        configuration. Every file found pulls in another, and the agent spends
        context reading excerpts that do not answer the question.
      </ArticleP>

      <ArticleP>
        <TermLink href={GRAPHIFY_WHAT_URL}>Graphify</TermLink> proposes a
        different approach: turning the repository into a persistent knowledge
        graph. Instead of rereading files every session, the agent queries nodes
        and edges that represent functions, classes, files, documentation
        concepts, and the relationships between them.
      </ArticleP>

      <ArticleP>
        This post covers what Graphify is, how to install and run it, how to
        query the graph, when it actually helps, what the project benchmarks
        show, and which limits appear in real use. Official sources are listed at
        the end.
      </ArticleP>

      <ArticleCallout variant="note" title="What this post does not promise">
        <ArticleP>
          Graphify does not replace the compiler, tests, code review, or reading
          the final file. It delivers a map with evidence. The decision still
          belongs to the person reading the map. The project itself warns that
          dynamic dispatch, generated code, and stale scans leave gaps.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>2. Concepts that appear in this post</ArticleH2>

      <ArticleP>
        Before the commands, it helps to fix the vocabulary. Every term below
        appears in the examples and decisions:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>Codebase:</strong> the set of files, configuration, and
          documentation of a project. Example: the entire service repository,
          not only the <ArticleCode>src</ArticleCode> folder.
        </ArticleLi>
        <ArticleLi>
          <strong>Graph:</strong> a structure of nodes connected by edges.
          Example: the <ArticleCode>login</ArticleCode> function is a node, and
          its call to <ArticleCode>UserRepository</ArticleCode> is an edge.
        </ArticleLi>
        <ArticleLi>
          <strong>Node:</strong> an entity in the map, such as a function,
          class, file, table, document, or concept. Example:{" "}
          <ArticleCode>AuthService</ArticleCode> and{" "}
          <ArticleCode>DatabasePool</ArticleCode> are nodes.
        </ArticleLi>
        <ArticleLi>
          <strong>Edge:</strong> the relationship between two nodes. Example:{" "}
          <ArticleCode>AuthService</ArticleCode> uses{" "}
          <ArticleCode>DatabasePool</ArticleCode>, so a "uses" edge exists
          between them.
        </ArticleLi>
        <ArticleLi>
          <strong>AST:</strong> a structured representation of code generated by
          a parser. Example: the parser sees a function declaration, its
          parameters, and its body instead of seeing only text.
        </ArticleLi>
        <ArticleLi>
          <strong>Tree-sitter:</strong> an incremental parsing library used to
          build ASTs for many languages. Example: Graphify uses tree-sitter to
          read code locally without calling a model.
        </ArticleLi>
        <ArticleLi>
          <strong>EXTRACTED and INFERRED:</strong> confidence labels on edges.{" "}
          <ArticleCode>EXTRACTED</ArticleCode> came straight from syntax;{" "}
          <ArticleCode>INFERRED</ArticleCode> came from resolution and deserves
          a check.
        </ArticleLi>
        <ArticleLi>
          <strong>Community:</strong> a group of densely connected nodes that
          usually represents a subsystem. Example: authentication, billing, and
          notifications may become separate communities.
        </ArticleLi>
        <ArticleLi>
          <strong>Leiden and Louvain:</strong> graph community detection
          algorithms. Graphify tries Leiden and falls back to Louvain when the
          extra is not installed.
        </ArticleLi>
        <ArticleLi>
          <strong>MCP:</strong> a protocol that exposes tools and context to AI
          agents. Example: a Graphify MCP server lets the agent query the graph
          through tool calls.
        </ArticleLi>
        <ArticleLi>
          <strong>Skill:</strong> a packaged instruction set for an agent, such
          as the <ArticleCode>/graphify</ArticleCode> command inside the
          assistant.
        </ArticleLi>
        <ArticleLi>
          <strong>Vector store:</strong> a database specialized in embeddings.
          Graphify positions itself as a graph, not as a{" "}
          <TermLink href={VECTOR_DB_URL}>vector store</TermLink>. The query
          traverses nodes and edges, not a list of chunks.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={EMBEDDING_URL}>Embedding</TermLink>:</strong> a
          numeric representation of text that allows meaning comparison. Example:
          “login” and “authentication” end up close in the vector space.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={LLM_URL}>LLM</TermLink>:</strong> a large
          language model such as GPT, Claude, or Gemini, used to generate text
          and score answers. Example: the assistant model that summarizes the
          graph report.
        </ArticleLi>
        <ArticleLi>
          <strong>Token:</strong> a unit of text the model processes. The context
          budget is counted in tokens. Example: a 1,500-token answer takes more
          window than a 300-token one.
        </ArticleLi>
        <ArticleLi>
          <strong>Snapshot:</strong> a picture of the repository state at one
          moment. Example: a graph built yesterday does not reflect today's
          commit until an update runs.
        </ArticleLi>
        <ArticleLi>
          <strong>Git hook:</strong> a script git runs on events such as commit
          and checkout. Example: the Graphify hook rebuilds the graph after a
          commit. See the{" "}
          <TermLink href={GIT_HOOKS_URL}>git hooks documentation</TermLink>.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>3. What Graphify is</ArticleH2>

      <ArticleP>
        <TermLink href={GRAPHIFY_URL}>Graphify</TermLink> is an open-source
        codebase mapping tool. It reads code, documentation, SQL, configuration,
        PDFs, and media, extracts concepts and relationships, builds a graph,
        and writes the result to files that can be queried later.
      </ArticleP>

      <ArticleP>
        There are two ways to use it. The first is the local CLI, installed from
        the <TermLink href={PYPI_URL}>graphifyy</TermLink> package, which also
        registers a skill in the agent. The second is{" "}
        <TermLink href={CLOUD_URL}>Graphify Cloud</TermLink>, which hosts the
        graph and exposes an <TermLink href={MCP_URL}>MCP</TermLink> server.
      </ArticleP>

      <ArticleP>
        The build flow has two tracks. Code goes through local structural
        extraction. Documents, PDFs, images, and video go through an optional
        semantic step that may use the assistant model or a configured backend.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Graphify flow: code and manifests go through local tree-sitter extraction; docs and media go through semantic extraction; both merge into resolution, communities, and graph.json, queried by query, path, and explain"
        chart={PIPELINE_CHART}
      />

      <ArticleP>
        The main output is a{" "}
        <ArticleCode>graphify-out/</ArticleCode> folder with four useful files:
      </ArticleP>

      <ArticleTable caption="Graphify outputs and what they are for">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>File</ArticleTh>
            <ArticleTh>What it is</ArticleTh>
            <ArticleTh>Practical use</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>graph.json</ArticleCode>
            </ArticleTd>
            <ArticleTd>Full graph with nodes, edges, and metadata</ArticleTd>
            <ArticleTd>
              Base for <ArticleCode>query</ArticleCode>,{" "}
              <ArticleCode>path</ArticleCode>, and{" "}
              <ArticleCode>explain</ArticleCode>
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>graph.html</ArticleCode>
            </ArticleTd>
            <ArticleTd>Interactive graph visualization</ArticleTd>
            <ArticleTd>Explore communities, search, and click nodes</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>GRAPH_REPORT.md</ArticleCode>
            </ArticleTd>
            <ArticleTd>Summary with key nodes, communities, and connections</ArticleTd>
            <ArticleTd>Quick architecture reading before investigating</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>manifest.json</ArticleCode>
            </ArticleTd>
            <ArticleTd>Extraction metadata and the analyzed set</ArticleTd>
            <ArticleTd>Audit what entered the graph</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>cache/</ArticleCode>
            </ArticleTd>
            <ArticleTd>Cache for incremental updates</ArticleTd>
            <ArticleTd>Do not commit; it speeds up rebuilds</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        The central point is that the graph is persistent. The agent does not
        need to rediscover the repository structure in every session. It can
        query the map that was already built.
      </ArticleP>

      <ArticleCallout variant="tip" title="A graph is not a summary">
        <ArticleP>
          A Markdown summary loses edges. The graph keeps the relationship
          between two points and lets you ask "what is the path between A and
          B?". That is the difference between reading a text about the system
          and navigating its structure.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>4. How the graph is built</ArticleH2>

      <ArticleP>
        The build happens in stages. Understanding the order helps interpret the
        result and diagnose an incomplete graph:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          Graphify lists relevant files and applies ignore rules such as{" "}
          <ArticleCode>.gitignore</ArticleCode> and{" "}
          <ArticleCode>.graphifyignore</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Each code file goes through a{" "}
          <TermLink href={TREE_SITTER_URL}>tree-sitter</TermLink> parser and
          becomes an <TermLink href={AST_URL}>AST</TermLink>. Functions,
          classes, imports, calls, and inheritance are extracted.
        </ArticleLi>
        <ArticleLi>
          Documents, PDFs, images, and transcripts may go through a semantic
          step that identifies concepts and relationships outside code.
        </ArticleLi>
        <ArticleLi>
          Relationships between files and symbols are resolved. A call to{" "}
          <ArticleCode>send()</ArticleCode> in another file becomes an edge
          between the matching nodes.
        </ArticleLi>
        <ArticleLi>
          The graph is split into communities with{" "}
          <TermLink href={LEIDEN_URL}>Leiden</TermLink> or{" "}
          <TermLink href={LOUVAIN_URL}>Louvain</TermLink>, and the groups
          receive names.
        </ArticleLi>
        <ArticleLi>
          The result is written to <ArticleCode>graph.json</ArticleCode>,{" "}
          <ArticleCode>graph.html</ArticleCode>, and{" "}
          <ArticleCode>GRAPH_REPORT.md</ArticleCode>.
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        According to the documentation, local extraction covers about 40
        languages. SQL and Terraform have dedicated extractors, and ambiguous
        formats can be declared in <ArticleCode>.graphifyrc</ArticleCode> so the
        parser does not pick the wrong language.
      </ArticleP>

      <ArticleH3>EXTRACTED is not INFERRED</ArticleH3>

      <ArticleP>
        Every edge carries a provenance label.{" "}
        <ArticleCode>EXTRACTED</ArticleCode> means the relationship was read
        directly from syntax. Example: an explicit{" "}
        <ArticleCode>import</ArticleCode> from{" "}
        <ArticleCode>AuthService</ArticleCode> to{" "}
        <ArticleCode>TokenService</ArticleCode>.
      </ArticleP>

      <ArticleP>
        <ArticleCode>INFERRED</ArticleCode> means the relationship came from a
        resolution step. Example: a dynamic call that the resolver associated
        with a likely function. The project documentation makes it clear that{" "}
        <ArticleCode>INFERRED</ArticleCode> does not necessarily mean
        "created by an <TermLink href={LLM_URL}>LLM</TermLink>". It can be static inference.
      </ArticleP>

      <ArticleP>
        The practical consequence is simple: extracted edges are stronger;
        inferred edges need a code check before becoming a conclusion. Graphify
        exposes that difference in its{" "}
        <TermLink href={PROVENANCE_URL}>provenance model</TermLink>.
      </ArticleP>

      <ArticleH3>What the graph does not see</ArticleH3>

      <ArticleP>
        Dynamic dispatch (when the called method is only decided at runtime),
        reflection (when code inspects types and members at runtime), generated
        code, templates, and dependencies resolved at runtime may stay out. An
        incomplete graph is a partial map, not a wrong graph. The final source
        remains the file and the test.
      </ArticleP>

      <ArticleH2>5. Installation and first graph</ArticleH2>

      <ArticleP>
        Graphify requires <TermLink href={PYTHON_URL}>Python</TermLink> 3.10 or
        newer. The recommended path uses <TermLink href={UV_URL}>uv</TermLink>;{" "}
        <TermLink href={PIPX_URL}>pipx</TermLink> also works. The official PyPI
        package is <ArticleCode>graphifyy</ArticleCode>, with two y's. The
        installed command is <ArticleCode>graphify</ArticleCode>.
      </ArticleP>

      <ArticleCode block language="bash">
        {`uv tool install graphifyy
graphify install`}
      </ArticleCode>

      <ArticleP>
        The first command installs the CLI in an isolated environment. The
        second detects the assistant and registers the skill. To choose the
        assistant, pass the platform:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify install --platform opencode
graphify install --platform codex
graphify install --platform gemini`}
      </ArticleCode>

      <ArticleP>
        Inside the assistant, the skill command builds the graph for the current
        folder:
      </ArticleP>

      <ArticleCode block language="bash">
        {`/graphify .
/graphify query "how does authentication reach the database"`}
      </ArticleCode>

      <ArticleP>
        If you want only the code graph, without sending documentation to any
        model, run the CLI in <ArticleCode>--code-only</ArticleCode> mode:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify extract . --code-only`}
      </ArticleCode>

      <ArticleP>
        This is the first test I would run. It answers the most important
        question: does the parser understand your project structure? If the code
        graph is already useful, the semantic docs step becomes an extra, not a
        dependency.
      </ArticleP>

      <ArticleH3>Optional extras</ArticleH3>

      <ArticleP>
        The base install does not cover every format. Extras are installed on
        demand:
      </ArticleP>

      <ArticleTable caption="Useful Graphify extras">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Extra</ArticleTh>
            <ArticleTh>Adds</ArticleTh>
            <ArticleTh>When it makes sense</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>mcp</ArticleCode>
            </ArticleTd>
            <ArticleTd>Local MCP server</ArticleTd>
            <ArticleTd>Agent that consumes tools instead of CLI</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>watch</ArticleCode>
            </ArticleTd>
            <ArticleTd>Rebuild on file changes</ArticleTd>
            <ArticleTd>Active development with a fresh graph</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>pdf</ArticleCode>
            </ArticleTd>
            <ArticleTd>PDF reading</ArticleTd>
            <ArticleTd>Repository with specs and papers</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>sql</ArticleCode>
            </ArticleTd>
            <ArticleTd>SQL schema extraction</ArticleTd>
            <ArticleTd>Data model needs to enter the map</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>office</ArticleCode>
            </ArticleTd>
            <ArticleTd>DOCX and XLSX</ArticleTd>
            <ArticleTd>Business documentation in documents and spreadsheets</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>leiden</ArticleCode>
            </ArticleTd>
            <ArticleTd>Leiden community detection</ArticleTd>
            <ArticleTd>Large graph where group quality matters</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>ollama</ArticleCode>
            </ArticleTd>
            <ArticleTd>Local backend for the semantic step</ArticleTd>
            <ArticleTd>Sensitive content that cannot leave the machine</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <ArticleCode>video</ArticleCode>
            </ArticleTd>
            <ArticleTd>Video and audio transcription</ArticleTd>
            <ArticleTd>Repository with recordings and demos</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleCallout variant="warning" title="Semantic step privacy">
        <ArticleP>
          Code is processed locally with tree-sitter. Documents, PDFs, and
          images may be sent to the assistant model or the configured backend.
          If the repository has restricted content, use{" "}
          <ArticleCode>--code-only</ArticleCode> or a local backend such as
          Ollama before running full extraction.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>6. Querying the graph</ArticleH2>

      <ArticleP>
        There are three query commands. They answer different questions, and
        choosing the right command saves time:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>query</ArticleCode>: finds relevant nodes and traverses
          relationships from them. Use it for broad questions such as "how does
          authentication reach the database?".
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>path</ArticleCode>: traces the shortest path between two
          nodes. Use it to learn how two points connect.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>explain</ArticleCode>: details one node, its source,
          community, and connections. Use it after finding a name in the result.
        </ArticleLi>
      </ArticleUl>

      <ArticleCode block language="bash">
        {`graphify query "authentication and session storage" --budget 1500
graphify path "login" "normalize_email"
graphify explain "normalize_email"`}
      </ArticleCode>

      <ArticleP>
        <ArticleCode>query</ArticleCode> uses breadth-first search by default.
        The <ArticleCode>--dfs</ArticleCode> flag follows a deeper chain, and{" "}
        <ArticleCode>--budget</ArticleCode> caps the response size in tokens:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify query "request validation" --dfs --budget 1500
graphify query "who calls send" --context calls
graphify query "what raises timeouts" --seed "TimeoutException" --budget 300`}
      </ArticleCode>

      <ArticleP>
        <ArticleCode>--seed</ArticleCode> starts from a node you already know.{" "}
        <ArticleCode>--context</ArticleCode> limits the edge type, such as{" "}
        <ArticleCode>calls</ArticleCode>. These two flags keep the query from
        spreading across the whole graph.
      </ArticleP>

      <ArticleH3>How to ask a good question</ArticleH3>

      <ArticleP>
        A question that is too broad becomes a node dump. A question that is too
        narrow finds nothing. The middle ground is to start from a subsystem and
        tighten the scope:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Good: "how does the authentication middleware reach the user
          repository?". The graph has clear starting points and a call
          direction.
        </ArticleLi>
        <ArticleLi>
          Weak: "explain the system". The query does not know where to start and
          returns a huge or irrelevant subgraph.
        </ArticleLi>
        <ArticleLi>
          Good: "who calls <ArticleCode>send()</ArticleCode>?" with{" "}
          <ArticleCode>--context calls</ArticleCode>. The edge limits the
          result.
        </ArticleLi>
        <ArticleLi>
          Weak: "where is authentication code?". That is a lexical search, not a
          structural question. <TermLink href={GREP_URL}>grep</TermLink> handles
          it better.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Query commands do not call an <TermLink href={LLM_URL}>LLM</TermLink>. They read{" "}
        <ArticleCode>graph.json</ArticleCode> locally. The exit code helps
        automation: <ArticleCode>0</ArticleCode> for an answer,{" "}
        <ArticleCode>3</ArticleCode> for an ambiguous name, and{" "}
        <ArticleCode>4</ArticleCode> for no matching node.
      </ArticleP>

      <ArticleH2>7. Keeping the graph current</ArticleH2>

      <ArticleP>
        A stale graph is worse than no graph, because it looks trustworthy.
        After the first build, install the git hooks (scripts git runs on events such as commit and checkout):
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify hook install
graphify hook status`}
      </ArticleCode>

      <ArticleP>
        The hooks rebuild the code graph after commits, branch switches, merges,
        pulls, and rebases. For documentation and image changes, run the update
        through the assistant or the CLI:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify update .
graphify extract . --update`}
      </ArticleCode>

      <ArticleP>
        The cache lives in <ArticleCode>graphify-out/cache/</ArticleCode> and
        should not be committed. The{" "}
        <TermLink href={INCREMENTAL_URL}>incremental update</TermLink> guide
        explains what each trigger covers.
      </ArticleP>

      <ArticleH3>Ignore what should not enter</ArticleH3>

      <ArticleP>
        Graphify respects <ArticleCode>.gitignore</ArticleCode> and accepts its
        own <ArticleCode>.graphifyignore</ArticleCode>. Use it to exclude build
        output, dependencies, and artifacts:
      </ArticleP>

      <ArticleCode block language="plaintext">
        {`node_modules/
dist/
coverage/
.next/`}
      </ArticleCode>

      <ArticleP>
        Project settings can go in a <ArticleCode>.graphifyrc</ArticleCode>,
        such as the default query budget and depth:
      </ArticleP>

      <ArticleCode block language="ini">
        {`query_budget=4000
query_depth=3`}
      </ArticleCode>

      <ArticleH2>8. Skills, MCP, and Graphify Cloud</ArticleH2>

      <ArticleP>
        The skill and MCP solve the same problem through different paths. The
        skill teaches the assistant to run the local CLI.{" "}
        <TermLink href={MCP_URL}>MCP</TermLink> exposes tools so the agent can
        query the graph without depending on the command line.
      </ArticleP>

      <ArticleP>
        The Graphify documentation lists support for Claude Code, Cursor, Codex,
        Gemini CLI, GitHub Copilot, OpenCode, and other assistants. The install
        command changes per platform:
      </ArticleP>

      <ArticleCode block language="bash">
        {`graphify install --platform opencode
graphify install --platform codex
graphify install --platform gemini`}
      </ArticleCode>

      <ArticleP>
        Graphify Cloud offers the hosted graph, with an MCP server at{" "}
        <ArticleCode>https://api.graphify.com/mcp</ArticleCode> using Streamable
        HTTP, OAuth, and no API key. The free plan covers up to three
        repositories, according to the documentation. For local and offline use,
        the open-source CLI remains the path.
      </ArticleP>

      <ArticleP>
        If you use both, choose which graph is the primary source. The
        documentation recommends not copying two unconditional instruction
        blocks into the project <ArticleCode>AGENTS.md</ArticleCode>. The guide to{" "}
        <TermLink href={ALWAYS_ON_URL}>make agents use the graph</TermLink>{" "}
        shows what each integration writes.
      </ArticleP>

      <ArticleH2>9. Benchmarks: what improves and what it does not prove</ArticleH2>

      <ArticleP>
        The project publishes benchmarks on its own harness, with the same
        model, budget, and judge for the compared tools. Harness, here, is the
        standardized environment that runs every system; the judge is the model
        that scores answers against expected facts.
      </ArticleP>

      <ArticleP>
        Before the numbers, it helps to understand what each name measures.
        Without that, the table becomes a loose ranking:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong><TermLink href={LOCOMO_URL}>LOCOMO</TermLink>:</strong>{" "}
          public multi-session conversational memory dataset. Example: questions
          that depend on facts stated in earlier conversations.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={LONGMEMEVAL_URL}>LongMemEval-S</TermLink>:</strong>{" "}
          long-horizon memory dataset with questions that require recalling
          distant information.
        </ArticleLi>
        <ArticleLi>
          <strong>recall@10:</strong> how many of the first 10 retrieved results
          contain the right answer. Higher is better.
        </ArticleLi>
        <ArticleLi>
          <strong>QA accuracy:</strong> percentage of final answers that are
          correct, scored by a judge against expected facts.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={ERPNEXT_URL}>ERPNext</TermLink>:</strong>{" "}
          open-source ERP system used as a large code repository in the code
          intelligence test.
        </ArticleLi>
        <ArticleLi>
          <strong>Key-fact coverage:</strong> how many expected key facts appear
          in the agent answer.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={BM25_URL}>BM25</TermLink>:</strong> classic
          lexical search algorithm based on term frequency. Example: it finds
          documents that repeat the query words, but it does not understand
          relationships.
        </ArticleLi>
        <ArticleLi>
          <strong>dense RAG:</strong> retrieval through embeddings, which looks
          for semantically similar chunks. RAG stands for Retrieval-Augmented
          Generation. See{" "}
          <TermLink href={RAG_URL}>RAG</TermLink>.
        </ArticleLi>
        <ArticleLi>
          <strong><TermLink href={MEM0_URL}>mem0</TermLink> and{" "}
          <TermLink href={SUPERMEMORY_URL}>supermemory</TermLink>:</strong>{" "}
          agent memory systems used as comparison.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        The table below summarizes the published numbers:
      </ArticleP>

      <ArticleTable caption="Benchmarks published by the Graphify project">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Suite</ArticleTh>
            <ArticleTh>Metric</ArticleTh>
            <ArticleTh>Graphify</ArticleTh>
            <ArticleTh>Comparison</ArticleTh>
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
            <ArticleTd>QA accuracy</ArticleTd>
            <ArticleTd>45.3%</ArticleTd>
            <ArticleTd>supermemory 49.7% at about 11x the cost; mem0 27.3%</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>LongMemEval-S</ArticleTd>
            <ArticleTd>QA accuracy</ArticleTd>
            <ArticleTd>76%</ArticleTd>
            <ArticleTd>Ties with dense RAG</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>ERPNext</ArticleTd>
            <ArticleTd>Code key-fact coverage</ArticleTd>
            <ArticleTd>82.0%</ArticleTd>
            <ArticleTd>grep and read 70.8%</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Build cost</ArticleTd>
            <ArticleTd><TermLink href={LLM_URL}>LLM</TermLink> credits</ArticleTd>
            <ArticleTd>0</ArticleTd>
            <ArticleTd>Competitors pay per-token ingest</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        The LOCOMO and LongMemEval numbers come from conversational memory
        datasets. The ERPNext test uses a large Python repository and measures
        key-fact coverage with a fixed agent. The benchmark also reports about
        140 thousand tokens per query in the code scenario and an ingest cost of
        roughly US$ 1.40 on LOCOMO.
      </ArticleP>

      <ArticleP>
        What the data suggests: a persistent graph can retrieve context with
        less raw reading and keep structure across sessions. What it does not
        prove: that Graphify will be better in your repository, language, and
        question type. The harness belongs to the project, and a vendor
        benchmark does not replace local measurement.
      </ArticleP>

      <ArticleCallout variant="note" title="About the 80% number">
        <ArticleP>
          Marketing material mentions cutting up to 80% of agent token spend.
          Treat that number as a product claim. The verifiable data in the code
          benchmark is different: 82.0% coverage against 70.8% for grep and read,
          with the context cost described in the report. Measure your case
          before promising the same gain.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>10. When to use it and when to avoid it</ArticleH2>

      <ArticleP>
        Graphify shines when the question crosses files and structure matters
        more than text. The flowchart summarizes the first decision:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Usage decision: if the question crosses several files and the repository is large or unfamiliar, use Graphify; otherwise use grep and targeted reading"
        chart={DECISION_CHART}
      />

      <ArticleH3>Signals that it is worth it</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Onboarding a large repository: the graph shows communities and central
          concepts before you open twenty files.
        </ArticleLi>
        <ArticleLi>
          Monorepo (one repository with several projects and services): impact questions and paths between
          modules become cheaper.
        </ArticleLi>
        <ArticleLi>
          Architecture review: <ArticleCode>GRAPH_REPORT.md</ArticleCode> and{" "}
          <ArticleCode>graph.html</ArticleCode> give a view the diff cannot.
        </ArticleLi>
        <ArticleLi>
          Agent that repeats the same reading: the persistent graph avoids
          rediscovering the structure every session.
        </ArticleLi>
        <ArticleLi>
          Code and documentation on the same map: decisions recorded in ADRs
          (architecture decision records) or RFCs (technical proposals) gain
          their own nodes.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Signals that it is not worth it</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Small, familiar repository: <TermLink href={GREP_URL}>grep</TermLink>{" "}
          and targeted reading solve it without ceremony.
        </ArticleLi>
        <ArticleLi>
          Generated or highly dynamic code: the parser sees less than the
          runtime does, and the graph has gaps.
        </ArticleLi>
        <ArticleLi>
          Need for exact truth in real time: the graph is a snapshot. The file
          and the test remain the source.
        </ArticleLi>
        <ArticleLi>
          Restricted content that cannot go through a model: the semantic docs
          step may send data to the backend. Use{" "}
          <ArticleCode>--code-only</ArticleCode> or a local model.
        </ArticleLi>
        <ArticleLi>
          Team without an update routine: a stale graph misleads. If nobody runs
          hooks or updates, the map loses value.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Rule of thumb">
        <ArticleP>
          If the question fits a textual search, use grep. If the question
          depends on relationships between parts, try the graph. If the graph
          answers without opening the file, it paid for itself. If you open the
          file anyway, the graph served as an index, not as the answer.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>11. Recommended workflow</ArticleH2>

      <ArticleP>
        The order below avoids starting with the most expensive path. The first
        goal is to prove the parser understands the project, not to build the
        most complete graph possible:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          Install <ArticleCode>graphifyy</ArticleCode> with uv or pipx and run{" "}
          <ArticleCode>graphify install</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Build the code graph with{" "}
          <ArticleCode>graphify extract . --code-only</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          Open <ArticleCode>graph.html</ArticleCode> and read{" "}
          <ArticleCode>GRAPH_REPORT.md</ArticleCode> to check whether the main
          nodes make sense.
        </ArticleLi>
        <ArticleLi>
          Test three real questions with <ArticleCode>query</ArticleCode>,{" "}
          <ArticleCode>path</ArticleCode>, and <ArticleCode>explain</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          If the result helps, add docs and PDFs with the extras and configure
          the semantic backend.
        </ArticleLi>
        <ArticleLi>
          Install <ArticleCode>graphify hook install</ArticleCode> and confirm
          with <ArticleCode>graphify hook status</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          For the team, version <ArticleCode>graph.json</ArticleCode> and{" "}
          <ArticleCode>GRAPH_REPORT.md</ArticleCode>; keep{" "}
          <ArticleCode>cache/</ArticleCode> out of git.
        </ArticleLi>
        <ArticleLi>
          Choose between local skill and MCP, and register only the query path
          the agent actually uses.
        </ArticleLi>
      </ArticleOl>

      <ArticleH2>12. Common mistakes</ArticleH2>

      <ArticleUl>
        <ArticleLi>
          <strong>Treating INFERRED as fact.</strong> An inferred edge is a
          clue, not proof. Open the cited file before making an architecture
          decision.
        </ArticleLi>
        <ArticleLi>
          <strong>Asking too broadly.</strong> "Explain the system" returns a
          huge subgraph. Start from a subsystem and use{" "}
          <ArticleCode>--budget</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <strong>Forgetting updates.</strong> Without a hook or{" "}
          <ArticleCode>update</ArticleCode>, the graph ages and points to code
          that changed.
        </ArticleLi>
        <ArticleLi>
          <strong>Committing the cache.</strong> The cache speeds up local
          builds but is not a team artifact. Version the graph and the report.
        </ArticleLi>
        <ArticleLi>
          <strong>Assuming docs are local by default.</strong> Code is local.
          The semantic document step may use the assistant model or a configured
          backend.
        </ArticleLi>
        <ArticleLi>
          <strong>Using the graph as a test replacement.</strong> The map shows
          relationships, not behavior. A test remains a test.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Key takeaways</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <TermLink href={GRAPHIFY_URL}>Graphify</TermLink> turns the codebase
          into a queryable graph, not another chat.
        </ArticleLi>
        <ArticleLi>
          Code is extracted locally with tree-sitter; docs and media use an
          optional semantic step.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>query</ArticleCode>, <ArticleCode>path</ArticleCode>, and{" "}
          <ArticleCode>explain</ArticleCode> answer different questions. Choose
          by question type.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>EXTRACTED</ArticleCode> is stronger than{" "}
          <ArticleCode>INFERRED</ArticleCode>. Check inferred edges in the code.
        </ArticleLi>
        <ArticleLi>
          The graph needs updates. Hooks and <ArticleCode>update</ArticleCode>{" "}
          prevent a stale map.
        </ArticleLi>
        <ArticleLi>
          Project benchmarks show gains in recall and coverage, but they do not
          replace measurement in your repository.
        </ArticleLi>
        <ArticleLi>
          Use it for large repositories, structural questions, and context that
          must persist. For simple textual search, grep still wins.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusion</ArticleH3>

      <ArticleP>
        <TermLink href={GRAPHIFY_URL}>Graphify</TermLink> solves a concrete
        problem: the agent forgets the project structure between sessions and
        spends context rediscovering the obvious. The persistent graph provides
        a stable map with provenance and relationship queries.
      </ArticleP>

      <ArticleP>
        The value does not come from replacing grep with a new tool. It comes
        from using the right tool for the right question. Textual search for
        text. Graph for relationships. File and test for the final truth.
      </ArticleP>

      <ArticleH3>Sources and further reading</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <TermLink href={GRAPHIFY_WHAT_URL}>Graphify: what it is</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={DOCS_URL}>Official documentation</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={INSTALL_URL}>Installation and extras</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={QUICKSTART_URL}>Skill quickstart</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={QUERYING_URL}>Query guide</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={ARCHITECTURE_URL}>How the graph is built</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={GITHUB_URL}>GitHub repository</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={PYPI_URL}>graphifyy on PyPI</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={BENCHMARKS_URL}>Project benchmarks</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={CLOUD_URL}>Graphify Cloud</TermLink>,{" "}
          <TermLink href={PROVENANCE_URL}>provenance</TermLink>,{" "}
          <TermLink href={INCREMENTAL_URL}>incremental updates</TermLink>, and{" "}
          <TermLink href={ALWAYS_ON_URL}>agents using the graph</TermLink>
        </ArticleLi>
        <ArticleLi>
          Datasets and comparisons:{" "}
          <TermLink href={LOCOMO_URL}>LOCOMO</TermLink>,{" "}
          <TermLink href={LONGMEMEVAL_URL}>LongMemEval</TermLink>,{" "}
          <TermLink href={ERPNEXT_URL}>ERPNext</TermLink>,{" "}
          <TermLink href={BM25_URL}>BM25</TermLink>,{" "}
          <TermLink href={RAG_URL}>RAG</TermLink>,{" "}
          <TermLink href={MEM0_URL}>mem0</TermLink>, and{" "}
          <TermLink href={SUPERMEMORY_URL}>supermemory</TermLink>
        </ArticleLi>
        <ArticleLi>
          Tools and concepts: <TermLink href={UV_URL}>uv</TermLink>,{" "}
          <TermLink href={PIPX_URL}>pipx</TermLink>,{" "}
          <TermLink href={PYTHON_URL}>Python</TermLink>,{" "}
          <TermLink href={EMBEDDING_URL}>embedding</TermLink>,{" "}
          <TermLink href={LLM_URL}>LLM</TermLink>,{" "}
          <TermLink href={VECTOR_DB_URL}>vector store</TermLink>, and{" "}
          <TermLink href={GIT_HOOKS_URL}>git hooks</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={MCP_URL}>Model Context Protocol</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={TREE_SITTER_URL}>Tree-sitter</TermLink> and{" "}
          <TermLink href={AST_URL}>AST</TermLink>
        </ArticleLi>
        <ArticleLi>
          <TermLink href={KNOWLEDGE_GRAPH_URL}>Knowledge graph</TermLink>,{" "}
          <TermLink href={LEIDEN_URL}>Leiden</TermLink>, and{" "}
          <TermLink href={LOUVAIN_URL}>Louvain</TermLink>
        </ArticleLi>
      </ArticleUl>
    </>
  );
}
