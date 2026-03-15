# FirewallAI — Architecture Plan

> Agentic AI traffic-to-rule automation platform. Python CLI + LangGraph + Deep Agents + AWS Bedrock.

---

## 1. Vision & Scope

FirewallAI is an agentic AI system that ingests network traffic flow logs, analyzes patterns through a multi-stage LLM pipeline, queries existing firewall rules, and autonomously decides whether to create, update, or remove firewall rules. It bridges two domains that remain separate in every existing product: traffic analysis (NDR) and policy management (NSPM).

### 1.1 What We Are Building (Phase 1 MVP)

A Python CLI tool (`pip install firewall-ai`) that:

1. Ingests traffic flow logs from **Palo Alto Cloud NGFW** and **AWS VPC Flow Logs**
2. Normalizes logs into a unified 10-field schema
3. Runs a 4-stage agentic AI pipeline: **Analyze → Assess → Generate Policy → Decide**
4. Queries existing firewall rules on the target platform via adapter plugins
5. Produces rule change recommendations in suggest-only mode
6. Outputs results as JSON, SARIF, or rich terminal UI

### 1.2 What We Are NOT Building Yet

- Web GUI → Phase 2 (TypeScript, Next.js/SvelteKit)
- Real-time streaming ingestion → start with batch/micro-batch
- Additional adapters beyond AWS SG + Palo Alto Cloud NGFW → Phase 2+
- Auto-apply mode → Phase 1 is suggest-only; graduated autonomy comes later

### 1.3 Design Principles

| Principle | Meaning |
|---|---|
| CLI-first | The CLI is the product. Genuinely useful standalone, not a demo for a SaaS upsell. |
| BYOK | Users provide their own LLM API keys. Zero vendor lock-in via LiteLLM routing. |
| Plugin architecture | Every firewall integration is an adapter. Adding a vendor = implementing one interface. |
| Graduated autonomy | Start suggest-only. Earn trust before auto-applying changes. |
| Event-sourced audit | Every rule change proposal is an immutable, auditable event with full lineage. |
| Checkpoint everything | LangGraph checkpoints every pipeline stage. Resume from failure without re-running LLM inference. |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         LOG SOURCES                                     │
│  Palo Alto Cloud NGFW (structured syslog / API) ──┐                    │
│  AWS VPC Flow Logs (S3 / CloudWatch) ──────────────┤                   │
│  [Future: Fortinet, GCP, Check Point, iptables] ───┘                   │
└──────────────────────────────────────┬──────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      INGESTION LAYER                                    │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────────────────┐ │
│  │ Log Parsers  │───▶│ Normalizer   │───▶│ Unified Schema (Pydantic) │ │
│  │ (per vendor) │    │ (transforms) │    │ 10 critical fields         │ │
│  └─────────────┘    └──────────────┘    └────────────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      STORAGE LAYER                                      │
│  CLI:   DuckDB (analytics) + Parquet (logs) + SQLite (state/audit)     │
│  Cloud: ClickHouse (hot) + S3 Parquet (cold) + PostgreSQL (state)      │
└──────────────────────────────────────┬──────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                AGENTIC AI PIPELINE (LangGraph)                          │
│                                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐           │
│  │ ANALYZE  │──▶│ ASSESS   │──▶│ GENERATE │──▶│ DECIDE   │           │
│  │ Traffic  │   │ Security │   │ Policy   │   │ Action   │           │
│  │ Patterns │   │ Posture  │   │ Rules    │   │ Gate     │           │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘           │
│                                                                         │
│  Orchestration: LangGraph StateGraph (checkpointed per node)           │
│  Agent Layer:   Deep Agents (sub-agent spawning, planning tool)        │
│  Foundation:    LangChain (tool calling, memory, prompt chains)        │
│  LLM Routing:  LiteLLM → AWS Bedrock / Ollama / OpenAI / Anthropic   │
│  Observability: LangSmith (traces, evals, prompt debugging)           │
│  Checkpoints:  SQLiteSaver (CLI) / PostgresSaver (cloud)              │
└──────────────────────────────────────┬──────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               HUMAN-IN-THE-LOOP GATE                                    │
│  Phase 1: All changes → suggest-only (human reviews + applies)          │
│  Phase 2: Low risk → auto-apply + notify                                │
│  Phase 3: Medium risk → single approval                                 │
│  Phase 4: Human-on-the-loop (autonomous within constraints)             │
└──────────────────────────────────────┬──────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              FIREWALL ADAPTER LAYER                                     │
│  ┌────────────────────┐  ┌─────────────────────────┐                   │
│  │ AWS Security Groups │  │ Palo Alto Cloud NGFW    │                   │
│  │ (boto3, IAM auth)   │  │ (REST API, API key)     │                   │
│  └────────────────────┘  └─────────────────────────┘                   │
│                                                                         │
│  Universal Rule Schema → Vendor Translation → Validate → Apply          │
│  Event-sourced audit log (every change = immutable event)               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### 3.1 Core Engine (Python)

