export type ResourceContext = {
  location?: {
    city?: string;
    state?: string;
    zip?: string;
    lat?: number;
    lng?: number;
  };
  radiusMiles?: number;
  category?: string;
  lifeEventSlug?: string;
  taskTitle?: string;
};

export type ResourceResult = {
  label: string;
  kind: "BUSINESS" | "GOV" | "NONPROFIT" | "SERVICE";
  url?: string;
  phone?: string;
  addressText?: string;
  stateCode?: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  source: string;
};

export type ProviderResponse =
  | { ok: true; results: ResourceResult[] }
  | { ok: false; error: string; reason?: "ProviderNotConfigured" | "Unavailable" };

export interface ResourceProvider {
  name: string;
  search: (query: string, context: ResourceContext) => Promise<ProviderResponse>;
}
