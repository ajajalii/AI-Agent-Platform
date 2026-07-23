"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const env_1 = require("../config/env");
const response_1 = require("../utils/response");
const storage = multer_1.default.memoryStorage();
const allowedMimeTypes = [
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: env_1.env.MAX_FILE_SIZE },
    fileFilter: (_req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new response_1.AppError(400, "Only PDF, TXT, and DOCX files are allowed"));
        }
    },
});
//# sourceMappingURL=upload.js.map