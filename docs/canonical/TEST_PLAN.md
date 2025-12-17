# System Verification Tests (Lightweight)

- Event schema validation: validate sample LifeEventDefinition JSON via `lifeEvent.validate` helper; expect success and failure cases.
- Entitlement enforcement: call enforcement helpers with mocked usage to confirm upsell paths and allowed states.
- Stripe-disabled: run app with Stripe envs unset; billing pages show “Billing isn’t enabled yet” and core flows stay usable.
- AI-disabled: run without AI keys; output studio uses templates and labels “verify details”; no crash.
- Reduced-motion: set prefers-reduced-motion; reveals and motions become minimal with no jitter.
- Accessibility smoke: keyboard through primary flows (Home, Event, Studio, Billing); ensure focus rings visible and aria labels on inputs/actions.
