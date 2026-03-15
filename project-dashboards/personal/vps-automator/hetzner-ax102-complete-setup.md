# Hetzner AX102 — Complete Setup Manual
## Security Hardened | AI Dev Factory | 24/7 Autonomous Coding

> **Server**: Hetzner AX102 (Ryzen 9 7950X3D, 128GB DDR5 ECC, 2×1.92TB NVMe)
> **Location**: Helsinki, Finland — €102.30/mo
> **OS**: Ubuntu 24.04 LTS
> **Goal**: Tailscale-locked, zero public ports, Coolify-managed, running 20+ autonomous AI coding agents

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR MAC (Seattle)                                         │
│  Tailscale → SSH / VS Code Remote / Browser dashboards      │
└──────────────────────────┬──────────────────────────────────┘
                           │ WireGuard (Tailscale)
┌──────────────────────────▼──────────────────────────────────┐
│  HETZNER AX102 — Helsinki                                   │
│  Ubuntu 24.04 LTS | Tailscale-only access | UFW locked      │
│                                                              │
│  ┌─── COOLIFY (infra layer) ─────────────────────────────┐  │
│  │  SSL certs │ Docker mgmt │ DB provisioning │ Deploys   │  │
│  │  https://coolify.yourdomain.com (Tailscale only)       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─── PAPERCLIP (orchestration layer) ───────────────────┐  │
│  │  Dashboard │ Budgets │ Org charts │ Agent coordination │  │
│  │  Node.js + Postgres │ localhost:3100                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─── MISSION CONTROL (your app — replaces Paperclip) ──┐  │
│  │  Custom orchestration for SCF/CNO/McDonald's/sides     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─── OLLAMA (model layer) ──────────────────────────────┐  │
│  │  Cloud: qwen3.5, glm-5, kimi-k2.5 (free)              │  │
│  │  localhost:11434                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─── CODING AGENTS (execution layer) ───────────────────┐  │
│  │  GSD-2 auto mode │ Claude Code │ Codex │ OpenCode      │  │
│  │  20+ tmux sessions │ Ollama + OpenRouter + Anthropic    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─── OPENCLAW (ops bot — sandboxed) ────────────────────┐  │
│  │  Telegram alerts │ GitHub monitoring │ Deploy triggers  │  │
│  │  Docker container │ no root access                      │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

# PART A — PREREQUISITES (Before Touching the Server)

## A1. Accounts & Keys to Prepare

| Item | Action |
|------|--------|
| **Tailscale** | Create account at tailscale.com, install on Mac |
| **Tailscale Auth Key** | Admin Console → Settings → Keys → Generate (Reusable: NO, Ephemeral: NO, Pre-authorized: YES, Expiry: 1 day) |
| **SSH Key** | On Mac: `cat ~/.ssh/id_ed25519.pub` (generate if needed: `ssh-keygen -t ed25519`) |
| **Domain** | Point a domain (e.g., `dev.yourdomain.com`) to the AX102's public IP for Coolify SSL |
| **OpenRouter** | Sign up at openrouter.ai, create API key, add $5 credits |
| **Anthropic** | API key from console.anthropic.com (for production projects) |
| **GitHub** | SSH key on Mac for agent forwarding |

## A2. Hetzner Order Checklist

- [x] Server: **AX102** 
- [x] Location: **Helsinki** (€102.30/mo)
- [x] OS: **Ubuntu 24.04 LTS** (base)
- [x] Setup fee: €269 (one-time)
- [ ] Note the root password from Hetzner Robot console after provisioning

---

# PART B — SECURITY HARDENING (Phase 1-9)

## B0. Initial Connection

```bash
# From your Mac — first and last time using public IP
ssh root@<hetzner-public-ip>
```

## B1. Create the Setup Script

SSH in as root and create the script:

