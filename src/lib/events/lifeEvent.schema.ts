export type LifeCategory = "HEALTH" | "FINANCE" | "FAMILY" | "HOME" | "CARE" | "WORK" | "OTHER";

export type LifeTask = {
  id: string;
  title: string;
  why: string;
  urgency: "NOW" | "NEXT" | "LATER";
  howFayvrzHelps: string;
  fallback: string;
};

export type OutputTemplate = {
  id: string;
  type: "EMAIL" | "CALL" | "CHECKLIST" | "NOTE";
  title: string;
  body: string;
};

export type ResourceQuery = {
  id: string;
  intent: string;
  locationScoped: boolean;
};

export type AutomationOption = {
  id: string;
  type: "DRAFT" | "REMINDER" | "EXPORT";
  description: string;
  fallback: string;
};

export interface LifeEventDefinition {
  id: string;
  title: string;
  category: LifeCategory;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  triggers: {
    ageRange?: [number, number];
    keywords?: string[];
    profileSignals?: string[];
  };
  tasks: LifeTask[];
  outputs: OutputTemplate[];
  resourceQueries: ResourceQuery[];
  automations: AutomationOption[];
  disclaimers?: string[];
}
