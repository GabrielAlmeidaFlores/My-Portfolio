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
  Cursor[Cursor / Agente IA]
  MCP[MCP Server<br/>mcp-web-search]
  SearX[SearXNG<br/>127.0.0.1:8099]
  Engines[Engines<br/>Google Bing DDG]

  Cursor -->|JSON-RPC stdio| MCP
  MCP -->|HTTP JSON local| SearX
  SearX -->|consultas agregadas| Engines
  Engines -->|resultados| SearX
  SearX -->|JSON limpo| MCP
  MCP -->|tools search_web fetch_url| Cursor`;

const DECISION_CHART = `flowchart TD
  Need[Preciso de busca web no agente]
  A[Opcao A: scraper MCP pronto]
  B[Opcao B: MCP + SearXNG local]
  C[Opcao C: MCP custom do zero]
  Prod[Uso diario em sessoes longas]

  Need --> A
  Need --> B
  Need --> C
  A -->|bloqueios e rate-limit| Prod
  C -->|alto custo de manutencao| Prod
  B -->|custo zero + controle na borda| Prod`;

export function BuscaWebLocalMcpSearxngContentPt() {
  return (
    <>
      <ArticleH2>1. O problema que apareceu na prática</ArticleH2>

      <ArticleP>
        Se você usa agente de IA no dia a dia, em algum momento a busca web deixa
        de ser “um plus legal” e vira peça do fluxo. Documentação muda de um dia
        para o outro, APIs quebram sem aviso e aquele bug chato só aparece numa
        issue aberta ontem. Quando o modelo fica preso no conhecimento de treino
        e no que já está no repositório, a sessão começa a girar em falso.
      </ArticleP>

      <ArticleP>
        Eu senti isso com força em sessões longas no Cursor. O agente precisa
        pesquisar, ler um trecho bom, aplicar e validar. Quando a busca falha,
        ele retenta, inventa ou simplesmente te interrompe. O custo deixa de ser
        só financeiro. Vira atrito, contexto perdido e tempo que você não
        recupera.
      </ArticleP>

      <ArticleH3>O que quebra nas APIs de busca pagas</ArticleH3>

      <ArticleP>
        APIs comerciais funcionam bem quando o volume é baixo e a previsibilidade
        importa mais que a conta no fim do mês. O problema é que desenvolvimento
        com agente não é “duas queries por dia”. É exploração. É abrir várias
        frentes, comparar docs, caçar issues e voltar atrás quando a hipótese
        não se sustenta.
      </ArticleP>

      <ArticleP>
        Nesse ritmo, o preço sobe rápido, a cota aperta e o rate-limit chega
        exatamente quando você quer velocidade. Tem também o lado de
        privacidade: termos de busca com nomes de cliente, stack interna ou
        incidentes acabam saindo da sua máquina para um SaaS de terceiros. E se
        o fornecedor muda preço, política ou disponibilidade, o seu fluxo local
        quebra junto.
      </ArticleP>

      <ArticleH3>Scrapers “gratuitos” e a falsa sensação de vitória</ArticleH3>

      <ArticleP>
        A outra tentação óbvia é pegar um MCP pronto que raspa motor público
        direto (DuckDuckGo e afins). No smoke test parece mágica. Em uso
        contínuo, a história muda. IP bloqueia, CAPTCHA aparece, latência
        vira roleta e a taxa de falha sobe exatamente no padrão de um agente
        autônomo: muitas consultas em rajada, durante horas.
      </ArticleP>

      <ArticleCallout variant="note" title="O que eu chamo de “local” aqui">
        <ArticleP>
          Local não significa offline. Significa controle na borda. Você tira o
          intermediário SaaS de busca e hospeda a orquestração (SearXNG + MCP)
          na sua máquina. A internet continua existindo, engines externas
          continuam sendo consultadas, mas a camada que o agente enxerga fica
          sob o seu domínio: porta, secret, ciclo de vida e superfície de
          exposição.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Se quiser a base oficial do protocolo e do metasearch:{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className="font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Model Context Protocol
        </a>{" "}
        e{" "}
        <a
          href="https://docs.searxng.org/"
          className="font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          documentação do SearXNG
        </a>
        .
      </ArticleP>

      <ArticleH2>2. Três caminhos que eu coloquei na mesa</ArticleH2>

      <ArticleP>
        Eu não estava caçando a arquitetura mais sofisticada. Queria a opção
        mais estável para uso diário, com o menor custo de ownership possível.
        Três rotas apareceram naturalmente.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Fluxo de decisão entre opções A, B e C"
        chart={DECISION_CHART}
      />

      <ArticleH3>Opção A: MCP pronto com scraper público direto</ArticleH3>

      <ArticleP>
        Setup quase zero, zero infra local, resultado imediato. Ótimo para
        validar a ideia em quinze minutos. Ruim demais como base contínua.
        Anti-bot, CAPTCHA e rate-limit transformam a ferramenta em roleta, e
        sessões longas sofrem primeiro. Eu usei isso como experimento rápido e
        descartei como linha principal.
      </ArticleP>

      <ArticleH3>Opção B: MCP pronto + SearXNG local em Docker</ArticleH3>

      <ArticleP>
        Aqui o MCP para de “raspar a web sozinho”. Ele fala com um metasearch
        que você hospeda. O SearXNG agrega engines, limpa boa parte do ruído e
        devolve JSON na loopback da máquina. Você ganha pragmatismo, custo zero
        de API, privacidade melhor e controle operacional, sem reinventar o
        protocolo MCP do zero.
      </ArticleP>

      <ArticleH3>Opção C: MCP custom com o SDK</ArticleH3>

      <ArticleP>
        Construir um servidor MCP em TypeScript com{" "}
        <ArticleCode>@modelcontextprotocol/sdk</ArticleCode> é totalmente
        viável. O problema não é capacidade técnica. É valor. Para o objetivo
        “busca web estável no agente”, você vira dono de timeout, parsing,
        fallback, bug e changelog. Muito esforço para pouco diferencial de
        negócio. Descartei por ROI, não por medo de código.
      </ArticleP>

      <ArticleTable caption="Comparativo rápido das três opções">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Critério</ArticleTh>
            <ArticleTh>A: Scraper MCP</ArticleTh>
            <ArticleTh>B: MCP + SearXNG</ArticleTh>
            <ArticleTh>C: MCP custom</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Custo financeiro</ArticleTd>
            <ArticleTd>Baixo até falhar</ArticleTd>
            <ArticleTd>Zero de API</ArticleTd>
            <ArticleTd>Alto em tempo de engenharia</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Estabilidade / rate-limit</ArticleTd>
            <ArticleTd>Frágil</ArticleTd>
            <ArticleTd>Boa, com agregação</ArticleTd>
            <ArticleTd>Depende da implementação</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Esforço para colocar no ar</ArticleTd>
            <ArticleTd>Mínimo</ArticleTd>
            <ArticleTd>Moderado</ArticleTd>
            <ArticleTd>Alto</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Privacidade</ArticleTd>
            <ArticleTd>Baixa a média</ArticleTd>
            <ArticleTd>Alta na borda</ArticleTd>
            <ArticleTd>Alta, se bem feito</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Encaixa no objetivo real?</ArticleTd>
            <ArticleTd>Só smoke test</ArticleTd>
            <ArticleTd>Uso diário</ArticleTd>
            <ArticleTd>Overengineering</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleCallout variant="tip" title="A decisão">
        <ArticleP>
          Fiquei com a B. Ela resolve estabilidade e privacidade sem transformar
          a solução num produto interno eterno de manutenção. É a menor
          arquitetura que sobrevive a uma semana de uso real, não só a um demo
          de sexta-feira.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. O que é o SearXNG (e por que ele entra na jogada)</ArticleH2>

      <ArticleP>
        SearXNG é um metasearch engine open source e auto-hospedável. Em vez de
        ser “mais um Google”, ele agrega resultados de vários serviços e bases
        (Google, Bing, DuckDuckGo e dezenas de outros, conforme a config) e
        devolve uma visão unificada. Você pesquisa uma vez; por baixo ele
        espalha a consulta e junta o retorno.
      </ArticleP>

      <ArticleP>
        O projeto nasceu com foco em privacidade: a instância não precisa
        rastrear nem perfilar o usuário da forma que um buscador comercial faz
        por padrão. No uso local isso fica ainda mais claro. A orquestração
        mora na sua máquina, o histórico sensível não precisa atravessar um
        SaaS de search, e você decide o que fica exposto.
      </ArticleP>

      <ArticleP>
        Eu escolhi o SearXNG por três motivos práticos. Primeiro, ele já resolve
        agregação e normalização de resultados, então o MCP não precisa virar
        um parser frágil de HTML. Segundo, a API JSON é direta o suficiente
        para um agente consumir sem gambiarra. Terceiro, a comunidade mantém
        imagem Docker e documentação boas o bastante para subir em minutos e
        operar no dia a dia sem transformar isso num side project eterno.
      </ArticleP>

      <ArticleP>
        Tem nuances importantes. Engines externas mudam e podem degradar; isso
        faz parte do modelo. O formato JSON precisa estar habilitado no{" "}
        <ArticleCode>settings.yml</ArticleCode>, senão a API responde 403 e o
        MCP parece quebrado. E “local” continua dependendo da internet pública
        para falar com as engines. O que você ganha não é offline total. É
        controle da borda, custo zero de API de busca e uma camada estável
        entre o agente e a web.
      </ArticleP>

      <ArticleP>
        Repositório oficial:{" "}
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

      <ArticleH2>4. Como a stack se encaixa</ArticleH2>

      <ArticleP>
        A arquitetura é simples de propósito. Cada peça tem um trabalho claro, e
        isso ajuda na hora de depurar: quando algo falha, você sabe em qual
        camada olhar primeiro.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Arquitetura ponta a ponta Cursor, MCP, SearXNG e engines"
        chart={ARCHITECTURE_CHART}
      />

      <ArticleH3>Cursor / agente</ArticleH3>

      <ArticleP>
        O Cursor é o cliente MCP. Ele descobre as tools, decide quando chamar e
        joga o payload estruturado na janela de contexto do modelo. O agente não
        “abre o Chrome”. Ele usa tools. Isso deixa a busca auditável, repetível
        e plugável em outros clientes MCP no futuro.
      </ArticleP>

      <ArticleH3>Servidor MCP (`@zhafron/mcp-web-search`)</ArticleH3>

      <ArticleP>
        Um processo Node sobe via <ArticleCode>npx</ArticleCode> e conversa com
        o Cursor por JSON-RPC em <ArticleCode>stdio</ArticleCode>. A
        responsabilidade dele é traduzir pedido de tool em HTTP local, aplicar
        timeout (<ArticleCode>HTTP_TIMEOUT</ArticleCode>) e devolver resultado
        estruturado. Também expõe <ArticleCode>fetch_url</ArticleCode>, que é o
        passo seguinte natural: achar a fonte boa e ler o conteúdo de verdade,
        sem engolir a página inteira no escuro.
      </ArticleP>

      <ArticleH3>SearXNG no papel de metasearch local</ArticleH3>

      <ArticleP>
        Na stack, o SearXNG é a peça que agrega engines e serve JSON em{" "}
        <ArticleCode>127.0.0.1:8099</ArticleCode>. O bind em loopback é
        deliberado: a API fica acessível só na máquina local. Menos superfície
        exposta, menos dor de cabeça. Na ponta final continuam Google, Bing,
        DuckDuckGo e o que mais você habilitar. O SearXNG orquestra. Você
        controla a borda.
      </ArticleP>

      <ArticleP>
        O contrato mental é simples: Cursor fala MCP, MCP fala SearXNG, SearXNG
        fala com a web. Quebre um elo e o sintoma muda. Por isso troubleshooting
        precisa ser por camada, não por “reinicia tudo e reza”.
      </ArticleP>

      <ArticleH2>5. O que melhora, o que custa e onde aperta</ArticleH2>

      <ArticleP>
        O ganho mais óbvio é a fatura: zero API de busca. Logo atrás vem
        privacidade, porque termos sensíveis não precisam atravessar um SaaS de
        search. Tem também resiliência prática: uma engine ruim não derruba o
        metasearch inteiro. E tem o controle operacional. Porta, formatos,
        secrets e ciclo de vida do container ficam sob o seu comando.
      </ArticleP>

      <ArticleP>
        O custo existe, claro. Docker na workstation não é “grátis” em
        atenção. Agregação tem latência. Engines mudam HTML e API e de vez em
        quando degradam. Em rajadas de busca, CPU e rede locais sentem. Nada
        disso inviabiliza a stack, mas ignora esses pontos e a operação vira
        surpresa ruim.
      </ArticleP>

      <ArticleTable caption="Gargalos que eu já vi e como mitiguei">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Gargalo</ArticleTh>
            <ArticleTh>Sintoma</ArticleTh>
            <ArticleTh>Mitigação</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Timeouts</ArticleTd>
            <ArticleTd>Tool falha sob carga</ArticleTd>
            <ArticleTd>
              Subir <ArticleCode>HTTP_TIMEOUT</ArticleCode> e reduzir engines
              ativas
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Payload grande</ArticleTd>
            <ArticleTd>Contexto do LLM estoura</ArticleTd>
            <ArticleTd>
              Pedir síntese e usar <ArticleCode>fetch_url</ArticleCode> seletivo
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Cold start</ArticleTd>
            <ArticleTd>Primeira busca lenta</ArticleTd>
            <ArticleTd>
              Manter o container up e healthcheck no compose
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Loops de busca</ArticleTd>
            <ArticleTd>Agente pesquisa demais</ArticleTd>
            <ArticleTd>
              Limitar no prompt e validar hipótese antes da próxima query
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH2>6. Como eu montei na prática</ArticleH2>

      <ArticleH3>Fase 1: SearXNG no Docker</ArticleH3>

      <ArticleP>
        Criei um diretório local (no meu caso,{" "}
        <ArticleCode>~/searxng</ArticleCode>) e preparei o{" "}
        <ArticleCode>settings.yml</ArticleCode>. O detalhe que mais gente
        esquece é o formato JSON. Sem ele, a API responde 403 e o MCP parece
        “quebrado” sem motivo aparente.
      </ArticleP>

      <ArticleP>
        Gere secrets fortes com{" "}
        <ArticleCode>openssl rand -hex 32</ArticleCode> e não deixe
        placeholder no arquivo. Um trecho mínimo fica assim:
      </ArticleP>

      <ArticleCode block>
        {`# settings.yml (trecho essencial)
