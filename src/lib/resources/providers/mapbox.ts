import type { ProviderResponse, ResourceProvider, ResourceContext } from "./types";

export const mapboxProvider: ResourceProvider = {
  name: "mapbox",
  async search(_query: string, _context: ResourceContext): Promise<ProviderResponse> {
    const token = process.env.MAPBOX_TOKEN;
    if (!token) {
      return { ok: false, error: "Mapbox not configured", reason: "ProviderNotConfigured" };
    }

    // Future: call Mapbox Places API. Keep disabled until token provided.
    return { ok: false, error: "Mapbox provider stub", reason: "Unavailable" };
  },
};