| Technology | Role | Why |
|---|---|---|
| Python 3.12+ | Core language | Rich ecosystem, fast prototyping, LLM library support |
| Typer + Rich | CLI framework | Click-based, auto-help generation, beautiful terminal output |
| Textual | Optional TUI dashboard | Full terminal UI for interactive analysis |
| Pydantic v2 | Data validation & schemas | Type-safe configs, LLM structured output parsing |
| DuckDB | Embedded columnar OLAP | Multi-GB analytics on a laptop in seconds |
| SQLite | State/audit trails | Zero-config, embedded, LangGraph SQLiteSaver |

### 3.2 Agentic AI (LangChain Ecosystem)

| Technology | Role | Why |
|---|---|---|
| LangGraph | Graph-based agent orchestration | Stateful workflows, checkpoints, human-in-the-loop, time-travel |
| Deep Agents | Agent harness with sub-agents | Planning tool, filesystem backend, spawns specialist agents |
| LangChain | Foundation: tools, memory, chains | Tool calling, prompt chaining, 700+ integrations |
| LangSmith | Observability & eval platform | Execution traces, prompt testing, production debugging |
| LiteLLM | Multi-provider LLM proxy | 100+ providers, OpenAI-compatible, cost tracking, fallback |
| AWS Bedrock | Primary LLM provider | Claude Sonnet/Haiku, managed infra, IAM auth |

### 3.3 Data Pipeline

| Technology | Role | Why |
|---|---|---|
| Vector | Log ingestion & normalization | 86 MiB/s throughput, 181MB RAM, VRL transforms |
| Parquet | Log file format | Columnar, compressed (zstd), queryable by DuckDB |
| Kafka | Cloud buffer/queue (Phase 2) | Replay, fan-out, decoupled throughput |
| ClickHouse | Hot log analytics (Phase 2) | 10-20x compression vs ES, sub-second queries |

### 3.4 Infrastructure

| Technology | Role | Why |
|---|---|---|
| boto3 | AWS SG + VPC + Bedrock SDK | Native AWS SDK, IAM auth, dry-run support |
| PostgreSQL | Cloud state DB (Phase 2) | PostgresSaver checkpointer, event sourcing, ACID |
| Redis | Caching + rate limiting (Phase 2) | LLM response cache, pub/sub |
| Docker | Container packaging | Consistent deployment, CI/CD friendly |

---

## 4. Data Flow — End to End

### 4.1 Log Ingestion

**Palo Alto Cloud NGFW:**
- Source: Cloud NGFW log forwarding to S3 or syslog receiver
- Format: Structured CSV (positional fields) or JSON via Cloud Manager API
- Key mapping: field 7 = src address, field 8 = dst address, field 25 = dst port, field 30 = action
- Auth: Palo Alto Cloud Manager API credentials (API key)

**AWS VPC Flow Logs:**
- Source: S3 bucket, CloudWatch Logs, or direct Athena query
- Format: Space-delimited text (v2–v7 configurable field sets)
- Default v2 fields: version, account-id, interface-id, srcaddr, dstaddr, srcport, dstport, protocol, packets, bytes, start, end, action, log-status
- Auth: IAM role/credentials via boto3

**Unified Schema (10 critical fields):**

