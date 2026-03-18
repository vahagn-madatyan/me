import { useState, useRef, useEffect } from "react";

const activityLog = [
  { date: "2026-01-12", project: "cyber-research", name: "CYBER RESEARCH", accent: "#0fa", message: "Completed market intelligence report", from: 95, to: 100 },
  { date: "2026-02-10", project: "network-mcps", name: "NETWORK MCPs", accent: "#0fa", message: "Initiated Prisma Access research", from: 20, to: 25 },
  { date: "2026-02-20", project: "ai-bazar", name: "AI BAZAR", accent: "#08f", message: "Architecture planning kickoff", from: 15, to: 20 },
  { date: "2026-02-22", project: "echelon", name: "ECHELON", accent: "#f80", message: "Scout agent prototype designed", from: 20, to: 25 },
  { date: "2026-02-25", project: "0xpwn", name: "0xPWN", accent: "#f33", message: "Identified 35+ enhancement gaps from Strix fork", from: 25, to: 30 },
  { date: "2026-03-01", project: "strat-trading", name: "STRAT TRADING", accent: "#0fa", message: "8-layer architecture specification complete", from: 25, to: 30 },
  { date: "2026-03-04", project: "netsec-skills", name: "NETSEC SKILLS", accent: "#0fa", message: "Dual-layer architecture designed", from: 30, to: 35 },
  { date: "2026-03-08", project: "policyfoundry", name: "POLICYFOUNDRY", accent: "#f80", message: "Vendor adapter framework scaffolded", from: 35, to: 40 },
  { date: "2026-03-11", project: "wheel-it-screenr", name: "WHEEL-IT SCREENR", accent: "#f33", message: "Put scoring algorithm with 5 weight factors", from: 45, to: 50 },
  { date: "2026-03-13", project: "repoforge", name: "REPOFORGE", accent: "#08f", message: "Copier template engine integration", from: 40, to: 45 },
  { date: "2026-03-14", project: "lumon", name: "LUMON", accent: "#0fa", message: "tmux bridge + wave scheduler operational", from: 50, to: 55 },
  { date: "2026-03-15", project: "zscaler-mcp", name: "ZSCALER MCP", accent: "#08f", message: "ZPA tools batch shipped", from: 50, to: 55 },
  { date: "2026-03-16", project: "wheeely", name: "WHEEELY", accent: "#f80", message: "ORATS premium data integration", from: 55, to: 60 },
  { date: "2026-03-17", project: "zephron", name: "ZEPHRON", accent: "#0fa", message: "LangGraph orchestration module shipped", from: 60, to: 65 },
];

const ActivityFeed = () => {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (expanded && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [expanded]);

  const sorted = [...activityLog].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div style={{ marginTop: 12 }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          background: "none",
          border: "none",
          color: "rgba(0,255,170,0.35)",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: "0.55rem",
          cursor: "pointer",
          padding: "4px 0",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {expanded ? "\u25B4" : "\u25BE"} SYS.LOG
      </button>

      {expanded && (
        <div
          ref={scrollRef}
          style={{
            maxHeight: 250,
            overflowY: "auto",
            background: "rgba(2,4,2,0.9)",
            border: "1px solid rgba(0,255,170,0.06)",
            padding: 12,
          }}
        >
          {sorted.map((entry, i) => (
            <div
              key={i}
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: "0.5rem",
                lineHeight: 2,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "rgba(0,255,170,0.2)" }}>
                [{entry.date}]
              </span>{" "}
              <span style={{ color: entry.accent, fontWeight: 600 }}>
                {entry.name}
              </span>{" "}
              <span style={{ color: "rgba(0,255,170,0.35)" }}>
                // {entry.message}
              </span>{" "}
              <span style={{ color: "rgba(0,255,170,0.25)" }}>
                // {entry.from}%\u2192{entry.to}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
