import { useState, useEffect, useRef } from "react";

const tools = [
  {
    id: "0xpwn",
    domain: "OFFENSE",
    tagline: "Autonomous Penetration Testing",
    icon: "⚔",
    color: "#ff3366",
    colorDim: "#ff336622",
    status: "Spec Complete",
    statusColor: "#00ff88",
    problem: "Traditional pentests cost $10K–$150K, take weeks, happen quarterly, and 75% are still manual — while the talent to scale doesn't exist.",
    solution: "AI agents execute the full kill chain — recon, exploitation, privilege escalation, lateral movement — on continuous cadence at a fraction of manual cost.",
    market: "$4–6B",
    growth: "$10–15B by 2030",
    cagr: "23–40%",
    competitors: [
      { name: "XBOW", funding: "$95M", note: "HackerOne #1" },
      { name: "Horizon3.ai", funding: "$178.5M", note: "FedRAMP" },
      { name: "Pentera", funding: "$250M+", note: "~$100M ARR" },
    ],
    stages: [
      { name: "Recon", desc: "Asset discovery, port scanning, service enumeration", icon: "🔍" },
      { name: "Discovery", desc: "CVE correlation, fuzzing, config analysis", icon: "🎯" },
      { name: "Exploit", desc: "Privilege escalation, lateral movement, PoC gen", icon: "💥" },
      { name: "Report", desc: "Attack paths, risk scores, remediation guidance", icon: "📋" },
    ],
    outputsTo: "PolicyFoundry",
    outputLabel: "Attack paths inform firewall rules",
    ossGap: "PentAGI/PentestGPT early; no production-grade OSS",
    users: "Red teamers, security engineers",
  },
  {
    id: "PolicyFoundry",
    domain: "GOVERNANCE",
    tagline: "AI-Powered Firewall Policy Management",
    icon: "🛡",
    color: "#00ff88",
    colorDim: "#00ff8822",
    status: "Architecture Complete",
    statusColor: "#00ff88",
    problem: "70–80% of firewall rules are outdated or redundant, 50% of orgs manage them with spreadsheets, and no AI-native tool or open-source alternative challenges $100K+ legacy incumbents.",
    solution: "Agentic AI ingests traffic flows, analyzes patterns, generates vendor-neutral rules from business intent, and deploys across Palo Alto, AWS, and Fortinet with graduated autonomy.",
    market: "$2.3–7.7B",
    growth: "$5.8–19.3B by 2030",
    cagr: "10.8–19.3%",
    competitors: [
      { name: "Tufin", funding: "Public", note: "Legacy NSPM" },
      { name: "AlgoSec", funding: "Private", note: "Legacy NSPM" },
      { name: "FireMon", funding: "Private", note: "Legacy NSPM" },
    ],
    stages: [
      { name: "Ingest", desc: "Vector → VRL normalization, multi-vendor logs", icon: "📡" },
      { name: "Analyze", desc: "Pattern detection, anomaly scoring, baselines", icon: "🧠" },
      { name: "Generate", desc: "Intent → vendor-neutral rules, conflict detection", icon: "📜" },
      { name: "Deploy", desc: "Dry-run → apply → verify, rollback on failure", icon: "🚀" },
    ],
    outputsTo: "UEBA Agent",
    outputLabel: "Traffic anomalies feed behavioral baselines",
    ossGap: "No open-source NSPM exists — total greenfield",
    users: "Network/security engineers, SOC",
  },
  {
    id: "UEBA Agent",
    domain: "DETECTION",
    tagline: "Insider Threat & Behavioral Analytics",
    icon: "👁",
    color: "#aa66ff",
    colorDim: "#aa66ff22",
    status: "Proposed — Phase 2",
    statusColor: "#ffcc00",
    problem: "Insider threats cause ~60% of data breaches, behavioral analytics is fragmented across expensive SIEM rules, and no open-source AI-native insider threat tool exists.",
    solution: "Agents build per-entity behavioral baselines, detect deviations indicating compromised accounts or exfiltration, enrich with org context, and produce prioritized risk alerts with evidence.",
    market: "$1–2B",
    growth: "$4B+ by 2030",
    cagr: "20–25%",
    competitors: [
      { name: "Varonis", funding: "$2.5B mcap", note: "Data-centric UEBA" },
      { name: "DTEX", funding: "Private", note: "Insider threat" },
      { name: "Securonix", funding: "Acquired", note: "→ Juniper" },
    ],
    stages: [
      { name: "Baseline", desc: "User/entity modeling, peer group analysis", icon: "📊" },
      { name: "Anomaly", desc: "Deviation scoring, lateral movement detection", icon: "⚡" },
      { name: "Context", desc: "HR data correlation, role changes, access patterns", icon: "🔗" },
      { name: "Alert", desc: "Prioritized risk alerts, evidence packaging", icon: "🔔" },
    ],
    outputsTo: "IR Agent",
    outputLabel: "Insider alerts trigger incident response",
    ossGap: "Apache Metron dead, Wazuh minimal — no AI-native OSS UEBA",
    users: "SOC analysts, threat hunters",
  },
  {
    id: "IR Agent",
    domain: "RESPONSE",
    tagline: "Incident Response Orchestration",
    icon: "🚨",
    color: "#ff9500",
    colorDim: "#ff950022",
    status: "Proposed — Phase 3",
    statusColor: "#ffcc00",
    problem: "Mean time to contain a breach is 73 days. Legacy SOAR requires manually defined playbooks that demand constant updating. The alert-to-containment gap is where breaches become catastrophes.",
    solution: "Agents autonomously orchestrate triage, containment, forensics, and recovery — reasoning through each step rather than following static playbooks, with graduated human-in-the-loop controls.",
    market: "$1.7–1.9B",
    growth: "$4–5B by 2030",
    cagr: "15–19%",
    competitors: [
      { name: "Torq", funding: "$332M", note: "$1.2B valuation" },
      { name: "Tines", funding: "$299M", note: "Workflow automation" },
      { name: "Swimlane", funding: "$70M", note: "Low-code SOAR" },
    ],
    stages: [
      { name: "Triage", desc: "Severity classification, blast radius assessment", icon: "🏥" },
      { name: "Contain", desc: "Network isolation, account lockdown, process kill", icon: "🔒" },
      { name: "Forensics", desc: "Timeline reconstruction, IOC extraction", icon: "🔬" },
      { name: "Recover", desc: "Service restoration, patch validation, hardening", icon: "♻" },
    ],
    outputsTo: "0xpwn",
    outputLabel: "IOCs inform next pentest scope",
    ossGap: "Shuffle/TheHive orchestrate but need manual playbooks",
    users: "SOC, IR teams, CISO",
  },
];

