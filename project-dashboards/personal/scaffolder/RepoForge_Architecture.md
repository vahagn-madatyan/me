# RepoForge — Platform Architecture & Business Model

## Executive Summary

RepoForge is an open-source, guided GitHub repo bootstrapper with a cloud-hosted premium tier. Users describe what they want to build (e.g., "Python agentic AI project"), and the platform creates a production-ready GitHub repository with proper project structure, CI/CD, security scanning, linting, testing, Docker setup, and working examples — all reflecting current best practices.

**Business model:** Open-source freemium. The core CLI + template engine + free templates are fully open-source (Apache 2.0). The cloud platform adds a web-based wizard UI, premium curated templates, team management, hosting provisioning, and stack analysis — available on a subscription basis.

---

## 1. Repository Structure & Licensing Boundaries

### Multi-Repo Strategy

The platform is split across multiple repositories with clear ownership and licensing boundaries. This separation is critical for the open-core model — it ensures the open-source community can fork, contribute, and use the free tier independently, while premium features live in private repos.

```
GitHub Organization: repoforge
├── repoforge/cli              (Apache 2.0)  — Core CLI tool + template engine
├── repoforge/templates        (MIT)         — Free community template library
├── repoforge/sdk              (Apache 2.0)  — Shared types, schemas, template spec
├── repoforge/docs             (CC BY 4.0)   — Documentation site
├── repoforge/cloud            (Proprietary)  — Cloud platform (web UI, API, billing)
├── repoforge/templates-pro    (Proprietary)  — Premium template library
└── repoforge/infra            (Proprietary)  — Cloud infrastructure (Terraform/Pulumi)
```

### License Rationale

| Repo | License | Why |
|------|---------|-----|
| `cli` | Apache 2.0 | Patent grant protects contributors; companies comfortable using it; allows commercial use while requiring attribution |
| `templates` | MIT | Maximum permissiveness — generated repos shouldn't carry license obligations. Users own their output completely |
| `sdk` | Apache 2.0 | Shared between OSS and cloud; patent grant matters for types/schemas |
| `docs` | CC BY 4.0 | Standard for documentation; allows reuse with attribution |
| `cloud` | Proprietary | Revenue-generating platform; no obligation to open-source |
| `templates-pro` | Proprietary | Premium content; commercial license per purchase/subscription |
| `infra` | Proprietary | Internal deployment configs; no reason to expose |

