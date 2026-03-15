# Complete Project Architecture — v3 Final
## AI-Native Network & Security Orchestration Platform

---

## Executive Summary

An AI-native SaaS platform for network and security orchestration targeting SMBs and MSPs. Single pure-Python stack, deploys anywhere via Docker Compose. Open-core model with license-key-gated paid features.

**Five workstreams:**
1. **NetClaw Fork** — 82 skills + 46 MCP servers (Apache-2.0) → LangGraph
2. **New MCP Servers** — Prisma Access, Cloudflare ZT, OPNsense, Palo Alto, Juniper Mist
3. **Zabbix MCP** — Existing 40+ tool MCP server for enterprise monitoring integration
4. **Built-in Incident Management** — Multi-tenant triage, AI investigation, SLA tracking
5. **Commercial Platform** — Orchestration Tool (SMB) + NaaS Portal (MSP), per-site pricing

---

## 1. Three-Layer Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 1: CUSTOMER & MSP PORTALS                                     │
│  TanStack Start (React SSR) · Hosted on Render                       │
│                                                                       │
│  ┌─────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  CUSTOMER PORTAL            │  │  MSP OPERATIONS PORTAL         │ │
│  │  (White-labeled per MSP)    │  │                                │ │
│  │                             │  │  Multi-tenant dashboard        │ │
│  │  My sites & health status   │  │  Fleet-wide operations         │ │
│  │  Open incidents + comments  │  │  Incident triage queue         │ │
│  │  Reports & compliance       │  │  n8n workflow builder          │ │
│  │  Approve change requests    │  │  Agent chat (full access)      │ │
│  │  Limited agent chat         │  │  Customer management           │ │
│  │  Settings & notifications   │  │  White-label configuration     │ │
│  │                             │  │  SLA tracking & reporting      │ │
│  └─────────────────────────────┘  └────────────────────────────────┘ │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTPS
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 2: BACKEND ORCHESTRATION (Single FastAPI)                     │
│  Python 3.12+ · Docker · Render / VPS / On-Prem                     │
│                                                                       │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────┐ │
│  │  Auth   │ │  API     │ │  Alert    │ │ Incident │ │ Scheduler │ │
│  │  RBAC   │ │  Routes  │ │  Pipeline │ │ Manager  │ │ APScheduler│ │
│  │  Tenant │ │  CRUD    │ │  Ingest   │ │ Lifecycle│ │ Health    │ │
│  │  License│ │  Stream  │ │  Dedup    │ │ AI Triage│ │ Backup    │ │
│  │  Meter  │ │  Webhook │ │  Correlate│ │ SLA Track│ │ Compliance│ │
│  └─────────┘ └──────────┘ └───────────┘ └──────────┘ └───────────┘ │
│                                                                       │
│  ┌────────────────┐  ┌──────────────────┐  ┌────────────────────┐   │
│  │  Notification   │  │  Report Engine    │  │  n8n Integration   │   │
│  │  Slack, Teams,  │  │  PDF generation,  │  │  Custom nodes,     │   │
│  │  Email, webhook │  │  white-label,     │  │  workflow templates │   │
│  │  to PagerDuty,  │  │  scheduling       │  │  webhook callbacks │   │
│  │  OpsGenie, etc  │  │                   │  │                    │   │
│  └────────────────┘  └──────────────────┘  └────────────────────┘   │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 3: AGENTIC WORKFLOW (LangGraph + MCP)                         │
│                                                                       │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────┐               │
│  │ PLANNER  │ →  │ EXECUTOR │ →  │ REVIEWER/AUDITOR │               │
│  │ Skills + │    │ MCP tool │    │ Safety tier +    │               │
│  │ strategy │    │ calls    │    │ audit log        │               │
│  └──────────┘    └──────────┘    └──────────────────┘               │
│                                                                       │
│  Skills: 120+ · MCP Servers: 52 · Safety Tiers: T1/T2/T3           │
│  Checkpointing → PostgreSQL · LLM → Claude (ChatAnthropic)          │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ stdio / HTTP
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│  MCP SERVERS (52 total)                                               │
│                                                                       │
│  NetClaw Fork (46)        New (5)              Observability (1)     │
│  pyATS, Meraki, NetBox,   Prisma Access,       Zabbix MCP (40+      │
│  ACI, ISE, F5, Juniper,   Cloudflare ZT,       tools, FastMCP,      │
│  AWS×6, GCP×4, Grafana,   OPNsense,            read-only mode)      │
│  Prometheus, SD-WAN,      Palo Alto,                                 │
│  NSO, FMC, ThousandEyes,  Juniper Mist                              │
│  +30 more                                                            │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│  MANAGED INFRASTRUCTURE + MONITORING                                  │
│                                                                       │
│  Devices          Cloud           SaaS             Monitoring        │
│  Cisco IOS-XE    AWS VPC         Meraki           Zabbix Server      │
│  Juniper         GCP             Prisma Access    Grafana + Prom     │
│  Arista          Azure           Cloudflare ZT    ThousandEyes       │
│  Palo Alto                       ServiceNow                          │
│  F5, OPNsense                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Observability Stack

