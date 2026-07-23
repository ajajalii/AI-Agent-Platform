import { Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth";
import { sendSuccess } from "../utils/response";

export const authController = {
  register: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  },

  login: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await authService.getProfile(req.userId!);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await authService.updateProfile(req.userId!, req.body);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },
};
