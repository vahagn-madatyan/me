import { useState } from "react";

const COLORS = {
  bg: "#0a0b0f",
  surface: "#12131a",
  surfaceHover: "#1a1b25",
  border: "#1e2030",
  borderActive: "#3b4070",
  text: "#e2e4f0",
  textMuted: "#6b7094",
  accent: "#6366f1",
  accentGlow: "rgba(99,102,241,0.15)",
  accentSoft: "rgba(99,102,241,0.08)",
  green: "#10b981",
  greenGlow: "rgba(16,185,129,0.12)",
  amber: "#f59e0b",
  amberGlow: "rgba(245,158,11,0.12)",
  rose: "#f43f5e",
  roseGlow: "rgba(244,63,94,0.12)",
  cyan: "#06b6d4",
  cyanGlow: "rgba(6,182,212,0.12)",
  purple: "#a855f7",
  purpleGlow: "rgba(168,85,247,0.12)",
};

const layers = [
  {
    id: "clients",
    label: "Client Layer",
    color: COLORS.cyan,
    glow: COLORS.cyanGlow,
    icon: "◈",
    items: [
      { name: "Buyer Portal", desc: "Search, filter, save deals, AI matching", icon: "🔍" },
      { name: "Seller Portal", desc: "List business, upload financials, manage offers", icon: "📋" },
      { name: "Admin Dashboard", desc: "Moderation, analytics, deal pipeline", icon: "⚙️" },
      { name: "Mobile App", desc: "Push alerts, deal tracking, messaging", icon: "📱" },
    ],
  },
  {
    id: "gateway",
    label: "API Gateway & Auth",
    color: COLORS.accent,
    glow: COLORS.accentGlow,
    icon: "◉",
    items: [
      { name: "API Gateway", desc: "Rate limiting, routing, request validation", icon: "🌐" },
      { name: "Auth Service", desc: "OAuth 2.0, MFA, role-based access", icon: "🔐" },
      { name: "CDN / Edge", desc: "Static assets, global distribution", icon: "⚡" },
      { name: "WebSocket Hub", desc: "Real-time notifications, chat, deal updates", icon: "🔄" },
    ],
  },
  {
    id: "core",
    label: "Core Platform Services",
    color: COLORS.green,
    glow: COLORS.greenGlow,
    icon: "◆",
    items: [
      { name: "Listing Engine", desc: "CRUD, versioning, AI category tagging", icon: "📝" },
      { name: "Matching & Discovery", desc: "ML-powered buyer-seller matching", icon: "🎯" },
      { name: "Deal Room", desc: "NDA management, document sharing, negotiation", icon: "🤝" },
      { name: "Escrow & Payments", desc: "Stripe Connect, milestone releases, multi-currency", icon: "💳" },
      { name: "Messaging", desc: "Encrypted chat, file sharing, thread management", icon: "💬" },
      { name: "Notifications", desc: "Email, push, in-app, digest scheduling", icon: "🔔" },
    ],
  },
  {
    id: "ai_dd",
    label: "AI Due Diligence Engine",
    color: COLORS.amber,
    glow: COLORS.amberGlow,
    icon: "◇",
    items: [
      { name: "API Dependency Scanner", desc: "Map vendor lock-in risk (OpenAI, Anthropic, etc.)", icon: "🔗" },
      { name: "Model Quality Assessor", desc: "Benchmark performance, evaluate architecture", icon: "🧠" },
      { name: "Revenue Quality Scoring", desc: "MRR analysis, churn prediction, retention grading", icon: "📊" },
      { name: "Compute Cost Analyzer", desc: "GPU spend forecasting, scaling cost models", icon: "💻" },
      { name: "Data Provenance Validator", desc: "Training data licensing, GDPR compliance check", icon: "🛡️" },
      { name: "Valuation Engine", desc: "Proprietary AI multiples from transaction data", icon: "📈" },
    ],
  },
  {
    id: "acquihire",
    label: "Acqui-Hire Module",
    color: COLORS.purple,
    glow: COLORS.purpleGlow,
    icon: "◈",
    items: [
      { name: "Team Profile Engine", desc: "Skill mapping, publication tracking, contribution graphs", icon: "👥" },
      { name: "Deal Structuring", desc: "License + hire templates, antitrust-safe frameworks", icon: "📄" },
      { name: "Talent Valuation", desc: "Market rate benchmarking, retention risk scoring", icon: "💎" },
      { name: "Integration Planner", desc: "Post-acquisition team onboarding workflows", icon: "🗺️" },
    ],
  },
  {
    id: "data",
    label: "Data & Infrastructure",
    color: COLORS.rose,
    glow: COLORS.roseGlow,
    icon: "◉",
    items: [
      { name: "PostgreSQL + pgvector", desc: "Listings, users, transactions, embeddings", icon: "🗄️" },
      { name: "Redis Cluster", desc: "Caching, session store, real-time pub/sub", icon: "⚡" },
      { name: "S3 / Object Storage", desc: "Documents, financials, due diligence reports", icon: "📦" },
      { name: "Elasticsearch", desc: "Full-text search, faceted filtering, analytics", icon: "🔎" },
      { name: "Event Bus (Kafka)", desc: "Async processing, audit trail, analytics pipeline", icon: "📡" },
      { name: "ML Pipeline (SageMaker)", desc: "Model training, valuation benchmarks, matching", icon: "🤖" },
    ],
  },
];

