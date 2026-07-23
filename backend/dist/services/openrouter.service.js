"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openRouterService = void 0;
const env_1 = require("../config/env");
const response_1 = require("../utils/response");
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
function buildMessages(systemPrompt, messages) {
    return [
        { role: "system", content: systemPrompt },
        ...messages.map((message) => ({
            role: message.role,
            content: message.content,
        })),
    ];
}
function resolveModel(model) {
    const resolved = model.trim();
    if (!resolved) {
        throw new response_1.AppError(502, "Failed to generate AI response. Please try again.");
    }
    return resolved;
}
function logApiError(status, detail) {
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
async function parseErrorDetail(response) {
    const body = await response.text();
    try {
        const parsed = JSON.parse(body);
        return parsed.error?.message || body;
    }
    catch {
        return body;
    }
}
async function requestCompletion(options) {
    const payload = {
        model: resolveModel(options.model),
        messages: buildMessages(options.systemPrompt, options.messages),
        temperature: options.temperature,
        stream: false,
    };
    let response;
    try {
        response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env_1.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": env_1.env.FRONTEND_URL,
                "X-Title": "Agent Workspace",
            },
            body: JSON.stringify(payload),
        });
    }
    catch (error) {
        console.error("OpenRouter API error: Network failure", error);
        throw new response_1.AppError(502, "Failed to generate AI response. Please try again.");
    }
    if (!response.ok) {
        const detail = await parseErrorDetail(response);
        logApiError(response.status, detail);
        throw new response_1.AppError(502, "Failed to generate AI response. Please try again.");
    }
    let data;
    try {
        data = (await response.json());
    }
    catch (error) {
        console.error("OpenRouter API error: Invalid response payload", error);
        throw new response_1.AppError(502, "Failed to generate AI response. Please try again.");
    }
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
        console.error("OpenRouter API error: Empty response");
        throw new response_1.AppError(502, "Failed to generate AI response. Please try again.");
    }
    return { content };
}
exports.openRouterService = {
    complete: requestCompletion,
};
//# sourceMappingURL=openrouter.service.js.map