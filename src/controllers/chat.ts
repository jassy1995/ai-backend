import { NextFunction, Request, Response } from 'express';
import ChatService from '../services/chat';

const ChatController = {
  async getCompletion(req: Request, res: Response, next: NextFunction) {
    try {
      const message = req.query.message as string;
      const keywords = await ChatService.getKeywords(message);
      const messages: any = [{ role: 'user', content: message }];
      const response = await ChatService.getResponse(messages);
      return res
        .status(200)
        .json({ response, success: true, source: 'model', keywords });
    } catch (e: any) {
      return next(e);
    }
  },
  async generatePrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const message = req.body.message as string;
      const response = await ChatService.generatePromptFromQuestion(message);
      return res.status(200).json({ response, success: true });
    } catch (e: any) {
      return next(e);
    }
  },
  async improvePrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const message = req.body.message as string;
      const response = await ChatService.improvePrompt(message);
      return res.status(200).json({ response, success: true });
    } catch (e: any) {
      return next(e);
    }
  },
};

export default ChatController;
