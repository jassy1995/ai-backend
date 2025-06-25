import express from 'express';
import ChatController from '../controllers/chat';
import validate from '../middlewares/validate';
import { conversationSchema, messageSchemaParam } from '../schemas/chat';

const router = express.Router();

router.post('/messenger', validate(conversationSchema), ChatController.chatMessenger);
router.get('/chat/:chatId', validate(messageSchemaParam), ChatController.getChatMessages);

export default router;