```bash
cat > /root/setup.sh << 'SCRIPT_END'
#!/bin/bash
set -euo pipefail

# ============================================================
# CONFIGURATION — EDIT THESE VALUES
# ============================================================
NEW_USER="dev"
SSH_PUBKEY="ssh-ed25519 AAAA..."            # Your Mac's public key
TAILSCALE_AUTHKEY="tskey-auth-xxxx..."      # From Tailscale Admin Console
HOSTNAME="hetzner-dev"                       # Machine name in tailnet
DOMAIN="dev.yourdomain.com"                  # For Coolify SSL (optional)

# ============================================================
# PHASE 1 — System Update & Hardening
# ============================================================
echo ">>> PHASE 1: System update & base packages"
apt update && apt upgrade -y
apt install -y \
  ufw fail2ban curl wget git build-essential \
  unattended-upgrades apt-listchanges \
  tmux htop iotop ncdu jq tree \
  software-properties-common ca-certificates gnupg

hostnamectl set-hostname "$HOSTNAME"
timedatectl set-timezone UTC

# ============================================================
# PHASE 2 — Create Non-Root User
# ============================================================
echo ">>> PHASE 2: Creating user '$NEW_USER'"
useradd -m -s /bin/bash "$NEW_USER"
usermod -aG sudo "$NEW_USER"
mkdir -p "/home/$NEW_USER/.ssh"
echo "$SSH_PUBKEY" >> "/home/$NEW_USER/.ssh/authorized_keys"
chown -R "$NEW_USER:$NEW_USER" "/home/$NEW_USER/.ssh"
chmod 700 "/home/$NEW_USER/.ssh"
chmod 600 "/home/$NEW_USER/.ssh/authorized_keys"
echo "$NEW_USER ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/$NEW_USER"
chmod 0440 "/etc/sudoers.d/$NEW_USER"

# ============================================================
# PHASE 3 — SSH Hardening
# ============================================================
echo ">>> PHASE 3: SSH hardening"
cat > /etc/ssh/sshd_config.d/99-hardening.conf << 'SSHEOF'
Protocol 2
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitEmptyPasswords no
MaxAuthTries 3
LoginGraceTime 30
X11Forwarding no
AllowTcpForwarding yes
AllowAgentForwarding yes
ClientAliveInterval 300
ClientAliveCountMax 0
PermitUserEnvironment no
HostbasedAuthentication no
Banner /etc/issue.net
SSHEOF

echo "Authorized access only. All activity is logged." > /etc/issue.net
systemctl restart ssh

# ============================================================
# PHASE 4 — Install Tailscale
# ============================================================
echo ">>> PHASE 4: Installing Tailscale"
curl -fsSL https://tailscale.com/install.sh | sh
systemctl enable --now tailscaled
tailscale up \
  --authkey="$TAILSCALE_AUTHKEY" \
  --hostname="$HOSTNAME" \
  --ssh \
  --accept-routes \
  --accept-dns=true

sleep 5
TAILSCALE_IP=$(tailscale ip -4)
echo "Tailscale IP: $TAILSCALE_IP"

# ============================================================
# PHASE 5 — UFW Firewall (Block Everything Except Tailscale)
# ============================================================
echo ">>> PHASE 5: UFW firewall"
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Allow ALL traffic on Tailscale interface only
ufw allow in on tailscale0

# Allow Tailscale WireGuard handshake (only UDP port open to public)
ufw allow 41641/udp

# Allow HTTP/HTTPS only if hosting public services via Coolify
# Uncomment these ONLY if you need public web access:
# ufw allow 80/tcp
# ufw allow 443/tcp

ufw --force enable

# ============================================================
# PHASE 6 — Fail2ban
# ============================================================
echo ">>> PHASE 6: Fail2ban"
cat > /etc/fail2ban/jail.local << 'F2BEOF'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 3
banaction = ufw
ignoreip = 127.0.0.1/8 100.64.0.0/10

[sshd]
enabled  = true
port     = ssh
filter   = sshd
logpath  = /var/log/auth.log
maxretry = 3
bantime  = 24h
F2BEOF

systemctl enable --now fail2ban

# ============================================================
# PHASE 7 — Automatic Security Updates
# ============================================================
echo ">>> PHASE 7: Automatic security updates"
cat > /etc/apt/apt.conf.d/20auto-upgrades << 'APTEOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APTEOF

cat > /etc/apt/apt.conf.d/52unattended-upgrades-local << 'APTEOF2'
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Mail "root";
Unattended-Upgrade::MailReport "on-change";
APTEOF2

# ============================================================
# PHASE 8 — Kernel Hardening
# ============================================================
echo ">>> PHASE 8: Kernel hardening (sysctl)"
cat > /etc/sysctl.d/99-hardening.conf << 'SYSEOF'
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.all.rp_filter = 1
SYSEOF

sysctl --system

# ============================================================
# PHASE 9 — Verification
# ============================================================
echo ""
echo "============================================"
echo "  SECURITY SETUP COMPLETE"
echo "============================================"
echo ""
echo "=== UFW Status ==="
ufw status verbose
echo ""
echo "=== Tailscale Status ==="
tailscale status
echo "Tailscale IP: $(tailscale ip -4)"
echo ""
echo "=== SSH Config ==="
sshd -T 2>/dev/null | grep -E "permitrootlogin|passwordauth|port"
echo ""
echo "=== Fail2ban ==="
fail2ban-client status sshd 2>/dev/null || echo "fail2ban starting..."
echo ""
echo "=== Listening Ports (should be minimal) ==="
ss -tulpn | grep LISTEN
echo ""
echo "============================================"
echo "  PUBLIC SSH IS NOW DISABLED"
echo "  Connect via: ssh dev@$HOSTNAME"
echo "  (Tailscale must be active on your Mac)"
echo "============================================"

SCRIPT_END

chmod +x /root/setup.sh
```

