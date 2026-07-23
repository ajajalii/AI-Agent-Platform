"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const file_controller_1 = require("../controllers/file.controller");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(auth_1.authenticate);
router.get("/", file_controller_1.fileController.getFiles);
router.post("/", upload_1.upload.single("file"), file_controller_1.fileController.uploadFile);
router.delete("/:fileId", file_controller_1.fileController.deleteFile);
exports.default = router;
//# sourceMappingURL=file.routes.js.map