# Automating morning breakout and dip-buy strategies

**Nine documented intraday strategies match the pattern of morning-session entries with same-day or next-day exits, and all can be automated with Python using Alpaca for execution and Polygon.io for data.** The strongest quantitative evidence supports the Opening Range Breakout (ORB), VWAP-based entries, and Connors' RSI-2 mean reversion—each with backtested profit factors above 2.0 and decades of practitioner use. Building a hands-off system around these strategies is feasible with Lumibot's lifecycle methods, Alpaca's native bracket orders, and a Redis-backed risk layer, though realistic backtesting with proper slippage modeling and walk-forward validation is essential before deploying capital.

---

## The nine strategies and what the evidence actually says

### Opening Range Breakout (ORB)

Developed by **Toby Crabel** in the 1980s and documented in his rare 1990 book *Day Trading with Short Term Price Patterns and Opening Range Breakout*, ORB defines the high and low of the first 5–30 minutes as breakout levels. The standard entry places a buy stop above the opening range high and a protective stop at the opposite extreme. Crabel's key discovery was that breakouts after a **Narrow Range 7 (NR7)** day—where the prior day's range is the narrowest of the last seven sessions—produced **7× the profit potential** of unfiltered breakouts. A 42-market backtest spanning 1980–present generated over 6,190 trades with positive average profit when filtered by NR7 patterns and day-of-week effects. Without filters, raw ORB produces many trades but marginal edge net of costs.

The most common retail implementation uses 15-minute opening ranges on 5-minute charts. Profit targets sit at 50%, 100%, and 200% extensions of the range. A time stop moves the position to breakeven within one hour, with full close at session end. ORB is the single most automatable strategy in this set because its rules are entirely mechanical.

### Gap and Go

Popularized by **Ross Cameron** of Warrior Trading, Gap and Go screens for stocks gapping up **≥4%** on a news catalyst with pre-market volume at least 2× average daily volume. The sweet spot is $2–$20 stocks with low float. Entry comes on the first pullback after the opening surge—buying the first candle that prints a new high after 2–3 red candles, typically within the first 15 minutes. Stops go below the pullback low or below VWAP, targeting a minimum **2:1 reward-to-risk ratio**.

Cameron reports roughly **50% win rate** with larger average winners than losers. No independently verified backtest exists because the strategy is discretionary, but the pre-market screening criteria are fully automatable via Polygon.io's snapshot API.

### Morning Dip Buy (First Pullback)

Taught by **Kunal Desai** of Bulls on Wall Street and adapted by Timothy Sykes for penny stocks, this strategy waits for a strong opening push on heavy volume, then buys the first orderly pullback into the **9 EMA on the 5-minute chart**. Volume should contract during the pullback (healthy consolidation) and expand on the bounce. Only the first pullback is traded—second and third pullbacks show degraded probability.

Stop placement sits just below the 9 EMA or the pullback low, targeting **3:1 reward-to-risk**. Holding period runs 30 minutes to 2 hours. The key automation challenge is defining "orderly" pullback programmatically—volume contraction plus controlled drift toward EMA without panic wicks.

### VWAP Reclaim

Institutional in origin, the VWAP reclaim strategy was adapted for retail by Cameron, Humbled Trader, and prop trading communities. The setup requires a catalyst-driven stock trading below VWAP after the open, then breaking decisively above VWAP with volume confirmation. The first VWAP test is highest probability; the third or later degrades significantly. Best setups occur mid-morning after the initial chaos clears.

A ChartWatcher study applying VWAP-based day trading to QQQ/TQQQ from January 2018 to September 2023 reported a **671% return on $25,000 with a Sharpe ratio of 2.1**, significantly outperforming buy-and-hold. Large-cap stocks tend to reverse at **2% deviation from VWAP**, mid-caps at 1.5%—useful thresholds for automated detection.

### Mean Reversion (Connors RSI-2)

**Larry Connors'** 2-period RSI strategy is the most rigorously backtested approach in this set. The rules: price must be above the 200-day SMA (trend filter), then buy when the 2-period RSI drops below 10 and exit when price crosses above the 5-day SMA. On SPY since 1993, this has produced roughly **90% win rate** across 79 trades. The R3 variant tested across 25 ETFs from 2000–2020 generated 992 trades with a **75% win rate and profit factor of 2.08**.

Originally designed for daily timeframes, adaptations to 30-minute intraday charts show positive results but require additional noise filters. Connors controversially recommends against stop-losses, as his backtesting showed they hurt performance—a position that demands careful evaluation for automated systems where gap risk is real.

### Red to Green Move, ABCD Pattern, and Bull Flag Breakout

The **Red to Green** strategy, popularized by @TraderStewie, triggers when a stock that closed strong the prior day opens slightly red (below prior close) then crosses back above that level—a cleanly defined mechanical trigger. The **ABCD pattern**, rooted in Gartley's 1935 harmonic analysis, buys at point C (a Fibonacci pullback of 38.2–61.8%) or on the breakout above point B. The **Bull Flag** buys the first candle making a new high after a consolidation pullback on declining volume.

