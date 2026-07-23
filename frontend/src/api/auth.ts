import { api } from "./client";
import type { AuthResponse, User, ApiResponse } from "@/types";

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>("/auth/login", data),

  getProfile: () => api.get<ApiResponse<User>>("/auth/me"),

  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.patch<ApiResponse<User>>("/auth/me", data),
};
