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

const ORDER_CHART = `flowchart LR
  A["1. Usuario + chave"] --> B["2. SSH + sudo"]
  B --> C["3. Firewall + sysctl"]
  C --> D["4. Tempo + MAC"]
  D --> E["5. Updates + fail2ban"]
  E --> F["6. Cortar + verificar"]`;

const linkClass =
  "font-semibold text-primary-600 underline-offset-2 hover:underline dark:text-primary-300";

const OPENSSH_URL = "https://www.openssh.com/manual.html";
const SSHD_CONFIG_URL = "https://man.openbsd.org/sshd_config";
const UFW_URL = "https://help.ubuntu.com/community/UFW";
const FIREWALLD_URL = "https://firewalld.org/documentation/";
const FAIL2BAN_URL = "https://www.fail2ban.org/wiki/index.php/Main_Page";
const CIS_URL = "https://www.cisecurity.org/cis-benchmarks";
const UNATTENDED_URL = "https://wiki.debian.org/UnattendedUpgrades";
const DNF_AUTO_URL =
  "https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/managing_software_with_the_dnf_tool/assembly_automating-software-updates_managing-software-with-the-dnf-tool";
const SYSCTL_URL = "https://man7.org/linux/man-pages/man8/sysctl.8.html";
const CHRONY_URL = "https://chrony-project.org/documentation.html";
const APPARMOR_URL = "https://apparmor.net/";
const SELINUX_URL =
  "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_selinux/index";
const AUDITD_URL = "https://man7.org/linux/man-pages/man8/auditd.8.html";
const LYNIS_URL = "https://cisofy.com/lynis/";
const SUDOERS_URL = "https://www.sudo.ws/docs/man/sudoers.man/";

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

