"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileController = void 0;
const file_service_1 = require("../services/file.service");
const response_1 = require("../utils/response");
const params_1 = require("../utils/params");
exports.fileController = {
    getFiles: async (req, res, next) => {
        try {
            const files = await file_service_1.fileService.getFiles(req.userId, (0, params_1.requiredParam)(req, "agentId"));
            (0, response_1.sendSuccess)(res, files);
        }
        catch (error) {
            next(error);
        }
    },
    uploadFile: async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "No file uploaded",
                });
            }
            const file = await file_service_1.fileService.uploadFile(req.userId, (0, params_1.requiredParam)(req, "agentId"), req.file);
            (0, response_1.sendSuccess)(res, file, 201);
        }
        catch (error) {
            next(error);
        }
    },
    deleteFile: async (req, res, next) => {
        try {
            await file_service_1.fileService.deleteFile(req.userId, (0, params_1.requiredParam)(req, "agentId"), (0, params_1.requiredParam)(req, "fileId"));
            (0, response_1.sendSuccess)(res, { message: "File deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=file.controller.js.map