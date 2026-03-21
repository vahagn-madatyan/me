import { useEffect } from "react";
import { statusConfig } from "../data/projects";
import { hexToRgb } from "../utils/hexToRgb";
import { relativeTime } from "../utils/relativeTime";

const MONO = "'JetBrains Mono', 'Fira Code', monospace";

const ProjectDetailPanel = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [project, onClose]);

  if (!project) return null;

  const sc = statusConfig[project.status] || { color: "#888", sym: "○" };
  const rgb = hexToRgb(project.accent);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(2,4,2,0.7)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(520px, 90vw)",
          zIndex: 51,
          background: "rgba(6,12,6,0.98)",
          backdropFilter: "blur(16px)",
          borderLeft: "1px solid rgba(0,255,170,0.15)",
          transform: "translateX(0)",
          transition: "transform 0.3s ease",
          overflowY: "auto",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${project.accent}60, transparent)`,
          }}
        />

        {/* Panel content */}
        <div style={{ padding: "24px" }}>
          {/* A. Header bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: "0.55rem",
                color: "rgba(0,255,170,0.4)",
                letterSpacing: "1.5px",
              }}
            >
              {`\u250C\u2500 ${project.name} // DOSSIER \u2500\u2510`}
            </div>
            <button
              onClick={onClose}
              style={{
                fontFamily: MONO,
                fontSize: "0.6rem",
                color: "rgba(0,255,170,0.55)",
                background: "rgba(0,255,170,0.06)",
                border: "1px solid rgba(0,255,170,0.15)",
                padding: "5px 12px",
                cursor: "pointer",
                letterSpacing: "1.5px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#0fa";
                e.currentTarget.style.borderColor = "rgba(0,255,170,0.3)";
                e.currentTarget.style.background = "rgba(0,255,170,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(0,255,170,0.55)";
                e.currentTarget.style.borderColor = "rgba(0,255,170,0.15)";
                e.currentTarget.style.background = "rgba(0,255,170,0.06)";
              }}
            >
              {"\u00D7 CLOSE"}
            </button>
          </div>

          {/* C. Project identity */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>{project.icon}</span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: project.accent,
                letterSpacing: "3px",
                textShadow: `0 0 10px rgba(${rgb},0.4)`,
              }}
            >
              {project.name}
            </span>
            {project.isActive && (
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.55rem",
                  color: "#0fa",
                  letterSpacing: "1px",
                  animation: "livePulse 2s ease infinite",
                  textShadow: "0 0 6px rgba(0,255,170,0.5)",
                }}
              >
                {"\u25C9 LIVE"}
              </span>
            )}
          </div>

          {/* Category */}
          <div
            style={{
              fontFamily: MONO,
              fontSize: "0.6rem",
              color: "rgba(0,255,170,0.45)",
              letterSpacing: "1.5px",
              marginBottom: "8px",
              marginLeft: "2px",
            }}
          >
            {project.category}
          </div>

          {/* Status + last updated */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
              marginLeft: "2px",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: "0.6rem",
                letterSpacing: "1px",
                color: sc.color,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ textShadow: `0 0 6px ${sc.color}` }}>
                {sc.sym}
              </span>
              {project.status}
            </div>
            {project.lastUpdated && (
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: "0.55rem",
                  color: "rgba(0,255,170,0.4)",
                  letterSpacing: "1px",
                }}
              >
                {relativeTime(project.lastUpdated)}
              </div>
            )}
          </div>

          {/* D. Tagline */}
          <div
            style={{
              fontFamily: MONO,
              fontSize: "0.78rem",
              color: "rgba(0,255,170,0.65)",
              lineHeight: 1.5,
              marginBottom: "20px",
            }}
          >
            {project.tagline}
          </div>

          {/* E. Progress bar */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
                fontFamily: MONO,
                fontSize: "0.55rem",
                color: "rgba(0,255,170,0.4)",
                letterSpacing: "1px",
              }}
            >
              <span>COMPLETION</span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: project.accent,
                  fontWeight: "bold",
                  textShadow: `0 0 6px rgba(${rgb},0.3)`,
                }}
              >
                {project.phase}%
              </span>
            </div>
            <div
              style={{
                height: "4px",
                background: "rgba(0,255,170,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${project.phase}%`,
                  background: project.accent,
                  boxShadow: `0 0 12px ${project.accent}, 0 0 4px ${project.accent}`,
                  transition: "width 1s ease",
                }}
              />
            </div>
          </div>

          {/* F. Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
              marginBottom: "20px",
            }}
          >
            {project.stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(0,255,170,0.03)",
                  border: "1px solid rgba(0,255,170,0.1)",
                  padding: "8px 10px",
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.55rem",
                    color: "rgba(0,255,170,0.45)",
                    letterSpacing: "1px",
                    marginBottom: "3px",
                  }}
                >
                  {stat.label.toUpperCase()}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.9rem",
                    color: project.accent,
                    fontWeight: "bold",
                    textShadow: `0 0 6px rgba(${rgb},0.2)`,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* G. Description */}
          <div
            style={{
              fontFamily: MONO,
              fontSize: "0.72rem",
              color: "rgba(0,255,170,0.6)",
              lineHeight: 1.7,
              marginBottom: "20px",
            }}
          >
            {project.description}
          </div>

          {/* H. Tech stack */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "24px",
            }}
          >
            {project.tech.map((t, i) => (
              <span
                key={i}
                style={{
                  fontFamily: MONO,
                  fontSize: "0.6rem",
                  color: project.accent,
                  border: `1px solid ${project.accent}50`,
                  padding: "4px 12px",
                  letterSpacing: "0.5px",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* I. Divider + footer */}
          <div
            style={{
              borderTop: "1px solid rgba(0,255,170,0.1)",
              paddingTop: "12px",
              textAlign: "center",
              fontFamily: MONO,
              fontSize: "0.55rem",
              color: "rgba(0,255,170,0.3)",
              letterSpacing: "1.5px",
            }}
          >
            {"\u2514\u2500 END DOSSIER \u2500\u2518"}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailPanel;
