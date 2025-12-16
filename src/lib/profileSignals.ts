export type AgeBand = "teen" | "20s" | "30s" | "40s" | "50s" | "60+";
export type HomeContext = "solo" | "partner" | "kids" | "roommates" | "caregiving";
export type IncomeBand = "tight" | "stable" | "comfortable";

export type ProfilePreferences = {
  reducedMotion?: boolean;
};

export type ProfileSignals = {
  displayName: string;
  ageBand: AgeBand;
  homeContext: HomeContext;
  location?: string;
  incomeBand?: IncomeBand;
  preferences?: ProfilePreferences;
};

export const defaultProfileSignals: ProfileSignals = {
  displayName: "",
  ageBand: "30s",
  homeContext: "solo",
  location: "",
  incomeBand: undefined,
  preferences: {},
};

const ageBands: AgeBand[] = ["teen", "20s", "30s", "40s", "50s", "60+"];
const homeContexts: HomeContext[] = ["solo", "partner", "kids", "roommates", "caregiving"];
const incomeBands: IncomeBand[] = ["tight", "stable", "comfortable"];

export function sanitizeProfileSignals(input: Partial<ProfileSignals>): ProfileSignals {
  const ageBand = ageBands.includes(input.ageBand as AgeBand)
    ? (input.ageBand as AgeBand)
    : defaultProfileSignals.ageBand;

  const homeContext = homeContexts.includes(input.homeContext as HomeContext)
    ? (input.homeContext as HomeContext)
    : defaultProfileSignals.homeContext;

  const incomeBand = input.incomeBand && incomeBands.includes(input.incomeBand as IncomeBand)
    ? (input.incomeBand as IncomeBand)
    : undefined;

  return {
    ...defaultProfileSignals,
    ...input,
    ageBand,
    homeContext,
    incomeBand,
    displayName: (input.displayName ?? "").slice(0, 120).trim(),
    location: (input.location ?? "").slice(0, 160).trim(),
  };
}
