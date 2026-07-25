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

const SURFACE_CHART = `flowchart TB
  Internet["Internet"]
  Internet --> SSH["SSH"]
  Internet --> Web["80 / 443"]
  Internet --> Other["Painel / DB / outros"]
  SSH --> Host["Host Linux"]
  Web --> Host
  Other --> Host
  Host --> Priv["Privilegios / sudo"]
  Host --> Kernel["Kernel / sysctl"]
  Host --> Fs["Filesystem / MAC"]`;

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
      <ArticleH2>1. O problema da VPS “pronta”</ArticleH2>

      <ArticleP>
        Uma VPS “pronta” do painel do provedor costuma parecer segura o
        suficiente: Ubuntu fresco, SSH na 22, acesso root com senha “só pra
        subir o serviço”. Em poucas horas o{" "}
        <ArticleCode>auth.log</ArticleCode> já mostra o padrão: tentativas de
        login de IPs aleatórios batendo na porta mais escaneada da internet.
      </ArticleP>

      <ArticleP>
        Não precisa de APT sofisticado. Basta o baseline incompleto: credencial
        óbvia, sysctl no default da imagem, relógio sem NTP, MAC
        (AppArmor/SELinux) sem conferir se está enforcing, zero verificação
        depois do deploy.
      </ArticleP>

      <ArticleP>
        Este post é o hardening que eu aplico como{" "}
        <strong>completo para o dia 1-2 de uma VPS Linux</strong>: identidade,
        perímetro, kernel/rede, host (tempo, MAC, filesystem), manutenção,
        detecção e verificação. Distro-agnóstico, com pares Debian/Ubuntu e
        RHEL/Rocky/Alma onde a ferramenta muda.
      </ArticleP>

      <ArticleP>
        Não é um{" "}
        <TermLink href={CIS_URL}>CIS Benchmark</TermLink> de auditoria
        corporativa. Não é hardening de container/Kubernetes. É o mapa que
        remove o 80% burro e cobre os temas que mais importam antes de apontar
        DNS de produção.
      </ArticleP>

      <ArticleCallout variant="tip" title="Quer o checklist agora?">
        <ArticleP>
          Pule para a{" "}
          <a href="#7-checklist-na-ordem-certa" className={linkClass}>
            seção 7
          </a>
          : ordem segura + anti-padrões. As seções{" "}
          <a href="#3-identidade-e-acesso" className={linkClass}>
            3
          </a>
          {" "}
          a{" "}
          <a href="#6-manutencao-deteccao-e-verificacao" className={linkClass}>
            6
          </a>{" "}
          explicam cada controle.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        O que costuma ficar aberto no “servidor novo”:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>SSH com senha (e às vezes root) na porta 22</ArticleLi>
        <ArticleLi>
          firewall desligado ou “allow all” porque a app “precisa funcionar”
        </ArticleLi>
        <ArticleLi>
          kernel/sysctl no default da imagem cloud
        </ArticleLi>
        <ArticleLi>
          relógio sem NTP/chrony (logs e TLS ficam mentindo)
        </ArticleLi>
        <ArticleLi>
          MAC (AppArmor/SELinux) em permissive ou desligado sem querer
        </ArticleLi>
        <ArticleLi>
          updates manuais “quando der”, e não dá
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>2. Superfície de ataque</ArticleH2>

      <ArticleP>
        Hardening começa com inventário. Tudo que escuta na rede é porta de
        entrada. Tudo que roda com privilégio é raio de explosão. Tudo que o
        kernel aceita por default é política implícita.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Internet, host, privilegios, kernel e filesystem"
        chart={SURFACE_CHART}
      />

      <ArticleP>
        No dia 1 eu respondo cinco perguntas:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>Quem pode entrar? (contas e SSH)</ArticleLi>
        <ArticleLi>De onde e por quais portas? (firewall e rede)</ArticleLi>
        <ArticleLi>
          As regras de rede do sistema estão no padrão seguro?
        </ArticleLi>
        <ArticleLi>
          Relógio, proteção do sistema e pastas básicas estão ok?
        </ArticleLi>
        <ArticleLi>
          O que continua rodando se eu não olhar por uma semana?
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        Inventário rápido que eu rodo antes de “fechar”. Cada comando
        responde uma pergunta simples:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>whoami; id</ArticleCode>: quem está logado e se essa
          conta tem poder de administrador
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ss -tulpn</ArticleCode>: quais portas estão abertas e
          qual programa está usando cada uma
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>systemctl list-units …</ArticleCode>: quais serviços
          estão rodando agora (o que a máquina mantém ligado)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ufw</ArticleCode> / <ArticleCode>firewall-cmd</ArticleCode>:
          se o firewall está ativo e o que ele deixa passar
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>timedatectl</ArticleCode>: se o relógio do servidor
          está certo (logs e HTTPS dependem disso)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>aa-status</ArticleCode> (Debian/Ubuntu) ou{" "}
          <ArticleCode>getenforce</ArticleCode> (RHEL): se a proteção extra
          do sistema (AppArmor ou SELinux) está ligada de verdade
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

      <ArticleCallout variant="note" title="Distro-agnóstico de propósito">
        <ArticleP>
          Princípios únicos. Onde a ferramenta muda:{" "}
          <TermLink href={UFW_URL}>UFW</TermLink> vs{" "}
          <TermLink href={FIREWALLD_URL}>firewalld</TermLink>,{" "}
          <ArticleCode>apt</ArticleCode> vs <ArticleCode>dnf</ArticleCode>,{" "}
          <TermLink href={APPARMOR_URL}>AppArmor</TermLink> vs{" "}
          <TermLink href={SELINUX_URL}>SELinux</TermLink>.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. Identidade e acesso</ArticleH2>

      <ArticleP>
        Padrão clássico: “só subir um nginx” e operar tudo como root porque é
        mais rápido. Na hora de desligar login root remoto, quem deixou uma
        única sessão aberta (a do root) se trava fora. Por isso a ordem
        importa antes da pressa.
      </ArticleP>

      <ArticleP>
        Ordem correta: usuário com sudo, depois chave SSH, depois endurecer{" "}
        <TermLink href={OPENSSH_URL}>sshd</TermLink> e{" "}
        <TermLink href={SUDOERS_URL}>sudo</TermLink>, depois só então cortar o que
        dói.
      </ArticleP>

      <ArticleH3>Usuário com sudo, não root no dia a dia</ArticleH3>

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

      <ArticleP>No seu notebook:</ArticleP>

      <ArticleCode block>
        {`ssh-keygen -t ed25519 -C "vps-deploy"
ssh-copy-id deploy@SEU_IP`}
      </ArticleCode>

      <ArticleP>
        Confirme login por chave numa sessão nova. Só depois mexa no{" "}
        <TermLink href={SSHD_CONFIG_URL}>sshd_config</TermLink>. Permissões
        que eu verifico: <ArticleCode>~/.ssh</ArticleCode> em{" "}
        <ArticleCode>700</ArticleCode>,{" "}
        <ArticleCode>authorized_keys</ArticleCode> em{" "}
        <ArticleCode>600</ArticleCode>.
      </ArticleP>

      <ArticleH3>Endurecer sshd (sem se trancar)</ArticleH3>

      <ArticleCallout variant="warning" title="Antes de reiniciar o sshd">
        <ArticleP>
          Mantenha uma sessão SSH aberta e testada. Rode{" "}
          <ArticleCode>sshd -t</ArticleCode> depois de editar. Só então
          reinicie/reload. Se algo falhar, a sessão velha ainda te salva.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Mínimo que eu aplico. Em linguagem simples:
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
          gráfica pelo SSH (desnecessário na VPS)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>AllowUsers deploy</ArticleCode>: só essa conta pode
          tentar SSH (troque pelo seu usuário)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>MaxAuthTries</ArticleCode> /{" "}
          <ArticleCode>LoginGraceTime</ArticleCode>: menos tentativas e menos
          tempo parado na porta de login
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ClientAliveInterval</ArticleCode> /{" "}
          <ArticleCode>ClientAliveCountMax</ArticleCode>: fecha sessão
          abandonada e libera recurso
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

      <ArticleP>
        Arquivo típico: <ArticleCode>/etc/ssh/sshd_config</ArticleCode> ou
        drop-in em <ArticleCode>/etc/ssh/sshd_config.d/</ArticleCode>.
        Ajuste <ArticleCode>AllowUsers</ArticleCode> para o seu usuário real.
      </ArticleP>

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
        <ArticleCode>NOPASSWD:ALL</ArticleCode> “pra facilitar o CI” vira
        lateral movement fácil se a conta cair. Prefiro senha no sudo (ou
        autenticação forte) e regras estreitas no{" "}
        <ArticleCode>/etc/sudoers.d/</ArticleCode>. Nunca editar{" "}
        <ArticleCode>sudoers</ArticleCode> sem{" "}
        <ArticleCode>visudo</ArticleCode>.
      </ArticleP>

      <ArticleH3>Mudar a porta? Nuance</ArticleH3>

      <ArticleP>
        Trocar a porta 22 por 2222 reduz barulho no log. Não é controle real.
        Bots escaneiam portas. Eu trato porta custom como higiene de sinal. A
        barreira é chave + sem senha + sem root + AllowUsers.
      </ArticleP>

      <ArticleH2>4. Rede e perímetro</ArticleH2>

      <ArticleP>
        Outro padrão: app no ar, firewall “depois”. Depois raramente vem.
        Qualquer serviço em <ArticleCode>0.0.0.0</ArticleCode> (escutando em
        todas as interfaces, inclusive a pública) vira entrada. Além do
        firewall, o kernel tem regras de rede internas. Se você deixa o
        padrão da imagem cloud, o servidor aceita comportamentos de rede que
        um atacante pode tentar abusar.
      </ArticleP>

      <ArticleP>
        Regra: default-deny na entrada. Só abre o que o produto precisa
        (quase sempre SSH + 80/443). Em seguida, ajuste as regras de rede do
        kernel.
      </ArticleP>

      <ArticleH3>
        <TermLink href={UFW_URL}>UFW</TermLink> (Debian/Ubuntu)
      </ArticleH3>

      <ArticleP>
        Firewall é a lista do que pode entrar na máquina pela internet. Sem
        ele (ou com “libera tudo”), qualquer serviço que escutar numa porta
        fica alcançável. Atacantes varrem portas o dia inteiro; o que estiver
        aberto vira tentativa automática.
      </ArticleP>

      <ArticleP>
        No Debian/Ubuntu eu uso <TermLink href={UFW_URL}>UFW</TermLink>: uma
        frente simples sobre as regras do sistema. A lógica é negar entrada
        por padrão, liberar só SSH e HTTP/HTTPS, e só então ativar.
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
        <TermLink href={FIREWALLD_URL}>firewalld</TermLink> (RHEL family)
      </ArticleH3>

      <ArticleP>
        Na família RHEL o papel é o mesmo: controlar o que entra. A
        ferramenta padrão costuma ser{" "}
        <TermLink href={FIREWALLD_URL}>firewalld</TermLink>. Em vez de
        “allow OpenSSH”, você adiciona serviços (ssh, http, https) e aplica
        com reload.
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
          Libere SSH <strong>antes</strong> de ativar o firewall. Se a porta
          SSH não for a 22, permita essa porta explicitamente. Confirme numa
          segunda sessão antes de fechar a primeira.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>
        <TermLink href={SYSCTL_URL}>sysctl</TermLink> de rede (baseline)
      </ArticleH3>

      <ArticleP>
        <TermLink href={SYSCTL_URL}>sysctl</TermLink> é a forma de ler e
        mudar parâmetros do kernel em Linux (rede, memória, segurança
        básica). O firewall corta tráfego nas portas. O sysctl muda como o
        próprio sistema trata pacotes e informações sensíveis. Os dois se
        complementam.
      </ArticleP>

      <ArticleP>
        Em vez de editar um arquivo solto e esquecer no próximo reboot, eu
        coloco um arquivo em{" "}
        <ArticleCode>/etc/sysctl.d/99-hardening.conf</ArticleCode>. Tudo que
        está nessa pasta é carregado de forma estável. O nome{" "}
        <ArticleCode>99-</ArticleCode> só garante que rode depois de outros
        defaults.
      </ArticleP>

      <ArticleP>
        O que este baseline faz, em grupos:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>rp_filter</ArticleCode>: rejeita pacotes que “chegam
          pela porta errada” (anti-spoofing básico de IP)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>tcp_syncookies</ArticleCode>: ajuda o servidor a
          sobreviver a enxurrada de conexões falsas (SYN flood)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>accept_redirects</ArticleCode> /{" "}
          <ArticleCode>send_redirects</ArticleCode> em 0: o host não segue nem
          espalha “atalhos” de rota que um atacante na rede poderia forjar
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>accept_source_route</ArticleCode> em 0: impede que o
          pacote diga por quais caminhos deve viajar (recurso antigo e
          perigoso na internet pública)
        </ArticleLi>
        <ArticleLi>
          IPv6 com redirects desligados: mesma ideia do IPv4, para não deixar
          um buraco só porque a imagem veio com IPv6 ligado
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>kptr_restrict</ArticleCode> e{" "}
          <ArticleCode>dmesg_restrict</ArticleCode>: dificultam ver endereços
          internos do kernel e o log do boot sem privilégio (informação útil
          para exploit)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>protected_hardlinks</ArticleCode> /{" "}
          <ArticleCode>protected_symlinks</ArticleCode>: reduzem truques com
          links de arquivo em pastas compartilhadas (ex.:{" "}
          <ArticleCode>/tmp</ArticleCode>)
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Arquivo típico:
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

      <ArticleP>
        Para aplicar sem reiniciar:
      </ArticleP>

      <ArticleCode block>{`sudo sysctl --system`}</ArticleCode>

      <ArticleP>
        Esse comando recarrega os arquivos de{" "}
        <ArticleCode>/etc/sysctl.d/</ArticleCode>. Se algo estiver com sintaxe
        errada, o próprio sysctl avisa.
      </ArticleP>

      <ArticleP>
        IPv6: se você <strong>não</strong> usa, desabilite ou coloque regras
        de firewall de propósito. Deixar IPv6 “ligado e esquecido” sem
        filtro é buraco clássico: o IPv4 está fechado e o IPv6 continua
        aberto. Se usa IPv6 de verdade, trate no firewall como trata IPv4.
      </ArticleP>

      <ArticleP>
        Banco, Redis, painel admin: se não precisam da internet pública, não
        abrem nela. Faça o serviço escutar só em{" "}
        <ArticleCode>localhost</ArticleCode> (a própria máquina) ou numa rede
        privada.
      </ArticleP>

      <ArticleH2>5. Host: tempo, MAC e filesystem</ArticleH2>

      <ArticleP>
        Até aqui fechamos <strong>quem entra</strong> (SSH/sudo) e{" "}
        <strong>o que a rede deixa passar</strong> (firewall/sysctl). Ainda
        falta o “miolo” da máquina: relógio, trava extra de processos e
        higiene de pastas. Sem isso, o baseline parece pronto e quebra na
        hora do incidente ou do exploit local.
      </ArticleP>

      <ArticleP>
        Esta seção cobre quatro peças do host. Em cada uma: o problema, como
        costuma ser explorado, e o mínimo que eu aplico no dia 1.
      </ArticleP>

      <ArticleH3>
        Tempo com <TermLink href={CHRONY_URL}>chrony</TermLink>
      </ArticleH3>

      <ArticleP>
        Servidor com relógio errado parece detalhe chato. Não é. Logs com
        horário torto atrapalham investigar invasão. Certificado HTTPS pode
        aparecer como “ainda não válido” ou “já expirou” só porque a máquina
        está adiantada ou atrasada. Tokens e autenticação também dependem de
        tempo certo.
      </ArticleP>

      <ArticleP>
        Como isso é explorado na prática: o atacante não “quebra” o NTP. O
        time sofre sozinho. Alguém olha o log, não consegue cruzar eventos, e
        perde tempo. Em cenários piores, serviços que exigem horário alinhado
        falham e o time desliga proteção “só pra voltar”.
      </ArticleP>

      <ArticleP>
        <TermLink href={CHRONY_URL}>chrony</TermLink> é o programa que
        sincroniza o relógio do Linux com servidores de tempo na internet (ou
        internos). No dia 1 eu instalo, deixo subir no boot, e confirmo com{" "}
        <ArticleCode>timedatectl</ArticleCode>.
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

      <ArticleP>
        No status, o que importa é ver que o relógio está sincronizado
        (NTP/chrony ativo). Se não estiver, corrija fuso e rede antes de
        seguir.
      </ArticleP>

      <ArticleH3>
        MAC: <TermLink href={APPARMOR_URL}>AppArmor</TermLink> /{" "}
        <TermLink href={SELINUX_URL}>SELinux</TermLink>
      </ArticleH3>

      <ArticleP>
        Mesmo com SSH bom e firewall bom, um serviço vulnerável (web, banco,
        painel) ainda pode ser invadido. Sem trava extra, o processo
        comprometido herda permissões amplas e vira ponto de partida para
        ler arquivos, subir binário ou pivotar na máquina.
      </ArticleP>

      <ArticleP>
        MAC (Mandatory Access Control) é essa trava. O sistema define o que
        cada programa pode tocar, além do usuário Linux tradicional. No
        Ubuntu costuma ser{" "}
        <TermLink href={APPARMOR_URL}>AppArmor</TermLink>. No RHEL/Rocky/Alma
        costuma ser <TermLink href={SELINUX_URL}>SELinux</TermLink>.
      </ArticleP>

      <ArticleP>
        Como é explorado: muita imagem cloud vem com MAC em modo “frouxo”
        ou alguém desliga tudo porque “o app não subiu”. Aí o atacante que
        já entrou no processo ganha liberdade que não deveria ter.
      </ArticleP>

      <ArticleP>
        No dia 1 eu não escrevo policy do zero. Eu confirmo que a proteção
        está ligada de verdade e só abro exceção pontual se precisar.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Debian/Ubuntu: <ArticleCode>aa-status</ArticleCode> mostra se o
          AppArmor está ativo e quais programas estão restritos de fato
          (enforce)
        </ArticleLi>
        <ArticleLi>
          RHEL family: <ArticleCode>getenforce</ArticleCode> deve mostrar{" "}
          <ArticleCode>Enforcing</ArticleCode> (ligado e bloqueando).{" "}
          <ArticleCode>Permissive</ArticleCode> só registra e não bloqueia.
          Não deixe assim “por enquanto”
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Se um app quebra com MAC ligado, ajuste a exceção daquele app. Não
        desligue o MAC inteiro da máquina.
      </ArticleP>

      <ArticleH3>Filesystem e permissões básicas</ArticleH3>

      <ArticleP>
        Rede e login controlam a porta da frente. Pastas e permissões
        controlam o que um processo já dentro da máquina consegue fazer.
        Hardening de filesystem no dia 1 não é “CIS completo”. É cortar os
        erros clássicos: pasta temporária executável,{" "}
        <ArticleCode>chmod 777</ArticleCode>, e diretório que qualquer um
        escreve.
      </ArticleP>

      <ArticleP>
        Como é explorado: malware ou script baixado grava em{" "}
        <ArticleCode>/tmp</ArticleCode>, executa dali, ou sobrescreve arquivo
        em pasta compartilhada. Também aparece “libera permissão total pra
        funcionar” e a conta fraca passa a escrever em lugar sensível.
      </ArticleP>

      <ArticleP>
        O que eu olho no baseline:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>/tmp</ArticleCode> e{" "}
          <ArticleCode>/var/tmp</ArticleCode>: pastas compartilhadas. O sticky
          bit faz cada um apagar só o próprio arquivo. Em VPS dedicada, se o
          workload permitir,{" "}
          <ArticleCode>noexec,nosuid,nodev</ArticleCode> evita executar
          binário a partir do tmp
        </ArticleLi>
        <ArticleLi>
          Evite pastas “todo mundo escreve” fora do tmp:{" "}
          <ArticleCode>{`find / -xdev -type d -perm -0002 2>/dev/null`}</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Home e chaves SSH: umask razoável; nada de{" "}
          <ArticleCode>chmod 777</ArticleCode> “pra funcionar”
        </ArticleLi>
        <ArticleLi>
          Partições separadas (<ArticleCode>/var</ArticleCode>,{" "}
          <ArticleCode>/home</ArticleCode>) ajudam se um disco encher: o resto
          do sistema ainda sobe. Nem toda VPS cloud oferece isso; se o
          provedor der, use
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        <TermLink href={AUDITD_URL}>auditd</TermLink> (mínimo)
      </ArticleH3>

      <ArticleP>
        Depois do ataque, a pergunta é sempre a mesma: o que mudou, quem
        mudou, quando. Sem trilha, você só tem feeling.{" "}
        <TermLink href={AUDITD_URL}>auditd</TermLink> é o serviço do Linux
        que registra eventos de segurança (login, sudo, alteração de arquivo
        sensível).
      </ArticleP>

      <ArticleP>
        Como é explorado (ou, melhor, como a ausência é explorada): o
        atacante limpa rastros básicos ou o time não tem o que correlacionar.
        Com auditd no ar, sobra evidência mínima para começar a resposta.
      </ArticleP>

      <ArticleP>
        No dia 1 eu só deixo o daemon ativo. Regras CIS completas são fase 2.
        O ganho imediato é ter trilha quando alguém mexe em autenticação e
        sudoers.
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y auditd
sudo systemctl enable --now auditd

