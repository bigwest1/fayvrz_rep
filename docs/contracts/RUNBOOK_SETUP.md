# Runbook: Setup Checklist (Jesse)

- GitHub deploy key: already configured (browser).
- Vercel project + custom domain `fayvrz.com`: create project and link domain (browser); Codex configures environment variables and build settings in code when provided.
- Clerk app: create app, obtain keys, set allowed redirect URLs for marketing and app routes (browser); Codex wires env variables and callback handlers in code; webhook endpoints stubbed with placeholders until URLs exist.
- PlanetScale DB: create database and branch (browser); provide `DATABASE_URL` (e.g., `mysql://<user>:<pass>@<host>/<db>?sslaccept=strict`); Codex adds Prisma/Drizzle config and migrations in code after credentials supplied.
- Resend API key: generate key (browser); Codex reads from environment variable and implements email senders.
- Mapbox token: create token with least privilege (browser); Codex uses env variable in map components and server-side geocoding when needed.
