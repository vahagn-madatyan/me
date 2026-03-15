---
project: echelon
phase: 1
wave: "1.0 — Paperclip Fork"
type: gsd-execution-prompt
status: ready
priority: critical-path
estimated_duration: 4 weeks
execution_model: sequential-weeks-parallel-tracks
target_agents: [claude-code, codex-cli]
depends_on: []
blocks: [wave-1.1, wave-1.2, wave-1.3, wave-1.4]
date: 2026-03-12
author: sentinel-architect
---

# GSD EXECUTION PROMPT: Paperclip Fork → Echelon Control Plane

## CONTEXT FOR AI CODING AGENT

You are building **Echelon**, an AI operations platform for real estate professionals. The platform gives real estate agents a team of 7 specialized AI agents (Scout, Sage, Quill, Closer, Nurture, Atlas, Shield) that handle lead response, market analysis, content creation, transaction coordination, client relationships, admin operations, and compliance.

The fastest path to a working control plane is forking **Paperclip** (github.com/paperclipai/paperclip) — an open-source MIT-licensed orchestration platform for AI agent teams. Paperclip provides org charts, budgets, governance, heartbeat-based agent coordination, and multi-tenant isolation. We adapt it into a real estate-specific platform backed by Supabase, Next.js 16, and LangGraph.

**This prompt covers the 4-week fork execution. Each week has a clear deliverable. Do not skip ahead — each week depends on the previous.**

---

## WHAT PAPERCLIP GIVES US (DO NOT REBUILD)

These features exist in Paperclip and should be preserved, adapted, or reused — not rebuilt from scratch:

1. **Heartbeat-based agent coordination** — Agents wake on scheduled intervals, check their task queue, and act. This becomes the core loop for all 7 Echelon agents.
2. **Atomic task checkout** — When an agent picks up a task, it's locked so no other agent can grab it. Prevents double-work across Scout and Atlas.
3. **Budget enforcement per agent** — Monthly token budgets per agent. At 80% utilization → warning. At 100% → agent auto-pauses. This is exactly our throttle-not-charge model.
4. **Multi-company (multi-tenant) isolation** — Every entity is company-scoped. One deployment serves many companies with separate data. This becomes our per-tenant isolation.
5. **Ticket-based work tracking** — Tasks have threaded conversations and full traceability. Adapts into our lead activity feed and transaction timeline.
6. **Append-only audit log** — Every agent action logged, no edits, no deletions. Required for Shield compliance and enterprise customers.
7. **Goal-aware execution** — Tasks trace back to company mission through project hierarchy. Adapts into our pipeline stage tracking.
8. **Extension architecture** — Drop-in extensions add capabilities without touching core. We use this pattern for MCP server integrations.
9. **Config export/import with secret scrubbing** — Portable templates with collision handling. Becomes our agent template marketplace (Phase 4).
10. **BYOA (Bring Your Own Agent)** — Any runtime that accepts heartbeats can be "hired." We replace this with managed LangGraph agents but keep the heartbeat interface.