### 2.1 Zabbix as Core Monitoring

Zabbix is the primary monitoring engine for the platform. It's the #1 monitoring tool MSPs already use, it's fully open-source, self-hostable, and handles SNMP, agent-based, and agentless monitoring across network devices, servers, and cloud.

**Existing Zabbix MCP server** (`mpeirone/zabbix-mcp-server`): 40+ tools, FastMCP Python, Docker-ready, read-only mode supported. MIT license.

**Zabbix MCP tools include:**
- Host management (list, create, update, get details)
- Item queries (get metrics, latest data, history)
- Trigger status (active problems, trigger details)
- Template management (list, assign, inspect)
- Problem management (get current problems, acknowledge, close)
- Maintenance windows (create, manage)
- Discovery (network discovery rules and results)
- Event queries (event history, correlation)

**Integration pattern:**

```
┌──────────────────────────────────────────────────────────────┐
│  ZABBIX SERVER (self-hosted Docker or customer's existing)    │
│                                                               │
│  Monitors:                    Alerts via:                     │
│  • SNMP polling (devices)     • Webhooks → our alert pipeline │
│  • Agent-based (servers)      • Zabbix MCP → AI agent queries │
│  • ICMP checks (reachability) • Email/Slack (direct)          │
│  • HTTP checks (services)                                     │
│  • JMX, IPMI, VMware                                         │
│  • Custom scripts                                             │
│                                                               │
│  Stores: time-series metrics, trends, SLA data                │
└───────────────────────┬──────────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
┌───────────────────┐   ┌──────────────────────────┐
│  Alert Webhook    │   │  Zabbix MCP Server       │
│  → Our FastAPI    │   │  (40+ tools)             │
│  /webhooks/zabbix │   │                          │
│                   │   │  Agent queries Zabbix    │
│  Real-time alert  │   │  for investigation:      │
│  ingestion        │   │  "What's the CPU trend   │
│                   │   │   for this host over     │
│                   │   │   the last 4 hours?"     │
└───────────────────┘   └──────────────────────────┘
```

### 2.2 Full Observability Stack

| Tool | Role | Integration | Deployment |
|---|---|---|---|
| **Zabbix** | Core network/infrastructure monitoring — SNMP, agents, ICMP, HTTP. Trigger-based alerting. SLA tracking. | Zabbix MCP (40+ tools) + webhook alerts → our pipeline | Docker (self-hosted) or connect to customer's existing Zabbix |
| **Grafana** | Dashboard visualization, PromQL queries, Loki log queries, alerting rules | Grafana MCP (75+ tools, from NetClaw) | Optional — for customers who want rich dashboards |
| **Prometheus** | Metric collection and PromQL queries (device SNMP exporters, application metrics) | Prometheus MCP (6 tools, from NetClaw) | Optional — pairs with Grafana |
| **ThousandEyes** | Internet/WAN path analysis, BGP monitoring, outage detection | ThousandEyes MCP ×2 (from NetClaw) | SaaS (Cisco-hosted) |
| **Kubeshark** | Kubernetes L4/L7 traffic analysis | Kubeshark MCP (6 tools, from NetClaw) | For K8s customers |

### 2.3 Monitoring Features by Tier

| Feature | Tier | Source |
|---|---|---|
| Basic health polling (pyATS CLI checks) | Community | Built-in scheduler + pyATS MCP |
| Zabbix integration (connect existing Zabbix) | Essential | Zabbix MCP + webhook ingestion |
| Health score trends + dashboard | Essential | PostgreSQL time-series + UI charts |
| Alert ingestion from Zabbix/Grafana/cloud | Professional | Alert pipeline + webhook receivers |
| AI auto-investigation on alerts | Professional | LangGraph agent + Zabbix MCP queries |
| Grafana/Prometheus deep integration | Enterprise | Grafana MCP (75+) + Prometheus MCP |
| ThousandEyes path analysis | Enterprise | ThousandEyes MCP |
| Cross-tenant alert correlation | MSP Enterprise | Alert pipeline + fleet queries |

