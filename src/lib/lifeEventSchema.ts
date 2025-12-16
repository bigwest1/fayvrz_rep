import type { ProfileSignals } from "./profileSignals";

export type LifeEventCategory =
  | "stability"
  | "career"
  | "health"
  | "housing"
  | "family"
  | "finance";

export type LifeEventTaskActionType =
  | "draft_email"
  | "draft_script"
  | "resource_link"
  | "checklist"
  | "call_provider";

export type LifeEventTask = {
  id: string;
  title: string;
  why: string;
  actionType: LifeEventTaskActionType;
  notes?: string;
};

export type LifeEventTriggers = Partial<{
  ageBands: ProfileSignals["ageBand"][];
  homeContexts: ProfileSignals["homeContext"][];
  incomeBands: NonNullable<ProfileSignals["incomeBand"]>[];
}>;

export type LifeEvent = {
  id: string;
  title: string;
  category: LifeEventCategory;
  whoItsFor: string;
  triggerSignals?: LifeEventTriggers;
  tasks: LifeEventTask[];
};
