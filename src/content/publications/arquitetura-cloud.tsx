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
  ArticleUl,
} from "@/components/article";

export function ArquiteturaCloudContentPt() {
  return (
    <>
      <ArticleH2>Contexto</ArticleH2>
      <ArticleP>
        Arquiteturas cloud-native bem desenhadas equilibram velocidade de
        entrega, custo operacional e resiliência. Este artigo resume um fluxo
        prático que uso ao estruturar sistemas em AWS, Azure ou GCP.
      </ArticleP>

      <ArticleImg
        src="/images/publications/arquitetura-cloud/cover.svg"
        alt="Ilustração de camadas de uma arquitetura cloud"
        caption="Camadas típicas: edge, aplicação, dados e observabilidade"
      />

      <ArticleH2>Fluxo de alto nível</ArticleH2>
      <ArticleP>
        O diagrama abaixo ilustra o caminho de uma requisição desde o cliente
        até a persistência, passando por API e serviços internos.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Diagrama de arquitetura cloud"
        chart={`flowchart TD
  Client[Cliente] --> CDN[CDN / Edge]
  CDN --> API[API Gateway]
  API --> Auth[Auth Service]
  API --> App[Application Services]
  App --> Queue[Fila / Eventos]
  App --> DB[(Banco de dados)]
  Queue --> Workers[Workers]
  Workers --> DB
  App --> Observability[Logs / Métricas / Traces]`}
      />

      <ArticleH3>Princípios que guiam o desenho</ArticleH3>
      <ArticleUl>
        <ArticleLi>
          Separar responsabilidades por domínio, não por framework.
        </ArticleLi>
        <ArticleLi>
          Preferir contratos explícitos entre serviços (
          <ArticleCode>API</ArticleCode>, eventos, schemas).
        </ArticleLi>
        <ArticleLi>
          Observabilidade como requisito de primeira classe, não como afterthought.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Comece simples">
        <ArticleP>
          Um monólito modular bem organizado costuma ser melhor ponto de
          partida do que microsserviços prematuros. Extraia serviços quando o
          domínio e o time pedirem.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>Checklist rápido</ArticleH2>
      <ArticleOl>
        <ArticleLi>Definir limites de domínio e ownership.</ArticleLi>
        <ArticleLi>Mapear dados críticos e requisitos de consistência.</ArticleLi>
        <ArticleLi>Escolher padrões de deploy e rollback.</ArticleLi>
        <ArticleLi>Instrumentar métricas de latência, erro e saturação.</ArticleLi>
      </ArticleOl>

      <ArticleCallout variant="note" title="Nota">
        <ArticleP>
          Este é um post de exemplo da seção Publicações. Substitua o conteúdo
          pelos seus artigos reais em{" "}
          <ArticleCode>src/content/publications/</ArticleCode>.
        </ArticleP>
      </ArticleCallout>
    </>
  );
}

