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
  Cursor[Cursor / AI Agent]
  MCP[MCP Server<br/>mcp-web-search]
  SearX[SearXNG<br/>127.0.0.1:8099]
  Engines[Engines<br/>Google Bing DDG]

  Cursor -->|JSON-RPC stdio| MCP
  MCP -->|local HTTP JSON| SearX
  SearX -->|aggregated queries| Engines
  Engines -->|results| SearX
  SearX -->|clean JSON| MCP
  MCP -->|tools search_web fetch_url| Cursor`;

const DECISION_CHART = `flowchart TD
  Need[Need web search in the agent]
  A[Option A: ready-made scraper MCP]
  B[Option B: MCP + local SearXNG]
  C[Option C: custom MCP from scratch]
  Prod[Daily use in long sessions]

  Need --> A
  Need --> B
  Need --> C
  A -->|blocks and rate limits| Prod
  C -->|high maintenance cost| Prod
  B -->|zero API cost + edge control| Prod`;

export function BuscaWebLocalMcpSearxngContentEn() {
  return (
    <>
      <ArticleH2>1. The problem that showed up in real use</ArticleH2>

      <ArticleP>
        If you live inside an AI agent for real work, web search stops being a
        nice extra and becomes part of the loop. Docs change overnight, APIs
        break without warning, and the annoying bug only exists in an issue
        opened yesterday. When the model is stuck with training knowledge and
        whatever is already in the repo, the session starts spinning its
        wheels.
      </ArticleP>

      <ArticleP>
        I felt this hard in long Cursor sessions. The agent needs to search,
        read a solid chunk, apply a change, and validate. When search fails, it
        retries, invents, or just interrupts you. The cost is no longer only
        money. It becomes friction, lost context, and time you do not get back.
      </ArticleP>

      <ArticleH3>Where paid search APIs start to hurt</ArticleH3>

      <ArticleP>
        Commercial APIs work fine when volume is low and predictability matters
        more than the bill. Agent-assisted development is not two queries a day.
        It is exploration. You open several fronts, compare docs, chase issues,
        and backtrack when a hypothesis falls apart.
      </ArticleP>

      <ArticleP>
        At that pace, price climbs fast, quotas tighten, and rate limits show up
        exactly when you want speed. Privacy is another cut: search terms with
        client names, internal stack details, or incident notes leave your
        machine for a third-party SaaS. If the vendor changes pricing, policy,
        or availability, your local workflow breaks with it.
      </ArticleP>

      <ArticleH3>Free scrapers and the false win</ArticleH3>

      <ArticleP>
        The other obvious temptation is a ready-made MCP that scrapes a public
        engine directly (DuckDuckGo and friends). In a smoke test it feels like
        magic. Under continuous use, the story changes. IPs get blocked,
        CAPTCHAs appear, latency turns into a roulette wheel, and the failure
        rate rises in the exact pattern of an autonomous agent: many bursty
        queries, for hours.
      </ArticleP>

      <ArticleCallout variant="note" title="What I mean by “local” here">
        <ArticleP>
          Local does not mean offline. It means edge control. You remove the
          search SaaS middleman and host the orchestration layer (SearXNG + MCP)
          on your machine. The public internet still exists, external engines
          still get queried, but the layer the agent sees stays under your
          domain: port, secret, lifecycle, and exposure surface.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Official baselines if you want them:{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className="font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Model Context Protocol
        </a>{" "}
        and the{" "}
        <a
          href="https://docs.searxng.org/"
          className="font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
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
        could accept. Three routes showed up naturally.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Decision flow across options A, B, and C"
        chart={DECISION_CHART}
      />

      <ArticleH3>Option A: ready-made MCP with a direct public scraper</ArticleH3>

      <ArticleP>
        Near-zero setup, no local infra, immediate result. Great for validating
        the idea in fifteen minutes. Terrible as a continuous base. Anti-bot
        systems, CAPTCHAs, and rate limits turn the tool into a roulette wheel,
        and long sessions feel it first. I used this as a quick experiment and
        dropped it as the main line.
      </ArticleP>

      <ArticleH3>Option B: ready-made MCP + local SearXNG on Docker</ArticleH3>

      <ArticleP>
        Here the MCP stops scraping the web on its own. It talks to a metasearch
        you host. SearXNG aggregates engines, cleans a good chunk of noise, and
        returns JSON on your machine’s loopback. You get pragmatism, zero API
        cost, better privacy, and operational control, without reinventing the
        MCP protocol from scratch.
      </ArticleP>

      <ArticleH3>Option C: custom MCP with the SDK</ArticleH3>

      <ArticleP>
        Building an MCP server in TypeScript with{" "}
        <ArticleCode>@modelcontextprotocol/sdk</ArticleCode> is totally doable.
        The issue is not technical ability. It is value. For the goal “stable
        web search in the agent”, you become the owner of timeouts, parsing,
        fallbacks, bugs, and changelogs. Too much effort for little business
        differentiation. I discarded it on ROI, not because I was afraid of
        writing code.
      </ArticleP>

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
            <ArticleTd>High at the edge</ArticleTd>
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
          I stayed with B. It solves stability and privacy without turning the
          solution into an eternal internal maintenance product. It is the
          smallest architecture that survives a week of real use, not only a
          Friday demo.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. What SearXNG is (and why it belongs here)</ArticleH2>

      <ArticleP>
        SearXNG is an open-source, self-hostable metasearch engine. It is not
        “another Google”. It aggregates results from multiple services and
        databases (Google, Bing, DuckDuckGo, and dozens of others depending on
        your config) and returns a unified view. You search once; underneath it
        fans out the query and merges the response.
      </ArticleP>

      <ArticleP>
        The project is built with privacy in mind: the instance does not need to
        track or profile the user the way a commercial search engine does by
        default. In a local setup that becomes even clearer. Orchestration lives
        on your machine, sensitive history does not have to cross a search SaaS,
        and you decide what stays exposed.
      </ArticleP>

      <ArticleP>
        I picked SearXNG for three practical reasons. First, it already handles
        aggregation and result normalization, so the MCP does not have to become
        a fragile HTML scraper. Second, the JSON API is direct enough for an
        agent to consume without hacks. Third, the community maintains a Docker
        image and docs solid enough to stand up in minutes and operate day to
        day without turning this into an endless side project.
      </ArticleP>

      <ArticleP>
        There are important nuances. External engines change and can degrade;
        that is part of the model. JSON format must be enabled in{" "}
        <ArticleCode>settings.yml</ArticleCode>, otherwise the API returns 403
        and the MCP looks broken. And “local” still depends on the public
        internet to talk to engines. What you gain is not full offline mode. It
        is edge control, zero search-API cost, and a stable layer between the
        agent and the web.
      </ArticleP>

      <ArticleP>
        Official repository:{" "}
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

      <ArticleH2>4. How the stack fits together</ArticleH2>

      <ArticleP>
        The architecture is simple on purpose. Each piece has a clear job, and
        that helps when debugging: when something fails, you know which layer to
        inspect first.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="End-to-end architecture: Cursor, MCP, SearXNG, and engines"
        chart={ARCHITECTURE_CHART}
      />

      <ArticleH3>Cursor / agent</ArticleH3>

      <ArticleP>
        Cursor is the MCP client. It discovers tools, decides when to call them,
        and drops the structured payload into the model’s context window. The
        agent does not “open Chrome”. It uses tools. That makes search
        auditable, repeatable, and pluggable into other MCP clients later.
      </ArticleP>

      <ArticleH3>MCP server (`@zhafron/mcp-web-search`)</ArticleH3>

      <ArticleP>
        A Node process starts via <ArticleCode>npx</ArticleCode> and talks to
        Cursor over JSON-RPC on <ArticleCode>stdio</ArticleCode>. Its job is to
        turn a tool request into local HTTP, apply a timeout (
        <ArticleCode>HTTP_TIMEOUT</ArticleCode>), and return a structured result.
        It also exposes <ArticleCode>fetch_url</ArticleCode>, which is the natural
        next step: find a good source and actually read the content, instead of
        swallowing a whole page in the dark.
      </ArticleP>

      <ArticleH3>SearXNG as the local metasearch</ArticleH3>

      <ArticleP>
        In the stack, SearXNG is the piece that aggregates engines and serves
        JSON at <ArticleCode>127.0.0.1:8099</ArticleCode>. Loopback binding is
        deliberate: the API is reachable only on the local machine. Less
        exposure surface, less headache. At the far end you still have Google,
        Bing, DuckDuckGo, and whatever else you enable. SearXNG orchestrates.
        You control the edge.
      </ArticleP>

      <ArticleP>
        The mental contract is simple: Cursor speaks MCP, MCP speaks SearXNG,
        SearXNG speaks to the web. Break one link and the symptom changes. That
        is why troubleshooting has to be layered, not “restart everything and
        hope”.
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

      <ArticleH3>Phase 1: SearXNG on Docker</ArticleH3>

      <ArticleP>
        I created a local directory (in my case,{" "}
        <ArticleCode>~/searxng</ArticleCode>) and prepared{" "}
        <ArticleCode>settings.yml</ArticleCode>. The detail most people miss is
        the JSON format. Without it, the API returns 403 and the MCP looks
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
          className="font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          SearXNG Docker docs
        </a>
        .
      </ArticleP>

      <ArticleH3>Phase 2: MCP in Cursor</ArticleH3>

      <ArticleP>
        Configure MCP globally in <ArticleCode>~/.cursor/mcp.json</ArticleCode>{" "}
        or per project in <ArticleCode>.cursor/mcp.json</ArticleCode>. The block
        below forces the local provider and points at the container.
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
        <ArticleCode>DEFAULT_SEARCH_PROVIDER=searxng</ArticleCode> keeps you off
        the default scraper. <ArticleCode>SEARXNG_URL</ArticleCode> points at
        the local instance. <ArticleCode>HTTP_TIMEOUT</ArticleCode> avoids early
        death when aggregation takes a bit longer. After editing the file,
        restart Cursor and confirm the server shows up connected in the tools
        UI.
      </ArticleP>

      <ArticleH3>Phase 3: Quick acceptance</ArticleH3>

      <ArticleOl>
        <ArticleLi>Restart Cursor after saving mcp.json.</ArticleLi>
        <ArticleLi>Confirm the MCP server is connected in settings.</ArticleLi>
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
            <ArticleTd>MCP does not start in Cursor</ArticleTd>
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
        A few habits that pay the rent: keep SearXNG on 127.0.0.1, generate real
        secrets with openssl, teach the agent to search little and read well
        (search → fetch → synthesis), and treat engine degradation as normal
        operations. Engines change. That is not a rare incident. That is the
        game.
      </ArticleP>

      <ArticleH3>Conclusion</ArticleH3>

      <ArticleP>
        I did not choose to build more software. I chose the smallest
        architecture that survives real use. Ready-made MCP + local SearXNG
        delivers zero API cost, edge privacy, and better stability than a fragile
        scraper, with operational overhead that is acceptable if you already
        live in Docker day to day.
      </ArticleP>

      <ArticleP>
        If the goal is an agent with reliable search Monday through Friday,
        option B is not a shortcut. It is the line I would leave running on my
        machine and recommend to someone on the team without hesitation.
      </ArticleP>
    </>
  );
}
