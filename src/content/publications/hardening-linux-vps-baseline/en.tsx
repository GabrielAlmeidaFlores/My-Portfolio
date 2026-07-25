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
  A["1. User + key"] --> B["2. SSH + sudo"]
  B --> C["3. Firewall + sysctl"]
  C --> D["4. Time + MAC"]
  D --> E["5. Updates + fail2ban"]
  E --> F["6. Cut + verify"]`;

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

export function HardeningLinuxVpsBaselineContentEn() {
  return (
    <>
      <ArticleH2>1. What this post covers</ArticleH2>

      <ArticleP>
        This post is a <strong>hardening baseline</strong> for day 1-2 on a
        Linux VPS. Hardening here means shrinking the host attack surface:
        who can log in, what the network allows in, how the kernel behaves,
        and what keeps running without oversight.
      </ArticleP>

      <ArticleP>
        Every control follows the same format:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <strong>What it is</strong> and <strong>what it is for</strong>
        </ArticleLi>
        <ArticleLi>
          <strong>If you skip it</strong>: how it usually gets exploited
        </ArticleLi>
        <ArticleLi>
          <strong>How to configure it</strong>: commands and parameters
          explained
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Scope: identity (SSH/sudo), perimeter (firewall/sysctl), host (time,
        MAC, filesystem, auditd), maintenance (updates, fail2ban,
        verification). Distro-agnostic, with Debian/Ubuntu and
        RHEL/Rocky/Alma pairs where the tool changes.
      </ArticleP>

      <ArticleP>
        Out of scope: a full corporate{" "}
        <TermLink href={CIS_URL}>CIS Benchmark</TermLink> audit, and
        container/Kubernetes hardening. That is phase 2, after the baseline
        is live.
      </ArticleP>

      <ArticleP>
        Safe order (avoids locking yourself out and closes what matters
        first):
      </ArticleP>

      <ArticleOl>
        <ArticleLi>User with sudo + SSH key</ArticleLi>
        <ArticleLi>Harden sshd and sudo</ArticleLi>
        <ArticleLi>Firewall + sysctl</ArticleLi>
        <ArticleLi>Time + MAC + filesystem + auditd</ArticleLi>
        <ArticleLi>Updates + fail2ban</ArticleLi>
        <ArticleLi>Cut unused services + verify</ArticleLi>
      </ArticleOl>

      <ArticleMermaid
        ariaLabel="Safe day 1-2 hardening order"
        chart={ORDER_CHART}
      />

      <ArticleCallout variant="tip" title="Want only the checklist?">
        <ArticleP>
          Jump to{" "}
          <a href="#7-checklist-in-the-right-order" className={linkClass}>
            section 7
          </a>
          . Sections 2 to 6 explain each control.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>2. Inventory before hardening</ArticleH2>

      <ArticleP>
        <strong>What it is:</strong> a quick host inventory: who is logged
        in, which ports listen, which services run, whether firewall and
        clock look sane, and whether MAC protection is actually on.
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> you only harden what you can see.
        Without inventory, hardening becomes a blind checklist and leaves a
        forgotten service or port open.
      </ArticleP>

      <ArticleP>
        <strong>If you skip it:</strong> a panel, database, or cloud-image
        agent keeps listening on the internet. Attackers scan ports all day;
        whatever is open becomes an automatic target.
      </ArticleP>

      <ArticleP>
        <strong>How to run it:</strong> each command answers one question.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>whoami; id</ArticleCode>: who is logged in and whether
          that account has admin power
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ss -tulpn</ArticleCode>: which ports are open and which
          program owns each one
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>systemctl list-units …</ArticleCode>: services running
          now
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ufw</ArticleCode> /{" "}
          <ArticleCode>firewall-cmd</ArticleCode>: whether the firewall is
          active and what it allows
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>timedatectl</ArticleCode>: whether the clock is synced
          (logs and HTTPS depend on it)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>aa-status</ArticleCode> (Debian/Ubuntu) or{" "}
          <ArticleCode>getenforce</ArticleCode> (RHEL): whether{" "}
          <TermLink href={APPARMOR_URL}>AppArmor</TermLink> or{" "}
          <TermLink href={SELINUX_URL}>SELinux</TermLink> is truly enabled
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

      <ArticleCallout variant="note" title="Distro-agnostic">
        <ArticleP>
          Same principles. Where the tool changes:{" "}
          <TermLink href={UFW_URL}>UFW</TermLink> vs{" "}
          <TermLink href={FIREWALLD_URL}>firewalld</TermLink>,{" "}
          <ArticleCode>apt</ArticleCode> vs <ArticleCode>dnf</ArticleCode>,{" "}
          <TermLink href={APPARMOR_URL}>AppArmor</TermLink> vs{" "}
          <TermLink href={SELINUX_URL}>SELinux</TermLink>.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. Identity and access</ArticleH2>

      <ArticleP>
        Control of <strong>who</strong> can enter the host and with{" "}
        <strong>which privileges</strong>. Correct order: user with sudo,
        then SSH key, then harden{" "}
        <TermLink href={OPENSSH_URL}>sshd</TermLink> and{" "}
        <TermLink href={SUDOERS_URL}>sudo</TermLink>. Only then cut root
        login and password auth.
      </ArticleP>

      <ArticleH3>User with sudo (not root day to day)</ArticleH3>

      <ArticleP>
        <strong>What it is:</strong> an operator account (e.g.{" "}
        <ArticleCode>deploy</ArticleCode>) in the{" "}
        <ArticleCode>sudo</ArticleCode> group (Debian/Ubuntu) or{" "}
        <ArticleCode>wheel</ArticleCode> (RHEL), instead of working as root
        all the time.
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> separate remote login from root and
        allow turning off <ArticleCode>PermitRootLogin</ArticleCode> without
        losing admin access.
      </ArticleP>

      <ArticleP>
        <strong>If you skip it:</strong> the only entry path is root. Any
        root password leak, or a mistake while hardening sshd, locks you out
        or hands over the whole machine.
      </ArticleP>

      <ArticleP>
        <strong>How to configure it:</strong>
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

      <ArticleH3>SSH key before disabling password</ArticleH3>

      <ArticleP>
        <strong>What it is:</strong> key-pair authentication (private key on
        your laptop, public key in{" "}
        <ArticleCode>~/.ssh/authorized_keys</ArticleCode> on the server),
        instead of a password on{" "}
        <TermLink href={OPENSSH_URL}>SSH</TermLink>.
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> remove password brute force on the
        SSH port. With no password accepted, bots that only try common
        passwords do not get in.
      </ArticleP>

      <ArticleP>
        <strong>If you skip it:</strong> a weak or leaked password on port
        22 is the most common VPS compromise path. Scanners do not stop.
      </ArticleP>

      <ArticleP>
        <strong>How to configure it:</strong> on your laptop, generate a key
        and copy the public one. Confirm key login in a new session. Only
        then disable password in sshd. Permissions:{" "}
        <ArticleCode>~/.ssh</ArticleCode> at <ArticleCode>700</ArticleCode>,{" "}
        <ArticleCode>authorized_keys</ArticleCode> at{" "}
        <ArticleCode>600</ArticleCode>.
      </ArticleP>

      <ArticleCode block>
        {`ssh-keygen -t ed25519 -C "vps-deploy"
