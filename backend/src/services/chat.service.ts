import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { ChatMessage } from "../types/llm.types";
import { agentService } from "./agent.service";
import { llmService } from "./llm.service";

const MAX_CONTEXT_CHARS = 24000;

async function getUserDocumentContext(userId: string) {
  const files = await prisma.uploadedFile.findMany({
    where: { agent: { userId } },
    orderBy: { createdAt: "desc" },
    select: {
      originalName: true,
      extractedText: true,
    },
  });

  let remainingChars = MAX_CONTEXT_CHARS;
  const sections: string[] = [];

  for (const file of files) {
    if (remainingChars <= 0) break;

    const text = file.extractedText.slice(0, remainingChars);
    if (!text.trim()) continue;

    sections.push(`File: ${file.originalName}\n${text}`);
    remainingChars -= text.length;
  }

  return sections.join("\n\n---\n\n");
}

function buildAgentSystemPrompt(agentName: string, systemPrompt: string) {
  return [
    `Your identity is the agent named "${agentName}".`,
    `If the user asks who you are, say you are "${agentName}".`,
    "Do not identify yourself as the underlying model or provider unless the user explicitly asks what model powers you.",
    systemPrompt,
  ].join("\n\n");
}

export const chatService = {
  async getChats(userId: string, agentId: string) {
    await agentService.verifyOwnership(userId, agentId);

    return prisma.chat.findMany({
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

  async getChat(userId: string, agentId: string, chatId: string) {
    await agentService.verifyOwnership(userId, agentId);

    const chat = await prisma.chat.findFirst({
      where: { id: chatId, agentId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!chat) {
      throw new AppError(404, "Conversation not found");
    }

    return chat;
  },

  async createChat(userId: string, agentId: string, title?: string) {
    await agentService.verifyOwnership(userId, agentId);

    return prisma.chat.create({
      data: {
        agentId,
        title: title || "New Conversation",
      },
    });
  },

  async deleteChat(userId: string, agentId: string, chatId: string) {
    await agentService.verifyOwnership(userId, agentId);

    const chat = await prisma.chat.findFirst({
      where: { id: chatId, agentId },
    });

    if (!chat) {
      throw new AppError(404, "Conversation not found");
    }

    await prisma.chat.delete({ where: { id: chatId } });
  },

  async sendMessage(
    userId: string,
    agentId: string,
    chatId: string,
    content: string
  ) {
    const agent = await agentService.verifyOwnership(userId, agentId);

    const chat = await prisma.chat.findFirst({
      where: { id: chatId, agentId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!chat) {
      throw new AppError(404, "Conversation not found");
    }

    const userMessage = await prisma.message.create({
      data: {
        chatId,
        role: "USER",
        content,
      },
    });

    const messages: ChatMessage[] = chat.messages.map((msg) => ({
      role: msg.role === "USER" ? "user" : "assistant",
      content: msg.content,
    }));

    messages.push({
      role: "user",
      content,
    });

    let assistantContent: string;

    try {
      const documentContext = await getUserDocumentContext(userId);
      const result = await llmService.complete({
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
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("LLM API error:", error);
      throw new AppError(502, "Failed to generate AI response. Please try again.");
    }

    const assistantMessage = await prisma.message.create({
      data: {
        chatId,
        role: "ASSISTANT",
        content: assistantContent,
      },
    });

    const title =
      chat.messages.length === 0
        ? content.slice(0, 50) + (content.length > 50 ? "..." : "")
        : chat.title;

    await prisma.chat.update({
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
