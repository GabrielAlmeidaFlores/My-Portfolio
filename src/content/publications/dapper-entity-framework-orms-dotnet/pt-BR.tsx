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

const PIPELINE_CHART = `flowchart TB
  subgraph EF["EF Core"]
    Linq["LINQ"] --> Expr["Expression tree"]
    Expr --> SqlGen["SQL gerado"]
    SqlGen --> Track["Materializa e rastreia"]
  end
  subgraph Dapper["Dapper"]
    Sql["SQL manual"] --> Param["Comando parametrizado"]
    Param --> Map["Mapeia linhas para objetos"]
  end`;

const DECISION_CHART = `flowchart TB
  Start(["Nova feature"]) --> Domain{"CRUD com relacionamentos?"}
  Domain -->|"Sim"| EF["EF Core"]
  Domain -->|"Não"| Read{"Leitura complexa ou caminho quente?"}
  Read -->|"Sim"| Micro["Dapper ou linq2db"]
  Read -->|"Não"| Legacy{"Banco e SQL já maduros?"}
  Legacy -->|"Sim"| Micro
  Legacy -->|"Não"| EF
  EF --> Special{"SQL específico?"}
  Special -->|"Sim"| Hybrid(["EF para escrita e Dapper para leitura"])`;

const linkClass =
  "font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300";

const DAPPER_URL = "https://github.com/DapperLib/Dapper";
const EF_URL = "https://learn.microsoft.com/ef/core/";
const ADO_URL =
  "https://learn.microsoft.com/dotnet/framework/data/adonet/ado-net-overview";
const LINQ_URL = "https://learn.microsoft.com/dotnet/csharp/linq/";
const TRACKING_URL = "https://learn.microsoft.com/ef/core/change-tracking/";
const MIGRATIONS_URL =
  "https://learn.microsoft.com/ef/core/managing-schemas/migrations/";
const NPLUS1_URL =
  "https://learn.microsoft.com/ef/core/performance/efficient-querying#beware-of-lazy-loading";
const SQL_INJECTION_URL =
  "https://owasp.org/www-community/attacks/SQL_Injection";
const BENCHMARK_URL = "https://benchmarkdotnet.org/";
const NPGSQL_URL = "https://www.npgsql.org/";
const DAPPER_CONTRIB_URL = "https://github.com/DapperLib/Dapper.Contrib";
const REPODB_URL = "https://repodb.net/";
const PETAPOCO_URL = "https://github.com/toptensoftware/PetaPoco";
const ORMLITE_URL = "https://docs.servicestack.net/ormlite/";
const LINQTODB_URL = "https://linq2db.github.io/";
const NHIBERNATE_URL = "https://nhibernate.info/";
const MARTEN_URL = "https://martendb.io/";
const EF_RAW_SQL_URL =
  "https://learn.microsoft.com/ef/core/querying/sql-queries";

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