ssh-copy-id deploy@YOUR_IP`}
      </ArticleCode>

      <ArticleH3>Harden sshd</ArticleH3>

      <ArticleP>
        <strong>What it is:</strong> the{" "}
        <TermLink href={OPENSSH_URL}>OpenSSH</TermLink> daemon (
        <ArticleCode>sshd</ArticleCode>), configured in{" "}
        <TermLink href={SSHD_CONFIG_URL}>sshd_config</TermLink> (or a
        drop-in under <ArticleCode>/etc/ssh/sshd_config.d/</ArticleCode>).
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> define who may attempt login,
        whether password and remote root are allowed, and attempt limits.
      </ArticleP>

      <ArticleP>
        <strong>If you skip it:</strong> root with password on 22, password
        auth enabled, and any local user trying SSH. Bots and brute force
        abuse the image defaults.
      </ArticleP>

      <ArticleCallout variant="warning" title="Before reloading sshd">
        <ArticleP>
          Keep one open, tested SSH session. Run{" "}
          <ArticleCode>sshd -t</ArticleCode> after editing. Only then
          reload. If the config fails, the old session still saves access.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        <strong>Baseline parameters:</strong>
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>PermitRootLogin no</ArticleCode>: nobody logs in as
          root directly over SSH
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>PasswordAuthentication no</ArticleCode>: SSH password
          off; keys only
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>PubkeyAuthentication yes</ArticleCode>: key login
          allowed
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>KbdInteractiveAuthentication no</ArticleCode>: closes
          another interactive password path
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>X11Forwarding no</ArticleCode>: no GUI forwarding
          (unnecessary on a VPS)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>AllowUsers deploy</ArticleCode>: only that account may
          attempt SSH (replace with your user)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>MaxAuthTries</ArticleCode> /{" "}
          <ArticleCode>LoginGraceTime</ArticleCode>: fewer tries and less
          idle time on the login port
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ClientAliveInterval</ArticleCode> /{" "}
          <ArticleCode>ClientAliveCountMax</ArticleCode>: closes abandoned
          sessions
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

      <ArticleH3>Sudo with brakes</ArticleH3>

      <ArticleP>
        <strong>What it is:</strong>{" "}
        <TermLink href={SUDOERS_URL}>sudo</TermLink> elevates a normal user
        to root, with rules in <ArticleCode>/etc/sudoers</ArticleCode> or{" "}
        <ArticleCode>/etc/sudoers.d/</ArticleCode>.
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> allow admin work without permanent
        root login, with audit and (ideally) authentication on elevation.
      </ArticleP>

      <ArticleP>
        <strong>If misconfigured:</strong>{" "}
        <ArticleCode>NOPASSWD:ALL</ArticleCode> “to make CI easier” becomes
        instant root if the account falls. Editing sudoers without{" "}
        <ArticleCode>visudo</ArticleCode> can break privilege elevation.
      </ArticleP>

      <ArticleP>
        <strong>How to configure it:</strong> prefer a sudo password (or
        strong auth) and narrow rules under{" "}
        <ArticleCode>/etc/sudoers.d/</ArticleCode>. Always edit with{" "}
        <ArticleCode>visudo</ArticleCode>.
      </ArticleP>

      <ArticleH3>Change the SSH port?</ArticleH3>

      <ArticleP>
        <strong>What it is:</strong> moving default port 22 to another (e.g.
        2222).
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> less noise in the logs. Not a real
        security control.
      </ArticleP>

      <ArticleP>
        <strong>If you only change the port:</strong> bots scan ports. The
        real barrier is key + no password + no root +{" "}
        <ArticleCode>AllowUsers</ArticleCode>. Treat a custom port as signal
        hygiene, not the main defense.
      </ArticleP>

      <ArticleH2>4. Network and perimeter</ArticleH2>

      <ArticleP>
        Control of <strong>what the internet can reach</strong> on the host
        (firewall) and <strong>how the kernel handles packets</strong> (
        <TermLink href={SYSCTL_URL}>sysctl</TermLink>).
      </ArticleP>

      <ArticleH3>
        Firewall: <TermLink href={UFW_URL}>UFW</TermLink> (Debian/Ubuntu)
      </ArticleH3>

      <ArticleP>
        <strong>What it is:</strong>{" "}
        <TermLink href={UFW_URL}>UFW</TermLink> (Uncomplicated Firewall) is
        a simple front end over the system firewall rules.
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> default-deny inbound. Open only
        what the product needs (almost always SSH + 80/443).
      </ArticleP>

      <ArticleP>
        <strong>If you skip it:</strong> any service on{" "}
        <ArticleCode>0.0.0.0</ArticleCode> (listening on all interfaces,
        including the public one) is reachable. Attackers scan ports;
        whatever is open becomes an automatic attempt.
      </ArticleP>

      <ArticleP>
        <strong>How to configure it:</strong> deny inbound by default, allow
        SSH and HTTP/HTTPS, only then enable. Allow SSH{" "}
        <strong>before</strong> <ArticleCode>ufw enable</ArticleCode>.
      </ArticleP>

      <ArticleCode block>
        {`sudo apt update && sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
