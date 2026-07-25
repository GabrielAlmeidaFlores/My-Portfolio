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
        I have already left a VPS too “ready”. Provider panel, fresh Ubuntu,
        SSH on 22, root with a password because “it is just a test”. In less
        than a day <ArticleCode>auth.log</ArticleCode> looked like an auction:
        login attempts from IPs I had never seen.
      </ArticleP>

      <ArticleP>
        It was not a sophisticated APT. It was the baseline I skipped. The box
        was on the internet with the most hammered port on the planet and the
        most obvious credential. Later I found the rest of the hole: default
        sysctl, skewed clock, AppArmor “who knows if it is enforcing”, zero
        verification.
      </ArticleP>

      <ArticleP>
        This post is the hardening I treat as{" "}
        <strong>complete for day 1–2 of a Linux VPS</strong>: identity,
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
          –{" "}
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
          manual updates “when I can” — and I never can
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
        <ArticleLi>Who can get in? (identity)</ArticleLi>
        <ArticleLi>From where and on which ports? (perimeter)</ArticleLi>
        <ArticleLi>Does the kernel help or hurt? (sysctl)</ArticleLi>
        <ArticleLi>
          Are time, MAC, and filesystem at a safe minimum?
        </ArticleLi>
        <ArticleLi>
          What keeps running if I ignore the box for a week? (maintenance)
        </ArticleLi>
      </ArticleOl>

      <ArticleP>Quick inventory I run before “closing”:</ArticleP>

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
        Scene: I needed to “just ship nginx”. I did everything as root because
        it was faster. Later I had to disable remote root login — and almost
        locked myself out because the only open session was root.
      </ArticleP>

      <ArticleP>
        Correct order: sudo user → SSH key → harden{" "}
        <TermLink href={OPENSSH_URL}>sshd</TermLink> and{" "}
        <TermLink href={SUDOERS_URL}>sudo</TermLink> → only then cut what
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

      <ArticleP>Minimum I apply:</ArticleP>
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
        <ArticleCode>/etc/sudoers.d/</ArticleCode> — never edit{" "}
        <ArticleCode>sudoers</ArticleCode> without{" "}
        <ArticleCode>visudo</ArticleCode>.
      </ArticleP>

      <ArticleH3>Change the port? Nuance</ArticleH3>

      <ArticleP>
        Moving 22 → 2222 reduces log noise. It is not a real control. Bots
        scan ports. I treat a custom port as signal hygiene. The barrier is
        key + no password + no root + AllowUsers.
      </ArticleP>

      <ArticleH2>4. Network and perimeter</ArticleH2>

      <ArticleP>
        Scene: app live, firewall “later”. Later never came. Anything on{" "}
        <ArticleCode>0.0.0.0</ArticleCode> became an entry. Default image
        sysctl left the host more talkative than I wanted.
      </ArticleP>

      <ArticleP>
        Rule: default-deny on ingress. Only open what the product needs
        (almost always SSH + 80/443). Then basic net.sysctl.
      </ArticleP>

      <ArticleH3>
        <TermLink href={UFW_URL}>UFW</TermLink> (Debian/Ubuntu)
      </ArticleH3>

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
        Typical drop-in at{" "}
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
        IPv6: if you <strong>do not</strong> use it, disable or firewall it
        on purpose. Leaving IPv6 “on and forgotten” without rules is a classic
        hole. If you use it, treat it in the firewall like IPv4.
      </ArticleP>

      <ArticleP>
        Database, Redis, admin panel: if they do not need the public
        internet, they do not open. Bind to localhost or a private network.
      </ArticleP>

      <ArticleH2>5. Host: time, MAC, and filesystem</ArticleH2>

      <ArticleP>
        Scene: incident at 03:00. Logs with a skewed timestamp. TLS
        certificate “not yet valid”. Without synced time, audit and TLS lie.
      </ArticleP>

      <ArticleH3>
        Time with <TermLink href={CHRONY_URL}>chrony</TermLink>
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
        Not a policy deep-dive. Make sure the distro MAC is not off by
        accident.
      </ArticleP>

      <ArticleUl>
        <ArticleLi>
          Debian/Ubuntu: <ArticleCode>aa-status</ArticleCode> — enforce
          profiles for critical services
        </ArticleLi>
        <ArticleLi>
          RHEL family: <ArticleCode>getenforce</ArticleCode> should be{" "}
          <ArticleCode>Enforcing</ArticleCode> (do not leave{" "}
          <ArticleCode>Permissive</ArticleCode> “just for now”)
        </ArticleLi>
      </ArticleUl>

      <ArticleP>
        If you need an exception, open the exception. Do not disable the
        whole MAC.
      </ArticleP>

      <ArticleH3>Filesystem and basic permissions</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          <ArticleCode>/tmp</ArticleCode> and{" "}
          <ArticleCode>/var/tmp</ArticleCode>: sticky bit; on a dedicated VPS,
          consider <ArticleCode>noexec,nosuid,nodev</ArticleCode> if the
          workload allows
        </ArticleLi>
        <ArticleLi>
          Avoid world-writable dirs outside tmp:{" "}
          <ArticleCode>{`find / -xdev -type d -perm -0002 2>/dev/null`}</ArticleCode>
        </ArticleLi>
        <ArticleLi>
          Home and keys: sensible umask; no{" "}
          <ArticleCode>chmod 777</ArticleCode> “to make it work”
        </ArticleLi>
        <ArticleLi>
          Separate partitions (<ArticleCode>/var</ArticleCode>,{" "}
          <ArticleCode>/home</ArticleCode>) help containment — not every cloud
          VPS offers them; if the provider does, use them
        </ArticleLi>
      </ArticleUl>

      <ArticleH3>
        <TermLink href={AUDITD_URL}>auditd</TermLink> (minimum)
      </ArticleH3>

      <ArticleP>
        On a serious VPS I leave the audit daemon on. Full CIS rules are phase
        2; day 1 is having a trail when someone touches authentication and
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
        Scene: VPS stable for months. Zero updates. An OpenSSH CVE hits the
        headlines. I do not want to learn that from Twitter — or believe I
        “hardened” without ever measuring.
      </ArticleP>

      <ArticleH3>Updates without drama</ArticleH3>

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
        On a personal/staging VPS, unattended security updates are hygiene. On
        sensitive production, automate the signal and control the window —
        but do not leave it forever-manual. A kernel update without a planned
        reboot is a ghost patch.
      </ArticleP>

      <ArticleH3>
        <TermLink href={FAIL2BAN_URL}>fail2ban</TermLink> (or equivalent)
      </ArticleH3>

      <ArticleCode block>
        {`# Debian/Ubuntu
sudo apt install -y fail2ban

# RHEL family (EPEL depending on distro)
sudo dnf install -y fail2ban
sudo systemctl enable --now fail2ban`}
      </ArticleCode>

      <ArticleP>
        With password auth off, fail2ban is not the star — it still cuts noise
        and abuse on other services.
      </ArticleP>

      <ArticleH3>Cut what nobody asked for</ArticleH3>

      <ArticleCode block>
        {`ss -tulpn
systemctl list-units --type=service --state=running`}
      </ArticleCode>

      <ArticleP>
        If you do not know what it is for and it is not a product dependency:
        disable it. Fewer processes = fewer CVEs in your face.
      </ArticleP>

      <ArticleH3>Logs I watch</ArticleH3>

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
        After the baseline, I run a hygiene scanner. Not to chase 400 CIS
        findings — to see what I forgot on day 1.
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

      <ArticleTable caption="Anti-patterns I have already paid for">
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
        “On day 1–2 I close identity (key, no root/password, tight sudo),
        perimeter (default-deny + sysctl), host (time, MAC, filesystem,
        audit), and maintenance (updates, fail2ban, verification). Full CIS
        and containers stay phase 2.”
      </ArticleP>

      <ArticleH3>Key takeaways</ArticleH3>

      <ArticleUl>
        <ArticleLi>
          A complete baseline removes the dumb 80% and covers the themes that
          matter most — without selling impenetrable.
        </ArticleLi>
        <ArticleLi>
          Order matters: user → key → sshd/sudo → firewall/sysctl → time/MAC
          → updates → verify.
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
