export type FeatureFlag = "AUTOPILOT_ENABLED" | "LOCAL_RESOURCES_EXPANDED" | "EXPORTS_ENABLED";

const defaults: Record<FeatureFlag, boolean> = {
  AUTOPILOT_ENABLED: false,
  LOCAL_RESOURCES_EXPANDED: false,
  EXPORTS_ENABLED: false,
};

export const featureFlags = defaults;

export function isFeatureEnabled(flag: FeatureFlag) {
  return featureFlags[flag];
}
