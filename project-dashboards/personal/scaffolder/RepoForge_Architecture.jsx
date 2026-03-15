import { useState } from "react";

const TABS = [
  { id: "overview", label: "System Overview", icon: "◎" },
  { id: "repos", label: "Repo Structure", icon: "⬡" },
  { id: "pipeline", label: "Generation Pipeline", icon: "▷" },
  { id: "templates", label: "Template Architecture", icon: "◧" },
  { id: "cloud", label: "Cloud Platform", icon: "☁" },
  { id: "pricing", label: "Business Model", icon: "$" },
  { id: "roadmap", label: "Roadmap", icon: "→" },
];

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    gray: "bg-white/5 text-gray-400 border-white/10",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold border rounded-full ${colors[color]}`}>
      {children}
    </span>
  );
};

const Card = ({ title, subtitle, children, accent = "#3b82f6", className = "" }) => (
  <div className={`relative rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accent }} />
    <div className="p-5">
      {title && <h3 className="text-sm font-bold text-white tracking-tight mb-0.5">{title}</h3>}
      {subtitle && <p className="text-xs text-gray-500 mb-3">{subtitle}</p>}
      {children}
    </div>
  </div>
);

const FlowStep = ({ number, title, detail, isLast = false }) => (
  <div className="flex items-start gap-3">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">
        {number}
      </div>
      {!isLast && <div className="w-px h-full min-h-[20px] bg-white/[0.06] mt-1" />}
    </div>
    <div className="pb-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="text-xs text-gray-500 mt-0.5">{detail}</div>
    </div>
  </div>
);

const OverviewTab = () => (
  <div className="space-y-6">
    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/[0.07] to-purple-500/[0.07] border border-white/[0.06]">
      <p className="text-sm text-gray-300 leading-relaxed">
        <span className="text-white font-semibold">RepoForge</span> is a guided GitHub repo bootstrapper. Users describe what they want to build → platform creates a production-ready GitHub repo with proper structure, CI/CD, security scanning, Docker, tests, and working examples. Open-source CLI + cloud platform with premium features.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Card title="Open Source Core" subtitle="Apache 2.0 / MIT" accent="#22c55e">
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> CLI tool (repoforge create)</div>
          <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Copier template engine</div>
          <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 50 free curated templates</div>
          <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Security scanning injection</div>
          <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> CI/CD workflow generation</div>
          <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Docker + devcontainer setup</div>
          <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Template authoring SDK</div>
        </div>
      </Card>

      <Card title="Cloud Platform" subtitle="Proprietary — Freemium" accent="#f97316">
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex items-center gap-2"><span className="text-orange-400">⬡</span> Web-based wizard UI</div>
          <div className="flex items-center gap-2"><span className="text-orange-400">⬡</span> One-click GitHub App integration</div>
          <div className="flex items-center gap-2"><span className="text-orange-400">⬡</span> AI Stack Advisor (Claude API)</div>
          <div className="flex items-center gap-2"><span className="text-orange-400">⬡</span> Premium template marketplace</div>
          <div className="flex items-center gap-2"><span className="text-orange-400">⬡</span> Hosting analysis + provisioning</div>
          <div className="flex items-center gap-2"><span className="text-orange-400">⬡</span> Team governance + SSO</div>
          <div className="flex items-center gap-2"><span className="text-orange-400">⬡</span> Audit logs + compliance</div>
        </div>
      </Card>

      <Card title="Every Generated Repo" subtitle="What users get out of the box" accent="#a855f7">
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex items-center gap-2"><span className="text-purple-400">◆</span> Production project structure</div>
          <div className="flex items-center gap-2"><span className="text-purple-400">◆</span> GitHub Actions CI/CD</div>
          <div className="flex items-center gap-2"><span className="text-purple-400">◆</span> CodeQL + Semgrep SAST</div>
          <div className="flex items-center gap-2"><span className="text-purple-400">◆</span> Gitleaks secret detection</div>
          <div className="flex items-center gap-2"><span className="text-purple-400">◆</span> Trivy container scanning</div>
          <div className="flex items-center gap-2"><span className="text-purple-400">◆</span> Dependabot auto-updates</div>
          <div className="flex items-center gap-2"><span className="text-purple-400">◆</span> Docker + tests + linting</div>
        </div>
      </Card>
    </div>

    <Card title="System Architecture" accent="#3b82f6">
      <div className="font-mono text-xs text-gray-400 leading-relaxed whitespace-pre overflow-x-auto">{`
  ┌─────────────────────┐     ┌──────────────────────────────────────┐
  │   CLI (Typer+Rich)  │     │   Web App (Next.js)                  │
  │   PyPI / npm / brew │     │   Wizard · Dashboard · Marketplace   │
  └─────────┬───────────┘     └──────────────────┬───────────────────┘
            │                                    │
            │         ┌──────────────────────────┤
            │         │                          │
            ▼         ▼                          ▼
  ┌────────────────────────┐    ┌────────────────────────────────────┐
  │   Copier Engine        │    │   API Server (FastAPI)             │
  │   Jinja2 Templates     │    │   ┌──────┐ ┌────────┐ ┌────────┐ │
  │   copier.yaml configs  │    │   │/gen  │ │/analyze│ │/provis │ │
  └─────────┬──────────────┘    │   └──────┘ └────────┘ └────────┘ │
            │                   └─────────────────┬──────────────────┘
            │                                     │
            ▼                                     ▼
  ┌────────────────────┐    ┌──────────┐  ┌──────────────────────────┐
  │  Local Filesystem  │    │PostgreSQL│  │ Celery Workers + Redis   │
  │  or GitHub API     │    │  + Redis │  │ Async repo generation    │
  └────────────────────┘    └──────────┘  └──────────────────────────┘
            │                                     │
            ▼                                     ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │                          GitHub                                 │
  │   GitHub App (repos) · OAuth (auth) · Actions · Dependabot     │
  └─────────────────────────────────────────────────────────────────┘`}
      </div>
    </Card>
  </div>
);

