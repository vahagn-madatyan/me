# Stripe Setup

Ink Pulse uses Stripe for two separate things:

1. **Stripe Connect** — Studios collect deposits from clients
2. **Stripe Billing** — Studios pay Ink Pulse for their subscription plan

Both work in test mode during development.

---

## 1. Get Your API Keys

1. Go to [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test mode** (toggle in the top bar)
3. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

Add to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 2. Create Subscription Products

Create three products for the subscription tiers:

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/test/products)
2. Click **Add product** for each tier:

| Product Name | Monthly Price | Recurring |
|-------------|--------------|-----------|
| Ink Pulse Solo | $29.00 | Monthly |
| Ink Pulse Pro | $79.00 | Monthly |
| Ink Pulse Studio | $149.00 | Monthly |

3. After creating each, copy the **Price ID** (starts with `price_`)
4. Add to `.env.local`:

```env
STRIPE_PRICE_SOLO=price_1Abc...
STRIPE_PRICE_PRO=price_1Def...
STRIPE_PRICE_STUDIO=price_1Ghi...
```

> **Note:** The Trial tier is free and doesn't need a Stripe product.

---

## 3. Set Up Webhooks

### Local Development

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

The CLI prints a webhook signing secret:

```
> Ready! Your webhook signing secret is whsec_1234...
```

Add to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_1234...
```

Keep the `stripe listen` command running while developing.

### Production

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **Add endpoint**
3. URL: `https://your-domain.com/api/stripe/webhooks`
4. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
5. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 4. Stripe Connect (Studio Onboarding)

Stripe Connect lets studios receive deposits from clients. No additional configuration is needed — the onboarding flow is built into the app:

1. Studio owner goes to **Settings → Stripe Connect**
2. Clicks **Connect with Stripe**
3. Completes Stripe's Express onboarding form
4. Returns to Ink Pulse with an active Connect account

### How It Works

- `POST /api/stripe/connect` creates an Express Connected Account and returns an onboarding link
- `GET /api/stripe/connect` checks the account's current status from the Stripe API
- Payment intents are created with `on_behalf_of` the Connected Account
- The platform (Ink Pulse) takes 0% fee initially — configurable later

### Test Mode

In test mode, Stripe provides a simulated onboarding flow. Use test bank details:

- Account number: `000123456789`
- Routing number: `110000000`
- SSN last 4: `0000`

---

## 5. Testing Payments

### Test Card Numbers

| Card | Number | Result |
|------|--------|--------|
| Success | `4242 4242 4242 4242` | Payment succeeds |
| Decline | `4000 0000 0000 0002` | Payment declined |
| Auth required | `4000 0025 0000 3155` | 3D Secure required |

Use any future expiry date and any 3-digit CVC.

### Trigger Webhook Events

```bash
# Simulate a successful payment
stripe trigger payment_intent.succeeded

# Simulate a subscription creation
stripe trigger customer.subscription.created
```

---

## Troubleshooting

### Webhook returns 500
Check that `STRIPE_WEBHOOK_SECRET` is set. Without it, signature verification fails.

### "STRIPE_SECRET_KEY is not set" at runtime
The Stripe client uses lazy initialization — it only throws when actually called, not at build time. Make sure the env var is in `.env.local`.

### Connect onboarding redirects to wrong URL
Set `NEXT_PUBLIC_APP_URL` in `.env.local` to your actual app URL. The return URL for Connect onboarding uses this.

### Subscription checkout doesn't work
Make sure the Price IDs (`STRIPE_PRICE_SOLO`, etc.) are set and match actual Stripe products. The checkout endpoint uses these to create sessions.
