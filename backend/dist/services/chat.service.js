"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const database_1 = require("../config/database");
const response_1 = require("../utils/response");
const agent_service_1 = require("./agent.service");
const llm_service_1 = require("./llm.service");
const MAX_CONTEXT_CHARS = 24000;
async function getUserDocumentContext(userId) {
    const files = await database_1.prisma.uploadedFile.findMany({
        where: { agent: { userId } },
        orderBy: { createdAt: "desc" },
        select: {
            originalName: true,
            extractedText: true,
        },
    });
    let remainingChars = MAX_CONTEXT_CHARS;
    const sections = [];
    for (const file of files) {
        if (remainingChars <= 0)
            break;
        const text = file.extractedText.slice(0, remainingChars);
        if (!text.trim())
            continue;
        sections.push(`File: ${file.originalName}\n${text}`);
        remainingChars -= text.length;
    }
    return sections.join("\n\n---\n\n");
}
function buildAgentSystemPrompt(agentName, systemPrompt) {
    return [
        `Your identity is the agent named "${agentName}".`,
        `If the user asks who you are, say you are "${agentName}".`,
        "Do not identify yourself as the underlying model or provider unless the user explicitly asks what model powers you.",
        systemPrompt,
    ].join("\n\n");
}
exports.chatService = {
    async getChats(userId, agentId) {
        await agent_service_1.agentService.verifyOwnership(userId, agentId);
        return database_1.prisma.chat.findMany({
            where: { agentId },
            orderBy: { updatedAt: "desc" },
            include: {
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
                _count: { select: { messages: true } },
            },
        });
    },
    async getChat(userId, agentId, chatId) {
        await agent_service_1.agentService.verifyOwnership(userId, agentId);
        const chat = await database_1.prisma.chat.findFirst({
            where: { id: chatId, agentId },
            include: {
                messages: { orderBy: { createdAt: "asc" } },
            },
        });
        if (!chat) {
            throw new response_1.AppError(404, "Conversation not found");
        }
        return chat;
    },
    async createChat(userId, agentId, title) {
        await agent_service_1.agentService.verifyOwnership(userId, agentId);
        return database_1.prisma.chat.create({
            data: {
                agentId,
                title: title || "New Conversation",
            },
        });
    },
    async deleteChat(userId, agentId, chatId) {
        await agent_service_1.agentService.verifyOwnership(userId, agentId);
        const chat = await database_1.prisma.chat.findFirst({
            where: { id: chatId, agentId },
        });
        if (!chat) {
            throw new response_1.AppError(404, "Conversation not found");
        }
        await database_1.prisma.chat.delete({ where: { id: chatId } });
    },
    async sendMessage(userId, agentId, chatId, content) {
        const agent = await agent_service_1.agentService.verifyOwnership(userId, agentId);
        const chat = await database_1.prisma.chat.findFirst({
            where: { id: chatId, agentId },
            include: {
                messages: { orderBy: { createdAt: "asc" } },
            },
        });
        if (!chat) {
            throw new response_1.AppError(404, "Conversation not found");
        }
        const userMessage = await database_1.prisma.message.create({
            data: {
                chatId,
                role: "USER",
                content,
            },
        });
        const messages = chat.messages.map((msg) => ({
            role: msg.role === "USER" ? "user" : "assistant",
            content: msg.content,
        }));
        messages.push({
            role: "user",
            content,
        });
        let assistantContent;
        try {
            const documentContext = await getUserDocumentContext(userId);
            const result = await llm_service_1.llmService.complete({
                model: agent.model,
                systemPrompt: [
                    buildAgentSystemPrompt(agent.name, agent.systemPrompt),
                    documentContext
                        ? `Use the following uploaded document context when it is relevant. Resume Reviewer should prioritize resume/CV details from this context.\n\n${documentContext}`
                        : "",
                ]
                    .filter(Boolean)
                    .join("\n\n"),
                temperature: agent.temperature,
                messages,
            });
            assistantContent = result.content;
        }
        catch (error) {
            if (error instanceof response_1.AppError) {
                throw error;
            }
            console.error("LLM API error:", error);
            throw new response_1.AppError(502, "Failed to generate AI response. Please try again.");
        }
        const assistantMessage = await database_1.prisma.message.create({
            data: {
                chatId,
                role: "ASSISTANT",
                content: assistantContent,
            },
        });
        const title = chat.messages.length === 0
            ? content.slice(0, 50) + (content.length > 50 ? "..." : "")
            : chat.title;
        await database_1.prisma.chat.update({
            where: { id: chatId },
            data: {
                title,
                updatedAt: new Date(),
            },
        });
        return {
            userMessage,
            assistantMessage,
        };
    },
};
//# sourceMappingURL=chat.service.js.map