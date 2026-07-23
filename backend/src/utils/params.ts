import { AuthRequest } from "../middleware/auth";
import { AppError } from "./response";

export const requiredParam = (req: AuthRequest, name: string): string => {
  const value = req.params[name];

  if (typeof value !== "string" || value.length === 0) {
    throw new AppError(400, `Missing route parameter: ${name}`);
  }

  return value;
};
