import { Router } from "express";
import { fileController } from "../controllers/file.controller";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", fileController.getFiles);
router.post("/", upload.single("file"), fileController.uploadFile);
router.delete("/:fileId", fileController.deleteFile);

export default router;
