# Canonical System Contracts

## Data Contract
- Data types: user accounts, auth session metadata, plans, tasks, resources, analytics events, content blocks, configuration flags.
- Validation: server-side schema validation for inputs and persisted records; reject unverifiable data; enforce types at boundaries (API, db, file-based content).
- Ownership: user-generated data belongs to the user; system-generated scaffolding owned by the product; environment secrets never committed.

## Instructions Contract
- Rules live in `/docs/contracts/` and repo governance docs; app-level constraints reflected in code comments only when necessary.
- Changes require pull request review; dual-path evaluation documented before merging; no silent scope creep.

## Automation Contract
- CI runs lint, format check, typecheck, and tests before deploy; migrations gated by review.
- Bots may scaffold files and update generated assets; humans review and approve before production.
- No automated modification of secrets; human sets and rotates credentials.

## Resources Contract
- Templates, scripts, and forms live under `/docs/` and `/scripts/` when present; keep versioned in git.
- Updates follow PR review; deprecate with clear notes and migration paths.

## Research Contract
- External resources must cite source; do not fabricate phone numbers, addresses, or legal text.
- Use placeholders when user has not provided real-world data; await confirmation before activation.

## Copy Tone Contract
- Voice: brief, calm, capable. Avoid marketing fluff and therapeutic language.
- Visuals: no gradients or neon; confident, modern baseline.

## UX Principles Contract
- Prioritize clarity, trust, accessibility; practice progressive disclosure to avoid overwhelm.
- Defaults are safe and reversible; explain consequences near actions.

## Security Contract
- Threat model: protect against account takeover, data leakage, and injection at API/content boundaries.
- Rate limits on auth-sensitive routes; audit logs for admin-like actions when built.
- Safe defaults: least-privilege access, HTTPS-only cookies, CSRF protections, and input/output escaping.

## Legal/Compliance Contract
- Global-ready stance: internationalization-aware content and data handling; respect regional privacy norms.
- Disclaimers where guidance is informational, not legal/financial advice; no guarantees.
- Marketplace brokerage caution: do not imply fiduciary or brokerage roles without explicit legal review.

## Decision Policy
- Dual-path principle: when multiple architectures exist, outline at least two viable options with trade-offs, choose the best, and record the rationale before implementing.
