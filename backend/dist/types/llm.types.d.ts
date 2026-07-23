export type ChatRole = "system" | "user" | "assistant";
export interface ChatMessage {
    role: Exclude<ChatRole, "system">;
    content: string;
}
export interface CompletionOptions {
    model: string;
    systemPrompt: string;
    temperature: number;
    messages: ChatMessage[];
}
export interface CompletionResult {
    content: string;
}
export interface LLMProvider {
    complete(options: CompletionOptions): Promise<CompletionResult>;
}
//# sourceMappingURL=llm.types.d.ts.map