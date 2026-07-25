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
        Ya dejé un VPS demasiado “listo”. Panel del proveedor, Ubuntu fresco,
        SSH en 22, root con contraseña porque “es solo una prueba”. En menos
        de un día el <ArticleCode>auth.log</ArticleCode> parecía una subasta:
        intentos de login desde IPs que nunca había visto.
      </ArticleP>

      <ArticleP>
        No fue un APT sofisticado. Fue el baseline que salté. La caja estaba
        en internet con el puerto más golpeado del planeta y la credencial más
        obvia. Después encontré el resto del agujero: sysctl por defecto,
        reloj torcido, AppArmor “quién sabe si está enforcing”, cero
        verificación.
      </ArticleP>

      <ArticleP>
        Este post es el hardening que trato como{" "}
        <strong>completo para el día 1–2 de un VPS Linux</strong>: identidad,
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
          –{" "}
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
          updates manuales “cuando pueda” — y nunca puedo
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
        <ArticleLi>¿Quién puede entrar? (identidad)</ArticleLi>
        <ArticleLi>¿Desde dónde y por qué puertos? (perímetro)</ArticleLi>
        <ArticleLi>¿El kernel ayuda o estorba? (sysctl)</ArticleLi>
        <ArticleLi>
          ¿Tiempo, MAC y filesystem están en un mínimo seguro?
        </ArticleLi>
        <ArticleLi>
          ¿Qué sigue corriendo si no miro la caja una semana? (mantenimiento)
        </ArticleLi>
      </ArticleOl>

      <ArticleP>Inventario rápido que corro antes de “cerrar”:</ArticleP>

      <ArticleCode block>
        {`whoami; id
ss -tulpn
systemctl list-units --type=service --state=running
sudo ufw status verbose 2>/dev/null || sudo firewall-cmd --list-all 2>/dev/null
timedatectl
# Debian/Ubuntu
aa-status 2>/dev/null | head
# Familia RHEL
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
        Escena: necesitaba “solo subir un nginx”. Hice todo como root porque
        era más rápido. Después tuve que desactivar login root remoto — y casi
        me quedo fuera porque la única sesión abierta era la de root.
      </ArticleP>

      <ArticleP>
        Orden correcto: usuario con sudo → clave SSH → endurecer{" "}
        <TermLink href={OPENSSH_URL}>sshd</TermLink> y{" "}
        <TermLink href={SUDOERS_URL}>sudo</TermLink> → solo entonces cortar lo
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

      <ArticleP>Mínimo que aplico:</ArticleP>
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
        <ArticleCode>/etc/sudoers.d/</ArticleCode> — nunca editar{" "}
        <ArticleCode>sudoers</ArticleCode> sin{" "}
        <ArticleCode>visudo</ArticleCode>.
      </ArticleP>

      <ArticleH3>¿Cambiar el puerto? Matiz</ArticleH3>

      <ArticleP>
        Pasar de 22 → 2222 reduce ruido en el log. No es un control real. Los
        bots escanean puertos. Trato el puerto custom como higiene de señal.
        La barrera es clave + sin contraseña + sin root + AllowUsers.
      </ArticleP>

      <ArticleH2>4. Red y perímetro</ArticleH2>

      <ArticleP>
        Escena: app en el aire, firewall “después”. Después nunca llegó.
        Cualquier servicio en <ArticleCode>0.0.0.0</ArticleCode> se volvió
        entrada. El sysctl default de la imagen dejó el host más hablador de
        lo que quería.
      </ArticleP>

      <ArticleP>
        Regla: default-deny en entrada. Solo abre lo que el producto necesita
        (casi siempre SSH + 80/443). Después, net.sysctl básico.
      </ArticleP>

      <ArticleH3>
        <TermLink href={UFW_URL}>UFW</TermLink> (Debian/Ubuntu)
      </ArticleH3>

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
        Drop-in típico en{" "}
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
        IPv6: si <strong>no</strong> lo usas, desactívalo o firewalléalo con
        intención. Dejar IPv6 “encendido y olvidado” sin reglas es un agujero
        clásico. Si lo usas, trátalo en el firewall como IPv4.
      </ArticleP>

      <ArticleP>
        Base de datos, Redis, panel admin: si no necesitan internet pública,
        no se abren. Bind en localhost o red privada.
      </ArticleP>

      <ArticleH2>5. Host: tiempo, MAC y filesystem</ArticleH2>

      <ArticleP>
        Escena: incidente a las 03:00. Logs con timestamp torcido. Certificado
        TLS “aún no válido”. Sin tiempo sincronizado, auditoría y TLS mienten.
      </ArticleP>

      <ArticleH3>
        Tiempo con <TermLink href={CHRONY_URL}>chrony</TermLink>
      </ArticleH3>

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
        No es un deep-dive de policy. Es asegurar que el MAC de la distro no
        está apagado por accidente.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Debian/Ubuntu: <ArticleCode>aa-status</ArticleCode> — perfiles en
          enforce para servicios críticos
        </ArticleLi>
        <ArticleLi>
          Familia RHEL: <ArticleCode>getenforce</ArticleCode> debe ser{" "}
          <ArticleCode>Enforcing</ArticleCode> (no dejes{" "}
          <ArticleCode>Permissive</ArticleCode> “solo por ahora”)
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Si necesitas una excepción, abre la excepción. No apagues el MAC
        entero.
      </ArticleP>

      <ArticleH3>Filesystem y permisos básicos</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>/tmp</ArticleCode> y{" "}
          <ArticleCode>/var/tmp</ArticleCode>: sticky bit; en VPS dedicada,
          evalúa <ArticleCode>noexec,nosuid,nodev</ArticleCode> si el workload
          lo permite
        </ArticleLi>
        <ArticleLi>
          Evita world-writable fuera de tmp:{" "}
          <ArticleCode>{`find / -xdev -type d -perm -0002 2>/dev/null`}</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Home y claves: umask razonable; nada de{" "}
          <ArticleCode>chmod 777</ArticleCode> “para que funcione”
        </ArticleLi>
        <ArticleLi>
          Particiones separadas (<ArticleCode>/var</ArticleCode>,{" "}
          <ArticleCode>/home</ArticleCode>) ayudan a la contención — no todo
          VPS cloud las ofrece; si el proveedor las da, úsalas
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        <TermLink href={AUDITD_URL}>auditd</TermLink> (mínimo)
      </ArticleH3>

      <ArticleP>
        En un VPS serio dejo el daemon de auditoría activo. Reglas CIS
        completas son fase 2; el punto del día 1 es tener rastro cuando
        alguien toca autenticación y sudoers.
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
        Escena: VPS estable durante meses. Cero updates. Un CVE de OpenSSH
        sale en titulares. No quiero enterarme por Twitter — ni creer que
        “endurecí” sin nunca medir.
      </ArticleP>

      <ArticleH3>Updates sin drama</ArticleH3>

      <ArticleP>
        Debian/Ubuntu —{" "}
        <TermLink href={UNATTENDED_URL}>unattended-upgrades</TermLink>:
      </ArticleP>
      <ArticleCode block>
        {`sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades`}
      </ArticleCode>

      <ArticleP>
        Familia RHEL —{" "}
        <TermLink href={DNF_AUTO_URL}>dnf-automatic</TermLink>:
      </ArticleP>
      <ArticleCode block>
        {`sudo dnf install -y dnf-automatic
sudo systemctl enable --now dnf-automatic.timer`}
      </ArticleCode>

      <ArticleP>
        En VPS personal/staging, unattended de seguridad es higiene. En
        producción sensible, automatiza el aviso y controla la ventana — pero
        no lo dejes manual eterno. Update de kernel sin reboot planeado =
        parche fantasma.
      </ArticleP>

      <ArticleH3>
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink> (o equivalente)
      </ArticleH3>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y fail2ban

# Familia RHEL (EPEL según la distro)
sudo dnf install -y fail2ban
sudo systemctl enable --now fail2ban`}
      </ArticleCode>

      <ArticleP>
        Con contraseña apagada, fail2ban no es la estrella — aún así corta
        ruido y abuso en otros servicios.
      </ArticleP>

      <ArticleH3>Cortar lo que nadie pidió</ArticleH3>

      <ArticleCode block>
        {`ss -tulpn
systemctl list-units --type=service --state=running`}
      </ArticleCode>

      <ArticleP>
        Si no sabes para qué sirve y no es dependencia del producto:
        desactívalo. Menos proceso = menos CVE delante.
      </ArticleP>

      <ArticleH3>Logs que miro</ArticleH3>

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
        Después del baseline, corro un scanner de higiene. No para cazar 400
        findings CIS — para ver lo que olvidé el día 1.
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

      <ArticleTable caption="Anti-patrones que ya pagué">
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
        “El día 1–2 cierro identidad (clave, sin root/contraseña, sudo
        estrecho), perímetro (default-deny + sysctl), host (tiempo, MAC,
        filesystem, audit) y mantenimiento (updates, fail2ban, verificación).
        CIS completo y contenedor quedan fase 2.”
      </ArticleP>

      <ArticleH3>Puntos clave</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Un baseline completo quita el 80% tonto y cubre los temas que más
          importan — sin vender impenetrable.
        </ArticleLi>
        <ArticleLi>
          El orden importa: usuario → clave → sshd/sudo → firewall/sysctl →
          tiempo/MAC → updates → verificar.
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