# if you changed the port: sudo ufw allow 2222/tcp
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
        <strong>What it is:</strong>{" "}
        <TermLink href={FIREWALLD_URL}>firewalld</TermLink> is the default
        firewall on the RHEL family. Same job as UFW: control what comes in.
      </ArticleP>

      <ArticleP>
        <strong>What it is for / if you skip it:</strong> same as UFW.
        Without default-deny, an exposed service is internet surface.
      </ArticleP>

      <ArticleP>
        <strong>How to configure it:</strong> add services (ssh, http,
        https) and apply with reload.
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

      <ArticleCallout variant="warning" title="Do not lock yourself out">
        <ArticleP>
          Allow SSH before enabling the firewall. If the port is not 22,
          allow that port explicitly. Confirm in a second session before
          closing the first.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>
        Network <TermLink href={SYSCTL_URL}>sysctl</TermLink> (baseline)
      </ArticleH3>

      <ArticleP>
        <strong>What it is:</strong>{" "}
        <TermLink href={SYSCTL_URL}>sysctl</TermLink> reads and changes
        kernel parameters (network, memory, basic security). The firewall
        cuts traffic by port. sysctl changes how the system treats packets
        and sensitive information.
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> basic anti-spoofing, SYN flood
        mitigation, blocking dangerous redirects and source route, and
        reducing kernel information leaks.
      </ArticleP>

      <ArticleP>
        <strong>If you skip it:</strong> the cloud image accepts network
        behaviors an attacker on the same network (or in routing scenarios)
        can abuse. It also makes it easier to collect internal kernel
        addresses for local exploits.
      </ArticleP>

      <ArticleP>
        <strong>What each group does:</strong>
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>rp_filter</ArticleCode>: rejects packets that arrive
          on the “wrong” interface (basic IP anti-spoofing)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>tcp_syncookies</ArticleCode>: helps survive a flood of
          fake connections (SYN flood)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>accept_redirects</ArticleCode> /{" "}
          <ArticleCode>send_redirects</ArticleCode> at 0: the host neither
          follows nor spreads forged route shortcuts
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>accept_source_route</ArticleCode> at 0: stops the
          packet from dictating which paths it must travel
        </ArticleLi>
        <ArticleLi>
          IPv6 with redirects off: same idea as IPv4
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>kptr_restrict</ArticleCode> and{" "}
          <ArticleCode>dmesg_restrict</ArticleCode>: make it harder to see
          internal kernel addresses and boot logs without privilege
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>protected_hardlinks</ArticleCode> /{" "}
          <ArticleCode>protected_symlinks</ArticleCode>: reduce link tricks
          in shared folders (e.g. <ArticleCode>/tmp</ArticleCode>)
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        Put this in{" "}
        <ArticleCode>/etc/sysctl.d/99-hardening.conf</ArticleCode> (the{" "}
        <ArticleCode>99-</ArticleCode> only ensures order after other
        defaults) and apply:
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
        IPv6: if you <strong>do not</strong> use it, disable or filter on
        purpose. Leaving IPv6 on and forgotten while IPv4 is closed is a
        classic hole. If you use IPv6, treat it in the firewall like IPv4.
      </ArticleP>

      <ArticleP>
        Database, Redis, admin panel: if they do not need the public
        internet, make the service listen only on{" "}
        <ArticleCode>localhost</ArticleCode> or a private network.
      </ArticleP>

      <ArticleH2>5. Host: time, MAC, filesystem, and audit</ArticleH2>

      <ArticleP>
        Controls for the machine core: clock, extra process confinement
        (MAC), folder hygiene, and an audit trail.
      </ArticleP>

      <ArticleH3>
        Time with <TermLink href={CHRONY_URL}>chrony</TermLink>
      </ArticleH3>

      <ArticleP>
        <strong>What it is:</strong>{" "}
        <TermLink href={CHRONY_URL}>chrony</TermLink> syncs the Linux clock
        with time servers (NTP).
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> correct log timestamps, valid
        HTTPS/TLS, and tokens or auth that need aligned time.
      </ArticleP>

      <ArticleP>
        <strong>If you skip it:</strong> the attacker does not “break” NTP.
        The team suffers alone: cannot correlate events in an incident,
        certificates look invalid, and someone disables protection “just to
        get back online”.
      </ArticleP>

      <ArticleP>
        <strong>How to configure it:</strong> install, enable on boot,
        confirm with <ArticleCode>timedatectl</ArticleCode>.
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
        <strong>What it is:</strong> Mandatory Access Control. Beyond the
        traditional Linux user, the system defines what each program may
        touch. On Ubuntu it is usually{" "}
        <TermLink href={APPARMOR_URL}>AppArmor</TermLink>. On
        RHEL/Rocky/Alma it is usually{" "}
        <TermLink href={SELINUX_URL}>SELinux</TermLink>.
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> contain a compromised service (web,
        database, panel). Without MAC, the invaded process inherits broad
        permissions.
      </ArticleP>

      <ArticleP>
        <strong>If you skip it (or leave it loose):</strong> cloud image in
        permissive mode, or someone turns everything off because “the app
        would not start”. An attacker already inside the process gains
        freedom they should not have.
      </ArticleP>

      <ArticleP>
        <strong>How to configure it on day 1:</strong> do not write policy
        from scratch. Confirm it is truly on:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Debian/Ubuntu: <ArticleCode>aa-status</ArticleCode> (AppArmor
          active and profiles in enforce)
        </ArticleLi>
        <ArticleLi>
          RHEL: <ArticleCode>getenforce</ArticleCode> should show{" "}
          <ArticleCode>Enforcing</ArticleCode>.{" "}
          <ArticleCode>Permissive</ArticleCode> only logs and does not block
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        If an app breaks with MAC on, adjust that app’s exception. Do not
        disable MAC for the whole machine.
      </ArticleP>

      <ArticleH3>Filesystem and basic permissions</ArticleH3>

      <ArticleP>
        <strong>What it is:</strong> folder and permission hygiene: sticky
        bit on tmp, avoid <ArticleCode>chmod 777</ArticleCode>, and (when
        possible) <ArticleCode>noexec,nosuid,nodev</ArticleCode> on
        temporary mounts.
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> limit what a process already inside
        the machine can write and execute.
      </ArticleP>

      <ArticleP>
        <strong>If you skip it:</strong> malware writes under{" "}
        <ArticleCode>/tmp</ArticleCode>, executes from there, or overwrites
        a file in a shared folder. “Open all permissions so it works” hands
        write access to a sensitive place.
      </ArticleP>

      <ArticleP>
        <strong>What to check in the baseline:</strong>
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>/tmp</ArticleCode> and{" "}
          <ArticleCode>/var/tmp</ArticleCode>: sticky bit; if the workload
          allows, <ArticleCode>noexec,nosuid,nodev</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          World-writable folders outside tmp:{" "}
          <ArticleCode>{`find / -xdev -type d -perm -0002 2>/dev/null`}</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Home and SSH keys: sensible umask; no{" "}
          <ArticleCode>chmod 777</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Separate partitions (<ArticleCode>/var</ArticleCode>,{" "}
          <ArticleCode>/home</ArticleCode>) help if one disk fills; use them
          if the provider offers that
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        <TermLink href={AUDITD_URL}>auditd</TermLink> (minimum)
      </ArticleH3>

      <ArticleP>
        <strong>What it is:</strong>{" "}
        <TermLink href={AUDITD_URL}>auditd</TermLink> records security
        events (login, sudo, sensitive file changes).
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> a trail after an incident: what
        changed, who changed it, when.
      </ArticleP>

      <ArticleP>
        <strong>If you skip it:</strong> the attacker clears basic traces or
        the team has nothing to correlate. Without evidence, response
        becomes guesswork.
      </ArticleP>

      <ArticleP>
        <strong>How to configure it on day 1:</strong> leave the daemon
        active. Full CIS rules are phase 2.
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y auditd
sudo systemctl enable --now auditd

