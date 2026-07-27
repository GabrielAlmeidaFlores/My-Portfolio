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

const SCALE_CHART = `flowchart LR
  S1["1 server"] --> S2["API + DB split"]
  S2 --> S3["N apps + LB"]
  S3 --> S4["1 DB bottleneck"]`;

const REPLICATION_CHART = `flowchart TB
  Apps["Apps / API"]
  Primary["Primary write"]
  R1["Replica read"]
  R2["Replica read"]

  Apps -->|"write"| Primary
  Apps -->|"read"| R1
  Apps -->|"read"| R2
  Primary -.->|"replicate"| R1
  Primary -.->|"replicate"| R2`;

const TRADEOFF_CHART = `flowchart TB
  Write["Write to primary"]
  Write --> Sync["Synchronous replication"]
  Write --> Async["Asynchronous replication"]
  Sync --> PainSync["Latency / unavailability"]
  Async --> PainAsync["Eventual consistency"]`;

const PACELC_CHART = `flowchart TB
  Q["Network partition?"]
  Q -->|"Yes"| PA["Choose: A or C"]
  Q -->|"No"| EL["Choose: L or C"]
  PA --> Social["Ex: like / feed"]
  PA --> Bank["Ex: balance / Pix"]
  EL --> Fast["Low latency"]
  EL --> Strong["Strong consistency"]`;

const CASSANDRA_CHART = `flowchart TB
  Client["Client"]
  N1["Node 1"]
  N2["Node 2"]
  N3["Node 3"]
  N4["Node 4"]

  Client --> N1
  Client --> N2
  Client --> N3
  Client --> N4
  N1 --- N2
  N2 --- N3
  N3 --- N4
  N4 --- N1`;

const QUORUM_CHART = `flowchart LR
  RF["RF = 10 nodes"] --> Maj["Quorum = 6"]
  Maj --> Write["Write QUORUM"]
  Maj --> Read["Read QUORUM"]
  Write --> Safe["Intersection guarantees fresh data"]
  Read --> Safe`;

const linkClass =
  "font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300";

const CAP_URL = "https://en.wikipedia.org/wiki/CAP_theorem";
const PACELC_URL = "https://en.wikipedia.org/wiki/PACELC_theorem";
const POSTGRES_URL = "https://www.postgresql.org/";
const MYSQL_URL = "https://www.mysql.com/";
const MONGODB_URL = "https://www.mongodb.com/docs/";
const CASSANDRA_URL = "https://cassandra.apache.org/_/index.html";
const CQL_URL =
  "https://cassandra.apache.org/doc/latest/cassandra/cql/index.html";
const DYNAMODB_URL = "https://aws.amazon.com/dynamodb/";
const DYNAMODB_CONSISTENT_URL =
  "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html";
const COCKROACH_URL = "https://www.cockroachlabs.com/";
const SPANNER_URL = "https://cloud.google.com/spanner";
const REDIS_URL = "https://redis.io/";
const SENTINEL_URL = "https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/";
const RAFT_URL = "https://raft.github.io/";
const PAXOS_URL = "https://en.wikipedia.org/wiki/Paxos_(computer_science)";
const EVENTUAL_URL = "https://en.wikipedia.org/wiki/Eventual_consistency";
const PARTITION_URL = "https://en.wikipedia.org/wiki/Network_partition";
const LB_URL = "https://en.wikipedia.org/wiki/Load_balancing_(computing)";
const DNS_URL = "https://en.wikipedia.org/wiki/Domain_Name_System";
const SHARDING_URL = "https://en.wikipedia.org/wiki/Shard_(database_architecture)";
const QUORUM_URL =
  "https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html#tunable-consistency";
const ACID_URL = "https://en.wikipedia.org/wiki/ACID";
const TRUETIME_URL =
  "https://cloud.google.com/spanner/docs/true-time-external-consistency";
const VIDEO_SOURCE_URL = "https://www.youtube.com/watch?v=bhw4-Kq_RPs";

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

