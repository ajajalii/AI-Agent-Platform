import { api } from "./client";
import type { Chat, Message, ApiResponse } from "@/types";

export const chatsApi = {
  getAll: (agentId: string) =>
    api.get<ApiResponse<Chat[]>>(`/agents/${agentId}/chats`),

  getById: (agentId: string, chatId: string) =>
    api.get<ApiResponse<Chat>>(`/agents/${agentId}/chats/${chatId}`),

  create: (agentId: string, title?: string) =>
    api.post<ApiResponse<Chat>>(`/agents/${agentId}/chats`, { title }),

  delete: (agentId: string, chatId: string) =>
    api.delete<ApiResponse<{ message: string }>>(
      `/agents/${agentId}/chats/${chatId}`
    ),

  sendMessage: (agentId: string, chatId: string, content: string) =>
    api.post<
      ApiResponse<{ userMessage: Message; assistantMessage: Message }>
    >(`/agents/${agentId}/chats/${chatId}/messages`, { content }),
};
