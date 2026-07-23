import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
export declare const chatController: {
    getChats: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getChat: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    createChat: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteChat: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    sendMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=chat.controller.d.ts.map