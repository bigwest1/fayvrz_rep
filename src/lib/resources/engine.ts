import { prisma } from "../prisma";
import { filterSafeResources } from "../safety/resourceSafety";
import type { ResourceContext, ResourceResult } from "./providers/types";
import { staticGovProvider } from "./providers/staticGov";
import { mapboxProvider } from "./providers/mapbox";

const providers = [staticGovProvider, mapboxProvider];

function dedupeResources(results: ResourceResult[]): ResourceResult[] {
  const seen = new Set<string>();
  const output: ResourceResult[] = [];
  for (const item of results) {
    const key = `${item.url ?? ""}|${item.phone ?? ""}|${item.label.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

type ResourceSearchInput = {
  userId: string;
  taskTemplateId?: string;
  queryKey: string;
  query: string;
  context: ResourceContext;
};

export async function runResourceSearch({
  userId,
  taskTemplateId,
  queryKey,
  query,
  context,
}: ResourceSearchInput) {
  const results: ResourceResult[] = [];

  for (const provider of providers) {
    const response = await provider.search(query, context);
    if (response.ok) {
      results.push(
        ...response.results.map((r) => ({
          ...r,
          notes: r.notes ?? "Suggested only. Verify details with official sources.",
        })),
      );
    }
  }

  const safe = filterSafeResources(results);
  const unique = dedupeResources(safe);

  if (unique.length === 0) {
    return [];
  }

  await prisma.localResource.createMany({
    data: unique.map((item) => ({
      userId,
      taskTemplateId,
      queryKey,
      label: item.label,
      kind: item.kind,
      url: item.url,
      phone: item.phone,
      addressText: item.addressText,
      lat: item.lat,
      lng: item.lng,
    })),
    skipDuplicates: true,
  });

  return unique;
}
