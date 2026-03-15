import { useState } from "react";

const LAYERS = [
  {
    id: "data",
    title: "1 · DATA COLLECTION",
    subtitle: "Multi-Source Ingestion Pipeline",
    color: "#0F766E",
    bgColor: "#F0FDFA",
    borderColor: "#99F6E4",
    modules: [
      {
        name: "Polygon.io",
        role: "Primary Market Data",
        details: [
          "OHLCV bars: 1min, 5min, 15min, 30min, 1H, 4H, Day, Week, Month",
          "Real-time WebSocket streaming during market hours",
          "Options chain data: strikes, expiries, greeks, IV",
          "Historical data: 5yr on Starter ($29/mo), 2yr free",
          "Aggregates endpoint for multi-timeframe Strat classification",
        ],
        api: "REST + WebSocket",
        cost: "Free–$29/mo",
        priority: "CRITICAL",
      },
      {
        name: "Alpaca News API",
        role: "News & Sentiment Feed",
        details: [
          "Real-time news headlines with symbol tagging",
          "Pre-market catalyst detection (earnings, FDA, M&A)",
          "Filters: by symbol, date range, source",
          "Included free with Alpaca account",
          "Rate limit: 200 requests/min on free tier",
        ],
        api: "REST",
        cost: "Free",
        priority: "HIGH",
      },
      {
        name: "FinViz Screener",
        role: "Universe Filtering & Fundamentals",
        details: [
          "Pre-market scan: gap%, volume, float, sector",
          "Fundamental filters: P/E, market cap, insider activity",
          "Technical filters: RSI, SMA cross, new high/low",
          "Earnings date flagging for trade invalidation",
          "Export watchlist CSV → feed into scanner pipeline",
        ],
        api: "Scrape / Elite API ($39/mo)",
        cost: "Free–$39/mo",
        priority: "HIGH",
      },
      {
        name: "TradingView Webhooks",
        role: "Alert-Based Signal Ingestion",
        details: [
          "Custom Pine Script alerts for Strat pattern detection",
          "Webhook POST to your server on pattern trigger",
          "Multi-timeframe alerts: D/W/M continuity changes",
          "Volume spike alerts on watchlist symbols",
          "Backup signal source to validate scanner output",
        ],
        api: "Webhook POST",
        cost: "Free–$15/mo",
        priority: "MEDIUM",
      },
      {
        name: "FRED Economic API",
        role: "Macro Environment Context",
        details: [
          "VIX (VIXCLS) — volatility regime detection",
          "Yield curve (T10Y2Y) — recession/risk signal",
          "Fed Funds Rate (DFF) — monetary policy context",
          "CPI / Unemployment — inflation & jobs data",
          "Refreshed daily pre-market at 8:00 AM ET",
        ],
        api: "REST",
        cost: "Free",
        priority: "MEDIUM",
      },
      {
        name: "SEC EDGAR / Insider Data",
        role: "Smart Money Tracking",
        details: [
          "Form 4 filings — insider buys/sells",
          "13F filings — institutional holdings quarterly",
          "8-K filings — material event detection",
          "Cross-reference with Strat setups for conviction boost",
          "Daily scrape at 6:00 AM ET",
        ],
        api: "REST / RSS",
        cost: "Free",
        priority: "LOW",
      },
    ],
  },
  {
    id: "processing",
    title: "2 · DATA PROCESSING & STORAGE",
    subtitle: "ETL Pipeline & Local Cache",
    color: "#7C3AED",
    bgColor: "#FAF5FF",
    borderColor: "#DDD6FE",
    modules: [
      {
        name: "ETL Scheduler",
        role: "Orchestration Engine",
        details: [
          "APScheduler — cron-based job scheduling",
          "Pre-market jobs: 4:00 AM, 8:00 AM, 9:00 AM ET",
          "Intraday jobs: every 5min from 9:35–15:55 ET",
          "Post-market jobs: 4:05 PM, 4:30 PM ET",
          "Job health monitoring with retry logic",
        ],
        api: "Internal",
        cost: "N/A",
        priority: "CRITICAL",
      },
      {
        name: "PostgreSQL / TimescaleDB",
        role: "Primary Data Store",
        details: [
          "TimescaleDB extension for time-series OHLCV data",
          "Hypertables: bars_1min, bars_5min, bars_daily, etc.",
          "Tables: signals, trades, positions, journal, news",
          "Continuous aggregates for real-time rollups",
          "Retention policy: 2yr intraday, unlimited daily",
        ],
        api: "SQL / SQLAlchemy",
        cost: "$0 (self-hosted)",
        priority: "CRITICAL",
      },
      {
        name: "Redis Cache",
        role: "Real-Time State Store",
        details: [
          "Current positions and P&L — sub-ms access",
          "Latest Strat labels per symbol per timeframe",
          "TF continuity status cache (refreshed per scan)",
          "Active signal queue for execution engine",
          "Rate limiter state for API calls",
        ],
        api: "Redis Protocol",
        cost: "$0 (self-hosted)",
        priority: "HIGH",
      },
      {
        name: "Data Normalizer",
        role: "Schema Standardization",
        details: [
          "Normalize all sources to unified OHLCV schema",
          "Timezone alignment: all timestamps to UTC",
          "Handle splits/dividends adjustment on Polygon data",
          "Dedup and gap-fill for missing bars",
          "Validate data integrity before storage",
        ],
        api: "Internal",
        cost: "N/A",
        priority: "HIGH",
      },
    ],
  },
  {
    id: "analysis",
    title: "3 · AI ANALYSIS ENGINE",
    subtitle: "Multi-Model Intelligence Layer",
    color: "#DC2626",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
    modules: [
      {
        name: "Strat Classifier",
        role: "Core Pattern Recognition",
        details: [
          "Classify every candle: Scenario 1 (inside), 2U/2D (directional), 3 (outside)",
          "Multi-candle pattern detection: 2-1-2, 3-1-2, 1-2-2, 1-3, 2-2",
          "Continuation vs reversal labeling based on direction sequence",
          "Run across ALL timeframes simultaneously for each symbol",
          "Output: labeled DataFrame with pattern + direction columns",
        ],
        api: "Internal Python",
        cost: "N/A",
        priority: "CRITICAL",
      },
      {
        name: "TF Continuity Engine",
        role: "Multi-Timeframe Alignment Filter",
        details: [
          "Swing mode: check Daily + Weekly + Monthly alignment",
          "Intraday mode: check 30M + 1H + 4H alignment",
          "All higher TFs must be 2U (bullish) or 2D (bearish)",
          "Any Scenario 1 on higher TF = SKIP (no alignment)",
          "Output: {aligned: bool, direction: U/D, blocked_by: TF}",
        ],
        api: "Internal Python",
        cost: "N/A",
        priority: "CRITICAL",
      },
      {
        name: "LLM Sentiment Analyzer",
        role: "News & Catalyst Intelligence",
        details: [
          "Claude API or local FinBERT for sentiment scoring",
          "Input: Alpaca news headlines + article summaries",
          "Output: sentiment score (-1 to +1), confidence, catalyst type",
          "Catalyst classification: earnings, FDA, M&A, macro, legal",
          "Flag conflicting sentiment vs technical setup",
        ],
        api: "Claude API / HuggingFace",
        cost: "$0–5/mo (API usage)",
        priority: "HIGH",
      },
      {
        name: "Technical Scanner",
        role: "Indicator Overlay & Confirmation",
        details: [
          "RSI(14): confirm overbought/oversold at pattern trigger",
          "Volume ratio: current bar vs 20-bar avg (need >1.2x)",
          "VWAP position: above/below for intraday bias",
          "ATR(14): dynamic stop-loss sizing based on volatility",
          "EMA 9/21 cross: trend confirmation for Strat direction",
        ],
        api: "pandas-ta / ta-lib",
        cost: "N/A",
        priority: "HIGH",
      },
      {
        name: "Options Flow Filter",
        role: "Smart Money & Options Intelligence",
        details: [
          "IV Rank calculation: current IV vs 52-week range",
          "Unusual options activity detection (volume > OI)",
          "Put/Call ratio analysis for directional bias",
          "Earnings proximity check: skip if within holding period",
          "Optimal strike/expiry selection based on thesis timeframe",
        ],
        api: "Polygon Options API",
        cost: "Included w/ Polygon",
        priority: "MEDIUM",
      },
      {
        name: "Market Regime Detector",
        role: "Macro Context Classification",
        details: [
          "VIX regime: low (<15), normal (15-25), high (>25), extreme (>35)",
          "Market breadth: advance/decline ratio from universe scan",
          "Trend strength: % of universe with bullish TF continuity",
          "Correlation regime: high correlation = reduce position count",
          "Output: regime label → adjusts risk parameters dynamically",
        ],
        api: "Internal + FRED",
        cost: "N/A",
        priority: "MEDIUM",
      },
    ],
  },
  {
    id: "signals",
    title: "4 · SIGNAL GENERATION & SCORING",
    subtitle: "Trade Idea Assembly & Ranking",
    color: "#D97706",
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A",
    modules: [
      {
        name: "Signal Assembler",
        role: "Composite Signal Builder",
        details: [
          "Combine: Strat pattern + TF continuity + volume + sentiment",
          "Each factor gets a weighted score (configurable)",
          "Strat pattern: 40%, TF continuity: 25%, Volume: 15%, Sentiment: 10%, Options flow: 10%",
          "Output: composite score 0-100 per setup",
          "Minimum threshold: 65/100 to qualify as tradeable",
        ],
        api: "Internal",
        cost: "N/A",
        priority: "CRITICAL",
      },
      {
        name: "Trade Plan Generator",
        role: "Entry/Stop/Target Calculator",
        details: [
          "Entry: breakout price of inside bar high (bull) or low (bear)",
          "Stop-loss: ATR-based OR previous swing low (whichever is tighter)",
          "TP1 (conservative): nearest prior high/low — target 1:1 R:R minimum",
          "TP2 (aggressive): next resistance/support zone — target 2:1+ R:R",
          "Position size: risk_amount / (entry - stop) = shares",
        ],
        api: "Internal",
        cost: "N/A",
        priority: "CRITICAL",
      },
      {
        name: "Conflict Resolver",
        role: "Signal Deduplication & Prioritization",
        details: [
          "Prevent duplicate signals on same symbol across scans",
          "Rank competing setups by R:R ratio, then by score",
          "Cap max simultaneous signals at 3 per scan cycle",
          "Block signals on correlated symbols (e.g., AAPL + QQQ)",
          "Earnings blackout: auto-reject if earnings within hold period",
        ],
        api: "Internal",
        cost: "N/A",
        priority: "HIGH",
      },
    ],
  },
  {
    id: "validation",
    title: "5 · VALIDATION & BACKTESTING",
    subtitle: "Statistical Confidence Before Capital",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    modules: [
      {
        name: "Lumibot Backtester",
        role: "Primary Backtest Engine",
        details: [
          "Event-driven backtesting with Polygon data source",
          "Same Strategy class runs in backtest AND live mode",
          "Built-in performance metrics: Sharpe, Sortino, max DD, win rate",
          "Trading fee simulation: flat + percentage fees",
          "Benchmark comparison vs SPY automatically",
        ],
        api: "Python Framework",
        cost: "Free (open source)",
        priority: "CRITICAL",
      },
      {
        name: "QuantConnect (LEAN)",
        role: "Secondary Validation & Options Backtesting",
        details: [
          "Cross-validate Lumibot results on independent engine",
          "Options strategy backtesting (Lumibot is weak here)",
          "400TB+ institutional data for extended history testing",
          "Parameter optimization with cloud compute",
          "Use for: multi-asset, options, and stress-test scenarios",
        ],
        api: "Cloud IDE + API",
        cost: "Free tier / $20+/mo for live",
        priority: "HIGH",
      },
      {
        name: "Walk-Forward Analyzer",
        role: "Overfitting Prevention",
        details: [
          "Split data: 70% in-sample (train), 30% out-of-sample (test)",
          "Rolling window: optimize on 6mo, test on next 2mo, roll forward",
          "Compare in-sample vs out-of-sample metrics",
          "If degradation > 20%, flag strategy as overfit",
          "Monte Carlo simulation: 1000 random trade sequences",
        ],
        api: "Internal + vectorbt",
        cost: "N/A",
        priority: "HIGH",
      },
      {
        name: "Pattern Validator",
        role: "Per-Pattern Statistical Edge",
        details: [
          "Track win rate per Strat pattern type independently",
          "2-1-2 cont, 2-1-2 rev, 3-1-2, 1-2-2, 1-3 — each measured",
          "Compare: with TF continuity vs without (quantify filter value)",
          "Minimum 30 trades per pattern before declaring statistical significance",
          "Kill switch: disable any pattern that drops below 45% win rate",
        ],
        api: "Internal",
        cost: "N/A",
        priority: "HIGH",
      },
    ],
  },
  {
    id: "risk",
    title: "6 · RISK MANAGEMENT",
    subtitle: "Capital Preservation Layer",
    color: "#BE185D",
    bgColor: "#FDF2F8",
    borderColor: "#FBCFE8",
    modules: [
      {
        name: "Position Sizer",
        role: "Per-Trade Risk Calculator",
        details: [
          "Max risk per trade: 1% of account equity (configurable)",
          "shares = risk_amount / |entry_price - stop_price|",
          "Account for slippage: add 0.02% to entry price estimate",
          "Account for commissions: Alpaca is commission-free for stocks",
          "Options: max risk = premium paid (defined risk only)",
        ],
        api: "Internal",
        cost: "N/A",
        priority: "CRITICAL",
      },
      {
        name: "Exposure Manager",
        role: "Portfolio-Level Risk Controls",
        details: [
          "Max concurrent positions: 5 (configurable)",
          "Max total exposure: 80% of equity deployed",
          "Max sector concentration: 30% in any single sector",
          "Correlation check: block if Pearson correlation > 0.7 with existing position",
          "Daily loss limit: -3% of account → halt all new trades for day",
        ],
        api: "Internal",
        cost: "N/A",
        priority: "CRITICAL",
      },
      {
        name: "Regime Adjuster",
        role: "Dynamic Risk Scaling",
        details: [
          "VIX < 15: normal risk (1% per trade, 5 positions)",
          "VIX 15-25: reduced risk (0.75% per trade, 4 positions)",
          "VIX 25-35: defensive (0.5% per trade, 3 positions)",
          "VIX > 35: cash preservation (0.25% per trade, 2 positions)",
          "Market breadth < 40% bullish: reduce long-only signals",
        ],
        api: "Internal + FRED VIX",
        cost: "N/A",
        priority: "HIGH",
      },
    ],
  },
  {
    id: "execution",
    title: "7 · EXECUTION ENGINE",
    subtitle: "Order Management via Alpaca",
    color: "#059669",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    modules: [
      {
        name: "Alpaca Paper Trading",
        role: "Phase 1 — Validation with Simulated Capital",
        details: [
          "Bracket orders: entry + stop-loss + take-profit in one call",
          "OCO (one-cancels-other) for stop + target management",
          "Market orders for breakout entries (speed > precision)",
          "Limit orders for pullback entries (precision > speed)",
          "Paper account mirrors real execution with simulated fills",
        ],
        api: "alpaca-py SDK",
        cost: "Free",
        priority: "CRITICAL",
      },
      {
        name: "Alpaca Live Trading",
        role: "Phase 2 — Real Capital (after validation)",
        details: [
          "Same code as paper — switch PAPER=True → PAPER=False",
          "Start with 25% of intended capital for first month",
          "Scale to 50%, 75%, 100% over subsequent months if metrics hold",
          "Commission-free for stocks; options have per-contract fees",
          "PDT rule: need $25K+ for unlimited day trades",
        ],
        api: "alpaca-py SDK",
        cost: "Free (commission-free stocks)",
        priority: "FUTURE",
      },
      {
        name: "Order State Machine",
        role: "Order Lifecycle Management",
        details: [
          "States: PENDING → SUBMITTED → PARTIAL → FILLED → CLOSED",
          "Handle partial fills: adjust position size, recalculate targets",
          "Handle rejections: log reason, retry with adjusted price",
          "Timeout: cancel unfilled limit orders after 5 minutes",
          "End-of-day: flatten all intraday positions by 3:55 PM ET",
        ],
        api: "Internal",
        cost: "N/A",
        priority: "HIGH",
      },
    ],
  },
  {
    id: "monitoring",
    title: "8 · MONITORING & FEEDBACK",
    subtitle: "Real-Time Oversight & Continuous Improvement",
    color: "#6D28D9",
    bgColor: "#F5F3FF",
    borderColor: "#DDD6FE",
    modules: [
      {
        name: "Telegram Bot Alerts",
        role: "Real-Time Notifications",
        details: [
          "Signal alert: new setup detected with score, entry, stop, target",
          "Execution alert: order filled with price, qty, direction",
          "Stop-loss hit: position closed with P&L",
          "Daily summary: trades taken, win/loss, portfolio value",
          "System health: errors, API failures, missed scans",
        ],
        api: "python-telegram-bot",
        cost: "Free",
        priority: "HIGH",
      },
      {
        name: "Position Tracker",
        role: "Live Portfolio State",
        details: [
          "Real-time position list: symbol, qty, entry, current, unrealized P&L",
          "Per-position risk metrics: distance to stop, R-multiple",
          "Aggregate metrics: total exposure, sector breakdown",
          "Historical position log: all entries/exits with timestamps",
          "Auto-refresh every 60 seconds during market hours",
        ],
        api: "Alpaca Positions API",
        cost: "Free",
        priority: "HIGH",
      },
      {
        name: "P&L Dashboard (Streamlit)",
        role: "Visual Analytics Interface",
        details: [
          "Daily/weekly/monthly P&L curves with drawdown chart",
          "Win rate by pattern type (2-1-2, 3-1-2, etc.)",
          "R:R distribution histogram",
          "Heat map: P&L by day of week and time of day",
          "Backtest vs live performance comparison overlay",
        ],
        api: "Streamlit + Plotly",
        cost: "Free",
        priority: "MEDIUM",
      },
      {
        name: "Trade Journal (Auto)",
        role: "Every Trade Logged Automatically",
        details: [
          "Auto-log: symbol, pattern, direction, entry, exit, P&L, R-multiple",
          "Auto-capture: TF continuity state at time of entry",
          "Auto-capture: volume ratio, sentiment score, VIX level",
          "Screenshot: chart state at entry (via TradingView webhook)",
          "Weekly review report: auto-generated summary of key learnings",
        ],
        api: "PostgreSQL + Jinja2",
        cost: "Free",
        priority: "HIGH",
      },
      {
        name: "Feedback Loop Engine",
        role: "Strategy Self-Improvement",
        details: [
          "Track per-pattern performance over rolling 30-day windows",
          "Auto-disable patterns below 40% win rate threshold",
          "Auto-adjust: widen stops if >60% of stops hit by < 1 ATR",
          "Retrain sentiment model monthly on actual outcome data",
          "Alert if live performance diverges >20% from backtest",
        ],
        api: "Internal + Scheduler",
        cost: "N/A",
        priority: "HIGH",
      },
    ],
  },
];

