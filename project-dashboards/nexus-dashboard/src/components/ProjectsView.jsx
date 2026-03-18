import { useState } from "react";
import { projects, categoryColors, statusConfig } from "../data/projects";
import { hexToRgb } from "../utils/hexToRgb";
import { computeHeatScore } from "../utils/computeHeatScore";
import ProjectCard from "./ProjectCard";
import FilterPill from "./FilterPill";
import ActiveOpsStrip from "./ActiveOpsStrip";

const MONO = "'JetBrains Mono', 'Fira Code', monospace";

const SORT_MODES = [
  { key: "activity", label: "ACTIVITY" },
  { key: "progress", label: "PROGRESS" },
  { key: "name", label: "NAME" },
  { key: "sector", label: "SECTOR" },
];

function sortProjects(list, sortBy) {
  const sorted = [...list];
  switch (sortBy) {
    case "activity":
      sorted.sort((a, b) => computeHeatScore(b) - computeHeatScore(a));
      break;
    case "progress":
      sorted.sort((a, b) => b.phase - a.phase);
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "sector":
      sorted.sort((a, b) => a.category.localeCompare(b.category) || computeHeatScore(b) - computeHeatScore(a));
      break;
    default:
      break;
  }
  // Pin active projects to top
  const active = sorted.filter(p => p.isActive);
  const rest = sorted.filter(p => !p.isActive);
  return [...active, ...rest];
}

