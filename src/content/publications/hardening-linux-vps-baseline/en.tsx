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
  Internet --> Other["Panel / DB / other"]
  SSH --> Host["Linux host"]
  Web --> Host
  Other --> Host
  Host --> Priv["Privileges / sudo"]
  Host --> Kernel["Kernel / sysctl"]
  Host --> Fs["Filesystem / MAC"]`;

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
      <ArticleH2>1. The “ready” VPS problem</ArticleH2>

      <ArticleP>
        A “ready” VPS from the provider panel often looks safe enough: fresh
        Ubuntu, SSH on 22, root with a password “just to bring the service
        up”. Within hours <ArticleCode>auth.log</ArticleCode> already shows
        the pattern: login attempts from random IPs hitting the most scanned
        port on the internet.
      </ArticleP>

      <ArticleP>
        You do not need a sophisticated APT. An incomplete baseline is enough:
        obvious credentials, image-default sysctl, clock without NTP, MAC
        (AppArmor/SELinux) never checked for enforcing, zero verification after
        deploy.
      </ArticleP>

      <ArticleP>
        This post is the hardening I apply as{" "}
        <strong>complete for day 1-2 of a Linux VPS</strong>: identity,
        perimeter, kernel/network, host (time, MAC, filesystem), maintenance,
        detection, and verification. Distro-agnostic, with Debian/Ubuntu and
        RHEL/Rocky/Alma pairs where the tool changes.
      </ArticleP>

      <ArticleP>
        It is not a corporate{" "}
        <TermLink href={CIS_URL}>CIS Benchmark</TermLink> audit. It is not
        container/Kubernetes hardening. It is the map that removes the dumb
        80% and covers the themes that matter most before you point production
        DNS.
      </ArticleP>

      <ArticleCallout variant="tip" title="Want the checklist now?">
        <ArticleP>
          Jump to{" "}
          <a href="#7-checklist-in-the-right-order" className={linkClass}>
            section 7
          </a>
          : safe order + anti-patterns. Sections{" "}
          <a href="#3-identity-and-access" className={linkClass}>
            3
          </a>
          {" "}
          to{" "}
          <a
            href="#6-maintenance-detection-and-verification"
            className={linkClass}
          >
            6
          </a>{" "}
          explain each control.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        What usually stays open on a “new server”:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>SSH with password (and sometimes root) on port 22</ArticleLi>
        <ArticleLi>
          firewall off or “allow all” because the app “needs to work”
        </ArticleLi>
        <ArticleLi>kernel/sysctl left at the cloud image default</ArticleLi>
        <ArticleLi>
          clock without NTP/chrony (logs and TLS start lying)
        </ArticleLi>
        <ArticleLi>
          MAC (AppArmor/SELinux) permissive or off by accident
        </ArticleLi>
        <ArticleLi>
          manual updates “when I can”, and I never can
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>2. Attack surface</ArticleH2>

      <ArticleP>
        Hardening starts with inventory. Everything listening on the network
        is an entry door. Everything running with privilege is blast radius.
        Everything the kernel accepts by default is implicit policy.
      </ArticleP>

      <ArticleMermaid
        ariaLabel="Internet, host, privileges, kernel, and filesystem"
        chart={SURFACE_CHART}
      />

      <ArticleP>On day 1 I answer five questions:</ArticleP>

      <ArticleOl>
        <ArticleLi>Who can get in? (accounts and SSH)</ArticleLi>
        <ArticleLi>From where and on which ports? (firewall and network)</ArticleLi>
        <ArticleLi>
          Are the system network rules in a safe default?
        </ArticleLi>
        <ArticleLi>
          Are clock, system protection, and basic folders ok?
        </ArticleLi>
        <ArticleLi>
          What keeps running if I ignore the box for a week?
        </ArticleLi>
      </ArticleOl>

      <ArticleP>
        Quick inventory I run before “closing”. Each command answers a simple
        question:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>whoami; id</ArticleCode>: who is logged in and whether
          that account has admin power
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ss -tulpn</ArticleCode>: which ports are open and which
          program is using each one
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>systemctl list-units …</ArticleCode>: which services are
          running now (what the machine keeps on)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ufw</ArticleCode> / <ArticleCode>firewall-cmd</ArticleCode>:
          whether the firewall is active and what it allows through
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>timedatectl</ArticleCode>: whether the server clock is
          correct (logs and HTTPS depend on it)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>aa-status</ArticleCode> (Debian/Ubuntu) or{" "}
          <ArticleCode>getenforce</ArticleCode> (RHEL): whether the system’s
          extra protection (AppArmor or SELinux) is really on
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

      <ArticleCallout variant="note" title="Distro-agnostic on purpose">
        <ArticleP>
          One set of principles. Where the tool changes:{" "}
          <TermLink href={UFW_URL}>UFW</TermLink> vs{" "}
          <TermLink href={FIREWALLD_URL}>firewalld</TermLink>,{" "}
          <ArticleCode>apt</ArticleCode> vs <ArticleCode>dnf</ArticleCode>,{" "}
          <TermLink href={APPARMOR_URL}>AppArmor</TermLink> vs{" "}
          <TermLink href={SELINUX_URL}>SELinux</TermLink>.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>3. Identity and access</ArticleH2>

      <ArticleP>
        Classic pattern: “just ship nginx” and run everything as root because
        it is faster. When remote root login gets disabled, whoever left a
        single open session (the root one) locks themselves out. That is why
        order matters before speed.
      </ArticleP>

      <ArticleP>
        Correct order: sudo user, then SSH key, then harden{" "}
        <TermLink href={OPENSSH_URL}>sshd</TermLink> and{" "}
        <TermLink href={SUDOERS_URL}>sudo</TermLink>, then only then cut what
        hurts.
      </ArticleP>

      <ArticleH3>Sudo user, not root for daily work</ArticleH3>

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

      <ArticleP>On your laptop:</ArticleP>
      <ArticleCode block>
        {`ssh-keygen -t ed25519 -C "vps-deploy"
