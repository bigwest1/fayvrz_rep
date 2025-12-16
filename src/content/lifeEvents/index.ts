import type { LifeEvent } from "@/lib/lifeEventSchema";

export const lifeEvents: LifeEvent[] = [
  {
    id: "job-loss",
    title: "Job loss reset",
    category: "career",
    whoItsFor: "Anyone facing a layoff or contract ending",
    triggerSignals: {
      incomeBands: ["tight", "stable"],
    },
    tasks: [
      {
        id: "file-benefits",
        title: "File for unemployment benefits",
        why: "Start the income bridge early and know weekly requirements before deadlines stack up.",
        actionType: "checklist",
      },
      {
        id: "health-coverage",
        title: "Confirm health coverage options",
        why: "Compare COBRA and marketplace dates now to avoid gaps and surprise bills.",
        actionType: "resource_link",
      },
      {
        id: "severance-review",
        title: "Review severance and final paycheck",
        why: "Check PTO payout, non-compete language, and taxes while details are fresh.",
        actionType: "draft_email",
      },
      {
        id: "steady-routine",
        title: "Set a weekly search rhythm",
        why: "Block time for outreach, applications, and rest to keep momentum steady.",
        actionType: "checklist",
      },
    ],
  },
  {
    id: "rent-increase",
    title: "Rent increase response",
    category: "housing",
    whoItsFor: "Renters receiving a rate jump or new lease terms",
    triggerSignals: {
      homeContexts: ["solo", "partner", "roommates", "kids"],
    },
    tasks: [
      {
        id: "confirm-terms",
        title: "Confirm notice and lease terms",
        why: "Know the legal notice timeline and whether you must respond in writing.",
        actionType: "draft_script",
      },
      {
        id: "budget-impact",
        title: "Map the cash flow impact",
        why: "See whether the increase is sustainable before committing to the new term.",
        actionType: "checklist",
      },
      {
        id: "negotiate",
        title: "Prepare a steady negotiation note",
        why: "Offer a reasonable counter or timeline with facts instead of urgency.",
        actionType: "draft_email",
      },
      {
        id: "backup-options",
        title: "List backup options",
        why: "Identify housemates, shorter lease periods, or alternative units nearby.",
        actionType: "resource_link",
      },
    ],
  },
  {
    id: "caregiving-shift",
    title: "Caregiving shift",
    category: "family",
    whoItsFor: "People adding regular care for a parent or partner",
    triggerSignals: {
      homeContexts: ["partner", "caregiving", "kids"],
    },
    tasks: [
      {
        id: "health-list",
        title: "List meds and appointments",
        why: "Keep a simple sheet to avoid repeating forms and missing renewals.",
        actionType: "checklist",
      },
      {
        id: "benefits-check",
        title: "Check benefits and coverage",
        why: "Confirm what is covered before scheduling specialists or equipment.",
        actionType: "resource_link",
      },
      {
        id: "family-roles",
        title: "Set who does what",
        why: "Share tasks with siblings or partners to avoid burnout and confusion.",
        actionType: "draft_script",
      },
      {
        id: "respite-plan",
        title: "Plan respite and backups",
        why: "Identify short breaks and backups before a crisis hits.",
        actionType: "call_provider",
      },
    ],
  },
  {
    id: "medical-bill",
    title: "Surprise medical bill",
    category: "health",
    whoItsFor: "Anyone who received an unexpected bill",
    tasks: [
      {
        id: "itemized-bill",
        title: "Request an itemized bill",
        why: "Spot coding mistakes before paying and keep a record for disputes.",
        actionType: "draft_email",
      },
      {
        id: "benefits-appeal",
        title: "Check EOB and coverage",
        why: "Validate denials and plan appeal steps with dates in one place.",
        actionType: "checklist",
      },
      {
        id: "set-payment-plan",
        title: "Ask for a payment plan",
        why: "Set terms you can keep instead of missing a due date.",
        actionType: "draft_script",
      },
      {
        id: "aid-options",
        title: "Scan aid options",
        why: "Look for hospital assistance or community clinics that match your situation.",
        actionType: "resource_link",
      },
    ],
  },
  {
    id: "moving-city",
    title: "Moving to a new city",
    category: "stability",
    whoItsFor: "People relocating for work, family, or a reset",
    tasks: [
      {
        id: "timeline",
        title: "Plot the move timeline",
        why: "Sequence notice periods, movers, and arrival tasks calmly.",
        actionType: "checklist",
      },
      {
        id: "documents",
        title: "Collect documents once",
        why: "Keep IDs, leases, and insurance handy to avoid repeat searches.",
        actionType: "checklist",
      },
      {
        id: "local-services",
        title: "Line up local services",
        why: "Shortlist clinics, schools, or coworking before you arrive.",
        actionType: "resource_link",
      },
      {
        id: "arrival-note",
        title: "Draft arrival notes",
        why: "Prepare clean updates to send family, employers, or landlords.",
        actionType: "draft_email",
      },
    ],
  },
  {
    id: "storm-ready",
    title: "Severe weather readiness",
    category: "stability",
    whoItsFor: "Households in areas with storms or outages",
    tasks: [
      {
        id: "kit-check",
        title: "Check essentials kit",
        why: "Ensure water, light, meds, and documents are easy to grab.",
        actionType: "checklist",
      },
      {
        id: "contact-tree",
        title: "Set a contact tree",
        why: "Know who checks in on whom if power drops.",
        actionType: "draft_script",
      },
      {
        id: "local-alerts",
        title: "Add local alerts",
        why: "Enable city and utility notices so you hear about shutoffs early.",
        actionType: "resource_link",
      },
      {
        id: "backup-power",
        title: "Plan for backup power",
        why: "Prioritize refrigeration and devices needed for health.",
        actionType: "call_provider",
      },
    ],
  },
  {
    id: "new-child-prep",
    title: "New child prep",
    category: "family",
    whoItsFor: "Expecting or adopting parents",
    triggerSignals: {
      homeContexts: ["partner", "kids"],
      ageBands: ["20s", "30s", "40s"],
    },
    tasks: [
      {
        id: "leave-plan",
        title: "Draft leave plan",
        why: "Align employer, partner, and coverage dates in one clear note.",
        actionType: "draft_email",
      },
      {
        id: "care-coverage",
        title: "Line up care coverage",
        why: "Identify pediatric visits, support people, and backup transport.",
        actionType: "resource_link",
      },
      {
        id: "home-basics",
        title: "Set home basics",
        why: "Prep sleep space, feeding supplies, and a simple rest plan.",
        actionType: "checklist",
      },
      {
        id: "aid-options-kids",
        title: "Review aid options",
        why: "Check local programs and insurance enrollment windows.",
        actionType: "resource_link",
      },
    ],
  },
];
