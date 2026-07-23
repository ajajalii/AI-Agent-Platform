import { Response, NextFunction } from "express";
import { fileService } from "../services/file.service";
import { AuthRequest } from "../middleware/auth";
import { sendSuccess } from "../utils/response";
import { requiredParam } from "../utils/params";

export const fileController = {
  getFiles: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const files = await fileService.getFiles(
        req.userId!,
        requiredParam(req, "agentId")
      );
      sendSuccess(res, files);
    } catch (error) {
      next(error);
    }
  },

  uploadFile: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      const file = await fileService.uploadFile(
        req.userId!,
        requiredParam(req, "agentId"),
        req.file
      );
      sendSuccess(res, file, 201);
    } catch (error) {
      next(error);
    }
  },

  deleteFile: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await fileService.deleteFile(
        req.userId!,
        requiredParam(req, "agentId"),
        requiredParam(req, "fileId")
      );
      sendSuccess(res, { message: "File deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
