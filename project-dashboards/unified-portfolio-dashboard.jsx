import { useState, useEffect, useRef, useCallback } from "react";

// ─── PROJECT DATA ──────────────────────────────────────────────
const projects = [
  {
    id: "zephron", name: "ZEPHRON", tagline: "Autonomous NetSec Platform", category: "CYBERSECURITY", accent: "#00e5ff",
    description: "Full-stack network security platform with autonomous AI agents. Pure Python + Docker Compose architecture with Zabbix observability, LangGraph orchestration, and GitLab-style open-core licensing.",
    stats: [{ label: "Skills", value: "120+" }, { label: "MCP Servers", value: "52" }, { label: "Zabbix Tools", value: "40+" }, { label: "Dev Weeks", value: "22" }],
    tech: ["Python", "Docker Compose", "Zabbix", "LangGraph", "FastMCP", "ClickHouse"], status: "IN DEVELOPMENT", phase: 65, icon: "🛡️",
  },
  {
    id: "0xpwn", name: "0xPWN", tagline: "Autonomous AI Pentesting Agent", category: "OFFENSIVE SECURITY", accent: "#00ff87",
    description: "ReAct-based multi-agent pentesting system with Docker sandbox (Kali Linux), 5-phase attack pipeline, tiered permissions, and budget controls. Fork of Strix with 35+ enhancement gaps identified.",
    stats: [{ label: "Security Tools", value: "25+" }, { label: "LLM Providers", value: "100+" }, { label: "Vuln Classes", value: "40+" }, { label: "Gap Items", value: "35+" }],
    tech: ["Python", "LiteLLM", "Docker", "Kali Linux", "MCP Protocol", "Apache 2.0"], status: "PLANNING", phase: 30, icon: "💀",
  },
  {
    id: "policyfoundry", name: "POLICYFOUNDRY", tagline: "AI Firewall Policy Manager", category: "NETWORK SECURITY", accent: "#b44dff",
    description: "LangGraph + Deep Agents architecture for autonomous firewall policy management. Vector log ingestion, ClickHouse/DuckDB storage, 6 vendor adapters, graduated autonomy across 4 phases.",
    stats: [{ label: "Vendor Adapters", value: "6" }, { label: "Autonomy Phases", value: "4" }, { label: "License", value: "BSL 1.1" }, { label: "Storage", value: "2 DBs" }],
    tech: ["Python", "LangGraph", "AWS Bedrock", "ClickHouse", "DuckDB", "TypeScript"], status: "ARCHITECTURE", phase: 40, icon: "🔥",
  },
  {
    id: "zscaler-mcp", name: "ZSCALER MCP", tagline: "Complete Zscaler MCP Server", category: "CLOUD SECURITY", accent: "#ff6b35",
    description: "Comprehensive MCP server covering all 8 Zscaler products — ZIA, ZPA, Z-Insights, ZDX, ZTW, ZEASM, ZCC, and ZIdentity. ~188 tools with Railway as primary deployment target.",
    stats: [{ label: "Total Tools", value: "~188" }, { label: "Products", value: "8" }, { label: "ZIA Tools", value: "~60" }, { label: "ZPA Tools", value: "~60" }],
    tech: ["Python", "FastMCP", "Railway", "Docker", "Zscaler SDK", "SSE Transport"], status: "IN DEVELOPMENT", phase: 55, icon: "☁️",
  },
  {
    id: "network-mcps", name: "NETWORK MCPs", tagline: "Multi-Vendor MCP Servers", category: "NETWORK AUTOMATION", accent: "#ffdd00",
    description: "MCP server blueprint for Prisma Access (zero servers exist — highest value gap), Cisco Meraki (4+ community), and Juniper Mist (2 early-stage). Four-layer write safety model.",
    stats: [{ label: "Vendors", value: "3" }, { label: "Safety Layers", value: "4" }, { label: "Prisma Gap", value: "100%" }, { label: "Pattern", value: "FastMCP" }],
    tech: ["Python", "FastMCP", "Prisma SDK", "Meraki SDK", "Mist SDK", "Docker"], status: "RESEARCH", phase: 25, icon: "🌐",
  },
  {
    id: "netsec-skills", name: "NETSEC SKILLS", tagline: "AI Agent Skills Library", category: "AI INFRASTRUCTURE", accent: "#00e5ff",
    description: "Dual-layer architecture: SKILL.md for knowledge + MCP servers for execution. 6+ security domains, 20+ agent framework compatibility, 3 safety tiers. Monorepo with pnpm workspaces + Changesets.",
    stats: [{ label: "Skills", value: "120+" }, { label: "Domains", value: "6+" }, { label: "Frameworks", value: "20+" }, { label: "Safety Tiers", value: "3" }],
    tech: ["TypeScript", "Python", "pnpm", "Changesets", "SKILL.md", "MCP"], status: "ARCHITECTURE", phase: 35, icon: "🧠",
  },
  {
    id: "repoforge", name: "REPOFORGE", tagline: "Guided Repo Bootstrapper", category: "DEVELOPER TOOLS", accent: "#ff3e3e",
    description: "Open-source CLI + Cloud SaaS for guided repository bootstrapping. Python/FastAPI backend, Copier template engine, GitHub App integration. Freemium model targeting $16.8M ARR.",
    stats: [{ label: "Target ARR", value: "$16.8M" }, { label: "Free Tier", value: "$0" }, { label: "Pro Tier", value: "$39/mo" }, { label: "Templates", value: "∞" }],
    tech: ["Python", "FastAPI", "Copier", "GitHub Apps", "React", "PostgreSQL"], status: "IN DEVELOPMENT", phase: 45, icon: "⚡",
  },
  {
    id: "strat-trading", name: "STRAT TRADING", tagline: "AI-Powered Trading System", category: "FINTECH", accent: "#00ff87",
    description: "8-layer automated trading architecture using The Strat methodology (candle pattern classification). AI-driven signal generation, multi-layer risk management, and real-time execution via Alpaca.",
    stats: [{ label: "Architecture", value: "8 Layers" }, { label: "Monthly Cost", value: "$41-120" }, { label: "Data Source", value: "Polygon" }, { label: "Broker", value: "Alpaca" }],
    tech: ["Python", "Polygon.io", "Alpaca", "Lumibot", "TimescaleDB", "GPT-4"], status: "ARCHITECTURE", phase: 30, icon: "📈",
  },
  {
    id: "wheeely", name: "WHEEELY", tagline: "Options Wheel Strategy Engine", category: "FINTECH", accent: "#ffdd00",
    description: "Python CLI for automated options wheel strategy — sell puts, get assigned, sell covered calls, repeat. Multi-stage screening pipeline with staged filters (cheap Alpaca filters first, then Finnhub fundamentals). BYOK SaaS expansion planned with FMP and ORATS premium data.",
    stats: [{ label: "CLI Commands", value: "3" }, { label: "Pipeline", value: "5 Stages" }, { label: "Broker", value: "Alpaca" }, { label: "Model", value: "BYOK SaaS" }],
    tech: ["Python", "Alpaca", "Finnhub", "FMP", "ORATS", "Rich CLI"], status: "IN DEVELOPMENT", phase: 60, icon: "🎰",
  },
  {
    id: "wheel-it-screenr", name: "WHEEL-IT SCREENR", tagline: "Options Screener & Chain Analyzer", category: "FINTECH", accent: "#ff3e3e",
    description: "Web dashboard for wheel strategy screening. Real-time option chain analysis with put scoring (spread quality, liquidity, premium yield, delta sweet spot, IV level). Filter presets (Finviz Cut 2, Conservative, Aggressive), sector exclusions, and score tooltips with sub-component breakdowns.",
    stats: [{ label: "Score Weights", value: "5" }, { label: "Presets", value: "3" }, { label: "Chain Data", value: "Massive" }, { label: "Filters", value: "12+" }],
    tech: ["JavaScript", "Massive.com", "Alpaca", "Finnhub", "HTML/CSS", "Rich Tables"], status: "IN DEVELOPMENT", phase: 50, icon: "📊",
  },
  {
    id: "ai-bazar", name: "AI BAZAR", tagline: "AI M&A Marketplace", category: "MARKETPLACE", accent: "#b44dff",
    description: "Full-stack AI M&A marketplace with 6 architecture layers. Features buyer/seller portals, virtual deal rooms, escrow services, ML-powered matching, and AI-driven valuation engine.",
    stats: [{ label: "Arch Layers", value: "6" }, { label: "AI Engine", value: "Due Diligence" }, { label: "Matching", value: "ML-Powered" }, { label: "Module", value: "Acqui-Hire" }],
    tech: ["React", "Node.js", "Python", "PostgreSQL", "Redis", "ML Pipeline"], status: "PLANNING", phase: 20, icon: "🏪",
  },
  {
    id: "echelon", name: "ECHELON", tagline: "AI Real Estate Operations", category: "PROPTECH", accent: "#ff6b35",
    description: "AI operations team for real estate agencies. Specialized agents like Scout (lead response <60s vs industry 15+ hrs). Deep MLS/CRM integrations with flat monthly pricing.",
    stats: [{ label: "Response Time", value: "<60s" }, { label: "Industry Avg", value: "15+ hrs" }, { label: "Lead Agent", value: "Scout" }, { label: "Pricing", value: "Flat/mo" }],
    tech: ["Python", "LangChain", "MLS API", "CRM APIs", "Twilio", "React"], status: "PLANNING", phase: 25, icon: "🏠",
  },
  {
    id: "lumon", name: "LUMON", tagline: "AI Coding Agent Orchestration", category: "DEVELOPER TOOLS", accent: "#00e5ff",
    description: "Mission Control dashboard for orchestrating multiple AI coding agents (Claude Code, Codex CLI) in parallel. React UI with xterm.js terminals, tmux bridge for session management, wave scheduler, Git worktree isolation per agent, and Tailscale-based remote access with MagicDNS.",
    stats: [{ label: "Agent Types", value: "2" }, { label: "Bridges", value: "tmux + GSD" }, { label: "DB", value: "SQLite" }, { label: "Access", value: "Tailscale" }],
    tech: ["Node.js", "React", "xterm.js", "tmux", "SQLite", "Tailscale", "WebSocket"], status: "IN DEVELOPMENT", phase: 55, icon: "🎛️",
  },
  {
    id: "cyber-research", name: "CYBER RESEARCH", tagline: "Agentic AI Market Intelligence", category: "RESEARCH", accent: "#ffdd00",
    description: "Deep market research across 10 cybersecurity problem areas. SOC Automation ranked #1. Covers Vuln Management, Auto Pentesting, CSPM, Identity Security, Supply Chain, and more.",
    stats: [{ label: "Problem Areas", value: "10" }, { label: "Total VC", value: "$6.3B+" }, { label: "Top Area", value: "SOC Auto" }, { label: "Coverage", value: "Full Stack" }],
    tech: ["Market Analysis", "VC Data", "Competitive Intel", "Radar Charts", "Bubble Maps"], status: "COMPLETE", phase: 100, icon: "🔬",
  },
];

