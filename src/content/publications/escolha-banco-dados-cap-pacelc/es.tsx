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
  S3 --> S4["1 DB cuello de botella"]`;

const REPLICATION_CHART = `flowchart TB
  Apps["Apps / API"]
  Primary["Primary write"]
  R1["Replica read"]
  R2["Replica read"]

  Apps -->|"escritura"| Primary
  Apps -->|"lectura"| R1
  Apps -->|"lectura"| R2
  Primary -.->|"replica"| R1
  Primary -.->|"replica"| R2`;

const TRADEOFF_CHART = `flowchart TB
  Write["Escritura en primary"]
  Write --> Sync["Replicacion sincrona"]
  Write --> Async["Replicacion asincrona"]
  Sync --> PainSync["Latencia / indisponibilidad"]
  Async --> PainAsync["Consistencia eventual"]`;

const PACELC_CHART = `flowchart TB
  Q["Hay particion de red?"]
  Q -->|"Si"| PA["Elige: A o C"]
  Q -->|"No"| EL["Elige: L o C"]
  PA --> Social["Ej: like / feed"]
  PA --> Bank["Ej: saldo / Pix"]
  EL --> Fast["Baja latencia"]
  EL --> Strong["Consistencia fuerte"]`;

const CASSANDRA_CHART = `flowchart TB
  Client["Cliente"]
  N1["Nodo 1"]
  N2["Nodo 2"]
  N3["Nodo 3"]
  N4["Nodo 4"]

  Client --> N1
  Client --> N2
  Client --> N3
  Client --> N4
  N1 --- N2
  N2 --- N3
  N3 --- N4
  N4 --- N1`;

const QUORUM_CHART = `flowchart LR
  RF["RF = 10 nodos"] --> Maj["Quorum = 6"]
  Maj --> Write["Write QUORUM"]
  Maj --> Read["Read QUORUM"]
  Write --> Safe["Interseccion garantiza dato fresco"]
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

