# The Strat × Alpaca — Full System Architecture

## System Flow

```
DATA COLLECTION → DATA PROCESSING → AI ANALYSIS → SIGNAL GENERATION → VALIDATION → RISK MGMT → EXECUTION → MONITORING
      ↑                                                                                                          │
      └──────────────────────────────────── FEEDBACK LOOP ────────────────────────────────────────────────────────┘
```

---

## Layer 1: Data Collection

### 1.1 Polygon.io — Primary Market Data (CRITICAL)
- **What:** OHLCV bars across all timeframes needed for Strat classification
- **Timeframes:** 1min, 5min, 15min, 30min, 1H, 4H, Daily, Weekly, Monthly
- **Real-time:** WebSocket streaming during market hours for live signal detection
- **Options:** Chain data with strikes, expiries, Greeks, IV for options filter
- **History:** 5yr on Starter plan ($29/mo), 2yr on free tier
- **API:** REST for historical, WebSocket for real-time
- **Library:** `polygon-api-client`
- **Cost:** Free tier (5 calls/min, EOD) → Starter $29/mo (unlimited, 5yr, minute bars)

### 1.2 Alpaca News API — News & Sentiment Feed (HIGH)
- **What:** Real-time news headlines with symbol tagging
- **Use:** Pre-market catalyst detection (earnings, FDA, M&A, guidance)
- **Filters:** By symbol, date range, source, sort order
- **Rate limit:** 200 requests/min on free tier
- **Library:** `alpaca-py` NewsClient
- **Cost:** Free (included with Alpaca account)

### 1.3 FinViz Screener — Universe Filtering (HIGH)
- **What:** Pre-built stock screener for fundamental + technical filters
- **Use:** Daily universe filtering — gap%, volume, float, sector, insider activity
- **Earnings:** Flag upcoming earnings dates to block trades during blackout
- **Export:** Watchlist CSV → ingest into scanner pipeline
- **API:** Scrape (free) or Elite API ($39/mo for real-time + export)
- **Cost:** Free (delayed) or $39/mo (Elite, real-time)

### 1.4 TradingView Webhooks — Alert-Based Signals (MEDIUM)
- **What:** Custom Pine Script alerts for Strat pattern detection
- **Use:** Backup/confirmation signal source alongside programmatic scanners
- **How:** Webhook POST to your server endpoint on alert trigger
- **Alerts:** TF continuity changes, volume spikes, pattern formations
- **Cost:** Free (1 alert) or $15/mo (Pro, multiple alerts)

### 1.5 FRED Economic API — Macro Context (MEDIUM)
- **What:** Federal Reserve economic data series
- **Series:**
  - `VIXCLS` — VIX for volatility regime detection
  - `T10Y2Y` — Yield curve spread (recession signal)
  - `DFF` — Fed Funds Rate (monetary policy)
  - `CPIAUCSL` — CPI (inflation tracking)
  - `UNRATE` — Unemployment rate
- **Refresh:** Daily pre-market at 8:00 AM ET
- **Library:** `fredapi`
- **Cost:** Free

### 1.6 SEC EDGAR — Insider & Institutional Data (LOW)
- **What:** Form 4 (insider trades), 13F (institutional holdings), 8-K (material events)
- **Use:** Cross-reference insider buying with Strat bullish setups for conviction boost
- **Refresh:** Daily scrape at 6:00 AM ET
- **Cost:** Free

---

## Layer 2: Data Processing & Storage

### 2.1 ETL Scheduler — APScheduler (CRITICAL)
Orchestrates all data fetching, processing, and scanning jobs:

| Time (ET) | Job | Layer |
|-----------|-----|-------|
| 04:00 AM | Refresh daily/weekly/monthly bars for full universe | Data |
| 06:00 AM | SEC EDGAR insider filing scrape | Data |
| 08:00 AM | FRED macro + earnings calendar + overnight news | Data |
| 08:30 AM | Market regime detection (VIX, breadth) | Analysis |
| 09:00 AM | TF Continuity scan → shortlist 10-30 stocks | Analysis |
| 09:30 AM | Market open — start WebSocket streaming | Data |
| 09:35 AM | First actionable signal scan | Signals |
| Every 5min | Signal scanner on shortlist (9:35–15:55) | Signals |
| Every 15min | Position monitor — trail stops, check exits | Monitoring |
| 03:55 PM | Flatten intraday positions | Execution |
| 04:05 PM | EOD summary — log trades, daily P&L | Monitoring |
| 04:30 PM | Post-market news scan for next-day catalysts | Data |
| 11:00 PM | Nightly DB maintenance, data integrity checks | Processing |

### 2.2 PostgreSQL + TimescaleDB — Primary Store (CRITICAL)
- **Why TimescaleDB:** Purpose-built for time-series data. Hypertables auto-partition by time.
- **Tables:**
  - `bars_1min`, `bars_5min`, `bars_daily`, etc. — OHLCV hypertables
  - `strat_labels` — Classified candles with scenario/direction/pattern
  - `tf_continuity` — Cached TF alignment states per symbol
  - `signals` — Generated trade ideas with scores
  - `trades` — Executed trades with full metadata
  - `positions` — Current open positions
  - `journal` — Auto-logged trade journal entries
  - `news` — Cached news with sentiment scores
  - `config` — Strategy parameters (enables hot-reload)
- **Retention:** 2yr intraday, unlimited daily/weekly/monthly
- **Cost:** Free (self-hosted Docker)

### 2.3 Redis — Real-Time Cache (HIGH)
- **Current positions and P&L** — sub-millisecond access for risk checks
- **Latest Strat labels** per symbol per timeframe (updated every scan)
- **TF continuity status** — cached boolean per symbol
- **Active signal queue** — pending signals for execution engine
- **Rate limiter counters** for API call management
- **Cost:** Free (self-hosted Docker)

### 2.4 Data Normalizer (HIGH)
- Normalize all sources to unified OHLCV schema: `[timestamp, open, high, low, close, volume]`
- Timezone alignment: all timestamps converted to UTC
- Adjust for splits/dividends on historical Polygon data
- Dedup and gap-fill for missing bars (forward-fill with flag)
- Validate data integrity: no negative prices, no zero volume on active bars

---

## Layer 3: AI Analysis Engine

### 3.1 Strat Classifier — Core Pattern Engine (CRITICAL)

The foundation of the entire system. Classifies every candle and detects multi-candle patterns.

**Candle Classification:**
- **Scenario 1 (Inside Bar):** High ≤ prev_high AND Low ≥ prev_low → Compression
- **Scenario 2U (Up):** High > prev_high AND Low ≥ prev_low → Bullish directional
- **Scenario 2D (Down):** Low < prev_low AND High ≤ prev_high → Bearish directional
- **Scenario 3 (Outside):** High > prev_high AND Low < prev_low → Expansion

**Pattern Detection (applied to labeled candle sequences):**

| Pattern | Sequence | Meaning | Trade Direction |
|---------|----------|---------|-----------------|
| 2-1-2 Continuation | 2U → 1 → 2U | Trend → pause → resume | Same as original 2 |
| 2-1-2 Reversal | 2D → 1 → 2U | Trend → pause → reverse | Opposite of original 2 |
| 3-1-2 | 3 → 1 → 2 | Expansion → compression → breakout | Direction of final 2 |
| 1-2-2 Continuation | 1 → 2U → 2U | Compression → momentum → follow-through | Same direction |
| 1-3 | 1 → 3 | Compression → explosive expansion | Direction of 3's close |
| 2-2 Reversal | 2D → 2U | Directional → opposite directional | Direction of second 2 |

### 3.2 TF Continuity Engine — Alignment Filter (CRITICAL)

**Swing trading timeframes:** Daily + Weekly + Monthly
**Intraday timeframes:** 30min + 1H + 4H

**Rules:**
- ALL higher timeframes must show 2U (for bullish) or 2D (for bearish)
- If ANY higher timeframe shows Scenario 1 → NO TRADE (blocked)
- Direction of ALL must agree — mixed signals = skip
- Output: `{aligned: true, direction: "U", details: {daily: "2U", weekly: "2U", monthly: "2U"}}`

