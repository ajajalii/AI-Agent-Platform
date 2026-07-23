export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  _count?: { agents: number };
}

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  avatar: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { chats: number; files: number };
  chats?: Chat[];
  files?: UploadedFile[];
}

export interface Chat {
  id: string;
  title: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
  agent?: Pick<Agent, "id" | "name" | "avatar">;
  _count?: { messages: number };
}

export interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  chatId: string;
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  extractedText?: string;
  agentId: string;
  createdAt: string;
}

export interface DashboardData {
  stats: {
    agents: number;
    conversations: number;
    messages: number;
  };
  recentAgents: Agent[];
  recentChats: Chat[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface CreateAgentInput {
  name: string;
  description?: string;
  avatar?: string;
  systemPrompt: string;
  model?: string;
  temperature?: number;
}

export interface AgentTemplate {
  name: string;
  description: string;
  avatar: string;
  systemPrompt: string;
}
