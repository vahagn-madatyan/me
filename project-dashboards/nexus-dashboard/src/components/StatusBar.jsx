import { projects, statusConfig } from "../data/projects";
import { hexToRgb } from "../utils/hexToRgb";

const fontFamily = "'JetBrains Mono', 'Fira Code', monospace";

const StatusBar = ({ activeStatus, onStatusClick }) => {
  const counts = {};
  for (const p of projects) {
    counts[p.status] = (counts[p.status] || 0) + 1;
  }

  const statuses = Object.keys(statusConfig).filter((s) => counts[s]);

  const handleClick = (status) => {
    onStatusClick(status === activeStatus ? null : status);
  };

  return (
    <div
      style={{
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: "1px solid rgba(0,255,170,0.1)",
      }}
    >
      {/* Stacked bar */}
      <div style={{ display: "flex", height: 6 }}>
        {statuses.map((status) => {
          const { color } = statusConfig[status];
          const isActive = activeStatus === status;
          const rgb = hexToRgb(color);
          return (
            <div
              key={status}
              onClick={() => handleClick(status)}
              style={{
                flex: counts[status],
                backgroundColor: color,
                boxShadow: isActive
                  ? `0 0 8px ${color}, 0 0 4px ${color}`
                  : `0 0 4px ${color}`,
                opacity: isActive || !activeStatus ? 1 : 0.4,
                cursor: "pointer",
                transition: "opacity 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.boxShadow = `0 0 8px ${color}, 0 0 4px ${color}`;
              }}
              onMouseLeave={(e) => {
                const shouldDim = activeStatus && activeStatus !== status;
                e.currentTarget.style.opacity = shouldDim ? "0.4" : "1";
                e.currentTarget.style.boxShadow = isActive
                  ? `0 0 8px ${color}, 0 0 4px ${color}`
                  : `0 0 4px ${color}`;
              }}
            />
          );
        })}
      </div>

      {/* Labels */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 8,
          flexWrap: "wrap",
        }}
      >
        {statuses.map((status) => {
          const { color, sym } = statusConfig[status];
          const isActive = activeStatus === status;
          return (
            <div
              key={status}
              onClick={() => handleClick(status)}
              style={{
                fontFamily,
                fontSize: "0.55rem",
                color,
                opacity: !activeStatus || isActive ? 1 : 0.5,
                cursor: "pointer",
                transition: "opacity 0.2s",
                userSelect: "none",
                letterSpacing: "0.05em",
              }}
            >
              {sym} {counts[status]} {status}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusBar;
