---
title: 'Building an AI Skills Suite for Network Security'
description: 'How I built a collection of 35+ agent skills that turn AI coding assistants into network security engineers — covering device triage, firewall audits, compliance assessments, and cloud security posture reviews.'
pubDate: 'Mar 21 2026'
featured: true
tags: ['ai-agents', 'network-security', 'open-source', 'cisco', 'python']
---

I spent the last few months building [netsec-skills-suite](https://github.com/vahagn-madatyan/netsec-skills-suite) — a collection of 35+ agent skills that let AI coding assistants perform real network security operations. Device health checks, firewall policy audits, compliance assessments, incident response procedures — all structured as step-by-step procedures an agent can follow.

This post covers why I built it, how the skills are structured, and what I learned about making AI agents useful for infrastructure work.

## The Problem

Network security engineering involves a lot of structured, repeatable procedures. When a router's CPU spikes, you run the same diagnostic commands in the same order every time. When you audit a firewall ruleset, you check for the same categories of misconfigurations.

These procedures live in runbooks, tribal knowledge, and the heads of senior engineers. They're perfect candidates for AI agent skills — structured enough to be codified, complex enough to benefit from automation.

## What's in the Suite

The skills break down into five domains:

**Device Health** — Platform-specific triage procedures for Cisco IOS-XE/NX-OS, Juniper JunOS, and Arista EOS. Each skill understands the platform's CLI, has threshold tables for classifying severity, and includes decision trees for root cause analysis.

**Routing Protocols** — BGP, OSPF, EIGRP, and IS-IS analysis skills. These go beyond "is the neighbor up" — they diagnose path selection issues, convergence problems, and routing policy misconfigurations across multi-vendor environments.

**Security Audits** — Firewall policy analysis for Palo Alto, FortiGate, Check Point, and Cisco ASA/FTD. Plus vendor-agnostic ACL analysis, CIS benchmark compliance, NIST 800-53 mapping, and vulnerability assessment.

**Cloud Security** — VPC design analysis, security group audits, and cross-cloud security posture assessment for AWS, Azure, and GCP.

**Observability** — SIEM log analysis with query patterns for Splunk, ELK, and QRadar. Grafana dashboard auditing. Incident response lifecycle management.

## How a Skill Works

Each skill is a `SKILL.md` file following the [Agent Skills](https://github.com/empoweragents/agent-skills) specification. Here's the structure:

```markdown
---
name: cisco-device-health
version: 1.0.0
description: Cisco IOS-XE and NX-OS device health check
tags: [cisco, health-check, triage]
safety_tier: read-only
---

## Procedure

### Step 1: Establish Baseline Context
Collect device identity, uptime, and software version...

### Step 2: CPU Utilization Assessment
| Metric     | Normal | Warning | Critical |
|------------|--------|---------|----------|
| 5-second   | <60%   | 60-90%  | >90%     |
| 5-minute   | <50%   | 50-70%  | >70%     |
```

The key design decisions:

1. **Safety tiers** — Every skill declares whether it's `read-only` (just collects data) or `read-write` (may change config). The agent can enforce guardrails based on this metadata.

2. **Threshold tables** — Hardcoded severity classifications. No guessing, no hallucination. If 5-minute CPU is at 72%, it's critical. Period.

3. **Decision trees** — When a metric is abnormal, the skill tells the agent exactly what to investigate next. CPU critical + top process is BGP Router → check for route churn.

4. **Multi-vendor support** — Most skills cover Cisco, JunOS, and EOS with platform-specific command variations. The agent picks the right commands for the device it's connected to.

## Security Pipeline

Network security tools need to be secure themselves. Every skill goes through a multi-layer validation pipeline:

```bash
# 1. Spec validation — frontmatter schema, required fields
agentskills validate

# 2. Convention validation — safety tiers, required sections
./scripts/validate.sh

# 3. Security audit — injection detection, safety tier mismatches
python scripts/skill_security_auditor.py

# 4. VirusTotal — 70+ engine scan on every PR
# 5. OpenSSF Scorecard — weekly security posture evaluation
```

The custom security auditor (`skill_security_auditor.py`) scans for command injection patterns, prompt injection attempts, credential harvesting, obfuscation, and safety tier mismatches — where a skill claims to be `read-only` but contains write commands.

## What I Learned

**Structure beats intelligence.** The skills that work best aren't the ones with the most sophisticated logic — they're the ones with the clearest procedures. A simple checklist with good thresholds outperforms a vague "analyze the device" instruction every time.

**Safety tiers matter.** The `read-only` / `read-write` distinction isn't just metadata — it changes how operators trust the tool. When an engineer knows a skill can only run show commands, they'll let it run against production without hesitation.

**Multi-vendor is hard but worth it.** Writing a single skill that handles Cisco, Juniper, and Arista triples the maintenance burden. But it also triples the value — network teams rarely run single-vendor environments.

**Validation is the feature.** The security pipeline isn't overhead — it's what makes the project usable. Nobody's installing AI agent skills for their network devices if those skills haven't been scanned for injection attacks.

## What's Next

The suite currently has 35 skills across networking, security, cloud, and observability. The roadmap includes:

- **Automation skills** — Moving from analysis to remediation with `read-write` skills for common fixes
- **Playbook composition** — Chaining skills into multi-step incident response workflows
- **Lab validation** — Testing skills against virtual network environments before recommending them for production

If you work in network security and want to try it:

```bash
npx skills add vahagn-madatyan/netsec-skills-suite
```

The repo is open source. PRs welcome — especially for platforms I haven't covered yet.