export function EscolhaBancoDadosCapPacelcContentEs() {
  return (
    <>
      <ArticleH2>1. El problema de la respuesta superficial</ArticleH2>

      <ArticleP>
        Ya respondí mal esa pregunta. En entrevista (y después en diseño de
        servicio), salí con el automático:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          datos relacionados y estructurados:{" "}
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> /{" "}
          <TermLink href={MYSQL_URL}>MySQL</TermLink>
        </ArticleLi>
        <ArticleLi>
          menos relación y "más rendimiento":{" "}
          <TermLink href={MONGODB_URL}>MongoDB</TermLink> /{" "}
          <TermLink href={CASSANDRA_URL}>Cassandra</TermLink>
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        El entrevistador no quería un logo. Quería saber qué priorizo bajo{" "}
        <TermLink href={PARTITION_URL}>partición</TermLink> y qué acepto pagar
        en latencia. No tenía el mapa. Solo tenía el meme.
      </ArticleP>

      <ArticleP>
        En proyecto real la herida se repitió: un equipo puso feed y cobro en el
        mismo perfil de base "porque ya conocíamos Postgres". El feed aguantaba
        retraso. El cobro no. La base correcta para uno se volvió dolor en el
        otro.
      </ArticleP>

      <ArticleP>
        Este post cubre la elección de base en{" "}
        <strong>sistemas distribuidos</strong> de envergadura: varias máquinas,
        réplicas, balanceador y tradeoffs reales. No es el sistema de la
        panadería en un solo servidor.
      </ArticleP>

      <ArticleCallout variant="note" title="Fuente">
        <ArticleP>
          La idea y el guion de este texto parten principalmente del vídeo{" "}
          <a
            href={VIDEO_SOURCE_URL}
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            Cómo Elegir la Base de Datos Correcta para tu Aplicación (System
            Design y Arquitectura de Software)
          </a>
          . Aquí reorganicé el contenido con mi voz, con enlaces y ejemplos
          para consulta.
        </ArticleP>
      </ArticleCallout>

      <ArticleCallout variant="tip" title="¿Quieres decidir ya?">
        <ArticleP>
          Salta a la{" "}
          <a href="#6-como-elijo-en-la-practica" className={linkClass}>
            sección 6
          </a>
          : checklist + un ejemplo trabajado (tres servicios, tres bases). El
          mapa{" "}
          <a href="#4-cap-y-pacelc" className={linkClass}>
            CAP / PACELC
          </a>{" "}
          y la{" "}
          <a
            href="#5-como-encajan-las-bases-y-que-cambia-en-cassandra"
            className={linkClass}
          >
            sección 5
          </a>{" "}
          explican el porqué.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Lo que suele salir mal cuando la respuesta se queda en "SQL vs NoSQL":
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          eliges el modelo de datos y olvidas el perfil bajo fallo
        </ArticleLi>
        <ArticleLi>
          escalas la API y dejas la base como single point of pain
        </ArticleLi>
        <ArticleLi>
          tratas{" "}
          <TermLink href={EVENTUAL_URL}>consistencia eventual</TermLink> como
          bug, cuando a veces es el precio de la disponibilidad
        </ArticleLi>
        <ArticleLi>
          fuerzas{" "}
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> a parecer{" "}
          <TermLink href={SPANNER_URL}>Spanner</TermLink> con réplica y fe
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Términos que verás todo el tiempo:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          consistencia: todos leen la misma versión "actual" del dato (o la
          regla acordada de actualidad)
        </ArticleLi>
        <ArticleLi>
          disponibilidad: el sistema sigue respondiendo incluso bajo fallo
        </ArticleLi>
        <ArticleLi>
          <TermLink href={PARTITION_URL}>partición de red</TermLink>: nodos que
          deberían hablar entre sí dejan de verse
        </ArticleLi>
        <ArticleLi>
          latencia: cuánto tarda la operación en confirmar
        </ArticleLi>
        <ArticleLi>
          <TermLink href={EVENTUAL_URL}>consistencia eventual</TermLink>: el
          sistema converge después; por un tiempo, las lecturas pueden divergir
        </ArticleLi>
        <ArticleLi>
          <TermLink href={SHARDING_URL}>sharding</TermLink>: partir datos entre
          nodos, en lugar de copiar toda la base en cada máquina
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Atajo">
        <ArticleP>
          ¿Quieres el mapa de decisión y la tabla de bases ahora? Salta a la{" "}
          <a href="#4-cap-y-pacelc" className={linkClass}>
            sección 4
          </a>{" "}
          y la{" "}
          <a
            href="#5-como-encajan-las-bases-y-que-cambia-en-cassandra"
            className={linkClass}
          >
            sección 5
          </a>
          .
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Si prefieres el camino completo: escala, réplicas, teoremas y luego la
        tabla.
      </ArticleP>

      <ArticleH2>2. Del servidor único al cuello de botella en la base</ArticleH2>

      <ArticleP>
        La aplicación suele nacer simple:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>front (web/app)</ArticleLi>
        <ArticleLi>API en un servidor</ArticleLi>
        <ArticleLi>base en el mismo (o casi el mismo) host</ArticleLi>
      </ArticleUl>

      <ArticleP>
        El <TermLink href={DNS_URL}>DNS</TermLink> resuelve el dominio (por
        ejemplo <ArticleCode>api.misitio.com</ArticleCode>) al IP del servidor.
        La API responde JSON. Hasta aquí, ningún misterio.
      </ArticleP>

      <ArticleP>
        Cuando sube la carga, la evolución natural es separar API y base:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>cada uno escala con recurso distinto</ArticleLi>
        <ArticleLi>
          el fallo de uno no tumba al otro en el mismo proceso
        </ArticleLi>
        <ArticleLi>
          dimensionas escritura/lectura y CPU de la API por separado
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Después viene la elección de escala:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          vertical: más CPU/RAM en el mismo host. Simple. Single point of
          failure: la máquina cae, la app desaparece.
        </ArticleLi>
        <ArticleLi>
          horizontal: varias réplicas de la API detrás de un{" "}
          <TermLink href={LB_URL}>load balancer</TermLink>. El{" "}
          <TermLink href={DNS_URL}>DNS</TermLink> apunta al balanceador; reparte
          la avalancha.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Vertical no es "incorrecto". En muchas fases iniciales, es el movimiento
        correcto. En sistemas grandes y siempre encendidos, horizontal suele
        ganar.
      </ArticleP>

      <ArticleP>
        Pero N APIs en la misma base crean otro cuello de botella: la base.
        Veinte réplicas de app apuntando a un solo{" "}
        <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> solo mueven el
        dolor. Escala de aplicación sin escala de datos no cierra la cuenta.
      </ArticleP>

      <ArticleP>
        El diagrama resume esa escalera:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Evolucion: un servidor, separar base, varias apps con load balancer y cuello de botella en la base"
        chart={SCALE_CHART}
      />

      <ArticleH2>3. Replicación, partición y el tradeoff</ArticleH2>

      <ArticleP>
        En bases relacionales clásicas (
        <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink>,{" "}
        <TermLink href={MYSQL_URL}>MySQL</TermLink>
        ), el camino común es{" "}
        <strong>database replication</strong> / read replicas:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>un primary (o master) recibe escrituras</ArticleLi>
        <ArticleLi>réplicas sirven lecturas</ArticleLi>
        <ArticleLi>
          en muchas apps, lectura &gt; escritura, así que la lectura escala
          primero
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        No es regla universal. Hay productos write-heavy. En el escenario típico
        de producto con refresh, listado y dashboard, la lectura aprieta
        primero.
      </ArticleP>

      <ArticleP>
        En la práctica, el ORM/driver recibe:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>host (o lista) de escritura</ArticleLi>
        <ArticleLi>lista de hosts de lectura</ArticleLi>
        <ArticleLi>credenciales y nombre de la base</ArticleLi>
      </ArticleUl>

      <ArticleP>
        La app no "abre Chrome" en el primary. Pide escritura o lectura; el
        pool elige el destino. El diseño queda así:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Apps escriben en primary y leen en replicas"
        chart={REPLICATION_CHART}
      />

      <ArticleH3>El ejemplo del saldo (y por qué duele)</ArticleH3>

      <ArticleP>
        Imagina una fintech. Saldo $1.000. Haces un Pix de $500.
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          la escritura confirma en el primary (1000 pasa a 500)
        </ArticleLi>
        <ArticleLi>la réplica intenta recibir el dato nuevo</ArticleLi>
        <ArticleLi>
          bajo <TermLink href={PARTITION_URL}>partición de red</TermLink>, una
          réplica se queda atrás
        </ArticleLi>
        <ArticleLi>
          un refresh lee la réplica atrasada y aún muestra $1.000
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        Todo esto es red: app con primary, primary con réplicas, app con
        réplica. Partición no significa "el disco murió". Significa "ese camino
        de red desapareció".
      </ArticleP>

      <ArticleP>
        Eso es{" "}
        <TermLink href={EVENTUAL_URL}>consistencia eventual</TermLink>: el
        sistema converge después. En feed de red social, a veces es aceptable.
        En saldo bancario, es incidente (Pix infinito en el peor diseño).
      </ArticleP>

      <ArticleH3>Síncrono vs asíncrono</ArticleH3>

      <ArticleP>
        "Solo hacer la réplica síncrona" parece resolver. No resuelve gratis.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          síncrono: solo confirma después de grabar en las réplicas. Bajo
          partición, se traba o falla. Compras consistencia y pagas
          disponibilidad / latencia.
        </ArticleLi>
        <ArticleLi>
          asíncrono: confirma pronto y replica por debajo. Compras
          disponibilidad / baja latencia y aceptas retraso.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Bajo partición, sync no "sostiene el mundo". Sostiene la confirmación
        hasta conseguirlo (o agotar timeout). En la práctica: el usuario ve
        error o spinner eterno. La app queda indisponible para esa escritura.
      </ArticleP>

      <ArticleP>
        Incluso sin partición, sync a 15-20 réplicas genera latencia absurda: la
        confirmación espera la cola de copias. Async vuelve al retraso.
      </ArticleP>

      <ArticleP>
        Tres dolores en el mismo diseño:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>consistencia</ArticleLi>
        <ArticleLi>disponibilidad</ArticleLi>
        <ArticleLi>latencia</ArticleLi>
      </ArticleUl>

      <ArticleP>
        No hay bala de plata. Hay prioridad.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Escritura: camino sincrono genera latencia o indisponibilidad; asincrono genera consistencia eventual"
        chart={TRADEOFF_CHART}
      />

      <ArticleCallout variant="note" title="El punto central">
        <ArticleP>
          Elegir base es elegir qué atributos priorizas bajo fallo y bajo
          operación normal. No es "SQL o NoSQL".
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>4. CAP y PACELC</ArticleH2>

      <ArticleP>
        Estos tradeoffs no son opinión de blog. Son límite estudiado.
      </ArticleP>

      <ArticleH3>
        <TermLink href={CAP_URL}>CAP</TermLink>
      </ArticleH3>

      <ArticleP>
        El teorema{" "}
        <TermLink href={CAP_URL}>CAP</TermLink> (Eric Brewer, popularizado en
        los 2000) habla de tres letras:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>C: Consistency</ArticleLi>
        <ArticleLi>A: Availability</ArticleLi>
        <ArticleLi>P: Partition tolerance</ArticleLi>
      </ArticleUl>

      <ArticleP>
        En sistema distribuido, la partición ocurre. El meme "elegir 2 de 3"
        envejeció mal. El diseño útil es: bajo partición, no mantienes C y A a
        la vez en sentido fuerte.
      </ArticleP>

      <ArticleP>
        Fue exactamente lo que mostró el ejemplo del Pix: sync aprieta C y pierde
        A; async mantiene A y cede C inmediata.
      </ArticleP>

      <ArticleImg
        src="/images/publications/escolha-banco-dados-cap-pacelc/cap-theorem.svg"
        alt="Diagrama del teorema CAP con Consistency, Availability y Partition tolerance"
        caption={
          <>
            Diagrama clásico del{" "}
            <TermLink href={CAP_URL}>CAP</TermLink>. Fuente:{" "}
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
        alt="Diagrama de Euler del teorema CAP mostrando los pares CA, CP y AP"
        caption={
          <>
            Vista en conjuntos (CA / CP / AP) del{" "}
            <TermLink href={CAP_URL}>CAP</TermLink>. Fuente:{" "}
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
        En 2012, Daniel Abadi formalizó{" "}
        <TermLink href={PACELC_URL}>PACELC</TermLink> como extensión del{" "}
        <TermLink href={CAP_URL}>CAP</TermLink>. No anula el{" "}
        <TermLink href={CAP_URL}>CAP</TermLink>. Completa el mapa cuando la red
        está "sana".
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          si hay Partition: elige Availability o Consistency
        </ArticleLi>
        <ArticleLi>
          Else (sin partición): elige Latency o Consistency
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        La "E" es el else del código: si no hay partición, aún hay tradeoff.
        Solo cambia el eje (latencia vs consistencia).
      </ArticleP>

      <ArticleP>
        Es ese mapa el que uso en entrevista y en diseño de servicio.
      </ArticleP>

      <ArticleImg
        src="/images/publications/escolha-banco-dados-cap-pacelc/pacelc-theorem.png"
        alt="Diagrama del teorema PACELC: bajo partición A o C; si no, latencia o C"
        caption={
          <>
            <TermLink href={PACELC_URL}>PACELC</TermLink> en una figura. Fuente:{" "}
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
        ariaLabel="Decision PACELC: con particion A o C; sin particion latencia o C"
        chart={PACELC_CHART}
      />

      <ArticleH3>Red social vs fintech</ArticleH3>

      <ArticleP>
        Mismo "cluster", requisito distinto. Piensa en dos microservicios.
      </ArticleP>

      <ArticleP>
        Feed / like / comentario, bajo partición:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          prioriza disponibilidad: graba en el nodo alcanzable y devuelve OK
        </ArticleLi>
        <ArticleLi>
          replica async; el contador puede retrasarse segundos
        </ArticleLi>
        <ArticleLi>
          el usuario prefiere app encendida a like perfecto en tiempo real
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Sin partición, en el mismo feed:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          prioriza baja latencia: no esperes 20 nodos confirmando el like
        </ArticleLi>
        <ArticleLi>
          consistencia fuerte global en el like suele ser overkill e irrita
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Ledger / saldo / Pix:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          bajo partición, mentir el saldo es peor que rechazar la operación
        </ArticleLi>
        <ArticleLi>
          sin partición, aún pagas latencia por confirmación fuerte
        </ArticleLi>
        <ArticleLi>
          aquí C manda; A y L son costo consciente
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Por eso feed y ledger rara vez comparten el mismo perfil de base.
      </ArticleP>

      <ArticleCallout variant="warning" title="PostgreSQL en CAP">
        <ArticleP>
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> clásico es fuerte
          en un nodo (pensado como CA en el discurso antiguo del{" "}
          <TermLink href={CAP_URL}>CAP</TermLink>
          ): consistencia y disponibilidad locales, sin ser un store
          multi-primary distribuido "de fábrica".
        </ArticleP>
        <ArticleP>
          Réplicas ayudan lectura. No transforman solas Postgres en{" "}
          <TermLink href={SPANNER_URL}>Spanner</TermLink>.{" "}
          <TermLink href={SHARDING_URL}>Sharding</TermLink> manual existe, pero
          el ownership explota: te vuelves dueño del ruteo por clave, del
          rebalance y del "¿dónde está este id?".
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>5. Cómo encajan las bases (y qué cambia en Cassandra)</ArticleH2>

      <ArticleP>
        La elección empieza por el atributo (
        <TermLink href={PACELC_URL}>PACELC</TermLink>
        ), luego por el modelo de datos:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>relacional (filas/tablas, joins)</ArticleLi>
        <ArticleLi>documento (JSON/BSON flexible)</ArticleLi>
        <ArticleLi>columnar / wide-column</ArticleLi>
        <ArticleLi>clave-valor</ArticleLi>
        <ArticleLi>relacional distribuido (SQL + consenso entre nodos)</ArticleLi>
      </ArticleUl>

      <ArticleP>
        "NoSQL" no es una base. Es un paraguas. Elegir "NoSQL" es tan vago como
        elegir "framework".
      </ArticleP>

      <ArticleTable caption="Lectura rápida en el mapa PACELC (simplificado)">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Base</ArticleTh>
            <ArticleTh>Bajo partición</ArticleTh>
            <ArticleTh>Sin partición</ArticleTh>
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
            <ArticleTd>Columnar; consistencia ajustable (quorum)</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={MONGODB_URL}>MongoDB</TermLink>
            </ArticleTd>
            <ArticleTd>Prioriza C</ArticleTd>
            <ArticleTd>Prioriza C</ArticleTd>
            <ArticleTd>
              Documento; replica set con líder (
              <TermLink href={RAFT_URL}>Raft</TermLink>
              -like);{" "}
              <TermLink href={ACID_URL}>ACID</TermLink> en varios escenarios
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink>
            </ArticleTd>
            <ArticleTd>Configurable</ArticleTd>
            <ArticleTd>Configurable</ArticleTd>
            <ArticleTd>
              Consistent read true/false cambia el perfil de la lectura
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={COCKROACH_URL}>CockroachDB</TermLink>
            </ArticleTd>
            <ArticleTd>Prioriza C</ArticleTd>
            <ArticleTd>Prioriza C</ArticleTd>
            <ArticleTd>SQL distribuido; fuerte en consistencia</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={SPANNER_URL}>Spanner</TermLink>
            </ArticleTd>
            <ArticleTd>Prioriza C</ArticleTd>
            <ArticleTd>Prioriza C</ArticleTd>
            <ArticleTd>
              <TermLink href={TRUETIME_URL}>TrueTime</TermLink> /{" "}
              <TermLink href={PAXOS_URL}>Paxos</TermLink>; caro y potente
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={REDIS_URL}>Redis</TermLink> +{" "}
              <TermLink href={SENTINEL_URL}>Sentinel</TermLink>
            </ArticleTd>
            <ArticleTd>Depende del modo</ArticleTd>
            <ArticleTd>Baja L</ArticleTd>
            <ArticleTd>Cache / estructura en memoria; no es OLTP general</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink>
            </ArticleTd>
            <ArticleTd>Límite de single-node</ArticleTd>
            <ArticleTd>C fuerte en el nodo</ArticleTd>
            <ArticleTd>Excelente en el rol correcto; no es Spanner casero</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        La tabla es brújula, no dogma. Los defaults del producto cambian; lee el
        doc del modo que activaste. Puedes "aflojar" o "apretar" algunas bases.
        No siempre vale la pena pelear contra la esencia.
      </ArticleP>

      <ArticleH3>
        <TermLink href={CASSANDRA_URL}>Cassandra</TermLink>: nodos, RF y quorum
      </ArticleH3>

      <ArticleP>
        <TermLink href={CASSANDRA_URL}>Cassandra</TermLink> nació para alta
        disponibilidad y baja latencia. Modelo wide-column, lenguaje{" "}
        <TermLink href={CQL_URL}>CQL</TermLink> cerca de SQL, y datos repartidos
        por nodos (
        <TermLink href={SHARDING_URL}>sharding</TermLink> / particionamiento).
      </ArticleP>

      <ArticleP>
        Piensa en una pizza: cada porción es un nodo con pedazo de los datos. El
        cluster sabe dónde está Tokio o la cámara Sony. En lugar de "copiar la
        tabla entera a cada réplica de lectura", fragmentas y replicas con
        factor de replicación (RF).
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Cliente hablando con varios nodos Cassandra en el cluster"
        chart={CASSANDRA_CHART}
      />

      <ArticleP>
        RF = 10 significa: ese dato debe existir en 10 nodos (aun con 100 nodos
        en el cluster). Quorum suele ser{" "}
        <ArticleCode>RF/2 + 1</ArticleCode>. Con RF 10, quorum = 6 (mayoría).
      </ArticleP>

      <ArticleP>
        ¿Por qué mayoría? Porque escritura con 6 y lectura con 6 fuerzan
        intersección: al menos un nodo visto en la lectura vio la escritura.
        Eso reduce el "leí el saldo viejo" sin exigir ALL.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="RF 10 genera quorum 6; write y read en quorum se intersectan"
        chart={QUORUM_CHART}
      />

      <ArticleP>
        En tiempo de request defines el{" "}
        <TermLink href={QUORUM_URL}>consistency level</TermLink> en escritura y
        lectura:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>ONE</ArticleCode>: confirma / lee en un nodo. Más cerca de
          A y L. Más riesgo de dato atrasado.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>QUORUM</ArticleCode>: mayoría del RF. Más cerca de C, con
          latencia mayor.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>LOCAL_QUORUM</ArticleCode>: mayoría en el datacenter local
          (útil multi-DC).
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ALL</ArticleCode>: todos del RF. Máxima C, máximo dolor de
          latencia / disponibilidad.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        El truco: no es binario. El mismo cluster puede ser "flojo" en un like (
        <ArticleCode>ONE</ArticleCode>) y "apretado" en un dato más crítico (
        <ArticleCode>QUORUM</ArticleCode>), si el diseño lo permite.
      </ArticleP>

      <ArticleCode block>
        {`CREATE KEYSPACE tienda
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 10};

CREATE TABLE tienda.producto (
  id UUID PRIMARY KEY,
  nombre text,
  precio decimal
);

INSERT INTO tienda.producto (id, nombre, precio)
VALUES (uuid(), 'Camara Sony', 15000);`}
      </ArticleCode>

      <ArticleP>
        En el client, el nivel de consistencia entra en la operación:
      </ArticleP>

      <ArticleCode block>
        {`// escritura con quorum (mayoria del RF)
statement.setConsistencyLevel(ConsistencyLevel.QUORUM);
session.execute(statement);

// lectura floja (acepta posible retraso)
readStatement.setConsistencyLevel(ConsistencyLevel.ONE);
session.execute(readStatement);`}
      </ArticleCode>

      <ArticleCallout variant="tip" title="Casos de uso tipicos de Cassandra">
        <ArticleUl>
          <ArticleLi>feeds / timelines</ArticleLi>
          <ArticleLi>series temporales e IoT</ArticleLi>
          <ArticleLi>catálogo con escritura masiva</ArticleLi>
          <ArticleLi>catálogo globalmente distribuido</ArticleLi>
          <ArticleLi>workloads 24x7 que odian downtime</ArticleLi>
        </ArticleUl>
        <ArticleP>
          Equipos grandes (históricamente Discord, por ejemplo) usaron{" "}
          <TermLink href={CASSANDRA_URL}>Cassandra</TermLink> a escala absurda
          de mensajes. El punto no es "copiar el stack". Es: el perfil A+L con
          dial de quorum existe y escala.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>
        <TermLink href={MONGODB_URL}>MongoDB</TermLink>: la historia del "es
        NoSQL, entonces escala solo"
      </ArticleH3>

      <ArticleP>
        Escena típica: catálogo de producto con JSON flexible. Alguien dice
        "vamos con <TermLink href={MONGODB_URL}>MongoDB</TermLink> porque es
        NoSQL y rápido". El modelo documento encaja. El error es creer que el
        replica set nació para ceder C.
      </ArticleP>

      <ArticleP>
        En el set hay líder para escritura. Si el líder cae, el consenso
        (familia <TermLink href={RAFT_URL}>Raft</TermLink>) elige otro.
        Mientras tanto, el default histórico prioriza consistencia en el set.
        Hay <TermLink href={ACID_URL}>ACID</TermLink> en transacciones
        soportadas.
      </ArticleP>

      <ArticleP>
        Usaría Mongo cuando el dominio es documento + C importa en el set. No
        cuando el brief es "quédate en el aire a cualquier costo como
        Cassandra".
      </ArticleP>

      <ArticleH3>
        <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink>: un servicio, dos
        diales
      </ArticleH3>

      <ArticleP>
        Escena: microservicio de cuenta. La bio del usuario puede atrasarse. El
        saldo de la cartera interna no. En lugar de dos bases el día 1, el
        equipo usa <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink> y diala la
        lectura:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          bio:{" "}
          <TermLink href={DYNAMODB_CONSISTENT_URL}>ConsistentRead</TermLink>{" "}
          <ArticleCode>false</ArticleCode> (eventual, más barata / rápida en el
          perfil usual)
        </ArticleLi>
        <ArticleLi>
          saldo: <ArticleCode>true</ArticleCode> (fuerte en esa llamada)
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        La historia no es "Dynamo lo resuelve todo". Es: el dial va en la
        operación. Eso mueve la conversación de vendor a requisito.
      </ArticleP>

      <ArticleH3>
        <TermLink href={COCKROACH_URL}>CockroachDB</TermLink> y{" "}
        <TermLink href={SPANNER_URL}>Spanner</TermLink>: cuando SQL necesita
        cruzar región
      </ArticleH3>

      <ArticleP>
        Escena de entrevista (y de producto global): inventario o ledger con
        SQL, multi-región, sin "eventual ok". Subir otro{" "}
        <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> con réplica async
        no cierra.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <TermLink href={COCKROACH_URL}>CockroachDB</TermLink>: SQL
          distribuido con foco en C;{" "}
          <TermLink href={RAFT_URL}>Raft</TermLink> por debajo; inventario,
          finanzas, juegos multi-región.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={SPANNER_URL}>Spanner</TermLink>: C fuerte global con{" "}
          <TermLink href={TRUETIME_URL}>TrueTime</TermLink> y familia{" "}
          <TermLink href={PAXOS_URL}>Paxos</TermLink>. Caro. Estás comprando el
          problema difícil resuelto.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Solo llevo esos nombres a la mesa cuando global + SQL + C es explícito.
        Si no, el costo (dinero y ops) se come la ganancia.
      </ArticleP>

      <ArticleH3>
        <TermLink href={REDIS_URL}>Redis</TermLink> y{" "}
        <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink>: roles que ya
        mezclé mal
      </ArticleH3>

      <ArticleP>
        Escena: "guardemos el saldo en{" "}
        <TermLink href={REDIS_URL}>Redis</TermLink> porque es rápido". Latencia
        excelente. Durabilidad y modelo de ledger, no. Redis (+{" "}
        <TermLink href={SENTINEL_URL}>Sentinel</TermLink>) brilla en cache,
        sesión, cola ligera, ranking. Malo como única base del dominio bancario.
      </ArticleP>

      <ArticleP>
        Otra escena: Postgres excelente en el monolito single-region. El error
        llegó después: fingir multi-primary global solo con réplica async y RDS
        caro. Transacciones y joins siguen excelentes. El mapa{" "}
        <TermLink href={PACELC_URL}>PACELC</TermLink> no.
      </ArticleP>

      <ArticleP>
        Hacer <TermLink href={SHARDING_URL}>sharding</TermLink> "a mano" en
        Postgres significa volverte equipo de database platform: routing por id,
        rebalance, failover de slice. Se puede. Casi nunca vale si el requisito
        ya pide un store distribuido de verdad.
      </ArticleP>

      <ArticleH2>6. Cómo elijo en la práctica</ArticleH2>

      <ArticleP>
        Checklist que uso antes de abrir un PR de infra:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          Bajo partición, ¿el servicio necesita seguir respondiendo (A) o
          rechazar para no mentir (C)?
        </ArticleLi>
        <ArticleLi>
          Sin partición, ¿qué duele más: latencia alta o dato atrasado?
        </ArticleLi>
        <ArticleLi>
          ¿Cuál es el caso de uso real (ledger, feed, catálogo, sesión, cache)?
        </ArticleLi>
        <ArticleLi>
          ¿La consistencia es ajustable por operación (quorum / consistent
          read) o el default del producto ya basta?
        </ArticleLi>
        <ArticleLi>
          ¿Qué modelo de datos pide el dominio (relacional, documento,
          columnar, KV)?
        </ArticleLi>
        <ArticleLi>
          ¿Cuál es el costo operativo: el equipo conoce la base? ¿multi-región?
          ¿factura?
        </ArticleLi>
      </ArticleOl>

      <ArticleH3>Ejemplo trabajado: tres servicios, tres elecciones</ArticleH3>

      <ArticleP>
        Mismo producto. Tres microservicios. No fuerzo una sola base.
      </ArticleP>

      <ArticleTable caption="Cómo aplicaría el checklist en un producto real">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Servicio</ArticleTh>
            <ArticleTh>Bajo partición</ArticleTh>
            <ArticleTh>Sin partición</ArticleTh>
            <ArticleTh>Elección</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Feed / like</ArticleTd>
            <ArticleTd>Priorizo A</ArticleTd>
            <ArticleTd>Priorizo L</ArticleTd>
            <ArticleTd>
              <TermLink href={CASSANDRA_URL}>Cassandra</TermLink> (ONE/QUORUM
              según el dato)
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Cobro / saldo</ArticleTd>
            <ArticleTd>Priorizo C</ArticleTd>
            <ArticleTd>Acepto L mayor</ArticleTd>
            <ArticleTd>
              <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> (región) o{" "}
              <TermLink href={COCKROACH_URL}>CockroachDB</TermLink> (global)
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Sesión / cache de página</ArticleTd>
            <ArticleTd>A importa</ArticleTd>
            <ArticleTd>L manda</ArticleTd>
            <ArticleTd>
              <TermLink href={REDIS_URL}>Redis</TermLink> (+ store durable
              detrás)
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Eso es lo que quise decir con "herida": el error fue unificar feed y
        cobro. El acierto es dejar que{" "}
        <TermLink href={PACELC_URL}>PACELC</TermLink> decida por servicio.
      </ArticleP>

      <ArticleP>
        Atajos honestos (después del checklist, no antes):
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          C fuerte global + SQL:{" "}
          <TermLink href={COCKROACH_URL}>CockroachDB</TermLink> /{" "}
          <TermLink href={SPANNER_URL}>Spanner</TermLink> (y el precio)
        </ArticleLi>
        <ArticleLi>
          A + L en escritura masiva:{" "}
          <TermLink href={CASSANDRA_URL}>Cassandra</TermLink> / familias
          parecidas
        </ArticleLi>
        <ArticleLi>
          dominio relacional single-region:{" "}
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink>
        </ArticleLi>
        <ArticleLi>
          dial por llamada en un KV/doc managed:{" "}
          <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink>
        </ArticleLi>
        <ArticleLi>
          cache / estructura rápida:{" "}
          <TermLink href={REDIS_URL}>Redis</TermLink>
        </ArticleLi>
      </ArticleUl>

      <ArticleTable caption="Anti-patrones que ya vi costar caro">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Anti-patrón</ArticleTh>
            <ArticleTh>Por qué duele</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>"Mongo porque es rápido"</ArticleTd>
            <ArticleTd>
              Ignora el perfil C del replica set y el dominio
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Una base sola para todos los microservicios</ArticleTd>
            <ArticleTd>Feed y ledger se vuelven el mismo tradeoff</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>N apps, 1 Postgres, cero plan de datos</ArticleTd>
            <ArticleTd>El cuello de botella solo cambió de lugar</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Sync en 20 réplicas "por seguridad"</ArticleTd>
            <ArticleTd>La latencia se vuelve el producto</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Sharding manual sin necesidad</ArticleTd>
            <ArticleTd>Te vuelves equipo de database platform</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Frase de entrevista que funciona mejor que el meme:
      </ArticleP>

      <ArticleP>
        "Bajo partición priorizo X; sin partición priorizo Y; el caso de uso es
        Z; por eso el candidato es W; el dial que tengo es D."
      </ArticleP>

      <ArticleH3>Puntos clave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          "SQL vs NoSQL" no elige base. El atributo bajo fallo elige.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={CAP_URL}>CAP</TermLink> +{" "}
          <TermLink href={PACELC_URL}>PACELC</TermLink>: bajo partición A vs C;
          si no, L vs C.
        </ArticleLi>
        <ArticleLi>
          Read replica ayuda lectura. Sync/async sigue siendo tradeoff.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={CASSANDRA_URL}>Cassandra</TermLink>: RF + quorum =
          consistencia ajustable en runtime (escritura y lectura).
        </ArticleLi>
        <ArticleLi>
          <TermLink href={MONGODB_URL}>MongoDB</TermLink> prioriza C en el set;{" "}
          <TermLink href={DYNAMODB_URL}>DynamoDB</TermLink> diala en la lectura;{" "}
          <TermLink href={COCKROACH_URL}>CockroachDB</TermLink> /{" "}
          <TermLink href={SPANNER_URL}>Spanner</TermLink> pagan C fuerte global.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={POSTGRES_URL}>PostgreSQL</TermLink> no se vuelve
          Spanner con fe y RDS caro.
        </ArticleLi>
        <ArticleLi>
          Microservicios distintos pueden (y deben) tener bases distintas.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusión</ArticleH3>

      <ArticleP>
        No elijo base por el meme de la entrevista. Elijo por el atributo que el
        negocio no puede perder.
      </ArticleP>

      <ArticleP>
        <TermLink href={PACELC_URL}>PACELC</TermLink> es el mapa. El producto
        (Cassandra, Mongo, Postgres, Spanner…) es la herramienta que ya nació
        sesgada hacia un rincón de ese mapa, con más o menos dial.
      </ArticleP>

      <ArticleP>
        En la próxima entrevista, cambia "uso Mongo porque es rápido" por el
        párrafo X/Y/Z/W/D. Eso cambia el juego: muestra system design, no
        catálogo de logos.
      </ArticleP>
    </>
  );
}
