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
  S1["1 servidor"] --> S2["API + DB separados"]
  S2 --> S3["N apps + LB"]
  S3 --> S4["1 DB gargalo"]`;

const REPLICATION_CHART = `flowchart TB
  Apps["Apps / API"]
  Primary["Primary write"]
  R1["Replica read"]
  R2["Replica read"]

  Apps -->|"escrita"| Primary
  Apps -->|"leitura"| R1
  Apps -->|"leitura"| R2
  Primary -.->|"replica"| R1
  Primary -.->|"replica"| R2`;

const TRADEOFF_CHART = `flowchart TB
  Write["Escrita no primary"]
  Write --> Sync["Replicacao sincrona"]
  Write --> Async["Replicacao assincrona"]
  Sync --> PainSync["Latencia / indisponibilidade"]
  Async --> PainAsync["Consistencia eventual"]`;

const PACELC_CHART = `flowchart TB
  Q["Ha particao de rede?"]
  Q -->|"Sim"| PA["Escolha: A ou C"]
  Q -->|"Nao"| EL["Escolha: L ou C"]
  PA --> Social["Ex: like / feed"]
  PA --> Bank["Ex: saldo / Pix"]
  EL --> Fast["Baixa latencia"]
  EL --> Strong["Consistencia forte"]`;

const CASSANDRA_CHART = `flowchart TB
  Client["Cliente"]
  N1["No 1"]
  N2["No 2"]
  N3["No 3"]
  N4["No 4"]

  Client --> N1
  Client --> N2
  Client --> N3
  Client --> N4
  N1 --- N2
  N2 --- N3
  N3 --- N4
  N4 --- N1`;

const QUORUM_CHART = `flowchart LR
  RF["RF = 10 nos"] --> Maj["Quorum = 6"]
  Maj --> Write["Write QUORUM"]
  Maj --> Read["Read QUORUM"]
  Write --> Safe["Intersecao garante dado fresco"]
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

