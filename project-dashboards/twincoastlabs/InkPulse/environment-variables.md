# Environment Variables

Ink Pulse requires credentials for Supabase, Stripe, and an app URL. All variables go in `.env.local` (never committed to git).

```bash
cp .env.example .env.local
```

---

## Supabase

| Variable | Required | Where to Find |
|----------|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | Supabase Dashboard → Settings → API → `anon` `public` key |
| `SUPABASE_SECRET_KEY` | ✅ | Supabase Dashboard → Settings → API → `service_role` key |
| `DATABASE_URL` | ✅ | Supabase Dashboard → Settings → Database → Connection string (URI) |

### Notes

- **`DATABASE_URL`** must use the **pooler** connection string (port `6543`) for serverless environments. The direct connection (port `5432`) works for local scripts but may hit connection limits in production.
- **`SUPABASE_SECRET_KEY`** is the service role key — it bypasses RLS. Used only server-side for admin operations (webhook processing, image uploads, consent PDF storage).
- The database connection requires SSL. The app automatically sets `ssl: 'require'` — no manual SSL config needed.

### Vercel Integration

If you connect your Supabase project via the [Vercel Integration](https://vercel.com/integrations/supabase), it auto-provisions:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (as `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `SUPABASE_SECRET_KEY` (as `SUPABASE_SERVICE_ROLE_KEY`)
- `DATABASE_URL` (as `POSTGRES_URL`)

Rename them to match what the app expects, or update the code references.

---

## Stripe

| Variable | Required | Where to Find |
|----------|----------|---------------|
| `STRIPE_SECRET_KEY` | ✅ | Stripe Dashboard → Developers → API keys → Secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe Dashboard → Developers → API keys → Publishable key |
| `STRIPE_WEBHOOK_SECRET` | ✅ (production) | Stripe Dashboard → Developers → Webhooks → Signing secret |
| `STRIPE_PRICE_SOLO` | For billing | Stripe Dashboard → Products → Solo plan → Price ID |
| `STRIPE_PRICE_PRO` | For billing | Stripe Dashboard → Products → Pro plan → Price ID |
| `STRIPE_PRICE_STUDIO` | For billing | Stripe Dashboard → Products → Studio plan → Price ID |

### Notes

- Use **test mode** keys during development (`sk_test_...`, `pk_test_...`).
- **`STRIPE_WEBHOOK_SECRET`** is required for webhook signature verification. Without it, the webhook endpoint returns 500.
- **Price IDs** are only needed if you want subscription billing to work. The app functions without them — subscription features will show errors when attempting checkout.

### Setting Up Stripe Products

Create three products in the Stripe Dashboard (test mode):

| Product | Monthly Price | Price ID Variable |
|---------|--------------|-------------------|
| Solo | $29.00 | `STRIPE_PRICE_SOLO` |
| Pro | $79.00 | `STRIPE_PRICE_PRO` |
| Studio | $149.00 | `STRIPE_PRICE_STUDIO` |

1. Go to Stripe Dashboard → Products → Add product
2. Set the name (e.g., "Ink Pulse Solo")
3. Add a recurring price (monthly)
4. Copy the price ID (starts with `price_`)
5. Add to `.env.local`

### Webhook Setup (Local Development)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and forward events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

The CLI prints a webhook signing secret (`whsec_...`) — use that as `STRIPE_WEBHOOK_SECRET`.

### Webhook Setup (Production)

1. Go to Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://your-domain.com/api/stripe/webhooks`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
4. Copy the signing secret → set as `STRIPE_WEBHOOK_SECRET`

---

## App

| Variable | Required | Default |
|----------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Recommended | `http://localhost:3000` |

Used for generating absolute URLs (e.g., consent magic links, Stripe return URLs). Set to your production domain when deploying.

---

## Summary

Minimum variables to get running locally:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
DATABASE_URL=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

Everything else can be added later as you enable specific features.
