"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.sendError = exports.sendSuccess = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
const sendSuccess = (res, data, statusCode = 200) => {
    res.status(statusCode).json({ success: true, data });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = 500) => {
    res.status(statusCode).json({ success: false, error: message });
};
exports.sendError = sendError;
const asyncHandler = (fn) => (...args) => {
    Promise.resolve(fn(...args)).catch(args[2]);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=response.js.map