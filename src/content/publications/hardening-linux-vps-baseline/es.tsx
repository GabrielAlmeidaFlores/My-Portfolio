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
  Internet --> Other["Panel / DB / otros"]
  SSH --> Host["Host Linux"]
  Web --> Host
  Other --> Host
  Host --> Priv["Privilegios / sudo"]
  Host --> Kernel["Kernel / sysctl"]
  Host --> Fs["Filesystem / MAC"]`;

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
      <ArticleH2>1. El problema del VPS “listo”</ArticleH2>

      <ArticleP>
        Un VPS “listo” del panel del proveedor suele parecer lo bastante
        seguro: Ubuntu fresco, SSH en 22, acceso root con contraseña “solo
        para levantar el servicio”. En pocas horas el{" "}
        <ArticleCode>auth.log</ArticleCode> ya muestra el patrón: intentos de
        login desde IPs aleatorios golpeando el puerto más escaneado de
        internet.
      </ArticleP>

      <ArticleP>
        No hace falta un APT sofisticado. Basta un baseline incompleto:
        credencial obvia, sysctl por defecto de la imagen, reloj sin NTP, MAC
        (AppArmor/SELinux) sin comprobar si está enforcing, cero verificación
        después del deploy.
      </ArticleP>

      <ArticleP>
        Este post es el hardening que aplico como{" "}
        <strong>completo para el día 1-2 de un VPS Linux</strong>: identidad,
        perímetro, kernel/red, host (tiempo, MAC, filesystem), mantenimiento,
        detección y verificación. Distro-agnóstico, con pares Debian/Ubuntu y
        RHEL/Rocky/Alma donde cambia la herramienta.
      </ArticleP>

      <ArticleP>
        No es una auditoría corporativa de{" "}
        <TermLink href={CIS_URL}>CIS Benchmark</TermLink>. No es hardening de
        contenedor/Kubernetes. Es el mapa que quita el 80% tonto y cubre los
        temas que más importan antes de apuntar DNS de producción.
      </ArticleP>

      <ArticleCallout variant="tip" title="¿Quieres el checklist ya?">
        <ArticleP>
          Salta a la{" "}
          <a href="#7-checklist-en-el-orden-correcto" className={linkClass}>
            sección 7
          </a>
          : orden seguro + anti-patrones. Las secciones{" "}
          <a href="#3-identidad-y-acceso" className={linkClass}>
            3
          </a>
          {" "}
          a{" "}
          <a
            href="#6-mantenimiento-deteccion-y-verificacion"
            className={linkClass}
          >
            6
          </a>{" "}
          explican cada control.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Lo que suele quedar abierto en un “servidor nuevo”:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          SSH con contraseña (y a veces root) en el puerto 22
        </ArticleLi>
        <ArticleLi>
          firewall apagado o “allow all” porque la app “tiene que funcionar”
        </ArticleLi>
        <ArticleLi>
          kernel/sysctl en el default de la imagen cloud
        </ArticleLi>
        <ArticleLi>
          reloj sin NTP/chrony (logs y TLS empiezan a mentir)
        </ArticleLi>
        <ArticleLi>
          MAC (AppArmor/SELinux) permissive o apagado sin querer
        </ArticleLi>
        <ArticleLi>
          updates manuales “cuando pueda”, y nunca puedo
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>2. Superficie de ataque</ArticleH2>

      <ArticleP>
        El hardening empieza con inventario. Todo lo que escucha en la red es
        puerta de entrada. Todo lo que corre con privilegio es radio de
        explosión. Todo lo que el kernel acepta por defecto es política
        implícita.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Internet, host, privilegios, kernel y filesystem"
        chart={SURFACE_CHART}
      />

      <ArticleP>El día 1 respondo cinco preguntas:</ArticleP>

      <ArticleOl>
        <ArticleLi>¿Quién puede entrar? (cuentas y SSH)</ArticleLi>
        <ArticleLi>
          ¿Desde dónde y por qué puertos? (firewall y red)
        </ArticleLi>
        <ArticleLi>
          ¿Las reglas de red del sistema están en un default seguro?
        </ArticleLi>
        <ArticleLi>
          ¿Reloj, protección del sistema y carpetas básicas están ok?
        </ArticleLi>
        <ArticleLi>
          ¿Qué sigue corriendo si no miro la caja una semana?
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        Inventario rápido que corro antes de “cerrar”. Cada comando responde
        una pregunta simple:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>whoami; id</ArticleCode>: quién está conectado y si esa
          cuenta tiene poder de administrador
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ss -tulpn</ArticleCode>: qué puertos están abiertos y
          qué programa usa cada uno
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>systemctl list-units …</ArticleCode>: qué servicios
          están corriendo ahora (qué mantiene encendida la máquina)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ufw</ArticleCode> / <ArticleCode>firewall-cmd</ArticleCode>:
          si el firewall está activo y qué deja pasar
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>timedatectl</ArticleCode>: si el reloj del servidor
          está bien (logs y HTTPS dependen de eso)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>aa-status</ArticleCode> (Debian/Ubuntu) o{" "}
          <ArticleCode>getenforce</ArticleCode> (RHEL): si la protección extra
          del sistema (AppArmor o SELinux) está realmente activa
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

      <ArticleCallout variant="note" title="Distro-agnóstico a propósito">
        <ArticleP>
          Principios únicos. Donde cambia la herramienta:{" "}
          <TermLink href={UFW_URL}>UFW</TermLink> vs{" "}
          <TermLink href={FIREWALLD_URL}>firewalld</TermLink>,{" "}
          <ArticleCode>apt</ArticleCode> vs <ArticleCode>dnf</ArticleCode>,{" "}
          <TermLink href={APPARMOR_URL}>AppArmor</TermLink> vs{" "}
          <TermLink href={SELINUX_URL}>SELinux</TermLink>.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. Identidad y acceso</ArticleH2>

      <ArticleP>
        Patrón clásico: “solo subir un nginx” y operar todo como root porque
        es más rápido. Al desactivar el login root remoto, quien dejó una
        única sesión abierta (la de root) se queda fuera. Por eso el orden
        importa antes que la prisa.
      </ArticleP>

      <ArticleP>
        Orden correcto: usuario con sudo, luego clave SSH, luego endurecer{" "}
        <TermLink href={OPENSSH_URL}>sshd</TermLink> y{" "}
        <TermLink href={SUDOERS_URL}>sudo</TermLink>, luego solo entonces cortar lo
        que duele.
      </ArticleP>

      <ArticleH3>Usuario con sudo, no root en el día a día</ArticleH3>

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

      <ArticleP>En tu notebook:</ArticleP>
      <ArticleCode block>
        {`ssh-keygen -t ed25519 -C "vps-deploy"
