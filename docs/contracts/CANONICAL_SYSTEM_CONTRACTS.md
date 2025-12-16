# Canonical System Contracts

## Data Contract
- Data types: accounts (from auth provider), profiles (name, locale, consent flags), plans (life event, tasks, notes), resources (links, providers, disclaimers), telemetry (feature usage, errors), audit entries (who changed what/when).
- Validation: typed inputs at API boundaries; required IDs/foreign keys; ISO dates; enums for statuses; URLs must be https; free text constrained by length and profanity filters when applicable.
- Ownership: user-generated data belongs to the user; operational data belongs to the product; secrets/config belong to operators; derived analytics anonymized/aggregated by default.
- Persistence rules: principle of least privilege; migrations versioned; backups encrypted; retention defined per data class.

## Instructions Contract
- Source of truth lives in `docs/contracts/` and repo-level READMEs; code comments clarify edge cases, not policy.
- Changes require PR with reviewer sign-off; material governance updates tagged in release notes.
- Conflicts resolved in favor of newer contract docs; if ambiguous, escalate before implementation.

## Automation Contract
- CI runs lint, typecheck, tests, and format check on every PR; deployments are automated after green checks.
- Human steps: product decisions, content approvals, and handling of secrets; dangerous migrations require manual review.
- Bots may open chores (deps, formatting), but cannot merge without human approval.

## Resources Contract
- Templates, scripts, and forms live in `docs/` and `src/content/`; design tokens/styles live in `src/styles/`.
- Updates follow PR review; versioned where practical. Deprecated resources are marked with sunset dates.
- Reusable UI blocks belong in `src/components/` with local README describing intent and constraints.

## Research Contract
- External resources must be cited with source URL and access date. No invented phone numbers, emails, or addresses; use placeholders until user provides verified data.
- When data is uncertain, label it as tentative and request confirmation before actioning.
- AI-generated suggestions must stay within documented policies and avoid confident guesses about real people or entities.

## Copy Tone Contract
- Voice: brief, calm, capable. Direct over cute. Not therapy, not marketing fluff.
- Visual guardrails: no gradients or neon. Avoid template SaaS feel; favor clear hierarchy and restrained accents.
- Calls to action are specific and actionable.

## UX Principles Contract
- Clarity first: crisp language, obvious next steps, and minimal cognitive load.
- Trust: explain why we ask for data; show sources; avoid surprises.
- Accessibility: respect prefers-reduced-motion; maintain sufficient contrast; keyboard and screen-reader friendly.
- Progressive disclosure: surface essentials, tuck depth behind affordances; avoid dumping long lists.

## Security Contract
- Threat model: protect against account takeover, data leakage, and injection (XSS/SQL/command). Default to server-side rendering and parameterized queries.
- Safe defaults: rate limits on auth-sensitive routes, CSRF protection on mutations, output encoding for user content.
- Auditability: record admin actions and critical plan edits with actor and timestamp.
- Secrets never committed; environment variables documented via `.env.example` only.

## Legal/Compliance Contract
- Global-ready stance: align with common privacy expectations (GDPR-like); obtain consent for tracking; provide data export/delete paths.
- Disclaimers: content is guidance, not legal/financial/medical advice; users remain responsible for decisions.
- Liability boundaries: marketplace/brokerage interactions must state that we are not an agent; third-party terms surfaced before linking users out.

## Decision Policy (Dual-Path)
- For architectural or UX-impacting choices, briefly evaluate at least two viable approaches (trade-offs, risk, effort) and pick the simplest option that meets requirements and preserves future flexibility.
- Document the chosen path in PR notes or relevant README; if both paths carry risk, escalate for decision.
