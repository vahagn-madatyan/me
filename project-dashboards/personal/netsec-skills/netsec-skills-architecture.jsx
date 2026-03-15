import { useState } from "react";

const TABS = ["Overview", "Architecture", "Skill Categories", "Monorepo", "Safety Tiers", "Tooling & Workflow", "Roadmap"];

const PhaseTag = ({ children, active }) => (
  <span style={{
    padding: "2px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    background: active ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.06)",
    color: active ? "#00ff88" : "#8892a4",
    border: `1px solid ${active ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`,
  }}>{children}</span>
);

const StatCard = ({ label, value, sub, accent = "#00ff88" }) => (
  <div style={{
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    padding: "20px",
    flex: "1 1 160px",
    minWidth: 160,
  }}>
    <div style={{ fontSize: "32px", fontWeight: 700, color: accent, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: "13px", color: "#c8d0dc", marginTop: 6, fontWeight: 500 }}>{label}</div>
    {sub && <div style={{ fontSize: "11px", color: "#5a6577", marginTop: 4 }}>{sub}</div>}
  </div>
);

const NodeBox = ({ title, items, color = "#00ff88", icon, style = {} }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}08, ${color}03)`,
    border: `1px solid ${color}30`,
    borderRadius: "12px",
    padding: "16px 18px",
    minWidth: 200,
    ...style,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      <span style={{ fontSize: "13px", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "1px" }}>{title}</span>
    </div>
    {items.map((item, i) => (
      <div key={i} style={{
        fontSize: "12px",
        color: "#c8d0dc",
        padding: "5px 0",
        borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: color, flexShrink: 0 }} />
        {item}
      </div>
    ))}
  </div>
);

const ConnectorArrow = ({ label, vertical = false }) => (
  <div style={{
    display: "flex",
    flexDirection: vertical ? "column" : "row",
    alignItems: "center",
    gap: 4,
    padding: vertical ? "4px 0" : "0 4px",
    color: "#3d4a5c",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.5px",
  }}>
    {!vertical && <span style={{ width: 20, height: 1, background: "#3d4a5c" }} />}
    {vertical && <span style={{ width: 1, height: 16, background: "#3d4a5c" }} />}
    <span style={{ color: "#5a6577" }}>{label}</span>
    {vertical && (
      <span style={{ fontSize: 12, lineHeight: 1 }}>▼</span>
    )}
    {!vertical && (
      <span style={{ fontSize: 12, lineHeight: 1 }}>▶</span>
    )}
  </div>
);

const TierCard = ({ tier, title, desc, examples, color, risk }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}0a, transparent)`,
    border: `1px solid ${color}25`,
    borderRadius: "14px",
    padding: "20px",
    flex: "1 1 280px",
    position: "relative",
    overflow: "hidden",
  }}>
    <div style={{
      position: "absolute",
      top: 12,
      right: 14,
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "1px",
      textTransform: "uppercase",
      padding: "3px 10px",
      borderRadius: "999px",
      background: `${color}18`,
      color,
      border: `1px solid ${color}30`,
    }}>{risk}</div>
    <div style={{ fontSize: "11px", fontWeight: 700, color, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>TIER {tier}</div>
    <div style={{ fontSize: "18px", fontWeight: 700, color: "#e8ecf2", marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: "13px", color: "#8892a4", lineHeight: 1.5, marginBottom: 14 }}>{desc}</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {examples.map((ex, i) => (
        <span key={i} style={{
          fontSize: "11px",
          padding: "3px 10px",
          borderRadius: "6px",
          background: "rgba(255,255,255,0.04)",
          color: "#a0a8b8",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>{ex}</span>
      ))}
    </div>
  </div>
);

const CategoryCard = ({ icon, title, count, skills, color }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: open ? `linear-gradient(135deg, ${color}0c, ${color}04)` : "rgba(255,255,255,0.02)",
        border: `1px solid ${open ? color + "30" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "14px",
        padding: "18px 20px",
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#e8ecf2" }}>{title}</div>
            <div style={{ fontSize: "12px", color: "#5a6577", marginTop: 2 }}>{count} skills planned</div>
          </div>
        </div>
        <span style={{ color: "#5a6577", fontSize: 14, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </div>
      {open && (
        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {skills.map((s, i) => (
            <span key={i} style={{
              fontSize: "11px",
              padding: "4px 12px",
              borderRadius: "8px",
              background: `${color}12`,
              color,
              border: `1px solid ${color}25`,
              fontWeight: 500,
            }}>{s}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const FileNode = ({ name, indent = 0, isFolder = false, color = "#5a6577", highlight = false }) => (
  <div style={{
    paddingLeft: indent * 20 + 12,
    fontSize: "12px",
    fontFamily: "'JetBrains Mono', monospace",
    color: highlight ? "#00ff88" : (isFolder ? "#e8ecf2" : "#8892a4"),
    padding: "3px 0 3px " + (indent * 20 + 12) + "px",
    background: highlight ? "rgba(0,255,136,0.04)" : "transparent",
    borderRadius: highlight ? 4 : 0,
  }}>
    <span style={{ color: isFolder ? color : "#5a6577", marginRight: 8 }}>
      {isFolder ? "📁" : "📄"}
    </span>
    {name}
  </div>
);

const TimelineItem = ({ phase, title, items, active, color }) => (
  <div style={{
    display: "flex",
    gap: 16,
    position: "relative",
  }}>
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flexShrink: 0,
      width: 32,
    }}>
      <div style={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: active ? color : "transparent",
        border: `2px solid ${active ? color : "#3d4a5c"}`,
        boxShadow: active ? `0 0 12px ${color}40` : "none",
        zIndex: 1,
      }} />
      <div style={{ width: 1, flex: 1, background: "#2a3040", minHeight: 40 }} />
    </div>
    <div style={{ paddingBottom: 28, flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <PhaseTag active={active}>{phase}</PhaseTag>
        <span style={{ fontSize: "16px", fontWeight: 700, color: active ? "#e8ecf2" : "#6b7585" }}>{title}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            fontSize: "12px",
            color: active ? "#a0a8b8" : "#4a5365",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: active ? color + "60" : "#3d4a5c", flexShrink: 0 }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0c0f16",
      color: "#e8ecf2",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 32px 0",
        background: "linear-gradient(180deg, rgba(0,255,136,0.02) 0%, transparent 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #00ff88, #00cc6a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: 800,
            color: "#0c0f16",
            fontFamily: "'JetBrains Mono', monospace",
          }}>N</div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
              NetSec AI Skills Library
            </h1>
            <p style={{ fontSize: "12px", color: "#5a6577", margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
              Agent-Agnostic · Open Source · MCP + SKILL.md
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: 2,
          marginTop: 20,
          overflowX: "auto",
        }}>
          {TABS.map((t, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              style={{
                padding: "10px 16px",
                fontSize: "12px",
                fontWeight: 600,
                color: tab === i ? "#00ff88" : "#6b7585",
                background: tab === i ? "rgba(0,255,136,0.06)" : "transparent",
                border: "none",
                borderBottom: tab === i ? "2px solid #00ff88" : "2px solid transparent",
                borderRadius: "8px 8px 0 0",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>

        {/* === OVERVIEW === */}
        {tab === 0 && (
          <div>
            <p style={{ fontSize: "15px", color: "#a0a8b8", lineHeight: 1.7, maxWidth: 720, marginBottom: 28 }}>
              A large, open-source library of reusable AI agent skills for Network & Security operations.
              Built on two converged standards — <span style={{ color: "#00ff88", fontWeight: 600 }}>Agent Skills (SKILL.md)</span> for
              portable procedural knowledge and <span style={{ color: "#6c8cff", fontWeight: 600 }}>MCP servers</span> for executable tool
              integration — consumable by Claude, OpenAI Codex, LangChain, CrewAI, AutoGen, and 20+ agent frameworks.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 32 }}>
              <StatCard value="2" label="Core Standards" sub="SKILL.md + MCP" />
              <StatCard value="6+" label="Skill Domains" sub="Infra · Security · Cloud · Compliance" accent="#6c8cff" />
              <StatCard value="20+" label="Agent Frameworks" sub="Cross-platform compatibility" accent="#ff6c6c" />
              <StatCard value="3" label="Safety Tiers" sub="Read → Approved Write → Auto" accent="#ffb86c" />
            </div>

            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "22px 24px",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#5a6577", letterSpacing: "1.5px", marginBottom: 14, textTransform: "uppercase" }}>
                Platform Compatibility
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { name: "Claude Code", type: "native" },
                  { name: "OpenAI Codex", type: "native" },
                  { name: "GitHub Copilot", type: "native" },
                  { name: "LangChain", type: "adapter" },
                  { name: "CrewAI", type: "adapter" },
                  { name: "AutoGen", type: "adapter" },
                  { name: "Cursor", type: "native" },
                  { name: "Windsurf", type: "native" },
                  { name: "Cline", type: "native" },
                  { name: "Agno", type: "adapter" },
                ].map((p, i) => (
                  <span key={i} style={{
                    fontSize: "12px",
                    padding: "5px 14px",
                    borderRadius: "8px",
                    background: p.type === "native" ? "rgba(0,255,136,0.08)" : "rgba(108,140,255,0.08)",
                    color: p.type === "native" ? "#00ff88" : "#6c8cff",
                    border: `1px solid ${p.type === "native" ? "rgba(0,255,136,0.2)" : "rgba(108,140,255,0.2)"}`,
                    fontWeight: 600,
                  }}>
                    {p.name}
                    <span style={{ fontSize: "9px", opacity: 0.6, marginLeft: 6 }}>
                      {p.type === "native" ? "NATIVE" : "MCP ADAPTER"}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === ARCHITECTURE === */}
        {tab === 1 && (
          <div>
            <p style={{ fontSize: "13px", color: "#8892a4", marginBottom: 24, lineHeight: 1.6 }}>
              Dual-layer architecture: Skills encode domain knowledge, MCP servers enable execution. Progressive disclosure keeps context overhead minimal.
            </p>

            {/* Agent Layer */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "20px",
              marginBottom: 12,
            }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#5a6577", letterSpacing: "1.5px", marginBottom: 14, textTransform: "uppercase" }}>
                AI Agent Layer — Consumers
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Claude Code", "OpenAI Codex", "LangChain Agent", "CrewAI", "AutoGen", "Custom Agent"].map((a, i) => (
                  <div key={i} style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#c8d0dc",
                  }}>{a}</div>
                ))}
              </div>
            </div>

            <ConnectorArrow label="READS SKILL.md AT STARTUP" vertical />

            {/* Dual Layer */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
              <div style={{ flex: "1 1 300px" }}>
                <div style={{
                  background: "linear-gradient(135deg, rgba(0,255,136,0.05), rgba(0,255,136,0.01))",
                  border: "1px solid rgba(0,255,136,0.2)",
                  borderRadius: "14px",
                  padding: "20px",
                  height: "100%",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#00ff88", marginBottom: 4 }}>Layer 1: Agent Skills</div>
                  <div style={{ fontSize: "11px", color: "#5a6577", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>SKILL.md format · Knowledge layer</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      "YAML frontmatter → name, description (~100 tokens)",
                      "Markdown instructions → procedures (~5K tokens)",
                      "scripts/ → helper scripts loaded on-demand",
                      "references/ → vendor docs, RFCs, standards",
                      "Progressive disclosure → minimal context cost",
                    ].map((item, i) => (
                      <div key={i} style={{ fontSize: "11px", color: "#a0a8b8", display: "flex", alignItems: "start", gap: 8 }}>
                        <span style={{ color: "#00ff88", fontSize: 8, marginTop: 4 }}>◆</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", flexShrink: 0, padding: "0 4px" }}>
                <span style={{ color: "#3d4a5c", fontSize: 20, fontWeight: 700 }}>+</span>
              </div>

              <div style={{ flex: "1 1 300px" }}>
                <div style={{
                  background: "linear-gradient(135deg, rgba(108,140,255,0.05), rgba(108,140,255,0.01))",
                  border: "1px solid rgba(108,140,255,0.2)",
                  borderRadius: "14px",
                  padding: "20px",
                  height: "100%",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#6c8cff", marginBottom: 4 }}>Layer 2: MCP Servers</div>
                  <div style={{ fontSize: "11px", color: "#5a6577", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>JSON-RPC 2.0 · Execution layer</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      "Tools → executable functions w/ JSON Schema",
                      "Resources → data exposed to agent context",
                      "Prompts → reusable prompt templates",
                      "OAuth 2.1 → secure credential handling",
                      "Streamable HTTP transport → production-ready",
                    ].map((item, i) => (
                      <div key={i} style={{ fontSize: "11px", color: "#a0a8b8", display: "flex", alignItems: "start", gap: 8 }}>
                        <span style={{ color: "#6c8cff", fontSize: 8, marginTop: 4 }}>◆</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <ConnectorArrow label="CALLS TOOLS VIA MCP PROTOCOL" vertical />

            {/* Infrastructure Layer */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "20px",
            }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#5a6577", letterSpacing: "1.5px", marginBottom: 14, textTransform: "uppercase" }}>
                Infrastructure Layer — Targets
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { name: "Firewalls", icon: "🛡" },
                  { name: "SIEM", icon: "📊" },
                  { name: "DNS", icon: "🌐" },
                  { name: "VPN / SASE", icon: "🔐" },
                  { name: "Cloud (AWS/Azure/GCP)", icon: "☁️" },
                  { name: "IAM", icon: "👤" },
                  { name: "Vulnerability Scanners", icon: "🔍" },
                  { name: "Load Balancers", icon: "⚖️" },
                ].map((t, i) => (
                  <div key={i} style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: "rgba(255,184,108,0.06)",
                    border: "1px solid rgba(255,184,108,0.15)",
                    fontSize: "12px",
                    color: "#ffb86c",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}>
                    <span>{t.icon}</span> {t.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Distribution */}
            <div style={{
              marginTop: 20,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "20px",
            }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#5a6577", letterSpacing: "1.5px", marginBottom: 14, textTransform: "uppercase" }}>
                Distribution Channels
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { name: "npm", desc: "@netsec-skills/*", color: "#ff6c6c" },
                  { name: "Docker Hub", desc: "Containerized servers", color: "#6c8cff" },
                  { name: "MCP Registry", desc: "registry.mcp.io", color: "#00ff88" },
                  { name: "skills.sh", desc: "npx skills add", color: "#ffb86c" },
                ].map((d, i) => (
                  <div key={i} style={{
                    flex: "1 1 140px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: `${d.color}08`,
                    border: `1px solid ${d.color}20`,
                  }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: d.color }}>{d.name}</div>
                    <div style={{ fontSize: "11px", color: "#5a6577", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{d.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === SKILL CATEGORIES === */}
        {tab === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: "13px", color: "#8892a4", marginBottom: 14, lineHeight: 1.6 }}>
              Click any category to expand its planned skills. Each skill includes both a SKILL.md (knowledge) and companion MCP server (execution).
            </p>
            <CategoryCard
              icon="🔥" title="Firewall & Access Control" count="15+" color="#ff6c6c"
              skills={["Palo Alto policy audit", "OPNsense rule generation", "Meraki ACL management", "AWS Security Groups", "Azure NSG compliance", "GCP firewall rules", "Zero Trust policy builder", "Firewall migration assistant", "Rule conflict detector", "Change window planner"]}
            />
            <CategoryCard
              icon="📊" title="SIEM & Monitoring" count="12+" color="#6c8cff"
              skills={["Splunk query builder", "Elastic SIEM triage", "Azure Sentinel KQL", "Alert correlation engine", "Log anomaly detector", "Dashboard generator", "Detection rule authoring", "Threat hunting playbooks", "MITRE ATT&CK mapper", "SLA compliance monitor"]}
            />
            <CategoryCard
              icon="🔍" title="Vulnerability Management" count="10+" color="#ffb86c"
              skills={["CVE lookup & analysis", "Nmap scan orchestrator", "Nuclei template runner", "Patch prioritization", "Asset risk scorer", "Compliance gap finder", "Penetration test planner", "Remediation tracker", "SBOM analyzer", "Container image scanner"]}
            />
            <CategoryCard
              icon="🌐" title="Network Operations" count="18+" color="#00ff88"
              skills={["DNS resolution debug", "BGP route analyzer", "VPN tunnel diagnostics", "Load balancer config", "DHCP scope manager", "Subnet calculator", "Network topology mapper", "Bandwidth optimizer", "QoS policy generator", "MTU path discovery", "SNMP poller setup", "Config backup scheduler", "Branch deployment wizard", "SD-WAN policy builder", "Wireless survey analyzer"]}
            />
            <CategoryCard
              icon="☁️" title="Cloud Security" count="14+" color="#c97cff"
              skills={["AWS IAM auditor", "Azure AD reviewer", "GCP IAM analyzer", "S3 bucket scanner", "CloudTrail monitor", "KMS key rotator", "Cost anomaly detector", "Cross-account access review", "Lambda security checker", "Terraform plan reviewer", "Cloud posture assessment"]}
            />
            <CategoryCard
              icon="📋" title="Compliance & Governance" count="10+" color="#ff88c8"
              skills={["CIS benchmark checker", "NIST CSF assessment", "PCI-DSS audit runner", "SOC 2 evidence collector", "HIPAA control mapper", "ISO 27001 gap analysis", "Policy document generator", "Risk register builder", "Audit trail reporter", "Compliance dashboard"]}
            />
            <CategoryCard
              icon="🚨" title="Incident Response" count="12+" color="#ff4444"
              skills={["Alert triage workflow", "Forensic analysis guide", "Escalation procedures", "Containment playbooks", "Evidence preservation", "IOC extractor", "Timeline reconstructor", "Root cause analyzer", "Post-mortem generator", "Communication templates", "Severity classifier"]}
            />
          </div>
        )}

        {/* === MONOREPO === */}
        {tab === 3 && (
          <div>
            <p style={{ fontSize: "13px", color: "#8892a4", marginBottom: 20, lineHeight: 1.6 }}>
              Monorepo with pnpm workspaces + Changesets. Each MCP server and skill is independently versioned and publishable.
            </p>
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "20px",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              <FileNode name="netsec-skills/" isFolder color="#00ff88" highlight />
              <FileNode name="packages/" indent={1} isFolder color="#6c8cff" />
              <FileNode name="core/" indent={2} isFolder color="#6c8cff" />
              <FileNode name="auth, validation, testing utils" indent={3} />
              <FileNode name="sdk/" indent={2} isFolder color="#6c8cff" />
              <FileNode name="skill scaffolding CLI + templates" indent={3} />
              <FileNode name="skills/" indent={1} isFolder color="#00ff88" />
              <FileNode name="incident-response/" indent={2} isFolder color="#00ff88" />
              <FileNode name="alert-triage/SKILL.md" indent={3} highlight />
              <FileNode name="forensic-analysis/SKILL.md" indent={3} />
              <FileNode name="compliance/" indent={2} isFolder color="#00ff88" />
              <FileNode name="cis-benchmark/SKILL.md" indent={3} />
              <FileNode name="nist-csf/SKILL.md" indent={3} />
              <FileNode name="network-ops/" indent={2} isFolder color="#00ff88" />
              <FileNode name="firewall-troubleshooting/SKILL.md" indent={3} />
              <FileNode name="dns-resolution-debug/SKILL.md" indent={3} />
              <FileNode name="servers/" indent={1} isFolder color="#6c8cff" />
              <FileNode name="siem/" indent={2} isFolder color="#6c8cff" />
              <FileNode name="splunk-mcp/" indent={3} highlight />
              <FileNode name="elastic-mcp/" indent={3} />
              <FileNode name="sentinel-mcp/" indent={3} />
              <FileNode name="network/" indent={2} isFolder color="#6c8cff" />
              <FileNode name="firewall-mcp/" indent={3} />
              <FileNode name="dns-mcp/" indent={3} />
              <FileNode name="load-balancer-mcp/" indent={3} />
              <FileNode name="cloud-security/" indent={2} isFolder color="#6c8cff" />
              <FileNode name="aws-security-mcp/" indent={3} />
              <FileNode name="azure-security-mcp/" indent={3} />
              <FileNode name="vulnerability/" indent={2} isFolder color="#6c8cff" />
              <FileNode name="scanner-mcp/" indent={3} />
              <FileNode name="cve-lookup-mcp/" indent={3} />
              <FileNode name=".github/workflows/" indent={1} isFolder color="#ffb86c" />
              <FileNode name="pnpm-workspace.yaml" indent={1} />
              <FileNode name="changeset.config.json" indent={1} />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
              <NodeBox title="Each MCP Server Contains" color="#6c8cff" icon="📦" items={[
                "package.json (independent version)",
                "src/index.ts (FastMCP server)",
                "server.json (MCP Registry metadata)",
                "Dockerfile (containerized deploy)",
                "tests/ (unit + behavioral)",
                "CHANGELOG.md (Changesets)"
              ]} style={{ flex: "1 1 240px" }} />
              <NodeBox title="Each Skill Contains" color="#00ff88" icon="📝" items={[
                "SKILL.md (YAML + markdown)",
                "scripts/ (helper scripts)",
                "references/ (vendor docs)",
                "assets/ (templates, configs)",
                "tests/ (prompt-based evals)"
              ]} style={{ flex: "1 1 240px" }} />
              <NodeBox title="Testing Layers" color="#ffb86c" icon="🧪" items={[
                "Unit tests (mocked deps)",
                "MCP protocol compliance",
                "Integration (sandboxed infra)",
                "Behavioral (tool hit rate, success rate)",
              ]} style={{ flex: "1 1 240px" }} />
            </div>
          </div>
        )}

        {/* === SAFETY TIERS === */}
        {tab === 4 && (
          <div>
            <p style={{ fontSize: "13px", color: "#8892a4", marginBottom: 24, lineHeight: 1.6 }}>
              Every skill is assigned a safety tier governing its execution permissions. Write operations require human approval by default.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <TierCard
                tier="1"
                title="Advisory / Read-Only"
                desc="Query systems, analyze data, review configurations. Read-only credentials with zero write permissions. Safe to run autonomously."
                examples={["Log analysis", "Config audits", "CVE lookups", "Compliance checks", "Architecture reviews", "Topology discovery"]}
                color="#00ff88"
                risk="LOW RISK"
              />
              <TierCard
                tier="2"
                title="Write with Human Approval"
                desc="Modify infrastructure with mandatory human-in-the-loop confirmation. Every write operation pauses for explicit approval before execution."
                examples={["Firewall rules", "DNS changes", "Security groups", "ACL updates", "Cert rotations", "IAM policy changes"]}
                color="#ffb86c"
                risk="MEDIUM RISK"
              />
              <TierCard
                tier="3"
                title="Automated Write (Low-Risk)"
                desc="Well-tested, bounded operations promoted after extensive production validation. Scoped to non-destructive mutations only."
                examples={["Tag updates", "Log rotation", "Backup triggers", "Metric annotations", "Report generation"]}
                color="#ff6c6c"
                risk="CONTROLLED"
              />
            </div>

            <div style={{
              marginTop: 20,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "20px",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#5a6577", letterSpacing: "1.5px", marginBottom: 14, textTransform: "uppercase" }}>
                Security Guardrails
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                {[
                  { title: "Credential Isolation", desc: "Scoped IAM role per skill. No shared secrets." },
                  { title: "Audit Logging", desc: "Full chain: intent → reasoning → inputs → outputs → SIEM." },
                  { title: "Checkov Scanning", desc: "Security scan before any infrastructure deployment." },
                  { title: "Resource Tagging", desc: "MANAGED_BY + MCP_SOURCE on all AI-managed resources." },
                  { title: "Rate Limiting", desc: "Per-tool rate limits prevent runaway automation." },
                  { title: "Blast Radius Control", desc: "Max affected resources per single operation." },
                ].map((g, i) => (
                  <div key={i} style={{
                    padding: "14px",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#e8ecf2", marginBottom: 4 }}>{g.title}</div>
                    <div style={{ fontSize: "11px", color: "#6b7585", lineHeight: 1.4 }}>{g.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === TOOLING & WORKFLOW === */}
        {tab === 5 && (
          <div>
            <p style={{ fontSize: "13px", color: "#8892a4", marginBottom: 24, lineHeight: 1.6 }}>
              Use Claude Code for quality review of individual skills and Codex for parallel batch generation at scale.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
              <div style={{
                flex: "1 1 300px",
                background: "linear-gradient(135deg, rgba(0,255,136,0.05), transparent)",
                border: "1px solid rgba(0,255,136,0.2)",
                borderRadius: "14px",
                padding: "22px",
              }}>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#00ff88", marginBottom: 4 }}>Claude Code</div>
                <div style={{ fontSize: "11px", color: "#5a6577", marginBottom: 14 }}>Quality · Security · Individual Skills</div>
                {["Native MCP awareness (use + create servers)", "Built-in mcp-builder skill", "Superior vulnerability detection", "72.7% SWE-bench accuracy", "Best for: security review, edge cases, refinement"].map((item, i) => (
                  <div key={i} style={{ fontSize: "12px", color: "#a0a8b8", padding: "4px 0", display: "flex", alignItems: "start", gap: 8 }}>
                    <span style={{ color: "#00ff88", fontSize: 8, marginTop: 5 }}>◆</span> {item}
                  </div>
                ))}
              </div>
              <div style={{
                flex: "1 1 300px",
                background: "linear-gradient(135deg, rgba(108,140,255,0.05), transparent)",
                border: "1px solid rgba(108,140,255,0.2)",
                borderRadius: "14px",
                padding: "22px",
              }}>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#6c8cff", marginBottom: 4 }}>OpenAI Codex</div>
                <div style={{ fontSize: "11px", color: "#5a6577", marginBottom: 14 }}>Scale · Parallel · Batch Generation</div>
                {["3-4+ parallel cloud tasks simultaneously", "Isolated sandboxed execution", "GitHub PR integration for automated review", "Lower per-task cost than Claude Code", "Best for: batch scaffolding, boilerplate, parallel gen"].map((item, i) => (
                  <div key={i} style={{ fontSize: "12px", color: "#a0a8b8", padding: "4px 0", display: "flex", alignItems: "start", gap: 8 }}>
                    <span style={{ color: "#6c8cff", fontSize: 8, marginTop: 5 }}>◆</span> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "22px",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#5a6577", letterSpacing: "1.5px", marginBottom: 16, textTransform: "uppercase" }}>
                Skill Generation Pipeline
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                {[
                  { step: "1", label: "Catalog APIs", color: "#8892a4" },
                  { step: "2", label: "Auto-scaffold from OpenAPI", color: "#ffb86c" },
                  { step: "3", label: "Refine with Claude Code", color: "#00ff88" },
                  { step: "4", label: "Batch generate via Codex", color: "#6c8cff" },
                  { step: "5", label: "Test (FastMCP + Inspector)", color: "#c97cff" },
                  { step: "6", label: "Security review", color: "#ff6c6c" },
                  { step: "7", label: "Publish", color: "#00ff88" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderRadius: "10px",
                      background: `${s.color}0c`,
                      border: `1px solid ${s.color}25`,
                    }}>
                      <span style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: `${s.color}20`,
                        color: s.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}>{s.step}</span>
                      <span style={{ fontSize: "12px", color: "#c8d0dc", fontWeight: 500 }}>{s.label}</span>
                    </div>
                    {i < 6 && <span style={{ color: "#3d4a5c", fontSize: 10 }}>→</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
            }}>
              <NodeBox title="Primary: TypeScript" color="#6c8cff" icon="⚡" items={[
                "MCP TypeScript SDK",
                "FastMCP (TS)",
                "Zod schema validation",
                "OAuth 2.1 support",
                "Node.js I/O performance",
              ]} />
              <NodeBox title="Secondary: Python" color="#ffb86c" icon="🐍" items={[
                "Scapy (packet manipulation)",
                "Impacket (Windows protocols)",
                "FastMCP (Python)",
                "Nmap bindings",
                "pwntools",
              ]} />
              <NodeBox title="Infrastructure" color="#c97cff" icon="🏗" items={[
                "pnpm workspaces",
                "Changesets (versioning)",
                "Docker (containerization)",
                "GitHub Actions CI/CD",
                "MCP Inspector (testing)",
              ]} />
            </div>
          </div>
        )}

        {/* === ROADMAP === */}
        {tab === 6 && (
          <div>
            <p style={{ fontSize: "13px", color: "#8892a4", marginBottom: 24, lineHeight: 1.6 }}>
              Phased execution plan. Start read-only, prove value, then progressively add write capabilities with safety gates.
            </p>
            <TimelineItem
              phase="Phase 1"
              title="Foundation & Read-Only Skills"
              active={true}
              color="#00ff88"
              items={[
                "Set up monorepo: pnpm workspaces, Changesets, CI/CD",
                "Build core package: auth, validation, testing utilities",
                "Create SDK: skill scaffolding CLI + SKILL.md templates",
                "First 10 read-only skills: config audits, CVE lookup, log analysis",
                "First 5 MCP servers: DNS, SIEM query, vulnerability scan, cloud IAM read, compliance check",
                "Publish to npm + Docker Hub + MCP Registry",
              ]}
            />
            <TimelineItem
              phase="Phase 2"
              title="Scale Generation & Community"
              active={false}
              color="#6c8cff"
              items={[
                "Auto-scaffold servers from vendor OpenAPI specs (Meraki, Cloudflare, Palo Alto)",
                "Batch generate skills with Codex → refine with Claude Code",
                "Build behavioral testing framework (tool hit rate, success rate metrics)",
                "Launch skills.sh listing for discovery",
                "Target: 50+ skills, 20+ MCP servers across all categories",
                "Community contribution guidelines + skill quality standards",
              ]}
            />
            <TimelineItem
              phase="Phase 3"
              title="Write Operations (Human-Approved)"
              active={false}
              color="#ffb86c"
              items={[
                "Add Tier 2 write capabilities with mandatory human approval gates",
                "Firewall rule changes, DNS updates, security group modifications",
                "Implement audit logging: full chain to SIEM (CEF, syslog, JSON)",
                "Credential isolation: per-skill IAM roles, zero shared secrets",
                "Checkov integration for pre-deployment security scanning",
                "Resource tagging (MANAGED_BY, MCP_SOURCE) on all AI-managed resources",
              ]}
            />
            <TimelineItem
              phase="Phase 4"
              title="Production Automation & Ecosystem"
              active={false}
              color="#c97cff"
              items={[
                "Promote validated operations to Tier 3 (automated, bounded writes)",
                "Build provider adapters: LangChain, CrewAI, AutoGen wrappers",
                "Enterprise features: SSO, RBAC, compliance reporting",
                "Integration with SaaS platform (NaaS portal, orchestration tool)",
                "Target: 100+ skills, 50+ MCP servers, full NetSec coverage",
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
