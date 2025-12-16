# Runbook: Setup Checklist
Primary owner: Jesse. Keep this doc updated as services change.

## GitHub Deploy Key (already done)
- Status: complete.
- Responsibility: You do in browser (confirm in repo settings if rotated).

## Vercel Project + Domain (fayvrz.com)
- Steps: create Vercel project from GitHub repo, set production branch, add `fayvrz.com` + `www` domain, configure preview deployments.
- Responsibility: You do in browser.
- Code touchpoints: Codex updates environment variable wiring and any required rewrites/headers in `next.config.ts` when domain settings change.

## Clerk (Auth)
- Steps: create Clerk app, set production and preview redirect URLs (e.g., `https://fayvrz.com/*`, `http://localhost:3000/*`), enable OAuth providers as needed, set webhook endpoint placeholder.
- Responsibility: You do in browser for app setup and secrets; Codex wires `CLERK_PUBLISHABLE_KEY`/`CLERK_SECRET_KEY` and routes into code.
- Notes: keep webhook secret in env only; document allowed origins.

## PlanetScale Database
- Steps: create database, create `main` and `branch` as needed, generate password with least privilege.
- DATABASE_URL format: `mysql://<username>:<password>@<host>/<database>?sslaccept=strict`.
- Responsibility: You do in browser for provisioning and credentials; Codex updates Prisma/Drizzle schema and env placeholders.
- ORM note: Prisma or Drizzle acceptable; pick one per service and document migrations.

## Resend (Email)
- Steps: create API key, verify sending domain, set from addresses.
- Responsibility: You do in browser; Codex adds `RESEND_API_KEY` and mailer client code paths.
- Notes: keep test mode keys separate; add suppression rules for bounces.

## Mapbox (Maps)
- Steps: create token, restrict by domain/origin, enable needed APIs only.
- Responsibility: You do in browser; Codex wires `MAPBOX_TOKEN` and usage helpers.
- Notes: never ship unrestricted public tokens; document rate limits.

## Shared Env Notes
- All secrets live in deployment platform env vars and local `.env` (excluded from git). `.env.example` must list keys with placeholder values.
- After provisioning, run `pnpm/npm/yarn dev` locally to confirm envs load; update this runbook when endpoints or scopes change.
