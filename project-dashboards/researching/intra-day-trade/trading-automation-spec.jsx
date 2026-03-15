import { useState } from "react";

const STRATEGIES = [
  {
    id: "orb",
    name: "Opening Range Breakout",
    abbr: "ORB",
    icon: "🔓",
    color: "#00d4ff",
    origin: "Toby Crabel (1990)",
    automatable: 95,
    winRate: "~55-65%",
    profitFactor: "1.8-2.5",
    holdTime: "1-6 hours",
    rules: {
      setup: "Define high/low of first 15-min (3× 5-min bars) as Opening Range",
      entry: "Buy stop above OR high (sell stop below OR low for shorts)",
      confirmation: [
        "Price above VWAP with positive slope",
        "Breakout bar volume > 1.5× avg 5-min volume",
        "Candle close in upper 30% of bar range",
        "NR7 filter: prior day range is narrowest of last 7 days (7× profit boost)"
      ],
      stop: "Opposite extreme of the opening range",
      targets: [
        "T1: 50% of OR height (scale out 1/3)",
        "T2: 100% of OR height (scale out 1/3)",
        "T3: 200% of OR height or EOD close (final 1/3)"
      ],
      timeStop: "Move to breakeven after 1 hour if T1 not hit. Close all at 3:50 PM.",
      riskReward: "Minimum 2:1 R:R required"
    },
    code: `# ORB Signal Detection (inside on_trading_iteration)
def detect_orb_signal(self, symbol, bars_5min):
    if len(bars_5min) < 4:  # Need 3 bars + current
        return None
    
    # Opening range = first 3 five-minute bars
    or_high = max(bars_5min[:3]['high'])
    or_low = min(bars_5min[:3]['low'])
    or_range = or_high - or_low
    current = bars_5min.iloc[-1]
    
    # NR7 filter on daily bars
    daily = self.get_historical_prices(symbol, 7, "day")
    ranges = daily.df['high'] - daily.df['low']
    nr7 = ranges.iloc[-1] == ranges.min()
    
    # VWAP calculation
    tp = (bars_5min['high'] + bars_5min['low'] + bars_5min['close']) / 3
    vwap = (tp * bars_5min['volume']).cumsum() / bars_5min['volume'].cumsum()
    vwap_slope = vwap.iloc[-1] - vwap.iloc[-3]
    
    # Volume confirmation
    avg_vol = bars_5min['volume'][:3].mean()
    vol_confirm = current['volume'] > avg_vol * 1.5
    
    # Candle strength
    bar_range = current['high'] - current['low']
    candle_strength = (current['close'] - current['low']) / bar_range if bar_range > 0 else 0
    
    if (current['close'] > or_high 
        and current['close'] > vwap.iloc[-1]
        and vwap_slope > 0
        and vol_confirm
        and candle_strength > 0.70):
        return {
            'signal': 'LONG',
            'entry': current['close'],
            'stop': or_low,
            'targets': [
                or_high + or_range * 0.5,
                or_high + or_range * 1.0, 
                or_high + or_range * 2.0
            ],
            'nr7_boost': nr7,
            'confidence': 'HIGH' if nr7 else 'MEDIUM'
        }
    return None`
  },
  {
    id: "vwap",
    name: "VWAP Reclaim",
    abbr: "VWAP",
    icon: "📊",
    color: "#b388ff",
    origin: "Institutional / Prop Trading",
    automatable: 85,
    winRate: "~60-70%",
    profitFactor: "2.0-3.0",
    holdTime: "30 min - 4 hours",
    rules: {
      setup: "Stock with catalyst opens below VWAP after initial sell pressure",
      entry: "Buy when price crosses decisively above VWAP with volume expansion",
      confirmation: [
        "First VWAP touch only (2nd/3rd degrade significantly)",
        "Volume on reclaim bar > 2× average 5-min volume",
        "Price was ≥1.5% below VWAP before reclaim (mid-caps)",
        "Large-caps reverse at ~2% deviation from VWAP"
      ],
      stop: "Below VWAP by 0.5× ATR or below the pre-reclaim low",
      targets: [
        "T1: +1× ATR from entry (scale out 50%)",
        "T2: Day's high or +2× ATR (remaining 50%)"
      ],
      timeStop: "If price re-crosses below VWAP, exit immediately. Close all EOD.",
      riskReward: "Minimum 2:1 R:R, typically achieves 3:1"
    },
    code: `# VWAP Reclaim Signal Detection
def detect_vwap_reclaim(self, symbol, bars_1min):
    if len(bars_1min) < 30:
        return None
    
    # VWAP computation
    tp = (bars_1min['high'] + bars_1min['low'] + bars_1min['close']) / 3
    cum_tp_vol = (tp * bars_1min['volume']).cumsum()
    cum_vol = bars_1min['volume'].cumsum()
    vwap = cum_tp_vol / cum_vol
    
    price = bars_1min['close']
    current_price = price.iloc[-1]
    current_vwap = vwap.iloc[-1]
    
    # Detect cross from below to above over 3-bar window
    was_below = all(price.iloc[-4:-1] < vwap.iloc[-4:-1])
    now_above = current_price > current_vwap
    
    # Max deviation before reclaim
    recent_deviation = ((vwap.iloc[-10:] - price.iloc[-10:]) / vwap.iloc[-10:]).max()
    
    # Count VWAP touches today (only trade first touch)
    crosses = ((price.shift(1) < vwap.shift(1)) & (price > vwap)).sum()
    
    # Volume confirmation
    avg_vol = bars_1min['volume'].rolling(20).mean().iloc[-1]
    vol_expand = bars_1min['volume'].iloc[-1] > avg_vol * 2.0
    
    # ATR for stops/targets
    atr = self.compute_atr(bars_1min, period=14)
    
    if (was_below and now_above 
        and crosses <= 1
        and recent_deviation > 0.015  # Was 1.5%+ below
        and vol_expand):
        return {
            'signal': 'LONG',
            'entry': current_price,
            'stop': current_vwap - (atr * 0.5),
            'targets': [
                current_price + atr,
                current_price + atr * 2
            ],
            'confidence': 'HIGH' if recent_deviation > 0.02 else 'MEDIUM'
        }
    return None`
  },
  {
    id: "dip",
    name: "Morning Dip Reversal",
    abbr: "DIP",
    icon: "📉",
    color: "#69f0ae",
    origin: "Kunal Desai / Bulls on Wall Street",
    automatable: 70,
    winRate: "~50-60%",
    profitFactor: "1.5-2.5",
    holdTime: "30 min - 2 hours",
    rules: {
      setup: "Strong open on heavy volume, then orderly pullback to 9 EMA on 5-min",
      entry: "Buy first candle making new high after pullback touches 9 EMA",
      confirmation: [
        "Volume contracts during pullback (healthy consolidation)",
        "Volume expands on reversal candle",
        "Only trade the FIRST pullback (2nd/3rd degrade)",
        "RSI(2) drops below 20 then crosses back above"
      ],
      stop: "Below the 9 EMA or below the pullback swing low",
      targets: [
        "T1: Re-test of the opening high (scale 50%)",
        "T2: 1.5× the distance from pullback low to opening high"
      ],
      timeStop: "Exit if price stays below 9 EMA for 3+ consecutive bars",
      riskReward: "Target 3:1 R:R minimum"
    },
    code: `# Morning Dip Reversal Signal Detection
def detect_dip_reversal(self, symbol, bars_5min):
    if len(bars_5min) < 10:
        return None
    
    # Calculate 9 EMA
    ema9 = bars_5min['close'].ewm(span=9, adjust=False).mean()
    
    # RSI(2) for oversold detection
    rsi2 = self.compute_rsi(bars_5min['close'], period=2)
    
    # Opening strength: first 2 bars should show strong buying
    open_strength = (bars_5min['close'].iloc[1] > bars_5min['open'].iloc[0])
    open_volume = bars_5min['volume'].iloc[:2].mean()
    
    # Pullback detection: price dipped to touch 9 EMA
    touched_ema = any(bars_5min['low'].iloc[-5:] <= ema9.iloc[-5:] * 1.002)
    
    # Volume contraction during pullback
    recent_vol = bars_5min['volume'].iloc[-3:].mean()
    vol_contracted = recent_vol < open_volume * 0.6
    
    # Reversal candle: current bar makes new high vs prior 2 bars
    current = bars_5min.iloc[-1]
    prior_high = bars_5min['high'].iloc[-3:-1].max()
    new_high = current['high'] > prior_high
    
    # Volume expansion on reversal
    vol_expanding = current['volume'] > recent_vol * 1.5
    
    # RSI bounce from oversold
    rsi_bouncing = rsi2.iloc[-2] < 20 and rsi2.iloc[-1] > 20
    
    # Count pullbacks (only trade first)
    pullback_count = 0
    for i in range(2, len(bars_5min)):
        if bars_5min['low'].iloc[i] <= ema9.iloc[i] * 1.002:
            pullback_count += 1
    
    if (open_strength and touched_ema and vol_contracted 
        and new_high and vol_expanding
        and pullback_count <= 1):
        return {
            'signal': 'LONG',
            'entry': current['close'],
            'stop': min(ema9.iloc[-1], bars_5min['low'].iloc[-3:].min()),
            'targets': [
                bars_5min['high'].iloc[:3].max(),  # Opening high
                current['close'] + 1.5 * (bars_5min['high'].iloc[:3].max() - bars_5min['low'].iloc[-3:].min())
            ],
            'confidence': 'MEDIUM'
        }
    return None`
  },
  {
    id: "gap",
    name: "Gap and Go",
    abbr: "GAP",
    icon: "🚀",
    color: "#ffab40",
    origin: "Ross Cameron / Warrior Trading",
    automatable: 75,
    winRate: "~50%",
    profitFactor: "1.8-2.2",
    holdTime: "15 min - 2 hours",
    rules: {
      setup: "Stock gaps up ≥4% on news catalyst with pre-market vol ≥ 2× ADV",
      entry: "Buy first candle printing new high after 2-3 red pullback candles in first 15 min",
      confirmation: [
        "Gap ≥ 4% with identifiable catalyst (earnings, news, FDA)",
        "Pre-market volume ≥ 2× average daily volume",
        "Price $2-$20 with float < 50M shares (ideal)",
        "Pullback holds above VWAP or pre-market support"
      ],
      stop: "Below the pullback low or below VWAP",
      targets: [
        "T1: Pre-market high (scale out 50%)",
        "T2: 2× the gap distance from entry"
      ],
      timeStop: "If no follow-through within 30 min of entry, exit at market",
      riskReward: "Minimum 2:1 R:R"
    },
    code: `# Gap and Go Pre-Market Scanner + Signal
def scan_gap_candidates(self, polygon_client):
    """Run at 6:00 AM ET via cron"""
    snapshots = polygon_client.get_snapshot_all("stocks")
    candidates = []
    
    for snap in snapshots:
        if not snap.prev_day or not snap.day:
            continue
        
        prev_close = snap.prev_day.close
        current = snap.day.open or snap.min.close
        gap_pct = (current - prev_close) / prev_close * 100
        
        if (gap_pct >= 4.0
            and current > 2.0 and current < 20.0
            and snap.day.volume > snap.prev_day.volume * 0.5
            and snap.min.accumulated_volume > 50000):
            candidates.append({
                'symbol': snap.ticker,
                'gap_pct': gap_pct,
                'price': current,
                'pm_volume': snap.min.accumulated_volume,
                'prev_close': prev_close
            })
    
    # Store in Redis
    for c in candidates:
        redis.sadd('premarket_gappers', c['symbol'])
        redis.hset(f"gap:{c['symbol']}", mapping=c)
    
    return candidates`
  },
  {
    id: "rsi2",
    name: "Connors RSI-2 Mean Reversion",
    abbr: "RSI2",
    icon: "🔄",
    color: "#ff6b6b",
    origin: "Larry Connors (2004)",
    automatable: 98,
    winRate: "~75-90%",
    profitFactor: "2.08",
    holdTime: "1-5 days",
    rules: {
      setup: "Price above 200 SMA (uptrend filter), RSI(2) drops below 10",
      entry: "Buy at close when RSI(2) < 10 (aggressive: < 5)",
      confirmation: [
        "Price must be above 200-day SMA (trend filter mandatory)",
        "RSI(2) < 10 for standard, < 5 for aggressive entries",
        "R3 variant: add 200 SMA slope > 0 and ConnorsRSI composite",
        "Works best on broad ETFs (SPY, QQQ, IWM) and liquid large-caps"
      ],
      stop: "Connors recommends NO stop (controversial). Safe version: 3× ATR(14)",
      targets: [
        "Exit when price crosses ABOVE 5-day SMA (primary rule)",
        "Alternative: exit when RSI(2) > 70"
      ],
      timeStop: "Exit after 5 trading days regardless of P&L",
      riskReward: "Win rate compensates for occasional larger losses. Profit factor ~2.08"
    },
    code: `# Connors RSI-2 Mean Reversion Strategy
def detect_rsi2_signal(self, symbol, daily_bars):
    if len(daily_bars) < 201:
        return None
    
    close = daily_bars['close']
    
    # 200-day SMA trend filter
    sma200 = close.rolling(200).mean().iloc[-1]
    if close.iloc[-1] <= sma200:
        return None  # Only trade in uptrends
    
    # 2-period RSI
    delta = close.diff()
    gain = delta.where(delta > 0, 0).rolling(2).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(2).mean()
    rs = gain / loss
    rsi2 = 100 - (100 / (1 + rs))
    
    # 5-day SMA for exit
    sma5 = close.rolling(5).mean()
    
    current_rsi = rsi2.iloc[-1]
    
    # Entry signal
    if current_rsi < 10:
        atr = self.compute_atr(daily_bars, 14)
        return {
            'signal': 'LONG',
            'entry': close.iloc[-1],
            'stop': close.iloc[-1] - (atr * 3),  # Safety stop
            'exit_condition': 'close > SMA(5)',
            'current_sma5': sma5.iloc[-1],
            'confidence': 'HIGH' if current_rsi < 5 else 'MEDIUM',
            'max_hold_days': 5
        }
    
    # Exit signal for open positions
    if close.iloc[-1] > sma5.iloc[-1]:
        return {'signal': 'EXIT'}
    
    return None`
  }
];

