import type { ResourceProvider, ResourceContext, ProviderResponse } from "./types";

const genericResources = [
  {
    label: "211 community services",
    kind: "GOV" as const,
    phone: "211",
    notes: "Call to ask for local assistance programs. Verify details with official offices.",
  },
  {
    label: "County human services",
    kind: "GOV" as const,
    url: "https://www.usa.gov/state-social-services",
    notes: "Find your county office and confirm eligibility and forms. Verify details locally.",
  },
];

const stateResources: Record<
  string,
  {
    label: string;
    kind: "GOV" | "NONPROFIT" | "SERVICE" | "BUSINESS";
    url?: string;
    phone?: string;
    notes?: string;
  }[]
> = {
  MN: [
    {
      label: "Minnesota DHS contact",
      kind: "GOV",
      url: "https://mn.gov/dhs/people-we-serve/adults/services/",
      notes: "General benefits information. Verify program details for your county.",
    },
    {
      label: "MN 211",
      kind: "NONPROFIT",
      url: "https://www.211unitedway.org/",
      phone: "211",
      notes: "Statewide referral line for housing, food, and utility help. Verify specifics with providers.",
    },
  ],
};

export const staticGovProvider: ResourceProvider = {
  name: "static-gov",
  async search(_query: string, context: ResourceContext): Promise<ProviderResponse> {
    const results: any[] = [...genericResources];
    const stateCode = context.location?.state?.toUpperCase();
    if (stateCode && stateResources[stateCode]) {
      results.push(...stateResources[stateCode]);
    }

    return { ok: true, results: results.map((item) => ({ ...item, source: "static-gov" })) };
  },
};
