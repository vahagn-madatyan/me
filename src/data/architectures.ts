export interface Architecture {
  title: string;
  description: string;
  project: "netsec-skills-suite" | "token-for-granted";
  domain: string;
  image: string;
  problemSolved: string;
  techDecisions: string[];
  mermaid?: string;
}

export const architectures: Architecture[] = [
  {
    title: "Device Health Triage",
    description:
      "Platform-specific health check procedures for Cisco IOS-XE/NX-OS, Juniper JunOS, and Arista EOS with threshold-based severity classification.",
    project: "netsec-skills-suite",
    domain: "device-health",
    image: "",
    problemSolved:
      "Standardized device triage across multi-vendor environments — agents follow the same structured procedure regardless of platform, eliminating inconsistent ad-hoc debugging.",
    techDecisions: ["Cisco IOS-XE", "NX-OS", "JunOS", "Arista EOS"],
    mermaid: `graph TD
  A[Device Health Check] --> B{Identify Platform}
  B -->|IOS-XE| C[cisco-device-health]
  B -->|NX-OS| C
  B -->|JunOS| D[juniper-device-health]
  B -->|EOS| E[arista-device-health]
  C --> F[CPU / Memory / Interface]
  D --> F
  E --> F
  F --> G{Threshold Check}
  G -->|Normal| H[Report OK]
  G -->|Warning| I[Flag + Continue]
  G -->|Critical| J[Decision Tree Triage]
  J --> K[Structured Report]`,
  },
  {
    title: "Routing Protocol Analysis",
    description:
      "BGP, OSPF, EIGRP, and IS-IS analysis skills covering peer state diagnosis, path selection, convergence, and route filtering across Cisco, Juniper, and Arista.",
    project: "netsec-skills-suite",
    domain: "routing",
    image: "",
    problemSolved:
      "Unified routing protocol diagnosis across vendors and protocols — from BGP peer flaps to OSPF area design validation, agents follow decision trees to pinpoint root causes.",
    techDecisions: ["BGP", "OSPF", "EIGRP", "IS-IS", "Multi-vendor"],
    mermaid: `graph TD
  A[Routing Analysis] --> B{Protocol}
  B -->|BGP| C[bgp-analysis]
  B -->|OSPF| D[ospf-analysis]
  B -->|EIGRP| E[eigrp-analysis]
  B -->|IS-IS| F[isis-analysis]
  C --> G[Peer State / Path Selection / Filtering]
  D --> H[Adjacency / Area Design / LSA Analysis]
  E --> I[DUAL / SIA Diagnosis / K-values]
  F --> J[Adjacency / LSPDB / Level 1-2]
  G --> K[Convergence Report]
  H --> K
  I --> K
  J --> K`,
  },
  {
    title: "Firewall & Security Audit",
    description:
      "Policy analysis for Palo Alto, FortiGate, Check Point, and Cisco ASA/FTD plus vendor-agnostic ACL analysis, CIS benchmarks, and NIST compliance mapping.",
    project: "netsec-skills-suite",
    domain: "security",
    image: "",
    problemSolved:
      "Consistent firewall policy auditing across four major platforms — shadowed rule detection, overly permissive rule flagging, compliance mapping, and vulnerability assessment.",
    techDecisions: ["PAN-OS", "FortiGate", "Check Point", "Cisco ASA/FTD", "CIS", "NIST 800-53"],
    mermaid: `graph TD
  A[Security Audit] --> B{Platform}
  B -->|PAN-OS| C[palo-alto-firewall-audit]
  B -->|FortiOS| D[fortigate-firewall-audit]
  B -->|Check Point| E[checkpoint-firewall-audit]
  B -->|ASA/FTD| F[cisco-firewall-audit]
  A --> G[acl-rule-analysis]
  G --> H[Shadow / Permit-Any / Unused Rules]
  A --> I{Compliance}
  I --> J[cis-benchmark-audit]
  I --> K[nist-compliance-assessment]
  I --> L[vulnerability-assessment]
  H --> M[Audit Report]
  J --> M
  K --> M
  L --> M`,
  },
  {
    title: "Cloud Security Posture",
    description:
      "VPC design analysis, security group audits, and cross-cloud posture assessment for AWS, Azure, and GCP with IAM analysis and public exposure detection.",
    project: "netsec-skills-suite",
    domain: "cloud",
    image: "",
    problemSolved:
      "Unified cloud security assessment across three major providers — agents audit VPC architecture, firewall rules, encryption, and IAM using provider-native constructs.",
    techDecisions: ["AWS VPC", "Azure VNet", "GCP VPC", "IAM", "Terraform"],
    mermaid: `graph TD
  A[Cloud Security] --> B{Provider}
  B -->|AWS| C[aws-networking-audit]
  B -->|Azure| D[azure-networking-audit]
  B -->|GCP| E[gcp-networking-audit]
  A --> F[cloud-security-posture]
  C --> G[VPC / SG / NACL / Flow Logs]
  D --> H[VNet / NSG / Azure Firewall]
  E --> I[VPC / FW Rules / Cloud NAT]
  F --> J[IAM / Encryption / Public Exposure]
  G --> K[Posture Report]
  H --> K
  I --> K
  J --> K`,
  },
  {
    title: "Observability & Incident Response",
    description:
      "SIEM log analysis with Splunk/ELK/QRadar query patterns, Grafana dashboard auditing, network forensics, and NIST 800-61 incident response lifecycle management.",
    project: "netsec-skills-suite",
    domain: "observability",
    image: "",
    problemSolved:
      "End-to-end incident handling — from SIEM alert triage through network forensics to structured post-mortem, with query patterns for the three major SIEM platforms.",
    techDecisions: ["Splunk SPL", "ELK KQL", "QRadar AQL", "Grafana", "NIST 800-61"],
    mermaid: `graph TD
  A[Observability] --> B[siem-log-analysis]
  A --> C[network-log-analysis]
  A --> D[monitoring-dashboard-audit]
  A --> E[incident-response-lifecycle]
  A --> F[incident-response-network]
  B --> G{SIEM Platform}
  G -->|Splunk| H[SPL Queries]
  G -->|ELK| I[KQL Queries]
  G -->|QRadar| J[AQL Queries]
  D --> K[Grafana / PromQL / Alert Rules]
  E --> L[Detection → Analysis → Containment → Recovery → Post-Mortem]
  F --> M[Packet Capture / Flow Analysis / Forensics]`,
  },
  {
    title: "Edge Compute & SSR",
    description:
      "Single Cloudflare Worker running TanStack Start with React 19 SSR — server functions with direct bindings to D1, KV, and Workers AI. One wrangler deploy ships everything globally.",
    project: "token-for-granted",
    domain: "compute",
    image: "",
    problemSolved:
      "Full-stack AI application deployed to 200+ Cloudflare data centers with a single command — no containers, no Kubernetes, no separate API server.",
    techDecisions: ["Cloudflare Workers", "TanStack Start", "React 19", "Vite", "Zod"],
    mermaid: `graph TD
  Browser["Browser<br/>React 19 + Framer Motion"] -->|HTTPS| Worker["Cloudflare Worker<br/>TanStack Start SSR"]
  Worker -->|SQL| D1["D1 Database<br/>SQLite"]
  Worker -->|Cache R/W| KV["KV Namespace"]
  Worker -->|Inference| AI["Workers AI"]
  Worker -->|Routing| GW["AI Gateway"]

  style Browser fill:#0f3460,stroke:#e94560,color:#e94560
  style Worker fill:#1a1a2e,stroke:#0f3460,color:#e94560
  style D1 fill:#16213e,stroke:#0f3460,color:#e94560
  style KV fill:#16213e,stroke:#0f3460,color:#e94560
  style AI fill:#16213e,stroke:#0f3460,color:#e94560
  style GW fill:#16213e,stroke:#0f3460,color:#e94560`,
  },
  {
    title: "AI Inference Pipeline",
    description:
      "AI Gateway routes requests to Llama 3.1 8B (primary) with automatic Mistral 7B fallback. Budget cap at $10/month. Flux-1-Schnell for image generation.",
    project: "token-for-granted",
    domain: "ai",
    image: "",
    problemSolved:
      "Resilient AI inference with dynamic model routing, automatic fallback, hard budget caps, and full observability — all without application code changes.",
    techDecisions: ["AI Gateway", "Workers AI", "Llama 3.1 8B", "Mistral 7B", "Flux-1-Schnell", "OpenAI SDK"],
    mermaid: `graph TD
  Worker["Worker"] -->|OpenAI-compat| GW["AI Gateway<br/>$10/mo Budget Cap"]
  GW -->|Primary| Llama["Llama 3.1 8B"]
  GW -->|Fallback| Mistral["Mistral 7B"]
  Worker -->|Direct| Flux["Flux-1-Schnell<br/>Image Gen"]
  GW -.->|Budget Exhausted| Fallback["Deterministic<br/>Hash Fallback"]

  style Worker fill:#1a1a2e,stroke:#0f3460,color:#e94560
  style GW fill:#451a03,stroke:#fbbf24,color:#fef3c7
  style Llama fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style Mistral fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style Flux fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style Fallback fill:#064e3b,stroke:#34d399,color:#d1fae5`,
  },
  {
    title: "Caching & Resilience",
    description:
      "SHA-256 content-addressed caching with KV — 1-hour TTL for AI responses, 24-hour TTL for generated images. Deterministic fallback when AI is unavailable.",
    project: "token-for-granted",
    domain: "caching",
    image: "",
    problemSolved:
      "Cost optimization through aggressive caching (repeated queries = zero AI compute) and graceful degradation via deterministic hash-based fallback — the app never breaks.",
    techDecisions: ["KV Namespace", "SHA-256", "Web Crypto API", "Deterministic Fallback"],
    mermaid: `graph TD
  Req["Request"] --> Hash["SHA-256 Cache Key<br/>crypto.subtle.digest"]
  Hash --> Check{"KV Cache?"}
  Check -->|HIT| Return["Return Cached"]
  Check -->|MISS| AI["AI Gateway"]
  AI --> Available{"Available?"}
  Available -->|Yes| Infer["Model Inference"]
  Available -->|No| Det["Deterministic<br/>Hash Fallback"]
  Infer --> Cache["Cache in KV<br/>TTL: 1hr"]
  Cache --> Response["Response"]
  Det --> Response
  Return --> Response

  style Req fill:#0c4a6e,stroke:#38bdf8,color:#e0f2fe
  style Return fill:#064e3b,stroke:#34d399,color:#d1fae5
  style Det fill:#451a03,stroke:#fbbf24,color:#fef3c7
  style Response fill:#064e3b,stroke:#34d399,color:#d1fae5`,
  },
  {
    title: "Token Pricing Engine",
    description:
      "Deterministic price-to-token conversion across 19 AI providers — GPT-4o, Claude Opus 4, Gemini 2.5 Pro, Grok 3, DeepSeek R1, Llama, Mistral, and Cohere.",
    project: "token-for-granted",
    domain: "data",
    image: "",
    problemSolved:
      "Makes AI pricing tangible — converts any dollar amount into token counts across every major provider, with hardcoded rates for zero external dependencies.",
    techDecisions: ["19 AI Providers", "Hardcoded Rates", "Zero External APIs", "D1 Persistence"],
    mermaid: `graph LR
  Price["Asset Price<br/>USD"] --> Engine["Token Pricing<br/>Engine"]
  Engine --> GPT["OpenAI<br/>GPT-4o · 4.1 · 4.1-mini"]
  Engine --> Claude["Anthropic<br/>Opus 4 · Sonnet 4 · Haiku"]
  Engine --> Gemini["Google<br/>Gemini 2.5 Pro · Flash"]
  Engine --> Others["xAI · DeepSeek<br/>Mistral · Cohere"]

  style Price fill:#4c0519,stroke:#fb7185,color:#ffe4e6
  style Engine fill:#1a1a2e,stroke:#0f3460,color:#e94560
  style GPT fill:#0c4a6e,stroke:#38bdf8,color:#e0f2fe
  style Claude fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style Gemini fill:#064e3b,stroke:#34d399,color:#d1fae5
  style Others fill:#1e293b,stroke:#94a3b8,color:#cbd5e1`,
  },
];
