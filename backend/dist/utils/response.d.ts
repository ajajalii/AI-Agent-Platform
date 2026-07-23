import { Response } from "express";
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(statusCode: number, message: string, isOperational?: boolean);
}
export declare const sendSuccess: <T>(res: Response, data: T, statusCode?: number) => void;
export declare const sendError: (res: Response, message: string, statusCode?: number) => void;
export declare const asyncHandler: <T extends (...args: never[]) => Promise<unknown>>(fn: T) => (...args: Parameters<T>) => void;
//# sourceMappingURL=response.d.ts.map