const sharedLayers = [
  { name: "Telemetry Bus", desc: "Kafka / in-memory Go channels", icon: "📡", detail: "All tools emit and consume typed events through shared topics" },
  { name: "Knowledge Graph", desc: "Assets, identities, rules, vulns, incidents", icon: "🧩", detail: "Shared graph connects entities across all four tools" },
  { name: "LLM Abstraction", desc: "LiteLLM → Claude / GPT / Ollama", icon: "🤖", detail: "Unified interface for all AI reasoning across tools" },
  { name: "Audit Log", desc: "Immutable, event-sourced, compliance-ready", icon: "📝", detail: "Every action across all tools with correlation IDs" },
];

const phases = [
  { phase: 1, label: "Foundation", tools: ["0xpwn", "PolicyFoundry"], desc: "Ship standalone CLIs for pentest + firewall policy", color: "#00ff88" },
  { phase: 2, label: "Detection", tools: ["UEBA Agent"], desc: "Leverage PolicyFoundry's ingestion for behavioral analytics", color: "#aa66ff" },
  { phase: 3, label: "Response", tools: ["IR Agent"], desc: "Complete the loop with automated incident response", color: "#ff9500" },
  { phase: 4, label: "Platform", tools: ["Cloud"], desc: "Unified dashboard, knowledge graph, cross-tool workflows", color: "#00bbff" },
];

