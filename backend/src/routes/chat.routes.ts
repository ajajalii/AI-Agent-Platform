import { Router } from "express";
import { chatController } from "../controllers/chat.controller";
import { authenticate, validate } from "../middleware/auth";
import { createChatSchema, sendMessageSchema } from "../utils/validation";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", chatController.getChats);
router.post("/", validate(createChatSchema), chatController.createChat);
router.get("/:chatId", chatController.getChat);
router.delete("/:chatId", chatController.deleteChat);
router.post("/:chatId/messages", validate(sendMessageSchema), chatController.sendMessage);

export default router;
