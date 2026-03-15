# NetClaw: deep analysis of a CCIE-level AI network agent

**NetClaw is the most ambitious open-source AI network engineering agent available today** — 82 structured skills backed by 37 MCP servers, built on the OpenClaw framework and powered by Anthropic Claude. Created by John Capobianco (a well-known network automation author and former Cisco developer advocate), it went from first commit to 183 GitHub stars in under three weeks. But while NetClaw demonstrates what's possible when deep network engineering expertise meets AI agent architecture, its design choices reveal significant gaps when compared against a planned agent-agnostic, dual-layer skills library with formal safety tiers and modern monorepo distribution.

NetClaw's core insight is powerful: **automate the reasoning, not just the commands**. Each skill encodes the decision chain a senior CCIE engineer follows — checking transport before diagnosing BGP, verifying MTU when OSPF gets stuck in EXSTART, understanding that a longer AS-path might win due to LOCAL_PREF. No other open-source project combines this depth of protocol reasoning with live MCP tool execution across this many vendor platforms.

---

## Repository structure mirrors a traditional automation project

NetClaw is organized as a flat repository with bash-driven installation rather than a modern monorepo. The directory layout is straightforward:

```
netclaw/
├── workspace/skills/          # 82 skill directories, each containing SKILL.md
├── scripts/
│   ├── install.sh             # 664-line 20-step bootstrap installer
│   ├── setup.sh               # 313-line platform credential wizard
│   ├── mcp-call.py            # 464-line MCP JSON-RPC 2.0 stdio bridge
│   └── gait-stdio.py          # GAIT MCP server wrapper
├── config/openclaw.json       # Fallback OpenClaw configuration
├── testbed/testbed.yaml       # pyATS device definitions
├── lab/frr-testbed/           # FRR Docker lab for protocol participation
├── docs/                      # Documentation
├── examples/                  # Example configurations
├── SOUL.md                    # Core personality + CCIE expertise + 12 rules
├── AGENTS.md                  # Operating instructions, safety, escalation
├── IDENTITY.md                # Agent identity card
├── USER.md                    # User preferences (customizable)
├── TOOLS.md                   # Local infrastructure notes (customizable)
├── HEARTBEAT.md               # Periodic health check protocol
└── README.md
```

The **`mcp-servers/` directory is `.gitignore`d** — it's populated at install time by cloning 37 separate Git repositories. This is a critical architectural difference from a monorepo approach: dependencies are scattered across dozens of external repos with no version pinning, no workspace coordination, and no unified build system. The six workspace markdown files (SOUL.md through HEARTBEAT.md) are injected into Claude's system prompt at session start, each capped at **20,000 characters**, and collectively define NetClaw's identity, expertise, operating procedures, and safety constraints.

---

## 82 skills span 16 domains with deep Cisco focus

NetClaw's skill inventory is genuinely impressive in breadth. Every skill is a SKILL.md file with YAML frontmatter declaring dependencies and a markdown body containing step-by-step procedures, threshold tables, and report templates. The full inventory organized by domain:

**Device automation (18 skills)** covers pyATS-based operations across Cisco IOS-XE/NX-OS/ASA, Juniper JunOS, F5 BIG-IP, Linux hosts, and VMware ESXi — including core show commands, health checks, routing analysis (OSPF/BGP/EIGRP/IS-IS), security audits, topology discovery, config management with change gating, fleet-wide parallel operations, and dynamic test generation.

**Infrastructure management (11 skills)** spans three source-of-truth platforms (NetBox, Nautobot, OpsMill Infrahub), Cisco ACI fabric auditing and change deployment, Cisco ISE posture auditing and incident response, and Catalyst Center inventory/client/troubleshooting operations.

**Cloud and managed services (13 skills)** cover Cisco Meraki (5 skills for network, wireless, switching, security appliance, and monitoring), AWS (5 skills for networking, monitoring, security audit, cost analysis, and architecture diagrams backed by 6 MCP servers), and GCP (3 skills for compute, monitoring, and logging).

