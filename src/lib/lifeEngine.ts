import { lifeEvents } from "@/content/lifeEvents";
import type { LifeEvent, LifeEventTask } from "./lifeEventSchema";
import type { ProfileSignals } from "./profileSignals";

type LifeEventPlanTask = LifeEventTask & { recommended: boolean };
export type LifeEventPlan = LifeEvent & { tasks: LifeEventPlanTask[] };

function matchesSignals(event: LifeEvent, signals: ProfileSignals): boolean {
  if (!event.triggerSignals) {
    return true;
  }

  const { ageBands, homeContexts, incomeBands } = event.triggerSignals;
  const checks: boolean[] = [];

  if (ageBands?.length) {
    checks.push(ageBands.includes(signals.ageBand));
  }

  if (homeContexts?.length) {
    checks.push(homeContexts.includes(signals.homeContext));
  }

  if (incomeBands?.length) {
    checks.push(signals.incomeBand ? incomeBands.includes(signals.incomeBand) : false);
  }

  return checks.length === 0 ? true : checks.every(Boolean);
}

export function getRecommendedLifeEvents(signals: ProfileSignals): LifeEvent[] {
  const prioritized = lifeEvents.map((event) => {
    const isMatch = matchesSignals(event, signals);
    const specificity = event.triggerSignals ? Object.keys(event.triggerSignals).length : 0;
    const score = (isMatch ? 2 : 0) + specificity;

    return { event, score, isMatch };
  });

  return prioritized
    .filter(({ event, isMatch }) => isMatch || !event.triggerSignals)
    .sort((a, b) => b.score - a.score || a.event.title.localeCompare(b.event.title))
    .map(({ event }) => event);
}

export function getLifeEventById(id: string): LifeEvent | undefined {
  return lifeEvents.find((event) => event.id === id);
}

export function getPlanForLifeEvent(id: string, signals: ProfileSignals): LifeEventPlan | null {
  void signals;
  const event = getLifeEventById(id);

  if (!event) {
    return null;
  }

  const tasks: LifeEventPlanTask[] = event.tasks.map((task) => ({
    ...task,
    recommended: true,
  }));

  return {
    ...event,
    tasks,
  };
}
