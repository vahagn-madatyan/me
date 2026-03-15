import { useState } from "react";

const TABS = ["Architecture", "Data Flow", "Agent Pipeline", "Plugin System", "Tech Stack", "Roadmap"];

const colors = {
  bg: "#0a0e17",
  surface: "#111827",
  surfaceLight: "#1a2235",
  border: "#1e2d45",
  borderActive: "#00e5a0",
  accent: "#00e5a0",
  accentDim: "rgba(0,229,160,0.15)",
  accentGlow: "rgba(0,229,160,0.3)",
  warn: "#f59e0b",
  warnDim: "rgba(245,158,11,0.15)",
  danger: "#ef4444",
  dangerDim: "rgba(239,68,68,0.15)",
  blue: "#3b82f6",
  blueDim: "rgba(59,130,246,0.15)",
  purple: "#a855f7",
  purpleDim: "rgba(168,85,247,0.15)",
  text: "#e2e8f0",
  textDim: "#64748b",
  textMuted: "#475569",
};

const fontStack = "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace";
const sansStack = "'Inter', -apple-system, sans-serif";

function Badge({ children, color = colors.accent, bg = colors.accentDim }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 4,
      fontSize: 10, fontWeight: 600, letterSpacing: "0.05em",
      color: color, background: bg, fontFamily: fontStack, textTransform: "uppercase",
    }}>{children}</span>
  );
}

function Card({ title, badge, children, accent = colors.accent, glowing = false }) {
  return (
    <div style={{
      background: colors.surface, border: `1px solid ${colors.border}`,
      borderRadius: 8, padding: 20, position: "relative", overflow: "hidden",
      boxShadow: glowing ? `0 0 30px ${accent}15` : "none",
    }}>
      {glowing && <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
      }} />}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: colors.text, fontFamily: sansStack }}>{title}</span>
        {badge && <Badge color={accent} bg={accent + "20"}>{badge}</Badge>}
      </div>
      {children}
    </div>
  );
}

function FlowNode({ label, sub, color = colors.accent, icon, width = 160 }) {
  return (
    <div style={{
      width, padding: "12px 14px", background: color + "10", border: `1px solid ${color}40`,
      borderRadius: 6, textAlign: "center",
    }}>
      {icon && <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>}
      <div style={{ fontSize: 11, fontWeight: 700, color, fontFamily: fontStack, letterSpacing: "0.03em" }}>{label}</div>
      {sub && <div style={{ fontSize: 9, color: colors.textDim, marginTop: 3, fontFamily: sansStack }}>{sub}</div>}
    </div>
  );
}

function Arrow({ direction = "right", color = colors.accent }) {
  if (direction === "right") return <div style={{ color, fontSize: 18, padding: "0 4px" }}>→</div>;
  return <div style={{ color, fontSize: 18, padding: "4px 0", textAlign: "center" }}>↓</div>;
}

