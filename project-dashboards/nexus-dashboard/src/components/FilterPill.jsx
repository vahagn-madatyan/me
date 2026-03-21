const MONO = "'JetBrains Mono', monospace";

const FilterPill = ({ label, active, color, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 14px", fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "1.5px",
    color: active ? "#020402" : (color || "rgba(0,255,170,0.5)"),
    background: active ? (color || "#0fa") : "transparent",
    border: `1px solid ${active ? "transparent" : "rgba(0,255,170,0.15)"}`,
    cursor: "pointer", transition: "all 0.2s ease", textTransform: "uppercase",
  }}>
    {label}
  </button>
);

export default FilterPill;