const FLOW_CONNECTIONS = [
  { from: "data", to: "processing", label: "Raw feeds" },
  { from: "processing", to: "analysis", label: "Clean OHLCV + news" },
  { from: "analysis", to: "signals", label: "Patterns + scores" },
  { from: "signals", to: "validation", label: "Trade ideas" },
  { from: "validation", to: "risk", label: "Validated setups" },
  { from: "risk", to: "execution", label: "Sized orders" },
  { from: "execution", to: "monitoring", label: "Fills + P&L" },
  { from: "monitoring", to: "analysis", label: "Feedback loop" },
];

const SCHEDULE = [
  { time: "04:00 AM", job: "Refresh daily/weekly/monthly bars for full universe", layer: "data" },
  { time: "06:00 AM", job: "SEC EDGAR insider filing scrape", layer: "data" },
  { time: "08:00 AM", job: "FRED macro data + earnings calendar + overnight news", layer: "data" },
  { time: "08:30 AM", job: "Market regime detection (VIX, breadth)", layer: "analysis" },
  { time: "09:00 AM", job: "TF Continuity scan → shortlist 10-30 stocks", layer: "analysis" },
  { time: "09:30 AM", job: "Market open — start WebSocket streaming", layer: "data" },
  { time: "09:35 AM", job: "First actionable signal scan", layer: "signals" },
  { time: "Every 5min", job: "Signal scanner on shortlist (9:35–15:55)", layer: "signals" },
  { time: "Every 15min", job: "Position monitor — trail stops, exit signals", layer: "monitoring" },
  { time: "03:55 PM", job: "Flatten intraday positions (if applicable)", layer: "execution" },
  { time: "04:05 PM", job: "EOD summary — log trades, calculate daily P&L", layer: "monitoring" },
  { time: "04:30 PM", job: "Post-market news scan for next-day catalysts", layer: "data" },
  { time: "11:00 PM", job: "Nightly: DB maintenance, data integrity checks", layer: "processing" },
];