function ArchitectureView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="System Overview" badge="Production Architecture" glowing>
          <p style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.7, margin: 0, fontFamily: sansStack }}>
            An agentic AI system powered by the LangChain ecosystem (LangGraph + Deep Agents) that ingests traffic flows, analyzes patterns, and autonomously manages firewall rules.
            Starting with AWS Security Groups and Palo Alto Cloud NGFW, with AWS Bedrock as the primary LLM provider. Python CLI first, TypeScript web GUI later.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <Badge>Python CLI + TypeScript GUI</Badge>
            <Badge color={colors.blue} bg={colors.blueDim}>LangGraph + Deep Agents</Badge>
            <Badge color={colors.purple} bg={colors.purpleDim}>Plugin System</Badge>
            <Badge color={colors.warn} bg={colors.warnDim}>Open-Core</Badge>
          </div>
        </Card>
        <Card title="Deployment Modes" badge="Loki Pattern">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { mode: "CLI / Laptop", desc: "Python package, DuckDB + SQLite, Ollama", flag: "pip install", c: colors.accent },
              { mode: "Self-hosted Docker", desc: "Docker Compose, Redis, PostgreSQL", flag: "docker-compose", c: colors.blue },
              { mode: "Cloud Distributed", desc: "CF Workers, Kafka, ClickHouse", flag: "per-service", c: colors.purple },
            ].map((d, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "8px 12px",
                background: d.c + "08", borderRadius: 6, border: `1px solid ${d.c}20`,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", background: d.c,
                  boxShadow: `0 0 8px ${d.c}`,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: colors.text, fontFamily: fontStack }}>{d.mode}</div>
                  <div style={{ fontSize: 10, color: colors.textDim, fontFamily: sansStack }}>{d.desc}</div>
                </div>
                <code style={{ fontSize: 9, color: d.c, fontFamily: fontStack, background: d.c + "15", padding: "2px 6px", borderRadius: 3 }}>{d.flag}</code>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card title="High-Level Architecture" badge="End to End">
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <FlowNode label="LOG SOURCES" sub="Palo Alto Cloud NGFW · AWS VPC Flow Logs" color={colors.textDim} icon="📡" width={200} />
            <Arrow />
            <FlowNode label="VECTOR" sub="Parse · Normalize via VRL" color={colors.blue} icon="⚡" />
            <Arrow />
            <FlowNode label="BUFFER" sub="Kafka / In-Memory" color={colors.warn} icon="📦" />
            <Arrow />
            <FlowNode label="STORAGE" sub="ClickHouse · DuckDB · Parquet" color={colors.purple} icon="💾" />
          </div>
          <Arrow direction="down" />
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "14px 20px",
            background: colors.accentDim, border: `1px solid ${colors.accent}30`,
            borderRadius: 8, flexWrap: "wrap", justifyContent: "center",
          }}>
            <FlowNode label="1. ANALYZE" sub="Traffic Patterns" color={colors.accent} width={130} />
            <Arrow />
            <FlowNode label="2. ASSESS" sub="Security Posture" color={colors.accent} width={130} />
            <Arrow />
            <FlowNode label="3. GENERATE" sub="Policy (Vendor-neutral)" color={colors.accent} width={140} />
            <Arrow />
            <FlowNode label="4. DECIDE" sub="Create / Update Rule" color={colors.accent} width={130} />
          </div>
          <Arrow direction="down" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <FlowNode label="HUMAN GATE" sub="Risk-based approval" color={colors.warn} icon="🛡️" width={150} />
            <Arrow />
            <FlowNode label="FIREWALL PLUGINS" sub="Translate · Apply · Commit" color={colors.danger} icon="🔥" width={160} />
            <Arrow />
            <FlowNode label="AUDIT LOG" sub="Event-sourced · Immutable" color={colors.blue} icon="📋" width={150} />
          </div>
        </div>
      </Card>
    </div>
  );
}

