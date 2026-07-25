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
  Client["1. MCP client / Agent"]
  MCP["2. MCP server"]
  SearX["3. Local SearXNG"]
  Engines["4. External engines"]

  Client -->|"search_web / fetch_url"| MCP
  MCP -->|"local HTTP JSON"| SearX
  SearX -->|"query"| Engines
  Engines -->|"hits"| SearX
  SearX -->|"unified JSON"| MCP
  MCP -->|"context"| Client`;

const SEARXNG_COMPARE_CHART = `flowchart TB
  subgraph Direct["A: direct scraper"]
    direction TB
    A1["Agent"] --> A2["1 engine"]
    A2 --> A3["Blocks / CAPTCHA"]
  end

  subgraph Paid["B: paid SaaS"]
    direction TB
    B1["Agent"] --> B2["Paid provider"]
    B2 --> B3["Cost + quota"]
  end

  subgraph Meta["C: local SearXNG"]
    direction TB
    C1["Agent + MCP"] --> C2["SearXNG"]
    C2 --> C3["Many engines + JSON"]
  end

  Direct --> Pick["Choice: C"]
  Paid --> Pick
  Meta --> Pick`;

const DECISION_CHART = `flowchart TB
  Start["Web search in the agent"]

  Start --> A["A: scraper MCP"]
  Start --> B["B: MCP + SearXNG"]
  Start --> C["C: custom MCP"]

  A --> ResultA["Smoke test"]
  B --> ResultB["Daily use"]
  C --> ResultC["High effort"]

  ResultB --> Decide["Decision: B"]`;

const PROBLEM_CHART = `flowchart TB
  Need["Agent needs the web"]
  Need --> Paid["Paid search API"]
  Need --> Scrape["Direct scraper MCP"]
  Paid --> PainPaid["Quota / cost / privacy"]
  Scrape --> PainScrape["CAPTCHA / blocks / HTML"]
  PainPaid --> Gap["Need stable local search"]
  PainScrape --> Gap`;

const OPTION_A_CHART = `flowchart LR
  Ag["Agent"] --> Mcp["Ready MCP"]
  Mcp --> Http["HTTP to engine"]
  Http --> Html["HTML / endpoint"]
  Html --> Parse["Parser"]
  Parse --> Out["Snippets"]
  Html -.-> Fail["CAPTCHA / 429"]`;

const OPTION_B_CHART = `flowchart LR
  Ag["Agent"] --> Mcp["Ready MCP"]
  Mcp --> Sx["Local SearXNG"]
  Sx --> Eng["Engines"]
  Eng --> Sx
  Sx --> Mcp
  Mcp --> Ag`;

const SCRAPER_VS_SEARXNG_CHART = `flowchart TB
  subgraph Scraper["Scraper MCP"]
    direction TB
    S1["Agent"] --> S2["MCP"]
    S2 --> S3["1 engine HTML"]
    S3 --> S4["CAPTCHA / 429"]
  end

  subgraph Meta["Local SearXNG"]
    direction TB
    M1["Agent"] --> M2["MCP"]
    M2 --> M3["JSON 127.0.0.1"]
    M3 --> M4["Many engines"]
    M4 --> M5["Aggregate result"]
  end`;

const OPTION_C_CHART = `flowchart LR
  Ag["Agent"] -->|"stdio"| Custom["Your MCP SDK"]
  Custom --> Code["Your code"]
  Code --> Web["HTTP / scraper / API"]`;

const MCP_ROLES_CHART = `flowchart TB
  Host["Host: Cursor / Copilot"]
  Client["MCP client"]
  Server["MCP server"]
  Host --> Client
  Client -->|"tools / JSON-RPC"| Server`;

const SETUP_CHART = `flowchart LR
  F1["1. SearXNG Docker"] --> F2["2. MCP in client"]
  F2 --> F3["3. Quick acceptance"]`;

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

export function BuscaWebLocalMcpSearxngContentEn() {
  return (
    <>
      <ArticleH2>1. The problem that showed up in real use</ArticleH2>

      <ArticleP>
        This post is how I set up stable web search for an AI agent on my
        machine. No paid search API. No fragile scraper.
      </ArticleP>

      <ArticleP>
        The stack is ready-made{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>{" "}
        + local{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>{" "}
        on Docker. Before the setup, the problem that got me here.
      </ArticleP>

      <ArticleP>
        Day to day, the agent needs information that is not in the repo and not
        in the model’s training memory:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>docs that changed yesterday</ArticleLi>
        <ArticleLi>SDK changelog</ArticleLi>
        <ArticleLi>issue opened overnight</ArticleLi>
        <ArticleLi>endpoint the API deprecated</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Without reliable web access, the agent guesses the wrong version, invents a
        detail, or keeps asking for confirmation. The session stalls.
      </ArticleP>

      <ArticleP>
        The loop I want is straightforward:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>search</ArticleLi>
        <ArticleLi>read a solid chunk</ArticleLi>
        <ArticleLi>apply in code</ArticleLi>
        <ArticleLi>validate</ArticleLi>
      </ArticleOl>

      <ArticleP>
        When search fails in the middle, the rest falls apart. The agent retries,
        hallucinates, or interrupts you. In long sessions that becomes real
        friction.
      </ArticleP>

      <ArticleP>
        I compared three paths and kept the third: paid API, scraper MCP, local
        metasearch. Next: what hurts with commercial APIs, why a “free” scraper
        fools you in a smoke test, and what “local” means in this text.
      </ArticleP>

      <ArticleH3>Where paid search APIs start to hurt</ArticleH3>

      <ArticleP>
        Commercial APIs work fine when volume is low and predictability matters
        more than the bill at the end of the month.
      </ArticleP>

      <ArticleP>
        Agent-assisted development is not “two queries a day”. It is
        exploration: open several fronts, compare docs, chase issues, and
        backtrack when a hypothesis falls apart.
      </ArticleP>

      <ArticleP>
        At that pace, three things tighten:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>price climbs fast</ArticleLi>
        <ArticleLi>
          quota and{" "}
          <a
            href="https://en.wikipedia.org/wiki/Rate_limiting"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            rate limits
          </a>{" "}
          show up when you want speed
        </ArticleLi>
        <ArticleLi>
          sensitive terms (client, stack, incident) leave your machine for a
          third-party{" "}
          <a
            href="https://en.wikipedia.org/wiki/Software_as_a_service"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            SaaS
          </a>
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        If the vendor changes pricing, policy, or availability, your local
        workflow breaks with it.
      </ArticleP>

      <ArticleH3>Free scrapers and the false win</ArticleH3>

      <ArticleP>
        Another common path is a ready-made{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>{" "}
        that scrapes a public engine directly (DuckDuckGo and friends).
      </ArticleP>

      <ArticleP>
        Here “tool” is not a generic word. In{" "}
        <a
          href="https://modelcontextprotocol.io/docs/concepts/tools"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>
        , a tool is a named action the agent can ask the host to run: a name,
        inputs, and a structured result. The model does not open the browser on
        its own. The agent asks for the tool, the host runs the MCP server, and
        the text comes back so the model can continue.
      </ArticleP>

      <ArticleP>
        In this search package, the tools that matter are these:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>search_web</ArticleCode>: searches the web and returns
          titles, links, and snippets
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>fetch_url</ArticleCode> (when the package has it): opens
          a specific URL and returns the content to read
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        In practice the scraper flow is this:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          the agent asks for the <ArticleCode>search_web</ArticleCode> tool
        </ArticleLi>
        <ArticleLi>the MCP server fetches the page over HTTP</ArticleLi>
        <ArticleLi>the MCP server tries to parse HTML</ArticleLi>
        <ArticleLi>
          the MCP server returns links and snippets to the model
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        In a smoke test the flow feels like magic: no account, no Docker, an answer
        right away.
      </ArticleP>

      <ArticleP>
        Under continuous use, the story changes:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>IP gets blocked</ArticleLi>
        <ArticleLi>
          <a
            href="https://en.wikipedia.org/wiki/CAPTCHA"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            CAPTCHA
          </a>{" "}
          appears
        </ArticleLi>
        <ArticleLi>page layout shifts and the parser breaks</ArticleLi>
        <ArticleLi>latency turns into a roulette wheel</ArticleLi>
      </ArticleUl>

      <ArticleP>
        The failure rate rises in the exact pattern of an autonomous agent: many
        bursty queries, for hours. That is the same mechanism as option A in the
        next section.
      </ArticleP>

      <ArticleP>
        The diagram below summarizes what you just read:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>the agent needs to query the web</ArticleLi>
        <ArticleLi>
          paid API fails under continuous use because of quota and privacy
        </ArticleLi>
        <ArticleLi>
          public scraper MCP fails from blocks and CAPTCHA
        </ArticleLi>
        <ArticleLi>
          the path I looked for: SearXNG + MCP on my machine, and the agent
          talks to that local service
        </ArticleLi>
      </ArticleUl>

      <ArticleMermaid
        ariaLabel="Problem: paid API and scraper MCP fail; a stable local search service is missing"
        chart={PROBLEM_CHART}
      />

      <ArticleCallout variant="note" title="What I mean by “local” here">
        <ArticleP>
          Local does not mean offline. It means SearXNG and MCP run on your
          machine.
        </ArticleP>
        <ArticleP>
          You remove the search SaaS middleman and host the orchestration (
          <a
            href="https://docs.searxng.org/"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            SearXNG
          </a>{" "}
          + MCP) there. The public internet still exists. External engines still
          get queried. The difference: the layer the agent sees stays under your
          domain (port, secret, lifecycle, and what is exposed on the network).
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Official baselines if you want them:{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Model Context Protocol
        </a>{" "}
        and the{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG docs
        </a>
        .
      </ArticleP>

      <ArticleH2>2. Three paths I put on the table</ArticleH2>

      <ArticleP>
        I was not hunting the most sophisticated architecture. I wanted the
        option that stays stable for daily use, with the lowest ownership cost I
        could accept. Three routes showed up naturally. Before the diagram, it
        is worth understanding each one in text.
      </ArticleP>

      <ArticleH3>Option A: ready-made MCP with a direct public scraper</ArticleH3>

      <ArticleP>
        In this option you install a ready-made search MCP package (via{" "}
        <a
          href="https://docs.npmjs.com/cli/v10/commands/npm-exec"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          npx
        </a>{" "}
        / Node) and point the agent client at the MCP package. No Docker, no metasearch
        config, no server to write. In a few minutes the agent gets a tool like{" "}
        <ArticleCode>search_web</ArticleCode>: the agent asks for a query, the MCP
        server runs the search, and the MCP server returns titles, links, and snippets for
        the model to use on the next step.
      </ArticleP>

      <ArticleP>
        The detail that matters is <em>how</em> that package searches. Usually
        the package acts as a scraper: the package opens (over HTTP) the “public” page or endpoint
        of an engine (DuckDuckGo and friends), reads HTML or a semi-structured
        response, and tries to extract results. There is no stable official API
        in the middle. MCP is only the adapter that turns “agent tool” into
        “HTTP request + parsing”. Near-zero setup, no local infra, immediate
        result. Great for validating the idea in fifteen minutes.
      </ArticleP>

      <ArticleP>
        As a continuous base, that line breaks fast. Search sites defend the
        surface with anti-bot systems,{" "}
        <a
          href="https://en.wikipedia.org/wiki/CAPTCHA"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          CAPTCHAs
        </a>{" "}
        (challenges meant to prove a human is querying), and{" "}
        <a
          href="https://en.wikipedia.org/wiki/Rate_limiting"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          rate limits
        </a>{" "}
        (caps on requests per IP/time). HTML changes without notice and the
        parser goes quiet. In a long session the agent fires many queries in
        bursts: exactly the pattern anti-abuse punishes first. The tool becomes
        a roulette wheel. I used this as a quick experiment and dropped that approach as
        the main line.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Option A flow: agent, scraper MCP, HTML, and failure from CAPTCHA or rate-limit"
        chart={OPTION_A_CHART}
      />

      <ArticleH3>Option B: ready-made MCP + local SearXNG on Docker</ArticleH3>

      <ArticleP>
        Here the flow changes roles. The{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>{" "}
        package stops scraping the web on its own. The MCP package becomes an HTTP client of
        a service <em>you</em> host:{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>
        . In practice the flow is this:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          the agent asks for the <ArticleCode>search_web</ArticleCode> tool
        </ArticleLi>
        <ArticleLi>
          the MCP server builds a GET/POST to{" "}
          <ArticleCode>http://127.0.0.1:…/search?format=json</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          SearXNG fans the query out across several engines
        </ArticleLi>
        <ArticleLi>
          SearXNG aggregates, deduplicates, and returns unified JSON
        </ArticleLi>
        <ArticleLi>
          the MCP hands the <ArticleCode>search_web</ArticleCode> result back to
          the model
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        The agent never “opens Chrome”. The agent only consumes the{" "}
        <ArticleCode>search_web</ArticleCode> tool result (and, if a page needs
        reading, can ask for <ArticleCode>fetch_url</ArticleCode> next).
      </ArticleP>

      <ArticleP>
        SearXNG is a{" "}
        <a
          href="https://en.wikipedia.org/wiki/Metasearch_engine"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          metasearch
        </a>
        : instead of being another Google, SearXNG orchestrates search engines and
        sources (Google, Bing, DuckDuckGo, and others depending on config) and
        cleans a good chunk of noise into one response. Running that in{" "}
        <a
          href="https://docs.docker.com/get-started/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Docker
        </a>{" "}
        on{" "}
        <a
          href="https://en.wikipedia.org/wiki/Localhost"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          loopback
        </a>{" "}
        (<ArticleCode>127.0.0.1</ArticleCode>) means: the process stays isolated
        in a container, comes up with compose, and the JSON API only listens on
        your machine. You get pragmatism (mature MCP, no reinventing the
        protocol), zero search API cost, better privacy because queries stay on
        your machine first, and control of port, secret, and lifecycle.
      </ArticleP>

      <ArticleP>
        The price is operational, not SaaS billing: keep the container up,
        enable the JSON format, accept that external engines can still degrade.
        Even so, one bad engine rarely takes down the whole metasearch. For
        daily agent use, this was the line that survived.
      </ArticleP>

      <ArticleP>
        If the question is “isn’t this just another scraper?” or “why don’t{" "}
        <a
          href="https://en.wikipedia.org/wiki/Rate_limiting"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          rate limits
        </a>{" "}
        and IP blocks kill it the same way?”, the short answer is in the next
        section, in the SearXNG vs scraper block.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Option B flow: agent, MCP, local SearXNG, and engines"
        chart={OPTION_B_CHART}
      />

      <ArticleH3>Option C: custom MCP with the SDK</ArticleH3>

      <ArticleP>
        The third route is writing your own MCP server. In TypeScript that
        usually goes through the official{" "}
        <ArticleCode>@modelcontextprotocol/sdk</ArticleCode> package: you start
        a Node process, register tools (name, input schema, handler), and talk
        to the agent client over the protocol transport (on desktop, usually{" "}
        <a
          href="https://modelcontextprotocol.io/specification/2025-06-18/basic/transports"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          stdio
        </a>
        , meaning the agent app starts the process and exchanges messages on
        standard input/output). Inside, each “search” becomes your code: HTTP to
        SearXNG, to a paid API, or a homemade scraper.
      </ArticleP>

      <ArticleP>
        A custom MCP is totally doable. The question is focus and ownership. For the goal
        “stable web search in the agent”, you become the owner of timeouts,
        parsing, engine fallbacks, 403/429 handling, payload size, bug reports,
        and your server’s changelog. Any improvement a mature MCP package already
        ships turns into an internal ticket. Versus “ready-made MCP + SearXNG”,
        the net gain is usually low: you rebuild the same bridge with more
        surface to maintain.
      </ArticleP>

      <ArticleP>
        I discarded C on pragmatism. I want low ownership and daily results, not
        another internal piece whose only advantage was “we wrote it”. If later
        I need a very specific tool (internal policy, domain filter, telemetry),
        the SDK comes back to the table.         For generic, stable web search, no.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Option C flow: agent, custom MCP with SDK, and your own code to the web"
        chart={OPTION_C_CHART}
      />

      <ArticleP>
        With all three options on paper, the flow below only summarizes the
        decision. If you read the paragraphs above, the diagram should feel
        obvious, not mysterious.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Decision flow across options A, B, and C"
        chart={DECISION_CHART}
      />

      <ArticleTable caption="Quick comparison of the three options">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Criterion</ArticleTh>
            <ArticleTh>A: Scraper MCP</ArticleTh>
            <ArticleTh>B: MCP + SearXNG</ArticleTh>
            <ArticleTh>C: Custom MCP</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Financial cost</ArticleTd>
            <ArticleTd>Low until the scraper fails</ArticleTd>
            <ArticleTd>Zero API spend</ArticleTd>
            <ArticleTd>High engineering time</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Stability / rate limits</ArticleTd>
            <ArticleTd>Fragile</ArticleTd>
            <ArticleTd>Good, with aggregation</ArticleTd>
            <ArticleTd>Depends on the implementation</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Effort to get live</ArticleTd>
            <ArticleTd>Minimal</ArticleTd>
            <ArticleTd>Moderate</ArticleTd>
            <ArticleTd>High</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Privacy</ArticleTd>
            <ArticleTd>Low to medium</ArticleTd>
            <ArticleTd>High (service on your machine)</ArticleTd>
            <ArticleTd>High, if done well</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Fits the real goal?</ArticleTd>
            <ArticleTd>Smoke test only</ArticleTd>
            <ArticleTd>Daily use</ArticleTd>
            <ArticleTd>Overengineering</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleCallout variant="tip" title="The call">
        <ArticleP>
          I stayed with B. Option B solves stability and privacy without turning the
          solution into an eternal internal maintenance product. Option B is the
          smallest architecture that survives a week of real use, not only a
          Friday demo.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. What SearXNG is (and why SearXNG belongs here)</ArticleH2>

      <ArticleP>
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>{" "}
        is an open-source, self-hostable{" "}
        <a
          href="https://en.wikipedia.org/wiki/Metasearch_engine"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          metasearch
        </a>{" "}
        engine. SearXNG is not “another Google”. SearXNG aggregates results from multiple
        services and databases (Google, Bing, DuckDuckGo, and dozens of others
        depending on your config) and returns a unified view. You search once;
        underneath SearXNG fans out the query and merges the response.
      </ArticleP>

      <ArticleP>
        The project is built with privacy in mind: the instance does not need to
        track or profile the user the way a commercial search engine does by
        default. In a local setup that becomes even clearer. Orchestration lives
        on your machine, sensitive history does not have to cross a search SaaS,
        and you decide what stays exposed.
      </ArticleP>

      <ArticleP>
        I picked SearXNG for three practical reasons. First, SearXNG already handles
        aggregation and result normalization, so the MCP does not have to become
        a fragile HTML scraper. Second, the{" "}
        <a
          href="https://www.json.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          JSON
        </a>{" "}
        API is direct enough for an agent to consume without hacks. Third, the
        community maintains a Docker image and docs solid enough to stand up in
        minutes and operate day to day without turning this into an endless side
        project.
      </ArticleP>

      <ArticleH3>SearXNG vs scraper: what changes about blocking</ArticleH3>

      <ArticleP>
        The question I hear most: isn’t{" "}
        <a
          href="https://docs.searxng.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG
        </a>{" "}
        just another scraper? Why don’t{" "}
        <a
          href="https://en.wikipedia.org/wiki/Rate_limiting"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          rate limits
        </a>{" "}
        and IP blocks kill the tool the same way?
      </ArticleP>

      <ArticleP>
        Short answer: the design is different. And SearXNG is not immune to
        blocks either. What changes is who fails and how failure shows up in the
        session.
      </ArticleP>

      <ArticleP>
        On the scraper MCP path (option A), the MCP server goes straight to a
        public engine, downloads HTML (or a “public” endpoint), and tries to
        parse it. One engine. One parser. One single point. In an agent burst,
        that looks like a bot:{" "}
        <a
          href="https://en.wikipedia.org/wiki/CAPTCHA"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          CAPTCHA
        </a>
        , 429, and a flagged IP. If that engine closes the door, the whole tool
        dies.
      </ArticleP>

      <ArticleP>
        On option B each piece changes role. The{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>{" "}
        package stops going to the public web. The MCP becomes only a local
        bridge to{" "}
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
        The process, from the agent request to the answer, is this:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          the agent calls the <ArticleCode>search_web</ArticleCode> tool with a
          query
        </ArticleLi>
        <ArticleLi>
          the MCP server builds a local HTTP request to SearXNG on{" "}
          <a
            href="https://en.wikipedia.org/wiki/Localhost"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            127.0.0.1
          </a>{" "}
          (this machine only), asking for JSON, not HTML
        </ArticleLi>
        <ArticleLi>
          SearXNG, as a{" "}
          <a
            href="https://en.wikipedia.org/wiki/Metasearch_engine"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            metasearch
          </a>
          , forwards the same query to several engines (Google, Bing, DuckDuckGo,
          and others you enabled)
        </ArticleLi>
        <ArticleLi>
          each engine returns hits; SearXNG merges them, drops duplicates, and
          builds one JSON payload
        </ArticleLi>
        <ArticleLi>
          the MCP hands that JSON to the model as the{" "}
          <ArticleCode>search_web</ArticleCode> result
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        In one sentence: the MCP does not “scrape Google”. The MCP only talks to
        SearXNG on your machine. SearXNG is what talks to the internet.
      </ArticleP>

      <ArticleP>
        That is why blocking hurts less day to day:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          the MCP does not depend on one public HTML page to survive
        </ArticleLi>
        <ArticleLi>
          if one engine tightens (Google, for example), other active engines can
          still respond
        </ArticleLi>
        <ArticleLi>
          the fragile parser leaves the MCP package; aggregation stays in
          SearXNG
        </ArticleLi>
        <ArticleLi>
          failure becomes partial degradation (“fewer sources”), not a total
          roulette wheel for the tool
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="note" title="IP and rate limits: the honest cut">
        <ArticleP>
          Requests to engines still leave from your IP (home, office, VPN). A
          specific engine can limit, degrade, or ask for CAPTCHA. SearXNG does
          not make you invisible.
        </ArticleP>
        <ArticleP>
          What this stack avoids is the total failure typical of a scraper:
          hammering one public HTML endpoint until anti-abuse closes the door.
          With several engines and stable local JSON, the agent tool stays
          useful even when one source goes bad.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        The diagram below only contrasts the two designs you just read:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Contrast: scraper MCP with one HTML engine versus local SearXNG with many engines"
        chart={SCRAPER_VS_SEARXNG_CHART}
      />

      <ArticleP>
        There are important nuances. External engines change and can degrade;
        that is part of the model. JSON format must be enabled in{" "}
        <ArticleCode>settings.yml</ArticleCode>, otherwise the API returns 403
        and the MCP looks broken. And “local” still depends on the public
        internet to talk to engines. What you gain is not full offline mode. What you gain is search running on your machine, zero search-API cost, and a stable
        layer between the agent and the web.
      </ArticleP>

      <ArticleP>
        If you already followed the problem (fragile scraper vs paid API vs
        local SearXNG), the diagram below only closes the reasoning visually. The diagram
        does not introduce new ideas: the diagram organizes what you just read.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Visual comparison: direct scraper, paid SaaS, and local SearXNG"
        chart={SEARXNG_COMPARE_CHART}
      />

      <ArticleP>
        Official repository:{" "}
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

      <ArticleH2>4. How the stack fits together</ArticleH2>

      <ArticleP>
        The architecture is simple on purpose. Four pieces, four jobs. When
        something fails, you look at the right layer instead of “restart
        everything”.
      </ArticleP>

      <ArticleP>
        The MCP client (Cursor, Copilot, or another host) discovers tools and
        decides when to call them. The MCP server starts with{" "}
        <ArticleCode>npx</ArticleCode>, speaks{" "}
        <a
          href="https://www.jsonrpc.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          JSON-RPC
        </a>{" "}
        over stdio, and turns the request into local HTTP. SearXNG, on loopback,
        aggregates engines and returns JSON. External engines (Google, Bing,
        DuckDuckGo…) still live on the public internet. The agent does not
        scrape HTML: the agent uses tools.
      </ArticleP>

      <ArticleP>
        With that mental map in place, the diagram below is only visual
        reinforcement for the end-to-end flow.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="End-to-end architecture: MCP client, SearXNG, and engines"
        chart={ARCHITECTURE_CHART}
      />

      <ArticleH3>MCP client / agent</ArticleH3>

      <ArticleP>
        The “MCP client” is the app where you chat with the agent. The MCP client can be{" "}
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
        in{" "}
        <a
          href="https://code.visualstudio.com/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          VS Code
        </a>
        , or another host that speaks the protocol. “Host” here just means the
        program that embeds the model and can call tools.
      </ArticleP>

      <ArticleP>
        In MCP,{" "}
        <a
          href="https://modelcontextprotocol.io/docs/concepts/tools"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          tools
        </a>{" "}
        are actions the model can request: search the web, read a URL, and so
        on. The client discovers which tools exist, decides when to use them,
        and receives a structured response (the “payload”: the data package
        coming back). That response enters the model’s context window, meaning
        the text the model uses to keep reasoning.
      </ArticleP>

      <ArticleP>
        The practical point: the agent does not “open Chrome” on its own. The agent
        asks for a tool, the host runs the tool, and the result comes back in an
        auditable, repeatable way. Swapping Cursor for Copilot does not change
        the idea; swapping hosts only changes where the MCP server config is saved.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="MCP roles: host, client, and server"
        chart={MCP_ROLES_CHART}
      />

      <ArticleH3>MCP server (`@zhafron/mcp-web-search`)</ArticleH3>

      <ArticleP>
        The MCP server is a separate small program that exposes the tools. In
        this post we use the{" "}
        <a
          href="https://www.npmjs.com/package/@zhafron/mcp-web-search"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          @zhafron/mcp-web-search
        </a>{" "}
        package. The package runs on{" "}
        <a
          href="https://nodejs.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Node.js
        </a>{" "}
        and starts with{" "}
        <a
          href="https://docs.npmjs.com/cli/v10/commands/npx"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          npx
        </a>
        : npm downloads/runs the package without you installing the package globally by
        hand.
      </ArticleP>

      <ArticleP>
        The MCP server talks to the client with{" "}
        <a
          href="https://www.jsonrpc.org/"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          JSON-RPC
        </a>{" "}
        over{" "}
        <a
          href="https://en.wikipedia.org/wiki/Standard_streams"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          stdio
        </a>{" "}
        (the process standard input/output: the same channel a terminal program
        uses). In practice: Cursor/Copilot talks to that local process, and the
        process turns the tool request into an{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTTP"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          HTTP
        </a>{" "}
        call to SearXNG on your machine.
      </ArticleP>

      <ArticleP>
        Two tools matter day to day. <ArticleCode>search_web</ArticleCode>{" "}
        returns search results. <ArticleCode>fetch_url</ArticleCode> opens a
        specific URL and brings content back for reading.{" "}
        <ArticleCode>HTTP_TIMEOUT</ArticleCode> is the maximum wait time for the
        HTTP call: if aggregation takes too long, the tool fails instead of
        freezing the session forever.
      </ArticleP>

      <ArticleH3>SearXNG as the local metasearch</ArticleH3>

      <ArticleP>
        Here SearXNG is the metasearch you host. SearXNG receives the query, hits
        several engines (Google, Bing, DuckDuckGo, and others you enable), and
        returns one JSON. “Engine”, in this text, just means the external search
        provider the results come from.
      </ArticleP>

      <ArticleP>
        The API listens on <ArticleCode>127.0.0.1:8099</ArticleCode>.{" "}
        <a
          href="https://en.wikipedia.org/wiki/Localhost"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          127.0.0.1
        </a>{" "}
        (localhost/loopback) means “this machine”, not the open internet.
        Loopback “bind” is the choice to listen only on that address: the API is
        not exposed to other devices on the network. Less surface, less
        headache.
      </ArticleP>

      <ArticleP>
        The mental contract stays simple: the client speaks MCP, MCP speaks
        SearXNG, SearXNG speaks to the web. Break one link and the symptom
        changes. That is why troubleshooting is layered, not “restart everything
        and hope”.
      </ArticleP>

      <ArticleH2>5. What gets better, what it costs, and where it pinches</ArticleH2>

      <ArticleP>
        The most obvious win is the bill: zero search API spend. Right behind it
        comes privacy, because sensitive terms do not have to cross a search
        SaaS. You also get practical resilience: one bad engine does not take
        down the whole metasearch. And you get operational control. Port,
        formats, secrets, and container lifecycle stay under your command.
      </ArticleP>

      <ArticleP>
        The cost is real, of course. Docker on a workstation is not free in
        attention. Aggregation has latency. Engines change HTML and APIs and
        degrade from time to time. During search bursts, local CPU and network
        feel it. None of that kills the stack, but ignore those points and
        operations turn into a nasty surprise.
      </ArticleP>

      <ArticleH3>Benchmarks: what search actually changes</ArticleH3>

      <ArticleP>
        Before the numbers, an honest cut. MCP + local SearXNG does not have a
        proprietary score on a leaderboard.
      </ArticleP>

      <ArticleP>
        <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> is an OpenAI
        factuality benchmark: a set of short questions with one correct answer
        that is easy to grade. It measures whether the model gets facts right or
        invents them. Nobody published "local SearXNG = X% on{" "}
        <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>".
      </ArticleP>

      <ArticleP>
        What the industry measures is something else: the effect of{" "}
        <TermLink href={GROUNDING_URL}>grounding</TermLink> with web search.
        This post's stack delivers the same class of capability (the agent
        searches and reads real snippets). The outcome still depends on the
        query, the engines, and the agent flow.
      </ArticleP>

      <ArticleP>
        Grounding, in plain language, means tying the answer to external
        evidence.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Without grounding: the model completes text with whatever sounds
          plausible
        </ArticleLi>
        <ArticleLi>
          With search: the model can cite what it just read
        </ArticleLi>
        <ArticleLi>
          What rises: factuality and freshness (current information)
        </ArticleLi>
        <ArticleLi>
          What does not rise on its own: "follow the prompt better" or reasoning
          on a closed task using only repo code
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        The agent flow that makes grounding work in practice:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          <ArticleCode>search_web</ArticleCode>: find sources
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>fetch_url</ArticleCode>: read the best page
        </ArticleLi>
        <ArticleLi>synthesis: answer based on what was read</ArticleLi>
      </ArticleOl>

      <ArticleImg
        src="/images/publications/busca-web-local-mcp-searxng/brave-ai-grounding.jpg"
        alt="Brave AI Grounding diagram: model answers anchored in verifiable web search"
        caption={
          <>
            Grounding with web search. Source: Brave Search,{" "}
            <TermLink href={GROUNDING_URL}>AI Grounding</TermLink> post.
          </>
        }
      />

      <ArticleP>
        Public numbers that matter for this conversation (many use{" "}
        <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> as the yardstick):
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Without search: in the{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> paper, GPT-4o scored
          below ~40% accuracy
        </ArticleLi>
        <ArticleLi>
          With grounding: Brave reported an F1 of 94.1% on{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> with{" "}
          <TermLink href={GROUNDING_URL}>AI Grounding</TermLink>
        </ArticleLi>
        <ArticleLi>
          In vendor analyses (
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> and{" "}
          <TermLink href={FRAMES_URL}>FRAMES</TermLink>, a multi-hop
          reasoning benchmark over multiple sources): typical gain of +25 to
          +40 percentage points versus the model without grounding
        </ArticleLi>
        <ArticleLi>
          On factual production queries (order of magnitude cited in those
          guides): ~15-25% of answers bad enough to matter, without grounding
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        A reading detail: percentage points are not "relative %". Going from 40%
        to 70% is +30 points, not "multiply by 1.3".
      </ArticleP>

      <ArticleImg
        src="/images/publications/busca-web-local-mcp-searxng/brave-simpleqa-grounding.jpg"
        alt="Brave SimpleQA chart showing high performance with AI Grounding versus baselines"
        caption={
          <>
            <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> with grounding:
            visual reference for the factuality jump. Source: Brave Search.
          </>
        }
      />

      <ArticleTable caption="Summary of the numbers (not a SearXNG score)">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Metric</ArticleTh>
            <ArticleTh>No search</ArticleTh>
            <ArticleTh>With grounding</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> (OpenAI / Brave)
            </ArticleTd>
            <ArticleTd>GPT-4o &lt; ~40%</ArticleTd>
            <ArticleTd>
              F1 94.1% (Brave{" "}
              <TermLink href={GROUNDING_URL}>AI Grounding</TermLink>)
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> /{" "}
              <TermLink href={FRAMES_URL}>FRAMES</TermLink> (vendors)
            </ArticleTd>
            <ArticleTd>Baseline without grounding</ArticleTd>
            <ArticleTd>+25 to +40 percentage points</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Bad factual queries (order of magnitude)</ArticleTd>
            <ArticleTd>~15-25%</ArticleTd>
            <ArticleTd>
              Drops with good retrieval and use of context
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleCallout variant="note" title="What I am not promising">
        <ArticleP>
          These numbers measure web-search grounding in public evaluations. They
          do not certify that your local SearXNG will hit 94% on{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>.
        </ArticleP>
        <ArticleP>
          The gain I see day to day is different:
        </ArticleP>
        <ArticleUl>
          <ArticleLi>fewer invented endpoints</ArticleLi>
          <ArticleLi>fewer stale library versions</ArticleLi>
          <ArticleLi>
            less "certainty" about an issue that opened yesterday
          </ArticleLi>
        </ArticleUl>
        <ArticleP>
          Same class of benefit as the benchmarks, measured in session friction,
          not on a leaderboard.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>Who this is useful for (and who it is not)</ArticleH3>

      <ArticleP>
        The stack helps when the agent needs current information outside the
        repository.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>docs that changed this week</ArticleLi>
        <ArticleLi>SDK changelog</ArticleLi>
        <ArticleLi>issue opened yesterday</ArticleLi>
        <ArticleLi>recent CVE</ArticleLi>
        <ArticleLi>API comparison</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Training memory is the wrong place to bet there.
      </ArticleP>

      <ArticleP>
        The return is weak when the task is already solved by the workspace:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>refactor a module</ArticleLi>
        <ArticleLi>follow a repo pattern</ArticleLi>
        <ArticleLi>write a test on open code</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Web search in those cases becomes noise. A bad prompt also stays bad:
        grounding does not "improve prompt precision". Grounding improves the
        factual base when the truth sits outside local context.
      </ArticleP>

      <ArticleTable caption="Who gains and who barely feels it">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Profile</ArticleTh>
            <ArticleTh>What changes in practice</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Dev with an agent in the daily flow</ArticleTd>
            <ArticleTd>
              Less API/docs hallucination; sessions invent-and-hope less
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>People hunting issues, CVEs, changelogs</ArticleTd>
            <ArticleTd>
              Freshness beats training cutoff; you can ask for link and excerpt
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>People avoiding paid search APIs</ArticleTd>
            <ArticleTd>
              Same grounding class of gain, with zero API cost and queries on
              your machine
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Closed-repo editing only</ArticleTd>
            <ArticleTd>
              Low gain; project context usually already enough
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleTable caption="Bottlenecks I have already seen and how I mitigated them">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Bottleneck</ArticleTh>
            <ArticleTh>Symptom</ArticleTh>
            <ArticleTh>Mitigation</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Timeouts</ArticleTd>
            <ArticleTd>Tool fails under load</ArticleTd>
            <ArticleTd>
              Raise <ArticleCode>HTTP_TIMEOUT</ArticleCode> and reduce active
              engines
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Large payloads</ArticleTd>
            <ArticleTd>LLM context overflows</ArticleTd>
            <ArticleTd>
              Ask for synthesis and use selective{" "}
              <ArticleCode>fetch_url</ArticleCode>
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Cold start</ArticleTd>
            <ArticleTd>First search is slow</ArticleTd>
            <ArticleTd>
              Keep the container up and add a compose healthcheck
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Search loops</ArticleTd>
            <ArticleTd>Agent over-searches</ArticleTd>
            <ArticleTd>
              Limit in the prompt and validate a hypothesis before the next
              query
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH2>6. How I put it together</ArticleH2>

      <ArticleP>
        The setup fits in three phases. The diagram is the map; the rest of this
        section is the executable checklist.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Three setup phases: SearXNG on Docker, MCP in the client, and quick acceptance"
        chart={SETUP_CHART}
      />

      <ArticleH3>Phase 1: SearXNG on Docker</ArticleH3>

      <ArticleP>
        I created a local directory (in my case,{" "}
        <ArticleCode>~/searxng</ArticleCode>) and prepared{" "}
        <ArticleCode>settings.yml</ArticleCode>. The detail most people miss is
        the JSON format. Without the JSON format, the API returns 403 and the MCP looks
        “broken” for no obvious reason.
      </ArticleP>

      <ArticleP>
        Generate strong secrets with{" "}
        <ArticleCode>openssl rand -hex 32</ArticleCode> and do not leave
        placeholders in the file. A minimal excerpt looks like this:
      </ArticleP>

      <ArticleCode block>
        {`# settings.yml (essential excerpt)