export function HardeningLinuxVpsBaselineContentPt() {
  return (
    <>
      <ArticleH2>1. O que este post cobre</ArticleH2>

      <ArticleP>
        Este post é um{" "}
        <strong>baseline de hardening</strong> para o dia 1-2 de uma VPS
        Linux. Hardening aqui significa reduzir a superfície de ataque do
        host: quem entra, o que a rede deixa passar, como o kernel se
        comporta, e o que continua rodando sem supervisão.
      </ArticleP>

      <ArticleP>
        Para cada controle você encontra o mesmo formato:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>O que é</strong> e <strong>para que serve</strong>
        </ArticleLi>
        <ArticleLi>
          <strong>Se não configurar</strong>: como costuma ser explorado
        </ArticleLi>
        <ArticleLi>
          <strong>Como configurar</strong>: comandos e parâmetros explicados
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Escopo: identidade (SSH/sudo), perímetro (firewall/sysctl), host
        (tempo, MAC, filesystem, auditd), manutenção (updates, fail2ban,
        verificação). Distro-agnóstico, com pares Debian/Ubuntu e
        RHEL/Rocky/Alma onde a ferramenta muda.
      </ArticleP>

      <ArticleP>
        Fora do escopo:{" "}
        <TermLink href={CIS_URL}>CIS Benchmark</TermLink> completo de
        auditoria corporativa, e hardening de container/Kubernetes. Isso é
        fase 2, depois do baseline vivo.
      </ArticleP>

      <ArticleP>
        Ordem segura (evita se trancar fora e fecha o que mais importa
        primeiro):
      </ArticleP>

      <ArticleOl>
        <ArticleLi>Usuário com sudo + chave SSH</ArticleLi>
        <ArticleLi>Endurecer sshd e sudo</ArticleLi>
        <ArticleLi>Firewall + sysctl</ArticleLi>
        <ArticleLi>Tempo + MAC + filesystem + auditd</ArticleLi>
        <ArticleLi>Updates + fail2ban</ArticleLi>
        <ArticleLi>Cortar serviços inúteis + verificar</ArticleLi>
      </ArticleOl>

      <ArticleMermaid
        ariaLabel="Ordem segura de hardening do dia 1 ao 2"
        chart={ORDER_CHART}
      />

      <ArticleCallout variant="tip" title="Quer só o checklist?">
        <ArticleP>
          Vá direto para a{" "}
          <a href="#7-checklist-na-ordem-certa" className={linkClass}>
            seção 7
          </a>
          . As seções 2 a 6 explicam cada controle.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>2. Inventário antes de endurecer</ArticleH2>

      <ArticleP>
        <strong>O que é:</strong> um inventário rápido do host: quem está
        logado, quais portas escutam, quais serviços rodam, se o firewall e
        o relógio estão ok, e se a proteção MAC está ativa.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> você só fecha o que enxerga. Sem
        inventário, o hardening vira checklist cego e deixa serviço ou porta
        esquecidos.
      </ArticleP>

      <ArticleP>
        <strong>Se não fizer:</strong> um painel, banco ou agente da imagem
        cloud continua escutando na internet. Atacantes varrem portas o dia
        inteiro; o que estiver aberto vira tentativa automática.
      </ArticleP>

      <ArticleP>
        <strong>Como rodar:</strong> cada comando responde uma pergunta.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>whoami; id</ArticleCode>: quem está logado e se a
          conta tem poder de administrador
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ss -tulpn</ArticleCode>: quais portas estão abertas e
          qual programa usa cada uma
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>systemctl list-units …</ArticleCode>: serviços rodando
          agora
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ufw</ArticleCode> /{" "}
          <ArticleCode>firewall-cmd</ArticleCode>: se o firewall está ativo e
          o que deixa passar
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>timedatectl</ArticleCode>: se o relógio está
          sincronizado (logs e HTTPS dependem disso)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>aa-status</ArticleCode> (Debian/Ubuntu) ou{" "}
          <ArticleCode>getenforce</ArticleCode> (RHEL): se{" "}
          <TermLink href={APPARMOR_URL}>AppArmor</TermLink> ou{" "}
          <TermLink href={SELINUX_URL}>SELinux</TermLink> está ligado de
          verdade
        </ArticleLi>
      </ArticleUl>

      <ArticleCode block>
        {`whoami; id
ss -tulpn
systemctl list-units --type=service --state=running
sudo ufw status verbose 2>/dev/null || sudo firewall-cmd --list-all 2>/dev/null
timedatectl
aa-status 2>/dev/null | head
getenforce 2>/dev/null`}
      </ArticleCode>

      <ArticleCallout variant="note" title="Distro-agnóstico">
        <ArticleP>
          Princípios iguais. Onde a ferramenta muda:{" "}
          <TermLink href={UFW_URL}>UFW</TermLink> vs{" "}
          <TermLink href={FIREWALLD_URL}>firewalld</TermLink>,{" "}
          <ArticleCode>apt</ArticleCode> vs <ArticleCode>dnf</ArticleCode>,{" "}
          <TermLink href={APPARMOR_URL}>AppArmor</TermLink> vs{" "}
          <TermLink href={SELINUX_URL}>SELinux</TermLink>.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. Identidade e acesso</ArticleH2>

      <ArticleP>
        Controle de <strong>quem</strong> pode entrar no host e com{" "}
        <strong>quais privilégios</strong>. Ordem correta: usuário com sudo,
        depois chave SSH, depois endurecer{" "}
        <TermLink href={OPENSSH_URL}>sshd</TermLink> e{" "}
        <TermLink href={SUDOERS_URL}>sudo</TermLink>. Só então corte login
        root e senha.
      </ArticleP>

      <ArticleH3>Usuário com sudo (não root no dia a dia)</ArticleH3>

      <ArticleP>
        <strong>O que é:</strong> uma conta de operador (ex.:{" "}
        <ArticleCode>deploy</ArticleCode>) no grupo{" "}
        <ArticleCode>sudo</ArticleCode> (Debian/Ubuntu) ou{" "}
        <ArticleCode>wheel</ArticleCode> (RHEL), em vez de trabalhar como
        root o tempo todo.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> separar login remoto do root e
        permitir desligar <ArticleCode>PermitRootLogin</ArticleCode> sem
        perder acesso administrativo.
      </ArticleP>

      <ArticleP>
        <strong>Se não configurar:</strong> o único caminho de entrada é
        root. Qualquer vazamento de senha root, ou descuido ao endurecer
        sshd, trava você fora ou entrega a máquina inteira.
      </ArticleP>

      <ArticleP>
        <strong>Como configurar:</strong>
      </ArticleP>

      <ArticleP>Debian/Ubuntu:</ArticleP>
      <ArticleCode block>
        {`adduser deploy
usermod -aG sudo deploy`}
      </ArticleCode>

      <ArticleP>RHEL/Rocky/Alma:</ArticleP>
      <ArticleCode block>
        {`useradd -m deploy
passwd deploy
usermod -aG wheel deploy`}
      </ArticleCode>

      <ArticleH3>Chave SSH antes de desligar senha</ArticleH3>

      <ArticleP>
        <strong>O que é:</strong> autenticação por par de chaves (privada no
        notebook, pública em{" "}
        <ArticleCode>~/.ssh/authorized_keys</ArticleCode> no servidor), no
        lugar de senha no{" "}
        <TermLink href={OPENSSH_URL}>SSH</TermLink>.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> eliminar força bruta de senha na
        porta SSH. Sem senha aceita, o bot que só testa senhas comuns não
        entra.
      </ArticleP>

      <ArticleP>
        <strong>Se não configurar:</strong> senha fraca ou vazada na porta
        22 é o caminho mais comum de comprometimento de VPS. Scanners não
        param.
      </ArticleP>

      <ArticleP>
        <strong>Como configurar:</strong> no notebook, gerar chave e copiar
        a pública. Confirme login por chave numa sessão nova. Só depois
        desligue senha no sshd. Permissões:{" "}
        <ArticleCode>~/.ssh</ArticleCode> em <ArticleCode>700</ArticleCode>,{" "}
        <ArticleCode>authorized_keys</ArticleCode> em{" "}
        <ArticleCode>600</ArticleCode>.
      </ArticleP>

      <ArticleCode block>
        {`ssh-keygen -t ed25519 -C "vps-deploy"
ssh-copy-id deploy@SEU_IP`}
      </ArticleCode>

      <ArticleH3>Endurecer sshd</ArticleH3>

      <ArticleP>
        <strong>O que é:</strong> o daemon{" "}
        <TermLink href={OPENSSH_URL}>OpenSSH</TermLink> (
        <ArticleCode>sshd</ArticleCode>), configurado em{" "}
        <TermLink href={SSHD_CONFIG_URL}>sshd_config</TermLink> (ou drop-in
        em <ArticleCode>/etc/ssh/sshd_config.d/</ArticleCode>).
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> definir quem pode tentar login, se
        senha e root remoto estão liberados, e limites de tentativa.
      </ArticleP>

      <ArticleP>
        <strong>Se não configurar:</strong> root com senha na 22, senha
        habilitada, e qualquer usuário local tentando SSH. Bots e força
        bruta aproveitam o default da imagem.
      </ArticleP>

      <ArticleCallout variant="warning" title="Antes de reiniciar o sshd">
        <ArticleP>
          Mantenha uma sessão SSH aberta e testada. Rode{" "}
          <ArticleCode>sshd -t</ArticleCode> depois de editar. Só então
          reload. Se a config falhar, a sessão antiga ainda salva o acesso.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        <strong>Parâmetros do baseline:</strong>
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>PermitRootLogin no</ArticleCode>: ninguém entra como
          root direto pelo SSH
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>PasswordAuthentication no</ArticleCode>: senha no SSH
          desligada; só chave
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>PubkeyAuthentication yes</ArticleCode>: login por
          chave liberado
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>KbdInteractiveAuthentication no</ArticleCode>: fecha
          outro caminho de senha interativa
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>X11Forwarding no</ArticleCode>: não encaminha interface
          gráfica (desnecessário na VPS)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>AllowUsers deploy</ArticleCode>: só essa conta tenta
          SSH (troque pelo seu usuário)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>MaxAuthTries</ArticleCode> /{" "}
          <ArticleCode>LoginGraceTime</ArticleCode>: menos tentativas e menos
          tempo parado na porta de login
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ClientAliveInterval</ArticleCode> /{" "}
          <ArticleCode>ClientAliveCountMax</ArticleCode>: fecha sessão
          abandonada
        </ArticleLi>
      </ArticleUl>

      <ArticleCode block>
        {`PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
KbdInteractiveAuthentication no
X11Forwarding no
AllowUsers deploy
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2`}
      </ArticleCode>

      <ArticleP>Debian/Ubuntu:</ArticleP>
      <ArticleCode block>
        {`sudo sshd -t && sudo systemctl reload ssh`}
      </ArticleCode>

      <ArticleP>RHEL family:</ArticleP>
      <ArticleCode block>
        {`sudo sshd -t && sudo systemctl reload sshd`}
      </ArticleCode>

      <ArticleH3>Sudo com freio</ArticleH3>

      <ArticleP>
        <strong>O que é:</strong>{" "}
        <TermLink href={SUDOERS_URL}>sudo</TermLink> eleva privilégio de um
        usuário comum para root, com regras em{" "}
        <ArticleCode>/etc/sudoers</ArticleCode> ou{" "}
        <ArticleCode>/etc/sudoers.d/</ArticleCode>.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> permitir administração sem login
        root permanente, com auditoria e (idealmente) autenticação na
        elevação.
      </ArticleP>

      <ArticleP>
        <strong>Se não configurar bem:</strong>{" "}
        <ArticleCode>NOPASSWD:ALL</ArticleCode> “pra facilitar o CI” vira
        root imediato se a conta cair. Edição errada de sudoers sem{" "}
        <ArticleCode>visudo</ArticleCode> pode travar elevação de privilégio.
      </ArticleP>

      <ArticleP>
        <strong>Como configurar:</strong> prefira senha no sudo (ou
        autenticação forte) e regras estreitas em{" "}
        <ArticleCode>/etc/sudoers.d/</ArticleCode>. Sempre edite com{" "}
        <ArticleCode>visudo</ArticleCode>.
      </ArticleP>

      <ArticleH3>Mudar a porta SSH?</ArticleH3>

      <ArticleP>
        <strong>O que é:</strong> trocar a porta padrão 22 por outra (ex.:
        2222).
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> reduz barulho no log. Não é
        controle real de segurança.
      </ArticleP>

      <ArticleP>
        <strong>Se só mudar a porta e nada mais:</strong> bots escaneiam
        portas. A barreira real é chave + sem senha + sem root +{" "}
        <ArticleCode>AllowUsers</ArticleCode>. Trate porta custom como
        higiene de sinal, não como defesa principal.
      </ArticleP>

      <ArticleH2>4. Rede e perímetro</ArticleH2>

      <ArticleP>
        Controle do <strong>que a internet consegue alcançar</strong> no
        host (firewall) e de <strong>como o kernel trata pacotes</strong>{" "}
        (<TermLink href={SYSCTL_URL}>sysctl</TermLink>).
      </ArticleP>

      <ArticleH3>
        Firewall: <TermLink href={UFW_URL}>UFW</TermLink> (Debian/Ubuntu)
      </ArticleH3>

      <ArticleP>
        <strong>O que é:</strong>{" "}
        <TermLink href={UFW_URL}>UFW</TermLink> (Uncomplicated Firewall) é
        uma frente simples sobre as regras de firewall do sistema.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> default-deny na entrada. Só abre o
        que o produto precisa (quase sempre SSH + 80/443).
      </ArticleP>

      <ArticleP>
        <strong>Se não configurar:</strong> qualquer serviço em{" "}
        <ArticleCode>0.0.0.0</ArticleCode> (escutando em todas as
        interfaces, inclusive a pública) fica alcançável. Atacantes varrem
        portas; o que estiver aberto vira tentativa automática.
      </ArticleP>

      <ArticleP>
        <strong>Como configurar:</strong> negar entrada por padrão, liberar
        SSH e HTTP/HTTPS, só então ativar. Libere SSH{" "}
        <strong>antes</strong> de <ArticleCode>ufw enable</ArticleCode>.
      </ArticleP>

      <ArticleCode block>
        {`sudo apt update && sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
# se mudou a porta: sudo ufw allow 2222/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose`}
      </ArticleCode>

      <ArticleH3>
        Firewall: <TermLink href={FIREWALLD_URL}>firewalld</TermLink>{" "}
        (RHEL family)
      </ArticleH3>

      <ArticleP>
        <strong>O que é:</strong>{" "}
        <TermLink href={FIREWALLD_URL}>firewalld</TermLink> é o firewall
        padrão na família RHEL. O papel é o mesmo do UFW: controlar o que
        entra.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve / se não tiver:</strong> iguais ao UFW.
        Sem default-deny, serviço exposto = superfície na internet.
      </ArticleP>

      <ArticleP>
        <strong>Como configurar:</strong> adicione serviços (ssh, http,
        https) e aplique com reload.
      </ArticleP>

      <ArticleCode block>
        {`sudo dnf install -y firewalld
sudo systemctl enable --now firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
sudo firewall-cmd --list-all`}
      </ArticleCode>

      <ArticleCallout variant="warning" title="Não se trave fora">
        <ArticleP>
          Libere SSH antes de ativar o firewall. Se a porta não for 22,
          permita essa porta explicitamente. Confirme numa segunda sessão
          antes de fechar a primeira.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>
        <TermLink href={SYSCTL_URL}>sysctl</TermLink> de rede (baseline)
      </ArticleH3>

      <ArticleP>
        <strong>O que é:</strong>{" "}
        <TermLink href={SYSCTL_URL}>sysctl</TermLink> lê e muda parâmetros
        do kernel (rede, memória, segurança básica). O firewall corta
        tráfego nas portas. O sysctl muda como o sistema trata pacotes e
        informações sensíveis.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> anti-spoofing básico, mitigação de
        SYN flood, bloquear redirects e source route perigosos, e reduzir
        vazamento de informação do kernel.
      </ArticleP>

      <ArticleP>
        <strong>Se não configurar:</strong> a imagem cloud aceita
        comportamentos de rede que um atacante na mesma rede (ou em cenários
        de roteamento) pode abusar. Também facilita coleta de endereços
        internos do kernel para exploit local.
      </ArticleP>

      <ArticleP>
        <strong>O que cada grupo faz:</strong>
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>rp_filter</ArticleCode>: rejeita pacotes que chegam
          pela interface “errada” (anti-spoofing básico de IP)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>tcp_syncookies</ArticleCode>: ajuda a sobreviver a
          enxurrada de conexões falsas (SYN flood)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>accept_redirects</ArticleCode> /{" "}
          <ArticleCode>send_redirects</ArticleCode> em 0: o host não segue
          nem espalha atalhos de rota forjados
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>accept_source_route</ArticleCode> em 0: impede que o
          pacote diga por quais caminhos deve viajar
        </ArticleLi>
        <ArticleLi>
          IPv6 com redirects desligados: mesma ideia do IPv4
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>kptr_restrict</ArticleCode> e{" "}
          <ArticleCode>dmesg_restrict</ArticleCode>: dificultam ver endereços
          internos do kernel e o log do boot sem privilégio
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>protected_hardlinks</ArticleCode> /{" "}
          <ArticleCode>protected_symlinks</ArticleCode>: reduzem truques com
          links em pastas compartilhadas (ex.:{" "}
          <ArticleCode>/tmp</ArticleCode>)
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Coloque em{" "}
        <ArticleCode>/etc/sysctl.d/99-hardening.conf</ArticleCode> (o{" "}
        <ArticleCode>99-</ArticleCode> só garante ordem depois de outros
        defaults) e aplique:
      </ArticleP>

      <ArticleCode block>
        {`net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0
kernel.kptr_restrict = 2
kernel.dmesg_restrict = 1
fs.protected_hardlinks = 1
fs.protected_symlinks = 1`}
      </ArticleCode>

      <ArticleCode block>{`sudo sysctl --system`}</ArticleCode>

      <ArticleP>
        IPv6: se você <strong>não</strong> usa, desabilite ou filtre de
        propósito. Deixar IPv6 ligado e esquecido com IPv4 fechado é buraco
        clássico. Se usa IPv6, trate no firewall como trata IPv4.
      </ArticleP>

      <ArticleP>
        Banco, Redis, painel admin: se não precisam da internet pública, faça
        o serviço escutar só em <ArticleCode>localhost</ArticleCode> ou numa
        rede privada.
      </ArticleP>

      <ArticleH2>5. Host: tempo, MAC, filesystem e audit</ArticleH2>

      <ArticleP>
        Controles do “miolo” da máquina: relógio, trava extra de processos
        (MAC), higiene de pastas e trilha de auditoria.
      </ArticleP>

      <ArticleH3>
        Tempo com <TermLink href={CHRONY_URL}>chrony</TermLink>
      </ArticleH3>

      <ArticleP>
        <strong>O que é:</strong>{" "}
        <TermLink href={CHRONY_URL}>chrony</TermLink> sincroniza o relógio
        do Linux com servidores de tempo (NTP).
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> logs com horário certo, HTTPS/TLS
        válidos, tokens e autenticação que dependem de tempo alinhado.
      </ArticleP>

      <ArticleP>
        <strong>Se não configurar:</strong> o atacante não “quebra” o NTP.
        O time sofre sozinho: não cruza eventos no incidente, certificado
        parece inválido, e alguém desliga proteção “só pra voltar”.
      </ArticleP>

      <ArticleP>
        <strong>Como configurar:</strong> instalar, habilitar no boot,
        confirmar com <ArticleCode>timedatectl</ArticleCode>.
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y chrony
sudo systemctl enable --now chrony

# RHEL family
sudo dnf install -y chrony
sudo systemctl enable --now chronyd

timedatectl status`}
      </ArticleCode>

      <ArticleH3>
        MAC: <TermLink href={APPARMOR_URL}>AppArmor</TermLink> /{" "}
        <TermLink href={SELINUX_URL}>SELinux</TermLink>
      </ArticleH3>

      <ArticleP>
        <strong>O que é:</strong> Mandatory Access Control. Além do usuário
        Linux tradicional, o sistema define o que cada programa pode tocar.
        No Ubuntu costuma ser{" "}
        <TermLink href={APPARMOR_URL}>AppArmor</TermLink>. No RHEL/Rocky/Alma
        costuma ser <TermLink href={SELINUX_URL}>SELinux</TermLink>.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> conter um serviço comprometido
        (web, banco, painel). Sem MAC, o processo invadido herda permissões
        amplas.
      </ArticleP>

      <ArticleP>
        <strong>Se não configurar (ou deixar frouxo):</strong> imagem cloud
        em modo permissive, ou alguém desliga tudo porque “o app não subiu”.
        O atacante que já entrou no processo ganha liberdade que não
        deveria ter.
      </ArticleP>

      <ArticleP>
        <strong>Como configurar no dia 1:</strong> não escreva policy do
        zero. Confirme que está ligado de verdade:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Debian/Ubuntu: <ArticleCode>aa-status</ArticleCode> (AppArmor
          ativo e perfis em enforce)
        </ArticleLi>
        <ArticleLi>
          RHEL: <ArticleCode>getenforce</ArticleCode> deve mostrar{" "}
          <ArticleCode>Enforcing</ArticleCode>.{" "}
          <ArticleCode>Permissive</ArticleCode> só registra e não bloqueia
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Se um app quebra com MAC ligado, ajuste a exceção daquele app. Não
        desligue o MAC inteiro da máquina.
      </ArticleP>

      <ArticleH3>Filesystem e permissões básicas</ArticleH3>

      <ArticleP>
        <strong>O que é:</strong> higiene de pastas e permissões: sticky bit
        em tmp, evitar <ArticleCode>chmod 777</ArticleCode>, e (quando
        possível) <ArticleCode>noexec,nosuid,nodev</ArticleCode> em
        temporários.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> limitar o que um processo já
        dentro da máquina consegue gravar e executar.
      </ArticleP>

      <ArticleP>
        <strong>Se não configurar:</strong> malware grava em{" "}
        <ArticleCode>/tmp</ArticleCode>, executa dali, ou sobrescreve
        arquivo em pasta compartilhada. “Libera permissão total pra
        funcionar” entrega escrita em lugar sensível.
      </ArticleP>

      <ArticleP>
        <strong>O que olhar no baseline:</strong>
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>/tmp</ArticleCode> e{" "}
          <ArticleCode>/var/tmp</ArticleCode>: sticky bit; se o workload
          permitir, <ArticleCode>noexec,nosuid,nodev</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Pastas world-writable fora do tmp:{" "}
          <ArticleCode>{`find / -xdev -type d -perm -0002 2>/dev/null`}</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Home e chaves SSH: umask razoável; nada de{" "}
          <ArticleCode>chmod 777</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Partições separadas (<ArticleCode>/var</ArticleCode>,{" "}
          <ArticleCode>/home</ArticleCode>) ajudam se um disco encher; use se
          o provedor oferecer
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        <TermLink href={AUDITD_URL}>auditd</TermLink> (mínimo)
      </ArticleH3>

      <ArticleP>
        <strong>O que é:</strong>{" "}
        <TermLink href={AUDITD_URL}>auditd</TermLink> registra eventos de
        segurança (login, sudo, alteração de arquivo sensível).
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> ter trilha depois do incidente:
        o que mudou, quem mudou, quando.
      </ArticleP>

      <ArticleP>
        <strong>Se não configurar:</strong> o atacante limpa rastros
        básicos ou o time não tem o que correlacionar. Sem evidência,
        resposta vira feeling.
      </ArticleP>

      <ArticleP>
        <strong>Como configurar no dia 1:</strong> deixe o daemon ativo.
        Regras CIS completas são fase 2.
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y auditd
sudo systemctl enable --now auditd

# RHEL family
sudo dnf install -y audit
sudo systemctl enable --now auditd`}
      </ArticleCode>

      <ArticleH2>6. Manutenção, detecção e verificação</ArticleH2>

      <ArticleP>
        Controles que mantêm o hardening vivo depois do dia 1: patch,
        contenção de abuso, menos superfície e verificação.
      </ArticleP>

      <ArticleH3>Updates de segurança</ArticleH3>

      <ArticleP>
        <strong>O que é:</strong> atualização automática (ou pelo menos
        avisada) de pacotes de segurança. No Debian/Ubuntu:{" "}
        <TermLink href={UNATTENDED_URL}>unattended-upgrades</TermLink>. Na
        família RHEL:{" "}
        <TermLink href={DNF_AUTO_URL}>dnf-automatic</TermLink>.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> fechar CVEs conhecidos sem depender
        de “quando der”.
      </ArticleP>

      <ArticleP>
        <strong>Se não configurar:</strong> o atacante não precisa ser
        criativo. Basta scanner + versão atrasada.
      </ArticleP>

      <ArticleP>
        <strong>Como configurar:</strong>
      </ArticleP>

      <ArticleP>Debian/Ubuntu:</ArticleP>
      <ArticleCode block>
        {`sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades`}
      </ArticleCode>

      <ArticleP>RHEL family:</ArticleP>
      <ArticleCode block>
        {`sudo dnf install -y dnf-automatic
sudo systemctl enable --now dnf-automatic.timer`}
      </ArticleCode>

      <ArticleP>
        Update de kernel sem reboot planejado não aplica de verdade: o
        processo antigo continua na memória.
      </ArticleP>

      <ArticleH3>
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink>
      </ArticleH3>

      <ArticleP>
        <strong>O que é:</strong>{" "}
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink> lê logs de falha
        e bloqueia o IP por um tempo.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> contenção de força bruta e ruído
        (SSH, painel, mail, etc.). Não substitui chave SSH.
      </ArticleP>

      <ArticleP>
        <strong>Se não configurar:</strong> a porta toma tentativa
        automática o dia inteiro. Em serviços com senha, a força bruta
        continua até achar credencial fraca.
      </ArticleP>

      <ArticleP>
        <strong>Como configurar:</strong>
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y fail2ban

# RHEL family (EPEL conforme a distro)
sudo dnf install -y fail2ban
sudo systemctl enable --now fail2ban`}
      </ArticleCode>

      <ArticleH3>Cortar serviços que não pediu</ArticleH3>

      <ArticleP>
        <strong>O que é:</strong> desabilitar o que a imagem cloud subiu e
        o produto não usa (agente, demo, painel).
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> menos processo = menos porta, menos
        CVE, menos credencial.
      </ArticleP>

      <ArticleP>
        <strong>Se não cortar:</strong> superfície “de brinde” fica na
        internet sem ninguém olhar.
      </ArticleP>

      <ArticleP>
        <strong>Como fazer:</strong> liste o que escuta e o que roda. Se
        não é do produto e não é dependência, desabilite.
      </ArticleP>

      <ArticleCode block>
        {`ss -tulpn
systemctl list-units --type=service --state=running`}
      </ArticleCode>

      <ArticleH3>Logs que importam</ArticleH3>

      <ArticleP>
        <strong>O que é:</strong> saber onde olhar quando algo cheira mal.
        Não é SIEM no dia 1.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve / se não olhar:</strong> hardening sem log é
        fé. Sem trilha, você não confirma se o controle está funcionando nem
        o que aconteceu no incidente.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          SSH: <ArticleCode>journalctl -u ssh</ArticleCode> /{" "}
          <ArticleCode>sshd</ArticleCode> ou{" "}
          <ArticleCode>/var/log/auth.log</ArticleCode>
        </ArticleLi>
        <ArticleLi>firewall / fail2ban: o que foi bloqueado</ArticleLi>
        <ArticleLi>
          updates: última corrida do unattended / dnf-automatic
        </ArticleLi>
        <ArticleLi>
          audit: <ArticleCode>ausearch</ArticleCode> /{" "}
          <ArticleCode>aureport</ArticleCode>
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        Verificar com <TermLink href={LYNIS_URL}>Lynis</TermLink>
      </ArticleH3>

      <ArticleP>
        <strong>O que é:</strong>{" "}
        <TermLink href={LYNIS_URL}>Lynis</TermLink> é um scanner de higiene
        do host: percorre a máquina e lista o que está frouxo.
      </ArticleP>

      <ArticleP>
        <strong>Para que serve:</strong> medir o que você esqueceu (serviço
        ligado, permissão errada, update parado). Não é caçar 400 findings
        CIS no dia 1.
      </ArticleP>

      <ArticleP>
        <strong>Se não verificar:</strong> “endureci” vira sensação, não
        baseline.
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y lynis
sudo lynis audit system

# RHEL family
sudo dnf install -y lynis
sudo lynis audit system`}
      </ArticleCode>

      <ArticleCallout variant="note" title="Backup também é controle">
        <ArticleP>
          Snapshot do provedor + backup do que importa (dados,{" "}
          <ArticleCode>/etc</ArticleCode>, chaves fora da VPS). Hardening
          sem recuperação é só metade do trabalho.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>7. Checklist na ordem certa</ArticleH2>

      <ArticleP>
        Aplique nesta ordem. Cada passo depende do anterior para não se
        trancar fora.
      </ArticleP>

      <ArticleOl>
        <ArticleLi>Criar usuário com sudo/wheel e testar login</ArticleLi>
        <ArticleLi>
          Instalar chave SSH (perms 700/600) e testar numa segunda sessão
        </ArticleLi>
        <ArticleLi>
          Endurecer sshd (sem root/senha, AllowUsers, MaxAuthTries),{" "}
          <ArticleCode>sshd -t</ArticleCode>, reload
        </ArticleLi>
        <ArticleLi>
          Revisar sudoers (sem <ArticleCode>NOPASSWD:ALL</ArticleCode> largo)
        </ArticleLi>
        <ArticleLi>
          Firewall default-deny; liberar SSH (+ HTTP/S se preciso); ativar
        </ArticleLi>
        <ArticleLi>
          Aplicar sysctl; decidir IPv6 de propósito
        </ArticleLi>
        <ArticleLi>
          chrony/NTP ok; AppArmor enforce / SELinux Enforcing
        </ArticleLi>
        <ArticleLi>auditd ativo; tmp e permissões básicas ok</ArticleLi>
        <ArticleLi>
          Updates de segurança + fail2ban; cortar serviços inúteis
        </ArticleLi>
        <ArticleLi>
          Lynis (ou equivalente) + snapshot/backup; confirmar inventário
        </ArticleLi>
      </ArticleOl>

      <ArticleTable caption="Anti-padrões comuns em VPS">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Anti-padrão</ArticleTh>
            <ArticleTh>Por que dói</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Root + senha na 22 “só hoje”</ArticleTd>
            <ArticleTd>Bots não respeitam calendário</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Firewall depois do deploy</ArticleTd>
            <ArticleTd>Depois = nunca; a app já expôs porta</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Mudar só a porta SSH</ArticleTd>
            <ArticleTd>Higiene de log, não controle</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Reload sshd sem sessão backup</ArticleTd>
            <ArticleTd>Um typo e você perdeu o servidor</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>NOPASSWD:ALL no sudo</ArticleTd>
            <ArticleTd>Conta comprometida = root imediato</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>IPv6 ligado e esquecido</ArticleTd>
            <ArticleTd>Bypass silencioso do firewall IPv4</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>SELinux/AppArmor em permissive eterno</ArticleTd>
            <ArticleTd>Custo sem o benefício do bloqueio</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Updates manuais eternos</ArticleTd>
            <ArticleTd>CVE conhecido vira incidente previsível</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>“Endureci” sem Lynis/inventário</ArticleTd>
            <ArticleTd>Sensação de segurança ≠ baseline</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH3>Pontos-chave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Cada controle: o que é, para que serve, o que acontece se faltar,
          e como configurar.
        </ArticleLi>
        <ArticleLi>
          Ordem importa: usuário, chave, sshd/sudo, firewall/sysctl,
          tempo/MAC, updates, verificar.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={OPENSSH_URL}>OpenSSH</TermLink> com chave,
          AllowUsers e sem senha/root vale mais que trocar a porta.
        </ArticleLi>
        <ArticleLi>
          Firewall + <TermLink href={SYSCTL_URL}>sysctl</TermLink> +
          decisão explícita de IPv6.
        </ArticleLi>
        <ArticleLi>
          Tempo (chrony), MAC (AppArmor/SELinux) e auditd são host, não
          opcional.
        </ArticleLi>
        <ArticleLi>
          Updates + fail2ban + cortar serviços + Lynis + backup fecham o
          ciclo.
        </ArticleLi>
        <ArticleLi>
          CIS profundo e hardening de container: fase 2, depois do baseline
          vivo.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusão</ArticleH3>

      <ArticleP>
        Hardening de VPS no dia 1-2 não é checklist infinito. É fechar
        identidade, perímetro, host e manutenção com comandos claros e
        ordem segura. Aplique o inventário, endureça o que a lista acima
        cobre, verifique com Lynis e mantenha patch rodando. O resto
        (CIS completo, policy MAC avançada, containers) entra quando o
        baseline já está vivo.
      </ArticleP>
    </>
  );
}