export function EscolhaBancoDadosCapPacelcContentEn() {
  return (
    <>
      <ArticleH2>1. The shallow answer problem</ArticleH2>

      <ArticleP>
        The question "which database would you use?" still gets a shallow answer
        often. In an interview (and later in service design), the automatic reply
        usually is:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          related, structured data:{" "}
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> /{" "}
          <TermLink href={MYSQL_URL}>MySQL</TermLink>
        </ArticleLi>
        <ArticleLi>
          less relational and "more performance":{" "}
          <TermLink href={MONGODB_URL}>MongoDB</TermLink> /{" "}
          <TermLink href={CASSANDRA_URL}>Cassandra</TermLink>
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        The interviewer did not want a logo. They wanted what you prioritize under{" "}
        <TermLink href={PARTITION_URL}>partition</TermLink> and what you accept to
        pay in latency. Without the tradeoff map, only the interview shortcut is
        left.
      </ArticleP>

      <ArticleP>
        On a real project the pattern repeats: a team puts feed and billing on the
        same database profile "because we already knew Postgres". Feed could
        tolerate delay. Billing could not. The right database for one became pain
        for the other.
      </ArticleP>

      <ArticleP>
        This post covers database choice in large{" "}
        <strong>distributed systems</strong>: many machines, replicas, a load
        balancer, and real tradeoffs. Not a single-server shop system.
      </ArticleP>

      <ArticleCallout variant="note" title="Source">
        <ArticleP>
          The idea and outline of this piece come mainly from the video{" "}
          <a
            href={VIDEO_SOURCE_URL}
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            How to Choose the Right Database for Your Application (System Design
            and Software Architecture)
          </a>
          . I reorganized the material in my own voice, with links and examples
          for reference.
        </ArticleP>
      </ArticleCallout>

      <ArticleCallout variant="tip" title="Want a decision now?">
        <ArticleP>
          Jump to{" "}
          <a href="#6-how-i-choose-in-practice" className={linkClass}>
            section 6
          </a>
          : checklist + a worked example (three services, three databases). The{" "}
          <a href="#4-cap-and-pacelc" className={linkClass}>
            CAP / PACELC
          </a>{" "}
          map and{" "}
          <a
            href="#5-how-databases-fit-and-what-changes-in-cassandra"
            className={linkClass}
          >
            section 5
          </a>{" "}
          explain the why.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        What usually goes wrong when the answer stops at "SQL vs NoSQL":
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          you pick the data model and forget the failure profile
        </ArticleLi>
        <ArticleLi>
          you scale the API and leave the database as a single point of pain
        </ArticleLi>
        <ArticleLi>
          you treat{" "}
          <TermLink href={EVENTUAL_URL}>eventual consistency</TermLink> as a
          bug, when sometimes it is the price of availability
        </ArticleLi>
        <ArticleLi>
          you force{" "}
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> to look like{" "}
          <TermLink href={SPANNER_URL}>Spanner</TermLink> with replicas and
          faith
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Terms you will see constantly:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          consistency: everyone reads the same "current" version of the data (or
          the agreed freshness rule)
        </ArticleLi>
        <ArticleLi>
          availability: the system keeps responding even under failure
        </ArticleLi>
        <ArticleLi>
          <TermLink href={PARTITION_URL}>network partition</TermLink>: nodes
          that should talk to each other stop seeing each other
        </ArticleLi>
        <ArticleLi>
          latency: how long the operation takes to confirm
        </ArticleLi>
        <ArticleLi>
          <TermLink href={EVENTUAL_URL}>eventual consistency</TermLink>: the
          system converges later; for a while, reads may diverge
        </ArticleLi>
        <ArticleLi>
          <TermLink href={SHARDING_URL}>sharding</TermLink>: slicing data across
          nodes instead of copying the whole database on every machine
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Shortcut">
        <ArticleP>
          Want the decision map and database table now? Jump to{" "}
          <a href="#4-cap-and-pacelc" className={linkClass}>
            section 4
          </a>{" "}
          and{" "}
          <a
            href="#5-how-databases-fit-and-what-changes-in-cassandra"
            className={linkClass}
          >
            section 5
          </a>
          .
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        If you prefer the full path: scale, replicas, theorems, and then the
        table.
      </ArticleP>

      <ArticleH2>2. From a single server to the database bottleneck</ArticleH2>

      <ArticleP>
        The application usually starts simple:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>front end (web/app)</ArticleLi>
        <ArticleLi>API on one server</ArticleLi>
        <ArticleLi>database on the same (or nearly the same) host</ArticleLi>
      </ArticleUl>

      <ArticleP>
        <TermLink href={DNS_URL}>DNS</TermLink> resolves the domain (for example{" "}
        <ArticleCode>api.mysite.com</ArticleCode>) to the server IP. The API
        returns JSON. So far, no mystery.
      </ArticleP>

      <ArticleP>
        When load rises, the natural evolution is to split API and database:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>each scales with different resources</ArticleLi>
        <ArticleLi>
          failure of one does not take down the other in the same process
        </ArticleLi>
        <ArticleLi>
          you size write/read and API CPU separately
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Then comes the scaling choice:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          vertical: more CPU/RAM on the same host. Simple. Single point of
          failure: the machine goes down, the app disappears.
        </ArticleLi>
        <ArticleLi>
          horizontal: several API replicas behind a{" "}
          <TermLink href={LB_URL}>load balancer</TermLink>.{" "}
          <TermLink href={DNS_URL}>DNS</TermLink> points to the balancer; it
          spreads the flood.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Vertical is not "wrong". In many early phases, it is the right move. In
        large always-on systems, horizontal usually wins.
      </ArticleP>

      <ArticleP>
        But N APIs on one database create another bottleneck: the database.
        Twenty app replicas pointing at a single{" "}
        <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> just push the pain
        around. Application scale without data scale does not add up.
      </ArticleP>

      <ArticleP>
        The diagram summarizes that ladder:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Evolution: one server, split database, many apps with load balancer and database bottleneck"
        chart={SCALE_CHART}
      />

      <ArticleH2>3. Replication, partitions, and the tradeoff</ArticleH2>

      <ArticleP>
        In classic relational databases (
        <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink>,{" "}
        <TermLink href={MYSQL_URL}>MySQL</TermLink>
        ), the common path is{" "}
        <strong>database replication</strong> / read replicas:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>one primary (or master) receives writes</ArticleLi>
        <ArticleLi>replicas serve reads</ArticleLi>
        <ArticleLi>
          in many apps, read &gt; write, so read scales first
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        It is not a universal rule. Some products are write-heavy. In the
        typical product with refresh, listing, and dashboard, read pressure hits
        first.
      </ArticleP>

      <ArticleP>
        In practice, the ORM/driver receives:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>write host (or list)</ArticleLi>
        <ArticleLi>list of read hosts</ArticleLi>
        <ArticleLi>credentials and database name</ArticleLi>
      </ArticleUl>

      <ArticleP>
        The app does not "open Chrome" on the primary. It asks for write or
        read; the pool picks the target. The layout looks like this:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Apps write to primary and read from replicas"
        chart={REPLICATION_CHART}
      />

      <ArticleH3>The balance example (and why it hurts)</ArticleH3>

      <ArticleP>
        Imagine a fintech. Balance $1,000. You send a $500 Pix transfer.
      </ArticleP>

      <ArticleOl>
        <ArticleLi>the write confirms on the primary (1000 becomes 500)</ArticleLi>
        <ArticleLi>the replica tries to receive the new data</ArticleLi>
        <ArticleLi>
          under <TermLink href={PARTITION_URL}>network partition</TermLink>, a
          replica falls behind
        </ArticleLi>
        <ArticleLi>
          a refresh reads the stale replica and still shows $1,000
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        All of this is network: app to primary, primary to replicas, app to
        replica. Partition does not mean "the disk died". It means "that network
        path disappeared".
      </ArticleP>

      <ArticleP>
        That is{" "}
        <TermLink href={EVENTUAL_URL}>eventual consistency</TermLink>: the
        system converges later. On a social feed, sometimes that is acceptable.
        On a bank balance, it is an incident (infinite Pix in the worst design).
      </ArticleP>

      <ArticleH3>Synchronous vs asynchronous</ArticleH3>

      <ArticleP>
        "Just make the replica synchronous" sounds like a fix. It is not free.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          synchronous: confirms only after writing to replicas. Under partition,
          it stalls or fails. You buy consistency and pay in availability /
          latency.
        </ArticleLi>
        <ArticleLi>
          asynchronous: confirms early and replicates underneath. You buy
          availability / low latency and accept lag.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Under partition, sync does not "hold the world". It holds confirmation
        until it can (or times out). In practice: the user sees an error or an
        eternal spinner. The app is unavailable for that write.
      </ArticleP>

      <ArticleP>
        Even without partition, sync to 15-20 replicas creates absurd latency: the
        confirmation waits for the copy queue. Async brings lag back.
      </ArticleP>

      <ArticleP>
        Three pains in the same design:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>consistency</ArticleLi>
        <ArticleLi>availability</ArticleLi>
        <ArticleLi>latency</ArticleLi>
      </ArticleUl>

      <ArticleP>
        There is no silver bullet. There is priority.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Write path: synchronous causes latency or unavailability; asynchronous causes eventual consistency"
        chart={TRADEOFF_CHART}
      />

      <ArticleCallout variant="note" title="The core point">
        <ArticleP>
          Choosing a database is choosing which attributes you prioritize under
          failure and under normal operation. It is not "SQL or NoSQL".
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>4. CAP and PACELC</ArticleH2>

      <ArticleP>
        These tradeoffs are not blog opinion. They are studied limits.
      </ArticleP>

      <ArticleH3>
        <TermLink href={CAP_URL}>CAP</TermLink>
      </ArticleH3>

      <ArticleP>
        The{" "}
        <TermLink href={CAP_URL}>CAP</TermLink> theorem (Eric Brewer,
        popularized in the 2000s) covers three letters:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>C: Consistency</ArticleLi>
        <ArticleLi>A: Availability</ArticleLi>
        <ArticleLi>P: Partition tolerance</ArticleLi>
      </ArticleUl>

      <ArticleP>
        In a distributed system, partition happens. The "pick 2 of 3" meme aged
        poorly. The useful design is: under partition, you do not keep C and A
        at the same time in the strong sense.
      </ArticleP>

      <ArticleP>
        That is exactly what the Pix example showed: sync tightens C and loses
        A; async keeps A and gives up immediate C.
      </ArticleP>

      <ArticleImg
        src="/images/publications/escolha-banco-dados-cap-pacelc/cap-theorem.svg"
        alt="CAP theorem diagram with Consistency, Availability, and Partition tolerance"
        caption={
          <>
            Classic{" "}
            <TermLink href={CAP_URL}>CAP</TermLink> diagram. Source:{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:CAP_Theorem.svg"
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikimedia Commons
            </a>
            .
          </>
        }
      />

      <ArticleImg
        src="/images/publications/escolha-banco-dados-cap-pacelc/cap-theorem-euler.png"
        alt="Euler diagram of the CAP theorem showing CA, CP, and AP pairs"
        caption={
          <>
            Set view (CA / CP / AP) of{" "}
            <TermLink href={CAP_URL}>CAP</TermLink>. Source:{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:CAP_Theorem_Euler_Diagram.png"
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikimedia Commons
            </a>
            .
          </>
        }
      />

      <ArticleH3>
        <TermLink href={PACELC_URL}>PACELC</TermLink>
      </ArticleH3>

      <ArticleP>
        In 2012, Daniel Abadi formalized{" "}
        <TermLink href={PACELC_URL}>PACELC</TermLink> as an extension of{" "}
        <TermLink href={CAP_URL}>CAP</TermLink>. It does not cancel{" "}
        <TermLink href={CAP_URL}>CAP</TermLink>. It completes the map when the
        network is "healthy".
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          if there is Partition: choose Availability or Consistency
        </ArticleLi>
        <ArticleLi>
          Else (no partition): choose Latency or Consistency
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        The "E" is the else in the code: if there is no partition, there is
        still a tradeoff. Only the axis changes (latency vs consistency).
      </ArticleP>

      <ArticleP>
        That is the map I use in interviews and service design.
      </ArticleP>

      <ArticleImg
        src="/images/publications/escolha-banco-dados-cap-pacelc/pacelc-theorem.png"
        alt="PACELC theorem diagram: under partition A or C; otherwise latency or C"
        caption={
          <>
            <TermLink href={PACELC_URL}>PACELC</TermLink> in one figure. Source:{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:PACELC_theorem.png"
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikimedia Commons
            </a>
            .
          </>
        }
      />

      <ArticleMermaid
        ariaLabel="PACELC decision: with partition A or C; without partition latency or C"
        chart={PACELC_CHART}
      />

      <ArticleH3>Social network vs fintech</ArticleH3>

      <ArticleP>
        Same "cluster", different requirement. Think of two microservices.
      </ArticleP>

      <ArticleP>
        Feed / like / comment, under partition:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          prioritize availability: write to the reachable node and return OK
        </ArticleLi>
        <ArticleLi>
          replicate async; the counter may lag by seconds
        </ArticleLi>
        <ArticleLi>
          users prefer the app up over a perfect real-time like
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Without partition, on the same feed:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          prioritize low latency: do not wait for 20 nodes to confirm the like
        </ArticleLi>
        <ArticleLi>
          strong global consistency on a like is usually overkill and annoying
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Ledger / balance / Pix:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          under partition, lying about the balance is worse than refusing the
          operation
        </ArticleLi>
        <ArticleLi>
          without partition, you still pay latency for strong confirmation
        </ArticleLi>
        <ArticleLi>
          here C leads; A and L become conscious cost
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        That is why feed and ledger rarely share the same database profile.
      </ArticleP>

      <ArticleCallout variant="warning" title="PostgreSQL in CAP">
        <ArticleP>
          Classic <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> is strong
          on one node (thought of as CA in old{" "}
          <TermLink href={CAP_URL}>CAP</TermLink>
          talk): local consistency and availability, without being a multi-primary
          distributed store "out of the box".
        </ArticleP>
        <ArticleP>
          Replicas help read. They do not alone turn Postgres into{" "}
          <TermLink href={SPANNER_URL}>Spanner</TermLink>. Manual{" "}
          <TermLink href={SHARDING_URL}>sharding</TermLink> exists, but
          ownership explodes: you own key routing, rebalancing, and "where is
          this id?".
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>5. How databases fit (and what changes in Cassandra)</ArticleH2>

      <ArticleP>
        The choice starts with the attribute (
        <TermLink href={PACELC_URL}>PACELC</TermLink>
        ), then the data model:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>relational (rows/tables, joins)</ArticleLi>
        <ArticleLi>document (flexible JSON/BSON)</ArticleLi>
        <ArticleLi>columnar / wide-column</ArticleLi>
        <ArticleLi>key-value</ArticleLi>
        <ArticleLi>distributed relational (SQL + consensus across nodes)</ArticleLi>
      </ArticleUl>

      <ArticleP>
        "NoSQL" is not one database. It is an umbrella. Picking "NoSQL" is as
        vague as picking "framework".
      </ArticleP>

      <ArticleTable caption="Quick read on the PACELC map (simplified)">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Database</ArticleTh>
            <ArticleTh>Under partition</ArticleTh>
            <ArticleTh>No partition</ArticleTh>
            <ArticleTh>Notes</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={CASSANDRA_URL}>Cassandra</TermLink>
            </ArticleTd>
            <ArticleTd>Prioritizes A</ArticleTd>
            <ArticleTd>Prioritizes L</ArticleTd>
            <ArticleTd>Columnar; tunable consistency (quorum)</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={MONGODB_URL}>MongoDB</TermLink>
            </ArticleTd>
            <ArticleTd>Prioritizes C</ArticleTd>
            <ArticleTd>Prioritizes C</ArticleTd>
            <ArticleTd>
              Document; replica set with leader (
              <TermLink href={RAFT_URL}>Raft</TermLink>
              -like);{" "}
              <TermLink href={ACID_URL}>ACID</TermLink> in many scenarios
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink>
            </ArticleTd>
            <ArticleTd>Configurable</ArticleTd>
            <ArticleTd>Configurable</ArticleTd>
            <ArticleTd>
              Consistent read true/false changes the read profile
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={COCKROACH_URL}>CockroachDB</TermLink>
            </ArticleTd>
            <ArticleTd>Prioritizes C</ArticleTd>
            <ArticleTd>Prioritizes C</ArticleTd>
            <ArticleTd>Distributed SQL; strong on consistency</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={SPANNER_URL}>Spanner</TermLink>
            </ArticleTd>
            <ArticleTd>Prioritizes C</ArticleTd>
            <ArticleTd>Prioritizes C</ArticleTd>
            <ArticleTd>
              <TermLink href={TRUETIME_URL}>TrueTime</TermLink> /{" "}
              <TermLink href={PAXOS_URL}>Paxos</TermLink>; expensive and
              powerful
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={REDIS_URL}>Redis</TermLink> +{" "}
              <TermLink href={SENTINEL_URL}>Sentinel</TermLink>
            </ArticleTd>
            <ArticleTd>Depends on mode</ArticleTd>
            <ArticleTd>Low L</ArticleTd>
            <ArticleTd>In-memory cache / structure; not general OLTP</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink>
            </ArticleTd>
            <ArticleTd>Single-node limit</ArticleTd>
            <ArticleTd>Strong C on node</ArticleTd>
            <ArticleTd>Excellent in the right role; not DIY Spanner</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        The table is a compass, not dogma. Product defaults change; read the
        doc for the mode you turned on. You can "loosen" or "tighten" some
        databases. Fighting the essence is not always worth it.
      </ArticleP>

      <ArticleH3>
        <TermLink href={CASSANDRA_URL}>Cassandra</TermLink>: nodes, RF, and quorum
      </ArticleH3>

      <ArticleP>
        <TermLink href={CASSANDRA_URL}>Cassandra</TermLink> was built for high
        availability and low latency. Wide-column model,{" "}
        <TermLink href={CQL_URL}>CQL</TermLink> close to SQL, and data spread
        across nodes (
        <TermLink href={SHARDING_URL}>sharding</TermLink> / partitioning).
      </ArticleP>

      <ArticleP>
        Think of a pizza: each slice is a node with a piece of the data. The
        cluster knows where Tokyo or the Sony camera is. Instead of "copy the
        whole table to every read replica", you fragment and replicate with
        replication factor (RF).
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Client talking to several Cassandra nodes in the cluster"
        chart={CASSANDRA_CHART}
      />

      <ArticleP>
        RF = 10 means: that data should exist on 10 nodes (even with 100 nodes
        in the cluster). Quorum is usually{" "}
        <ArticleCode>RF/2 + 1</ArticleCode>. With RF 10, quorum = 6 (majority).
      </ArticleP>

      <ArticleP>
        Why majority? Because write with 6 and read with 6 force intersection:
        at least one node seen on read saw the write. That reduces "I read the
        stale balance" without requiring ALL.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="RF 10 yields quorum 6; write and read at quorum intersect"
        chart={QUORUM_CHART}
      />

      <ArticleP>
        At request time you set the{" "}
        <TermLink href={QUORUM_URL}>consistency level</TermLink> on write and
        read:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>ONE</ArticleCode>: confirms / reads on one node. Closer
          to A and L. More risk of stale data.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>QUORUM</ArticleCode>: majority of RF. Closer to C, with
          higher latency.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>LOCAL_QUORUM</ArticleCode>: majority in the local
          datacenter (useful multi-DC).
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ALL</ArticleCode>: all of RF. Maximum C, maximum latency
          / availability pain.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        The trick: it is not binary. The same cluster can be "loose" on a like (
        <ArticleCode>ONE</ArticleCode>) and "tight" on more critical data (
        <ArticleCode>QUORUM</ArticleCode>), if the design allows it.
      </ArticleP>

      <ArticleCode block>
        {`CREATE KEYSPACE store
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 10};

CREATE TABLE store.product (
  id UUID PRIMARY KEY,
  name text,
  price decimal
);

INSERT INTO store.product (id, name, price)
VALUES (uuid(), 'Sony Camera', 15000);`}
      </ArticleCode>

      <ArticleP>
        On the client, consistency level goes on the operation:
      </ArticleP>

      <ArticleCode block>
        {`// write with quorum (majority of RF)
statement.setConsistencyLevel(ConsistencyLevel.QUORUM);
session.execute(statement);

// loose read (accepts possible lag)
readStatement.setConsistencyLevel(ConsistencyLevel.ONE);
session.execute(readStatement);`}
      </ArticleCode>

      <ArticleCallout variant="tip" title="Typical Cassandra use cases">
        <ArticleUl>
          <ArticleLi>feeds / timelines</ArticleLi>
          <ArticleLi>time series and IoT</ArticleLi>
          <ArticleLi>catalog with massive writes</ArticleLi>
          <ArticleLi>globally distributed catalog</ArticleLi>
          <ArticleLi>24x7 workloads that hate downtime</ArticleLi>
        </ArticleUl>
        <ArticleP>
          Large teams (historically Discord, for example) used{" "}
          <TermLink href={CASSANDRA_URL}>Cassandra</TermLink> at absurd message
          scale. The point is not "copy the stack". It is: the A+L profile with a
          quorum dial exists and scales.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>
        <TermLink href={MONGODB_URL}>MongoDB</TermLink>: the "it is NoSQL, so
        it scales alone" story
      </ArticleH3>

      <ArticleP>
        Typical scene: product catalog with flexible JSON. Someone says "let us
        go with <TermLink href={MONGODB_URL}>MongoDB</TermLink> because it is
        NoSQL and fast". The document model fits. The pitfall is assuming the
        replica set was born to give up C.
      </ArticleP>

      <ArticleP>
        In the set there is a leader for writes. If the leader falls, consensus
        (<TermLink href={RAFT_URL}>Raft</TermLink> family) elects another. Meanwhile
        the historical default prioritizes consistency in the set. There is{" "}
        <TermLink href={ACID_URL}>ACID</TermLink> in supported transactions.
      </ArticleP>

      <ArticleP>
        I would use Mongo when the domain is document-oriented and when strong
        consistency inside the replica set is important. I would not use Mongo
        when the main requirement is maximum availability under partition, which
        is the classic Cassandra profile.
      </ArticleP>

      <ArticleH3>
        <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink>: one service, two
        dials
      </ArticleH3>

      <ArticleP>
        Scene: account microservice. The user bio can lag. The internal wallet
        balance cannot. Instead of two databases on day 1, the team uses{" "}
        <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink> and dials the read:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          bio:{" "}
          <TermLink href={DYNAMODB_CONSISTENT_URL}>ConsistentRead</TermLink>{" "}
          <ArticleCode>false</ArticleCode> (eventual, cheaper / faster in the
          usual profile)
        </ArticleLi>
        <ArticleLi>
          balance: <ArticleCode>true</ArticleCode> (strong on that call)
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        The story is not "Dynamo fixes everything". It is: the dial goes on the
        operation. That moves the conversation from vendor to requirement.
      </ArticleP>

      <ArticleH3>
        <TermLink href={COCKROACH_URL}>CockroachDB</TermLink> and{" "}
        <TermLink href={SPANNER_URL}>Spanner</TermLink>: when SQL must cross
        regions
      </ArticleH3>

      <ArticleP>
        Interview (and global product) scene: inventory or ledger with SQL,
        multi-region, no "eventual is fine". Spinning up another{" "}
        <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> with async replica
        does not close it.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <TermLink href={COCKROACH_URL}>CockroachDB</TermLink>: distributed SQL
          with a C focus; <TermLink href={RAFT_URL}>Raft</TermLink> underneath;
          inventory, finance, multi-region games.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={SPANNER_URL}>Spanner</TermLink>: strong global C with{" "}
          <TermLink href={TRUETIME_URL}>TrueTime</TermLink> and{" "}
          <TermLink href={PAXOS_URL}>Paxos</TermLink> family. Expensive. You are
          buying the hard problem solved.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        I only bring these names to the table when the requirement is explicit:
        global SQL with strong consistency across regions. Without that
        requirement, cost in money and operations usually eats the gain.
      </ArticleP>

      <ArticleH3>
        <TermLink href={REDIS_URL}>Redis</TermLink> and{" "}
        <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink>: roles that get
        mixed up often
      </ArticleH3>

      <ArticleP>
        Scene: "let us store the balance in{" "}
        <TermLink href={REDIS_URL}>Redis</TermLink> because it is fast". Great
        latency. Durability and ledger model, no. Redis (+{" "}
        <TermLink href={SENTINEL_URL}>Sentinel</TermLink>) shines as cache,
        session, light queue, ranking. Bad as the only database for a banking
        domain.
      </ArticleP>

      <ArticleP>
        Another scene: Postgres excellent in a single-region monolith. The
        drift shows up later: faking global multi-primary with only async replica
        and expensive RDS. Transactions and joins stay great. The{" "}
        <TermLink href={PACELC_URL}>PACELC</TermLink> map does not.
      </ArticleP>

      <ArticleP>
        Doing manual <TermLink href={SHARDING_URL}>sharding</TermLink> on
        Postgres means becoming a database platform team: id routing, rebalance,
        slice failover. It works. Almost never worth it if the requirement already
        asks for a truly distributed store.
      </ArticleP>

      <ArticleH2>6. How I choose in practice</ArticleH2>

      <ArticleP>
        Checklist I use before opening an infra PR:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          Under partition, does the service need to keep responding (A) or
          refuse to avoid lying (C)?
        </ArticleLi>
        <ArticleLi>
          Without partition, what hurts more: high latency or stale data?
        </ArticleLi>
        <ArticleLi>
          What is the real use case (ledger, feed, catalog, session, cache)?
        </ArticleLi>
        <ArticleLi>
          Is consistency tunable per operation (quorum / consistent read) or
          does the product default already suffice?
        </ArticleLi>
        <ArticleLi>
          What data model does the domain need (relational, document, columnar,
          KV)?
        </ArticleLi>
        <ArticleLi>
          What is the operational cost: team knows the database? multi-region?
          bill?
        </ArticleLi>
      </ArticleOl>

      <ArticleH3>Worked example: three services, three choices</ArticleH3>

      <ArticleP>
        Same product. Three microservices. I do not force one database.
      </ArticleP>

      <ArticleTable caption="How I would apply the checklist on a real product">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Service</ArticleTh>
            <ArticleTh>Under partition</ArticleTh>
            <ArticleTh>Without partition</ArticleTh>
            <ArticleTh>Choice</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Feed / like</ArticleTd>
            <ArticleTd>Prioritize A</ArticleTd>
            <ArticleTd>Prioritize L</ArticleTd>
            <ArticleTd>
              <TermLink href={CASSANDRA_URL}>Cassandra</TermLink> (ONE/QUORUM
              depending on the data)
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Billing / balance</ArticleTd>
            <ArticleTd>Prioritize C</ArticleTd>
            <ArticleTd>Accept higher L</ArticleTd>
            <ArticleTd>
              <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> (region) or{" "}
              <TermLink href={COCKROACH_URL}>CockroachDB</TermLink> (global)
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Session / page cache</ArticleTd>
            <ArticleTd>A matters</ArticleTd>
            <ArticleTd>L leads</ArticleTd>
            <ArticleTd>
              <TermLink href={REDIS_URL}>Redis</TermLink> (+ durable store behind)
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        That is what the billing example shows: unifying feed and billing on the
        same profile is the anti-pattern. The solid path is letting{" "}
        <TermLink href={PACELC_URL}>PACELC</TermLink> decide per service.
      </ArticleP>

      <ArticleP>
        Honest shortcuts (after the checklist, not before):
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          strong global C + SQL:{" "}
          <TermLink href={COCKROACH_URL}>CockroachDB</TermLink> /{" "}
          <TermLink href={SPANNER_URL}>Spanner</TermLink> (and the price)
        </ArticleLi>
        <ArticleLi>
          A + L with massive writes:{" "}
          <TermLink href={CASSANDRA_URL}>Cassandra</TermLink> / similar
          families
        </ArticleLi>
        <ArticleLi>
          single-region relational domain:{" "}
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink>
        </ArticleLi>
        <ArticleLi>
          dial per call on managed KV/doc:{" "}
          <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink>
        </ArticleLi>
        <ArticleLi>
          cache / fast structure:{" "}
          <TermLink href={REDIS_URL}>Redis</TermLink>
        </ArticleLi>
      </ArticleUl>

      <ArticleTable caption="Anti-patterns I have seen cost dearly">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Anti-pattern</ArticleTh>
            <ArticleTh>Why it hurts</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>"Mongo because it is fast"</ArticleTd>
            <ArticleTd>
              Ignores the replica set C profile and the domain
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>One database for all microservices</ArticleTd>
            <ArticleTd>Feed and ledger become the same tradeoff</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>N apps, 1 Postgres, zero data plan</ArticleTd>
            <ArticleTd>The bottleneck just moved</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Sync to 20 replicas "for safety"</ArticleTd>
            <ArticleTd>Latency becomes the product</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Manual sharding without need</ArticleTd>
            <ArticleTd>You become a database platform team</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Interview phrase that works better than the meme:
      </ArticleP>

      <ArticleP>
        "Under partition I prioritize X; without partition I prioritize Y; the
        use case is Z; so the candidate is W; the dial I have is D."
      </ArticleP>

      <ArticleH3>Key takeaways</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          "SQL vs NoSQL" alone does not pick a database. The deciding factor is
          which attribute must be preserved during failure.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={CAP_URL}>CAP</TermLink> +{" "}
          <TermLink href={PACELC_URL}>PACELC</TermLink>: under partition A vs
          C; otherwise L vs C.
        </ArticleLi>
        <ArticleLi>
          Read replica helps read. Sync/async is still a tradeoff.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={CASSANDRA_URL}>Cassandra</TermLink>: RF + quorum =
          tunable consistency at runtime (write and read).
        </ArticleLi>
        <ArticleLi>
          <TermLink href={MONGODB_URL}>MongoDB</TermLink> usually prioritizes
          consistency inside the replica set;{" "}
          <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink> lets you choose
          consistency per read;{" "}
          <TermLink href={COCKROACH_URL}>CockroachDB</TermLink> and{" "}
          <TermLink href={SPANNER_URL}>Spanner</TermLink> charge more to deliver
          strong global consistency.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> does not become
          Spanner with faith and expensive RDS.
        </ArticleLi>
        <ArticleLi>
          Different microservices can (and should) have different databases.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusion</ArticleH3>

      <ArticleP>
        I do not pick a database from the interview meme. I pick by the attribute
        the business cannot lose.
      </ArticleP>

      <ArticleP>
        <TermLink href={PACELC_URL}>PACELC</TermLink> is the map. The product
        (Cassandra, Mongo, Postgres, Spanner…) is the tool already biased toward
        one corner of that map, with more or less dial.
      </ArticleP>

      <ArticleP>
        In the next interview, instead of "I use Mongo because it is fast",
        explain the full reasoning: priority under partition, priority without
        partition, real use case, chosen candidate, and available consistency
        dial. That shows clear system design decision-making.
      </ArticleP>
    </>
  );
}
