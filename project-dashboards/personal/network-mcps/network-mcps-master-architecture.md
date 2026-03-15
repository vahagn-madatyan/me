# Network MCPs Master Architecture

Consolidated Mermaid diagram for the entire `personal/network-mcps` folder.

Sources used:
- `mcp-architecture-dashboard.jsx`
- `compass_artifact_wf-e3bd9ed4-c76c-468a-90cb-d75762429fe5_text_markdown.md`

```mermaid
---
id: 9fa2b3fa-fc6d-4910-aa78-dec5eb8b2144
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
    NMC["Network MCP Architecture<br/>Prisma Access + Meraki + Juniper Mist"]:::hub

    subgraph Reference["Shared MCP Server Blueprint"]
        direction LR
        Agent["LLM agent"]:::ref
        Protocol["MCP protocol<br/>stdio or streamable HTTP"]:::ref
        FastMCP["FastMCP server<br/>Python 3.11+"]:::ref
        Tools["Tool functions"]:::ref
        SDK["Vendor SDK layer"]:::ref
        APIs["Vendor REST APIs"]:::ref
        Agent --> Protocol --> FastMCP --> Tools --> SDK --> APIs
    end

    subgraph Safety["Safety Architecture"]
        direction LR
        ReadOnly["Read-only default"]:::safe
        EnableWrite["Explicit write enable<br/>allowlist patterns"]:::safe
        Hints["destructiveHint metadata"]:::safe
        PlatformRules["Platform safety<br/>Prisma no auto-push / Meraki action batch review / Mist template validation"]:::safe
        ReadOnly --> EnableWrite --> Hints --> PlatformRules
    end

    subgraph Prisma["Prisma Access / Strata Cloud Manager"]
        direction LR
        PAuth["OAuth2 client credentials<br/>15-minute tokens"]:::vendorA
        PToken["Proactive token manager<br/>refresh at 13 min"]:::vendorA
        PRead["Tier 1 read tools<br/>rules / objects / profiles / URLs / EDLs"]:::vendorA
        PState["Tier 2 read tools<br/>remote networks / service connections / bandwidth / jobs"]:::vendorA
        PWrite["Tier 3 write tools<br/>rule CRUD / move / address create / push candidate config"]:::vendorA
        PCommit["Candidate config -> explicit push job"]:::vendorA
        PAuth --> PToken --> PRead --> PState --> PWrite --> PCommit
    end

    subgraph Meraki["Cisco Meraki"]
        direction LR
        MAuth["API key or OAuth2"]:::vendorB
        MRoute["Multi-org routing layer<br/>MSP context"]:::vendorB
        MRead["Tier 1 read tools<br/>availability / uplinks / events / VPN / clients"]:::vendorB
        MDiag["Tier 2 diagnostics<br/>ping / traceroute / cable test / config changes"]:::vendorB
        MWrite["Tier 3 write tools<br/>SSID / switch port / firewall / action batches"]:::vendorB
        MRate["10 req/s per org<br/>cache + queue + org-level APIs"]:::vendorB
        MAuth --> MRoute --> MRead --> MDiag --> MWrite --> MRate
    end

    subgraph Mist["Juniper Mist"]
        direction LR
        JAuth["Static API token<br/>org or user token"]:::vendorC
        JRegion["5 regional endpoints"]:::vendorC
        JRead["Tier 1 read tools<br/>device stats / SLE / clients / alarms / events"]:::vendorC
        JOps["Tier 2 ops tools<br/>WLANs / inventory / RF templates / generated config"]:::vendorC
        JWrite["Tier 3 write tools<br/>WLAN / NAC / microsegmentation / WAN security"]:::vendorC
        JRate["5000 calls/hour<br/>warn + fallback to cache"]:::vendorC
        JAuth --> JRegion --> JRead --> JOps --> JWrite --> JRate
    end

    subgraph Packaging["Implementation Structure"]
        direction LR
        ServerPy["server.py<br/>transport / CLI / FastMCP init"]:::pack
        ClientPy["client.py<br/>SDK wrappers + auth"]:::pack
        ServicesPy["services.py<br/>registration orchestration"]:::pack
        ToolsDir["tools/<vendor>/ modules"]:::pack
        Config["Env config<br/>tokens / region / transport / secrets"]:::pack
        ServerPy --> ServicesPy --> ToolsDir --> ClientPy
        Config --> ClientPy
        Config --> ServerPy
    end

    subgraph Deploy["Deployment Modes"]
        direction LR
        Stdio["Engineer mode<br/>Claude Desktop / Claude Code / local stdio"]:::deploy
        HTTP["Central mode<br/>streamable HTTP + OAuth 2.1"]:::deploy
        Unified["Unified deploy<br/>Docker packaging + optional netops-mcp meta-server"]:::deploy
        Secrets["Secrets layer<br/>Vault or AWS Secrets Manager"]:::deploy
        Stdio --> HTTP --> Unified --> Secrets
    end

    subgraph Roadmap["Build Order"]
        direction LR
        R1["Phase 1<br/>Prisma MCP"]:::roadmap
        R2["Phase 2<br/>Meraki MCP"]:::roadmap
        R3["Phase 3<br/>Mist MCP"]:::roadmap
        R4["Phase 4<br/>Unified deploy + meta-server"]:::roadmap
        R1 --> R2 --> R3 --> R4
    end

    NMC --> Agent
    NMC --> ReadOnly
    NMC --> PAuth
    NMC --> MAuth
    NMC --> JAuth
    NMC --> ServerPy
    NMC --> Stdio
    NMC --> R1

    FastMCP --> PAuth
    FastMCP --> MAuth
    FastMCP --> JAuth

    PlatformRules --> PCommit
    PlatformRules --> MWrite
    PlatformRules --> JWrite

    PToken --> Config
    MRoute --> Config
    JRegion --> Config

    SDK --> ClientPy
    APIs --> Unified

    R1 -. first implementation .-> PAuth
    R2 -. second implementation .-> MAuth
    R3 -. third implementation .-> JAuth
    R4 -. packaging .-> Unified

    classDef hub fill:#0f172a,stroke:#0f172a,color:#f8fafc,stroke-width:2px;
    classDef ref fill:#dbeafe,stroke:#2563eb,color:#1e3a8a,stroke-width:1.5px;
    classDef safe fill:#fee2e2,stroke:#dc2626,color:#7f1d1d,stroke-width:1.5px;
    classDef vendorA fill:#fff7ed,stroke:#ea580c,color:#9a3412,stroke-width:1.5px;
    classDef vendorB fill:#dcfce7,stroke:#16a34a,color:#14532d,stroke-width:1.5px;
    classDef vendorC fill:#ede9fe,stroke:#7c3aed,color:#4c1d95,stroke-width:1.5px;
    classDef pack fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e,stroke-width:1.5px;
    classDef deploy fill:#f8fafc,stroke:#64748b,color:#334155,stroke-width:1.5px;
    classDef roadmap fill:#f5f3ff,stroke:#8b5cf6,color:#5b21b6,stroke-width:1.5px;
```