function DataFlowView() {
  const logFormats = [
    { vendor: "Palo Alto Cloud NGFW", format: "Structured Syslog", example: "Cloud-native API + log forwarding", c: colors.accent },
    { vendor: "AWS VPC Flow Logs", format: "Space-Delimited", example: "v2–v7 configurable fields", c: colors.warn },
    { vendor: "Fortinet", format: "Key-Value Pairs", example: 'srcip=10.1.100.11 dstport=80 (future)', c: colors.textMuted },
    { vendor: "GCP VPC", format: "Nested JSON", example: "connection sub-objects (future)", c: colors.textMuted },
  ];
  const schema = ["src_ip", "dst_ip", "src_port", "dst_port", "protocol", "action", "bytes", "timestamp", "rule_id", "app_name"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card title="Log Format Normalization" badge="Vector VRL" glowing>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {logFormats.map((l, i) => (
            <div key={i} style={{
              padding: "10px 14px", background: l.c + "08", border: `1px solid ${l.c}25`,
              borderRadius: 6,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: l.c, fontFamily: fontStack }}>{l.vendor}</span>
                <Badge color={l.c} bg={l.c + "20"}>{l.format}</Badge>
              </div>
              <div style={{ fontSize: 10, color: colors.textDim, marginTop: 6, fontFamily: fontStack }}>{l.example}</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Unified Schema" badge="OCSF-Inspired">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {schema.map((f, i) => (
              <div key={i} style={{
                padding: "4px 10px", background: colors.surfaceLight, border: `1px solid ${colors.border}`,
                borderRadius: 4, fontSize: 11, fontFamily: fontStack, color: colors.accent,
              }}>{f}</div>
            ))}
          </div>
          <p style={{ fontSize: 10, color: colors.textDim, marginTop: 12, lineHeight: 1.6, fontFamily: sansStack }}>
            These 10 fields enable every analysis: anomaly detection, exfiltration profiling,
            unused-rule identification, and zero-trust microsegmentation.
          </p>
        </Card>
        <Card title="Storage Architecture" badge="Tiered">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { tier: "CLI Tier", items: ["DuckDB (columnar OLAP)", "Parquet files", "SQLite (rules/audit)"], c: colors.accent },
              { tier: "Cloud Tier", items: ["ClickHouse (hot analytics)", "S3 Parquet (cold)", "PostgreSQL (rules)"], c: colors.purple },
            ].map((t, i) => (
              <div key={i} style={{ padding: "10px 14px", background: t.c + "08", borderRadius: 6, border: `1px solid ${t.c}20` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.c, fontFamily: fontStack, marginBottom: 6 }}>{t.tier}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {t.items.map((item, j) => (
                    <span key={j} style={{ fontSize: 10, color: colors.textDim, fontFamily: sansStack, background: colors.surfaceLight, padding: "2px 8px", borderRadius: 3 }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, padding: "8px 12px", background: colors.blueDim, borderRadius: 4 }}>
            <span style={{ fontSize: 10, color: colors.blue, fontFamily: fontStack }}>ClickHouse: 10–20x compression vs Elasticsearch, 70–85% less storage cost</span>
          </div>
        </Card>
      </div>
      <Card title="Processing Modes" badge="Hybrid">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { mode: "Micro-batch", interval: "30–60s", use: "Default pipeline processing", benefit: "95% real-time value at 30% cost", c: colors.accent },
            { mode: "Real-time Stream", interval: "<1s", use: "Threat detection (port scans, DDoS)", benefit: "ClickHouse materialized views", c: colors.danger },
            { mode: "Batch Analysis", interval: "1h–24h", use: "Policy optimization, compliance", benefit: "Statistical significance for rule changes", c: colors.blue },
          ].map((m, i) => (
            <div key={i} style={{ padding: "12px 14px", background: m.c + "08", borderRadius: 6, border: `1px solid ${m.c}20` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: m.c, fontFamily: fontStack }}>{m.mode}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: m.c, fontFamily: fontStack, margin: "6px 0" }}>{m.interval}</div>
              <div style={{ fontSize: 10, color: colors.textDim, fontFamily: sansStack, lineHeight: 1.5 }}>{m.use}</div>
              <div style={{ fontSize: 9, color: m.c, fontFamily: fontStack, marginTop: 6, opacity: 0.8 }}>{m.benefit}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AgentPipelineView() {
  const stages = [
    {
      n: 1, name: "ANALYZE", desc: "Traffic Pattern Analysis", c: colors.accent,
      inputs: ["Normalized flow logs", "Historical baselines", "Time-window aggregations"],
      outputs: ["Traffic clusters", "Anomaly scores", "Connection graphs"],
      llm: "LangGraph node → Bedrock Claude structured output",
    },
    {
      n: 2, name: "ASSESS", desc: "Security Posture Assessment", c: colors.blue,
      inputs: ["Traffic analysis", "Current firewall rules", "Threat intel feeds"],
      outputs: ["Risk scores per flow", "Rule gap analysis", "Compliance violations"],
      llm: "Deep Agent with tool-calling (FW query, threat intel)",
    },
    {
      n: 3, name: "GENERATE", desc: "Policy Generation", c: colors.purple,
      inputs: ["Security assessment", "Vendor capabilities", "Org security policies"],
      outputs: ["Vendor-neutral rule spec", "Business justification", "Impact analysis"],
      llm: "LangGraph node → Pydantic structured output",
    },
    {
      n: 4, name: "DECIDE", desc: "Rule Creation / Update Decision", c: colors.warn,
      inputs: ["Policy proposal", "Risk level", "Autonomy phase"],
      outputs: ["Action (create/update/skip)", "Vendor-specific rule", "Approval routing"],
      llm: "LangGraph human-in-the-loop interrupt gate",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card title="Agentic Pipeline Stages" badge="LangGraph State Machine" glowing>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {stages.map((s, i) => (
            <div key={i}>
              <div style={{
                display: "grid", gridTemplateColumns: "50px 1fr 1fr 1fr", gap: 12,
                padding: "14px", background: s.c + "06", borderRadius: 6, border: `1px solid ${s.c}20`,
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: s.c + "20", border: `2px solid ${s.c}`, fontSize: 14, fontWeight: 900, color: s.c, fontFamily: fontStack,
                  }}>{s.n}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: s.c, fontFamily: fontStack, marginTop: 4 }}>{s.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: colors.textMuted, fontFamily: fontStack, letterSpacing: "0.05em", marginBottom: 4 }}>INPUTS</div>
                  {s.inputs.map((inp, j) => (
                    <div key={j} style={{ fontSize: 10, color: colors.textDim, fontFamily: sansStack, padding: "1px 0" }}>• {inp}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: colors.textMuted, fontFamily: fontStack, letterSpacing: "0.05em", marginBottom: 4 }}>OUTPUTS</div>
                  {s.outputs.map((out, j) => (
                    <div key={j} style={{ fontSize: 10, color: colors.textDim, fontFamily: sansStack, padding: "1px 0" }}>• {out}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: colors.textMuted, fontFamily: fontStack, letterSpacing: "0.05em", marginBottom: 4 }}>AGENT EXECUTION</div>
                  <div style={{ fontSize: 10, color: s.c, fontFamily: fontStack }}>{s.llm}</div>
                </div>
              </div>
              {i < stages.length - 1 && (
                <div style={{ textAlign: "center", color: colors.textMuted, fontSize: 14, padding: "2px 0" }}>│</div>
              )}
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Orchestration Strategy" badge="LangChain Ecosystem">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { approach: "LangGraph", desc: "Graph-based orchestration, PostgresSaver checkpoints, human-in-the-loop interrupts, time-travel replay", rec: "Core Engine", c: colors.accent },
              { approach: "Deep Agents", desc: "LangChain agent harness with planning tool, filesystem backend, sub-agent spawning", rec: "Agent Layer", c: colors.purple },
              { approach: "LangChain", desc: "Tool calling, prompt chaining, memory, LangSmith observability & tracing", rec: "Foundation", c: colors.blue },
              { approach: "LangSmith", desc: "Production debugging, prompt testing, execution traces, eval suites", rec: "Observability", c: colors.warn },
            ].map((a, i) => (
              <div key={i} style={{ padding: "10px 12px", background: a.c + "08", borderRadius: 6, border: `1px solid ${a.c}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: a.c, fontFamily: fontStack }}>{a.approach}</span>
                  <Badge color={a.c} bg={a.c + "20"}>{a.rec}</Badge>
                </div>
                <div style={{ fontSize: 10, color: colors.textDim, marginTop: 4, fontFamily: sansStack }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="LLM Provider Abstraction" badge="BYOK">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { provider: "AWS Bedrock", features: "Claude Sonnet/Haiku, managed infra, IAM auth, pay-per-token", tier: "Primary", c: colors.accent },
              { provider: "LiteLLM", features: "100+ providers, OpenAI-compatible proxy, cost tracking, fallback routing", tier: "Router", c: colors.blue },
              { provider: "Ollama", features: "Local inference, Llama 3 / Mistral, zero cloud deps", tier: "CLI Local", c: colors.purple },
              { provider: "OpenAI / Anthropic Direct", features: "GPT-4o, Claude via API keys, fallback providers", tier: "Fallback", c: colors.warn },
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: p.c + "06", borderRadius: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.c }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.c, fontFamily: fontStack }}>{p.provider}</span>
                  <div style={{ fontSize: 9, color: colors.textDim, fontFamily: sansStack }}>{p.features}</div>
                </div>
                <Badge color={p.c} bg={p.c + "15"}>{p.tier}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card title="Graduated Autonomy" badge="Safety Model" accent={colors.warn}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {[
            { phase: "Phase 1", label: "Suggest Only", desc: "AI proposes, humans apply", risk: "Default", c: colors.accent, free: true },
            { phase: "Phase 2", label: "Auto Low Risk", desc: "Block threat intel IPs, known services", risk: "Low", c: colors.blue, free: false },
            { phase: "Phase 3", label: "Auto Medium", desc: "Tighten rules, incident response", risk: "Medium", c: colors.warn, free: false },
            { phase: "Phase 4", label: "Human-on-Loop", desc: "Autonomous within policy constraints", risk: "Mature only", c: colors.purple, free: false },
          ].map((p, i) => (
            <div key={i} style={{ padding: "12px", background: p.c + "08", borderRadius: 6, border: `1px solid ${p.c}20`, textAlign: "center" }}>
              <Badge color={p.c} bg={p.c + "20"}>{p.phase}</Badge>
              <div style={{ fontSize: 12, fontWeight: 700, color: p.c, fontFamily: fontStack, margin: "8px 0 4px" }}>{p.label}</div>
              <div style={{ fontSize: 10, color: colors.textDim, fontFamily: sansStack, lineHeight: 1.4 }}>{p.desc}</div>
              {p.free && <div style={{ fontSize: 9, color: colors.accent, fontFamily: fontStack, marginTop: 6 }}>✓ Free tier</div>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          {[
            { mech: "Global Kill Switch", desc: "Instant revert to suggest-only", c: colors.danger },
            { mech: "Circuit Breaker", desc: "Auto-disable on N failures", c: colors.warn },
            { mech: "Emergency Revert", desc: "1-click rollback via event log", c: colors.blue },
          ].map((m, i) => (
            <div key={i} style={{ flex: 1, padding: "8px 10px", background: m.c + "08", borderRadius: 4, border: `1px solid ${m.c}20` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: m.c, fontFamily: fontStack }}>{m.mech}</div>
              <div style={{ fontSize: 9, color: colors.textDim, fontFamily: sansStack, marginTop: 2 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PluginSystemView() {
  const vendors = [
    {
      name: "AWS Security Groups", auth: "IAM / boto3", commit: "Immediate",
      special: "Allow-only (deny → NACL), --dry-run flag, 60 rules/SG", c: colors.accent,
      caps: { deny: false, commit: false, dryRun: true, rollback: false }, launch: true,
    },
    {
      name: "Palo Alto Cloud NGFW", auth: "API key + Cloud Manager", commit: "Two-phase (candidate → commit)",
      special: "Cloud-native managed NGFW, Panorama-like policy push, rule hit counts", c: colors.warn,
      caps: { deny: true, commit: true, dryRun: false, rollback: false }, launch: true,
    },
    {
      name: "Fortinet FortiOS", auth: "Bearer token (1–10,080 min)", commit: "Immediate apply",
      special: "FortiManager workspace locking, move ordering", c: colors.textMuted,
      caps: { deny: true, commit: false, dryRun: false, rollback: false }, launch: false,
    },
    {
      name: "Check Point R80+", auth: "Session-based", commit: "Publish / Install-policy",
      special: "Concurrent admin sessions, DB revision tracking", c: colors.textMuted,
      caps: { deny: true, commit: true, dryRun: false, rollback: true }, launch: false,
    },
    {
      name: "OPNsense / pfSense", auth: "API key+secret (Basic)", commit: "Savepoint (60s auto-rollback)",
      special: "Gold-standard safety: auto-revert if unconfirmed", c: colors.textMuted,
      caps: { deny: true, commit: false, dryRun: false, rollback: true }, launch: false,
    },
    {
      name: "Azure NSGs", auth: "Azure AD OAuth2", commit: "Immediate (ARM what-if)",
      special: "Priority ordering (100–4096), 1200 writes/hr limit", c: colors.textMuted,
      caps: { deny: true, commit: false, dryRun: true, rollback: false }, launch: false,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card title="Universal Rule Lifecycle" badge="Terraform Provider Pattern" glowing>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap", padding: "10px 0" }}>
          {["Validate", "Dry-Run", "Apply", "Verify", "Commit / Rollback"].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                padding: "8px 16px", background: colors.accentDim, border: `1px solid ${colors.accent}40`,
                borderRadius: 6, fontSize: 11, fontWeight: 700, color: colors.accent, fontFamily: fontStack,
              }}>{step}</div>
              {i < 4 && <span style={{ color: colors.accent, fontSize: 16 }}>→</span>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", fontSize: 10, color: colors.textDim, fontFamily: sansStack, marginTop: 4 }}>
          Universal Rule Schema → Vendor Translation → Transaction → Event-sourced Audit Log
        </div>
      </Card>
      <Card title="Firewall Adapters" badge={`${vendors.length} Vendors`}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {vendors.map((v, i) => (
            <div key={i} style={{ padding: "12px", background: v.c + "06", borderRadius: 6, border: `1px solid ${v.c}20`, opacity: v.launch ? 1 : 0.6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: v.c, fontFamily: fontStack }}>{v.name}</span>
                <Badge color={v.launch ? colors.accent : colors.textMuted} bg={v.launch ? colors.accentDim : colors.surfaceLight}>{v.launch ? "LAUNCH" : "FUTURE"}</Badge>
              </div>
              <div style={{ fontSize: 10, color: colors.textDim, fontFamily: sansStack, marginBottom: 2 }}>
                <span style={{ color: colors.textMuted }}>Auth:</span> {v.auth}
              </div>
              <div style={{ fontSize: 10, color: colors.textDim, fontFamily: sansStack, marginBottom: 2 }}>
                <span style={{ color: colors.textMuted }}>Commit:</span> {v.commit}
              </div>
              <div style={{ fontSize: 10, color: colors.textDim, fontFamily: sansStack, marginBottom: 8 }}>
                <span style={{ color: colors.textMuted }}>Note:</span> {v.special}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {Object.entries(v.caps).map(([cap, supported]) => (
                  <span key={cap} style={{
                    fontSize: 9, padding: "1px 6px", borderRadius: 3, fontFamily: fontStack,
                    color: supported ? colors.accent : colors.textMuted,
                    background: supported ? colors.accentDim : colors.surfaceLight,
                    textDecoration: supported ? "none" : "line-through",
                    opacity: supported ? 1 : 0.5,
                  }}>{cap}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TechStackView() {
  const categories = [
    {
      cat: "Core Engine (Python CLI)", c: colors.accent,
      items: [
        { tech: "Python 3.12+", role: "Core engine, CLI, adapters, API server", why: "Rich ecosystem, fast prototyping, LLM library support" },
        { tech: "Typer + Rich", role: "CLI framework + rich terminal output", why: "Click-based, auto-help, beautiful formatting" },
        { tech: "Textual", role: "Optional TUI dashboard", why: "Full terminal UI framework (same Textualize ecosystem)" },
        { tech: "Pydantic v2", role: "Data validation, schemas, settings", why: "Type-safe configs, LLM structured output parsing" },
        { tech: "DuckDB", role: "Embedded columnar OLAP", why: "Multi-GB analytics on a laptop in seconds" },
        { tech: "SQLite", role: "Rule history, audit trails", why: "Zero-config, embedded, battle-tested" },
      ],
    },
    {
      cat: "GUI Layer (TypeScript — Future)", c: colors.blue,
      items: [
        { tech: "TypeScript", role: "Full-stack web GUI", why: "Type-safe frontend + backend, CF Workers native" },
        { tech: "Next.js / SvelteKit", role: "Web dashboard", why: "SSR, rich visualization, team features" },
        { tech: "Cloudflare Workers", role: "Edge API + ingestion", why: "Global edge, Durable Objects, D1/R2" },
        { tech: "tRPC / REST", role: "API layer", why: "Type-safe API, feature parity CLI ↔ Web" },
      ],
    },
    {
      cat: "Data Pipeline", c: colors.purple,
      items: [
        { tech: "Vector", role: "Log ingestion, normalization", why: "86 MiB/s, 181MB RAM, VRL transforms" },
        { tech: "Kafka", role: "Cloud buffer / queue", why: "Replay, fan-out, decoupled throughput" },
        { tech: "ClickHouse", role: "Hot log analytics (cloud)", why: "10-20x compression, sub-second queries" },
        { tech: "Parquet + S3/R2", role: "Cold storage", why: "Columnar, cheap, queryable by DuckDB" },
      ],
    },
    {
      cat: "Agentic AI (LangChain Ecosystem)", c: colors.warn,
      items: [
        { tech: "LangGraph", role: "Graph-based agent orchestration", why: "Stateful workflows, checkpoints, human-in-the-loop, time-travel" },
        { tech: "Deep Agents", role: "Agent harness with sub-agents", why: "Planning tool, filesystem backend, spawns specialized sub-agents" },
        { tech: "LangChain", role: "Foundation: tools, memory, chains", why: "Tool calling, prompt chaining, 700+ integrations" },
        { tech: "LangSmith", role: "Observability & eval platform", why: "Execution traces, prompt testing, production debugging" },
        { tech: "LiteLLM", role: "Multi-provider LLM proxy", why: "100+ providers, OpenAI-compatible, cost tracking, fallback" },
        { tech: "AWS Bedrock", role: "Primary LLM provider", why: "Claude Sonnet/Haiku, managed, IAM auth, pay-per-token" },
      ],
    },
    {
      cat: "Infra & State", c: colors.danger,
      items: [
        { tech: "boto3", role: "AWS SG + VPC + Bedrock SDK", why: "Native AWS SDK, IAM auth, dry-run support" },
        { tech: "PostgreSQL", role: "Rules/audit DB + LangGraph state", why: "PostgresSaver checkpointer, event sourcing" },
        { tech: "Redis", role: "Caching + rate limiting", why: "LLM response cache, pub/sub, session state" },
        { tech: "Ollama", role: "Local inference (CLI)", why: "Run Llama 3 / Mistral locally, zero cloud deps" },
      ],
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {categories.map((cat, i) => (
        <Card key={i} title={cat.cat} badge={`${cat.items.length} tools`} accent={cat.c}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {cat.items.map((item, j) => (
              <div key={j} style={{ display: "flex", gap: 10, padding: "8px 10px", background: cat.c + "06", borderRadius: 4 }}>
                <div style={{
                  minWidth: 100, fontSize: 11, fontWeight: 700, color: cat.c, fontFamily: fontStack,
                  borderRight: `1px solid ${cat.c}20`, paddingRight: 10,
                }}>{item.tech}</div>
                <div>
                  <div style={{ fontSize: 10, color: colors.text, fontFamily: sansStack }}>{item.role}</div>
                  <div style={{ fontSize: 9, color: colors.textDim, fontFamily: sansStack, marginTop: 2 }}>{item.why}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function RoadmapView() {
  const phases = [
    {
      phase: "Phase 1 — MVP", timeline: "Months 1–3", c: colors.accent,
      goals: [
        "Python CLI with Typer + Rich (pip install firewall-ai)",
        "Vector-based ingestion (Palo Cloud NGFW + AWS VPC)",
        "DuckDB + Parquet local storage",
        "LangGraph 4-stage pipeline with checkpointed state",
        "Deep Agents for sub-agent orchestration",
        "AWS Bedrock (Claude) via LiteLLM + Ollama local fallback",
        "AWS Security Groups + Palo Alto Cloud NGFW adapters",
        "LangSmith tracing for pipeline observability",
        "JSON/SARIF output for CI/CD",
      ],
      outcome: "pip install firewall-ai → working CLI tool",
    },
    {
      phase: "Phase 2 — Full Pipeline + GUI", timeline: "Months 4–6", c: colors.blue,
      goals: [
        "Full 4-stage pipeline with LangGraph human-in-the-loop gates",
        "TypeScript web dashboard (Next.js / SvelteKit)",
        "LangSmith eval suites for pipeline accuracy tracking",
        "ClickHouse cloud storage tier",
        "Fortinet + Check Point adapters",
        "Slack + Web approval workflows via LangGraph interrupts",
        "Event-sourced audit log with compliance reports",
      ],
      outcome: "Cloud platform with web UI, multi-vendor support",
    },
    {
      phase: "Phase 3 — Enterprise", timeline: "Months 7–12", c: colors.purple,
      goals: [
        "Graduated autonomy (Phases 2–4)",
        "Multi-firewall orchestration",
        "OPNsense, pfSense, Azure NSG adapters",
        "Natural language policy intent",
        "PCI-DSS 4.0 / SOC 2 compliance reports",
        "SSO/SAML, RBAC, team collaboration",
        "Circuit breakers + emergency revert",
      ],
      outcome: "Enterprise-ready platform, compliance automation",
    },
  ];

  const openCore = [
    { feature: "Single firewall analysis", free: true, premium: true },
    { feature: "Local LLM support (Ollama)", free: true, premium: true },
    { feature: "Rule suggestions (suggest-only)", free: true, premium: true },
    { feature: "JSON/SARIF output, CI/CD", free: true, premium: true },
    { feature: "Community adapter plugins", free: true, premium: true },
    { feature: "Multi-firewall orchestration", free: false, premium: true },
    { feature: "Web dashboard + visualization", free: false, premium: true },
    { feature: "Auto-apply (graduated autonomy)", free: false, premium: true },
    { feature: "Team collaboration + RBAC", free: false, premium: true },
    { feature: "Compliance reports (PCI-DSS, SOC 2)", free: false, premium: true },
    { feature: "SSO/SAML, audit log exports", free: false, premium: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card title="Implementation Roadmap" badge="12 Months" glowing>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {phases.map((p, i) => (
            <div key={i} style={{
              padding: "14px", background: p.c + "06", borderRadius: 8,
              border: `1px solid ${p.c}25`, borderTop: `3px solid ${p.c}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: p.c, fontFamily: fontStack }}>{p.phase}</span>
                <Badge color={p.c} bg={p.c + "20"}>{p.timeline}</Badge>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                {p.goals.map((g, j) => (
                  <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <span style={{ color: p.c, fontSize: 8, marginTop: 3 }}>▸</span>
                    <span style={{ fontSize: 10, color: colors.textDim, fontFamily: sansStack, lineHeight: 1.4 }}>{g}</span>
                  </div>
                ))}
              </div>
              <div style={{
                padding: "6px 10px", background: p.c + "15", borderRadius: 4,
                fontSize: 10, color: p.c, fontFamily: fontStack, fontWeight: 600,
              }}>{p.outcome}</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Open-Core Split" badge="BSL 1.1 → Apache 2.0">
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 60px 60px", gap: 4, padding: "6px 10px",
              background: colors.surfaceLight, borderRadius: "4px 4px 0 0",
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: colors.textMuted, fontFamily: fontStack }}>FEATURE</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: colors.accent, fontFamily: fontStack, textAlign: "center" }}>FREE</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: colors.purple, fontFamily: fontStack, textAlign: "center" }}>PREMIUM</span>
            </div>
            {openCore.map((f, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 60px 60px", gap: 4, padding: "4px 10px",
                background: i % 2 === 0 ? "transparent" : colors.surfaceLight + "40",
              }}>
                <span style={{ fontSize: 10, color: colors.textDim, fontFamily: sansStack }}>{f.feature}</span>
                <span style={{ textAlign: "center", fontSize: 12 }}>{f.free ? "✅" : "—"}</span>
                <span style={{ textAlign: "center", fontSize: 12 }}>✅</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Pricing Strategy" badge="Semgrep Playbook">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { tier: "Free", price: "$0", desc: "CLI + single firewall + Ollama", audience: "Individual practitioners", c: colors.accent },
              { tier: "Team", price: "$49–99/mo", desc: "Multi-FW, web dashboard, auto-apply", audience: "Small security teams", c: colors.blue },
              { tier: "Enterprise", price: "Custom", desc: "On-prem, SLA, SSO, compliance", audience: "Large orgs, regulated industries", c: colors.purple },
            ].map((t, i) => (
              <div key={i} style={{ padding: "12px 14px", background: t.c + "08", borderRadius: 6, border: `1px solid ${t.c}25` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: t.c, fontFamily: fontStack }}>{t.tier}</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: t.c, fontFamily: fontStack }}>{t.price}</span>
                </div>
                <div style={{ fontSize: 10, color: colors.text, fontFamily: sansStack, marginTop: 4 }}>{t.desc}</div>
                <div style={{ fontSize: 9, color: colors.textDim, fontFamily: sansStack, marginTop: 2 }}>{t.audience}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

const VIEWS = {
  Architecture: ArchitectureView,
  "Data Flow": DataFlowView,
  "Agent Pipeline": AgentPipelineView,
  "Plugin System": PluginSystemView,
  "Tech Stack": TechStackView,
  Roadmap: RoadmapView,
};

export default function App() {
  const [activeTab, setActiveTab] = useState("Architecture");
  const View = VIEWS[activeTab];

  return (
    <div style={{
      minHeight: "100vh", background: colors.bg, color: colors.text, fontFamily: sansStack,
      backgroundImage: `radial-gradient(circle at 20% 20%, ${colors.accent}05 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${colors.purple}05 0%, transparent 50%)`,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%", background: colors.accent,
              boxShadow: `0 0 12px ${colors.accent}`, animation: "pulse 2s infinite",
            }} />
            <h1 style={{
              fontSize: 22, fontWeight: 900, margin: 0, fontFamily: fontStack,
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.blue})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}>
              AI-Powered Firewall Policy Manager
            </h1>
          </div>
          <p style={{ fontSize: 12, color: colors.textDim, margin: 0, paddingLeft: 22 }}>
            Agentic traffic-to-rule automation · LangGraph + Deep Agents · AWS Bedrock · Open-core
          </p>
        </div>

        <div style={{
          display: "flex", gap: 2, marginBottom: 20, background: colors.surface,
          padding: 3, borderRadius: 8, border: `1px solid ${colors.border}`,
        }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: "8px 0", border: "none", borderRadius: 6, cursor: "pointer",
              fontSize: 11, fontWeight: 700, fontFamily: fontStack, letterSpacing: "0.02em",
              background: activeTab === tab ? colors.accentDim : "transparent",
              color: activeTab === tab ? colors.accent : colors.textDim,
              transition: "all 0.2s",
              borderBottom: activeTab === tab ? `2px solid ${colors.accent}` : "2px solid transparent",
            }}>{tab}</button>
          ))}
        </div>

        <View />

        <div style={{ textAlign: "center", padding: "20px 0 8px", fontSize: 10, color: colors.textMuted, fontFamily: fontStack }}>
          firewall-ai · Python CLI · LangGraph + Deep Agents · AWS Bedrock · BSL 1.1
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${colors.bg}; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 3px; }
      `}</style>
    </div>
  );
}