Run it:
```bash
bash /root/setup.sh
```

## B2. Post-Security: Tailscale ACL Policy

After the server registers, set this in **Tailscale Admin → Access Controls**:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["your-email@gmail.com"],
      "dst": ["tag:server:*"]
    }
  ],
  "ssh": [
    {
      "action": "check",
      "src": ["your-email@gmail.com"],
      "dst": ["tag:server"],
      "users": ["dev", "root"],
      "checkPeriod": "12h"
    }
  ],
  "tagOwners": {
    "tag:server": ["your-email@gmail.com"]
  }
}
```

Then: Admin Console → Machines → your server → Edit Tags → `tag:server`
And: Disable Key Expiry on the server node.

## B3. Mac SSH Config

```bash
# Add to ~/.ssh/config on your Mac
Host hetzner
  HostName hetzner-dev
  User dev
  ForwardAgent yes
  IdentityFile ~/.ssh/id_ed25519
```

**Test the connection:**
```bash
ssh hetzner                    # Should work via Tailscale
ssh -T git@github.com          # Test agent forwarding from server
```

**Public SSH is now dead. All subsequent steps are via Tailscale.**

---

# PART C — DEV STACK INSTALLATION

From here, you're SSHed in as `dev` via Tailscale.

## C1. Install Node.js 22 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt install -y nodejs
node --version    # v22.x
npm --version
```

## C2. Install Python 3.12 + pip

```bash
sudo apt install -y python3 python3-pip python3-venv
python3 --version   # 3.12.x
```

## C3. Install pnpm (needed for Paperclip and many projects)

```bash
npm install -g pnpm
pnpm --version
```

## C4. Install Docker (needed for Coolify and containerized services)

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker dev
# Log out and back in for group to take effect
exit
```

SSH back in:
```bash
ssh hetzner
docker --version
```

## C5. Install Coolify

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

Coolify runs on port 8000 by default. Access it via Tailscale:
```
http://hetzner-dev:8000
```

Complete the initial setup wizard in your browser:
1. Create admin account
2. Add your server as a resource (localhost)
3. Optionally configure your domain for SSL

**Use Coolify to deploy:** databases, staging environments, your mission control app,
and any services your projects need. Don't manually `docker run` things.

## C6. Install Ollama

```bash
curl -fsSL https://ollama.ai/install.sh | sh
sudo systemctl enable ollama

# Pull cloud models (free — inference runs on Ollama's servers)
ollama pull qwen3.5:cloud
ollama pull glm-5:cloud
ollama pull kimi-k2.5:cloud
ollama pull minimax-m2.5:cloud

