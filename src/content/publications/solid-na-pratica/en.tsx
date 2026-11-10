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
  Service["CreateOrder"] --> Port[["OrderRepository (interface)"]]
  Adapter["PostgresOrderRepository"] -.->|"implements"| Port`;

const RELATION_CHART = `flowchart TB
  SRP["S: one reason to change"] --> OCP["O: extend without editing"]
  ISP["I: role interfaces"] --> OCP
  LSP["L: subtype keeps the contract"] --> OCP
  DIP["D: depend on abstraction"] --> OCP
  OCP --> Result(["Local change, lower risk"])`;

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

export function SolidNaPraticaContentEn() {
  return (
    <>
      <ArticleH2>1. The problem before the acronym</ArticleH2>

      <ArticleP>
        The scene shows up in code review often: a class called{" "}
        <ArticleCode>OrderService</ArticleCode> with hundreds of lines. It
        validates the form, calculates discounts, writes to the database, sends
        email, logs the operation, and formats the API response.
      </ArticleP>

      <ArticleP>
        While the system is small, the class feels practical. Everything lives
        in one place. The problem starts when each area asks for a different
        change:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Marketing wants a new coupon. The change touches the pricing code,
          which sits in the same file as email validation.
        </ArticleLi>
        <ArticleLi>
          Infra switches the email provider. The team has to open the class
          that also saves orders to the database.
        </ArticleLi>
        <ArticleLi>
          The discount unit test needs a real database, an{" "}
          <TermLink href={SMTP_URL}>SMTP</TermLink> server (the email delivery
          protocol), and a logger, because the class creates all of them on its
          own.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        This is the ground where{" "}
        <TermLink href={SOLID_URL}>SOLID</TermLink> lives. It is a set of five
        object-oriented design principles to reduce coupling and give each
        piece a clear role. It is not a law, not an interview checklist, and not
        a guarantee of good architecture by itself.
      </ArticleP>

      <ArticleCallout variant="note" title="What SOLID is not">
        <ArticleP>
          SOLID does not ask for an interface per class or a folder per
          function. The goal is to change less code when requirements move, not
          to add layers to look sophisticated. Robert C. Martin discusses the
          limits and common misuse in{" "}
          <TermLink href={SOLID_RELEVANCE_URL}>Solid Relevance</TermLink>.
        </ArticleP>
      </ArticleCallout>

      <ArticleCallout variant="note" title="About the examples">
        <ArticleP>
          The examples use domain types such as{" "}
          <ArticleCode>OrderInput</ArticleCode>,{" "}
          <ArticleCode>OrderItem</ArticleCode>, <ArticleCode>Order</ArticleCode>,
          and <ArticleCode>Receipt</ArticleCode>. They represent common order
          data and were omitted so the focus stays on the structure. The code
          shows the shape of the solution, not a complete project.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>Concepts that appear in this post</ArticleH3>

      <ArticleP>
        The five principles use their own vocabulary. It helps to fix the
        meaning of each term before the examples:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>Coupling:</strong> how much one class needs to know about
          another to work. Example: if changing the email provider forces edits
          to the class that saves orders, the two are coupled.
        </ArticleLi>
        <ArticleLi>
          <strong>Cohesion:</strong> how much the methods of a class belong to
          the same subject. Example: validating email and calculating discounts
          in the same class lowers cohesion because they are different subjects.
        </ArticleLi>
        <ArticleLi>
          <strong>Contract or interface:</strong> the set of methods and
          promises a type exposes to callers. Example:{" "}
          <ArticleCode>PaymentMethod</ArticleCode> promises to receive an amount
          and return a receipt.
        </ArticleLi>
        <ArticleLi>
          <strong>Polymorphism:</strong> the same call running different
          implementations depending on the type. Example:{" "}
          <ArticleCode>checkout.pay(100)</ArticleCode> works with Pix, card, or
          boleto without checkout knowing each detail.
        </ArticleLi>
        <ArticleLi>
          <strong>Composition:</strong> building a class from other classes
          instead of inheriting behavior. Example:{" "}
          <ArticleCode>CreateOrder</ArticleCode> receives a repository and a
          notifier in the constructor.
        </ArticleLi>
        <ArticleLi>
          <strong>Responsibility and actor:</strong> the responsibility is the
          reason the class changes. The actor is the person or area requesting
          the change, such as finance, marketing, or infrastructure.
        </ArticleLi>
        <ArticleLi>
          <strong>Extension:</strong> adding new behavior without editing code
          that already works. Example: creating{" "}
          <ArticleCode>BoletoPayment</ArticleCode> without touching{" "}
          <ArticleCode>Checkout</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <strong>Subtype and substitution:</strong> a subtype is a class that
          inherits from another. Substitution means using the subtype in place
          of the base class without breaking the caller.
        </ArticleLi>
        <ArticleLi>
          <strong>Abstraction:</strong> the minimal representation of what the
          caller needs. Example: <ArticleCode>Shape</ArticleCode> exposes only{" "}
          <ArticleCode>area()</ArticleCode>, not the details of each figure.
        </ArticleLi>
        <ArticleLi>
          <strong>Over-engineering:</strong> adding layers and abstractions
          without concrete pain. Example: creating an interface, factory, and
          injection for an 80-line script.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        In each section, the first block shows the smell in the code and the
        second shows the split. The question for reading both is always the
        same: what changes when the requirement changes?
      </ArticleP>

      <ArticleP>
        Below, the five principles share the same order domain. The examples
        use <TermLink href={TYPESCRIPT_URL}>TypeScript</TermLink> because the
        syntax makes contracts explicit, but the idea applies to Java, C#,
        Kotlin, Python, and any language with object orientation.
      </ArticleP>

      <ArticleH2>2. S: Single Responsibility</ArticleH2>

      <ArticleP>
        The{" "}
        <TermLink href={SRP_URL}>Single Responsibility Principle</TermLink>{" "}
        says a class should have one reason to change. “Reason to change” means
        one actor with a stake in the code, such as finance, marketing, or
        infrastructure.
      </ArticleP>

      <ArticleP>
        The example below mixes four interests in the same class:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`class OrderService {
  async create(input: OrderInput) {
    if (!input.email.includes("@")) {
      throw new Error("invalid email");
    }
    if (input.items.length === 0) {
      throw new Error("empty order");
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
    await mailer.send(input.email, "Order confirmed");
    logger.info("order created: " + order.id);
    return order;
  }
}`}
      </ArticleCode>

      <ArticleP>
        Validation belongs to the input flow. Pricing belongs to finance.
        Writing to the database belongs to persistence. Email belongs to
        communication. Four teams can request a change, and all of them land in
        the same file.
      </ArticleP>

      <ArticleP>
        Splitting by responsibility makes the flow explicit and lets you test
        pricing without starting a database:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`class OrderValidator {
  validate(input: OrderInput) {
    if (!input.email.includes("@")) {
      throw new Error("invalid email");
    }
    if (input.items.length === 0) {
      throw new Error("empty order");
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
        The <ArticleCode>OrderRepository</ArticleCode> interface appears again
        in the dependency inversion section, because splitting responsibility
        and inverting dependencies go together in practice.{" "}
        <ArticleCode>OrderNotifier</ArticleCode> follows the same idea: the use
        case knows the contract, not the email provider.
      </ArticleP>

      <ArticleP>
        <strong>Where it goes too far:</strong> turning every method into a
        class creates tiresome navigation and does not improve cohesion. The
        test is simple: if two responsibilities always change for the same
        reason, they can stay together.
      </ArticleP>

      <ArticleH2>3. O: Open/Closed</ArticleH2>

      <ArticleP>
        The{" "}
        <TermLink href={OCP_URL}>Open/Closed Principle</TermLink> says a piece
        should be open for extension and closed for modification. In practice,
        adding a new behavior should not require editing a condition chain that
        already works.
      </ArticleP>

      <ArticleP>
        The classic smell is the <ArticleCode>if</ArticleCode> sequence that
        grows with every payment method:
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
  throw new Error("unsupported method");
}`}
      </ArticleCode>

      <ArticleP>
        Every new method requires editing the function and retesting all the
        old ones. The fix is to move the variation behind a shared contract, a
        technique known as{" "}
        <TermLink href={POLYMORPHISM_URL}>
          replacing conditional with polymorphism
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
        To add boleto, you create a class that implements{" "}
        <ArticleCode>PaymentMethod</ArticleCode>.{" "}
        <ArticleCode>Checkout</ArticleCode> does not change and does not need
        to know the full list of methods. The checkout test uses a fake payment
        without touching the real gateway.
      </ArticleP>

      <ArticleP>
        <strong>Where it goes too far:</strong> creating the interface before
        the second implementation exists often produces an empty abstraction.
        The first concrete variation is the most honest signal that the
        extension point is worth opening.
      </ArticleP>

      <ArticleH2>4. L: Liskov</ArticleH2>

      <ArticleP>
        The{" "}
        <TermLink href={LSP_URL}>
          Liskov Substitution Principle
        </TermLink>{" "}
        says a subtype must replace the base type without breaking what the
        caller expects. It is not about inheriting fields. It is about honoring
        the behavior contract.
      </ArticleP>

      <ArticleP>
        A contract, here, is the set of promises from the base type.
        In the example below, <ArticleCode>Rectangle</ArticleCode> promises to
        accept independent width and height, calculate the area from both, and
        not throw for valid values. A subtype that changes that rule breaks the
        contract even if it compiles.
      </ArticleP>

      <ArticleP>
        The classic example shows why inheritance by convenience misleads. A
        rectangle accepts independent width and height. A square accepts a
        single side.
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
        Calling <ArticleCode>resize</ArticleCode> with a rectangle returns 50.
        Calling it with a square returns 25, because the second{" "}
        <ArticleCode>set</ArticleCode> overwrites the first. The caller did
        nothing wrong. The subtype broke the contract expectation.
      </ArticleP>

      <ArticleP>
        In daily work, the same happens with a repository that promises to save
        and a subtype that throws for certain data, or with a gateway that
        silently ignores a charge. The caller trusts the interface and gets
        different behavior.
      </ArticleP>

      <ArticleP>
        One way out is to drop inheritance and model each shape by the minimal
        contract the caller actually uses:
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
        A caller that only needs the area receives any{" "}
        <ArticleCode>Shape</ArticleCode>. A caller that needs to change
        dimensions uses the concrete type and accepts that type's rules.{" "}
        <TermLink href={COMPOSITION_URL}>Composition</TermLink> is often safer
        than inheritance when behaviors diverge.
      </ArticleP>

      <ArticleP>
        <strong>Where it goes too far:</strong> the principle does not forbid
        inheritance. It forbids a subtype that lies about the contract. If the
        hierarchy cannot support substitution, the design is wrong, not the
        caller.
      </ArticleP>

      <ArticleH2>5. I: Interface Segregation</ArticleH2>

      <ArticleP>
        The{" "}
        <TermLink href={ISP_URL}>
          Interface Segregation Principle
        </TermLink>{" "}
        says nobody should be forced to depend on methods they do not use. Fat
        interfaces push empty implementations and exceptions into the code.
      </ArticleP>

      <ArticleP>
        The example below forces a robot to implement eating and sleeping:
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
    throw new Error("robots do not eat");
  }

  sleep() {
    throw new Error("robots do not sleep");
  }
}`}
      </ArticleCode>

      <ArticleP>
        Anyone who receives a <ArticleCode>Worker</ArticleCode> starts to
        believe they can call <ArticleCode>eat</ArticleCode>. The contract
        lies. The fix is to split by role, not by entity:
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
        Functions that only need work receive{" "}
        <ArticleCode>Workable</ArticleCode>. Functions that only need feeding
        receive <ArticleCode>Feedable</ArticleCode>. Each implementation
        carries only what makes sense.
      </ArticleP>

      <ArticleP>
        <strong>Where it goes too far:</strong> one interface per method
        becomes noise. The criterion is the caller's usage. If every consumer
        always uses the three methods together, the fat interface might be
        cohesive.
      </ArticleP>

      <ArticleH2>6. D: Dependency Inversion</ArticleH2>

      <ArticleP>
        The{" "}
        <TermLink href={DIP_URL}>
          Dependency Inversion Principle
        </TermLink>{" "}
        says high-level modules should not depend on low-level details. Both
        depend on abstractions. In code, the dependency arrow points to the
        interface, not to the database.
      </ArticleP>

      <ArticleP>
        "Depending" means one class needs the other to compile and run. If{" "}
        <ArticleCode>CreateOrder</ArticleCode> calls{" "}
        <ArticleCode>new PostgresOrderRepository()</ArticleCode> directly, it
        depends on the concrete detail and cannot run without Postgres.
      </ArticleP>

      <ArticleP>
        The smell is the business class that instantiates the concrete detail.
        Here, the use case knows and creates the database:
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
        Testing this use case requires Postgres. Switching databases requires
        editing the business rule. Inversion puts the interface in the middle:
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
        In production, the use case receives the Postgres repository. In tests,
        it receives an in-memory{" "}
        <TermLink href={TEST_DOUBLE_URL}>test double</TermLink>, with no
        database and no network:
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
        The design keeps the business rule at the center and the details at the
        edge:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="CreateOrder depends on the OrderRepository interface; PostgresOrderRepository implements the interface"
        chart={DIP_CHART}
      />

      <ArticleP>
        <strong>Where it goes too far:</strong> creating an interface for every
        class adds indirection without gain. Inversion pays off at boundaries
        that vary or need isolated tests, such as database, queue, email,
        payment gateway, and external API.
      </ArticleP>

      <ArticleH2>7. How the five connect</ArticleH2>

      <ArticleP>
        The principles are not islands. Splitting responsibilities (S) and
        dividing interfaces by role (I) show where extension (O) should enter.
        Safe substitution (L) keeps the extension from breaking the caller.
        Inversion (D) protects the business rule from infrastructure changes.
      </ArticleP>

      <ArticleP>
        The diagram summarizes that relationship:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Principle relationship: SRP and ISP feed OCP; LSP supports substitution; DIP protects the high level"
        chart={RELATION_CHART}
      />

      <ArticleP>
        In practice, each principle answers a different symptom. The table
        below works as a diagnostic map, not a recipe:
      </ArticleP>

      <ArticleTable caption="Symptom, move, and cost for each principle">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Principle</ArticleTh>
            <ArticleTh>Symptom in code</ArticleTh>
            <ArticleTh>Move</ArticleTh>
            <ArticleTh>Cost</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>S: single responsibility</ArticleTd>
            <ArticleTd>Class with several reasons to change</ArticleTd>
            <ArticleTd>Split validation, pricing, persistence, and notification</ArticleTd>
            <ArticleTd>More classes and more navigation</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>O: open and closed</ArticleTd>
            <ArticleTd>Condition chain that grows with every case</ArticleTd>
            <ArticleTd>Polymorphism behind a contract</ArticleTd>
            <ArticleTd>Abstraction before the pain can be waste</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>L: substitution</ArticleTd>
            <ArticleTd>Subtype that throws or ignores the contract</ArticleTd>
            <ArticleTd>Smaller contract, composition, or a new hierarchy</ArticleTd>
            <ArticleTd>Redesign of the whole hierarchy</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>I: interface segregation</ArticleTd>
            <ArticleTd>Implementation forced to say “not supported”</ArticleTd>
            <ArticleTd>Interfaces by caller role</ArticleTd>
            <ArticleTd>More types and names to maintain</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>D: dependency inversion</ArticleTd>
            <ArticleTd>Use case creating database, queue, or gateway</ArticleTd>
            <ArticleTd>Interface injection at the boundary</ArticleTd>
            <ArticleTd>One extra layer of indirection</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH2>8. When SOLID gets in the way</ArticleH2>

      <ArticleP>
        SOLID was designed for systems that change and grow. Applied without
        judgment, it becomes ceremony. Three common scenarios of poor use:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          A small migration or automation script: adding interface, factory,
          and injection to an 80-line file increases reading time without
          reducing risk.
        </ArticleLi>
        <ArticleLi>
          Abstraction before the second case: the first implementation becomes
          a definitive contract and blocks the design when the real requirement
          appears.
        </ArticleLi>
        <ArticleLi>
          Layers without need: every call crosses five files that only pass
          parameters along, and a simple bug requires opening the whole project.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        The healthy counterpoint is to look at the cost of change. If the
        requirement is stable and the code is small, the simple design delivers
        more value. If the spot changes every week, investing in the contract
        pays off.
      </ArticleP>

      <ArticleCallout variant="tip" title="Quick application checklist">
        <ArticleUl>
          <ArticleLi>
            Does the class have more than one real reason to change? Split by
            actor.
          </ArticleLi>
          <ArticleLi>
            Does every new case require editing the same conditional block?
            Open an extension point.
          </ArticleLi>
          <ArticleLi>
            Does any subtype break what the interface promises? Review or drop
            the inheritance.
          </ArticleLi>
          <ArticleLi>
            Is any implementation forced to throw “not supported”? Divide the
            interface by usage.
          </ArticleLi>
          <ArticleLi>
            Does the business rule create infrastructure directly? Invert the
            dependency at the boundary.
          </ArticleLi>
        </ArticleUl>
      </ArticleCallout>

      <ArticleH3>Key takeaways</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          SOLID is a set of criteria to reduce the impact of change, not an
          obligation to create layers.
        </ArticleLi>
        <ArticleLi>
          S splits by the actor who requests the change. If everything changes
          for the same reason, splitting adds no value.
        </ArticleLi>
        <ArticleLi>
          O replaces a growing conditional with polymorphism, but only when the
          second real variation appears.
        </ArticleLi>
        <ArticleLi>
          L requires a behavior contract, not just inherited fields. A subtype
          that throws an unexpected exception already violates it.
        </ArticleLi>
        <ArticleLi>
          I divides interfaces by caller usage and prevents implementations
          from lying about what they support.
        </ArticleLi>
        <ArticleLi>
          D moves the dependency on database, queue, and gateway to interfaces,
          keeping the business rule testable and stable.
        </ArticleLi>
        <ArticleLi>
          Apply where there is concrete pain. Small, stable code gains more
          from simplicity.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusion</ArticleH3>

      <ArticleP>
        SOLID does not replace the conversation about requirements. It
        organizes decisions so next month's change does not cross the entire
        system. The five principles point in the same direction: clear
        contracts, small roles, and dependencies that do not bind the business
        rule to the detail.
      </ArticleP>

      <ArticleP>
        The best use is selective. Start from the real symptom, pick the
        principle that addresses it, and measure the cost of indirection. When
        the simple design works, it is still the best architecture.
      </ArticleP>
    </>
  );
}