# RHEL family
sudo dnf install -y audit
sudo systemctl enable --now auditd`}
      </ArticleCode>

      <ArticleH2>6. Maintenance, detection, and verification</ArticleH2>

      <ArticleP>
        Controls that keep hardening alive after day 1: patching, abuse
        containment, less surface, and verification.
      </ArticleP>

      <ArticleH3>Security updates</ArticleH3>

      <ArticleP>
        <strong>What it is:</strong> automatic (or at least notified)
        security package updates. On Debian/Ubuntu:{" "}
        <TermLink href={UNATTENDED_URL}>unattended-upgrades</TermLink>. On
        the RHEL family:{" "}
        <TermLink href={DNF_AUTO_URL}>dnf-automatic</TermLink>.
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> close known CVEs without depending
        on “whenever we can”.
      </ArticleP>

      <ArticleP>
        <strong>If you skip it:</strong> the attacker does not need to be
        creative. A scanner plus an outdated version is enough.
      </ArticleP>

      <ArticleP>
        <strong>How to configure it:</strong>
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
        A kernel update without a planned reboot does not really apply: the
        old process stays in memory.
      </ArticleP>

      <ArticleH3>
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink>
      </ArticleH3>

      <ArticleP>
        <strong>What it is:</strong>{" "}
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink> reads failure
        logs and blocks the IP for a while.
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> contain brute force and noise (SSH,
        panel, mail, etc.). It does not replace an SSH key.
      </ArticleP>

      <ArticleP>
        <strong>If you skip it:</strong> the port takes automatic attempts
        all day. On password-backed services, brute force continues until a
        weak credential is found.
      </ArticleP>

      <ArticleP>
        <strong>How to configure it:</strong>
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y fail2ban

# RHEL family (EPEL depending on the distro)
sudo dnf install -y fail2ban
sudo systemctl enable --now fail2ban`}
      </ArticleCode>

      <ArticleH3>Cut services you did not ask for</ArticleH3>

      <ArticleP>
        <strong>What it is:</strong> disable what the cloud image started
        and the product does not use (agent, demo, panel).
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> fewer processes = fewer ports,
        fewer CVEs, fewer credentials.
      </ArticleP>

      <ArticleP>
        <strong>If you do not cut:</strong> “free” surface stays on the
        internet with nobody watching.
      </ArticleP>

      <ArticleP>
        <strong>How to do it:</strong> list what listens and what runs. If
        it is not part of the product and not a dependency, disable it.
      </ArticleP>

      <ArticleCode block>
        {`ss -tulpn
systemctl list-units --type=service --state=running`}
      </ArticleCode>

      <ArticleH3>Logs that matter</ArticleH3>

      <ArticleP>
        <strong>What it is:</strong> knowing where to look when something
        smells wrong. Not a day-1 SIEM.
      </ArticleP>

      <ArticleP>
        <strong>What it is for / if you never look:</strong> hardening
        without logs is faith. Without a trail, you cannot confirm a control
        works or reconstruct an incident.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          SSH: <ArticleCode>journalctl -u ssh</ArticleCode> /{" "}
          <ArticleCode>sshd</ArticleCode> or{" "}
          <ArticleCode>/var/log/auth.log</ArticleCode>
        </ArticleLi>
        <ArticleLi>firewall / fail2ban: what was blocked</ArticleLi>
        <ArticleLi>
          updates: last unattended / dnf-automatic run
        </ArticleLi>
        <ArticleLi>
          audit: <ArticleCode>ausearch</ArticleCode> /{" "}
          <ArticleCode>aureport</ArticleCode>
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        Verify with <TermLink href={LYNIS_URL}>Lynis</TermLink>
      </ArticleH3>

      <ArticleP>
        <strong>What it is:</strong>{" "}
        <TermLink href={LYNIS_URL}>Lynis</TermLink> is a host hygiene
        scanner: it walks the machine and lists what is loose.
      </ArticleP>

      <ArticleP>
        <strong>What it is for:</strong> catch what you forgot (service left
        on, wrong permission, stalled updates). Not chasing 400 CIS findings
        on day 1.
      </ArticleP>

      <ArticleP>
        <strong>If you do not verify:</strong> “I hardened it” stays a
        feeling, not a baseline.
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y lynis
sudo lynis audit system