# Verify
ollama list
```

## C7. Install Claude Code

```bash
curl -fsSL https://claude.ai/install.sh | bash
claude --version
```

## C8. Install GSD-2

```bash
npx gsd-2@latest
```

GSD will launch an interactive setup wizard for LLM provider selection.

## C9. Install Paperclip (or your Mission Control later)

```bash
cd ~
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
pnpm install
pnpm dev
# Dashboard at http://localhost:3100 (access via Tailscale)
```

---

# PART D — MODEL ROUTING CONFIGURATION

## D1. Shell Environment (~/.bashrc additions)

```bash
cat >> ~/.bashrc << 'ENVEOF'

# ============================================================
# AI MODEL ROUTING
# ============================================================

# --- Anthropic (production work) ---
export ANTHROPIC_API_KEY_NATIVE="sk-ant-YOUR_KEY_HERE"

# --- OpenRouter (pay-per-token, 500+ models) ---
export OR_API_KEY="sk-or-v1-YOUR_KEY_HERE"

# ============================================================
# ALIASES — Model Tiers
# ============================================================

# --- FREE: Ollama cloud models ---
alias cc-qwen='ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_BASE_URL=http://localhost:11434 ANTHROPIC_API_KEY="" claude --model qwen3.5:cloud'
alias cc-glm='ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_BASE_URL=http://localhost:11434 ANTHROPIC_API_KEY="" claude --model glm-5:cloud'
alias cc-kimi='ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_BASE_URL=http://localhost:11434 ANTHROPIC_API_KEY="" claude --model kimi-k2.5:cloud'

# --- CHEAP: OpenRouter budget models ---
alias cc-deepseek='ANTHROPIC_BASE_URL="https://openrouter.ai/api" ANTHROPIC_AUTH_TOKEN="$OR_API_KEY" ANTHROPIC_API_KEY="" claude --model deepseek/deepseek-chat-v3'
alias cc-gemini='ANTHROPIC_BASE_URL="https://openrouter.ai/api" ANTHROPIC_AUTH_TOKEN="$OR_API_KEY" ANTHROPIC_API_KEY="" claude --model google/gemini-2.5-pro'

# --- PREMIUM: Anthropic direct (production code) ---
alias cc-sonnet='ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY_NATIVE" claude --model claude-sonnet-4-20250514'
alias cc-opus='ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY_NATIVE" claude --model claude-opus-4-20250514'

# --- SWITCH: Back to native Anthropic ---
alias cc-native='unset ANTHROPIC_BASE_URL; unset ANTHROPIC_AUTH_TOKEN; ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY_NATIVE" claude'

# ============================================================
# PROJECT NAVIGATION
# ============================================================
export PROJECTS_DIR="$HOME/projects"
alias projects='cd $PROJECTS_DIR && ls -la'

ENVEOF

source ~/.bashrc
```

## D2. Model Strategy Per Project Type

| Project Type | Alias | Model | Cost |
|---|---|---|---|
| SCF / CNO (production) | `cc-sonnet` or `cc-opus` | Anthropic Sonnet/Opus | $$$ |
| McDonald's automation | `cc-sonnet` | Anthropic Sonnet | $$ |
| SkyNet agent dev | `cc-qwen` | Qwen 3.5 cloud (Ollama) | Free |
| Side projects | `cc-kimi` or `cc-glm` | Ollama cloud | Free |
| Boilerplate / scaffolding | `cc-deepseek` | DeepSeek V3 (OpenRouter) | ¢ |
| Code review CI/CD | `cc-gemini` | Gemini 2.5 Pro (OpenRouter) | ¢ |
| Mission control dev | `cc-qwen` | Qwen 3.5 cloud | Free |

---

# PART E — PROJECT STRUCTURE & AUTOMATION

## E1. Create Project Directories

```bash
mkdir -p ~/projects/{cno,scf,skynet,mcdonalds,mission-control}
mkdir -p ~/projects/sides/{project-01,project-02,project-03}
```

## E2. Multi-Agent Launch Script

```bash
cat > ~/launch-agents.sh << 'LAUNCHEOF'
#!/bin/bash
# ============================================================
# LAUNCH ALL GSD-2 AUTO-MODE SESSIONS
# Each project gets its own tmux session with the right model
# ============================================================

declare -A PROJECTS
# Format: [session-name]="directory|alias"

