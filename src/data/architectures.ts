export interface Architecture {
  title: string;
  description: string;
  domain: "device-health" | "routing" | "security" | "cloud" | "observability";
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
];
