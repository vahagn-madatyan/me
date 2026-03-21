import { useState, useRef, useCallback, useEffect } from "react";
import { projects, categoryColors, statusConfig } from "../data/projects";
import { computeHeatScore } from "../utils/computeHeatScore";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import ProjectCard from "./ProjectCard";
import FilterPill from "./FilterPill";
import ActiveOpsStrip from "./ActiveOpsStrip";
import StatusBar from "./StatusBar";
import TechRadar from "./TechRadar";
import ActivityFeed from "./ActivityFeed";

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
  const active = sorted.filter(p => p.isActive);
  const rest = sorted.filter(p => !p.isActive);
  return [...active, ...rest];
}

function groupByCategory(list) {
  const groups = {};
  list.forEach(p => {
    if (!groups[p.category]) groups[p.category] = [];
    groups[p.category].push(p);
  });
  const entries = Object.entries(groups);
  entries.sort((a, b) => {
    const scoreA = a[1].reduce((sum, p) => sum + computeHeatScore(p), 0);
    const scoreB = b[1].reduce((sum, p) => sum + computeHeatScore(p), 0);
    return scoreB - scoreA;
  });
  return entries;
}

const ProjectsView = ({ onBack }) => {
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeStatus, setActiveStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("activity");
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const searchInputRef = useRef(null);
  const hashUpdateRef = useRef(false);

  const categories = ["ALL", ...new Set(projects.map(p => p.category))];
  const activeProjects = projects.filter(p => p.isActive);

  const filtered = sortProjects(
    projects.filter(p => {
      const matchCat = activeFilter === "ALL" || p.category === activeFilter;
      const matchStatus = !activeStatus || p.status === activeStatus;
      const matchSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchStatus && matchSearch;
    }),
    sortBy
  );

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#/category/")) {
      const catName = decodeURIComponent(hash.slice("#/category/".length));
      const matchedCat = categories.find(c => c === catName);
      if (matchedCat) {
        setActiveFilter(matchedCat);
      }
    } else if (hash.startsWith("#/project/")) {
      const projectId = decodeURIComponent(hash.slice("#/project/".length));
      const found = projects.find(p => p.id === projectId);
      if (found) {
        setExpandedProjectId(found.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      if (hashUpdateRef.current) {
        hashUpdateRef.current = false;
        return;
      }
      const hash = window.location.hash;
      if (hash.startsWith("#/category/")) {
        const catName = decodeURIComponent(hash.slice("#/category/".length));
        const matchedCat = categories.find(c => c === catName);
        if (matchedCat) {
          setActiveFilter(matchedCat);
          setExpandedProjectId(null);
        }
      } else if (hash.startsWith("#/project/")) {
        const projectId = decodeURIComponent(hash.slice("#/project/".length));
        const found = projects.find(p => p.id === projectId);
        if (found) {
          setExpandedProjectId(found.id);
        }
      } else if (hash === "#/projects") {
        setActiveFilter("ALL");
        setExpandedProjectId(null);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const setActiveFilterWithHash = useCallback((filter) => {
    setActiveFilter(filter);
    hashUpdateRef.current = true;
    if (filter === "ALL") {
      window.location.hash = "#/projects";
    } else {
      window.location.hash = "#/category/" + encodeURIComponent(filter);
    }
  }, []);

  const toggleDetailWithHash = useCallback((project) => {
    const isClosing = expandedProjectId === project.id;
    setExpandedProjectId(isClosing ? null : project.id);
    hashUpdateRef.current = true;
    if (isClosing) {
      if (activeFilter === "ALL") {
        window.location.hash = "#/projects";
      } else {
        window.location.hash = "#/category/" + encodeURIComponent(activeFilter);
      }
    } else {
      window.location.hash = "#/project/" + encodeURIComponent(project.id);
    }
  }, [expandedProjectId, activeFilter]);

  const closeDetailWithHash = useCallback(() => {
    setExpandedProjectId(null);
    hashUpdateRef.current = true;
    if (activeFilter === "ALL") {
      window.location.hash = "#/projects";
    } else {
      window.location.hash = "#/category/" + encodeURIComponent(activeFilter);
    }
  }, [activeFilter]);

  const handleOpenDetail = useCallback((index) => {
    if (index >= 0 && index < filtered.length) {
      toggleDetailWithHash(filtered[index]);
    }
  }, [filtered, toggleDetailWithHash]);

  const handleCloseDetail = useCallback(() => {
    closeDetailWithHash();
  }, [closeDetailWithHash]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const toggleGroup = useCallback((category) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  const { focusedIndex } = useKeyboardNav({
    filteredCount: filtered.length,
    searchInputRef,
    onOpenDetail: handleOpenDetail,
    onCloseDetail: handleCloseDetail,
    onClearSearch: handleClearSearch,
    setViewMode,
    detailOpen: !!expandedProjectId,
  });

  const grouped = groupByCategory(filtered);

  return (
    <div style={{
      position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "24px",
      animation: "warpIn 0.6s ease forwards",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "20px", flexWrap: "wrap", gap: "12px",
        borderBottom: "1px solid rgba(0,255,170,0.12)", paddingBottom: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onBack} style={{
            padding: "6px 14px", fontFamily: MONO, fontSize: "0.65rem", letterSpacing: "1px",
            color: "#0fa", background: "rgba(0,255,170,0.06)",
            border: "1px solid rgba(0,255,170,0.2)", cursor: "pointer",
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
            fontFamily: MONO, fontSize: "0.55rem", color: "rgba(0,255,170,0.4)",
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
                fontFamily: MONO, fontSize: "0.5rem", color: "rgba(0,255,170,0.45)",
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
            background: "rgba(6,12,6,0.9)", border: "1px solid rgba(0,255,170,0.12)",
            padding: "0 12px",
          }}>
            <span style={{ fontFamily: MONO, color: "rgba(0,255,170,0.5)", fontSize: "0.75rem", marginRight: "8px" }}>$</span>
            <input
              ref={searchInputRef}
              type="text" placeholder="grep -i 'keyword' ./projects/*"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#0fa", fontFamily: MONO, fontSize: "0.72rem",
                padding: "10px 0", letterSpacing: "0.5px",
              }}
            />
            {searchTerm && (
              <span onClick={() => setSearchTerm("")}
                style={{ color: "rgba(0,255,170,0.5)", cursor: "pointer", fontFamily: MONO, fontSize: "0.75rem" }}>×</span>
            )}
          </div>
          <div style={{ display: "flex", gap: "2px" }}>
            {[
              { mode: "grid", icon: "⊞" },
              { mode: "list", icon: "☰" },
              { mode: "grouped", icon: "⊟" },
            ].map(({ mode, icon }) => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                padding: "8px 12px", fontFamily: MONO,
                background: viewMode === mode ? "rgba(0,255,170,0.12)" : "rgba(6,12,6,0.9)",
                border: `1px solid ${viewMode === mode ? "rgba(0,255,170,0.25)" : "rgba(0,255,170,0.1)"}`,
                color: viewMode === mode ? "#0fa" : "rgba(0,255,170,0.4)",
                cursor: "pointer", fontSize: "0.7rem",
              }}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Sort controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            fontFamily: MONO, fontSize: "0.55rem", color: "rgba(0,255,170,0.4)",
            letterSpacing: "1.5px", whiteSpace: "nowrap",
          }}>
            SORT_BY:
          </span>
          <div style={{ display: "flex", gap: "2px" }}>
            {SORT_MODES.map(mode => (
              <button key={mode.key} onClick={() => setSortBy(mode.key)} style={{
                padding: "4px 12px", fontFamily: MONO, fontSize: "0.55rem", letterSpacing: "1px",
                color: sortBy === mode.key ? "#020402" : "rgba(0,255,170,0.5)",
                background: sortBy === mode.key ? "#0fa" : "transparent",
                border: `1px solid ${sortBy === mode.key ? "transparent" : "rgba(0,255,170,0.12)"}`,
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
              onClick={() => setActiveFilterWithHash(cat)} />
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar activeStatus={activeStatus} onStatusClick={setActiveStatus} />

      {/* Count */}
      <div style={{
        fontFamily: MONO, fontSize: "0.55rem", color: "rgba(0,255,170,0.4)",
        letterSpacing: "2px", marginBottom: "12px",
      }}>
        RESULTS: {filtered.length}/{projects.length}
        {activeFilter !== "ALL" && <span style={{ color: categoryColors[activeFilter] }}> [{activeFilter}]</span>}
        {activeStatus && <span style={{ color: statusConfig[activeStatus]?.color }}> [{activeStatus}]</span>}
      </div>

      {/* Grid / List / Grouped */}
      {viewMode === "grouped" ? (
        <div style={{ marginBottom: "50px" }}>
          {grouped.map(([category, groupProjects]) => {
            const isCollapsed = !!collapsedGroups[category];
            const catColor = categoryColors[category] || "#0fa";
            return (
              <div key={category} style={{ marginBottom: "16px" }}>
                {/* Group header */}
                <div
                  onClick={() => toggleGroup(category)}
                  style={{
                    cursor: "pointer",
                    fontFamily: MONO,
                    fontSize: "0.6rem",
                    letterSpacing: "2px",
                    color: catColor,
                    textShadow: `0 0 10px ${catColor}40`,
                    padding: "10px 0",
                    borderBottom: `1px solid ${catColor}30`,
                    marginBottom: isCollapsed ? "0" : "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    userSelect: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{
                    display: "inline-block",
                    transition: "transform 0.2s ease",
                    transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                    fontSize: "0.6rem",
                  }}>
                    ▾
                  </span>
                  <span>
                    {"═══"} SECTOR: {category} {"═══"} [{groupProjects.length} NODES]
                  </span>
                </div>
                {/* Group content with collapse animation */}
                <div style={{
                  overflow: "hidden",
                  maxHeight: isCollapsed ? "0" : "5000px",
                  opacity: isCollapsed ? 0 : 1,
                  transition: "max-height 0.4s ease, opacity 0.3s ease",
                }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                    gap: "8px",
                    paddingTop: "4px",
                  }}>
                    {groupProjects.map((project, i) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => toggleDetailWithHash(project)}
                        delay={i * 50}
                        focused={focusedIndex !== null && filtered[focusedIndex]?.id === project.id}
                        expanded={expandedProjectId === project.id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(340px, 1fr))" : "1fr",
          gap: "8px", marginBottom: "50px",
        }}>
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project}
              onClick={() => toggleDetailWithHash(project)}
              delay={i * 50}
              focused={focusedIndex === i}
              expanded={expandedProjectId === project.id}
            />
          ))}
        </div>
      )}

      {/* Tech Radar */}
      <TechRadar />

      {/* Activity Feed */}
      <ActivityFeed />

      {/* Keyboard shortcuts hint */}
      <div style={{
        textAlign: "center", fontFamily: MONO, fontSize: "0.5rem",
        color: "rgba(0,255,170,0.2)", letterSpacing: "1px", marginBottom: "20px",
      }}>
        / search &nbsp; esc close &nbsp; j/k navigate &nbsp; enter detail &nbsp; g grid &nbsp; l list &nbsp; s grouped
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center", borderTop: "1px solid rgba(0,255,170,0.08)", paddingTop: "20px",
      }}>
        <div style={{
          fontFamily: MONO, fontSize: "0.55rem", color: "rgba(0,255,170,0.25)",
          letterSpacing: "3px",
        }}>
          V.MADATYAN // 2025-2026 // BUILDING AUTONOMOUS SECURITY & AI
        </div>
      </div>

    </div>
  );
};

export default ProjectsView;