const ReposTab = () => {
  const repos = [
    { name: "repoforge/cli", license: "Apache 2.0", color: "blue", visibility: "Public", desc: "Core CLI tool + Copier template engine integration", tech: "Python 3.13 · Typer · Rich · Copier · PyGithub", why: "Patent grant protects contributors; companies comfortable using it" },
    { name: "repoforge/templates", license: "MIT", color: "green", visibility: "Public", desc: "Free community template library (50+ curated starters)", tech: "Copier templates · Jinja2 · YAML configs", why: "Maximum permissiveness — generated repos carry zero license obligations" },
    { name: "repoforge/sdk", license: "Apache 2.0", color: "blue", visibility: "Public", desc: "Shared types, Pydantic models, template spec schema", tech: "Python · Pydantic · JSON Schema", why: "Shared contract between OSS and cloud; patent grant for schemas" },
    { name: "repoforge/docs", license: "CC BY 4.0", color: "purple", visibility: "Public", desc: "Documentation site (Astro/Starlight)", tech: "Astro · MDX · Starlight", why: "Standard for docs; allows reuse with attribution" },
    { name: "repoforge/cloud", license: "Proprietary", color: "red", visibility: "Private", desc: "Cloud platform — web UI, API, billing, marketplace", tech: "Next.js · FastAPI · Celery · Stripe · PostgreSQL", why: "Revenue-generating platform; no obligation to open-source" },
    { name: "repoforge/templates-pro", license: "Proprietary", color: "red", visibility: "Private", desc: "Premium template library — advanced starters", tech: "Copier templates · Commercial license", why: "Premium content; commercial license per purchase/subscription" },
    { name: "repoforge/infra", license: "Proprietary", color: "red", visibility: "Private", desc: "Cloud infrastructure (Terraform/Pulumi)", tech: "Terraform · AWS CDK · Docker Compose", why: "Internal deployment configs; no reason to expose" },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/[0.07] to-blue-500/[0.07] border border-white/[0.06]">
        <p className="text-sm text-gray-300 leading-relaxed">
          Multi-repo strategy with <span className="text-white font-semibold">licensing boundaries enforced at the Git level</span>. The community can fork, contribute, and use the free tier independently. Premium features live in private repos. Users own their generated output completely (MIT).
        </p>
      </div>

      <div className="space-y-3">
        {repos.map((r) => (
          <div key={r.name} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-bold text-white">{r.name}</code>
                  <Badge color={r.color}>{r.license}</Badge>
                  <Badge color={r.visibility === "Public" ? "green" : "gray"}>{r.visibility}</Badge>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-2">{r.desc}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
                <span className="text-gray-500"><span className="text-gray-400 font-medium">Stack:</span> {r.tech}</span>
                <span className="text-gray-500"><span className="text-gray-400 font-medium">Why:</span> {r.why}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PipelineTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card title="CLI Mode (Open Source)" subtitle="repoforge create --template python-crewai" accent="#22c55e">
        <div className="mt-2">
          <FlowStep number="1" title="Resolve Template" detail="Fetch from registry (Git URL), cache locally in ~/.repoforge/, validate copier.yaml" />
          <FlowStep number="2" title="Collect Answers" detail="Interactive prompts via Typer + Rich TUI, or --answers-file for CI/CD automation" />
          <FlowStep number="3" title="Render via Copier" detail="Jinja2 processes .jinja files, conditional includes evaluated, post-gen hooks run" />
          <FlowStep number="4" title="Post-Processing" detail="Remove .jinja extensions, run formatters (ruff/biome), generate lock files (uv lock)" />
          <FlowStep number="5" title="Output" detail="Write to local filesystem, git init, initial commit. Optionally push via user's PAT" isLast />
        </div>
      </Card>

      <Card title="Cloud Mode (Platform)" subtitle="Web wizard → one-click GitHub repo" accent="#f97316">
        <div className="mt-2">
          <FlowStep number="1" title="Wizard UI" detail="User picks template, answers questions in guided steps, previews project structure" />
          <FlowStep number="2" title="POST /api/generate" detail="API validates subscription + rate limits, enqueues Celery job with answers payload" />
          <FlowStep number="3" title="Celery Worker" detail="Generates GitHub App installation token (1hr expiry), runs Copier programmatically" />
          <FlowStep number="4" title="GitHub API" detail="Create repo → push via Git Data API (blobs→tree→commit→ref) → branch protection" />
          <FlowStep number="5" title="Configure Security" detail="Enable Dependabot alerts, security scanning already in .github/workflows/, return repo URL via SSE" isLast />
        </div>
      </Card>
    </div>

    <Card title="Security Scanning Stack (Injected into Every Repo)" accent="#a855f7">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-2">
        {[
          { name: "CodeQL", what: "Deep semantic SAST", when: "PR + weekly", output: "SARIF → Security tab" },
          { name: "Semgrep", what: "Pattern-based OWASP rules", when: "PR + push", output: "SARIF → Security tab" },
          { name: "Gitleaks", what: "Secret detection", when: "Every push", output: "Block if secrets found" },
          { name: "Trivy", what: "Deps + container scan", when: "PR + weekly", output: "SARIF → Security tab" },
          { name: "Dependabot", what: "Auto dependency PRs", when: "Daily check", output: "Auto-merge option" },
        ].map((s) => (
          <div key={s.name} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="text-sm font-bold text-white mb-1">{s.name}</div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>{s.what}</div>
              <div className="text-gray-600">Trigger: {s.when}</div>
              <div className="text-purple-400/70">{s.output}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>

    <Card title="GitHub App Integration" subtitle="Fine-grained permissions, short-lived tokens" accent="#3b82f6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1">
        {[
          { perm: "contents: write", why: "Create repos, push code" },
          { perm: "workflows: write", why: "Enable GitHub Actions" },
          { perm: "administration: write", why: "Branch protection, features" },
          { perm: "metadata: read", why: "Read repo metadata" },
        ].map((p) => (
          <div key={p.perm} className="p-2 rounded-lg bg-blue-500/[0.05] border border-blue-500/10">
            <code className="text-xs text-blue-400 font-semibold">{p.perm}</code>
            <div className="text-xs text-gray-500 mt-1">{p.why}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">Installation tokens auto-expire in 1 hour. Never stored — generated per request. Rate limit: 12,500 req/hr per installation.</p>
    </Card>
  </div>
);

const TemplatesTab = () => {
  const [showYaml, setShowYaml] = useState(false);
  const tiers = [
    { tier: "Launch (Month 1)", templates: [
      { name: "python-fastapi", desc: "FastAPI + uv + Ruff + PostgreSQL + Docker + CI/CD", cat: "api", diff: "beginner" },
      { name: "python-crewai-agent", desc: "CrewAI + YAML agents/tasks + tool examples + Docker", cat: "ai-agent", diff: "beginner" },
      { name: "python-langgraph-agent", desc: "LangGraph + state machines + checkpointing", cat: "ai-agent", diff: "intermediate" },
      { name: "ts-nextjs-app", desc: "Next.js 15 + TypeScript + Tailwind + shadcn + CI/CD", cat: "web-app", diff: "beginner" },
      { name: "python-cli", desc: "Typer + Rich + uv + PyPI publishing workflow", cat: "cli-tool", diff: "beginner" },
    ]},
    { tier: "Month 2–3", templates: [
      { name: "ts-nextjs-saas", desc: "Next.js + Auth.js + Prisma + Stripe + Tailwind", cat: "fullstack", diff: "intermediate" },
      { name: "python-django", desc: "Django + DRF + PostgreSQL + Docker + CI/CD", cat: "api", diff: "beginner" },
      { name: "ts-express-api", desc: "Express + TypeScript + Prisma + Docker", cat: "api", diff: "beginner" },
      { name: "python-flask", desc: "Flask + SQLAlchemy + Celery + Docker", cat: "api", diff: "beginner" },
      { name: "python-data-pipeline", desc: "Dagster/Prefect + dbt + PostgreSQL", cat: "worker", diff: "intermediate" },
    ]},
    { tier: "Month 4–6", templates: [
      { name: "go-api", desc: "Go + Chi/Gin + PostgreSQL + Docker", cat: "api", diff: "intermediate" },
      { name: "rust-axum-api", desc: "Axum + SQLx + Docker", cat: "api", diff: "advanced" },
      { name: "python-autogen-agent", desc: "AutoGen/AG2 + conversation patterns", cat: "ai-agent", diff: "intermediate" },
      { name: "ts-nextjs-ai-app", desc: "Next.js + Vercel AI SDK + multi-provider", cat: "fullstack", diff: "intermediate" },
      { name: "multi-monorepo", desc: "Turborepo + Next.js + Python API backend", cat: "monorepo", diff: "advanced" },
    ]},
  ];
  const catColors = { api: "blue", "ai-agent": "purple", "web-app": "orange", fullstack: "pink", "cli-tool": "green", worker: "amber", monorepo: "red" };
  const diffColors = { beginner: "green", intermediate: "amber", advanced: "red" };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/[0.07] to-pink-500/[0.07] border border-white/[0.06]">
        <p className="text-sm text-gray-300 leading-relaxed">
          Every template is a <span className="text-white font-semibold">Copier-compatible directory</span> with a copier.yaml manifest. Users answer questions → Jinja2 conditionals include/exclude files → output is a complete, runnable project.
        </p>
      </div>

      <Card title="Template Quality Standards" subtitle="Every template MUST include" accent="#22c55e">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1 text-xs text-gray-400">
          {["README.md (< 5 min start)", ".github/workflows/ci.yml", ".github/workflows/security.yml", ".github/dependabot.yml", "tests/ (passing)", "Dockerfile (multi-stage)", ".env.example", "Makefile (dev/test/lint)"].map((r) => (
            <div key={r} className="flex items-center gap-1.5">
              <span className="text-emerald-500 text-sm">✓</span> {r}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span><span className="text-blue-400 font-medium">Python:</span> uv + Ruff + pyright + src/ layout + pyproject.toml</span>
          <span><span className="text-blue-400 font-medium">TypeScript:</span> pnpm + Biome + Vitest + ESM + strict tsconfig</span>
        </div>
      </Card>

      {tiers.map((t) => (
        <div key={t.tier}>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t.tier}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {t.templates.map((tpl) => (
              <div key={tpl.name} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <code className="text-xs font-bold text-white">{tpl.name}</code>
                  <Badge color={catColors[tpl.cat]}>{tpl.cat}</Badge>
                  <Badge color={diffColors[tpl.diff]}>{tpl.diff}</Badge>
                </div>
                <p className="text-xs text-gray-500">{tpl.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Card title="copier.yaml Manifest Example" accent="#7c3aed">
        <button onClick={() => setShowYaml(!showYaml)} className="text-xs text-purple-400 hover:text-purple-300 mb-2 underline underline-offset-2">
          {showYaml ? "Hide" : "Show"} copier.yaml structure
        </button>
        {showYaml && (
          <pre className="text-xs text-gray-400 bg-black/30 rounded-lg p-4 overflow-x-auto leading-relaxed">{`_min_copier_version: "9.0"
_subdirectory: "template"

_metadata:
  name: "python-crewai-agent"
  category: "ai-agent"
  language: "python"
  difficulty: "beginner"
  version: "1.0.0"
  includes_ci: true
  includes_security: true
  frameworks: ["crewai", "langchain"]

project_name:
  type: str
  help: "Your project name"
  validator: "{% if not project_name|regex_search('^[a-z][a-z0-9-]*$') %}Lowercase with hyphens{% endif %}"

llm_provider:
  type: str
  choices: ["openai", "anthropic", "ollama"]
  default: "openai"

include_tools:
  type: bool
  default: true
  help: "Include example tool implementations?"

include_docker:
  type: bool
  default: true

include_security_scanning:
  type: bool
  default: true`}</pre>
        )}
      </Card>
    </div>
  );
};

const CloudTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card title="Cloud Tech Stack" accent="#f97316">
        <div className="space-y-2 mt-1">
          {[
            { layer: "Frontend", tech: "Next.js 15 + TypeScript + Tailwind + shadcn/ui" },
            { layer: "API", tech: "FastAPI + Python 3.13 + OpenAPI auto-docs" },
            { layer: "Auth", tech: "GitHub OAuth (login) + GitHub App (repos)" },
            { layer: "Database", tech: "PostgreSQL + SQLAlchemy + Alembic" },
            { layer: "Queue", tech: "Celery + Redis (async repo generation)" },
            { layer: "Billing", tech: "Stripe (subs + marketplace + Connect payouts)" },
            { layer: "Storage", tech: "S3/R2 (template bundles, archives)" },
            { layer: "Hosting", tech: "AWS ECS Fargate or Railway" },
            { layer: "Monitoring", tech: "Sentry + PostHog" },
          ].map((r) => (
            <div key={r.layer} className="flex gap-2 text-xs">
              <span className="text-orange-400 font-semibold w-20 flex-shrink-0">{r.layer}</span>
              <span className="text-gray-400">{r.tech}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Database Schema (Core)" accent="#dc2626">
        <div className="space-y-2 mt-1">
          {[
            { table: "users", fields: "github_id, plan (free/pro/team), stripe_customer_id" },
            { table: "teams", fields: "slug, plan, stripe_subscription_id, settings" },
            { table: "projects", fields: "template_name, answers (JSONB), github_repo_url, status" },
            { table: "templates", fields: "category, premium, price_cents, downloads, rating, approved" },
            { table: "template_purchases", fields: "amount, platform_fee, author_payout, stripe_payment_id" },
            { table: "audit_logs", fields: "action, resource_type, resource_id, metadata (JSONB)" },
          ].map((r) => (
            <div key={r.table} className="flex gap-2 text-xs">
              <code className="text-red-400 font-semibold w-36 flex-shrink-0">{r.table}</code>
              <span className="text-gray-500">{r.fields}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <Card title="Premium Features (Cloud-Exclusive)" accent="#eab308">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div className="p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/10">
          <div className="text-sm font-bold text-white mb-1">AI Stack Advisor</div>
          <div className="text-xs text-gray-500 mb-2">Pro+ tier</div>
          <p className="text-xs text-gray-400">User describes their app in plain English → Claude API maps to template + config recommendation. Conversational UX with structured output.</p>
          <div className="mt-2 p-2 rounded bg-black/30 text-xs text-gray-500 font-mono">
            "I want a chatbot that searches my docs" → python-langgraph-agent + RAG + pgvector
          </div>
        </div>
        <div className="p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/10">
          <div className="text-sm font-bold text-white mb-1">Hosting Analysis</div>
          <div className="text-xs text-gray-500 mb-2">Pro+ tier</div>
          <p className="text-xs text-gray-400">Scans existing GitHub repo → detects stack, resource needs → recommends hosting with cost estimates. Railway vs AWS vs Cloudflare comparison.</p>
          <div className="mt-2 p-2 rounded bg-black/30 text-xs text-gray-500 font-mono">
            FastAPI + PostgreSQL → Railway ($5-15/mo) vs ECS Fargate ($15-40/mo)
          </div>
        </div>
        <div className="p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/10">
          <div className="text-sm font-bold text-white mb-1">Hosting Provisioning</div>
          <div className="text-xs text-gray-500 mb-2">Team+ tier</div>
          <p className="text-xs text-gray-400">Generates Terraform/Pulumi configs for AWS, GCP, or Cloudflare. Optionally applies in sandboxed container with user approval.</p>
          <div className="mt-2 p-2 rounded bg-black/30 text-xs text-gray-500 font-mono">
            → infra/main.tf + variables.tf + outputs.tf pushed to repo
          </div>
        </div>
      </div>
    </Card>

    <Card title="Deployment Architecture" accent="#475569">
      <div className="font-mono text-xs text-gray-400 leading-relaxed whitespace-pre overflow-x-auto">{`
  AWS Account ($200-500/mo at launch → $2K/mo at 10K MAU)
  ┌─────────────────────────────────────────────────────┐
  │  CloudFront (CDN)                                   │
  │       │                                             │
  │  ECS Fargate                                        │
  │  ┌────────────┐ ┌────────────┐ ┌─────────────────┐ │
  │  │ web (x2)   │ │ api (x2)   │ │ worker (x3)     │ │
  │  │ Next.js    │ │ FastAPI    │ │ Celery           │ │
  │  └────────────┘ └────────────┘ └─────────────────┘ │
  │                                                     │
  │  RDS PostgreSQL    ElastiCache Redis    S3 + SES    │
  └─────────────────────────────────────────────────────┘

  Alternative: Railway ($50-150/mo at launch, simpler ops)`}</div>
    </Card>
  </div>
);

const PricingTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { name: "Free", price: "$0", color: "#3b82f6", border: "border-blue-500/20", features: [
          "CLI + all free templates", "Local generation (unlimited)", "3 cloud repos/month", "GitHub push via PAT", "Full security scanning", "Community support",
        ]},
        { name: "Pro", price: "$19–29/mo", color: "#f97316", border: "border-orange-500/20", popular: true, features: [
          "Everything in Free", "Unlimited cloud repos", "Premium template library", "AI Stack Advisor", "Hosting analysis", "Saved preferences", "Private template registry",
        ]},
        { name: "Team", price: "$39–59/user", color: "#ec4899", border: "border-pink-500/20", features: [
          "Everything in Pro", "Team template governance", "Hosting provisioning", "Compliance templates", "SSO/SAML", "Audit logs", "Custom repo branding",
        ]},
        { name: "Marketplace", price: "15–25% fee", color: "#a855f7", border: "border-purple-500/20", features: [
          "Sell templates ($29–$499)", "75–85% to authors", "Author dashboard", "Download analytics", "Verified author badge", "Revenue sharing",
        ]},
      ].map((plan) => (
        <div key={plan.name} className={`rounded-xl border ${plan.border} bg-white/[0.02] overflow-hidden ${plan.popular ? "ring-1 ring-orange-500/30" : ""}`}>
          {plan.popular && (
            <div className="bg-orange-500/10 text-orange-400 text-center text-xs font-bold py-1">RECOMMENDED</div>
          )}
          <div className="p-4">
            <div className="text-lg font-black text-white">{plan.name}</div>
            <div className="text-2xl font-black mt-1" style={{ color: plan.color }}>{plan.price}</div>
            <div className="mt-3 space-y-1.5">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                  <span style={{ color: plan.color }} className="mt-0.5">✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>

    <Card title="Revenue Projection" accent="#22c55e">
      <div className="overflow-x-auto">
        <table className="w-full text-xs mt-1">
          <thead>
            <tr className="text-gray-500 border-b border-white/[0.06]">
              <th className="text-left py-2 pr-4 font-semibold">Stage</th>
              <th className="text-left py-2 pr-4">Timeline</th>
              <th className="text-right py-2 pr-4">Free Users</th>
              <th className="text-right py-2 pr-4">Paid Users</th>
              <th className="text-right py-2 pr-4">Conv.</th>
              <th className="text-right py-2 pr-4">ARPU</th>
              <th className="text-right py-2 font-bold text-emerald-400">Est. ARR</th>
            </tr>
          </thead>
          <tbody className="text-gray-400">
            {[
              ["Seed", "Year 1", "5,000", "150", "3%", "$30", "$54K"],
              ["Post-seed", "Year 2", "25,000", "1,250", "5%", "$35", "$525K"],
              ["Series A", "Year 3", "100,000", "5,000", "5%", "$40", "$2.4M"],
              ["Growth", "Year 4", "500,000", "30,000", "6%", "$45", "$16.2M"],
              ["Scale", "Year 5", "2,000,000", "140,000", "7%", "$50", "$84M"],
            ].map(([stage, time, free, paid, conv, arpu, arr], i) => (
              <tr key={i} className="border-b border-white/[0.03]">
                <td className="py-2 pr-4 font-semibold text-white">{stage}</td>
                <td className="py-2 pr-4">{time}</td>
                <td className="py-2 pr-4 text-right">{free}</td>
                <td className="py-2 pr-4 text-right">{paid}</td>
                <td className="py-2 pr-4 text-right">{conv}</td>
                <td className="py-2 pr-4 text-right">{arpu}</td>
                <td className="py-2 text-right font-bold text-emerald-400">{arr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

    <Card title="Market Validation" accent="#3b82f6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
        <div className="text-center p-3">
          <div className="text-2xl font-black text-blue-400">$1M+</div>
          <div className="text-xs text-gray-500 mt-1">ShipFast (Next.js boilerplate) lifetime revenue at $199–$379/purchase, solo creator</div>
        </div>
        <div className="text-center p-3">
          <div className="text-2xl font-black text-blue-400">121M</div>
          <div className="text-xs text-gray-500 mt-1">New GitHub repos created in 2025 alone. 331K per day. One every 260ms.</div>
        </div>
        <div className="text-center p-3">
          <div className="text-2xl font-black text-blue-400">693K</div>
          <div className="text-xs text-gray-500 mt-1">New AI/LLM repos in past 12 months — 178% YoY growth, almost zero scaffolding</div>
        </div>
      </div>
    </Card>
  </div>
);

const RoadmapTab = () => {
  const phases = [
    { phase: "Phase 1", title: "Open-Source Foundation", timeline: "Months 1–3", color: "#22c55e", goal: "Ship CLI + 5 templates. Target: 1,000 GitHub stars.", items: [
      { month: "Month 1", tasks: ["Set up repoforge/cli repo", "Copier integration + generation pipeline", "python-fastapi template", "python-crewai-agent template", "Security scanning workflow gen", "Publish to PyPI"] },
      { month: "Month 2", tasks: ["ts-nextjs-app template", "python-langgraph-agent template", "python-cli template", "Template registry + list/search", "repoforge update (Copier sync)", "npm wrapper + Homebrew"] },
      { month: "Month 3", tasks: ["5 more Tier 2 templates", "Template authoring SDK + docs", "Documentation site", "Show HN launch", "Community Discord", "Contributor guide + quality CI"] },
    ]},
    { phase: "Phase 2", title: "Cloud Platform MVP", timeline: "Months 4–6", color: "#f97316", goal: "Ship web UI + GitHub App + free cloud tier. Start converting to Pro.", items: [
      { month: "Month 4", tasks: ["Cloud platform scaffolding", "GitHub App + OAuth flow", "Web wizard UI", "Async repo generation (Celery)", "Project dashboard"] },
      { month: "Month 5", tasks: ["Stripe integration (Pro)", "Rate limiting", "AI Stack Advisor (Claude API)", "Premium template infra", "10 premium templates"] },
      { month: "Month 6", tasks: ["Hosting Analysis feature", "Product Hunt launch", "First 100 paid subscribers", "Community template submissions"] },
    ]},
    { phase: "Phase 3", title: "Marketplace + Teams", timeline: "Months 7–12", color: "#a855f7", goal: "Marketplace, team features, hosting provisioning. Target: $50K MRR.", items: [
      { month: "Month 7–8", tasks: ["Template marketplace", "Stripe Connect for payouts", "Author dashboard", "Team accounts + SSO"] },
      { month: "Month 9–10", tasks: ["Hosting provisioning (Terraform)", "Team template governance", "Audit logs", "50+ free, 30+ premium templates"] },
      { month: "Month 11–12", tasks: ["Enterprise features + SLA", "VS Code extension", "100+ total templates", "Target: $50K MRR"] },
    ]},
  ];

  return (
    <div className="space-y-6">
      {phases.map((p) => (
        <Card key={p.phase} title={`${p.phase}: ${p.title}`} subtitle={`${p.timeline} — ${p.goal}`} accent={p.color}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {p.items.map((m) => (
              <div key={m.month}>
                <div className="text-xs font-bold text-gray-400 mb-2">{m.month}</div>
                <div className="space-y-1.5">
                  {m.tasks.map((t, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="text-gray-600 mt-px">○</span> {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

const TAB_COMPONENTS = {
  overview: OverviewTab,
  repos: ReposTab,
  pipeline: PipelineTab,
  templates: TemplatesTab,
  cloud: CloudTab,
  pricing: PricingTab,
  roadmap: RoadmapTab,
};

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const TabContent = TAB_COMPONENTS[activeTab];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-sm">RF</div>
            <div>
              <h1 className="text-xl font-black tracking-tight">RepoForge</h1>
              <p className="text-xs text-gray-500">Platform Architecture & Business Model</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-white/[0.08] text-white border border-white/[0.1]"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <TabContent />

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/[0.04] text-center text-xs text-gray-600">
          Open Source (Apache 2.0 + MIT) · Cloud Platform (Proprietary) · Template Marketplace (75-85% to authors)
        </div>
      </div>
    </div>
  );
}