**Paperclip tech stack (what we're forking):**
- Runtime: Node.js (requires 20+)
- Frontend: React
- Database: PostgreSQL (PGlite for dev, any Postgres for production)
- Package manager: pnpm monorepo
- API: Express-style HTTP server at port 3100
- License: MIT
- Setup: `npx paperclipai onboard --yes`

---

## WHAT WE CHANGE (THE ECHELON DELTA)

| Paperclip Concept | Echelon Equivalent | Change Type |
|---|---|---|
| "Company" | "Team" (real estate team/brokerage) | Rename + RE-specific fields |
| CEO / CTO / Engineer agents | Scout / Sage / Quill / Closer / Nurture / Atlas / Shield | Replace entirely |
| Generic org chart UI | "My AI Team" dashboard with RE-specific agent cards | Rewrite UI |
| Generic task tickets | Lead Activity feed + Transaction Timeline | Rewrite UI |
| Clipmart marketplace | Agent Template Marketplace (Phase 4) | Defer |
| Paperclip Auth | Supabase Auth (email + Google OAuth) | Replace |
| PGlite / embedded Postgres | Supabase Postgres (managed, with RLS + pgvector) | Replace |
| React frontend | Next.js 16 + shadcn/ui v4 + Tailwind CSS 4 | Replace |
| Generic BYOA heartbeat | LangGraph-backed agents triggered by heartbeat | Adapt |
| No billing | Stripe subscriptions ($149/$399/$499/$899) | Add |
| No CRM integration | MCP servers for Follow Up Boss, KvCore, etc. | Add |
| No LLM routing | LiteLLM gateway with tier-based model routing | Add |
| No memory | Letta + pgvector + Mem0 | Add |

---

## WEEK 1: FORK, RUN, MAP

### Objective
Fork Paperclip. Get it running locally. Deeply understand its data model and codebase. Map every entity to the Echelon equivalent. Document the mapping.

### Tasks

```
TASK 1.1: Fork and local setup
─────────────────────────────
□ Fork github.com/paperclipai/paperclip to your GitHub org
□ Clone locally
□ Run: pnpm install
□ Run: pnpm dev (starts API at localhost:3100 + React UI)
□ Complete the onboarding flow (create first "company" with AI CEO)
□ Verify the dashboard loads, agents appear, tasks can be created
□ Explore: create a second company — verify data isolation works
□ Document: what port, what env vars, what database setup happened
```

```
TASK 1.2: Map the data model
────────────────────────────
Read the database schema thoroughly. The schema likely lives in a
migrations folder or a schema definition file.

Map each Paperclip entity to its Echelon equivalent:

  Paperclip Entity    →  Echelon Entity          →  Notes
  ─────────────────────────────────────────────────────────
  Company             →  Tenant                   →  Add: plan, stripe_id, lead_cap,
                                                      token_budget, settings
  Company.mission     →  Tenant.business_focus    →  "Residential RE in Seattle"
  Agent               →  AIAgent                  →  Add: agent_type enum (scout,
                                                      sage, quill, closer, nurture,
                                                      atlas, shield), model_tier,
                                                      memory_config
  Agent.role          →  AIAgent.agent_type       →  Fixed enum, not free text
  Agent.budget        →  AIAgent.monthly_budget   →  Keep as-is — this is perfect
  Agent.heartbeat     →  AIAgent.last_heartbeat   →  Keep as-is
  Project             →  Pipeline                 →  "Active Leads", "Under Contract",
                                                      "Closed", "Nurturing"
  Task/Ticket         →  Task                     →  Add: task_type enum (lead_response,
                                                      cma_generation, listing_description,
                                                      deadline_alert, compliance_check,
                                                      follow_up, etc.)
  Task.conversation   →  Task.messages            →  Keep threaded conversation model
  Task.status         →  Task.status              →  Adapt states: pending, in_progress,
                                                      completed, failed, human_review
  Audit Log           →  AuditLog                 →  Keep as-is — append-only
  Extension           →  MCPServer                →  Each MCP server = an extension
  N/A                 →  Contact                  →  NEW: leads and clients
  N/A                 →  Transaction              →  NEW: RE transaction lifecycle
  N/A                 →  Conversation             →  NEW: agent-client comms
  N/A                 →  Embedding                →  NEW: pgvector table
  N/A                 →  UsageEvent               →  NEW: token/cost tracking

Create a file: docs/entity-mapping.md with this mapping.
Include the original Paperclip column names alongside new Echelon names.
```

```
TASK 1.3: Map the API routes
────────────────────────────
Document every API endpoint Paperclip exposes:

  Route                    Method   Purpose              Keep/Adapt/Remove
  ──────────────────────────────────────────────────────────────────────
  /api/companies           GET      List companies       ADAPT → /api/tenants
  /api/companies/:id       GET      Get company          ADAPT → /api/tenants/:id
  /api/agents              GET      List agents          ADAPT → /api/ai-agents
  /api/agents/:id          POST     Create agent         ADAPT (fixed types, not BYOA)
  /api/agents/:id/heartbeat POST    Agent heartbeat      KEEP — core coordination
  /api/tasks               GET      List tasks           ADAPT → add task_type filter
  /api/tasks/:id           POST     Create task          ADAPT → add RE-specific fields
  /api/tasks/:id/checkout  POST     Lock task for agent  KEEP — atomic checkout
  /api/audit-log           GET      Get audit trail      KEEP
  /api/budget              GET      Budget status        KEEP
  ...

Create a file: docs/api-mapping.md with this mapping.
```

```
TASK 1.4: Identify the heartbeat system
───────────────────────────────────────
This is the most important subsystem to understand. Find and document:

□ How does the heartbeat scheduler work? (cron? setInterval? external trigger?)
□ What happens when an agent "wakes up"?
  - Does it query for available tasks?
  - Does it check budget before acting?
  - What's the default heartbeat interval?
□ How does task delegation work?
  - Can agents delegate to other agents?
  - Is there a priority queue?
□ How does the budget enforcement actually work in code?
  - Where is the budget check?
  - What happens at 80%? At 100%?
  - Is it atomic (race-condition safe)?

Document in: docs/heartbeat-system.md

This system becomes the core loop for all 7 Echelon agents:
  Heartbeat fires → Agent wakes →
  Check budget (if over → skip/throttle) →
  Query task queue (filtered by agent_type) →
  Checkout task (atomic lock) →
  Execute (call LangGraph graph) →
  Log result + update tokens_used →
  Sleep until next heartbeat
```

```
TASK 1.5: Identify what to delete
─────────────────────────────────
List everything that should be REMOVED in the fork:

□ Clipmart marketplace code (defer to Phase 4)
□ Generic agent creation UI (we have fixed 7 agent types)
□ Agent "hiring" flow (agents are pre-configured per plan, not hired ad-hoc)
□ Any AI-model-specific code (we use LiteLLM, not direct model calls)
□ Any auth code (we replace with Supabase Auth)
□ The React frontend (we replace with Next.js 16)
□ PGlite / embedded database setup (we use Supabase Postgres)
□ Any telemetry / analytics sending to Paperclip servers

DO NOT DELETE YET. Just document what goes in: docs/deletion-plan.md
```

### Week 1 Deliverable
A fully documented mapping of Paperclip → Echelon with 5 markdown files:
- `docs/entity-mapping.md`
- `docs/api-mapping.md`
- `docs/heartbeat-system.md`
- `docs/deletion-plan.md`
- `docs/fork-notes.md` (any surprises, gotchas, or architecture insights)

---

## WEEK 2: STRIP UI, WIRE SUPABASE, BUILD SHELL

### Objective
Remove Paperclip's React frontend. Replace with Next.js 16 + shadcn/ui v4. Replace Paperclip's auth with Supabase Auth. Replace embedded Postgres with Supabase Postgres. Keep the API server and heartbeat system running.

### Tasks

```
TASK 2.1: Set up Supabase project
─────────────────────────────────
□ Create Supabase project (or use existing)
□ Enable pgvector extension:
    CREATE EXTENSION IF NOT EXISTS vector;
□ Run the Echelon schema migration (from implementation spec Section 6):
    - tenants
    - team_members
    - ai_agents
    - contacts
    - conversations
    - tasks
    - transactions
    - embeddings (pgvector)
    - usage_events
□ Apply RLS policies to ALL tables:
    ALTER TABLE [table] ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "tenant_isolation" ON [table]
      FOR ALL
      USING (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid);
□ Verify: create two test tenants, insert data, confirm tenant A cannot see tenant B
□ Set up Supabase Auth (enable email/password + Google OAuth provider)
□ Configure auth to include tenant_id in JWT app_metadata on signup
```

```
TASK 2.2: Point Paperclip's API server to Supabase
───────────────────────────────────────────────────
□ Find where Paperclip connects to its database
□ Replace the connection string with Supabase DATABASE_URL
□ Update any ORM/query layer to work with the new Echelon schema
□ Replace Paperclip's auth middleware with Supabase JWT verification:
    - Extract JWT from Authorization header
    - Verify with Supabase JWKS
    - Extract tenant_id from app_metadata
    - Attach to request context
□ Update all API routes to use tenant_id from JWT (not from URL params)
□ Test: API server starts, connects to Supabase, auth works
□ Test: heartbeat system still functions against Supabase Postgres
```

```
TASK 2.3: Initialize Next.js 16 app
───────────────────────────────────
□ Create apps/web directory in monorepo
□ npx create-next-app@latest with App Router, TypeScript, Tailwind CSS 4
□ Install and configure shadcn/ui v4:
    npx shadcn@latest init
    npx shadcn@latest add button card input label tabs avatar badge
    npx shadcn@latest add dialog dropdown-menu separator sheet
    npx shadcn@latest add table tooltip progress
□ Install Supabase client:
    npm install @supabase/supabase-js @supabase/ssr
□ Set up Supabase client utilities:
    - lib/supabase/client.ts (browser client)
    - lib/supabase/server.ts (server component client)
    - lib/supabase/middleware.ts (auth middleware for Next.js)
□ Create middleware.ts for auth route protection
□ Build auth pages:
    - /login (email + Google OAuth)
    - /signup (with plan selection: Solo $149, Team $399, etc.)
    - /auth/callback (OAuth callback handler)
□ Build layout:
    - Root layout with dark/light theme support
    - Authenticated layout with sidebar navigation
    - Sidebar: Dashboard, Agents, Leads, Transactions, Analytics, Settings
```

```
TASK 2.4: Delete Paperclip's React frontend
───────────────────────────────────────────
□ Remove the original React frontend directory from the fork
□ Update pnpm-workspace.yaml to point to apps/web as the frontend
□ Ensure the API server still runs independently (decoupled from frontend)
□ Verify: pnpm dev starts API server + Next.js app together
□ Proxy API calls: Next.js → Paperclip API server (or merge into Next.js API routes)
```

```
TASK 2.5: Set up Infisical for secrets
─────────────────────────────────────
□ Docker compose up infisical
□ Create Echelon project in Infisical
□ Store all secrets:
    - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
    - OPENAI_API_KEY, ANTHROPIC_API_KEY
    - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
    - STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
    - COMPOSIO_API_KEY
    - LITELLM_MASTER_KEY
□ Configure API server and Next.js to pull secrets from Infisical SDK
□ Remove any hardcoded secrets from codebase
□ Verify: app starts and connects to all services via Infisical-managed secrets
```

### Week 2 Deliverable
- Paperclip API server running against Supabase Postgres with Supabase Auth
- Next.js 16 app shell with auth flow (login/signup/protected routes)
- Sidebar navigation to all major pages (empty for now)
- RLS verified across two test tenants
- Infisical managing all secrets
- Original React frontend deleted

---

## WEEK 3: LANGGRAPH AGENTS + LITELLM

### Objective
Replace Paperclip's generic BYOA model with LangGraph-backed agent definitions for Scout and Atlas. Wire up LiteLLM for model routing. Connect Scout to real MCP servers. The heartbeat system triggers LangGraph graphs instead of generic agent runtimes.

### Tasks

```
TASK 3.1: Set up LiteLLM proxy
──────────────────────────────
□ Docker compose add litellm proxy service
□ Configure litellm_config.yaml:

    model_list:
      - model_name: assistant-tier
        litellm_params:
          model: openai/gpt-4o-mini
          api_key: os.environ/OPENAI_API_KEY
        model_info:
          description: "Fast, cheap. For Scout and Atlas."

      - model_name: assistant-tier-fallback
        litellm_params:
          model: anthropic/claude-3-5-haiku-latest
          api_key: os.environ/ANTHROPIC_API_KEY

      - model_name: associate-tier
        litellm_params:
          model: anthropic/claude-sonnet-4-20250514
          api_key: os.environ/ANTHROPIC_API_KEY

      - model_name: broker-tier
        litellm_params:
          model: anthropic/claude-opus-4-20250514
          api_key: os.environ/ANTHROPIC_API_KEY

    router_settings:
      routing_strategy: "simple-shuffle"
      num_retries: 2
      timeout: 30
      fallbacks:
        - assistant-tier: [assistant-tier-fallback]

    general_settings:
      master_key: os.environ/LITELLM_MASTER_KEY

□ Verify: curl litellm proxy with test message, get response
□ Set up per-tenant virtual keys with budget limits:
    - Solo tier: $40/month budget
    - Team tier: $80/month budget
    - Brokerage tier: $120/month budget
□ Test budget enforcement: send requests until budget hit, verify throttle
```

```
TASK 3.2: Build Scout LangGraph agent
─────────────────────────────────────
Create agents/scout/ directory with the following files:

agents/scout/graph.py:
  - Define StateGraph with ScoutState TypedDict:
      {
        lead: dict,           # incoming lead data
        source: str,          # zillow, referral, website, open_house
        is_returning: bool,   # found in Letta recall?
        qualification: dict,  # budget, timeline, pre_approval, intent
        action: str,          # schedule, nurture, skip
        response_text: str,   # SMS/email content to send
        crm_contact_id: str,  # created/updated CRM contact
        messages: list,       # conversation history
      }

  - Define nodes (each is a Python function):
      receive_lead(state)     → parse incoming lead data, normalize fields
      classify_source(state)  → determine lead source from metadata
      check_returning(state)  → query Letta recall memory for this phone/email
      qualify_lead(state)     → LLM call (via LiteLLM) to extract qualification
      decide_action(state)    → conditional: hot→schedule, warm→nurture, cold→skip
      create_crm_contact(state) → call mcp-followupboss to create/update contact
      generate_response(state)  → LLM call to write personalized SMS
      send_response(state)    → call mcp-twilio to send SMS
      schedule_showing(state) → call mcp-calendar if action=schedule
      set_followup_timer(state) → call Trigger.dev to schedule 24hr follow-up
      log_completion(state)   → update task status, log tokens used

  - Define edges:
      receive_lead → classify_source → check_returning → qualify_lead →
      decide_action →
        ├─ "schedule" → create_crm_contact → generate_response → send_response → schedule_showing → set_followup_timer → log_completion
        ├─ "nurture"  → create_crm_contact → generate_response → send_response → set_followup_timer → log_completion
        └─ "skip"     → log_completion

  - Compile graph: graph = workflow.compile()

agents/scout/persona.md:
  - Adapted from Agency-Agents fork
  - Role: Lead Response Specialist for real estate
  - Personality: Warm, professional, responsive, never pushy
  - Knowledge: Real estate terminology, local market awareness
  - Constraints: Never claim to be human, always identify as AI assistant
  - Fair housing: Never reference protected classes in any communication
  - Response style: Brief for SMS (under 160 chars), detailed for email

agents/scout/tests/test_graph.py:
  - Test: Zillow lead → correct source classification
  - Test: Returning lead → is_returning=True
  - Test: Hot lead (pre-approved, immediate timeline) → action=schedule
  - Test: Warm lead (browsing, 6+ months) → action=nurture
  - Test: Spam/invalid → action=skip
  - Test: Response generated in < 5 seconds (LLM latency)
  - Test: CRM contact created with correct fields
  - Test: SMS sent via Twilio mock
```

```
TASK 3.3: Build Atlas LangGraph agent
─────────────────────────────────────
Create agents/atlas/ directory. Simpler than Scout — task-based.

agents/atlas/graph.py:
  - StateGraph with AtlasState:
      {
        task: dict,          # incoming task description
        task_type: str,      # crm_update, schedule_showing, weekly_report, etc.
        result: dict,        # task output
        messages: list,
      }

  - Nodes:
      receive_task(state)    → parse task from queue
      categorize(state)      → determine task_type
      execute_crm_update(state)     → call mcp-followupboss
      execute_schedule(state)       → call mcp-calendar
      execute_weekly_report(state)  → aggregate week's data, generate summary
      report_completion(state)      → update task status

  - Conditional routing based on task_type
```

```
TASK 3.4: Connect heartbeat to LangGraph
────────────────────────────────────────
This is the critical integration point. Paperclip's heartbeat system
must trigger LangGraph graphs instead of generic agent runtimes.

□ Find Paperclip's heartbeat handler (the code that runs when an agent "wakes up")
□ Modify the handler to:
    1. Look up agent_type for this agent (scout, atlas, etc.)
    2. Check budget (tokens_used < monthly_budget)
    3. If over budget → log + skip (or throttle to cheaper model)
    4. Query task queue for tasks matching this agent_type
    5. Checkout task (atomic lock)
    6. Based on agent_type, invoke the corresponding LangGraph graph:
        scout  → from agents.scout.graph import graph; graph.invoke(state)
        atlas  → from agents.atlas.graph import graph; graph.invoke(state)
    7. On completion: update task status, log tokens used, release lock
    8. On failure: release lock, mark task as failed, log error

□ Handle the Python ↔ Node.js bridge:
    Option A: Run Python agents as a separate FastAPI service,
              heartbeat handler makes HTTP call to it
    Option B: Use child_process to invoke Python scripts
    Option C: Rewrite heartbeat handler in Python (if migrating API server)

    RECOMMENDED: Option A — FastAPI agent service at port 3200
    The Paperclip Node.js server handles heartbeats and task management.
    When it's time to execute, it calls the Python FastAPI service with
    the task payload. The Python service runs the LangGraph graph and
    returns the result.

□ Create agents/api.py (FastAPI service):
    POST /agents/scout/invoke  → run Scout graph
    POST /agents/atlas/invoke  → run Atlas graph
    POST /agents/{type}/invoke → generic invoke endpoint
    Each endpoint: receives task JSON, runs graph, returns result JSON

□ Test: heartbeat fires → Scout graph invoked → lead processed → CRM updated
```

```
TASK 3.5: Build P0 MCP servers (stubs for now)
──────────────────────────────────────────────
Create mcp-servers/ directory. Each MCP server is a FastAPI app with
SSE transport following the MCP protocol.

For Week 3, build functional stubs that log calls and return mock data.
Real API integration happens in Week 4 and Phase 2.

mcp-servers/mcp-followupboss/
  □ server.py — FastAPI + SSE MCP transport
  □ tools.py — Tool definitions:
      create_contact(first_name, last_name, email, phone, source, notes)
      update_contact(contact_id, updates)
      get_contact(contact_id)
      search_contacts(query)
      update_lead_status(contact_id, status)
  □ auth.py — Composio OAuth token retrieval (stub: return test token)
  □ Tests with mock data

mcp-servers/mcp-twilio/
  □ tools.py:
      send_sms(to, body)
      send_mms(to, body, media_url)
  □ For dev: log SMS to console instead of sending

mcp-servers/mcp-calendar/
  □ tools.py:
      check_availability(date, duration_minutes)
      create_event(title, date, time, duration, attendee_email)
      list_upcoming(days_ahead)

mcp-servers/mcp-zillow-leads/
  □ tools.py:
      parse_lead_webhook(payload)
      parse_lead_email(email_body)

Each server follows the shared pattern:
  □ mcp-servers/shared/tenant.py — extract + validate tenant_id from request
  □ mcp-servers/shared/rate_limit.py — per-tenant rate limiting
  □ mcp-servers/shared/security.py — input sanitization (OWASP MCP Top 10)
```

### Week 3 Deliverable
- LiteLLM proxy running with Assistant tier model routing
- Scout LangGraph graph: receives lead → qualifies → responds via SMS → updates CRM
- Atlas LangGraph graph: receives task → executes CRM update / schedule / report
- Heartbeat system triggers LangGraph graphs via FastAPI bridge
- 4 MCP server stubs (followupboss, twilio, calendar, zillow-leads)
- All tests passing

---

## WEEK 4: DASHBOARD + STRIPE + BETA LAUNCH

### Objective
Build the customer-facing dashboard views. Connect Stripe billing. Deploy. Invite first beta users.

### Tasks

```
TASK 4.1: "My AI Team" page (adapted from Paperclip org chart)
─────────────────────────────────────────────────────────────
Build: apps/web/app/(dashboard)/agents/page.tsx

Display the tenant's AI team as a grid of agent cards.
For Solo plan: show Scout + Atlas (active) + others (locked/upgrade prompt).
For Team plan: show Scout + Quill + Nurture + Shield + Atlas (active).

Each agent card shows:
  □ Agent name + emoji (⚡ Scout, 🗂️ Atlas, etc.)
  □ Status indicator (active / paused / over_budget) — green/yellow/red dot
  □ Role description (one line)
  □ This month's stats:
      - Scout: leads responded, avg response time, appointments booked
      - Atlas: tasks completed, hours saved estimate
  □ Token usage bar (used / budget, with percentage)
  □ Last heartbeat timestamp ("Active 2 minutes ago")
  □ Click → navigates to /agents/[type] detail page

Agent detail page (/agents/[type]/page.tsx):
  □ Full conversation history (threaded, from tasks table)
  □ Performance chart (leads/day, response time trend — use recharts)
  □ Configuration panel (notification preferences, response tone)
  □ Pause/Resume button
```

```
TASK 4.2: "Lead Activity" page (adapted from Paperclip ticket system)
────────────────────────────────────────────────────────────────────
Build: apps/web/app/(dashboard)/leads/page.tsx

Real-time feed showing Scout's lead processing activity.
Uses Supabase Realtime subscriptions for live updates.

  □ Activity feed (newest first):
      - "⚡ Scout responded to John Smith (Zillow) in 47 seconds"
      - "⚡ Scout qualified Sarah Jones — Hot lead, pre-approved, $500K budget"
      - "⚡ Scout scheduled showing for Mike Lee — Tomorrow 2:00 PM"
      - "🗂️ Atlas updated CRM for John Smith — status: contacted"

  □ Lead pipeline kanban (drag-and-drop with shadcn):
      New → Contacted → Qualified → Showing → Under Contract → Closed

  □ Lead detail modal (click any lead):
      - Contact info (synced from CRM)
      - Qualification data (budget, timeline, pre-approval)
      - Conversation thread (Scout's messages + lead's responses)
      - Agent notes (Atlas meeting prep, Nurture touchpoints)
      - Action buttons: "Assign to me", "Schedule callback", "Mark lost"

  □ Supabase Realtime subscription:
      subscribe to tasks table where tenant_id = current tenant
      on INSERT → add to activity feed with animation
      on UPDATE → update status in kanban
```

```
TASK 4.3: Settings page
──────────────────────
Build: apps/web/app/(dashboard)/settings/page.tsx

Tabs: Integrations | Team | Notifications | Billing

Integrations tab:
  □ Follow Up Boss connection:
      - "Connect Follow Up Boss" button → Composio OAuth flow
      - Show connection status (connected / disconnected)
      - Test connection button (calls mcp-followupboss/get_contact with test ID)
  □ Zillow Leads connection:
      - Show webhook URL to paste into Zillow Premier Agent dashboard
      - Status: "Waiting for first lead" / "Connected — 23 leads received"
  □ Google Calendar connection:
      - OAuth flow via Composio
      - Show which calendar is selected for showings
  □ Placeholder cards for Phase 2 integrations (KvCore, MLS, Dotloop) — "Coming Soon"

Team tab:
  □ Invite team members (email invite)
  □ Role assignment (owner, admin, agent, viewer)
  □ List current members with role badges

Notifications tab:
  □ Toggle: Email notifications for new leads
  □ Toggle: SMS notifications for hot leads
  □ Toggle: Daily summary email
  □ Toggle: Weekly report email

Billing tab:
  □ Embed Stripe Customer Portal (plan management, payment method, invoices)
  □ Show current plan with upgrade prompts
  □ Show usage dashboard: tokens consumed this month per agent
```

```
TASK 4.4: Stripe billing integration
────────────────────────────────────
□ Create Stripe products + prices:
    - Solo Plan: $149/month (price_solo_monthly)
    - Solo Plan: $1,192/year — 20% discount (price_solo_annual)
    - Team Plan: $399/month (price_team_monthly)
    - Team Plan: $3,192/year (price_team_annual)
    - Investor Pro Plan: $499/month (price_investor_monthly)
    - Brokerage Plan: $899/month (price_brokerage_monthly)
    - Enterprise: handled via manual invoicing

□ Build checkout flow:
    /signup → select plan → Stripe Checkout Session → redirect to /dashboard
    On checkout.session.completed webhook:
      - Create tenant in Supabase
      - Set plan, lead_cap, token_budget based on selected price
      - Create default AI agents for the plan tier
      - Set tenant_id in user's auth.users app_metadata

□ Build plan management:
    Stripe Customer Portal for:
      - Upgrade/downgrade plan
      - Update payment method
      - View invoices
      - Cancel subscription

□ Build usage tracking:
    - On every LLM call: log to usage_events table (tenant_id, agent_type, model, tokens, cost)
    - Aggregate daily for dashboard display
    - NOT used for billing — display only (we charge flat, not per-token)

□ Webhook handler (Supabase Edge Function or Next.js API route):
    - checkout.session.completed → create tenant
    - customer.subscription.updated → update plan
    - customer.subscription.deleted → mark tenant as churned
    - invoice.payment_failed → flag for follow-up
```

```
TASK 4.5: Deploy + beta launch
──────────────────────────────
□ Deploy Next.js app to Vercel
    - Set environment variables from Infisical
    - Configure custom domain (app.echelon.ai or similar)

□ Deploy agent runtime (Docker Compose on Railway / Render / EC2):
    - LiteLLM proxy container
    - Python FastAPI agent service container
    - MCP server containers (or combined into one service)
    - Infisical container (or use cloud)
    - n8n container (for Zillow webhook routing)

□ Set up n8n workflow:
    - Trigger: Zillow webhook received
    - Action: Parse lead data
    - Action: Call Supabase Edge Function to create task for Scout
    - Action: Scout heartbeat picks up task

□ Set up Trigger.dev:
    - Job: scout-followup-24hr — send follow-up SMS if no response
    - Job: scout-followup-72hr — second follow-up
    - Job: atlas-weekly-report — generate and email weekly summary

□ Smoke test full flow:
    1. Submit test lead via Zillow webhook simulator
    2. Verify Scout picks up in < 30 seconds
    3. Verify SMS sent to test number
    4. Verify CRM contact created in Follow Up Boss
    5. Verify showing scheduled in Google Calendar
    6. Verify activity appears in dashboard real-time
    7. Verify LangSmith trace shows full flow
    8. Verify usage_events table shows token consumption
    9. Verify Stripe subscription active
    10. Verify Tenant B cannot see Tenant A's data

□ Invite 20 beta users:
    - Source: Local RE agent contacts, RE Facebook groups, Inman forum
    - Offer: 30 days free, then Solo plan at $149/mo
    - Set up weekly feedback call schedule (every Friday 30min)
    - Create feedback form (Google Form or Typeform)
    - Set up Slack channel for beta user community
```

### Week 4 Deliverable
- "My AI Team" dashboard with Scout + Atlas cards showing live metrics
- "Lead Activity" page with real-time feed + kanban pipeline
- Settings page with Follow Up Boss OAuth connection flow
- Stripe billing: signup → checkout → active subscription → customer portal
- Deployed to production (Vercel + Docker)
- Full flow tested: Zillow lead → Scout → SMS → CRM → Calendar → Dashboard
- 20 beta users invited with onboarding schedule

---

## VERIFICATION CHECKLIST

Before declaring Week 4 complete, run through every item:

```
INFRASTRUCTURE
  □ Supabase: all 9 tables created with RLS policies
  □ pgvector: extension enabled, embeddings table with HNSW index
  □ LiteLLM: proxy running, assistant-tier routing to GPT-4o-mini
  □ Infisical: all secrets managed, zero hardcoded credentials
  □ Vercel: Next.js deployed with custom domain
  □ Docker: agent runtime + MCP servers running
  □ n8n: Zillow webhook workflow active
  □ Trigger.dev: follow-up timer jobs registered

SCOUT AGENT
  □ Responds to inbound lead via SMS in < 60 seconds
  □ Correctly classifies lead source (Zillow, referral, website)
  □ Qualifies lead (budget, timeline, pre-approval, buying vs selling)
  □ Creates contact in Follow Up Boss via mcp-followupboss
  □ Schedules showing via Google Calendar via mcp-calendar
  □ Triggers 24-hour follow-up via Trigger.dev
  □ Handles after-hours leads (10 PM test)

ATLAS AGENT
  □ Executes CRM update task from queue
  □ Generates weekly activity report
  □ Coordinates showing schedule

MULTI-TENANCY
  □ Tenant A's leads invisible to Tenant B (RLS verified)
  □ Tenant A's MCP calls use Tenant A's CRM credentials only
  □ Budget enforcement: agent throttles at cap, does not exceed

DASHBOARD
  □ Login/signup flow works (email + Google OAuth)
  □ "My AI Team" shows Scout + Atlas with live status
  □ "Lead Activity" shows real-time feed via Supabase Realtime
  □ Settings: Follow Up Boss OAuth connection works
  □ Settings: Billing shows Stripe customer portal

BILLING
  □ Stripe checkout creates tenant with correct plan
  □ Plan determines which agents are active
  □ Usage tracking logs tokens per agent (display only)
  □ Customer portal allows plan change and cancellation

OBSERVABILITY
  □ LangSmith shows trace for full lead → response flow
  □ Usage dashboard shows tokens + cost per agent
```

---

## NOTES FOR THE CODING AGENT

1. **Do not over-engineer.** This is an MVP. Scout needs to respond to leads fast and correctly. It does not need to handle every edge case. Ship, then iterate based on beta feedback.

2. **The heartbeat → LangGraph bridge is the hardest part.** Expect to spend 40% of Week 3 on this. The Node.js ↔ Python boundary is where most bugs will live. Use clear HTTP contracts and comprehensive error handling.

3. **Test with real data early.** By end of Week 3, you should be processing test leads through the full pipeline — not waiting until Week 4 to integrate.

4. **Paperclip's budget enforcement is a gift.** Don't rewrite it. Understand it, adapt the numbers, and let it work. It solves the hardest product problem (cost control) for free.

5. **RLS is non-negotiable.** Every table, every query. If you find yourself writing `WHERE tenant_id = ?` in application code, something is wrong — RLS should handle it.

6. **Use Supabase Realtime for the dashboard.** Don't poll. Subscribe to the tasks table and stream updates to the Lead Activity feed. This is the "wow" moment for beta users — seeing Scout process a lead in real-time.

7. **Keep the audit log.** Paperclip's append-only audit log becomes critical for Shield (Phase 2) and enterprise compliance (Phase 4). Don't remove it. Don't make it mutable.

---

*This GSD prompt covers the complete Paperclip Fork → Echelon Control Plane execution over 4 weeks. Hand this to Claude Code or Codex CLI and execute sequentially. Each week's deliverable is independently verifiable.*

*— Sentinel, Lead Architect*
