export const projects = [
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

export const categoryColors = {
  CYBERSECURITY: "#0fa", "OFFENSIVE SECURITY": "#f33", "NETWORK SECURITY": "#f80",
  "CLOUD SECURITY": "#08f", "NETWORK AUTOMATION": "#0fa", "AI INFRASTRUCTURE": "#0fa",
  "DEVELOPER TOOLS": "#08f", FINTECH: "#0fa", MARKETPLACE: "#08f",
  PROPTECH: "#f80", RESEARCH: "#0fa",
};

export const statusConfig = {
  COMPLETE: { color: "#0fa", sym: "●" },
  "IN DEVELOPMENT": { color: "#08f", sym: "◉" },
  ARCHITECTURE: { color: "#f80", sym: "◎" },
  PLANNING: { color: "#f33", sym: "○" },
  RESEARCH: { color: "#888", sym: "◌" },
};