const ProjectsView = ({ onBack }) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("activity");

  const categories = ["ALL", ...new Set(projects.map(p => p.category))];
  const activeProjects = projects.filter(p => p.isActive);

  const filtered = sortProjects(
    projects.filter(p => {
      const matchCat = activeFilter === "ALL" || p.category === activeFilter;
      const matchSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
    }),
    sortBy
  );

  return (
    <div style={{
      position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "24px",
      animation: "warpIn 0.6s ease forwards",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "20px", flexWrap: "wrap", gap: "12px",
        borderBottom: "1px solid rgba(0,255,170,0.08)", paddingBottom: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onBack} style={{
            padding: "5px 12px", fontFamily: MONO, fontSize: "0.55rem", letterSpacing: "1px",
            color: "#0fa", background: "rgba(0,255,170,0.04)",
            border: "1px solid rgba(0,255,170,0.15)", cursor: "pointer",
            transition: "all 0.2s ease",
          }}>
            ◂ EXIT
          </button>
          <span style={{
            fontFamily: MONO, fontSize: "1.1rem", fontWeight: 900,
            color: "#0fa", letterSpacing: "4px",
            textShadow: "0 0 15px rgba(0,255,170,0.3)",
          }}>
            NEXUS
          </span>
          <span style={{
            fontFamily: MONO, fontSize: "0.45rem", color: "rgba(0,255,170,0.2)",
            letterSpacing: "2px",
          }}>
            // {projects.length} ACTIVE NODES
          </span>
        </div>

        <div style={{ display: "flex", gap: "24px" }}>
          {[
            { val: "14", label: "NODES", color: "#0fa" },
            { val: "400+", label: "TOOLS", color: "#08f" },
            { val: "120+", label: "SKILLS", color: "#f80" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: MONO, fontSize: "1.2rem", fontWeight: "bold",
                color: s.color, textShadow: `0 0 10px ${s.color}40`,
              }}>{s.val}</div>
              <div style={{
                fontFamily: MONO, fontSize: "0.4rem", color: "rgba(0,255,170,0.25)",
                letterSpacing: "2px",
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Ops Strip */}
      <ActiveOpsStrip projects={activeProjects} />

      {/* Search + sort + view */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center",
            background: "rgba(0,255,170,0.02)", border: "1px solid rgba(0,255,170,0.08)",
            padding: "0 12px",
          }}>
            <span style={{ fontFamily: MONO, color: "rgba(0,255,170,0.3)", fontSize: "0.7rem", marginRight: "8px" }}>$</span>
            <input
              type="text" placeholder="grep -i 'keyword' ./projects/*"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#0fa", fontFamily: MONO, fontSize: "0.65rem",
                padding: "9px 0", letterSpacing: "0.5px",
              }}
            />
            {searchTerm && (
              <span onClick={() => setSearchTerm("")}
                style={{ color: "rgba(0,255,170,0.3)", cursor: "pointer", fontFamily: MONO, fontSize: "0.7rem" }}>×</span>
            )}
          </div>
          <div style={{ display: "flex", gap: "2px" }}>
            {["grid", "list"].map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                padding: "7px 10px", fontFamily: MONO,
                background: viewMode === mode ? "rgba(0,255,170,0.1)" : "transparent",
                border: `1px solid ${viewMode === mode ? "rgba(0,255,170,0.2)" : "rgba(0,255,170,0.06)"}`,
                color: viewMode === mode ? "#0fa" : "rgba(0,255,170,0.2)",
                cursor: "pointer", fontSize: "0.6rem",
              }}>
                {mode === "grid" ? "⊞" : "☰"}
              </button>
            ))}
          </div>
        </div>

        {/* Sort controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            fontFamily: MONO, fontSize: "0.42rem", color: "rgba(0,255,170,0.2)",
            letterSpacing: "1.5px", whiteSpace: "nowrap",
          }}>
            SORT_BY:
          </span>
          <div style={{ display: "flex", gap: "2px" }}>
            {SORT_MODES.map(mode => (
              <button key={mode.key} onClick={() => setSortBy(mode.key)} style={{
                padding: "3px 10px", fontFamily: MONO, fontSize: "0.42rem", letterSpacing: "1px",
                color: sortBy === mode.key ? "#020402" : "rgba(0,255,170,0.3)",
                background: sortBy === mode.key ? "#0fa" : "transparent",
                border: `1px solid ${sortBy === mode.key ? "transparent" : "rgba(0,255,170,0.08)"}`,
                cursor: "pointer", transition: "all 0.2s ease", textTransform: "uppercase",
              }}>
                {sortBy === mode.key ? `${mode.label}▾` : mode.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {categories.map(cat => (
            <FilterPill key={cat} label={cat}
              active={activeFilter === cat}
              color={cat === "ALL" ? "#0fa" : categoryColors[cat]}
              onClick={() => setActiveFilter(cat)} />
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{
        fontFamily: MONO, fontSize: "0.45rem", color: "rgba(0,255,170,0.2)",
        letterSpacing: "2px", marginBottom: "12px",
      }}>
        RESULTS: {filtered.length}/{projects.length}
        {activeFilter !== "ALL" && <span style={{ color: categoryColors[activeFilter] }}> [{activeFilter}]</span>}
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(340px, 1fr))" : "1fr",
        gap: "8px", marginBottom: "50px",
      }}>
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project}
            onClick={() => setExpandedCard(expandedCard === project.id ? null : project.id)}
            delay={i * 50}
          />
        ))}
      </div>

      {/* Tech Radar */}
      <div style={{ borderTop: "1px solid rgba(0,255,170,0.06)", paddingTop: "30px", marginBottom: "30px" }}>
        <div style={{
          textAlign: "center", marginBottom: "20px", fontFamily: MONO,
          fontSize: "0.5rem", color: "rgba(0,255,170,0.3)", letterSpacing: "4px",
        }}>
          ─── TECH STACK RADAR ───
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px" }}>
          {[
            { name: "Python", count: 10 }, { name: "Docker", count: 6 }, { name: "FastMCP", count: 4 },
            { name: "LangGraph", count: 3 }, { name: "React", count: 4 }, { name: "MCP Protocol", count: 5 },
            { name: "PostgreSQL", count: 3 }, { name: "Alpaca", count: 3 }, { name: "TypeScript", count: 2 },
            { name: "FastAPI", count: 2 }, { name: "ClickHouse", count: 2 }, { name: "Finnhub", count: 2 },
            { name: "Node.js", count: 2 }, { name: "Zabbix", count: 1 }, { name: "LiteLLM", count: 1 },
            { name: "AWS Bedrock", count: 1 }, { name: "Massive.com", count: 1 }, { name: "Tailscale", count: 1 },
            { name: "tmux", count: 1 }, { name: "TimescaleDB", count: 1 },
          ].map((t, i) => (
            <span key={i} style={{
              padding: `${3 + t.count}px ${8 + t.count * 2}px`,
              fontFamily: MONO, fontSize: `${0.45 + t.count * 0.03}rem`,
              color: `rgba(0,255,170,${0.2 + (t.count / 10) * 0.5})`,
              background: `rgba(0,255,170,${0.01 + (t.count / 10) * 0.03})`,
              border: `1px solid rgba(0,255,170,${0.04 + (t.count / 10) * 0.06})`,
              letterSpacing: "0.5px",
            }}>
              {t.name} <span style={{ opacity: 0.4 }}>×{t.count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Status */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "4px", marginBottom: "40px",
      }}>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = projects.filter(p => p.status === status).length;
          return (
            <div key={status} style={{
              background: "rgba(0,255,170,0.015)",
              border: `1px solid rgba(${hexToRgb(config.color)},0.1)`,
              padding: "12px 14px",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <div style={{
                fontFamily: MONO, fontSize: "1.4rem", fontWeight: "bold",
                color: config.color, textShadow: `0 0 8px ${config.color}40`,
                minWidth: "28px",
              }}>{count}</div>
              <div style={{
                fontFamily: MONO, fontSize: "0.45rem", color: config.color,
                letterSpacing: "1.5px", opacity: 0.7,
              }}>{status}</div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center", borderTop: "1px solid rgba(0,255,170,0.04)", paddingTop: "20px",
      }}>
        <div style={{
          fontFamily: MONO, fontSize: "0.45rem", color: "rgba(0,255,170,0.12)",
          letterSpacing: "3px",
        }}>
          V.MADATYAN // 2025-2026 // BUILDING AUTONOMOUS SECURITY & AI
        </div>
      </div>
    </div>
  );
};

export default ProjectsView;
