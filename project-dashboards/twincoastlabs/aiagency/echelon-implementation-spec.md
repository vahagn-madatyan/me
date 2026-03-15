---
project: echelon
version: "1.0"
type: implementation-spec
status: ready-for-execution
author: sentinel-architect
date: 2026-03-12
execution_model: gsd-wave-parallel
target_agents: [claude-code, codex-cli]
---

# ECHELON — AI Operations Platform for Real Estate
## Master Implementation Specification v1.0

> **Mission:** Build a vertical AI operations platform that gives real estate professionals a team of 7 specialized AI agents — replacing disconnected tools, eliminating 15-hour lead response times, and becoming the system-of-record for their business.

> **Positioning:** "Hire intelligence. Scale ambition. Close more deals."

> **Constraint:** 3-person bootstrapped team. No VC. Every tool must be open-source or self-hostable. Total infrastructure cost target: <$200/month at launch scale.

---

## TABLE OF CONTENTS

1. [Product Overview](#1-product-overview)
2. [Agent Definitions](#2-agent-definitions)
3. [Technical Architecture](#3-technical-architecture)
4. [Tech Stack & Dependencies](#4-tech-stack--dependencies)
5. [Fork Strategy](#5-fork-strategy)
6. [Data Model](#6-data-model)
7. [Integration Map (MCP Servers)](#7-integration-map-mcp-servers)
8. [Pricing & Billing](#8-pricing--billing)
9. [Phase 1 Implementation](#9-phase-1-implementation)
10. [Phase 2 Implementation](#10-phase-2-implementation)
11. [Phase 3 Implementation](#11-phase-3-implementation)
12. [Phase 4+ Expansion](#12-phase-4-expansion)
13. [Security & Compliance](#13-security--compliance)
14. [Observability & Evaluation](#14-observability--evaluation)
15. [Acceptance Criteria](#15-acceptance-criteria)

---

## 1. PRODUCT OVERVIEW

### The Problem
Real estate agents lose deals before they compete. The average agent takes 15+ hours to respond to a new lead — yet 78% of buyers work with the first agent who responds. Agents spend 30%+ of their time on admin: writing listing descriptions, drafting follow-ups, scheduling showings, managing transaction documents. They pay $2,500+/year for 5-8 disconnected SaaS tools that don't talk to each other.

### The Solution
An AI operations team built exclusively for real estate. 7 specialized AI agents that plug into existing tools (MLS, CRM, transaction management) and handle work that eats the agent's day — lead response in under 60 seconds, listing content, follow-up sequences, compliance checks, transaction coordination, and market analysis.

### Key Differentiators
1. **Vertical depth, not horizontal breadth** — every agent, integration, and workflow is purpose-built for real estate
2. **Flat pricing, zero credit anxiety** — monthly salary per AI team. Hard usage caps with graceful degradation (throttle to cheaper models, never surprise bills)
3. **Your tools, connected** — deep native integrations with Follow Up Boss, KvCore, Dotloop, SkySlope, MLS via RESO Web API
4. **AI that learns YOUR business** — persistent memory across interactions via Letta. Agents remember client preferences, past showings, offer history, and your communication style
5. **Compliance-first** — Shield agent runs as quality gate across all other agents. Fair housing, disclosure verification, NAR settlement compliance built-in
6. **Measurable ROI** — per-agent cost tracking, lead conversion attribution, time-saved dashboards

### Target Customer
- Solo agents doing 15-40 deals/year (primary launch target)
- Small teams (2-5 agents) with no admin staff
- Top producers drowning in leads they can't respond to fast enough
- Tech-forward agents already using Follow Up Boss or KvCore
- Investor-agents who need deal screening + residential workflow

---

## 2. AGENT DEFINITIONS

### Agent Architecture Pattern
Every agent follows the same structural pattern:
- Defined as a **LangGraph state machine** (graph with typed state, conditional edges, human-in-the-loop breakpoints)
- Has a **CrewAI persona** (role, goal, backstory derived from forked Agency-Agents templates)
- Uses **Letta** for persistent memory (core + recall + archival tiers mapped to agent skill level)
- Connects to tools via **MCP servers** (per-tenant OAuth via Composio)
- Routes LLM calls through **LiteLLM** gateway (model tier mapped to agent level)
- All actions traced in **LangSmith** (distributed tracing with cost attribution)

### Agent #1: Scout — Lead Response
```yaml
name: Scout
role: Lead Response Agent
tier: Assistant
models: GPT-4o-mini / Claude Haiku (fast, cheap)
memory: Sliding window + basic recall (remembers returning leads)
phase: 1 (launch)
covers_from_spreadsheet: LeadPulse
```

**Skills:**
- Instant lead response via text/email (target: <60 seconds, 24/7)
- Lead qualification (budget, timeline, pre-approval status, buying vs. selling)
- Appointment scheduling integrated with Google Calendar / Calendly
- Smart routing to the right team agent based on configurable rules
- After-hours coverage (never miss a 10 PM Zillow inquiry)
- Source-aware responses (Zillow leads vs. referrals vs. website vs. open house sign-in)
- Follow-up sequence triggering (if no response in 24hrs → follow-up #2 via Trigger.dev)

**LangGraph Flow:**
```
Receive Lead → Classify Source → Check Returning (Letta recall) → Qualify →
  ├─ Hot Lead → Schedule Appointment → Route to Agent → Update CRM
  ├─ Warm Lead → Start Nurture Sequence → Update CRM
  └─ Cold/Spam → Log + Skip
```

**MCP Servers:** mcp-followupboss, mcp-kvcore, mcp-twilio, mcp-calendar, mcp-zillow-leads
**Success Metrics:** Speed-to-lead (<60s), contact rate, qualification rate, appointments booked/week

---

### Agent #2: Sage — Market & Investment Intelligence
```yaml
name: Sage
role: Market & Investment Intelligence Agent
tier: Associate
models: Claude Sonnet / GPT-4o (analytical, mid-tier)
memory: Core + Recall (accumulates market knowledge over time)
phase: 2
covers_from_spreadsheet: PricingPro + partial DealScreen + RentComp
```

**Skills:**
- Comparative Market Analysis (CMA) generation from MLS data
- Neighborhood market reports (avg DOM, price trends, inventory levels)
- Pricing strategy recommendations based on comps and market velocity
- Investment property screening (cap rate, cash-on-cash, DSCR, GRM)
- Rental comp analysis and rent estimate generation
- ARV estimation for fix-and-flip / BRRRR strategy evaluation
- Monthly market newsletter generation for sphere of influence
- Listing price alert monitoring for active buyers

**LangGraph Flow (CMA):**
```
Receive Address → Pull MLS Comps → Pull Public Records → Analyze Adjustments →
Generate CMA Report → Shield Compliance Check → Deliver to Agent
```

**MCP Servers:** mcp-mls, mcp-county-records, Rentcast API, Zillow/Redfin APIs, Google Maps API
**Success Metrics:** CMA accuracy vs. final sale price, reports generated/month, deal screen pass-through accuracy

---

### Agent #3: Quill — Content & Communications
```yaml
name: Quill
role: Content & Communications Agent
tier: Associate
models: Claude Sonnet / GPT-4o (creative, mid-tier)
memory: Core + Recall (learns agent's writing voice over time)
phase: 2
covers_from_spreadsheet: ListingLaunch
```

**Skills:**
- MLS listing descriptions (pulls property data, writes to agent's learned style)
- Social media posts for listings (Instagram, Facebook, LinkedIn)
- Personalized follow-up email sequences (drip campaigns)
- Open house promotion materials and post-event follow-ups
- Showing feedback collection and synthesis from buyers
- Just-listed / just-sold announcement templates
- Review request messages to past clients
- ALL content → Shield compliance check before delivery (fair housing, NAR)

**MCP Servers:** mcp-mls, mcp-email, Canva API, Mailchimp/Brevo, social media scheduling
**Success Metrics:** Content pieces generated/month, email open rates, listing description time saved

---

### Agent #4: Closer — Transaction Coordinator
```yaml
name: Closer
role: Transaction Coordinator Agent
tier: Broker
models: Claude Opus / GPT-4.5 (complex reasoning, frontier)
memory: Full 3-tier Letta (complete transaction context across weeks)
phase: 3
covers_from_spreadsheet: TransactIQ
```

**Skills:**
- Transaction timeline management (inspection, appraisal, financing, closing deadlines)
- Document checklist tracking and missing-doc alerts
- Contract clause summarization (highlight key terms, contingencies, red flags)
- Multi-party coordination (buyer agent, listing agent, lender, title, inspector)
- Deadline reminder notifications to all parties
- Compliance document verification (state-specific disclosure requirements)
- Closing cost estimate preparation
- ALL documents → Presidio PII redaction before LLM processing

**LangGraph Flow (Transaction):**
```
Accept Offer → Create Timeline → [Loop: Check Deadlines Daily] →
  ├─ Deadline Approaching → Alert Parties → Log
  ├─ Document Received → Parse (Unstructured) → PII Strip (Presidio) → Verify → Update Checklist
  ├─ Issue Detected → Shield Risk Check → Escalate to Agent
  └─ All Clear → Proceed to Next Milestone
→ Closing Complete → Trigger PostClose Nurture
```

**MCP Servers:** mcp-dotloop, mcp-skyslope, DocuSign API, mcp-email, mcp-calendar
**Success Metrics:** Transactions managed, deadlines hit rate (%), time saved/transaction, error/miss rate

---

### Agent #5: Nurture — Client Relationships
```yaml
name: Nurture
role: Client Relationship Agent
tier: Associate
models: Claude Sonnet / GPT-4o (personalized, mid-tier)
memory: Full 3-tier Letta (remembers client history across years)
phase: 2
covers_from_spreadsheet: PostClose
```

**Skills:**
- Automated birthday and home anniversary messages
- Sphere-of-influence drip campaigns (customized by relationship type)
- Seasonal check-ins (market updates tied to their neighborhood)
- Re-engagement sequences for cold leads (6-12 month nurture)
- Referral request automation (timed to post-closing satisfaction window)
- Home value update alerts for past clients (retention + listing lead gen)
- Event invitation management (client appreciation events)

**MCP Servers:** mcp-followupboss, mcp-kvcore, mcp-email, mcp-twilio, Zillow API
**Success Metrics:** Database touch frequency, referrals generated, re-engagement conversion, client retention

---

### Agent #6: Atlas — Ops & Admin
```yaml
name: Atlas
role: Ops & Admin Agent
tier: Assistant
models: GPT-4o-mini / Claude Haiku (fast, cheap)
memory: Sliding window (stateless per session)
phase: 1 (launch)
covers_from_spreadsheet: (no direct competitor — operational glue)
```

**Skills:**
- CRM data entry and contact deduplication
- Showing schedule coordination across multiple buyers
- Meeting prep briefs (pull property history, client notes before appointments)
- Expense tracking and categorization for tax prep
- MLS listing input from agent notes/photos
- Weekly activity reports (leads, showings, offers, closings)
- Vendor coordination (photographers, stagers, inspectors)

**MCP Servers:** mcp-followupboss, mcp-kvcore, mcp-calendar, Google Workspace, QuickBooks
**Success Metrics:** Admin hours saved/week, data accuracy rate, tasks completed/week

---

### Agent #7: Shield — Compliance & Risk
```yaml
name: Shield
role: Compliance & Risk Agent
tier: Broker
models: Claude Opus / GPT-4.5 (high-stakes reasoning, frontier)
memory: Full 3-tier Letta (accumulates compliance knowledge)
phase: 2
covers_from_spreadsheet: DisclosureGuard + BuyerBridge
```

**Skills:**
- Property disclosure gap analysis against county records + permit history
- Fair housing language compliance scanning on ALL Quill-generated content
- NAR settlement compliance — buyer agreement generation + compensation disclosure
- State-specific disclosure requirement checklists (auto-updated per jurisdiction)
- E&O risk scoring per transaction (flags high-risk items for agent review)
- Permit history verification (unpermitted work detection from county records)
- Contract clause red flag alerts (non-standard terms, missing contingencies)
- Quality gate: all Quill content + Closer documents compliance-checked before delivery

**LangGraph Flow (Quality Gate):**
```
Receive Content/Document → Classify Type →
  ├─ Listing Description → Fair Housing Scan → Flag/Pass
  ├─ Buyer Agreement → NAR Settlement Check → State Requirements → Flag/Pass
  ├─ Transaction Document → Disclosure Verification → E&O Risk Score → Flag/Pass
  └─ Any Output → PII Check (Presidio) → Final Approval
→ Pass: Deliver to Agent/Client
→ Flag: Hold + Alert Agent with Explanation
```

**MCP Servers:** mcp-county-records, mcp-mls (property history), State RE commission rules, Unstructured (document parsing)
**Success Metrics:** Disclosure gaps caught/month, fair housing violations prevented, E&O risk score accuracy

---

### Future Agents (Phase 4+)

**Agent #8: Vault — Investment Analysis** (Phase 4, months 10-14)
- Deal screening: filter 100 properties → 5 worth analyzing
- BRRRR analysis (Buy-Rehab-Rent-Refinance-Repeat)
- Full cash flow modeling with sensitivity analysis
- Covers: DealScreen + BRRRR Navigator + partial RehabScope
- New integrations needed: Rentcast API, Plaid, RSMeans

**Agent #9: Sentinel — Portfolio Monitor** (Phase 4, months 10-14)
- Insurance rate change alerts
- Refinance opportunity detection based on rate movements
- Property value tracking across portfolio
- Covers: InsureGuard + partial PortfolioCommand
- New integrations needed: FEMA flood zone API, First Street climate risk, Plaid

**Phase 5 (Developer Vertical):** ZoneCheck, PermitReady, CostForge, SubConnect, BuildPulse, ChangeShield
**Phase 6 (Commercial Vertical):** LeaseIntel, DealFlow Underwriter, TenantRisk Profiler, RefiRisk, ESG Compliance, MarketPulse

---

## 3. TECHNICAL ARCHITECTURE

### Architecture Layers (Top → Bottom)

```
┌─────────────────────────────────────────────────────────────────────┐
│  L0  CLIENT LAYER                                                   │
│  Next.js 16 + shadcn/ui v4 │ assistant-ui │ React Native (Phase 4) │
├─────────────────────────────────────────────────────────────────────┤
│  L1  API GATEWAY & AUTH                                             │
│  Supabase Auth + RLS │ Rate Limiter │ Tenant Router                 │
├─────────────────────────────────────────────────────────────────────┤
│  L2  CONTROL PLANE — Paperclip Fork                                 │
│  Dashboard │ Budget Enforcement │ Governance │ Heartbeat Scheduler   │
├─────────────────────────────────────────────────────────────────────┤
│  L3  AGENT ORCHESTRATION                                            │
│  LangGraph (workflows) │ CrewAI (handoffs) │ Deep Agents (complex)  │
│  Agency-Agents Fork (personas)                                      │
├─────────────────────────────────────────────────────────────────────┤
│  L4  LLM INFRASTRUCTURE                                            │
│  LiteLLM Gateway │ RouteLLM │ LoRAX (Enterprise) │ vLLM (Ent.)    │
├─────────────────────────────────────────────────────────────────────┤
│  L5  MEMORY & KNOWLEDGE                                            │
│  Letta (3-tier memory) │ pgvector in Supabase │ Haystack (RAG)     │
│  Mem0 (cross-agent shared memory)                                   │
├─────────────────────────────────────────────────────────────────────┤
│  L6  TOOL & INTEGRATION LAYER                                      │
│  MCP Servers (10 custom) │ Composio (OAuth) │ Firecrawl │ Unstruct.│
├─────────────────────────────────────────────────────────────────────┤
│  L7  PLATFORM SERVICES                                             │
│  Stripe (billing) │ LangSmith (traces) │ Langfuse (OSS alt)       │
│  Trigger.dev (scheduled jobs) │ n8n (integration workflows)        │
├─────────────────────────────────────────────────────────────────────┤
│  L8  SECURITY & COMPLIANCE                                         │
│  Supabase RLS │ Infisical (secrets) │ Presidio (PII) │ OWASP MCP  │
├─────────────────────────────────────────────────────────────────────┤
│  L9  INFRASTRUCTURE                                                │
│  Supabase (Postgres+RLS+Auth+Storage) │ Vercel │ AWS/GCP          │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow: Zillow Lead → Booked Showing (End-to-End)
```
Zillow webhook → n8n (parse + route) → Supabase Edge Fn (tenant lookup) →
LangGraph (Scout graph) → LiteLLM → Claude Haiku (qualify) →
MCP: mcp-followupboss (create contact) → Letta (store client context) →
Twilio SMS (send response in <60s) → Mem0 (share to all agents) →
Trigger.dev (set 24hr follow-up timer) → LangSmith (trace logged)

Total: lead received → personalized SMS sent = under 60 seconds
Cost per lead response: ~$0.003
```

### Agent-to-Agent Handoff Flows
```
Scout → Nurture       (qualified lead enters nurture sequence)
Scout → Atlas         (books showing, coordinates schedule)
Scout → Closer        (accepted offer triggers transaction management)
Quill → Shield        (every piece of content compliance-checked)
Closer → Shield       (every transaction document disclosure-verified)
Sage → Quill          (CMA data feeds listing description context)
Closer → Nurture      (closing complete triggers post-close relationship campaign)
```

### Model Tier Routing (via LiteLLM + RouteLLM)
```
Assistant Tier  → Scout, Atlas
  Primary: GPT-4o-mini ($0.15/1M input)
  Fallback: Claude Haiku ($0.25/1M input)
  Budget: ~$40/mo per tenant

Associate Tier → Sage, Quill, Nurture
  Primary: Claude Sonnet ($3/1M input)
  Fallback: GPT-4o ($2.50/1M input)
  Budget: ~$80/mo per tenant

Broker Tier    → Shield, Closer
  Primary: Claude Opus ($15/1M input)
  Fallback: GPT-4.5 ($8/1M input)
  Budget: ~$120/mo per tenant

RouteLLM sits between agents and LiteLLM:
  Simple query (e.g., "Thanks, what time works?") → routes to cheapest model
  Complex query (e.g., multi-property CMA with adjustments) → routes to frontier
  Result: ~85% cost reduction on simple queries within each tier
```

---

## 4. TECH STACK & DEPENDENCIES

### Core Dependencies (Install Order)

```bash
# ─── Python Agent Runtime ────────────────────────────
pip install langgraph langchain langchain-community
pip install crewai crewai-tools
pip install litellm
pip install letta-client
pip install mem0ai
pip install haystack-ai
pip install presidio-analyzer presidio-anonymizer
pip install routellm
pip install composio-core composio-langchain
pip install firecrawl-py
pip install unstructured[all-docs]

# ─── Node.js Platform Layer ──────────────────────────
npm install next@latest react react-dom
npm install @supabase/supabase-js @supabase/ssr
npx shadcn@latest init
npm install @assistant-ui/react @assistant-ui/react-langgraph
npm install @trigger.dev/sdk @trigger.dev/nextjs
npm install stripe @stripe/stripe-js
npm install zod typescript

# ─── Self-Hosted Services (Docker) ───────────────────
# Supabase: docker compose up (supabase/supabase)
# Infisical: docker compose up (Infisical/infisical)
# n8n: docker compose up (n8n-io/n8n)
# LiteLLM Proxy: docker run litellm/litellm-proxy
# Langfuse (Enterprise): docker compose up (langfuse/langfuse)
```

### Complete Technology Map

| Layer | Technology | License | Role | Self-Hosted | Cost |
|-------|-----------|---------|------|-------------|------|
| **Orchestration** | LangGraph | MIT | Agent workflow engine | N/A (library) | $0 |
| | CrewAI | MIT | Agent-to-agent handoffs | N/A (library) | $0 |
| | Paperclip **FORK** | MIT | Control plane + dashboard | Yes | $0 |
| | Agency-Agents **FORK** | MIT | Persona templates | N/A (static files) | $0 |
| | Deep Agents | MIT | Complex task planning | N/A (library) | $0 |
| **LLM** | LiteLLM | MIT | LLM gateway + routing | Yes (Docker) | $0 |
| | RouteLLM | Apache 2.0 | Smart complexity routing | N/A (library) | $0 |
| | LoRAX | Apache 2.0 | Multi-LoRA serving (Ent.) | Yes (GPU) | Enterprise |
| | vLLM | Apache 2.0 | Inference engine (Ent.) | Yes (GPU) | Enterprise |
| **Memory** | Letta | Apache 2.0 | Agent memory system | Yes (Docker) | $0 |
| | pgvector | PostgreSQL | Vector database | Yes (in Supabase) | $0 |
| | Haystack | Apache 2.0 | RAG pipelines | N/A (library) | $0 |
| | Mem0 | Apache 2.0 | Cross-agent shared memory | N/A (library) | $0 |
| **Tools** | MCP Protocol | MIT | Tool standard | N/A (protocol) | $0 |
| | Composio | — | OAuth + 500 integrations | Managed | Free tier |
| | Firecrawl | AGPL-3.0 | Web data extraction | Yes (Docker) | $0 |
| | Unstructured | Apache 2.0 | Document processing | N/A (library) | $0 |
| **Frontend** | Next.js 16 | MIT | Web framework | Vercel | $20/mo |
| | shadcn/ui v4 | MIT | Component library | N/A | $0 |
| | assistant-ui | MIT | Agent chat UI | N/A (library) | $0 |
| | React Native | MIT | Mobile app (Phase 4) | N/A | $0 |
| **Platform** | Stripe | Proprietary | Billing | Managed | 2.9% + 30¢ |
| | LangSmith | Proprietary | Observability + evals | Managed | Free dev tier |
| | Langfuse | MIT (core) | OSS observability alt | Yes (Docker) | $0 |
| | Trigger.dev | Apache 2.0 | Background jobs | Yes (Docker) | $0 |
| | n8n | Sust. Use | Integration workflows | Yes (Docker) | $0 |
| **Security** | Infisical | MIT | Secrets management | Yes (Docker) | $0 |
| | Presidio | Apache 2.0 | PII detection/redaction | N/A (library) | $0 |
| **Infra** | Supabase | Apache 2.0 | Postgres + Auth + Storage | Yes / Managed | $25/mo |

**Total launch infrastructure cost: ~$45-75/month** (Supabase Pro + Vercel Pro)

---

## 5. FORK STRATEGY

### FORK: Paperclip → Echelon Control Plane

**Source:** github.com/paperclipai/paperclip (MIT, 16K+ stars)
**Stack:** Node.js + React + PostgreSQL + pnpm monorepo

**What to keep:**
- Heartbeat-based agent coordination (wake → check queue → act)
- Atomic task checkout (prevents double-work across agents)
- Budget enforcement per agent (monthly caps, auto-pause at limit)
- Multi-tenant data isolation (company-scoped entities)
- Ticket-based work tracking with threaded conversations
- Append-only audit log
- Extension architecture (drop-in capabilities)

**What to rewrite:**
- "Company" abstraction → "Real Estate Team" abstraction
- CEO/CTO/Engineer org chart → Scout/Sage/Quill/Closer/Nurture/Atlas/Shield
- Generic dashboard → RE-specific views (lead pipeline, transaction timeline, ROI analytics)
- BYOA model → pre-built managed agents powered by LangGraph
- Clipmart marketplace → agent template marketplace (Phase 4)
- Auth → replace with Supabase Auth
- Database → migrate to Supabase Postgres (keep schema patterns)

**Fork execution (Week 1-4):**
- Week 1: Fork, run locally, map data model (company→team, agent→AI member, project→pipeline)
- Week 2: Strip UI, replace with Next.js 16 + shadcn/ui, wire Supabase Auth
- Week 3: Replace generic agent coordination with LangGraph-backed agent definitions
- Week 4: Build customer-facing views (My AI Team, Lead Activity, Settings + Stripe billing)

**Maintenance:** Pull upstream bugfixes selectively. Fork will diverge significantly within 3 months — this is expected and acceptable.

### FORK: Agency-Agents → Echelon Persona Library

**Source:** github.com/msitarzewski/agency-agents (MIT, 25K+ stars)
**Type:** One-time fork. Static Markdown templates. No runtime.

**Action:** Fork, delete non-RE personas (~35 of 50), rewrite remaining ~15 with:
- Real estate domain expertise (MLS terminology, transaction lifecycle, fair housing)
- Lead qualification scripts from top-producing agents
- NAR compliance language and state-specific variations
- Style-matching prompts for communication personalization
- Tool-use instructions specific to RE MCP servers

### DO NOT FORK: Everything Else
LangGraph, CrewAI, LiteLLM, Letta, Haystack, Composio, assistant-ui — all used as pip/npm dependencies. They're maintained by well-funded teams, update frequently, and forking creates maintenance debt with zero strategic benefit.

---

## 6. DATA MODEL

### Core Entities (Supabase Postgres + RLS)

```sql
-- Every table has tenant_id with RLS policy:
-- CREATE POLICY tenant_isolation ON [table]
--   USING (tenant_id = auth.jwt()->'app_metadata'->>'tenant_id');

-- ─── Tenants & Auth ─────────────────────────────────
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('solo','team','investor_pro','brokerage','enterprise')),
  plan_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  monthly_lead_cap INTEGER NOT NULL DEFAULT 50,
  monthly_token_budget INTEGER NOT NULL DEFAULT 100000, -- in tokens
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('owner','admin','agent','viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── AI Agents ──────────────────────────────────────
CREATE TABLE ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  agent_type TEXT NOT NULL CHECK (agent_type IN ('scout','sage','quill','closer','nurture','atlas','shield')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','over_budget')),
  config JSONB DEFAULT '{}', -- persona overrides, model preferences
  monthly_budget INTEGER NOT NULL, -- token budget for this agent
  tokens_used_this_month INTEGER NOT NULL DEFAULT 0,
  last_heartbeat TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Leads & Clients ────────────────────────────────
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  external_crm_id TEXT, -- Follow Up Boss / KvCore ID
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  lead_source TEXT, -- zillow, realtor_com, referral, website, open_house
  lead_status TEXT DEFAULT 'new' CHECK (lead_status IN ('new','contacted','qualified','nurturing','active_buyer','active_seller','under_contract','closed','lost')),
  qualification_data JSONB, -- budget, timeline, pre-approval, preferences
  agent_notes JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Conversations & Tasks ──────────────────────────
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  contact_id UUID REFERENCES contacts(id),
  agent_type TEXT NOT NULL, -- which AI agent
  channel TEXT NOT NULL CHECK (channel IN ('sms','email','chat','voice','internal')),
  messages JSONB NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'open' CHECK (status IN ('open','resolved','escalated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  agent_type TEXT NOT NULL,
  task_type TEXT NOT NULL, -- lead_response, cma_generation, listing_description, deadline_alert, etc.
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','failed','human_review')),
  input_data JSONB NOT NULL,
  output_data JSONB,
  contact_id UUID REFERENCES contacts(id),
  transaction_id UUID REFERENCES transactions(id),
  tokens_used INTEGER DEFAULT 0,
  cost_usd NUMERIC(10,6) DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Transactions ───────────────────────────────────
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  property_address TEXT NOT NULL,
  mls_number TEXT,
  transaction_type TEXT CHECK (transaction_type IN ('buy','sell','dual','lease')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','under_contract','inspection','appraisal','financing','closing','closed','cancelled')),
  key_dates JSONB DEFAULT '{}', -- inspection_deadline, appraisal_deadline, financing_deadline, closing_date
  documents JSONB DEFAULT '[]', -- {name, storage_path, uploaded_at, verified_by_shield}
  parties JSONB DEFAULT '[]', -- {role, name, email, phone}
  compliance_score NUMERIC(3,1), -- Shield's E&O risk score (0-10)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Vector Embeddings (pgvector) ───────────────────
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  source_type TEXT NOT NULL CHECK (source_type IN ('listing','contact','conversation','document','market_data')),
  source_id UUID NOT NULL,
  content_text TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON embeddings USING hnsw (embedding vector_cosine_ops);

-- ─── Usage Tracking ─────────────────────────────────
CREATE TABLE usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  agent_type TEXT NOT NULL,
  model TEXT NOT NULL, -- claude-haiku, gpt-4o-mini, etc.
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_usd NUMERIC(10,6) NOT NULL DEFAULT 0,
  task_id UUID REFERENCES tasks(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### RLS Policy Template (Applied to Every Table)
```sql
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON [table_name]
  FOR ALL
  USING (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid);
```

---

## 7. INTEGRATION MAP (MCP SERVERS)

### Custom MCP Servers to Build

Each is a standalone HTTP/SSE MCP server. All carry `tenant_id` + `Authorization` headers on every request. Per-tenant OAuth managed by Composio.

| MCP Server | Priority | Connected Agents | Phase |
|------------|----------|-----------------|-------|
| **mcp-followupboss** | P0 | Scout, Nurture, Atlas | 1 |
| **mcp-zillow-leads** | P0 | Scout | 1 |
| **mcp-twilio** | P0 | Scout, Nurture | 1 |
| **mcp-calendar** | P0 | Scout, Atlas | 1 |
| **mcp-mls** (RESO Web API) | P0 | Sage, Quill, Shield | 2 |
| **mcp-kvcore** | P1 | Scout, Nurture, Atlas | 2 |
| **mcp-email** (Gmail/Outlook) | P1 | Quill, Nurture, Closer | 2 |
| **mcp-county-records** | P1 | Shield, Sage | 2 |
| **mcp-dotloop** | P1 | Closer | 3 |
| **mcp-skyslope** | P1 | Closer, Shield | 3 |
| **mcp-docusign** | P2 | Closer | 3 |
| **mcp-mailchimp** | P2 | Quill, Nurture | 2 |

### MCP Server Template Structure
```
mcp-servers/
├── mcp-followupboss/
│   ├── server.py          # FastAPI + SSE transport
│   ├── tools.py           # Tool definitions (create_contact, update_lead, etc.)
│   ├── auth.py            # Composio OAuth token retrieval
│   ├── tests/
│   └── Dockerfile
├── mcp-zillow-leads/
│   ├── server.py
│   ├── tools.py           # parse_lead_email, parse_webhook
│   ├── auth.py
│   └── ...
└── shared/
    ├── tenant.py           # tenant_id extraction + validation
    ├── rate_limit.py       # per-tenant rate limiting
    └── security.py         # input sanitization (OWASP MCP Top 10)
```

---

## 8. PRICING & BILLING

### Plans

| Plan | Price | AI Team | Lead Cap | Target |
|------|-------|---------|----------|--------|
| **Solo** | $149/mo | Scout + Atlas | 50/mo | Solo agents, 10-30 deals/yr |
| **Team** | $399/mo | Scout, Quill, Nurture, Shield, Atlas | 200/mo | Teams 2-5, 50-100 deals/yr |
| **Investor Pro** | $499/mo | Scout, Sage (expanded), Shield, Atlas | 150/mo | Investor-agents, small portfolios |
| **Brokerage** | $899/mo | All 7 agents | 500/mo | Top producers, 100+ deals/yr |
| **Enterprise** | Custom | All 7 + Vault, Sentinel + custom | Unlimited | Multi-office, 10+ agents |

### Billing Rules
1. **Flat monthly pricing. No credits. No per-token charges to customers.**
2. If tenant hits lead cap → leads still processed but Scout uses cheapest model only
3. If agent hits token budget → agent throttles to cheaper model tier (never stops, never surprise-charges)
4. Usage tracking (tokens, costs) shown in dashboard for transparency — but never billed as overages
5. Stripe subscription handles recurring billing; Stripe metering tracks usage for internal analytics only
6. Annual prepay: 20% discount (2 months free)

### Margin Model
```
Solo plan: $149 revenue - ~$40 LLM cost - ~$5 infra = ~$104 gross margin (70%)
Team plan: $399 revenue - ~$80 LLM cost - ~$8 infra = ~$311 gross margin (78%)
Brokerage: $899 revenue - ~$120 LLM cost - ~$12 infra = ~$767 gross margin (85%)
```

---

## 9. PHASE 1 IMPLEMENTATION

### Phase 1: Foundation (Months 1-3)
**Goal:** Ship Solo plan. Prove speed-to-lead conversion with 20 beta RE agents.

### Wave 1.1 — Infrastructure (Week 1-2)
```yaml
wave: 1.1
parallel_tracks: 3
```

**Track A: Paperclip Fork + Supabase Setup**
- [ ] Fork paperclipai/paperclip to echelon-platform/echelon
- [ ] Run locally, understand data model
- [ ] Set up Supabase project (Postgres, Auth, Storage, Edge Functions)
- [ ] Create database schema (tenants, team_members, ai_agents, contacts, tasks, usage_events)
- [ ] Enable pgvector extension
- [ ] Apply RLS policies to all tables
- [ ] Set up Infisical for secrets management (Docker)

**Track B: LLM Gateway Setup**
- [ ] Deploy LiteLLM proxy (Docker)
- [ ] Configure model routing: Scout → GPT-4o-mini, Atlas → GPT-4o-mini
- [ ] Set per-tenant budget enforcement ($40/mo for Solo tier)
- [ ] Set up automatic failover (GPT-4o-mini → Claude Haiku)
- [ ] Configure RouteLLM for within-tier complexity routing
- [ ] Verify cost tracking: every call tagged with {tenant_id, agent_type, model}

**Track C: Next.js App Shell**
- [ ] Initialize Next.js 16 project with App Router
- [ ] Set up shadcn/ui v4 with Tailwind CSS 4
- [ ] Configure Supabase Auth (email/password + Google OAuth)
- [ ] Build layout: sidebar nav, agent dashboard grid, settings
- [ ] Create pages: /dashboard, /agents/[type], /leads, /settings, /billing
- [ ] Wire up Stripe for Solo plan ($149/mo subscription)

### Wave 1.2 — Scout Agent MVP (Week 3-4)
```yaml
wave: 1.2
depends_on: [1.1]
parallel_tracks: 2
```

**Track A: Scout LangGraph Implementation**
- [ ] Define Scout's LangGraph graph (state machine)
- [ ] Implement nodes: receive_lead, classify_source, check_returning, qualify, schedule, route
- [ ] Implement conditional edges (hot/warm/cold routing)
- [ ] Wire to LiteLLM for model calls
- [ ] Add basic Letta integration (recall memory for returning leads)
- [ ] Write unit tests for each node
- [ ] Write integration test: end-to-end lead → response

**Track B: MCP Servers (P0)**
- [ ] Build mcp-followupboss (create_contact, update_lead_status, get_contact)
- [ ] Build mcp-zillow-leads (parse_webhook, parse_email)
- [ ] Build mcp-twilio (send_sms, send_mms)
- [ ] Build mcp-calendar (check_availability, create_event)
- [ ] Set up Composio for per-tenant OAuth token management
- [ ] Test each MCP server independently
- [ ] Test Scout calling all 4 MCP servers in sequence

### Wave 1.3 — Atlas Agent + Dashboard (Week 5-6)
```yaml
wave: 1.3
depends_on: [1.2]
parallel_tracks: 2
```

**Track A: Atlas LangGraph Implementation**
- [ ] Define Atlas graph (simpler than Scout — task-based)
- [ ] Implement nodes: receive_task, categorize, execute, report
- [ ] Skills: CRM data entry, showing coordination, weekly reports
- [ ] Wire to same MCP servers as Scout (mcp-followupboss, mcp-calendar)

**Track B: Customer Dashboard**
- [ ] "My AI Team" view (adapted from Paperclip org chart — shows Scout + Atlas with status)
- [ ] "Lead Activity" feed (real-time via Supabase Realtime — shows Scout processing leads)
- [ ] Agent detail pages (conversation threads, tasks, performance metrics)
- [ ] Settings page (CRM connection via Composio OAuth flow, notification preferences)
- [ ] Billing page (Stripe customer portal embed)

### Wave 1.4 — Observability + Beta Launch (Week 7-8)
```yaml
wave: 1.4
depends_on: [1.3]
```

- [ ] Set up LangSmith tracing (LANGCHAIN_TRACING_V2=true)
- [ ] Verify traces: Scout lead response shows full span tree
- [ ] Build usage dashboard (tokens consumed per agent, cost per lead response)
- [ ] Set up n8n for Zillow webhook → Scout pipeline
- [ ] Set up Trigger.dev for Scout follow-up timers (24hr, 72hr, 7day)
- [ ] Deploy to Vercel (web) + Docker (agent runtime)
- [ ] Invite 20 beta users (free for 30 days → Solo pricing)
- [ ] Begin weekly feedback calls

### Phase 1 Acceptance Criteria
```yaml
must_pass:
  - Scout responds to test lead via SMS in < 60 seconds
  - Scout correctly qualifies lead (budget, timeline, pre-approval)
  - Scout creates contact in Follow Up Boss via MCP
  - Scout schedules showing via Google Calendar
  - Atlas generates weekly activity report
  - Dashboard shows real-time lead activity
  - Tenant A cannot see Tenant B's data (RLS verification)
  - LangSmith shows complete trace for lead → response flow
  - Stripe successfully charges $149/mo for Solo plan
  - Usage stays within $40/mo LLM budget for Solo tier
nice_to_have:
  - Mobile-responsive dashboard
  - 20 beta users onboarded
  - First case study from beta feedback
```

---

## 10. PHASE 2 IMPLEMENTATION

### Phase 2: Content + Compliance (Months 4-6)
**Goal:** Ship Team plan. Add Shield, Quill, Nurture, Sage. Achieve 50 paying customers.

### Key Deliverables
- [ ] Shield agent — compliance quality gate
- [ ] Quill agent — content generation with Shield compliance pipeline
- [ ] Nurture agent — client relationship automation
- [ ] Sage agent — CMA + investment analysis
- [ ] Letta memory integration (per-agent, per-client persistent memory)
- [ ] Composio multi-tenant OAuth (expanded to MLS, email, county records)
- [ ] mcp-mls (RESO Web API), mcp-email, mcp-county-records, mcp-mailchimp
- [ ] ROI dashboard (leads captured, time saved, conversion attribution)
- [ ] Team plan billing ($399/mo) and Investor Pro plan ($499/mo)

### Phase 2 Acceptance Criteria
```yaml
must_pass:
  - Shield scans Quill listing description and catches fair housing violation in test
  - Sage generates CMA from MLS data within 2 minutes
  - Nurture sends birthday message to contact on correct date
  - Quill writes listing description in agent's learned style
  - All content passes Shield compliance check before delivery
  - Mem0 shares Scout qualification data to Sage and Quill
  - Letta recalls returning client's preferences from 30+ days ago
  - 50 paying customers across Solo/Team/Investor Pro plans
```

---

## 11. PHASE 3 IMPLEMENTATION

### Phase 3: Transactions (Months 7-9)
**Goal:** Ship Brokerage plan. Closer + Shield become system-of-record for transactions.

### Key Deliverables
- [ ] Closer agent — full transaction coordination
- [ ] Closer → Shield pipeline (disclosure verification on every document)
- [ ] mcp-dotloop, mcp-skyslope, mcp-docusign integrations
- [ ] Multi-agent collaboration: Scout → Closer handoff (accepted offer)
- [ ] Voice agent integration (after-hours calls via Twilio Voice)
- [ ] AI style learning (Quill/Nurture adapt to agent's writing voice)
- [ ] Team management features (lead routing rules, permissions)
- [ ] Full 7-agent orchestration live

### Phase 3 Acceptance Criteria
```yaml
must_pass:
  - Closer tracks transaction from offer to close with zero missed deadlines in test
  - Closer alerts all parties 48hrs before inspection deadline
  - Closer parses uploaded contract and summarizes key clauses
  - Shield scores E&O risk on test transaction
  - Scout → Closer handoff works end-to-end (accepted offer triggers transaction)
  - Brokerage plan ($899/mo) billing works
  - 150 paying customers, $55K MRR
```

---

## 12. PHASE 4+ EXPANSION

### Phase 4: Investor Vertical (Months 10-14)
- Vault agent (investment analysis: deal screening, BRRRR, cap rate)
- Sentinel agent (portfolio monitoring: insurance, refi, value tracking)
- New integrations: Rentcast, Plaid, AppFolio/Buildium, RSMeans, FEMA
- LoRA fine-tuning per brokerage brand (Enterprise)
- Agent marketplace (community templates)
- White-label offering
- SOC 2 Type I certification
- Mobile app (React Native / Expo)
- Target: 250+ customers, $100K MRR

### Phase 5: Developer Vertical (Months 15-20)
- ZoneCheck, PermitReady, CostForge, SubConnect, BuildPulse, ChangeShield
- Prerequisites: RSMeans API, Procore MCP, GIS/municipal portals, BIM parsing
- Different customer persona — requires separate sales motion validation

### Phase 6: Commercial Vertical (Months 20+)
- LeaseIntel, DealFlow Underwriter, TenantRisk Profiler, RefiRisk, ESG Compliance, MarketPulse
- Prerequisites: CoStar/ARGUS partnerships, CMBS data feeds, commercial lease parsing (Yardi/MRI)
- Enterprise sales team required — longer sales cycle

---

## 13. SECURITY & COMPLIANCE

### Data Isolation
- **Database-level:** Supabase RLS on every table. `tenant_id` enforced at Postgres level, not application level.
- **Vector-level:** pgvector embeddings table has RLS. Tenant A's embeddings invisible to Tenant B.
- **Storage-level:** Supabase Storage with per-tenant bucket policies.
- **MCP-level:** Every MCP request carries tenant_id. Composio manages per-tenant OAuth tokens.
- **Agent-level:** LangGraph state carries tenant_id. Letta memory scoped per-tenant.

### PII Protection
- **Presidio pipeline:** All documents → Presidio PII detection → strip SSN, financial data, addresses → anonymized text to LLM → response re-hydrated for human output
- **Applied to:** Shield (disclosure documents), Closer (transaction docs), Sage (financial analysis)
- **Never send raw PII to any LLM** — this is a hard rule enforced at the orchestration layer

### Secrets Management
- **Infisical** (MIT, self-hosted): All API keys, OAuth tokens, per-tenant credentials
- **Rotation:** Automated secret rotation for critical credentials
- **Audit:** Full audit log of secret access

### MCP Security (OWASP MCP Top 10)
- Input sanitization on all tool calls (prevent prompt injection via MLS data)
- Output scanning for cross-tenant data leakage
- Human approval gates for write operations (Closer sending deadline notifications)
- Rate limiting per tenant per MCP tool
- MCP-scan analysis before deploying new MCP servers

---

## 14. OBSERVABILITY & EVALUATION

### Tracing (LangSmith)
- Every agent action = distributed trace with nested spans
- Example: Scout Lead Response → Classify Source → Query CRM → Generate Reply → Send SMS
- Per-agent cost tracking: how much does Scout cost vs. Closer per month per tenant
- Real-time monitoring dashboard for active agent workflows

### Evaluation Pipelines
- **Weekly automated evals:**
  - Is Quill's listing description quality improving? (LLM-as-judge scoring)
  - Is Scout's qualification accuracy above 85%? (compare to human labels)
  - Is Shield catching known fair housing violations? (regression test suite)
- **CI/CD integration:** Agent regression tests run before every deployment
- **A/B testing:** Compare model versions (does Sonnet 4 outperform Sonnet 3.5 for Quill?)

### Customer-Facing Analytics (ROI Dashboard)
- Leads captured this month (Scout)
- Average response time (target: <60 seconds)
- Appointments booked (Scout + Atlas)
- Content pieces generated (Quill)
- Transactions managed (Closer)
- Compliance checks passed/flagged (Shield)
- Estimated hours saved this month
- Cost per lead response

---

## 15. ACCEPTANCE CRITERIA

### Definition of Done — Phase 1
The platform is ready for paid beta when ALL of the following pass:

```
INFRASTRUCTURE
  ✅ Supabase project running with all tables + RLS
  ✅ pgvector extension enabled with HNSW index
  ✅ LiteLLM proxy routing to GPT-4o-mini with budget caps
  ✅ Infisical managing all API keys and secrets
  ✅ Next.js app deployed to Vercel with Supabase Auth
  ✅ Stripe billing active for Solo plan ($149/mo)

SCOUT AGENT
  ✅ Responds to inbound lead via SMS in < 60 seconds
  ✅ Correctly classifies lead source (Zillow, referral, website, open house)
  ✅ Qualifies lead (budget, timeline, pre-approval, buying vs selling)
  ✅ Creates contact in Follow Up Boss via mcp-followupboss
  ✅ Schedules showing via Google Calendar via mcp-calendar
  ✅ Triggers 24-hour follow-up via Trigger.dev if no response
  ✅ Handles after-hours leads (10 PM test scenario)
  ✅ Remembers returning leads via Letta recall memory

ATLAS AGENT
  ✅ Accepts task from dashboard and executes CRM update
  ✅ Generates weekly activity report (leads, showings, tasks completed)
  ✅ Coordinates showing schedule across multiple buyers

MULTI-TENANCY
  ✅ Tenant A's leads invisible to Tenant B (RLS test)
  ✅ Tenant A's MCP calls use Tenant A's CRM credentials only
  ✅ Budget enforcement: agent pauses at token cap, does not exceed

OBSERVABILITY
  ✅ LangSmith trace shows full lead → response flow with all spans
  ✅ Usage dashboard shows tokens consumed per agent with cost

DASHBOARD
  ✅ "My AI Team" shows Scout + Atlas with live status
  ✅ "Lead Activity" shows real-time feed of Scout processing leads
  ✅ Settings page completes Follow Up Boss OAuth connection
  ✅ Billing page shows active subscription and usage
```

---

## APPENDIX A: Repository Structure

```
echelon/
├── apps/
│   ├── web/                    # Next.js 16 dashboard
│   │   ├── app/                # App Router pages
│   │   ├── components/         # shadcn/ui + custom components
│   │   ├── lib/                # Supabase client, Stripe, utils
│   │   └── package.json
│   └── mobile/                 # React Native (Phase 4)
├── packages/
│   ├── shared/                 # Shared types, constants, utils
│   └── ui/                     # Shared UI components
├── agents/                     # Python agent runtime
│   ├── scout/
│   │   ├── graph.py            # LangGraph state machine
│   │   ├── nodes.py            # Node implementations
│   │   ├── persona.md          # Agency-Agents fork persona
│   │   └── tests/
│   ├── atlas/
│   ├── sage/
│   ├── quill/
│   ├── closer/
│   ├── nurture/
│   ├── shield/
│   └── shared/
│       ├── memory.py           # Letta integration
│       ├── llm.py              # LiteLLM wrapper
│       ├── mcp_client.py       # MCP client utilities
│       └── pii.py              # Presidio pipeline
├── mcp-servers/                # Custom MCP servers
│   ├── mcp-followupboss/
│   ├── mcp-zillow-leads/
│   ├── mcp-twilio/
│   ├── mcp-calendar/
│   ├── mcp-mls/
│   ├── mcp-county-records/
│   └── shared/
├── infra/
│   ├── docker-compose.yml      # LiteLLM, Infisical, n8n, Letta
│   ├── supabase/
│   │   ├── migrations/         # SQL migrations
│   │   └── seed.sql            # Test data
│   └── n8n/
│       └── workflows/          # n8n workflow exports
├── .planning/                  # GSD planning files
│   ├── phase-1.md
│   ├── phase-2.md
│   └── phase-3.md
├── docs/
│   ├── architecture.md
│   ├── agent-specs.md
│   └── mcp-server-guide.md
├── pnpm-workspace.yaml
└── README.md
```

---

## APPENDIX B: Environment Variables

```bash
# ─── Supabase ────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://...

# ─── LiteLLM ────────────────────────────────────────
LITELLM_MASTER_KEY=sk-...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# ─── LangSmith ──────────────────────────────────────
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls-...
LANGCHAIN_PROJECT=echelon-production

# ─── Stripe ─────────────────────────────────────────
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# ─── Twilio ─────────────────────────────────────────
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# ─── Composio ───────────────────────────────────────
COMPOSIO_API_KEY=...

# ─── Infisical (manages all other secrets per-tenant)
INFISICAL_TOKEN=...
INFISICAL_SITE_URL=http://localhost:8080
```

---

*End of Implementation Specification. This document is the single source of truth for building Echelon. Every engineering decision, every technology choice, and every agent behavior defined here has been validated through competitive research, market analysis, and architectural review.*

*— Sentinel, Lead Architect*
