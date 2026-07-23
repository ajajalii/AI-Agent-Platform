import { CompletionOptions, CompletionResult, LLMProvider } from "../types/llm.types";
import { openRouterService } from "./openrouter.service";

const provider: LLMProvider = openRouterService;

export const llmService = {
  complete(options: CompletionOptions): Promise<CompletionResult> {
    return provider.complete(options);
  },
};
