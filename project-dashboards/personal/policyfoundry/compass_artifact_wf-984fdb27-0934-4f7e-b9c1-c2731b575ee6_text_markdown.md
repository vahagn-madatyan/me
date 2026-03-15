# AI-powered firewall policy management: a production architecture

**No open-source, AI-native firewall policy management tool exists today — this is a clear white space.** The $2–3B network security policy management (NSPM) market is dominated by legacy commercial tools (Tufin, AlgoSec, FireMon) that bolt superficial AI onto decade-old architectures, while 50% of organizations still manage firewall rules with spreadsheets. An agentic AI system that ingests traffic flows, analyzes patterns, and autonomously manages firewall rules across vendors would bridge two domains that remain separate today: traffic analysis (Zeek/Suricata/NDR) and policy management (NSPM). The architecture below is designed for production scale — from a single CLI binary on a laptop to a globally distributed cloud deployment — using a Go + TypeScript polyglot stack, a plugin system modeled on Terraform providers, and a graduated-autonomy safety model that earns trust over time.

---

## The end-to-end data flow

The system operates as a four-stage agentic pipeline: **Analyze → Assess → Generate Policy → Decide**, with each stage producing structured output that feeds the next. Here is the complete data flow from log ingestion to rule deployment:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           LOG SOURCES                                           │
│  Palo Alto (CSV syslog) ─┐                                                     │
│  Fortinet (KV syslog) ───┤                                                     │
│  AWS VPC Flow Logs ───────┼──→ Vector (parse/normalize via VRL) ──┐             │
│  GCP VPC Flow Logs ───────┤                                       │             │
│  iptables/nftables ───────┘                                       │             │
└───────────────────────────────────────────────────────────────────┼─────────────┘
                                                                    │
        ┌───────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────┐     ┌──────────────────────────────────────────────┐
│  BUFFER / QUEUE           │     │  STORAGE                                     │
│  CLI: in-memory channel   │────▶│  CLI: DuckDB + Parquet + SQLite              │
│  Cloud: Kafka / CF Queues │     │  Cloud: ClickHouse (hot) + S3 Parquet (cold) │
└──────────┬───────────────┘     │        + PostgreSQL (rules/audit)             │
           │                      └──────────────────────────────────────────────┘
           ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        AGENTIC AI PIPELINE                                       │
│                                                                                  │
│  ┌──────────────┐   ┌────────────────┐   ┌─────────────────┐   ┌─────────────┐ │
│  │ 1. ANALYZE   │──▶│ 2. ASSESS      │──▶│ 3. GENERATE     │──▶│ 4. DECIDE   │ │
│  │ Traffic      │   │ Security       │   │ Policy          │   │ Create /    │ │
│  │ Patterns     │   │ Posture        │   │ (vendor-neutral)│   │ Update Rule │ │
│  └──────────────┘   └────────────────┘   └─────────────────┘   └──────┬──────┘ │
│                                                                        │        │
│  State: Durable Objects / Redis / SQLite (checkpointed per step)       │        │
│  LLM: Cloudflare AI Gateway / LiteLLM → OpenAI / Anthropic / Ollama   │        │
└────────────────────────────────────────────────────────────────────────┼────────┘
                                                                         │
           ┌─────────────────────────────────────────────────────────────┘
           ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     HUMAN-IN-THE-LOOP GATE                                       │
│  Low risk  → Auto-apply + notify (block known-bad IP from threat intel)          │
│  Med risk  → Single approval (Slack/CLI confirm, tighten existing rule)          │
│  High risk → Multi-level approval (new external access, deny rules)              │
│  Critical  → Full CAB review (production deny, CDE rules)                        │
└──────────┬───────────────────────────────────────────────────────────────────────┘
           ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     FIREWALL PLUGIN LAYER (Adapter Pattern)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ AWS SG   │ │ Azure    │ │ PAN-OS   │ │ FortiOS  │ │ Check    │ │ OPNsense │ │
