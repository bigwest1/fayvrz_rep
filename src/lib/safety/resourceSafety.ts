import type { ResourceResult } from "../resources/providers/types";

const blockedKeywords = [
  "weapon",
  "firearm",
  "gun",
  "explosive",
  "drug",
  "controlled substance",
  "adult",
  "escort",
  "fake id",
  "diagnose",
  "prescribe",
  "legal advice",
  "lawsuit strategy",
];

export function filterSafeResources(results: ResourceResult[]): ResourceResult[] {
  return results.filter((item) => {
    const text = `${item.label} ${item.notes ?? ""}`.toLowerCase();
    const blocked = blockedKeywords.some((kw) => text.includes(kw));
    return !blocked;
  });
}
