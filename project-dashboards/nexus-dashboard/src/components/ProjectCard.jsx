import { useState, useEffect } from "react";
import { statusConfig } from "../data/projects";
import { hexToRgb } from "../utils/hexToRgb";
import { relativeTime } from "../utils/relativeTime";

const MONO = "'JetBrains Mono', 'Fira Code', monospace";

const ProjectCard = ({ project, onClick, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const sc = statusConfig[project.status] || { color: "#888", sym: "○" };
  const priorityOpacity = project.priority ? Math.max(0.1, 1 - (project.priority - 1) * 0.2) : 0;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, rgba(${hexToRgb(project.accent)},0.06) 0%, rgba(2,4,2,0.95) 100%)`
          : "rgba(4,8,4,0.8)",
        border: `1px solid ${hovered ? project.accent + "40" : "rgba(0,255,170,0.06)"}`,
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        boxShadow: hovered ? `0 0 20px rgba(${hexToRgb(project.accent)},0.08)` : "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Priority bar (left edge) */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "2px",
        background: `rgba(${hexToRgb(project.accent)},${priorityOpacity})`,
        boxShadow: priorityOpacity > 0.5 ? `0 0 4px rgba(${hexToRgb(project.accent)},${priorityOpacity * 0.5})` : "none",
      }} />

      {/* Top line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: `linear-gradient(90deg, transparent, ${project.accent}${hovered ? "60" : "20"}, transparent)`,
        transition: "all 0.3s ease",
      }} />

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.1rem" }}>{project.icon}</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                fontFamily: MONO, fontSize: "0.9rem", fontWeight: "bold",
                color: project.accent, textShadow: `0 0 8px rgba(${hexToRgb(project.accent)},0.3)`,
                letterSpacing: "2px",
              }}>
                {project.name}
              </span>
              {project.isActive && (
                <span style={{
                  fontFamily: MONO, fontSize: "0.42rem", color: "#0fa",
                  letterSpacing: "1px", animation: "livePulse 2s ease infinite",
                  textShadow: "0 0 6px rgba(0,255,170,0.5)",
                }}>
                  ◉ LIVE
                </span>
              )}
            </div>
            <div style={{
              fontFamily: MONO, fontSize: "0.5rem", color: "rgba(0,255,170,0.25)",
              letterSpacing: "1.5px", marginTop: "1px",
            }}>
              {project.category}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
          <div style={{
            fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "1px",
            color: sc.color, display: "flex", alignItems: "center", gap: "4px",
          }}>
            <span style={{ textShadow: `0 0 6px ${sc.color}` }}>{sc.sym}</span>
            {project.status}
          </div>
          {project.lastUpdated && (
            <div style={{
              fontFamily: MONO, fontSize: "0.42rem", color: "rgba(0,255,170,0.2)",
              letterSpacing: "1px",
            }}>
              {relativeTime(project.lastUpdated)}
            </div>
          )}
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: MONO, fontSize: "0.65rem", color: "rgba(0,255,170,0.45)",
        marginBottom: "12px", lineHeight: 1.4,
      }}>
        {project.tagline}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", marginBottom: "3px",
          fontFamily: MONO, fontSize: "0.45rem", color: "rgba(0,255,170,0.2)", letterSpacing: "1px",
        }}>
          <span>COMPLETION</span>
          <span style={{ color: project.accent }}>{project.phase}%</span>
        </div>
        <div style={{ height: "2px", background: "rgba(0,255,170,0.06)", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${project.phase}%`,
            background: project.accent,
            boxShadow: `0 0 8px ${project.accent}`,
            transition: "width 1s ease",
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginBottom: "8px" }}>
        {project.stats.map((stat, i) => (
          <div key={i} style={{
            background: "rgba(0,255,170,0.015)",
            border: "1px solid rgba(0,255,170,0.04)",
            padding: "6px 8px",
          }}>
            <div style={{
              fontFamily: MONO, fontSize: "0.42rem", color: "rgba(0,255,170,0.25)",
              letterSpacing: "1px", marginBottom: "2px",
            }}>
              {stat.label.toUpperCase()}
            </div>
            <div style={{
              fontFamily: MONO, fontSize: "0.75rem", color: project.accent,
              fontWeight: "bold", textShadow: `0 0 6px rgba(${hexToRgb(project.accent)},0.2)`,
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        textAlign: "center", fontFamily: MONO, fontSize: "0.45rem",
        color: "rgba(0,255,170,0.12)", letterSpacing: "2px", marginTop: "2px",
      }}>
        ▼ DETAILS
      </div>
    </div>
  );
};

export default ProjectCard;
