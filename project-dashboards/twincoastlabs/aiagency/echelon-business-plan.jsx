import { useState } from "react";

// ─── Colors ────────────────────────────────────────────
const C = {
  bg: "#07090d", surface: "#0f1218", card: "#161b24", cardHi: "#1c2230",
  border: "#222938", borderHi: "#343d50", text: "#e8eaf0", muted: "#7b8399",
  dim: "#515a6e",
  // Brand palette – warm gold + deep navy
  gold: "#d4a24e", goldLight: "#e8c47a", goldDim: "#a37a2e",
  navy: "#1a2744", navyLight: "#243459",
  accent: "#5b8cf7", green: "#34d399", red: "#f87171",
  purple: "#a78bfa", teal: "#2dd4bf", pink: "#f472b6", cyan: "#22d3ee",
};

const pill = (c, filled) => ({
  display: "inline-block", fontSize: 9, fontWeight: 700, letterSpacing: ".07em",
  textTransform: "uppercase", padding: "2px 7px", borderRadius: 3,
  background: filled ? c : c + "15", color: filled ? "#000" : c,
  border: `1px solid ${c}44`,
});

const sTitle = { fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, marginBottom: 10 };

const TABS = ["Overview", "AI Agents", "Tech Stack", "Integrations", "Pricing", "GTM", "Roadmap"];

