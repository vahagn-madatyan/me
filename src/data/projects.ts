export interface Project {
  title: string;
  description: string;
  category: "security" | "ai" | "networking" | "trading" | "research";
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    title: "PolicyFoundry",
    description:
      "AI-powered firewall policy analysis and recommendation engine. Automates security policy review with intelligent rule optimization, Terraform integration, and Docker-based deployment.",
    category: "security",
    techStack: ["Python", "AI/ML", "Terraform", "Docker"],
    githubUrl: "https://github.com/vahagn-madatyan/PolicyFoundry",
  },
  {
    title: "wheel-it",
    description:
      "Automated options wheel strategy trading bot built on Alpaca API. Runs unattended to sell cash-secured puts and covered calls with configurable risk parameters.",
    category: "trading",
    techStack: ["Python", "Alpaca API", "Options", "Automation"],
    githubUrl: "https://github.com/vahagn-madatyan/wheel-it",
  },
  {
    title: "0xpwn",
    description:
      "Fully agentic AI pentesting and security toolkit. Autonomous offensive security operations powered by LLM-driven decision making and tool orchestration.",
    category: "security",
    techStack: ["Python", "LangChain", "AI Agents", "Security"],
    githubUrl: "https://github.com/vahagn-madatyan/0xpwn",
  },
  {
    title: "lumon",
    description:
      "Mission control dashboard for managing AI agents. Centralized monitoring and orchestration interface for multiple concurrent autonomous agent workflows.",
    category: "ai",
    techStack: ["TypeScript", "React", "AI Agents", "Dashboard"],
    githubUrl: "https://github.com/vahagn-madatyan/lumon",
  },
  {
    title: "juniper-mist-mcp",
    description:
      "MCP server for Juniper Mist network management. Enables AI agents to query and manage enterprise wireless infrastructure through the Model Context Protocol.",
    category: "networking",
    techStack: ["TypeScript", "MCP", "Juniper Mist", "API"],
    githubUrl: "https://github.com/vahagn-madatyan/juniper-mist-mcp",
  },
  {
    title: "netsec-skills-suite",
    description:
      "The complete network and security skills toolkit. Curated collection of tools, scripts, and automation for network engineering and security operations.",
    category: "networking",
    techStack: ["Python", "Bash", "Networking", "Security"],
    githubUrl: "https://github.com/vahagn-madatyan/netsec-skills-suite",
  },
  {
    title: "deploy-zscaler-mcp",
    description:
      "MCP server and deployer for Zscaler Zero Trust automation. Lets AI agents manage Zscaler policies, configurations, and security posture through the Model Context Protocol.",
    category: "security",
    techStack: ["Python", "MCP", "Zscaler", "Zero Trust"],
    githubUrl: "https://github.com/vahagn-madatyan/deploy-zscaler-mcp",
  },
  {
    title: "wheel-it-screener",
    description:
      "Options wheel strategy screener with multi-factor scoring and option chain drill-down. Surfaces the best candidates for the wheel strategy with real-time data from Alpaca and Finnhub.",
    category: "trading",
    techStack: ["TypeScript", "React", "Alpaca API", "Finnhub"],
    githubUrl: "https://github.com/vahagn-madatyan/wheel-it-screener",
  },
  {
    title: "predikt",
    description:
      "Autonomous AI agent that trades on Polymarket prediction markets. Uses LLM-driven analysis to evaluate events, size positions, and execute trades automatically.",
    category: "trading",
    techStack: ["Python", "AI Agents", "Polymarket", "Automation"],
    githubUrl: "https://github.com/vahagn-madatyan/predikt",
  },
  {
    title: "token-for-granted",
    description:
      "Fun webapp that converts any purchase into AI token equivalents. Ever wonder how many Claude tokens that coffee costs you?",
    category: "ai",
    techStack: ["JavaScript", "Web App"],
    githubUrl: "https://github.com/vahagn-madatyan/token-for-granted",
  },
  {
    title: "chess-by-opensource",
    description:
      "Chess game created entirely by open source AI models via OpenRouter and GSD 2.0. An experiment in what OSS models can build autonomously.",
    category: "research",
    techStack: ["TypeScript", "React", "OpenRouter", "Vite"],
    githubUrl: "https://github.com/vahagn-madatyan/chess-by-opensource",
  },
  {
    title: "dgx-spark-lab",
    description:
      "Hands-on ML training lab for NVIDIA DGX Spark. Model training, fine-tuning, and deployment pipelines for GPU-accelerated machine learning workflows.",
    category: "research",
    techStack: ["Python", "PyTorch", "NVIDIA", "ML"],
    githubUrl: "https://github.com/vahagn-madatyan/dgx-spark-lab",
  },
  {
    title: "nvidia-cert-tracker",
    description:
      "Interactive dashboard for tracking NVIDIA NCA-AIIO and NCA-GENL certification progress. Study planner and knowledge checkpoint tracker.",
    category: "research",
    techStack: ["React", "TypeScript", "Vite", "Dashboard"],
    githubUrl: "https://github.com/vahagn-madatyan/nvidia-cert-tracker",
  },
  {
    title: "another-trip-planner",
    description:
      "AI-powered trip planning app. Generates personalized travel itineraries using LLM-driven recommendations and interactive maps.",
    category: "research",
    techStack: ["HTML", "AI", "Travel", "Web App"],
    githubUrl: "https://github.com/vahagn-madatyan/another-trip-planner",
  },
];
