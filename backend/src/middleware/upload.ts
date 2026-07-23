import multer from "multer";
import { env } from "../config/env";
import { AppError } from "../utils/response";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const upload = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, "Only PDF, TXT, and DOCX files are allowed"));
    }
  },
});