│  │ Adapter  │ │ NSG      │ │ Adapter  │ │ Adapter  │ │ Point    │ │ pfSense  │ │
│  │          │ │ Adapter  │ │          │ │          │ │ Adapter  │ │ iptables │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                                                  │
│  Universal Rule Schema → Vendor Translation → Transaction → Commit/Rollback      │
│  Event-sourced audit log (every change = immutable event with before/after state) │
└──────────────────────────────────────────────────────────────────────────────────┘
```

The pipeline runs as micro-batch by default — **processing every 30–60 seconds** rather than true streaming — which provides 95% of the benefit of real-time detection at roughly 30% of the resource cost. For threat detection (port scans, DDoS, brute force), a real-time streaming path via ClickHouse materialized views triggers immediate alerts. For policy optimization and compliance reporting, batch analysis over hourly or daily windows provides the statistical significance needed for confident rule changes.

---

## Log ingestion: Vector as the universal collector

**Vector** (by Datadog, written in Rust) is the recommended ingestion layer for both tiers. In benchmarks, Vector achieves **86 MiB/s throughput on just 181 MB of RAM** — outperforming Fluent Bit (64.4 MiB/s), Logstash (40.6 MiB/s), and Fluentd (27.7 MiB/s). It ships as a single binary with zero dependencies, making it ideal for the self-hosted CLI mode, while scaling horizontally as an aggregator fleet for cloud deployment.

The critical challenge is normalizing four fundamentally different log formats into a unified schema. Palo Alto uses **positional CSV** (field 7 = source address, field 8 = destination, field 30 = action). Fortinet uses **key-value pairs** (`srcip=10.1.100.11 dstport=80 action="close"`). AWS VPC Flow Logs are **space-delimited** with configurable field sets (v2–v7). GCP VPC Flow Logs are **nested JSON** with connection sub-objects. Vector's VRL (Vector Remap Language) handles all four formats with type-safe, testable transformations that parse each vendor's format and emit a unified schema.

The unified schema should be pragmatically inspired by OCSF (Open Cybersecurity Schema Framework, backed by AWS/Splunk/Palo Alto) but without OCSF's full overhead, which can inflate raw VPC flow log size by 10×. The **10 critical fields** for AI-powered analysis are: the 5-tuple (src_ip, dst_ip, src_port, dst_port, protocol), action (allow/deny), bytes transferred, timestamp, rule_id/rule_name, and application name. These fields enable every analysis the AI pipeline needs — from anomaly detection and exfiltration profiling to unused-rule identification and zero-trust microsegmentation recommendations.

For storage, the architecture splits cleanly between tiers. The CLI tier uses **DuckDB** (embedded columnar OLAP, "SQLite for analytics") reading Parquet files — capable of querying multi-GB datasets on a laptop in seconds — paired with **SQLite** for rule history and audit trails. The cloud tier uses **ClickHouse** for hot log analytics, which achieves **10:1 to 20:1 compression** versus Elasticsearch's 1.5:1, runs sub-second aggregations over billions of rows, and costs **70–85% less** in storage. Kafka sits between ingestion and storage in the cloud tier, providing replay capability, fan-out to multiple consumers, and decoupling of ingestion throughput from query load.

---

## Multi-agent orchestration: custom pipeline over framework

After evaluating LangGraph, CrewAI, AutoGen, Mastra, and the Cloudflare Agents SDK, the recommendation is a **custom lightweight state machine** with durable execution guarantees from Cloudflare Workflows or Temporal.io, rather than adopting a heavy framework. The reasoning: this system's pipeline is well-defined (four sequential stages with known branch points at the risk-assessment gate), the 128 MB memory ceiling on Cloudflare Workers precludes most frameworks, and security-critical infrastructure benefits from maximum control over execution semantics with zero framework abstraction hiding behavior.

Each pipeline stage is an async function that takes typed input, calls the LLM with a structured output schema, and returns typed output. State is checkpointed after every stage to Durable Objects (Cloudflare), Redis (self-hosted), or DynamoDB (AWS). If the process fails at stage 3, it resumes from the stage 2 checkpoint without re-running LLM inference — critical for both cost control and idempotency. The **saga pattern** governs the pipeline: each step has a compensating action (retry with backoff for LLM failures, rollback to prior firewall state for rule application failures, alert + manual escalation for unrecoverable errors).

For teams that prefer a framework, two strong options exist depending on language:

- **Cloudflare Agents SDK + Workflows** (TypeScript, serverless-native): Each agent is a Durable Object with co-located SQLite state, zero-latency reads, and WebSocket connections. Workflows provide durable execution with automatic step memoization and can wait up to 1 year for human approval events. Best fit for Cloudflare-native deployment.
- **LangGraph** (Python, container-based): The most mature graph-based orchestration framework, used in production by Klarna, Uber, Elastic, and **400+ companies**. Built-in checkpointers (PostgresSaver for production), native human-in-the-loop interrupts, and "time travel" state replay. However, its official documentation warns against serverless deployment due to long-running stateful execution patterns.

For LLM abstraction, **Cloudflare AI Gateway** is the primary recommendation for Cloudflare-native stacks — it provides BYOK (Bring Your Own Key) via the Secrets Store, dynamic routing between providers, semantic caching, rate limiting, and analytics, all at the edge with single-digit millisecond overhead. **LiteLLM** serves as the fallback for self-hosted deployments, supporting 100+ providers through an OpenAI-compatible API with built-in cost tracking per virtual key. The BYOK architecture stores user API keys encrypted in the Secrets Store (or user's local config for CLI mode), references them by alias in requests via the `cf-aig-byok-alias` header, and applies per-user budget caps and rate limits.

---

## The firewall plugin system: Terraform's provider model adapted

The plugin architecture follows Terraform's proven **provider pattern**: a core engine defines a universal rule lifecycle (validate → dry-run → apply → verify → commit/rollback), and each vendor plugin implements translation between the universal schema and vendor-specific API calls. This is not just an analogy — it's the same adapter pattern that manages firewall rules across Terraform's `panos_security_rule_group`, `aws_security_group_rule`, `azurerm_network_security_rule`, and `cloudflare_ruleset` providers.

The universal rule schema captures the superset of all vendor capabilities while using a **capabilities declaration** for graceful degradation. AWS Security Groups can't express deny rules (`supportsDenyRules: false`), so the engine routes deny-intent rules to NACLs instead. PAN-OS supports two-phase commit (`supportsCommit: true`) with candidate config staging, while FortiOS applies changes immediately. OPNsense has **the gold-standard safety model**: a `savepoint` API that auto-rolls back changes if confirmation isn't received within 60 seconds. The plugin abstracts these differences behind a universal transaction interface.

Each vendor's API has distinct authentication and operational characteristics worth noting:

- **Palo Alto PAN-OS REST API**: API key via `X-PAN-KEY` header; two-phase commit (candidate → commit); Policy Optimizer provides rule hit counts for unused-rule detection; Panorama supports device group push for managed firewalls
- **Fortinet FortiOS REST API**: Bearer token auth with configurable expiry (1–10,080 min); immediate apply (no staging); FortiManager adds workspace mode with locking; rule reordering via `?action=move&before=<id>`
- **Check Point Management API (R80+)**: Session-based with publish/install-policy model; multiple admins can work in concurrent sessions; `discard` for rollback; database revision tracking
- **OPNsense REST API**: API key + secret via HTTP Basic Auth; `savepoint` → apply → `cancelRollback` pattern with 60-second auto-rollback — the safest model for automated changes
- **AWS Security Groups**: IAM-based auth; allow-only rules (stateful); `--dry-run` flag; 60 rules per SG (adjustable); immediate propagation
- **Azure NSGs**: Azure AD OAuth2; allow + deny with priority ordering (100–4096); ARM `what-if` for deployment previewing; 1,200 writes/hour rate limit

---

## Safety: graduated autonomy with circuit breakers

Autonomous firewall changes are the highest-risk operation in this system. The architecture implements **graduated autonomy** — a four-phase trust model that starts conservatively and expands AI authority as it proves reliable:

- **Phase 1 (Suggest Only)**: AI proposes rule changes with full justification; humans review and apply manually. This is the default for all new deployments and the only mode in the free CLI tier.
- **Phase 2 (Auto-apply Low Risk)**: AI auto-applies well-defined low-risk changes — blocking IPs from threat intelligence feeds, adding allow rules for known internal services on standard ports — with immediate notification to the security team.
- **Phase 3 (Auto-apply Medium Risk)**: With single-approval bypass for changes where AI confidence exceeds a calibrated threshold. Covers tightening existing rules, temporary blocks during active incidents.
- **Phase 4 (Human-on-the-Loop)**: AI operates autonomously within predefined policy constraints; humans monitor dashboards and intervene by exception. Reserved for mature deployments with proven accuracy metrics.

Every rule change — whether human or AI-initiated — writes an immutable **event-sourced audit entry** recording the actor, timestamp, previous state, new state, change ticket ID, business justification, approver chain, AI confidence score, and risk level. This satisfies PCI-DSS 4.0 requirements (business justification for every rule, approval records, complete change history, semi-annual review evidence, 1-year audit log retention with 3 months immediately accessible), SOC 2 logical access controls, and ISO 27001 change management documentation.

Three safety mechanisms provide defense in depth. A **global kill switch** immediately reverts all AI-driven changes to suggest-only mode. A **circuit breaker** auto-disables auto-apply if more than N changes fail or trigger alerts within a time window. And an **emergency revert** enables one-click rollback of all AI-applied changes within the last N hours, leveraging the event-sourced log to reconstruct prior state precisely.

---

## A single binary that scales to distributed cloud

The deployment architecture borrows from **Grafana Loki's pattern**, where all microservice components compile into a single binary controlled by a `--target` flag. In monolithic mode (`--target=all`), the binary runs log ingestion, AI analysis, API server, and background workers in a single process — suitable for the CLI tool or a small self-hosted Docker container. In distributed mode, each component scales independently: Workers at the edge for log ingestion, Fargate/ECS containers for AI inference, and dedicated processes for the API and background processing.

The technology stack is **Go + TypeScript polyglot**. Go serves as the core engine and CLI language — it compiles to a static binary with zero dependencies, has the best TUI framework available (Bubbletea/Charm for rich terminal UIs), and dominates the security tool ecosystem (Trivy, Falco, OPA, Vault, and Terraform are all Go). TypeScript handles the Cloudflare Workers edge layer (the only language that runs natively on Workers besides WASM) and the web GUI. Both layers consume the same REST API, ensuring feature parity between CLI and web interfaces.

```
┌──────────────────────────────────────────┐
│  Go Core Binary                          │
│  ├── CLI (Cobra + Bubbletea TUI)         │
│  ├── Core engine (rule eval, AI prompts) │
│  ├── Log parsers (VRL-inspired)          │
│  ├── Firewall adapters (plugin system)   │
│  ├── Embedded HTTP API server            │
│  └── Local SQLite + DuckDB              │
│  --target=all (self-hosted)              │
└──────────┬───────────────────────────────┘
           │ REST API (same interface)
