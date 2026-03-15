# Database Setup

Ink Pulse uses PostgreSQL via Supabase with Drizzle ORM. The schema is defined in `src/lib/db/schema.ts` and applied via raw SQL migrations in `supabase/migrations/`.

---

## Prerequisites

- A Supabase project ([create one](https://supabase.com/dashboard))
- Your `DATABASE_URL` from Supabase Dashboard → Settings → Database → Connection string

---

## Running Migrations

There are 10 migration files that must be run **in order**. Each builds on the previous.

### Option A: Supabase SQL Editor (Recommended for first setup)

1. Go to Supabase Dashboard → SQL Editor
2. Open each file from `supabase/migrations/` in order
3. Paste the contents and click "Run"

### Option B: psql

```bash
# Run all migrations in order
for f in supabase/migrations/*.sql; do
  echo "Running $f..."
  psql "$DATABASE_URL" -f "$f"
done
```

### Migration Files

| File | What It Creates |
|------|----------------|
| `00001_initial_schema.sql` | `studios`, `users`, `artists` tables; role enum; RLS policies; Custom Access Token Hook function |
| `00002_self_lookup_policy.sql` | Self-lookup RLS policy for users without `studio_id` in JWT |
| `00003_booking_engine.sql` | `artist_schedules`, `artist_blackouts`, `artist_services`, `clients`, `bookings`; booking/pricing enums; btree_gist exclusion constraint |
| `00004_public_booking_and_auth_hook_policies.sql` | Public access policies for booking flow |
| `00005_fix_public_policies_all_roles.sql` | Policy fixes for all role types |
| `00006_fix_auth_hook_security_definer.sql` | Security definer fix for access token hook |
| `00007_payments.sql` | Stripe enums; payment columns on studios/bookings; `payments` and `refunds` tables |
| `00008_consent_forms.sql` | `consent_templates` and `consent_submissions` tables; consent-pdfs storage bucket |
| `00009_portfolio_images.sql` | `portfolio_images` table |
| `00010_subscription_billing.sql` | Subscription status enum and columns on studios |

---

## Custom Access Token Hook

**This is critical.** After running migrations, you must enable the Custom Access Token Hook in the Supabase Dashboard:

1. Go to **Authentication → Hooks**
2. Find **Customize Access Token (JWT) Claims**
3. Enable it and select the `custom_access_token_hook` function

This function injects `studio_id` and `user_role` into every JWT. All RLS policies depend on these claims. Without it:
- Users can't see any data after login
- API requests fail with 403/500 errors
- The dashboard appears empty

---

## Storage Buckets

Create these buckets in Supabase Dashboard → Storage:

| Bucket | Public | Size Limit | MIME Types | Purpose |
|--------|--------|------------|------------|---------|
| `bookings` | ✅ Yes | 5 MB | `image/*` | Reference images from booking flow |
| `consent-pdfs` | ❌ No | 10 MB | Any | Signed consent form PDFs |
| `portfolio-images` | ✅ Yes | 10 MB | `image/*` | Artist portfolio images |

---

## Schema Overview

```
studios
├── users (belongs to studio)
│   └── artists (optional, linked to user)
│       ├── artist_schedules (weekly schedule entries)
│       ├── artist_blackouts (vacation dates)
│       ├── artist_services (services with pricing)
│       └── portfolio_images (portfolio)
├── clients (auto-created on first booking)
├── bookings (links artist + client + service)
│   ├── payments (Stripe payment intents)
│   └── refunds (refund records)
├── consent_templates (reusable form templates)
└── consent_submissions (signed forms with snapshots)
```

All tables have a `studio_id` column with RLS policies that scope queries to the authenticated user's studio.

---

## Drizzle ORM

The app uses Drizzle ORM for type-safe database access. The schema is defined in `src/lib/db/schema.ts`.

### Useful Commands

```bash
# Open Drizzle Studio (visual DB browser)
npx drizzle-kit studio

# Generate a new migration from schema changes
npx drizzle-kit generate

# Push schema directly to DB (development only)
npx drizzle-kit push
```

### Connection

The database client is in `src/lib/db/index.ts`. It uses `postgres.js` with SSL required:

```typescript
const client = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});
export const db = drizzle(client, { schema });
```

**If you see 500 errors that look like schema issues**, check that:
1. `DATABASE_URL` is correct
2. SSL is working (Supabase requires it)
3. All migrations have been applied

---

## Troubleshooting

### "relation does not exist" errors
Migrations weren't applied or were applied out of order. Run them again starting from `00001`.

### Empty dashboard after login
The Custom Access Token Hook is not enabled. Enable it in Supabase Dashboard → Authentication → Hooks.

### "new row violates row-level security policy"
The user's JWT doesn't have the right claims. Check that:
1. The Custom Access Token Hook is enabled
2. The user has a record in the `users` table with a `studio_id`
3. The user logged out and back in after the hook was enabled (to get a fresh JWT)

### Connection timeouts
Use the pooler connection string (port `6543`) instead of the direct connection (port `5432`). The pooler handles connection management for serverless environments.