# --- Production (Anthropic API) ---
PROJECTS[cno]="$HOME/projects/cno|cc-sonnet"
PROJECTS[scf]="$HOME/projects/scf|cc-sonnet"
PROJECTS[mcdonalds]="$HOME/projects/mcdonalds|cc-sonnet"

# --- Internal tools (free Ollama cloud) ---
PROJECTS[skynet]="$HOME/projects/skynet|cc-qwen"
PROJECTS[mission-ctrl]="$HOME/projects/mission-control|cc-qwen"

# --- Side projects (free Ollama cloud) ---
PROJECTS[side-01]="$HOME/projects/sides/project-01|cc-kimi"
PROJECTS[side-02]="$HOME/projects/sides/project-02|cc-glm"
PROJECTS[side-03]="$HOME/projects/sides/project-03|cc-qwen"

echo "Launching ${#PROJECTS[@]} agent sessions..."
echo ""

for session in "${!PROJECTS[@]}"; do
  IFS='|' read -r dir alias <<< "${PROJECTS[$session]}"

  if [ ! -d "$dir" ]; then
    echo "  SKIP: $session — directory $dir not found"
    continue
  fi

  # Kill existing session if running
  tmux kill-session -t "$session" 2>/dev/null

  # Launch new session with the right model alias
  tmux new-session -d -s "$session" -c "$dir" \
    "echo '=== $session === ($alias)'; $alias"

  echo "  ✓ $session → $dir ($alias)"
done

echo ""
echo "All sessions launched. Commands:"
echo "  tmux list-sessions          # See all"
echo "  tmux attach -t cno          # Attach to session"
echo "  Ctrl+B then D               # Detach"
echo "  tmux kill-session -t name   # Kill one"
echo "  tmux kill-server             # Kill all"
LAUNCHEOF

chmod +x ~/launch-agents.sh
```

## E3. Status Monitor Script

```bash
cat > ~/agent-status.sh << 'STATUSEOF'
#!/bin/bash
# ============================================================
# QUICK STATUS: All agent sessions + system resources
# ============================================================

echo "╔══════════════════════════════════════════╗"
echo "║  HETZNER AX102 — AGENT STATUS            ║"
echo "╚══════════════════════════════════════════╝"
echo ""

echo "=== TMUX SESSIONS ==="
tmux list-sessions 2>/dev/null || echo "  No active sessions"
echo ""

echo "=== SYSTEM RESOURCES ==="
echo "  CPU:  $(nproc) cores | Load: $(cat /proc/loadavg | awk '{print $1, $2, $3}')"
echo "  RAM:  $(free -h | awk '/Mem:/ {print $3 "/" $2 " used"}')"
echo "  Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2 " used (" $5 ")"}')"
echo "  Swap: $(free -h | awk '/Swap:/ {print $3 "/" $2 " used"}')"
echo ""

echo "=== SERVICES ==="
for svc in ollama tailscaled docker coolify fail2ban; do
  status=$(systemctl is-active "$svc" 2>/dev/null)
  if [ "$status" = "active" ]; then
    echo "  ✓ $svc"
  else
    echo "  ✗ $svc ($status)"
  fi
done
echo ""

echo "=== OLLAMA MODELS ==="
ollama list 2>/dev/null || echo "  Ollama not running"
echo ""

echo "=== TAILSCALE ==="
tailscale status 2>/dev/null | head -5
echo ""

echo "=== OPEN PORTS (should be minimal) ==="
sudo ss -tulpn | grep LISTEN | awk '{print "  " $1, $5, $7}'
STATUSEOF

chmod +x ~/agent-status.sh
```

## E4. Convenience Aliases

```bash
cat >> ~/.bashrc << 'ALIASEOF'

# ============================================================
# SERVER MANAGEMENT
# ============================================================
alias launch='~/launch-agents.sh'
alias status='~/agent-status.sh'
alias sessions='tmux list-sessions'
alias attach='tmux attach -t'
alias killall-agents='tmux kill-server'
alias paperclip='cd ~/paperclip && pnpm dev'

ALIASEOF