```python
class NormalizedFlowLog(BaseModel):
    timestamp: datetime
    src_ip: IPv4Address | IPv6Address
    dst_ip: IPv4Address | IPv6Address
    src_port: int = Field(ge=0, le=65535)
    dst_port: int = Field(ge=0, le=65535)
    protocol: ProtocolEnum            # TCP, UDP, ICMP
    action: ActionEnum                # ALLOW, DENY, DROP
    bytes_transferred: int = 0
    rule_id: str | None = None        # Vendor-specific rule identifier
    app_name: str | None = None       # Application name (L7, Palo Alto only)

    # Metadata
    source_vendor: str                # "paloalto_cloudngfw" | "aws_vpc"
    raw_log: str | None = None        # Original log line for debugging
    ingestion_id: str                 # UUID for deduplication
```

These 10 fields enable every downstream analysis: anomaly detection, exfiltration profiling, unused-rule identification, zero-trust microsegmentation recommendations, and compliance auditing.

### 4.2 Storage Architecture

**CLI Tier:**
- DuckDB reads Parquet files directly — no ETL needed, queries multi-GB datasets in seconds
- One Parquet file per ingestion batch, compressed with zstd
- SQLite stores: LangGraph checkpoints (SQLiteSaver), rule history, audit events, pipeline run metadata, adapter config

**Data Retention Defaults:**
- Flow logs: 90 days (configurable)
- Audit events: 1 year (PCI-DSS 4.0 requires 1 year with 3 months immediately accessible)
- Parquet files auto-rotated and aged out

### 4.3 Processing Modes

| Mode | Interval | Use Case | Implementation |
|---|---|---|---|
| Batch (default) | On-demand / cron | Analyze a log file, generate suggestions | CLI command triggers full pipeline |
| Micro-batch | 30–60 seconds | Near-real-time monitoring (Phase 2) | Background daemon polls for new logs |
| Real-time stream | <1 second | Threat detection: port scans, DDoS (Phase 2) | ClickHouse materialized views |

Phase 1 focuses on batch mode: user points CLI at a log source, pipeline runs, results output.

---

## 5. Agentic AI Pipeline — Detailed Design

### 5.1 Pipeline State Schema

```python
class PipelineState(TypedDict):
    # ── Input ──
    flow_logs: list[NormalizedFlowLog]
    target_firewall: str                      # Adapter name
    firewall_config: dict                     # Connection details

    # ── Stage 1: Analyze ──
    traffic_analysis: TrafficAnalysis | None
    anomalies: list[AnomalyReport] | None

    # ── Stage 2: Assess ──
    security_assessment: SecurityAssessment | None
    risk_scores: list[FlowRiskScore] | None
    rule_gaps: list[RuleGap] | None
    current_rules: list[UniversalRule] | None

    # ── Stage 3: Generate ──
    policy_proposals: list[PolicyProposal] | None

    # ── Stage 4: Decide ──
    decisions: list[RuleDecision] | None
    approval_status: str                      # pending | approved | rejected

    # ── Pipeline Metadata ──
    run_id: str
    started_at: datetime
    errors: list[str]
    llm_calls: list[LLMCallRecord]            # Cost tracking
    messages: Annotated[list, add_messages]    # LangGraph message history
```

### 5.2 LangGraph Graph Definition

```python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite import SqliteSaver

workflow = StateGraph(PipelineState)

# Nodes
workflow.add_node("analyze", analyze_traffic_node)
workflow.add_node("assess", assess_security_node)
workflow.add_node("generate", generate_policy_node)
workflow.add_node("decide", decide_action_node)
workflow.add_node("human_review", human_review_node)

# Edges
workflow.set_entry_point("analyze")
workflow.add_edge("analyze", "assess")
workflow.add_edge("assess", "generate")
workflow.add_edge("generate", "decide")

workflow.add_conditional_edges(
    "decide",
    route_by_risk_level,
    {
        "auto_apply": END,
        "needs_review": "human_review",
        "skip": END,
    }
)
workflow.add_edge("human_review", END)

# Compile with checkpointing
memory = SqliteSaver.from_conn_string("firewall_ai_state.db")
app = workflow.compile(
    checkpointer=memory,
    interrupt_before=["human_review"]
)
```

### 5.3 Node Details

**Stage 1 — ANALYZE (Traffic Pattern Analysis)**

- Input: Normalized flow logs + historical baselines from DuckDB
- Pre-processing: DuckDB aggregation queries (top talkers, port distributions, byte volume over time, unique src/dst pairs)
- LLM Task: Interpret pre-aggregated statistics — identify clusters, score anomalies, flag unusual patterns
- Tools available: `traffic_query_tool` (runs DuckDB SQL), `ip_geolookup_tool` (GeoIP/ASN)
- Output Pydantic model: `TrafficAnalysis` (clusters, anomaly_scores, top_talkers, unusual_ports, bandwidth_outliers)
- Key design: The LLM does NOT receive raw logs. It receives aggregated stats and interprets patterns. This keeps token costs manageable and context windows usable.