use_default_settings: true

general:
  instance_name: "searxng-local"

server:
  secret_key: "SUBSTITUA_COM_OPENSSL_RAND_HEX_32"
  limiter: false
  image_proxy: true

search:
  formats:
    - html
    - json`}
      </ArticleCode>

      <ArticleCallout variant="warning" title="Sem JSON, você leva 403">
        <ArticleP>
          Se <ArticleCode>json</ArticleCode> não estiver em{" "}
          <ArticleCode>search.formats</ArticleCode>, a API recusa a resposta e o
          MCP aparenta falha de integração. Na maioria das vezes o problema está
          só nessa linha.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        O compose com bind restrito à loopback:
      </ArticleP>

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
        Suba com <ArticleCode>docker compose up -d</ArticleCode> e valide com um
        curl simples. Se voltar JSON, a camada SearXNG está ok.
      </ArticleP>

      <ArticleCode block>
        {`docker compose up -d

curl -s "http://127.0.0.1:8099/search?q=model+context+protocol&format=json" | head`}
      </ArticleCode>

      <ArticleP>
        A UI local fica em <ArticleCode>http://127.0.0.1:8099</ArticleCode>. A
        referência oficial de instalação está na{" "}
        <a
          href="https://docs.searxng.org/admin/installation-docker.html"
          className="font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          documentação Docker do SearXNG
        </a>
        .
      </ArticleP>

      <ArticleH3>Fase 2: MCP no Cursor</ArticleH3>

      <ArticleP>
        Configure o MCP global em <ArticleCode>~/.cursor/mcp.json</ArticleCode>{" "}
        ou por projeto em <ArticleCode>.cursor/mcp.json</ArticleCode>. O bloco
        abaixo força o provedor local e aponta para o container.
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
        <ArticleCode>DEFAULT_SEARCH_PROVIDER=searxng</ArticleCode> evita cair no
        scraper default. <ArticleCode>SEARXNG_URL</ArticleCode> aponta para a
        instância local. <ArticleCode>HTTP_TIMEOUT</ArticleCode> evita morte
        precoce quando a agregação demora um pouco mais. Depois de editar o
        arquivo, reinicie o Cursor e confira se o servidor aparece conectado na
        UI de tools.
      </ArticleP>

      <ArticleH3>Fase 3: Aceite rápido</ArticleH3>

      <ArticleOl>
        <ArticleLi>Reiniciar o Cursor após salvar o mcp.json.</ArticleLi>
        <ArticleLi>Confirmar o servidor MCP conectado nas settings.</ArticleLi>
        <ArticleLi>
          Rodar <ArticleCode>search_web</ArticleCode> com uma query objetiva.
        </ArticleLi>
        <ArticleLi>
          Rodar <ArticleCode>fetch_url</ArticleCode> na melhor fonte e pedir uma
          síntese curta.
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        Dois prompts que eu uso para validar o fluxo de ponta a ponta:
      </ArticleP>

      <ArticleCode block>
        {`Use search_web para encontrar a documentação oficial do Model Context Protocol.