source ~/.bashrc
```

---

# PART F — DAILY OPERATIONS

## F1. Morning Startup

```bash
ssh hetzner              # Tailscale SSH from your Mac
status                   # Check everything is healthy
launch                   # Spin up all agent sessions
```

## F2. Steer a Specific Project

```bash
attach cno               # Attach to CNO's GSD session
# Inside GSD: /gsd status, /gsd discuss, etc.
# Ctrl+B then D to detach (keeps running)
```

## F3. Add a New Project

```bash
mkdir -p ~/projects/new-project
cd ~/projects/new-project
git init
cc-qwen                  # Start Claude Code with free model
# Or run GSD:
npx gsd-2@latest         # Initialize GSD for the project
```

Then add it to `launch-agents.sh`.

## F4. Monitor Costs

```bash
# Anthropic costs
# https://console.anthropic.com/billing

# OpenRouter costs
# https://openrouter.ai/activity

# Inside any Claude Code session:
# Type: /cost
```

## F5. Access Dashboards (via Tailscale)

| Dashboard | URL |
|-----------|-----|
| Coolify | `http://hetzner-dev:8000` |
| Paperclip | `http://hetzner-dev:3100` |
| Your Mission Control | `http://hetzner-dev:3000` (or whatever port) |

All accessible only via Tailscale — zero public exposure.

---

# PART G — KEY MANAGEMENT SUMMARY

| Component | Expiry | Notes |
|---|---|---|
| Tailscale Auth Key (`tskey-auth-*`) | 1 day | Registers server, then irrelevant |
| Tailscale Node Key | Disabled (never) | Server stays on tailnet permanently |
| WireGuard Session Keys | Auto-rotate 2 min | Transparent, no action needed |
| SSH Reauth (ACL `check`) | Every 12 hours | Via Tailscale identity |
| OS SSH Keys | On Mac only | Via `ForwardAgent` — never stored on server |
| Anthropic API Key | No expiry | Stored in `~/.bashrc` as env var |
| OpenRouter API Key | No expiry | Stored in `~/.bashrc` as env var |

---

# PART H — POST-SETUP CHECKLIST

## Security
- [ ] Tailscale shows server as connected in Admin Console
- [ ] Can `ssh hetzner` from Mac
- [ ] `ssh -T git@github.com` works from server (agent forwarding)
- [ ] `ufw status` shows NO public port 22
- [ ] `nmap <public-ip>` from external shows no open TCP ports
- [ ] Node key expiry disabled in Tailscale Admin Console
- [ ] Server tagged as `tag:server` in Tailscale

## Dev Stack
- [ ] `node --version` → v22.x
- [ ] `python3 --version` → 3.12.x
- [ ] `docker --version` → works
- [ ] `ollama list` → shows cloud models
- [ ] `claude --version` → works
- [ ] Coolify dashboard accessible at `hetzner-dev:8000`
- [ ] `cc-qwen` launches Claude Code with Ollama (free)
- [ ] `cc-sonnet` launches Claude Code with Anthropic (paid)

## Operations
- [ ] `launch` starts all agent sessions
- [ ] `status` shows system health
- [ ] `attach <project>` works
- [ ] Paperclip dashboard accessible at `hetzner-dev:3100`

---

# PART I — QUICK REFERENCE CARD

```
# Connect
ssh hetzner

# Launch everything
launch

# Check health
status

# Attach to project
attach cno                    # or scf, skynet, mcdonalds, etc.

# Detach (keep running)
Ctrl+B then D

# List all sessions
sessions

# Kill everything
killall-agents

# Model switching (in any terminal)
cc-qwen                       # Free (Ollama cloud)
cc-kimi                       # Free (Ollama cloud)
cc-deepseek                   # Cheap (OpenRouter)
cc-sonnet                     # Premium (Anthropic)
cc-opus                       # Max quality (Anthropic)

# Inside Claude Code
/cost                         # Check session cost
/model qwen3.5:cloud          # Switch model mid-session
/gsd auto                     # Start GSD autonomous mode
/gsd status                   # Check GSD progress

# Dashboards (via Tailscale only)
http://hetzner-dev:8000       # Coolify
http://hetzner-dev:3100       # Paperclip
```
