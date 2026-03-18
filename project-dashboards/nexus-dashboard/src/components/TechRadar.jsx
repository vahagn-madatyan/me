import { useState, useEffect, useRef, useCallback } from "react";

const MONO = "'JetBrains Mono', 'Fira Code', monospace";

const RINGS = [
  { name: "CORE", radiusFrac: 0.18 },
  { name: "PRIMARY", radiusFrac: 0.36 },
  { name: "SUPPORTING", radiusFrac: 0.56 },
  { name: "EXPLORING", radiusFrac: 0.78 },
];

const SECTORS = [
  { name: "LANGUAGES", startAngle: -Math.PI / 2, endAngle: -Math.PI / 2 + (2 * Math.PI) / 5 },
  { name: "INFRASTRUCTURE", startAngle: -Math.PI / 2 + (2 * Math.PI) / 5, endAngle: -Math.PI / 2 + (4 * Math.PI) / 5 },
  { name: "DATA", startAngle: -Math.PI / 2 + (4 * Math.PI) / 5, endAngle: -Math.PI / 2 + (6 * Math.PI) / 5 },
  { name: "APIs", startAngle: -Math.PI / 2 + (6 * Math.PI) / 5, endAngle: -Math.PI / 2 + (8 * Math.PI) / 5 },
  { name: "AI/ML", startAngle: -Math.PI / 2 + (8 * Math.PI) / 5, endAngle: -Math.PI / 2 + (10 * Math.PI) / 5 },
];

const TECH_DATA = [
  // CORE (5+ projects)
  { name: "Python", count: 10, ring: 0, sector: 0 },
  { name: "Docker", count: 6, ring: 0, sector: 1 },
  { name: "MCP Protocol", count: 5, ring: 0, sector: 3 },
  { name: "FastMCP", count: 4, ring: 0, sector: 3 },
  // PRIMARY (3-4 projects)
  { name: "React", count: 4, ring: 1, sector: 0 },
  { name: "LangGraph", count: 3, ring: 1, sector: 4 },
  { name: "PostgreSQL", count: 3, ring: 1, sector: 2 },
  { name: "Alpaca", count: 3, ring: 1, sector: 3 },
  // SUPPORTING (2 projects)
  { name: "TypeScript", count: 2, ring: 2, sector: 0 },
  { name: "FastAPI", count: 2, ring: 2, sector: 3 },
  { name: "ClickHouse", count: 2, ring: 2, sector: 2 },
  { name: "Finnhub", count: 2, ring: 2, sector: 3 },
  { name: "Node.js", count: 2, ring: 2, sector: 0 },
  // EXPLORING (1 project)
  { name: "Zabbix", count: 1, ring: 3, sector: 1 },
  { name: "LiteLLM", count: 1, ring: 3, sector: 4 },
  { name: "AWS Bedrock", count: 1, ring: 3, sector: 4 },
  { name: "Massive.com", count: 1, ring: 3, sector: 3 },
  { name: "Tailscale", count: 1, ring: 3, sector: 1 },
  { name: "tmux", count: 1, ring: 3, sector: 1 },
  { name: "TimescaleDB", count: 1, ring: 3, sector: 2 },
];

