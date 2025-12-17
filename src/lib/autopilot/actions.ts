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

export function runAutopilotAction(action: AutopilotAction, context: Record<string, any>) {
  switch (action) {
    case "generate_email":
      return {
        subject: context.subject ?? "Request",
        body: `Hello,

I’m reaching out about ${context.issue ?? "a request"}. I’m in ${
          context.city ?? "your area"
        } ${context.state ?? ""}. Please share next steps and timelines.

Thank you.`,
      };
    case "generate_call_script":
      return {
        script: `Hi, my name is ${context.name ?? "a member"}. I’m calling about ${
          context.issue ?? "a request"
        }. I’m in ${context.city ?? ""} ${context.state ?? ""}. Can you share what you need from me and timing?`,
      };
    case "generate_checklist":
      return {
        items: ["Confirm documents", "Note deadlines", "Capture contact info", "Verify costs"],
      };
    case "generate_calendar_reminder_text":
      return {
        reminderText: `Set a reminder: ${context.reminder ?? "Follow up"} on ${context.date ?? "the next business day"}.`,
      };
    default:
      return {};
  }
}
