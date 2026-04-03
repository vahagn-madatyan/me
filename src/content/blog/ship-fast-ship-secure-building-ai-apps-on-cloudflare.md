---
title: 'Ship Fast, Ship Secure: Building AI Apps on Cloudflare'
description: 'Ship production AI apps in days, not weeks — using AI agents for speed and Cloudflare Zero Trust, Workers AI, and AI Gateway for security.'
pubDate: 'Apr 02 2026'
featured: true
tags: ['cloudflare', 'ai-agents', 'zero-trust', 'edge-computing', 'workers-ai', 'project-showcase']
draft: false
---

My friend spent $5,000 on a Pokemon card last month. My first thought was, "that's a lot of AI tokens you could use for cooler shit." Hmm, wonder how many tokens that actually is. So I built [Token for Granted](https://tokenforgranted.com).

It's a tactical asset valuation dashboard — submit anything and it tells you what it's worth in AI tokens across 19 providers. Your $150 headphones? 50 million Llama tokens, but only 1 million GPT-4o tokens. The idea came from pondering that tokens are slowly becoming a lifeline for people. There's the famous saying — skip buying a latte and you can afford the subscription. So the question was: if I don't buy something, how many AI tokens can I get instead, and what could that do for me?

Here's the kicker: Claude Code built it, architected it, and shipped it to Cloudflare — using skills and MCP to package, secure, and deploy without human intervention. I reviewed and approved. The agent did the rest. This post is about how that works.

## Coding at AI Speed

The way I build software now looks nothing like two years ago. The workflow is agent-driven: AI coding assistants orchestrated by skills and connected to live infrastructure through MCP.

**Skills** are reusable, structured procedures that turn vague instructions into disciplined execution. They're not "write code for me" prompts. A skill for TDD enforces that tests come before implementation. A debugging skill enforces hypothesis-first investigation instead of random changes. A deployment skill enforces verification gates before anything ships. The agent follows the procedure, and the procedure enforces quality.

**MCP** (Model Context Protocol) is the connective tissue. It lets AI agents talk to external systems — Cloudflare, Supabase, databases, browsers, design tools — without leaving the conversation. Need to check if a Worker deployed correctly? The agent calls Cloudflare's MCP tools. Need to run a migration? It talks to Supabase directly. Need to verify a UI change? It drives a browser through Playwright MCP.

The compounding effect is real. Research, outline, code, test, deploy — all agent-orchestrated, all in one session. Token for Granted went from "what if" to production in days, not weeks.

This isn't vibe coding. Skills enforce the discipline. Every feature starts with tests. Every deploy goes through verification. Every PR gets reviewed. The AI writes faster, but the guardrails are tighter than most manual workflows I've seen.

## Shipping Secure: Cloudflare Zero Trust

The old model was: build the app, deploy it somewhere, then bolt on security. Firewall rules, VPN appliances, network ACLs — all after the fact, all painful to maintain.

Cloudflare inverts this. Security is the network. When you deploy to Cloudflare, your app is already inside a zero trust perimeter. The question isn't "how do I secure this?" — it's "who do I grant access to?"

**Cloudflare Access** is the front door. It's a Zero Trust Network Access layer that replaces VPNs entirely. You put any application — a Worker, a self-hosted internal tool, a staging environment — behind identity-aware access policies. Users authenticate through your identity provider. Device posture checks verify disk encryption, OS version, location. No publicly routable IP addresses needed.

No VPN client to install and troubleshoot. No firewall rules to maintain. Just identity-aware policies that decide who gets in and what they can reach.

**Cloudflare Tunnel** is how you extend this to your own infrastructure. Got a database in a private data center? An internal API that should never be on the public internet? Tunnel creates an outbound-only connection from your network to Cloudflare's edge. Your resources become accessible through the zero trust network without ever being exposed to the internet. No firewall holes. No port forwarding. No attack surface.

The combination is powerful. Access policies define *who* can reach a service. Tunnel defines *how* it's connected. You can make an internal dashboard accessible only to your engineering team, or expose a private API only to specific Workers running in your Cloudflare account. Granular control over who and what reaches your services, with no infrastructure team required.

**Secure Web Gateway** filters traffic and enforces acceptable use policies. **Browser Isolation** renders web content at the edge instead of on the device, neutralizing browser-based attacks. The **WARP client** turns device posture — encryption status, OS version, managed device identity — into policy inputs.

The developer experience is what sells it. You deploy a Worker. You add an Access policy. Your app is behind zero trust. Three clicks. No appliances, no firewall rules, no VPN infrastructure to maintain. Security that scales with your deployment, not against it.

## The AI Platform: Workers AI, AI Gateway, and Replicate

Cloudflare isn't just a place to deploy apps — it's becoming a full AI platform. Three pieces make this work.

### Workers AI

Fifty-plus models running inference at the edge in 200+ cities. Llama, Mistral, Gemma, Flux — text generation, vision, image generation, embeddings. The models run on Cloudflare's own GPU infrastructure, which means no external API calls, no egress charges, and latency measured in the low hundreds of milliseconds.

The free tier gives you 10,000 neurons per day — enough to prototype and run low-traffic production apps without paying anything. Beyond that, it's $0.011 per 1,000 neurons. For Token for Granted, the primary inference cost stays under $5/month.

The binding model is what makes it ergonomic. Your Worker gets a direct `env.AI` binding — no SDK initialization, no API keys, no network hops outside Cloudflare's backbone:

```typescript
// Workers AI binding — direct inference from your Worker
const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Value this asset: ${description}` }
  ]
})
```

### AI Gateway

AI Gateway is the control plane for AI traffic. It sits between your application and any AI provider — not just Workers AI, but OpenAI, Anthropic, Google, xAI, DeepSeek, and 350+ models through a unified OpenAI-compatible API.

The capabilities that matter:

- **Dynamic routing** — route requests based on user segments, geography, content, or A/B testing. Define fallback chains: if Llama 3.1 8B fails, route to Mistral 7B automatically. No application code changes.
- **Budget caps** — set a hard spending ceiling. Token for Granted runs a $10/month cap. When it's exhausted, the deterministic fallback takes over. The app keeps working, the bill stops growing.
- **Caching** — identical requests served from cache with up to 90% latency reduction. For an app that might get shared on social media, this is the difference between a $2 month and a $200 month.
- **Observability** — every request logged with model, latency, token count, cost, and duration. No extra instrumentation needed.

### Replicate

Cloudflare acquired Replicate in December 2025, bringing tens of thousands of community AI models directly into the platform. This isn't a partnership or integration — Replicate is now part of Cloudflare's developer platform.

What this means in practice: you can train, fine-tune, and host models on Cloudflare's infrastructure. The model catalog — everything from Stable Diffusion variants to specialized NLP models — is now a first-party resource, not an external dependency. For developers who need models beyond what Workers AI offers natively, Replicate closes the gap without leaving the Cloudflare ecosystem.

## Token for Granted: The Proof

All of this comes together in the architecture. Token for Granted runs entirely on Cloudflare — a single Worker running TanStack Start with React 19 server-side rendering, bound to D1 for persistence, KV for caching, and Workers AI through AI Gateway for inference.

One `wrangler deploy` command ships everything — compute, storage, cache, AI — to every Cloudflare data center worldwide. No containers. No Kubernetes. No cold starts worth worrying about.

The request lifecycle touches every service. A user submits an asset for valuation. The Worker validates the input with Zod, computes a SHA-256 cache key via the Web Crypto API, and checks KV for a cached response:

```typescript
// Content-addressed caching with SHA-256
async function computeCacheKey(
  description: string,
  category: string
): Promise<string> {
  const input = `${description}|${category}`
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(input)
  )
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return `valuation:${hashHex}`
}
```

On a cache miss, AI Gateway routes to Llama 3.1 8B (or falls back to Mistral 7B). The response gets cached, an image gets generated via Flux-1-Schnell, and the full valuation is persisted to D1.

The architectural decision I'm most proud of is the **deterministic fallback**. When AI is completely unavailable — budget exhausted, gateway down, models overloaded — the system doesn't show an error. It generates a consistent valuation using the SHA-256 hash as a seed for a deterministic pricing algorithm. Same input always produces the same output. The user gets a result marked as a deterministic estimate, and the app stays fully functional.

The token pricing engine drives the core experience. For every valued asset, the system shows how many tokens from each of 19 AI providers that asset's price would buy. GPT-4o, Claude Opus 4, Gemini 2.5 Pro, Grok 3, DeepSeek R1, Llama, Mistral, Cohere — all with hardcoded per-token rates. It makes AI pricing tangible. Your $500 drone is worth 166 million GPT-4o tokens. That number hits differently than a pricing page ever could.

The visual layer is a design system called Neon Monolith — inspired by Valorant's tactical UI. Space Grotesk headlines, neon accents on dark surfaces, Framer Motion transitions on every state change. Built with Tailwind CSS v4 and React 19. Explore the architecture visually at [tokenforgranted.com/architecture-viz](https://tokenforgranted.com/architecture-viz).

Total monthly cost: under $10, enforced by AI Gateway's budget cap. The caching strategy is the key — without KV caching, every repeated query burns AI compute. With content-addressed caching, the second through Nth identical query in any hour costs zero.

## The Thesis

AI agents get you to code fast. Cloudflare gets you to production fast *and* secure.

Here's what matters: Zero Trust, WAF, CDN, AI Gateway budget caps, observability — these aren't nice-to-haves. These are the enterprise controls that organizations require before anything goes to production. Identity-aware access, network security, cost governance, audit trails. Every one of them is baked into the platform from the moment you deploy.

The takeaway is simple. With Cloudflare, you can deliver an enterprise-ready application in minutes — with all the enterprise controls already in place. You're not sacrificing speed for compliance. The platform gives you both.

Zero Trust isn't an afterthought — it's the deployment target. Your app launches inside a security perimeter, not outside one. Tunnel extends that perimeter to your private infrastructure. Access controls who gets in. The developer doesn't think about security as a separate step — it's built into the platform.

The full stack is ready. Compute at the edge with Workers. Persistence with D1. Caching with KV. AI inference with Workers AI. Model routing and cost control with AI Gateway. Thousands of models through Replicate. Security through Zero Trust. All one platform, one bill, one deploy command.

Build something. Ship it to the edge. The infrastructure is ready — and the AI agents will help you get there faster than you think.

*[Token for Granted](https://tokenforgranted.com) is live. Explore the [architecture visualization](https://tokenforgranted.com/architecture-viz) to see how the pieces fit together.*