**Observability and monitoring (5 skills)** include Grafana with **75+ tools** (dashboards, Prometheus, Loki, alerting, incidents, OnCall), direct Prometheus PromQL queries, Kubeshark Kubernetes L4/L7 traffic analysis, and two ThousandEyes skills for network monitoring and path analysis.

**Orchestration and simulation (10 skills)** cover Cisco CML lab management (5 skills for lifecycle, topology building, node operations, packet capture, and administration), ContainerLab containerized labs, Cisco NSO device and service management via RESTCONF, Cisco SD-WAN vManage monitoring, Cisco Secure Firewall FMC policy auditing, and Itential automation with 65+ tools.

**Multi-vendor device support (3 skills)** provides dedicated Juniper JunOS automation via PyEZ/NETCONF (10 tools), Arista CloudVision Portal monitoring (4 tools), and Cisco RADKit cloud-relayed remote access (5 tools).

**Collaboration, visualization, and utilities (22 skills)** include protocol participation (live BGP/OSPF/GRE peering with 10 tools), three diagram generators (Draw.io, Markmap, UML/Kroki with 27+ diagram types), Microsoft 365 integration (OneDrive/SharePoint files, Teams notifications, Visio diagrams), four Slack operation skills, pcap deep analysis via tshark, GitHub config-as-code workflows, IETF RFC lookup, NVD CVE searching, subnet calculation, Wikipedia research, GAIT session tracking, and ServiceNow change workflow gating.

The vendor coverage is **heavily Cisco-centric**: roughly 40 of 82 skills directly involve Cisco platforms. **Notably absent** are Palo Alto firewalls, Fortinet, Check Point, Zscaler, CrowdStrike, Splunk/SIEM, any DNS management (Infoblox, Route 53 beyond basic AWS), any IPAM beyond NetBox/Nautobot, SD-WAN from non-Cisco vendors (Velocloud, Silver Peak), and any Azure cloud coverage.

---

## Agent architecture ties skills to Claude through OpenClaw

NetClaw's architecture has three tiers. The **user interface layer** uses OpenClaw's multi-channel gateway — engineers interact via `openclaw chat` CLI, Slack, or any of OpenClaw's 50+ messaging integrations. The **core agent layer** runs Anthropic Claude with the six workspace markdown files injected into the system prompt, plus skill summaries loaded from `~/.openclaw/workspace/skills/`. The **MCP server layer** consists of 37 tool backends communicating via **stdio JSON-RPC 2.0** protocol through the central `mcp-call.py` bridge script.

The skill definition format uses **SKILL.md files with YAML frontmatter**:

```yaml
---
name: pyats-health-check
description: "Device health assessment with NetBox cross-reference"
user-invocable: true
metadata:
  openclaw:
    requires:
      bins: [python3]
      env: [PYATS_MCP_PATH, PYATS_TESTBED_PATH]
---
# Health Check Procedure
## When to Use
[Scenario triggers]
## Steps
1. Collect device state via pyats_show...
2. Cross-reference against NetBox...
## Threshold Tables
| Metric | Warning | Critical |
## Report Template
[Structured output format]
```

Skills orchestrate multiple MCP servers for complex workflows. The `netbox-reconcile` skill, for example, coordinates five servers simultaneously: NetBox for intent, pyATS for device reality, ServiceNow for incident creation, Markmap for drift visualization, and GAIT for the audit trail. Each MCP server invocation spawns a **fresh subprocess** — no persistent connections, no port management, no HTTP for most backends.

**OpenClaw itself is model-agnostic**, supporting Claude, GPT-4o, Gemini, DeepSeek, Ollama, and 200+ models via OpenRouter. However, NetClaw's SOUL.md, expertise encoding, and skill procedures are **written specifically for Claude's capabilities**. The project does not support or integrate with LangChain, CrewAI, AutoGen, or OpenAI Codex as agent orchestration frameworks — it is tightly coupled to OpenClaw's runtime.

