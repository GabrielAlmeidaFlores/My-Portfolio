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
    Linq["LINQ"] --> Expr["Arbol de expresion"]
    Expr --> SqlGen["SQL generado"]
    SqlGen --> Track["Materializa y rastrea"]
  end
  subgraph Dapper["Dapper"]
    Sql["SQL manual"] --> Param["Comando parametrizado"]
    Param --> Map["Mapea filas a objetos"]
  end`;

const DECISION_CHART = `flowchart TB
  Start(["Nueva feature"]) --> Domain{"¿CRUD con relaciones?"}
  Domain -->|"Sí"| EF["EF Core"]
  Domain -->|"No"| Read{"¿Lectura compleja o ruta caliente?"}
  Read -->|"Sí"| Micro["Dapper o linq2db"]
  Read -->|"No"| Legacy{"¿Base y SQL ya maduros?"}
  Legacy -->|"Sí"| Micro
  Legacy -->|"No"| EF
  EF --> Special{"¿SQL específico?"}
  Special -->|"Sí"| Hybrid(["EF para escritura y Dapper para lectura"])`;

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

export function DapperEntityFrameworkOrmsDotnetContentEs() {
  return (
    <>
      <ArticleH2>1. El problema antes de la elección</ArticleH2>

      <ArticleP>
        Un equipo .NET empieza con{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> porque
        resuelve lo básico con poco código: entidad,{" "}
        <ArticleCode>DbContext</ArticleCode>, consulta LINQ y listo. Meses
        después aparece una pantalla de reporte que une cinco tablas, agrupa por
        período y necesita responder en milisegundos.
      </ArticleP>

      <ArticleP>
        La consulta generada por{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> se vuelve
        extraña, el plan de la base cambia y la lectura empieza a cargar
        columnas que la pantalla no usa. Alguien sugiere{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink>. El cambio parece simple,
        pero el equipo necesita saber qué gana y qué pierde.
      </ArticleP>

      <ArticleP>
        Este post compara{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> y{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> con código
        real, muestra dónde encaja cada uno y recorre otros ORMs del ecosistema
        .NET. La idea central es simple: la herramienta sigue la forma del
        problema, no al revés.
      </ArticleP>

      <ArticleCallout variant="note" title="Lo que vas a encontrar">
        <ArticleP>
          La comparación empieza por el papel de cada biblioteca. Después vienen
          los ejemplos, la tabla de tradeoffs, el diagrama de decisión, el uso
          de ambos en el mismo proyecto y un mapa de alternativas como{" "}
          <TermLink href={REPODB_URL}>RepoDB</TermLink>,{" "}
          <TermLink href={LINQTODB_URL}>LINQ to DB</TermLink> y{" "}
          <TermLink href={NHIBERNATE_URL}>NHibernate</TermLink>.
        </ArticleP>
      </ArticleCallout>

      <ArticleCallout variant="note" title="Sobre los ejemplos">
        <ArticleP>
          Los ejemplos usan tipos y variables de dominio como{" "}
          <ArticleCode>Order</ArticleCode>, <ArticleCode>OrderInput</ArticleCode>,{" "}
          <ArticleCode>OrderItem</ArticleCode>, <ArticleCode>Receipt</ArticleCode>{" "}
          y <ArticleCode>customerId</ArticleCode>. Representan el dominio de
          pedido y fueron omitidos para que el foco quede en la comparación entre
          herramientas. El código muestra la forma de la solución, no un proyecto
          completo.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>Conceptos que aparecen en el post</ArticleH3>

      <ArticleP>
        Antes de comparar, conviene fijar el vocabulario. Cada término de abajo
        aparece en los ejemplos y en las tablas:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>ORM:</strong> biblioteca que transforma tablas en clases y
          rastrea el estado de los objetos. Ejemplo: al cargar un pedido y
          cambiar el campo <ArticleCode>Status</ArticleCode>,{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> sabe que debe
          generar un <ArticleCode>UPDATE</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <strong>Micro-ORM:</strong> biblioteca que ejecuta SQL y mapea el
          resultado a objetos. Ejemplo:{" "}
          <TermLink href={DAPPER_URL}>Dapper</TermLink> recibe la consulta lista
          y devuelve una lista de <ArticleCode>OrderSummary</ArticleCode>, sin
          saber si el objeto cambió después.
        </ArticleLi>
        <ArticleLi>
          <strong>Mapeo:</strong> unir cada columna del resultado a una
          propiedad de la clase. Ejemplo: la columna{" "}
          <ArticleCode>created_at</ArticleCode> se convierte en la propiedad{" "}
          <ArticleCode>CreatedAt</ArticleCode> mediante un alias en el SQL.
        </ArticleLi>
        <ArticleLi>
          <strong>Change tracking:</strong> el ORM guarda una copia del estado
          original de la entidad para descubrir qué cambió. Ejemplo: si el
          precio era 10 y pasó a 12, <ArticleCode>SaveChanges</ArticleCode>{" "}
          genera un <ArticleCode>UPDATE</ArticleCode> solo de lo que cambió.
        </ArticleLi>
        <ArticleLi>
          <strong>Migración:</strong> archivo versionado que altera el esquema
          de la base. Ejemplo: agregar la columna{" "}
          <ArticleCode>coupon_id</ArticleCode> en <ArticleCode>orders</ArticleCode>{" "}
          con un script que sube y baja.
        </ArticleLi>
        <ArticleLi>
          <strong>Read model o DTO:</strong> clase o record pequeño con solo las
          columnas que una pantalla necesita. Ejemplo:{" "}
          <ArticleCode>OrderSummary</ArticleCode> con id, fecha, total y nombre
          del cliente, sin cargar los ítems del pedido.
        </ArticleLi>
        <ArticleLi>
          <strong>N más 1:</strong> una consulta para buscar la lista y una
          consulta más por cada ítem de la lista. Ejemplo: 500 pedidos generan
          501 consultas cuando el código accede a los ítems dentro de un bucle.
        </ArticleLi>
        <ArticleLi>
          <strong>Ruta caliente:</strong> tramo llamado muchas veces por
          segundo. Ejemplo: la consulta que arma la pantalla inicial de un
          e-commerce y corre en cada visita.
        </ArticleLi>
        <ArticleLi>
          <strong>Transacción:</strong> bloque de operaciones que confirma todo
          o deshace todo. Ejemplo: debitar una cuenta, acreditar otra y guardar
          el comprobante deben ocurrir juntos.
        </ArticleLi>
        <ArticleLi>
          <strong>SQL injection:</strong> entrada del usuario interpretada como
          comando SQL. Ejemplo: un filtro armado con{" "}
          <ArticleCode>"' OR 1=1"</ArticleCode> puede devolver la tabla completa.
        </ArticleLi>
        <ArticleLi>
          <strong>Pool de conexiones:</strong> reservorio de conexiones abiertas
          reutilizadas entre peticiones. Ejemplo: abrir una conexión física en
          cada request cuesta tiempo; el pool devuelve una conexión lista.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>2. ORM, micro-ORM y qué hace Dapper</ArticleH2>

      <ArticleP>
        Un <strong>ORM completo</strong> mapea tablas a clases, rastrea cambios,
        genera SQL a partir de expresiones y se ocupa de relaciones, migraciones
        y concurrencia.{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> es ese tipo de
        herramienta.
      </ArticleP>

      <ArticleP>
        Un <strong>micro-ORM</strong> hace menos.{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> recibe el SQL que
        escribiste, agrega parámetros, lo ejecuta por la conexión{" "}
        <TermLink href={ADO_URL}>ADO.NET</TermLink> y mapea cada fila a un
        objeto. No existe change tracking, migración ni traductor de LINQ a SQL
        incorporado.
      </ArticleP>

      <ArticleP>
        La diferencia de flujo queda clara en el diagrama:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Flujo de EF Core con LINQ, árbol de expresión, SQL generado y tracking; flujo de Dapper con SQL manual, comando parametrizado y mapeo de filas"
        chart={PIPELINE_CHART}
      />

      <ArticleP>
        En{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink>, la consulta
        nace en{" "}
        <TermLink href={LINQ_URL}>LINQ</TermLink> y se convierte en un árbol de
        expresión. El provider traduce ese árbol a SQL, lo ejecuta y materializa
        entidades que entran en el{" "}
        <TermLink href={TRACKING_URL}>change tracker</TermLink>.
      </ArticleP>

      <ArticleP>
        En <TermLink href={DAPPER_URL}>Dapper</TermLink>, el SQL es tuyo. La
        biblioteca arma el comando con parámetros, lee el resultado y completa
        las propiedades. El camino es corto y predecible, y la responsabilidad
        del SQL queda en el equipo.
      </ArticleP>

      <ArticleH3>Qué pasa en una llamada de Entity Framework Core</ArticleH3>

      <ArticleP>
        Vale la pena seguir el camino completo, porque allí aparecen los
        costos. Cuando el código ejecuta <ArticleCode>ToListAsync</ArticleCode>:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          C# arma un árbol de expresión con la consulta. Todavía no se envió
          nada a la base.
        </ArticleLi>
        <ArticleLi>
          El provider de{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> traduce ese
          árbol a SQL, con parámetros para los valores.
        </ArticleLi>
        <ArticleLi>
          La conexión envía el comando y la base devuelve las filas.
        </ArticleLi>
        <ArticleLi>
          El materializador crea los objetos <ArticleCode>Order</ArticleCode> y
          completa sus propiedades.
        </ArticleLi>
        <ArticleLi>
          El{" "}
          <TermLink href={TRACKING_URL}>change tracker</TermLink> guarda una
          copia del estado original de cada entidad.
        </ArticleLi>
        <ArticleLi>
          En <ArticleCode>SaveChanges</ArticleCode>, EF compara el estado actual
          con la copia y genera <ArticleCode>UPDATE</ArticleCode>,{" "}
          <ArticleCode>INSERT</ArticleCode> o <ArticleCode>DELETE</ArticleCode>.
        </ArticleLi>
      </ArticleOl>

      <ArticleH3>Qué pasa en una llamada de Dapper</ArticleH3>

      <ArticleP>
        El camino de <TermLink href={DAPPER_URL}>Dapper</TermLink> es más corto,
        porque no existe traducción de LINQ ni rastreo. Cuando el código ejecuta{" "}
        <ArticleCode>QueryAsync</ArticleCode>:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>
          La conexión se abre o se reutiliza del{" "}
          <strong>pool de conexiones</strong>.
        </ArticleLi>
        <ArticleLi>
          El SQL y el objeto de parámetros se convierten en un comando{" "}
          <TermLink href={ADO_URL}>ADO.NET</TermLink>.
        </ArticleLi>
        <ArticleLi>
          La base ejecuta el comando y devuelve un lector de resultados.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={DAPPER_URL}>Dapper</TermLink> lee una fila por vez y
          crea el objeto del tipo informado.
        </ArticleLi>
        <ArticleLi>
          Cada columna se une a la propiedad con el mismo nombre, o al parámetro
          del constructor en el caso de un record.
        </ArticleLi>
        <ArticleLi>
          Al final, la conexión vuelve al pool. Ningún objeto queda rastreado.
        </ArticleLi>
      </ArticleOl>

      <ArticleH2>3. Entity Framework Core: productividad con convenciones</ArticleH2>

      <ArticleP>
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> brilla cuando
        el dominio tiene entidades relacionadas, reglas de negocio y operaciones
        de escritura que necesitan transacción. Para seguir el ejemplo, empieza
        por el modelo: un pedido tiene varios ítems, y{" "}
        <ArticleCode>DbContext</ArticleCode> declara esa relación.
      </ArticleP>

      <ArticleP>
        <strong>Primero, el modelo y el mapeo:</strong>
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
        <ArticleCode>OnModelCreating</ArticleCode> configura la relación: un
        pedido tiene muchos ítems, y cada ítem apunta al pedido por{" "}
        <ArticleCode>OrderId</ArticleCode>. Ese mapeo es lo que permite que{" "}
        <ArticleCode>Include</ArticleCode> cargue los ítems junto con el pedido.
      </ArticleP>

      <ArticleP>
        <strong>Ahora la consulta:</strong>
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
        <ArticleCode>DbContext</ArticleCode> representa la sesión con la base.{" "}
        <ArticleCode>DbSet</ArticleCode> da acceso a las tablas. La consulta en{" "}
        <TermLink href={LINQ_URL}>LINQ</TermLink> se traduce a SQL, y el{" "}
        <TermLink href={TRACKING_URL}>change tracker</TermLink> guarda el estado
        de las entidades cargadas para calcular el{" "}
        <ArticleCode>UPDATE</ArticleCode> en <ArticleCode>SaveChanges</ArticleCode>.
      </ArticleP>

      <ArticleH3>Leyendo la consulta de EF Core línea por línea</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>using Microsoft.EntityFrameworkCore</ArticleCode> trae el
          método <ArticleCode>ToListAsync</ArticleCode> y los recursos de
          consulta asíncrona.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>using var db</ArticleCode> crea el contexto y garantiza
          que se descarte al final del alcance, devolviendo la conexión.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>db.Orders</ArticleCode> es el{" "}
          <ArticleCode>DbSet</ArticleCode> que representa la tabla de pedidos.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>.Where(...)</ArticleCode> agrega la condición que se
          convierte en la cláusula <ArticleCode>WHERE</ArticleCode> del SQL.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>.Include(...)</ArticleCode> pide a EF que cargue los
          ítems en la misma consulta, generando un join.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>.OrderByDescending(...)</ArticleCode> se convierte en la
          cláusula <ArticleCode>ORDER BY</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>.ToListAsync()</ArticleCode> ejecuta la consulta, lee el
          resultado y materializa la lista de objetos rastreados.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Lo que EF Core entrega gratis</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Consultas tipadas en LINQ con verificación de compilación para nombres
          de propiedades y relaciones.
        </ArticleLi>
        <ArticleLi>
          Relaciones, claves foráneas, carga explícita y proyecciones a clases o
          records.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={MIGRATIONS_URL}>Migraciones</TermLink> para versionar
          el esquema junto con el código, con historial y rollback.
        </ArticleLi>
        <ArticleLi>
          Control de concurrencia, transacciones y operaciones en lote con{" "}
          <ArticleCode>ExecuteUpdate</ArticleCode> y{" "}
          <ArticleCode>ExecuteDelete</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          SQL crudo cuando hace falta mediante{" "}
          <TermLink href={EF_RAW_SQL_URL}>
            <ArticleCode>FromSql</ArticleCode> y{" "}
            <ArticleCode>ExecuteSql</ArticleCode>
          </TermLink>
          , sin abandonar el contexto.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Dónde EF Core cobra el precio</ArticleH3>

      <ArticleP>
        La abstracción se filtra cuando la consulta sale del patrón. Una cadena
        larga de <ArticleCode>Include</ArticleCode>, un{" "}
        <ArticleCode>GroupBy</ArticleCode> complejo o una ventana analítica
        pueden generar SQL peor que el escrito a mano. El equipo necesita leer
        el SQL generado y medir.
      </ArticleP>

      <ArticleP>
        El{" "}
        <TermLink href={TRACKING_URL}>change tracker</TermLink> tiene costo de
        memoria y CPU. En una lectura de 50 mil filas que nadie va a modificar,
        rastrear cada entidad es desperdicio. Lo mismo vale para cargar la
        entidad completa cuando la pantalla usa tres columnas.
      </ArticleP>

      <ArticleP>
        El problema clásico es{" "}
        <TermLink href={NPLUS1_URL}>N más 1</TermLink>. Con lazy loading
        habilitado, este bucle dispara una consulta por pedido:
      </ArticleP>

      <ArticleCode block language="csharp">
        {`var orders = await db.Orders.ToListAsync();

