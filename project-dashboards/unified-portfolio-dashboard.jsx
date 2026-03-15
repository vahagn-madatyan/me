import { useState, useEffect, useRef, useCallback } from "react";

// ─── PROJECT DATA ──────────────────────────────────────────────
const projects = [
  {
    id: "zephron", name: "ZEPHRON", tagline: "Autonomous NetSec Platform", category: "CYBERSECURITY", accent: "#0fa",
    description: "Full-stack network security platform with autonomous AI agents. Pure Python + Docker Compose architecture with Zabbix observability, LangGraph orchestration, and GitLab-style open-core licensing.",
    stats: [{ label: "Skills", value: "120+" }, { label: "MCP Servers", value: "52" }, { label: "Zabbix Tools", value: "40+" }, { label: "Dev Weeks", value: "22" }],
    tech: ["Python", "Docker Compose", "Zabbix", "LangGraph", "FastMCP", "ClickHouse"], status: "IN DEVELOPMENT", phase: 65, icon: "🛡️",
  },
  {
    id: "0xpwn", name: "0xPWN", tagline: "Autonomous AI Pentesting Agent", category: "OFFENSIVE SECURITY", accent: "#f33",
    description: "ReAct-based multi-agent pentesting system with Docker sandbox (Kali Linux), 5-phase attack pipeline, tiered permissions, and budget controls. Fork of Strix with 35+ enhancement gaps identified.",
    stats: [{ label: "Security Tools", value: "25+" }, { label: "LLM Providers", value: "100+" }, { label: "Vuln Classes", value: "40+" }, { label: "Gap Items", value: "35+" }],
    tech: ["Python", "LiteLLM", "Docker", "Kali Linux", "MCP Protocol", "Apache 2.0"], status: "PLANNING", phase: 30, icon: "💀",
  },
  {
    id: "policyfoundry", name: "POLICYFOUNDRY", tagline: "AI Firewall Policy Manager", category: "NETWORK SECURITY", accent: "#f80",
    description: "LangGraph + Deep Agents architecture for autonomous firewall policy management. Vector log ingestion, ClickHouse/DuckDB storage, 6 vendor adapters, graduated autonomy across 4 phases.",
    stats: [{ label: "Vendor Adapters", value: "6" }, { label: "Autonomy Phases", value: "4" }, { label: "License", value: "BSL 1.1" }, { label: "Storage", value: "2 DBs" }],
    tech: ["Python", "LangGraph", "AWS Bedrock", "ClickHouse", "DuckDB", "TypeScript"], status: "ARCHITECTURE", phase: 40, icon: "🔥",
  },
  {
    id: "zscaler-mcp", name: "ZSCALER MCP", tagline: "Complete Zscaler MCP Server", category: "CLOUD SECURITY", accent: "#08f",
    description: "Comprehensive MCP server covering all 8 Zscaler products — ZIA, ZPA, Z-Insights, ZDX, ZTW, ZEASM, ZCC, and ZIdentity. ~188 tools with Railway as primary deployment target.",
    stats: [{ label: "Total Tools", value: "~188" }, { label: "Products", value: "8" }, { label: "ZIA Tools", value: "~60" }, { label: "ZPA Tools", value: "~60" }],
    tech: ["Python", "FastMCP", "Railway", "Docker", "Zscaler SDK", "SSE Transport"], status: "IN DEVELOPMENT", phase: 55, icon: "☁️",
  },
  {
    id: "network-mcps", name: "NETWORK MCPs", tagline: "Multi-Vendor MCP Servers", category: "NETWORK AUTOMATION", accent: "#0fa",
    description: "MCP server blueprint for Prisma Access (zero servers exist — highest value gap), Cisco Meraki (4+ community), and Juniper Mist (2 early-stage). Four-layer write safety model.",
    stats: [{ label: "Vendors", value: "3" }, { label: "Safety Layers", value: "4" }, { label: "Prisma Gap", value: "100%" }, { label: "Pattern", value: "FastMCP" }],
    tech: ["Python", "FastMCP", "Prisma SDK", "Meraki SDK", "Mist SDK", "Docker"], status: "RESEARCH", phase: 25, icon: "🌐",
  },
  {
    id: "netsec-skills", name: "NETSEC SKILLS", tagline: "AI Agent Skills Library", category: "AI INFRASTRUCTURE", accent: "#0fa",
    description: "Dual-layer architecture: SKILL.md for knowledge + MCP servers for execution. 6+ security domains, 20+ agent framework compatibility, 3 safety tiers. Monorepo with pnpm workspaces + Changesets.",
    stats: [{ label: "Skills", value: "120+" }, { label: "Domains", value: "6+" }, { label: "Frameworks", value: "20+" }, { label: "Safety Tiers", value: "3" }],
    tech: ["TypeScript", "Python", "pnpm", "Changesets", "SKILL.md", "MCP"], status: "ARCHITECTURE", phase: 35, icon: "🧠",
  },
  {
    id: "repoforge", name: "REPOFORGE", tagline: "Guided Repo Bootstrapper", category: "DEVELOPER TOOLS", accent: "#08f",
    description: "Open-source CLI + Cloud SaaS for guided repository bootstrapping. Python/FastAPI backend, Copier template engine, GitHub App integration. Freemium model targeting $16.8M ARR.",
    stats: [{ label: "Target ARR", value: "$16.8M" }, { label: "Free Tier", value: "$0" }, { label: "Pro Tier", value: "$39/mo" }, { label: "Templates", value: "∞" }],
    tech: ["Python", "FastAPI", "Copier", "GitHub Apps", "React", "PostgreSQL"], status: "IN DEVELOPMENT", phase: 45, icon: "⚡",
  },
  {
    id: "strat-trading", name: "STRAT TRADING", tagline: "AI-Powered Trading System", category: "FINTECH", accent: "#0fa",
    description: "8-layer automated trading architecture using The Strat methodology (candle pattern classification). AI-driven signal generation, multi-layer risk management, and real-time execution via Alpaca.",
    stats: [{ label: "Architecture", value: "8 Layers" }, { label: "Monthly Cost", value: "$41-120" }, { label: "Data Source", value: "Polygon" }, { label: "Broker", value: "Alpaca" }],
    tech: ["Python", "Polygon.io", "Alpaca", "Lumibot", "TimescaleDB", "GPT-4"], status: "ARCHITECTURE", phase: 30, icon: "📈",
  },
  {
    id: "wheeely", name: "WHEEELY", tagline: "Options Wheel Strategy Engine", category: "FINTECH", accent: "#f80",
    description: "Python CLI for automated options wheel strategy — sell puts, get assigned, sell covered calls, repeat. Multi-stage screening pipeline with staged filters (cheap Alpaca filters first, then Finnhub fundamentals). BYOK SaaS expansion planned with FMP and ORATS premium data.",
    stats: [{ label: "CLI Commands", value: "3" }, { label: "Pipeline", value: "5 Stages" }, { label: "Broker", value: "Alpaca" }, { label: "Model", value: "BYOK SaaS" }],
    tech: ["Python", "Alpaca", "Finnhub", "FMP", "ORATS", "Rich CLI"], status: "IN DEVELOPMENT", phase: 60, icon: "🎰",
  },
  {
    id: "wheel-it-screenr", name: "WHEEL-IT SCREENR", tagline: "Options Screener & Chain Analyzer", category: "FINTECH", accent: "#f33",
    description: "Web dashboard for wheel strategy screening. Real-time option chain analysis with put scoring (spread quality, liquidity, premium yield, delta sweet spot, IV level). Filter presets (Finviz Cut 2, Conservative, Aggressive), sector exclusions, and score tooltips with sub-component breakdowns.",
    stats: [{ label: "Score Weights", value: "5" }, { label: "Presets", value: "3" }, { label: "Chain Data", value: "Massive" }, { label: "Filters", value: "12+" }],
    tech: ["JavaScript", "Massive.com", "Alpaca", "Finnhub", "HTML/CSS", "Rich Tables"], status: "IN DEVELOPMENT", phase: 50, icon: "📊",
  },
  {
    id: "ai-bazar", name: "AI BAZAR", tagline: "AI M&A Marketplace", category: "MARKETPLACE", accent: "#08f",
    description: "Full-stack AI M&A marketplace with 6 architecture layers. Features buyer/seller portals, virtual deal rooms, escrow services, ML-powered matching, and AI-driven valuation engine.",
    stats: [{ label: "Arch Layers", value: "6" }, { label: "AI Engine", value: "Due Diligence" }, { label: "Matching", value: "ML-Powered" }, { label: "Module", value: "Acqui-Hire" }],
    tech: ["React", "Node.js", "Python", "PostgreSQL", "Redis", "ML Pipeline"], status: "PLANNING", phase: 20, icon: "🏪",
  },
  {
    id: "echelon", name: "ECHELON", tagline: "AI Real Estate Operations", category: "PROPTECH", accent: "#f80",
    description: "AI operations team for real estate agencies. Specialized agents like Scout (lead response <60s vs industry 15+ hrs). Deep MLS/CRM integrations with flat monthly pricing.",
    stats: [{ label: "Response Time", value: "<60s" }, { label: "Industry Avg", value: "15+ hrs" }, { label: "Lead Agent", value: "Scout" }, { label: "Pricing", value: "Flat/mo" }],
    tech: ["Python", "LangChain", "MLS API", "CRM APIs", "Twilio", "React"], status: "PLANNING", phase: 25, icon: "🏠",
  },
  {
    id: "lumon", name: "LUMON", tagline: "AI Coding Agent Orchestration", category: "DEVELOPER TOOLS", accent: "#0fa",
    description: "Mission Control dashboard for orchestrating multiple AI coding agents (Claude Code, Codex CLI) in parallel. React UI with xterm.js terminals, tmux bridge for session management, wave scheduler, Git worktree isolation per agent, and Tailscale-based remote access with MagicDNS.",
    stats: [{ label: "Agent Types", value: "2" }, { label: "Bridges", value: "tmux + GSD" }, { label: "DB", value: "SQLite" }, { label: "Access", value: "Tailscale" }],
    tech: ["Node.js", "React", "xterm.js", "tmux", "SQLite", "Tailscale", "WebSocket"], status: "IN DEVELOPMENT", phase: 55, icon: "🎛️",
  },
  {
    id: "cyber-research", name: "CYBER RESEARCH", tagline: "Agentic AI Market Intelligence", category: "RESEARCH", accent: "#0fa",
    description: "Deep market research across 10 cybersecurity problem areas. SOC Automation ranked #1. Covers Vuln Management, Auto Pentesting, CSPM, Identity Security, Supply Chain, and more.",
    stats: [{ label: "Problem Areas", value: "10" }, { label: "Total VC", value: "$6.3B+" }, { label: "Top Area", value: "SOC Auto" }, { label: "Coverage", value: "Full Stack" }],
    tech: ["Market Analysis", "VC Data", "Competitive Intel", "Radar Charts", "Bubble Maps"], status: "COMPLETE", phase: 100, icon: "🔬",
  },
];