**Stage 2 — ASSESS (Security Posture Assessment)**

- Input: Traffic analysis + current firewall rules (fetched via adapter) + threat intel
- Pre-processing: Adapter fetches current rules → translated to universal schema. Deep Agent spawns sub-agents for threat intel lookups on flagged IPs.
- LLM Task: Score risk per traffic flow, identify gaps between observed traffic and existing rules, flag compliance violations, detect shadow IT
- Tools available: `firewall_query_tool` (fetch rules via adapter), `threat_intel_tool` (IP reputation), `compliance_check_tool` (PCI-DSS rule validation)
- Output: `SecurityAssessment` (risk_scores, rule_gaps, compliance_violations, shadow_it_services)

**Stage 3 — GENERATE (Policy Generation)**

- Input: Security assessment + vendor capability declarations + org security policies (user-provided YAML)
- LLM Task: For each identified gap/risk, generate a vendor-neutral rule specification with business justification, impact analysis, and rollback plan
- Tools available: `rule_validator_tool` (validates proposed rule against vendor capability constraints)
- Output: `list[PolicyProposal]` each containing rule spec, justification text, risk level, confidence score, estimated impact

**Stage 4 — DECIDE (Rule Decision + Approval Gate)**

- Input: Policy proposals + current autonomy phase config + risk thresholds
- LLM Task: Final gate — for each proposal, decide: CREATE new rule, UPDATE existing rule, or SKIP. Assign risk level. Determine approval routing.
- Output: `list[RuleDecision]` each with action, translated vendor-specific rule, approval_required flag
- Gate: In Phase 1 (suggest-only), LangGraph `interrupt_before=["human_review"]` pauses execution. User reviews in CLI, approves/rejects. In Phase 2+, low-risk decisions auto-apply.

### 5.4 LLM Provider Configuration

```yaml
# config.yaml
llm:
  default_provider: "bedrock"
  default_model: "anthropic.claude-sonnet-4-20250514"
  fallback_providers:
    - provider: "openai"
      model: "gpt-4o"
    - provider: "ollama"
      model: "llama3:70b"

  providers:
    bedrock:
      aws_region: "us-east-1"
      # Uses IAM role or AWS credentials from environment
    openai:
      api_key: "${OPENAI_API_KEY}"
    ollama:
      api_base: "http://localhost:11434"

  settings:
    max_tokens: 4096
    temperature: 0.1          # Low temp for deterministic security decisions
    request_timeout: 60
    max_retries: 3
    budget_limit_usd: 50.0    # Monthly budget cap
```

---

## 6. Firewall Adapter System

### 6.1 Abstract Interface

```python
class FirewallAdapter(ABC):
    @abstractmethod
    async def connect(self, config: AdapterConfig) -> None: ...

    @abstractmethod
    async def get_rules(self, filter: RuleFilter | None = None) -> list[UniversalRule]: ...

    @abstractmethod
    async def validate_rule(self, rule: UniversalRule) -> ValidationResult: ...

    @abstractmethod
    async def dry_run(self, rule: UniversalRule) -> DryRunResult: ...

    @abstractmethod
    async def apply_rule(self, rule: UniversalRule) -> ApplyResult: ...

    @abstractmethod
    async def rollback(self, handle: RollbackHandle) -> None: ...

    @abstractmethod
    def capabilities(self) -> AdapterCapabilities: ...
```

### 6.2 Universal Rule Schema

```python
class UniversalRule(BaseModel):
    id: str | None = None
    name: str
    description: str
    action: RuleAction                 # ALLOW | DENY | DROP | REJECT
    direction: Direction               # INBOUND | OUTBOUND
    source: NetworkEndpoint            # IP/CIDR, security group ref, tag
    destination: NetworkEndpoint
    protocol: Protocol                 # TCP | UDP | ICMP | ANY
    port_range: PortRange | None
    application: str | None            # L7 app name (Palo Alto)
    priority: int | None               # For ordered rulesets
    enabled: bool = True
    tags: dict[str, str] = {}
    expires_at: datetime | None = None

    # Compliance metadata
    business_justification: str        # Required for PCI-DSS 4.0
    risk_level: RiskLevel              # LOW | MEDIUM | HIGH | CRITICAL
    ai_confidence: float               # 0.0 - 1.0
    change_ticket_id: str | None
```

