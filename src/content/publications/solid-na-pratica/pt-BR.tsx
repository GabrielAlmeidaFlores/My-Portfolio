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
  Adapter["PostgresOrderRepository"] -.->|"implementa"| Port`;

const RELATION_CHART = `flowchart TB
  SRP["S: uma razão para mudar"] --> OCP["O: estender sem editar"]
  ISP["I: interfaces por papel"] --> OCP
  LSP["L: subtipo respeita contrato"] --> OCP
  DIP["D: depender de abstração"] --> OCP
  OCP --> Result(["Mudança local, risco menor"])`;

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

export function SolidNaPraticaContentPt() {
  return (
    <>
      <ArticleH2>1. O problema antes das siglas</ArticleH2>

      <ArticleP>
        A cena aparece em code review com frequência: uma classe chamada{" "}
        <ArticleCode>OrderService</ArticleCode> com centenas de linhas. A classe
        valida o formulário, calcula desconto, grava no banco, dispara e-mail,
        registra log e ainda formata a resposta da API.
      </ArticleP>

      <ArticleP>
        Enquanto o sistema é pequeno, a classe parece prática. Tudo está no
        mesmo lugar. O problema começa quando cada área pede uma mudança
        diferente:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Marketing quer um cupom novo. A alteração mexe no cálculo de preço,
          que está no mesmo arquivo da validação de e-mail.
        </ArticleLi>
        <ArticleLi>
          Infra pede troca do provedor de e-mail. O time precisa abrir a classe
          que também salva pedido no banco.
        </ArticleLi>
        <ArticleLi>
          O teste unitário do desconto exige banco, um servidor{" "}
          <TermLink href={SMTP_URL}>SMTP</TermLink> (o protocolo de envio de
          e-mail) e logger reais, porque a classe cria tudo por conta própria.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Esse é o terreno em que{" "}
        <TermLink href={SOLID_URL}>SOLID</TermLink> entra. São cinco princípios
        de design orientado a objetos para reduzir acoplamento e deixar cada
        peça com um papel claro. Não é lei, não é checklist de entrevista e não
        garante arquitetura boa sozinho.
      </ArticleP>

      <ArticleCallout variant="note" title="O que SOLID não é">
        <ArticleP>
          SOLID não pede uma interface para cada classe, nem uma pasta para
          cada função. O objetivo é mudar menos código quando o requisito muda,
          e não criar mais camadas para parecer sofisticado. O próprio Robert
          C. Martin discute limites e má uso em{" "}
          <TermLink href={SOLID_RELEVANCE_URL}>Solid Relevance</TermLink>.
        </ArticleP>
      </ArticleCallout>

      <ArticleCallout variant="note" title="Sobre os exemplos">
        <ArticleP>
          Os exemplos usam tipos de domínio como{" "}
          <ArticleCode>OrderInput</ArticleCode>,{" "}
          <ArticleCode>OrderItem</ArticleCode>, <ArticleCode>Order</ArticleCode>{" "}
          e <ArticleCode>Receipt</ArticleCode>. Eles representam dados comuns de
          pedido e foram omitidos para o foco ficar na estrutura. O código mostra
          a forma da solução, não um projeto completo.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>Conceitos que aparecem no post</ArticleH3>

      <ArticleP>
        Os cinco princípios usam um vocabulário próprio. Vale fixar o
        significado de cada termo antes dos exemplos:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>Acoplamento:</strong> o quanto uma classe precisa conhecer os
          detalhes de outra para funcionar. Exemplo: se trocar o provedor de
          e-mail obriga a editar a classe que salva pedido, as duas estão
          acopladas.
        </ArticleLi>
        <ArticleLi>
          <strong>Coesão:</strong> o quanto os métodos de uma classe pertencem
          ao mesmo assunto. Exemplo: validar e-mail e calcular desconto na mesma
          classe reduz a coesão porque são assuntos diferentes.
        </ArticleLi>
        <ArticleLi>
          <strong>Contrato ou interface:</strong> o conjunto de métodos e
          promessas que um tipo expõe para quem chama. Exemplo:{" "}
          <ArticleCode>PaymentMethod</ArticleCode> promete receber um valor e
          devolver um recibo.
        </ArticleLi>
        <ArticleLi>
          <strong>Polimorfismo:</strong> a mesma chamada executar
          implementações diferentes conforme o tipo. Exemplo:{" "}
          <ArticleCode>checkout.pay(100)</ArticleCode> funciona com Pix, cartão
          ou boleto sem que o checkout conheça cada detalhe.
        </ArticleLi>
        <ArticleLi>
          <strong>Composição:</strong> montar uma classe usando outras classes
          em vez de herdar comportamento. Exemplo:{" "}
          <ArticleCode>CreateOrder</ArticleCode> recebe um repositório e um
          notificador no construtor.
        </ArticleLi>
        <ArticleLi>
          <strong>Responsabilidade e ator:</strong> a responsabilidade é o
          motivo pelo qual a classe muda. O ator é a pessoa ou área que pede
          essa mudança, como financeiro, marketing ou infraestrutura.
        </ArticleLi>
        <ArticleLi>
          <strong>Extensão:</strong> adicionar comportamento novo sem editar o
          código que já funciona. Exemplo: criar{" "}
          <ArticleCode>BoletoPayment</ArticleCode> sem mexer no{" "}
          <ArticleCode>Checkout</ArticleCode>.
        </ArticleLi>
        <ArticleLi>
          <strong>Subtipo e substituição:</strong> um subtipo é uma classe que
          herda de outra. Substituição significa usar o subtipo no lugar da
          classe base sem quebrar o chamador.
        </ArticleLi>
        <ArticleLi>
          <strong>Abstração:</strong> representação mínima do que o chamador
          precisa. Exemplo: <ArticleCode>Shape</ArticleCode> expõe apenas{" "}
          <ArticleCode>area()</ArticleCode>, e não os detalhes de cada figura.
        </ArticleLi>
        <ArticleLi>
          <strong>Over-engineering:</strong> adicionar camadas e abstrações sem
          uma dor concreta. Exemplo: criar interface, fábrica e injeção para um
          script de 80 linhas.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Em cada seção, o primeiro bloco mostra o cheiro no código e o segundo
        mostra a divisão. A pergunta para ler os dois é sempre a mesma: o que
        muda quando o requisito muda?
      </ArticleP>

      <ArticleP>
        Abaixo, os cinco princípios com o mesmo domínio de pedido. Os exemplos
        usam <TermLink href={TYPESCRIPT_URL}>TypeScript</TermLink> porque a
        sintaxe deixa o contrato explícito, mas a ideia vale para Java, C#,
        Kotlin, Python e qualquer linguagem com orientação a objetos.
      </ArticleP>

      <ArticleH2>2. S: Single Responsibility</ArticleH2>

      <ArticleP>
        O{" "}
        <TermLink href={SRP_URL}>Single Responsibility Principle</TermLink>{" "}
        diz que uma classe deve ter uma única razão para mudar. “Razão para
        mudar” aqui significa um ator com interesse próprio no código, como
        financeiro, marketing ou infraestrutura.
      </ArticleP>

      <ArticleP>
        O exemplo abaixo mistura quatro interesses na mesma classe:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`class OrderService {
  async create(input: OrderInput) {
    if (!input.email.includes("@")) {
      throw new Error("email inválido");
    }
    if (input.items.length === 0) {
      throw new Error("pedido vazio");
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
    logger.info("pedido criado: " + order.id);
    return order;
  }
}`}
      </ArticleCode>

      <ArticleP>
        A validação pertence ao fluxo de entrada. O desconto pertence ao
        financeiro. A escrita no banco pertence à persistência. O e-mail
        pertence à comunicação. Quatro times podem pedir mudança, e todos caem
        no mesmo arquivo.
      </ArticleP>

      <ArticleP>
        A separação por responsabilidade deixa o fluxo explícito e permite
        testar o cálculo de preço sem subir banco:
      </ArticleP>

      <ArticleCode block language="typescript">
        {`class OrderValidator {
  validate(input: OrderInput) {
    if (!input.email.includes("@")) {
      throw new Error("email inválido");
    }
    if (input.items.length === 0) {
      throw new Error("pedido vazio");
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
        A interface <ArticleCode>OrderRepository</ArticleCode> aparece de novo
        na seção de inversão de dependência, porque a divisão de
        responsabilidade e a inversão caminham juntas na prática. O{" "}
        <ArticleCode>OrderNotifier</ArticleCode> segue a mesma ideia: o caso de
        uso conhece o contrato, não o provedor de e-mail.
      </ArticleP>

      <ArticleP>
        <strong>Onde exagerar:</strong> transformar cada método em uma classe
        própria cria navegação cansativa e não melhora coesão. O teste é
        simples: se duas responsabilidades sempre mudam pelo mesmo motivo, elas
        podem ficar juntas.
      </ArticleP>

      <ArticleH2>3. O: Open/Closed</ArticleH2>

      <ArticleP>
        O{" "}
        <TermLink href={OCP_URL}>Open/Closed Principle</TermLink> diz que uma
        peça deve estar aberta para extensão e fechada para modificação. Na
        prática, adicionar um comportamento novo não deveria exigir editar uma
        cadeia de condições que já funciona.
      </ArticleP>

      <ArticleP>
        O cheiro clássico é a sequência de <ArticleCode>if</ArticleCode> que
        cresce a cada forma de pagamento:
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
  throw new Error("método não suportado");
}`}
      </ArticleCode>

      <ArticleP>
        Todo meio novo exige alterar a função e testar de novo todos os meios
        antigos. A solução é mover a variação para trás de um contrato comum,
        técnica conhecida como{" "}
        <TermLink href={POLYMORPHISM_URL}>
          substituir condicional por polimorfismo
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
        Para adicionar boleto, basta criar uma classe que implementa{" "}
        <ArticleCode>PaymentMethod</ArticleCode>. O{" "}
        <ArticleCode>Checkout</ArticleCode> não muda e não precisa conhecer a
        lista completa de meios. O teste do checkout usa um pagamento falso sem
        tocar no gateway real.
      </ArticleP>

      <ArticleP>
        <strong>Onde exagerar:</strong> criar a interface antes de existir a
        segunda implementação costuma gerar abstração vazia. A primeira
        variação concreta é o sinal mais honesto de que vale abrir o ponto de
        extensão.
      </ArticleP>

      <ArticleH2>4. L: Liskov</ArticleH2>

      <ArticleP>
        O{" "}
        <TermLink href={LSP_URL}>
          Liskov Substitution Principle
        </TermLink>{" "}
        diz que um subtipo precisa poder substituir o tipo base sem quebrar o
        que o chamador espera. Não é sobre herdar campos. É sobre respeitar o
        contrato de comportamento.
      </ArticleP>

      <ArticleP>
        Um contrato, aqui, é o conjunto de promessas do tipo base. No
        exemplo abaixo, <ArticleCode>Rectangle</ArticleCode> promete aceitar
        largura e altura independentes, calcular a área com os dois valores e
        não lançar exceção para valores válidos. Um subtipo que muda essa regra
        quebra o contrato, mesmo que compile.
      </ArticleP>

      <ArticleP>
        O exemplo clássico mostra por que herança por conveniência engana. Um
        retângulo aceita largura e altura independentes. Um quadrado aceita
        apenas um lado.
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
        Chamar <ArticleCode>resize</ArticleCode> com um retângulo devolve 50.
        Chamar com um quadrado devolve 25, porque o segundo{" "}
        <ArticleCode>set</ArticleCode> sobrescreve o primeiro. O chamador não
        fez nada errado. O subtipo quebrou a expectativa do contrato.
      </ArticleP>

      <ArticleP>
        No dia a dia, o mesmo acontece com um repositório que promete salvar e
        um subtipo que lança exceção para certos dados, ou com um gateway que
        ignora silenciosamente uma cobrança. O chamador confia na interface e
        recebe comportamento diferente.
      </ArticleP>

      <ArticleP>
        Uma saída é remover a herança e tratar cada forma pelo contrato mínimo
        que o chamador realmente usa:
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
        O chamador que só precisa de área recebe qualquer{" "}
        <ArticleCode>Shape</ArticleCode>. Quem precisa alterar dimensões usa o
        tipo concreto e assume as regras daquele tipo.{" "}
        <TermLink href={COMPOSITION_URL}>Composição</TermLink> costuma ser mais
        segura que herança quando os comportamentos divergem.
      </ArticleP>

      <ArticleP>
        <strong>Onde exagerar:</strong> o princípio não proíbe herança. Ele
        proíbe subtipo que mente sobre o contrato. Se a hierarquia não
        sustenta substituição, o desenho está errado, não o chamador.
      </ArticleP>

      <ArticleH2>5. I: Interface Segregation</ArticleH2>

      <ArticleP>
        O{" "}
        <TermLink href={ISP_URL}>
          Interface Segregation Principle
        </TermLink>{" "}
        diz que ninguém deve ser obrigado a depender de métodos que não usa.
        Interfaces gordas empurram implementações vazias e exceções para dentro
        do código.
      </ArticleP>

      <ArticleP>
        O exemplo abaixo força um robô a implementar alimentação e sono:
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
    throw new Error("robô não come");
  }

  sleep() {
    throw new Error("robô não dorme");
  }
}`}
      </ArticleCode>

      <ArticleP>
        Quem recebe um <ArticleCode>Worker</ArticleCode> passa a acreditar que
        pode chamar <ArticleCode>eat</ArticleCode>. O contrato mente. A
        correção é separar por papel, não por entidade:
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
        Funções que só precisam de trabalho recebem{" "}
        <ArticleCode>Workable</ArticleCode>. Funções que só precisam de
        alimentação recebem <ArticleCode>Feedable</ArticleCode>. Cada
        implementação carrega apenas o que faz sentido.
      </ArticleP>

      <ArticleP>
        <strong>Onde exagerar:</strong> uma interface por método vira ruído.
        O critério é o uso do chamador. Se todo consumidor sempre usa os três
        métodos juntos, a interface gorda talvez seja coesa.
      </ArticleP>

      <ArticleH2>6. D: Dependency Inversion</ArticleH2>

      <ArticleP>
        O{" "}
        <TermLink href={DIP_URL}>
          Dependency Inversion Principle
        </TermLink>{" "}
        diz que módulos de alto nível não devem depender de detalhes de baixo
        nível. Ambos dependem de abstrações. No código, a seta de dependência
        aponta para a interface, não para o banco.
      </ArticleP>

      <ArticleP>
        “Depender” significa que uma classe precisa da outra para compilar e
        executar. Se <ArticleCode>CreateOrder</ArticleCode> chama{" "}
        <ArticleCode>new PostgresOrderRepository()</ArticleCode> diretamente,
        CreateOrder depende do detalhe concreto e não consegue rodar sem Postgres.
      </ArticleP>

      <ArticleP>
        O cheiro é a classe de negócio que instancia o concreto. Aqui, o caso
        de uso conhece e cria o banco:
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
        Testar esse caso de uso exige Postgres. Trocar para outro banco exige
        editar a regra de negócio. A inversão coloca a interface no meio:
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
        Na produção, o caso de uso recebe o repositório do Postgres. No teste,
        recebe um{" "}
        <TermLink href={TEST_DOUBLE_URL}>test double</TermLink> em memória, sem
        banco e sem rede:
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
        O desenho fica com a regra de negócio no centro e os detalhes na borda:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="CreateOrder depende da interface OrderRepository; PostgresOrderRepository implementa a interface"
        chart={DIP_CHART}
      />

      <ArticleP>
        <strong>Onde exagerar:</strong> criar uma interface para toda classe
        adiciona indireção sem ganho. A inversão compensa em fronteiras que
        variam ou precisam de teste isolado, como banco, fila, e-mail, gateway
        de pagamento e API externa.
      </ArticleP>

      <ArticleH2>7. Como os cinco se conectam</ArticleH2>

      <ArticleP>
        Os princípios não são ilhas. Separar responsabilidades (S) e dividir
        interfaces por papel (I) deixam claro onde a extensão (O) deve entrar.
        A substituição segura (L) garante que a extensão não quebre o chamador.
        A inversão (D) protege a regra de negócio das mudanças de infraestrutura.
      </ArticleP>

      <ArticleP>
        O diagrama resume essa relação:
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Relação entre os princípios: SRP e ISP alimentam OCP; LSP sustenta a substituição; DIP protege o alto nível"
        chart={RELATION_CHART}
      />

      <ArticleP>
        Na prática, cada princípio responde a um sintoma diferente. A tabela
        abaixo serve como mapa de diagnóstico, não como receita:
      </ArticleP>

      <ArticleTable caption="Sintoma, movimento e custo de cada princípio">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Princípio</ArticleTh>
            <ArticleTh>Sintoma no código</ArticleTh>
            <ArticleTh>Movimento</ArticleTh>
            <ArticleTh>Custo</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>S: responsabilidade única</ArticleTd>
            <ArticleTd>Classe com várias razões para mudar</ArticleTd>
            <ArticleTd>Separar validação, preço, persistência e notificação</ArticleTd>
            <ArticleTd>Mais classes e mais navegação</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>O: aberto e fechado</ArticleTd>
            <ArticleTd>Cadeia de condições que cresce a cada caso</ArticleTd>
            <ArticleTd>Polimorfismo atrás de um contrato</ArticleTd>
            <ArticleTd>Abstração antes da dor pode ser desperdício</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>L: substituição</ArticleTd>
            <ArticleTd>Subtipo que lança exceção ou ignora o contrato</ArticleTd>
            <ArticleTd>Contrato menor, composição ou hierarquia nova</ArticleTd>
            <ArticleTd>Redesenho da hierarquia inteira</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>I: segregação de interface</ArticleTd>
            <ArticleTd>Implementação forçada a dizer “não suportado”</ArticleTd>
            <ArticleTd>Interfaces por papel do chamador</ArticleTd>
            <ArticleTd>Mais tipos e nomes para manter</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>D: inversão de dependência</ArticleTd>
            <ArticleTd>Caso de uso criando banco, fila ou gateway</ArticleTd>
            <ArticleTd>Injeção de interface no limite</ArticleTd>
            <ArticleTd>Uma camada extra de indireção</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH2>8. Quando SOLID atrapalha</ArticleH2>

      <ArticleP>
        SOLID foi pensado para sistemas que mudam e crescem. Aplicado sem
        critério, vira cerimônia. Três cenários comuns de uso ruim:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Script pequeno de migração ou automação: criar interface, fábrica e
          injeção para um arquivo de 80 linhas só aumenta o tempo de leitura sem
          reduzir risco.
        </ArticleLi>
        <ArticleLi>
          Abstração antes do segundo caso: a primeira implementação vira
          contrato definitivo e trava o desenho quando o requisito real aparece.
        </ArticleLi>
        <ArticleLi>
          Separação em camadas sem necessidade: cada chamada atravessa cinco
          arquivos que só repassam parâmetros, e um bug simples exige abrir o
          projeto inteiro.
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        O contraponto saudável é olhar para o custo da mudança. Se o requisito
        é estável e o código é pequeno, o desenho simples entrega mais valor.
        Se o ponto muda toda semana, vale investir no contrato.
      </ArticleP>

      <ArticleCallout variant="tip" title="Checklist rápido de aplicação">
        <ArticleUl>
          <ArticleLi>
            A classe tem mais de uma razão real para mudar? Separe por ator.
          </ArticleLi>
          <ArticleLi>
            Cada caso novo exige editar o mesmo bloco condicional? Abra um
            ponto de extensão.
          </ArticleLi>
          <ArticleLi>
            Algum subtipo quebra o que a interface promete? Reveja ou remova a
            herança.
          </ArticleLi>
          <ArticleLi>
            Alguma implementação é obrigada a lançar “não suportado”? Divida a
            interface por uso.
          </ArticleLi>
          <ArticleLi>
            A regra de negócio cria infraestrutura diretamente? Inverta a
            dependência no limite.
          </ArticleLi>
        </ArticleUl>
      </ArticleCallout>

      <ArticleH3>Pontos-chave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          SOLID é um conjunto de critérios para reduzir impacto de mudança, não
          uma obrigação de criar camadas.
        </ArticleLi>
        <ArticleLi>
          S separa por ator que pede mudança. Se tudo muda pelo mesmo motivo,
          não há ganho em dividir.
        </ArticleLi>
        <ArticleLi>
          O troca condicional crescente por polimorfismo, mas só quando a
          segunda variação real aparece.
        </ArticleLi>
        <ArticleLi>
          L exige contrato de comportamento, não apenas herança de campos. Um
          subtipo que lança exceção inesperada já viola o princípio.
        </ArticleLi>
        <ArticleLi>
          I divide interfaces pelo uso do chamador e evita implementações que
          mentem sobre o que suportam.
        </ArticleLi>
        <ArticleLi>
          D move a dependência de banco, fila e gateway para interfaces,
          deixando a regra de negócio testável e estável.
        </ArticleLi>
        <ArticleLi>
          Aplique onde há dor concreta. Código pequeno e estável ganha mais com
          simplicidade.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusão</ArticleH3>

      <ArticleP>
        SOLID não substitui conversa sobre requisito. SOLID organiza decisões
        para que a mudança do mês que vem não atravesse o sistema inteiro. Os
        cinco princípios apontam para a mesma direção: contratos claros, papéis
        pequenos e dependências que não prendem a regra de negócio ao detalhe.
      </ArticleP>

      <ArticleP>
        O melhor uso é seletivo. Comece pelo sintoma real, escolha o princípio
        que ataca aquele sintoma e meça o custo da indireção. Quando o desenho
        simples resolve, o desenho simples continua sendo a melhor arquitetura.
      </ArticleP>
    </>
  );
}