function PipelineStages({ stages, color }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "stretch" }}>
      {stages.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 3, flex: 1 }}>
          <div style={{
            flex: 1, padding: "8px 10px", borderRadius: 8,
            background: color + "0a", border: `1px solid ${color}20`,
            transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 14, marginBottom: 3 }}>{s.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "'Fira Code', monospace", marginBottom: 2 }}>{s.name}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", lineHeight: 1.3 }}>{s.desc}</div>
          </div>
          {i < stages.length - 1 && (
            <div style={{ color: color + "44", fontSize: 10, flexShrink: 0 }}>→</div>
          )}
        </div>
      ))}
    </div>
  );
}

function ToolCard({ tool, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isActive ? `linear-gradient(145deg, ${tool.color}08, ${tool.color}03)` : hovered ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.008)",
        border: `1px solid ${isActive ? tool.color + "44" : hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.035)"}`,
        borderRadius: 14, padding: 20, cursor: "pointer",
        transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
        position: "relative", overflow: "hidden",
      }}
    >
      {isActive && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }} />}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
            background: tool.color + "12", fontSize: 22, border: `1px solid ${tool.color}25`,
          }}>{tool.icon}</div>
          <div>
            <div style={{ fontSize: 8, fontFamily: "'Fira Code', monospace", color: tool.color, letterSpacing: 2.5, fontWeight: 700, marginBottom: 2 }}>{tool.domain}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#eee", letterSpacing: -0.3 }}>{tool.id}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{tool.tagline}</div>
          </div>
        </div>
        <div style={{
          fontSize: 8, padding: "3px 8px", borderRadius: 5, fontFamily: "'Fira Code', monospace",
          background: tool.statusColor + "12", color: tool.statusColor, border: `1px solid ${tool.statusColor}22`, fontWeight: 600,
          whiteSpace: "nowrap",
        }}>{tool.status}</div>
      </div>

      {/* Problem & Solution */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
        <div style={{ padding: "8px 11px", borderRadius: 8, background: "rgba(255,80,80,0.04)", border: "1px solid rgba(255,80,80,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
            <span style={{ fontSize: 9 }}>⚠</span>
            <span style={{ fontSize: 8, fontFamily: "'Fira Code', monospace", color: "#ff6b6b", letterSpacing: 1.5, fontWeight: 700 }}>PROBLEM</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.45 }}>{tool.problem}</div>
        </div>
        <div style={{ padding: "8px 11px", borderRadius: 8, background: tool.color + "06", border: `1px solid ${tool.color}14` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
            <span style={{ fontSize: 9 }}>⚡</span>
            <span style={{ fontSize: 8, fontFamily: "'Fira Code', monospace", color: tool.color, letterSpacing: 1.5, fontWeight: 700 }}>AGENTIC AI SOLUTION</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.45 }}>{tool.solution}</div>
        </div>
      </div>

      {/* Pipeline */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 8, fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, marginBottom: 6 }}>AGENT PIPELINE</div>
        <PipelineStages stages={tool.stages} color={tool.color} />
      </div>

      {/* Market + Competitors row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <div style={{ fontSize: 8, fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, marginBottom: 6 }}>MARKET</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { label: "SIZE", value: tool.market },
              { label: "GROWTH", value: tool.growth },
            ].map((m) => (
              <div key={m.label} style={{ padding: "6px 9px", borderRadius: 6, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", flex: 1 }}>
                <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", fontFamily: "'Fira Code', monospace", letterSpacing: 1, marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: tool.color, fontFamily: "'Fira Code', monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 8, fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, marginBottom: 6 }}>COMPETITORS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {tool.competitors.map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", borderRadius: 5, background: "rgba(255,255,255,0.02)" }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{c.name}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "'Fira Code', monospace" }}>{c.funding}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Output flow indicator */}
      <div style={{
        marginTop: 14, padding: "6px 10px", borderRadius: 6,
        background: `linear-gradient(90deg, ${tool.color}06, transparent)`,
        borderLeft: `2px solid ${tool.color}44`,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>↳</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "'Fira Code', monospace" }}>
          Feeds <span style={{ color: tool.color, fontWeight: 700 }}>{tool.outputsTo}</span> — {tool.outputLabel}
        </span>
      </div>

      {/* OSS gap */}
      <div style={{ marginTop: 8, fontSize: 9, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
        OSS gap: {tool.ossGap}
      </div>
    </div>
  );
}