### What's Free vs. Paid

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FREE (Open Source)                           │
│                                                                     │
│  CLI tool (repoforge create)                                       │
│  Template engine (Copier-based)                                    │
│  30-50 curated free templates                                      │
│  Local repo generation (no GitHub account needed)                  │
│  GitHub push (via user's own PAT)                                  │
│  CI/CD injection (GitHub Actions)                                  │
│  Security scanning setup (CodeQL, Semgrep, Gitleaks, Trivy)        │
│  Docker/devcontainer setup                                         │
│  Template authoring SDK                                            │
│  Community contributions                                           │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                    CLOUD FREE TIER                                  │
│                                                                     │
│  Web-based wizard UI                                               │
│  All free templates via browser                                    │
│  GitHub App integration (one-click repo creation)                  │
│  3 repos/month                                                     │
│  Public project dashboard                                          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                    CLOUD PRO ($19-29/mo)                            │
│                                                                     │
│  Unlimited repos                                                   │
│  Premium template library (50+ advanced templates)                 │
│  AI-powered stack advisor ("describe your app, get a recommendation")│
│  Hosting analysis (scan your repo, recommend optimal hosting)      │
│  Template customization (save your own defaults/preferences)       │
│  Private template registry                                         │
│  Priority template updates                                         │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                    CLOUD TEAM ($39-59/user/mo)                      │
│                                                                     │
│  Everything in Pro                                                 │
│  Team template governance (approved stacks, required security)     │
│  Shared template library across org                                │
│  Hosting provisioning (bootstrap AWS/GCP/Cloudflare environments)  │
│  Compliance templates (SOC 2, HIPAA starter configs)               │
│  SSO/SAML                                                          │
│  Audit logs                                                        │
│  Custom branding on generated repos                                │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                    MARKETPLACE (15-25% commission)                   │
│                                                                     │
│  Community-contributed premium templates ($29-$499 each)           │
│  Template author dashboard + analytics                             │
│  Verified author program                                           │
│  Revenue sharing (75-85% to authors)                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core CLI Architecture (`repoforge/cli`)

### Overview

The CLI is the foundation. It works completely standalone — no cloud account needed. Users install via pip/pipx/npm and generate repos locally or push directly to GitHub.

### Tech Stack

- **Language:** Python 3.12+
- **Package manager:** uv (for the CLI itself and for generated Python projects)
- **CLI framework:** Typer + Rich (beautiful terminal UX with prompts, spinners, tables)
- **Template engine:** Copier (Jinja2 templating, YAML config, built-in update/sync)
- **GitHub integration:** PyGithub or httpx (direct GitHub API calls)
- **Distribution:** PyPI (`pip install repoforge`) + npm wrapper (`npx repoforge`) + Homebrew

### CLI Commands

```bash
# Interactive mode — wizard-style prompts
repoforge create

# Direct mode — specify template
repoforge create --template python-fastapi --name my-api

# With GitHub push
repoforge create --template python-crewai --name my-agent --github --private

# List available templates
repoforge list
repoforge list --category ai-agents

# Update a previously generated project from upstream template
repoforge update

# Analyze existing project and suggest improvements
repoforge analyze ./my-project

# Search templates
repoforge search "fastapi authentication"
```

### Template Engine Design

Each template is a Copier-compatible directory structure with a `copier.yaml` manifest:

```yaml
# copier.yaml — Template manifest
_min_copier_version: "9.0"
_subdirectory: "template"

# Template metadata (used by registry and CLI)
_metadata:
  name: "python-fastapi"
  description: "Production-ready FastAPI project with async PostgreSQL"
  category: "api"
  language: "python"
  tags: ["fastapi", "postgresql", "async", "rest-api"]
  difficulty: "beginner"
  estimated_setup_time: "5 minutes"
  version: "1.2.0"
  author: "repoforge"
  license: "MIT"  # License of the GENERATED output

# User-facing prompts
project_name:
  type: str
  help: "Your project name (lowercase, hyphens ok)"
  validator: "{% if not project_name|regex_search('^[a-z][a-z0-9-]*$') %}Must be lowercase with hyphens{% endif %}"

project_description:
  type: str
  help: "A short description of your project"
  default: "A FastAPI application"

python_version:
  type: str
  choices:
    - "3.12"
    - "3.13"
  default: "3.13"

database:
  type: str
  choices:
    - "postgresql"
    - "sqlite"
    - "none"
  default: "postgresql"
  help: "Which database backend?"

include_auth:
  type: bool
  default: true
  help: "Include JWT authentication boilerplate?"

include_docker:
  type: bool
  default: true
  help: "Include Dockerfile and docker-compose?"

include_ci:
  type: bool
  default: true
  help: "Include GitHub Actions CI/CD?"

include_security_scanning:
  type: bool
  default: true
  help: "Include security scanning workflows (CodeQL, Semgrep, Gitleaks)?"

cloud_provider:
  type: str
  choices:
    - "aws"
    - "gcp"
    - "cloudflare"
    - "none"
  default: "none"
  help: "Generate deployment config for a cloud provider?"
  when: "{{ include_docker }}"
```

### Template Directory Structure (Example: python-fastapi)

```
templates/python-fastapi/
├── copier.yaml                          # Template manifest + prompts
├── template/                            # Everything below here gets rendered
│   ├── {{project_name}}/                # Dynamic directory name
│   │   ├── pyproject.toml.jinja         # uv-managed dependencies
│   │   ├── README.md.jinja              # Getting started guide
│   │   ├── .gitignore
│   │   ├── .env.example
│   │   ├── src/
│   │   │   └── {{project_name}}/
│   │   │       ├── __init__.py
│   │   │       ├── main.py.jinja        # FastAPI app entry point
│   │   │       ├── config.py.jinja      # Settings via pydantic-settings
│   │   │       ├── models/
│   │   │       │   └── __init__.py
│   │   │       ├── routes/
│   │   │       │   ├── __init__.py
│   │   │       │   └── health.py        # /health endpoint
│   │   │       {% if include_auth %}
│   │   │       ├── auth/
│   │   │       │   ├── __init__.py
│   │   │       │   ├── jwt.py
│   │   │       │   └── routes.py
│   │   │       {% endif %}
│   │   │       {% if database != "none" %}
│   │   │       └── db/
│   │   │           ├── __init__.py
│   │   │           ├── session.py.jinja
│   │   │           └── migrations/
│   │   │               └── .gitkeep
│   │   │       {% endif %}
│   │   ├── tests/
│   │   │   ├── __init__.py
│   │   │   ├── conftest.py.jinja
│   │   │   └── test_health.py
│   │   │
│   │   {% if include_docker %}
│   │   ├── Dockerfile.jinja             # Multi-stage build
│   │   ├── docker-compose.yml.jinja     # App + DB + optional services
│   │   ├── .dockerignore
│   │   └── .devcontainer/
│   │       └── devcontainer.json.jinja  # VS Code dev container
│   │   {% endif %}
│   │   │
│   │   {% if include_ci %}
│   │   └── .github/
│   │       ├── workflows/
│   │       │   ├── ci.yml.jinja         # Lint + test + build
│   │       │   {% if include_security_scanning %}
│   │       │   ├── security.yml.jinja   # CodeQL + Semgrep
│   │       │   ├── secrets.yml.jinja    # Gitleaks
│   │       │   {% endif %}
│   │       │   {% if include_docker %}
│   │       │   └── docker.yml.jinja     # Build + push + Trivy scan
│   │       │   {% endif %}
│   │       ├── dependabot.yml.jinja     # Auto dependency updates
│   │       └── CODEOWNERS.jinja
│   │   {% endif %}
│   │   │
│   │   {% if cloud_provider == "aws" %}
│   │   └── infra/
│   │       ├── main.tf.jinja            # Terraform: ECS/Fargate or Lambda
│   │       ├── variables.tf.jinja
│   │       └── outputs.tf.jinja
│   │   {% endif %}
```

### Generation Pipeline

```
User Input (CLI prompts or API request)
    │
    ▼
┌──────────────────────────────────────┐
│  1. RESOLVE TEMPLATE                 │
│  - Fetch from registry (Git URL)     │
│  - Cache locally (~/.repoforge/)     │
│  - Validate copier.yaml              │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  2. COLLECT ANSWERS                  │
│  - Interactive prompts (Typer/Rich)  │
│  - Or --answers-file for CI/CD       │
│  - Validate all inputs               │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  3. RENDER TEMPLATE                  │
│  - Copier renders to temp dir        │
│  - Jinja2 processes all .jinja files │
│  - Conditional includes evaluated    │
│  - Post-generation hooks run         │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  4. POST-PROCESSING                  │
│  - Remove .jinja extensions          │
│  - Run formatters (ruff, biome)      │
│  - Validate generated files          │
│  - Generate lock files (uv lock)     │
└──────────────┬───────────────────────┘
               │
               ▼
┌─────────────────┐    ┌──────────────────────────────┐
│ 5a. LOCAL MODE  │    │  5b. GITHUB MODE              │
│ - Copy to dest  │    │  - Create repo via GitHub API │
│ - git init      │    │  - Push via Git Data API      │
│ - Initial commit│    │  - Set branch protection      │
│ - Done          │    │  - Enable Dependabot          │
└─────────────────┘    │  - Configure secrets          │
                       │  - Return repo URL            │
                       └──────────────────────────────┘
```

---

## 3. Template Registry & SDK (`repoforge/sdk`)

### Template Specification

The SDK defines the schema for template manifests, ensuring consistency across free and premium templates. This is the contract between template authors and the platform.

```python
# repoforge_sdk/models.py
from pydantic import BaseModel
from enum import Enum
from typing import Optional

class TemplateCategory(str, Enum):
    WEB_APP = "web-app"
    API = "api"
    AI_AGENT = "ai-agent"
    CLI_TOOL = "cli-tool"
    LIBRARY = "library"
    FULLSTACK = "fullstack"
    STATIC_SITE = "static-site"
    WORKER = "worker"
    MONOREPO = "monorepo"

class Language(str, Enum):
    PYTHON = "python"
    TYPESCRIPT = "typescript"
    GO = "go"
    RUST = "rust"
    MULTI = "multi"

class TemplateManifest(BaseModel):
    """Schema for copier.yaml _metadata section"""
    name: str                              # unique slug
    display_name: str                      # human-readable
    description: str                       # one-liner
    long_description: Optional[str]        # markdown, shown on detail page
    version: str                           # semver
    category: TemplateCategory
    language: Language
    tags: list[str]
    difficulty: str                        # beginner | intermediate | advanced
    estimated_setup_time: str
    author: str
    author_url: Optional[str]
    license: str                           # license of GENERATED output
    repository: str                        # git URL of template source
    min_cli_version: Optional[str]         # minimum repoforge CLI version
    premium: bool = False                  # cloud-only paid template
    price: Optional[int] = None            # price in cents (if premium)
    includes_ci: bool = True
    includes_security: bool = True
    includes_docker: bool = True
    cloud_providers: list[str] = []        # supported deploy targets
    frameworks: list[str]                  # e.g. ["fastapi", "sqlalchemy"]
    preview_image: Optional[str]           # URL to screenshot/diagram
```

### Template Registry

The registry is a JSON index file hosted in the `repoforge/templates` repo (for free templates) and served by the cloud API (for premium templates). The CLI fetches and caches this index.

```json
// registry.json (auto-generated from template repos)
{
  "version": "1.0",
  "updated_at": "2026-03-15T00:00:00Z",
  "templates": [
    {
      "name": "python-fastapi",
      "display_name": "Python FastAPI Starter",
      "description": "Production-ready FastAPI with async PostgreSQL, JWT auth, Docker, CI/CD",
      "version": "1.2.0",
      "category": "api",
      "language": "python",
      "tags": ["fastapi", "postgresql", "async", "rest-api", "docker"],
      "difficulty": "beginner",
      "repository": "https://github.com/repoforge/templates",
      "subdirectory": "python-fastapi",
      "premium": false,
      "includes_ci": true,
      "includes_security": true,
      "includes_docker": true,
      "frameworks": ["fastapi", "sqlalchemy", "alembic", "pydantic"]
    },
    {
      "name": "python-crewai-agent",
      "display_name": "CrewAI Multi-Agent Starter",
      "description": "Production-ready CrewAI project with tool examples, testing, and deployment",
      "version": "1.0.0",
      "category": "ai-agent",
      "language": "python",
      "tags": ["crewai", "ai-agent", "llm", "langchain"],
      "premium": false,
      "frameworks": ["crewai", "langchain"]
    }
  ]
}
```

---

## 4. Free Template Library (`repoforge/templates`)

### Launch Templates (Prioritized)

These are the templates to ship at launch, ordered by market demand:

**Tier 1 — Launch day (Month 1):**

| Template | Stack | Why First |
|----------|-------|-----------|
| `python-fastapi` | FastAPI + uv + Ruff + PostgreSQL + Docker + CI/CD | Most-requested Python API stack |
| `python-crewai-agent` | CrewAI + uv + tool examples + Docker + CI/CD | AI agent gap is the beachhead |
| `python-langgraph-agent` | LangGraph + state management + checkpointing + CI/CD | Second most popular agent framework |
| `ts-nextjs-app` | Next.js 15 + TypeScript + Tailwind + shadcn + CI/CD | Most popular full-stack web framework |
| `python-cli` | Typer + Rich + uv + PyPI publishing workflow | Common need, fast to build |

**Tier 2 — Month 2-3:**

| Template | Stack |
|----------|-------|
| `ts-nextjs-saas` | Next.js + Auth.js + Prisma + Stripe + Tailwind |
| `python-flask` | Flask + SQLAlchemy + Celery + Docker |
| `python-django` | Django + DRF + PostgreSQL + Docker + CI/CD |
| `ts-express-api` | Express + TypeScript + Prisma + Docker |
| `python-data-pipeline` | Dagster/Prefect + dbt + PostgreSQL |

**Tier 3 — Month 4-6:**

| Template | Stack |
|----------|-------|
| `go-api` | Go + Chi/Gin + PostgreSQL + Docker |
| `rust-axum-api` | Axum + SQLx + Docker |
| `python-autogen-agent` | AutoGen/AG2 + tool examples |
| `ts-nextjs-ai-app` | Next.js + Vercel AI SDK + multiple providers |
| `multi-monorepo` | Turborepo + Next.js frontend + Python API backend |

### Template Quality Standards

Every free template MUST include:

```
Required for ALL templates:
├── README.md                  # Getting started in <5 minutes
├── .gitignore                 # Language-appropriate
├── .env.example               # All env vars documented
├── LICENSE                    # MIT (for generated output)
├── tests/                     # At least one passing test
├── .github/
│   ├── workflows/
│   │   ├── ci.yml             # Lint + test + build on every PR
│   │   ├── security.yml       # CodeQL + Semgrep (weekly + on PR)
│   │   └── secrets.yml        # Gitleaks on every push
│   └── dependabot.yml         # Automated dependency updates
│
Required for Python:
├── pyproject.toml             # uv-managed, PEP 621 metadata
├── uv.lock                    # Locked dependencies
├── .python-version            # Pin Python version
├── ruff.toml                  # Linting + formatting config
│
Required for TypeScript:
├── package.json               # pnpm-managed
├── tsconfig.json              # Strict mode, moduleResolution: bundler
├── biome.json                 # Linting + formatting config
│
Optional but encouraged:
├── Dockerfile                 # Multi-stage, non-root user
├── docker-compose.yml         # Full local dev environment
├── .devcontainer/             # VS Code dev container
├── Makefile                   # Common commands (make dev, make test, make lint)
└── CONTRIBUTING.md            # How to contribute
```

---

## 5. Cloud Platform Architecture (`repoforge/cloud`)

### System Architecture

```
                          ┌─────────────────┐
                          │   CDN (CloudFront│
                          │   or Cloudflare) │
                          └────────┬────────┘
                                   │
                          ┌────────▼────────┐
                          │   Web App        │
                          │   (Next.js)      │
                          │   - Wizard UI    │
                          │   - Dashboard    │
                          │   - Marketplace  │
                          │   - Docs         │
                          └────────┬────────┘
                                   │
                          ┌────────▼────────┐
                          │   API Gateway    │
                          │   (FastAPI)      │
                          │                  │
                          ├── /auth          │──── GitHub OAuth + GitHub App
                          ├── /templates     │──── Template Registry
                          ├── /generate      │──── Repo Generation Jobs
                          ├── /analyze       │──── Stack Analysis (premium)
                          ├── /provision     │──── Hosting Bootstrap (premium)
                          ├── /marketplace   │──── Template Store
                          └── /billing       │──── Stripe Integration
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
           ┌────────▼──────┐ ┌────▼────┐  ┌─────▼──────┐
           │  Job Queue    │ │PostgreSQL│  │  Redis     │
           │  (Celery +    │ │          │  │  - Cache   │
           │   Redis)      │ │- Users   │  │  - Sessions│
           │               │ │- Teams   │  │  - Rate    │
           │  Workers:     │ │- Projects│  │    limits  │
           │  - generate   │ │- Billing │  │  - Job     │
           │  - analyze    │ │- Audit   │  │    broker  │
           │  - provision  │ │- Templates│ └────────────┘
           └───────────────┘ └──────────┘
```

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 15 + TypeScript + Tailwind + shadcn/ui | Your existing stack expertise; SSR for SEO |
| API | FastAPI + Python 3.13 | Same language as CLI/Copier; async; OpenAPI auto-docs |
| Auth | GitHub OAuth (user login) + GitHub App (repo operations) | Users need GitHub accounts anyway |
| Database | PostgreSQL + SQLAlchemy + Alembic | Proven, reliable, your existing expertise |
| Cache/Queue | Redis + Celery | Async job processing for repo generation (10-30s) |
| Billing | Stripe | Subscriptions + one-time template purchases + marketplace payouts |
| File Storage | S3/R2 | Template bundles, generated repo archives, preview images |
| Search | PostgreSQL full-text (v1) → Typesense (v2) | Template search, good enough initially |
| Hosting | AWS (ECS Fargate) or Railway | Container-based, auto-scaling workers |
| Monitoring | Sentry + PostHog | Error tracking + product analytics |

### Database Schema (Core Tables)

```sql
-- Users (synced from GitHub OAuth)
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    github_id       BIGINT UNIQUE NOT NULL,
    github_username VARCHAR(255) NOT NULL,
    email           VARCHAR(255),
    display_name    VARCHAR(255),
    avatar_url      TEXT,
    plan            VARCHAR(50) DEFAULT 'free',  -- free, pro, team, enterprise
    stripe_customer_id VARCHAR(255),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Teams (for Team/Enterprise plans)
CREATE TABLE teams (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) UNIQUE NOT NULL,
    plan            VARCHAR(50) DEFAULT 'team',
    stripe_subscription_id VARCHAR(255),
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_members (
    team_id         UUID REFERENCES teams(id),
    user_id         UUID REFERENCES users(id),
    role            VARCHAR(50) DEFAULT 'member',  -- owner, admin, member
    PRIMARY KEY (team_id, user_id)
);

-- Generated Projects (audit trail)
CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    team_id         UUID REFERENCES teams(id),
    template_name   VARCHAR(255) NOT NULL,
    template_version VARCHAR(50),
    github_repo_url TEXT,
    github_repo_full_name VARCHAR(255),  -- "user/repo-name"
    answers         JSONB NOT NULL,       -- template answers (for re-generation)
    status          VARCHAR(50) DEFAULT 'pending',  -- pending, generating, complete, failed
    generation_time_ms INTEGER,
    source          VARCHAR(50),          -- cli, web, api
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Template Registry (for marketplace + premium tracking)
CREATE TABLE templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) UNIQUE NOT NULL,
    display_name    VARCHAR(255) NOT NULL,
    description     TEXT,
    long_description TEXT,
    category        VARCHAR(100),
    language        VARCHAR(50),
    tags            TEXT[],
    version         VARCHAR(50),
    repository_url  TEXT NOT NULL,        -- git URL for template source
    subdirectory    VARCHAR(255),
    author_id       UUID REFERENCES users(id),
    premium         BOOLEAN DEFAULT FALSE,
    price_cents     INTEGER,              -- null for free
    stripe_price_id VARCHAR(255),         -- for one-time purchase templates
    downloads       INTEGER DEFAULT 0,
    rating          NUMERIC(3,2),
    approved        BOOLEAN DEFAULT FALSE, -- marketplace review status
    featured        BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Template Purchases (marketplace transactions)
CREATE TABLE template_purchases (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    template_id     UUID REFERENCES templates(id),
    stripe_payment_id VARCHAR(255),
    amount_cents    INTEGER NOT NULL,
    platform_fee_cents INTEGER NOT NULL,  -- 15-25% commission
    author_payout_cents INTEGER NOT NULL,
    status          VARCHAR(50) DEFAULT 'completed',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log (for team/enterprise compliance)
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    team_id         UUID REFERENCES teams(id),
    action          VARCHAR(100) NOT NULL,  -- project.created, template.purchased, etc.
    resource_type   VARCHAR(100),
    resource_id     UUID,
    metadata        JSONB DEFAULT '{}',
    ip_address      INET,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### GitHub App Integration

The cloud platform uses a GitHub App (not OAuth App) for repo operations. The app requests minimal permissions:

```yaml
# GitHub App permissions
permissions:
  contents: write          # Create repos, push code
  workflows: write         # Enable GitHub Actions
  administration: write    # Set branch protection, enable features
  metadata: read           # Read repo metadata

# User authorization
# Users install the GitHub App on their account/org
# App receives installation_id per user
# API generates short-lived installation tokens (1hr expiry)
```

**Repo Creation Flow (Cloud):**

```
1. User completes wizard → POST /api/generate
   {
     template: "python-crewai-agent",
     answers: { project_name: "my-agent", ... },
     github: {
       owner: "vahagn-username",
       repo_name: "my-agent",
       private: true,
       description: "CrewAI multi-agent project"
     }
   }

2. API validates subscription + rate limits → enqueue job

3. Celery worker executes:
   a. Generate installation token for user's GitHub App installation
   b. Run Copier programmatically:
      copier.run_copy(
          src_path="https://github.com/repoforge/templates",
          dst_path="/tmp/gen-{job_id}/",
          vcs_ref="v1.2.0",
          data=answers,
          defaults=True,
          overwrite=True,
          subdirectory="python-crewai-agent"
      )
   c. Create GitHub repo via API:
      POST /user/repos { name, private, description, auto_init: false }
   d. Push generated files via Git Data API:
      - Create blobs for each file
      - Create tree referencing blobs
      - Create commit referencing tree
      - Update refs/heads/main to point to commit
   e. Configure repo:
      - PUT /repos/{owner}/{repo}/branches/main/protection
      - PUT /repos/{owner}/{repo}/vulnerability-alerts (enable Dependabot)
      - Dependabot config already in .github/dependabot.yml

4. Return repo URL to frontend via WebSocket/SSE
```

### Security Scanning Injection Detail

Generated `.github/workflows/security.yml`:

```yaml
# This is what gets generated inside user repos
name: Security Scanning

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'  # Weekly Monday 6am UTC

permissions:
  security-events: write
  contents: read

jobs:
  codeql:
    name: CodeQL Analysis
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: {{ '{{' }} matrix.language {{ '}}' }}
      - uses: github/codeql-action/analyze@v3
        with:
          upload: true  # Uploads SARIF to GitHub Security tab

  semgrep:
    name: Semgrep SAST
    runs-on: ubuntu-latest
    container:
      image: semgrep/semgrep
    steps:
      - uses: actions/checkout@v4
      - run: semgrep scan --config auto --sarif -o semgrep.sarif
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: semgrep.sarif

  gitleaks:
    name: Secret Detection
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITLEAKS_LICENSE: {{ '${{' }} secrets.GITLEAKS_LICENSE {{ '}}' }}

  trivy:
    name: Dependency & Container Scanning
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: trivy-results.sarif
```

---

## 6. Cloud-Exclusive Premium Features

### 6a. AI Stack Advisor (Pro+)

A conversational interface where users describe what they want to build, and the platform recommends a template + configuration. This uses an LLM (Claude API) with structured output to map natural language to template selections.

```
User: "I want to build an AI chatbot that can search my company's documents
       and answer questions. I know some Python."

Stack Advisor Response:
┌────────────────────────────────────────────────────────┐
│  Recommended: python-langgraph-agent                   │
│                                                        │
│  This template sets up a LangGraph agent with:         │
│  • RAG (Retrieval-Augmented Generation) pipeline       │
│  • Document ingestion with chunking + embeddings       │
│  • Vector store (pgvector on PostgreSQL)               │
│  • FastAPI REST API for chat interface                 │
│  • Streaming responses                                 │
│  • Docker Compose for local development                │
│                                                        │
│  Estimated setup time: 10 minutes                      │
│  Difficulty: Intermediate                              │
│                                                        │
│  [Create This Project →]  [Customize First →]          │
└────────────────────────────────────────────────────────┘
```

### 6b. Hosting Analysis (Pro+)

Scans an existing GitHub repo and recommends optimal hosting based on the detected stack, expected traffic patterns, and cost constraints.

```
POST /api/analyze
{ github_repo: "vahagn/my-fastapi-app" }

Response:
{
  "detected_stack": {
    "language": "python",
    "framework": "fastapi",
    "database": "postgresql",
    "containerized": true,
    "estimated_resource_needs": "light"
  },
  "recommendations": [
    {
      "provider": "railway",
      "estimated_monthly_cost": "$5-15",
      "pros": ["Easiest setup", "Free tier available", "Auto-deploys from GitHub"],
      "cons": ["Less control", "Can get expensive at scale"],
      "deploy_complexity": "one-click"
    },
    {
      "provider": "aws-ecs-fargate",
      "estimated_monthly_cost": "$15-40",
      "pros": ["Production-grade", "Auto-scaling", "Full AWS ecosystem"],
      "cons": ["More complex setup", "AWS learning curve"],
      "deploy_complexity": "terraform-included"
    },
    {
      "provider": "cloudflare-workers",
      "estimated_monthly_cost": "$0-5",
      "pros": ["Edge deployment", "Generous free tier"],
      "cons": ["Not ideal for long-running Python", "Limited runtime"],
      "compatible": false,
      "reason": "FastAPI requires a long-running Python process"
    }
  ]
}
```

### 6c. Hosting Provisioning (Team+)

Generates and optionally applies Terraform/Pulumi configs to bootstrap cloud infrastructure for a generated project.

```
POST /api/provision
{
  project_id: "uuid",
  provider: "aws",
  config: {
    region: "us-west-2",
    environment: "staging",
    domain: "api.myapp.com",
    auto_apply: false  // generate configs only, don't apply
  }
}

→ Generates infra/ directory in repo:
  infra/
  ├── main.tf
  ├── variables.tf
  ├── outputs.tf
  ├── terraform.tfvars.example
  └── README.md  # "How to deploy this to AWS"

→ If auto_apply: true (Team+ only):
  - Runs Terraform plan in sandboxed container
  - Shows plan to user for approval
  - Applies on confirmation
  - Stores state in user's configured backend
```

---

## 7. Deployment Architecture

### Cloud Platform Deployment

```
┌──────────────────────────────────────────────────────┐
│                    AWS Account                        │
│                                                      │
│  ┌─────────────┐     ┌──────────────────────────┐   │
│  │ CloudFront  │────▶│ ECS Fargate              │   │
│  │ (CDN)       │     │ ┌──────────────────────┐ │   │
│  └─────────────┘     │ │ web (Next.js)    x2  │ │   │
│                      │ ├──────────────────────┤ │   │
│                      │ │ api (FastAPI)    x2  │ │   │
│                      │ ├──────────────────────┤ │   │
│                      │ │ worker (Celery)  x3  │ │   │
│                      │ └──────────────────────┘ │   │
│                      └──────────────────────────┘   │
│                                                      │
│  ┌─────────────┐     ┌──────────────────────────┐   │
│  │ RDS         │     │ ElastiCache              │   │
│  │ PostgreSQL  │     │ Redis                    │   │
│  │ (db.t4g.med)│     │ (cache.t4g.micro)        │   │
│  └─────────────┘     └──────────────────────────┘   │
│                                                      │
│  ┌─────────────┐     ┌──────────────────────────┐   │
│  │ S3          │     │ SES                      │   │
│  │ (templates, │     │ (transactional email)    │   │
│  │  archives)  │     └──────────────────────────┘   │
│  └─────────────┘                                    │
│                                                      │
│  Estimated cost: $200-500/mo at launch               │
│  Scales to ~$2,000/mo at 10K monthly active users    │
└──────────────────────────────────────────────────────┘

Alternative: Railway ($50-150/mo at launch, simpler ops)
```

---

## 8. Implementation Roadmap

### Phase 1: Open-Source Foundation (Months 1-3)

**Goal:** Ship the CLI + 5 templates + template SDK. Get to 1,000 GitHub stars.

```
Month 1:
  ✓ Set up repoforge/cli repo (Apache 2.0)
  ✓ Implement core generation pipeline (Copier integration)
  ✓ Build python-fastapi template
  ✓ Build python-crewai-agent template
  ✓ Security scanning workflow generation
  ✓ Local generation mode (no GitHub needed)
  ✓ GitHub push mode (via PAT)
  ✓ Publish to PyPI

Month 2:
  ✓ Build ts-nextjs-app template
  ✓ Build python-langgraph-agent template
  ✓ Build python-cli template
  ✓ Template registry (registry.json)
  ✓ `repoforge list` and `repoforge search`
  ✓ `repoforge update` (Copier update integration)
  ✓ Template authoring docs + SDK
  ✓ npm wrapper (npx repoforge)
  ✓ Homebrew formula

Month 3:
  ✓ 5 more templates (Tier 2)
  ✓ Contributor guide + template quality CI
  ✓ Documentation site (docs.repoforge.dev)
  ✓ Show HN launch
  ✓ Community Discord
```

### Phase 2: Cloud Platform MVP (Months 4-6)

**Goal:** Ship web UI + GitHub App + free cloud tier. Start converting to Pro.

```
Month 4:
  ✓ Cloud platform scaffolding (Next.js + FastAPI + PostgreSQL)
  ✓ GitHub App registration + OAuth flow
  ✓ Web-based wizard UI (guided template selection)
  ✓ Async repo generation (Celery workers)
  ✓ Project dashboard

Month 5:
  ✓ Stripe integration (Pro subscription)
  ✓ Rate limiting (3 repos/mo free, unlimited Pro)
  ✓ AI Stack Advisor (Claude API integration)
  ✓ Premium template infrastructure
  ✓ 10 premium templates

Month 6:
  ✓ Hosting Analysis feature
  ✓ Product Hunt launch
  ✓ First 100 paid subscribers target
  ✓ Community template submissions pipeline
```

### Phase 3: Marketplace + Teams (Months 7-12)

**Goal:** Template marketplace, team features, hosting provisioning.

```
Month 7-8:
  ✓ Template marketplace (author submissions, review, payouts)
  ✓ Stripe Connect for author payouts
  ✓ Author dashboard + analytics
  ✓ Team accounts + SSO

Month 9-10:
  ✓ Hosting provisioning (AWS, GCP Terraform generation)
  ✓ Team template governance (approved stacks)
  ✓ Audit logs
  ✓ 50+ free templates, 30+ premium templates

Month 11-12:
  ✓ Enterprise features (custom deployment, SLA)
  ✓ VS Code extension
  ✓ 100+ total templates
  ✓ Target: $50K MRR
```

---

## 9. Key Technical Decisions Summary

| Decision | Choice | Alternatives Considered | Why |
|----------|--------|------------------------|-----|
| Template engine | Copier | Cookiecutter, custom Jinja2, Yeoman | Built-in update/sync, Jinja2 templating, active maintenance |
| CLI language | Python | TypeScript (oclif), Go | Same language as Copier; most templates are Python; uv makes distribution fast |
| CLI framework | Typer + Rich | Click, argparse, oclif | Beautiful TUI, type hints, auto-generated help |
| Cloud API | FastAPI | Express, Django, Next.js API | Async, same language as CLI, auto OpenAPI docs |
| Cloud frontend | Next.js | SvelteKit, Remix | Your expertise, largest ecosystem, Vercel deployment option |
| Database | PostgreSQL | MySQL, SQLite | Standard, JSON support, full-text search, scales well |
| Auth model | GitHub App | OAuth App, PAT only | Fine-grained permissions, short-lived tokens, bot identity |
| Job queue | Celery + Redis | BullMQ, Dramatiq | Python native, proven at scale, matches API language |
| Billing | Stripe | Paddle, LemonSqueezy | Best marketplace/Connect support, most mature |
| License (core) | Apache 2.0 | MIT, AGPLv3 | Patent grant, corporate-friendly, prevents relicensing concerns |
| License (templates) | MIT | Apache 2.0 | Zero obligations on generated output; users own their code |
| Hosting | AWS ECS Fargate | Railway, Fly.io, GCP | Your AWS expertise; Fargate for zero-ops containers |

---

## 10. Security & Compliance Considerations

### Platform Security
- All secrets stored in AWS Secrets Manager (not env vars in code)
- GitHub App private keys encrypted at rest
- Short-lived installation tokens (1hr) — never stored, generated per-request
- All API endpoints behind rate limiting (Redis-based)
- SOC 2 Type I target for Month 12 (for enterprise sales)

### Generated Repo Security
- Every generated repo includes security scanning by default
- `.env.example` files never contain real secrets
- Dockerfiles use non-root users and multi-stage builds
- Dependencies pinned with lock files (uv.lock, pnpm-lock.yaml)
- Dependabot configured for automated updates
- Branch protection rules require CI to pass

### User Data
- Minimal data collection: GitHub profile + generation history
- No access to user's existing repos (only creates new ones)
- Template answers stored for re-generation but never shared
- GDPR-compliant data deletion on account removal