foreach (var order in orders)
{
    Console.WriteLine(order.Items.Count);
}`}
      </ArticleCode>

      <ArticleP>
        Si la lista tiene 500 pedidos, la base recibe 501 consultas. El bucle
        parece inofensivo y el costo aparece solo en producción. La corrección
        es cargar lo que la pantalla necesita en una consulta, con proyección y
        sin tracking:
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
        <ArticleCode>AsNoTracking</ArticleCode> elimina el costo de rastreo en
        lecturas. La proyección evita columnas innecesarias. La consulta sigue
        en LINQ y el provider genera el SQL con join.
      </ArticleP>

      <ArticleH2>4. Dapper: SQL explícito y mapeo directo</ArticleH2>

      <ArticleP>
        <TermLink href={DAPPER_URL}>Dapper</TermLink> es una extensión sobre{" "}
        <TermLink href={ADO_URL}>ADO.NET</TermLink>. Abres la conexión, pasas el
        SQL y el objeto de parámetros, y recibes el resultado mapeado. El
        ejemplo de abajo usa <TermLink href={NPGSQL_URL}>Npgsql</TermLink> con
        PostgreSQL. Primero, el read model que representa el resultado:
      </ArticleP>

      <ArticleCode block language="csharp">
        {`public sealed record OrderSummary(
    Guid Id,
    DateTime CreatedAt,
    decimal Total,
    string CustomerName);`}
      </ArticleCode>

      <ArticleP>
        El record es un contrato simple: cada propiedad corresponde a una
        columna que la consulta devuelve. No es una entidad rastreada y no
        necesita representar la tabla completa.
      </ArticleP>

      <ArticleP>
        <strong>Después, la consulta con parámetros:</strong>
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
        El parámetro <ArticleCode>@CustomerId</ArticleCode> se envía como
        parámetro de base, no concatenado en la cadena. El mapeo une cada
        columna del resultado a la propiedad del record con el mismo nombre.
      </ArticleP>

      <ArticleH3>Leyendo la consulta de Dapper línea por línea</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>using Dapper</ArticleCode> trae métodos de extensión como{" "}
          <ArticleCode>QueryAsync</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>NpgsqlConnection</ArticleCode> representa la conexión con
          PostgreSQL. <ArticleCode>using</ArticleCode> devuelve la conexión al
          pool al final del alcance.
        </ArticleLi>
        <ArticleLi>
          El SQL usa alias como <ArticleCode>o.id AS Id</ArticleCode> para que
          la columna tenga exactamente el nombre de la propiedad del record.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>@CustomerId</ArticleCode> es un parámetro de base. El
          valor no entra en la cadena, lo que evita{" "}
          <TermLink href={SQL_INJECTION_URL}>SQL injection</TermLink>.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>{"new { CustomerId = customerId }"}</ArticleCode> es el
          objeto anónimo que entrega el valor del parámetro.
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>QueryAsync&lt;OrderSummary&gt;</ArticleCode> ejecuta el
          comando y devuelve una tarea con la secuencia de objetos mapeados.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Para traer pedido e ítems en una sola ida a la base,{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> ofrece{" "}
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
        La base recibe el SQL como un comando con dos resultados. La biblioteca
        divide el resultado y mapea cada parte al tipo correcto. No existe join
        automático ni identidad de objeto: el equipo controla la consulta y la
        forma del resultado.
      </ArticleP>

      <ArticleH3>Por qué tanta gente aprecia Dapper</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Control total del SQL, incluidos hints (instrucciones para el
          optimizador), CTEs (expresiones de tabla comunes), funciones de
          ventana como ranking y suma acumulada, procedimientos y recursos
          específicos de la base.
        </ArticleLi>
        <ArticleLi>
          Poca magia: el comando que corre en la base es el comando que está en
          el código, lo que facilita revisar plan e índice.
        </ArticleLi>
        <ArticleLi>
          Costo bajo de mapeo en lecturas simples, con pocas asignaciones en
          comparación con materializar entidades rastreadas.
        </ArticleLi>
        <ArticleLi>
          Adopción incremental en una base existente, sin reescribir todo el
          modelo para empezar a usarlo.
        </ArticleLi>
        <ArticleLi>
          Funciona bien con read models (clases simples que representan el
          resultado de una lectura), reportes, dashboards y consultas de
          proyección que no necesitan entidad de dominio.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>5. Ventajas y desventajas lado a lado</ArticleH2>

      <ArticleP>
        Las dos herramientas resuelven acceso a datos, pero optimizan cosas
        distintas. La tabla resume el tradeoff antes de los detalles:
      </ArticleP>

      <ArticleTable caption="EF Core y Dapper: qué optimiza cada uno">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Criterio</ArticleTh>
            <ArticleTh>Entity Framework Core</ArticleTh>
            <ArticleTh>Dapper</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Modelo</ArticleTd>
            <ArticleTd>ORM completo con estado de objetos y tracking</ArticleTd>
            <ArticleTd>Micro-ORM de mapeo</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>SQL</ArticleTd>
            <ArticleTd>Generado desde LINQ, con SQL crudo opcional</ArticleTd>
            <ArticleTd>Escrito por el equipo</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Migraciones</ArticleTd>
            <ArticleTd>Nativas</ArticleTd>
            <ArticleTd>No incluye, usa otra herramienta</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Change tracking</ArticleTd>
            <ArticleTd>Sí, con costo en lecturas grandes</ArticleTd>
            <ArticleTd>No</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Relaciones</ArticleTd>
            <ArticleTd>Mapeadas y cargadas por el contexto</ArticleTd>
            <ArticleTd>Resueltas en la consulta o en código</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Mejor uso</ArticleTd>
            <ArticleTd>CRUD, dominio relacional, escritura transaccional</ArticleTd>
            <ArticleTd>Lectura, reporte, SQL específico, ruta caliente</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Costo principal</ArticleTd>
            <ArticleTd>Abstracción y SQL generado no siempre ideal</ArticleTd>
            <ArticleTd>SQL manual y mantenimiento del mapeo</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Cada fila de la tabla responde a una pregunta distinta. Modelo indica el
        nivel de abstracción. SQL indica quién escribe la consulta. Migraciones
        indica si la herramienta versiona el esquema. Change tracking indica si
        el ORM sigue los cambios. La lectura útil es combinar esas respuestas
        con el tipo de feature, no elegir una columna aislada.
      </ArticleP>

      <ArticleH3>Desventajas de Dapper</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          El SQL queda bajo responsabilidad del equipo. Renombrar una columna o
          cambiar el esquema exige buscar cadenas en todo el proyecto.
        </ArticleLi>
        <ArticleLi>
          No hay migraciones. Versionar la base sigue siendo tarea de otra
          herramienta, como un script, Flyway o DbUp.
        </ArticleLi>
        <ArticleLi>
          El mapeo es manual. Una columna con nombre distinto al de la propiedad
          exige alias, configuración de tipo o un DTO actualizado.
        </ArticleLi>
        <ArticleLi>
          Sin change tracking y sin unidad de trabajo. Guardar varias entidades
          exige transacción explícita y comandos propios.
        </ArticleLi>
        <ArticleLi>
          El SQL concatenado abre espacio a{" "}
          <TermLink href={SQL_INJECTION_URL}>SQL injection</TermLink>. Usa
          parámetros siempre, incluso en filtros opcionales y cláusulas{" "}
          <ArticleCode>IN</ArticleCode>.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Desventajas de Entity Framework Core</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          El SQL generado puede sorprender en consultas complejas. Sin leer el
          log y medir, el equipo optimiza en el lugar equivocado.
        </ArticleLi>
        <ArticleLi>
          El tracking y la carga de entidades completas aumentan memoria y
          tiempo en lecturas grandes.
        </ArticleLi>
        <ArticleLi>
          El N más 1 aparece con facilidad en navegación perezosa o en bucles
          que acceden a relaciones.
        </ArticleLi>
        <ArticleLi>
          Las migraciones en equipos grandes exigen disciplina de revisión y
          orden de deploy.
        </ArticleLi>
        <ArticleLi>
          Las consultas muy específicas de la base a veces son más claras en SQL
          crudo que en LINQ.
        </ArticleLi>
      </ArticleUl>

      <ArticleCallout variant="warning" title="Un micro-ORM no corrige SQL malo">
        <ArticleP>
          Cambiar{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> por{" "}
          <TermLink href={DAPPER_URL}>Dapper</TermLink> no mejora una consulta
          sin índice, con <ArticleCode>SELECT *</ArticleCode> o con un filtro
          que impide que la base use la clave. La ganancia viene de controlar el
          SQL y el mapeo, no de cambiar el logo de la biblioteca.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>6. Cuándo usar cada uno</ArticleH2>

      <ArticleP>
        La decisión empieza por la forma del problema, no por el gusto por el
        SQL. Si la feature es CRUD con relaciones y reglas de escritura,{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> tiende a
        entregar más rápido. Si la feature es lectura compleja, reporte o un
        camino caliente que necesita SQL a medida,{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> tiende a encajar mejor.
      </ArticleP>

      <ArticleP>
        El flujo resume la primera decisión:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Decisión entre EF Core, Dapper y uso híbrido según relaciones, lectura compleja, madurez de la base y necesidad de SQL específico"
        chart={DECISION_CHART}
      />

      <ArticleCallout variant="tip" title="Regla práctica">
        <ArticleP>
          Si la operación principal es escritura con relaciones, empieza con{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink>. Si la
          operación principal es lectura compleja, empieza con{" "}
          <TermLink href={DAPPER_URL}>Dapper</TermLink>. Si las dos conviven en
          el mismo flujo, usa el híbrido con conexión y transacción
          compartidas.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Escenarios donde{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> suele ganar:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Alta y edición de entidades con validación, relaciones y transacción
          en el mismo flujo.
        </ArticleLi>
        <ArticleLi>
          Dominio que cambia con frecuencia y necesita migraciones versionadas
          junto con el código.
        </ArticleLi>
        <ArticleLi>
          Equipo que prefiere LINQ y quiere menos SQL manual en el día a día.
        </ArticleLi>
        <ArticleLi>
          Operaciones de escritura en lote con{" "}
          <ArticleCode>ExecuteUpdate</ArticleCode> y{" "}
          <ArticleCode>ExecuteDelete</ArticleCode>.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Escenarios donde <TermLink href={DAPPER_URL}>Dapper</TermLink> suele
        ganar:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Dashboard o reporte con join, agregación y ventana que dejarían LINQ
          ilegible.
        </ArticleLi>
        <ArticleLi>
          Consulta de proyección para un DTO pequeño, sin necesidad de entidad
          rastreada.
        </ArticleLi>
        <ArticleLi>
          Base legada con procedimientos, vistas y SQL que ya funciona y no debe
          reescribirse.
        </ArticleLi>
        <ArticleLi>
          Tramo de lectura muy llamado, con plan de ejecución conocido y
          necesidad de controlar cada detalle.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>7. Los dos en el mismo proyecto</ArticleH2>

      <ArticleP>
        Usar{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> para escritura
        y <TermLink href={DAPPER_URL}>Dapper</TermLink> para lectura es un
        patrón común.{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> se ocupa del
        dominio y de las transacciones, y{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> atiende consultas de
        proyección sin arrastrar el modelo completo.
      </ArticleP>

      <ArticleP>
        El punto de atención es la transacción. Si las dos herramientas
        participan de la misma operación, necesitan usar la misma conexión y la
        misma transacción. Un ejemplo con{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> abriendo la
        transacción y{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> leyendo dentro de ella:
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
        <ArticleCode>GetDbConnection</ArticleCode> devuelve la conexión que el
        contexto ya abrió. <ArticleCode>GetDbTransaction</ArticleCode> entrega
        la transacción al comando de{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink>. Sin ese vínculo, el
        comando corre fuera de la transacción y puede leer un estado que{" "}
        <ArticleCode>SaveChanges</ArticleCode> todavía no confirmó.
      </ArticleP>

      <ArticleP>
        El costo del híbrido es mantener dos estilos de acceso y dos formas de
        mapear el mismo dato. Vale cuando la lectura tiene requisito propio. Si
        todo el diseño se vuelve SQL manual, tal vez{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> esté sobrando.
        Si todo el diseño se vuelve entidad rastreada para todo, tal vez{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> esté faltando.
      </ArticleP>

      <ArticleH2>8. Otros ORMs y micro-ORMs de .NET</ArticleH2>

      <ArticleP>
        El ecosistema va más allá de la pareja más famosa. La tabla de abajo es
        un mapa de lectura, no un ranking. Cada herramienta tiene un encaje
        distinto:
      </ArticleP>

      <ArticleTable caption="Herramientas de acceso a datos en el ecosistema .NET">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Herramienta</ArticleTh>
            <ArticleTh>Tipo</ArticleTh>
            <ArticleTh>Punto fuerte</ArticleTh>
            <ArticleTh>Costo</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={EF_URL}>Entity Framework Core</TermLink>
            </ArticleTd>
            <ArticleTd>ORM completo</ArticleTd>
            <ArticleTd>LINQ, tracking, migraciones y relaciones</ArticleTd>
            <ArticleTd>Abstracción y SQL generado</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={DAPPER_URL}>Dapper</TermLink>
            </ArticleTd>
            <ArticleTd>Micro-ORM</ArticleTd>
            <ArticleTd>SQL explícito y mapeo liviano</ArticleTd>
            <ArticleTd>SQL y mapeo manuales</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={DAPPER_CONTRIB_URL}>Dapper.Contrib</TermLink>
            </ArticleTd>
            <ArticleTd>Extensión de Dapper</ArticleTd>
            <ArticleTd>CRUD simple sin escribir todo el SQL</ArticleTd>
            <ArticleTd>Menos control y recursos limitados</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={REPODB_URL}>RepoDB</TermLink>
            </ArticleTd>
            <ArticleTd>Micro-ORM con recursos</ArticleTd>
            <ArticleTd>CRUD, lote, caché y consultas fluidas</ArticleTd>
            <ArticleTd>Ecosistema menor que EF y Dapper</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={PETAPOCO_URL}>PetaPoco</TermLink>
            </ArticleTd>
            <ArticleTd>Micro-ORM</ArticleTd>
            <ArticleTd>Simplicidad y CRUD directo</ArticleTd>
            <ArticleTd>Comunidad menor y menos recursos modernos</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={ORMLITE_URL}>ServiceStack.OrmLite</TermLink>
            </ArticleTd>
            <ArticleTd>ORM liviano</ArticleTd>
            <ArticleTd>API tipada cercana al SQL</ArticleTd>
            <ArticleTd>Acoplamiento al ecosistema ServiceStack</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={LINQTODB_URL}>LINQ to DB</TermLink>
            </ArticleTd>
            <ArticleTd>ORM liviano con LINQ</ArticleTd>
            <ArticleTd>LINQ sobre SQL con foco en performance y copia masiva</ArticleTd>
            <ArticleTd>Curva de aprendizaje y menos recursos de ORM completo</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={NHIBERNATE_URL}>NHibernate</TermLink>
            </ArticleTd>
            <ArticleTd>ORM completo</ArticleTd>
            <ArticleTd>Madurez, mapeo rico y caché compartida entre sesiones</ArticleTd>
            <ArticleTd>Complejidad y configuración más verbosa</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>
              <TermLink href={MARTEN_URL}>Marten</TermLink>
            </ArticleTd>
            <ArticleTd>Base de documentos</ArticleTd>
            <ArticleTd>Documentos JSON y eventos sobre PostgreSQL</ArticleTd>
            <ArticleTd>Específico de PostgreSQL y de modelo orientado a documentos</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Para leer la tabla sin memorizar nombres, agrupa las herramientas por
        papel:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>Micro-ORMs de mapeo:</strong>{" "}
          <TermLink href={DAPPER_URL}>Dapper</TermLink> y{" "}
          <TermLink href={PETAPOCO_URL}>PetaPoco</TermLink> ejecutan SQL y mapean
          el resultado. Tú controlas la consulta y renuncias a tracking y
          migraciones.
        </ArticleLi>
        <ArticleLi>
          <strong>Micro-ORMs con CRUD incorporado:</strong>{" "}
          <TermLink href={DAPPER_CONTRIB_URL}>Dapper.Contrib</TermLink> y{" "}
          <TermLink href={REPODB_URL}>RepoDB</TermLink> reducen el SQL manual en
          operaciones simples, pero siguen sin el modelo completo de un ORM.
        </ArticleLi>
        <ArticleLi>
          <strong>ORMs livianos con LINQ:</strong>{" "}
          <TermLink href={LINQTODB_URL}>LINQ to DB</TermLink> y{" "}
          <TermLink href={ORMLITE_URL}>ServiceStack.OrmLite</TermLink> quedan en
          el medio: consultas tipadas y parte de la productividad sin el peso de
          un ORM completo.
        </ArticleLi>
        <ArticleLi>
          <strong>ORMs completos:</strong>{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> y{" "}
          <TermLink href={NHIBERNATE_URL}>NHibernate</TermLink> cubren
          relaciones, tracking, transacciones y mapeo rico. El costo es la curva
          de aprendizaje y la abstracción.
        </ArticleLi>
        <ArticleLi>
          <strong>Base de documentos:</strong>{" "}
          <TermLink href={MARTEN_URL}>Marten</TermLink> cambia el modelo
          relacional por documentos JSON sobre PostgreSQL. Tiene sentido cuando
          el dato nace como documento.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        La elección entre estos nombres suele seguir tres preguntas: ¿el dominio
        es relacional u orientado a documentos? ¿El equipo necesita migraciones
        y tracking? ¿El SQL necesita control manual? Las respuestas eliminan
        opciones más rápido que cualquier benchmark genérico.
      </ArticleP>

      <ArticleH2>9. Performance sin mito</ArticleH2>

      <ArticleP>
        Es común oír que{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> es "más rápido que{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink>". La frase es
        parcial. En una consulta que busca una fila por clave primaria, la
        diferencia de mapeo puede aparecer. En una consulta que recorre millones
        de filas, el tiempo de red y de base domina, y el mapeo se vuelve un
        detalle.
      </ArticleP>

      <ArticleP>
        Un ejemplo ayuda a calibrar la expectativa. Si la consulta pasa 40 ms en
        la base y 2 ms en el mapeo, cambiar el mapeo ahorra como máximo 2 ms. Si
        el mapeo cuesta 20 ms y la base responde en 5 ms, el cambio aparece. El
        número que importa es el tiempo total de la operación y la asignación de
        memoria, no la biblioteca aislada.
      </ArticleP>

      <ArticleP>
        Mide con{" "}
        <TermLink href={BENCHMARK_URL}>BenchmarkDotNet</TermLink>, contra una
        base real, con datos parecidos a producción. Compara consultas
        equivalentes y registra:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          tiempo medio y cola, no solo el promedio, porque los picos de latencia
          desaparecen en un promedio aislado.
        </ArticleLi>
        <ArticleLi>
          asignaciones y presión en el garbage collector, que pesan en servicios
          con muchas peticiones.
        </ArticleLi>
        <ArticleLi>
          SQL generado por{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> y plan de
          ejecución de los dos lados.
        </ArticleLi>
        <ArticleLi>
          escenario frío y caliente, porque la caché de plan y de datos cambia
          el resultado.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Antes de cambiar de herramienta, optimiza{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> con{" "}
        <ArticleCode>AsNoTracking</ArticleCode>, proyección, consultas
        compiladas y paginación. Del lado de{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink>, revisa índices, evita{" "}
        <ArticleCode>SELECT *</ArticleCode> y usa parámetros. Muchas veces la
        diferencia entre las dos desaparece después de ese trabajo.
      </ArticleP>

      <ArticleH2>10. Errores comunes</ArticleH2>

      <ArticleUl>
        <ArticleLi>
          <strong>Concluir que un micro-ORM siempre es mejor.</strong> En CRUD
          con muchas relaciones,{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> entrega menos
          código y menos errores de mapeo.
        </ArticleLi>
        <ArticleLi>
          <strong>Concatenar SQL con entrada del usuario.</strong> Un filtro
          armado con cadena permite{" "}
          <TermLink href={SQL_INJECTION_URL}>SQL injection</TermLink>. Usa
          parámetros en todas las consultas de{" "}
          <TermLink href={DAPPER_URL}>Dapper</TermLink>.
        </ArticleLi>
        <ArticleLi>
          <strong>Mezclar transacciones sin compartir la conexión.</strong> El
          comando de <TermLink href={DAPPER_URL}>Dapper</TermLink> necesita
          recibir la transacción de{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink>.
        </ArticleLi>
        <ArticleLi>
          <strong>Depender del orden de las columnas.</strong> Prefiere alias
          explícitos y proyecciones con nombres estables.{" "}
          <ArticleCode>SELECT *</ArticleCode> se rompe cuando cambia el esquema.
        </ArticleLi>
        <ArticleLi>
          <strong>Olvidar el tracking en lectura grande.</strong> En{" "}
          <TermLink href={EF_URL}>Entity Framework Core</TermLink>,{" "}
          <ArticleCode>AsNoTracking</ArticleCode> y proyección resuelven buena
          parte del costo.
        </ArticleLi>
        <ArticleLi>
          <strong>Reescribir todo el ORM por una consulta.</strong> El uso
          híbrido suele resolver el punto caliente sin cambiar el modelo de
          escritura.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        El error común no es elegir la herramienta “equivocada”. Es elegir sin
        medir y sin saber qué operación domina el costo. Una consulta de reporte
        y un alta de cliente tienen requisitos distintos, y el diseño debe
        reflejarlo.
      </ArticleP>

      <ArticleH3>Puntos clave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <TermLink href={DAPPER_URL}>Dapper</TermLink> es micro-ORM de mapeo:
          escribes el SQL y recibes objetos.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={EF_URL}>Entity Framework Core</TermLink> es ORM
          completo: LINQ, tracking, relaciones y migraciones.
        </ArticleLi>
        <ArticleLi>
          Usa <TermLink href={EF_URL}>Entity Framework Core</TermLink> para
          escritura transaccional, dominio relacional y productividad.
        </ArticleLi>
        <ArticleLi>
          Usa <TermLink href={DAPPER_URL}>Dapper</TermLink> para lectura
          compleja, reportes, read models y SQL específico de la base.
        </ArticleLi>
        <ArticleLi>
          El híbrido es válido cuando cada herramienta cubre un tipo de
          operación, con conexión y transacción compartidas.
        </ArticleLi>
        <ArticleLi>
          Performance depende de índice, plan y volumen. Mide con{" "}
          <TermLink href={BENCHMARK_URL}>BenchmarkDotNet</TermLink> antes de
          cambiar la biblioteca.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={REPODB_URL}>RepoDB</TermLink>,{" "}
          <TermLink href={LINQTODB_URL}>LINQ to DB</TermLink>,{" "}
          <TermLink href={NHIBERNATE_URL}>NHibernate</TermLink> y{" "}
          <TermLink href={MARTEN_URL}>Marten</TermLink> cubren escenarios que no
          caben en la pareja principal.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusión</ArticleH3>

      <ArticleP>
        La pregunta útil no es qué ORM es mejor. Es qué herramienta reduce el
        costo total de la feature sin esconder lo que la base está haciendo.{" "}
        <TermLink href={EF_URL}>Entity Framework Core</TermLink> gana cuando la
        productividad y el dominio pesan más.{" "}
        <TermLink href={DAPPER_URL}>Dapper</TermLink> gana cuando el SQL y la
        forma de la lectura necesitan ser explícitos.
      </ArticleP>

      <ArticleP>
        Los dos conviven bien cuando el límite es claro. Lo importante es medir
        la consulta real, mantener parámetros, versionar el esquema y revisar el
        plan de ejecución. La herramienta es un medio. El requisito y el dato
        mandan.
      </ArticleP>
    </>
  );
}