┌──────────▼───────────────────────────────┐
│  TypeScript Cloud Layer                   │
│  ├── Cloudflare Workers (edge ingestion)  │
│  ├── Web GUI (Next.js or SvelteKit)       │
│  ├── tRPC / REST API gateway              │
│  ├── D1 + R2 + Durable Objects            │
│  └── Workers AI + AI Gateway              │
└──────────────────────────────────────────┘
```

For AI inference, the local/CLI tier uses **Ollama** for self-hosted LLM inference (users bring their own API keys for cloud providers or run models locally). The cloud tier routes through Cloudflare AI Gateway or AWS Bedrock for managed, multi-provider inference. The LLM abstraction layer presents a unified interface: swap `provider: "ollama", model: "llama3"` for `provider: "anthropic", model: "claude-sonnet"` with no code changes.

---

## Open-core model: the Semgrep playbook

The open-core split follows the **Semgrep/GitLab "buyer-based" model** — individual developer features are free, team/manager/compliance features are paid. The CLI is the viral adoption channel (`brew install firewall-ai` → analyze → get results → share), and the web platform is the revenue driver.

| Capability | Free CLI | Premium Cloud |
|---|---|---|
| Single firewall analysis | ✅ | ✅ |
| Local LLM support (Ollama) | ✅ | ✅ |
| Rule suggestions (suggest-only mode) | ✅ | ✅ |
| JSON/SARIF output, CI/CD integration | ✅ | ✅ |
| Community firewall adapter plugins | ✅ | ✅ |
| Multi-firewall orchestration | — | ✅ |
| Web dashboard and flow visualization | — | ✅ |
| Auto-apply with graduated autonomy | — | ✅ |
| Team collaboration and RBAC | — | ✅ |
| Compliance reports (PCI-DSS, SOC 2) | — | ✅ |
| SSO/SAML, audit log exports | — | ✅ |
| Managed cloud hosting with SLA | — | ✅ |

The recommended license is **BSL 1.1** (Business Source License) with a 3-year conversion to Apache 2.0 — the same model used by CockroachDB, Sentry (via its FSL evolution), and Redpanda. Source code is fully available for inspection, modification, and self-hosting, but cloud providers cannot resell it as a competing SaaS offering. After 3 years, each version becomes fully Apache 2.0, maintaining community trust. Pricing tiers should follow: **Free** (CLI + single firewall), **Team** ($49–99/month flat or per-firewall), **Enterprise** (custom, with on-prem support, SLA, and dedicated success).

---

## Competitive positioning in a consolidating market

The NSPM market is consolidating — **Tufin acquired Skybox Security in February 2025**, reducing competition among legacy vendors. The Big Three (Tufin, AlgoSec, FireMon) charge $100K+ annually and are adding AI features incrementally: Tufin's AI-powered bot for natural language interaction, AlgoSec's chatbot (described by analysts as "AI buzzwords with limited depth"), and FireMon's Policy Workbench (early 2026). None are AI-native architectures.

Meanwhile, **70–80% of enterprise firewall rules are outdated, redundant, or unnecessary**. 50% of organizations manage them with spreadsheets. 71% of respondents in industry surveys say their current management processes pose risks to their security posture. The agentic AI SOC startup category is exploding — Torq reached a **$1.2B valuation** in January 2026 with $332M total funding — but these platforms focus on incident detection and response, not firewall policy lifecycle management.

The open-source landscape reveals the gap clearly. Zeek, Suricata, and Wazuh provide excellent traffic analysis and detection but zero policy management. The emerging "LLM firewall" category (LlamaFirewall, Trylon Gateway, OpenShield) focuses on protecting LLM applications from prompt injection — a completely different problem. GitHub searches for "AI firewall rule management" return virtually no results. **There is no open-source project that combines traffic analysis, AI-driven policy generation, and multi-vendor firewall rule management.**

Three differentiators would define this product's competitive moat:

- **Closed-loop traffic-to-policy pipeline**: The only tool that continuously analyzes actual traffic patterns and generates vendor-specific, validated firewall rules — bridging the NDR and NSPM domains that every other vendor treats as separate products
- **Natural language policy intent**: Expressing security intent ("block all traffic from high-risk countries except to our CDN endpoints") and having AI agents translate it into correct rules across Palo Alto, AWS Security Groups, and Cloudflare WAF simultaneously
- **Open-source, self-hostable foundation**: Addressing the 50% of organizations using spreadsheets who can't justify $100K+ NSPM licenses, while maintaining an upgrade path to the premium platform

---

## Conclusion: what makes this architecture production-grade

The architecture's strength lies in four design principles that compound. **Capability-based degradation** means the system works with whatever firewall APIs are available — if a vendor lacks dry-run support, the system compensates with more aggressive pre-validation; if commit isn't supported, it implements snapshot-restore logic. **Event-sourced everything** provides not just compliance but operational confidence — any AI-driven change can be precisely reversed, replayed, or audited months later. **The single-binary-to-distributed-cloud spectrum** means a security engineer can evaluate the tool in 5 minutes on their laptop, then deploy the same codebase to Cloudflare's global edge without architectural changes. And **graduated autonomy** solves the trust problem that kills most autonomous security tools — the system proves itself in suggest-only mode before earning the right to auto-apply, with circuit breakers that immediately constrain it if behavior degrades.

The most impactful near-term implementation priority is the **Analyze → Suggest** loop with the Palo Alto and AWS Security Group adapters — these two platforms cover the largest share of enterprise and cloud firewall deployments. Combined with Vector-based ingestion, DuckDB for local analysis, and Ollama for self-hosted inference, this creates a fully functional free-tier CLI tool that runs entirely on a user's machine with zero cloud dependencies. That standalone capability — not a demo, but a genuinely useful production tool — is what drives open-source adoption. Everything else scales from there.