### 6.3 Adapter Capability Declarations

| Capability | AWS SG | Palo Alto Cloud NGFW |
|---|---|---|
| Deny rules | No (allow-only; deny → NACL) | Yes |
| Two-phase commit | No (immediate) | Yes (candidate → commit) |
| Dry-run | Yes (`--dry-run` flag) | No |
| Rollback | Manual (store + revoke) | Revert candidate config |
| Rule hit counts | No | Yes (Policy Optimizer) |
| L7 app filtering | No | Yes (App-ID) |
| Max rules | 60 per SG (adjustable) | No hard limit |
| Auth model | IAM (boto3) | API key via Cloud Manager |

### 6.4 Adapter Translation Examples

**AWS SG — UniversalRule to IpPermission:**
```python
# UniversalRule(action=ALLOW, direction=INBOUND, protocol=TCP,
#               source="10.0.0.0/8", port_range=443-443)
# → boto3 call:
ec2.authorize_security_group_ingress(
    GroupId="sg-abc123",
    IpPermissions=[{
        "IpProtocol": "tcp",
        "FromPort": 443, "ToPort": 443,
        "IpRanges": [{"CidrIp": "10.0.0.0/8",
                       "Description": "AI-generated: allow internal HTTPS"}]
    }]
)
```

**Palo Alto Cloud NGFW — UniversalRule to PAN-OS JSON:**
```python
# UniversalRule(action=ALLOW, direction=INBOUND, protocol=TCP,
#               source="10.0.0.0/8", port_range=443-443,
#               application="ssl")
# → REST API payload:
{
    "entry": {
        "@name": "ai-rule-001",
        "from": {"member": ["any"]},
        "to": {"member": ["any"]},
        "source": {"member": ["10.0.0.0/8"]},
        "destination": {"member": ["any"]},
        "application": {"member": ["ssl"]},
        "service": {"member": ["application-default"]},
        "action": "allow",
        "description": "AI-generated: allow internal HTTPS"
    }
}
```

---

## 7. Safety & Graduated Autonomy

### 7.1 Four-Phase Trust Model

| Phase | Mode | What AI Can Do | When to Advance |
|---|---|---|---|
| Phase 1 | Suggest Only | Propose changes with justification; humans review and apply manually | Default for all deployments. Free CLI tier stays here permanently. |
| Phase 2 | Auto-apply Low Risk | Block threat intel IPs, add allow for known internal services on standard ports | After 100+ accurate suggestions with <5% false positive rate |
| Phase 3 | Auto-apply Medium Risk | Tighten existing rules, temporary blocks during incidents | After 30 days in Phase 2 with zero incidents |
| Phase 4 | Human-on-the-Loop | Autonomous within policy constraints; humans monitor dashboards | Mature deployments only; requires CAB approval |

### 7.2 Safety Mechanisms

- **Global Kill Switch**: Instantly reverts all AI operations to suggest-only mode. Single CLI command or API call.
- **Circuit Breaker**: Auto-disables auto-apply if >N changes fail or trigger alerts within a time window. Configurable thresholds.
- **Emergency Revert**: One-click rollback of all AI-applied changes within the last N hours using the event-sourced audit log.

### 7.3 Audit Event Schema

```python
class AuditEvent(BaseModel):
    event_id: str                         # UUID
    timestamp: datetime
    event_type: EventType                 # PROPOSED | APPROVED | APPLIED | REJECTED | ROLLED_BACK
    actor: ActorInfo                      # AI agent or human user
    target_firewall: str
    adapter_name: str
    rule_before: UniversalRule | None     # Previous state (None for new rules)
    rule_after: UniversalRule | None      # New state (None for deletions)
    business_justification: str
    risk_level: RiskLevel
    ai_confidence: float
    ai_reasoning: str                     # LLM explanation for the change
    approval_chain: list[ApprovalRecord]
    pipeline_run_id: str
    llm_model_used: str
    llm_tokens_used: int
    llm_cost_usd: float
```

---