const categoryColors = {
  CYBERSECURITY: "#0fa", "OFFENSIVE SECURITY": "#f33", "NETWORK SECURITY": "#f80",
  "CLOUD SECURITY": "#08f", "NETWORK AUTOMATION": "#0fa", "AI INFRASTRUCTURE": "#0fa",
  "DEVELOPER TOOLS": "#08f", FINTECH: "#0fa", MARKETPLACE: "#08f",
  PROPTECH: "#f80", RESEARCH: "#0fa",
};

const statusConfig = {
  COMPLETE: { color: "#0fa", sym: "●" },
  "IN DEVELOPMENT": { color: "#08f", sym: "◉" },
  ARCHITECTURE: { color: "#f80", sym: "◎" },
  PLANNING: { color: "#f33", sym: "○" },
  RESEARCH: { color: "#888", sym: "◌" },
};

function hexToRgb(hex) {
  const c = hex.replace("#","");
  const full = c.length === 3 ? c.split("").map(x=>x+x).join("") : c;
  return `${parseInt(full.slice(0,2),16)},${parseInt(full.slice(2,4),16)},${parseInt(full.slice(4,6),16)}`;
}

// ─── MATRIX RAIN CANVAS ───────────────────────────────────────
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
      // Fade trail
      ctx.fillStyle = "rgba(2,4,2,0.12)";
      ctx.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const nodes = nodesRef.current;

      // Matrix rain
      ctx.font = "13px 'JetBrains Mono', monospace";
      for (let i = 0; i < dropsRef.current.length; i++) {
        const drop = dropsRef.current[i];
        const x = i * COL_W;
        const ch = chars[Math.floor(Math.random() * chars.length)];

        // Head character (bright)
        ctx.fillStyle = `rgba(0,255,170,${0.7 + Math.random() * 0.3})`;
        ctx.fillText(ch, x, drop.y);

        // Trail chars (dimmer)
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

      // Update nodes
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

      // Draw connections
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

      // Fire pulses
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

      // Draw nodes
      for (const n of nodes) {
        const a = 0.3 + Math.sin(n.pulse) * 0.2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,170,${a})`;
        ctx.fill();
      }

      // Mouse glow
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

    // Initial fill
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

// ─── GLOBAL STYLES (injected once) ────────────────────────────
const GlobalStyles = () => {
  useEffect(() => {
    if (document.getElementById("hk-styles")) return;
    const s = document.createElement("style");
    s.id = "hk-styles";
    s.textContent = `
      @keyframes glitch1 {
        0%,88%,100% { clip-path: inset(0 0 0 0); transform: translate(0); }
        90% { clip-path: inset(15% 0 60% 0); transform: translate(-4px, 1px); }
        92% { clip-path: inset(55% 0 10% 0); transform: translate(4px, -2px); }
        94% { clip-path: inset(30% 0 40% 0); transform: translate(-2px, 2px); }
        96% { clip-path: inset(70% 0 5% 0); transform: translate(3px, -1px); }
      }
      @keyframes glitch2 {
        0%,88%,100% { clip-path: inset(0 0 0 0); transform: translate(0); opacity: 0.5; }
        89% { clip-path: inset(45% 0 20% 0); transform: translate(5px, -1px); opacity: 0.8; }
        91% { clip-path: inset(5% 0 55% 0); transform: translate(-5px, 2px); opacity: 0.4; }
        95% { clip-path: inset(65% 0 5% 0); transform: translate(3px, 0px); opacity: 0.7; }
      }
      @keyframes scanDown {
        0% { top: -2px; }
        100% { top: 100%; }
      }
      @keyframes flicker {
        0%,97%,100% { opacity: 1; }
        98% { opacity: 0.85; }
        99% { opacity: 0.95; }
      }
      @keyframes blink {
        0%,100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes borderPulse {
        0%,100% { border-color: rgba(0,255,170,0.25); }
        50% { border-color: rgba(0,255,170,0.5); }
      }
      @keyframes warpIn {
        0% { transform: scale(1.03); opacity: 0; filter: blur(4px); }
        100% { transform: scale(1); opacity: 1; filter: blur(0); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(s);
  }, []);
  return null;
};

// ─── SCAN LINE (single moving line) ───────────────────────────
const ScanLine = () => (
  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
    <div style={{
      position: "absolute", left: 0, right: 0, height: "2px",
      background: "linear-gradient(90deg, transparent 5%, rgba(0,255,170,0.07) 50%, transparent 95%)",
      animation: "scanDown 8s linear infinite",
    }} />
    {/* CRT vignette */}
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
    }} />
  </div>
);