All three lack rigorous independent backtests but are widely used by prop traders for their tight risk definition. The bull flag and ABCD are particularly suited to automation because their geometric rules (flag height projection, Fibonacci ratios) translate directly to code.

### What academic research confirms

The strongest academic evidence comes from **Gao, Han, Li, and Zhou (2018)** in the *Journal of Financial Economics*, documenting that the first half-hour return (9:30–10:00 AM) positively predicts the last half-hour return with an in-sample R² of 1.6%—extremely high for short-horizon prediction. On FOMC days, R² reaches **11.0%** and annualized return hits 20%. Zarattini, Aziz, and Barbon (2024) from the Swiss Finance Institute demonstrated an intraday SPY momentum strategy with dynamic trailing stops producing **1,985% total return from 2007–2024, annualized at 19.6% with a Sharpe of 1.33**.

---

## Building the automation pipeline

### Architecture for hands-off 9-to-5 trading

The system breaks into four scheduled components running on a cloud server:

**Pre-market scanner (6:00–9:25 AM ET)**: A cron job starts the scanner using Polygon.io's `get_snapshot_all()` endpoint, which returns current and previous day data for all traded tickers in a single API call. Filter for gap >4%, price >$3, pre-market volume >50,000, and market cap >$50M. Store candidates in Redis (`SADD premarket_gappers AAPL NVDA ...`). The `tradingview-screener` Python package offers built-in `Scanner.premarket_gappers` as a secondary validation source.

**Trading bot (9:25 AM–3:50 PM ET)**: Lumibot's lifecycle methods map directly to the workflow. Use `before_market_opens()` for screening, `on_trading_iteration()` with `sleeptime="30S"` for signal detection, and `before_market_closes()` to flatten all positions. Entry signals (ORB breakout, VWAP reclaim, dip reversal) are evaluated each iteration using Polygon minute bars and computed indicators (VWAP, RSI, EMA via `pandas-ta`).

**Order execution via Alpaca**: Submit bracket orders with `OrderClass.BRACKET` combining `TakeProfitRequest` and `StopLossRequest` for immediate protection. For trailing stops, submit a separate `TrailingStopOrderRequest` after entry fill confirmation via `TradingStream` WebSocket—Alpaca's native trailing stops execute server-side, requiring no client monitoring. Set `TimeInForce.DAY` on all orders so unfilled orders auto-cancel at close.

**Safety net (3:55 PM ET)**: A cron-triggered script calls `client.close_all_positions(cancel_orders=True)` as a failsafe independent of the main bot process.

### Key signal detection patterns

For ORB, capture the high and low of the first three 5-minute bars, then trigger on a close above the range high with VWAP confirmation (price above VWAP with positive slope) and volume confirmation (breakout bar volume exceeds a minimum threshold). A candle strength filter—close in the upper 30% of the bar range—eliminates weak breakouts.

For VWAP reclaim, calculate VWAP as `cumulative(typical_price × volume) / cumulative(volume)` and detect when price crosses from below to above VWAP across a 3-bar window. For dip reversal, combine RSI dropping below 30 on the 5-minute chart and then crossing back above 30 with volume expansion on the reversal candle.

### Notable open-source implementations

The `alpacahq/Momentum-Trading-Example` repo (694 stars) demonstrates a complete day trading bot that buys 15 minutes after open using MACD + price breakout + volume signals, closing all positions at EOD. The `michaelzheng67/Full-Stack-Stock-Algorithm` repo implements a pre-market gapper screener feeding directly into an ORB strategy with database storage and web UI. The `je-suis-tm/quant-trading` collection includes a Dual Thrust strategy (ORB variant) with full Python backtesting code. The `shinathan/polygon.io-stock-database` repo shows a complete pipeline for building a TimescaleDB database from Polygon data—directly relevant to the user's stack.

---

## Risk management as an automated gatekeeper

Every signal must pass through a validation pipeline before any order reaches Alpaca. This pipeline operates in sequence: account gate → strategy gate → position gate → order validation → execution.

### Position sizing from stop distance

The core formula is `shares = (account_equity × risk_pct) / (entry_price - stop_price)`. For a $100,000 account risking 1% with entry at $50 and stop at $48, this yields 500 shares ($25,000 exposure). Use **ATR-based stops** as the primary method: `stop_distance = ATR × multiplier` where ATR is calculated over 14 periods on the intraday timeframe and the multiplier is typically **1.5–2.0×**. This adapts automatically to volatility—high-ATR stocks get fewer shares, low-ATR stocks get more, keeping dollar risk constant.

Apply the **Half Kelly criterion** as a ceiling: `K% = 0.5 × [win_rate - (1 - win_rate) / win_loss_ratio]`. Full Kelly is too aggressive; half Kelly captures ~75% of optimal growth with ~50% less drawdown. Cap at your maximum tolerance (1–2%) regardless of what Kelly suggests.

### Daily loss limits with Redis

