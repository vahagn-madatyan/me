# PolicyFoundry Master Architecture

Consolidated Mermaid diagram for the entire `personal/policyfoundry` folder.

Sources used:
- `01-architecture-plan.md`
- `architecture-dashboard.jsx`
- `compass_artifact_wf-984fdb27-0934-4f7e-b9c1-c2731b575ee6_text_markdown.md`

```mermaid
---
id: fe864bcb-b765-434f-baed-aff8681a03e2
---
%%{init: {
  "theme": "base",
  "themeVariables": {
    "background": "#ffffff",
    "lineColor": "#475569",
    "clusterBkg": "#f8fafc",
    "clusterBorder": "#94a3b8",
    "fontFamily": "Helvetica, Arial, sans-serif"
  }
}}%%
flowchart TB
    PF["PolicyFoundry / FirewallAI<br/>Agentic Traffic-to-Rule Automation"]:::hub

    subgraph Product["Product Modes"]
        direction LR
        CLI["Python CLI first<br/>Typer + Rich"]:::product
        Local["CLI / laptop tier<br/>DuckDB + SQLite + Ollama"]:::product
        Cloud["Premium cloud tier<br/>ClickHouse + PostgreSQL + web approvals"]:::product
        CLI --> Local --> Cloud
    end

    subgraph Sources["Traffic Sources"]
        direction LR
        Palo["Palo Alto Cloud NGFW logs"]:::source
        AWSLogs["AWS VPC Flow Logs"]:::source
        Future["Future vendors<br/>Fortinet / GCP / Check Point / iptables"]:::source
    end

    subgraph Ingestion["Ingestion + Normalization"]
        direction LR
        Parsers["Per-vendor parsers"]:::ingest
        Normalize["Normalizer<br/>10-field unified schema"]:::ingest
        Vector["Vector / micro-batch ingestion path"]:::ingest
        Schema["Unified flow records"]:::ingest
        Parsers --> Normalize --> Schema
        Vector --> Parsers
    end

    subgraph Storage["Storage Tiers"]
        direction LR
        DuckDB["DuckDB<br/>local analytics"]:::storage
        Parquet["Parquet<br/>columnar log batches"]:::storage
        SQLite["SQLite<br/>state / audit / checkpoints"]:::storage
        ClickHouse["ClickHouse<br/>hot analytics"]:::storage
        S3["S3 or R2 Parquet<br/>cold storage"]:::storage
        PG["PostgreSQL<br/>cloud state + rules"]:::storage
    end

    subgraph Pipeline["Agentic AI Pipeline"]
        direction LR
        Analyze["Analyze traffic"]:::pipe
        Assess["Assess posture"]:::pipe
        Generate["Generate policy"]:::pipe
        Decide["Decide action"]:::pipe
        Analyze --> Assess --> Generate --> Decide
    end

    subgraph AI["LLM + Agent Orchestration"]
        direction LR
        LangGraph["LangGraph<br/>checkpointed state graph"]:::ai
        DeepAgents["Deep Agents<br/>planning + sub-agents"]:::ai
        LiteLLM["LiteLLM router<br/>100+ providers"]:::ai
        Bedrock["AWS Bedrock Claude"]:::ai
        Ollama["Ollama local fallback"]:::ai
        LangGraph --> DeepAgents --> LiteLLM
        LiteLLM --> Bedrock
        LiteLLM --> Ollama
    end

    subgraph Safety["Graduated Autonomy"]
        direction LR
        Suggest["Phase 1 suggest-only"]:::safe
        Single["Single approval<br/>medium risk"]:::safe
        Auto["Low-risk auto apply<br/>future tier"]:::safe
        Kill["Global kill switch"]:::safe
        Breakers["Circuit breakers / rollback / replay"]:::safe
        Suggest --> Single --> Auto
        Kill --> Suggest
        Breakers --> Auto
    end

    subgraph Adapters["Firewall Adapter Layer"]
        direction LR
        Universal["UniversalRule model"]:::adapter
        AWSAdapter["AWS Security Group adapter"]:::adapter
        PaloAdapter["Palo Alto Cloud NGFW adapter"]:::adapter
        FutureAdapter["Future adapters"]:::adapter
        Universal --> AWSAdapter
        Universal --> PaloAdapter
        Universal --> FutureAdapter
    end

    subgraph Ops["Execution + UX"]
        direction LR
        Commands["CLI commands<br/>analyze / apply / diff / replay / audit"]:::ops
        Review["Human review gate<br/>CLI or web approval"]:::ops
        Audit["Rule history + audit trail"]:::ops
        Config["Config system<br/>LLM / adapters / storage / safety"]:::ops
        Commands --> Review --> Audit
        Config --> Commands
    end

    subgraph Deploy["Deployment Architecture"]
        direction LR
        Mono["Monolithic mode<br/>single process or small Docker"]:::deploy
        Dist["Distributed mode<br/>ingestion / AI / API / workers separate"]:::deploy
        Edge["Explored edge path<br/>Cloudflare / queues / workflows"]:::deploy
        Mono --> Dist --> Edge
    end

    PF --> CLI
    PF --> Palo
    PF --> Parsers
    PF --> DuckDB
    PF --> Analyze
    PF --> LangGraph
    PF --> Suggest
    PF --> Universal
    PF --> Commands
    PF --> Mono

    Palo --> Parsers
    AWSLogs --> Parsers
    Future --> Parsers
    Schema --> DuckDB
    Schema --> Parquet
    Schema --> ClickHouse

    DuckDB --> Analyze
    Parquet --> Analyze
    SQLite --> LangGraph
    PG --> LangGraph
    ClickHouse --> Assess
    S3 --> ClickHouse

    LangGraph --> Analyze
    LangGraph --> Assess
    LangGraph --> Generate
    LangGraph --> Decide
    DeepAgents --> Analyze
    DeepAgents --> Generate

    Decide --> Review
    Decide --> Suggest
    Review --> Universal
    Audit --> SQLite
    Audit --> PG

    AWSAdapter --> Cloud
    PaloAdapter --> Cloud
    AWSAdapter --> Local
    PaloAdapter --> Local

    Suggest -. default mode .-> Review
    Single -. approval path .-> Review
    Auto -. future apply path .-> AWSAdapter
    Auto -. future apply path .-> PaloAdapter

    Mono -. local product .-> Local
    Dist -. premium path .-> Cloud
    Edge -. explored deployment .-> Dist

    classDef hub fill:#0f172a,stroke:#0f172a,color:#f8fafc,stroke-width:2px;
    classDef product fill:#dbeafe,stroke:#2563eb,color:#1e3a8a,stroke-width:1.5px;
    classDef source fill:#ede9fe,stroke:#7c3aed,color:#4c1d95,stroke-width:1.5px;
    classDef ingest fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e,stroke-width:1.5px;
    classDef storage fill:#dcfce7,stroke:#16a34a,color:#14532d,stroke-width:1.5px;
    classDef pipe fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:1.5px;
    classDef ai fill:#fce7f3,stroke:#db2777,color:#831843,stroke-width:1.5px;
    classDef safe fill:#fee2e2,stroke:#dc2626,color:#7f1d1d,stroke-width:1.5px;
    classDef adapter fill:#fff7ed,stroke:#ea580c,color:#9a3412,stroke-width:1.5px;
    classDef ops fill:#f8fafc,stroke:#64748b,color:#334155,stroke-width:1.5px;
    classDef deploy fill:#f5f3ff,stroke:#8b5cf6,color:#5b21b6,stroke-width:1.5px;
```