use_default_settings: true

general:
  instance_name: "searxng-local"

server:
  secret_key: "REPLACE_WITH_OPENSSL_RAND_HEX_32"
  limiter: false
  image_proxy: true

search:
  formats:
    - html
    - json`}
      </ArticleCode>

      <ArticleCallout variant="warning" title="No JSON, you get 403">
        <ArticleP>
          If <ArticleCode>json</ArticleCode> is missing from{" "}
          <ArticleCode>search.formats</ArticleCode>, the API refuses the response
          and the MCP looks like an integration failure. Most of the time the
          issue is just that line.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>Compose with a loopback-only bind:</ArticleP>

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
        Bring it up with <ArticleCode>docker compose up -d</ArticleCode> and
        validate with a simple curl. If you get JSON back, the SearXNG layer is
        fine.
      </ArticleP>

      <ArticleCode block>
        {`docker compose up -d

curl -s "http://127.0.0.1:8099/search?q=model+context+protocol&format=json" | head`}
      </ArticleCode>

      <ArticleP>
        The local UI lives at <ArticleCode>http://127.0.0.1:8099</ArticleCode>.
        The official install reference is in the{" "}
        <a
          href="https://docs.searxng.org/admin/installation-docker.html"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG Docker docs
        </a>
        .
      </ArticleP>

      <ArticleH3>Phase 2: MCP in the client (Cursor or Copilot)</ArticleH3>

      <ArticleP>
        The MCP package is the same. What changes is the host config file. In
        Cursor, use the global MCP file at{" "}
        <ArticleCode>~/.cursor/mcp.json</ArticleCode> or the project file at{" "}
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
        In VS Code with GitHub Copilot, the equivalent lives in{" "}
        <ArticleCode>.vscode/mcp.json</ArticleCode> (workspace) or in the user
        config via Command Palette (
        <ArticleCode>MCP: Open User Configuration</ArticleCode>). The root key
        is <ArticleCode>servers</ArticleCode>, not{" "}
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
        <ArticleCode>DEFAULT_SEARCH_PROVIDER=searxng</ArticleCode> keeps you off
        the default scraper. <ArticleCode>SEARXNG_URL</ArticleCode> points at
        the local instance. <ArticleCode>HTTP_TIMEOUT</ArticleCode> avoids early
        death when aggregation takes a bit longer. After editing the file,
        reload the host (Cursor or VS Code/Copilot) and confirm the server shows
        up connected in the tools UI.
      </ArticleP>

      <ArticleH3>Phase 3: Quick acceptance</ArticleH3>

      <ArticleOl>
        <ArticleLi>Reload the MCP client after saving the config.</ArticleLi>
        <ArticleLi>Confirm the MCP server is connected in settings/tools.</ArticleLi>
        <ArticleLi>
          Run <ArticleCode>search_web</ArticleCode> with an objective query.
        </ArticleLi>
        <ArticleLi>
          Run <ArticleCode>fetch_url</ArticleCode> on the best source and ask for
          a short synthesis.
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        Two prompts I use to validate the end-to-end flow:
      </ArticleP>

      <ArticleCode block>
        {`Use search_web to find the official Model Context Protocol documentation.
