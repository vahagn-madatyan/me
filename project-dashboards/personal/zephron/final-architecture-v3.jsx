import { useState } from "react";

const TABS = ["Architecture", "Observability & Incidents", "MCP Servers", "Pricing", "Skills & Safety", "Stack", "Roadmap"];

const B = ({ children, color = "#2ee88a", ghost }) => (
  <span style={{
    padding: "2px 8px", borderRadius: 5, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.6px",
    textTransform: "uppercase", display: "inline-block", lineHeight: "17px",
    background: ghost ? "transparent" : `${color}14`, color, border: `1px solid ${color}30`,
  }}>{children}</span>
);
const T = ({ children, c = "#6d7a90" }) => (
  <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: 5, fontSize: 10, background: `${c}0e`, border: `1px solid ${c}1a`, color: c, fontWeight: 500, margin: "1.5px 1.5px" }}>{children}</span>
);
const Bx = ({ title, icon, a = "#2ee88a", children, s = {} }) => (
  <div style={{ background: "#111620", border: `1px solid ${a}16`, borderRadius: 11, padding: "14px 16px", ...s }}>
    {title && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>{icon && <span style={{ fontSize: 14 }}>{icon}</span>}<span style={{ fontSize: 11.5, fontWeight: 800, color: a, letterSpacing: "0.3px" }}>{title}</span></div>}
    {children}
  </div>
);
const Ar = ({ label }) => (<div style={{ textAlign: "center", padding: "5px 0", color: "#252d3e" }}><div style={{ fontSize: 13 }}>▼</div>{label && <div style={{ fontSize: 7.5, letterSpacing: "1.8px", textTransform: "uppercase", fontWeight: 800, color: "#3a4560", marginTop: 1 }}>{label}</div>}</div>);
const St = ({ n, l, c = "#2ee88a" }) => (<div style={{ textAlign: "center", flex: "1 1 50px" }}><div style={{ fontSize: 24, fontWeight: 900, color: c, fontFamily: "'IBM Plex Mono', monospace" }}>{n}</div><div style={{ fontSize: 8.5, color: "#4f5c72", fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase", marginTop: 1 }}>{l}</div></div>);
const Li = ({ children, c = "#8a95ab" }) => (<div style={{ fontSize: 11, color: c, padding: "2.5px 0", display: "flex", gap: 6, alignItems: "start" }}><span style={{ color: "#2a3348", fontSize: 5.5, marginTop: 5 }}>●</span><span style={{ lineHeight: 1.45 }}>{children}</span></div>);

export default function Arch() {
  const [tab, setTab] = useState(0);
  return (
    <div style={{ background: "#0a0e15", color: "#bcc5d6", minHeight: "100vh", fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 3 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg, #2ee88a, #4a7cff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#0a0e15" }}>N</div>
          <div><div style={{ fontSize: 16, fontWeight: 800, color: "#e0e6f0", letterSpacing: "-0.4px" }}>NetSec Platform — Complete Architecture</div><div style={{ fontSize: 9.5, color: "#3f4d66", fontWeight: 600 }}>Pure Python · Docker Compose · Zabbix + LangGraph · GitLab-Style Open-Core</div></div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, margin: "14px 0 12px", background: "#0d1119", border: "1px solid #171e2c", borderRadius: 9, padding: "7px 6px" }}>
          <St n="120+" l="Skills" /><St n="52" l="MCP Servers" c="#4a7cff" /><St n="40+" l="Zabbix Tools" c="#e05070" /><St n="4" l="Tiers" c="#e8a040" /><St n="3" l="Deploy Modes" c="#9a6cf0" />
        </div>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 16 }}>
          {TABS.map((t, i) => (<button key={i} onClick={() => setTab(i)} style={{ padding: "6px 12px", borderRadius: 7, fontSize: 10.5, fontWeight: 700, cursor: "pointer", border: "1px solid", background: tab === i ? "#2ee88a10" : "#0d1119", color: tab === i ? "#2ee88a" : "#4f5c72", borderColor: tab === i ? "#2ee88a28" : "#171e2c" }}>{t}</button>))}
        </div>
      </div>
      <div style={{ padding: "0 20px 32px" }}>

        {/* ═══ ARCHITECTURE ═══ */}
        {tab === 0 && (<div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 6 }}>
            {[{ m: "Cloud SaaS", w: "Render", i: "☁️", c: "#2ee88a" }, { m: "On-Prem", w: "docker compose up", i: "🏢", c: "#4a7cff" }, { m: "Developer", w: "git clone + docker", i: "💻", c: "#9a6cf0" }].map((d, i) => (
              <div key={i} style={{ padding: "8px 12px", borderRadius: 9, background: `${d.c}05`, border: `1px solid ${d.c}14`, textAlign: "center" }}><div style={{ fontSize: 16 }}>{d.i}</div><div style={{ fontSize: 10.5, fontWeight: 800, color: d.c, marginTop: 3 }}>{d.m}</div><div style={{ fontSize: 9, color: "#4f5c72", marginTop: 2 }}>{d.w}</div></div>
            ))}
          </div>
          <Bx title="Layer 1 — Customer & MSP Portals" icon="🖥" a="#9a6cf0">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <div style={{ padding: "8px 10px", borderRadius: 7, background: "#9a6cf005", border: "1px solid #9a6cf010" }}><div style={{ fontSize: 9.5, fontWeight: 700, color: "#9a6cf0", marginBottom: 4 }}>CUSTOMER PORTAL</div><div style={{ fontSize: 9.5, color: "#6d7a90", lineHeight: 1.5 }}>Sites, health, incidents, reports, approve changes, limited agent chat. White-labeled per MSP.</div></div>
              <div style={{ padding: "8px 10px", borderRadius: 7, background: "#4a7cff05", border: "1px solid #4a7cff10" }}><div style={{ fontSize: 9.5, fontWeight: 700, color: "#4a7cff", marginBottom: 4 }}>MSP OPERATIONS</div><div style={{ fontSize: 9.5, color: "#6d7a90", lineHeight: 1.5 }}>Multi-tenant dashboard, fleet ops, incident triage queue, n8n builder, SLA tracking.</div></div>
            </div>
            <div style={{ fontSize: 9, color: "#3f4d66", marginTop: 6 }}>TanStack Start (React SSR) · Render static hosting</div>
          </Bx>
          <Ar label="HTTPS" />
          <Bx title="Layer 2 — Backend Orchestration (FastAPI)" icon="⚡" a="#e8a040">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 8 }}>{["Auth + RBAC", "Tenant Isolation", "License Gate", "Rate Limit", "Alert Pipeline", "Incident Mgmt", "Scheduler", "Notifications", "n8n Bridge"].map((m, i) => <T key={i} color="#e8a040">{m}</T>)}</div>
            <div style={{ fontSize: 10, color: "#6d7a90", lineHeight: 1.5 }}>Single Python process. Auth, CRUD, agent, alerting, incidents, scheduling, billing — all in one. No proxy, no second runtime.</div>
          </Bx>
          <Ar label="Internal call" />
          <Bx title="Layer 3 — Agentic Workflow (LangGraph + MCP)" icon="🧠" a="#4a7cff">
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
              {[{ n: "PLANNER", d: "Skills + strategy", c: "#2ee88a" }, { n: "EXECUTOR", d: "MCP tool calls", c: "#4a7cff" }, { n: "REVIEWER", d: "Safety + audit", c: "#e8a040" }].map((nd, i) => (
                <div key={i} style={{ flex: "1 1 100px", padding: "8px 10px", borderRadius: 7, textAlign: "center", background: `${nd.c}07`, border: `1px solid ${nd.c}18` }}><div style={{ fontSize: 9.5, fontWeight: 900, color: nd.c, letterSpacing: "1px" }}>{nd.n}</div><div style={{ fontSize: 9, color: "#5a6577", marginTop: 3 }}>{nd.d}</div></div>
              ))}
            </div>
            <div style={{ fontSize: 9.5, color: "#4f5c72" }}>120+ skills · 52 MCP servers · Safety T1/T2/T3 · Checkpoint → Postgres · LLM → Claude</div>
          </Bx>
          <Ar label="stdio / HTTP / SSH" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 6 }}>
            <Bx title="NetClaw MCPs" icon="🔄" a="#2ee88a" s={{ minWidth: 0 }}><div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>{["pyATS", "Meraki", "NetBox", "ACI", "ISE", "AWS×6", "GCP×4", "Grafana", "+30"].map((s, i) => <T key={i} color="#2ee88a">{s}</T>)}</div><div style={{ fontSize: 9, color: "#3f4d66", marginTop: 4 }}>46 servers · Apache-2.0</div></Bx>
            <Bx title="New MCPs" icon="🔧" a="#9a6cf0" s={{ minWidth: 0 }}><div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>{["Prisma Access", "CF ZT", "OPNsense", "Palo Alto", "Mist"].map((s, i) => <T key={i} color="#9a6cf0">{s}</T>)}</div><div style={{ fontSize: 9, color: "#3f4d66", marginTop: 4 }}>5 servers · We build</div></Bx>
            <Bx title="Zabbix MCP" icon="📊" a="#e05070" s={{ minWidth: 0 }}><div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>{["Hosts", "Items", "Triggers", "Problems", "Templates", "Discovery"].map((s, i) => <T key={i} color="#e05070">{s}</T>)}</div><div style={{ fontSize: 9, color: "#3f4d66", marginTop: 4 }}>40+ tools · MIT</div></Bx>
          </div>
          <Ar label="Devices · Cloud · SaaS · Monitoring" />
          <Bx title="Infrastructure + Monitoring" a="#4f5c72" icon="🌐"><div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>{["Cisco IOS", "NX-OS", "Juniper", "Arista", "Palo Alto", "F5", "OPNsense", "AWS", "GCP", "Meraki", "Prisma", "CF ZT", "Zabbix", "Grafana", "ThousandEyes"].map((t, i) => <T key={i}>{t}</T>)}</div></Bx>
          <div style={{ marginTop: 4, padding: "10px 14px", borderRadius: 9, background: "linear-gradient(135deg, #2ee88a06, #4a7cff06)", border: "1px dashed #2ee88a20", textAlign: "center" }}><div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 700, color: "#2ee88a" }}>docker compose --profile monitoring --profile msp up -d</div><div style={{ fontSize: 9, color: "#4f5c72", marginTop: 3 }}>Full platform + Zabbix + n8n. One command.</div></div>
        </div>)}

        {/* ═══ OBSERVABILITY & INCIDENTS ═══ */}
        {tab === 1 && (<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Bx title="Zabbix — Core Monitoring Engine" icon="📊" a="#e05070">
            <div style={{ fontSize: 11, color: "#8a95ab", lineHeight: 1.6, marginBottom: 10 }}>Industry-standard for MSPs. SNMP polling, agent-based, ICMP, HTTP checks. Self-hosted Docker or connect to customer's existing Zabbix. Existing MCP server with 40+ tools.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "#e0507006", border: "1px solid #e0507010" }}><div style={{ fontSize: 9.5, fontWeight: 700, color: "#e05070", marginBottom: 4 }}>ZABBIX MCP TOOLS</div>{["Host management (list, create, details)", "Item queries (metrics, history, latest data)", "Trigger status (active problems, details)", "Template management (list, assign)", "Problem management (ack, close, correlate)", "Maintenance windows (create, manage)", "Network discovery (rules, results)", "Event history + correlation"].map((t, i) => <Li key={i}>{t}</Li>)}</div>
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "#4a7cff06", border: "1px solid #4a7cff10" }}><div style={{ fontSize: 9.5, fontWeight: 700, color: "#4a7cff", marginBottom: 4 }}>INTEGRATION PATTERN</div>{["Zabbix webhook → our /webhooks/alerts/zabbix", "Real-time alert ingestion + normalization", "Agent queries Zabbix MCP for investigation", "\"What's CPU trend for this host last 4hrs?\"", "Zabbix SLA data feeds our SLA tracking", "Per-tenant Zabbix host groups for isolation", "Docker profile: --profile monitoring"].map((t, i) => <Li key={i}>{t}</Li>)}</div>
            </div>
          </Bx>
          <Bx title="Full Observability Stack" icon="🔭" a="#e8a040">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 6 }}>
              {[
                { name: "Zabbix", role: "Core monitoring", tools: "40+ MCP tools", tier: "Essential+", c: "#e05070" },
                { name: "Grafana", role: "Dashboards + alerting", tools: "75+ MCP tools", tier: "Enterprise", c: "#e8a040" },
                { name: "Prometheus", role: "Metric collection + PromQL", tools: "6 MCP tools", tier: "Enterprise", c: "#2ee88a" },
                { name: "ThousandEyes", role: "WAN path + BGP", tools: "29 MCP tools", tier: "Enterprise", c: "#4a7cff" },
                { name: "pyATS Health", role: "Device CLI checks", tools: "Built-in", tier: "Community", c: "#9a6cf0" },
              ].map((t, i) => (
                <div key={i} style={{ padding: "8px 10px", borderRadius: 7, background: `${t.c}05`, border: `1px solid ${t.c}10` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 10.5, fontWeight: 700, color: t.c }}>{t.name}</span><B color="#4f5c72" ghost>{t.tier}</B></div>
                  <div style={{ fontSize: 9.5, color: "#6d7a90" }}>{t.role}</div>
                  <div style={{ fontSize: 9, color: "#4f5c72", marginTop: 2 }}>{t.tools}</div>
                </div>
              ))}
            </div>
          </Bx>
          <Bx title="Alert Pipeline" icon="🚨" a="#e05070">
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { step: "INGEST", desc: "Webhooks from Zabbix, Grafana, Meraki, Prisma, CloudWatch, pyATS + generic", c: "#e05070" },
                { step: "NORMALIZE", desc: "All alerts → { tenant, site, device, source, severity, title, dedup_key }", c: "#e8a040" },
                { step: "PROCESS", desc: "Dedup (15min window) → Correlate (site+time) → Severity upgrade → Tenant route → Tier check", c: "#4a7cff" },
                { step: "ACT", desc: "HIGH+ on Professional tier → Create incident → AI auto-investigate → Notify. Else → log + include in report", c: "#2ee88a" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, background: "#0d1119", border: "1px solid #171e2c" }}>
                  <B color={s.c}>{s.step}</B>
                  <div style={{ fontSize: 10.5, color: "#8a95ab", flex: 1 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </Bx>
          <Bx title="Built-in Incident Management" icon="🛡" a="#4a7cff">
            <div style={{ fontSize: 10.5, color: "#6d7a90", marginBottom: 8, lineHeight: 1.5 }}>Built into our platform (not external tool) because it must be multi-tenant, AI-integrated, and customer-visible. We integrate <em>with</em> external paging tools (PagerDuty, Slack, etc.) via webhooks but own the lifecycle.</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {["OPEN", "→", "INVESTIGATING", "→", "IDENTIFIED", "→", "FIX_IN_PROGRESS", "→", "RESOLVED", "→", "POST_MORTEM"].map((s, i) => (
                s === "→" ? <span key={i} style={{ color: "#2a3348", fontSize: 10, alignSelf: "center" }}>→</span> :
                <B key={i} color={s === "OPEN" ? "#e05070" : s === "RESOLVED" ? "#2ee88a" : "#4a7cff"}>{s}</B>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <div style={{ padding: "8px 10px", borderRadius: 7, background: "#9a6cf006", border: "1px solid #9a6cf010" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#9a6cf0", marginBottom: 4 }}>AI AUTO-INVESTIGATION</div>
                {["Agent receives alert context", "Queries Zabbix MCP: host details + trends", "Queries pyATS: show commands on device", "Queries platform MCP: uplink, tunnel status", "Produces: diagnosis + recommended actions", "Stored in incident.investigation"].map((t, i) => <Li key={i}>{t}</Li>)}
              </div>
              <div style={{ padding: "8px 10px", borderRadius: 7, background: "#2ee88a06", border: "1px solid #2ee88a10" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#2ee88a", marginBottom: 4 }}>AI POST-MORTEM</div>
                {["Agent drafts RCA on resolution", "Timeline of events", "Root cause + impact assessment", "Remediation steps taken", "Prevention recommendations", "MSP reviews before publishing to customer"].map((t, i) => <Li key={i}>{t}</Li>)}
              </div>
            </div>
          </Bx>
        </div>)}

        {/* ═══ MCP SERVERS ═══ */}
        {tab === 2 && (<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Bx title="New MCP Build Sequence" icon="🔧" a="#9a6cf0">
            {[
              { n: "Prisma Access / SCM", sdk: "pan-scm-sdk", t: "8-10", w: "3-4w", why: "Zero competition — highest value", p: "P0", c: "#e05070" },
              { n: "Cloudflare Zero Trust", sdk: "CF API (TS)", t: "8-10", w: "2-3w", why: "Our target SASE vendor", p: "P0", c: "#e8a040" },
              { n: "OPNsense", sdk: "REST API (TS)", t: "6-8", w: "2-3w", why: "Free appliance target", p: "P0", c: "#e8a040" },
              { n: "Palo Alto VM-Series", sdk: "PAN-OS XML", t: "8-10", w: "4-5w", why: "Complex but high value", p: "P1", c: "#4a7cff" },
              { n: "Juniper Mist", sdk: "mistapi", t: "6-8", w: "2-3w", why: "Wireless complement", p: "P1", c: "#4a7cff" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, background: "#0d1119", border: "1px solid #171e2c", marginBottom: 3 }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: `${s.c}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: s.c, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}><span style={{ fontSize: 11.5, fontWeight: 700, color: "#e0e6f0" }}>{s.n}</span><B color={s.c}>{s.p}</B><B color="#4f5c72" ghost>{s.w}</B><B color="#4f5c72" ghost>{s.t} tools</B></div><div style={{ fontSize: 9.5, color: "#4f5c72", marginTop: 1 }}>{s.sdk} — {s.why}</div></div>
              </div>
            ))}
          </Bx>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Bx title="Zabbix MCP (Existing)" icon="📊" a="#e05070"><div style={{ fontSize: 10, color: "#8a95ab", marginBottom: 6 }}>mpeirone/zabbix-mcp-server — 40+ tools, FastMCP Python, Docker, MIT. Read-only mode.</div><div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>{["Hosts", "Items", "Triggers", "Problems", "Templates", "Discovery", "Maintenance", "Events", "History", "Graphs"].map((t, i) => <T key={i} color="#e05070">{t}</T>)}</div></Bx>
            <Bx title="Zscaler MCP (Reference)" icon="📐" a="#e8a040"><div style={{ fontSize: 10, color: "#8a95ab", marginBottom: 6 }}>Architecture patterns to replicate in all new servers:</div><div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>{["<10 tools/session", "SDK-based", "Read-only default", "Writes gated", "Behavioral tests", "FastMCP", "Structured errors"].map((p, i) => <T key={i} color="#e8a040">{p}</T>)}</div></Bx>
          </div>
          <Bx title="NetClaw Fork — 46 Servers (Apache-2.0)" icon="🔄" a="#2ee88a">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 5 }}>
              {[
                { cat: "Device", items: ["pyATS", "JunOS", "F5", "CatC", "CVP"], c: "#2ee88a" },
                { cat: "Infra", items: ["ACI", "ISE", "NetBox", "Nautobot", "ServiceNow", "Itential"], c: "#4a7cff" },
                { cat: "Cloud Managed", items: ["Meraki(804)", "TE×2", "RADKit", "SD-WAN"], c: "#9a6cf0" },
                { cat: "Cloud", items: ["AWS×6", "GCP×4"], c: "#e8a040" },
                { cat: "Observability", items: ["Grafana(75+)", "Prometheus", "Kubeshark"], c: "#2ee88a" },
                { cat: "Lab+Security+Utils", items: ["CML", "FMC", "NVD", "Protocol", "Draw.io", "+12"], c: "#4f5c72" },
              ].map((g, i) => (
                <div key={i} style={{ padding: "7px 9px", borderRadius: 6, background: `${g.c}03`, border: `1px solid ${g.c}0c` }}>
                  <div style={{ fontSize: 8.5, fontWeight: 800, color: g.c, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 4 }}>{g.cat}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>{g.items.map((item, j) => <T key={j} color={g.c}>{item}</T>)}</div>
                </div>
              ))}
            </div>
          </Bx>
        </div>)}

        {/* ═══ PRICING ═══ */}
        {tab === 3 && (<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Bx title="Orchestration Tool — SMB (Per-Site)" icon="🔧" a="#2ee88a">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 5 }}>
              {[
                { t: "Community", p: "Free", s: "3 sites", c: "#4f5c72", f: ["Config backup", "Health dashboard", "Device inventory"] },
                { t: "Essential", p: "$49/mo", s: "10 sites", c: "#2ee88a", f: ["+ Compliance scanning", "+ Config drift", "+ Zabbix integration", "+ Topology + alerts"] },
                { t: "Professional", p: "$149/mo", s: "50 sites", c: "#4a7cff", f: ["+ AI troubleshoot", "+ Config deploy", "+ Incident management", "+ Meraki/Prisma/CF ZT", "+ CVE scanning"] },
                { t: "Enterprise", p: "$599/mo", s: "250 sites", c: "#9a6cf0", f: ["+ Fleet parallel ops", "+ ACI/ISE/SD-WAN", "+ Grafana/Prometheus", "+ n8n workflows", "+ API + RBAC + on-prem"] },
              ].map((tier, i) => (
                <div key={i} style={{ padding: "12px", borderRadius: 9, background: `${tier.c}04`, border: `1px solid ${tier.c}12` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ fontSize: 10.5, fontWeight: 800, color: tier.c }}>{tier.t}</span><span style={{ fontSize: 13, fontWeight: 900, color: "#e0e6f0" }}>{tier.p}</span></div>
                  <div style={{ fontSize: 9, color: "#4f5c72", fontWeight: 600, marginBottom: 6 }}>{tier.s}</div>
                  {tier.f.map((f, j) => <div key={j} style={{ fontSize: 10, color: "#8a95ab", padding: "1px 0" }}>{f}</div>)}
                </div>
              ))}
            </div>
          </Bx>
          <Bx title="NaaS Portal — MSP (Per-Tenant)" icon="🏢" a="#4a7cff">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 5 }}>
              {[
                { t: "Starter", b: "$199/mo", e: "+$15", c: "#2ee88a", f: ["Multi-tenant dashboard", "White-label reports", "Zabbix per-tenant", "Customer onboarding"] },
                { t: "Professional", b: "$499/mo", e: "+$25", c: "#4a7cff", f: ["+ Compliance-as-a-Service", "+ Cross-tenant analytics", "+ n8n templates", "+ SLA tracking"] },
                { t: "Enterprise", b: "$799/mo", e: "+$40", c: "#9a6cf0", f: ["+ Per-tenant AI agent", "+ AI post-mortems", "+ SOC integration", "+ Full API + webhooks"] },
              ].map((tier, i) => (
                <div key={i} style={{ padding: "12px", borderRadius: 9, background: `${tier.c}04`, border: `1px solid ${tier.c}12` }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: tier.c, marginBottom: 3 }}>{tier.t}</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "baseline" }}><span style={{ fontSize: 13, fontWeight: 900, color: "#e0e6f0" }}>{tier.b}</span><span style={{ fontSize: 9.5, fontWeight: 600, color: "#e8a040" }}>{tier.e}/tenant</span></div>
                  {tier.f.map((f, j) => <div key={j} style={{ fontSize: 10, color: "#8a95ab", padding: "1px 0" }}>{f}</div>)}
                </div>
              ))}
            </div>
          </Bx>
          <Bx title="GitLab-Style Licensing Split" icon="⚖️" a="#e8a040">
            <div style={{ fontSize: 10, color: "#6d7a90", marginBottom: 8, lineHeight: 1.5 }}>Two directories in one repo, each with its own LICENSE file. Not "same codebase with license check" — a clean legal separation. Enterprise code is visible for audit but requires commercial license.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <div style={{ padding: 10, borderRadius: 7, background: "#2ee88a05", border: "1px solid #2ee88a0c" }}><div style={{ fontSize: 9.5, fontWeight: 800, color: "#2ee88a", marginBottom: 5 }}>community/ · Apache-2.0</div>{["Single-tenant FastAPI backend", "LangGraph agent (full)", "Basic dashboard + agent chat", "APScheduler (health, backup)", "3 sites, unlimited devices", "Docker Compose self-hosted"].map((i, j) => <div key={j} style={{ fontSize: 10, color: "#8a95ab", padding: "1.5px 0" }}>▸ {i}</div>)}</div>
              <div style={{ padding: 10, borderRadius: 7, background: "#e0507005", border: "1px solid #e050700c" }}><div style={{ fontSize: 9.5, fontWeight: 800, color: "#e05070", marginBottom: 5 }}>enterprise/ · Proprietary</div>{["Multi-tenant + MSP portal", "Customer self-service portal", "Incident mgmt + AI investigation", "Fleet ops, RBAC, SSO", "White-label + reports + billing", "Site connector + n8n templates"].map((i, j) => <div key={j} style={{ fontSize: 10, color: "#8a95ab", padding: "1.5px 0" }}>▸ {i}</div>)}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
              <div style={{ padding: 10, borderRadius: 7, background: "#4a7cff05", border: "1px solid #4a7cff0c" }}><div style={{ fontSize: 9.5, fontWeight: 800, color: "#4a7cff", marginBottom: 5 }}>skills/ · Apache-2.0</div><div style={{ fontSize: 10, color: "#8a95ab" }}>▸ All 120+ SKILL.md files — always open for ecosystem growth</div></div>
              <div style={{ padding: 10, borderRadius: 7, background: "#9a6cf005", border: "1px solid #9a6cf00c" }}><div style={{ fontSize: 9.5, fontWeight: 800, color: "#9a6cf0", marginBottom: 5 }}>servers/ · Apache-2.0</div><div style={{ fontSize: 10, color: "#8a95ab" }}>▸ All 52 MCP servers — always open for ecosystem growth</div></div>
            </div>
            <div style={{ fontSize: 9.5, color: "#4f5c72", marginTop: 8, textAlign: "center", fontStyle: "italic" }}>Signed JWT license key validated locally. No phone-home. Enterprise imports community, never reverse.</div>
          </Bx>
        </div>)}

        {/* ═══ SKILLS & SAFETY ═══ */}
        {tab === 4 && (<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 6 }}>
            {[
              { t: "Tier 1", n: "Read-Only", r: "AUTO", d: "Query, analyze, report.", ex: "Health, compliance, topology, backup", c: "#2ee88a" },
              { t: "Tier 2", n: "Write (Human)", r: "APPROVAL", d: "Modify with confirmation.", ex: "Config deploy, firewall, ACL", c: "#e8a040" },
              { t: "Tier 3", n: "Auto Low-Risk", r: "VALIDATED", d: "Bounded ops after validation.", ex: "Tags, reports, backup triggers", c: "#e05070" },
            ].map((s, i) => (
              <Bx key={i} a={s.c} s={{ minWidth: 0 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}><span style={{ fontSize: 10.5, fontWeight: 800, color: s.c }}>{s.t}: {s.n}</span><B color={s.c}>{s.r}</B></div><div style={{ fontSize: 10, color: "#8a95ab", marginBottom: 4 }}>{s.d}</div><div style={{ fontSize: 9, color: "#4f5c72", fontStyle: "italic" }}>{s.ex}</div></Bx>
            ))}
          </div>
          <Bx title="Skill Inventory — 120+ Total" icon="📚" a="#e0e6f0">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 5 }}>
              {[
                { cat: "Device Automation", n: "18", src: "Fork", c: "#2ee88a" },
                { cat: "Domain Operations", n: "9", src: "Fork", c: "#4a7cff" },
                { cat: "Meraki", n: "5", src: "Fork", c: "#9a6cf0" },
                { cat: "Cloud AWS+GCP", n: "8", src: "Fork", c: "#e8a040" },
                { cat: "Observability (Grafana/Prom/Zabbix)", n: "4+", src: "Fork+New", c: "#e05070" },
                { cat: "Enterprise (TE/Itential/NSO/SD-WAN)", n: "9", src: "Fork", c: "#4a7cff" },
                { cat: "Prisma / CF ZT / OPNsense", n: "15-21", src: "NEW", c: "#e05070" },
                { cat: "Palo Alto / Mist", n: "9-13", src: "NEW", c: "#e05070" },
                { cat: "Incident Investigation", n: "3-5", src: "NEW", c: "#9a6cf0" },
                { cat: "Utilities + Integration", n: "16", src: "Fork", c: "#4f5c72" },
              ].map((g, i) => (
                <div key={i} style={{ padding: "7px 9px", borderRadius: 6, background: `${g.c}03`, border: `1px solid ${g.c}0c` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: g.c }}>{g.cat}</span><div style={{ display: "flex", gap: 2 }}><B color={g.c}>{g.n}</B><B color={g.src === "NEW" || g.src === "Fork+New" ? "#e05070" : "#4f5c72"} ghost>{g.src}</B></div></div>
                </div>
              ))}
            </div>
          </Bx>
        </div>)}

        {/* ═══ STACK ═══ */}
        {tab === 5 && (<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 7 }}>
            {[
              { t: "Backend", i: "⚡", c: "#e8a040", items: ["FastAPI (single app)", "LangGraph (agent)", "ChatAnthropic (LLM)", "langchain-mcp-adapters", "APScheduler", "SQLAlchemy + Alembic"] },
              { t: "Frontend", i: "🖥", c: "#9a6cf0", items: ["TanStack Start", "shadcn/ui", "Tailwind CSS", "Render hosting"] },
              { t: "Data", i: "🗄", c: "#4a7cff", items: ["PostgreSQL + pgvector", "Neon (cloud free)", "Backblaze B2 / MinIO", "boto3 (S3 client)"] },
              { t: "Monitoring", i: "📊", c: "#e05070", items: ["Zabbix 7.0 (Docker)", "Zabbix MCP (40+ tools)", "Grafana + Prometheus", "ThousandEyes MCP"] },
              { t: "Incidents", i: "🛡", c: "#2ee88a", items: ["Built-in (FastAPI)", "Alert pipeline", "AI auto-investigation", "SLA tracking", "Webhook to PagerDuty/Slack"] },
              { t: "Workflows", i: "⚙️", c: "#e8a040", items: ["n8n (Docker profile)", "Custom node package", "8 pre-built templates", "LangGraph for AI reasoning"] },
              { t: "Agentic AI", i: "🧠", c: "#4a7cff", items: ["LangGraph (orchestration)", "LangChain (LLM framework)", "langchain-mcp-adapters", "LiteLLM (Phase 2-3)", "pgvector → Qdrant (if needed)", "Single-agent, 3 nodes"] },
              { t: "Auth & Billing", i: "🔐", c: "#e05070", items: ["python-jose (JWT)", "slowapi (rate limit)", "Stripe", "Signed JWT license key", "GitLab-style split"] },
              { t: "Connectivity", i: "🔌", c: "#2ee88a", items: ["Phase 1-2: on-prem Docker", "Phase 3+: site connector", "Outbound WSS (no FW rules)", "Same image, --mode flag", "CF Tunnel as alternative"] },
              { t: "DevOps", i: "🏗", c: "#4f5c72", items: ["Docker Compose", "Render auto-deploy", "Sentry (errors)", "CF DNS/CDN only", "community/ + enterprise/ split"] },
            ].map((s, i) => (
              <Bx key={i} title={s.t} icon={s.i} a={s.c}>{s.items.map((item, j) => <Li key={j}>{item}</Li>)}</Bx>
            ))}
          </div>
          <Bx title="Key Decisions" icon="🎯" a="#e8a040">
            {[
              { q: "Monitoring", a: "Zabbix (40+ MCP)", w: "MSP industry standard, self-hostable, SNMP/agent" },
              { q: "Incidents", a: "Built-in (not external)", w: "Must be multi-tenant, AI-integrated, customer-visible" },
              { q: "Workflow", a: "n8n + LangGraph", w: "n8n routes business process; LangGraph does AI reasoning" },
              { q: "On-call paging", a: "Integrate customer's tool", w: "Webhook to PagerDuty/Slack; don't rebuild paging" },
              { q: "Platform", a: "Pure Python, Docker", w: "Portable: cloud, on-prem, laptop" },
              { q: "Open-core", a: "GitLab-style split", w: "community/ Apache-2.0 + enterprise/ proprietary" },
              { q: "Licensing", a: "Signed JWT, no phone-home", w: "On-prem friendly, local validation" },
              { q: "Device connectivity", a: "On-prem first, connector Ph3", w: "Ship fast; site connector when SaaS customers need it" },
              { q: "NetClaw", a: "Fork + convert skills", w: "82 skills domain knowledge; strip OpenClaw, replace w/ LangGraph" },
              { q: "MCP priority", a: "Prisma Access first", w: "Zero competition, highest value" },
              { q: "Database", a: "PostgreSQL + pgvector", w: "Relational data, self-hostable; Qdrant later if needed" },
              { q: "Dropped CF platform", a: "Pure Python instead", w: "Over-engineered, blocked on-prem, slowed shipping" },
            ].map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 10.5, borderBottom: i < 6 ? "1px solid #171e2c" : "none", flexWrap: "wrap" }}>
                <span style={{ width: 100, flexShrink: 0, fontWeight: 600, color: "#4f5c72" }}>{d.q}</span>
                <span style={{ width: 150, flexShrink: 0, fontWeight: 700, color: "#2ee88a" }}>{d.a}</span>
                <span style={{ color: "#5a6577", flex: 1 }}>{d.w}</span>
              </div>
            ))}
          </Bx>
        </div>)}

        {/* ═══ ROADMAP ═══ */}
        {tab === 6 && (<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { ph: "Phase 1", t: "Foundation + Community", wk: "Wk 1-3", rev: "$0", cost: "~$7/mo", c: "#2ee88a", active: true, items: ["Fork NetClaw → LangGraph", "4 skills: health, backup, topology, subnet", "Docker Compose: FastAPI + Postgres + MinIO", "Basic TanStack UI on Render", "LAUNCH: Community edition — 3 sites"] },
            { ph: "Phase 2", t: "Essential + Zabbix", wk: "Wk 4-6", rev: "$245-490", cost: "~$15/mo", c: "#4a7cff", items: ["6 skills: compliance, drift, drawio, alerts", "Zabbix MCP integration + alert ingestion", "Health trends + topology in UI", "Stripe billing + license key system", "LAUNCH: Essential tier"] },
            { ph: "Phase 3", t: "Professional + MCPs + Incidents", wk: "Wk 7-11", rev: "$1.5-2.5K", cost: "~$50/mo", c: "#e8a040", items: ["8 skills: troubleshoot, config-deploy, meraki×5, CVE", "Alert pipeline + incident management", "AI auto-investigation on critical alerts", "BUILD: Prisma Access MCP (P0)", "BUILD: Cloudflare ZT MCP (P0)", "BUILD: OPNsense MCP (P0)", "LAUNCH: Professional tier + 3 MCPs"] },
            { ph: "Phase 4", t: "Enterprise + MSP Portal", wk: "Wk 12-16", rev: "$5.5-9K", cost: "~$120/mo", c: "#9a6cf0", items: ["~20 skills: parallel-ops, aci, ise, sdwan, grafana, fmc", "MSP portal: multi-tenant + white-label + customer portal", "n8n integration + workflow templates", "BUILD: Palo Alto MCP (P1) + Mist MCP (P1)", "SLA tracking + AI post-mortems", "LAUNCH: Enterprise + MSP Starter"] },
            { ph: "Phase 5", t: "Scale + Ecosystem", wk: "Wk 17-22", rev: "$15-25K", cost: "~$200/mo", c: "#e05070", items: ["MSP Professional + Enterprise tiers", "Custom skill packs per vertical", "Enterprise SSO + cross-tenant analytics", "On-prem Docker packaging", "Open-source public launch: npm + Docker Hub + MCP Registry"] },
          ].map((p, i) => (
            <div key={i} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${p.c}${p.active ? "30" : "12"}`, background: p.active ? `${p.c}03` : "#0d1119" }}>
              <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4, borderBottom: `1px solid ${p.c}0c`, background: `${p.c}03` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><B color={p.c}>{p.ph}</B><span style={{ fontSize: 12, fontWeight: 700, color: "#e0e6f0" }}>{p.t}</span><span style={{ fontSize: 9.5, color: "#3f4d66" }}>{p.wk}</span></div>
                <div style={{ display: "flex", gap: 4 }}><B color="#2ee88a" ghost>Rev: {p.rev}</B><B color="#e05070" ghost>Cost: {p.cost}</B></div>
              </div>
              <div style={{ padding: "8px 14px" }}>
                {p.items.map((item, j) => { const isBuild = item.startsWith("BUILD:"); const isLaunch = item.startsWith("LAUNCH:"); return (
                  <div key={j} style={{ fontSize: 11, padding: "2.5px 0", color: isLaunch ? p.c : isBuild ? "#9a6cf0" : "#8a95ab", fontWeight: isLaunch || isBuild ? 700 : 400, display: "flex", alignItems: "start", gap: 6 }}>
                    <span style={{ fontSize: 5.5, marginTop: 5, color: isLaunch ? p.c : "#2a3348" }}>{isLaunch ? "★" : isBuild ? "◆" : "●"}</span>{item}
                  </div>
                ); })}
              </div>
            </div>
          ))}
        </div>)}

      </div>
    </div>
  );
}
