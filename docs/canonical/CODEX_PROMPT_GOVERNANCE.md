# Codex Prompt Governance

Required context for future prompts:
- Reference `/docs/canonical/*` and honor all contracts.
- Read relevant schema files before edits (`src/lib/events/lifeEvent.schema.ts`, Prisma schema, auth/billing helpers).
- Assume Clerk auth + Prisma/PlanetScale + Stripe-optional billing.

Prohibited behaviors:
- Do not refactor auth flows or middleware without explicit user request.
- Do not alter entitlements/plan logic without aligning to PLANS definitions.
- Do not introduce gradients or therapy framing.
- Do not remove fallbacks for Stripe-off or AI-off scenarios.

Versioning rules:
- Document structural changes to UX patterns, schema, or contracts before code changes.
- New events/features must align with the DSL and pass validation.

Rollback expectations:
- If a change risks data loss or auth breakage, pause and request guidance.
- Do not revert user changes unless explicitly requested.
