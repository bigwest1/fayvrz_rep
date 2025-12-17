## Fayvrz

Next.js App Router + Clerk + Prisma (PlanetScale). Calm, server-first UX for life events, tasks, and resources.

### Commands
- `npm run dev` — start the app
- `npm run db:push` — sync schema
- `npm run seed` — seed starter life events/tasks/resources
- `npm run db:studio` — open Prisma studio

### Production setup (billing/admin)
- Stripe env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL`
- Optional price ids: `STRIPE_PRICE_PLUS_ID`, `STRIPE_PRICE_FAMILY_ID`, `STRIPE_PRICE_PRO_ID`
- Webhook: point Stripe webhook to `/api/billing/webhook` (send checkout + subscription events)
- Jobs token: set `JOBS_ADMIN_TOKEN` for job processor
- Admin owner: set `OWNER_EMAIL` or `OWNER_CLERK_USER_ID`, then log in; first match becomes OWNER
- Billing pages: `/billing`, `/billing/success`, `/billing/cancel`
- Running without Stripe: leave Stripe envs unset; app stays on Free and surfaces a friendly “billing not enabled” message.

### Stripe Webhook Setup
- Production webhook URL: `https://fayvrz.com/api/billing/webhook`
- Events to send: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- In Stripe Dashboard: Developers → Webhooks → Add endpoint → paste the URL above → select the three events → create endpoint → copy the signing secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET` in Vercel env vars (and `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL`)
- Optional local testing: `stripe listen --forward-to http://localhost:3000/api/billing/webhook`
- For previews, you can point a webhook endpoint at your Vercel preview URL `/api/billing/webhook` using the same events

### Deploy automation
- Connect the repo to Vercel and enable automatic deploys on `main`
- Set env vars in Vercel (Clerk, database, Stripe if using billing, OWNER_*)
- Domain: point `fayvrz.com` to Vercel and add as a custom domain
- Deploy key helper: run `bash scripts/setup-deploy-key.sh` (creates `.keys/vercel_deploy_key`, gitignored). Add the public key as a GitHub Deploy Key; add the private key to Vercel Git settings if required.

### How to add new life events/tasks/resources
1. Add LifeEvent/TaskTemplate/ResourceTemplate/ScriptTemplate rows via Prisma (Studio or migration).
   - Keep descriptions brief and include a “verify locally” note for external info.
   - Scripts should use markdown with variables like `{{name}}`, `{{city}}`, `{{state}}`.
2. If you add new variables to scripts, update `prisma/seed.ts` or create migrations accordingly.
3. Run `npm run db:push` (or a migration) and optionally `npm run seed` to backfill new content.
4. Resource providers live in `src/lib/resources/providers/`; add a provider and wire it in `engine.ts` to surface new sources.
5. Keep the safety filter in `src/lib/safety/resourceSafety.ts` updated for blocked terms.