# RHEL family (costuma vir instalável via dnf)
sudo dnf install -y audit
sudo systemctl enable --now auditd`}
      </ArticleCode>

      <ArticleH2>6. Manutenção, detecção e verificação</ArticleH2>

      <ArticleP>
        Baseline no dia 1 não basta se a máquina apodrece depois. Esta seção
        é o que mantém o hardening vivo: atualizar, detectar abuso, cortar
        serviço inútil e verificar se o que você acha que aplicou realmente
        está lá.
      </ArticleP>

      <ArticleH3>Updates sem drama</ArticleH3>

      <ArticleP>
        Todo mês saem correções de segurança. Se a VPS fica meses sem update,
        um buraco público (CVE) vira manchete e o seu host ainda está
        vulnerável. O atacante não precisa ser criativo: basta um scanner e
        uma versão atrasada.
      </ArticleP>

      <ArticleP>
        Por isso eu automatizo pelo menos o patch de segurança. No
        Debian/Ubuntu uso{" "}
        <TermLink href={UNATTENDED_URL}>unattended-upgrades</TermLink>. Na
        família RHEL uso{" "}
        <TermLink href={DNF_AUTO_URL}>dnf-automatic</TermLink>.
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
        Em VPS pessoal/staging, unattended de segurança é higiene. Em
        produção sensível, automatize o aviso e controle a janela, mas não
        deixe manual eterno. Update de kernel sem reboot planejado não
        aplica de verdade: o processo antigo continua na memória.
      </ArticleP>

      <ArticleH3>
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink> (ou equivalente)
      </ArticleH3>

      <ArticleP>
        Mesmo com senha SSH desligada, a porta continua tomando tentativa
        automática. Em outros serviços (web panel, mail, etc.) o padrão é o
        mesmo: força bruta até achar senha fraca.
      </ArticleP>

      <ArticleP>
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink> lê logs de falha e
        bloqueia o IP por um tempo. Não substitui chave SSH. É contenção de
        ruído e abuso.
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y fail2ban

# RHEL family (EPEL conforme a distro)
sudo dnf install -y fail2ban
sudo systemctl enable --now fail2ban`}
      </ArticleCode>

      <ArticleP>
        Com senha desligada, fail2ban não é a estrela. Ainda assim corta
        ruído e ajuda se alguém reativar senha “temporariamente” ou se outro
        serviço ficar exposto.
      </ArticleP>

      <ArticleH3>Cortar o que não pediu</ArticleH3>

      <ArticleP>
        Imagem cloud muitas vezes sobe com serviços extras (agente, demo,
        painel). Cada serviço a mais é superfície: porta, CVE, credencial.
        O baseline pergunta: isso é do produto ou veio de brinde?
      </ArticleP>

      <ArticleP>
        Liste o que escuta e o que está rodando:
      </ArticleP>

      <ArticleCode block>
        {`ss -tulpn
systemctl list-units --type=service --state=running`}
      </ArticleCode>

      <ArticleP>
        Se você não sabe para que serve e não é dependência do produto:
        desabilite. Menos processo = menos CVE na sua frente.
      </ArticleP>

      <ArticleH3>Logs que eu olho</ArticleH3>

      <ArticleP>
        Hardening sem olhar log é fé. Eu não monto SIEM no dia 1. Eu sei
        onde olhar quando algo cheira mal:
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
          <ArticleCode>aureport</ArticleCode> quando algo “estranho” aparece
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        Verificar com <TermLink href={LYNIS_URL}>Lynis</TermLink>
      </ArticleH3>

      <ArticleP>
        Depois de aplicar o baseline, é fácil achar que “está endurecido”
        sem medir. <TermLink href={LYNIS_URL}>Lynis</TermLink> é um scanner
        de higiene: ele percorre a máquina e lista o que está frouxo.
      </ArticleP>

      <ArticleP>
        Eu não uso no dia 1 para caçar 400 findings de CIS. Uso para ver o
        que eu esqueci (serviço ligado, permissão errada, update parado).
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
          <ArticleCode>/etc</ArticleCode>, chaves fora da VPS). Hardening sem
          recuperação é só metade do trabalho.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>7. Checklist na ordem certa</ArticleH2>

      <ArticleMermaid
        ariaLabel="Ordem segura de hardening do dia 1 ao 2"
        chart={ORDER_CHART}
      />

      <ArticleP>
        Checklist que eu uso antes de apontar DNS de produção:
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
          Aplicar sysctl de rede/kernel; decidir IPv6 de propósito
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

      <ArticleTable caption="Anti-padrões que mais vejo em VPS">
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
            <ArticleTd>Você pagou o custo sem o benefício</ArticleTd>
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

      <ArticleP>
        Frase de ops/entrevista que funciona melhor que “eu uso Linux”:
      </ArticleP>

      <ArticleP>
        “No dia 1-2 eu fecho identidade (chave, sem root/senha, sudo
        estreito), perímetro (default-deny + sysctl), host (tempo, MAC,
        filesystem, audit) e manutenção (updates, fail2ban, verificação). CIS
        completo e container ficam fase 2.”
      </ArticleP>

      <ArticleH3>Pontos-chave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Baseline completo remove o 80% burro e cobre os temas que mais
          importam, sem vender impenetrável.
        </ArticleLi>
        <ArticleLi>
          Ordem importa: usuário, depois chave, depois sshd/sudo, depois
          firewall/sysctl, depois tempo/MAC, depois updates, depois verificar.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={OPENSSH_URL}>OpenSSH</TermLink> com chave,
          AllowUsers e sem senha/root vale mais que trocar a porta.
        </ArticleLi>
        <ArticleLi>
          Firewall + <TermLink href={SYSCTL_URL}>sysctl</TermLink> + decisão
          explícita de IPv6.
        </ArticleLi>
        <ArticleLi>
          Tempo (chrony), MAC (AppArmor/SELinux) e auditd são host, não
          “extra opcional”.
        </ArticleLi>
        <ArticleLi>
          Updates + fail2ban + cortar serviços + Lynis + backup fecham o
          ciclo.
        </ArticleLi>
        <ArticleLi>
          CIS profundo, policy MAC avançada e hardening de container: próximo
          nível, depois do baseline vivo.
        </ArticleLi>
      </ArticleUl>
    </>
  );
}