const RISK_PIPELINE = [
  {
    gate: "Account Gate",
    icon: "🏦",
    color: "#ff6b6b",
    checks: [
      { rule: "Daily P&L < -5%", action: "HALT all trading", severity: "critical" },
      { rule: "Daily P&L < -3%", action: "High-conviction only", severity: "warning" },
      { rule: "Daily P&L < -2%", action: "Reduce size 50%", severity: "caution" },
      { rule: "3 consecutive losses", action: "Reduce size 50%", severity: "warning" },
      { rule: "5 consecutive losses", action: "HALT for day", severity: "critical" }
    ]
  },
  {
    gate: "Position Sizing",
    icon: "📏",
    color: "#ffab40",
    checks: [
      { rule: "shares = (equity × risk%) ÷ (entry - stop)", action: "Core formula", severity: "info" },
      { rule: "ATR stop: entry - (ATR × 1.5-2.0)", action: "Dynamic stop distance", severity: "info" },
      { rule: "Half-Kelly ceiling", action: "K = 0.5 × [W - (1-W)/R]", severity: "caution" },
      { rule: "Max 20% equity per position", action: "Hard cap regardless", severity: "warning" },
      { rule: "Max 60% total deployed capital", action: "Cash reserve maintained", severity: "warning" }
    ]
  },
  {
    gate: "Correlation Check",
    icon: "🔗",
    color: "#b388ff",
    checks: [
      { rule: "30-day rolling Pearson > 0.70", action: "Positions flagged correlated", severity: "warning" },
      { rule: "Correlated group risk > 3%", action: "REJECT new entry", severity: "critical" },
      { rule: "Same sector > 30% equity", action: "REJECT new entry", severity: "critical" },
      { rule: "Total open positions > 8", action: "REJECT new entry", severity: "critical" },
      { rule: "Correlation cached in Redis", action: "1-hour TTL, auto-refresh", severity: "info" }
    ]
  },
  {
    gate: "Order Validation",
    icon: "✅",
    color: "#69f0ae",
    checks: [
      { rule: "Stop-loss attached", action: "REQUIRED — no exceptions", severity: "critical" },
      { rule: "R:R ratio ≥ 2:1", action: "REJECT if below threshold", severity: "warning" },
      { rule: "Bid-ask spread < 0.5%", action: "REJECT illiquid names", severity: "warning" },
      { rule: "Bar volume > 10K shares", action: "Minimum liquidity check", severity: "caution" },
      { rule: "Slippage estimate added", action: "σ × √(size/volume) model", severity: "info" }
    ]
  }
];