# RHEL family
sudo dnf install -y lynis
sudo lynis audit system`}
      </ArticleCode>

      <ArticleCallout variant="note" title="Backup is also a control">
        <ArticleP>
          Provider snapshot + backup of what matters (data,{" "}
          <ArticleCode>/etc</ArticleCode>, keys off the VPS). Hardening
          without recovery is only half the job.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>7. Checklist in the right order</ArticleH2>

      <ArticleP>
        Apply in this order. Each step depends on the previous one so you
        do not lock yourself out.
      </ArticleP>

      <ArticleOl>
        <ArticleLi>Create a sudo/wheel user and test login</ArticleLi>
        <ArticleLi>
          Install the SSH key (perms 700/600) and test in a second session
        </ArticleLi>
        <ArticleLi>
          Harden sshd (no root/password, AllowUsers, MaxAuthTries),{" "}
          <ArticleCode>sshd -t</ArticleCode>, reload
        </ArticleLi>
        <ArticleLi>
          Review sudoers (no wide <ArticleCode>NOPASSWD:ALL</ArticleCode>)
        </ArticleLi>
        <ArticleLi>
          Default-deny firewall; allow SSH (+ HTTP/S if needed); enable
        </ArticleLi>
        <ArticleLi>
          Apply sysctl; decide IPv6 on purpose
        </ArticleLi>
        <ArticleLi>
          chrony/NTP ok; AppArmor enforce / SELinux Enforcing
        </ArticleLi>
        <ArticleLi>auditd active; tmp and basic permissions ok</ArticleLi>
        <ArticleLi>
          Security updates + fail2ban; cut unused services
        </ArticleLi>
        <ArticleLi>
          Lynis (or equivalent) + snapshot/backup; confirm inventory
        </ArticleLi>
      </ArticleOl>

      <ArticleTable caption="Common VPS anti-patterns">
        <ArticleThead>
          <ArticleTr>
            <ArticleTh>Anti-pattern</ArticleTh>
            <ArticleTh>Why it hurts</ArticleTh>
          </ArticleTr>
        </ArticleThead>
        <ArticleTbody>
          <ArticleTr>
            <ArticleTd>Root + password on 22 “just today”</ArticleTd>
            <ArticleTd>Bots do not respect calendars</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Firewall after deploy</ArticleTd>
            <ArticleTd>After = never; the app already exposed a port</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Only changing the SSH port</ArticleTd>
            <ArticleTd>Log hygiene, not a control</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Reload sshd without a backup session</ArticleTd>
            <ArticleTd>One typo and you lost the server</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>NOPASSWD:ALL in sudo</ArticleTd>
            <ArticleTd>Compromised account = instant root</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>IPv6 left on and forgotten</ArticleTd>
            <ArticleTd>Silent bypass of the IPv4 firewall</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>SELinux/AppArmor stuck in permissive</ArticleTd>
            <ArticleTd>Cost without the blocking benefit</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Forever-manual updates</ArticleTd>
            <ArticleTd>Known CVE becomes a predictable incident</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>“Hardened” without Lynis/inventory</ArticleTd>
            <ArticleTd>Feeling of safety ≠ baseline</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleH3>Key takeaways</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          Every control: what it is, what it is for, what happens if missing,
          and how to configure it.
        </ArticleLi>
        <ArticleLi>
          Order matters: user, key, sshd/sudo, firewall/sysctl, time/MAC,
          updates, verify.
        </ArticleLi>
        <ArticleLi>
          <TermLink href={OPENSSH_URL}>OpenSSH</TermLink> with a key,
          AllowUsers, and no password/root beats changing the port.
        </ArticleLi>
        <ArticleLi>
          Firewall + <TermLink href={SYSCTL_URL}>sysctl</TermLink> + an
          explicit IPv6 decision.
        </ArticleLi>
        <ArticleLi>
          Time (chrony), MAC (AppArmor/SELinux), and auditd are host
          controls, not optional extras.
        </ArticleLi>
        <ArticleLi>
          Updates + fail2ban + cutting services + Lynis + backup close the
          loop.
        </ArticleLi>
        <ArticleLi>
          Deep CIS and container hardening: phase 2, after the baseline is
          live.
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>Conclusion</ArticleH3>

      <ArticleP>
        Day 1-2 VPS hardening is not an endless checklist. It is closing
        identity, perimeter, host, and maintenance with clear commands and
        a safe order. Run the inventory, harden what the list above covers,
        verify with Lynis, and keep patching running. The rest (full CIS,
        advanced MAC policy, containers) comes when the baseline is already
        alive.
      </ArticleP>
    </>
  );
}
