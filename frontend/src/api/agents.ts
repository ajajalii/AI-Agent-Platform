import { api } from "./client";
import type { Agent, ApiResponse, CreateAgentInput, DashboardData } from "@/types";

export const agentsApi = {
  getAll: () => api.get<ApiResponse<Agent[]>>("/agents"),

  getById: (id: string) => api.get<ApiResponse<Agent>>(`/agents/${id}`),

  create: (data: CreateAgentInput) =>
    api.post<ApiResponse<Agent>>("/agents", data),

  update: (id: string, data: Partial<CreateAgentInput>) =>
    api.patch<ApiResponse<Agent>>(`/agents/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse<{ message: string }>>(`/agents/${id}`),
};

export const dashboardApi = {
  getStats: () => api.get<ApiResponse<DashboardData>>("/dashboard"),
};