const TECH_STACK = [
  { category: "Execution", tools: ["Alpaca API (commission-free)", "Bracket + Trailing Orders", "WebSocket TradingStream"], color: "#69f0ae" },
  { category: "Framework", tools: ["Lumibot (lifecycle engine)", "sleeptime=30S iterations", "before/on/after methods"], color: "#00d4ff" },
  { category: "Data", tools: ["Polygon.io (1-min bars)", "Snapshot API (pre-market)", "pandas-ta (indicators)"], color: "#b388ff" },
  { category: "State", tools: ["Redis (P&L, candidates)", "SADD / HINCRBYFLOAT", "Key expiry for daily reset"], color: "#ff6b6b" },
  { category: "Storage", tools: ["TimescaleDB (trade journal)", "Feather cache (backtest)", "PostgreSQL (config)"], color: "#ffab40" },
  { category: "Monitoring", tools: ["Telegram Bot (alerts)", "React + Recharts (dashboard)", "Tradezella (journaling)"], color: "#e0e0e0" },
  { category: "Backtest", tools: ["VectorBT (fast scan)", "Lumibot PolygonData", "Monte Carlo (1000 sims)"], color: "#40c4ff" },
  { category: "Infra", tools: ["Docker containers", "tmux + Tailscale (remote)", "Cron (scheduled tasks)"], color: "#ff80ab" }
];

