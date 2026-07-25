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

const DECISION_CHART = `flowchart TB
  Start["Web search in the agent"]

  Start --> A["A: scraper MCP"]
  Start --> B["B: MCP + SearXNG"]
  Start --> C["C: custom MCP"]

  A --> ResultA["Smoke test"]
  B --> ResultB["Daily use"]
  C --> ResultC["High effort"]

  ResultB --> Pick["Decision: B"]`;

const PROBLEM_CHART = `flowchart TB
  Need["Agent needs the web"]
  Need --> Paid["Paid search API"]
  Need --> Scrape["Direct scraper MCP"]
  Paid --> PainPaid["Quota / cost / privacy"]
  Scrape --> PainScrape["CAPTCHA / blocks / HTML"]
  PainPaid --> Gap["Need stable local search"]
  PainScrape --> Gap`;

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
        on Docker. Three names you will see all the time:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <a
            href="https://modelcontextprotocol.io/"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            MCP
          </a>
          : protocol that lets the agent call tools (search, read URL) from
          Cursor/Copilot, instead of “opening the browser on its own”
        </ArticleLi>
        <ArticleLi>
          <a
            href="https://docs.searxng.org/"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            SearXNG
          </a>
          : open-source{" "}
          <a
            href="https://en.wikipedia.org/wiki/Metasearch_engine"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            metasearch
          </a>{" "}
          you host; it queries several search engines and returns one unified
          result (JSON in my setup)
        </ArticleLi>
        <ArticleLi>
          engine: the external search provider the hits come from (Google, Bing,
          DuckDuckGo…). SearXNG talks to engines; MCP talks to SearXNG
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Shortcut">
        <ArticleP>
          Want the setup checklist now? Jump to{" "}
          <a href="#3-how-i-put-it-together" className={linkClass}>
            section 3
          </a>
          .
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        If you prefer the why before the how, keep reading here.
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
        I compared paid API, scraper MCP, and local metasearch. I kept the
        metasearch. Next: what breaks with the other two.
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
        In MCP, a tool is a named action (name + inputs + result). The agent
        asks; the host runs it; the model continues.
      </ArticleP>

      <ArticleP>
        In this search package, two tools matter:
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
          You host SearXNG + MCP. The internet and external engines still exist.
          What changes: port, secret, and lifecycle stay under your domain.
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
        I wanted the most stable option for daily use, with low ownership. Three
        routes:
      </ArticleP>

      <ArticleH3>Option A: ready-made MCP with a direct public scraper</ArticleH3>

      <ArticleP>
        Install a search MCP via{" "}
        <a
          href="https://docs.npmjs.com/cli/v10/commands/npm-exec"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          npx
        </a>
        . No Docker. No metasearch. In minutes the agent gets{" "}
        <ArticleCode>search_web</ArticleCode>.
      </ArticleP>

      <ArticleP>
        Under the hood, the package is usually a scraper: HTTP to a public
        engine, HTML, parser. Near-zero setup. Great for a smoke test.
      </ArticleP>

      <ArticleP>
        Under continuous use it breaks:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <a
            href="https://en.wikipedia.org/wiki/CAPTCHA"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            CAPTCHA
          </a>{" "}
          and{" "}
          <a
            href="https://en.wikipedia.org/wiki/Rate_limiting"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            rate limits
          </a>
        </ArticleLi>
        <ArticleLi>HTML shifts and the parser goes quiet</ArticleLi>
        <ArticleLi>agent bursts = the pattern anti-abuse punishes first</ArticleLi>
      </ArticleUl>

      <ArticleP>
        I used it as an experiment. I dropped it as the main line.
      </ArticleP>

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
        package stops scraping the web on its own. The MCP package becomes an HTTP
        client of a service <em>you</em> host:{" "}
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
          SearXNG fans the query out across several engines (external search
          engines)
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
        : it orchestrates Google, Bing, DuckDuckGo, and friends into one response.
      </ArticleP>

      <ArticleP>
        On Docker at loopback (<ArticleCode>127.0.0.1</ArticleCode>):
      </ArticleP>

      <ArticleUl>
        <ArticleLi>zero search API cost</ArticleLi>
        <ArticleLi>the query passes through your machine first</ArticleLi>
        <ArticleLi>you control port, secret, and lifecycle</ArticleLi>
        <ArticleLi>price = operations (container + JSON wired up)</ArticleLi>
      </ArticleUl>

      <ArticleP>
        One bad engine rarely takes down the whole metasearch. This was the line
        that survived daily use.
      </ArticleP>

      <ArticleP>
        “Isn’t this just another scraper?” Short answer in section 4.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Option B flow: agent, MCP, local SearXNG, and engines"
        chart={OPTION_B_CHART}
      />

      <ArticleH3>Option C: custom MCP with the SDK</ArticleH3>

      <ArticleP>
        Write your own server with{" "}
        <ArticleCode>@modelcontextprotocol/sdk</ArticleCode> (usually via{" "}
        <a
          href="https://modelcontextprotocol.io/specification/2025-06-18/basic/transports"
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          stdio
        </a>
        ). Doable. High ownership.
      </ArticleP>

      <ArticleP>
        You own timeouts, parsing, 403/429, payload, and changelog. Versus
        ready-made MCP + SearXNG, the net gain is usually low.
      </ArticleP>

      <ArticleP>
        I dropped C. The SDK only comes back if the tool is very specific
        (policy, filter, telemetry).
      </ArticleP>

      <ArticleP>
        Visual summary of the decision and the table below:
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
            <ArticleTd>Low until it fails</ArticleTd>
            <ArticleTd>Zero API spend</ArticleTd>
            <ArticleTd>High engineering time</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Stability / rate limits</ArticleTd>
            <ArticleTd>Fragile</ArticleTd>
            <ArticleTd>Good, with aggregation</ArticleTd>
            <ArticleTd>Depends on implementation</ArticleTd>
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
          I stayed with B: stability and privacy without turning the solution
          into an eternal internal product. It is the smallest architecture that
          survives a real week, not just a demo.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. How I put it together</ArticleH2>

      <ArticleP>
        Three phases. Diagram = map. Text = checklist.
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
        the JSON format. Without the JSON format, the API returns 403 and the MCP
        looks “broken” for no obvious reason.
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

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>DEFAULT_SEARCH_PROVIDER=searxng</ArticleCode> keeps you off
          the default scraper
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>SEARXNG_URL</ArticleCode> points at the local instance
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>HTTP_TIMEOUT</ArticleCode> avoids early death during
          aggregation
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Saved? Reload the host and confirm the server shows up connected in the
        tools UI.
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

      <ArticleH2>4. How the stack fits (and vs scraper)</ArticleH2>

      <ArticleP>
        Four pieces. Four jobs.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          MCP client (Cursor/Copilot): discovers tools and decides when to call
          them
        </ArticleLi>
        <ArticleLi>
          MCP server (
          <a
            href="https://www.npmjs.com/package/@zhafron/mcp-web-search"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            @zhafron/mcp-web-search
          </a>
          ): starts with <ArticleCode>npx</ArticleCode>, speaks JSON-RPC/stdio,
          turns into local HTTP
        </ArticleLi>
        <ArticleLi>
          SearXNG at <ArticleCode>127.0.0.1</ArticleCode>: metasearch and unified
          JSON
        </ArticleLi>
        <ArticleLi>
          External engines (Google, Bing, DuckDuckGo…): on the public internet
        </ArticleLi>
      </ArticleUl>

      <ArticleMermaid
        ariaLabel="End-to-end architecture: MCP client, SearXNG, and engines"
        chart={ARCHITECTURE_CHART}
      />

      <ArticleH3>SearXNG vs scraper</ArticleH3>

      <ArticleP>
        Different design. SearXNG is not immune to blocks either. What changes is
        who fails.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Option A: MCP scrapes one HTML engine. CAPTCHA/429 kills the tool.
        </ArticleLi>
        <ArticleLi>
          Option B: MCP only talks to local SearXNG. SearXNG talks to several
          engines.
        </ArticleLi>
        <ArticleLi>
          One bad engine becomes “fewer sources”, not total roulette.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="note" title="IP and rate limits: the honest cut">
        <ArticleP>
          Requests to engines still leave from your IP. SearXNG does not make you
          invisible.
        </ArticleP>
        <ArticleP>
          What this stack avoids is the total failure typical of a scraper:
          hammering one public HTML endpoint until anti-abuse closes the door.
        </ArticleP>
      </ArticleCallout>

      <ArticleMermaid
        ariaLabel="Contrast: scraper MCP with one HTML engine versus local SearXNG with many engines"
        chart={SCRAPER_VS_SEARXNG_CHART}
      />

      <ArticleP>
        Quick nuances:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          JSON in <ArticleCode>settings.yml</ArticleCode>, otherwise 403
        </ArticleLi>
        <ArticleLi>Local ≠ offline: engines use the public internet</ArticleLi>
        <ArticleLi>
          Repo:{" "}
          <a
            href="https://github.com/searxng/searxng"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            searxng/searxng
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
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>5. What gets better, what it costs, and where it pinches</ArticleH2>

      <ArticleP>
        What gets better:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>zero search API</ArticleLi>
        <ArticleLi>less SaaS in the query path</ArticleLi>
        <ArticleLi>one bad engine does not take down the metasearch</ArticleLi>
        <ArticleLi>port, formats, and secrets under your command</ArticleLi>
      </ArticleUl>

      <ArticleP>
        What it costs:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>Docker attention on the workstation</ArticleLi>
        <ArticleLi>aggregation latency</ArticleLi>
        <ArticleLi>engines that degrade now and then</ArticleLi>
        <ArticleLi>CPU/network during search bursts</ArticleLi>
      </ArticleUl>

      <ArticleH3>Benchmarks: what search actually changes</ArticleH3>

      <ArticleP>
        Day to day, what I feel with search in the agent is not a “leaderboard
        score”. It is session friction:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>fewer invented endpoints</ArticleLi>
        <ArticleLi>fewer stale library versions</ArticleLi>
        <ArticleLi>
          less “certainty” about an issue that opened yesterday
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        That is{" "}
        <TermLink href={GROUNDING_URL}>grounding</TermLink>: tying the answer
        to external evidence.
      </ArticleP>

      <ArticleP>
        Without search, the model completes with whatever sounds plausible. With
        search, it can cite what it just read. Factuality and freshness go up.
        That does not, on its own, mean “follow the prompt better” on a task the
        repo already solves.
      </ArticleP>

      <ArticleP>
        The flow that makes this work in practice:
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

      <ArticleP>
        The industry measures this with{" "}
        <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> (short factual
        questions from OpenAI).
      </ArticleP>

      <ArticleP>
        MCP + local SearXNG has no score of its own on those tests. The numbers
        below are reference points for the “model + web search” class, not a
        certification of your Docker setup:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Without search: in the{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> paper, GPT-4o scored
          below ~40%
        </ArticleLi>
        <ArticleLi>
          With grounding: Brave reported an F1 of 94.1% on{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> with{" "}
          <TermLink href={GROUNDING_URL}>AI Grounding</TermLink>
        </ArticleLi>
        <ArticleLi>
          In vendor analyses (
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink> and{" "}
          <TermLink href={FRAMES_URL}>FRAMES</TermLink>
          ): typical gain of +25 to +40 percentage points
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Percentage points are not “relative %”. Going from 40% to 70% is +30
        points, not multiply by 1.3.
      </ArticleP>

      <ArticleImg
        src="/images/publications/busca-web-local-mcp-searxng/brave-simpleqa-grounding.jpg"
        alt="Brave SimpleQA chart showing high performance with AI Grounding versus baselines"
        caption={
          <>
            Visual reference: factuality jump with grounding. Source: Brave
            Search (
            <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>
            ).
          </>
        }
      />

      <ArticleCallout variant="note" title="What I am not promising">
        <ArticleP>
          These numbers do not certify that your local SearXNG will hit 94% on{" "}
          <TermLink href={SIMPLEQA_URL}>SimpleQA</TermLink>. They measure
          grounding with search in public evaluations. The gain I optimize for is
          session friction, not the leaderboard.
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

      <ArticleH2>6. Day-to-day ops and what to do when it breaks</ArticleH2>

      <ArticleP>
        Treat the container and MCP as workstation infrastructure, not as a magic
        plugin.
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
          Day to day: ready-made MCP + local SearXNG (B). Not a direct scraper
          or a generic custom MCP.
        </ArticleLi>
        <ArticleLi>
          Scraper MCP: smoke test. In long sessions it becomes CAPTCHA /
          rate-limit.
        </ArticleLi>
        <ArticleLi>
          SearXNG ≠ scraper MCP: local JSON + several engines. Blocking becomes
          degradation. Not immune to rate limits / IP.
        </ArticleLi>
        <ArticleLi>
          Custom SDK only for a truly specific tool; otherwise ownership eats
          the gain.
        </ArticleLi>
        <ArticleLi>
          SearXNG: JSON in <ArticleCode>search.formats</ArticleCode>, bind to{" "}
          <ArticleCode>127.0.0.1</ArticleCode>, degrading engines = normal.
        </ArticleLi>
        <ArticleLi>
          Agent: search → fetch → synthesis. Little noise in context.
        </ArticleLi>
        <ArticleLi>
          Grounding raises factuality / freshness. It does not “improve the
          prompt” on its own.
        </ArticleLi>
        <ArticleLi>
          Local ≠ offline: you control the service; the internet feeds the
          engines.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusion</ArticleH3>

      <ArticleP>
        I did not choose to build more software. I chose the smallest
        architecture that survives real use.
      </ArticleP>

      <ArticleP>
        Ready-made MCP + local SearXNG: zero API cost, service on your machine,
        more stable than a scraper. Overhead is fine if you already live in
        Docker.
      </ArticleP>

      <ArticleP>
        The gain that matters is grounding: factuality and freshness when the
        truth is on the web. Not a “magically more precise prompt”.
      </ArticleP>

      <ArticleP>
        If the goal is an agent with reliable search Monday through Friday,
        option B is not a shortcut. It is the line I would leave running on my
        machine and recommend to someone on the team without hesitation.
      </ArticleP>
    </>
  );
}