## 8. CLI Interface Design

```bash
$ firewall-ai --help

Usage: firewall-ai [OPTIONS] COMMAND [ARGS]

Commands:
  analyze     Analyze traffic logs and suggest rule changes
  rules       List/inspect current firewall rules
  apply       Apply a suggested rule change (with confirmation)
  audit       View audit log and compliance reports
  config      Manage configuration (providers, adapters, settings)
  adapters    List available firewall adapters and status
  replay      Replay a pipeline run from a checkpoint (LangGraph time-travel)
  version     Show version and system info

# ── Example: Analyze AWS VPC Flow Logs against an AWS Security Group ──
$ firewall-ai analyze \
    --source aws-vpc \
    --source-config s3_bucket=my-vpc-logs,region=us-east-1 \
    --firewall aws-sg \
    --firewall-config security_group_id=sg-abc123,region=us-east-1 \
    --output rich

# ── Example: Analyze Palo Alto Cloud NGFW logs ──
$ firewall-ai analyze \
    --source paloalto-cloudngfw \
    --source-config tenant=my-tenant \
    --firewall paloalto-cloudngfw \
    --output json --output-file results.json

# ── Example: Apply a previously suggested rule ──
$ firewall-ai apply --decision-id dec-abc123 --confirm

# ── Example: View audit trail ──
$ firewall-ai audit --last 24h --format table

# ── Example: Replay pipeline from stage 2 checkpoint ──
$ firewall-ai replay --run-id run-xyz789 --from-stage assess
```

---

## 9. Configuration System

```yaml
# ~/.firewall-ai/config.yaml

# ── LLM Configuration ──
llm:
  default_provider: bedrock
  default_model: anthropic.claude-sonnet-4-20250514
  fallback:
    - provider: openai
      model: gpt-4o
    - provider: ollama
      model: llama3:70b
  settings:
    temperature: 0.1
    max_tokens: 4096
    budget_limit_usd: 50.0
    cache_enabled: true

# ── Firewall Adapters ──
adapters:
  aws-sg-prod:
    type: aws-sg
    security_group_id: sg-abc123
    region: us-east-1
  palo-prod:
    type: paloalto-cloudngfw
    tenant: my-tenant
    api_key_env: PALO_API_KEY     # Reference env var, never store plaintext

# ── Log Sources ──
sources:
  vpc-prod:
    type: aws-vpc
    s3_bucket: my-vpc-flow-logs
    region: us-east-1
    prefix: "AWSLogs/"
  palo-logs:
    type: paloalto-cloudngfw
    tenant: my-tenant

# ── Storage ──
storage:
  log_retention_days: 90
  audit_retention_days: 365
  parquet_dir: ~/.firewall-ai/data/
  state_db: ~/.firewall-ai/state.db

# ── Safety ──
safety:
  autonomy_phase: 1              # 1=suggest-only
  circuit_breaker_threshold: 5   # Max failed changes before disable
  circuit_breaker_window_min: 60
```

---

## 10. Open-Core Model

### 10.1 Free CLI vs Premium Cloud

| Capability | Free CLI | Premium Cloud |
|---|---|---|
| Single firewall analysis | ✅ | ✅ |
| Local LLM support (Ollama) | ✅ | ✅ |
| Rule suggestions (suggest-only mode) | ✅ | ✅ |
| JSON/SARIF output, CI/CD integration | ✅ | ✅ |
| Community firewall adapter plugins | ✅ | ✅ |
| Multi-firewall orchestration | — | ✅ |
| Web dashboard + flow visualization | — | ✅ |
| Auto-apply with graduated autonomy | — | ✅ |
| Team collaboration + RBAC | — | ✅ |
| Compliance reports (PCI-DSS, SOC 2) | — | ✅ |
| SSO/SAML, audit log exports | — | ✅ |

### 10.2 Licensing

BSL 1.1 (Business Source License) with 3-year conversion to Apache 2.0. Source code fully available for inspection, modification, and self-hosting. Cloud providers cannot resell as competing SaaS.

### 10.3 Pricing

| Tier | Price | Includes |
|---|---|---|
| Free | $0 | CLI + single firewall + Ollama |
| Team | $49–99/month | Multi-FW, web dashboard, auto-apply |
| Enterprise | Custom | On-prem, SLA, SSO, compliance, dedicated success |
