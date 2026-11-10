import {
  ArticleCallout,
  ArticleCode,
  ArticleH2,
  ArticleH3,
  ArticleLi,
  ArticleMermaid,
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

const DIP_CHART = `flowchart LR
  Service["CreateOrder"] --> Port[["OrderRepository (interfaz)"]]
  Adapter["PostgresOrderRepository"] -.->|"implementa"| Port`;

const RELATION_CHART = `flowchart TB
  SRP["S: una razón para cambiar"] --> OCP["O: extender sin editar"]
  ISP["I: interfaces por rol"] --> OCP
  LSP["L: subtipo respeta el contrato"] --> OCP
  DIP["D: depender de abstracción"] --> OCP
  OCP --> Result(["Cambio local, menor riesgo"])`;

const linkClass =
  "font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300";

const SOLID_URL = "https://en.wikipedia.org/wiki/SOLID";
const SOLID_RELEVANCE_URL =
  "https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html";
const SRP_URL =
  "https://en.wikipedia.org/wiki/Single-responsibility_principle";
const OCP_URL =
  "https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle";
const LSP_URL =
  "https://en.wikipedia.org/wiki/Liskov_substitution_principle";
const ISP_URL =
  "https://en.wikipedia.org/wiki/Interface_segregation_principle";
const DIP_URL =
  "https://en.wikipedia.org/wiki/Dependency_inversion_principle";
const TYPESCRIPT_URL = "https://www.typescriptlang.org/docs/";
const POLYMORPHISM_URL =
  "https://refactoring.com/catalog/replaceConditionalWithPolymorphism.html";
const COMPOSITION_URL =
  "https://en.wikipedia.org/wiki/Composition_over_inheritance";
const TEST_DOUBLE_URL = "https://martinfowler.com/bliki/TestDouble.html";
const SMTP_URL = "https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol";

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

export function SolidNaPraticaContentEs() {
  return (
    <>
      <ArticleH2>1. El problema antes de las siglas</ArticleH2>

      <ArticleP>
        La escena aparece en code review con frecuencia: una clase llamada{" "}
        <ArticleCode>OrderService</ArticleCode> con cientos de líneas. Valida
        el formulario, calcula descuentos, graba en la base, envía correo,
        registra log y formatea la respuesta de la API.
      </ArticleP>

      <ArticleP>
        Mientras el sistema es pequeño, la clase parece práctica. Todo está en
        el mismo lugar. El problema empieza cuando cada área pide un cambio
        distinto:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Marketing quiere un cupón nuevo. El cambio toca el cálculo de precio,
          que vive en el mismo archivo que la validación de correo.
        </ArticleLi>
        <ArticleLi>
          Infra cambia el proveedor de correo. El equipo tiene que abrir la
          clase que también guarda pedidos en la base.
        </ArticleLi>
        <ArticleLi>
          La prueba unitaria del descuento exige base de datos, un servidor{" "}
          <TermLink href={SMTP_URL}>SMTP</TermLink> (el protocolo de envío de
          correo) y logger reales, porque la clase crea todo por su cuenta.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Ese es el terreno donde entra{" "}
        <TermLink href={SOLID_URL}>SOLID</TermLink>. Son cinco principios de
        diseño orientado a objetos para reducir acoplamiento y darle a cada
        pieza un papel claro. No es ley, no es checklist de entrevista y no
        garantiza buena arquitectura por sí solo.
      </ArticleP>

      <ArticleCallout variant="note" title="Lo que SOLID no es">
        <ArticleP>
          SOLID no pide una interfaz por clase ni una carpeta por función. El
          objetivo es cambiar menos código cuando el requisito se mueve, no
          agregar capas para parecer sofisticado. Robert C. Martin discute los
          límites y el mal uso en{" "}
          <TermLink href={SOLID_RELEVANCE_URL}>Solid Relevance</TermLink>.
        </ArticleP>
      </ArticleCallout>

      <ArticleCallout variant="note" title="Sobre los ejemplos">
        <ArticleP>
          Los ejemplos usan tipos de dominio como{" "}
          <ArticleCode>OrderInput</ArticleCode>,{" "}
          <ArticleCode>OrderItem</ArticleCode>, <ArticleCode>Order</ArticleCode>{" "}
          y <ArticleCode>Receipt</ArticleCode>. Representan datos comunes de
          pedido y fueron omitidos para que el foco quede en la estructura. El
          código muestra la forma de la solución, no un proyecto completo.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>Conceptos que aparecen en el post</ArticleH3>

      <ArticleP>
        Los cinco principios usan un vocabulario propio. Conviene fijar el
        significado de cada término antes de los ejemplos:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>Acoplamiento:</strong> cuánto necesita una clase conocer los
          detalles de otra para funcionar. Ejemplo: si cambiar el proveedor de
          correo obliga a editar la clase que guarda pedidos, las dos están
          acopladas.
        </ArticleLi>
        <ArticleLi>
          <strong>Cohesión:</strong> cuánto pertenecen los métodos de una clase
          al mismo tema. Ejemplo: validar correo y calcular descuento en la
          misma clase baja la cohesión porque son temas distintos.
        </ArticleLi>
        <ArticleLi>
          <strong>Contrato o interfaz:</strong> el conjunto de métodos y
          promesas que un tipo expone a quien llama. Ejemplo:{" "}
          <ArticleCode>PaymentMethod</ArticleCode> promete recibir un valor y
          devolver un recibo.
        </ArticleLi>
        <ArticleLi>
          <strong>Polimorfismo:</strong> la misma llamada ejecutar
          implementaciones distintas según el tipo. Ejemplo:{" "}
          <ArticleCode>checkout.pay(100)</ArticleCode> funciona con Pix, tarjeta
          o boleto sin que checkout conozca cada detalle.
        </ArticleLi>
        <ArticleLi>
          <strong>Composición:</strong> armar una clase usando otras clases en
          vez de heredar comportamiento. Ejemplo:{" "}
          <ArticleCode>CreateOrder</ArticleCode> recibe un repositorio y un
          notificador en el constructor.
        </ArticleLi>
        <ArticleLi>
          <strong>Responsabilidad y actor:</strong> la responsabilidad es el
          motivo por el que la clase cambia. El actor es la persona o área que
          pide ese cambio, como finanzas, marketing o infraestructura.
        </ArticleLi>
        <ArticleLi>
          <strong>Extensión:</strong> agregar comportamiento nuevo sin editar el
          código que ya funciona. Ejemplo: crear{" "}
          <ArticleCode>BoletoPayment</ArticleCode> sin tocar{" "}
          <ArticleCode>Checkout</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <strong>Subtipo y sustitución:</strong> un subtipo es una clase que
          hereda de otra. Sustitución significa usar el subtipo en lugar de la
          clase base sin romper al llamador.
        </ArticleLi>
        <ArticleLi>
          <strong>Abstracción:</strong> representación mínima de lo que el
          llamador necesita. Ejemplo: <ArticleCode>Shape</ArticleCode> expone
          solo <ArticleCode>area()</ArticleCode>, no los detalles de cada
          figura.
        </ArticleLi>
        <ArticleLi>
          <strong>Over-engineering:</strong> agregar capas y abstracciones sin
          un dolor concreto. Ejemplo: crear interfaz, fábrica e inyección para
          un script de 80 líneas.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        En cada sección, el primer bloque muestra el olor en el código y el
        segundo muestra la división. La pregunta para leer ambos es siempre la
        misma: ¿qué cambia cuando cambia el requisito?
      </ArticleP>

      <ArticleP>
        Abajo, los cinco principios comparten el mismo dominio de pedido. Los
        ejemplos usan <TermLink href={TYPESCRIPT_URL}>TypeScript</TermLink>{" "}
        porque la sintaxis deja explícito el contrato, pero la idea vale para
        Java, C#, Kotlin, Python y cualquier lenguaje con orientación a objetos.
      </ArticleP>

      <ArticleH2>2. S: Single Responsibility</ArticleH2>

      <ArticleP>
        El{" "}
        <TermLink href={SRP_URL}>Single Responsibility Principle</TermLink>{" "}
        dice que una clase debe tener una sola razón para cambiar. “Razón para
        cambiar” significa un actor con interés propio en el código, como
        finanzas, marketing o infraestructura.
      </ArticleP>

      <ArticleP>
        El ejemplo de abajo mezcla cuatro intereses en la misma clase:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`class OrderService {
  async create(input: OrderInput) {
    if (!input.email.includes("@")) {
      throw new Error("email inválido");
    }
    if (input.items.length === 0) {
      throw new Error("pedido vacío");
    }
    const subtotal = input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total = subtotal > 1000 ? subtotal * 0.9 : subtotal;
    const order = await database.orders.insert({
      ...input,
      total,
      status: "pending",
    });
    await mailer.send(input.email, "Pedido confirmado");
    logger.info("pedido creado: " + order.id);
    return order;
  }
}`}
      </ArticleCode>

      <ArticleP>
        La validación pertenece al flujo de entrada. El descuento pertenece a
        finanzas. La escritura en la base pertenece a persistencia. El correo
        pertenece a comunicación. Cuatro equipos pueden pedir un cambio, y
        todos caen en el mismo archivo.
      </ArticleP>

      <ArticleP>
        La separación por responsabilidad deja el flujo explícito y permite
        probar el cálculo de precio sin levantar una base:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`class OrderValidator {
  validate(input: OrderInput) {
    if (!input.email.includes("@")) {
      throw new Error("email inválido");
    }
    if (input.items.length === 0) {
      throw new Error("pedido vacío");
    }
  }
}

class OrderPricing {
  total(items: OrderItem[]) {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return subtotal > 1000 ? subtotal * 0.9 : subtotal;
  }
}

class CreateOrder {
  constructor(
    private validator: OrderValidator,
    private pricing: OrderPricing,
    private repository: OrderRepository,
    private notifier: OrderNotifier,
  ) {}

  async execute(input: OrderInput) {
    this.validator.validate(input);
    const total = this.pricing.total(input.items);
    const order = await this.repository.save({ ...input, total });
    await this.notifier.sendConfirmation(order);
    return order;
  }
}`}
      </ArticleCode>

      <ArticleP>
        La interfaz <ArticleCode>OrderRepository</ArticleCode> aparece de nuevo
        en la sección de inversión de dependencia, porque dividir
        responsabilidad e invertir dependencias caminan juntas en la práctica.{" "}
        <ArticleCode>OrderNotifier</ArticleCode> sigue la misma idea: el caso de
        uso conoce el contrato, no el proveedor de correo.
      </ArticleP>

      <ArticleP>
        <strong>Dónde se exagera:</strong> convertir cada método en una clase
        propia crea navegación cansadora y no mejora la cohesión. La prueba es
        simple: si dos responsabilidades siempre cambian por el mismo motivo,
        pueden quedarse juntas.
      </ArticleP>

      <ArticleH2>3. O: Open/Closed</ArticleH2>

      <ArticleP>
        El{" "}
        <TermLink href={OCP_URL}>Open/Closed Principle</TermLink> dice que una
        pieza debe estar abierta para extensión y cerrada para modificación. En
        la práctica, agregar un comportamiento nuevo no debería exigir editar
        una cadena de condiciones que ya funciona.
      </ArticleP>

      <ArticleP>
        El olor clásico es la secuencia de <ArticleCode>if</ArticleCode> que
        crece con cada medio de pago:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`function pay(method: string, amount: number) {
  if (method === "pix") {
    return gateway.pix(amount);
  }
  if (method === "card") {
    return gateway.card(amount);
  }
  if (method === "boleto") {
    return gateway.boleto(amount);
  }
  throw new Error("método no soportado");
}`}
      </ArticleCode>

      <ArticleP>
        Cada medio nuevo exige modificar la función y volver a probar todos los
        anteriores. La solución es mover la variación detrás de un contrato
        común, técnica conocida como{" "}
        <TermLink href={POLYMORPHISM_URL}>
          reemplazar condicional por polimorfismo
        </TermLink>
        :
      </ArticleP>

      <ArticleCode block language="typescript">
        {`interface PaymentMethod {
  charge(amount: number): Promise<Receipt>;
}

class PixPayment implements PaymentMethod {
  async charge(amount: number): Promise<Receipt> {
    return gateway.pix(amount);
  }
}

class CardPayment implements PaymentMethod {
  async charge(amount: number): Promise<Receipt> {
    return gateway.card(amount);
  }
}

class Checkout {
  constructor(private method: PaymentMethod) {}

  pay(amount: number) {
    return this.method.charge(amount);
  }
}`}
      </ArticleCode>

      <ArticleP>
        Para agregar boleto, basta crear una clase que implemente{" "}
        <ArticleCode>PaymentMethod</ArticleCode>.{" "}
        <ArticleCode>Checkout</ArticleCode> no cambia y no necesita conocer la
        lista completa de medios. La prueba del checkout usa un pago falso sin
        tocar el gateway real.
      </ArticleP>

      <ArticleP>
        <strong>Dónde se exagera:</strong> crear la interfaz antes de que
        exista la segunda implementación suele generar una abstracción vacía.
        La primera variación concreta es la señal más honesta de que vale abrir
        el punto de extensión.
      </ArticleP>

      <ArticleH2>4. L: Liskov</ArticleH2>

      <ArticleP>
        El{" "}
        <TermLink href={LSP_URL}>
          Liskov Substitution Principle
        </TermLink>{" "}
        dice que un subtipo debe reemplazar al tipo base sin romper lo que el
        llamador espera. No se trata de heredar campos. Se trata de respetar el
        contrato de comportamiento.
      </ArticleP>

      <ArticleP>
        Un contrato, aquí, es el conjunto de promesas del tipo base.
        En el ejemplo de abajo, <ArticleCode>Rectangle</ArticleCode> promete
        aceptar ancho y alto independientes, calcular el área con ambos y no
        lanzar excepción para valores válidos. Un subtipo que cambia esa regla
        rompe el contrato aunque compile.
      </ArticleP>

      <ArticleP>
        El ejemplo clásico muestra por qué la herencia por conveniencia engaña.
        Un rectángulo acepta ancho y alto independientes. Un cuadrado acepta un
        solo lado.
      </ArticleP>

      <ArticleCode block language="typescript">
        {`class Rectangle {
  constructor(
    protected width: number,
    protected height: number,
  ) {}

  setWidth(value: number) {
    this.width = value;
  }

  setHeight(value: number) {
    this.height = value;
  }

  area() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(value: number) {
    this.width = value;
    this.height = value;
  }

  setHeight(value: number) {
    this.width = value;
    this.height = value;
  }
}

function resize(rectangle: Rectangle) {
  rectangle.setWidth(10);
  rectangle.setHeight(5);
  return rectangle.area();
}`}
      </ArticleCode>

      <ArticleP>
        Llamar <ArticleCode>resize</ArticleCode> con un rectángulo devuelve 50.
        Llamarlo con un cuadrado devuelve 25, porque el segundo{" "}
        <ArticleCode>set</ArticleCode> sobrescribe el primero. El llamador no
        hizo nada mal. El subtipo rompió la expectativa del contrato.
      </ArticleP>

      <ArticleP>
        En el día a día pasa lo mismo con un repositorio que promete guardar y
        un subtipo que lanza excepción para ciertos datos, o con un gateway que
        ignora silenciosamente un cobro. El llamador confía en la interfaz y
        recibe un comportamiento distinto.
      </ArticleP>

      <ArticleP>
        Una salida es quitar la herencia y tratar cada forma por el contrato
        mínimo que el llamador realmente usa:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`interface Shape {
  area(): number;
}

class Rectangle implements Shape {
  constructor(
    private width: number,
    private height: number,
  ) {}

  area() {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(private side: number) {}

  area() {
    return this.side * this.side;
  }
}`}
      </ArticleCode>

      <ArticleP>
        El llamador que solo necesita el área recibe cualquier{" "}
        <ArticleCode>Shape</ArticleCode>. Quien necesita cambiar dimensiones
        usa el tipo concreto y asume las reglas de ese tipo.{" "}
        <TermLink href={COMPOSITION_URL}>Composición</TermLink> suele ser más
        segura que herencia cuando los comportamientos divergen.
      </ArticleP>

      <ArticleP>
        <strong>Dónde se exagera:</strong> el principio no prohíbe la herencia.
        Prohíbe el subtipo que miente sobre el contrato. Si la jerarquía no
        sostiene la sustitución, el diseño está mal, no el llamador.
      </ArticleP>

      <ArticleH2>5. I: Interface Segregation</ArticleH2>

      <ArticleP>
        El{" "}
        <TermLink href={ISP_URL}>
          Interface Segregation Principle
        </TermLink>{" "}
        dice que nadie debe ser obligado a depender de métodos que no usa. Las
        interfaces gordas empujan implementaciones vacías y excepciones dentro
        del código.
      </ArticleP>

      <ArticleP>
        El ejemplo de abajo obliga a un robot a implementar alimentación y
        sueño:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class Robot implements Worker {
  work() {
    this.arm.move();
  }

  eat() {
    throw new Error("los robots no comen");
  }

  sleep() {
    throw new Error("los robots no duermen");
  }
}`}
      </ArticleCode>

      <ArticleP>
        Quien recibe un <ArticleCode>Worker</ArticleCode> empieza a creer que
        puede llamar a <ArticleCode>eat</ArticleCode>. El contrato miente. La
        corrección es separar por rol, no por entidad:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`interface Workable {
  work(): void;
}