// ─── LANDING PAGE ──────────────────────────────────────────────
const LandingPage = ({ onEnter }) => {
  const [phase, setPhase] = useState(0);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [typedText, setTypedText] = useState("");

  const tagline = "root@nexus:~# access --portfolio --clearance=GRANTED";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (phase < 1) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTypedText(tagline.slice(0, i));
      if (i >= tagline.length) clearInterval(iv);
    }, 25);
    return () => clearInterval(iv);
  }, [phase]);

  const mono = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";

  return (
    <div style={{
      position: "relative", zIndex: 2,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", padding: "40px 24px", textAlign: "center",
    }}>
      {/* Status line */}
      <div style={{
        position: "absolute", top: "20px", left: "24px", right: "24px",
        display: "flex", justifyContent: "space-between",
        fontSize: "0.5rem", fontFamily: mono, color: "rgba(0,255,170,0.2)", letterSpacing: "2px",
      }}>
        <span>SYS.NEURAL_MESH // ACTIVE</span>
        <span>ENCRYPTION: AES-256 // PROTOCOL: SSH-2</span>
      </div>

      {/* ASCII art style header */}
      <div style={{
        marginBottom: "8px",
        opacity: phase >= 0 ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>
        <pre style={{
          fontFamily: mono, fontSize: "clamp(0.35rem, 1vw, 0.55rem)",
          color: "rgba(0,255,170,0.3)", lineHeight: 1.2, margin: 0,
          letterSpacing: "1px",
        }}>{`
 ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗
 ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝
 ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║
 ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║
 ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║
 ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝`}</pre>
      </div>

      {/* Main title with glitch */}
      <div style={{ position: "relative", marginBottom: "12px" }}>
        <h1 style={{
          fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 900, fontFamily: mono,
          letterSpacing: "8px", margin: 0, lineHeight: 1, color: "#0fa",
          textShadow: "0 0 20px rgba(0,255,170,0.3), 0 0 60px rgba(0,255,170,0.1)",
          animation: "glitch1 5s infinite, flicker 4s infinite",
        }}>
          NEXUS
        </h1>
        <h1 aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, width: "100%",
          fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 900, fontFamily: mono,
          letterSpacing: "8px", margin: 0, lineHeight: 1, color: "#f33",
          textShadow: "0 0 20px rgba(255,51,51,0.3)",
          animation: "glitch2 5s infinite", pointerEvents: "none",
        }}>
          NEXUS
        </h1>
      </div>

      {/* Terminal typed tagline */}
      <div style={{
        height: "20px", marginBottom: "32px",
        opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.3s ease",
      }}>
        <span style={{
          fontFamily: mono, fontSize: "clamp(0.55rem, 1.2vw, 0.75rem)",
          color: "rgba(0,255,170,0.6)", letterSpacing: "1px",
        }}>
          {typedText}
          <span style={{ animation: "blink 0.8s step-end infinite" }}>█</span>
        </span>
      </div>

      {/* Info blocks */}
      <div style={{
        display: "flex", gap: "2px", marginBottom: "40px",
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.6s ease",
      }}>
        {[
          { val: "14", label: "NODES" },
          { val: "400+", label: "TOOLS" },
          { val: "120+", label: "SKILLS" },
          { val: "8", label: "SECTORS" },
        ].map((s, i) => (
          <div key={i} style={{
            padding: "12px 24px",
            background: "rgba(0,255,170,0.03)",
            border: "1px solid rgba(0,255,170,0.1)",
            borderLeft: i > 0 ? "none" : "1px solid rgba(0,255,170,0.1)",
          }}>
            <div style={{
              fontSize: "1.4rem", fontWeight: "bold", fontFamily: mono,
              color: "#0fa", textShadow: "0 0 10px rgba(0,255,170,0.3)",
            }}>{s.val}</div>
            <div style={{
              fontSize: "0.45rem", color: "rgba(0,255,170,0.35)",
              fontFamily: mono, letterSpacing: "2px", marginTop: "4px",
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Enter button */}
      <div style={{
        opacity: phase >= 3 ? 1 : 0,
        transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.6s ease",
      }}>
        <button
          onClick={onEnter}
          onMouseEnter={() => setHoverBtn(true)}
          onMouseLeave={() => setHoverBtn(false)}
          style={{
            padding: "14px 56px", fontSize: "0.75rem", fontFamily: mono,
            fontWeight: "bold", letterSpacing: "4px",
            color: hoverBtn ? "#020402" : "#0fa",
            background: hoverBtn ? "#0fa" : "transparent",
            border: "1px solid rgba(0,255,170,0.4)",
            cursor: "pointer",
            transition: "all 0.25s ease",
            animation: hoverBtn ? "none" : "borderPulse 2s ease infinite",
            textTransform: "uppercase",
          }}
        >
          {hoverBtn ? "[ ACCESSING ]" : "▸ VIEW PROJECTS"}
        </button>

        <div style={{
          marginTop: "24px", fontSize: "0.45rem", fontFamily: mono,
          color: "rgba(0,255,170,0.15)", letterSpacing: "2px",
        }}>
          CYBERSECURITY • FINTECH • AI AGENTS • DEVTOOLS • PROPTECH
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        position: "absolute", bottom: "20px", left: "24px", right: "24px",
        display: "flex", justifyContent: "space-between",
        fontSize: "0.45rem", fontFamily: mono, color: "rgba(0,255,170,0.12)", letterSpacing: "2px",
      }}>
        <span>V.MADATYAN // 2025-2026</span>
        <span>BUILDING AUTONOMOUS SECURITY & AI</span>
      </div>
    </div>
  );
};

// ─── PROJECT CARD ──────────────────────────────────────────────
const ProjectCard = ({ project, isExpanded, onClick, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const mono = "'JetBrains Mono', 'Fira Code', monospace";

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const sc = statusConfig[project.status] || { color: "#888", sym: "○" };

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
        padding: isExpanded ? "20px" : "16px",
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
            <span style={{
              fontFamily: mono, fontSize: "0.9rem", fontWeight: "bold",
              color: project.accent, textShadow: `0 0 8px rgba(${hexToRgb(project.accent)},0.3)`,
              letterSpacing: "2px",
            }}>
              {project.name}
            </span>
            <div style={{
              fontFamily: mono, fontSize: "0.5rem", color: "rgba(0,255,170,0.25)",
              letterSpacing: "1.5px", marginTop: "1px",
            }}>
              {project.category}
            </div>
          </div>
        </div>
        <div style={{
          fontFamily: mono, fontSize: "0.5rem", letterSpacing: "1px",
          color: sc.color, display: "flex", alignItems: "center", gap: "4px",
        }}>
          <span style={{ textShadow: `0 0 6px ${sc.color}` }}>{sc.sym}</span>
          {project.status}
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: mono, fontSize: "0.65rem", color: "rgba(0,255,170,0.45)",
        marginBottom: "12px", lineHeight: 1.4,
      }}>
        {project.tagline}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", marginBottom: "3px",
          fontFamily: mono, fontSize: "0.45rem", color: "rgba(0,255,170,0.2)", letterSpacing: "1px",
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginBottom: isExpanded ? "12px" : "8px" }}>
        {project.stats.map((stat, i) => (
          <div key={i} style={{
            background: "rgba(0,255,170,0.015)",
            border: "1px solid rgba(0,255,170,0.04)",
            padding: "6px 8px",
          }}>
            <div style={{
              fontFamily: mono, fontSize: "0.42rem", color: "rgba(0,255,170,0.25)",
              letterSpacing: "1px", marginBottom: "2px",
            }}>
              {stat.label.toUpperCase()}
            </div>
            <div style={{
              fontFamily: mono, fontSize: "0.75rem", color: project.accent,
              fontWeight: "bold", textShadow: `0 0 6px rgba(${hexToRgb(project.accent)},0.2)`,
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {isExpanded && (
        <div style={{ borderTop: "1px solid rgba(0,255,170,0.06)", paddingTop: "10px" }}>
          <div style={{
            fontFamily: mono, fontSize: "0.6rem", color: "rgba(0,255,170,0.4)",
            lineHeight: 1.6, marginBottom: "10px",
          }}>
            {project.description}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {project.tech.map((t, i) => (
              <span key={i} style={{
                padding: "2px 7px", fontFamily: mono, fontSize: "0.5rem",
                color: project.accent, background: `rgba(${hexToRgb(project.accent)},0.06)`,
                border: `1px solid rgba(${hexToRgb(project.accent)},0.12)`,
                letterSpacing: "0.5px",
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {!isExpanded && (
        <div style={{
          textAlign: "center", fontFamily: mono, fontSize: "0.45rem",
          color: "rgba(0,255,170,0.12)", letterSpacing: "2px", marginTop: "2px",
        }}>
          ▼ DETAILS
        </div>
      )}
    </div>
  );
};

// ─── FILTER PILL ───────────────────────────────────────────────
const FilterPill = ({ label, active, color, onClick }) => {
  const mono = "'JetBrains Mono', monospace";
  return (
    <button onClick={onClick} style={{
      padding: "4px 12px", fontFamily: mono, fontSize: "0.5rem", letterSpacing: "1.5px",
      color: active ? "#020402" : (color || "rgba(0,255,170,0.35)"),
      background: active ? (color || "#0fa") : "transparent",
      border: `1px solid ${active ? "transparent" : "rgba(0,255,170,0.1)"}`,
      cursor: "pointer", transition: "all 0.2s ease", textTransform: "uppercase",
    }}>
      {label}
    </button>
  );
};

// ─── PROJECTS VIEW ─────────────────────────────────────────────
const ProjectsView = ({ onBack }) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const mono = "'JetBrains Mono', 'Fira Code', monospace";
  const categories = ["ALL", ...new Set(projects.map(p => p.category))];

  const filtered = projects.filter(p => {
    const matchCat = activeFilter === "ALL" || p.category === activeFilter;
    const matchSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div style={{
      position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "24px",
      animation: "warpIn 0.6s ease forwards",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "20px", flexWrap: "wrap", gap: "12px",
        borderBottom: "1px solid rgba(0,255,170,0.08)", paddingBottom: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onBack} style={{
            padding: "5px 12px", fontFamily: mono, fontSize: "0.55rem", letterSpacing: "1px",
            color: "#0fa", background: "rgba(0,255,170,0.04)",
            border: "1px solid rgba(0,255,170,0.15)", cursor: "pointer",
            transition: "all 0.2s ease",
          }}>
            ◂ EXIT
          </button>
          <span style={{
            fontFamily: mono, fontSize: "1.1rem", fontWeight: 900,
            color: "#0fa", letterSpacing: "4px",
            textShadow: "0 0 15px rgba(0,255,170,0.3)",
          }}>
            NEXUS
          </span>
          <span style={{
            fontFamily: mono, fontSize: "0.45rem", color: "rgba(0,255,170,0.2)",
            letterSpacing: "2px",
          }}>
            // {projects.length} ACTIVE NODES
          </span>
        </div>

        <div style={{ display: "flex", gap: "24px" }}>
          {[
            { val: "14", label: "NODES", color: "#0fa" },
            { val: "400+", label: "TOOLS", color: "#08f" },
            { val: "120+", label: "SKILLS", color: "#f80" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: mono, fontSize: "1.2rem", fontWeight: "bold",
                color: s.color, textShadow: `0 0 10px ${s.color}40`,
              }}>{s.val}</div>
              <div style={{
                fontFamily: mono, fontSize: "0.4rem", color: "rgba(0,255,170,0.25)",
                letterSpacing: "2px",
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + view */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center",
            background: "rgba(0,255,170,0.02)", border: "1px solid rgba(0,255,170,0.08)",
            padding: "0 12px",
          }}>
            <span style={{ fontFamily: mono, color: "rgba(0,255,170,0.3)", fontSize: "0.7rem", marginRight: "8px" }}>$</span>
            <input
              type="text" placeholder="grep -i 'keyword' ./projects/*"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#0fa", fontFamily: mono, fontSize: "0.65rem",
                padding: "9px 0", letterSpacing: "0.5px",
              }}
            />
            {searchTerm && (
              <span onClick={() => setSearchTerm("")}
                style={{ color: "rgba(0,255,170,0.3)", cursor: "pointer", fontFamily: mono, fontSize: "0.7rem" }}>×</span>
            )}
          </div>
          <div style={{ display: "flex", gap: "2px" }}>
            {["grid", "list"].map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                padding: "7px 10px", fontFamily: mono,
                background: viewMode === mode ? "rgba(0,255,170,0.1)" : "transparent",
                border: `1px solid ${viewMode === mode ? "rgba(0,255,170,0.2)" : "rgba(0,255,170,0.06)"}`,
                color: viewMode === mode ? "#0fa" : "rgba(0,255,170,0.2)",
                cursor: "pointer", fontSize: "0.6rem",
              }}>
                {mode === "grid" ? "⊞" : "☰"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {categories.map(cat => (
            <FilterPill key={cat} label={cat}
              active={activeFilter === cat}
              color={cat === "ALL" ? "#0fa" : categoryColors[cat]}
              onClick={() => setActiveFilter(cat)} />
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{
        fontFamily: mono, fontSize: "0.45rem", color: "rgba(0,255,170,0.2)",
        letterSpacing: "2px", marginBottom: "12px",
      }}>
        RESULTS: {filtered.length}/{projects.length}
        {activeFilter !== "ALL" && <span style={{ color: categoryColors[activeFilter] }}> [{activeFilter}]</span>}
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(340px, 1fr))" : "1fr",
        gap: "8px", marginBottom: "50px",
      }}>
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project}
            isExpanded={expandedCard === project.id}
            onClick={() => setExpandedCard(expandedCard === project.id ? null : project.id)}
            delay={i * 50}
          />
        ))}
      </div>

      {/* Tech Radar */}
      <div style={{ borderTop: "1px solid rgba(0,255,170,0.06)", paddingTop: "30px", marginBottom: "30px" }}>
        <div style={{
          textAlign: "center", marginBottom: "20px", fontFamily: mono,
          fontSize: "0.5rem", color: "rgba(0,255,170,0.3)", letterSpacing: "4px",
        }}>
          ─── TECH STACK RADAR ───
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px" }}>
          {[
            { name: "Python", count: 10 }, { name: "Docker", count: 6 }, { name: "FastMCP", count: 4 },
            { name: "LangGraph", count: 3 }, { name: "React", count: 4 }, { name: "MCP Protocol", count: 5 },
            { name: "PostgreSQL", count: 3 }, { name: "Alpaca", count: 3 }, { name: "TypeScript", count: 2 },
            { name: "FastAPI", count: 2 }, { name: "ClickHouse", count: 2 }, { name: "Finnhub", count: 2 },
            { name: "Node.js", count: 2 }, { name: "Zabbix", count: 1 }, { name: "LiteLLM", count: 1 },
            { name: "AWS Bedrock", count: 1 }, { name: "Massive.com", count: 1 }, { name: "Tailscale", count: 1 },
            { name: "tmux", count: 1 }, { name: "TimescaleDB", count: 1 },
          ].map((t, i) => (
            <span key={i} style={{
              padding: `${3 + t.count}px ${8 + t.count * 2}px`,
              fontFamily: mono, fontSize: `${0.45 + t.count * 0.03}rem`,
              color: `rgba(0,255,170,${0.2 + (t.count / 10) * 0.5})`,
              background: `rgba(0,255,170,${0.01 + (t.count / 10) * 0.03})`,
              border: `1px solid rgba(0,255,170,${0.04 + (t.count / 10) * 0.06})`,
              letterSpacing: "0.5px",
            }}>
              {t.name} <span style={{ opacity: 0.4 }}>×{t.count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Status */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "4px", marginBottom: "40px",
      }}>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = projects.filter(p => p.status === status).length;
          return (
            <div key={status} style={{
              background: "rgba(0,255,170,0.015)",
              border: `1px solid rgba(${hexToRgb(config.color)},0.1)`,
              padding: "12px 14px",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <div style={{
                fontFamily: mono, fontSize: "1.4rem", fontWeight: "bold",
                color: config.color, textShadow: `0 0 8px ${config.color}40`,
                minWidth: "28px",
              }}>{count}</div>
              <div style={{
                fontFamily: mono, fontSize: "0.45rem", color: config.color,
                letterSpacing: "1.5px", opacity: 0.7,
              }}>{status}</div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center", borderTop: "1px solid rgba(0,255,170,0.04)", paddingTop: "20px",
      }}>
        <div style={{
          fontFamily: mono, fontSize: "0.45rem", color: "rgba(0,255,170,0.12)",
          letterSpacing: "3px",
        }}>
          V.MADATYAN // 2025-2026 // BUILDING AUTONOMOUS SECURITY & AI
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────────
export default function UnifiedPortfolioDashboard() {
  const [view, setView] = useState("landing");
  const [entering, setEntering] = useState(false);

  const handleEnter = useCallback(() => {
    setEntering(true);
    setTimeout(() => { setView("projects"); setEntering(false); }, 700);
  }, []);

  const handleBack = useCallback(() => {
    setView("landing");
  }, []);

  return (
    <div style={{
      minHeight: "100vh", color: "#0fa", position: "relative",
      fontFamily: "'JetBrains Mono', monospace",
      background: "#020402",
    }}>
      <GlobalStyles />
      <MatrixCanvas dimmed={view === "projects"} />
      <ScanLine />

      {view === "landing" && <LandingPage onEnter={handleEnter} />}
      {view === "projects" && <ProjectsView onBack={handleBack} />}

      {entering && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "radial-gradient(circle at center, rgba(0,255,170,0.08), #020402 70%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeUp 0.3s ease",
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem",
            color: "#0fa", letterSpacing: "4px",
            textShadow: "0 0 20px rgba(0,255,170,0.5)",
          }}>
            ESTABLISHING SECURE CONNECTION...
          </div>
        </div>
      )}
    </div>
  );
}