const SCHEDULE = [
  { time: "6:00 AM", phase: "Pre-Market Scan", desc: "Cron triggers Polygon snapshot + TV screener → Redis", color: "#00d4ff", auto: true },
  { time: "9:25 AM", phase: "Bot Startup", desc: "Lumibot initializes, loads candidates from Redis, computes baselines", color: "#69f0ae", auto: true },
  { time: "9:30 AM", phase: "Market Open", desc: "Opening range forms (first 15 min), no trades during this window", color: "#ffab40", auto: true },
  { time: "9:45 AM", phase: "Signal Window Opens", desc: "ORB/Gap-Go/VWAP signals evaluated every 30 seconds", color: "#b388ff", auto: true },
  { time: "10:00-11:30", phase: "Prime Trading Window", desc: "Highest probability window. Dip reversals and VWAP reclaims peak here", color: "#69f0ae", auto: true },
  { time: "11:30-2:00", phase: "Midday Chop", desc: "Reduced activity. Only RSI-2 swing entries. Manage trailing stops on AM trades", color: "#ff6b6b", auto: true },
  { time: "2:00-3:30", phase: "Afternoon Momentum", desc: "Late-day continuation moves. Tighten stops on all open intraday positions", color: "#ffab40", auto: true },
  { time: "3:50 PM", phase: "Lumibot Close", desc: "before_market_closes() flattens all intraday positions", color: "#ff6b6b", auto: true },
  { time: "3:55 PM", phase: "Safety Cron", desc: "Independent failsafe: close_all_positions(cancel_orders=True)", color: "#ff1744", auto: true },
  { time: "4:00 PM", phase: "Logging", desc: "P&L summary to TimescaleDB + Telegram notification", color: "#e0e0e0", auto: true },
  { time: "Evening", phase: "Weekly Review", desc: "15-30 min/week: review Tradezella journal, adjust parameters", color: "#b388ff", auto: false }
];