ssh-copy-id deploy@YOUR_IP`}
      </ArticleCode>

      <ArticleP>
        Confirm key login in a new session. Only then touch{" "}
        <TermLink href={SSHD_CONFIG_URL}>sshd_config</TermLink>. Permissions
        I check: <ArticleCode>~/.ssh</ArticleCode> at{" "}
        <ArticleCode>700</ArticleCode>,{" "}
        <ArticleCode>authorized_keys</ArticleCode> at{" "}
        <ArticleCode>600</ArticleCode>.
      </ArticleP>

      <ArticleH3>Harden sshd (without locking yourself out)</ArticleH3>

      <ArticleCallout variant="warning" title="Before restarting sshd">
        <ArticleP>
          Keep one SSH session open and tested. Run{" "}
          <ArticleCode>sshd -t</ArticleCode> after editing. Only then
          reload. If something breaks, the old session still saves you.
        </ArticleP>
      </ArticleCallout>

      <ArticleP>
        Minimum I apply. In plain language:
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>PermitRootLogin no</ArticleCode>: nobody logs in as
          root directly over SSH
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>PasswordAuthentication no</ArticleCode>: SSH password
          is off; keys only
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>PubkeyAuthentication yes</ArticleCode>: key login is
          allowed
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>KbdInteractiveAuthentication no</ArticleCode>: closes
          another interactive password path
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>X11Forwarding no</ArticleCode>: do not forward a GUI
          over SSH (not needed on a VPS)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>AllowUsers deploy</ArticleCode>: only that account may
          attempt SSH (change to your real user)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>MaxAuthTries</ArticleCode> /{" "}
          <ArticleCode>LoginGraceTime</ArticleCode>: fewer tries and less idle
          time on the login port
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>ClientAliveInterval</ArticleCode> /{" "}
          <ArticleCode>ClientAliveCountMax</ArticleCode>: close abandoned
          sessions and free resources
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
        Typical file: <ArticleCode>/etc/ssh/sshd_config</ArticleCode> or a
        drop-in under <ArticleCode>/etc/ssh/sshd_config.d/</ArticleCode>.
        Adjust <ArticleCode>AllowUsers</ArticleCode> to your real user.
      </ArticleP>

      <ArticleP>Debian/Ubuntu:</ArticleP>
      <ArticleCode block>
        {`sudo sshd -t && sudo systemctl reload ssh`}
      </ArticleCode>

      <ArticleP>RHEL family:</ArticleP>
      <ArticleCode block>
        {`sudo sshd -t && sudo systemctl reload sshd`}
      </ArticleCode>

      <ArticleH3>Sudo with a brake</ArticleH3>

      <ArticleP>
        <ArticleCode>NOPASSWD:ALL</ArticleCode> “to make CI easy” becomes
        easy lateral movement if the account falls. I prefer a sudo password
        (or strong auth) and narrow rules in{" "}
        <ArticleCode>/etc/sudoers.d/</ArticleCode>. Never edit{" "}
        <ArticleCode>sudoers</ArticleCode> without{" "}
        <ArticleCode>visudo</ArticleCode>.
      </ArticleP>

      <ArticleH3>Change the port? Nuance</ArticleH3>

      <ArticleP>
        Moving port 22 to 2222 reduces log noise. It is not a real control. Bots
        scan ports. I treat a custom port as signal hygiene. The barrier is
        key + no password + no root + AllowUsers.
      </ArticleP>

      <ArticleH2>4. Network and perimeter</ArticleH2>

      <ArticleP>
        Another pattern: app live, firewall “later”. Later rarely comes.
        Anything on <ArticleCode>0.0.0.0</ArticleCode> (listening on all
        interfaces, including the public one) becomes an entry. Beyond the
        firewall, the kernel has its own network rules. If you leave the cloud
        image defaults, the server accepts network behaviors an attacker may
        try to abuse.
      </ArticleP>

      <ArticleP>
        Rule: default-deny on ingress. Only open what the product needs
        (almost always SSH + 80/443). Then adjust the kernel network rules.
      </ArticleP>

      <ArticleH3>
        <TermLink href={UFW_URL}>UFW</TermLink> (Debian/Ubuntu)
      </ArticleH3>

      <ArticleP>
        A firewall is the list of what may enter the machine from the
        internet. Without it (or with “allow everything”), any service
        listening on a port becomes reachable. Attackers scan ports all day;
        whatever is open becomes an automatic attempt.
      </ArticleP>

      <ArticleP>
        On Debian/Ubuntu I use <TermLink href={UFW_URL}>UFW</TermLink>: a
        simple front end over the system rules. The logic is deny ingress by
        default, allow only SSH and HTTP/HTTPS, then enable.
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
        <TermLink href={FIREWALLD_URL}>firewalld</TermLink> (RHEL family)
      </ArticleH3>

      <ArticleP>
        On the RHEL family the job is the same: control what enters. The
        default tool is usually{" "}
        <TermLink href={FIREWALLD_URL}>firewalld</TermLink>. Instead of
        “allow OpenSSH”, you add services (ssh, http, https) and apply with
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

      <ArticleCallout variant="warning" title="Do not lock yourself out">
        <ArticleP>
          Allow SSH <strong>before</strong> enabling the firewall. If SSH is
          not on 22, allow that port explicitly. Confirm in a second session
          before closing the first.
        </ArticleP>
      </ArticleCallout>

      <ArticleH3>
        Network <TermLink href={SYSCTL_URL}>sysctl</TermLink> (baseline)
      </ArticleH3>

      <ArticleP>
        <TermLink href={SYSCTL_URL}>sysctl</TermLink> is how you read and
        change kernel parameters on Linux (network, memory, basic security).
        The firewall cuts traffic on ports. sysctl changes how the system
        itself treats packets and sensitive information. They complement each
        other.
      </ArticleP>

      <ArticleP>
        Instead of editing a one-off file and losing it on reboot, I put a
        file in <ArticleCode>/etc/sysctl.d/99-hardening.conf</ArticleCode>.
        Everything in that folder loads in a stable way. The{" "}
        <ArticleCode>99-</ArticleCode> prefix only makes it run after other
        defaults.
      </ArticleP>

      <ArticleP>What this baseline does, by group:</ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>rp_filter</ArticleCode>: drops packets that “arrive on
          the wrong door” (basic IP anti-spoofing)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>tcp_syncookies</ArticleCode>: helps the server survive
          a flood of fake connection attempts (SYN flood)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>accept_redirects</ArticleCode> /{" "}
          <ArticleCode>send_redirects</ArticleCode> set to 0: the host neither
          follows nor spreads route shortcuts an on-path attacker could forge
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>accept_source_route</ArticleCode> set to 0: stops a
          packet from dictating which path it should take (old and dangerous
          on the public internet)
        </ArticleLi>
        <ArticleLi>
          IPv6 with redirects off: same idea as IPv4, so you do not leave a
          hole just because the image shipped with IPv6 on
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>kptr_restrict</ArticleCode> and{" "}
          <ArticleCode>dmesg_restrict</ArticleCode>: make it harder to see
          internal kernel addresses and the boot log without privilege
          (useful info for exploits)
        </ArticleLi>
        <ArticleLi>
          <ArticleCode>protected_hardlinks</ArticleCode> /{" "}
          <ArticleCode>protected_symlinks</ArticleCode>: reduce file-link
          tricks in shared folders (e.g. <ArticleCode>/tmp</ArticleCode>)
        </ArticleLi>
      </ArticleUl>

      <ArticleP>Typical file:</ArticleP>

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

      <ArticleP>To apply without rebooting:</ArticleP>

      <ArticleCode block>{`sudo sysctl --system`}</ArticleCode>

      <ArticleP>
        That command reloads the files under{" "}
        <ArticleCode>/etc/sysctl.d/</ArticleCode>. If the syntax is wrong,
        sysctl itself reports it.
      </ArticleP>

      <ArticleP>
        IPv6: if you <strong>do not</strong> use it, disable it or add
        firewall rules on purpose. Leaving IPv6 “on and forgotten” without a
        filter is a classic hole: IPv4 is closed and IPv6 stays open. If you
        really use IPv6, treat it in the firewall like IPv4.
      </ArticleP>

      <ArticleP>
        Database, Redis, admin panel: if they do not need the public
        internet, do not open them there. Make the service listen only on{" "}
        <ArticleCode>localhost</ArticleCode> (the machine itself) or on a
        private network.
      </ArticleP>

      <ArticleH2>5. Host: time, MAC, and filesystem</ArticleH2>

      <ArticleP>
        So far we closed <strong>who gets in</strong> (SSH/sudo) and{" "}
        <strong>what the network allows through</strong> (firewall/sysctl).
        What is left is the machine “core”: clock, extra process lock, and
        folder hygiene. Without that, the baseline looks done and breaks in
        an incident or a local exploit.
      </ArticleP>

      <ArticleP>
        This section covers four host pieces. For each one: the problem, how
        it is usually exploited, and the minimum I apply on day 1.
      </ArticleP>

      <ArticleH3>
        Time with <TermLink href={CHRONY_URL}>chrony</TermLink>
      </ArticleH3>

      <ArticleP>
        A server with the wrong clock looks like a boring detail. It is not.
        Logs with a skewed timestamp make intrusion investigation harder. An
        HTTPS certificate may show as “not yet valid” or “already expired”
        only because the machine is ahead or behind. Tokens and auth also
        depend on correct time.
      </ArticleP>

      <ArticleP>
        How this shows up in practice: the attacker does not need to “break”
        NTP. The team suffers alone. Someone reads the log, cannot correlate
        events, and wastes time. In worse cases, services that need aligned
        time fail and the team turns protections off “just to recover”.
      </ArticleP>

      <ArticleP>
        <TermLink href={CHRONY_URL}>chrony</TermLink> is the program that
        syncs the Linux clock with time servers on the internet (or internal
        ones). On day 1 I install it, enable it on boot, and confirm with{" "}
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
        In the status output, what matters is seeing that the clock is
        synchronized (NTP/chrony active). If it is not, fix timezone and
        network before you continue.
      </ArticleP>

      <ArticleH3>
        MAC: <TermLink href={APPARMOR_URL}>AppArmor</TermLink> /{" "}
        <TermLink href={SELINUX_URL}>SELinux</TermLink>
      </ArticleH3>

      <ArticleP>
        Even with good SSH and a good firewall, a vulnerable service (web,
        database, panel) can still be compromised. Without an extra lock, the
        compromised process inherits broad permissions and becomes a beachhead
        to read files, drop a binary, or pivot on the machine.
      </ArticleP>

      <ArticleP>
        MAC (Mandatory Access Control) is that lock. The system defines what
        each program may touch, beyond the traditional Linux user model. On
        Ubuntu it is usually{" "}
        <TermLink href={APPARMOR_URL}>AppArmor</TermLink>. On RHEL/Rocky/Alma
        it is usually <TermLink href={SELINUX_URL}>SELinux</TermLink>.
      </ArticleP>

      <ArticleP>
        How it is exploited: many cloud images ship with MAC in a loose mode,
        or someone turns it all off because “the app would not start”. Then
        the attacker who already entered the process gets freedom they should
        not have.
      </ArticleP>

      <ArticleP>
        On day 1 I do not write policy from scratch. I confirm the protection
        is really on and only open a pointed exception if needed.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Debian/Ubuntu: <ArticleCode>aa-status</ArticleCode> shows whether
          AppArmor is active and which programs are really restricted
          (enforce)
        </ArticleLi>
        <ArticleLi>
          RHEL family: <ArticleCode>getenforce</ArticleCode> should show{" "}
          <ArticleCode>Enforcing</ArticleCode> (on and blocking).{" "}
          <ArticleCode>Permissive</ArticleCode> only logs and does not block.
          Do not leave it that way “for now”
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        If an app breaks with MAC on, fix that app’s exception. Do not turn
        off MAC for the whole machine.
      </ArticleP>

      <ArticleH3>Filesystem and basic permissions</ArticleH3>

      <ArticleP>
        Network and login control the front door. Folders and permissions
        control what a process already inside the machine can do. Day-1
        filesystem hardening is not “full CIS”. It is cutting the classic
        mistakes: executable temp folder,{" "}
        <ArticleCode>chmod 777</ArticleCode>, and a directory everyone can
        write to.
      </ArticleP>

      <ArticleP>
        How it is exploited: malware or a downloaded script writes to{" "}
        <ArticleCode>/tmp</ArticleCode>, runs from there, or overwrites a file
        in a shared folder. You also see “open all permissions so it works”
        and a weak account starts writing somewhere sensitive.
      </ArticleP>

      <ArticleP>What I check in the baseline:</ArticleP>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>/tmp</ArticleCode> and{" "}
          <ArticleCode>/var/tmp</ArticleCode>: shared folders. The sticky bit
          means each user can delete only their own files. On a dedicated VPS,
          if the workload allows,{" "}
          <ArticleCode>noexec,nosuid,nodev</ArticleCode> prevents running a
          binary from tmp
        </ArticleLi>
        <ArticleLi>
          Avoid “everyone can write” folders outside tmp:{" "}
          <ArticleCode>{`find / -xdev -type d -perm -0002 2>/dev/null`}</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Home and SSH keys: sensible umask; no{" "}
          <ArticleCode>chmod 777</ArticleCode> “to make it work”
        </ArticleLi>
        <ArticleLi>
          Separate partitions (<ArticleCode>/var</ArticleCode>,{" "}
          <ArticleCode>/home</ArticleCode>) help if one disk fills up: the rest
          of the system can still boot. Not every cloud VPS offers this; if
          the provider does, use it
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        <TermLink href={AUDITD_URL}>auditd</TermLink> (minimum)
      </ArticleH3>

      <ArticleP>
        After an attack, the question is always the same: what changed, who
        changed it, when. Without a trail, you only have a gut feeling.{" "}
        <TermLink href={AUDITD_URL}>auditd</TermLink> is the Linux service
        that records security events (login, sudo, sensitive file changes).
      </ArticleP>

      <ArticleP>
        How the absence is exploited: the attacker clears basic traces, or
        the team has nothing to correlate. With auditd running, you keep a
        minimum of evidence to start response.
      </ArticleP>

      <ArticleP>
        On day 1 I only leave the daemon on. Full CIS rules are phase 2. The
        immediate gain is a trail when someone touches authentication and
        sudoers.
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
        A day-1 baseline is not enough if the machine rots afterward. This
        section is what keeps hardening alive: update, detect abuse, cut
        useless services, and verify that what you think you applied is really
        there.
      </ArticleP>

      <ArticleH3>Updates without drama</ArticleH3>

      <ArticleP>
        Every month security fixes ship. If the VPS sits for months without
        updates, a public hole (CVE) hits the headlines and your host is still
        vulnerable. The attacker does not need to be creative: a scanner plus
        an outdated version is enough.
      </ArticleP>

      <ArticleP>
        That is why I automate at least security patches. On Debian/Ubuntu I
        use <TermLink href={UNATTENDED_URL}>unattended-upgrades</TermLink>. On
        the RHEL family I use{" "}
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
        On a personal/staging VPS, unattended security updates are hygiene. On
        sensitive production, automate the signal and control the window, but
        do not leave it forever-manual. A kernel update without a planned
        reboot does not really apply: the old process stays in memory.
      </ArticleP>

      <ArticleH3>
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink> (or equivalent)
      </ArticleH3>

      <ArticleP>
        Even with SSH password off, the port still takes automated attempts.
        On other services (web panel, mail, and so on) the pattern is the
        same: brute force until a weak password shows up.
      </ArticleP>

      <ArticleP>
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink> reads failure logs
        and blocks the IP for a while. It does not replace SSH keys. It is
        noise and abuse containment.
      </ArticleP>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y fail2ban

# RHEL family (EPEL depending on distro)
sudo dnf install -y fail2ban
sudo systemctl enable --now fail2ban`}
      </ArticleCode>

      <ArticleP>
        With password auth off, fail2ban is not the star. It still cuts noise
        and helps if someone re-enables password “temporarily” or another
        service stays exposed.
      </ArticleP>

      <ArticleH3>Cut what nobody asked for</ArticleH3>

      <ArticleP>
        Cloud images often ship with extra services (agent, demo, panel). Each
        extra service is surface: port, CVE, credential. The baseline asks: is
        this part of the product, or did it come for free?
      </ArticleP>

      <ArticleP>List what listens and what is running:</ArticleP>

      <ArticleCode block>
        {`ss -tulpn
systemctl list-units --type=service --state=running`}
      </ArticleCode>

      <ArticleP>
        If you do not know what it is for and it is not a product dependency:
        disable it. Fewer processes = fewer CVEs in your face.
      </ArticleP>

      <ArticleH3>Logs I watch</ArticleH3>

      <ArticleP>
        Hardening without reading logs is faith. I do not build a SIEM on day
        1. I know where to look when something smells wrong:
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
          <ArticleCode>aureport</ArticleCode> when something “weird” shows up
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        Verify with <TermLink href={LYNIS_URL}>Lynis</TermLink>
      </ArticleH3>

      <ArticleP>
        After applying the baseline, it is easy to believe the host is
        “hardened” without measuring.{" "}
        <TermLink href={LYNIS_URL}>Lynis</TermLink> is a hygiene scanner: it
        walks the machine and lists what is loose.
      </ArticleP>

      <ArticleP>
        I do not use it on day 1 to chase 400 CIS findings. I use it to see
        what I forgot (service left on, bad permission, stuck update).
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
          <ArticleCode>/etc</ArticleCode>, keys off-box). Hardening without
          recovery is only half the job.
        </ArticleP>
      </ArticleCallout>

      <ArticleH2>7. Checklist in the right order</ArticleH2>

      <ArticleMermaid
        ariaLabel="Safe day-1 to day-2 hardening order"
        chart={ORDER_CHART}
      />

      <ArticleP>
        Checklist I use before pointing production DNS:
      </ArticleP>

      <ArticleOl>
        <ArticleLi>Create a sudo/wheel user and test login</ArticleLi>
        <ArticleLi>
          Install an SSH key (perms 700/600) and test in a second session
        </ArticleLi>
        <ArticleLi>
          Harden sshd (no root/password, AllowUsers, MaxAuthTries),{" "}
          <ArticleCode>sshd -t</ArticleCode>, reload
        </ArticleLi>
        <ArticleLi>
          Review sudoers (no wide <ArticleCode>NOPASSWD:ALL</ArticleCode>)
        </ArticleLi>
        <ArticleLi>
          Firewall default-deny; allow SSH (+ HTTP/S if needed); enable
        </ArticleLi>
        <ArticleLi>
          Apply network/kernel sysctl; decide IPv6 on purpose
        </ArticleLi>
        <ArticleLi>
          chrony/NTP ok; AppArmor enforce / SELinux Enforcing
        </ArticleLi>
        <ArticleLi>auditd on; tmp and basic permissions ok</ArticleLi>
        <ArticleLi>
          Security updates + fail2ban; cut useless services
        </ArticleLi>
        <ArticleLi>
          Lynis (or equivalent) + snapshot/backup; confirm inventory
        </ArticleLi>
      </ArticleOl>

      <ArticleTable caption="Anti-patterns I see most often on VPS hosts">
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
            <ArticleTd>NOPASSWD:ALL on sudo</ArticleTd>
            <ArticleTd>Compromised account = instant root</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>IPv6 on and forgotten</ArticleTd>
            <ArticleTd>Silent bypass of the IPv4 firewall</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>SELinux/AppArmor forever permissive</ArticleTd>
            <ArticleTd>You paid the cost without the benefit</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>Forever-manual updates</ArticleTd>
            <ArticleTd>A known CVE becomes a predictable incident</ArticleTd>
          </ArticleTr>
          <ArticleTr>
            <ArticleTd>“I hardened” with no Lynis/inventory</ArticleTd>
            <ArticleTd>Feeling safe ≠ baseline</ArticleTd>
          </ArticleTr>
        </ArticleTbody>
      </ArticleTable>

      <ArticleP>
        Ops/interview line that works better than “I use Linux”:
      </ArticleP>

      <ArticleP>
        “On day 1-2 I close identity (key, no root/password, tight sudo),
        perimeter (default-deny + sysctl), host (time, MAC, filesystem,
        audit), and maintenance (updates, fail2ban, verification). Full CIS
        and containers stay phase 2.”
      </ArticleP>

      <ArticleH3>Key takeaways</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          A complete baseline removes the dumb 80% and covers the themes that
          matter most, without claiming impenetrable.
        </ArticleLi>
        <ArticleLi>
          Order matters: user, then key, then sshd/sudo, then firewall/sysctl, then time/MAC,
          then updates, then verify.
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
          Deep CIS, advanced MAC policy, and container hardening: next level,
          after a living baseline.
        </ArticleLi>
      </ArticleUl>
    </>
  );
}
