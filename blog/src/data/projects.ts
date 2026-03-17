export interface Project {
  title: string;
  description: string;
  category: "security" | "ai" | "networking" | "trading";
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    title: "VaultBreaker",
    description:
      "Automated penetration testing framework that chains CVE exploits with custom fuzzing modules. Discovers attack paths across segmented networks and generates compliance-ready reports.",
    category: "security",
    techStack: ["Python", "Rust", "Docker", "Nmap"],
    githubUrl: "https://github.com/username/vaultbreaker",
  },
  {
    title: "CortexML",
    description:
      "Real-time inference engine for deploying transformer models at the edge. Supports ONNX and TensorRT backends with automatic batching and model-level caching.",
    category: "ai",
    techStack: ["Python", "C++", "ONNX", "CUDA"],
    githubUrl: "https://github.com/username/cortexml",
    liveUrl: "https://cortexml.dev",
  },
  {
    title: "PacketForge",
    description:
      "High-performance packet capture and analysis toolkit built on DPDK. Processes 100 Gbps line-rate traffic with programmable filtering pipelines and live dashboards.",
    category: "networking",
    techStack: ["C", "DPDK", "Go", "Grafana"],
    githubUrl: "https://github.com/username/packetforge",
  },
  {
    title: "AlphaGrid",
    description:
      "Algorithmic trading backtesting platform with tick-level simulation. Connects to live exchanges via FIX protocol and supports multi-asset portfolio optimization.",
    category: "trading",
    techStack: ["Rust", "Python", "PostgreSQL", "Redis"],
    githubUrl: "https://github.com/username/alphagrid",
    liveUrl: "https://alphagrid.io",
  },
  {
    title: "SentinelIDS",
    description:
      "Machine-learning-powered intrusion detection system that correlates network flows with endpoint telemetry. Reduces alert fatigue with adaptive thresholding and anomaly scoring.",
    category: "security",
    techStack: ["Python", "Kafka", "Elasticsearch", "scikit-learn"],
    githubUrl: "https://github.com/username/sentinelids",
  },
  {
    title: "NeuroChat",
    description:
      "Retrieval-augmented generation chatbot framework with pluggable vector stores and guardrails. Ships with a React widget for embedding in any web app.",
    category: "ai",
    techStack: ["TypeScript", "LangChain", "Pinecone", "React"],
    githubUrl: "https://github.com/username/neurochat",
    liveUrl: "https://neurochat.dev",
  },
];
