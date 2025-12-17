export type AutopilotAction =
  | "generate_email"
  | "generate_call_script"
  | "generate_checklist"
  | "generate_calendar_reminder_text";

export const allowedActions: AutopilotAction[] = [
  "generate_email",
  "generate_call_script",
  "generate_checklist",
  "generate_calendar_reminder_text",
];

type ActionContext = Record<string, unknown>;

function asText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function runAutopilotAction(action: AutopilotAction, context: ActionContext) {
  switch (action) {
    case "generate_email":
      return {
        subject: asText(context.subject, "Request"),
        body: `Hello,

I’m reaching out about ${asText(context.issue, "a request")}. I’m in ${asText(context.city, "your area")} ${asText(context.state, "")}. Please share next steps and timelines.

Thank you.`,
      };
    case "generate_call_script":
      return {
        script: `Hi, my name is ${asText(context.name, "a member")}. I’m calling about ${asText(
          context.issue,
          "a request",
        )}. I’m in ${asText(context.city, "")} ${asText(context.state, "")}. Can you share what you need from me and timing?`,
      };
    case "generate_checklist":
      return {
        items: ["Confirm documents", "Note deadlines", "Capture contact info", "Verify costs"],
      };
    case "generate_calendar_reminder_text":
      return {
        reminderText: `Set a reminder: ${asText(context.reminder, "Follow up")} on ${asText(
          context.date,
          "the next business day",
        )}.`,
      };
    default:
      return {};
  }
}