---

## 37 MCP servers form the executable tool layer

The MCP servers break down by transport and language:

| Transport | Count | Examples |
|-----------|-------|---------|
| **stdio (Python)** | ~25 | pyATS, F5, ACI, ISE, NetBox, Nautobot, ServiceNow, CML, NSO, Meraki, SD-WAN, JunOS, CVP, Protocol/scapy |
| **uvx (Python)** | ~7 | AWS (6 servers), Grafana |
| **npx (Node.js)** | ~4 | Microsoft Graph, Draw.io, RFC Lookup, ThousandEyes official |
| **Docker (Go)** | 1 | GitHub MCP server |
| **Remote HTTP** | ~5 | GCP (4 servers), Kubeshark |
| **stdio (Node.js)** | 1 | Markmap |

The aggregate tool count exceeds **1,000 individual MCP tools** available to the agent. Python dominates as the implementation language for MCP servers. The servers themselves are **third-party repositories** cloned during installation — NetClaw owns only a handful (pyATS_MCP, ACI_MCP, ISE_MCP, gait_mcp) while the rest come from community contributors, Cisco DevNet, AWS Labs, and other open-source projects.

---

## Safety relies on process gates rather than formal tiers

NetClaw implements safety through multiple overlapping mechanisms rather than a structured tier system. **ServiceNow change request gating** requires an approved CR before any configuration change, route mutation, or firewall policy update (bypassed only when `LAB_MODE=true`). **GAIT (Generative AI Immutable Transcript)** records every session turn with prompt, response, and artifacts in an append-only Git-based audit trail — 17 of the core skills integrate GAIT logging. **SOUL.md's 12 non-negotiable rules** prohibit guessing device state, skipping baselines, running destructive commands (`write erase`, `reload`, `format`), and auto-quarantining endpoints without human confirmation.

During a documented 8-hour live red-team session, the agent withstood **30+ social engineering attempts with zero successful exploits** — no passwords leaked, no webhook data exfiltrated, no unauthorized configurations applied.

However, there is **no formal read-only vs. read-write safety tier classification**. Skills that query device state and skills that push configuration changes coexist without a structured permission model. The safety boundary is enforced by ServiceNow gating and the LLM's adherence to SOUL.md rules rather than by technical enforcement at the tool level.

---

## Development velocity is extraordinary but maturity is minimal

NetClaw went from **zero to 82 skills in approximately 17 days** (first commit ~February 19, 2026). As of March 8, 2026: **183 stars**, **38 forks**, **37 commits**, **Apache-2.0 license**, and essentially **one primary contributor** (John Capobianco) with one community PR received. The project sits on top of OpenClaw, which has massive backing (**196,000 stars**, 91+ contributors, MIT license, published as an npm package).

John Capobianco is a credible figure in network automation: author of *"Automate Your Network"* (637 GitHub stars), co-author of the Cisco Press pyATS book, former Cisco Developer Advocate and Technical Leader in AI for Cisco Secure, current SR. IT Integrator at Canada's House of Commons, and holder of multiple Cisco certifications. The automateyournetwork GitHub organization has **211 repositories** spanning years of network automation work (Merlin, pyATS tools, MCP servers).

Community reception has been enthusiastic within Capobianco's existing network, but **no Reddit discussions, no independent reviews, and no production deployment case studies exist** — the project is simply too new. The multi-NetClaw BGP mesh demonstration (March 1, 2026), where two AI agents formed a live BGP peering over ngrok, generated significant interest as a genuinely novel concept.

---

## Distribution requires a 20-step bash bootstrap

Installation runs via `./scripts/install.sh`, a 664-line bash script that:

1. Verifies prerequisites (Node.js ≥18, npm, npx, python3, pip3, git)
2. Installs OpenClaw globally via `npm install -g openclaw@latest`
3. Runs the OpenClaw onboarding wizard for AI provider configuration
4. Clones and pip-installs 37 MCP server repositories into `mcp-servers/`
5. Deploys 82 skills and 6 workspace files to `~/.openclaw/workspace/`
6. Sets 14 environment variables in `~/.openclaw/.env`
7. Runs `setup.sh` for platform credential configuration