ssh-copy-id deploy@TU_IP`}
      </ArticleCode>

      <ArticleP>
        Confirma el login por clave en una sesión nueva. Solo entonces toca{" "}
        <TermLink href={SSHD_CONFIG_URL}>sshd_config</TermLink>. Permisos que
        verifico: <ArticleCode>~/.ssh</ArticleCode> en{" "}
        <ArticleCode>700</ArticleCode>,{" "}
        <ArticleCode>authorized_keys</ArticleCode> en{" "}
        <ArticleCode>600</ArticleCode>.
      </ArticleP>

      <ArticleH3>Endurecer sshd (sin quedarte fuera)</ArticleH3>

      <ArticleCallout variant="warning" title="Antes de reiniciar sshd">
        <ArticleP>
          Mantén una sesión SSH abierta y probada. Ejecuta{" "}
          <ArticleCode>sshd -t</ArticleCode> después de editar. Solo entonces
          recarga. Si algo falla, la sesión vieja aún te salva.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Mínimo que aplico. En lenguaje simple:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>PermitRootLogin no</ArticleCode>: nadie entra como
          root directo por SSH
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>PasswordAuthentication no</ArticleCode>: contraseña SSH
          apagada; solo clave
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>PubkeyAuthentication yes</ArticleCode>: login por
          clave permitido
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>KbdInteractiveAuthentication no</ArticleCode>: cierra
          otro camino de contraseña interactiva
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>X11Forwarding no</ArticleCode>: no reenvía interfaz
          gráfica por SSH (innecesario en el VPS)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>AllowUsers deploy</ArticleCode>: solo esa cuenta puede
          intentar SSH (cámbialo por tu usuario real)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>MaxAuthTries</ArticleCode> /{" "}
          <ArticleCode>LoginGraceTime</ArticleCode>: menos intentos y menos
          tiempo parado en el puerto de login
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ClientAliveInterval</ArticleCode> /{" "}
          <ArticleCode>ClientAliveCountMax</ArticleCode>: cierra sesión
          abandonada y libera recurso
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
        Archivo típico: <ArticleCode>/etc/ssh/sshd_config</ArticleCode> o
        drop-in en <ArticleCode>/etc/ssh/sshd_config.d/</ArticleCode>. Ajusta{" "}
        <ArticleCode>AllowUsers</ArticleCode> a tu usuario real.
      </ArticleP>

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
        <ArticleCode>NOPASSWD:ALL</ArticleCode> “para facilitar el CI” se
        vuelve movimiento lateral fácil si cae la cuenta. Prefiero contraseña
        en sudo (o auth fuerte) y reglas estrechas en{" "}
        <ArticleCode>/etc/sudoers.d/</ArticleCode>. Nunca editar{" "}
        <ArticleCode>sudoers</ArticleCode> sin{" "}
        <ArticleCode>visudo</ArticleCode>.
      </ArticleP>

      <ArticleH3>¿Cambiar el puerto? Matiz</ArticleH3>

      <ArticleP>
        Pasar el puerto 22 a 2222 reduce ruido en el log. No es un control real. Los
        bots escanean puertos. Trato el puerto custom como higiene de señal.
        La barrera es clave + sin contraseña + sin root + AllowUsers.
      </ArticleP>

      <ArticleH2>4. Red y perímetro</ArticleH2>

      <ArticleP>
        Otro patrón: app en el aire, firewall “después”. Después rara vez
        llega. Cualquier servicio en <ArticleCode>0.0.0.0</ArticleCode>{" "}
        (escuchando en todas las interfaces, incluida la pública) se vuelve
        entrada. Además del firewall, el kernel tiene reglas de red propias.
        Si dejas el default de la imagen cloud, el servidor acepta
        comportamientos de red que un atacante puede intentar abusar.
      </ArticleP>

      <ArticleP>
        Regla: default-deny en entrada. Solo abre lo que el producto necesita
        (casi siempre SSH + 80/443). Después, ajusta las reglas de red del
        kernel.
      </ArticleP>

      <ArticleH3>
        <TermLink href={UFW_URL}>UFW</TermLink> (Debian/Ubuntu)
      </ArticleH3>

      <ArticleP>
        El firewall es la lista de lo que puede entrar a la máquina desde
        internet. Sin él (o con “libera todo”), cualquier servicio que
        escuche en un puerto queda alcanzable. Los atacantes barren puertos
        todo el día; lo abierto se vuelve intento automático.
      </ArticleP>

      <ArticleP>
        En Debian/Ubuntu uso <TermLink href={UFW_URL}>UFW</TermLink>: una
        capa simple sobre las reglas del sistema. La lógica es denegar
        entrada por defecto, liberar solo SSH y HTTP/HTTPS, y recién entonces
        activar.
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
        <TermLink href={FIREWALLD_URL}>firewalld</TermLink> (familia RHEL)
      </ArticleH3>

      <ArticleP>
        En la familia RHEL el rol es el mismo: controlar qué entra. La
        herramienta por defecto suele ser{" "}
        <TermLink href={FIREWALLD_URL}>firewalld</TermLink>. En lugar de
        “allow OpenSSH”, agregas servicios (ssh, http, https) y aplicas con
        reload.
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
          Libera SSH <strong>antes</strong> de activar el firewall. Si el
          puerto SSH no es 22, permítelo explícitamente. Confirma en una
          segunda sesión antes de cerrar la primera.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>
        <TermLink href={SYSCTL_URL}>sysctl</TermLink> de red (baseline)
      </ArticleH3>

      <ArticleP>
        <TermLink href={SYSCTL_URL}>sysctl</TermLink> es la forma de leer y
        cambiar parámetros del kernel en Linux (red, memoria, seguridad
        básica). El firewall corta tráfico en los puertos. sysctl cambia cómo
        el propio sistema trata paquetes e información sensible. Se
        complementan.
      </ArticleP>

      <ArticleP>
        En lugar de editar un archivo suelto y perderlo en el próximo reboot,
        pongo un archivo en{" "}
        <ArticleCode>/etc/sysctl.d/99-hardening.conf</ArticleCode>. Todo lo
        que está en esa carpeta se carga de forma estable. El prefijo{" "}
        <ArticleCode>99-</ArticleCode> solo hace que corra después de otros
        defaults.
      </ArticleP>

      <ArticleP>Lo que hace este baseline, por grupos:</ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>rp_filter</ArticleCode>: rechaza paquetes que “llegan
          por la puerta equivocada” (anti-spoofing básico de IP)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>tcp_syncookies</ArticleCode>: ayuda al servidor a
          sobrevivir una lluvia de conexiones falsas (SYN flood)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>accept_redirects</ArticleCode> /{" "}
          <ArticleCode>send_redirects</ArticleCode> en 0: el host no sigue ni
          reparte atajos de ruta que un atacante en la red podría falsificar
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>accept_source_route</ArticleCode> en 0: impide que el
          paquete diga por qué caminos debe viajar (recurso viejo y peligroso
          en internet pública)
        </ArticleLi>
        <ArticleLi>
          IPv6 con redirects apagados: la misma idea que IPv4, para no dejar
          un agujero solo porque la imagen vino con IPv6 encendido
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>kptr_restrict</ArticleCode> y{" "}
          <ArticleCode>dmesg_restrict</ArticleCode>: dificultan ver direcciones
          internas del kernel y el log de boot sin privilegio (información útil
          para exploits)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>protected_hardlinks</ArticleCode> /{" "}
          <ArticleCode>protected_symlinks</ArticleCode>: reducen trucos con
          enlaces de archivo en carpetas compartidas (ej.{" "}
          <ArticleCode>/tmp</ArticleCode>)
        </ArticleLi>
      </ArticleUl>

      <ArticleP>Archivo típico:</ArticleP>

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

      <ArticleP>Para aplicar sin reiniciar:</ArticleP>

      <ArticleCode block>{`sudo sysctl --system`}</ArticleCode>

      <ArticleP>
        Ese comando recarga los archivos de{" "}
        <ArticleCode>/etc/sysctl.d/</ArticleCode>. Si la sintaxis está mal,
        el propio sysctl avisa.
      </ArticleP>

      <ArticleP>
        IPv6: si <strong>no</strong> lo usas, desactívalo o pon reglas de
        firewall a propósito. Dejar IPv6 “encendido y olvidado” sin filtro es
        un agujero clásico: IPv4 cerrado e IPv6 abierto. Si usas IPv6 de
        verdad, trátalo en el firewall como IPv4.
      </ArticleP>

      <ArticleP>
        Base de datos, Redis, panel admin: si no necesitan internet pública,
        no se abren ahí. Haz que el servicio escuche solo en{" "}
        <ArticleCode>localhost</ArticleCode> (la propia máquina) o en una red
        privada.
      </ArticleP>

      <ArticleH2>5. Host: tiempo, MAC y filesystem</ArticleH2>

      <ArticleP>
        Hasta aquí cerramos <strong>quién entra</strong> (SSH/sudo) y{" "}
        <strong>qué deja pasar la red</strong> (firewall/sysctl). Falta el
        “núcleo” de la máquina: reloj, candado extra de procesos e higiene de
        carpetas. Sin eso, el baseline parece listo y falla en el incidente o
        en un exploit local.
      </ArticleP>

      <ArticleP>
        Esta sección cubre cuatro piezas del host. En cada una: el problema,
        cómo suele explotarse, y el mínimo que aplico el día 1.
      </ArticleP>

      <ArticleH3>
        Tiempo con <TermLink href={CHRONY_URL}>chrony</TermLink>
      </ArticleH3>

      <ArticleP>
        Un servidor con el reloj mal parece un detalle molesto. No lo es.
        Logs con hora torcida dificultan investigar una intrusión. Un
        certificado HTTPS puede aparecer como “aún no válido” o “ya expiró”
        solo porque la máquina va adelantada o atrasada. Tokens y autenticación
        también dependen de la hora correcta.
      </ArticleP>

      <ArticleP>
        Cómo aparece en la práctica: el atacante no necesita “romper” NTP. El
        equipo sufre solo. Alguien mira el log, no puede correlacionar
        eventos, y pierde tiempo. En peores casos, servicios que exigen hora
        alineada fallan y el equipo apaga protecciones “solo para recuperar”.
      </ArticleP>

      <ArticleP>
        <TermLink href={CHRONY_URL}>chrony</TermLink> es el programa que
        sincroniza el reloj de Linux con servidores de tiempo en internet (o
        internos). El día 1 lo instalo, lo dejo en el boot, y confirmo con{" "}
        <ArticleCode>timedatectl</ArticleCode>.
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

      <ArticleP>
        En el status, lo que importa es ver que el reloj está sincronizado
        (NTP/chrony activo). Si no lo está, corrige zona horaria y red antes
        de seguir.
      </ArticleP>

      <ArticleH3>
        MAC: <TermLink href={APPARMOR_URL}>AppArmor</TermLink> /{" "}
        <TermLink href={SELINUX_URL}>SELinux</TermLink>
      </ArticleH3>

      <ArticleP>
        Aunque el SSH y el firewall estén bien, un servicio vulnerable (web,
        base de datos, panel) aún puede ser invadido. Sin un candado extra, el
        proceso comprometido hereda permisos amplios y se vuelve cabeza de
        playa para leer archivos, subir un binario o pivotar en la máquina.
      </ArticleP>

      <ArticleP>
        MAC (Mandatory Access Control) es ese candado. El sistema define qué
        puede tocar cada programa, más allá del usuario Linux tradicional. En
        Ubuntu suele ser{" "}
        <TermLink href={APPARMOR_URL}>AppArmor</TermLink>. En RHEL/Rocky/Alma
        suele ser <TermLink href={SELINUX_URL}>SELinux</TermLink>.
      </ArticleP>

      <ArticleP>
        Cómo se explota: muchas imágenes cloud vienen con MAC en modo flojo,
        o alguien lo apaga todo porque “la app no subía”. Entonces el
        atacante que ya entró al proceso gana libertad que no debería tener.
      </ArticleP>

      <ArticleP>
        El día 1 no escribo policy desde cero. Confirmo que la protección
        está realmente activa y solo abro una excepción puntual si hace
        falta.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Debian/Ubuntu: <ArticleCode>aa-status</ArticleCode> muestra si
          AppArmor está activo y qué programas están realmente restringidos
          (enforce)
        </ArticleLi>
        <ArticleLi>
          Familia RHEL: <ArticleCode>getenforce</ArticleCode> debe mostrar{" "}
          <ArticleCode>Enforcing</ArticleCode> (encendido y bloqueando).{" "}
          <ArticleCode>Permissive</ArticleCode> solo registra y no bloquea.
          No lo dejes así “por ahora”
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Si una app se rompe con MAC encendido, ajusta la excepción de esa
        app. No apagues el MAC de toda la máquina.
      </ArticleP>

      <ArticleH3>Filesystem y permisos básicos</ArticleH3>

      <ArticleP>
        Red y login controlan la puerta de adelante. Carpetas y permisos
        controlan lo que un proceso ya dentro de la máquina puede hacer. El
        hardening de filesystem del día 1 no es “CIS completo”. Es cortar los
        errores clásicos: carpeta temporal ejecutable,{" "}
        <ArticleCode>chmod 777</ArticleCode>, y directorio donde cualquiera
        escribe.
      </ArticleP>

      <ArticleP>
        Cómo se explota: malware o un script bajado escribe en{" "}
        <ArticleCode>/tmp</ArticleCode>, ejecuta desde ahí, o sobrescribe un
        archivo en una carpeta compartida. También aparece “abre todos los
        permisos para que funcione” y una cuenta débil empieza a escribir en
        un lugar sensible.
      </ArticleP>

      <ArticleP>Lo que miro en el baseline:</ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>/tmp</ArticleCode> y{" "}
          <ArticleCode>/var/tmp</ArticleCode>: carpetas compartidas. El sticky
          bit hace que cada uno borre solo su propio archivo. En VPS
          dedicada, si el workload lo permite,{" "}
          <ArticleCode>noexec,nosuid,nodev</ArticleCode> evita ejecutar un
          binario desde tmp
        </ArticleLi>
        <ArticleLi>
          Evita carpetas “todos escriben” fuera de tmp:{" "}
          <ArticleCode>{`find / -xdev -type d -perm -0002 2>/dev/null`}</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Home y claves SSH: umask razonable; nada de{" "}
          <ArticleCode>chmod 777</ArticleCode> “para que funcione”
        </ArticleLi>
        <ArticleLi>
          Particiones separadas (<ArticleCode>/var</ArticleCode>,{" "}
          <ArticleCode>/home</ArticleCode>) ayudan si un disco se llena: el
          resto del sistema aún arranca. No todo VPS cloud las ofrece; si el
          proveedor las da, úsalas
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        <TermLink href={AUDITD_URL}>auditd</TermLink> (mínimo)
      </ArticleH3>

      <ArticleP>
        Después del ataque, la pregunta es siempre la misma: qué cambió,
        quién lo cambió, cuándo. Sin rastro, solo tienes feeling.{" "}
        <TermLink href={AUDITD_URL}>auditd</TermLink> es el servicio de Linux
        que registra eventos de seguridad (login, sudo, cambio de archivo
        sensible).
      </ArticleP>

      <ArticleP>
        Cómo se explota la ausencia: el atacante limpia rastros básicos, o el
        equipo no tiene qué correlacionar. Con auditd activo, queda evidencia
        mínima para empezar la respuesta.
      </ArticleP>

      <ArticleP>
        El día 1 solo dejo el daemon activo. Reglas CIS completas son fase 2.
        La ganancia inmediata es tener rastro cuando alguien toca
        autenticación y sudoers.
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
        Un baseline del día 1 no basta si la máquina se pudre después. Esta
        sección es lo que mantiene el hardening vivo: actualizar, detectar
        abuso, cortar servicio inútil y verificar que lo que crees aplicado
        realmente está ahí.
      </ArticleP>

      <ArticleH3>Updates sin drama</ArticleH3>

      <ArticleP>
        Cada mes salen correcciones de seguridad. Si el VPS pasa meses sin
        update, un agujero público (CVE) sale en titulares y tu host sigue
        vulnerable. El atacante no necesita ser creativo: basta un scanner y
        una versión atrasada.
      </ArticleP>

      <ArticleP>
        Por eso automatizo al menos el parche de seguridad. En Debian/Ubuntu
        uso <TermLink href={UNATTENDED_URL}>unattended-upgrades</TermLink>.
        En la familia RHEL uso{" "}
        <TermLink href={DNF_AUTO_URL}>dnf-automatic</TermLink>.
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
        En VPS personal/staging, unattended de seguridad es higiene. En
        producción sensible, automatiza el aviso y controla la ventana, pero
        no lo dejes manual eterno. Un update de kernel sin reboot planeado no
        aplica de verdad: el proceso viejo sigue en memoria.
      </ArticleP>

      <ArticleH3>
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink> (o equivalente)
      </ArticleH3>

      <ArticleP>
        Aunque la contraseña SSH esté apagada, el puerto sigue recibiendo
        intentos automáticos. En otros servicios (panel web, mail, etc.) el
        patrón es el mismo: fuerza bruta hasta encontrar una contraseña
        débil.
      </ArticleP>

      <ArticleP>
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink> lee logs de fallo y
        bloquea la IP un tiempo. No sustituye claves SSH. Es contención de
        ruido y abuso.
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y fail2ban

# Familia RHEL (EPEL según la distro)
sudo dnf install -y fail2ban
sudo systemctl enable --now fail2ban`}
      </ArticleCode>

      <ArticleP>
        Con contraseña apagada, fail2ban no es la estrella. Aun así corta
        ruido y ayuda si alguien reactiva contraseña “temporalmente” o si
        otro servicio queda expuesto.
      </ArticleP>

      <ArticleH3>Cortar lo que nadie pidió</ArticleH3>

      <ArticleP>
        La imagen cloud muchas veces sube con servicios extra (agente, demo,
        panel). Cada servicio de más es superficie: puerto, CVE, credencial.
        El baseline pregunta: ¿esto es del producto o vino de regalo?
      </ArticleP>

      <ArticleP>Lista lo que escucha y lo que está corriendo:</ArticleP>

      <ArticleCode block>
        {`ss -tulpn
systemctl list-units --type=service --state=running`}
      </ArticleCode>

      <ArticleP>
        Si no sabes para qué sirve y no es dependencia del producto:
        desactívalo. Menos proceso = menos CVE delante.
      </ArticleP>

      <ArticleH3>Logs que miro</ArticleH3>

      <ArticleP>
        Hardening sin mirar log es fe. No monto SIEM el día 1. Sé dónde
        mirar cuando algo huele mal:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          SSH: <ArticleCode>journalctl -u ssh</ArticleCode> /{" "}
          <ArticleCode>sshd</ArticleCode> o{" "}
          <ArticleCode>/var/log/auth.log</ArticleCode>
        </ArticleLi>
        <ArticleLi>firewall / fail2ban: lo bloqueado</ArticleLi>
        <ArticleLi>
          updates: última corrida de unattended / dnf-automatic
        </ArticleLi>
        <ArticleLi>
          audit: <ArticleCode>ausearch</ArticleCode> /{" "}
          <ArticleCode>aureport</ArticleCode> cuando aparece algo “raro”
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        Verificar con <TermLink href={LYNIS_URL}>Lynis</TermLink>
      </ArticleH3>

      <ArticleP>
        Después de aplicar el baseline, es fácil creer que “está endurecido”
        sin medir. <TermLink href={LYNIS_URL}>Lynis</TermLink> es un scanner
        de higiene: recorre la máquina y lista lo que está flojo.
      </ArticleP>

      <ArticleP>
        No lo uso el día 1 para cazar 400 findings de CIS. Lo uso para ver
        lo que olvidé (servicio encendido, permiso malo, update parado).
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

      <ArticleMermaid
        ariaLabel="Orden seguro de hardening del dia 1 al 2"
        chart={ORDER_CHART}
      />

      <ArticleP>
        Checklist que uso antes de apuntar DNS de producción:
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
          Aplicar sysctl de red/kernel; decidir IPv6 a propósito
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

      <ArticleTable caption="Anti-patrones que más veo en VPS">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Anti-patrón</ArticleTh>
            <ArticleTh>Por qué duele</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Root + contraseña en 22 “solo hoy”</ArticleTd>
            <ArticleTd>Los bots no respetan calendarios</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Firewall después del deploy</ArticleTd>
            <ArticleTd>Después = nunca; la app ya expuso el puerto</ArticleTd>
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
            <ArticleTd>SELinux/AppArmor permissive eterno</ArticleTd>
            <ArticleTd>Pagaste el costo sin el beneficio</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Updates manuales eternos</ArticleTd>
            <ArticleTd>Un CVE conocido se vuelve incidente previsible</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>“Endurecí” sin Lynis/inventario</ArticleTd>
            <ArticleTd>Sensación de seguridad ≠ baseline</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Frase de ops/entrevista que funciona mejor que “uso Linux”:
      </ArticleP>

      <ArticleP>
        “El día 1-2 cierro identidad (clave, sin root/contraseña, sudo
        estrecho), perímetro (default-deny + sysctl), host (tiempo, MAC,
        filesystem, audit) y mantenimiento (updates, fail2ban, verificación).
        CIS completo y contenedor quedan fase 2.”
      </ArticleP>

      <ArticleH3>Puntos clave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Un baseline completo quita el 80% tonto y cubre los temas que más
          importan, sin vender impenetrable.
        </ArticleLi>
        <ArticleLi>
          El orden importa: usuario, luego clave, luego sshd/sudo, luego
          firewall/sysctl, luego tiempo/MAC, luego updates, luego verificar.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={OPENSSH_URL}>OpenSSH</TermLink> con clave,
          AllowUsers y sin contraseña/root vale más que cambiar el puerto.
        </ArticleLi>
        <ArticleLi>
          Firewall + <TermLink href={SYSCTL_URL}>sysctl</TermLink> + decisión
          explícita de IPv6.
        </ArticleLi>
        <ArticleLi>
          Tiempo (chrony), MAC (AppArmor/SELinux) y auditd son host, no
          “extra opcional”.
        </ArticleLi>
        <ArticleLi>
          Updates + fail2ban + cortar servicios + Lynis + backup cierran el
          ciclo.
        </ArticleLi>
        <ArticleLi>
          CIS profundo, policy MAC avanzada y hardening de contenedor:
          siguiente nivel, después del baseline vivo.
        </ArticleLi>
      </ArticleUl>
    </>
  );
}