interface Feedable {
  eat(): void;
}

class Human implements Workable, Feedable {
  protected energy = 0;

  work() {
    this.energy = this.energy - 1;
  }

  eat() {
    this.energy = this.energy + 1;
  }
}

class Robot implements Workable {
  protected energy = 100;

  work() {
    this.energy = this.energy - 1;
  }
}`}
      </ArticleCode>

      <ArticleP>
        Las funciones que solo necesitan trabajo reciben{" "}
        <ArticleCode>Workable</ArticleCode>. Las que solo necesitan
        alimentación reciben <ArticleCode>Feedable</ArticleCode>. Cada
        implementación carga solo lo que tiene sentido.
      </ArticleP>

      <ArticleP>
        <strong>Dónde se exagera:</strong> una interfaz por método se vuelve
        ruido. El criterio es el uso del llamador. Si todo consumidor siempre
        usa los tres métodos juntos, la interfaz gorda tal vez sea cohesiva.
      </ArticleP>

      <ArticleH2>6. D: Dependency Inversion</ArticleH2>

      <ArticleP>
        El{" "}
        <TermLink href={DIP_URL}>
          Dependency Inversion Principle
        </TermLink>{" "}
        dice que los módulos de alto nivel no deben depender de detalles de
        bajo nivel. Ambos dependen de abstracciones. En el código, la flecha de
        dependencia apunta a la interfaz, no a la base.
      </ArticleP>

      <ArticleP>
        “Depender” significa que una clase necesita la otra para compilar y
        ejecutar. Si <ArticleCode>CreateOrder</ArticleCode> llama a{" "}
        <ArticleCode>new PostgresOrderRepository()</ArticleCode> directamente,
        depende del detalle concreto y no puede funcionar sin Postgres.
      </ArticleP>

      <ArticleP>
        El olor es la clase de negocio que instancia el concreto. Aquí, el caso
        de uso conoce y crea la base:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`class CreateOrder {
  private repository = new PostgresOrderRepository();

  async execute(input: OrderInput) {
    const order = await this.repository.save(input);
    return order;
  }
}`}
      </ArticleCode>

      <ArticleP>
        Probar ese caso de uso exige Postgres. Cambiar de base exige editar la
        regla de negocio. La inversión coloca la interfaz en el medio:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`interface OrderRepository {
  save(order: Order): Promise<Order>;
}