export function EscolhaBancoDadosCapPacelcContentPt() {
  return (
    <>
      <ArticleH2>1. O problema da resposta rasa</ArticleH2>

      <ArticleP>
        A pergunta “qual banco você usaria?” ainda recebe resposta rasa com
        frequência. Em entrevista (e depois em desenho de serviço), o automático
        costuma ser:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          dados relacionados e estruturados:{" "}
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> /{" "}
          <TermLink href={MYSQL_URL}>MySQL</TermLink>
        </ArticleLi>
        <ArticleLi>
          menos relacionamento e “mais performance”:{" "}
          <TermLink href={MONGODB_URL}>MongoDB</TermLink> /{" "}
          <TermLink href={CASSANDRA_URL}>Cassandra</TermLink>
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        O entrevistador não quis saber o logo. Quis saber o que se prioriza sob{" "}
        <TermLink href={PARTITION_URL}>partição</TermLink> e o que se aceita
        pagar em latência. Sem o mapa de tradeoffs, sobra só o atalho da
        entrevista.
      </ArticleP>

      <ArticleP>
        Em projeto real o padrão se repete: um time coloca feed e cobrança no
        mesmo perfil de banco “porque já conhecíamos Postgres”. Feed aguentava
        atraso. Cobrança não. O banco certo para um virou dor no outro.
      </ArticleP>

      <ArticleP>
        Este post cobre a escolha de banco em{" "}
        <strong>sistemas distribuídos</strong> de porte: várias máquinas,
        réplicas, balanceador e tradeoffs reais. Não é o sistema da padaria num
        único servidor.
      </ArticleP>

      <ArticleCallout variant="note" title="Fonte">
        <ArticleP>
          A ideia e o roteiro deste texto partem principalmente do vídeo{" "}
          <a
            href={VIDEO_SOURCE_URL}
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            Como Escolher o Banco de Dados Correto pra sua Aplicação (System
            Design e Arquitetura de Software)
          </a>
          . Aqui reorganizei o conteúdo na minha voz, com links e exemplos para
          consulta.
        </ArticleP>
      </ArticleCallout>

      <ArticleCallout variant="tip" title="Quer decisão agora?">
        <ArticleP>
          Pule para a{" "}
          <a href="#6-como-eu-escolho-na-pratica" className={linkClass}>
            seção 6
          </a>
          : checklist + um exemplo trabalhado (três serviços, três bancos). O
          mapa{" "}
          <a href="#4-cap-e-pacelc" className={linkClass}>
            CAP / PACELC
          </a>{" "}
          e a{" "}
          <a
            href="#5-como-bancos-se-encaixam-e-o-que-muda-no-cassandra"
            className={linkClass}
          >
            seção 5
          </a>{" "}
          explicam o porquê.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        O que costuma dar errado quando a resposta para em “SQL vs NoSQL”:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          você escolhe o modelo de dados e esquece o perfil sob falha
        </ArticleLi>
        <ArticleLi>
          você escala a API e deixa o banco como single point of pain
        </ArticleLi>
        <ArticleLi>
          você trata{" "}
          <TermLink href={EVENTUAL_URL}>consistência eventual</TermLink> como
          bug, quando às vezes é o preço da disponibilidade
        </ArticleLi>
        <ArticleLi>
          você força{" "}
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> a parecer{" "}
          <TermLink href={SPANNER_URL}>Spanner</TermLink> com réplica e fé
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Nomes que você vai ver o tempo todo:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          consistência: todo mundo lê a mesma versão “atual” do dado (ou a
          regra combinada de atualidade)
        </ArticleLi>
        <ArticleLi>
          disponibilidade: o sistema continua respondendo mesmo sob falha
        </ArticleLi>
        <ArticleLi>
          <TermLink href={PARTITION_URL}>partição de rede</TermLink>: nós que
          deveriam falar entre si deixam de se enxergar
        </ArticleLi>
        <ArticleLi>
          latência: quanto tempo a operação demora até confirmar
        </ArticleLi>
        <ArticleLi>
          <TermLink href={EVENTUAL_URL}>consistência eventual</TermLink>: o
          sistema converge depois; por um tempo, leituras podem divergir
        </ArticleLi>
        <ArticleLi>
          <TermLink href={SHARDING_URL}>sharding</TermLink>: fatiar dados entre
          nós, em vez de copiar a base inteira em toda máquina
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>2. Do servidor único ao gargalo no banco</ArticleH2>

      <ArticleP>
        A aplicação costuma nascer simples:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>front (web/app)</ArticleLi>
        <ArticleLi>API num servidor</ArticleLi>
        <ArticleLi>banco no mesmo (ou quase o mesmo) host</ArticleLi>
      </ArticleUl>

      <ArticleP>
        O <TermLink href={DNS_URL}>DNS</TermLink> resolve o domínio (por
        exemplo <ArticleCode>api.meusite.com</ArticleCode>) para o IP do
        servidor. A API responde JSON. Até aqui, mistério nenhum.
      </ArticleP>

      <ArticleP>
        Quando a carga sobe, a evolução natural é separar API e banco:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>cada um escala com recurso diferente</ArticleLi>
        <ArticleLi>falha de um não derruba o outro no mesmo processo</ArticleLi>
        <ArticleLi>você dimensiona escrita/leitura e CPU da API à parte</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Depois vem a escolha de escala da aplicação:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          vertical: mais CPU/RAM no mesmo host. Simples. Single point of
          failure: a máquina cai, a app some.
        </ArticleLi>
        <ArticleLi>
          horizontal: várias réplicas da API atrás de um{" "}
          <TermLink href={LB_URL}>load balancer</TermLink>. O DNS aponta para o
          balanceador; ele reparte a enchurrada.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Vertical não é “errado”. Em muita fase inicial, é o movimento certo.
        Em sistemas grandes e sempre ligados, horizontal costuma ganhar.
      </ArticleP>

      <ArticleP>
        Só que N APIs no mesmo banco criam outro gargalo: o banco. Vinte
        réplicas de app apontando para um único{" "}
        <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> só empurram a dor.
        Escala de aplicação sem escala de dados não fecha a conta.
      </ArticleP>

      <ArticleP>
        O diagrama resume essa escada:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Evolução: um servidor, separar banco, várias apps com load balancer e gargalo no banco"
        chart={SCALE_CHART}
      />

      <ArticleH2>3. Replicação, partição e o tradeoff</ArticleH2>

      <ArticleP>
        Em bancos relacionais clássicos (
        <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink>,{" "}
        <TermLink href={MYSQL_URL}>MySQL</TermLink>
        ), o caminho comum é{" "}
        <strong>database replication</strong> / read replicas:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>um primary (ou master) recebe escritas</ArticleLi>
        <ArticleLi>réplicas servem leituras</ArticleLi>
        <ArticleLi>
          em muitas apps, leitura &gt; escrita, então a leitura escala primeiro
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Não é regra universal. Tem produto write-heavy. No cenário típico de
        produto com refresh, listagem e dashboard, leitura aperta primeiro.
      </ArticleP>

      <ArticleP>
        Na prática, o ORM/driver recebe:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>host (ou lista) de escrita</ArticleLi>
        <ArticleLi>lista de hosts de leitura</ArticleLi>
        <ArticleLi>credenciais e nome do banco</ArticleLi>
      </ArticleUl>

      <ArticleP>
        A app não “abre Chrome” no primary. Ela pede escrita ou leitura; o
        pool escolhe o destino. O desenho fica assim:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Apps escrevem no primary e leem em réplicas"
        chart={REPLICATION_CHART}
      />

      <ArticleH3>O exemplo do saldo (e por que dói)</ArticleH3>

      <ArticleP>
        Imagine uma fintech. Saldo R$ 1.000. Você faz um Pix de R$ 500.
      </ArticleP>

      <ArticleOl>
        <ArticleLi>a escrita confirma no primary (1000 vira 500)</ArticleLi>
        <ArticleLi>a réplica tenta receber o dado novo</ArticleLi>
        <ArticleLi>
          sob <TermLink href={PARTITION_URL}>partição de rede</TermLink>, uma
          réplica fica para trás
        </ArticleLi>
        <ArticleLi>
          um refresh lê a réplica atrasada e ainda mostra R$ 1.000
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        Tudo isso é rede: app com primary, primary com réplicas, app com
        réplica. Partição não significa “o disco morreu”. Significa “esse
        caminho de rede sumiu”.
      </ArticleP>

      <ArticleP>
        Isso é{" "}
        <TermLink href={EVENTUAL_URL}>consistência eventual</TermLink>: o
        sistema converge depois. Em feed de rede social, às vezes é aceitável.
        Em saldo bancário, é incidente (Pix infinito no pior desenho).
      </ArticleP>

      <ArticleH3>Síncrono vs assíncrono</ArticleH3>

      <ArticleP>
        “Só tornar a réplica síncrona” parece resolver. Não resolve de graça.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          síncrono: só confirma depois de gravar nas réplicas. Sob partição,
          trava ou falha. Você compra consistência e paga disponibilidade /
          latência.
        </ArticleLi>
        <ArticleLi>
          assíncrono: confirma cedo e replica por baixo. Você compra
          disponibilidade / baixa latência e aceita atraso.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Sob partição, sync não “segura o mundo”. Ele segura a confirmação até
        conseguir (ou estourar timeout). Na prática: usuário vê erro ou spinner
        eterno. A app fica indisponível para aquela escrita.
      </ArticleP>

      <ArticleP>
        Mesmo sem partição, sync para 15-20 réplicas gera latência absurda: a
        confirmação espera a fila de cópias. Async volta ao atraso.
      </ArticleP>

      <ArticleP>
        Três dores no mesmo desenho:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>consistência</ArticleLi>
        <ArticleLi>disponibilidade</ArticleLi>
        <ArticleLi>latência</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Não existe bala de prata. Existe prioridade.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Escrita: caminho sincrono gera latencia ou indisponibilidade; assincrono gera consistencia eventual"
        chart={TRADEOFF_CHART}
      />

      <ArticleCallout variant="note" title="O ponto central">
        <ArticleP>
          Escolher banco é escolher quais atributos você prioriza sob falha e
          sob operação normal. Não é “SQL ou NoSQL”.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>4. CAP e PACELC</ArticleH2>

      <ArticleP>
        Esses tradeoffs não são opinião de blog. São limite estudado.
      </ArticleP>

      <ArticleH3>
        <TermLink href={CAP_URL}>CAP</TermLink>
      </ArticleH3>

      <ArticleP>
        O teorema{" "}
        <TermLink href={CAP_URL}>CAP</TermLink> (Eric Brewer, popularizado nos
        anos 2000) fala de três letras:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>C: Consistency</ArticleLi>
        <ArticleLi>A: Availability</ArticleLi>
        <ArticleLi>P: Partition tolerance</ArticleLi>
      </ArticleUl>

      <ArticleP>
        Em sistema distribuído, partição acontece. O meme “escolher 2 de 3”
        envelheceu mal. O desenho útil é: sob partição, você não mantém C e A
        ao mesmo tempo no sentido forte.
      </ArticleP>

      <ArticleP>
        Foi exatamente o que o exemplo do Pix mostrou: sync aperta C e perde A;
        async mantém A e abre mão de C imediata.
      </ArticleP>

      <ArticleImg
        src="/images/publications/escolha-banco-dados-cap-pacelc/cap-theorem.svg"
        alt="Diagrama do teorema CAP com Consistency, Availability e Partition tolerance"
        caption={
          <>
            Diagrama clássico do{" "}
            <TermLink href={CAP_URL}>CAP</TermLink>. Fonte:{" "}
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
        alt="Diagrama de Euler do teorema CAP mostrando os pares CA, CP e AP"
        caption={
          <>
            Visão em conjuntos (CA / CP / AP) do{" "}
            <TermLink href={CAP_URL}>CAP</TermLink>. Fonte:{" "}
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
        Em 2012, Daniel Abadi formalizou{" "}
        <TermLink href={PACELC_URL}>PACELC</TermLink> como extensão do{" "}
        <TermLink href={CAP_URL}>CAP</TermLink>. Não anula o{" "}
        <TermLink href={CAP_URL}>CAP</TermLink>. Completa o mapa quando a rede
        está “saudável”.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          se há Partition: escolha Availability ou Consistency
        </ArticleLi>
        <ArticleLi>
          Else (sem partição): escolha Latency ou Consistency
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        O “E” é o else do código: se não há partição, ainda assim há tradeoff.
        Só muda o eixo (latência vs consistência).
      </ArticleP>

      <ArticleP>
        É esse mapa que eu uso na entrevista e no desenho de serviço.
      </ArticleP>

      <ArticleImg
        src="/images/publications/escolha-banco-dados-cap-pacelc/pacelc-theorem.png"
        alt="Diagrama do teorema PACELC: sob partição A ou C; senão latência ou C"
        caption={
          <>
            <TermLink href={PACELC_URL}>PACELC</TermLink> em uma figura. Fonte:{" "}
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
        ariaLabel="Decisão PACELC: com partição A ou C; sem partição latência ou C"
        chart={PACELC_CHART}
      />

      <ArticleH3>Rede social vs fintech</ArticleH3>

      <ArticleP>
        Mesmo “cluster”, requisito diferente. Pense em dois microsserviços.
      </ArticleP>

      <ArticleP>
        Feed / like / comentário, sob partição:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          priorize disponibilidade: grave no nó alcançável e devolva OK
        </ArticleLi>
        <ArticleLi>
          replique async; o contador pode atrasar segundos
        </ArticleLi>
        <ArticleLi>
          usuário prefere app no ar a like perfeito em tempo real
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Sem partição, no mesmo feed:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          priorize baixa latência: não espere 20 nós confirmarem o like
        </ArticleLi>
        <ArticleLi>
          consistência forte global no like costuma ser overkill e irrita
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Ledger / saldo / Pix:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          sob partição, mentir o saldo é pior que recusar a operação
        </ArticleLi>
        <ArticleLi>
          sem partição, ainda assim você paga latência por confirmação forte
        </ArticleLi>
        <ArticleLi>
          aqui C manda; A e L viram custo consciente
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Por isso feed e ledger raramente compartilham o mesmo perfil de banco.
      </ArticleP>

      <ArticleCallout variant="warning" title="PostgreSQL no CAP">
        <ArticleP>
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> clássico é forte
          em um nó (pensado como CA no discurso antigo do{" "}
          <TermLink href={CAP_URL}>CAP</TermLink>
          ): consistência e disponibilidade locais, sem ser um store
          multi-primary distribuído “de fábrica”.
        </ArticleP>
        <ArticleP>
          Réplicas ajudam leitura. Não transformam sozinhas o Postgres num{" "}
          <TermLink href={SPANNER_URL}>Spanner</TermLink>.{" "}
          <TermLink href={SHARDING_URL}>Sharding</TermLink> manual existe, mas
          o ownership explode: você vira dono do roteamento por chave, do
          rebalance e do “onde está esse id?”.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>5. Como bancos se encaixam (e o que muda no Cassandra)</ArticleH2>

      <ArticleP>
        A escolha começa pelo atributo (
        <TermLink href={PACELC_URL}>PACELC</TermLink>
        ), depois pelo modelo de dados:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>relacional (linhas/tabelas, joins)</ArticleLi>
        <ArticleLi>documento (JSON/BSON flexível)</ArticleLi>
        <ArticleLi>colunar / wide-column</ArticleLi>
        <ArticleLi>chave-valor</ArticleLi>
        <ArticleLi>relacional distribuído (SQL + consenso entre nós)</ArticleLi>
      </ArticleUl>

      <ArticleP>
        “NoSQL” não é um banco. É um guarda-chuva. Escolher “NoSQL” é tão vago
        quanto escolher “framework”.
      </ArticleP>

      <ArticleTable caption="Leitura rápida no mapa PACELC (simplificado)">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Banco</ArticleTh>
            <ArticleTh>Sob partição</ArticleTh>
            <ArticleTh>Sem partição</ArticleTh>
            <ArticleTh>Notas</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={CASSANDRA_URL}>Cassandra</TermLink>
            </ArticleTd>
            <ArticleTd>Prioriza A</ArticleTd>
            <ArticleTd>Prioriza L</ArticleTd>
            <ArticleTd>Colunar; consistência ajustável (quorum)</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={MONGODB_URL}>MongoDB</TermLink>
            </ArticleTd>
            <ArticleTd>Prioriza C</ArticleTd>
            <ArticleTd>Prioriza C</ArticleTd>
            <ArticleTd>
              Documento; replica set com líder (
              <TermLink href={RAFT_URL}>Raft</TermLink>
              -like);{" "}
              <TermLink href={ACID_URL}>ACID</TermLink> em vários cenários
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink>
            </ArticleTd>
            <ArticleTd>Configurável</ArticleTd>
            <ArticleTd>Configurável</ArticleTd>
            <ArticleTd>
              Consistent read true/false muda o perfil da leitura
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={COCKROACH_URL}>CockroachDB</TermLink>
            </ArticleTd>
            <ArticleTd>Prioriza C</ArticleTd>
            <ArticleTd>Prioriza C</ArticleTd>
            <ArticleTd>SQL distribuído; forte em consistência</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={SPANNER_URL}>Spanner</TermLink>
            </ArticleTd>
            <ArticleTd>Prioriza C</ArticleTd>
            <ArticleTd>Prioriza C</ArticleTd>
            <ArticleTd>
              <TermLink href={TRUETIME_URL}>TrueTime</TermLink> /{" "}
              <TermLink href={PAXOS_URL}>Paxos</TermLink>; caro e poderoso
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={REDIS_URL}>Redis</TermLink> +{" "}
              <TermLink href={SENTINEL_URL}>Sentinel</TermLink>
            </ArticleTd>
            <ArticleTd>Depende do modo</ArticleTd>
            <ArticleTd>Baixa L</ArticleTd>
            <ArticleTd>Cache / estrutura em memória; não é “o” OLTP geral</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink>
            </ArticleTd>
            <ArticleTd>Limite de single-node</ArticleTd>
            <ArticleTd>C forte no nó</ArticleTd>
            <ArticleTd>Excelente no papel certo; não é Spanner caseiro</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        A tabela é bússola, não dogma. Defaults de produto mudam; leia o doc do
        modo que você ligou. Dá para “afrouxar” ou “apertar” alguns bancos. Nem
        sempre vale a pena lutar contra a essência.
      </ArticleP>

      <ArticleH3>
        <TermLink href={CASSANDRA_URL}>Cassandra</TermLink>: nós, RF e quorum
      </ArticleH3>

      <ArticleP>
        <TermLink href={CASSANDRA_URL}>Cassandra</TermLink> nasceu para alta
        disponibilidade e baixa latência. Modelo wide-column, linguagem{" "}
        <TermLink href={CQL_URL}>CQL</TermLink> perto de SQL, e dados
        espalhados por nós (
        <TermLink href={SHARDING_URL}>sharding</TermLink> / particionamento).
      </ArticleP>

      <ArticleP>
        Pense numa pizza: cada fatia é um nó com pedaço dos dados. O cluster
        sabe onde está Tóquio ou a câmera Sony. Em vez de “copiar a tabela
        inteira para toda réplica de leitura”, você fragmenta e replica com
        fator de replicação (RF).
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Cliente falando com vários nós Cassandra no cluster"
        chart={CASSANDRA_CHART}
      />

      <ArticleP>
        RF = 10 significa: esse dado deve existir em 10 nós (mesmo com 100 nós
        no cluster). Quórum costuma ser{" "}
        <ArticleCode>RF/2 + 1</ArticleCode>. Com RF 10, quórum = 6 (maioria).
      </ArticleP>

      <ArticleP>
        Por que maioria? Porque escrita com 6 e leitura com 6 forçam
        interseção: pelo menos um nó visto na leitura viu a escrita. Isso
        reduz o “li o saldo velho” sem exigir ALL.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="RF 10 gera quorum 6; write e read em quorum se intersectam"
        chart={QUORUM_CHART}
      />

      <ArticleP>
        Em tempo de request você define o{" "}
        <TermLink href={QUORUM_URL}>consistency level</TermLink> na escrita e
        na leitura:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>ONE</ArticleCode>: confirma / lê em um nó. Mais perto de
          A e L. Mais risco de dado atrasado.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>QUORUM</ArticleCode>: maioria do RF. Mais perto de C, com
          latência maior.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>LOCAL_QUORUM</ArticleCode>: maioria no datacenter local
          (útil multi-DC).
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ALL</ArticleCode>: todos do RF. Máxima C, máxima dor de
          latência / disponibilidade.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        O truque: não é binário. O mesmo cluster pode ser “folgado” num like (
        <ArticleCode>ONE</ArticleCode>) e “apertado” num dado mais crítico (
        <ArticleCode>QUORUM</ArticleCode>), se o desenho permitir.
      </ArticleP>

      <ArticleCode block>
        {`CREATE KEYSPACE loja
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 10};

CREATE TABLE loja.produto (
  id UUID PRIMARY KEY,
  nome text,
  preco decimal
);

INSERT INTO loja.produto (id, nome, preco)
VALUES (uuid(), 'Camera Sony', 15000);`}
      </ArticleCode>

      <ArticleP>
        No client, o nível de consistência entra na operação:
      </ArticleP>

      <ArticleCode block>
        {`// escrita com quórum (maioria do RF)
statement.setConsistencyLevel(ConsistencyLevel.QUORUM);
session.execute(statement);

// leitura folgada (aceita possível atraso)
readStatement.setConsistencyLevel(ConsistencyLevel.ONE);
session.execute(readStatement);`}
      </ArticleCode>

      <ArticleCallout variant="tip" title="Casos de uso típicos do Cassandra">
        <ArticleUl>
          <ArticleLi>feeds / timelines</ArticleLi>
          <ArticleLi>séries temporais e IoT</ArticleLi>
          <ArticleLi>catálogo com escrita massiva</ArticleLi>
          <ArticleLi>catálogo globalmente distribuído</ArticleLi>
          <ArticleLi>workloads 24x7 que odeiam downtime</ArticleLi>
        </ArticleUl>
        <ArticleP>
          Times grandes (historicamente o Discord, por exemplo) usaram{" "}
          <TermLink href={CASSANDRA_URL}>Cassandra</TermLink> em escala absurda
          de mensagens. O ponto não é “copie a stack”. É: o perfil A+L com
          dial de quorum existe e escala.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>
        <TermLink href={MONGODB_URL}>MongoDB</TermLink>: a história do “é
        NoSQL, então escala sozinho”
      </ArticleH3>

      <ArticleP>
        Cena típica: catálogo de produto com JSON flexível. Alguém diz “vamos
        de <TermLink href={MONGODB_URL}>MongoDB</TermLink> porque é NoSQL e
        rápido”. O modelo documento encaixa. O risco é achar que o replica set
        nasceu para abrir mão de C.
      </ArticleP>

      <ArticleP>
        No set há líder para escrita. Se o líder cai, o consenso (família{" "}
        <TermLink href={RAFT_URL}>Raft</TermLink>) elege outro. Enquanto isso,
        o default histórico prioriza consistência no set. Há{" "}
        <TermLink href={ACID_URL}>ACID</TermLink> em transações suportadas.
      </ArticleP>

      <ArticleP>
        Eu usaria Mongo quando o domínio é documento + C importa no set. Não
        quando o brief é “fique no ar a qualquer custo como Cassandra”.
      </ArticleP>

      <ArticleH3>
        <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink>: um serviço, dois
        diais
      </ArticleH3>

      <ArticleP>
        Cena: microsserviço de conta. A bio do usuário pode atrasar. O saldo
        da carteira interna não pode. Em vez de dois bancos no dia 1, o time
        usa <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink> e diala a
        leitura:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          bio:{" "}
          <TermLink href={DYNAMODB_CONSISTENT_URL}>ConsistentRead</TermLink>{" "}
          <ArticleCode>false</ArticleCode> (eventual, mais barata / rápida no
          perfil usual)
        </ArticleLi>
        <ArticleLi>
          saldo: <ArticleCode>true</ArticleCode> (forte naquela chamada)
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        A história não é “Dynamo resolve tudo”. É: o dial vai na operação.
        Isso muda a conversa de vendor para requisito.
      </ArticleP>

      <ArticleH3>
        <TermLink href={COCKROACH_URL}>CockroachDB</TermLink> e{" "}
        <TermLink href={SPANNER_URL}>Spanner</TermLink>: quando SQL precisa
        atravessar região
      </ArticleH3>

      <ArticleP>
        Cena de entrevista (e de produto global): inventário ou ledger com
        SQL, multi-região, sem “eventual ok”. Subir mais um{" "}
        <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> com réplica async
        não fecha.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <TermLink href={COCKROACH_URL}>CockroachDB</TermLink>: SQL
          distribuído com foco em C;{" "}
          <TermLink href={RAFT_URL}>Raft</TermLink> por baixo; inventário,
          finanças, jogos multi-região.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={SPANNER_URL}>Spanner</TermLink>: C forte global com{" "}
          <TermLink href={TRUETIME_URL}>TrueTime</TermLink> e família{" "}
          <TermLink href={PAXOS_URL}>Paxos</TermLink>. Caro. Você está
          comprando o problema difícil resolvido.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Eu só levo esses nomes à mesa quando o requisito global + SQL + C é
        explícito. Senão o custo (dinheiro e ops) come o ganho.
      </ArticleP>

      <ArticleH3>
        <TermLink href={REDIS_URL}>Redis</TermLink> e{" "}
        <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink>: papéis que se
        misturam com frequência
      </ArticleH3>

      <ArticleP>
        Cena: “vamos guardar o saldo no{" "}
        <TermLink href={REDIS_URL}>Redis</TermLink> porque é rápido”. Latência
        ótima. Durabilidade e modelo de ledger, não. Redis (+{" "}
        <TermLink href={SENTINEL_URL}>Sentinel</TermLink>) brilha em cache,
        sessão, fila leve, ranking. Ruim como único banco do domínio bancário.
      </ArticleP>

      <ArticleP>
        Outra cena: Postgres excelente no monólito single-region. O desvio
        aparece depois: fingir multi-primary global só com réplica async e RDS
        caro. Transações e joins continuam ótimos. O mapa{" "}
        <TermLink href={PACELC_URL}>PACELC</TermLink> não.
      </ArticleP>

      <ArticleP>
        Fazer <TermLink href={SHARDING_URL}>sharding</TermLink> “na mão” no
        Postgres significa virar time de database platform: roteamento por id,
        rebalance, failover de fatia. Dá. Quase nunca vale se o requisito já
        pede store distribuído de verdade.
      </ArticleP>

      <ArticleH2>6. Como eu escolho na prática</ArticleH2>

      <ArticleP>
        Checklist que eu uso antes de abrir PR de infra:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          Sob partição, o serviço precisa continuar respondendo (A) ou precisa
          recusar para não mentir (C)?
        </ArticleLi>
        <ArticleLi>
          Sem partição, o que dói mais: latência alta ou dado atrasado?
        </ArticleLi>
        <ArticleLi>
          Qual o caso de uso real (ledger, feed, catálogo, sessão, cache)?
        </ArticleLi>
        <ArticleLi>
          Consistência é tunável por operação (quorum / consistent read) ou o
          default do produto já basta?
        </ArticleLi>
        <ArticleLi>
          Qual o modelo de dados que o domínio pede (relacional, documento,
          colunar, KV)?
        </ArticleLi>
        <ArticleLi>
          Qual o custo operacional: time conhece o banco? multi-região? fatura?
        </ArticleLi>
      </ArticleOl>

      <ArticleH3>Exemplo trabalhado: três serviços, três escolhas</ArticleH3>

      <ArticleP>
        Mesmo produto. Três microsserviços. Eu não forço um banco só.
      </ArticleP>

      <ArticleTable caption="Como eu aplicaria o checklist num produto real">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Serviço</ArticleTh>
            <ArticleTh>Sob partição</ArticleTh>
            <ArticleTh>Sem partição</ArticleTh>
            <ArticleTh>Escolha</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Feed / like</ArticleTd>
            <ArticleTd>Priorizo A</ArticleTd>
            <ArticleTd>Priorizo L</ArticleTd>
            <ArticleTd>
              <TermLink href={CASSANDRA_URL}>Cassandra</TermLink> (ONE/QUORUM
              conforme o dado)
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Cobrança / saldo</ArticleTd>
            <ArticleTd>Priorizo C</ArticleTd>
            <ArticleTd>Aceito L maior</ArticleTd>
            <ArticleTd>
              <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> (região) ou{" "}
              <TermLink href={COCKROACH_URL}>CockroachDB</TermLink> (global)
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Sessão / cache de página</ArticleTd>
            <ArticleTd>A importa</ArticleTd>
            <ArticleTd>L manda</ArticleTd>
            <ArticleTd>
              <TermLink href={REDIS_URL}>Redis</TermLink> (+ store durável atrás)
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        É isso que o exemplo da cobrança mostra: unificar feed e cobrança no
        mesmo perfil é o anti-padrão. O caminho sólido é deixar o{" "}
        <TermLink href={PACELC_URL}>PACELC</TermLink> decidir por serviço.
      </ArticleP>

      <ArticleP>
        Atalhos honestos (depois do checklist, não antes):
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          C forte global + SQL:{" "}
          <TermLink href={COCKROACH_URL}>CockroachDB</TermLink> /{" "}
          <TermLink href={SPANNER_URL}>Spanner</TermLink> (e o preço)
        </ArticleLi>
        <ArticleLi>
          A + L em escrita massiva:{" "}
          <TermLink href={CASSANDRA_URL}>Cassandra</TermLink> / famílias
          parecidas
        </ArticleLi>
        <ArticleLi>
          domínio relacional single-region:{" "}
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink>
        </ArticleLi>
        <ArticleLi>
          dial por chamada num managed KV/doc:{" "}
          <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink>
        </ArticleLi>
        <ArticleLi>
          cache / estrutura rápida:{" "}
          <TermLink href={REDIS_URL}>Redis</TermLink>
        </ArticleLi>
      </ArticleUl>

      <ArticleTable caption="Anti-padrões que eu já vi custarem caro">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Anti-padrão</ArticleTh>
            <ArticleTh>Por que dói</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>“Mongo porque é rápido”</ArticleTd>
            <ArticleTd>
              Ignora o perfil C do replica set e o domínio
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Um banco só para todos os microsserviços</ArticleTd>
            <ArticleTd>Feed e ledger viram o mesmo tradeoff</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>N apps, 1 Postgres, zero plano de dados</ArticleTd>
            <ArticleTd>O gargalo só mudou de lugar</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Sync em 20 réplicas “por segurança”</ArticleTd>
            <ArticleTd>Latência vira produto</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Sharding manual sem necessidade</ArticleTd>
            <ArticleTd>Você vira time de database platform</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Frase de entrevista que funciona melhor que o meme:
      </ArticleP>

      <ArticleP>
        “Sob partição eu priorizo X; sem partição eu priorizo Y; o caso de uso
        é Z; por isso o candidato é W; o dial que eu tenho é D.”
      </ArticleP>

      <ArticleH3>Pontos-chave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          “SQL vs NoSQL” não escolhe banco. Atributo sob falha escolhe.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={CAP_URL}>CAP</TermLink> +{" "}
          <TermLink href={PACELC_URL}>PACELC</TermLink>: sob partição A vs C;
          senão L vs C.
        </ArticleLi>
        <ArticleLi>
          Read replica ajuda leitura. Sync/async ainda é tradeoff.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={CASSANDRA_URL}>Cassandra</TermLink>: RF + quorum =
          consistência ajustável em runtime (escrita e leitura).
        </ArticleLi>
        <ArticleLi>
          <TermLink href={MONGODB_URL}>MongoDB</TermLink> prioriza C no set;{" "}
          <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink> diala na leitura;{" "}
          <TermLink href={COCKROACH_URL}>CockroachDB</TermLink> /{" "}
          <TermLink href={SPANNER_URL}>Spanner</TermLink> pagam C forte global.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> não vira Spanner
          com fé e RDS caro.
        </ArticleLi>
        <ArticleLi>
          Microsserviços diferentes podem (e devem) ter bancos diferentes.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusão</ArticleH3>

      <ArticleP>
        Eu não escolho banco pelo meme da entrevista. Eu escolho pelo atributo
        que o negócio não pode perder.
      </ArticleP>

      <ArticleP>
        <TermLink href={PACELC_URL}>PACELC</TermLink> é o mapa. O produto
        (Cassandra, Mongo, Postgres, Spanner…) é a ferramenta que já nasceu
        enviesada para um canto desse mapa, com mais ou menos dial.
      </ArticleP>

      <ArticleP>
        Na próxima entrevista, troque “uso Mongo porque é rápido” por o
        parágrafo do X/Y/Z/W/D. Isso muda o jogo: mostra system design, não
        catálogo de logos.
      </ArticleP>
    </>
  );
}
