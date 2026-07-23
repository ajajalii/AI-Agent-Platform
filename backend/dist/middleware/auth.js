"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.errorHandler = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const response_1 = require("../utils/response");
const authenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return next(new response_1.AppError(401, "Authentication required"));
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch {
        next(new response_1.AppError(401, "Invalid or expired token"));
    }
};
exports.authenticate = authenticate;
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof response_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    }
    if (err.name === "MulterError") {
        return res.status(400).json({
            success: false,
            error: err.message,
        });
    }
    if ("status" in err && err.status === 400) {
        return res.status(400).json({
            success: false,
            error: err.message,
        });
    }
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        error: "Internal server error",
    });
};
exports.errorHandler = errorHandler;
const validate = (schema) => (req, _res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof Error && "issues" in error) {
            const zodError = error;
            next(new response_1.AppError(400, zodError.issues[0]?.message || "Validation failed"));
        }
        else {
            next(new response_1.AppError(400, "Validation failed"));
        }
    }
};
exports.validate = validate;
//# sourceMappingURL=auth.js.map