### 3.3 LLM Sentiment Analyzer (HIGH)
- **Primary model:** Claude API (claude-sonnet-4-5-20250929) for headline analysis
- **Fallback:** Local FinBERT for cost-free batch processing
- **Input:** Alpaca news headlines + article summaries for shortlisted symbols
- **Output:** Sentiment score (-1 to +1), confidence level, catalyst type classification
- **Catalyst types:** earnings, FDA/regulatory, M&A, guidance, macro, legal, insider
- **Conflict flag:** Alert if sentiment contradicts technical Strat direction

### 3.4 Technical Scanner — Indicator Overlay (HIGH)
Confirmatory indicators layered on top of Strat pattern detection:

| Indicator | Use | Threshold |
|-----------|-----|-----------|
| RSI(14) | Overbought/oversold at pattern trigger | Skip bullish if RSI > 80, skip bearish if RSI < 20 |
| Volume Ratio | Breakout confirmation | Current bar volume > 1.2× 20-bar average |
| VWAP | Intraday directional bias | Bullish only above VWAP, bearish only below |
| ATR(14) | Dynamic stop-loss sizing | Stop = entry ± 1.5× ATR |
| EMA 9/21 Cross | Trend confirmation | Bullish: EMA9 > EMA21, Bearish: EMA9 < EMA21 |

### 3.5 Options Flow Filter (MEDIUM)
- **IV Rank:** Current IV percentile vs 52-week range → cheap/expensive premiums
- **Unusual activity:** Options volume > open interest → smart money signal
- **Put/Call ratio:** Directional bias confirmation
- **Earnings proximity:** Auto-reject if earnings within expected hold period
- **Strike selection:** ATM or 1-strike OTM for defined-risk plays

### 3.6 Market Regime Detector (MEDIUM)
Classifies the macro environment to adjust strategy parameters:

| VIX Level | Regime | Risk Adjustment |
|-----------|--------|-----------------|
| < 15 | Low vol | Normal risk (1%/trade, 5 positions) |
| 15–25 | Normal | Slightly reduced (0.75%/trade, 4 positions) |
| 25–35 | Elevated | Defensive (0.5%/trade, 3 positions) |
| > 35 | Crisis | Cash preservation (0.25%/trade, 2 positions) |

Also monitors: advance/decline ratio, % universe with bullish TF continuity, correlation regime.

---

## Layer 4: Signal Generation & Scoring

### 4.1 Signal Assembler — Composite Scoring (CRITICAL)

Every potential trade gets a composite score based on weighted factors:

| Factor | Weight | Score Range | How It's Measured |
|--------|--------|-------------|-------------------|
| Strat Pattern Quality | 40% | 0–100 | Pattern type + in-force confirmation |
| TF Continuity | 25% | 0 or 100 | Binary: aligned or not |
| Volume Confirmation | 15% | 0–100 | Volume ratio scaled (1.0x=0, 2.0x+=100) |
| Sentiment Score | 10% | 0–100 | LLM sentiment mapped to 0-100 |
| Options Flow | 10% | 0–100 | IV rank + unusual activity score |

**Minimum threshold:** 65/100 to qualify as tradeable signal.
**Ranking:** Signals sorted by score descending → top 3 per scan cycle.

### 4.2 Trade Plan Generator (CRITICAL)

For every qualifying signal, auto-generates a complete trade plan:

- **Entry:** Breakout price above inside bar high (bullish) or below low (bearish)
- **Stop-loss:** min(ATR-based stop, previous swing low) — whichever is tighter
- **TP1 (conservative):** Nearest prior high/low → minimum 1:1 R:R
- **TP2 (aggressive):** Next resistance/support zone → target 2:1+ R:R
- **Position size:** `shares = (account_equity × risk_pct) / |entry - stop|`
- **Max risk per trade:** 1% of account equity

