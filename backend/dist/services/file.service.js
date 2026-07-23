"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileService = void 0;
const fs_1 = __importDefault(require("fs"));
const mammoth_1 = __importDefault(require("mammoth"));
const pdf_parse_1 = require("pdf-parse");
const database_1 = require("../config/database");
const response_1 = require("../utils/response");
const agent_service_1 = require("./agent.service");
async function extractText(file) {
    if (file.mimetype === "text/plain") {
        return fs_1.default.promises.readFile(file.path, "utf8");
    }
    if (file.mimetype === "application/pdf") {
        const buffer = await fs_1.default.promises.readFile(file.path);
        const parser = new pdf_parse_1.PDFParse({ data: buffer });
        try {
            const parsed = await parser.getText();
            return parsed.text;
        }
        finally {
            await parser.destroy();
        }
    }
    if (file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const result = await mammoth_1.default.extractRawText({ path: file.path });
        return result.value;
    }
    throw new response_1.AppError(400, "Only PDF, TXT, and DOCX files are allowed");
}
function normalizeExtractedText(text) {
    return text.replace(/\s+/g, " ").trim();
}
exports.fileService = {
    async getFiles(userId, agentId) {
        await agent_service_1.agentService.verifyOwnership(userId, agentId);
        return database_1.prisma.uploadedFile.findMany({
            where: { agentId },
            orderBy: { createdAt: "desc" },
        });
    },
    async uploadFile(userId, agentId, file) {
        await agent_service_1.agentService.verifyOwnership(userId, agentId);
        try {
            const extractedText = normalizeExtractedText(await extractText(file));
            if (!extractedText) {
                throw new response_1.AppError(400, "Could not extract readable text from this file");
            }
            return database_1.prisma.uploadedFile.create({
                data: {
                    agentId,
                    filename: file.filename,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                    path: file.path,
                    extractedText,
                },
            });
        }
        catch (error) {
            if (fs_1.default.existsSync(file.path)) {
                fs_1.default.unlinkSync(file.path);
            }
            if (error instanceof response_1.AppError) {
                throw error;
            }
            console.error("File text extraction error:", error);
            throw new response_1.AppError(400, "Could not extract text from this file");
        }
    },
    async deleteFile(userId, agentId, fileId) {
        await agent_service_1.agentService.verifyOwnership(userId, agentId);
        const file = await database_1.prisma.uploadedFile.findFirst({
            where: { id: fileId, agentId },
        });
        if (!file) {
            throw new response_1.AppError(404, "File not found");
        }
        if (fs_1.default.existsSync(file.path)) {
            fs_1.default.unlinkSync(file.path);
        }
        await database_1.prisma.uploadedFile.delete({ where: { id: fileId } });
    },
};
//# sourceMappingURL=file.service.js.map