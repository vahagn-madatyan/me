import { useEffect, useRef } from "react";

const MatrixCanvas = ({ dimmed }) => {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const dropsRef = useRef([]);
  const nodesRef = useRef([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const pulseRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン{}[]<>/\\|=+-*&^%$#@!".split("");
    const COL_W = 18;
    const NODE_COUNT = 50;
    const CONNECT_DIST = 160;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const cols = Math.ceil(w / COL_W);
      while (dropsRef.current.length < cols) {
        dropsRef.current.push({ y: Math.random() * h, speed: 0.3 + Math.random() * 1.2, chars: [] });
      }
      dropsRef.current.length = cols;
    };

    const initNodes = () => {
      if (nodesRef.current.length > 0) return;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.5,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    resize();
    initNodes();

    const handleResize = () => resize();
    const handleMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);

    const draw = () => {
      ctx.fillStyle = "rgba(2,4,2,0.12)";
      ctx.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const nodes = nodesRef.current;

      ctx.font = "13px 'JetBrains Mono', monospace";
      for (let i = 0; i < dropsRef.current.length; i++) {
        const drop = dropsRef.current[i];
        const x = i * COL_W;
        const ch = chars[Math.floor(Math.random() * chars.length)];

        ctx.fillStyle = `rgba(0,255,170,${0.7 + Math.random() * 0.3})`;
        ctx.fillText(ch, x, drop.y);

        for (let t = 1; t < 6; t++) {
          const ty = drop.y - t * 16;
          if (ty > 0) {
            const tc = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = `rgba(0,255,170,${0.15 - t * 0.02})`;
            ctx.fillText(tc, x, ty);
          }
        }

        drop.y += drop.speed * 2;
        if (drop.y > h + 20) {
          drop.y = -20;
          drop.speed = 0.3 + Math.random() * 1.2;
        }
      }

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dx = mx - n.x, dy = my - n.y;
        const md = Math.hypot(dx, dy);
        if (md < 200 && md > 0) {
          n.vx += (dx / md) * 0.0002 * (200 - md);
          n.vy += (dy / md) * 0.0002 * (200 - md);
        }
        n.vx *= 0.998;
        n.vy *= 0.998;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,255,170,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      if (pulseRef.current.length < 8 && Math.random() < 0.04) {
        const i = Math.floor(Math.random() * nodes.length);
        let best = null, bestD = Infinity;
        for (let j = 0; j < nodes.length; j++) {
          if (j === i) continue;
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < CONNECT_DIST && d < bestD) { bestD = d; best = j; }
        }
        if (best !== null) pulseRef.current.push({ from: i, to: best, t: 0 });
      }
      for (let p = pulseRef.current.length - 1; p >= 0; p--) {
        const pulse = pulseRef.current[p];
        pulse.t += 0.03;
        if (pulse.t >= 1) { pulseRef.current.splice(p, 1); continue; }
        const a = nodes[pulse.from], b = nodes[pulse.to];
        const px = a.x + (b.x - a.x) * pulse.t;
        const py = a.y + (b.y - a.y) * pulse.t;
        const g = ctx.createRadialGradient(px, py, 0, px, py, 6);
        g.addColorStop(0, "rgba(0,255,170,0.6)");
        g.addColorStop(1, "rgba(0,255,170,0)");
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      for (const n of nodes) {
        const a = 0.3 + Math.sin(n.pulse) * 0.2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,170,${a})`;
        ctx.fill();
      }

      if (mx > 0 && my > 0) {
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 100);
        mg.addColorStop(0, "rgba(0,255,170,0.04)");
        mg.addColorStop(1, "rgba(0,255,170,0)");
        ctx.beginPath();
        ctx.arc(mx, my, 100, 0, Math.PI * 2);
        ctx.fillStyle = mg;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    ctx.fillStyle = "#020402";
    ctx.fillRect(0, 0, w, h);
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0,
      opacity: dimmed ? 0.25 : 0.7,
      transition: "opacity 1s ease",
    }} />
  );
};

export default MatrixCanvas;
