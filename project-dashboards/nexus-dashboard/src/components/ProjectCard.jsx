import { useState, useEffect, useRef } from "react";
import { statusConfig } from "../data/projects";
import { hexToRgb } from "../utils/hexToRgb";
import { relativeTime } from "../utils/relativeTime";

const MONO = "'JetBrains Mono', 'Fira Code', monospace";

const ProjectCard = ({ project, onClick, delay = 0, focused = false, expanded = false }) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const detailRef = useRef(null);
  const [detailHeight, setDetailHeight] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (detailRef.current) {
      setDetailHeight(detailRef.current.scrollHeight);
    }
  }, [expanded, project]);

  const sc = statusConfig[project.status] || { color: "#888", sym: "○" };
  const statusRgb = hexToRgb(sc.color);
  const accentRgb = hexToRgb(project.accent);
  const priorityOpacity = project.priority ? Math.max(0.1, 1 - (project.priority - 1) * 0.2) : 0;

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered
            ? `linear-gradient(135deg, rgba(${statusRgb},0.08) 0%, rgba(6,12,6,0.97) 100%)`
            : `linear-gradient(180deg, rgba(${statusRgb},0.04) 0%, rgba(6,12,6,0.95) 100%)`,
          border: `1px solid ${expanded ? sc.color + "50" : focused ? sc.color + "60" : hovered ? sc.color + "40" : "rgba(0,255,170,0.12)"}`,
          borderBottom: expanded ? `1px solid rgba(${statusRgb},0.15)` : undefined,
          padding: "16px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          boxShadow: expanded
            ? `0 0 20px rgba(${statusRgb},0.12)`
            : focused
              ? `0 0 20px rgba(${statusRgb},0.12), inset 0 0 20px rgba(${statusRgb},0.02)`
              : hovered ? `0 0 20px rgba(${statusRgb},0.08)` : "none",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Priority bar (left edge) */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "2px",
          background: `rgba(${accentRgb},${priorityOpacity})`,
          boxShadow: priorityOpacity > 0.5 ? `0 0 4px rgba(${accentRgb},${priorityOpacity * 0.5})` : "none",
        }} />

        {/* Top line — uses status color */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: `linear-gradient(90deg, transparent, ${sc.color}${hovered || expanded ? "50" : "25"}, transparent)`,
          transition: "all 0.3s ease",
        }} />

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.1rem" }}>{project.icon}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{
                  fontFamily: MONO, fontSize: "0.95rem", fontWeight: "bold",
                  color: project.accent, textShadow: `0 0 8px rgba(${accentRgb},0.3)`,
                  letterSpacing: "2px",
                }}>
                  {project.name}
                </span>
                {project.isActive && (
                  <span style={{
                    fontFamily: MONO, fontSize: "0.5rem", color: "#0fa",
                    letterSpacing: "1px", animation: "livePulse 2s ease infinite",
                    textShadow: "0 0 6px rgba(0,255,170,0.5)",
                  }}>
                    ◉ LIVE
                  </span>
                )}
              </div>
              <div style={{
                fontFamily: MONO, fontSize: "0.6rem", color: "rgba(0,255,170,0.4)",
                letterSpacing: "1.5px", marginTop: "2px",
              }}>
                {project.category}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
            <div style={{
              fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "1px",
              color: sc.color, display: "flex", alignItems: "center", gap: "4px",
            }}>
              <span style={{ textShadow: `0 0 6px ${sc.color}` }}>{sc.sym}</span>
              {project.status}
            </div>
            {project.lastUpdated && (
              <div style={{
                fontFamily: MONO, fontSize: "0.5rem", color: "rgba(0,255,170,0.35)",
                letterSpacing: "1px",
              }}>
                {relativeTime(project.lastUpdated)}
              </div>
            )}
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: MONO, fontSize: "0.72rem", color: "rgba(0,255,170,0.6)",
          marginBottom: "12px", lineHeight: 1.5,
        }}>
          {project.tagline}
        </div>

        {/* Progress — uses status color */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", marginBottom: "4px",
            fontFamily: MONO, fontSize: "0.55rem", color: "rgba(0,255,170,0.4)", letterSpacing: "1px",
          }}>
            <span>COMPLETION</span>
            <span style={{ color: sc.color }}>{project.phase}%</span>
          </div>
          <div style={{ height: "3px", background: "rgba(0,255,170,0.1)", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${project.phase}%`,
              background: sc.color,
              boxShadow: `0 0 8px ${sc.color}`,
              transition: "width 1s ease",
            }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginBottom: "8px" }}>
          {project.stats.map((stat, i) => (
            <div key={i} style={{
              background: `rgba(${statusRgb},0.03)`,
              border: `1px solid rgba(${statusRgb},0.08)`,
              padding: "6px 8px",
            }}>
              <div style={{
                fontFamily: MONO, fontSize: "0.55rem", color: "rgba(0,255,170,0.45)",
                letterSpacing: "1px", marginBottom: "2px",
              }}>
                {stat.label.toUpperCase()}
              </div>
              <div style={{
                fontFamily: MONO, fontSize: "0.8rem", color: project.accent,
                fontWeight: "bold", textShadow: `0 0 6px rgba(${accentRgb},0.2)`,
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: "center", fontFamily: MONO, fontSize: "0.5rem",
          color: "rgba(0,255,170,0.25)", letterSpacing: "2px", marginTop: "2px",
          transition: "transform 0.3s ease",
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        }}>
          ▼ DETAILS
        </div>
      </div>

      {/* Inline slide-down detail section */}
      <div
        ref={detailRef}
        style={{
          maxHeight: expanded ? `${detailHeight}px` : "0",
          opacity: expanded ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s ease, opacity 0.3s ease",
          background: `linear-gradient(180deg, rgba(${statusRgb},0.06) 0%, rgba(6,12,6,0.98) 100%)`,
          borderLeft: `1px solid ${expanded ? sc.color + "30" : "transparent"}`,
          borderRight: `1px solid ${expanded ? sc.color + "30" : "transparent"}`,
          borderBottom: `1px solid ${expanded ? sc.color + "30" : "transparent"}`,
        }}
      >
        <div style={{ padding: "16px 16px 20px" }}>
          {/* Dossier header */}
          <div style={{
            fontFamily: MONO, fontSize: "0.55rem", color: "rgba(0,255,170,0.4)",
            letterSpacing: "1.5px", marginBottom: "14px",
          }}>
            {`┌─ ${project.name} // DOSSIER ─┐`}
          </div>

          {/* Description */}
          <div style={{
            fontFamily: MONO, fontSize: "0.72rem", color: "rgba(0,255,170,0.6)",
            lineHeight: 1.7, marginBottom: "16px",
          }}>
            {project.description}
          </div>

          {/* Tech stack */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px",
          }}>
            {project.tech.map((t, i) => (
              <span key={i} style={{
                fontFamily: MONO, fontSize: "0.6rem", color: project.accent,
                border: `1px solid ${project.accent}50`,
                padding: "4px 12px", letterSpacing: "0.5px",
              }}>
                {t}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            borderTop: "1px solid rgba(0,255,170,0.1)",
            paddingTop: "10px", textAlign: "center",
            fontFamily: MONO, fontSize: "0.55rem",
            color: "rgba(0,255,170,0.3)", letterSpacing: "1.5px",
          }}>
            └─ END DOSSIER ─┘
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
