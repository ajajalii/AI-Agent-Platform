import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { agentService } from "./agent.service";

function getFileBuffer(file: Express.Multer.File) {
  if (file.buffer) {
    return file.buffer;
  }

  if (file.path) {
    return fs.promises.readFile(file.path);
  }

  throw new AppError(400, "Uploaded file data is unavailable");
}

async function extractText(file: Express.Multer.File) {
  if (file.mimetype === "text/plain") {
    const buffer = await getFileBuffer(file);
    return buffer.toString("utf8");
  }

  if (file.mimetype === "application/pdf") {
    const { PDFParse } = await import("pdf-parse");
    const buffer = await getFileBuffer(file);
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
    const mammoth = await import("mammoth");
    const result = file.buffer
      ? await mammoth.extractRawText({ buffer: file.buffer })
      : await mammoth.extractRawText({ path: file.path });
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
          filename:
            file.filename ||
            `${Date.now()}-${randomUUID()}${path.extname(file.originalname)}`,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: file.path || "",
          extractedText,
        },
      });
    } catch (error) {
      if (file.path && fs.existsSync(file.path)) {
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

    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await prisma.uploadedFile.delete({ where: { id: fileId } });
  },
};
