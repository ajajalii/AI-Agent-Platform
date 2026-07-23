import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    userId?: string;
}
export declare const authenticate: (req: AuthRequest, _res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: Error, _req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validate: <T>(schema: {
    parse: (data: unknown) => T;
}) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map