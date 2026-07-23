"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controllers/chat.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(auth_1.authenticate);
router.get("/", chat_controller_1.chatController.getChats);
router.post("/", (0, auth_1.validate)(validation_1.createChatSchema), chat_controller_1.chatController.createChat);
router.get("/:chatId", chat_controller_1.chatController.getChat);
router.delete("/:chatId", chat_controller_1.chatController.deleteChat);
router.post("/:chatId/messages", (0, auth_1.validate)(validation_1.sendMessageSchema), chat_controller_1.chatController.sendMessage);
exports.default = router;
//# sourceMappingURL=chat.routes.js.map