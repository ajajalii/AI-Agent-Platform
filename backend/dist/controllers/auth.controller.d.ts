import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
export declare const authController: {
    register: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    login: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=auth.controller.d.ts.map