---

## 3. Built-in Incident Management

### 3.1 Why Built-in (Not External Tool)

We evaluated Grafana OnCall (entering maintenance, archived 2026), Keep, GoAlert, Incidental, and DFIR-IRIS. The conclusion: build it in because our incident management needs to be multi-tenant (most OSS tools aren't), needs AI auto-investigation (unique to our platform), needs customer portal visibility, and needs SLA tracking per tenant. We integrate *with* external paging tools (PagerDuty, Slack, etc.) but own the lifecycle.

### 3.2 Alert Pipeline

```
ALERT SOURCES
├─ Zabbix webhooks          POST /webhooks/alerts/zabbix
├─ Grafana webhooks          POST /webhooks/alerts/grafana
├─ Meraki alerts             POST /webhooks/alerts/meraki
├─ Prisma Access events      POST /webhooks/alerts/prisma
├─ CloudWatch (via SNS)      POST /webhooks/alerts/cloudwatch
├─ pyATS health checks       Internal (scheduler)
├─ Drift detection           Internal (scheduler)
└─ Generic                   POST /webhooks/alerts/generic
         │
         ▼
NORMALIZATION → all alerts become:
{
  tenant_id, site_id, device_id,
  source, severity (critical/high/warning/info),
  title, description, raw_payload,
  dedup_key, timestamp
}
         │
         ▼
PROCESSING PIPELINE
├─ 1. Dedup (same dedup_key within 15min → suppress)
├─ 2. Correlate (group by site + 5min window)
├─ 3. Severity upgrade (3+ related alerts → bump severity)
├─ 4. Tenant routing (site → tenant → MSP)
├─ 5. Tier check (does tenant plan include alerting?)
│
├─ IF severity >= HIGH and tier >= Professional:
│    → Create incident
│    → Trigger AI investigation (LangGraph)
│    → Notify via configured channels
│
└─ ELSE:
     → Log alert
     → Include in next scheduled report
```

### 3.3 Incident Lifecycle

```
OPEN → INVESTIGATING → IDENTIFIED → FIX_IN_PROGRESS → RESOLVED → POST_MORTEM

Each transition:
  • Logged to incident timeline
  • Customer portal updated (customer sees status changes)
  • Stakeholders notified via their preferred channel
  • SLA timer tracked

AI Auto-Investigation (on incident creation):
  1. Agent receives alert context
  2. Queries Zabbix MCP: host details, recent problems, metric trends
  3. Queries pyATS MCP: show commands on affected device
  4. Queries relevant platform MCP: Meraki uplink, Prisma tunnel status
  5. Produces: diagnosis, affected services, recommended actions
  6. Stored in incident.investigation field

AI Post-Mortem (on resolution):
  • Agent drafts RCA with timeline, root cause, impact, remediation
  • MSP engineer reviews + approves before publishing to customer
```

### 3.4 Incident Data Model

```sql
CREATE TABLE alerts (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    site_id UUID REFERENCES sites(id),
    device_id UUID REFERENCES devices(id),
    source VARCHAR(50),        -- zabbix, grafana, meraki, prisma, pyats, cloudwatch
    severity VARCHAR(20),      -- critical, high, warning, info
    title TEXT,
    description TEXT,
    raw_payload JSONB,
    dedup_key VARCHAR(255),
    status VARCHAR(20),        -- new, processed, suppressed, incident_created
    created_at TIMESTAMPTZ
);

CREATE TABLE incidents (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    site_id UUID REFERENCES sites(id),
    severity VARCHAR(20),
    status VARCHAR(30),        -- open, investigating, identified, fix_in_progress,
                               -- resolved, post_mortem_complete
    title TEXT,
    description TEXT,
    alert_ids UUID[],
    investigation JSONB,       -- AI agent's diagnostic results
    assigned_to UUID,
    sla_target TIMESTAMPTZ,
    sla_breached BOOLEAN DEFAULT FALSE,
    rca_summary TEXT,
    post_mortem JSONB,
    created_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ
);

CREATE TABLE incident_events (
    id UUID PRIMARY KEY,
    incident_id UUID REFERENCES incidents(id),
    event_type VARCHAR(50),    -- status_change, comment, assignment, escalation,
                               -- notification, agent_action, customer_comment
    actor VARCHAR(100),        -- user email, "agent", "system", "customer:jane@beta.com"
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ
);

CREATE TABLE health_snapshots (
    id UUID PRIMARY KEY,
    site_id UUID REFERENCES sites(id),
    overall_score INTEGER,
    details JSONB,
    created_at TIMESTAMPTZ
);
```

---

## 4. n8n + LangGraph Integration

### 4.1 Division of Responsibility

| n8n (Business Process) | LangGraph (AI Reasoning) |
|---|---|
| "Every Monday 6am, run compliance on all tenants" | Decides which commands to run per device |
| "When CRITICAL alert → create ticket + page on-call" | Investigates alert, produces diagnosis |
| "Onboard new customer → provision → discover → report" | Runs discovery, interprets findings |
| "Monthly → generate reports → email customers" | Generates report content + scoring |
| "If drift detected → open CR → assign → SLA timer" | Detects drift, classifies severity |

n8n **calls** our FastAPI agent endpoints. LangGraph **triggers** n8n via webhook when it needs business process execution.

### 4.2 Custom n8n Node Package

```
@netsec/n8n-nodes
├── NetSec Agent Chat          → POST /api/agent/chat
├── NetSec Health Check        → POST /api/agent/health-check
├── NetSec Compliance Scan     → POST /api/agent/compliance-scan
├── NetSec Config Backup       → POST /api/agent/config-backup
├── NetSec Troubleshoot        → POST /api/agent/troubleshoot
├── NetSec Config Deploy       → POST /api/agent/config-deploy
├── NetSec Fleet Operation     → POST /api/agent/fleet-operation
├── NetSec Get Sites           → GET  /api/sites
├── NetSec Get Health          → GET  /api/sites/{id}/health
├── NetSec Get Incidents       → GET  /api/incidents
├── NetSec Create Incident     → POST /api/incidents
└── NetSec Zabbix Query        → POST /api/agent/zabbix-query
```

### 4.3 Pre-Built Workflow Templates (Proprietary, MSP tier)

| Template | Trigger | Flow |
|---|---|---|
| Daily Health Sweep | Cron 6am | Each site → health check → IF critical → incident + page + Slack |
| Weekly Compliance | Cron Sunday | Each tenant → compliance scan → PDF report → email customer |
| Monthly Billing | Cron 1st | Each tenant → usage data → invoice prep → email MSP finance |
| Customer Onboarding | Webhook | Create tenant → add devices → Zabbix host setup → discovery → welcome email |
| Alert Escalation | Webhook | Create incident → page on-call → IF no ack 15min → escalate |
| Config Drift Response | Webhook | Get drift details → create change request → assign → SLA timer |
| Change Window Executor | Cron | Deploy queued configs → verify → IF fail → rollback → notify |
| Zabbix Alert Handler | Zabbix webhook | Normalize → dedup → route → IF critical → AI investigate |

---

## 5. NaaS Portal — Three Layers Detailed

### 5.1 Customer Portal (Layer 1)

White-labeled under MSP branding. Customer sees only their data.

**Routes (customer JWT, tenant-scoped):**
```
GET  /customer/sites                    → my sites
GET  /customer/sites/{id}/health        → my site health + trends
GET  /customer/incidents                → my open incidents
POST /customer/incidents/{id}/comment   → add comment
GET  /customer/reports                  → my reports
GET  /customer/reports/{id}/download    → download branded PDF
GET  /customer/changes                  → pending change requests
POST /customer/changes/{id}/approve     → approve a change
POST /customer/agent/chat               → limited agent (read-only, my sites)
```

### 5.2 MSP Operations Portal (Layer 2)

Full access across all tenants, role-scoped.

**Routes (MSP staff JWT, RBAC):**
```
GET  /msp/tenants                       → all customers
POST /msp/tenants                       → onboard new customer
GET  /msp/overview                      → cross-tenant health
POST /msp/fleet/health-check            → fleet-wide health
POST /msp/fleet/compliance              → fleet-wide compliance
GET  /msp/incidents                     → all incidents (triage queue)
POST /msp/incidents/{id}/assign         → assign to engineer
POST /msp/incidents/{id}/escalate       → escalate
POST /msp/reports/generate              → white-label report
POST /msp/agent/chat                    → full agent, any tenant
GET  /msp/sla/dashboard                 → SLA compliance overview
```

### 5.3 Agentic Workflow Layer (Layer 3)

Called by Layer 1, Layer 2, n8n, and scheduler. Every call scoped to one tenant.

**Routes (internal/API key):**
```
POST /agent/chat                        → stream agent response (SSE)
POST /agent/health-check                → targeted health check
POST /agent/compliance-scan             → compliance scan
POST /agent/troubleshoot                → AI troubleshooting
POST /agent/config-backup               → config backup
POST /agent/config-deploy               → config deployment (T2)
POST /agent/fleet-operation             → fleet parallel (Enterprise)
POST /agent/incident-investigate        → AI investigation on alert
POST /agent/zabbix-query                → query Zabbix via MCP
POST /agent/topology-discover           → topology discovery
POST /agent/drift-check                 → drift detection
```

---

## 6. MCP Server Portfolio (52 Total)

### From NetClaw Fork (46, Apache-2.0)

| Category | Servers |
|---|---|
| Device Automation | pyATS, Juniper JunOS, F5 BIG-IP, Catalyst Center, Arista CVP |
| Infrastructure | ACI, ISE, NetBox, Nautobot, Infrahub, ServiceNow, Itential |
| Security | Cisco FMC, NVD CVE |
| Cloud Managed | Meraki (804 endpoints), ThousandEyes ×2, RADKit, SD-WAN |
| Cloud Providers | AWS ×6, GCP ×4 |
| Observability | Grafana (75+ tools), Prometheus (6), Kubeshark (6) |
| Lab & Simulation | CML, ContainerLab, Protocol MCP |
| Utilities | Subnet Calc, Draw.io, UML/Kroki, GitHub, MS Graph, Packet Buddy, Wikipedia, Markmap, RFC, GAIT |

### New (5, we build)

| Server | SDK | Priority | Weeks |
|---|---|---|---|
| Prisma Access / SCM | pan-scm-sdk (Python) | P0 | 3-4w |
| Cloudflare Zero Trust | CF API (TypeScript) | P0 | 2-3w |
| OPNsense | REST API (TypeScript) | P0 | 2-3w |
| Palo Alto VM-Series | PAN-OS XML API (Python) | P1 | 4-5w |
| Juniper Mist | mistapi (Python) | P1 | 2-3w |

### Observability (1, existing open-source)

| Server | Source | Tools | Transport |
|---|---|---|---|
| **Zabbix MCP** | mpeirone/zabbix-mcp-server | 40+ (hosts, items, triggers, problems, templates, discovery, maintenance, events) | stdio/HTTP, FastMCP Python, Docker, MIT license |

---

## 7. Technology Stack (Final)

| Layer | Technology | Why |
|---|---|---|
| Frontend | TanStack Start (React SSR) | Best React SSR, works anywhere |
| Frontend Hosting | Render static site | Free tier, git-deploy |
| Backend | FastAPI (single app) | One process, one language, full control |
| Backend Hosting | Render Docker / VPS / On-Prem Docker | Portable |
| Agent | LangGraph (latest) | Stateful graphs, checkpointing, human-in-the-loop |
| LLM | ChatAnthropic (Claude) | Primary; swap GPT/Ollama via config |
| MCP Bridge | langchain-mcp-adapters | MCP tools → LangChain tools |
| Database | PostgreSQL 16 + pgvector | Universal, self-hostable, vector search |
| DB Hosting | Neon (cloud free) / Docker (on-prem) | No vendor lock-in |
| Object Storage | Backblaze B2 / MinIO | S3-compatible, cheapest, self-hostable |
| Monitoring | Zabbix (self-hosted Docker) | Industry standard for MSPs, SNMP, agents, triggers |
| Scheduling | APScheduler | In-process, Postgres-backed jobs |
| Incident Mgmt | Built-in (FastAPI + Postgres) | Multi-tenant, AI-integrated, customer-visible |
| Workflow Orchestration | n8n (Docker, optional) | Visual builder for MSP business processes |
| Notification | Slack, Teams, email, webhooks to PagerDuty/etc | n8n or built-in notification service |
| Auth | python-jose (JWT) + passlib | Standard |
| Rate Limiting | slowapi | In-memory, Redis if scaled |
| Billing | Stripe | Per-site metering |
| DNS/CDN | Cloudflare (infra only) | DNS + CDN + DDoS |
| Monitoring | Sentry (errors) + app-level Prometheus | Free tiers |

---

## 8. Docker Compose — Full Platform

```yaml
version: "3.9"
services:
  app:
    build: ./apps/api
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://netsec:netsec@db:5432/netsec
      - S3_ENDPOINT=http://storage:9000
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - LICENSE_KEY=${LICENSE_KEY:-}
      - ZABBIX_URL=http://zabbix-web:8080
      - ZABBIX_API_TOKEN=${ZABBIX_API_TOKEN:-}
    depends_on: [db, storage]

  frontend:
    build: ./apps/web
    ports: ["3000:3000"]

  db:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: netsec
      POSTGRES_USER: netsec
      POSTGRES_PASSWORD: netsec
    volumes: [pgdata:/var/lib/postgresql/data]

  storage:
    image: minio/minio
    command: server /data --console-address ":9001"
    volumes: [s3data:/data]

  # ── Zabbix Stack (monitoring profile) ──
  zabbix-server:
    image: zabbix/zabbix-server-pgsql:7.0-latest
    environment:
      - DB_SERVER_HOST=zabbix-db
      - POSTGRES_DB=zabbix
      - POSTGRES_USER=zabbix
      - POSTGRES_PASSWORD=zabbix
    depends_on: [zabbix-db]
    profiles: [monitoring]

  zabbix-web:
    image: zabbix/zabbix-web-nginx-pgsql:7.0-latest
    ports: ["8080:8080"]
    environment:
      - ZBX_SERVER_HOST=zabbix-server
      - DB_SERVER_HOST=zabbix-db
      - POSTGRES_DB=zabbix
    depends_on: [zabbix-server]
    profiles: [monitoring]

  zabbix-db:
    image: postgres:16
    environment:
      POSTGRES_DB: zabbix
      POSTGRES_USER: zabbix
      POSTGRES_PASSWORD: zabbix
    volumes: [zabbixdata:/var/lib/postgresql/data]
    profiles: [monitoring]

  # ── n8n (MSP workflow profile) ──
  n8n:
    image: n8nio/n8n
    ports: ["5678:5678"]
    volumes: [n8ndata:/home/node/.n8n]
    profiles: [msp]

volumes:
  pgdata:
  s3data:
  zabbixdata:
  n8ndata:
```

**Usage:**
```bash
docker compose up -d                              # Core platform
docker compose --profile monitoring up -d          # + Zabbix stack
docker compose --profile msp up -d                 # + n8n
docker compose --profile monitoring --profile msp up -d  # Everything
```

---

## 9. Products & Pricing

### Orchestration Tool (SMB) — Per-Site

| Tier | Price | Sites | Key Features |
|---|---|---|---|
| **Community** | Free | 3 | Config backup, health dashboard, device inventory, subnet calc |
| **Essential** | $49/mo | 10 | + Compliance, drift detection, topology, Zabbix integration, alerts |
| **Professional** | $149/mo | 50 | + AI troubleshoot, config deploy, Meraki/Prisma/CF ZT, incident mgmt, CVE scanning, audit trail |
| **Enterprise** | $599/mo | 250 | + Fleet ops, ACI/ISE/SD-WAN, Grafana/Prometheus deep integration, n8n workflows, API, RBAC, on-prem deploy |

### NaaS Portal (MSP) — Per-Tenant

| Tier | Base | Per Tenant | Key Features |
|---|---|---|---|
| **Starter** | $199/mo | +$15/tenant | Multi-tenant dashboard, white-label, customer onboarding, Zabbix per-tenant |
| **Professional** | $499/mo | +$25/tenant | + Compliance-as-a-Service, Config-as-a-Service, cross-tenant analytics, n8n templates, SLA tracking |
| **Enterprise** | $799/mo | +$40/tenant | + Per-tenant AI agent, custom skill packs, SOC integration, AI post-mortems, full API |

---

## 10. Execution Roadmap

| Phase | Weeks | What Ships | Revenue |
|---|---|---|---|
| **1. Foundation** | 1-3 | Fork NetClaw → LangGraph. 4 skills. Docker Compose. Basic UI. **Community edition.** | $0 |
| **2. Essential** | 4-6 | Compliance, drift, topology, Zabbix MCP integration, alerts. Stripe. **Tier 1.** | $245-490/mo |
| **3. Professional** | 7-11 | AI troubleshoot, config deploy, Meraki, incident mgmt, alert pipeline. Build Prisma/CF ZT/OPNsense MCPs. **Tier 2.** | $1.5-2.5K/mo |
| **4. Enterprise + MSP** | 12-16 | Fleet ops, ACI/ISE/SD-WAN, n8n, MSP portal, Palo Alto/Mist MCPs, SLA tracking. **Tier 3 + MSP.** | $5.5-9K/mo |
| **5. Scale** | 17-22 | MSP tiers, custom skills, SSO, on-prem packaging, open-source launch. **Full suite.** | $15-25K/mo |

---

## 11. Licensing Model (GitLab-Style Split)

Two directories in one repo, each with its own LICENSE file. Not "same codebase with license key check" — a clean legal separation.

### Repository Structure

```
netsec-platform/
├── community/                  ← Apache-2.0 (genuine open-source)
│   ├── LICENSE                 Apache-2.0
│   ├── api/                    Single-tenant FastAPI backend
│   │   ├── auth/               Basic JWT auth (single user)
│   │   ├── routes/             Sites, devices, agent, health, compliance
│   │   ├── agent/              LangGraph (Planner/Executor/Reviewer)
│   │   ├── models/             SQLAlchemy ORM (single-tenant)
│   │   ├── scheduler/          APScheduler (health, backup, compliance)
│   │   └── services/           Health, compliance, backup, topology
│   ├── web/                    Basic TanStack Start dashboard
│   │   └── routes/             Dashboard, agent chat, topology, config diff
│   └── docker-compose.yml      Working 3-site deployment
│
├── enterprise/                 ← Proprietary (source-available, not OSS)
│   ├── LICENSE                 Commercial license required for production use
│   ├── tenancy/                Multi-tenant data isolation
│   ├── msp/                    MSP operations portal routes + UI pages
│   ├── customer/               Customer self-service portal routes + UI pages
│   ├── incidents/              Alert pipeline + incident lifecycle + AI auto-investigation
│   ├── fleet/                  Fleet parallel operations
│   ├── whitelabel/             Branding engine (logo, colors, domain)
│   ├── billing/                Stripe per-site metering
│   ├── reports/                White-label PDF generation
│   ├── rbac/                   Role-based access control + SSO
│   ├── connector/              Site connector agent (Phase 3+)
│   ├── n8n-nodes/              Custom n8n node package (@netsec/n8n-nodes)
│   └── workflows/              Pre-built n8n workflow templates
│
├── skills/                     ← Apache-2.0 (always open, ecosystem growth)
│   ├── LICENSE                 Apache-2.0
│   └── (120+ SKILL.md files organized by domain)
│
├── servers/                    ← Apache-2.0 (always open, ecosystem growth)
│   ├── LICENSE                 Apache-2.0
│   └── (5 new MCP servers: Prisma, CF ZT, OPNsense, PAN-OS, Mist)
│
└── docker-compose.yml          Full platform (imports community/ + enterprise/)
```

Enterprise imports from community, never the reverse. Community runs standalone.

### Community Edition (Free Forever)

A genuinely useful single-tenant network automation tool:

- Full LangGraph agent with all 52 MCP servers and all 120+ skills
- Up to 3 sites with unlimited devices per site
- Config backup (daily scheduled + on-demand)
- Health dashboard with scores and trends
- Compliance scanning (CIS-style, with scoring)
- Topology discovery + Draw.io diagrams
- AI agent chat ("Why is interface GigE0/1 down?")
- Subnet calculator
- Basic alerts (email)
- Docker Compose self-hosted deployment
- Any LLM (Claude, GPT, Ollama)

### Paid Features (License Key Required)

| Feature | Tier |
|---|---|
| More than 3 sites | Essential+ |
| Config drift detection | Essential+ |
| Zabbix deep integration | Essential+ |
| Slack/Teams alerts | Essential+ |
| AI troubleshooting | Professional+ |
| Config deployment (write ops) | Professional+ |
| Incident management + alert pipeline | Professional+ |
| CVE scanning | Professional+ |
| Audit trail | Professional+ |
| Multi-tenant / MSP portal | MSP tiers |
| Customer-facing portal | MSP tiers |
| Fleet parallel operations | Enterprise |
| RBAC / SSO | Enterprise |
| n8n workflow integration | Enterprise |
| White-label reports | MSP tiers |
| API access | Enterprise |
| Site connector (SaaS → on-prem) | Professional+ |
| SLA tracking + AI post-mortems | MSP Professional+ |
| Billing / metering | MSP tiers |

### License Key Enforcement

Signed JWT token validated locally — no phone-home. Contains: tenant_id, tier, max_sites, expiry, signature. Validated using embedded public key. Same pattern as GitLab CE/EE, n8n, Metabase.

```
LICENSE_KEY=          # empty = community edition (3 sites)
LICENSE_KEY=ey...     # signed JWT = paid tier activated
```

---

## 12. Agentic AI Stack

| Layer | Technology | Role |
|---|---|---|
| **Agent Orchestration** | LangGraph | Stateful graphs (Planner → Executor → Reviewer). Checkpointing to PostgreSQL. Human-in-the-loop for Tier 2 writes. |
| **LLM Framework** | LangChain | LLM abstraction. ChatAnthropic (Claude primary), swap GPT/Ollama via config. Prompt templates, output parsers, tool binding. |
| **MCP Bridge** | langchain-mcp-adapters | Wraps MCP tools as LangChain BaseTool. stdio + HTTP transport to all 52 servers. |
| **Multi-Model Gateway** | LiteLLM (Phase 2-3) | Unified API for model switching, fallback, cost tracking. Deferred until multi-model becomes important. |
| **Business Workflows** | n8n (optional Docker profile) | Deterministic business process orchestration. Calls LangGraph via HTTP. MSP-tier feature. |
| **RAG / Vector Search** | pgvector (in PostgreSQL) | Skill retrieval, conversation context, device docs. Embeddings via LangChain models. |
| **RAG (future scale)** | Qdrant (Phase 4-5) | Dedicated vector DB if pgvector bottlenecks. Self-hostable, LangChain integration. |

Single-agent graph with three nodes — not multi-agent. Not in stack: CrewAI/AutoGen (overkill), LlamaIndex (LangChain RAG sufficient), Semantic Kernel (Microsoft lock-in).

---

## 13. Device Connectivity Model

### Phase 1-2: On-Prem Docker (Direct Access)

Container runs on customer's network. Direct SSH/NETCONF to devices. Zero connectivity complexity.

```bash
docker compose up -d   # on customer's server, same LAN as devices
```

### Phase 3+: Site Connector (SaaS Customers)

Lightweight Docker container at customer site. Makes outbound WebSocket to our SaaS — no inbound firewall rules. Same Docker image, different entrypoint.

```bash
docker run netsec-platform --mode connector --site-token <token>
```

Receives tasks from SaaS, runs pyATS/MCP locally, returns results. Industry pattern: Auvik collector, Datto agent, NinjaOne probe. Cloudflare Tunnel as alternative option.

---

## 14. NetClaw Fork Strategy

Fork and convert — not start from scratch. ~70% content migration, ~30% new code.

**KEEP** (Apache-2.0): 82 SKILL.md files (domain knowledge), 46 MCP server references (integrate as dependencies), workflow patterns (5-phase config deploy, ITSM gating, fleet parallel ops, NetBox reconciliation).

**STRIP**: OpenClaw runtime entirely (Gateway, channel adapters, SOUL.md/IDENTITY.md, heartbeat, session management). Slack-native UX. Single-user model.

**REPLACE WITH**: LangGraph (agent orchestration), FastAPI (API + auth + scheduling), our skill loader, our tenant/site/device data model, TanStack Start web UI.

---

## 15. Key Decisions

| Decision | Choice | Why |
|---|---|---|
| Platform | Pure Python, Docker Compose | Portable: cloud, on-prem, laptop |
| Monitoring | Zabbix (40+ tool MCP) | Industry standard for MSPs, self-hostable, SNMP/agent/agentless |
| Incident Mgmt | Built-in (not external tool) | Must be multi-tenant, AI-integrated, customer-visible |
| Workflow orchestration | n8n + LangGraph | n8n routes business process; LangGraph does AI reasoning |
| On-call/paging | Integrate customer's existing (PagerDuty, Slack, etc) via webhooks | Don't rebuild what PagerDuty does; own the lifecycle, delegate the paging |
| Alert pipeline | Built-in (webhook ingestion + processing) | Must normalize across Zabbix, Grafana, cloud, device alerts |
| Frontend | TanStack Start on Render | Works with any CDN, free hosting |
| Agent | LangGraph (latest, no constraints) | Checkpointing, human-in-the-loop, full Python ecosystem |
| Database | PostgreSQL + pgvector | Universal, self-hostable, vector search built-in |
| Storage | B2/MinIO (S3-compatible) | Cheapest cloud, self-hostable |
| Open-core | GitLab-style split (community/ + enterprise/) | Clean legal separation, genuine OSS + revenue protection |
| Licensing | Signed JWT, local validation, no phone-home | On-prem friendly, GitLab/n8n/Metabase pattern |
| CF role | DNS + CDN only | Infrastructure, not platform |
| Device connectivity | On-prem first, site connector Phase 3 | Ship fast, solve remote access when SaaS customers need it |
| NetClaw approach | Fork + convert (not from scratch) | 82 skills of domain knowledge, massive head start |
| MCP priority | Prisma Access first | Zero competition, highest value |
| Multi-model | LiteLLM in Phase 2-3 | Not needed Phase 1; add when customers want model choice |
| MongoDB Atlas | Rejected | Relational data fits poorly in doc DB; on-prem vector not battle-tested; SQLAlchemy ecosystem |
| RAG upgrade | Qdrant if pgvector bottlenecks | Phase 4-5 optimization, not Phase 1 decision |
| Dropped Cloudflare-as-platform | Pure Python stack instead | Over-engineered, blocked on-prem portability, slowed shipping |
