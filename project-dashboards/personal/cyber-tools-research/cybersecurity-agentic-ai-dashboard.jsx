import { useState, useEffect, useRef } from "react";

const data = [
  {
    id: 1,
    name: "SOC Automation & Alert Triage",
    shortName: "SOC Automation",
    problem: "Security teams drown in 4,484+ alerts daily across 28+ monitoring tools, leaving 44% of alerts completely uninvestigated while analyst burnout drives 70% turnover.",
    solution: "Agentic AI autonomously triages every alert — querying SIEMs, enriching indicators, assessing blast radius, and executing containment — replacing brittle playbook-dependent SOAR with reasoning-based resolution.",
    tier: 1,
    readiness: 9,
    painScore: 10,
    marketSize: "$1.7–1.9B",
    marketGrowth: "$82B by 2030",
    cagr: "15–19%",
    vcFunding: "$560M+",
    whitespace: 3,
    competition: 7,
    keyStats: [
      "4,484 alerts/day per org",
      "44% alerts uninvestigated",
      "83% analysts report burnout errors",
      "71% SOC analyst burnout rate",
    ],
    keyPlayers: [
      { name: "Torq", detail: "$332M raised, $1.2B valuation" },
      { name: "Dropzone AI", detail: "$57M raised" },
      { name: "Exaforce", detail: "$75M Series A" },
      { name: "CrowdStrike Charlotte AI", detail: "Platform incumbent" },
    ],
    ossGap: "No mature open-source agentic AI SOC tool exists",
    agentWorkflow: "Ingest alerts → Query SIEM/EDR → Enrich IOCs → Assess blast radius → Contain → Report",
    color: "#00ff88",
  },
  {
    id: 2,
    name: "Vulnerability Management",
    shortName: "Vuln Management",
    problem: "48,185 new CVEs per year overwhelm teams that waste 96% of remediation effort on vulnerabilities that will never be exploited, while truly dangerous ones go unpatched for 60–120 days.",
    solution: "Agents autonomously discover assets, correlate multi-source vulnerability data with business context and real exploitability, generate prioritized remediation plans, create routed tickets, and validate patches.",
    tier: 1,
    readiness: 8,
    painScore: 9,
    marketSize: "$16.5–17.7B",
    marketGrowth: "$24–34B by 2030",
    cagr: "51.5%",
    vcFunding: "$242M+",
    whitespace: 4,
    competition: 6,
    keyStats: [
      "48,185 CVEs in 2025 (+20.6%)",
      "96% false-positive remediation rate",
      "60–120 days avg patch time",
      "0.2% of CVEs weaponized",
    ],
    keyPlayers: [
      { name: "Cogent Security", detail: "$42M Series A (Feb 2026)" },
      { name: "OpenAI Codex Security", detail: "GPT-5 powered agents" },
      { name: "Sysdig", detail: "Agentic cloud security" },
      { name: "Tenable", detail: "Acquired Vulcan Cyber $150M" },
    ],
    ossGap: "Nuclei/OpenVAS scan but lack remediation orchestration",
    agentWorkflow: "Discover assets → Correlate vulns → Contextualize risk → Prioritize → Generate tickets → Validate patches",
    color: "#ff6b35",
  },
  {
    id: 3,
    name: "Autonomous Penetration Testing",
    shortName: "Auto Pentesting",
    problem: "Traditional pentests cost $10K–$150K, take weeks, happen only quarterly, and are outdated immediately — yet 75% of testing is still manual and the talent to scale doesn't exist.",
    solution: "AI agents execute the full kill chain autonomously — recon, exploitation, privilege escalation, lateral movement — on continuous cadence at a fraction of manual cost, replacing point-in-time assessments with always-on validation.",
    tier: 2,
    readiness: 7,
    painScore: 8,
    marketSize: "$4–6B",
    marketGrowth: "$10–15B by 2030",
    cagr: "23–40%",
    vcFunding: "$395M+",
    whitespace: 5,
    competition: 5,
    keyStats: [
      "$10K–$150K per engagement",
      "75.4% still manual testing",
      "XBOW ranked #1 on HackerOne",
      "150K+ NodeZero pentests run",
    ],
    keyPlayers: [
      { name: "XBOW", detail: "$95M raised, HackerOne #1" },
      { name: "Horizon3.ai", detail: "$178.5M raised, FedRAMP" },
      { name: "Pentera", detail: "$250M+ raised, ~$100M ARR" },
      { name: "Picus Security", detail: "BAS leader" },
    ],
    ossGap: "PentAGI/PentestGPT are early; no production-grade OSS",
    agentWorkflow: "Recon → Discover vulns → Chain exploits → Escalate privs → Lateral move → Demonstrate impact",
    color: "#ff3366",
  },
  {
    id: 4,
    name: "Cloud Security Posture (CSPM)",
    shortName: "Cloud Posture",
    problem: "Cloud misconfigurations cause 23% of cloud security incidents, with 82% of breaches involving cloud-stored data and the average enterprise maintaining 43 misconfigurations per account — while 61% of security teams drown in excessive false-positive CSPM alerts.",
    solution: "Agentic AI continuously scans cloud configs, correlates findings via a security graph for business context, auto-generates remediation as infrastructure-as-code pull requests, validates fixes, and enforces drift prevention — closing the loop from detection to resolution.",
    tier: 2,
    readiness: 7,
    painScore: 8,
    marketSize: "$5.3–5.8B",
    marketGrowth: "$10–11B by 2030",
    cagr: "15–31%",
    vcFunding: "$32B+ (Wiz)",
    whitespace: 3,
    competition: 8,
    keyStats: [
      "82% breaches involve cloud data",
      "43 misconfigs per cloud account",
      "99% cloud failures = customer fault",
      "61% teams face excessive CSPM alerts",
    ],
    keyPlayers: [
      { name: "Wiz", detail: "Acquired by Google for $32B" },
      { name: "Gomboc AI", detail: "$13M, IaC remediation" },
      { name: "Orca Security", detail: "Agentless cloud security" },
      { name: "Prowler (OSS)", detail: "Multi-cloud CSPM" },
    ],
    ossGap: "OSS scans exist; no autonomous remediation loop",
    agentWorkflow: "Scan configs → Correlate security graph → Generate IaC PRs → Validate fixes → Prevent drift",
    color: "#00bbff",
  },
  {
    id: 5,
    name: "Identity & Permission Security",
    shortName: "Identity Security",
    problem: "Identity is now the #1 attack vector (60% of leading threats), yet 99% of cloud permissions go unused, machine identities outnumber humans 82-to-1, and quarterly access reviews are rubber-stamp exercises that miss sprawling, dormant privileges.",
    solution: "Agents continuously monitor actual permission usage across all cloud providers, build behavioral baselines, generate least-privilege policies, detect dormant service accounts, auto-rotate credentials, and govern the emerging wave of AI agent identities.",
    tier: 2,
    readiness: 5,
    painScore: 9,
    marketSize: "$22–26B",
    marketGrowth: "$42–78B by 2030",
    cagr: "12–15%",
    vcFunding: "$25B+ (M&A)",
    whitespace: 7,
    competition: 5,
    keyStats: [
      "99% cloud permissions unused",
      "93% orgs had identity breaches",
      "Machine IDs outnumber humans 82:1",
      "60% attacks are identity-based",
    ],
    keyPlayers: [
      { name: "CyberArk", detail: "Acquired by Palo Alto ~$25B" },
      { name: "Veza", detail: "$235M raised → ServiceNow" },
      { name: "SailPoint", detail: "Agentic identity governance" },
      { name: "Opal / Apono", detail: "JIT access provisioning" },
    ],
    ossGap: "No OSS for non-human identity governance",
    agentWorkflow: "Monitor usage → Build baselines → Generate least-privilege → Detect dormant accounts → Auto-rotate",
    color: "#aa66ff",
  },
  {
    id: 6,
    name: "AI-Powered Phishing Defense",
    shortName: "Phishing Defense",
    problem: "AI-generated phishing emails now achieve a 54% click-through rate (vs 12% human-written), volume surged 1,265% since ChatGPT launched, and it still takes an average of 254 days to identify and contain a phishing breach — costing $4.8M per incident.",
    solution: "Agentic AI autonomously handles user-reported phishing — classifying alerts, analyzing behavioral signals across communication patterns, resolving false positives, escalating confirmed threats, and adapting detection rules in real-time without predefined playbooks.",
    tier: 1,
    readiness: 8,
    painScore: 9,
    marketSize: "$5.2–5.9B",
    marketGrowth: "$10.7–14.3B by 2032",
    cagr: "12.8%",
    vcFunding: "$789M+",
    whitespace: 4,
    competition: 7,
    keyStats: [
      "54% click rate on AI phishing",
      "1,265% volume surge post-ChatGPT",
      "$4.8M avg breach cost",
      "254 days to detect phishing breach",
    ],
    keyPlayers: [
      { name: "Abnormal AI", detail: "$546M raised, $5.1B val" },
      { name: "Sublime Security", detail: "$243.8M raised" },
      { name: "Microsoft", detail: "Phishing Triage Agent (GA)" },
      { name: "Proofpoint", detail: "Acquired $12.3B by Thoma Bravo" },
    ],
    ossGap: "Gophish for simulation only; no autonomous defense OSS",
    agentWorkflow: "Classify reports → Analyze behavioral signals → Resolve false positives → Escalate threats → Adapt rules",
    color: "#ffcc00",
  },
  {
    id: 7,
    name: "Software Supply Chain Security",
    shortName: "Supply Chain",
    problem: "85–97% of modern application code comes from open-source dependencies, open-source malware surged 1,300% in three years, and third-party breaches doubled to 30% of all incidents — yet only half of organizations have CI/CD pipeline security in place.",
    solution: "Agents continuously scan repositories and CI/CD pipelines, generate and analyze SBOMs, proactively detect malicious package behaviors (not just known CVEs), monitor build systems for anomalous injection, and auto-create pull requests to update vulnerable dependencies.",
    tier: 2,
    readiness: 6,
    painScore: 8,
    marketSize: "$2.2–2.5B",
    marketGrowth: "$3.3–5.1B by 2030",
    cagr: "10.9–12.6%",
    vcFunding: "$1.7B+",
    whitespace: 5,
    competition: 5,
    keyStats: [
      "85–97% code from open-source",
      "1,300% malware surge 2020–23",
      "30% breaches from third parties",
      "704K+ malicious packages logged",
    ],
    keyPlayers: [
      { name: "Snyk", detail: "$1.32B raised, $8.5B val" },
      { name: "Socket.dev", detail: "$40M Series B" },
      { name: "Chainguard", detail: "$356M raised" },
      { name: "OWASP Dep-Track", detail: "OSS SBOM analysis" },
    ],
    ossGap: "Strong OSS scanning; no agentic orchestration layer",
    agentWorkflow: "Scan repos → Generate SBOMs → Detect malicious pkgs → Monitor builds → Auto-PR fixes → Validate",
    color: "#00ddaa",
  },
  {
    id: 8,
    name: "Compliance & Audit Automation",
    shortName: "Compliance Auto",
    problem: "SOC 2 compliance costs $35K–$150K+ and takes 3–18 months, organizations juggle proliferating overlapping frameworks (SOC 2, ISO 27001, PCI-DSS, EU AI Act), and evidence collection alone consumes hundreds of hours across engineering, legal, and operations.",
    solution: "Agentic AI autonomously monitors controls via hundreds of integrations, collects and organizes evidence, semantically maps new regulations to existing controls, identifies gaps, prioritizes remediation by risk, and compiles audit-ready packages — collapsing months into days.",
    tier: 3,
    readiness: 5,
    painScore: 7,
    marketSize: "$49–63B",
    marketGrowth: "$127–135B by 2030",
    cagr: "11–15%",
    vcFunding: "$832M+",
    whitespace: 5,
    competition: 6,
    keyStats: [
      "$35K–$150K+ for SOC 2",
      "3–18 months compliance timeline",
      "60% increase in SEC disclosures",
      "Proliferating framework overlap",
    ],
    keyPlayers: [
      { name: "Vanta", detail: "$504M raised, $4B valuation" },
      { name: "Drata", detail: "$328M raised, $2B valuation" },
      { name: "Secureframe", detail: "Compliance automation" },
      { name: "Sprinto", detail: "Compliance for SMBs" },
    ],
    ossGap: "Massive gap in autonomous evidence collection & mapping",
    agentWorkflow: "Monitor controls → Collect evidence → Map regulations → Identify gaps → Prioritize → Compile audit packages",
    color: "#ff88cc",
  },
  {
    id: 9,
    name: "Attack Surface Management",
    shortName: "ASM",
    problem: "The average enterprise harbors 975 unknown cloud services versus 108 known, 65% of SaaS applications are unsanctioned shadow IT, and 32% of cloud assets sit entirely unmonitored — each hiding an average of 115 vulnerabilities security teams don't know about.",
    solution: "Agents continuously discover internet-facing assets through DNS enumeration, certificate transparency, and cloud APIs, automatically classify by ownership and business criticality, correlate with vulnerability data, and generate prioritized remediation actions.",
    tier: 2,
    readiness: 6,
    painScore: 8,
    marketSize: "$1–1.5B",
    marketGrowth: "$4–8B by 2030",
    cagr: "25–31%",
    vcFunding: "$7.75B+ (M&A)",
    whitespace: 5,
    competition: 6,
    keyStats: [
      "975 unknown vs 108 known services",
      "65% SaaS apps unsanctioned",
      "32% cloud assets unmonitored",
      "$670K extra breach cost from shadow AI",
    ],
    keyPlayers: [
      { name: "Armis", detail: "Acquired by ServiceNow $7.75B" },
      { name: "Censys", detail: "$103M raised" },
      { name: "CyCognito", detail: "External ASM" },
      { name: "OWASP Amass", detail: "OSS discovery" },
    ],
    ossGap: "OSS discovery exists; no continuous agentic ASM platform",
    agentWorkflow: "Enumerate assets → Classify ownership → Correlate vulns → Prioritize by context → Remediate → Monitor drift",
    color: "#ff9500",
  },
  {
    id: 10,
    name: "Security Policy Management (NSPM)",
    shortName: "Policy Mgmt",
    problem: "Enterprises accumulate tens of thousands of firewall rules across vendors, 70–80% are outdated or redundant, 50% of organizations still manage them with spreadsheets, and no AI-native tool or open-source alternative exists to challenge legacy $100K+ NSPM incumbents.",
    solution: "Agentic AI analyzes existing rulesets, identifies redundancies and conflicts, simulates change impact on traffic flows, auto-generates compliant policies from natural-language business intent, and continuously audits against PCI DSS, HIPAA, and SOX standards.",
    tier: 3,
    readiness: 4,
    painScore: 8,
    marketSize: "$2.3–7.7B",
    marketGrowth: "$5.8–19.3B by 2030",
    cagr: "10.8–19.3%",
    vcFunding: "<$50M",
    whitespace: 10,
    competition: 2,
    keyStats: [
      "39% orgs run legacy firewalls",
      "47% config time on policy alignment",
      "50% manage rules with spreadsheets",
      "70–80% rules outdated/redundant",
    ],
    keyPlayers: [
      { name: "Tufin", detail: "Legacy NSPM, acquired Skybox" },
      { name: "AlgoSec", detail: "Legacy NSPM" },
      { name: "FireMon", detail: "Legacy NSPM" },
      { name: "Zero AI-native startups", detail: "WHITESPACE" },
    ],
    ossGap: "No open-source NSPM exists — total greenfield",
    agentWorkflow: "Analyze rules → Identify redundancies → Simulate changes → Generate policies → Audit compliance → Deploy",
    color: "#00ffcc",
  },
];

