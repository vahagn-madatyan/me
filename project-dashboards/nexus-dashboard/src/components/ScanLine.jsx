const ScanLine = () => (
  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
    <div style={{
      position: "absolute", left: 0, right: 0, height: "2px",
      background: "linear-gradient(90deg, transparent 5%, rgba(0,255,170,0.07) 50%, transparent 95%)",
      animation: "scanDown 8s linear infinite",
    }} />
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
    }} />
  </div>
);

export default ScanLine;
