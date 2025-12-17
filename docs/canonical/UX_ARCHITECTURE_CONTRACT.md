# UX Architecture Contract

Principles:
- Focused surfaces, never cluttered. Progressive disclosure over busy screens.
- Confidence over cleverness; clarity first.
- Motion = meaning. Every animation signals state or hierarchy.
- No data tables as primary UI. Use cards, rails, drawers, and command surfaces.
- Teens and seniors must both understand the flow with minimal instruction.

Approved patterns:
- Moment Banner, FocusCard, ProgressRail, ConfidencePanel, Resource Drawer, Command Bar, UsageMeter, UpsellPanel.
- Staggered reveals for lists; subtle hover/focus elevation.
- Drawer for grouped resources with inline “verify details” note.

Disallowed patterns:
- Wizards/step-gating flows for core tasks.
- Walls of text, modals that trap users, dashboards as the main end-user surface.
- Decorative loops or distracting motion.

Animation rules:
- Allowed: entrance/stagger for clarity, status morphs, confirmation toasts.
- Forbidden: looping decorative motion, kinetic backgrounds, motion that ignores prefers-reduced-motion.
