const MONO = "'JetBrains Mono', monospace";

const FilterPill = ({ label, active, color, onClick }) => (
  <button onClick={onClick} style={{
    padding: "4px 12px", fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "1.5px",
    color: active ? "#020402" : (color || "rgba(0,255,170,0.35)"),
    background: active ? (color || "#0fa") : "transparent",
    border: `1px solid ${active ? "transparent" : "rgba(0,255,170,0.1)"}`,
    cursor: "pointer", transition: "all 0.2s ease", textTransform: "uppercase",
  }}>
    {label}
  </button>
);

export default FilterPill;
