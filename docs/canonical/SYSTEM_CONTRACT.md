# Fayvrz System Contract

Immutable truths:
- Fayvrz is an assistive execution platform. Every recommendation must lead to an actionable path (script, resource, contact, checklist, or next step).
- Nothing ships without a clear user benefit, defined scope, and a failure-safe fallback.
- The app must run without AI, must run without Stripe, and must degrade gracefully without crashing or blocking core help.
- Progress is measured by completed actions, not by time spent in the UI.

MUST NOT:
- No generic to-do lists without attached actions.
- No therapy or psychology framing; this is practical assistance.
- No dark patterns, forced funnels, or manipulative timers.
- No gradients.
- No blocking core help behind paywalls; paid tiers remove friction, they do not remove access to essential help.
- No tables as the primary end-user UI for plans.

Degrade safely:
- If automation fails, offer a manual fallback with clear guidance.
- If data is missing, use concise defaults and label them as placeholders.
- If external services (AI/Stripe/Maps) are absent, keep core workflows usable and honest about what is disabled.
