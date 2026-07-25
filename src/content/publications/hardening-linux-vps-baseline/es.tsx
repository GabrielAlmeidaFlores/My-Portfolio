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
  A["1. Usuario + clave"] --> B["2. SSH + sudo"]
  B --> C["3. Firewall + sysctl"]
  C --> D["4. Tiempo + MAC"]
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

export function HardeningLinuxVpsBaselineContentEs() {
  return (
    <>
      <ArticleH2>1. Qué cubre este post</ArticleH2>

      <ArticleP>
        Este post es un <strong>baseline de hardening</strong> para el día
        1-2 de un VPS Linux. Hardening aquí significa reducir la superficie
        de ataque del host: quién entra, qué deja pasar la red, cómo se
        comporta el kernel y qué sigue corriendo sin supervisión.
      </ArticleP>

      <ArticleP>
        Cada control sigue el mismo formato:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>Qué es</strong> y <strong>para qué sirve</strong>
        </ArticleLi>
        <ArticleLi>
          <strong>Si no lo configuras</strong>: cómo suele explotarse
        </ArticleLi>
        <ArticleLi>
          <strong>Cómo configurarlo</strong>: comandos y parámetros
          explicados
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Alcance: identidad (SSH/sudo), perímetro (firewall/sysctl), host
        (tiempo, MAC, filesystem, auditd), mantenimiento (updates, fail2ban,
        verificación). Agnóstico de distro, con pares Debian/Ubuntu y
        RHEL/Rocky/Alma donde cambia la herramienta.
      </ArticleP>

      <ArticleP>
        Fuera de alcance:{" "}
        <TermLink href={CIS_URL}>CIS Benchmark</TermLink> completo de
        auditoría corporativa, y hardening de contenedores/Kubernetes. Eso
        es fase 2, después del baseline vivo.
      </ArticleP>

      <ArticleP>
        Orden seguro (evita quedarte fuera y cierra primero lo que más
        importa):
      </ArticleP>

      <ArticleOl>
        <ArticleLi>Usuario con sudo + clave SSH</ArticleLi>
        <ArticleLi>Endurecer sshd y sudo</ArticleLi>
        <ArticleLi>Firewall + sysctl</ArticleLi>
        <ArticleLi>Tiempo + MAC + filesystem + auditd</ArticleLi>
        <ArticleLi>Updates + fail2ban</ArticleLi>
        <ArticleLi>Cortar servicios inútiles + verificar</ArticleLi>
      </ArticleOl>

      <ArticleMermaid
        ariaLabel="Orden seguro de hardening del día 1 al 2"
        chart={ORDER_CHART}
      />

      <ArticleCallout variant="tip" title="¿Solo quieres el checklist?">
        <ArticleP>
          Ve directo a la{" "}
          <a href="#7-checklist-en-el-orden-correcto" className={linkClass}>
            sección 7
          </a>
          . Las secciones 2 a 6 explican cada control.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>2. Inventario antes de endurecer</ArticleH2>

      <ArticleP>
        <strong>Qué es:</strong> un inventario rápido del host: quién está
        logueado, qué puertos escuchan, qué servicios corren, si el firewall
        y el reloj están bien, y si la protección MAC está activa.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> solo cierras lo que ves. Sin
        inventario, el hardening es un checklist ciego y deja servicio o
        puerto olvidados.
      </ArticleP>

      <ArticleP>
        <strong>Si no lo haces:</strong> un panel, base de datos o agente de
        la imagen cloud sigue escuchando en internet. Los atacantes barren
        puertos todo el día; lo abierto se vuelve intento automático.
      </ArticleP>

      <ArticleP>
        <strong>Cómo ejecutarlo:</strong> cada comando responde una pregunta.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>whoami; id</ArticleCode>: quién está logueado y si la
          cuenta tiene poder de administrador
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ss -tulpn</ArticleCode>: qué puertos están abiertos y
          qué programa usa cada uno
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>systemctl list-units …</ArticleCode>: servicios
          corriendo ahora
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ufw</ArticleCode> /{" "}
          <ArticleCode>firewall-cmd</ArticleCode>: si el firewall está activo
          y qué deja pasar
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>timedatectl</ArticleCode>: si el reloj está
          sincronizado (logs y HTTPS dependen de eso)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>aa-status</ArticleCode> (Debian/Ubuntu) o{" "}
          <ArticleCode>getenforce</ArticleCode> (RHEL): si{" "}
          <TermLink href={APPARMOR_URL}>AppArmor</TermLink> o{" "}
          <TermLink href={SELINUX_URL}>SELinux</TermLink> está realmente
          activo
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

      <ArticleCallout variant="note" title="Agnóstico de distro">
        <ArticleP>
          Mismos principios. Donde cambia la herramienta:{" "}
          <TermLink href={UFW_URL}>UFW</TermLink> vs{" "}
          <TermLink href={FIREWALLD_URL}>firewalld</TermLink>,{" "}
          <ArticleCode>apt</ArticleCode> vs <ArticleCode>dnf</ArticleCode>,{" "}
          <TermLink href={APPARMOR_URL}>AppArmor</TermLink> vs{" "}
          <TermLink href={SELINUX_URL}>SELinux</TermLink>.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. Identidad y acceso</ArticleH2>

      <ArticleP>
        Control de <strong>quién</strong> puede entrar al host y con{" "}
        <strong>qué privilegios</strong>. Orden correcto: usuario con sudo,
        luego clave SSH, luego endurecer{" "}
        <TermLink href={OPENSSH_URL}>sshd</TermLink> y{" "}
        <TermLink href={SUDOERS_URL}>sudo</TermLink>. Solo entonces corta
        login root y contraseña.
      </ArticleP>

      <ArticleH3>Usuario con sudo (no root en el día a día)</ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong> una cuenta de operador (ej.:{" "}
        <ArticleCode>deploy</ArticleCode>) en el grupo{" "}
        <ArticleCode>sudo</ArticleCode> (Debian/Ubuntu) o{" "}
        <ArticleCode>wheel</ArticleCode> (RHEL), en vez de trabajar como root
        todo el tiempo.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> separar el login remoto del root y
        permitir apagar <ArticleCode>PermitRootLogin</ArticleCode> sin perder
        acceso administrativo.
      </ArticleP>

      <ArticleP>
        <strong>Si no lo configuras:</strong> el único camino de entrada es
        root. Cualquier fuga de contraseña root, o un error al endurecer
        sshd, te deja fuera o entrega la máquina entera.
      </ArticleP>

      <ArticleP>
        <strong>Cómo configurarlo:</strong>
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

      <ArticleH3>Clave SSH antes de apagar la contraseña</ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong> autenticación por par de claves (privada en
        el notebook, pública en{" "}
        <ArticleCode>~/.ssh/authorized_keys</ArticleCode> en el servidor),
        en lugar de contraseña en{" "}
        <TermLink href={OPENSSH_URL}>SSH</TermLink>.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> eliminar fuerza bruta de
        contraseña en el puerto SSH. Sin contraseña aceptada, el bot que
        solo prueba contraseñas comunes no entra.
      </ArticleP>

      <ArticleP>
        <strong>Si no lo configuras:</strong> contraseña débil o filtrada en
        el puerto 22 es el camino más común de compromiso de VPS. Los
        scanners no paran.
      </ArticleP>

      <ArticleP>
        <strong>Cómo configurarlo:</strong> en el notebook, genera la clave
        y copia la pública. Confirma login por clave en una sesión nueva.
        Solo después apaga la contraseña en sshd. Permisos:{" "}
        <ArticleCode>~/.ssh</ArticleCode> en <ArticleCode>700</ArticleCode>,{" "}
        <ArticleCode>authorized_keys</ArticleCode> en{" "}
        <ArticleCode>600</ArticleCode>.
      </ArticleP>

      <ArticleCode block>
        {`ssh-keygen -t ed25519 -C "vps-deploy"
ssh-copy-id deploy@TU_IP`}
      </ArticleCode>

      <ArticleH3>Endurecer sshd</ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong> el daemon{" "}
        <TermLink href={OPENSSH_URL}>OpenSSH</TermLink> (
        <ArticleCode>sshd</ArticleCode>), configurado en{" "}
        <TermLink href={SSHD_CONFIG_URL}>sshd_config</TermLink> (o drop-in
        en <ArticleCode>/etc/ssh/sshd_config.d/</ArticleCode>).
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> definir quién puede intentar login,
        si contraseña y root remoto están liberados, y límites de intento.
      </ArticleP>

      <ArticleP>
        <strong>Si no lo configuras:</strong> root con contraseña en 22,
        contraseña habilitada, y cualquier usuario local intentando SSH. Los
        bots y la fuerza bruta aprovechan el default de la imagen.
      </ArticleP>

      <ArticleCallout variant="warning" title="Antes de reiniciar sshd">
        <ArticleP>
          Mantén una sesión SSH abierta y probada. Ejecuta{" "}
          <ArticleCode>sshd -t</ArticleCode> después de editar. Solo entonces
          haz reload. Si la config falla, la sesión antigua todavía salva el
          acceso.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        <strong>Parámetros del baseline:</strong>
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>PermitRootLogin no</ArticleCode>: nadie entra como
          root directo por SSH
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>PasswordAuthentication no</ArticleCode>: contraseña en
          SSH apagada; solo clave
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>PubkeyAuthentication yes</ArticleCode>: login por
          clave liberado
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>KbdInteractiveAuthentication no</ArticleCode>: cierra
          otro camino de contraseña interactiva
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>X11Forwarding no</ArticleCode>: no reenvía interfaz
          gráfica (innecesario en el VPS)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>AllowUsers deploy</ArticleCode>: solo esa cuenta
          intenta SSH (cámbialo por tu usuario)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>MaxAuthTries</ArticleCode> /{" "}
          <ArticleCode>LoginGraceTime</ArticleCode>: menos intentos y menos
          tiempo parado en el puerto de login
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ClientAliveInterval</ArticleCode> /{" "}
          <ArticleCode>ClientAliveCountMax</ArticleCode>: cierra sesión
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

      <ArticleP>Familia RHEL:</ArticleP>
      <ArticleCode block>
        {`sudo sshd -t && sudo systemctl reload sshd`}
      </ArticleCode>

      <ArticleH3>Sudo con freno</ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong>{" "}
        <TermLink href={SUDOERS_URL}>sudo</TermLink> eleva privilegio de un
        usuario común a root, con reglas en{" "}
        <ArticleCode>/etc/sudoers</ArticleCode> o{" "}
        <ArticleCode>/etc/sudoers.d/</ArticleCode>.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> permitir administración sin login
        root permanente, con auditoría y (idealmente) autenticación en la
        elevación.
      </ArticleP>

      <ArticleP>
        <strong>Si se configura mal:</strong>{" "}
        <ArticleCode>NOPASSWD:ALL</ArticleCode> “para facilitar el CI” se
        vuelve root inmediato si cae la cuenta. Editar sudoers sin{" "}
        <ArticleCode>visudo</ArticleCode> puede romper la elevación.
      </ArticleP>

      <ArticleP>
        <strong>Cómo configurarlo:</strong> prefiere contraseña en sudo (o
        autenticación fuerte) y reglas estrechas en{" "}
        <ArticleCode>/etc/sudoers.d/</ArticleCode>. Siempre edita con{" "}
        <ArticleCode>visudo</ArticleCode>.
      </ArticleP>

      <ArticleH3>¿Cambiar el puerto SSH?</ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong> cambiar el puerto por defecto 22 por otro
        (ej.: 2222).
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> reduce ruido en el log. No es un
        control real de seguridad.
      </ArticleP>

      <ArticleP>
        <strong>Si solo cambias el puerto:</strong> los bots escanean
        puertos. La barrera real es clave + sin contraseña + sin root +{" "}
        <ArticleCode>AllowUsers</ArticleCode>. Trata el puerto custom como
        higiene de señal, no como defensa principal.
      </ArticleP>

      <ArticleH2>4. Red y perímetro</ArticleH2>

      <ArticleP>
        Control de <strong>lo que internet puede alcanzar</strong> en el
        host (firewall) y de <strong>cómo el kernel trata paquetes</strong>{" "}
        (<TermLink href={SYSCTL_URL}>sysctl</TermLink>).
      </ArticleP>

      <ArticleH3>
        Firewall: <TermLink href={UFW_URL}>UFW</TermLink> (Debian/Ubuntu)
      </ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong>{" "}
        <TermLink href={UFW_URL}>UFW</TermLink> (Uncomplicated Firewall) es
        una interfaz simple sobre las reglas de firewall del sistema.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> default-deny en entrada. Solo abre
        lo que el producto necesita (casi siempre SSH + 80/443).
      </ArticleP>

      <ArticleP>
        <strong>Si no lo configuras:</strong> cualquier servicio en{" "}
        <ArticleCode>0.0.0.0</ArticleCode> (escuchando en todas las
        interfaces, incluida la pública) queda alcanzable. Los atacantes
        barren puertos; lo abierto se vuelve intento automático.
      </ArticleP>

      <ArticleP>
        <strong>Cómo configurarlo:</strong> denegar entrada por defecto,
        liberar SSH y HTTP/HTTPS, solo entonces activar. Libera SSH{" "}
        <strong>antes</strong> de <ArticleCode>ufw enable</ArticleCode>.
      </ArticleP>

      <ArticleCode block>
        {`sudo apt update && sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
# si cambiaste el puerto: sudo ufw allow 2222/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose`}
      </ArticleCode>

      <ArticleH3>
        Firewall: <TermLink href={FIREWALLD_URL}>firewalld</TermLink>{" "}
        (familia RHEL)
      </ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong>{" "}
        <TermLink href={FIREWALLD_URL}>firewalld</TermLink> es el firewall
        por defecto en la familia RHEL. El rol es el mismo que UFW:
        controlar lo que entra.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve / si no lo tienes:</strong> igual que UFW.
        Sin default-deny, servicio expuesto = superficie en internet.
      </ArticleP>

      <ArticleP>
        <strong>Cómo configurarlo:</strong> agrega servicios (ssh, http,
        https) y aplica con reload.
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

      <ArticleCallout variant="warning" title="No te quedes fuera">
        <ArticleP>
          Libera SSH antes de activar el firewall. Si el puerto no es 22,
          permite ese puerto de forma explícita. Confirma en una segunda
          sesión antes de cerrar la primera.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>
        <TermLink href={SYSCTL_URL}>sysctl</TermLink> de red (baseline)
      </ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong>{" "}
        <TermLink href={SYSCTL_URL}>sysctl</TermLink> lee y cambia
        parámetros del kernel (red, memoria, seguridad básica). El firewall
        corta tráfico en los puertos. El sysctl cambia cómo el sistema trata
        paquetes e información sensible.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> anti-spoofing básico, mitigación de
        SYN flood, bloquear redirects y source route peligrosos, y reducir
        filtración de información del kernel.
      </ArticleP>

      <ArticleP>
        <strong>Si no lo configuras:</strong> la imagen cloud acepta
        comportamientos de red que un atacante en la misma red (o en
        escenarios de enrutamiento) puede abusar. También facilita recolectar
        direcciones internas del kernel para exploit local.
      </ArticleP>

      <ArticleP>
        <strong>Qué hace cada grupo:</strong>
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>rp_filter</ArticleCode>: rechaza paquetes que llegan
          por la interfaz “equivocada” (anti-spoofing básico de IP)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>tcp_syncookies</ArticleCode>: ayuda a sobrevivir a una
          avalancha de conexiones falsas (SYN flood)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>accept_redirects</ArticleCode> /{" "}
          <ArticleCode>send_redirects</ArticleCode> en 0: el host no sigue ni
          reparte atajos de ruta falsificados
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>accept_source_route</ArticleCode> en 0: impide que el
          paquete diga por qué caminos debe viajar
        </ArticleLi>
        <ArticleLi>
          IPv6 con redirects apagados: misma idea que IPv4
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>kptr_restrict</ArticleCode> y{" "}
          <ArticleCode>dmesg_restrict</ArticleCode>: dificultan ver
          direcciones internas del kernel y el log de boot sin privilegio
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>protected_hardlinks</ArticleCode> /{" "}
          <ArticleCode>protected_symlinks</ArticleCode>: reducen trucos con
          enlaces en carpetas compartidas (ej.:{" "}
          <ArticleCode>/tmp</ArticleCode>)
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Colócalo en{" "}
        <ArticleCode>/etc/sysctl.d/99-hardening.conf</ArticleCode> (el{" "}
        <ArticleCode>99-</ArticleCode> solo garantiza orden después de otros
        defaults) y aplica:
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
        IPv6: si <strong>no</strong> lo usas, desactívalo o fíltralo a
        propósito. Dejar IPv6 encendido y olvidado con IPv4 cerrado es un
        agujero clásico. Si usas IPv6, trátalo en el firewall como IPv4.
      </ArticleP>

      <ArticleP>
        Base de datos, Redis, panel admin: si no necesitan internet pública,
        haz que el servicio escuche solo en{" "}
        <ArticleCode>localhost</ArticleCode> o en una red privada.
      </ArticleP>

      <ArticleH2>5. Host: tiempo, MAC, filesystem y audit</ArticleH2>

      <ArticleP>
        Controles del “núcleo” de la máquina: reloj, contención extra de
        procesos (MAC), higiene de carpetas y rastro de auditoría.
      </ArticleP>

      <ArticleH3>
        Tiempo con <TermLink href={CHRONY_URL}>chrony</TermLink>
      </ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong>{" "}
        <TermLink href={CHRONY_URL}>chrony</TermLink> sincroniza el reloj
        de Linux con servidores de tiempo (NTP).
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> logs con hora correcta, HTTPS/TLS
        válidos, tokens y autenticación que dependen de tiempo alineado.
      </ArticleP>

      <ArticleP>
        <strong>Si no lo configuras:</strong> el atacante no “rompe” el NTP.
        El equipo sufre solo: no cruza eventos en el incidente, el
        certificado parece inválido, y alguien apaga protección “solo para
        volver”.
      </ArticleP>

      <ArticleP>
        <strong>Cómo configurarlo:</strong> instalar, habilitar en el boot,
        confirmar con <ArticleCode>timedatectl</ArticleCode>.
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y chrony
sudo systemctl enable --now chrony

# Familia RHEL
sudo dnf install -y chrony
sudo systemctl enable --now chronyd

timedatectl status`}
      </ArticleCode>

      <ArticleH3>
        MAC: <TermLink href={APPARMOR_URL}>AppArmor</TermLink> /{" "}
        <TermLink href={SELINUX_URL}>SELinux</TermLink>
      </ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong> Mandatory Access Control. Además del
        usuario Linux tradicional, el sistema define qué puede tocar cada
        programa. En Ubuntu suele ser{" "}
        <TermLink href={APPARMOR_URL}>AppArmor</TermLink>. En
        RHEL/Rocky/Alma suele ser{" "}
        <TermLink href={SELINUX_URL}>SELinux</TermLink>.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> contener un servicio comprometido
        (web, base de datos, panel). Sin MAC, el proceso invadido hereda
        permisos amplios.
      </ArticleP>

      <ArticleP>
        <strong>Si no lo configuras (o lo dejas flojo):</strong> imagen
        cloud en modo permissive, o alguien lo apaga todo porque “la app no
        subió”. El atacante que ya entró en el proceso gana libertad que no
        debería tener.
      </ArticleP>

      <ArticleP>
        <strong>Cómo configurarlo el día 1:</strong> no escribas policy
        desde cero. Confirma que está realmente activo:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Debian/Ubuntu: <ArticleCode>aa-status</ArticleCode> (AppArmor
          activo y perfiles en enforce)
        </ArticleLi>
        <ArticleLi>
          RHEL: <ArticleCode>getenforce</ArticleCode> debe mostrar{" "}
          <ArticleCode>Enforcing</ArticleCode>.{" "}
          <ArticleCode>Permissive</ArticleCode> solo registra y no bloquea
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Si una app se rompe con MAC activo, ajusta la excepción de esa app.
        No apagues el MAC de toda la máquina.
      </ArticleP>

      <ArticleH3>Filesystem y permisos básicos</ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong> higiene de carpetas y permisos: sticky bit
        en tmp, evitar <ArticleCode>chmod 777</ArticleCode>, y (cuando sea
        posible) <ArticleCode>noexec,nosuid,nodev</ArticleCode> en
        temporales.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> limitar lo que un proceso ya
        dentro de la máquina puede escribir y ejecutar.
      </ArticleP>

      <ArticleP>
        <strong>Si no lo configuras:</strong> malware escribe en{" "}
        <ArticleCode>/tmp</ArticleCode>, ejecuta desde ahí, o sobrescribe un
        archivo en carpeta compartida. “Abre todos los permisos para que
        funcione” entrega escritura en un lugar sensible.
      </ArticleP>

      <ArticleP>
        <strong>Qué mirar en el baseline:</strong>
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>/tmp</ArticleCode> y{" "}
          <ArticleCode>/var/tmp</ArticleCode>: sticky bit; si el workload lo
          permite, <ArticleCode>noexec,nosuid,nodev</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Carpetas world-writable fuera de tmp:{" "}
          <ArticleCode>{`find / -xdev -type d -perm -0002 2>/dev/null`}</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Home y claves SSH: umask razonable; nada de{" "}
          <ArticleCode>chmod 777</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Particiones separadas (<ArticleCode>/var</ArticleCode>,{" "}
          <ArticleCode>/home</ArticleCode>) ayudan si un disco se llena; úsalas
          si el proveedor las ofrece
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        <TermLink href={AUDITD_URL}>auditd</TermLink> (mínimo)
      </ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong>{" "}
        <TermLink href={AUDITD_URL}>auditd</TermLink> registra eventos de
        seguridad (login, sudo, cambio de archivo sensible).
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> tener rastro después del incidente:
        qué cambió, quién cambió, cuándo.
      </ArticleP>

      <ArticleP>
        <strong>Si no lo configuras:</strong> el atacante limpia rastros
        básicos o el equipo no tiene qué correlacionar. Sin evidencia, la
        respuesta se vuelve feeling.
      </ArticleP>

      <ArticleP>
        <strong>Cómo configurarlo el día 1:</strong> deja el daemon activo.
        Reglas CIS completas son fase 2.
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y auditd
sudo systemctl enable --now auditd

# Familia RHEL
sudo dnf install -y audit
sudo systemctl enable --now auditd`}
      </ArticleCode>

      <ArticleH2>6. Mantenimiento, detección y verificación</ArticleH2>

      <ArticleP>
        Controles que mantienen el hardening vivo después del día 1: patch,
        contención de abuso, menos superficie y verificación.
      </ArticleP>

      <ArticleH3>Updates de seguridad</ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong> actualización automática (o al menos
        avisada) de paquetes de seguridad. En Debian/Ubuntu:{" "}
        <TermLink href={UNATTENDED_URL}>unattended-upgrades</TermLink>. En
        la familia RHEL:{" "}
        <TermLink href={DNF_AUTO_URL}>dnf-automatic</TermLink>.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> cerrar CVEs conocidos sin depender
        de “cuando se pueda”.
      </ArticleP>

      <ArticleP>
        <strong>Si no lo configuras:</strong> el atacante no necesita ser
        creativo. Basta un scanner + versión atrasada.
      </ArticleP>

      <ArticleP>
        <strong>Cómo configurarlo:</strong>
      </ArticleP>

      <ArticleP>Debian/Ubuntu:</ArticleP>
      <ArticleCode block>
        {`sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades`}
      </ArticleCode>

      <ArticleP>Familia RHEL:</ArticleP>
      <ArticleCode block>
        {`sudo dnf install -y dnf-automatic
sudo systemctl enable --now dnf-automatic.timer`}
      </ArticleCode>

      <ArticleP>
        Update de kernel sin reboot planificado no aplica de verdad: el
        proceso antiguo sigue en memoria.
      </ArticleP>

      <ArticleH3>
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink>
      </ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong>{" "}
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink> lee logs de
        fallo y bloquea la IP por un tiempo.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> contención de fuerza bruta y ruido
        (SSH, panel, mail, etc.). No sustituye la clave SSH.
      </ArticleP>

      <ArticleP>
        <strong>Si no lo configuras:</strong> el puerto recibe intentos
        automáticos todo el día. En servicios con contraseña, la fuerza
        bruta continúa hasta encontrar credencial débil.
      </ArticleP>

      <ArticleP>
        <strong>Cómo configurarlo:</strong>
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y fail2ban

# Familia RHEL (EPEL según la distro)
sudo dnf install -y fail2ban
sudo systemctl enable --now fail2ban`}
      </ArticleCode>

      <ArticleH3>Cortar servicios que no pediste</ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong> deshabilitar lo que la imagen cloud subió
        y el producto no usa (agente, demo, panel).
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> menos proceso = menos puerto,
        menos CVE, menos credencial.
      </ArticleP>

      <ArticleP>
        <strong>Si no cortas:</strong> superficie “de regalo” queda en
        internet sin que nadie mire.
      </ArticleP>

      <ArticleP>
        <strong>Cómo hacerlo:</strong> lista lo que escucha y lo que corre.
        Si no es del producto y no es dependencia, deshabilítalo.
      </ArticleP>

      <ArticleCode block>
        {`ss -tulpn
systemctl list-units --type=service --state=running`}
      </ArticleCode>

      <ArticleH3>Logs que importan</ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong> saber dónde mirar cuando algo huele mal.
        No es un SIEM el día 1.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve / si no miras:</strong> hardening sin log es
        fe. Sin rastro, no confirmas si el control funciona ni qué pasó en
        el incidente.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          SSH: <ArticleCode>journalctl -u ssh</ArticleCode> /{" "}
          <ArticleCode>sshd</ArticleCode> o{" "}
          <ArticleCode>/var/log/auth.log</ArticleCode>
        </ArticleLi>
        <ArticleLi>firewall / fail2ban: qué fue bloqueado</ArticleLi>
        <ArticleLi>
          updates: última corrida del unattended / dnf-automatic
        </ArticleLi>
        <ArticleLi>
          audit: <ArticleCode>ausearch</ArticleCode> /{" "}
          <ArticleCode>aureport</ArticleCode>
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        Verificar con <TermLink href={LYNIS_URL}>Lynis</TermLink>
      </ArticleH3>

      <ArticleP>
        <strong>Qué es:</strong>{" "}
        <TermLink href={LYNIS_URL}>Lynis</TermLink> es un scanner de
        higiene del host: recorre la máquina y lista lo que está flojo.
      </ArticleP>

      <ArticleP>
        <strong>Para qué sirve:</strong> medir lo que olvidaste (servicio
        encendido, permiso erróneo, update parado). No es cazar 400 findings
        CIS el día 1.
      </ArticleP>

      <ArticleP>
        <strong>Si no verificas:</strong> “endurecí” se queda en sensación,
        no en baseline.
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y lynis
sudo lynis audit system

# Familia RHEL
sudo dnf install -y lynis
sudo lynis audit system`}
      </ArticleCode>

      <ArticleCallout variant="note" title="El backup también es un control">
        <ArticleP>
          Snapshot del proveedor + backup de lo que importa (datos,{" "}
          <ArticleCode>/etc</ArticleCode>, claves fuera del VPS). Hardening
          sin recuperación es solo la mitad del trabajo.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>7. Checklist en el orden correcto</ArticleH2>

      <ArticleP>
        Aplica en este orden. Cada paso depende del anterior para no
        quedarte fuera.
      </ArticleP>

      <ArticleOl>
        <ArticleLi>Crear usuario con sudo/wheel y probar login</ArticleLi>
        <ArticleLi>
          Instalar clave SSH (perms 700/600) y probar en una segunda sesión
        </ArticleLi>
        <ArticleLi>
          Endurecer sshd (sin root/contraseña, AllowUsers, MaxAuthTries),{" "}
          <ArticleCode>sshd -t</ArticleCode>, reload
        </ArticleLi>
        <ArticleLi>
          Revisar sudoers (sin <ArticleCode>NOPASSWD:ALL</ArticleCode> amplio)
        </ArticleLi>
        <ArticleLi>
          Firewall default-deny; liberar SSH (+ HTTP/S si hace falta);
          activar
        </ArticleLi>
        <ArticleLi>
          Aplicar sysctl; decidir IPv6 a propósito
        </ArticleLi>
        <ArticleLi>
          chrony/NTP ok; AppArmor enforce / SELinux Enforcing
        </ArticleLi>
        <ArticleLi>auditd activo; tmp y permisos básicos ok</ArticleLi>
        <ArticleLi>
          Updates de seguridad + fail2ban; cortar servicios inútiles
        </ArticleLi>
        <ArticleLi>
          Lynis (o equivalente) + snapshot/backup; confirmar inventario
        </ArticleLi>
      </ArticleOl>

      <ArticleTable caption="Anti-patrones comunes en VPS">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Anti-patrón</ArticleTh>
            <ArticleTh>Por qué duele</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Root + contraseña en 22 “solo hoy”</ArticleTd>
            <ArticleTd>Los bots no respetan el calendario</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Firewall después del deploy</ArticleTd>
            <ArticleTd>Después = nunca; la app ya expuso puerto</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Solo cambiar el puerto SSH</ArticleTd>
            <ArticleTd>Higiene de log, no control</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Reload sshd sin sesión de respaldo</ArticleTd>
            <ArticleTd>Un typo y perdiste el servidor</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>NOPASSWD:ALL en sudo</ArticleTd>
            <ArticleTd>Cuenta comprometida = root inmediato</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>IPv6 encendido y olvidado</ArticleTd>
            <ArticleTd>Bypass silencioso del firewall IPv4</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>SELinux/AppArmor en permissive eterno</ArticleTd>
            <ArticleTd>Costo sin el beneficio del bloqueo</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Updates manuales eternos</ArticleTd>
            <ArticleTd>CVE conocido se vuelve incidente previsible</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>“Endurecí” sin Lynis/inventario</ArticleTd>
            <ArticleTd>Sensación de seguridad ≠ baseline</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH3>Puntos clave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Cada control: qué es, para qué sirve, qué pasa si falta, y cómo
          configurarlo.
        </ArticleLi>
        <ArticleLi>
          El orden importa: usuario, clave, sshd/sudo, firewall/sysctl,
          tiempo/MAC, updates, verificar.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={OPENSSH_URL}>OpenSSH</TermLink> con clave,
          AllowUsers y sin contraseña/root vale más que cambiar el puerto.
        </ArticleLi>
        <ArticleLi>
          Firewall + <TermLink href={SYSCTL_URL}>sysctl</TermLink> +
          decisión explícita de IPv6.
        </ArticleLi>
        <ArticleLi>
          Tiempo (chrony), MAC (AppArmor/SELinux) y auditd son host, no
          opcionales.
        </ArticleLi>
        <ArticleLi>
          Updates + fail2ban + cortar servicios + Lynis + backup cierran el
          ciclo.
        </ArticleLi>
        <ArticleLi>
          CIS profundo y hardening de contenedores: fase 2, después del
          baseline vivo.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusión</ArticleH3>

      <ArticleP>
        El hardening de VPS en el día 1-2 no es un checklist infinito. Es
        cerrar identidad, perímetro, host y mantenimiento con comandos
        claros y un orden seguro. Aplica el inventario, endurece lo que la
        lista cubre, verifica con Lynis y mantén el patch corriendo. El
        resto (CIS completo, policy MAC avanzada, contenedores) entra cuando
        el baseline ya está vivo.
      </ArticleP>
    </>
  );
}
