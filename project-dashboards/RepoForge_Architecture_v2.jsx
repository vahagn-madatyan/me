import { useState } from "react";

const TABS = [
  { id: "overview", label: "Overview", icon: "◎" },
  { id: "repos", label: "Repo Structure", icon: "⎔" },
  { id: "arch", label: "Architecture", icon: "⬡" },
  { id: "templates", label: "Templates", icon: "◧" },
  { id: "security", label: "Security", icon: "⛉" },
  { id: "business", label: "Business Model", icon: "$" },
  { id: "roadmap", label: "Roadmap", icon: "→" },
];

const C = {
  bg: "#08080d", bg2: "#0f1017", border: "rgba(255,255,255,0.06)",
  text: "rgba(255,255,255,0.85)", text2: "rgba(255,255,255,0.55)", text3: "rgba(255,255,255,0.30)",
  blue: "#60a5fa", green: "#34d399", amber: "#fbbf24", red: "#f87171",
  purple: "#a78bfa", cyan: "#22d3ee", orange: "#fb923c",
};

const Badge = ({ children, color = C.blue }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", fontSize: 10, fontWeight: 700, borderRadius: 99, color, background: color + "15", border: `1px solid ${color}30` }}>{children}</span>
);

const Card = ({ children, style = {}, glow = false }) => (
  <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.bg2, padding: 18, boxShadow: glow ? `0 0 40px -10px ${C.blue}20` : "none", ...style }}>{children}</div>
);

function OverviewTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card glow>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ fontSize: 36 }}>⚡</div>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, margin: "0 0 6px" }}>RepoForge — Guided Repo Bootstrapper</h3>
            <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.6, margin: 0 }}>An open-source platform that creates production-ready GitHub repositories with proper project structure, CI/CD, security scanning, Docker, testing, and working examples.</p>
          </div>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {[{ icon: "🎯", title: "Target User", desc: "Developers who want to build apps but don't know the best tech stack or project setup patterns" },
          { icon: "🔧", title: "Core Value", desc: "Encodes what senior engineers know into repeatable, production-ready starting points" },
          { icon: "💡", title: "Beachhead", desc: "AI Agent scaffolding — 700K+ new AI repos/year with zero production-grade starters" }
        ].map((item, i) => (
          <Card key={i}><div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div><h4 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>{item.title}</h4><p style={{ fontSize: 11, color: C.text3, lineHeight: 1.5, margin: 0 }}>{item.desc}</p></Card>
        ))}
      </div>
      <Card>
        <h3 style={{ fontSize: 11, fontWeight: 700, color: C.text2, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>How It Works</h3>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4 }}>
          {[{ s: "1", l: "Describe", d: '"Python + agentic AI"' }, { s: "2", l: "Configure", d: "Wizard or CLI prompts" }, { s: "3", l: "Generate", d: "Copier renders template" }, { s: "4", l: "Publish", d: "Push to GitHub repo" }, { s: "5", l: "Build", d: "CI/CD + security active" }].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1 }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: C.blue + "15", border: `1px solid ${C.blue}30`, display: "flex", alignItems: "center", justifyContent: "center", color: C.blue, fontWeight: 800, fontSize: 14, margin: "0 auto 6px" }}>{s.s}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text2 }}>{s.l}</div>
                <div style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>{s.d}</div>
              </div>
              {i < 4 && <span style={{ color: C.text3, fontSize: 18, marginTop: 8, opacity: 0.4 }}>→</span>}
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 style={{ fontSize: 11, fontWeight: 700, color: C.text2, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Competitive Gap</h3>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {["Tool", "Web UI", "Sync", "CI/CD", "Security", "Multi-Lang"].map(h => <th key={h} style={{ textAlign: h === "Tool" ? "left" : "center", padding: "8px 6px", color: C.text3, fontWeight: 600, fontSize: 11 }}>{h}</th>)}
          </tr></thead>
          <tbody>{[["Cookiecutter", "✗", "✗", "✗", "✗", "✓"], ["Copier", "✗", "✓", "✗", "✗", "✓"], ["create-t3-app", "✗", "✗", "~", "✗", "TS"], ["Backstage", "✓", "✗", "✓", "~", "✓"], ["Spring Initializr", "✓", "✗", "✗", "✗", "Java"], ["RepoForge", "✓", "✓", "✓", "✓", "✓"]].map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i === 5 ? C.blue + "08" : "transparent" }}>
              <td style={{ padding: "6px", color: i === 5 ? C.blue : C.text2, fontWeight: i === 5 ? 700 : 400 }}>{row[0]}</td>
              {row.slice(1).map((c, j) => <td key={j} style={{ textAlign: "center", padding: "6px", color: c === "✓" ? C.green : c === "✗" ? C.red + "70" : C.amber }}>{c}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

function RepoStructureTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>Repository Structure & Licensing</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} /><span style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 1 }}>Public Repositories</span></div>
          {[{ n: "repoforge/cli", l: "Apache 2.0", d: "Core CLI tool + Copier template engine", c: C.blue }, { n: "repoforge/templates", l: "MIT", d: "30-50 free community templates", c: C.green }, { n: "repoforge/sdk", l: "Apache 2.0", d: "Shared types, schemas, template spec", c: C.purple }, { n: "repoforge/docs", l: "CC BY 4.0", d: "Documentation site", c: C.text3 }].map((r, i) => (
            <Card key={i}><div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 700, color: C.text }}>{r.n}</div><div style={{ fontSize: 11, color: C.text3, marginTop: 3 }}>{r.d}</div></div><Badge color={r.c}>{r.l}</Badge></div></Card>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: C.red }} /><span style={{ fontSize: 11, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: 1 }}>Private Repositories</span></div>
          {[{ n: "repoforge/cloud", d: "Cloud platform — web UI, API, billing" }, { n: "repoforge/templates-pro", d: "Premium template library (50+)" }, { n: "repoforge/infra", d: "Terraform/Pulumi infrastructure" }].map((r, i) => (
            <Card key={i}><div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 700, color: C.text }}>{r.n}</div><div style={{ fontSize: 11, color: C.text3, marginTop: 3 }}>{r.d}</div></div><Badge color={C.red}>Proprietary</Badge></div></Card>
          ))}
          <Card style={{ borderStyle: "dashed", background: "transparent" }}>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: C.text2, marginBottom: 8 }}>License Rationale</h4>
            <div style={{ fontSize: 11, color: C.text3 }}><div style={{ marginBottom: 4 }}><span style={{ color: C.blue, fontWeight: 700 }}>Apache 2.0</span> — patent grant, corporate-friendly</div><div style={{ marginBottom: 4 }}><span style={{ color: C.green, fontWeight: 700 }}>MIT</span> — zero obligations on generated code</div><div><span style={{ color: C.red, fontWeight: 700 }}>Proprietary</span> — revenue-generating SaaS</div></div>
          </Card>
        </div>
      </div>
      <Card>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: C.text2, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>CLI Project Structure</h3>
        <pre style={{ fontSize: 11, color: C.text2, fontFamily: "monospace", lineHeight: 1.7, background: C.bg, borderRadius: 8, padding: 14, margin: 0, overflowX: "auto", border: `1px solid ${C.border}` }}>{`repoforge/cli/
├── pyproject.toml            # uv-managed, Apache 2.0
├── src/repoforge/
│   ├── cli.py                # Typer commands
│   ├── engine.py             # Copier wrapper
│   ├── github.py             # GitHub API integration
│   ├── registry.py           # Template registry
│   ├── prompts.py            # Rich interactive prompts
│   └── security.py           # Security workflow injection
├── tests/
└── .github/workflows/`}</pre>
      </Card>
    </div>
  );
}