### 4.3 Conflict Resolver (HIGH)
- Deduplicate: no repeated signals on same symbol within 30 minutes
- Rank competing setups by R:R ratio, then by composite score
- Cap: max 3 simultaneous signals per scan cycle
- Correlation block: skip if Pearson correlation > 0.7 with existing position
- Earnings blackout: auto-reject if earnings within expected holding period

---

## Layer 5: Validation & Backtesting

### 5.1 Lumibot Backtester — Primary Engine (CRITICAL)
- **Why primary:** Same Strategy class runs in both backtest and live mode
- **Data source:** Polygon.io via PolygonDataBacktesting
- **Metrics:** Sharpe ratio, Sortino ratio, max drawdown, win rate, profit factor
- **Fees:** Simulated with TradingFee objects (flat + percentage)
- **Benchmark:** Auto-compare against SPY
- **Output:** HTML tearsheet + CSV trade log

### 5.2 QuantConnect LEAN — Secondary Validation (HIGH)
- **Why secondary:** Cross-validate on independent engine to catch overfitting
- **Specific use cases:**
  - Options strategy backtesting (Lumibot is weak here)
  - Extended history testing (20+ years via QC's data)
  - Parameter optimization with cloud compute
  - Stress-test against 2008, 2020 crash scenarios
- **Cost:** Free tier for backtesting; $20+/mo for live nodes

### 5.3 Walk-Forward Analysis (HIGH)
- **In-sample / out-of-sample split:** 70% train, 30% test
- **Rolling window:** Optimize on 6 months, test on next 2 months, roll forward
- **Degradation threshold:** If out-of-sample performance drops > 20%, flag as overfit
- **Monte Carlo:** 1000 random trade sequence simulations for confidence intervals

### 5.4 Per-Pattern Statistical Validation (HIGH)
- Track win rate for EACH Strat pattern independently
- Require minimum 30 trades per pattern for statistical significance
- Compare: win rate WITH TF continuity filter vs WITHOUT
- **Kill switch:** Auto-disable any pattern dropping below 45% win rate in live

---

## Layer 6: Risk Management

### 6.1 Position Sizer (CRITICAL)
```
shares = (account_equity × max_risk_pct) / |entry_price - stop_price|
```
- Max risk per trade: 1% of account equity (configurable)
- Slippage buffer: add 0.02% to entry price estimate
- Options: max risk = premium paid (defined-risk positions only)

### 6.2 Exposure Manager (CRITICAL)
- Max concurrent positions: 5
- Max total portfolio exposure: 80% of equity
- Max sector concentration: 30% in any single sector
- Correlation check: block if r > 0.7 with existing position
- Daily loss limit: -3% of account → halt ALL new trades for rest of day

### 6.3 Regime Adjuster (HIGH)
Dynamically scales risk based on VIX level and market breadth. See Market Regime Detector in Layer 3 for thresholds.

---

## Layer 7: Execution Engine

### 7.1 Alpaca Paper Trading — Phase 1 (CRITICAL)
- **Bracket orders:** Single API call creates entry + stop-loss + take-profit
- **Order types:**
  - Market orders for breakout entries (speed matters)
  - Limit orders for pullback entries (precision matters)
  - Stop-limit for stop-loss (avoid slippage in fast markets)
- **Paper account:** Simulated fills, same API as live
- **Minimum paper period:** 4 weeks, 100+ trades before live

### 7.2 Alpaca Live Trading — Phase 2 (FUTURE)
- **Same code:** `PAPER=True` → `PAPER=False`, nothing else changes
- **Capital scaling:** Start 25% → 50% → 75% → 100% over 4 months
- **PDT rule:** Need $25K+ for unlimited day trades
- **Commission:** Free for stocks; per-contract fees for options

### 7.3 Order State Machine (HIGH)
- States: `PENDING → SUBMITTED → PARTIAL → FILLED → CLOSED`
- Partial fill handling: adjust position size, recalculate targets
- Rejection handling: log reason, retry with adjusted price
- Timeout: cancel unfilled limit orders after 5 minutes
- EOD: flatten all intraday positions by 3:55 PM ET

---

## Layer 8: Monitoring & Feedback

### 8.1 Telegram Bot Alerts (HIGH)
- **Signal alert:** New setup with score, entry, stop, target, pattern name
- **Fill alert:** Order filled with actual price, qty, direction
- **Stop-loss alert:** Position closed with P&L and R-multiple
- **Daily summary:** Trades taken, win/loss count, portfolio value, drawdown
- **System health:** API errors, missed scans, DB issues

### 8.2 Position Tracker (HIGH)
- Real-time position list: symbol, qty, entry, current price, unrealized P&L
- Per-position risk: distance to stop (%), current R-multiple
- Aggregate: total exposure, sector breakdown, correlation map
- Auto-refresh every 60 seconds during market hours

### 8.3 P&L Dashboard — Streamlit (MEDIUM)
- Daily/weekly/monthly P&L curves with drawdown overlay
- Win rate breakdown by Strat pattern type
- R:R distribution histogram
- P&L heatmap by day-of-week and hour-of-day
- Backtest vs live performance comparison chart

### 8.4 Auto Trade Journal (HIGH)
Every trade auto-logged with:
- Symbol, pattern, direction, composite score
- Entry price, exit price, P&L ($), P&L (%), R-multiple
- TF continuity state at time of entry
- Volume ratio, sentiment score, VIX level at entry
- Hold duration
- Weekly auto-generated review report

### 8.5 Feedback Loop Engine (HIGH)
- Track per-pattern win rate over rolling 30-day windows
- Auto-disable patterns below 40% win rate
- Auto-widen stops if >60% of stops are hit by < 1 ATR
- Monthly sentiment model retraining on actual outcome data
- Alert if live performance diverges >20% from backtest baseline

---

## Cost Summary

| Component | Monthly | Required? |
|-----------|---------|-----------|
| Polygon.io Starter | $29 | Yes |
| Lumibot | Free | Yes |
| Alpaca | Free | Yes |
| FRED API | Free | Yes |
| VPS Hosting | ~$12 | Yes |
| FinViz Elite | $39 | Optional |
| TradingView Pro | $15 | Optional |
| QuantConnect | $20 | Optional |
| Claude API | ~$5 | Optional |
| **Required Total** | **$41/mo** | |
| **Full Stack Total** | **$120/mo** | |

---

## Implementation Roadmap

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1 | Infrastructure | PostgreSQL + Redis + Docker setup, API key configs |
| 2 | Data Pipeline | Polygon fetcher, FRED fetcher, data normalizer, SQLite → Postgres migration |
| 3 | Strat Engine | Candle classifier + pattern detector + unit tests (100% coverage) |
| 4 | TF Continuity | Multi-timeframe alignment checker + backtester v1 on daily data |
| 5 | Lumibot Integration | Strategy class running backtests with Polygon data |
| 6 | Full Backtest | 2-year backtest across S&P 500, per-pattern metrics, walk-forward analysis |
| 7 | Scanners | All 4 scanners operational: TF continuity, signal, position monitor, catalyst |
| 8 | Alpaca Paper | Paper trading connected, bracket orders tested, scheduler running |
| 9 | Monitoring | Telegram alerts + Streamlit dashboard + auto trade journal |
| 10 | Sentiment | LLM sentiment analyzer integrated, composite scoring operational |
| 11-14 | Paper Trading | 4 weeks minimum paper trading with full logging |
| 15 | Evaluation | Statistical review — go/no-go on live capital |

### Go-Live Checklist

- [ ] 100+ paper trades executed
- [ ] Win rate > 50%
- [ ] Profit factor > 1.3
- [ ] Max drawdown < 8%
- [ ] No system crashes for 2+ consecutive weeks
- [ ] Backtest ↔ paper results within 20%
- [ ] All risk controls functioning (stops, limits, daily halt)
- [ ] Telegram alerts working reliably
- [ ] Trade journal complete and accurate

---

*This is an architecture plan, not financial advice. Backtest thoroughly and paper trade extensively before deploying real capital.*
