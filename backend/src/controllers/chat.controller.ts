import { Response, NextFunction } from "express";
import { chatService } from "../services/chat.service";
import { AuthRequest } from "../middleware/auth";
import { sendSuccess } from "../utils/response";
import { requiredParam } from "../utils/params";

export const chatController = {
  getChats: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const chats = await chatService.getChats(
        req.userId!,
        requiredParam(req, "agentId")
      );
      sendSuccess(res, chats);
    } catch (error) {
      next(error);
    }
  },

  getChat: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const chat = await chatService.getChat(
        req.userId!,
        requiredParam(req, "agentId"),
        requiredParam(req, "chatId")
      );
      sendSuccess(res, chat);
    } catch (error) {
      next(error);
    }
  },

  createChat: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const chat = await chatService.createChat(
        req.userId!,
        requiredParam(req, "agentId"),
        req.body.title
      );
      sendSuccess(res, chat, 201);
    } catch (error) {
      next(error);
    }
  },

  deleteChat: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await chatService.deleteChat(
        req.userId!,
        requiredParam(req, "agentId"),
        requiredParam(req, "chatId")
      );
      sendSuccess(res, { message: "Conversation deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  sendMessage: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await chatService.sendMessage(
        req.userId!,
        requiredParam(req, "agentId"),
        requiredParam(req, "chatId"),
        req.body.content
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },
};