const revenueStreams = [
  { label: "Success Fee", value: "3–5%", desc: "On closed deals ($100K–$10M range)", color: COLORS.green },
  { label: "Buyer Subscriptions", value: "$300–500/yr", desc: "Premium matching & early deal access", color: COLORS.accent },
  { label: "Listing Fees", value: "$100–300/mo", desc: "Verified seller listings", color: COLORS.amber },
  { label: "DD Reports", value: "$2K–10K", desc: "AI-specific technical due diligence", color: COLORS.purple },
];

const metrics = [
  { label: "TAM (H1 2025)", value: "$55.3B", sub: "AI M&A deal value" },
  { label: "AI Companies", value: "212K+", sub: "Global target market" },
  { label: "Y3 ARR Target", value: "$3–8M", sub: "Conservative projection" },
  { label: "Y5 ARR Target", value: "$15–25M", sub: "With adjacent services" },
];

export default function ArchitectureDiagram() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [view, setView] = useState("architecture");

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      background: COLORS.bg,
      color: COLORS.text,
      minHeight: "100vh",
      padding: "24px",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 8 }}>
            Platform Architecture
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.cyan})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: -0.5,
          }}>
            AI M&A Marketplace
          </h1>
          <p style={{ fontSize: 12, color: COLORS.textMuted, margin: "6px 0 0", maxWidth: 500 }}>
            Full-stack platform combining AI business M&A, specialized due diligence, and acqui-hire facilitation
          </p>
        </div>
        <div style={{ display: "flex", gap: 4, background: COLORS.surface, borderRadius: 8, padding: 3, border: `1px solid ${COLORS.border}` }}>
          {["architecture", "revenue", "metrics"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "7px 14px",
              fontSize: 11,
              fontFamily: "inherit",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              background: view === v ? COLORS.accent : "transparent",
              color: view === v ? "#fff" : COLORS.textMuted,
              fontWeight: view === v ? 600 : 400,
              transition: "all 0.2s",
              textTransform: "capitalize",
            }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Architecture View */}
      {view === "architecture" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {layers.map((layer, li) => {
            const isActive = activeLayer === layer.id;
            return (
              <div key={layer.id} style={{ position: "relative" }}>
                {/* Connection line */}
                {li > 0 && (
                  <div style={{
                    position: "absolute", top: -12, left: 40, width: 2, height: 12,
                    background: `linear-gradient(to bottom, ${layers[li - 1].color}44, ${layer.color}44)`,
                  }} />
                )}
                <div
                  onClick={() => setActiveLayer(isActive ? null : layer.id)}
                  style={{
                    background: isActive ? layer.glow : COLORS.surface,
                    border: `1px solid ${isActive ? layer.color + "55" : COLORS.border}`,
                    borderRadius: 12,
                    padding: "16px 20px",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: isActive ? `0 0 30px ${layer.color}15` : "none",
                  }}
                >
                  {/* Layer header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isActive ? 16 : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: layer.glow,
                        border: `1px solid ${layer.color}33`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, color: layer.color,
                      }}>
                        {layer.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{layer.label}</div>
                        <div style={{ fontSize: 10, color: COLORS.textMuted }}>{layer.items.length} services</div>
                      </div>
                    </div>
                    <div style={{
                      display: "flex", gap: 6, alignItems: "center",
                    }}>
                      {!isActive && layer.items.slice(0, 4).map((item, i) => (
                        <span key={i} style={{
                          fontSize: 9, padding: "3px 8px", borderRadius: 4,
                          background: layer.glow, color: layer.color, border: `1px solid ${layer.color}22`,
                          whiteSpace: "nowrap",
                        }}>
                          {item.name}
                        </span>
                      ))}
                      {!isActive && layer.items.length > 4 && (
                        <span style={{ fontSize: 9, color: COLORS.textMuted }}>+{layer.items.length - 4}</span>
                      )}
                      <span style={{
                        fontSize: 11, color: COLORS.textMuted,
                        transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s", display: "inline-block", marginLeft: 4,
                      }}>▾</span>
                    </div>
                  </div>

                  {/* Expanded items */}
                  {isActive && (
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: 8,
                    }}>
                      {layer.items.map((item, i) => (
                        <div key={i} style={{
                          background: COLORS.bg,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 8,
                          padding: "12px 14px",
                          transition: "all 0.2s",
                        }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = layer.color + "44";
                            e.currentTarget.style.background = COLORS.surfaceHover;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = COLORS.border;
                            e.currentTarget.style.background = COLORS.bg;
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 16 }}>{item.icon}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{item.name}</span>
                          </div>
                          <div style={{ fontSize: 10, color: COLORS.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Tech stack footer */}
          <div style={{
            marginTop: 12, padding: "14px 20px", borderRadius: 10,
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
          }}>
            <span style={{ fontSize: 10, color: COLORS.textMuted, marginRight: 8, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Stack →</span>
            {["Next.js", "React Native", "Node.js", "PostgreSQL", "pgvector", "Redis", "Kafka", "Elasticsearch", "AWS", "Stripe Connect", "SageMaker", "Terraform"].map(t => (
              <span key={t} style={{
                fontSize: 10, padding: "3px 10px", borderRadius: 4,
                background: COLORS.accentSoft, color: COLORS.accent,
                border: `1px solid ${COLORS.accent}15`,
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Revenue View */}
      {view === "revenue" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12,
          }}>
            {revenueStreams.map((r, i) => (
              <div key={i} style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 20,
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${r.color}, transparent)`,
                }} />
                <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{r.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: r.color, marginBottom: 6 }}>{r.value}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{r.desc}</div>
              </div>
            ))}
          </div>

          {/* Revenue model breakdown */}
          <div style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: 24,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Revenue Mix at Scale (Y3 Projection)</div>
            {[
              { label: "Success Fees", pct: 55, color: COLORS.green },
              { label: "DD & Valuation Reports", pct: 20, color: COLORS.amber },
              { label: "Buyer Subscriptions", pct: 15, color: COLORS.accent },
              { label: "Listing Fees", pct: 10, color: COLORS.purple },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: COLORS.text }}>{item.label}</span>
                  <span style={{ fontSize: 11, color: item.color, fontWeight: 600 }}>{item.pct}%</span>
                </div>
                <div style={{ height: 6, background: COLORS.bg, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${item.pct}%`, background: item.color,
                    borderRadius: 3, transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Comparable benchmarks */}
          <div style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: 24,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Comparable Platform Economics</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {[
                { name: "Acquire.com", rev: "$7–14M", fee: "4% closing", buyers: "500K+" },
                { name: "Empire Flippers", rev: "$7.2M", fee: "7–15%", buyers: "250K+" },
                { name: "Flippa", rev: "~$10M", fee: "5–10%", buyers: "353K+" },
                { name: "FE International", rev: "~$5M", fee: "10–15%", buyers: "80K+" },
              ].map((p, i) => (
                <div key={i} style={{
                  background: COLORS.bg, borderRadius: 8, padding: 14,
                  border: `1px solid ${COLORS.border}`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.accent, marginBottom: 8 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 3 }}>Revenue: <span style={{ color: COLORS.text }}>{p.rev}</span></div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 3 }}>Fee: <span style={{ color: COLORS.text }}>{p.fee}</span></div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>Buyers: <span style={{ color: COLORS.text }}>{p.buyers}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metrics View */}
      {view === "metrics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12,
          }}>
            {metrics.map((m, i) => (
              <div key={i} style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 20,
                textAlign: "center",
              }}>
                <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>{m.label}</div>
                <div style={{
                  fontSize: 32, fontWeight: 700,
                  background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.cyan})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  marginBottom: 6,
                }}>{m.value}</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Three wedge strategy */}
          <div style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: 24,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 20 }}>Three-Wedge Go-to-Market Strategy</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {[
                {
                  phase: "Wedge 1",
                  title: "AI M&A Marketplace",
                  timeline: "Months 0–6",
                  color: COLORS.green,
                  tasks: ["AI agency listings ($100K–$10M)", "Buyer-seller matching (ML)", "Escrow & deal rooms", "Content-led acquisition"],
                },
                {
                  phase: "Wedge 2",
                  title: "Due Diligence Tools",
                  timeline: "Months 4–12",
                  color: COLORS.amber,
                  tasks: ["API dependency scanner", "Revenue quality scoring", "Valuation benchmarks", "Standalone DD reports"],
                },
                {
                  phase: "Wedge 3",
                  title: "Acqui-Hire Module",
                  timeline: "Months 8–18",
                  color: COLORS.purple,
                  tasks: ["Team profile engine", "License + hire structuring", "Talent valuation models", "Corporate dev partnerships"],
                },
              ].map((w, i) => (
                <div key={i} style={{
                  background: COLORS.bg, borderRadius: 10, padding: 18,
                  border: `1px solid ${w.color}22`,
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, bottom: 0, width: 3,
                    background: w.color,
                  }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{
                      fontSize: 9, padding: "2px 8px", borderRadius: 4,
                      background: w.color + "15", color: w.color, fontWeight: 600, letterSpacing: 1,
                    }}>{w.phase}</span>
                    <span style={{ fontSize: 9, color: COLORS.textMuted }}>{w.timeline}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>{w.title}</div>
                  {w.tasks.map((t, ti) => (
                    <div key={ti} style={{
                      fontSize: 10, color: COLORS.textMuted, padding: "4px 0",
                      borderTop: ti > 0 ? `1px solid ${COLORS.border}` : "none",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <span style={{ color: w.color, fontSize: 8 }}>●</span> {t}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Risk matrix */}
          <div style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: 24,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Key Risk Factors & Mitigations</div>
            {[
              { risk: "Cold-start / liquidity problem", mitigation: "Content-led growth (newsletter, valuation reports, benchmarks)", severity: "high" },
              { risk: "Acquire.com adds AI vertical features", mitigation: "Deep DD tooling they can't replicate + acqui-hire module", severity: "high" },
              { risk: "Buyer-seller disintermediation", mitigation: "Escrow, DD tools, legal templates make off-platform risky", severity: "medium" },
              { risk: "AI business valuation volatility", mitigation: "Proprietary benchmark dataset from transaction history", severity: "medium" },
              { risk: "Regulatory complexity (EU AI Act, FTC)", mitigation: "Compliance tools as feature, not blocker — becomes moat", severity: "low" },
            ].map((r, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none",
              }}>
                <span style={{
                  fontSize: 8, padding: "3px 8px", borderRadius: 4, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: 1, flexShrink: 0,
                  background: r.severity === "high" ? COLORS.roseGlow : r.severity === "medium" ? COLORS.amberGlow : COLORS.greenGlow,
                  color: r.severity === "high" ? COLORS.rose : r.severity === "medium" ? COLORS.amber : COLORS.green,
                }}>{r.severity}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: COLORS.text, fontWeight: 500 }}>{r.risk}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{r.mitigation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
