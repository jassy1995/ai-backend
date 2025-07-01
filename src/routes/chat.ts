import express from "express";
import ChatController from "../controllers/chat";
import validate from "../middlewares/validate";
import { conversationSchema, messageSchemaParam } from "../schemas/chat";

const router = express.Router();

router.post(
  "/messenger",
  validate(conversationSchema),
  ChatController.chatMessenger
);
router.get(
  "/chat/:chatId",
  validate(messageSchemaParam),
  ChatController.getChatMessages
);
router.post("/web-search", ChatController.getWebSearchResults);

export default router;