function FlowDiagram() {
  return (
    <svg width="100%" viewBox="0 0 800 120" style={{ overflow: "visible" }}>
      {tools.map((tool, i) => {
        const x = 25 + i * 195;
        const w = 170;
        return (
          <g key={tool.id}>
            <rect x={x} y={20} width={w} height={66} rx={10} fill={tool.color + "0c"} stroke={tool.color + "33"} strokeWidth="1.5" />
            <text x={x + w / 2} y={38} fill={tool.color} fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="700" letterSpacing="2">{tool.domain}</text>
            <text x={x + w / 2} y={54} fill="#ddd" fontSize="12" textAnchor="middle" fontWeight="700">{tool.id}</text>
            <text x={x + w / 2} y={70} fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle">{tool.tagline.split(" ").slice(0, 3).join(" ")}</text>
            {i < tools.length - 1 && (
              <>
                <line x1={x + w + 2} y1={53} x2={x + w + 22} y2={53} stroke={tool.color + "55"} strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <text x={x + w + 12} y={48} fill="rgba(255,255,255,0.2)" fontSize="6" textAnchor="middle">feeds</text>
              </>
            )}
          </g>
        );
      })}
      {/* Loop-back arrow */}
      <path d="M 808 53 Q 830 53 830 0 Q 830 -15 400 -15 Q 10 -15 10 10 Q 10 53 23 53"
        fill="none" stroke="#ff950033" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#arrowhead2)" />
      <text x={400} y={-4} fill="rgba(255,255,255,0.2)" fontSize="7" textAnchor="middle" fontFamily="monospace">closed feedback loop — IOCs → next pentest scope</text>

      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="rgba(255,255,255,0.3)" />
        </marker>
        <marker id="arrowhead2" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="#ff950044" />
        </marker>
      </defs>
    </svg>
  );
}