Then use fetch_url on the best source and summarize in 5 actionable bullets.`}
      </ArticleCode>

      <ArticleCode block>
        {`Search recent issues about SearXNG 403 with format=json.
Cite links and separate configuration causes from engine blocks.`}
      </ArticleCode>

      <ArticleH2>7. Day-to-day ops and what to do when it breaks</ArticleH2>

      <ArticleP>
        The stack stays stable when you treat the container and MCP as
        workstation infrastructure, not as a magic plugin. Machine restarted?
        Bring the compose up and validate with curl. Container died? Check{" "}
        <ArticleCode>docker ps -a</ArticleCode>, read the log, and bring it back.
        Empty SearXNG UI? Open the local port, test engines, and review
        settings.
      </ArticleP>

      <ArticleTable caption="Troubleshooting that shows up most often">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Scenario</ArticleTh>
            <ArticleTh>What I do</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Machine restarted</ArticleTd>
            <ArticleTd>
              <ArticleCode>docker compose up -d</ArticleCode> + sanity curl
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Container died</ArticleTd>
            <ArticleTd>
              Status with <ArticleCode>docker ps -a</ArticleCode>, logs, restart
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>MCP does not start in the client</ArticleTd>
            <ArticleTd>
              Check Node/npx PATH for the GUI app and test{" "}
              <ArticleCode>npx -y @zhafron/mcp-web-search</ArticleCode> in a
              terminal
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>403 on format=json</ArticleTd>
            <ArticleTd>
              Confirm <ArticleCode>json</ArticleCode> in{" "}
              <ArticleCode>search.formats</ArticleCode> and recreate the
              container
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Weak results</ArticleTd>
            <ArticleTd>
              Tune engines, cut loops, and prefer{" "}
              <ArticleCode>fetch_url</ArticleCode> on official sources
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        A few habits that pay the rent:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>keep SearXNG on 127.0.0.1</ArticleLi>
        <ArticleLi>generate real secrets with openssl</ArticleLi>
        <ArticleLi>
          teach the agent to search little and read well, in this flow:
        </ArticleLi>
      </ArticleUl>

      <ArticleOl>
        <ArticleLi>search</ArticleLi>
        <ArticleLi>fetch</ArticleLi>
        <ArticleLi>synthesis</ArticleLi>
      </ArticleOl>

      <ArticleP>
        Treat engine degradation as normal operations. Engines change. That is
        not a rare incident. That is the game.
      </ArticleP>

      <ArticleH3>Key takeaways</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          For stable daily web search in the agent, the line that survives is
          ready-made MCP + local SearXNG (option B), not a direct scraper or a
          generic custom MCP.
        </ArticleLi>
        <ArticleLi>
          A public scraper MCP is fine for a smoke test. In long sessions,
          CAPTCHAs, rate limits, and unstable HTML turn the scraper into a roulette
          wheel.
        </ArticleLi>
        <ArticleLi>
          SearXNG is not a scraper MCP: the MCP speaks local JSON; the metasearch
          fans out the query. Blocking one engine becomes degradation, not total
          failure. SearXNG is not immune to rate limits or IP blocks.
        </ArticleLi>
        <ArticleLi>
          A custom MCP with the SDK only pays off when the tool is truly
          specific; for generic search, ownership eats the gain.
        </ArticleLi>
        <ArticleLi>
          On SearXNG: enable JSON in <ArticleCode>search.formats</ArticleCode>,
          bind to <ArticleCode>127.0.0.1</ArticleCode>, and treat degrading
          engines as normal operations.
        </ArticleLi>
        <ArticleLi>
          Teach the agent to search little and read well in this flow: search,
          then fetch, then synthesis. Do not stuff the context with noise.
        </ArticleLi>
        <ArticleLi>
          Search grounding raises factuality and freshness. Search grounding does not “improve
          the prompt” on a task the workspace already solves.
        </ArticleLi>
        <ArticleLi>
          Local ≠ offline: you control the search service on your machine; the
          public internet still feeds the engines.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusion</ArticleH3>

      <ArticleP>
        I did not choose to build more software. I chose the smallest
        architecture that survives real use. Ready-made MCP + local SearXNG
        delivers zero API cost, privacy with search on your machine, and better
        stability than a fragile
        scraper, with operational overhead that is acceptable if you already
        live in Docker day to day. On quality, the gain that matters is the same
        one in the grounding literature: factuality and freshness when the truth
        is on the web, not a “magically more precise prompt”.
      </ArticleP>

      <ArticleP>
        If the goal is an agent with reliable search Monday through Friday,
        option B is not a shortcut. Option B is the line I would leave running on my
        machine and recommend to someone on the team without hesitation.
      </ArticleP>
    </>
  );
}
