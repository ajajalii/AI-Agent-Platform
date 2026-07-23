import { Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard.service";
import { AuthRequest } from "../middleware/auth";
import { sendSuccess } from "../utils/response";

export const dashboardController = {
  getStats: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.getStats(req.userId!);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  },
};