const COSTS = [
  { item: "Polygon.io Starter", monthly: 29, annual: 348, required: true },
  { item: "Lumibot", monthly: 0, annual: 0, required: true },
  { item: "Alpaca (paper + live)", monthly: 0, annual: 0, required: true },
  { item: "FRED API", monthly: 0, annual: 0, required: true },
  { item: "FinViz Elite (optional)", monthly: 39, annual: 468, required: false },
  { item: "TradingView Pro (optional)", monthly: 15, annual: 180, required: false },
  { item: "QuantConnect (optional)", monthly: 20, annual: 240, required: false },
  { item: "VPS Hosting (DigitalOcean)", monthly: 12, annual: 144, required: true },
  { item: "Claude API (sentiment)", monthly: 5, annual: 60, required: false },
];

const TECH_STACK = [
  { category: "Language", tools: "Python 3.11+" },
  { category: "Backtest Framework", tools: "Lumibot + vectorbt" },
  { category: "Broker SDK", tools: "alpaca-py" },
  { category: "Market Data", tools: "Polygon.io (polygon-api-client)" },
  { category: "Database", tools: "PostgreSQL + TimescaleDB" },
  { category: "Cache", tools: "Redis" },
  { category: "Scheduler", tools: "APScheduler" },
  { category: "Technical Indicators", tools: "pandas-ta / TA-Lib" },
  { category: "AI/ML", tools: "Anthropic API + FinBERT" },
  { category: "Dashboard", tools: "Streamlit + Plotly" },
  { category: "Alerts", tools: "python-telegram-bot" },
  { category: "Containerization", tools: "Docker + docker-compose" },
  { category: "Version Control", tools: "Git + GitHub" },
  { category: "Testing", tools: "pytest + coverage" },
];

