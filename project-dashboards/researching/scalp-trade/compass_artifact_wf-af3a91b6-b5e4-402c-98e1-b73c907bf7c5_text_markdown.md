# Open-source scalping and HFT-lite tools for retail traders in 2025–2026

**NautilusTrader is the standout open-source framework for building a multi-asset, sub-second scalping system spanning equities, options, and crypto.** Its Rust core with Python bindings uniquely delivers nanosecond-resolution event processing alongside the flexibility to prototype strategies in Python — a combination no other open-source project matches. However, no single repository covers every need: the optimal approach is to fork NautilusTrader as the core engine, supplement with hftbacktest for HFT-grade backtesting, use Alpaca's SDK and CCXT for broker connectivity, and bolt on specialized tools like 0dte-trader for options execution. This report maps the full landscape of repositories, architecture patterns, and technical components needed to build this system.

---

## NautilusTrader dominates the multi-asset HFT-lite space

**NautilusTrader** (https://github.com/nautechsystems/nautilus_trader) is the clear first choice for a forkable scalping engine. With approximately **18,900 stars** and near-daily commits as of March 2026, it combines a Rust-native core with Python/Cython bindings via PyO3. The architecture is genuinely production-grade: a deterministic event-driven message bus, nanosecond-resolution timestamps, **5M+ rows/second** processing throughput, and async networking via Tokio. Strategies can be written in Python for rapid prototyping, then rewritten in Rust for production latency. It supports equities (via Interactive Brokers), crypto (Binance, Bybit, dYdX), and options trading, with adapter patterns that make adding new brokers straightforward.

What makes NautilusTrader architecturally superior to alternatives is its research-to-live parity — identical code runs in backtesting and live execution with zero changes. The order book simulation processes full depth-of-book data, and L2 data fills against actual book levels sequentially. Cap'n Proto serialization and Redis-backed state persistence complete the infrastructure story. The main trade-off is a steep learning curve and the need for Rust knowledge to customize the core engine.

**QuantConnect LEAN** (https://github.com/QuantConnect/Lean, **~17,800 stars**) is the second-strongest contender for multi-asset scalping. Its C# core is performant and supports tick-level data resolution across equities, options, futures, forex, and crypto. LEAN powers **300+ hedge funds** and has the broadest broker coverage of any framework, including native Alpaca integration. The limitation for a Python-first team is the C# dependency — algorithms can be written in Python, but deep engine customization requires C#. Execution latency is reported at **5–40ms**, adequate for second-level scalping but not competitive with NautilusTrader's Rust core for sub-millisecond operations.

**Lumibot** (https://github.com/Lumiwealth/lumibot, ~1,300 stars) deserves mention as the only framework with native Alpaca support spanning stocks, options, futures, and crypto in a single Python codebase. However, its polling-based architecture with configurable sleep intervals makes it fundamentally unsuitable for sub-second scalping. It is best used for daily or hourly strategies and educational purposes.

---

## The crypto-specific ecosystem is mature but narrowly focused

Three major crypto trading frameworks dominate open-source development, each with a distinct niche. **Freqtrade** (https://github.com/freqtrade/freqtrade) leads with approximately **40,000–48,000 stars**, making it the most popular open-source trading bot by far. Its FreqAI module integrates adaptive ML-based strategy optimization, and the community maintains thousands of shared strategies. However, Freqtrade is fundamentally candle-driven — strategies operate on minimum 1-minute bars — making it unsuitable for sub-second scalping. It excels at medium-frequency crypto strategies on 1m–15m timeframes.

**Hummingbot** (https://github.com/hummingbot/hummingbot, **~9,000 stars**) is purpose-built for market making and HFT-lite on crypto venues. Its WebSocket-first connector architecture is the most accessible in the market, with Cython optimizations for performance-critical paths. Users have generated over **$34 billion in trading volume** across 140+ venues. The Strategy V2 framework cleanly separates signal generation from execution. For crypto-only scalping, Hummingbot is the best starting point — its market-making strategies inherently require the kind of rapid order management that scalping demands.

**hftbacktest** (https://github.com/nkaz001/hftbacktest, **~2,500 stars**) fills a critical gap that no other tool addresses: realistic HFT backtesting with queue position simulation. It models where your limit order sits in the queue, accounts for latencies, and processes full tick data for Level 2 and Level 3 order books. The Rust core with Python bindings delivers near-native speed, and it includes live trading deployment for Binance Futures and Bybit. For anyone developing market-making or limit-order scalping strategies, hftbacktest's queue position modeling is essential — most other backtesting tools dramatically overstate profitability by assuming instant fills.

**CCXT** (https://github.com/ccxt/ccxt, **~41,300 stars**) is the indispensable infrastructure layer connecting to **109+ crypto exchanges** with a unified API across Python, JavaScript, and other languages. CCXT Pro adds WebSocket support for real-time data streaming. A critical performance tip: installing the `coincurve` library reduces ECDSA signing time from **45ms to under 0.05ms** — a 900x improvement that matters for every authenticated API call.

---

## Architecture for sub-second retail scalping has a clear optimal pattern

The recommended architecture separates concerns across three processes connected by ZeroMQ IPC, with each process optimized for its role. The feed handler runs an asyncio event loop with **uvloop** (a drop-in replacement that delivers **2–4x faster** event loop performance) to maintain persistent WebSocket connections to all data sources. Market data flows through ZeroMQ pub/sub (achieving **~33µs latency** and **584,000 messages/second**) to the strategy engine, which processes signals using Numba-JIT-compiled functions operating on shared-memory numpy arrays. Orders pass through a risk manager to an execution process with pre-staged order templates and persistent HTTP sessions.

The technology choices at each layer matter significantly. **ZeroMQ outperforms Redis by roughly 6x on throughput** and delivers 33µs versus 150µs+ latency for inter-process communication — use it for the critical trading path while relegating Redis Streams to logging and state persistence. **orjson** replaces the standard json library for **3–10x faster** JSON parsing, critical when processing thousands of WebSocket messages per second from exchanges. TCP_NODELAY must be enabled on all trading sockets to disable Nagle's algorithm buffering.

The single largest latency improvement available to retail traders is deploying on a **trading VPS colocated near the broker or exchange**. Moving from home internet (50–200ms) to an Equinix-colocated VPS ($40–150/month) achieves **0.3–5ms** network latency — a 10–40x improvement. Key data center locations are NY4/NY5 for NYSE, NASDAQ, and Alpaca; AWS ap-northeast-1 (Tokyo) for Binance; and AWS us-east-1 (Virginia) for Coinbase and Kraken. Kernel bypass networking (DPDK, RDMA) is unnecessary for retail — the bottleneck is broker API latency, not kernel networking.

For native code acceleration, **PyO3** (Rust to Python) via the maturin build tool is the recommended path. Order book processing, signal generation on the hot path, and binary protocol decoding benefit most from Rust implementation. Reference implementations like `bigfatwhale/orderbook` achieve **~4µs per message** using van Emde Boas trees and lock-free queues. Python's `multiprocessing.shared_memory` enables zero-copy data sharing between the feed handler and strategy engine without serialization overhead.

A realistic latency budget for the complete tick-to-order pipeline is **10–100ms on a colocated VPS** (broken down as: 5–50ms WebSocket data arrival, <0.1ms deserialization, ~0.03ms ZeroMQ delivery, 0.01–0.1ms signal computation, 0.3–5ms network to broker) or **100–500ms from a home connection**.

---

## Alpaca works for equities but has hard limits for true scalping

Alpaca's Trading API imposes a **200 requests/minute rate limit** for order operations (approximately 3.3 orders per second), with REST round-trip latency of **200–500ms** for order placement. These constraints cap practical scalping frequency at roughly one trade every 15–20 seconds when accounting for entries, exits, and position management calls. The WebSocket trade_updates stream provides sub-second fill confirmations, and the Algo Trader Plus plan ($99/month) unlocks full SIP and OPRA data with no WebSocket limits.

For options, Alpaca supports Levels 1–3 including multi-leg strategies (straddles, iron condors, spreads) via the same Orders API used for equities. However, **SPX index options are not yet available** — only equity and ETF options (SPY, QQQ). Critically for 0DTE trading, Alpaca disables opening new positions on contracts approaching expiration (exact cutoff unspecified), and **Greeks may not be available for same-day expiry contracts** via the snapshot API. These limitations make Alpaca problematic as the sole execution venue for aggressive 0DTE scalping.

**Interactive Brokers** (IBKR) remains the superior choice for latency-sensitive scalping, offering sub-10ms execution with colocation, direct market access with Smart Order Routing, and full SPX index options support. The trade-off is API complexity (TWS API requires running a desktop application or IB Gateway) and per-trade commissions. For options specifically, the open-source **0dte-trader** (https://github.com/aicheung/0dte-trader, ~200 stars) provides the best automated 0DTE execution available, supporting bull/bear spreads, butterflies, iron condors, and single-leg options with auto-retry fills — but it requires IBKR, not Alpaca.

For crypto, exchange WebSocket APIs provide the primary data source without needing third-party providers. **Binance** offers the deepest liquidity with 5–12ms execution from AWS Tokyo, depth updates every 100ms, and SBE binary encoding for lower-latency market data. **Bybit** competes on fees (0.01% maker at VIP tiers). **Coinbase Advanced** has the strongest US regulatory position but charges the highest fees (0.40–1.20% taker).

---

## Signal generation and ML show promise but face brutal reality at sub-second horizons

Order book imbalance is the most reliable microstructure signal for scalping. The normalized imbalance ratio — `(Bid_Volume - Ask_Volume) / (Bid_Volume + Ask_Volume)` — computed across multiple depth levels predicts short-term price direction with statistical significance, particularly in large-tick instruments. Alpaca's own `example-hftish` repository (https://github.com/alpacahq/example-hftish) demonstrates this approach by watching quote-level changes and trading in the direction of the first trade at a new price level. The companion `example-scalping` repository (https://github.com/alpacahq/example-scalping) implements concurrent async multi-symbol scalping using SMA crossovers.

Deep learning on limit order book data has produced several architectures with measurable predictive power. **DeepLOB** (CNN + Inception + LSTM, ~60,000 parameters) achieves **83.4% F1 score** on the FI-2010 benchmark for mid-price direction prediction. **TransLOB** and **LiT** (Limit Order Book Transformer) push state-of-the-art further using attention mechanisms. However, at **300–500ms prediction horizons relevant to scalping, accuracy drops below 60%** across all models — reflecting the extreme noise in ultra-short-term data. These small edges can easily be consumed by transaction costs, and high ML accuracy does not reliably translate to profitable trading.

**FinRL** (https://github.com/AI4Finance-Foundation/FinRL) provides the most comprehensive open-source reinforcement learning framework for trading, with DQN, DDPG, PPO, SAC, and TD3 algorithms integrated with Stable Baselines3 and RLlib. The specialized **DeepScalper** paper (arXiv:2201.09058) presents a purpose-built RL architecture for intraday scalping with dueling Q-networks and hindsight bonus rewards. NautilusTrader's documentation explicitly notes its backtest engine is "fast enough to be used to train AI trading agents (RL/ES)," making it the natural choice for combining ML signal generation with production execution.

For technical indicators, **pandas-ta** (150+ indicators with Numba acceleration) and **TA-Lib** (150+ C-based indicators) are the standard libraries. At sub-second timeframes, volume-based metrics outperform traditional indicators: VWAP deviations, volume delta (buying vs. selling pressure), and microprice calculations carry more predictive information than RSI or MACD when computed on tick or volume bars rather than time bars.

---

## Complete repository reference ranked by scalping suitability

The following table consolidates the most important repositories with honest assessments of their fitness for the stated use case:

| Repository | Stars | Language | Sub-Second Scalping | Multi-Asset | Best Use |
|---|---|---|---|---|---|
| **nautilus_trader** | ~18,900 | Rust/Python | ✅ Best-in-class | ✅ All assets | Core engine for production scalping |
| **freqtrade** | ~40,000+ | Python | ❌ Candle-based | ❌ Crypto only | Medium-frequency crypto strategies |
| **ccxt** | ~41,300 | Multi-lang | N/A (library) | ✅ 109+ exchanges | Essential crypto exchange connectivity |
| **QuantConnect/Lean** | ~17,800 | C#/Python | ⚠️ Partial | ✅ All assets | Institutional-grade backtesting + live |
| **hummingbot** | ~9,000 | Python/Cython | ⚠️ Partial | ❌ Crypto only | Crypto market making and HFT-lite |
| **jesse-ai** | ~7,000 | Python | ❌ Candle-based | ❌ Crypto only | Crypto strategy research |
| **vectorbt** | ~4,500 | Python/Numba | ❌ Backtest only | Data-agnostic | Mass parameter optimization |
| **hftbacktest** | ~2,500 | Rust/Python | ✅ Tick-level | Crypto focus | HFT backtesting with queue modeling |
| **barter-rs** | ~2,500 | Rust | ✅ Native speed | Extensible | Custom Rust trading engine |
| **blankly** | ~2,300 | Python | ❌ Abandoned | Multi-asset | Historical reference only (stale since 2022) |
| **optopsy** | ~1,300 | Python | ❌ Backtest only | Options only | Options strategy backtesting (28 strategies) |
| **zipline-reloaded** | ~1,300 | Python | ❌ Backtest only | Equities only | Factor research |
| **lumibot** | ~1,300 | Python | ❌ Polling-based | ✅ All assets | Beginner-friendly, daily/hourly strategies |
| **alpaca-py** | ~1,000 | Python | N/A (SDK) | Stocks/options/crypto | Official Alpaca connectivity |
| **alpacahq/example-scalping** | ~500 | Python | ⚠️ Reference | Equities | Clean async scalping starter code |
| **alpacahq/example-hftish** | ~400 | Python | ⚠️ Reference | Equities | Order book imbalance demo |
| **0dte-trader** | ~200 | Python | ⚠️ Options-specific | Options (IBKR) | Best open-source 0DTE automation |

---

## Conclusion: the practical build path

The optimal strategy is not to find one perfect repository but to compose a system from best-of-breed components. **Fork NautilusTrader as the core engine** — its Rust-powered event-driven architecture, multi-asset support, and research-to-live parity make it the only open-source framework that can realistically handle sub-second scalping across equities and crypto simultaneously. Write an Alpaca adapter (one does not yet exist natively) using alpaca-py for equities and options execution, and leverage the existing Binance/Bybit adapters for crypto.

For options scalping, the ecosystem has a significant gap. No open-source framework handles 0DTE options scalping end-to-end. The practical approach is to integrate **0dte-trader's** IBKR-based execution logic as a separate options module, supplemented by **Theta Data** for real-time Greeks and IV (Alpaca's Greek data is unreliable for same-day expiry). **Optopsy** fills the backtesting gap for options strategies.

Use **hftbacktest** alongside NautilusTrader's built-in backtester — its queue position modeling is essential for validating limit-order scalping strategies against realistic market microstructure. Pair CCXT Pro with direct exchange WebSocket connections for crypto data and execution. Deploy the entire stack on an Equinix-colocated VPS for the single biggest latency win available to retail traders.

The hard constraints to internalize: Alpaca's 200 req/min rate limit caps equity scalping frequency regardless of software optimization; **89–95% of retail day traders lose money** in their first year with scalping being particularly unforgiving due to fee sensitivity; and ML models at sub-second horizons achieve under 60% directional accuracy. Start with paper trading on NautilusTrader's simulation environment, validate with hftbacktest's queue-aware backtester using tick data, and only deploy capital after demonstrating positive expectancy net of all transaction costs and realistic slippage.