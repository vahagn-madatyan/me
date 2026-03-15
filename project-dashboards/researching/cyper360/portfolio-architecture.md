# Agentic Security Portfolio: A Closed-Loop Architecture for Offense, Governance, Detection & Response

## Executive summary

Four purpose-built agentic AI tools, sharing a common intelligence layer, that together form a closed-loop security lifecycle: **0xpwn** finds what's exploitable, **PolicyFoundry** governs the rules, a **UEBA Agent** catches insiders and anomalies, and an **IR Agent** contains and remediates. Each tool feeds data to the others — pentests inform policy rules, policy violations feed behavioral baselines, anomaly detections trigger incident response, and post-incident hardening flows back into governance. The compound moat is the shared telemetry and knowledge graph that makes each tool smarter the more the others run.

---

## The portfolio at a glance

| Tool | Domain | Function | Primary users | Status |
|---|---|---|---|---|
| **0xpwn** | Offense | Autonomous penetration testing | Red teamers, security engineers | Spec complete |
| **PolicyFoundry** | Governance | AI-powered firewall policy management | Network/security engineers, SOC | Architecture complete |
| **UEBA Agent** | Detection | Insider threat & behavioral analytics | SOC analysts, threat hunters | Proposed |
| **IR Agent** | Response | Incident response orchestration | SOC, IR teams, CISO | Proposed |

---

## Why these four — and why together

The cybersecurity market is fragmenting into dozens of AI-native startups, each solving one slice. The strategic bet here is that **the seam between tools is where value compounds**. Today, a pentest finding sits in a PDF. A firewall rule change lives in a ticket. An insider threat alert goes to a queue. An incident response follows a playbook in a wiki. None of these systems talk to each other, and the human translation layer between them is where breaches happen.

This portfolio eliminates that translation layer through a shared intelligence substrate:

```
OFFENSE → GOVERNANCE → DETECTION → RESPONSE → OFFENSE
   ↑                                              ↓
   └──────────── closed feedback loop ─────────────┘
```

Each tool is independently useful (open-core CLI, standalone value) but becomes disproportionately powerful when combined. This is the Datadog/Elastic playbook applied to security operations: land with one wedge, expand through the data gravity of a shared platform.

---

## Architecture overview

### The four agentic pipelines

Each tool follows the same structural pattern: a multi-stage agentic pipeline with typed inputs/outputs per stage, LLM-powered reasoning at decision points, durable state checkpointing, and human-in-the-loop gates calibrated to risk.

#### 1. 0xpwn — Autonomous Pentesting

**Problem:** Traditional pentests cost $10K–$150K, take weeks, happen quarterly, and 75% are still manual — while the talent to scale doesn't exist.

**What the agent does:** Executes the full kill chain autonomously — reconnaissance, vulnerability discovery, exploit chaining, privilege escalation, lateral movement — on continuous cadence at a fraction of manual cost.

**Pipeline stages:**

| Stage | Agent | Input | Output | LLM role |
|---|---|---|---|---|
| 1 | Reconnaissance | Target scope (IPs, domains, CIDRs) | Asset inventory, open ports, services, tech stack | Parse scan results, identify high-value targets |
| 2 | Vulnerability Discovery | Asset inventory | Prioritized vulnerability list with exploit availability | Correlate CVEs, assess exploitability context |
| 3 | Exploit Chaining | Vulnerability list + target env | Attack paths, successful exploits, privilege escalation chains | Reason about multi-step exploit sequences |
| 4 | Reporting | All prior stage outputs | Attack narrative, risk scores, remediation guidance, evidence | Generate human-readable findings with business context |

**Cross-portfolio output:** Attack paths and discovered vulnerabilities feed directly into PolicyFoundry as rule recommendations. If 0xpwn finds an exploitable path through a misconfigured firewall rule, PolicyFoundry receives that finding and generates a corrective rule change.

