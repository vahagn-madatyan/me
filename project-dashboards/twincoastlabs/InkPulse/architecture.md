# Architecture

Technical architecture for Ink Pulse — how the pieces fit together.

---

## Request Flow

```
Browser Request
     │
     ▼
  proxy.ts              ← Refreshes Supabase session cookies on every request
     │
     ▼
  Next.js App Router
     │
     ├── (auth)/*       ← Public: login, signup, password reset
     ├── (setup)/*      ← Auth-only: studio setup wizard
     ├── (dashboard)/*  ← Auth + studio required: all dashboard pages
     ├── [slug]/book/*  ← Public: client booking flow
     ├── consent/sign/* ← Public: consent form signing (token auth)
     └── api/*          ← API routes (mixed auth)
```

### `proxy.ts`

Replaces Next.js middleware. Runs before every request to refresh Supabase SSR cookies. Located at the project root. The matcher skips static assets.

---

## Auth Flow

```
Signup → Email Verification → PKCE Callback → Setup Wizard → Dashboard
         (Supabase sends)    (/auth/callback)   (create studio)
```

1. User signs up with email + password via Supabase `signUp()`
2. Supabase sends verification email with a code
3. User clicks link → `/auth/callback` exchanges PKCE code for session
4. `proxy.ts` sets session cookies
5. Dashboard layout calls `getAuthContext()`:
   - Checks Supabase session exists
   - Looks up user in `users` table
   - If no user record → redirects to `/setup`
   - If user exists → renders dashboard with studio context
6. Setup wizard creates studio + user + artist records via `POST /api/studio`

### Auth Clients

| File | Context | Use |
|------|---------|-----|
| `supabase/client.ts` | Browser (client components) | `useAuth` hook, client-side auth |
| `supabase/server.ts` | Server (RSC, API routes) | Reading session, fetching data |
| `supabase/admin.ts` | Server (service role) | Bypasses RLS for admin operations |
| `supabase/proxy.ts` | `proxy.ts` | Session refresh with cookie management |

### JWT Claims

The Custom Access Token Hook adds to every JWT:

```json
{
  "studio_id": "uuid",
  "user_role": "owner" | "admin" | "artist" | "front_desk"
}
```

All RLS policies use `auth.jwt() ->> 'studio_id'` to scope data.

---

## Multi-Tenancy

Every table has a `studio_id` column. Data isolation is enforced at three levels:

1. **RLS policies** — PostgreSQL enforces tenant isolation on every query
2. **API route guards** — `getAuthContext()` verifies the user belongs to a studio
3. **Application logic** — Queries always filter by `studio_id` from the auth context

### Route Groups

| Group | Layout | Auth | Purpose |
|-------|--------|------|---------|
| `(auth)` | Dark OKLCH | None | Login, signup, password reset |
| `(setup)` | Dark OKLCH | Session only | Studio creation wizard |
| `(dashboard)` | Sidebar + header | Session + user + studio | All management pages |
| `[studio-slug]/book` | Dark OKLCH | None | Public booking flow |
| `consent/sign/[token]` | Minimal | Token | Public consent signing |

---

## Data Patterns

### RSC → Client Component

Most dashboard pages follow this pattern:

```
page.tsx (RSC)          → Fetches data with Drizzle (server-side)
  └── *-client.tsx      → Receives data as props, handles interaction
```

The server component does auth checks and data fetching. The client component handles forms, state, and user interaction.

### API Response Envelope

All API routes return a consistent envelope:

```typescript
// Success
apiSuccess({ data }, 200)
// → { data: {...} }

// Error
apiError("Not found", 404, { id: "..." })
// → { error: "Not found", meta: { id: "..." } }
```

### Booking State Machine

```
pending → confirmed → in_progress → completed
   │         │
   └─────────┴──→ cancelled
   │         │
   └─────────┴──→ no_show
```

Valid transitions are enforced by `canTransition()` — both in the API route and in the UI (buttons only appear for valid next states).

---

## Stripe Integration

Two separate Stripe relationships per studio:

```
Studio
├── Connected Account (Stripe Connect Express)
│   └── Receives deposits from clients
│       └── Payment Intents created with on_behalf_of
│
└── Platform Customer (Stripe Billing)
    └── Pays Ink Pulse for subscription
        └── Checkout Sessions + Billing Portal
```

### Payment Flow

```
Booking Created → Checkout Endpoint → Payment Intent (Connected Account)
                                            │
                                    Stripe Webhook
                                            │
                              payment_intent.succeeded
                                            │
                              Booking status → confirmed
```

### Cancellation Flow

```
Cancel Request → Policy Engine → Calculate Refund
                                      │
                              ┌───────┴───────┐
                              │               │
                         Refundable      Not Refundable
                              │               │
                      Stripe Refund     Status → cancelled
                              │           (no refund)
                      Refund Record
                              │
                      Status → cancelled
```

---

## Testing Strategy

Pure business logic is extracted into standalone modules with no database or framework dependencies:

| Module | What It Tests |
|--------|--------------|
| `booking/availability.ts` | Slot calculation from schedule + blackouts + bookings |
| `booking/booking-actions.ts` | State machine transition validation |
| `stripe/cancellation.ts` | Policy matching and refund calculation |
| `stripe/deposit.ts` | Deposit amount from service price + config |
| `consent/token.ts` | Crypto token generation and expiration |
| `consent/pdf.ts` | PDF output structure |
| `subscription/plan-limits.ts` | Plan limit checking, usage summary, comparisons |

API routes orchestrate these pure functions with database queries. The pure functions are independently testable without mocking.

---

## Key Files

| File | Purpose |
|------|---------|
| `proxy.ts` | Supabase session refresh (runs before every request) |
| `src/lib/db/schema.ts` | Complete Drizzle schema (all 13 tables) |
| `src/lib/db/index.ts` | Database client (postgres.js + Drizzle) |
| `src/lib/shared/auth-guard.ts` | `getAuthContext()` — auth + tenant verification |
| `src/lib/shared/constants.ts` | Plan definitions, tattoo styles, booking statuses |
| `src/lib/shared/types.ts` | All TypeScript types (inferred from Drizzle schema) |
| `src/lib/booking/availability.ts` | Pure availability slot calculation |
| `src/lib/stripe/client.ts` | Lazy-initialized Stripe SDK client |
| `src/components/shared/data-table.tsx` | Reusable TanStack React Table wrapper |
| `src/components/shared/status-badge.tsx` | Unified status badge for all entity types |