Track realized and unrealized P&L in Redis using `HINCRBYFLOAT` for atomic updates. Implement a **tiered circuit breaker**: down 2% triggers 50% position size reduction, down 3% restricts to highest-conviction setups only, and down 5% halts all trading. Use Redis key expiration (`EXPIREAT` to next market open) for automatic daily reset. After **3 consecutive losing trades**, reduce position size by 50%; after 5, halt for the day. Persist daily summaries to TimescaleDB for the audit trail.

### Correlation and concentration limits

Before opening any new position, compute its 30-day rolling Pearson correlation with all existing positions. Treat correlations above **0.70** as "correlated" and cap combined risk for the correlated group at 3% of equity. Maintain a sector map and enforce **maximum 30% equity exposure per sector**. Cache correlation calculations in Redis with 1-hour TTL to avoid expensive recomputation on every signal. Limit total open positions to **5–8 for intraday** and total deployed capital to 60% of equity.

---

## Backtesting that avoids self-deception

### Data resolution and realistic costs

Use **1-minute bars** as the default resolution for all strategies in this set. Tick data is only necessary for scalping or sub-minute execution simulation. Polygon.io provides minute-level data with quality nearly identical to TradeStation—a 2025 comparison found the largest 1-minute close price difference on QQQ was just $0.43 across months of data. Store historical data in TimescaleDB using the pipeline from `shinathan/polygon.io-stock-database` to avoid survivorship bias.

Model total round-trip costs conservatively. For large-cap stocks: **$0.02–0.04/share** covering spread, slippage, and regulatory fees. For small-cap stocks: **$0.10–0.50/share** depending on liquidity. Alpaca's zero-commission structure still carries PFOF impact—add **0.5–1 cent/share** as a proxy. Use the volume-share slippage model for more realistic simulation: `slippage = price × σ × √(order_size / bar_volume)`, which scales impact with both order size and volatility. Widen slippage estimates for the first 2 minutes after open when spreads are widest.

### Walk-forward validation and statistical thresholds

Never optimize on the full dataset. Use **rolling walk-forward analysis** with a 2:1 to 4:1 in-sample to out-of-sample ratio (e.g., 6 months training / 3 months testing, rolled forward). Target a Walk-Forward Efficiency above **0.4** (OOS performance ÷ IS performance). Demand that **70%+ of out-of-sample segments** are profitable.

For statistical significance, require a minimum of **200–500 trades** spanning multiple market regimes—not 200 trades clustered in a single bull run. The t-test threshold is straightforward: `t = SR × √n`, where SR is the annualized Sharpe ratio and n is the number of periods. For 95% confidence, this product must exceed 1.96. Apply the **Deflated Sharpe Ratio** from López de Prado to correct for multiple testing: after just 1,000 independent backtests, the expected maximum Sharpe ratio is 3.26 *even if every strategy has zero true edge*. Record every variant tested.

Run **Monte Carlo simulation** with at least 1,000 reshuffled trade sequences. The 95th percentile maximum drawdown should be less than 2× the backtest's maximum drawdown. Randomly skip 10–15% of trades to test fragility—if performance collapses when a few entries are missed, the strategy depends on specific trades rather than a genuine statistical edge.

### Lumibot + Polygon.io in practice

Lumibot's `PolygonDataBacktesting` class handles minute-level backtesting with automatic data caching in Feather format. Set `sleeptime="1M"` for 1-minute iterations. The free Polygon tier provides 2 years of history at 5 API calls/minute—adequate for initial development but slow for multi-symbol, multi-year backtests. The paid tier ($199+/month) removes these constraints. Key limitation: Lumibot lacks built-in dynamic slippage models, so implement cost modeling manually via `TradingFee` objects or by adjusting order prices within strategy logic.

For rapid parameter scanning before detailed backtesting, use **VectorBT** (NumPy-based, orders of magnitude faster) to identify promising parameter ranges, then validate in Lumibot with realistic cost modeling, then deploy live through Lumibot's Alpaca broker integration using the same strategy code.

---

## Conclusion

The most automatable strategies in this set are ORB and VWAP reclaim—both have fully mechanical rules, quantitative evidence, and straightforward translation to code. Connors' RSI-2 offers the strongest backtested edge (90% win rate, profit factor 2.08) but requires adaptation from daily to intraday timeframes. The Gap and Go, First Pullback, and Bull Flag strategies are powerful but retain discretionary elements that introduce automation complexity around defining "orderly" pullbacks and "strong" volume.

The critical insight from academic research is that **intraday momentum is real and exploitable at the index level**—the first half-hour predicts the last half-hour with statistical significance. Translating this to individual stock day trading requires additional validation through proper walk-forward analysis with 200+ trades across multiple regimes.

For a 9-to-5 schedule, the Lumibot lifecycle + Alpaca execution + Redis risk layer architecture is the right design. The single most important implementation detail is the risk pipeline: no order should ever reach Alpaca without passing through position sizing, daily loss limits, correlation checks, and order validation. The second most important detail is realistic backtesting—strategies that look profitable with zero slippage on large-cap stocks often evaporate when you model the true cost of trading small-cap momentum names at the open.