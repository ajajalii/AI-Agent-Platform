import { api } from "./client";
import type { UploadedFile, ApiResponse } from "@/types";

export const filesApi = {
  getAll: (agentId: string) =>
    api.get<ApiResponse<UploadedFile[]>>(`/agents/${agentId}/files`),

  upload: (agentId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ApiResponse<UploadedFile>>(
      `/agents/${agentId}/files`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  delete: (agentId: string, fileId: string) =>
    api.delete<ApiResponse<{ message: string }>>(
      `/agents/${agentId}/files/${fileId}`
    ),
};
