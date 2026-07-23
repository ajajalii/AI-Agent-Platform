import { env } from "../config/env";
import { AppError } from "../utils/response";
import {
  ChatMessage,
  CompletionOptions,
  CompletionResult,
  LLMProvider,
} from "../types/llm.types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterChatResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
    code?: number | string;
  };
}

function buildMessages(
  systemPrompt: string,
  messages: ChatMessage[]
): OpenRouterMessage[] {
  return [
    { role: "system", content: systemPrompt },
    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
}

function resolveModel(model: string): string {
  const resolved = model.trim();

  if (!resolved) {
    throw new AppError(502, "Failed to generate AI response. Please try again.");
  }

  return resolved;
}

function logApiError(status: number, detail: string): void {
  if (status === 401) {
    console.error("OpenRouter API error: Invalid API key");
    return;
  }

  if (status === 429) {
    console.error("OpenRouter API error: Rate limit exceeded");
    return;
  }

  if (status === 400 || status === 404) {
    console.error("OpenRouter API error: Invalid model or request", detail);
    return;
  }

  console.error("OpenRouter API error:", status, detail);
}

async function parseErrorDetail(response: Response): Promise<string> {
  const body = await response.text();

  try {
    const parsed = JSON.parse(body) as OpenRouterChatResponse;
    return parsed.error?.message || body;
  } catch {
    return body;
  }
}

async function requestCompletion(
  options: CompletionOptions
): Promise<CompletionResult> {
  const payload = {
    model: resolveModel(options.model),
    messages: buildMessages(options.systemPrompt, options.messages),
    temperature: options.temperature,
    stream: false,
  };

  let response: Response;

  try {
    response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.FRONTEND_URL,
        "X-Title": "Agent Workspace",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("OpenRouter API error: Network failure", error);
    throw new AppError(502, "Failed to generate AI response. Please try again.");
  }

  if (!response.ok) {
    const detail = await parseErrorDetail(response);
    logApiError(response.status, detail);
    throw new AppError(502, "Failed to generate AI response. Please try again.");
  }

  let data: OpenRouterChatResponse;

  try {
    data = (await response.json()) as OpenRouterChatResponse;
  } catch (error) {
    console.error("OpenRouter API error: Invalid response payload", error);
    throw new AppError(502, "Failed to generate AI response. Please try again.");
  }

  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    console.error("OpenRouter API error: Empty response");
    throw new AppError(502, "Failed to generate AI response. Please try again.");
  }

  return { content };
}

export const openRouterService: LLMProvider = {
  complete: requestCompletion,
};
