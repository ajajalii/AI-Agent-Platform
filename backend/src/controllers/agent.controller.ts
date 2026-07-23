import { Response, NextFunction } from "express";
import { agentService } from "../services/agent.service";
import { AuthRequest } from "../middleware/auth";
import { sendSuccess } from "../utils/response";
import { requiredParam } from "../utils/params";

export const agentController = {
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const agents = await agentService.getAll(req.userId!);
      sendSuccess(res, agents);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const agent = await agentService.getById(req.userId!, requiredParam(req, "id"));
      sendSuccess(res, agent);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const agent = await agentService.create(req.userId!, req.body);
      sendSuccess(res, agent, 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const agent = await agentService.update(
        req.userId!,
        requiredParam(req, "id"),
        req.body
      );
      sendSuccess(res, agent);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await agentService.delete(req.userId!, requiredParam(req, "id"));
      sendSuccess(res, { message: "Agent deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