const BACKTEST_STEPS = [
  { step: 1, name: "Data Collection", desc: "Polygon.io 1-min bars → TimescaleDB. Use shinathan/polygon.io-stock-database pipeline. Avoid survivorship bias.", metric: "2+ years, all US stocks" },
  { step: 2, name: "Fast Parameter Scan", desc: "VectorBT (NumPy-vectorized) to test parameter ranges. 100-1000× faster than event-driven.", metric: "Hours, not days" },
  { step: 3, name: "Realistic Backtest", desc: "Lumibot PolygonDataBacktesting with manual slippage model. Large-cap: $0.02-0.04/share. Small-cap: $0.10-0.50/share.", metric: "Match live costs" },
  { step: 4, name: "Walk-Forward Analysis", desc: "6-month train / 3-month test, rolling windows. Walk-Forward Efficiency > 0.4. 70%+ OOS segments profitable.", metric: "WFE > 0.4" },
  { step: 5, name: "Monte Carlo Stress Test", desc: "1000 reshuffled trade sequences. 95th percentile max DD < 2× backtest DD. Skip 10-15% trades randomly for fragility.", metric: "1000 simulations" },
  { step: 6, name: "Statistical Validation", desc: "t = SR × √n > 1.96 for 95% confidence. Deflated Sharpe Ratio to correct for multiple testing. Min 200-500 trades.", metric: "200+ trades" },
  { step: 7, name: "Paper Trading", desc: "Alpaca paper account. 100+ live trades minimum across multiple market conditions before real capital.", metric: "100+ paper trades" }
];

const SeverityDot = ({ severity }) => {
  const colors = { critical: "#ff1744", warning: "#ffab40", caution: "#ffd740", info: "#69f0ae" };
  return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", backgroundColor: colors[severity] || "#666", marginRight: 8 }} />;
};

const ProgressBar = ({ value, color }) => (
  <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
    <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
  </div>
);