export function ArquiteturaCloudContentEn() {
  return (
    <>
      <ArticleH2>Context</ArticleH2>
      <ArticleP>
        Well-designed cloud-native architectures balance delivery speed,
        operational cost, and resilience. This article summarizes a practical
        flow I use when structuring systems on AWS, Azure, or GCP.
      </ArticleP>

      <ArticleImg
        src="/images/publications/arquitetura-cloud/cover.svg"
        alt="Illustration of cloud architecture layers"
        caption="Typical layers: edge, application, data, and observability"
      />

      <ArticleH2>High-level flow</ArticleH2>
      <ArticleP>
        The diagram below illustrates the path of a request from the client to
        persistence, through the API and internal services.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Cloud architecture diagram"
        chart={`flowchart TD
  Client[Client] --> CDN[CDN / Edge]
  CDN --> API[API Gateway]
  API --> Auth[Auth Service]
  API --> App[Application Services]
  App --> Queue[Queue / Events]
  App --> DB[(Database)]
  Queue --> Workers[Workers]
  Workers --> DB
  App --> Observability[Logs / Metrics / Traces]`}
      />

      <ArticleH3>Design principles</ArticleH3>
      <ArticleUl>
        <ArticleLi>
          Separate responsibilities by domain, not by framework.
        </ArticleLi>
        <ArticleLi>
          Prefer explicit contracts between services (
          <ArticleCode>API</ArticleCode>, events, schemas).
        </ArticleLi>
        <ArticleLi>
          Treat observability as a first-class requirement, not an afterthought.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Start simple">
        <ArticleP>
          A well-organized modular monolith is often a better starting point
          than premature microservices. Extract services when the domain and
          the team ask for it.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>Quick checklist</ArticleH2>
      <ArticleOl>
        <ArticleLi>Define domain boundaries and ownership.</ArticleLi>
        <ArticleLi>Map critical data and consistency requirements.</ArticleLi>
        <ArticleLi>Choose deploy and rollback patterns.</ArticleLi>
        <ArticleLi>Instrument latency, error, and saturation metrics.</ArticleLi>
      </ArticleOl>

      <ArticleCallout variant="note" title="Note">
        <ArticleP>
          This is a sample post from the Publications section. Replace it with
          your real articles in{" "}
          <ArticleCode>src/content/publications/</ArticleCode>.
        </ArticleP>
      </ArticleCallout>
    </>
  );
}

export function ArquiteturaCloudContentEs() {
  return (
    <>
      <ArticleH2>Contexto</ArticleH2>
      <ArticleP>
        Las arquitecturas cloud-native bien diseñadas equilibran velocidad de
        entrega, costo operativo y resiliencia. Este artículo resume un flujo
        práctico que uso al estructurar sistemas en AWS, Azure o GCP.
      </ArticleP>

      <ArticleImg
        src="/images/publications/arquitetura-cloud/cover.svg"
        alt="Ilustración de capas de una arquitectura cloud"
        caption="Capas típicas: edge, aplicación, datos y observabilidad"
      />

      <ArticleH2>Flujo de alto nivel</ArticleH2>
      <ArticleP>
        El diagrama a continuación ilustra el camino de una solicitud desde el
        cliente hasta la persistencia, pasando por la API y los servicios
        internos.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Diagrama de arquitectura cloud"
        chart={`flowchart TD
  Client[Cliente] --> CDN[CDN / Edge]
  CDN --> API[API Gateway]
  API --> Auth[Auth Service]
  API --> App[Application Services]
  App --> Queue[Cola / Eventos]
  App --> DB[(Base de datos)]
  Queue --> Workers[Workers]
  Workers --> DB
  App --> Observability[Logs / Métricas / Trazas]`}
      />

      <ArticleH3>Principios que guían el diseño</ArticleH3>
      <ArticleUl>
        <ArticleLi>
          Separar responsabilidades por dominio, no por framework.
        </ArticleLi>
        <ArticleLi>
          Preferir contratos explícitos entre servicios (
          <ArticleCode>API</ArticleCode>, eventos, schemas).
        </ArticleLi>
        <ArticleLi>
          Tratar la observabilidad como requisito de primera clase, no como
          afterthought.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="tip" title="Empieza simple">
        <ArticleP>
          Un monolito modular bien organizado suele ser mejor punto de partida
          que microservicios prematuros. Extrae servicios cuando el dominio y
          el equipo lo pidan.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>Checklist rápido</ArticleH2>
      <ArticleOl>
        <ArticleLi>Definir límites de dominio y ownership.</ArticleLi>
        <ArticleLi>Mapear datos críticos y requisitos de consistencia.</ArticleLi>
        <ArticleLi>Elegir patrones de deploy y rollback.</ArticleLi>
        <ArticleLi>Instrumentar métricas de latencia, error y saturación.</ArticleLi>
      </ArticleOl>

      <ArticleCallout variant="note" title="Nota">
        <ArticleP>
          Este es un post de ejemplo de la sección Publicaciones. Sustituye el
          contenido por tus artículos reales en{" "}
          <ArticleCode>src/content/publications/</ArticleCode>.
        </ArticleP>
      </ArticleCallout>
    </>
  );
}
