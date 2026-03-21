import { hexToRgb } from "../utils/hexToRgb";
import { relativeTime } from "../utils/relativeTime";

const MONO = "'JetBrains Mono', 'Fira Code', monospace";

const ActiveOpsStrip = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div
      style={{
        borderBottom: "1px solid rgba(0,255,170,0.12)",
        paddingBottom: "14px",
        marginBottom: "16px",
      }}
    >
      {/* Section header */}
      <div
        style={{
          fontFamily: MONO,
          fontSize: "0.55rem",
          color: "rgba(0,255,170,0.45)",
          letterSpacing: "3px",
          marginBottom: "10px",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        ─── ACTIVE OPS ───
      </div>

      {/* Cards row */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              flex: "1 1 0",
              minWidth: "220px",
              background: "rgba(6,12,6,0.95)",
              border: "1px solid rgba(0,255,170,0.12)",
              padding: "10px 16px",
              position: "relative",
              backdropFilter: "blur(8px)",
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
                background: `linear-gradient(90deg, transparent, ${project.accent}40, transparent)`,
              }}
            />

            {/* Main row: icon, name, live dot, timestamp */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "0.9rem", lineHeight: 1 }}>
                {project.icon}
              </span>

              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  color: project.accent,
                  letterSpacing: "2px",
                  textShadow: `0 0 8px rgba(${hexToRgb(project.accent)},0.3)`,
                  whiteSpace: "nowrap",
                }}
              >
                {project.name}
              </span>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Pulsing live dot */}
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#0fa",
                  boxShadow: "0 0 6px #0fa",
                  display: "inline-block",
                  animation: "livePulse 2s ease infinite",
                  flexShrink: 0,
                }}
              />

              {/* Relative timestamp */}
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.55rem",
                  color: "rgba(0,255,170,0.5)",
                  letterSpacing: "1px",
                  whiteSpace: "nowrap",
                }}
              >
                {relativeTime(project.lastUpdated)}
              </span>
            </div>

            {/* Phase percentage + status */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.55rem",
                  color: "rgba(0,255,170,0.4)",
                  letterSpacing: "1px",
                }}
              >
                {project.status}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.6rem",
                  color: project.accent,
                  fontWeight: "bold",
                }}
              >
                {project.phase}%
              </span>
            </div>

            {/* Micro progress bar */}
            <div
              style={{
                width: "100%",
                height: "3px",
                background: "rgba(0,255,170,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${project.phase}%`,
                  background: project.accent,
                  boxShadow: `0 0 8px ${project.accent}`,
                  transition: "width 1s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveOpsStrip;
