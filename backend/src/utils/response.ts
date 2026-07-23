import { Response } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200) => {
  res.status(statusCode).json({ success: true, data });
};

export const sendError = (res: Response, message: string, statusCode = 500) => {
  res.status(statusCode).json({ success: false, error: message });
};

export const asyncHandler =
  <T extends (...args: never[]) => Promise<unknown>>(fn: T) =>
  (...args: Parameters<T>) => {
    Promise.resolve(fn(...args)).catch(args[2]);
  };
