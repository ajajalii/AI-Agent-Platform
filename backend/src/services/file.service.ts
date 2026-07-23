import fs from "fs";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { agentService } from "./agent.service";

async function extractText(file: Express.Multer.File) {
  if (file.mimetype === "text/plain") {
    return fs.promises.readFile(file.path, "utf8");
  }

  if (file.mimetype === "application/pdf") {
    const buffer = await fs.promises.readFile(file.path);
    const parser = new PDFParse({ data: buffer });
    try {
      const parsed = await parser.getText();
      return parsed.text;
    } finally {
      await parser.destroy();
    }
  }

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: file.path });
    return result.value;
  }

  throw new AppError(400, "Only PDF, TXT, and DOCX files are allowed");
}

function normalizeExtractedText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export const fileService = {
  async getFiles(userId: string, agentId: string) {
    await agentService.verifyOwnership(userId, agentId);

    return prisma.uploadedFile.findMany({
      where: { agentId },
      orderBy: { createdAt: "desc" },
    });
  },

  async uploadFile(
    userId: string,
    agentId: string,
    file: Express.Multer.File
  ) {
    await agentService.verifyOwnership(userId, agentId);

    try {
      const extractedText = normalizeExtractedText(await extractText(file));

      if (!extractedText) {
        throw new AppError(400, "Could not extract readable text from this file");
      }

      return prisma.uploadedFile.create({
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
    } catch (error) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      if (error instanceof AppError) {
        throw error;
      }

      console.error("File text extraction error:", error);
      throw new AppError(400, "Could not extract text from this file");
    }
  },

  async deleteFile(userId: string, agentId: string, fileId: string) {
    await agentService.verifyOwnership(userId, agentId);

    const file = await prisma.uploadedFile.findFirst({
      where: { id: fileId, agentId },
    });

    if (!file) {
      throw new AppError(404, "File not found");
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await prisma.uploadedFile.delete({ where: { id: fileId } });
  },
};
