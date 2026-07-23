export const DEFAULT_MODEL = "google/gemini-2.5-flash-lite";

export const MODELS = [
  { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "openai/gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "openai/gpt-5-nano", label: "GPT-5 Nano" },
  { value: "google/gemma-4-31b-it:free", label: "Gemma 4 31B (Free)" },
] as const;

export function getModelLabel(value?: string | null) {
  return MODELS.find((model) => model.value === value)?.label || value || "No model selected";
}

export const AGENT_AVATARS = [
  "\u{1F916}",
  "\u{1F9E0}",
  "\u{1F4DA}",
  "\u{1F4BC}",
  "\u{1F527}",
  "\u{1F4CA}",
  "\u{1F3A8}",
  "\u{1F52C}",
] as const;

export const AGENT_TEMPLATES = [
  {
    name: "Research Assistant",
    description: "Summarizes documents, answers questions, and finds useful context.",
    avatar: "\u{1F4DA}",
    systemPrompt:
      "You are Research Assistant, a careful research assistant. Provide clear, well-structured answers and cite relevant uploaded context when available.",
  },
  {
    name: "Resume Reviewer",
    description: "Reviews resumes, improves wording, and suggests stronger positioning.",
    avatar: "\u{1F4BC}",
    systemPrompt:
      "You are Resume Reviewer, a practical resume reviewer. Give specific, actionable feedback on structure, wording, impact, and role fit.",
  },
  {
    name: "Customer Support Agent",
    description: "Helps users troubleshoot issues with friendly, practical guidance.",
    avatar: "\u{1F527}",
    systemPrompt:
      "You are Customer Support Agent, a helpful customer support agent. Ask focused clarifying questions, explain steps clearly, and keep responses concise.",
  },
  {
    name: "Data Analyst",
    description: "Explains metrics, spots patterns, and turns data into insights.",
    avatar: "\u{1F4CA}",
    systemPrompt:
      "You are Data Analyst, a data analyst. Interpret data carefully, state assumptions, and present actionable insights.",
  },
  {
    name: "Creative Partner",
    description: "Brainstorms ideas, drafts content, and refines creative work.",
    avatar: "\u{1F3A8}",
    systemPrompt:
      "You are Creative Partner, a creative partner. Generate thoughtful options, explain tradeoffs, and help refine ideas into polished work.",
  },
] as const;