const categoryColors = {
  CYBERSECURITY: "#00e5ff", "OFFENSIVE SECURITY": "#00ff87", "NETWORK SECURITY": "#b44dff",
  "CLOUD SECURITY": "#ff6b35", "NETWORK AUTOMATION": "#ffdd00", "AI INFRASTRUCTURE": "#00e5ff",
  "DEVELOPER TOOLS": "#ff3e3e", FINTECH: "#00ff87", MARKETPLACE: "#b44dff",
  PROPTECH: "#ff6b35", RESEARCH: "#ffdd00",
};

const statusConfig = {
  COMPLETE: { color: "#00ff87", bg: "rgba(0,255,135,0.15)" },
  "IN DEVELOPMENT": { color: "#00e5ff", bg: "rgba(0,229,255,0.15)" },
  ARCHITECTURE: { color: "#b44dff", bg: "rgba(180,77,255,0.15)" },
  PLANNING: { color: "#ffdd00", bg: "rgba(255,221,0,0.15)" },
  RESEARCH: { color: "#ff6b35", bg: "rgba(255,107,53,0.15)" },
};

function hexToRgb(hex) {
  return `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`;
}

// ─── NEURAL NETWORK CANVAS ────────────────────────────────────
const NeuralCanvas = ({ entering }) => {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pulseRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const NEON = ["#00e5ff", "#00ff87", "#b44dff", "#ff3e3e", "#ff6b35", "#ffdd00"];
    const NODE_COUNT = 80;
    const CONNECTION_DIST = 180;

    // Initialize nodes
    if (nodesRef.current.length === 0) {
      for (let i = 0; i < NODE_COUNT; i++) {
        nodesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2.5 + 1,
          color: NEON[Math.floor(Math.random() * NEON.length)],
          pulse: Math.random() * Math.PI * 2,
          energy: Math.random(),
        });
      }
    }

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);

    // Fire random pulses along connections
    const firePulse = () => {
      if (pulseRef.current.length < 15 && Math.random() < 0.06) {
        const i = Math.floor(Math.random() * nodesRef.current.length);
        const n = nodesRef.current[i];
        // find nearest neighbor
        let best = null, bestD = Infinity;
        for (let j = 0; j < nodesRef.current.length; j++) {
          if (j === i) continue;
          const m = nodesRef.current[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < CONNECTION_DIST && d < bestD) { bestD = d; best = j; }
        }
        if (best !== null) {
          pulseRef.current.push({ from: i, to: best, t: 0, color: n.color });
        }
      }
    };

    let time = 0;
    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.03;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // Mouse attraction
        const dx = mx - n.x, dy = my - n.y;
        const md = Math.hypot(dx, dy);
        if (md < 250 && md > 0) {
          const force = 0.0003 * (250 - md);
          n.vx += (dx / md) * force;
          n.vy += (dy / md) * force;
        }
        // Damping
        n.vx *= 0.999;
        n.vy *= 0.999;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < CONNECTION_DIST) {
            const alpha = (1 - d / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${hexToRgb(a.color)},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw pulses
      firePulse();
      for (let p = pulseRef.current.length - 1; p >= 0; p--) {
        const pulse = pulseRef.current[p];
        pulse.t += 0.025;
        if (pulse.t >= 1) { pulseRef.current.splice(p, 1); continue; }
        const a = nodes[pulse.from], b = nodes[pulse.to];
        const px = a.x + (b.x - a.x) * pulse.t;
        const py = a.y + (b.y - a.y) * pulse.t;
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 8);
        glow.addColorStop(0, pulse.color + "cc");
        glow.addColorStop(1, pulse.color + "00");
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // Draw nodes
      for (const n of nodes) {
        const glow = 0.5 + Math.sin(n.pulse) * 0.3;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color + Math.round(glow * 255).toString(16).padStart(2, "0");
        ctx.fill();
        // Outer glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
        grad.addColorStop(0, n.color + "20");
        grad.addColorStop(1, n.color + "00");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Mouse glow
      if (mx > 0 && my > 0) {
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
        mg.addColorStop(0, "rgba(0,229,255,0.06)");
        mg.addColorStop(1, "rgba(0,229,255,0)");
        ctx.beginPath();
        ctx.arc(mx, my, 120, 0, Math.PI * 2);
        ctx.fillStyle = mg;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0,
        background: "linear-gradient(180deg, #050510 0%, #0a0a1a 40%, #080818 100%)",
        opacity: entering ? 0.3 : 1,
        transition: "opacity 1.2s ease",
      }}
    />
  );
};