Depois use fetch_url na melhor fonte e resuma em 5 bullets acionáveis.`}
      </ArticleCode>

      <ArticleCode block>
        {`Pesquise issues recentes sobre erro 403 no SearXNG com format=json.
Cite links e separe causa de configuração de bloqueio de engine.`}
      </ArticleCode>

      <ArticleH2>7. Operação do dia a dia e o que fazer quando quebra</ArticleH2>

      <ArticleP>
        A stack fica estável quando você trata container e MCP como
        infraestrutura de workstation, não como plugin mágico. Reiniciou a
        máquina? Sobe o compose e valida com curl. Container caiu? Olha{" "}
        <ArticleCode>docker ps -a</ArticleCode>, lê o log e sobe de novo. UI do
        SearXNG vazia? Abre a porta local, testa engines e revisa o settings.
      </ArticleP>

      <ArticleTable caption="Troubleshooting que mais aparece">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Cenário</ArticleTh>
            <ArticleTh>O que eu faço</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Máquina reiniciou</ArticleTd>
            <ArticleTd>
              <ArticleCode>docker compose up -d</ArticleCode> + curl de sanidade
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Container caiu</ArticleTd>
            <ArticleTd>
              Status com <ArticleCode>docker ps -a</ArticleCode>, logs e restart
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>MCP não sobe no Cursor</ArticleTd>
            <ArticleTd>
              Checar PATH do Node/npx no app gráfico e testar{" "}
              <ArticleCode>npx -y @zhafron/mcp-web-search</ArticleCode> no
              terminal
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>403 em format=json</ArticleTd>
            <ArticleTd>
              Confirmar <ArticleCode>json</ArticleCode> em{" "}
              <ArticleCode>search.formats</ArticleCode> e recriar o container
            </ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Resultados fracos</ArticleTd>
            <ArticleTd>
              Ajustar engines, cortar loops e preferir{" "}
              <ArticleCode>fetch_url</ArticleCode> em fontes oficiais
            </ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Algumas práticas que pagam o almoço: manter SearXNG em 127.0.0.1,
        gerar secrets de verdade com openssl, ensinar o agente a buscar pouco e
        ler bem (search → fetch → síntese) e tratar degradação de engine como
        operação normal. Engines mudam. Isso não é incidente raro. É o jogo.
      </ArticleP>

      <ArticleH3>Conclusão</ArticleH3>

      <ArticleP>
        Eu não escolhi construir mais software. Escolhi a menor arquitetura que
        aguenta uso real. MCP pronto + SearXNG local entrega custo zero de API,
        privacidade na borda e estabilidade melhor que scraper frágil, com um
        overhead operacional aceitável para quem já vive em Docker no dia a dia.
      </ArticleP>

      <ArticleP>
        Se o objetivo é agente com busca confiável de segunda a sexta, a opção B
        não é atalho. É a linha que eu deixaria rodando na minha máquina e
        recomendaria para alguém do time sem vergonha nenhuma.
      </ArticleP>
    </>
  );
}