class PostgresOrderRepository implements OrderRepository {
  async save(order: Order) {
    return database.orders.insert(order);
  }
}

class CreateOrder {
  constructor(private repository: OrderRepository) {}

  async execute(input: OrderInput) {
    const order = await this.repository.save(input);
    return order;
  }
}`}
      </ArticleCode>

      <ArticleP>
        En producción, el caso de uso recibe el repositorio de Postgres. En las
        pruebas, recibe un{" "}
        <TermLink href={TEST_DOUBLE_URL}>test double</TermLink> en memoria, sin
        base y sin red:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  async save(order: Order) {
    this.orders.push(order);
    return order;
  }
}`}
      </ArticleCode>

      <ArticleP>
        El diseño deja la regla de negocio en el centro y los detalles en el
        borde:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="CreateOrder depende de la interfaz OrderRepository; PostgresOrderRepository implementa la interfaz"
        chart={DIP_CHART}
      />

      <ArticleP>
        <strong>Dónde se exagera:</strong> crear una interfaz para cada clase
        agrega indirección sin ganancia. La inversión compensa en fronteras que
        varían o necesitan prueba aislada, como base, cola, correo, gateway de
        pago y API externa.
      </ArticleP>

      <ArticleH2>7. Cómo se conectan los cinco</ArticleH2>

      <ArticleP>
        Los principios no son islas. Separar responsabilidades (S) y dividir
        interfaces por rol (I) dejan claro dónde debe entrar la extensión (O).
        La sustitución segura (L) garantiza que la extensión no rompa al
        llamador. La inversión (D) protege la regla de negocio de los cambios
        de infraestructura.
      </ArticleP>

      <ArticleP>
        El diagrama resume esa relación:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Relación entre los principios: SRP e ISP alimentan OCP; LSP sostiene la sustitución; DIP protege el alto nivel"
        chart={RELATION_CHART}
      />

      <ArticleP>
        En la práctica, cada principio responde a un síntoma distinto. La tabla
        de abajo funciona como mapa de diagnóstico, no como receta:
      </ArticleP>

      <ArticleTable caption="Síntoma, movimiento y costo de cada principio">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Principio</ArticleTh>
            <ArticleTh>Síntoma en el código</ArticleTh>
            <ArticleTh>Movimiento</ArticleTh>
            <ArticleTh>Costo</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>S: responsabilidad única</ArticleTd>
            <ArticleTd>Clase con varias razones para cambiar</ArticleTd>
            <ArticleTd>Separar validación, precio, persistencia y notificación</ArticleTd>
            <ArticleTd>Más clases y más navegación</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>O: abierto y cerrado</ArticleTd>
            <ArticleTd>Cadena de condiciones que crece con cada caso</ArticleTd>
            <ArticleTd>Polimorfismo detrás de un contrato</ArticleTd>
            <ArticleTd>Abstracción antes del dolor puede ser desperdicio</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>L: sustitución</ArticleTd>
            <ArticleTd>Subtipo que lanza excepción o ignora el contrato</ArticleTd>
            <ArticleTd>Contrato menor, composición o jerarquía nueva</ArticleTd>
            <ArticleTd>Rediseño de la jerarquía completa</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>I: segregación de interfaz</ArticleTd>
            <ArticleTd>Implementación obligada a decir “no soportado”</ArticleTd>
            <ArticleTd>Interfaces por rol del llamador</ArticleTd>
            <ArticleTd>Más tipos y nombres para mantener</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>D: inversión de dependencia</ArticleTd>
            <ArticleTd>Caso de uso creando base, cola o gateway</ArticleTd>
            <ArticleTd>Inyección de interfaz en la frontera</ArticleTd>
            <ArticleTd>Una capa extra de indirección</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH2>8. Cuándo SOLID estorba</ArticleH2>

      <ArticleP>
        SOLID fue pensado para sistemas que cambian y crecen. Aplicado sin
        criterio, se vuelve ceremonia. Tres escenarios comunes de mal uso:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Script pequeño de migración o automatización: crear interfaz, fábrica
          e inyección para un archivo de 80 líneas solo aumenta el tiempo de
          lectura sin reducir riesgo.
        </ArticleLi>
        <ArticleLi>
          Abstracción antes del segundo caso: la primera implementación se
          vuelve contrato definitivo y bloquea el diseño cuando aparece el
          requisito real.
        </ArticleLi>
        <ArticleLi>
          Capas sin necesidad: cada llamada atraviesa cinco archivos que solo
          pasan parámetros, y un bug simple exige abrir el proyecto completo.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        El contrapunto sano es mirar el costo del cambio. Si el requisito es
        estable y el código es pequeño, el diseño simple entrega más valor. Si
        el punto cambia toda la semana, vale invertir en el contrato.
      </ArticleP>

      <ArticleCallout variant="tip" title="Checklist rápido de aplicación">
        <ArticleUl>
          <ArticleLi>
            ¿La clase tiene más de una razón real para cambiar? Separa por
            actor.
          </ArticleLi>
          <ArticleLi>
            ¿Cada caso nuevo exige editar el mismo bloque condicional? Abre un
            punto de extensión.
          </ArticleLi>
          <ArticleLi>
            ¿Algún subtipo rompe lo que promete la interfaz? Revisa o quita la
            herencia.
          </ArticleLi>
          <ArticleLi>
            ¿Alguna implementación está obligada a lanzar “no soportado”?
            Divide la interfaz por uso.
          </ArticleLi>
          <ArticleLi>
            ¿La regla de negocio crea infraestructura directamente? Invierte la
            dependencia en la frontera.
          </ArticleLi>
        </ArticleUl>
      </ArticleCallout>

      <ArticleH3>Puntos clave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          SOLID es un conjunto de criterios para reducir el impacto del cambio,
          no una obligación de crear capas.
        </ArticleLi>
        <ArticleLi>
          S separa por actor que pide el cambio. Si todo cambia por el mismo
          motivo, dividir no aporta valor.
        </ArticleLi>
        <ArticleLi>
          O cambia una condicional creciente por polimorfismo, pero solo cuando
          aparece la segunda variación real.
        </ArticleLi>
        <ArticleLi>
          L exige contrato de comportamiento, no solo herencia de campos. Un
          subtipo que lanza una excepción inesperada ya lo viola.
        </ArticleLi>
        <ArticleLi>
          I divide interfaces por el uso del llamador y evita implementaciones
          que mienten sobre lo que soportan.
        </ArticleLi>
        <ArticleLi>
          D mueve la dependencia de base, cola y gateway hacia interfaces,
          dejando la regla de negocio testeable y estable.
        </ArticleLi>
        <ArticleLi>
          Aplica donde hay dolor concreto. El código pequeño y estable gana más
          con simplicidad.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusión</ArticleH3>

      <ArticleP>
        SOLID no reemplaza la conversación sobre requisitos. Organiza
        decisiones para que el cambio del próximo mes no atraviese el sistema
        completo. Los cinco principios apuntan en la misma dirección: contratos
        claros, papeles pequeños y dependencias que no atan la regla de negocio
        al detalle.
      </ArticleP>

      <ArticleP>
        El mejor uso es selectivo. Empieza por el síntoma real, elige el
        principio que ataca ese síntoma y mide el costo de la indirección.
        Cuando el diseño simple resuelve, sigue siendo la mejor arquitectura.
      </ArticleP>
    </>
  );
}
