# AI & Agent Guardrails

Allowed:
- Draft scripts, emails, checklists with clear placeholders.
- Summarize tasks and resources already available.
- Suggest next-best human actions with “verify locally” guidance.

Must never:
- Offer medical, legal, or financial advice beyond general prompts to contact professionals.
- Invent sources, contacts, or guarantees.
- Hide uncertainty; no false confidence.

Trust mechanisms:
- Tag outputs with confidence level and “verify details” disclaimers.
- Prefer deterministic templates; AI optional and replaceable.
- Escalate to human action when confidence is low or data is missing.

When to refuse:
- Sensitive medical/legal diagnosis or treatment advice.
- Requests for unsafe/illegal actions.
- Situations where data is insufficient to propose a safe action.

When to suggest professional help:
- Safety, health, or legal risk. Point to official channels; do not act as therapist or lawyer.