// ─── SCANLINE ──────────────────────────────────────────────────
const ScanlineOverlay = () => (
  <div style={{
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1,
    pointerEvents: "none",
    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
  }} />
);

// ─── GLITCH KEYFRAMES (injected once) ──────────────────────────
const GlitchStyles = () => {
  useEffect(() => {
    if (document.getElementById("glitch-styles")) return;
    const style = document.createElement("style");
    style.id = "glitch-styles";
    style.textContent = `
      @keyframes glitch1 {
        0%, 90%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
        92% { clip-path: inset(20% 0 40% 0); transform: translate(-3px, 1px); }
        94% { clip-path: inset(60% 0 10% 0); transform: translate(3px, -1px); }
        96% { clip-path: inset(30% 0 30% 0); transform: translate(-2px, 2px); }
        98% { clip-path: inset(50% 0 20% 0); transform: translate(2px, -2px); }
      }
      @keyframes glitch2 {
        0%, 90%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); opacity: 0.7; }
        91% { clip-path: inset(40% 0 20% 0); transform: translate(4px, -1px); opacity: 0.9; }
        93% { clip-path: inset(10% 0 50% 0); transform: translate(-4px, 2px); opacity: 0.6; }
        97% { clip-path: inset(70% 0 5% 0); transform: translate(3px, 0px); opacity: 0.8; }
      }
      @keyframes subtlePulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes borderGlow {
        0%, 100% { box-shadow: 0 0 15px rgba(0,229,255,0.3), inset 0 0 15px rgba(0,229,255,0.05); }
        50% { box-shadow: 0 0 30px rgba(0,229,255,0.5), inset 0 0 30px rgba(0,229,255,0.1); }
      }
      @keyframes typewriter {
        from { width: 0; }
        to { width: 100%; }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes warpIn {
        0% { transform: scale(1.5) translateY(-20px); opacity: 0; filter: blur(10px); }
        100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
};

// ─── LANDING PAGE ──────────────────────────────────────────────
const LandingPage = ({ onEnter }) => {
  const [showTagline, setShowTagline] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTagline(true), 800);
    const t2 = setTimeout(() => setShowStats(true), 1400);
    const t3 = setTimeout(() => setShowButton(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{
      position: "relative", zIndex: 2,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", padding: "40px 24px", textAlign: "center",
    }}>
      {/* Floating hex pattern hint */}
      <div style={{
        position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)",
        fontSize: "0.55rem", fontFamily: "'JetBrains Mono', monospace",
        color: "rgba(0,229,255,0.25)", letterSpacing: "4px",
        animation: "subtlePulse 3s ease infinite",
      }}>
        ⬡ NEURAL MESH ACTIVE ⬡
      </div>

      {/* Main title with glitch */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <h1 style={{
          fontSize: "clamp(3rem, 8vw, 6rem)",
          fontWeight: 900,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          letterSpacing: "-2px",
          margin: 0,
          lineHeight: 1,
          background: "linear-gradient(135deg, #00e5ff 0%, #b44dff 40%, #00ff87 70%, #ff3e3e 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "glitch1 4s infinite",
        }}>
          PROJECT NEXUS
        </h1>
        {/* Glitch copy */}
        <h1 aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0,
          fontSize: "clamp(3rem, 8vw, 6rem)",
          fontWeight: 900,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          letterSpacing: "-2px",
          margin: 0,
          lineHeight: 1,
          background: "linear-gradient(135deg, #ff3e3e 0%, #00e5ff 50%, #ffdd00 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "glitch2 4s infinite",
          pointerEvents: "none",
        }}>
          PROJECT NEXUS
        </h1>
      </div>

      {/* Tagline */}
      <div style={{
        opacity: showTagline ? 1 : 0,
        transform: showTagline ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease",
      }}>
        <div style={{
          fontSize: "clamp(0.7rem, 2vw, 1rem)",
          fontFamily: "'JetBrains Mono', monospace",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "6px",
          marginBottom: "8px",
        }}>
          ENTER THE HIVEMIND
        </div>
        <div style={{
          fontSize: "clamp(0.55rem, 1.2vw, 0.75rem)",
          fontFamily: "'JetBrains Mono', monospace",
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "3px",
          maxWidth: "600px",
        }}>
          14 PROJECTS • CYBERSECURITY • FINTECH • AI AGENTS • DEVTOOLS
        </div>
      </div>

      {/* Mini stat orbs */}
      <div style={{
        display: "flex", gap: "40px", marginTop: "40px",
        opacity: showStats ? 1 : 0,
        transform: showStats ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease",
      }}>
        {[
          { val: "14", label: "PROJECTS", color: "#00e5ff" },
          { val: "400+", label: "TOOLS", color: "#00ff87" },
          { val: "120+", label: "AI SKILLS", color: "#b44dff" },
          { val: "8", label: "DOMAINS", color: "#ff6b35" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "1.6rem", fontWeight: "bold",
              fontFamily: "'JetBrains Mono', monospace",
              color: s.color,
              textShadow: `0 0 20px ${s.color}50`,
            }}>{s.val}</div>
            <div style={{
              fontSize: "0.5rem", color: "rgba(255,255,255,0.35)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "2px", marginTop: "4px",
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Enter button */}
      <div style={{
        marginTop: "50px",
        opacity: showButton ? 1 : 0,
        transform: showButton ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease",
      }}>
        <button
          onClick={onEnter}
          onMouseEnter={() => setHoverBtn(true)}
          onMouseLeave={() => setHoverBtn(false)}
          style={{
            padding: "14px 48px",
            fontSize: "0.8rem",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: "bold",
            letterSpacing: "4px",
            color: hoverBtn ? "#0a0a0f" : "#00e5ff",
            background: hoverBtn
              ? "linear-gradient(135deg, #00e5ff, #00ff87)"
              : "transparent",
            border: "1px solid #00e5ff60",
            borderRadius: "2px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            animation: hoverBtn ? "none" : "borderGlow 2s ease infinite",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {hoverBtn ? "◈ JACKING IN ◈" : "▸ VIEW PROJECTS"}
        </button>

        <div style={{
          marginTop: "16px",
          fontSize: "0.5rem",
          fontFamily: "'JetBrains Mono', monospace",
          color: "rgba(255,255,255,0.15)",
          letterSpacing: "2px",
          animation: "blink 1.5s step-end infinite",
        }}>
          ▌
        </div>
      </div>

      {/* Bottom signature */}
      <div style={{
        position: "absolute", bottom: "5%", left: "50%", transform: "translateX(-50%)",
        fontSize: "0.5rem", fontFamily: "'JetBrains Mono', monospace",
        color: "rgba(255,255,255,0.12)", letterSpacing: "3px",
      }}>
        VAHAGN MADATYAN — 2025-2026
      </div>
    </div>
  );
};

// ─── NEON TEXT ──────────────────────────────────────────────────
const NeonText = ({ children, color = "#00e5ff", size = "1rem", weight = "bold", style = {} }) => (
  <span style={{
    color, fontSize: size, fontWeight: weight,
    textShadow: `0 0 7px ${color}40, 0 0 20px ${color}20`,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    ...style,
  }}>
    {children}
  </span>
);

// ─── PROJECT CARD ──────────────────────────────────────────────
const ProjectCard = ({ project, isExpanded, onClick, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, rgba(${hexToRgb(project.accent)},0.08) 0%, rgba(10,10,15,0.95) 100%)`
          : "rgba(12,12,20,0.85)",
        border: `1px solid ${hovered ? project.accent + "60" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "4px",
        padding: isExpanded ? "24px" : "20px",
        cursor: "pointer",
        transition: "all 0.4s ease",
        position: "relative",
        overflow: "hidden",
        boxShadow: hovered ? `0 0 30px ${project.accent}15, inset 0 0 30px ${project.accent}05` : "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
        opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s ease",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.4rem" }}>{project.icon}</span>
          <div>
            <NeonText color={project.accent} size="1.1rem">{project.name}</NeonText>
            <div style={{
              color: "rgba(255,255,255,0.5)", fontSize: "0.7rem",
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px", marginTop: "2px",
            }}>
              {project.category}
            </div>
          </div>
        </div>
        <div style={{
          padding: "3px 10px", borderRadius: "2px", fontSize: "0.6rem",
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px",
          color: statusConfig[project.status]?.color || "#fff",
          background: statusConfig[project.status]?.bg || "rgba(255,255,255,0.1)",
          border: `1px solid ${(statusConfig[project.status]?.color || "#fff")}30`,
        }}>
          {project.status}
        </div>
      </div>

      <div style={{
        color: "rgba(255,255,255,0.7)", fontSize: "0.8rem",
        fontFamily: "'JetBrains Mono', monospace", marginBottom: "14px", lineHeight: 1.4,
      }}>
        {project.tagline}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", marginBottom: "4px",
          fontSize: "0.6rem", fontFamily: "'JetBrains Mono', monospace",
          color: "rgba(255,255,255,0.4)", letterSpacing: "1px",
        }}>
          <span>PROGRESS</span>
          <span style={{ color: project.accent }}>{project.phase}%</span>
        </div>
        <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${project.phase}%`,
            background: `linear-gradient(90deg, ${project.accent}80, ${project.accent})`,
            boxShadow: `0 0 10px ${project.accent}60`,
            borderRadius: "2px", transition: "width 1s ease",
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
        {project.stats.map((stat, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: "3px", padding: "8px",
          }}>
            <div style={{
              fontSize: "0.55rem", color: "rgba(255,255,255,0.35)",
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px", marginBottom: "3px",
            }}>
              {stat.label.toUpperCase()}
            </div>
            <div style={{
              fontSize: "0.85rem", color: project.accent,
              fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold",
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {isExpanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px", marginTop: "4px" }}>
          <div style={{
            color: "rgba(255,255,255,0.6)", fontSize: "0.75rem",
            fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6, marginBottom: "14px",
          }}>
            {project.description}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {project.tech.map((t, i) => (
              <span key={i} style={{
                padding: "3px 8px", fontSize: "0.6rem",
                fontFamily: "'JetBrains Mono', monospace", color: project.accent,
                background: `${project.accent}10`, border: `1px solid ${project.accent}25`,
                borderRadius: "2px", letterSpacing: "0.5px",
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {!isExpanded && (
        <div style={{
          textAlign: "center", fontSize: "0.6rem", color: "rgba(255,255,255,0.2)",
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: "2px", marginTop: "4px",
        }}>
          ▼ EXPAND
        </div>
      )}
    </div>
  );
};

// ─── FILTER PILL ───────────────────────────────────────────────
const FilterPill = ({ label, active, color, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 14px", fontSize: "0.6rem",
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px",
    color: active ? "#0a0a0f" : color || "rgba(255,255,255,0.5)",
    background: active ? (color || "#00e5ff") : "transparent",
    border: `1px solid ${active ? "transparent" : (color || "rgba(255,255,255,0.15)")}`,
    borderRadius: "2px", cursor: "pointer", transition: "all 0.2s ease", textTransform: "uppercase",
  }}>
    {label}
  </button>
);

// ─── HEADER STAT ───────────────────────────────────────────────
const HeaderStat = ({ value, label, color = "#00e5ff" }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{
      fontSize: "1.8rem", fontWeight: "bold",
      fontFamily: "'JetBrains Mono', monospace", color,
      textShadow: `0 0 20px ${color}40`,
    }}>{value}</div>
    <div style={{
      fontSize: "0.55rem", color: "rgba(255,255,255,0.4)",
      fontFamily: "'JetBrains Mono', monospace", letterSpacing: "2px", marginTop: "4px",
    }}>{label}</div>
  </div>
);

// ─── PROJECTS VIEW ─────────────────────────────────────────────
const ProjectsView = ({ onBack }) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

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
      position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "30px 24px",
      animation: "warpIn 0.8s ease forwards",
    }}>
      {/* Back button + header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "30px", flexWrap: "wrap", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={onBack} style={{
            padding: "6px 14px", fontSize: "0.65rem",
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px",
            color: "#00e5ff", background: "rgba(0,229,255,0.05)",
            border: "1px solid rgba(0,229,255,0.2)", borderRadius: "2px",
            cursor: "pointer", transition: "all 0.2s ease",
          }}>
            ◂ BACK
          </button>
          <div>
            <span style={{
              fontSize: "1.4rem", fontWeight: 900,
              fontFamily: "'JetBrains Mono', monospace",
              background: "linear-gradient(135deg, #00e5ff, #b44dff, #00ff87)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              PROJECT NEXUS
            </span>
            <span style={{
              fontSize: "0.55rem", fontFamily: "'JetBrains Mono', monospace",
              color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginLeft: "12px",
            }}>
              {projects.length} NODES ACTIVE
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "30px" }}>
          <HeaderStat value="14" label="PROJECTS" color="#00e5ff" />
          <HeaderStat value="400+" label="TOOLS" color="#00ff87" />
          <HeaderStat value="120+" label="SKILLS" color="#b44dff" />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "3px", padding: "0 14px",
          }}>
            <span style={{ color: "#00e5ff", fontSize: "0.8rem", marginRight: "10px" }}>⌕</span>
            <input
              type="text" placeholder="Search projects, tech, keywords..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#fff", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace",
                padding: "10px 0", letterSpacing: "0.5px",
              }}
            />
            {searchTerm && (
              <span onClick={() => setSearchTerm("")}
                style={{ color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "0.8rem" }}>✕</span>
            )}
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {["grid", "list"].map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                padding: "8px 12px",
                background: viewMode === mode ? "rgba(0,229,255,0.15)" : "transparent",
                border: `1px solid ${viewMode === mode ? "#00e5ff40" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "3px",
                color: viewMode === mode ? "#00e5ff" : "rgba(255,255,255,0.4)",
                cursor: "pointer", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace",
              }}>
                {mode === "grid" ? "⊞" : "☰"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {categories.map(cat => (
            <FilterPill key={cat} label={cat}
              active={activeFilter === cat}
              color={cat === "ALL" ? "#00e5ff" : categoryColors[cat]}
              onClick={() => setActiveFilter(cat)} />
          ))}
        </div>
      </div>

      <div style={{
        fontSize: "0.6rem", fontFamily: "'JetBrains Mono', monospace",
        color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "16px",
      }}>
        SHOWING {filtered.length} OF {projects.length} PROJECTS
        {activeFilter !== "ALL" && <span style={{ color: categoryColors[activeFilter] }}> — {activeFilter}</span>}
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(340px, 1fr))" : "1fr",
        gap: "16px", marginBottom: "60px",
      }}>
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project}
            isExpanded={expandedCard === project.id}
            onClick={() => setExpandedCard(expandedCard === project.id ? null : project.id)}
            delay={i * 60}
          />
        ))}
      </div>

      {/* Tech Radar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "40px", marginBottom: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <NeonText color="#b44dff" size="0.65rem" style={{ letterSpacing: "3px" }}>TECHNOLOGY RADAR</NeonText>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
          {[
            { name: "Python", count: 10, color: "#00e5ff" },
            { name: "Docker", count: 6, color: "#00e5ff" },
            { name: "FastMCP", count: 4, color: "#00ff87" },
            { name: "LangGraph", count: 3, color: "#b44dff" },
            { name: "React", count: 4, color: "#00e5ff" },
            { name: "TypeScript", count: 2, color: "#00e5ff" },
            { name: "PostgreSQL", count: 3, color: "#ff6b35" },
            { name: "FastAPI", count: 2, color: "#00ff87" },
            { name: "ClickHouse", count: 2, color: "#ffdd00" },
            { name: "MCP Protocol", count: 5, color: "#b44dff" },
            { name: "Zabbix", count: 1, color: "#ff3e3e" },
            { name: "LiteLLM", count: 1, color: "#00ff87" },
            { name: "AWS Bedrock", count: 1, color: "#ff6b35" },
            { name: "Alpaca", count: 3, color: "#00ff87" },
            { name: "Finnhub", count: 2, color: "#ffdd00" },
            { name: "Massive.com", count: 1, color: "#ff3e3e" },
            { name: "Node.js", count: 2, color: "#00ff87" },
            { name: "Tailscale", count: 1, color: "#00e5ff" },
            { name: "tmux", count: 1, color: "#b44dff" },
            { name: "TimescaleDB", count: 1, color: "#00e5ff" },
          ].map((tech, i) => (
            <span key={i} style={{
              padding: `${4 + tech.count}px ${10 + tech.count * 2}px`,
              fontSize: `${0.55 + tech.count * 0.04}rem`,
              fontFamily: "'JetBrains Mono', monospace", color: tech.color,
              background: `${tech.color}08`, border: `1px solid ${tech.color}20`,
              borderRadius: "2px", letterSpacing: "0.5px",
              opacity: 0.5 + (tech.count / 10) * 0.5,
            }}>
              {tech.name} <span style={{ opacity: 0.5 }}>×{tech.count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Status breakdown */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px", marginBottom: "50px",
      }}>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = projects.filter(p => p.status === status).length;
          return (
            <div key={status} style={{
              background: config.bg, border: `1px solid ${config.color}20`,
              borderRadius: "3px", padding: "14px 16px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <div style={{
                fontSize: "1.6rem", fontWeight: "bold",
                fontFamily: "'JetBrains Mono', monospace",
                color: config.color, minWidth: "30px",
              }}>{count}</div>
              <div style={{
                fontSize: "0.6rem", fontFamily: "'JetBrains Mono', monospace",
                color: config.color, letterSpacing: "1.5px", opacity: 0.8,
              }}>{status}</div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "24px" }}>
        <div style={{
          fontSize: "0.6rem", fontFamily: "'JetBrains Mono', monospace",
          color: "rgba(255,255,255,0.2)", letterSpacing: "2px",
        }}>
          VAHAGN MADATYAN — 2025-2026
        </div>
        <div style={{
          fontSize: "0.5rem", fontFamily: "'JetBrains Mono', monospace",
          color: "rgba(255,255,255,0.1)", letterSpacing: "3px", marginTop: "8px",
        }}>
          BUILDING THE FUTURE OF AUTONOMOUS SECURITY & AI
        </div>
      </div>
    </div>
  );
};

// ─── MAIN DASHBOARD ────────────────────────────────────────────
export default function UnifiedPortfolioDashboard() {
  const [view, setView] = useState("landing"); // landing | entering | projects
  const [entering, setEntering] = useState(false);

  const handleEnter = useCallback(() => {
    setEntering(true);
    setTimeout(() => setView("projects"), 800);
  }, []);

  const handleBack = useCallback(() => {
    setView("landing");
    setEntering(false);
  }, []);

  return (
    <div style={{ minHeight: "100vh", color: "#fff", position: "relative", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <GlitchStyles />
      <NeuralCanvas entering={view === "projects"} />
      <ScanlineOverlay />

      {view === "landing" && <LandingPage onEnter={handleEnter} />}
      {view === "projects" && <ProjectsView onBack={handleBack} />}

      {/* Entering transition overlay */}
      {entering && view !== "projects" && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
          background: "radial-gradient(circle at center, rgba(0,229,255,0.2), #050510)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeSlideUp 0.5s ease",
        }}>
          <div style={{
            fontSize: "1rem", fontFamily: "'JetBrains Mono', monospace",
            color: "#00e5ff", letterSpacing: "4px",
            textShadow: "0 0 30px rgba(0,229,255,0.5)",
          }}>
            INITIALIZING NEURAL MESH...
          </div>
        </div>
      )}
    </div>
  );
}