function ArchitectureTab() {
  const box = (c) => ({ padding: "8px 14px", borderRadius: 8, background: c + "10", border: `1px solid ${c}25`, textAlign: "center" });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>System Architecture</h2>
      <Card glow>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={box(C.blue)}><div style={{ fontSize: 12, fontWeight: 700, color: C.blue }}>CLI</div><div style={{ fontSize: 9, color: C.text3 }}>repoforge create</div></div>
            <div style={box(C.orange)}><div style={{ fontSize: 12, fontWeight: 700, color: C.orange }}>Web Wizard</div><div style={{ fontSize: 9, color: C.text3 }}>app.repoforge.dev</div></div>
            <div style={box(C.purple)}><div style={{ fontSize: 12, fontWeight: 700, color: C.purple }}>REST API</div><div style={{ fontSize: 9, color: C.text3 }}>api.repoforge.dev</div></div>
          </div>
          <span style={{ color: C.text3, opacity: 0.5, fontSize: 16 }}>▼</span>
          <div style={{ width: "100%", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 8 }}>API Server — FastAPI (Python 3.13)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {["/generate", "/templates", "/analyze ⭐", "/provision ⭐"].map((e, i) => <div key={i} style={{ padding: "6px 8px", borderRadius: 6, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, fontSize: 10, fontFamily: "monospace", color: C.text2 }}>{e}</div>)}
            </div>
          </div>
          <span style={{ color: C.text3, opacity: 0.5, fontSize: 16 }}>▼</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, width: "100%" }}>
            {[{ t: "Celery Workers", c: C.cyan, i: ["generate_repo", "analyze_stack", "provision_infra"] }, { t: "Copier Engine", c: C.green, i: ["Jinja2 rendering", "Conditional includes", "Post-processing"] }, { t: "GitHub App", c: C.text2, i: ["Create repo", "Git Data API push", "Branch protection"] }].map((b, i) => (
              <div key={i} style={{ borderRadius: 10, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: b.c, marginBottom: 6 }}>{b.t}</div>
                {b.i.map((item, j) => <div key={j} style={{ fontSize: 10, color: C.text3, marginBottom: 2 }}>• {item}</div>)}
              </div>
            ))}
          </div>
          <span style={{ color: C.text3, opacity: 0.5, fontSize: 16 }}>▼</span>
          <div style={{ display: "flex", gap: 12, width: "100%" }}>
            {[{ n: "PostgreSQL", d: "Users, projects, billing", c: C.blue }, { n: "Redis", d: "Cache, sessions, jobs", c: C.red }, { n: "S3 / R2", d: "Archives, previews", c: C.amber }].map((d, i) => <div key={i} style={{ ...box(d.c), flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: d.c }}>{d.n}</div><div style={{ fontSize: 9, color: C.text3 }}>{d.d}</div></div>)}
          </div>
        </div>
      </Card>
      <Card>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>Generation Pipeline (10-30s)</h3>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ s: "1. Resolve", d: "Fetch template, validate, cache" }, { s: "2. Collect", d: "Prompts or wizard, validate" }, { s: "3. Render", d: "Copier Jinja2, conditionals" }, { s: "4. Post-Process", d: "Ruff/Biome, lock files" }, { s: "5. Publish", d: "Create repo, push, protect" }].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
              <div style={{ borderRadius: 8, padding: 10, flex: 1, background: `rgba(96,165,250,${0.03 + i * 0.02})`, border: `1px solid rgba(96,165,250,${0.08 + i * 0.03})` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.text2, marginBottom: 3 }}>{s.s}</div>
                <div style={{ fontSize: 9, color: C.text3 }}>{s.d}</div>
              </div>
              {i < 4 && <span style={{ color: C.text3, opacity: 0.3 }}>→</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TemplatesTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>Template Library</h2>
      <Card>
        <h3 style={{ fontSize: 11, fontWeight: 700, color: C.text2, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Every Repo Includes</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[{ i: "🔄", l: "CI/CD", d: "GitHub Actions on every PR" }, { i: "🛡️", l: "Security", d: "CodeQL + Semgrep + Gitleaks + Trivy" }, { i: "🐳", l: "Docker", d: "Multi-stage + docker-compose" }, { i: "✅", l: "Testing", d: "pytest / Vitest examples" }, { i: "📏", l: "Linting", d: "Ruff (Py) or Biome (TS)" }, { i: "📖", l: "Docs", d: "README + .env.example" }].map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: 10, borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontSize: 20 }}>{f.i}</div>
              <div><div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{f.l}</div><div style={{ fontSize: 10, color: C.text3 }}>{f.d}</div></div>
            </div>
          ))}
        </div>
      </Card>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} /><span style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 1 }}>Launch Templates — Tier 1</span></div>
        {[{ n: "python-fastapi", s: "FastAPI + uv + Ruff + PostgreSQL", t: ["python", "api"], d: "Beginner" }, { n: "python-crewai-agent", s: "CrewAI + YAML config + tool examples", t: ["ai-agent", "crewai"], d: "Intermediate" }, { n: "python-langgraph-agent", s: "LangGraph + state mgmt + RAG", t: ["ai-agent", "langgraph"], d: "Intermediate" }, { n: "ts-nextjs-app", s: "Next.js 15 + Tailwind + shadcn + Prisma", t: ["typescript", "nextjs"], d: "Beginner" }, { n: "python-cli", s: "Typer + Rich + PyPI publish workflow", t: ["python", "cli"], d: "Beginner" }].map((t, i) => (
          <Card key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><code style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 700, color: C.blue }}>{t.n}</code><Badge color={C.green}>{t.d}</Badge></div>
                <div style={{ fontSize: 11, color: C.text2, marginBottom: 6 }}>{t.s}</div>
                <div style={{ display: "flex", gap: 5 }}>{t.t.map((tag, j) => <span key={j} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(255,255,255,0.03)", color: C.text3, border: `1px solid ${C.border}` }}>{tag}</span>)}</div>
              </div>
              <Badge color={C.green}>FREE</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>Security Scanning</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 10 }}>
        {[{ n: "CodeQL", t: "SAST", d: "Semantic analysis. SQLi, XSS.", c: C.blue, s: "PR + Weekly" }, { n: "Semgrep", t: "SAST", d: "Pattern-based. OWASP Top 10.", c: C.purple, s: "Every PR" }, { n: "Gitleaks", t: "Secrets", d: "Leaked keys, tokens, passwords.", c: C.red, s: "Every Push" }, { n: "Trivy", t: "SCA", d: "Deps + container + IaC.", c: C.cyan, s: "PR + Weekly" }, { n: "Dependabot", t: "Deps", d: "Auto PRs for updates.", c: C.green, s: "Daily" }].map((s, i) => (
          <Card key={i}>
            <div style={{ textAlign: "center", marginBottom: 8 }}><div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{s.n}</div><Badge color={s.c}>{s.t}</Badge></div>
            <div style={{ fontSize: 10, color: C.text3, lineHeight: 1.4, marginBottom: 8 }}>{s.d}</div>
            <div style={{ fontSize: 9, color: C.text3, background: "rgba(255,255,255,0.02)", borderRadius: 4, padding: "3px 6px", textAlign: "center" }}>{s.s}</div>
          </Card>
        ))}
      </div>
      <Card glow>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>All → GitHub Security Tab (SARIF)</h3>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            {["CodeQL → upload-sarif@v4", "Semgrep → SARIF → Security tab", "Trivy → SARIF for deps + containers", "Gitleaks → action annotations", "Dependabot → Security Advisories"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.text3, marginBottom: 5 }}><span style={{ color: C.green }}>→</span> {item}</div>
            ))}
          </div>
          <div style={{ width: 1, height: 90, background: C.border }} />
          <div style={{ width: 180, padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text2, marginBottom: 4 }}>Unified Dashboard</div>
            <div style={{ fontSize: 10, color: C.text3 }}>All findings in repo Security tab. Branch protection requires scans pass.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BusinessTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>Business Model</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
        {[{ t: "Free", p: "$0", c: C.green, f: ["Core CLI (forever free)", "50 curated templates", "CI/CD + security", "3 cloud repos/month"] }, { t: "Pro", p: "$19-29/mo", c: C.blue, f: ["Unlimited cloud repos", "Premium templates", "AI Stack Advisor", "Hosting analysis"] }, { t: "Team", p: "$39-59/user", c: C.purple, f: ["SSO / SAML", "Template governance", "Hosting provisioning", "Audit logs"] }, { t: "Marketplace", p: "15-25%", c: C.amber, f: ["Community templates", "$29-$499 each", "75-85% to creators", "Stripe Connect"] }].map((t, i) => (
          <Card key={i} style={{ background: t.c + "08", borderColor: t.c + "20" }}>
            <div style={{ textAlign: "center", marginBottom: 12 }}><div style={{ fontSize: 13, fontWeight: 700, color: t.c }}>{t.t}</div><div style={{ fontSize: 20, fontWeight: 900, color: C.text }}>{t.p}</div></div>
            {t.f.map((f, j) => <div key={j} style={{ fontSize: 10, color: C.text3, marginBottom: 4 }}>• {f}</div>)}
          </Card>
        ))}
      </div>
      <Card>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>Revenue Projection</h3>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {["Stage", "Year", "Free", "Paid", "ARPU", "ARR"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 6px", color: C.text3, fontWeight: 600, fontSize: 11 }}>{h}</th>)}
          </tr></thead>
          <tbody>{[["Seed", "1", "5K", "150", "$25/mo", "$45K"], ["Growth", "2", "25K", "1.5K", "$30/mo", "$540K"], ["Series A", "3", "100K", "6K", "$35/mo", "$2.5M"], ["Scale", "4", "500K", "35K", "$40/mo", "$16.8M"]].map((r, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>{r.map((c, j) => <td key={j} style={{ padding: "6px", color: j === 5 ? C.green : j === 0 ? C.text : C.text2, fontWeight: j < 1 || j > 4 ? 700 : 400 }}>{c}</td>)}</tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

function RoadmapTab() {
  const P = [
    { p: "Phase 1", t: "Open-Source Foundation", m: "M1-3", c: C.blue, g: "CLI + 5 templates → 1K stars", items: [[" M1", ["Core CLI", "python-fastapi", "python-crewai", "Security workflows", "PyPI publish"]], ["M2", ["ts-nextjs-app", "LangGraph template", "Registry + search", "repoforge update", "npm + Homebrew"]], ["M3", ["5 more templates", "Contributor guide", "Docs site", "Show HN", "Discord"]]] },
    { p: "Phase 2", t: "Cloud Platform", m: "M4-6", c: C.orange, g: "Web UI + Pro tier → 100 paid", items: [["M4", ["Next.js web app", "GitHub App", "Wizard UI", "Celery workers", "Dashboard"]], ["M5", ["Stripe Pro tier", "Rate limiting", "AI Stack Advisor", "Premium templates"]], ["M6", ["Hosting Analysis", "Product Hunt", "100 subscribers"]]] },
    { p: "Phase 3", t: "Marketplace + Teams", m: "M7-12", c: C.purple, g: "Marketplace → $50K MRR", items: [["M7-8", ["Marketplace launch", "Stripe Connect", "Team accounts + SSO"]], ["M9-10", ["AWS/GCP provisioning", "Template governance", "80+ templates"]], ["M11-12", ["Enterprise features", "VS Code extension", "$50K MRR"]]] },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>Roadmap</h2>
      {P.map((p, pi) => (
        <Card key={pi}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><Badge color={p.c}>{p.p}</Badge><span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{p.t}</span><span style={{ fontSize: 11, color: C.text3 }}>{p.m}</span></div>
          <div style={{ fontSize: 11, color: C.text2, marginBottom: 12 }}>{p.g}</div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${p.items.length}, 1fr)`, gap: 10 }}>
            {p.items.map(([m, tasks], mi) => (
              <div key={mi} style={{ borderRadius: 8, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, padding: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, textTransform: "uppercase", marginBottom: 6 }}>{m}</div>
                {tasks.map((t, ti) => <div key={ti} style={{ fontSize: 10, color: C.text2, marginBottom: 3 }}>○ {t}</div>)}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("overview");
  const T = { overview: OverviewTab, repos: RepoStructureTab, arch: ArchitectureTab, templates: TemplatesTab, security: SecurityTab, business: BusinessTab, roadmap: RoadmapTab };
  const Content = T[tab];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "14px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14 }}>R</div>
          <div><h1 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>RepoForge</h1><p style={{ fontSize: 10, color: C.text3, margin: 0 }}>Architecture & Business Model</p></div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}><Badge color={C.blue}>v1.0</Badge></div>
        </div>
      </div>
      <div style={{ borderBottom: `1px solid ${C.border}`, background: C.bg, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 2, padding: "0 24px", overflowX: "auto" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", background: "none", cursor: "pointer", color: tab === t.id ? C.blue : C.text3, borderBottom: `2px solid ${tab === t.id ? C.blue : "transparent"}`, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
              <span style={{ marginRight: 5, opacity: 0.6 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 48px" }}><Content /></div>
    </div>
  );
}