export function DapperEntityFrameworkOrmsDotnetContentPt() {
  return (
    <>
      <ArticleH2>1. O problema antes da escolha</ArticleH2>

      <ArticleP>
        Um time .NET começa com{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> porque a ferramenta
        resolve o básico com pouco código: entidade, <ArticleCode>DbContext</ArticleCode>,
        consulta LINQ e pronto. Meses depois aparece uma tela de relatório que
        junta cinco tabelas, agrupa por período e precisa responder em
        milissegundos.
      </ArticleP>

      <ArticleP>
        A consulta gerada pelo{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> fica estranha,
        o plano do banco muda e a leitura passa a carregar colunas que a tela
        não usa. Alguém sugere{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink>. A troca parece simples,
        mas o time precisa saber o que ganha e o que perde.
      </ArticleP>

      <ArticleP>
        Este post compara{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> e{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> com código
        real, mostra quando cada um encaixa e passa por outros ORMs do
        ecossistema .NET. A ideia central é simples: a ferramenta segue o
        formato do problema, não o contrário.
      </ArticleP>

      <ArticleCallout variant="note" title="O que você vai encontrar">
        <ArticleP>
          A comparação começa pelo papel de cada biblioteca. Depois vêm os
          exemplos, a tabela de tradeoffs, o desenho de decisão, o uso dos dois
          no mesmo projeto e um mapa de alternativas como{" "}
          <TermLink href={REPODB_URL}>RepoDB</TermLink>,{" "}
          <TermLink href={LINQTODB_URL}>LINQ to DB</TermLink> e{" "}
          <TermLink href={NHIBERNATE_URL}>NHibernate</TermLink>.
        </ArticleP>
      </ArticleCallout>

      <ArticleCallout variant="note" title="Sobre os exemplos">
        <ArticleP>
          Os exemplos usam tipos e variáveis de domínio como{" "}
          <ArticleCode>Order</ArticleCode>, <ArticleCode>OrderInput</ArticleCode>,{" "}
          <ArticleCode>OrderItem</ArticleCode>, <ArticleCode>Receipt</ArticleCode>{" "}
          e <ArticleCode>customerId</ArticleCode>. Eles representam o domínio de
          pedido e foram omitidos para o foco ficar na comparação entre as
          ferramentas. O código mostra a forma da solução, não um projeto
          completo.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>Conceitos que aparecem no post</ArticleH3>

      <ArticleP>
        Antes de comparar, vale fixar o vocabulário. Cada termo abaixo aparece
        nos exemplos e nas tabelas:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>ORM:</strong> biblioteca que transforma tabelas em classes e
          acompanha o estado dos objetos. Exemplo: ao carregar um pedido e mudar
          o campo <ArticleCode>Status</ArticleCode>, o{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> sabe que
          precisa gerar um <ArticleCode>UPDATE</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <strong>Micro-ORM:</strong> biblioteca que executa SQL e mapeia o
          resultado para objetos. Exemplo: o{" "}
          <TermLink href={DAPPER_URL}>Dapper</TermLink> recebe a consulta pronta
          e devolve uma lista de <ArticleCode>OrderSummary</ArticleCode>, sem
          saber se o objeto foi alterado depois.
        </ArticleLi>
        <ArticleLi>
          <strong>Mapeamento:</strong> ligar cada coluna do resultado a uma
          propriedade da classe. Exemplo: a coluna{" "}
          <ArticleCode>created_at</ArticleCode> vira a propriedade{" "}
          <ArticleCode>CreatedAt</ArticleCode> por meio de um alias no SQL.
        </ArticleLi>
        <ArticleLi>
          <strong>Change tracking:</strong> o ORM guarda uma cópia do estado
          original da entidade para descobrir o que mudou. Exemplo: se o preço
          era 10 e passou para 12, o <ArticleCode>SaveChanges</ArticleCode>{" "}
          gera um <ArticleCode>UPDATE</ArticleCode> só do que mudou.
        </ArticleLi>
        <ArticleLi>
          <strong>Migration:</strong> arquivo versionado que altera o schema do
          banco. Exemplo: adicionar a coluna <ArticleCode>coupon_id</ArticleCode>{" "}
          em <ArticleCode>orders</ArticleCode> com um script que sobe e desce.
        </ArticleLi>
        <ArticleLi>
          <strong>Read model ou DTO:</strong> classe ou record pequeno com
          apenas as colunas que uma tela precisa. Exemplo:{" "}
          <ArticleCode>OrderSummary</ArticleCode> com id, data, total e nome do
          cliente, sem carregar os itens do pedido.
        </ArticleLi>
        <ArticleLi>
          <strong>N mais 1:</strong> uma consulta para buscar a lista e mais uma
          consulta para cada item da lista. Exemplo: 500 pedidos geram 501
          consultas quando o código acessa os itens dentro de um laço.
        </ArticleLi>
        <ArticleLi>
          <strong>Caminho quente:</strong> trecho chamado muitas vezes por
          segundo. Exemplo: a consulta que monta a tela inicial de um e-commerce
          e roda em toda visita.
        </ArticleLi>
        <ArticleLi>
          <strong>Transação:</strong> bloco de operações que confirma tudo ou
          desfaz tudo. Exemplo: debitar uma conta, creditar outra e gravar o
          comprovante precisam acontecer juntos.
        </ArticleLi>
        <ArticleLi>
          <strong>SQL injection:</strong> entrada do usuário interpretada como
          comando SQL. Exemplo: um filtro montado com{" "}
          <ArticleCode>"' OR 1=1"</ArticleCode> pode devolver a tabela inteira.
        </ArticleLi>
        <ArticleLi>
          <strong>Pool de conexões:</strong> reservatório de conexões abertas
          reutilizadas entre requisições. Exemplo: abrir uma conexão física a
          cada request custa tempo; o pool devolve uma conexão pronta.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>2. ORM, micro-ORM e o que o Dapper faz</ArticleH2>

      <ArticleP>
        Um <strong>ORM completo</strong> mapeia tabelas para classes, acompanha
        mudanças, gera SQL a partir de expressões e cuida de relacionamentos,
        migrations e concorrência. O{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> é esse tipo de
        ferramenta.
      </ArticleP>

      <ArticleP>
        Um <strong>micro-ORM</strong> faz menos.{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> recebe um comando SQL que
        você escreveu, adiciona parâmetros, executa pela conexão{" "}
        <TermLink href={ADO_URL}>ADO.NET</TermLink> e mapeia cada linha para um
        objeto. Não existe change tracking, migration ou tradutor de LINQ para
        SQL embutido.
      </ArticleP>

      <ArticleP>
        A diferença de fluxo fica clara no desenho:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Fluxo do EF Core com LINQ, expression tree, SQL gerado e tracking; fluxo do Dapper com SQL manual, comando parametrizado e mapeamento de linhas"
        chart={PIPELINE_CHART}
      />

      <ArticleP>
        No{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink>, a consulta
        nasce em{" "}
        <TermLink href={LINQ_URL}>LINQ</TermLink> e vira uma árvore de
        expressão. O provider traduz essa árvore para SQL, executa e
        materializa entidades que entram no{" "}
        <TermLink href={TRACKING_URL}>change tracker</TermLink>.
      </ArticleP>

      <ArticleP>
        No <TermLink href={DAPPER_URL}>Dapper</TermLink>, o SQL é seu. A
        biblioteca monta o comando com parâmetros, lê o resultado e preenche as
        propriedades. O caminho é curto e previsível, e a responsabilidade pelo
        SQL também fica com o time.
      </ArticleP>

      <ArticleH3>O que acontece em uma chamada do Entity Framework Core</ArticleH3>

      <ArticleP>
        Vale acompanhar o caminho completo, porque é nele que aparecem os
        custos. Quando o código executa <ArticleCode>ToListAsync</ArticleCode>:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          O C# monta uma árvore de expressão com a consulta. Nada foi enviado
          ao banco ainda.
        </ArticleLi>
        <ArticleLi>
          O provider do{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> traduz essa
          árvore para SQL, com parâmetros para os valores.
        </ArticleLi>
        <ArticleLi>
          A conexão envia o comando e o banco devolve as linhas.
        </ArticleLi>
        <ArticleLi>
          O materializador cria os objetos <ArticleCode>Order</ArticleCode> e
          preenche as propriedades.
        </ArticleLi>
        <ArticleLi>
          O{" "}
          <TermLink href={TRACKING_URL}>change tracker</TermLink> guarda uma
          cópia do estado original de cada entidade.
        </ArticleLi>
        <ArticleLi>
          No <ArticleCode>SaveChanges</ArticleCode>, o EF compara o estado atual
          com a cópia e gera <ArticleCode>UPDATE</ArticleCode>,{" "}
          <ArticleCode>INSERT</ArticleCode> ou{" "}
          <ArticleCode>DELETE</ArticleCode>.
        </ArticleLi>
      </ArticleOl>

      <ArticleH3>O que acontece em uma chamada do Dapper</ArticleH3>

      <ArticleP>
        O caminho do <TermLink href={DAPPER_URL}>Dapper</TermLink> é menor,
        porque não existe tradução de LINQ nem rastreamento. Quando o código
        executa <ArticleCode>QueryAsync</ArticleCode>:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          A conexão é aberta ou reaproveitada do{" "}
          <strong>pool de conexões</strong>.
        </ArticleLi>
        <ArticleLi>
          O SQL e o objeto de parâmetros viram um comando{" "}
          <TermLink href={ADO_URL}>ADO.NET</TermLink>.
        </ArticleLi>
        <ArticleLi>
          O banco executa o comando e devolve um leitor de resultados.
        </ArticleLi>
        <ArticleLi>
          O <TermLink href={DAPPER_URL}>Dapper</TermLink> lê uma linha por vez e
          cria o objeto do tipo informado.
        </ArticleLi>
        <ArticleLi>
          Cada coluna é ligada à propriedade de mesmo nome, ou ao parâmetro do
          construtor no caso de um record.
        </ArticleLi>
        <ArticleLi>
          Ao final, a conexão volta para o pool. Nenhum objeto fica sendo
          rastreado.
        </ArticleLi>
      </ArticleOl>

      <ArticleH2>3. Entity Framework Core: produtividade com convenções</ArticleH2>

      <ArticleP>
        O{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> brilha quando
        o domínio tem entidades relacionadas, regras de negócio e operações de
        escrita que precisam de transação. Para entender o exemplo, comece pelo
        modelo: um pedido tem vários itens, e o{" "}
        <ArticleCode>DbContext</ArticleCode> declara essa relação.
      </ArticleP>

      <ArticleP>
        <strong>Primeiro, o modelo e o mapeamento:</strong>
      </ArticleP>

      <ArticleCode block language="csharp">
        {`public sealed class AppDbContext : DbContext
{
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>()
            .HasMany(order => order.Items)
            .WithOne()
            .HasForeignKey(item => item.OrderId);
    }
}`}
      </ArticleCode>

      <ArticleP>
        O método <ArticleCode>OnModelCreating</ArticleCode> configura a relação:
        um pedido tem muitos itens, e cada item aponta para o pedido por{" "}
        <ArticleCode>OrderId</ArticleCode>. Esse mapeamento é o que permite ao{" "}
        <ArticleCode>Include</ArticleCode> carregar os itens junto com o pedido.
      </ArticleP>

      <ArticleP>
        <strong>Agora a consulta:</strong>
      </ArticleP>

      <ArticleCode block language="csharp">
        {`using Microsoft.EntityFrameworkCore;

using var db = new AppDbContext();

var orders = await db.Orders
    .Where(order => order.CustomerId == customerId)
    .Include(order => order.Items)
    .OrderByDescending(order => order.CreatedAt)
    .ToListAsync();`}
      </ArticleCode>

      <ArticleP>
        O <ArticleCode>DbContext</ArticleCode> representa a sessão com o banco.
        O <ArticleCode>DbSet</ArticleCode> dá acesso às tabelas. A consulta em{" "}
        <TermLink href={LINQ_URL}>LINQ</TermLink> é traduzida para SQL, e o{" "}
        <TermLink href={TRACKING_URL}>change tracker</TermLink> guarda o estado
        das entidades carregadas para calcular o <ArticleCode>UPDATE</ArticleCode>{" "}
        no <ArticleCode>SaveChanges</ArticleCode>.
      </ArticleP>

      <ArticleH3>Lendo a consulta do EF Core linha a linha</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>using Microsoft.EntityFrameworkCore</ArticleCode> traz o
          método <ArticleCode>ToListAsync</ArticleCode> e os recursos de
          consulta assíncrona.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>using var db</ArticleCode> cria o contexto e garante que
          o contexto seja descartado no fim do escopo, devolvendo a conexão.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>db.Orders</ArticleCode> é o{" "}
          <ArticleCode>DbSet</ArticleCode> que representa a tabela de pedidos.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>.Where(...)</ArticleCode> adiciona a condição que vira a
          cláusula <ArticleCode>WHERE</ArticleCode> no SQL.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>.Include(...)</ArticleCode> pede ao EF que carregue os
          itens na mesma consulta, gerando um join.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>.OrderByDescending(...)</ArticleCode> vira a cláusula{" "}
          <ArticleCode>ORDER BY</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>.ToListAsync()</ArticleCode> executa a consulta, lê o
          resultado e materializa a lista de objetos rastreados.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>O que o EF Core entrega de graça</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Consultas tipadas em LINQ com verificação de compilação para nomes de
          propriedades e relacionamentos.
        </ArticleLi>
        <ArticleLi>
          Relacionamentos, chaves estrangeiras, carregamento explícito e
          projeções para classes ou records.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={MIGRATIONS_URL}>Migrations</TermLink> para versionar
          o schema junto com o código, com histórico e rollback.
        </ArticleLi>
        <ArticleLi>
          Controle de concorrência, transações e operações em lote com{" "}
          <ArticleCode>ExecuteUpdate</ArticleCode> e{" "}
          <ArticleCode>ExecuteDelete</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          SQL bruto quando necessário via{" "}
          <TermLink href={EF_RAW_SQL_URL}>
            <ArticleCode>FromSql</ArticleCode> e{" "}
            <ArticleCode>ExecuteSql</ArticleCode>
          </TermLink>
          , sem abandonar o contexto.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Onde o EF Core cobra o preço</ArticleH3>

      <ArticleP>
        A abstração vaza quando a consulta foge do padrão. Um{" "}
        <ArticleCode>Include</ArticleCode> em cadeia, um{" "}
        <ArticleCode>GroupBy</ArticleCode> complexo ou uma janela analítica
        podem gerar SQL pior que o escrito à mão. O time precisa ler o SQL
        gerado e medir.
      </ArticleP>

      <ArticleP>
        O{" "}
        <TermLink href={TRACKING_URL}>change tracker</TermLink> tem custo de
        memória e CPU. Em uma leitura de 50 mil linhas que ninguém vai alterar,
        rastrear cada entidade é desperdício. O mesmo vale para carregar a
        entidade inteira quando a tela usa três colunas.
      </ArticleP>

      <ArticleP>
        O problema clássico é o{" "}
        <TermLink href={NPLUS1_URL}>N mais 1</TermLink>. Com lazy loading
        habilitado, este laço dispara uma consulta por pedido:
      </ArticleP>

      <ArticleCode block language="csharp">
        {`var orders = await db.Orders.ToListAsync();

foreach (var order in orders)
{
    Console.WriteLine(order.Items.Count);
}`}
      </ArticleCode>

      <ArticleP>
        Se a lista tem 500 pedidos, o banco recebe 501 consultas. O laço parece
        inofensivo e o custo aparece só em produção. A correção é carregar o que
        a tela precisa em uma consulta, com projeção e sem tracking:
      </ArticleP>

      <ArticleCode block language="csharp">
        {`var summaries = await db.Orders
    .AsNoTracking()
    .Select(order => new OrderSummary(
        order.Id,
        order.CreatedAt,
        order.Total,
        order.Customer.Name))
    .ToListAsync();`}
      </ArticleCode>

      <ArticleP>
        <ArticleCode>AsNoTracking</ArticleCode> remove o custo de rastreamento
        em leituras. A projeção evita colunas desnecessárias. A consulta
        continua em LINQ e o provider gera o SQL com join.
      </ArticleP>

      <ArticleH2>4. Dapper: SQL explícito e mapeamento direto</ArticleH2>

      <ArticleP>
        O <TermLink href={DAPPER_URL}>Dapper</TermLink> é uma extensão sobre{" "}
        <TermLink href={ADO_URL}>ADO.NET</TermLink>. Você abre a conexão, passa
        o SQL e o objeto de parâmetros, e recebe o resultado mapeado. O exemplo
        abaixo usa <TermLink href={NPGSQL_URL}>Npgsql</TermLink> com
        PostgreSQL. Primeiro, o read model que representa o resultado:
      </ArticleP>

      <ArticleCode block language="csharp">
        {`public sealed record OrderSummary(
    Guid Id,
    DateTime CreatedAt,
    decimal Total,
    string CustomerName);`}
      </ArticleCode>

      <ArticleP>
        O record é um contrato simples: cada propriedade corresponde a uma
        coluna que a consulta vai devolver. O record não é uma entidade rastreada e
        não precisa representar a tabela inteira.
      </ArticleP>

      <ArticleP>
        <strong>Depois, a consulta com parâmetros:</strong>
      </ArticleP>

      <ArticleCode block language="csharp">
        {`using Dapper;
using Npgsql;

using var connection = new NpgsqlConnection(connectionString);

var orders = await connection.QueryAsync<OrderSummary>(
    """
    SELECT o.id AS Id,
           o.created_at AS CreatedAt,
           o.total AS Total,
           c.name AS CustomerName
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    WHERE o.customer_id = @CustomerId
    ORDER BY o.created_at DESC
    """,
    new { CustomerId = customerId });`}
      </ArticleCode>

      <ArticleP>
        O parâmetro <ArticleCode>@CustomerId</ArticleCode> é enviado como
        parâmetro de banco, não concatenado na string. O mapeamento liga cada
        coluna do resultado à propriedade de mesmo nome no record.
      </ArticleP>

      <ArticleH3>Lendo a consulta do Dapper linha a linha</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>using Dapper</ArticleCode> traz os métodos de extensão
          como <ArticleCode>QueryAsync</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>NpgsqlConnection</ArticleCode> representa a conexão com o
          PostgreSQL. O <ArticleCode>using</ArticleCode> devolve a conexão ao
          pool no fim do escopo.
        </ArticleLi>
        <ArticleLi>
          O SQL usa aliases como <ArticleCode>o.id AS Id</ArticleCode> para que
          a coluna tenha exatamente o nome da propriedade do record.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>@CustomerId</ArticleCode> é um parâmetro de banco. O
          valor não entra na string, o que evita{" "}
          <TermLink href={SQL_INJECTION_URL}>SQL injection</TermLink>.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>{"new { CustomerId = customerId }"}</ArticleCode> é o objeto
          anônimo que fornece o valor do parâmetro.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>QueryAsync&lt;OrderSummary&gt;</ArticleCode> executa o
          comando e devolve uma tarefa com a sequência de objetos mapeados.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Para trazer pedido e itens em uma ida ao banco, o{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> oferece{" "}
        <ArticleCode>QueryMultiple</ArticleCode>:
      </ArticleP>

      <ArticleCode block language="csharp">
        {`using var multi = await connection.QueryMultipleAsync(
    """
    SELECT id, created_at, total
    FROM orders
    WHERE id = @Id;

    SELECT id, product_id, quantity
    FROM order_items
    WHERE order_id = @Id;
    """,
    new { Id = orderId });

var order = await multi.ReadSingleAsync<Order>();
var items = await multi.ReadAsync<OrderItem>();`}
      </ArticleCode>

      <ArticleP>
        O banco recebe o SQL como um comando com dois resultados. A
        biblioteca divide o resultado e mapeia cada parte para o tipo certo. Não
        existe join automático nem identidade de objeto: o time controla a
        consulta e o formato do resultado.
      </ArticleP>

      <ArticleH3>Por que tanta gente gosta do Dapper</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Controle total do SQL, incluindo hints (instruções para o
          otimizador), CTEs (expressões de tabela comuns), funções de janela
          como ranking e soma acumulada, procedures e recursos específicos do
          banco.
        </ArticleLi>
        <ArticleLi>
          Pouca mágica: o comando que roda no banco é o comando que está no
          código, o que facilita revisar plano e índice.
        </ArticleLi>
        <ArticleLi>
          Custo baixo de mapeamento em leituras simples, com pouca alocação em
          comparação a materializar entidades rastreadas.
        </ArticleLi>
        <ArticleLi>
          Adoção incremental em base existente, sem reescrever o modelo inteiro
          para começar a usar.
        </ArticleLi>
        <ArticleLi>
          Funciona bem com read models (classes simples que representam o resultado de uma
          leitura), relatórios, dashboards e consultas de projeção que não precisam de entidade de domínio.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>5. Vantagens e desvantagens lado a lado</ArticleH2>

      <ArticleP>
        As duas ferramentas resolvem acesso a dados, mas otimizam coisas
        diferentes. A tabela resume o tradeoff antes dos detalhes:
      </ArticleP>

      <ArticleTable caption="EF Core e Dapper: o que cada um otimiza">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Critério</ArticleTh>
            <ArticleTh>Entity Framework Core</ArticleTh>
            <ArticleTh>Dapper</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Modelo</ArticleTd>
            <ArticleTd>ORM completo com estado dos objetos e tracking</ArticleTd>
            <ArticleTd>Micro-ORM de mapeamento</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>SQL</ArticleTd>
            <ArticleTd>Gerado a partir de LINQ, com SQL bruto opcional</ArticleTd>
            <ArticleTd>Escrito pelo time</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Migrations</ArticleTd>
            <ArticleTd>Nativas</ArticleTd>
            <ArticleTd>Não possui, use outra ferramenta</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Change tracking</ArticleTd>
            <ArticleTd>Sim, com custo em leituras grandes</ArticleTd>
            <ArticleTd>Não</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Relacionamentos</ArticleTd>
            <ArticleTd>Mapeados e carregados pelo contexto</ArticleTd>
            <ArticleTd>Resolvidos na consulta ou em código</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Melhor uso</ArticleTd>
            <ArticleTd>CRUD, domínio relacional, escrita transacional</ArticleTd>
            <ArticleTd>Leitura, relatório, SQL específico, caminho quente</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Custo principal</ArticleTd>
            <ArticleTd>Abstração e SQL gerado nem sempre ideal</ArticleTd>
            <ArticleTd>SQL manual e manutenção do mapeamento</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Cada linha da tabela responde a uma pergunta diferente. “Modelo” indica
        o nível de abstração. “SQL” indica quem escreve a consulta.
        “Migrations” indica se o schema é versionado pela própria ferramenta.
        “Change tracking” indica se o ORM acompanha alterações. A leitura útil é
        combinar essas respostas com o tipo de feature, não escolher uma coluna
        isolada.
      </ArticleP>

      <ArticleH3>Desvantagens do Dapper</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          O SQL fica sob responsabilidade do time. Renomear coluna ou mudar
          schema exige procurar strings em todo o projeto.
        </ArticleLi>
        <ArticleLi>
          Não há migrations. Versionar o banco continua sendo tarefa de outra
          ferramenta, como um script, Flyway ou DbUp.
        </ArticleLi>
        <ArticleLi>
          O mapeamento é manual. Uma coluna com nome diferente da propriedade
          exige alias, configuração de tipo ou um DTO atualizado.
        </ArticleLi>
        <ArticleLi>
          Sem change tracking e sem unidade de trabalho. Salvar várias entidades
          exige transação explícita e comandos próprios.
        </ArticleLi>
        <ArticleLi>
          SQL concatenado abre espaço para{" "}
          <TermLink href={SQL_INJECTION_URL}>SQL injection</TermLink>. Use
          parâmetros sempre, inclusive em filtros opcionais e cláusulas{" "}
          <ArticleCode>IN</ArticleCode>.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Desvantagens do Entity Framework Core</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          O SQL gerado pode surpreender em consultas complexas. Sem ler o log e
          medir, o time otimiza no lugar errado.
        </ArticleLi>
        <ArticleLi>
          O tracking e o carregamento de entidades completas aumentam memória e
          tempo em leituras grandes.
        </ArticleLi>
        <ArticleLi>
          O N mais 1 aparece com facilidade em navegação preguiçosa ou em laços
          que acessam relacionamentos.
        </ArticleLi>
        <ArticleLi>
          Migrations em times grandes exigem disciplina de revisão e ordem de
          deploy.
        </ArticleLi>
        <ArticleLi>
          Consultas muito específicas de banco às vezes ficam mais claras em SQL
          bruto do que em LINQ.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="warning" title="Micro-ORM não corrige SQL ruim">
        <ArticleP>
          Trocar o{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> por{" "}
          <TermLink href={DAPPER_URL}>Dapper</TermLink> não melhora uma consulta
          sem índice, com <ArticleCode>SELECT *</ArticleCode> ou com filtro que
          impede o banco de usar a chave. O ganho vem de controlar o SQL e o
          mapeamento, não de trocar o logo da biblioteca.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>6. Quando usar cada um</ArticleH2>

      <ArticleP>
        A decisão começa pelo formato do problema, não pelo gosto pelo SQL. Se a
        feature é CRUD com relacionamentos e regras de escrita, o{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> tende a
        entregar mais rápido. Se a feature é leitura complexa, relatório ou um
        caminho quente que precisa de SQL sob medida, o{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> tende a encaixar melhor.
      </ArticleP>

      <ArticleP>
        O fluxograma resume a primeira decisão:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Decisão entre EF Core, Dapper e uso híbrido conforme relacionamentos, leitura complexa, maturidade do banco e necessidade de SQL específico"
        chart={DECISION_CHART}
      />

      <ArticleCallout variant="tip" title="Regra prática">
        <ArticleP>
          Se a operação principal é escrita com relacionamentos, comece com{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink>. Se a
          operação principal é leitura complexa, comece com{" "}
          <TermLink href={DAPPER_URL}>Dapper</TermLink>. Se as duas convivem no
          mesmo fluxo, use o híbrido com conexão e transação compartilhadas.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Cenários em que o{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> costuma ganhar:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Cadastro e edição de entidades com validação, relacionamentos e
          transação no mesmo fluxo.
        </ArticleLi>
        <ArticleLi>
          Domínio que muda com frequência e precisa de migrations versionadas
          junto do código.
        </ArticleLi>
        <ArticleLi>
          Time que prefere LINQ e quer menos SQL manual no dia a dia.
        </ArticleLi>
        <ArticleLi>
          Operações de escrita em lote com <ArticleCode>ExecuteUpdate</ArticleCode>{" "}
          e <ArticleCode>ExecuteDelete</ArticleCode>.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Cenários em que o <TermLink href={DAPPER_URL}>Dapper</TermLink> costuma
        ganhar:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Dashboard ou relatório com join, agregação e janela que o LINQ
          deixaria ilegível.
        </ArticleLi>
        <ArticleLi>
          Consulta de projeção para um DTO pequeno, sem necessidade de entidade
          rastreada.
        </ArticleLi>
        <ArticleLi>
          Banco legado com procedures, views e SQL que já funciona e não deve
          ser reescrito.
        </ArticleLi>
        <ArticleLi>
          Trecho de leitura muito chamado, com plano de execução conhecido e
          necessidade de controlar cada detalhe.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>7. Os dois no mesmo projeto</ArticleH2>

      <ArticleP>
        Usar{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> para escrita e{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> para leitura é um padrão
        comum. O{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> cuida do
        domínio e das transações, e o{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> atende consultas de
        projeção sem arrastar o modelo inteiro.
      </ArticleP>

      <ArticleP>
        O ponto de atenção é a transação. Se as duas ferramentas participam da
        mesma operação, elas precisam usar a mesma conexão e a mesma transação.
        Um exemplo com{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> abrindo a
        transação e o{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> lendo dentro dela:
      </ArticleP>

      <ArticleCode block language="csharp">
        {`await using var transaction = await db.Database.BeginTransactionAsync();
var connection = db.Database.GetDbConnection();
var dbTransaction = transaction.GetDbTransaction();

var total = await connection.QuerySingleAsync<decimal>(
    "SELECT SUM(total) FROM orders WHERE customer_id = @CustomerId",
    new { CustomerId = customerId },
    dbTransaction);

await db.SaveChangesAsync();
await transaction.CommitAsync();`}
      </ArticleCode>

      <ArticleP>
        O <ArticleCode>GetDbConnection</ArticleCode> devolve a conexão que o
        contexto já abriu. O <ArticleCode>GetDbTransaction</ArticleCode>{" "}
        entrega a transação para o comando do{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink>. Sem esse vínculo, o
        comando roda fora da transação e pode ler um estado que o{" "}
        <ArticleCode>SaveChanges</ArticleCode> ainda não confirmou.
      </ArticleP>

      <ArticleP>
        O custo do híbrido é manter dois estilos de acesso e duas formas de
        mapear o mesmo dado. Vale quando a leitura tem requisito próprio. Se o
        desenho inteiro vira SQL manual, talvez o{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> esteja sobrando.
        Se o desenho inteiro vira entidade rastreada para tudo, talvez o{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> esteja faltando.
      </ArticleP>

      <ArticleH2>8. Outros ORMs e micro-ORMs do .NET</ArticleH2>

      <ArticleP>
        O ecossistema vai além da dupla mais famosa. A tabela abaixo é um mapa
        de leitura, não um ranking. Cada ferramenta tem um encaixe diferente:
      </ArticleP>

      <ArticleTable caption="Ferramentas de acesso a dados no ecossistema .NET">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Ferramenta</ArticleTh>
            <ArticleTh>Tipo</ArticleTh>
            <ArticleTh>Ponto forte</ArticleTh>
            <ArticleTh>Custo</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={EF_URL}>Entity Framework Core</TermLink>
            </ArticleTd>
            <ArticleTd>ORM completo</ArticleTd>
            <ArticleTd>LINQ, tracking, migrations e relacionamentos</ArticleTd>
            <ArticleTd>Abstração e SQL gerado</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={DAPPER_URL}>Dapper</TermLink>
            </ArticleTd>
            <ArticleTd>Micro-ORM</ArticleTd>
            <ArticleTd>SQL explícito e mapeamento leve</ArticleTd>
            <ArticleTd>SQL e mapeamento manuais</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={DAPPER_CONTRIB_URL}>Dapper.Contrib</TermLink>
            </ArticleTd>
            <ArticleTd>Extensão do Dapper</ArticleTd>
            <ArticleTd>CRUD simples sem escrever todo o SQL</ArticleTd>
            <ArticleTd>Menos controle e recursos limitados</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={REPODB_URL}>RepoDB</TermLink>
            </ArticleTd>
            <ArticleTd>Micro-ORM com recursos</ArticleTd>
            <ArticleTd>CRUD, lote, cache e consultas fluentes</ArticleTd>
            <ArticleTd>Ecossistema menor que EF e Dapper</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={PETAPOCO_URL}>PetaPoco</TermLink>
            </ArticleTd>
            <ArticleTd>Micro-ORM</ArticleTd>
            <ArticleTd>Simplicidade e CRUD direto</ArticleTd>
            <ArticleTd>Comunidade menor e menos recursos modernos</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={ORMLITE_URL}>ServiceStack.OrmLite</TermLink>
            </ArticleTd>
            <ArticleTd>ORM leve</ArticleTd>
            <ArticleTd>API tipada com SQL próximo do banco</ArticleTd>
            <ArticleTd>Acoplamento ao ecossistema ServiceStack</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={LINQTODB_URL}>LINQ to DB</TermLink>
            </ArticleTd>
            <ArticleTd>ORM leve com LINQ</ArticleTd>
            <ArticleTd>LINQ sobre SQL com foco em performance e cópia em lote</ArticleTd>
            <ArticleTd>Curva de aprendizado e menos recursos de ORM completo</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={NHIBERNATE_URL}>NHibernate</TermLink>
            </ArticleTd>
            <ArticleTd>ORM completo</ArticleTd>
            <ArticleTd>Maturidade, mapeamento rico e cache de segundo nível</ArticleTd>
            <ArticleTd>Complexidade e configuração mais verbosa</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={MARTEN_URL}>Marten</TermLink>
            </ArticleTd>
            <ArticleTd>Banco de documentos</ArticleTd>
            <ArticleTd>Documentos JSON e eventos sobre PostgreSQL</ArticleTd>
            <ArticleTd>Específico de PostgreSQL e de modelo orientado a documentos</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Para ler a tabela sem decorar nomes, agrupe as ferramentas por papel:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>Micro-ORMs de mapeamento:</strong>{" "}
          <TermLink href={DAPPER_URL}>Dapper</TermLink> e{" "}
          <TermLink href={PETAPOCO_URL}>PetaPoco</TermLink> executam SQL e
          mapeiam o resultado. Você controla a consulta e abre mão de tracking e
          migrations.
        </ArticleLi>
        <ArticleLi>
          <strong>Micro-ORMs com CRUD embutido:</strong>{" "}
          <TermLink href={DAPPER_CONTRIB_URL}>Dapper.Contrib</TermLink> e{" "}
          <TermLink href={REPODB_URL}>RepoDB</TermLink> reduzem o SQL manual em
          operações simples, mas continuam sem o modelo completo de um ORM.
        </ArticleLi>
        <ArticleLi>
          <strong>ORMs leves com LINQ:</strong>{" "}
          <TermLink href={LINQTODB_URL}>LINQ to DB</TermLink> e{" "}
          <TermLink href={ORMLITE_URL}>ServiceStack.OrmLite</TermLink> ficam no
          meio do caminho: dão consultas tipadas e parte da produtividade sem o
          peso de um ORM completo.
        </ArticleLi>
        <ArticleLi>
          <strong>ORMs completos:</strong>{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> e{" "}
          <TermLink href={NHIBERNATE_URL}>NHibernate</TermLink> cobrem
          relacionamentos, tracking, transações e mapeamento rico. O custo é a
          curva de aprendizado e a abstração.
        </ArticleLi>
        <ArticleLi>
          <strong>Banco de documentos:</strong>{" "}
          <TermLink href={MARTEN_URL}>Marten</TermLink> troca o modelo
          relacional por documentos JSON sobre PostgreSQL. Faz sentido quando o
          dado já nasce como documento.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        A escolha entre esses nomes costuma seguir três perguntas: o domínio é
        relacional ou orientado a documentos? O time precisa de migrations e
        tracking? O SQL precisa ser controlado à mão? As respostas eliminam
        opções mais rápido que qualquer benchmark genérico.
      </ArticleP>

      <ArticleH2>9. Performance sem mito</ArticleH2>

      <ArticleP>
        É comum ouvir que{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> é “mais rápido que{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink>”. A frase é
        parcial. Em uma consulta que busca uma linha por chave primária, a
        diferença de mapeamento pode aparecer. Em uma consulta que varre milhões
        de linhas, o tempo de rede e de banco domina, e o mapeamento vira
        detalhe.
      </ArticleP>

      <ArticleP>
        Um exemplo ajuda a calibrar a expectativa. Se a consulta passa 40 ms no
        banco e 2 ms no mapeamento, trocar o mapeamento economiza no máximo 2
        ms. Se o mapeamento custa 20 ms e o banco responde em 5 ms, a troca
        aparece. O número que importa é o tempo total da operação e a alocação
        de memória, não a biblioteca isolada.
      </ArticleP>

      <ArticleP>
        Meça com{" "}
        <TermLink href={BENCHMARK_URL}>BenchmarkDotNet</TermLink>, contra um
        banco real, com dados parecidos com produção. Compare consultas
        equivalentes e registre:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          latência média e cauda, não só a média, porque picos de latência somem
          em uma média isolada.
        </ArticleLi>
        <ArticleLi>
          alocações e pressão no garbage collector, que pesam em serviços com
          muitas requisições.
        </ArticleLi>
        <ArticleLi>
          SQL gerado pelo{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> e plano de
          execução dos dois lados.
        </ArticleLi>
        <ArticleLi>
          cenário frio e quente, porque cache de plano e de dados muda o
          resultado.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Antes de trocar de ferramenta, otimize o{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> com{" "}
        <ArticleCode>AsNoTracking</ArticleCode>, projeção, consultas compiladas
        e paginação. Do lado do{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink>, revise índices, evite{" "}
        <ArticleCode>SELECT *</ArticleCode> e use parâmetros. Muitas vezes a
        diferença entre as duas some depois desse trabalho.
      </ArticleP>

      <ArticleH2>10. Erros comuns</ArticleH2>

      <ArticleUl>
        <ArticleLi>
          <strong>Concluir que micro-ORM é sempre melhor.</strong> Em CRUD com
          muitos relacionamentos, o{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> entrega
          menos código e menos erro de mapeamento.
        </ArticleLi>
        <ArticleLi>
          <strong>Concatenar SQL com entrada do usuário.</strong> Um filtro
          montado com string permite{" "}
          <TermLink href={SQL_INJECTION_URL}>SQL injection</TermLink>. Use
          parâmetros em todas as consultas do{" "}
          <TermLink href={DAPPER_URL}>Dapper</TermLink>.
        </ArticleLi>
        <ArticleLi>
          <strong>Misturar transações sem compartilhar conexão.</strong> O
          comando do{" "}
          <TermLink href={DAPPER_URL}>Dapper</TermLink> precisa receber a
          transação do{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink>.
        </ArticleLi>
        <ArticleLi>
          <strong>Depender da ordem das colunas.</strong> Prefira aliases
          explícitos e projeções com nomes estáveis.{" "}
          <ArticleCode>SELECT *</ArticleCode> quebra quando o schema muda.
        </ArticleLi>
        <ArticleLi>
          <strong>Esquecer o tracking em leitura grande.</strong> No{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink>,{" "}
          <ArticleCode>AsNoTracking</ArticleCode> e projeção resolvem boa parte
          do custo.
        </ArticleLi>
        <ArticleLi>
          <strong>Reescrever o ORM inteiro por causa de uma consulta.</strong> O
          uso híbrido costuma resolver o ponto quente sem trocar o modelo de
          escrita.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        O erro comum não é escolher a ferramenta “errada”. É escolher sem medir
        e sem saber qual operação domina o custo. Uma consulta de relatório e um
        cadastro de cliente têm requisitos diferentes, e o desenho deve refletir
        essa diferença.
      </ArticleP>

      <ArticleH3>Pontos-chave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <TermLink href={DAPPER_URL}>Dapper</TermLink> é micro-ORM de
          mapeamento: você escreve o SQL e recebe objetos.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> é ORM
          completo: LINQ, tracking, relacionamentos e migrations.
        </ArticleLi>
        <ArticleLi>
          Use{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> para escrita
          transacional, domínio relacional e produtividade.
        </ArticleLi>
        <ArticleLi>
          Use <TermLink href={DAPPER_URL}>Dapper</TermLink> para leitura
          complexa, relatórios, read models e SQL específico de banco.
        </ArticleLi>
        <ArticleLi>
          O híbrido é válido quando cada ferramenta cobre um tipo de operação,
          com conexão e transação compartilhadas.
        </ArticleLi>
        <ArticleLi>
          Performance depende de índice, plano e volume. Meça com{" "}
          <TermLink href={BENCHMARK_URL}>BenchmarkDotNet</TermLink> antes de
          trocar a biblioteca.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={REPODB_URL}>RepoDB</TermLink>,{" "}
          <TermLink href={LINQTODB_URL}>LINQ to DB</TermLink>,{" "}
          <TermLink href={NHIBERNATE_URL}>NHibernate</TermLink> e{" "}
          <TermLink href={MARTEN_URL}>Marten</TermLink> cobrem cenários que não
          cabem na dupla principal.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusão</ArticleH3>

      <ArticleP>
        A pergunta útil não é qual ORM é melhor. É qual ferramenta reduz o custo
        total da feature sem esconder o que o banco está fazendo. O{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> ganha quando a
        produtividade e o domínio pesam mais. O{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> ganha quando o SQL e o
        formato da leitura precisam ser explícitos.
      </ArticleP>

      <ArticleP>
        Os dois convivem bem quando o limite é claro. O importante é medir a
        consulta real, manter parâmetros, versionar o schema e revisar o plano
        de execução. A ferramenta é meio. O requisito e o dado mandam.
      </ArticleP>
    </>
  );
}