There is **no npm package, no PyPI package, no Docker container, no pnpm workspace, no monorepo structure**. Distribution is purely via `git clone` followed by a bash installer. Each MCP server is an independent Git repository cloned without version pinning. The installation process is fragile — failure in any of the 20 steps requires manual debugging across a dozen different dependency trees.

---

## How NetClaw compares to the planned dual-layer architecture

The comparison reveals both validation and significant divergence:

| Dimension | NetClaw | Planned Architecture |
|-----------|---------|---------------------|
| **Skill format** | SKILL.md with YAML frontmatter ✅ | SKILL.md for procedural knowledge ✅ |
| **MCP servers** | 37 servers, 1000+ tools ✅ | MCP servers for executable tools ✅ |
| **Dual-layer separation** | Skills reference MCP tools but layers are loosely coupled | Strict separation: SKILL.md knowledge + MCP execution |
| **Agent-agnostic** | ❌ Tied to OpenClaw/Claude | ✅ Claude, Codex, LangChain, CrewAI, AutoGen |
| **Language** | Python primary, Bash installer | TypeScript primary, Python secondary |
| **Monorepo** | ❌ Scattered across 37+ repos | pnpm workspaces monorepo |
| **Safety tiers** | ❌ Process-based (ServiceNow gating) | Formal read-only vs. write tiers |
| **Distribution** | Git clone + bash script | npm/pnpm packages |
| **License** | Apache-2.0 ✅ | Open source ✅ |
| **Security domains** | Cisco-heavy, minimal firewall/SIEM/DNS/compliance | Comprehensive N&S coverage planned |

NetClaw **validates the SKILL.md + MCP dual-layer concept** — its most effective innovation is encoding expert reasoning in structured markdown while delegating execution to MCP tool servers. The 82 skills demonstrate that markdown-based procedural knowledge works at scale for network engineering domains.

However, NetClaw's architecture has four fundamental limitations that the planned library should address. First, **agent lock-in**: NetClaw only works with OpenClaw/Claude, while the planned library targets five agent frameworks. Second, **distribution fragility**: cloning 37 repos via bash is not a viable distribution model for enterprise adoption; a pnpm workspace monorepo with versioned packages solves this. Third, **security domain gaps**: NetClaw covers Cisco firewalls (ASA, FMC) but has no Palo Alto, Fortinet, Check Point, Zscaler, CrowdStrike, Splunk, or dedicated compliance skills — the planned library's comprehensive N&S scope would fill major enterprise blind spots. Fourth, **no formal safety classification**: the planned read-only vs. write tier system provides stronger guarantees than NetClaw's process-based ServiceNow gating, which can be bypassed with a single environment variable.

## What NetClaw teaches about building a better skills library

NetClaw's rapid success offers three key lessons for the planned architecture. The **SKILL.md format works** — encoding when-to-use triggers, step-by-step procedures, threshold tables, and report templates in markdown creates composable, auditable, and LLM-readable procedural knowledge that can orchestrate multiple MCP tools. The **"coworker not assistant" philosophy** resonates with network engineers — encoding protocol state machine reasoning (not just CLI wrappers) is what differentiates an AI skills library from a script collection. And the **GAIT audit trail concept** (immutable, Git-based session recording) addresses a real enterprise concern that the planned library should incorporate from day one.

The planned architecture's advantages over NetClaw are structural: agent-agnostic design ensures broader adoption, TypeScript-primary with pnpm workspaces enables proper dependency management and versioning, formal safety tiers provide enforceable (not advisory) read/write boundaries, and comprehensive security domain coverage (firewalls, SIEM, DNS, compliance, zero-trust) fills the enterprise gaps that NetClaw's Cisco-centric skill set leaves open. NetClaw proves the concept; the planned library should improve the engineering.