export default function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{
      minHeight: "100vh", background: "#08090d", color: "#e0e0e0",
      fontFamily: "'Satoshi', 'DM Sans', -apple-system, sans-serif",
      padding: "24px 28px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        body { margin: 0; background: #08090d; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28, animation: "fadeUp 0.6s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", animation: "glow 2.5s ease-in-out infinite", boxShadow: "0 0 10px #00ff8855" }} />
          <span style={{ fontSize: 9, fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.25)", letterSpacing: 3 }}>PORTFOLIO ARCHITECTURE</span>
        </div>
        <h1 style={{
          margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: -1.2,
          background: "linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.5) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Agentic Security Lifecycle
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)", maxWidth: 580 }}>
          Four tools, one shared intelligence layer — offense, governance, detection, and response in a closed feedback loop
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {[
          { id: "overview", label: "Architecture" },
          { id: "roadmap", label: "Roadmap" },
          { id: "shared", label: "Shared Layer" },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: "6px 16px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 600,
            border: `1px solid ${activeTab === t.id ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}`,
            background: activeTab === t.id ? "rgba(255,255,255,0.06)" : "transparent",
            color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.35)",
            transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          {/* Flow diagram */}
          <div style={{
            background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: 14, padding: "16px 20px", marginBottom: 20,
          }}>
            <div style={{ fontSize: 8, fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.25)", letterSpacing: 2, marginBottom: 10 }}>DATA FLOW</div>
            <FlowDiagram />
          </div>

          {/* Tool cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isActive={activeTool === tool.id}
                onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "roadmap" && (
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <div style={{ position: "relative", paddingLeft: 32 }}>
            <div style={{
              position: "absolute", left: 11, top: 8, bottom: 8, width: 2,
              background: "linear-gradient(180deg, #00ff88, #aa66ff, #ff9500, #00bbff)",
              borderRadius: 1, opacity: 0.3,
            }} />
            {phases.map((p, i) => (
              <div key={i} style={{
                position: "relative", marginBottom: 20, padding: "18px 22px", borderRadius: 12,
                background: p.color + "06", border: `1px solid ${p.color}18`,
                animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
              }}>
                <div style={{
                  position: "absolute", left: -28, top: 20, width: 16, height: 16, borderRadius: "50%",
                  background: "#08090d", border: `2px solid ${p.color}66`, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 9, fontFamily: "'Fira Code', monospace", color: p.color, fontWeight: 700, letterSpacing: 1 }}>PHASE {p.phase}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#eee" }}>{p.label}</span>
                  {p.phase <= 2 && (
                    <span style={{
                      fontSize: 8, padding: "2px 7px", borderRadius: 4, fontFamily: "'Fira Code', monospace",
                      background: p.phase === 1 ? "#00ff8815" : "#ffcc0015",
                      color: p.phase === 1 ? "#00ff88" : "#ffcc00",
                      border: `1px solid ${p.phase === 1 ? "#00ff8822" : "#ffcc0022"}`,
                    }}>
                      {p.phase === 1 ? "IN PROGRESS" : "NEXT"}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>{p.desc}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {p.tools.map((t) => {
                    const tool = tools.find((x) => x.id === t);
                    return (
                      <span key={t} style={{
                        fontSize: 10, padding: "4px 10px", borderRadius: 6, fontWeight: 600,
                        background: tool ? tool.color + "12" : "#00bbff12",
                        color: tool ? tool.color : "#00bbff",
                        border: `1px solid ${tool ? tool.color + "22" : "#00bbff22"}`,
                      }}>
                        {tool ? tool.icon : "☁"} {t}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "shared" && (
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            {sharedLayers.map((layer, i) => (
              <div key={i} style={{
                padding: "18px 20px", borderRadius: 12,
                background: "rgba(0,187,255,0.03)", border: "1px solid rgba(0,187,255,0.1)",
                animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>{layer.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#eee" }}>{layer.name}</div>
                    <div style={{ fontSize: 10, color: "#00bbff", fontFamily: "'Fira Code', monospace" }}>{layer.desc}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{layer.detail}</div>
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <div style={{
            padding: "18px 22px", borderRadius: 12,
            background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ fontSize: 8, fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.25)", letterSpacing: 2, marginBottom: 14 }}>TECHNOLOGY STACK</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#00ff88", marginBottom: 8, fontFamily: "'Fira Code', monospace" }}>CLI TIER</div>
                {["Go core binary (Cobra + Bubbletea TUI)", "SQLite + DuckDB + Parquet", "LiteLLM → Ollama / BYOK", "Vector (embedded ingestion)", "Docker sandbox (0xpwn)"].map((t, i) => (
                  <div key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{t}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#00bbff", marginBottom: 8, fontFamily: "'Fira Code', monospace" }}>CLOUD TIER</div>
                {["Go + TypeScript (Next.js / tRPC)", "ClickHouse + PostgreSQL + S3", "AI Gateway / Bedrock → Claude", "Kafka + Vector fleet", "Neo4j knowledge graph"].map((t, i) => (
                  <div key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 24, padding: "14px 18px", borderRadius: 12,
        background: "linear-gradient(135deg, #ff33660a, #00ff880a, #aa66ff0a, #ff95000a)",
        border: "1px solid rgba(255,255,255,0.04)",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12,
      }}>
        {tools.map((t) => (
          <div key={t.id} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>{t.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.color }}>{t.id}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "'Fira Code', monospace" }}>{t.market}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