function computeTechPositions(cx, cy, maxR) {
  const sectorSlice = (2 * Math.PI) / 5;

  // Group techs by ring+sector so we can offset duplicates
  const groups = {};
  TECH_DATA.forEach((t) => {
    const key = `${t.ring}-${t.sector}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  const positions = [];
  Object.values(groups).forEach((group) => {
    const count = group.length;
    group.forEach((tech, idx) => {
      const ring = RINGS[tech.ring];
      const sector = SECTORS[tech.sector];
      const sectorMid = sector.startAngle + sectorSlice / 2;

      // Spread items within sector: distribute evenly with padding
      let angleOffset = 0;
      if (count > 1) {
        const spread = sectorSlice * 0.5;
        angleOffset = -spread / 2 + (spread / (count - 1)) * idx;
      }
      const angle = sectorMid + angleOffset;

      // Slight radial jitter for visual interest
      const radialJitter = (Math.sin(idx * 2.7 + tech.ring * 1.3) * 0.03) * maxR;
      const r = ring.radiusFrac * maxR + radialJitter;

      positions.push({
        ...tech,
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        angle,
        r,
      });
    });
  });

  return positions;
}

const TechRadar = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [tooltip, setTooltip] = useState(null);
  const [canvasSize, setCanvasSize] = useState(400);
  const positionsRef = useRef([]);

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setCanvasSize(Math.min(400, w - 16));
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Recompute positions when canvasSize changes
  useEffect(() => {
    const cx = canvasSize / 2;
    const cy = canvasSize / 2;
    const maxR = canvasSize / 2 - 20;
    positionsRef.current = computeTechPositions(cx, cy, maxR);
  }, [canvasSize]);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    mouseRef.current = { x: mx, y: my };

    // Hit test
    let found = null;
    const hitRadius = 14;
    for (const p of positionsRef.current) {
      const dx = mx - p.x;
      const dy = my - p.y;
      if (dx * dx + dy * dy < hitRadius * hitRadius) {
        found = p;
        break;
      }
    }

    if (found) {
      setTooltip({
        name: found.name,
        count: found.count,
        ring: RINGS[found.ring].name,
        left: e.clientX,
        top: e.clientY,
      });
    } else {
      setTooltip(null);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
    setTooltip(null);
  }, []);

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvasSize;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = size / 2 - 20;
    const sectorSlice = (2 * Math.PI) / 5;
    const sweepPeriod = 10000; // 10 seconds per revolution

    let startTime = performance.now();

    function draw(now) {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, size, size);

      // --- Draw rings ---
      ctx.strokeStyle = "rgba(0,255,170,0.06)";
      ctx.lineWidth = 1;
      RINGS.forEach((ring) => {
        const r = ring.radiusFrac * maxR;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Outer boundary ring
      ctx.strokeStyle = "rgba(0,255,170,0.08)";
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.stroke();

      // --- Draw sector lines ---
      ctx.strokeStyle = "rgba(0,255,170,0.04)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + i * sectorSlice;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
        ctx.stroke();
      }

      // --- Ring labels (right side) ---
      ctx.font = `${Math.max(7, size * 0.022)}px ${MONO}`;
      ctx.fillStyle = "rgba(0,255,170,0.15)";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      RINGS.forEach((ring) => {
        const r = ring.radiusFrac * maxR;
        ctx.fillText(ring.name, cx + r + 4, cy - 2);
      });

      // --- Sector labels (outer edge) ---
      ctx.font = `bold ${Math.max(8, size * 0.025)}px ${MONO}`;
      ctx.fillStyle = "rgba(0,255,170,0.2)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      SECTORS.forEach((sector, i) => {
        const midAngle = -Math.PI / 2 + i * sectorSlice + sectorSlice / 2;
        const labelR = maxR + 12;
        const lx = cx + labelR * Math.cos(midAngle);
        const ly = cy + labelR * Math.sin(midAngle);
        ctx.fillText(sector.name, lx, ly);
      });

      // --- Sweep line ---
      const sweepAngle = -Math.PI / 2 + ((elapsed % sweepPeriod) / sweepPeriod) * Math.PI * 2;
      const grad = ctx.createLinearGradient(
        cx, cy,
        cx + maxR * Math.cos(sweepAngle),
        cy + maxR * Math.sin(sweepAngle)
      );
      grad.addColorStop(0, "rgba(0,255,170,0.0)");
      grad.addColorStop(0.5, "rgba(0,255,170,0.08)");
      grad.addColorStop(1, "rgba(0,255,170,0.02)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxR * Math.cos(sweepAngle), cy + maxR * Math.sin(sweepAngle));
      ctx.stroke();

      // Sweep wedge (trailing glow)
      const wedgeSpan = 0.15; // radians
      const wedgeGrad = ctx.createConicGradient(sweepAngle - wedgeSpan, cx, cy);
      wedgeGrad.addColorStop(0, "rgba(0,255,170,0.0)");
      wedgeGrad.addColorStop(wedgeSpan / (2 * Math.PI), "rgba(0,255,170,0.04)");
      wedgeGrad.addColorStop((wedgeSpan * 2) / (2 * Math.PI), "rgba(0,255,170,0.0)");
      wedgeGrad.addColorStop(1, "rgba(0,255,170,0.0)");
      ctx.fillStyle = wedgeGrad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, sweepAngle - wedgeSpan, sweepAngle);
      ctx.closePath();
      ctx.fill();

      // --- Tech dots ---
      const positions = positionsRef.current;
      const { x: mx, y: my } = mouseRef.current;

      positions.forEach((tech, i) => {
        // Pulsing size: sin wave with per-dot offset
        const pulse = Math.sin(elapsed * 0.002 + i * 0.7) * 0.5 + 0.5; // 0..1
        const baseSize = 2.5 + tech.count * 0.4;
        const dotR = baseSize + pulse * 1.5;

        // Alpha: 0.3-0.7 based on count
        const alpha = 0.3 + (tech.count / 10) * 0.4;

        // Hover detection
        const dx = mx - tech.x;
        const dy = my - tech.y;
        const hovered = dx * dx + dy * dy < 14 * 14;

        // Glow for hovered dot
        if (hovered) {
          ctx.shadowColor = "rgba(0,255,170,0.6)";
          ctx.shadowBlur = 12;
        }

        ctx.beginPath();
        ctx.arc(tech.x, tech.y, dotR, 0, Math.PI * 2);
        ctx.fillStyle = hovered
          ? `rgba(0,255,170,0.9)`
          : `rgba(0,255,170,${alpha})`;
        ctx.fill();

        // Reset shadow
        if (hovered) {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }

        // Outer ring on core dots
        if (tech.ring === 0) {
          ctx.beginPath();
          ctx.arc(tech.x, tech.y, dotR + 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,255,170,${0.1 + pulse * 0.1})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // --- Center dot ---
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,255,170,0.3)";
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [canvasSize]);

  return (
    <div
      ref={containerRef}
      style={{
        borderTop: "1px solid rgba(0,255,170,0.06)",
        paddingTop: "30px",
        marginBottom: "30px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontFamily: MONO,
          fontSize: "0.5rem",
          color: "rgba(0,255,170,0.3)",
          letterSpacing: "4px",
        }}
      >
        ─── TECH STACK RADAR ───
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            width: canvasSize,
            height: canvasSize,
            cursor: tooltip ? "crosshair" : "default",
          }}
        />

        {/* Tooltip overlay */}
        {tooltip && (
          <div
            style={{
              position: "fixed",
              left: tooltip.left + 14,
              top: tooltip.top - 30,
              padding: "5px 10px",
              background: "rgba(2,4,2,0.92)",
              border: "1px solid rgba(0,255,170,0.25)",
              fontFamily: MONO,
              fontSize: "0.55rem",
              color: "#0fa",
              letterSpacing: "1px",
              pointerEvents: "none",
              zIndex: 100,
              whiteSpace: "nowrap",
              boxShadow: "0 0 12px rgba(0,255,170,0.1)",
            }}
          >
            <span style={{ fontWeight: "bold" }}>{tooltip.name}</span>
            <span style={{ color: "rgba(0,255,170,0.4)", marginLeft: "8px" }}>
              {tooltip.count} project{tooltip.count !== 1 ? "s" : ""}
            </span>
            <span
              style={{
                display: "block",
                fontSize: "0.4rem",
                color: "rgba(0,255,170,0.2)",
                marginTop: "2px",
              }}
            >
              {tooltip.ring}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechRadar;
