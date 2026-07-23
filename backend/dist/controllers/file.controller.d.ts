import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
export declare const fileController: {
    getFiles: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    uploadFile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteFile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=file.controller.d.ts.map