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
        Eu já deixei uma VPS “pronta” demais. Painel do provedor, Ubuntu
        fresco, SSH na 22, root com senha porque “é só pra testar”. Em menos
        de um dia o <ArticleCode>auth.log</ArticleCode> parecia leilão:
        tentativas de login de IPs que eu nunca tinha visto.
      </ArticleP>

      <ArticleP>
        Não foi um APT sofisticado. Foi o baseline que eu pulei. A caixa
        estava na internet com a porta mais batida do planeta e a credencial
        mais óbvia. Depois descobri o restante do buraco: sysctl no default,
        relógio torto, AppArmor “sei lá se está enforcing”, zero verificação.
      </ArticleP>

      <ArticleP>
        Este post é o hardening que eu trato como{" "}
        <strong>completo para o dia 1–2 de uma VPS Linux</strong>: identidade,
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
          –{" "}
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
          updates manuais “quando der” — e não dá
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
        <ArticleLi>Quem pode entrar? (identidade)</ArticleLi>
        <ArticleLi>De onde e por quais portas? (perímetro)</ArticleLi>
        <ArticleLi>O kernel ajuda ou atrapalha? (sysctl)</ArticleLi>
        <ArticleLi>
          Tempo, MAC e filesystem estão no mínimo seguro?
        </ArticleLi>
        <ArticleLi>
          O que continua rodando se eu não olhar por uma semana? (manutenção)
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        Inventário rápido que eu rodo antes de “fechar”:
      </ArticleP>

      <ArticleCode block>
        {`whoami; id
ss -tulpn
systemctl list-units --type=service --state=running
sudo ufw status verbose 2>/dev/null || sudo firewall-cmd --list-all 2>/dev/null
timedatectl
# Debian/Ubuntu
aa-status 2>/dev/null | head
# RHEL family
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
        Cena: eu precisava “só subir um nginx”. Criei tudo como root porque
        era mais rápido. Depois precisei desligar login root remoto — e quase
        me travei fora porque a única sessão aberta era a do root.
      </ArticleP>

      <ArticleP>
        Ordem correta: usuário com sudo → chave SSH → endurecer{" "}
        <TermLink href={OPENSSH_URL}>sshd</TermLink> e{" "}
        <TermLink href={SUDOERS_URL}>sudo</TermLink> → só então cortar o que
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

      <ArticleP>Mínimo que eu aplico:</ArticleP>

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
        <ArticleCode>/etc/sudoers.d/</ArticleCode> — nunca editar{" "}
        <ArticleCode>sudoers</ArticleCode> sem{" "}
        <ArticleCode>visudo</ArticleCode>.
      </ArticleP>

      <ArticleH3>Mudar a porta? Nuance</ArticleH3>

      <ArticleP>
        Trocar 22 → 2222 reduz barulho no log. Não é controle real. Bots
        escaneiam portas. Eu trato porta custom como higiene de sinal. A
        barreira é chave + sem senha + sem root + AllowUsers.
      </ArticleP>

      <ArticleH2>4. Rede e perímetro</ArticleH2>

      <ArticleP>
        Cena: app no ar, firewall “depois”. Depois nunca veio. Qualquer
        serviço em <ArticleCode>0.0.0.0</ArticleCode> virou entrada. Sysctl
        no default da imagem deixou o host mais conversador do que eu queria.
      </ArticleP>

      <ArticleP>
        Regra: default-deny na entrada. Só abre o que o produto precisa
        (quase sempre SSH + 80/443). Em seguida, kernel net.sysctl básico.
      </ArticleP>

      <ArticleH3>
        <TermLink href={UFW_URL}>UFW</TermLink> (Debian/Ubuntu)
      </ArticleH3>

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
        Drop-in típico em{" "}
        <ArticleCode>/etc/sysctl.d/99-hardening.conf</ArticleCode>:
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
        IPv6: se você <strong>não</strong> usa, desabilitar ou firewallar
        com intenção explícita. Deixar IPv6 “ligado e esquecido” sem regras
        é buraco clássico. Se usa, trate no firewall como trata IPv4.
      </ArticleP>

      <ArticleP>
        Banco, Redis, painel admin: se não precisam da internet pública, não
        abrem. Bind em localhost ou rede privada.
      </ArticleP>

      <ArticleH2>5. Host: tempo, MAC e filesystem</ArticleH2>

      <ArticleP>
        Cena: incidente às 03h. Logs com timestamp torto. Certificado TLS
        “ainda não válido”. Sem tempo sincronizado, auditoria e TLS mentem.
      </ArticleP>

      <ArticleH3>
        Tempo com <TermLink href={CHRONY_URL}>chrony</TermLink>
      </ArticleH3>

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
        Não é deep-dive de policy. É garantir que o MAC da distro não está
        desligado por acidente.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Debian/Ubuntu: <ArticleCode>aa-status</ArticleCode> — perfis em
          enforce para serviços críticos
        </ArticleLi>
        <ArticleLi>
          RHEL family: <ArticleCode>getenforce</ArticleCode> deve ser{" "}
          <ArticleCode>Enforcing</ArticleCode> (não deixe{" "}
          <ArticleCode>Permissive</ArticleCode> “só por enquanto”)
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Se você precisa abrir exceção, abra a exceção. Não desligue o MAC
        inteiro.
      </ArticleP>

      <ArticleH3>Filesystem e permissões básicas</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>/tmp</ArticleCode> e{" "}
          <ArticleCode>/var/tmp</ArticleCode>: sticky bit; em VPS dedicada,
          avalie <ArticleCode>noexec,nosuid,nodev</ArticleCode> se o workload
          permitir
        </ArticleLi>
        <ArticleLi>
          Evite world-writable fora de tmp:{" "}
          <ArticleCode>{`find / -xdev -type d -perm -0002 2>/dev/null`}</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Home e chaves: umask razoável; nada de{" "}
          <ArticleCode>chmod 777</ArticleCode> “pra funcionar”
        </ArticleLi>
        <ArticleLi>
          Partições separadas (<ArticleCode>/var</ArticleCode>,{" "}
          <ArticleCode>/home</ArticleCode>) ajudam contenção — nem toda VPS
          cloud oferece; se o provedor der, use
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        <TermLink href={AUDITD_URL}>auditd</TermLink> (mínimo)
      </ArticleH3>

      <ArticleP>
        Em VPS séria eu deixo o daemon de auditoria ativo. Regras CIS
        completas são fase 2; o ponto do dia 1 é: ter trilha quando alguém
        mexe em autenticação e sudoers.
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
        Cena: VPS estável por meses. Zero update. Um CVE de OpenSSH vira
        manchete. Eu não quero descobrir pelo Twitter — nem achar que
        “endureci” sem nunca medir.
      </ArticleP>

      <ArticleH3>Updates sem drama</ArticleH3>

      <ArticleP>
        Debian/Ubuntu —{" "}
        <TermLink href={UNATTENDED_URL}>unattended-upgrades</TermLink>:
      </ArticleP>

      <ArticleCode block>
        {`sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades`}
      </ArticleCode>

      <ArticleP>
        RHEL family —{" "}
        <TermLink href={DNF_AUTO_URL}>dnf-automatic</TermLink>:
      </ArticleP>

      <ArticleCode block>
        {`sudo dnf install -y dnf-automatic
sudo systemctl enable --now dnf-automatic.timer`}
      </ArticleCode>

      <ArticleP>
        Em VPS pessoal/staging, unattended de segurança é higiene. Em
        produção sensível, automatize o aviso e controle a janela — mas não
        deixe manual eterno. Kernel update sem reboot planejado = patch
        fantasma.
      </ArticleP>

      <ArticleH3>
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink> (ou equivalente)
      </ArticleH3>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y fail2ban

# RHEL family (EPEL conforme a distro)
sudo dnf install -y fail2ban
sudo systemctl enable --now fail2ban`}
      </ArticleCode>

      <ArticleP>
        Com senha desligada, fail2ban não é a estrela — ainda corta ruído e
        abuso em outros serviços.
      </ArticleP>

      <ArticleH3>Cortar o que não pediu</ArticleH3>

      <ArticleCode block>
        {`ss -tulpn
systemctl list-units --type=service --state=running`}
      </ArticleCode>

      <ArticleP>
        Se você não sabe para que serve e não é dependência do produto:
        desabilite. Menos processo = menos CVE na sua frente.
      </ArticleP>

      <ArticleH3>Logs que eu olho</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          SSH: <ArticleCode>journalctl -u ssh</ArticleCode> /{" "}
          <ArticleCode>sshd</ArticleCode> ou{" "}
          <ArticleCode>/var/log/auth.log</ArticleCode>
        </ArticleLi>
        <ArticleLi>firewall / fail2ban: o que foi bloqueado</ArticleLi>
        <ArticleLi>updates: última corrida do unattended / dnf-automatic</ArticleLi>
        <ArticleLi>
          audit: <ArticleCode>ausearch</ArticleCode> /{" "}
          <ArticleCode>aureport</ArticleCode> quando algo “estranho” aparece
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        Verificar com <TermLink href={LYNIS_URL}>Lynis</TermLink>
      </ArticleH3>

      <ArticleP>
        Depois do baseline, eu corro um scanner de higiene. Não para caçar
        400 findings CIS — para ver o que eu esqueci no dia 1.
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

      <ArticleTable caption="Anti-padrões que eu já paguei">
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
        “No dia 1–2 eu fecho identidade (chave, sem root/senha, sudo
        estreito), perímetro (default-deny + sysctl), host (tempo, MAC,
        filesystem, audit) e manutenção (updates, fail2ban, verificação). CIS
        completo e container ficam fase 2.”
      </ArticleP>

      <ArticleH3>Pontos-chave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Baseline completo remove o 80% burro e cobre os temas que mais
          importam — sem vender impenetrável.
        </ArticleLi>
        <ArticleLi>
          Ordem importa: usuário → chave → sshd/sudo → firewall/sysctl →
          tempo/MAC → updates → verificar.
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
