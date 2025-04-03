import express from 'express';
import ChatController from '../controllers/chat';
import validate from '../middlewares/validate';
import { messageSchema, promptSchema } from '../schemas/chat';

const router = express.Router();

router.get('/messenger', validate(messageSchema), ChatController.getCompletion);
router.post(
  '/prompt/generate',
  validate(promptSchema),
  ChatController.generatePrompt
);
router.post(
  '/prompt/improve',
  validate(promptSchema),
  ChatController.improvePrompt
);

export default router;