const tierLabels = {
  1: { label: "Production Ready", color: "#00ff88", bg: "rgba(0,255,136,0.08)" },
  2: { label: "Strong Momentum", color: "#00bbff", bg: "rgba(0,187,255,0.08)" },
  3: { label: "Whitespace", color: "#ff3366", bg: "rgba(255,51,102,0.08)" },
};

function RadarMini({ values, color, size = 80 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 8;
  const labels = ["Pain", "Ready", "White", "Market"];
  const n = values.length;
  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const d = (v / 10) * r;
    return [cx + d * Math.cos(angle), cy + d * Math.sin(angle)];
  });
  const poly = points.map((p) => p.join(",")).join(" ");
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((l) => (
        <polygon
          key={l}
          points={Array.from({ length: n })
            .map((_, i) => {
              const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
              return `${cx + r * l * Math.cos(angle)},${cy + r * l * Math.sin(angle)}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: n }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        return (
          <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        );
      })}
      <polygon points={poly} fill={color + "22"} stroke={color} strokeWidth="1.5" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2" fill={color} />
      ))}
      {labels.map((l, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const lx = cx + (r + 7) * Math.cos(angle);
        const ly = cy + (r + 7) * Math.sin(angle);
        return (
          <text key={l} x={lx} y={ly} fill="rgba(255,255,255,0.35)" fontSize="5.5" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">
            {l}
          </text>
        );
      })}
    </svg>
  );
}

function BarMetric({ value, max = 10, color, label }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "monospace", letterSpacing: 1 }}>{label}</span>
        <span style={{ fontSize: 10, color, fontFamily: "monospace", fontWeight: 700 }}>{value}/{max}</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${color}44, ${color})`, borderRadius: 2, transition: "width 0.8s cubic-bezier(.22,1,.36,1)" }} />
      </div>
    </div>
  );
}

function Card({ item, isSelected, onClick, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isSelected ? `linear-gradient(135deg, ${item.color}0d, ${item.color}05)` : hovered ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.01)",
        border: `1px solid ${isSelected ? item.color + "55" : hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
        borderRadius: 12,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        animation: `fadeSlideIn 0.5s ease ${index * 0.05}s both`,
      }}
    >
      {isSelected && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
        }} />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
          background: item.color + "18", color: item.color, fontSize: 11, fontWeight: 800, fontFamily: "monospace",
        }}>
          {item.id}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#e8e8e8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.shortName}</div>
        </div>
        <div style={{
          fontSize: 8, padding: "2px 6px", borderRadius: 4, fontFamily: "monospace", letterSpacing: 0.5, fontWeight: 700,
          background: tierLabels[item.tier].bg, color: tierLabels[item.tier].color, border: `1px solid ${tierLabels[item.tier].color}22`,
        }}>
          T{item.tier}
        </div>
      </div>
      <div style={{
        fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.35, marginBottom: 8,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {item.problem}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <RadarMini values={[item.painScore, item.readiness, item.whitespace, Math.min(10, item.competition)]} color={item.color} size={60} />
        <div style={{ flex: 1 }}>
          <BarMetric value={item.painScore} color={item.color} label="PAIN" />
          <BarMetric value={item.readiness} color={item.color} label="READINESS" />
          <BarMetric value={item.whitespace} color={item.color} label="WHITESPACE" />
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ item }) {
  if (!item) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
      color: "rgba(255,255,255,0.2)", fontSize: 14, fontFamily: "monospace",
    }}>
      ← Select a problem area
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.4s ease", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          background: item.color + "15", color: item.color, fontSize: 18, fontWeight: 800, fontFamily: "monospace",
          border: `1px solid ${item.color}33`,
        }}>
          {item.id}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#f0f0f0", letterSpacing: -0.5 }}>{item.name}</h2>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <span style={{
              fontSize: 9, padding: "2px 8px", borderRadius: 4, fontFamily: "monospace", fontWeight: 700,
              background: tierLabels[item.tier].bg, color: tierLabels[item.tier].color, border: `1px solid ${tierLabels[item.tier].color}22`,
            }}>
              {tierLabels[item.tier].label}
            </span>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, fontFamily: "monospace", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)" }}>
              Readiness {item.readiness}/10
            </span>
          </div>
        </div>
      </div>

      {/* Problem & Solution */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        <div style={{
          background: "rgba(255,60,60,0.04)", border: "1px solid rgba(255,60,60,0.12)", borderRadius: 8, padding: "10px 14px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <span style={{ fontSize: 12 }}>⚠</span>
            <span style={{ fontSize: 9, fontFamily: "monospace", color: "#ff6b6b", letterSpacing: 1.5, fontWeight: 700 }}>THE PROBLEM</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", lineHeight: 1.55 }}>{item.problem}</div>
        </div>
        <div style={{
          background: item.color + "06", border: `1px solid ${item.color}18`, borderRadius: 8, padding: "10px 14px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <span style={{ fontSize: 12 }}>⚡</span>
            <span style={{ fontSize: 9, fontFamily: "monospace", color: item.color, letterSpacing: 1.5, fontWeight: 700 }}>WHAT AGENTIC AI DOES</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", lineHeight: 1.55 }}>{item.solution}</div>
        </div>
      </div>

      {/* Market Data Grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20,
      }}>
        {[
          { label: "MARKET SIZE", value: item.marketSize },
          { label: "GROWTH TARGET", value: item.marketGrowth },
          { label: "CAGR", value: item.cagr },
          { label: "VC FUNDING", value: item.vcFunding },
        ].map((m) => (
          <div key={m.label} style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: "10px 12px",
          }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: 1.5, marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: item.color, fontFamily: "monospace" }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Agentic Workflow */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: 1.5, marginBottom: 8 }}>AGENTIC WORKFLOW</div>
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 12,
          display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center",
        }}>
          {item.agentWorkflow.split(" → ").map((step, i, arr) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{
                fontSize: 10, padding: "3px 8px", borderRadius: 4, fontFamily: "monospace",
                background: item.color + "12", color: item.color, border: `1px solid ${item.color}22`,
              }}>
                {step}
              </span>
              {i < arr.length - 1 && <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Key Stats */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: 1.5, marginBottom: 8 }}>KEY STATISTICS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {item.keyStats.map((stat, i) => (
            <div key={i} style={{
              fontSize: 11, color: "rgba(255,255,255,0.7)", padding: "8px 10px", borderRadius: 6,
              background: "rgba(255,255,255,0.02)", borderLeft: `2px solid ${item.color}44`,
              lineHeight: 1.3,
            }}>
              {stat}
            </div>
          ))}
        </div>
      </div>

      {/* Key Players */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: 1.5, marginBottom: 8 }}>KEY PLAYERS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {item.keyPlayers.map((p, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px",
              background: "rgba(255,255,255,0.02)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.04)",
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#ddd" }}>{p.name}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{p.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* OSS Gap */}
      <div style={{
        background: item.color + "08", border: `1px solid ${item.color}22`, borderRadius: 8, padding: 12,
      }}>
        <div style={{ fontSize: 9, color: item.color, fontFamily: "monospace", letterSpacing: 1.5, marginBottom: 6, fontWeight: 700 }}>OPEN-SOURCE GAP</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{item.ossGap}</div>
      </div>
    </div>
  );
}

function BubbleChart({ items, selected, onSelect }) {
  const width = 460, height = 240;
  const padX = 50, padY = 30;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      {/* Axes */}
      <line x1={padX} y1={height - padY} x2={width - 10} y2={height - padY} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      <line x1={padX} y1={padY - 10} x2={padX} y2={height - padY} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      <text x={width / 2} y={height - 4} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="monospace">READINESS →</text>
      <text x={8} y={height / 2} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="monospace" transform={`rotate(-90, 8, ${height / 2})`}>WHITESPACE →</text>

      {/* Grid */}
      {[2, 4, 6, 8, 10].map((v) => {
        const x = padX + ((v - 1) / 9) * (width - padX - 10);
        return (
          <g key={`gx${v}`}>
            <line x1={x} y1={padY - 10} x2={x} y2={height - padY} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <text x={x} y={height - padY + 12} fill="rgba(255,255,255,0.2)" fontSize="7" textAnchor="middle" fontFamily="monospace">{v}</text>
          </g>
        );
      })}
      {[2, 4, 6, 8, 10].map((v) => {
        const y = height - padY - ((v - 1) / 9) * (height - padY * 2 + 10);
        return (
          <g key={`gy${v}`}>
            <line x1={padX} y1={y} x2={width - 10} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <text x={padX - 8} y={y + 3} fill="rgba(255,255,255,0.2)" fontSize="7" textAnchor="end" fontFamily="monospace">{v}</text>
          </g>
        );
      })}

      {items.map((item) => {
        const x = padX + ((item.readiness - 1) / 9) * (width - padX - 10);
        const y = height - padY - ((item.whitespace - 1) / 9) * (height - padY * 2 + 10);
        const r = 8 + item.painScore * 1.5;
        const isSel = selected?.id === item.id;
        return (
          <g key={item.id} onClick={() => onSelect(item)} style={{ cursor: "pointer" }}>
            <circle cx={x} cy={y} r={r + 4} fill={item.color + "08"} stroke="none" />
            <circle cx={x} cy={y} r={r} fill={item.color + (isSel ? "44" : "22")} stroke={item.color + (isSel ? "cc" : "66")} strokeWidth={isSel ? 2 : 1} />
            <text x={x} y={y + 1} fill="#fff" fontSize="8" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace" fontWeight="700">{item.id}</text>
            <text x={x} y={y + r + 10} fill="rgba(255,255,255,0.4)" fontSize="6.5" textAnchor="middle" fontFamily="monospace">{item.shortName}</text>
          </g>
        );
      })}
    </svg>
  );
}

function MarketBar({ items, selected, onSelect }) {
  const maxVal = 80;
  const parseMarket = (s) => {
    const match = s.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map((item) => {
        const val = parseMarket(item.marketSize);
        const isSel = selected?.id === item.id;
        return (
          <div key={item.id} onClick={() => onSelect(item)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "3px 0" }}>
            <span style={{ width: 60, fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.shortName}
            </span>
            <div style={{ flex: 1, height: 14, background: "rgba(255,255,255,0.03)", borderRadius: 3, overflow: "hidden", position: "relative" }}>
              <div style={{
                width: `${Math.min(100, (val / maxVal) * 100)}%`, height: "100%", borderRadius: 3,
                background: `linear-gradient(90deg, ${item.color}33, ${item.color}${isSel ? "88" : "55"})`,
                transition: "all 0.5s ease",
                border: isSel ? `1px solid ${item.color}66` : "none",
              }} />
              <span style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", fontSize: 8, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>
                {item.marketSize}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(data[0]);
  const [view, setView] = useState("bubble");
  const [filterTier, setFilterTier] = useState(null);

  const filtered = filterTier ? data.filter((d) => d.tier === filterTier) : data;

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0b0f", color: "#e8e8e8", fontFamily: "'Geist', -apple-system, sans-serif",
      padding: "20px 24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        body { margin: 0; background: #0a0b0f; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24, animation: "fadeSlideIn 0.5s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "#00ff88",
            animation: "pulse 2s ease-in-out infinite", boxShadow: "0 0 8px #00ff8866",
          }} />
          <span style={{ fontSize: 9, fontFamily: "monospace", color: "rgba(255,255,255,0.3)", letterSpacing: 3, textTransform: "uppercase" }}>
            Cybersecurity × Agentic AI Intelligence
          </span>
        </div>
        <h1 style={{
          margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: -1, fontFamily: "'Outfit', sans-serif",
          background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          10 Problems Agentic AI Will Transform First
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.35)", maxWidth: 500 }}>
          Ranked by pain severity, market opportunity, technical readiness, and whitespace for new entrants
        </p>
      </div>

      {/* Tier Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setFilterTier(null)} style={{
          padding: "5px 12px", borderRadius: 6, border: `1px solid ${!filterTier ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
          background: !filterTier ? "rgba(255,255,255,0.06)" : "transparent", color: "rgba(255,255,255,0.6)", fontSize: 10,
          fontFamily: "monospace", cursor: "pointer", letterSpacing: 0.5,
        }}>ALL</button>
        {Object.entries(tierLabels).map(([t, info]) => (
          <button key={t} onClick={() => setFilterTier(parseInt(t))} style={{
            padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 10, fontFamily: "monospace", letterSpacing: 0.5,
            border: `1px solid ${filterTier === parseInt(t) ? info.color + "44" : "rgba(255,255,255,0.06)"}`,
            background: filterTier === parseInt(t) ? info.bg : "transparent", color: filterTier === parseInt(t) ? info.color : "rgba(255,255,255,0.4)",
          }}>
            T{t}: {info.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, minHeight: "calc(100vh - 200px)" }}>
        {/* Left: Card List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", maxHeight: "calc(100vh - 200px)", paddingRight: 4 }}>
          {filtered.map((item, i) => (
            <Card key={item.id} item={item} isSelected={selected?.id === item.id} onClick={() => setSelected(item)} index={i} />
          ))}
        </div>

        {/* Right: Detail + Viz */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Viz Toggle + Chart */}
          <div style={{
            background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 9, fontFamily: "monospace", color: "rgba(255,255,255,0.35)", letterSpacing: 1.5 }}>
                {view === "bubble" ? "READINESS vs WHITESPACE (bubble = pain)" : "MARKET SIZE COMPARISON"}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                {["bubble", "market"].map((v) => (
                  <button key={v} onClick={() => setView(v)} style={{
                    padding: "3px 10px", borderRadius: 4, border: `1px solid ${view === v ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}`,
                    background: view === v ? "rgba(255,255,255,0.06)" : "transparent",
                    color: view === v ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                    fontSize: 9, fontFamily: "monospace", cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5,
                  }}>
                    {v === "bubble" ? "Bubble" : "Market"}
                  </button>
                ))}
              </div>
            </div>
            {view === "bubble" ? (
              <BubbleChart items={filtered} selected={selected} onSelect={setSelected} />
            ) : (
              <MarketBar items={data} selected={selected} onSelect={setSelected} />
            )}
          </div>

          {/* Detail Panel */}
          <div style={{
            background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 20,
            flex: 1, overflowY: "auto", maxHeight: "calc(100vh - 480px)",
          }}>
            <DetailPanel item={selected} />
          </div>
        </div>
      </div>

      {/* Footer summary */}
      <div style={{
        marginTop: 20, padding: "12px 16px", borderRadius: 10,
        background: "linear-gradient(135deg, rgba(0,255,136,0.03), rgba(0,187,255,0.03), rgba(255,51,102,0.03))",
        border: "1px solid rgba(255,255,255,0.04)",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
      }}>
        {[
          { label: "Total VC Funding", value: "$6.3B+ (2025)", color: "#00ff88" },
          { label: "Market by 2030", value: "$86–160B", color: "#00bbff" },
          { label: "Workforce Gap", value: "4.8M unfilled", color: "#ff3366" },
          { label: "Biggest Whitespace", value: "#10 Policy Mgmt", color: "#00ffcc" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 8, fontFamily: "monospace", color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