export default function TradingAutomationSpec() {
  const [activeTab, setActiveTab] = useState("strategies");
  const [activeStrategy, setActiveStrategy] = useState("orb");
  const [showCode, setShowCode] = useState(false);

  const tabs = [
    { id: "strategies", label: "Strategies", icon: "📈" },
    { id: "risk", label: "Risk Pipeline", icon: "🛡️" },
    { id: "schedule", label: "Daily Schedule", icon: "⏰" },
    { id: "stack", label: "Tech Stack", icon: "🔧" },
    { id: "backtest", label: "Backtest Pipeline", icon: "🧪" }
  ];

  const strategy = STRATEGIES.find(s => s.id === activeStrategy);

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      background: "#0a0a0f",
      color: "#e0e0e0",
      minHeight: "100vh",
      padding: 0,
      margin: 0,
      fontSize: 13,
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)",
        borderBottom: "1px solid rgba(0,212,255,0.2)",
        padding: "20px 24px 16px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #00d4ff, #b388ff, #69f0ae, #ffab40, #ff6b6b)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px", background: "linear-gradient(135deg, #00d4ff, #b388ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Morning Trading Automation System
          </h1>
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 11, color: "#8b949e", letterSpacing: "0.5px" }}>
          ALPACA + LUMIBOT + POLYGON.IO + REDIS — HANDS-OFF 9-TO-5 ARCHITECTURE
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: "flex",
        gap: 2,
        padding: "0 16px",
        background: "#0d1117",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        overflowX: "auto"
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 14px",
              background: activeTab === tab.id ? "rgba(0,212,255,0.1)" : "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #00d4ff" : "2px solid transparent",
              color: activeTab === tab.id ? "#00d4ff" : "#8b949e",
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "inherit",
              fontWeight: activeTab === tab.id ? 600 : 400,
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              transition: "all 0.2s"
            }}
          >
            <span style={{ fontSize: 13 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>
        {/* ===== STRATEGIES TAB ===== */}
        {activeTab === "strategies" && (
          <div>
            {/* Strategy Selector */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {STRATEGIES.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setActiveStrategy(s.id); setShowCode(false); }}
                  style={{
                    padding: "8px 14px",
                    background: activeStrategy === s.id ? `${s.color}18` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${activeStrategy === s.id ? s.color : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 6,
                    color: activeStrategy === s.id ? s.color : "#8b949e",
                    cursor: "pointer",
                    fontSize: 11,
                    fontFamily: "inherit",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s"
                  }}
                >
                  <span>{s.icon}</span>
                  {s.abbr}
                </button>
              ))}
            </div>

            {strategy && (
              <div style={{
                background: "#0d1117",
                border: `1px solid ${strategy.color}30`,
                borderRadius: 8,
                overflow: "hidden"
              }}>
                {/* Strategy Header */}
                <div style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${strategy.color}20`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 12
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 20 }}>{strategy.icon}</span>
                      <h2 style={{ margin: 0, fontSize: 16, color: strategy.color, fontWeight: 700 }}>{strategy.name}</h2>
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: "#8b949e" }}>Origin: {strategy.origin}</p>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {[
                      { label: "Win Rate", value: strategy.winRate },
                      { label: "Profit Factor", value: strategy.profitFactor },
                      { label: "Hold Time", value: strategy.holdTime }
                    ].map(stat => (
                      <div key={stat.label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: strategy.color }}>{stat.value}</div>
                        <div style={{ fontSize: 9, color: "#8b949e", textTransform: "uppercase", letterSpacing: 1 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automatable bar */}
                <div style={{ padding: "10px 20px", borderBottom: `1px solid ${strategy.color}15` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 10 }}>
                    <span style={{ color: "#8b949e" }}>AUTOMATION FEASIBILITY</span>
                    <span style={{ color: strategy.color, fontWeight: 700 }}>{strategy.automatable}%</span>
                  </div>
                  <ProgressBar value={strategy.automatable} color={strategy.color} />
                </div>

                {/* Rules */}
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "grid", gap: 12 }}>
                    {[
                      { label: "SETUP", value: strategy.rules.setup },
                      { label: "ENTRY", value: strategy.rules.entry },
                      { label: "STOP-LOSS", value: strategy.rules.stop },
                      { label: "TIME STOP", value: strategy.rules.timeStop },
                      { label: "R:R", value: strategy.rules.riskReward }
                    ].map(rule => (
                      <div key={rule.label}>
                        <span style={{ fontSize: 9, color: strategy.color, fontWeight: 700, letterSpacing: 1.5 }}>{rule.label}</span>
                        <p style={{ margin: "2px 0 0", fontSize: 12, lineHeight: 1.5 }}>{rule.value}</p>
                      </div>
                    ))}

                    <div>
                      <span style={{ fontSize: 9, color: strategy.color, fontWeight: 700, letterSpacing: 1.5 }}>CONFIRMATION FILTERS</span>
                      <div style={{ marginTop: 4 }}>
                        {strategy.rules.confirmation.map((c, i) => (
                          <div key={i} style={{ fontSize: 11, padding: "3px 0", display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.4 }}>
                            <span style={{ color: strategy.color, flexShrink: 0 }}>▸</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: 9, color: strategy.color, fontWeight: 700, letterSpacing: 1.5 }}>PROFIT TARGETS</span>
                      <div style={{ marginTop: 4 }}>
                        {strategy.rules.targets.map((t, i) => (
                          <div key={i} style={{ fontSize: 11, padding: "3px 0", display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.4 }}>
                            <span style={{ color: "#69f0ae", flexShrink: 0 }}>◆</span>
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Code Toggle */}
                  <button
                    onClick={() => setShowCode(!showCode)}
                    style={{
                      marginTop: 16,
                      padding: "8px 16px",
                      background: showCode ? `${strategy.color}20` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${strategy.color}40`,
                      borderRadius: 6,
                      color: strategy.color,
                      cursor: "pointer",
                      fontSize: 11,
                      fontFamily: "inherit",
                      fontWeight: 600,
                      transition: "all 0.2s"
                    }}
                  >
                    {showCode ? "▾ Hide" : "▸ Show"} Python Implementation
                  </button>

                  {showCode && (
                    <pre style={{
                      marginTop: 12,
                      padding: 16,
                      background: "#010409",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 6,
                      overflow: "auto",
                      fontSize: 11,
                      lineHeight: 1.6,
                      color: "#c9d1d9",
                      maxHeight: 500
                    }}>
                      <code>{strategy.code}</code>
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== RISK PIPELINE TAB ===== */}
        {activeTab === "risk" && (
          <div>
            <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 16, padding: "10px 14px", background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)", borderRadius: 6 }}>
              ⚠️ Every signal must pass ALL 4 gates sequentially before any order reaches Alpaca. A single gate failure blocks the trade.
            </div>

            {/* Position Sizing Formula */}
            <div style={{
              background: "#0d1117",
              border: "1px solid rgba(255,171,64,0.2)",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              textAlign: "center"
            }}>
              <div style={{ fontSize: 9, color: "#ffab40", fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>CORE POSITION SIZING FORMULA</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>
                shares = <span style={{ color: "#69f0ae" }}>(equity × risk%)</span> ÷ <span style={{ color: "#ff6b6b" }}>(entry − stop)</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: "#8b949e" }}>
                $100K account × 1% risk = $1,000 max loss → Entry $50, Stop $48 = <span style={{ color: "#00d4ff", fontWeight: 700 }}>500 shares</span>
              </div>
            </div>

            {/* Gate Pipeline */}
            <div style={{ display: "grid", gap: 12 }}>
              {RISK_PIPELINE.map((gate, gi) => (
                <div key={gi} style={{
                  background: "#0d1117",
                  border: `1px solid ${gate.color}25`,
                  borderRadius: 8,
                  overflow: "hidden"
                }}>
                  <div style={{
                    padding: "12px 16px",
                    borderBottom: `1px solid ${gate.color}15`,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: `${gate.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14
                    }}>{gate.icon}</div>
                    <div>
                      <span style={{ fontSize: 10, color: gate.color, fontWeight: 700, letterSpacing: 1.5 }}>GATE {gi + 1}</span>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{gate.gate}</div>
                    </div>
                    {gi < RISK_PIPELINE.length - 1 && (
                      <span style={{ marginLeft: "auto", color: "#8b949e", fontSize: 16 }}>→</span>
                    )}
                  </div>
                  <div style={{ padding: "8px 16px 12px" }}>
                    {gate.checks.map((check, ci) => (
                      <div key={ci} style={{
                        display: "flex",
                        alignItems: "flex-start",
                        padding: "6px 0",
                        borderBottom: ci < gate.checks.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                        gap: 8,
                        fontSize: 11
                      }}>
                        <SeverityDot severity={check.severity} />
                        <span style={{ flex: 1, color: "#c9d1d9" }}>{check.rule}</span>
                        <span style={{ color: "#8b949e", fontSize: 10, textAlign: "right", flexShrink: 0, maxWidth: 160 }}>{check.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== SCHEDULE TAB ===== */}
        {activeTab === "schedule" && (
          <div>
            <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 16, padding: "10px 14px", background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 6 }}>
              🤖 All phases are fully automated except the weekly review. Total hands-on time: 15-30 min/week.
            </div>

            <div style={{ position: "relative" }}>
              {/* Timeline line */}
              <div style={{ position: "absolute", left: 15, top: 20, bottom: 20, width: 2, background: "rgba(255,255,255,0.06)" }} />

              {SCHEDULE.map((s, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 16,
                  marginBottom: 4,
                  padding: "8px 0",
                  position: "relative"
                }}>
                  {/* Dot */}
                  <div style={{
                    width: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    zIndex: 1
                  }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: s.color,
                      boxShadow: `0 0 8px ${s.color}40`
                    }} />
                  </div>

                  {/* Content */}
                  <div style={{
                    flex: 1,
                    background: "#0d1117",
                    border: `1px solid ${s.color}20`,
                    borderRadius: 6,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    flexWrap: "wrap"
                  }}>
                    <div style={{ minWidth: 80 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.time}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{s.phase}</div>
                      <div style={{ fontSize: 11, color: "#8b949e", lineHeight: 1.4 }}>{s.desc}</div>
                    </div>
                    <span style={{
                      fontSize: 9,
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: s.auto ? "rgba(105,240,174,0.1)" : "rgba(179,136,255,0.1)",
                      color: s.auto ? "#69f0ae" : "#b388ff",
                      border: `1px solid ${s.auto ? "#69f0ae" : "#b388ff"}30`,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      flexShrink: 0
                    }}>
                      {s.auto ? "AUTO" : "MANUAL"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TECH STACK TAB ===== */}
        {activeTab === "stack" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {TECH_STACK.map((cat, i) => (
              <div key={i} style={{
                background: "#0d1117",
                border: `1px solid ${cat.color}25`,
                borderRadius: 8,
                padding: "14px 16px",
                borderTop: `3px solid ${cat.color}`
              }}>
                <div style={{
                  fontSize: 10,
                  color: cat.color,
                  fontWeight: 700,
                  letterSpacing: 2,
                  marginBottom: 10,
                  textTransform: "uppercase"
                }}>{cat.category}</div>
                {cat.tools.map((tool, ti) => (
                  <div key={ti} style={{
                    fontSize: 11,
                    padding: "4px 0",
                    color: "#c9d1d9",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                    <span style={{ color: cat.color, fontSize: 8 }}>●</span>
                    {tool}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ===== BACKTEST TAB ===== */}
        {activeTab === "backtest" && (
          <div>
            <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 16, padding: "10px 14px", background: "rgba(64,196,255,0.06)", border: "1px solid rgba(64,196,255,0.15)", borderRadius: 6 }}>
              🧪 Every strategy must survive this full pipeline before real capital. No shortcuts.
            </div>

            {BACKTEST_STEPS.map((step, i) => (
              <div key={i} style={{
                display: "flex",
                gap: 14,
                marginBottom: 10,
                alignItems: "stretch"
              }}>
                {/* Step number */}
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `rgba(64,196,255,${0.08 + i * 0.03})`,
                  border: "1px solid rgba(64,196,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#40c4ff",
                  flexShrink: 0
                }}>
                  {step.step}
                </div>

                {/* Content */}
                <div style={{
                  flex: 1,
                  background: "#0d1117",
                  border: "1px solid rgba(64,196,255,0.12)",
                  borderRadius: 6,
                  padding: "12px 16px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{step.name}</div>
                      <div style={{ fontSize: 11, color: "#8b949e", lineHeight: 1.5 }}>{step.desc}</div>
                    </div>
                    <span style={{
                      fontSize: 9,
                      padding: "3px 10px",
                      background: "rgba(64,196,255,0.08)",
                      border: "1px solid rgba(64,196,255,0.2)",
                      borderRadius: 4,
                      color: "#40c4ff",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      letterSpacing: 0.5
                    }}>{step.metric}</span>
                  </div>
                </div>

                {/* Connector */}
                {i < BACKTEST_STEPS.length - 1 && (
                  <div style={{
                    position: "absolute",
                    left: 33,
                    marginTop: 36,
                    height: 10,
                    width: 2,
                    background: "rgba(64,196,255,0.15)"
                  }} />
                )}
              </div>
            ))}

            {/* Key Metrics */}
            <div style={{
              marginTop: 16,
              background: "#0d1117",
              border: "1px solid rgba(255,107,107,0.2)",
              borderRadius: 8,
              padding: 16
            }}>
              <div style={{ fontSize: 10, color: "#ff6b6b", fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
                STATISTICAL THRESHOLDS — NON-NEGOTIABLE
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
                {[
                  { label: "Minimum Trades", value: "200-500", desc: "Across multiple market regimes" },
                  { label: "Walk-Forward Efficiency", value: "> 0.40", desc: "OOS ÷ IS performance ratio" },
                  { label: "OOS Win Rate", value: "70%+ segments", desc: "Majority of OOS windows profitable" },
                  { label: "Sharpe Significance", value: "SR × √n > 1.96", desc: "95% confidence threshold" },
                  { label: "Monte Carlo DD", value: "< 2× backtest", desc: "95th percentile max drawdown" },
                  { label: "Fragility Test", value: "Skip 15% trades", desc: "Performance survives missed entries" }
                ].map((m, i) => (
                  <div key={i} style={{
                    padding: 10,
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.04)"
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#ff6b6b" }}>{m.value}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, marginTop: 2 }}>{m.label}</div>
                    <div style={{ fontSize: 9, color: "#8b949e", marginTop: 2 }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        fontSize: 9,
        color: "#484f58",
        textAlign: "center",
        letterSpacing: 0.5
      }}>
        THIS IS ANALYSIS, NOT FINANCIAL ADVICE. CONFIRM WITH YOUR OWN DUE DILIGENCE BEFORE EXECUTING. PAPER TRADE FIRST.
      </div>
    </div>
  );
}