// ═══════════════════════════════════════════════════════
// TAB 0 — OVERVIEW
// ═══════════════════════════════════════════════════════
function Overview() {
  const stats = [
    { label: "Agents in the US", value: "2M+", color: C.gold },
    { label: "Avg lead response", value: "15 hrs", color: C.red },
    { label: "Leads lost to slow response", value: "78%", color: C.red },
    { label: "Conversion if <5min", value: "21×", color: C.green },
    { label: "RE tech spend / agent / yr", value: "$2,500+", color: C.gold },
    { label: "Inquiries unanswered", value: "48%", color: C.red },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.gold, marginBottom: 6 }}>The Problem</div>
        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7, maxWidth: 640 }}>
          Real estate agents lose deals before they compete. The average agent takes <span style={{ color: C.red, fontWeight: 700 }}>15+ hours</span> to respond to a lead — yet <span style={{ color: C.green, fontWeight: 700 }}>78% of buyers work with the first agent who responds</span>. Agents spending 30%+ of time on admin: writing listing descriptions, drafting follow-ups, scheduling showings, managing transaction documents. They're drowning in $2,500+/yr of disconnected software that doesn't talk to each other.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: C.muted, marginTop: 2, textTransform: "uppercase", letterSpacing: ".05em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.gold, marginBottom: 6 }}>The Solution</div>
        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7, maxWidth: 640 }}>
          An AI operations team built exclusively for real estate. Not a chatbot. Not a generic "AI employee." A team of specialized AI agents that plug into your existing tools (MLS, CRM, transaction management) and handle the work that's eating your day — lead response in under 60 seconds, listing content, follow-up sequences, transaction coordination, and market analysis. Flat monthly pricing. No credits. No surprises.
        </div>
      </div>

      <div style={{ background: C.navy, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: 16 }}>
        <div style={sTitle}>WHY WE WIN</div>
        {[
          ["Vertical depth, not horizontal breadth", "Every agent, integration, and workflow is purpose-built for real estate. We don't do 'everything for everyone.'"],
          ["Flat pricing, zero credit anxiety", "Monthly salary per AI team member. Hard usage caps with graceful degradation. No bill shock ever."],
          ["Your tools, connected", "Deep native integrations with Follow Up Boss, KvCore, Dotloop, SkySlope, MLS via RESO Web API. Not another silo."],
          ["AI that learns YOUR business", "Persistent memory across interactions. Your AI team remembers client preferences, past showings, offer history, and your communication style."],
          ["Measurable ROI, not vibes", "Per-agent cost tracking, lead conversion attribution, time-saved dashboards. Know exactly what you're getting for your money."],
        ].map(([title, desc], i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 4 ? 10 : 0 }}>
            <span style={{ color: C.gold, fontSize: 14, fontWeight: 800, lineHeight: 1.5, flexShrink: 0 }}>{i + 1}.</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{title}</div>
              <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TAB 1 — AI AGENTS
// ═══════════════════════════════════════════════════════
function AgentsTab() {
  const [selected, setSelected] = useState(0);

  const agents = [
    {
      name: "Scout", role: "Lead Response Agent", tier: "Assistant", color: C.teal,
      emoji: "⚡", model: "GPT-4o-mini / Claude Haiku",
      summary: "Responds to every inbound lead within 60 seconds, 24/7. Qualifies, schedules, and routes.",
      skills: [
        "Instant lead response via text/email (< 60 seconds)",
        "Lead qualification (budget, timeline, pre-approval status, buying vs. selling)",
        "Appointment scheduling integrated with your calendar",
        "Smart routing to the right agent on your team based on rules",
        "After-hours coverage — never miss a 10 PM Zillow inquiry again",
        "Source-aware responses (Zillow leads vs. referrals vs. website)",
      ],
      tools: ["Follow Up Boss", "KvCore", "Calendly/Google Calendar", "Zillow/Realtor.com webhooks", "Twilio SMS"],
      metrics: ["Speed-to-lead (target: <60s)", "Contact rate", "Qualification rate", "Appointments booked/week"],
    },
    {
      name: "Sage", role: "Market & Investment Intelligence", tier: "Associate", color: C.accent,
      emoji: "📊", model: "Claude Sonnet / GPT-4o",
      summary: "Your always-on market analyst. CMAs, neighborhood reports, pricing strategy, investment screening, and trend tracking. Covers PricingPro + DealScreen capabilities.",
      skills: [
        "Comparative Market Analysis (CMA) generation from MLS data",
        "Neighborhood market reports (avg days on market, price trends, inventory)",
        "Pricing strategy recommendations based on comps and market velocity",
        "Investment property screening (cap rate, cash-on-cash, DSCR, GRM)",
        "Rental comp analysis and rent estimate generation",
        "ARV estimation for fix-and-flip / BRRRR strategy evaluation",
        "Monthly market newsletter generation for your sphere",
        "Listing price alert monitoring for your active buyers",
      ],
      tools: ["MLS (RESO Web API)", "Public records / county assessor data", "Zillow/Redfin data APIs", "Rentcast API", "Google Maps API"],
      metrics: ["CMA accuracy vs. final sale price", "Reports generated/month", "Newsletter engagement rates", "Deal screen pass-through accuracy"],
    },
    {
      name: "Quill", role: "Content & Communications Agent", tier: "Associate", color: C.purple,
      emoji: "✍️", model: "Claude Sonnet / GPT-4o",
      summary: "Writes listing descriptions, social media posts, email campaigns, and client communications in YOUR voice.",
      skills: [
        "MLS listing descriptions (pulls property data, writes to your style)",
        "Social media posts for listings (Instagram, Facebook, LinkedIn)",
        "Personalized follow-up email sequences (drip campaigns)",
        "Open house promotion materials and post-event follow-ups",
        "Showing feedback collection and synthesis from buyers",
        "Just-listed / just-sold announcement templates",
        "Review request messages to past clients",
      ],
      tools: ["MLS listing data", "Canva API (image templates)", "Mailchimp/Brevo", "Social media scheduling"],
      metrics: ["Content pieces generated/month", "Email open rates", "Listing description time saved"],
    },
    {
      name: "Closer", role: "Transaction Coordinator Agent", tier: "Broker", color: C.gold,
      emoji: "📋", model: "Claude Opus / GPT-4.5",
      summary: "Manages the entire transaction lifecycle from accepted offer to closing — deadlines, documents, and all parties.",
      skills: [
        "Transaction timeline management (inspection, appraisal, financing, closing deadlines)",
        "Document checklist tracking and missing-doc alerts",
        "Contract clause summarization (highlight key terms, contingencies, red flags)",
        "Multi-party coordination (buyer agent, listing agent, lender, title, inspector)",
        "Deadline reminder notifications to all parties",
        "Compliance document verification (state-specific disclosure requirements)",
        "Closing cost estimate preparation",
      ],
      tools: ["Dotloop", "SkySlope", "DocuSign", "Google Drive/Dropbox", "Slack/Email"],
      metrics: ["Transactions managed", "Deadlines hit rate (%)", "Time saved per transaction", "Error/miss rate"],
    },
    {
      name: "Nurture", role: "Client Relationship Agent", tier: "Associate", color: C.pink,
      emoji: "💬", model: "Claude Sonnet / GPT-4o",
      summary: "Keeps your database warm. Birthday messages, home anniversaries, market updates, and re-engagement campaigns.",
      skills: [
        "Automated birthday and home anniversary messages",
        "Sphere-of-influence drip campaigns (customized by relationship type)",
        "Seasonal check-ins (market updates tied to their neighborhood)",
        "Re-engagement sequences for cold leads (6-12 month nurture)",
        "Referral request automation (timed to post-closing satisfaction window)",
        "Home value update alerts for past clients (retention + listing lead gen)",
        "Event invitation management (client appreciation events)",
      ],
      tools: ["CRM (Follow Up Boss / KvCore)", "Email/SMS", "MLS (home value data)", "Calendar"],
      metrics: ["Database touch frequency", "Referrals generated", "Re-engagement conversion rate", "Client retention"],
    },
    {
      name: "Atlas", role: "Ops & Admin Agent", tier: "Assistant", color: C.green,
      emoji: "🗂️", model: "GPT-4o-mini / Claude Haiku",
      summary: "The glue. Handles scheduling, data entry, CRM hygiene, and all the admin tasks that steal your selling time.",
      skills: [
        "CRM data entry and contact deduplication",
        "Showing schedule coordination across multiple buyers",
        "Meeting prep briefs (pull up property history, client notes before appointments)",
        "Expense tracking and categorization for tax prep",
        "MLS listing input from agent notes/photos",
        "Weekly activity reports (leads, showings, offers, closings)",
        "Vendor coordination (photographers, stagers, inspectors)",
      ],
      tools: ["CRM", "Google Workspace / Outlook", "QuickBooks", "MLS", "Calendly"],
      metrics: ["Admin hours saved/week", "Data accuracy rate", "Tasks completed/week"],
    },
    {
      name: "Shield", role: "Compliance & Risk Agent", tier: "Broker", color: C.red,
      emoji: "🛡️", model: "Claude Opus / GPT-4.5",
      summary: "Your compliance safety net. Disclosure verification, fair housing checks, NAR settlement compliance, and E&O risk reduction. Covers DisclosureGuard + BuyerBridge.",
      skills: [
        "Property disclosure gap analysis against county records + permit history",
        "Fair housing language compliance scanning on all Quill-generated content",
        "NAR settlement compliance — buyer agreement generation + compensation disclosure",
        "State-specific disclosure requirement checklists (auto-updated per jurisdiction)",
        "E&O risk scoring per transaction (flags high-risk items for agent review)",
        "Permit history verification (unpermitted work detection from county records)",
        "Contract clause red flag alerts (non-standard terms, missing contingencies)",
        "Quality gate for Quill + Closer outputs — all content compliance-checked before delivery",
      ],
      tools: ["County assessor records", "Permit databases", "MLS property history", "State RE commission rules", "Document parsing (Unstructured)"],
      metrics: ["Disclosure gaps caught/month", "Fair housing violations prevented", "E&O risk score accuracy", "Compliance check pass rate"],
    },
  ];

  const a = agents[selected];

  return (
    <div>
      <div style={sTitle}>YOUR AI OPERATIONS TEAM — 7 SPECIALIZED AGENTS</div>

      {/* Agent selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginBottom: 14 }}>
        {agents.map((ag, i) => (
          <button key={ag.name} onClick={() => setSelected(i)} style={{
            background: selected === i ? ag.color + "18" : C.card,
            border: `1px solid ${selected === i ? ag.color + "66" : C.border}`,
            borderRadius: 8, padding: "8px 10px", cursor: "pointer", textAlign: "left",
            transition: "all .15s", fontFamily: "inherit",
          }}>
            <div style={{ fontSize: 14 }}>{ag.emoji}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: selected === i ? ag.color : C.text }}>{ag.name}</div>
            <div style={{ fontSize: 9, color: C.muted }}>{ag.role}</div>
          </button>
        ))}
      </div>

      {/* Agent detail */}
      <div style={{ background: C.card, border: `1px solid ${a.color}33`, borderRadius: 10, padding: 16, borderTop: `3px solid ${a.color}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 900, color: a.color, marginRight: 8 }}>{a.emoji} {a.name}</span>
            <span style={pill(a.color, false)}>{a.tier} tier</span>
          </div>
          <span style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>{a.model}</span>
        </div>
        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, marginBottom: 14 }}>{a.summary}</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ ...sTitle, color: a.color }}>SKILLS</div>
            {a.skills.map((s, i) => (
              <div key={i} style={{ fontSize: 10, color: C.muted, lineHeight: 1.6, display: "flex", gap: 5, marginBottom: 2 }}>
                <span style={{ color: a.color, flexShrink: 0 }}>▸</span>{s}
              </div>
            ))}
          </div>
          <div>
            <div style={{ ...sTitle, color: a.color }}>INTEGRATIONS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
              {a.tools.map(t => <span key={t} style={pill(a.color, false)}>{t}</span>)}
            </div>
            <div style={{ ...sTitle, color: a.color }}>SUCCESS METRICS</div>
            {a.metrics.map((m, i) => (
              <div key={i} style={{ fontSize: 10, color: C.muted, lineHeight: 1.7, display: "flex", gap: 5 }}>
                <span style={{ color: C.green, flexShrink: 0 }}>✓</span>{m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TAB 2 — INTEGRATIONS
// ═══════════════════════════════════════════════════════
function IntegrationsTab() {
  const categories = [
    {
      name: "CRM Systems", color: C.accent, priority: "Launch",
      items: [
        { name: "Follow Up Boss", method: "REST API + Webhooks", status: "P0", note: "Most popular among top producers. 250+ integrations. Central hub." },
        { name: "KvCore (BoldTrail)", method: "API", status: "P0", note: "Enterprise-grade. Dominant in large brokerages. IDX + CRM + marketing." },
        { name: "LionDesk", method: "API", status: "P1", note: "Budget-friendly. Popular with solo agents. Strong SMS features." },
        { name: "Top Producer", method: "API + MLS data", status: "P1", note: "Legacy but trusted. 320+ MLS boards. Deep market data." },
        { name: "Wise Agent", method: "API", status: "P2", note: "Growing mid-market. Good transaction management." },
      ],
    },
    {
      name: "MLS Access", color: C.gold, priority: "Launch",
      items: [
        { name: "RESO Web API", method: "OData + OAuth 2.0", status: "P0", note: "Industry standard. 800+ MLSs transitioning to this. Future-proof." },
        { name: "Bridge Interactive", method: "REST API", status: "P0", note: "MLS data aggregator. Covers 200+ MLSs in one connection." },
        { name: "Spark/Flexmls API", method: "REST API", status: "P1", note: "FBS Products. Powers many regional MLSs." },
        { name: "Trestle (CoreLogic)", method: "RESO-compliant", status: "P1", note: "Massive coverage. CoreLogic data backbone." },
      ],
    },
    {
      name: "Transaction Management", color: C.green, priority: "Phase 2",
      items: [
        { name: "Dotloop", method: "REST API", status: "P0", note: "Zillow-owned. Popular for e-signatures + transaction tracking." },
        { name: "SkySlope", method: "API", status: "P0", note: "Compliance-focused. Strong in larger brokerages. Audit trails." },
        { name: "DocuSign", method: "REST API + webhooks", status: "P1", note: "Industry-standard e-signatures. Deep real estate templates." },
        { name: "Brokermint", method: "API", status: "P2", note: "Back-office + commission management." },
      ],
    },
    {
      name: "Communication & Marketing", color: C.purple, priority: "Phase 1",
      items: [
        { name: "Twilio", method: "SMS/Voice API", status: "P0", note: "SMS/MMS for lead response + voice for after-hours." },
        { name: "Google Workspace", method: "Gmail + Calendar API", status: "P0", note: "Email sending + calendar for scheduling." },
        { name: "Mailchimp / Brevo", method: "REST API", status: "P1", note: "Email marketing for newsletters and drip campaigns." },
        { name: "Canva", method: "Connect API", status: "P2", note: "Social media graphics and listing flyers." },
      ],
    },
    {
      name: "Lead Sources", color: C.pink, priority: "Phase 1",
      items: [
        { name: "Zillow / Trulia", method: "Webhook + email parsing", status: "P0", note: "Largest lead source for most agents. Premier Agent leads." },
        { name: "Realtor.com", method: "Webhook + API", status: "P0", note: "NAR-affiliated. High intent leads." },
        { name: "Facebook / Meta Ads", method: "Leads API", status: "P1", note: "Social media lead gen forms. High volume, lower intent." },
        { name: "Google Ads / PPC", method: "Webhook", status: "P1", note: "Search-intent leads. Highest quality but expensive." },
      ],
    },
  ];

  return (
    <div>
      <div style={sTitle}>INTEGRATION MAP — BUILT AS MCP SERVERS</div>
      <div style={{ fontSize: 10, color: C.muted, marginBottom: 14, lineHeight: 1.5 }}>
        Every integration is a dedicated MCP server with per-tenant OAuth and credential management via Composio.
        Each carries <span style={{ color: C.accent, fontWeight: 600 }}>tenant_id</span> on every request. P0 = launch, P1 = month 4-6, P2 = month 7-9.
      </div>
      {categories.map(cat => (
        <div key={cat.name} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: cat.color }}>{cat.name}</span>
            <span style={pill(cat.color, false)}>{cat.priority}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {cat.items.map(item => (
              <div key={item.name} style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
                padding: "8px 10px", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ ...pill(item.status === "P0" ? C.green : item.status === "P1" ? C.gold : C.muted, false), minWidth: 22, textAlign: "center" }}>{item.status}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{item.name}</span>
                  <span style={{ fontSize: 9, color: C.dim, marginLeft: 8 }}>{item.method}</span>
                </div>
                <span style={{ fontSize: 9, color: C.muted, maxWidth: 220, textAlign: "right" }}>{item.note}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TAB 3 — PRICING
// ═══════════════════════════════════════════════════════
function PricingTab() {
  const plans = [
    {
      name: "Solo", price: "$149", per: "/mo", color: C.teal, target: "Solo agents doing 10-30 deals/yr",
      agents: ["Scout (Lead Response)", "Atlas (Admin & Ops)"],
      features: [
        "60-second lead response 24/7",
        "CRM auto-entry + data hygiene",
        "Showing schedule coordination",
        "Weekly activity reports",
        "1 CRM integration + 1 lead source",
        "Email support",
      ],
      limit: "Up to 50 leads/month",
      savings: "~8 hrs/week saved · replaces $500+/mo in tools",
    },
    {
      name: "Team", price: "$399", per: "/mo", color: C.gold, target: "Teams of 2-5 agents doing 50-100 deals/yr",
      popular: true,
      agents: ["Scout", "Quill (Content)", "Nurture (Client Relations)", "Shield (Compliance)", "Atlas"],
      features: [
        "Everything in Solo",
        "Listing descriptions + social media posts",
        "Fair housing language compliance on all content",
        "NAR settlement buyer agreement generation",
        "Automated follow-up + sphere nurture campaigns",
        "3 CRM integrations + all lead sources",
        "Team lead routing rules",
        "Slack support + onboarding call",
      ],
      limit: "Up to 200 leads/month",
      savings: "~20 hrs/week saved · replaces marketing assistant + compliance risk",
    },
    {
      name: "Investor Pro", price: "$499", per: "/mo", color: C.cyan, target: "Investor-agents & small portfolio holders",
      agents: ["Scout", "Sage (expanded investment)", "Shield (Compliance)", "Atlas"],
      features: [
        "Everything in Solo",
        "CMA + investment property screening (cap rate, DSCR, GRM)",
        "Rental comp analysis + rent estimates",
        "ARV estimation + BRRRR strategy evaluation",
        "Disclosure verification on investment properties",
        "Deal screening: filter 100 properties → 5 worth analyzing",
        "All MLS + public records integrations",
        "Priority support",
      ],
      limit: "Up to 150 leads/month · unlimited deal screens",
      savings: "Replaces $5K+ consultant · ~15 hrs/week saved",
    },
    {
      name: "Brokerage", price: "$899", per: "/mo", color: C.purple, target: "Top producers & brokerages doing 100+ deals/yr",
      agents: ["All 7 agents: Scout, Sage, Quill, Closer, Nurture, Atlas, Shield"],
      features: [
        "Everything in Team + Investor Pro",
        "Full transaction coordination (deadlines, docs, parties)",
        "Contract clause summarization + red flag alerts",
        "Disclosure gap analysis + E&O risk scoring",
        "AI learns YOUR voice + communication style",
        "Persistent memory across all client interactions",
        "All integrations (CRM, MLS, transaction, compliance)",
        "ROI dashboard + per-agent performance analytics",
        "Priority support + dedicated onboarding",
      ],
      limit: "Up to 500 leads/month · unlimited transactions",
      savings: "~40 hrs/week saved · replaces TC + marketing + ISA + compliance review",
    },
    {
      name: "Enterprise", price: "Custom", per: "", color: C.accent, target: "Multi-office brokerages, franchises, and teams 10+",
      agents: ["All 7 + Vault & Sentinel (Phase 2) + custom personas"],
      features: [
        "Everything in Brokerage",
        "Vault (investment analysis) + Sentinel (portfolio monitor)",
        "Multi-office management + brand enforcement",
        "Custom LoRA fine-tuned on your brokerage's voice",
        "SSO + SAML · SOC 2 · dedicated infrastructure",
        "Custom MCP integrations + white-label option",
        "SLA + dedicated CSM + quarterly business reviews",
        "API access for custom workflows",
      ],
      limit: "Unlimited everything",
      savings: "Enterprise ROI analysis during onboarding",
    },
  ];

  return (
    <div>
      <div style={sTitle}>FLAT MONTHLY PRICING — NO CREDITS, NO SURPRISES</div>
      <div style={{ fontSize: 10, color: C.muted, marginBottom: 14, lineHeight: 1.5 }}>
        Every plan includes a hard usage cap. If you hit it, agents throttle to lighter models instead of charging overages.
        No bill shock. No credit anxiety. You know exactly what you pay, every month.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {plans.map(p => (
          <div key={p.name} style={{
            background: C.card, border: `1px solid ${p.popular ? p.color + "66" : C.border}`,
            borderRadius: 10, padding: 14, position: "relative",
            borderTop: `3px solid ${p.color}`,
            boxShadow: p.popular ? `0 0 20px ${p.color}15` : "none",
          }}>
            {p.popular && <div style={{ position: "absolute", top: 8, right: 8, ...pill(p.color, true) }}>most popular</div>}
            <div style={{ fontSize: 11, fontWeight: 700, color: p.color, marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.text, lineHeight: 1 }}>
              {p.price}<span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>{p.per}</span>
            </div>
            <div style={{ fontSize: 9, color: C.muted, marginTop: 2, marginBottom: 10 }}>{p.target}</div>

            <div style={{ ...sTitle, fontSize: 9, color: p.color, marginBottom: 4 }}>AI TEAM</div>
            {p.agents.map((a, i) => (
              <div key={i} style={{ fontSize: 10, color: C.text, lineHeight: 1.6, display: "flex", gap: 4 }}>
                <span style={{ color: p.color }}>◆</span>{a}
              </div>
            ))}

            <div style={{ ...sTitle, fontSize: 9, color: p.color, marginTop: 10, marginBottom: 4 }}>INCLUDES</div>
            {p.features.map((f, i) => (
              <div key={i} style={{ fontSize: 9, color: C.muted, lineHeight: 1.6, display: "flex", gap: 4 }}>
                <span style={{ color: C.green, flexShrink: 0 }}>✓</span>{f}
              </div>
            ))}

            <div style={{ marginTop: 10, padding: "6px 8px", background: C.surface, borderRadius: 6, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 9, color: C.dim }}>{p.limit}</div>
              <div style={{ fontSize: 9, color: C.green, fontWeight: 600, marginTop: 2 }}>{p.savings}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: 12, background: C.navy, borderRadius: 8, border: `1px solid ${C.gold}22` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, marginBottom: 4 }}>PRICING PHILOSOPHY</div>
        <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.6 }}>
          The market is full of credit-based pricing that creates anxiety and bill shock (Lindy AI scores 2.0/5 on Trustpilot for billing complaints). 
          We charge flat monthly rates that a real estate agent can expense as a predictable business cost — just like their MLS dues or CRM subscription. 
          Overages throttle to cheaper models instead of generating surprise charges. Transparency is the product.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TAB 4 — GO-TO-MARKET
// ═══════════════════════════════════════════════════════
function GTMTab() {
  return (
    <div>
      <div style={sTitle}>GO-TO-MARKET STRATEGY</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          {
            title: "Target Customer", color: C.gold,
            items: [
              "Solo agents doing 15-40 deals/year (sweet spot)",
              "Small teams (2-5 agents) with no admin staff",
              "Top producers drowning in leads they can't respond to fast enough",
              "Tech-forward agents already using Follow Up Boss or KvCore",
              "Teams spending $500+/mo on disconnected tools",
            ],
          },
          {
            title: "Channels", color: C.accent,
            items: [
              "Real estate Facebook groups (Lab Coat Agents: 160K members)",
              "Inman Connect + NAR conferences (direct demos)",
              "YouTube content: 'Watch my AI respond to a Zillow lead in 47 seconds'",
              "Partnerships with real estate coaches (Tom Ferry, Keri Shull)",
              "Follow Up Boss / KvCore app marketplaces",
              "Local MLS board presentations + CE credit workshops",
            ],
          },
          {
            title: "Launch Hooks", color: C.green,
            items: [
              "'Never miss a lead again' — 60-second response guarantee",
              "Free 14-day trial with real leads (not sandbox)",
              "Side-by-side demo: your current response time vs. with us",
              "ROI calculator: 'You lose $X/month from slow lead response'",
              "'Replace 3 subscriptions with 1' consolidation pitch",
            ],
          },
          {
            title: "Retention Strategy", color: C.purple,
            items: [
              "Monthly ROI report: leads captured, time saved, deals attributed",
              "Memory moat: AI learns your style + client history (switching = losing memory)",
              "Integration depth: once connected to CRM + MLS + transactions, extraction is painful",
              "Community: private Slack for users sharing agent configs + workflows",
              "Quarterly business reviews for Team+ plans",
            ],
          },
        ].map(section => (
          <div key={section.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: section.color, marginBottom: 8 }}>{section.title}</div>
            {section.items.map((item, i) => (
              <div key={i} style={{ fontSize: 10, color: C.muted, lineHeight: 1.6, display: "flex", gap: 5, marginBottom: 2 }}>
                <span style={{ color: section.color, flexShrink: 0 }}>▸</span>{item}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
        <div style={{ ...sTitle, color: C.gold }}>UNIT ECONOMICS TARGET (Month 12)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { metric: "Paying Customers", target: "200", color: C.green },
            { metric: "Avg Revenue/Customer", target: "$350/mo", color: C.gold },
            { metric: "MRR", target: "$70K", color: C.accent },
            { metric: "Gross Margin", target: "70-75%", color: C.teal },
            { metric: "LLM Cost / Customer", target: "$40-80/mo", color: C.purple },
            { metric: "CAC", target: "<$500", color: C.pink },
            { metric: "LTV (24mo)", target: "$6,000+", color: C.green },
            { metric: "6-Month Retention", target: ">75%", color: C.gold },
          ].map(e => (
            <div key={e.metric} style={{ background: C.surface, borderRadius: 6, padding: "8px 10px", textAlign: "center", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: e.color }}>{e.target}</div>
              <div style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: ".05em", marginTop: 2 }}>{e.metric}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TAB 5 — ROADMAP
// ═══════════════════════════════════════════════════════
function RoadmapTab() {
  const phases = [
    {
      name: "Phase 1 — Foundation", time: "Months 1-3", color: C.teal,
      goal: "Ship Solo plan. Prove speed-to-lead conversion with 20 beta agents.",
      tracks: [
        { track: "Platform", items: ["Fork Paperclip → Echelon control plane", "Auth + tenant mgmt (Supabase)", "LangGraph orchestration engine", "LiteLLM gateway w/ tier routing", "Dashboard UI (Next.js 16 + shadcn/ui v4)"] },
        { track: "Agents", items: ["Scout (lead response) — MVP", "Atlas (admin/ops) — MVP", "Agent personas from Agency-Agents fork"] },
        { track: "Integrations", items: ["Follow Up Boss (CRM MCP)", "Zillow webhooks (lead source)", "Twilio (SMS response)", "Google Calendar (scheduling)"] },
        { track: "Business", items: ["20 beta users (free → Solo pricing)", "Measure: response time, contact rate", "Stripe billing integration", "Weekly feedback calls with beta users"] },
      ],
    },
    {
      name: "Phase 2 — Content + Compliance", time: "Months 4-6", color: C.gold,
      goal: "Ship Team plan. Add Shield (compliance), Quill, Nurture, and Sage.",
      tracks: [
        { track: "Platform", items: ["Letta memory (per-agent, per-client)", "Composio multi-tenant OAuth", "Shield ↔ Quill compliance pipeline", "ROI dashboard + analytics"] },
        { track: "Agents (4 new)", items: ["🛡️ Shield — compliance & risk (NEW)", "✍️ Quill — content & comms", "💬 Nurture — client relationships", "📊 Sage — market + investment intel"] },
        { track: "Integrations", items: ["MLS via RESO Web API", "KvCore (second CRM)", "County assessor + permit databases", "Mailchimp/Brevo (email marketing)"] },
        { track: "Business", items: ["Convert beta → $149-399/mo", "Launch Investor Pro plan ($499)", "Target: 50 paying customers", "First case studies + YouTube demos"] },
      ],
    },
    {
      name: "Phase 3 — Transactions", time: "Months 7-9", color: C.purple,
      goal: "Ship Brokerage plan. Closer + Shield become system-of-record for transactions.",
      tracks: [
        { track: "Platform", items: ["Voice agent (after-hours calls)", "AI style learning (your writing voice)", "Team mgmt (routing, permissions)", "Multi-agent collab: Scout → Closer handoff"] },
        { track: "Agents (1 new)", items: ["📋 Closer — transaction coordinator (NEW)", "Shield → Closer pipeline (disclosure checks)", "Quill → Shield pipeline (content compliance)", "Full 7-agent orchestration live"] },
        { track: "Integrations", items: ["Dotloop + SkySlope (transactions)", "DocuSign (e-signatures)", "LionDesk + Top Producer CRMs", "Facebook/Google lead sources"] },
        { track: "Business", items: ["Target: 150 customers, $55K MRR", "Inman Connect demo/booth", "Partnership with RE coaches", "First brokerage pilot (5+ agents)"] },
      ],
    },
    {
      name: "Phase 4 — Investor Expansion", time: "Months 10-14", color: C.cyan,
      goal: "Launch Vault + Sentinel. Serve investor-agents with deal analysis + portfolio monitoring.",
      tracks: [
        { track: "New Agents", items: ["🏦 Vault — investment analysis", "  Deal screening (100 → 5 properties)", "  BRRRR analysis + ARV estimation", "  Cap rate / DSCR / cash-on-cash", "🔭 Sentinel — portfolio monitor", "  Insurance rate change alerts", "  Refinance opportunity detection", "  Property value tracking across portfolio"] },
        { track: "New Integrations", items: ["Rentcast API (rental comps)", "Plaid (bank feeds for investors)", "AppFolio / Buildium (property mgmt)", "RSMeans (construction cost data)", "FEMA flood zone + climate risk APIs"] },
        { track: "Platform", items: ["LoRA fine-tuning per brokerage", "Agent marketplace (templates)", "White-label offering", "SOC 2 Type I certification", "Mobile app (React Native / Expo)"] },
        { track: "Business", items: ["Target: 250+ customers, $100K MRR", "Investor Pro plan traction metrics", "Evaluate Series A readiness", "Data moat: aggregate insights across 250+ agents"] },
      ],
    },
    {
      name: "Phase 5 — Developer Vertical", time: "Months 15-20", color: C.pink,
      goal: "If investor vertical proves >70% retention, expand into real estate development.",
      tracks: [
        { track: "Potential Agents", items: ["🏗️ ZoneCheck — zoning compliance", "  Municipal zoning DB + GIS/parcel APIs", "  Cuts 4-8 hrs/parcel to minutes", "📋 PermitReady — permit navigation", "  ICC building codes + jurisdiction rules", "  Prevents $50K-$500K redesign costs", "💰 CostForge — construction estimates", "  RSMeans + regional labor rates", "  BIM/CAD file parsing"] },
        { track: "Potential Agents (cont)", items: ["🤝 SubConnect — contractor coordination", "  BuildZoom + Procore integration", "  Bid coordination ↓ 50-60%", "📡 BuildPulse — project monitoring", "  Procore/Buildertrend integration", "  Weather APIs + material tracking", "🔒 ChangeShield — change order mgmt", "  Contract dispute prevention"] },
        { track: "Prerequisites", items: ["Construction data MCPs (RSMeans, Procore)", "BIM/CAD file processing pipeline", "GIS + municipal portal scrapers", "Contractor license verification APIs", "Different sales motion (developer persona)"] },
      ],
    },
    {
      name: "Phase 6 — Commercial Vertical", time: "Months 20+", color: C.accent,
      goal: "Enterprise-grade commercial RE agents. Highest value, highest complexity.",
      tracks: [
        { track: "Potential Agents", items: ["📑 LeaseIntel — lease abstraction", "  200+ data points per lease via OCR", "  ASC 842 / IFRS 16 compliance", "📈 DealFlow Underwriter", "  CoStar + ARGUS integration", "  10× deal throughput", "⚠️ TenantRisk Profiler", "  D&B/Experian credit + EDGAR", "  Court/litigation record search"] },
        { track: "Potential Agents (cont)", items: ["💹 RefiRisk — refinance monitor", "  $1.9T maturity wall tracking", "  SOFR/treasury + CMBS data", "🌿 ESG Compliance", "  Utility data + ENERGY STAR", "  GRESB + NYC LL97 portal", "📊 MarketPulse — commercial intel", "  CoStar + REIS + Census Bureau"] },
        { track: "Prerequisites", items: ["CoStar / ARGUS API partnerships", "Commercial lease parsing (Yardi/MRI)", "CMBS + treasury data feeds", "ESG reporting framework integrations", "Enterprise sales team + longer sales cycle", "SOC 2 Type II + BAA for healthcare"] },
      ],
    },
  ];

  return (
    <div>
      <div style={sTitle}>MULTI-PHASE ROADMAP — 7 LAUNCH AGENTS → 20+ AT SCALE</div>
      {phases.map((p, pi) => (
        <div key={p.name} style={{
          background: C.card, border: `1px solid ${p.color}22`, borderRadius: 10,
          padding: 14, marginBottom: 10, borderLeft: `3px solid ${p.color}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: p.color }}>{p.name}</span>
            <span style={pill(p.color, false)}>{p.time}</span>
          </div>
          <div style={{ fontSize: 10, color: C.text, fontWeight: 600, marginBottom: 10 }}>{p.goal}</div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${p.tracks.length}, 1fr)`, gap: 8 }}>
            {p.tracks.map(tr => (
              <div key={tr.track} style={{ background: C.surface, borderRadius: 6, padding: 8, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>{tr.track}</div>
                {tr.items.map((item, i) => (
                  <div key={i} style={{ fontSize: 9, color: C.muted, lineHeight: 1.5, display: "flex", gap: 4, marginBottom: 1 }}>
                    <span style={{ color: p.color, flexShrink: 0, fontSize: 7, marginTop: 2 }}>●</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TAB — TECH STACK
// ═══════════════════════════════════════════════════════
function TechStackTab() {
  const [expandedLayer, setExpandedLayer] = useState(null);

  const layers = [
    {
      id: "orchestration", label: "Agent Orchestration Layer", color: C.green,
      desc: "How Scout, Sage, Quill, Closer, Nurture, and Atlas actually run",
      techs: [
        {
          name: "LangGraph", role: "Core workflow engine", stars: "28K+", repo: "github.com/langchain-ai/langgraph",
          detail: "Each Echelon agent is a LangGraph state machine. Scout's graph: Receive Lead → Classify Source → Qualify → Schedule → Route. Closer's graph: Accept Offer → Track Deadlines → Coordinate Parties → Verify Docs → Close. Durable execution means agent workflows survive server restarts mid-transaction.",
          agentMap: "ALL AGENTS — every agent is a LangGraph graph with typed state, conditional routing, and human-in-the-loop breakpoints",
        },
        {
          name: "CrewAI", role: "Multi-agent collaboration", stars: "44K+", repo: "github.com/crewAIInc/crewAI",
          detail: "Powers agent-to-agent handoffs. When Scout qualifies a lead and books a showing, it hands context to Atlas for scheduling and Nurture for follow-up sequencing. Hierarchical crews: Closer supervises Scout + Atlas during active transactions. Role-based personas with backstories tuned to real estate workflows.",
          agentMap: "SCOUT → ATLAS handoff, SCOUT → NURTURE handoff, CLOSER supervising SCOUT + ATLAS during transactions",
        },
        {
          name: "Paperclip", role: "Control plane & governance", stars: "16K+", repo: "github.com/paperclipai/paperclip",
          detail: "Adapted as the customer-facing dashboard backbone. Org chart shows your AI team. Budget tracking per agent. Heartbeat-based coordination — agents wake on schedule, check their work queue (new leads, pending tasks, upcoming deadlines), and act. Atomic task checkout prevents double-work across agents.",
          agentMap: "DASHBOARD — powers the 'My AI Team' view, budget monitoring, task assignment, and agent performance tracking for all 6 agents",
        },
        {
          name: "Agency-Agents", role: "Agent persona templates", stars: "25K+", repo: "github.com/msitarzewski/agency-agents",
          detail: "Foundation for our 6 agent personas. Each Markdown template adapted with real estate domain expertise, communication patterns, and workflow definitions. Scout's persona includes lead qualification scripts from top-producing agents. Quill's persona includes MLS description best practices and NAR compliance language.",
          agentMap: "ALL AGENTS — each agent's personality, workflow, and domain expertise is defined as structured Markdown templates derived from this library",
        },
        {
          name: "Deep Agents", role: "Complex task harness", stars: "New", repo: "github.com/langchain-ai/deepagents",
          detail: "Powers Sage's multi-step CMA generation (plan → gather comps → analyze adjustments → generate report) and Closer's transaction coordination (plan → check deadlines → draft communications → verify compliance). Planning tool breaks complex RE tasks into subtasks. Filesystem backend manages document context without blowing context windows.",
          agentMap: "SAGE (CMA generation), CLOSER (transaction coordination) — complex multi-step workflows that require planning and subagent spawning",
        },
      ],
    },
    {
      id: "llm", label: "LLM Infrastructure Layer", color: C.gold,
      desc: "How we route models by agent tier and control costs",
      techs: [
        {
          name: "LiteLLM", role: "LLM gateway + model router", stars: "28K+", repo: "github.com/BerriAI/litellm",
          detail: "Central nervous system for all LLM calls. Per-tenant budget enforcement — Solo plan gets $40/mo token budget, Brokerage gets $120/mo. Automatic failover: if Claude Sonnet is down, Quill falls back to GPT-4o seamlessly. Load balancing across providers. Every call tagged with {tenant_id, agent_name, tier, workflow_step} for cost attribution.",
          agentMap: "ALL AGENTS — routes Scout/Atlas → cheap models (Haiku/4o-mini), Quill/Nurture/Sage → mid-tier (Sonnet/4o), Closer → frontier (Opus/4.5)",
        },
        {
          name: "RouteLLM", role: "Smart complexity routing", stars: "4K+", repo: "github.com/lm-sys/RouteLLM",
          detail: "Within each agent tier, dynamically routes to the cheapest model that can handle the task. Scout responding 'Thanks, when works for a showing?' doesn't need Claude Opus. Scout analyzing a complex relocation scenario with multiple properties does. Achieves ~85% cost reduction on simple queries while maintaining quality on complex ones.",
          agentMap: "SCOUT + QUILL — highest volume agents where smart routing has the biggest cost impact",
        },
        {
          name: "LoRAX", role: "Custom model serving", stars: "3K+", repo: "github.com/predibase/lorax",
          detail: "Enterprise tier only. Serves brokerage-specific LoRA adapters on shared GPU infrastructure. One base model (Llama 3.1 70B) with per-brokerage adapters that capture their brand voice, compliance requirements, and communication style. Dynamic adapter loading — switch between Keller Williams adapter and RE/MAX adapter per request.",
          agentMap: "QUILL + NURTURE (Enterprise tier) — adapters fine-tuned on brokerage's past emails, listing descriptions, and brand guidelines",
        },
        {
          name: "vLLM", role: "Inference engine", stars: "42K+", repo: "github.com/vllm-project/vllm",
          detail: "Backend inference for self-hosted models (Enterprise tier) and LoRA serving. PagedAttention for efficient memory. Continuous batching handles concurrent agent requests across multiple tenants. Runs on A100/H100 GPUs for Enterprise deployments requiring data residency.",
          agentMap: "ENTERPRISE TIER — self-hosted inference for brokerages requiring on-premise data control",
        },
      ],
    },
    {
      id: "memory", label: "Memory & Knowledge Layer", color: C.purple,
      desc: "How agents remember clients, learn your style, and access RE data",
      techs: [
        {
          name: "Letta (MemGPT)", role: "Agent memory system", stars: "13K+", repo: "github.com/letta-ai/letta",
          detail: "The brain of every Echelon agent. Three-tier memory architecture: Core Memory (always in-context) — client name, preferences, budget, timeline, showing history. Recall Memory (searchable history) — every conversation, email, and interaction. Archival Memory (long-term vector store) — market data, past transactions, neighborhood knowledge. Agents self-edit their own memory after every interaction.",
          agentMap: "NURTURE (remembers client anniversaries, preferences), CLOSER (tracks full transaction context), SCOUT (recalls past interactions with returning leads), SAGE (accumulates market knowledge)",
        },
        {
          name: "pgvector (Supabase)", role: "Vector database (built-in)", stars: "Built-in", repo: "supabase.com/modules/vector",
          detail: "Zero additional infrastructure — pgvector is a first-class Supabase extension. Vectors stored alongside relational data in the same Postgres instance with RLS tenant isolation for free. HNSW indexing for fast similarity search. Per-tenant vector namespaces via table partitioning + RLS policies. Powers Sage's CMA comparables search, Quill's style matching, and Shield's disclosure pattern matching. Firecrawl migrated from Pinecone to Supabase pgvector in production.",
          agentMap: "SAGE (comparable property search), QUILL (style-matched writing), NURTURE (semantic client history search), SHIELD (disclosure pattern matching)",
        },
        {
          name: "Haystack", role: "RAG pipeline framework", stars: "21K+", repo: "github.com/deepset-ai/haystack",
          detail: "Powers the knowledge retrieval for all agents. Modular pipeline: MLS data → chunking → embedding → pgvector → retrieval → reranking → agent context. Separate pipelines for different data types: listing data (structured), market reports (semi-structured), contract documents (unstructured). Hybrid retrieval (keyword + semantic) for contract clause search.",
          agentMap: "ALL AGENTS — Sage uses it for market data retrieval, Closer for contract search, Quill for listing data, Scout for property-specific lead responses",
        },
        {
          name: "Mem0", role: "Cross-agent shared memory", stars: "48K+", repo: "github.com/mem0ai/mem0",
          detail: "Shared memory layer that spans across all 7 agents for the same client. When Scout qualifies a lead (budget: $500K, timeline: 3 months, needs 3BR), that context is immediately available to Sage (generate CMAs in range), Quill (write listings emphasizing 3BR features), Shield (flag relevant disclosures), and Closer (when they go under contract). SOC 2 Type I certified.",
          agentMap: "CROSS-AGENT — shared client context so Scout's qualification data flows to Sage, Quill, Shield, Nurture, and Closer without re-asking",
        },
      ],
    },
    {
      id: "tools", label: "Tool & Integration Layer", color: C.pink,
      desc: "How agents connect to MLS, CRM, transaction management, and 500+ apps",
      techs: [
        {
          name: "MCP Protocol", role: "Universal tool standard", stars: "97M dl/mo", repo: "modelcontextprotocol.io",
          detail: "Every real estate integration is an MCP server. HTTP/SSE transport (not stdio) for cloud-native operation. Each request carries tenant_id + Authorization headers. Industry-specific MCP servers we build: mcp-mls (RESO Web API wrapper), mcp-followupboss, mcp-kvcore, mcp-dotloop, mcp-skyslope, mcp-zillow-leads. Tool access mapped to plan tiers: Solo gets read-only MLS + CRM, Brokerage gets full read/write + transaction tools.",
          agentMap: "ALL AGENTS — Scout calls mcp-followupboss + mcp-zillow-leads, Sage calls mcp-mls, Closer calls mcp-dotloop + mcp-skyslope, Atlas calls mcp-calendar + mcp-crm",
        },
        {
          name: "Composio", role: "500+ app integrations + auth", stars: "15K+", repo: "github.com/ComposioHQ/composio",
          detail: "Handles the hardest multi-tenant problem: per-user OAuth. Each agent's tenant has their own authenticated connections to Follow Up Boss, Google Calendar, Dotloop, etc. Token refresh, credential rotation, and RBAC all managed by Composio. MCP Gateway for enterprise adds SOC 2 audit trails. Scoped by user_id so Agent A's CRM access never leaks to Agent B's data.",
          agentMap: "ALL INTEGRATIONS — manages OAuth tokens for every tenant's CRM, MLS, email, calendar, and transaction management connections",
        },
        {
          name: "Firecrawl", role: "Web data extraction", stars: "30K+", repo: "github.com/mendableai/firecrawl",
          detail: "Powers Sage's market intelligence beyond MLS. Crawls county assessor websites for property tax data, school rating sites for neighborhood reports, Zillow/Redfin for additional market signals, and local news for development/zoning updates. Clean markdown extraction that feeds directly into RAG pipelines. Batch crawling for initial market data seeding per territory.",
          agentMap: "SAGE (county records, market data scraping), QUILL (competitive listing research), SCOUT (prospect LinkedIn/social context for personalization)",
        },
        {
          name: "Unstructured", role: "Document processing", stars: "12K+", repo: "github.com/Unstructured-IO/unstructured",
          detail: "Closer's document engine. Processes PDFs (purchase agreements, inspection reports, title documents), images (property photos with metadata), and scanned documents (older disclosures). Table extraction for closing cost worksheets. OCR for scanned listing sheets. All output feeds into the RAG pipeline for contract clause search and compliance verification.",
          agentMap: "CLOSER (contract parsing, inspection report summarization, disclosure document processing), SAGE (tax document analysis)",
        },
      ],
    },
    {
      id: "frontend", label: "Frontend & UI Layer", color: C.cyan,
      desc: "What agents and brokers see and interact with",
      techs: [
        {
          name: "Next.js 16", role: "Web application framework", stars: "130K+", repo: "github.com/vercel/next.js",
          detail: "App Router with React Server Components. Fluid Compute on Vercel for serverless edge deployment. Pages: /dashboard (Paperclip-inspired team overview), /agents/{name} (individual agent config + history), /clients (CRM-synced client view), /analytics (ROI dashboards), /settings (integrations, billing, team management). Streaming responses for real-time agent activity feeds.",
          agentMap: "DASHBOARD — customer-facing web app where agents manage their AI team, review activity, and configure workflows",
        },
        {
          name: "shadcn/ui v4", role: "Component library", stars: "80K+", repo: "github.com/shadcn-ui/ui",
          detail: "Tailwind CSS 4 based. Pre-built components for agent cards, conversation threads, timeline views, data tables (transaction pipeline), and form builders (agent persona customization). Dark/light mode. Accessible. Consistent with modern SaaS aesthetics that real estate professionals expect from tools like Follow Up Boss.",
          agentMap: "ALL UI — buttons, forms, tables, modals, charts, navigation, and layout primitives across every page",
        },
        {
          name: "assistant-ui", role: "Agent chat interface", stars: "YC W25", repo: "github.com/assistant-ui/assistant-ui",
          detail: "React components for the conversational interface with each agent. Thread-based conversations with Scout (lead discussions), Sage (market Q&A), Quill (content drafting with revisions), Closer (transaction status updates). LangGraph integration for streaming agent responses. Approval UIs for human-in-the-loop workflows (Closer: 'Should I send this deadline reminder to the buyer's agent?').",
          agentMap: "SCOUT (lead conversations), QUILL (content drafting + approval), CLOSER (transaction coordination chat), SAGE (market Q&A)",
        },
        {
          name: "React Native (Expo)", role: "Mobile application", stars: "—", repo: "expo.dev",
          detail: "Phase 4 deliverable. Mobile app for on-the-go agent monitoring: push notifications for new leads (Scout), transaction deadline alerts (Closer), quick approval actions (approve email draft, confirm showing). Shared business logic with web app via shared TypeScript packages. Offline-capable for showing appointments in low-connectivity areas.",
          agentMap: "PUSH NOTIFICATIONS — Scout lead alerts, Closer deadline reminders, Atlas schedule updates, Nurture approval requests",
        },
      ],
    },
    {
      id: "platform", label: "Platform Services Layer", color: C.teal,
      desc: "Billing, observability, evaluation, and compliance infrastructure",
      techs: [
        {
          name: "Stripe", role: "Billing + usage metering", stars: "—", repo: "stripe.com",
          detail: "Subscription billing for flat monthly plans (Solo/Team/Brokerage). Stripe's new LLM Token Billing (private preview) auto-syncs model prices for cost tracking. Metered usage tracking per tenant for analytics dashboards — not for billing overages (we throttle, not charge). Customer portal for plan changes, invoices, payment methods. Webhook-driven usage alerts at 80% and 95% of plan cap.",
          agentMap: "BILLING — $149/$399/$899 flat subscriptions, usage dashboards showing per-agent token consumption",
        },
        {
          name: "LangSmith", role: "Observability + evaluation", stars: "Managed", repo: "langchain.com/langsmith",
          detail: "Distributed tracing for every agent action. Nested spans: Scout Lead Response → Classify Source → Query CRM → Generate Reply → Send SMS. Per-agent cost tracking (how much does Scout cost vs. Closer per month per tenant?). Evaluation pipelines: weekly automated evals — is Quill's listing description quality improving? Is Scout's qualification accuracy above threshold? CI/CD integration for agent regression testing before deployment.",
          agentMap: "ALL AGENTS — traces, cost attribution, quality scoring, and regression testing for every workflow",
        },
        {
          name: "Langfuse", role: "OSS observability alternative", stars: "8K+", repo: "github.com/langfuse/langfuse",
          detail: "Self-hosted alternative to LangSmith for Enterprise tier customers requiring on-premise observability. OpenTelemetry-native. Token and cost tracking per model, per agent, per tenant. Aggregated metrics APIs feed the ROI dashboard. Can run alongside LangSmith — we use LangSmith for development/staging, Langfuse for production monitoring, and either/both for Enterprise on-prem.",
          agentMap: "ENTERPRISE — self-hosted observability for brokerages requiring data residency",
        },
      ],
    },
    {
      id: "security", label: "Security & Compliance Layer", color: C.red,
      desc: "Data isolation, PII protection, and regulatory readiness",
      techs: [
        {
          name: "Supabase RLS", role: "Row-level data isolation", stars: "—", repo: "Built into Supabase",
          detail: "Every table has RLS policies enforcing tenant_id = auth.jwt().tenant_id. No application-level filtering — isolation is enforced at the database level. Even if a bug in Scout's code tries to query another tenant's leads, Postgres blocks it. Separate schemas for Enterprise tenants requiring physical isolation. Audit logging on all data access.",
          agentMap: "ALL DATA — ensures Agent Team A's clients, leads, transactions, and documents are invisible to Agent Team B",
        },
        {
          name: "Infisical", role: "Secrets management + vault", stars: "25K+", repo: "github.com/Infisical/infisical",
          detail: "MIT-licensed open-source secrets manager replacing Skyflow ($0 vs $500+/mo). Self-hosts on Docker with Postgres backend — runs alongside Supabase. Manages all API keys, OAuth tokens, and per-tenant credentials. Encrypted version-controlled storage, automatic secret rotation, and detailed audit logs. Used by Hugging Face in production. SOC 2 compliant path for Enterprise tier.",
          agentMap: "ALL INTEGRATIONS — secures MLS API keys, CRM OAuth tokens, Twilio credentials, and all per-tenant secrets managed by Composio",
        },
        {
          name: "Presidio", role: "PII detection + redaction", stars: "3.3K+", repo: "github.com/microsoft/presidio",
          detail: "Microsoft open-source PII anonymization engine (Apache 2.0). Detects 140+ PII entity types using NER models. Pipeline: client document → Presidio strips SSNs, addresses, financial data → anonymized text to LLM → response re-hydrated with original PII for human output. Critical for Shield's disclosure analysis and Closer's transaction document processing where sensitive client data must never reach LLM context.",
          agentMap: "SHIELD (disclosure documents with client PII), CLOSER (transaction docs with financial data), SAGE (investment analysis with sensitive financials)",
        },
        {
          name: "OWASP MCP Top 10", role: "MCP security framework", stars: "Standard", repo: "owasp.org",
          detail: "Every MCP server follows OWASP MCP security guidelines. Key mitigations: input sanitization on all tool calls (prevent prompt injection via MLS data), output scanning for cross-tenant data leakage, human approval gates for write operations (Closer sending deadline notifications), MCP-scan for toxic flow analysis before deploying new MCP servers. Rate limiting per tenant per tool.",
          agentMap: "ALL MCP SERVERS — security posture for mcp-mls, mcp-followupboss, mcp-dotloop, and all custom integrations",
        },
        {
          name: "Trigger.dev", role: "Code-level background jobs", stars: "10K+", repo: "github.com/triggerdotdev/trigger.dev",
          detail: "Handles scheduled agent tasks that live inside your codebase. Scout's follow-up timers (if no response in 24hrs → send follow-up #2). Closer's deadline alerting (inspection contingency expires in 48hrs → alert all parties). Nurture's daily birthday scan. Sage's weekly market report generation. TypeScript-native, durable execution with automatic retries, deploys alongside your Next.js app.",
          agentMap: "SCOUT (follow-up timers), CLOSER (deadline alerts), NURTURE (scheduled relationship touches), SAGE (weekly reports)",
        },
        {
          name: "n8n", role: "Integration workflow automation", stars: "178K+", repo: "github.com/n8n-io/n8n",
          detail: "Self-hosted visual workflow builder for external system glue. Handles: Zillow lead webhook → parse → create CRM contact → notify agent. New MLS listing → trigger Quill → post to social → send email blast. 400+ pre-built integrations, MCP support for AI agent workflows, and a visual canvas that becomes a customer-facing feature ('customize your lead workflow'). Complements Trigger.dev — n8n handles inter-system flows, Trigger.dev handles intra-app scheduled jobs.",
          agentMap: "SCOUT (lead source webhook routing), QUILL (content → social media pipeline), ATLAS (CRM → email sync), NURTURE (event-triggered campaigns)",
        },
      ],
    },
    {
      id: "hosting", label: "Infrastructure & Hosting Layer", color: "#f59e0b",
      desc: "Where everything runs — edge, compute, data, and disaster recovery",
      techs: [
        {
          name: "Cloudflare Pages", role: "Frontend hosting + CDN", stars: "—", repo: "pages.cloudflare.com",
          detail: "Replaces Vercel ($0/mo vs $20/mo per seat). Hosts the Next.js 16 dashboard on Cloudflare's global edge network with zero per-seat pricing, unlimited bandwidth, and 500 builds/month on free tier. Global CDN delivers sub-100ms page loads. Auto-deploys from GitHub on push to main. Preview deployments per pull request. OpenNext adapter runs Next.js App Router and Server Components on CF's edge runtime.",
          agentMap: "DASHBOARD — the web app real estate agents use to manage their AI team, view lead activity, configure agents, and track ROI",
        },
        {
          name: "Cloudflare Tunnel", role: "Secure ingress + Zero Trust", stars: "—", repo: "developers.cloudflare.com/cloudflare-one/connections/connect-networks/",
          detail: "Encrypted outbound-only connection from Hetzner VPS to Cloudflare's edge. No open ports on the server, no public IP exposure, no DDoS vulnerability. All inbound traffic routed through CF's WAF + DDoS protection (100+ Tbps mitigation). Cloudflare Access gates internal services (Coolify dashboard, n8n, Infisical) behind Google OAuth. Adds ~15-20ms latency — invisible against 2-3 second LLM calls.",
          agentMap: "ALL TRAFFIC — every API call, webhook, and dashboard request passes through the tunnel securely",
        },
        {
          name: "Cloudflare R2", role: "Object storage ($0 egress)", stars: "—", repo: "developers.cloudflare.com/r2/",
          detail: "S3-compatible object storage with zero egress fees. Stores listing photos, transaction documents (contracts, disclosures, inspection reports), and generated content (CMA reports, listing descriptions). Free tier: 10GB storage + 10M reads/month. At scale, R2's zero-egress model saves significant money vs S3/Supabase Storage for document-heavy real estate workflows.",
          agentMap: "CLOSER (transaction documents), QUILL (generated content archives), SAGE (CMA report storage), SHIELD (disclosure document storage)",
        },
        {
          name: "Hetzner CPX31", role: "Compute server (Docker host)", stars: "—", repo: "hetzner.com/cloud",
          detail: "4 vCPU, 8GB RAM, 160GB NVMe SSD, 20TB traffic — €13.49/month (~$15). Runs all 8 Docker containers: Agent Runtime (FastAPI + LangGraph), LiteLLM Proxy, MCP Servers, n8n, Trigger.dev, Letta, Infisical. Separate 20GB persistent volume ($0.88/mo) survives server recreation — stores n8n workflows, Infisical vault, Letta memory cache. Ashburn datacenter for US East proximity.",
          agentMap: "ALL AGENTS — Scout, Atlas, and all future agents execute on this box via Docker containers managed by Coolify",
        },
        {
          name: "Coolify", role: "Self-hosted PaaS", stars: "52K+", repo: "github.com/coollabsio/coolify",
          detail: "Open-source Vercel/Railway alternative (Apache 2.0). Turns the Hetzner VPS into a PaaS with git-push deploys, Traefik reverse proxy, automatic SSL, log dashboard, one-click rollbacks, environment variable management, and health checks with auto-restart. Connects to GitHub repos — push to main triggers build and deploy. All the DX of Railway with none of the per-usage pricing.",
          agentMap: "DEPLOYMENT — manages the lifecycle of all Docker containers on the Hetzner server",
        },
        {
          name: "OpenTofu", role: "Infrastructure as Code", stars: "25K+", repo: "github.com/opentofu/opentofu",
          detail: "Open-source Terraform fork (MPL-2.0, not BSL). Provisions the entire Hetzner infrastructure: server, firewall, SSH keys, persistent volume, Cloudflare DNS records. One-command disaster recovery: 'tofu apply -replace=hcloud_server.echelon' recreates the server in ~15 minutes, reattaches the data volume, runs cloud-init (Docker + Coolify + cloudflared), and updates DNS. Server is cattle, not a pet.",
          agentMap: "DISASTER RECOVERY — server dies at 2 AM, run one command, fully operational in 15 minutes with zero data loss",
        },
        {
          name: "Supabase", role: "Managed data platform", stars: "78K+", repo: "github.com/supabase/supabase",
          detail: "PostgreSQL with Row-Level Security (RLS) — every query automatically filtered by tenant_id. Auth (email/password + Google OAuth). pgvector for embeddings (built-in, $0). Edge Functions (webhook handlers). Realtime subscriptions for live dashboard updates. All persistent data lives here — survives any server event. Pro plan at $25/mo. Can self-host if needed.",
          agentMap: "ALL DATA — tenant management, user auth, vector embeddings, real-time event streaming, webhook processing",
        },
      ],
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
        <span style={{ fontSize: 10, color: C.muted, fontWeight: 600, letterSpacing: ".05em" }}>
          8 ARCHITECTURE LAYERS · 37 TECHNOLOGIES · CLICK TO EXPAND
        </span>
      </div>
      <div style={{ fontSize: 10, color: C.muted, marginBottom: 14, lineHeight: 1.5 }}>
        Every technology mapped to specific Echelon agents and real estate workflows.
        Open-source repos shown with GitHub stars. All deployed on <span style={{ color: "#f59e0b" }}>Cloudflare</span> (edge + CDN) + <span style={{ color: C.green }}>Hetzner + Coolify</span> (compute) + <span style={{ color: C.teal }}>Supabase</span> (data). Total infra: ~$40/mo.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {layers.map(layer => {
          const isOpen = expandedLayer === layer.id;
          return (
            <div key={layer.id} style={{
              background: isOpen ? layer.color + "08" : C.card,
              border: `1px solid ${isOpen ? layer.color + "44" : C.border}`,
              borderRadius: 8, overflow: "hidden", transition: "all .2s",
            }}>
              <div
                onClick={() => setExpandedLayer(isOpen ? null : layer.id)}
                style={{ padding: "10px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: 2, background: layer.color, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: layer.color }}>{layer.label}</span>
                  <span style={{ fontSize: 9, color: C.muted }}>— {layer.desc}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={pill(layer.color, false)}>{layer.techs.length} tools</span>
                  <span style={{ fontSize: 12, color: C.muted, transition: "transform .2s", transform: isOpen ? "rotate(90deg)" : "rotate(0)" }}>▸</span>
                </div>
              </div>

              {isOpen && (
                <div style={{ padding: "0 14px 14px" }}>
                  {layer.techs.map((tech, ti) => (
                    <div key={tech.name} style={{
                      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
                      padding: 12, marginBottom: ti < layer.techs.length - 1 ? 6 : 0,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{tech.name}</span>
                          <span style={{ fontSize: 10, color: layer.color, fontWeight: 600, marginLeft: 8 }}>{tech.role}</span>
                        </div>
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <span style={pill(layer.color, false)}>{tech.stars}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 9, color: C.dim, marginBottom: 6, fontFamily: "monospace" }}>{tech.repo}</div>
                      <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>{tech.detail}</div>
                      <div style={{
                        background: layer.color + "0a", border: `1px solid ${layer.color}22`,
                        borderRadius: 6, padding: "6px 10px",
                      }}>
                        <span style={{ fontSize: 8, fontWeight: 700, color: layer.color, textTransform: "uppercase", letterSpacing: ".08em" }}>AGENT MAPPING → </span>
                        <span style={{ fontSize: 9, color: C.muted }}>{tech.agentMap}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Data flow */}
      <div style={{ marginTop: 14, padding: 12, background: C.navy, borderRadius: 8, border: `1px solid ${C.gold}22` }}>
        <div style={{ ...sTitle, color: C.gold }}>END-TO-END DATA FLOW EXAMPLE: ZILLOW LEAD → BOOKED SHOWING</div>
        <div style={{ fontSize: 9, color: C.muted, lineHeight: 2, fontFamily: "monospace" }}>
          <span style={{ color: C.pink }}>Zillow webhook</span>
          <span style={{ color: C.border }}> → </span>
          <span style={{ color: "#f59e0b" }}>CF WAF + Tunnel</span>
          <span style={{ color: C.border }}> → </span>
          <span style={{ color: C.teal }}>n8n (parse + route)</span>
          <span style={{ color: C.border }}> → </span>
          <span style={{ color: C.green }}>LangGraph (Scout)</span>
          <span style={{ color: C.border }}> → </span>
          <span style={{ color: C.gold }}>LiteLLM → Haiku</span>
          <span style={{ color: C.border }}> → </span>
          <span style={{ color: C.pink }}>MCP: mcp-followupboss</span>
          <span style={{ color: C.border }}> (create contact) → </span>
          <span style={{ color: C.purple }}>Letta</span>
          <span style={{ color: C.border }}> (store client context) → </span>
          <span style={{ color: C.pink }}>Twilio SMS</span>
          <span style={{ color: C.border }}> (send response in 47s) → </span>
          <span style={{ color: C.purple }}>Mem0</span>
          <span style={{ color: C.border }}> (share to all agents) → </span>
          <span style={{ color: C.teal }}>LangSmith trace</span>
        </div>
        <div style={{ fontSize: 9, color: C.dim, marginTop: 6 }}>
          Total time: lead received → personalized SMS sent = <span style={{ color: C.green, fontWeight: 700 }}>under 60 seconds</span>. 
          Every step traced in LangSmith. Cost: ~$0.003 per lead response. CRM updated. Memory stored. Follow-up timer set via Trigger.dev.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════
export default function RealEstateAIPlan() {
  const [tab, setTab] = useState(0);
  const views = [<Overview />, <AgentsTab />, <TechStackTab />, <IntegrationsTab />, <PricingTab />, <GTMTab />, <RoadmapTab />];

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace", minHeight: "100vh", padding: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldDim})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 900, color: "#000",
        }}>E</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.text, letterSpacing: "-.02em" }}>Echelon</div>
          <div style={{ fontSize: 9, color: C.gold, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" }}>AI Operations Team for Real Estate</div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: C.muted, marginBottom: 14 }}>Hire intelligence. Scale ambition. Close more deals.</div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 12, background: C.surface, borderRadius: 8, padding: 3, border: `1px solid ${C.border}` }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            flex: 1, padding: "7px 2px", fontSize: 10, fontWeight: tab === i ? 700 : 500,
            color: tab === i ? C.gold : C.muted,
            background: tab === i ? C.card : "transparent",
            border: tab === i ? `1px solid ${C.border}` : "1px solid transparent",
            borderRadius: 6, cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
          }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}`, minHeight: 400 }}>
        {views[tab]}
      </div>

      <div style={{ marginTop: 10, fontSize: 8, color: C.dim, textAlign: "center", letterSpacing: ".06em" }}>
        ECHELON · AI OPERATIONS FOR REAL ESTATE · BUSINESS PLAN v1.0 · SENTINEL ARCHITECTURE · MARCH 2026
      </div>
    </div>
  );
}