**Market context:** $4–6B penetration testing market, growing to $10–15B by 2030. Key competitors: XBOW ($95M raised, HackerOne #1), Horizon3.ai ($178.5M, FedRAMP), Pentera ($250M+, ~$100M ARR).

---

#### 2. PolicyFoundry — Firewall Policy Management

**Problem:** Enterprises accumulate tens of thousands of firewall rules across vendors, 70–80% are outdated or redundant, 50% manage them with spreadsheets, and no AI-native tool or open-source alternative exists.

**What the agent does:** Ingests traffic flow logs, analyzes patterns, and autonomously manages firewall rules across vendors — bridging traffic analysis (NDR) and policy management (NSPM) into a single agentic pipeline.

**Pipeline stages:**

| Stage | Agent | Input | Output | LLM role |
|---|---|---|---|---|
| 1 | Analyze | Normalized flow logs (via Vector) | Traffic patterns, anomalies, baseline deviations | Identify meaningful patterns vs noise |
| 2 | Assess | Traffic patterns + current ruleset | Security posture score, rule coverage gaps, redundancies | Evaluate risk of current policy state |
| 3 | Generate | Assessment + business intent | Vendor-neutral rule changes with justification | Translate intent to correct rule semantics |
| 4 | Decide | Generated rules + risk classification | Applied rules or approval requests (graduated autonomy) | Classify change risk, determine approval path |

**Cross-portfolio output:** Traffic baselines and flow metadata feed the UEBA Agent's behavioral modeling. Anomalous flows that don't match any baseline become UEBA training signals. Post-incident hardening rules from the IR Agent are deployed through PolicyFoundry's rule engine.

**Market context:** $2.3–7.7B NSPM market. Legacy Big Three (Tufin, AlgoSec, FireMon) charge $100K+. Zero AI-native startups, zero open-source alternatives — total greenfield.

---

#### 3. UEBA Agent — Insider Threat Detection

**Problem:** Insider threats cause ~60% of data breaches, yet behavioral analytics remains fragmented across SIEM rules, manual investigation, and expensive commercial UEBA platforms. No open-source, AI-native insider threat tool exists.

**What the agent does:** Builds behavioral baselines for every user and entity, detects deviations indicating compromised accounts, negligent insiders, or data exfiltration, enriches findings with organizational context, and produces prioritized risk alerts with evidence packages.

**Pipeline stages:**

| Stage | Agent | Input | Output | LLM role |
|---|---|---|---|---|
| 1 | Baseline | Auth logs, network flows, endpoint telemetry, app access logs | Per-entity behavioral profiles, peer group models | Identify meaningful behavioral dimensions, cluster peers |
| 2 | Anomaly Detection | Real-time activity stream + baselines | Deviation events with anomaly scores | Assess whether deviations are suspicious vs benign context shifts |
| 3 | Context Enrichment | Anomaly events + HR data, role changes, access reviews | Contextualized risk events (e.g., departing employee + data download) | Correlate organizational signals with behavioral anomalies |
| 4 | Risk Scoring & Alert | Enriched events + historical patterns | Prioritized insider risk alerts, evidence timeline, recommended actions | Generate investigation narratives, recommend containment steps |

**Data sources (leveraging existing PolicyFoundry infrastructure):**

- **Network flows** — already normalized by PolicyFoundry's Vector ingestion pipeline
- **Authentication logs** — AD/Entra ID, Okta, cloud IAM (new ingest adapters)
- **Endpoint telemetry** — EDR APIs (CrowdStrike, SentinelOne, Defender)
- **Application access** — SaaS audit logs (Google Workspace, M365, Salesforce)
- **HR signals** — role changes, PIP status, termination dates (HRIS API integration)

**Cross-portfolio output:** Confirmed insider threat alerts trigger the IR Agent's triage pipeline. Behavioral baselines inform PolicyFoundry's anomaly detection — if a user suddenly accesses segments they've never touched, PolicyFoundry can flag or block the traffic before UEBA even scores the event.

**Market context:** UEBA market ~$1–2B growing to $4B+. Varonis ($2.5B market cap), DTEX, Securonix (acquired by Juniper), Exabeam lead. Apache Metron (dead), Wazuh (minimal UEBA) represent the OSS landscape. No AI-native open-source UEBA exists.

**Key differentiators for an open-source entrant:**

- **Network-flow-native:** Most UEBA tools start from logs; starting from network flows (PolicyFoundry's data) provides visibility that log-only tools miss
- **Entity-centric knowledge graph:** Shared knowledge graph connects users → devices → access → network segments → firewall rules, enabling richer context than siloed UEBA
- **Agentic investigation:** Instead of just scoring anomalies, the agent autonomously investigates — querying additional data sources, building timelines, and packaging evidence for human review

---

#### 4. IR Agent — Incident Response Orchestration

**Problem:** Mean time to contain a breach is 73 days (IBM). Legacy SOAR requires manually defined playbooks that demand constant updating. The gap between "alert fires" and "threat is contained" is where breaches become catastrophes.

**What the agent does:** Autonomously orchestrates the full incident lifecycle — triage, containment, forensics, and recovery — reasoning through each step rather than following static playbooks.

**Pipeline stages:**

| Stage | Agent | Input | Output | LLM role |
|---|---|---|---|---|
| 1 | Triage | Alert (from UEBA, SIEM, EDR, or manual) | Severity classification, blast radius assessment, affected assets | Reason about incident scope, classify severity, identify dependencies |
| 2 | Containment | Triage output + asset inventory + policy context | Containment actions executed (isolation, lockdown, block rules) | Determine optimal containment strategy, minimize business impact |
| 3 | Forensics | Containment state + raw telemetry + logs | Attack timeline, IOC extraction, root cause analysis | Reconstruct attack narrative, identify initial access vector |
| 4 | Recovery | Forensics output + system state | Service restoration plan, patch validation, hardening recommendations | Generate recovery steps, validate completeness, recommend prevention |

**Integration touchpoints:**

- **From UEBA Agent:** Insider threat alerts arrive pre-triaged with behavioral context and evidence timeline
- **From PolicyFoundry:** Current firewall state is known — containment agent can push emergency block rules through PolicyFoundry's rule engine with proper audit trail
- **To 0xpwn:** Post-incident IOCs and attack paths feed the next pentest's scope — "verify the vector we just patched is actually closed"
- **To PolicyFoundry:** Hardening recommendations become rule change proposals deployed through the graduated autonomy model

**Human-in-the-loop model:**

| Severity | Containment | Forensics | Recovery |
|---|---|---|---|
| Critical (active breach) | Auto-contain + notify (< 60 seconds) | Auto-collect, human-reviewed | Human-approved restoration |
| High (confirmed threat) | Auto-contain with single approval | Autonomous with review checkpoint | Human-approved |
| Medium (suspicious activity) | Recommend containment, await approval | Autonomous | Autonomous with notification |
| Low (policy violation) | Log and notify | Autonomous | Autonomous |

**Market context:** SOAR market $1.7–1.9B growing to $4–5B by 2030. Torq ($332M, $1.2B valuation), Tines, Swimlane, and Palo Alto XSOAR lead. No open-source agentic IR tool exists — Shuffle and TheHive handle orchestration but require manual playbook creation.

---

### The shared intelligence layer

The compound moat of this portfolio is the shared substrate that all four tools read from and write to. This is what transforms four standalone tools into a platform.

#### Unified telemetry bus

All four tools emit and consume events through a shared bus. In CLI mode, this is an in-memory Go channel. In cloud mode, this is Kafka with topic-per-tool partitioning.

```
0xpwn events:     pentest.finding, pentest.attack_path, pentest.completed
PolicyFoundry:    flow.anomaly, rule.proposed, rule.applied, rule.violation
UEBA Agent:       baseline.updated, anomaly.detected, risk.scored
IR Agent:         incident.created, containment.executed, forensics.completed, recovery.verified
```

#### Knowledge graph

A shared graph database (embedded: SQLite with JSON; cloud: Neo4j or Dgraph) connecting:

- **Assets:** IPs, hosts, cloud resources, applications
- **Identities:** Users, service accounts, API keys, AI agents
- **Rules:** Firewall rules, security group entries, WAF policies
- **Vulnerabilities:** CVEs, misconfigurations, exposed services
- **Incidents:** Timeline events, IOCs, containment actions
- **Relationships:** owns, accesses, communicates_with, exploits, blocks, triggers

Every tool enriches this graph. 0xpwn discovers assets and vulnerabilities. PolicyFoundry maps rules to assets. UEBA maps identities to behavioral patterns. IR maps incidents to timelines. The graph's density increases with each tool deployed — and each tool's reasoning improves with richer graph context.

#### LLM abstraction

All four tools use the same LLM abstraction layer:

- **CLI tier:** LiteLLM → Ollama (local) or BYOK cloud providers
- **Cloud tier:** Cloudflare AI Gateway or AWS Bedrock → Claude Sonnet/Haiku (primary), GPT-4o (fallback)
- **Model selection per task:** High-reasoning tasks (exploit chaining, incident triage) use larger models; high-volume tasks (log classification, baseline updates) use smaller/faster models
- **Structured output:** All LLM calls use JSON schema validation for typed inter-stage communication

#### Event-sourced audit log

Every action across all four tools writes an immutable audit entry:

```json
{
  "id": "evt_7f3a...",
  "timestamp": "2026-03-15T14:22:01Z",
  "tool": "policyfoundry",
  "agent": "policy_generation",
  "actor": "ai:policyfoundry:v1.2",
  "action": "rule.proposed",
  "target": "aws_sg:sg-0abc123",
  "previous_state": { "rules": [...] },
  "new_state": { "rules": [...] },
  "justification": "Block port 445 exposure discovered by 0xpwn finding pf_2024_0312",
  "confidence": 0.94,
  "risk_level": "medium",
  "approval_chain": ["auto:low_risk_policy"],
  "correlation_ids": ["0xpwn:finding:pf_2024_0312", "ueba:anomaly:lateral_smb"]
}
```

The `correlation_ids` field is what makes cross-tool intelligence work — every event can trace its lineage across tools.

---

## Technology stack

### Shared across all tools

| Component | CLI tier | Cloud tier |
|---|---|---|
| **Language** | Go (core engine, CLI, agents) | Go + TypeScript (web layer) |
| **CLI framework** | Cobra + Bubbletea TUI | — |
| **LLM orchestration** | LiteLLM → Ollama / BYOK | AI Gateway / Bedrock |
| **State checkpointing** | SQLite | PostgreSQL + Redis |
| **Telemetry bus** | In-memory Go channels | Kafka |
| **Knowledge graph** | SQLite + JSON relations | Neo4j / Dgraph |
| **Audit log** | SQLite (append-only) | PostgreSQL (event-sourced) |
| **Log ingestion** | Vector (embedded) | Vector (aggregator fleet) |
| **Analytics storage** | DuckDB + Parquet | ClickHouse + S3 Parquet |
| **Sandbox (0xpwn)** | Docker / Kali containers | Firecracker / gVisor |

### Per-tool specific components

| Tool | Unique components |
|---|---|
| **0xpwn** | Metasploit/Nuclei integration, Kali toolchain, exploit DB, sandboxed execution environment |
| **PolicyFoundry** | Firewall adapter plugins (Palo Alto, AWS SG, Fortinet, OPNsense), VRL parsers, rule transaction engine |
| **UEBA Agent** | Behavioral ML models (isolation forest, LSTM autoencoders), peer-group clustering, HRIS connectors |
| **IR Agent** | EDR/SIEM API connectors, containment action library, forensic artifact collectors, recovery validators |

---

## Open-core model

All four tools follow the same Semgrep-inspired buyer-based split:

| Capability | Free CLI | Premium Cloud |
|---|---|---|
| Single-target operation | ✅ | ✅ |
| Local LLM support (Ollama) | ✅ | ✅ |
| Suggest-only mode | ✅ | ✅ |
| JSON/SARIF output, CI/CD integration | ✅ | ✅ |
| Community plugins/adapters | ✅ | ✅ |
| **Cross-tool intelligence** | — | ✅ |
| **Knowledge graph platform** | — | ✅ |
| **Multi-target orchestration** | — | ✅ |
| **Web dashboard & visualization** | — | ✅ |
| **Auto-apply / autonomous mode** | — | ✅ |
| **Team collaboration & RBAC** | — | ✅ |
| **Compliance reports** | — | ✅ |
| **SSO/SAML, audit exports** | — | ✅ |

**License:** BSL 1.1 with 3-year Apache 2.0 conversion (per-tool).

**The premium unlock is the cross-tool layer.** Each CLI tool is genuinely useful standalone. The knowledge graph, unified telemetry, cross-tool correlation, and web dashboard are what drive platform revenue.

---

## Implementation priority

### Phase 1: Foundation (now)

Build and ship the two tools already in progress:

- **0xpwn** — Spec complete, implementation via GSD
- **PolicyFoundry** — Architecture complete, 7-task kickoff ready

Both ship as standalone CLIs with their own open-source repos.

### Phase 2: Detection (next)

Build the UEBA Agent, leveraging PolicyFoundry's existing Vector ingestion and flow analysis as the data foundation:

1. Add auth log and endpoint telemetry adapters to the shared ingestion layer
2. Implement behavioral baseline engine (isolation forest + peer clustering)
3. Build anomaly detection pipeline with LLM-powered context enrichment
4. Create risk scoring model and alert generation
5. Wire UEBA alerts to PolicyFoundry for automated traffic blocking

### Phase 3: Response (then)

Build the IR Agent, leveraging all three prior tools' outputs:

1. Implement triage pipeline consuming UEBA alerts and SIEM integrations
2. Build containment action library (network isolation via PolicyFoundry, account lockdown via IAM APIs)
3. Create forensics pipeline with artifact collection and timeline reconstruction
4. Implement recovery validation and hardening recommendation engine
5. Wire post-incident findings back to 0xpwn scope and PolicyFoundry rules

### Phase 4: Platform (revenue)

Ship the premium cloud layer:

1. Unified knowledge graph with cross-tool correlation
2. Web dashboard with real-time security posture visualization
3. Cross-tool workflow automation (pentest finding → policy change → verification)
4. Compliance reporting across all four tools
5. Team collaboration, RBAC, and audit log exports

---

## Competitive positioning

No company today offers this closed-loop combination:

| Vendor | Offense | Governance | Detection | Response | Shared Intel |
|---|---|---|---|---|---|
| **This portfolio** | ✅ 0xpwn | ✅ PolicyFoundry | ✅ UEBA Agent | ✅ IR Agent | ✅ Knowledge Graph |
| CrowdStrike | ❌ | ❌ | ✅ Falcon | ✅ Falcon Complete | Partial (Falcon platform) |
| Palo Alto | ❌ | Partial (PAN-OS) | ✅ Cortex XDR | ✅ XSOAR | Partial (Cortex) |
| Torq | ❌ | ❌ | ❌ | ✅ HyperSOC | ❌ |
| Horizon3.ai | ✅ NodeZero | ❌ | ❌ | ❌ | ❌ |
| Tufin/AlgoSec | ❌ | ✅ (legacy) | ❌ | ❌ | ❌ |
| Varonis | ❌ | ❌ | ✅ UEBA | ❌ | Partial |

The platform incumbents (CrowdStrike, Palo Alto) have broad coverage but are stitching together acquired products. This portfolio is designed as an integrated system from day one — the shared intelligence layer is architectural, not bolted on through acquisition.

The open-source angle is the adoption wedge that none of the incumbents can match. A security engineer evaluates one CLI tool in 5 minutes, discovers value, shares with their team, and expands to the platform. The same Semgrep/GitLab motion, applied to a four-tool security lifecycle.