function PriorityBadge({ priority }) {
  const colors = {
    CRITICAL: { bg: "#DC2626", text: "#fff" },
    HIGH: { bg: "#D97706", text: "#fff" },
    MEDIUM: { bg: "#2563EB", text: "#fff" },
    LOW: { bg: "#6B7280", text: "#fff" },
    FUTURE: { bg: "#7C3AED", text: "#fff" },
  };
  const c = colors[priority] || colors.MEDIUM;
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: "2px 8px", borderRadius: "4px",
      fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px",
    }}>{priority}</span>
  );
}

function ModuleCard({ module, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: "#fff",
        border: `1px solid ${open ? color : "#E5E7EB"}`,
        borderRadius: "8px",
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: open ? `0 0 0 1px ${color}22, 0 4px 12px ${color}11` : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#111" }}>{module.name}</div>
          <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>{module.role}</div>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
          <PriorityBadge priority={module.priority} />
          <span style={{ fontSize: "18px", color: "#9CA3AF", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
        </div>
      </div>
      {open && (
        <div style={{ marginTop: "12px", borderTop: "1px solid #F3F4F6", paddingTop: "12px" }}>
          <ul style={{ margin: 0, padding: "0 0 0 16px", listStyle: "none" }}>
            {module.details.map((d, i) => (
              <li key={i} style={{ fontSize: "12px", color: "#374151", lineHeight: "20px", position: "relative", paddingLeft: "4px", marginBottom: "4px" }}>
                <span style={{ position: "absolute", left: "-14px", color: color }}>›</span>
                {d}
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: "16px", marginTop: "10px", paddingTop: "8px", borderTop: "1px dashed #E5E7EB" }}>
            <span style={{ fontSize: "11px", color: "#9CA3AF" }}>API: <strong style={{ color: "#374151" }}>{module.api}</strong></span>
            <span style={{ fontSize: "11px", color: "#9CA3AF" }}>Cost: <strong style={{ color: "#374151" }}>{module.cost}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}

function LayerSection({ layer }) {
  return (
    <div style={{
      background: layer.bgColor,
      border: `1px solid ${layer.borderColor}`,
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "8px",
          background: layer.color, display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: "14px",
        }}>
          {layer.id === "data" ? "⬇" : layer.id === "processing" ? "⚙" : layer.id === "analysis" ? "🧠" : layer.id === "signals" ? "📡" : layer.id === "validation" ? "✓" : layer.id === "risk" ? "🛡" : layer.id === "execution" ? "⚡" : "📊"}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "16px", color: layer.color, letterSpacing: "0.5px" }}>{layer.title}</div>
          <div style={{ fontSize: "12px", color: "#6B7280" }}>{layer.subtitle}</div>
        </div>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "10px",
      }}>
        {layer.modules.map((m) => (
          <ModuleCard key={m.name} module={m} color={layer.color} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("architecture");
  const requiredCost = COSTS.filter(c => c.required).reduce((sum, c) => sum + c.monthly, 0);
  const fullCost = COSTS.reduce((sum, c) => sum + c.monthly, 0);

  return (
    <div style={{
      fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
      background: "#FAFAFA",
      minHeight: "100vh",
      color: "#111",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        padding: "32px 24px 20px",
        color: "#fff",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", color: "#94A3B8", marginBottom: "8px" }}>
            THE STRAT × ALPACA
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
            Automated Trading System Architecture
          </h1>
          <p style={{ fontSize: "14px", color: "#94A3B8", marginTop: "8px", maxWidth: "700px", lineHeight: 1.5 }}>
            Full pipeline from multi-source data collection through AI analysis, signal generation, backtesting validation, risk management, and automated execution on Alpaca.
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
            {["architecture", "schedule", "costs", "stack"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "8px 16px", borderRadius: "6px",
                  border: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: 600,
                  background: tab === t ? "#fff" : "rgba(255,255,255,0.1)",
                  color: tab === t ? "#0F172A" : "#CBD5E1",
                  transition: "all 0.2s",
                }}
              >
                {t === "architecture" ? "🏗 Architecture" : t === "schedule" ? "⏰ Daily Schedule" : t === "costs" ? "💰 Cost Breakdown" : "🔧 Tech Stack"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {tab === "architecture" && (
          <div>
            <div style={{
              background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px",
              padding: "16px 20px", marginBottom: "20px",
              display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center",
            }}>
              {FLOW_CONNECTIONS.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 700,
                    background: LAYERS.find(l => l.id === c.from)?.color,
                    color: "#fff",
                  }}>
                    {LAYERS.find(l => l.id === c.from)?.title.split("·")[1]?.trim().split(" ")[0]}
                  </span>
                  <span style={{ fontSize: "10px", color: "#9CA3AF" }}>→</span>
                  {i === FLOW_CONNECTIONS.length - 1 && (
                    <span style={{
                      padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 700,
                      background: LAYERS.find(l => l.id === c.to)?.color,
                      color: "#fff",
                    }}>
                      {LAYERS.find(l => l.id === c.to)?.title.split("·")[1]?.trim().split(" ")[0]}
                    </span>
                  )}
                </div>
              ))}
              <span style={{ fontSize: "11px", color: "#6B7280", fontStyle: "italic", marginLeft: "4px" }}>↺ feedback loop</span>
            </div>
            <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "16px" }}>
              Click any module to expand full implementation details, API endpoints, and costs.
            </p>
            {LAYERS.map(layer => (
              <LayerSection key={layer.id} layer={layer} />
            ))}
          </div>
        )}

        {tab === "schedule" && (
          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #E5E7EB", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Daily Operational Schedule (ET)</h2>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6B7280" }}>All times Eastern. System runs Monday–Friday, market days only.</p>
            </div>
            {SCHEDULE.map((s, i) => {
              const layer = LAYERS.find(l => l.id === s.layer);
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "14px 24px",
                  borderBottom: i < SCHEDULE.length - 1 ? "1px solid #F3F4F6" : "none",
                  background: i % 2 === 0 ? "#FAFAFA" : "#fff",
                }}>
                  <div style={{
                    width: "90px", flexShrink: 0,
                    fontWeight: 700, fontSize: "13px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: "#111",
                  }}>{s.time}</div>
                  <div style={{
                    padding: "2px 8px", borderRadius: "4px",
                    background: layer?.color, color: "#fff",
                    fontSize: "10px", fontWeight: 600, flexShrink: 0, width: "80px", textAlign: "center",
                  }}>
                    {layer?.id.toUpperCase()}
                  </div>
                  <div style={{ fontSize: "13px", color: "#374151" }}>{s.job}</div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "costs" && (
          <div>
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #E5E7EB", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Monthly Cost Breakdown</h2>
              </div>
              {COSTS.map((c, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 24px",
                  borderBottom: "1px solid #F3F4F6",
                  background: i % 2 === 0 ? "#FAFAFA" : "#fff",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px",
                      background: c.required ? "#059669" : "#9CA3AF",
                      color: "#fff",
                    }}>{c.required ? "REQ" : "OPT"}</span>
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>{c.item}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "14px", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {c.monthly === 0 ? "FREE" : `$${c.monthly}/mo`}
                  </div>
                </div>
              ))}
              <div style={{ padding: "16px 24px", background: "#F0FDF4", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>Required Only</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#059669" }}>${requiredCost}/mo</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>With All Optionals</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#D97706" }}>${fullCost}/mo</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "stack" && (
          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #E5E7EB", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Technology Stack</h2>
            </div>
            {TECH_STACK.map((t, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center",
                padding: "14px 24px", gap: "24px",
                borderBottom: "1px solid #F3F4F6",
                background: i % 2 === 0 ? "#FAFAFA" : "#fff",
              }}>
                <div style={{ width: "160px", flexShrink: 0, fontSize: "12px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {t.category}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>
                  {t.tools}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
