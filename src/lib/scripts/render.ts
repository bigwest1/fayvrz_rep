import type { ScriptTemplate } from "@prisma/client";

type RenderContext = {
  name?: string;
  city?: string;
  state?: string;
  issue?: string;
  preferredTime?: string;
  budget?: string;
  [key: string]: string | undefined;
};

function replaceVars(text: string, variables: RenderContext) {
  return text.replace(/{{\s*([\w]+)\s*}}/g, (_match, key) => variables[key]?.toString() ?? "");
}

export function renderScript(template: ScriptTemplate, variables: RenderContext) {
  const markdown = replaceVars(template.bodyMarkdown, variables);
  const text = markdown.replace(/\*\*(.*?)\*\*/g, "$1");
  return { markdown, text };
}
