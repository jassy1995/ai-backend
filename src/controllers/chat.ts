import { NextFunction, Request, Response } from "express";
import ChatService from "../services/chat";
import UserService from "../services/user";
import { generateRandomHex } from "../helpers/utils";

const ChatController = {
  async getWebSearchResults(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;
      let messages: any = [{ role: "user", content: message }];
      let fullResponse = "";

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      try {
        for await (const chunk of ChatService.chatMessengerWithWebSearch(
          messages
        )) {
          res.write(
            `data: ${JSON.stringify({
              content: chunk,
              isError: false,
              isEnd: false,
            })}\n\n`
          );
          res.flush();
          fullResponse += chunk;
        }
        res.write(
          `data: ${JSON.stringify({
            content: fullResponse,
            isError: false,
            isEnd: true,
          })}\n\n`
        );
        res.flush();
        res.end();
      } catch (err: any) {
        res.write(
          `data: ${JSON.stringify({
            content: err.message,
            isError: true,
            isEnd: true,
          })}\n\n`
        );
        res.flush();
        res.end();
      }
    } catch (e: any) {
      return next(e);
    }
  },
  async getChatMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const chatId = req.params.chatId as string;
      const messages = await ChatService.getMessages({ chat: chatId });
      return res.status(200).json({ messages, success: true });
    } catch (e: any) {
      return next(e);
    }
  },
  async chatMessenger(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, userId, chatId, bot, tool } = req.body;

      let messages: any = [];
      let chat: any = chatId;

      const user = await UserService.getUser({ _id: userId });
      if (!user || !message)
        return res
          .status(400)
          .json({ success: false, message: "User not found" });

      if (chatId) {
        const existingChat = await ChatService.getChat({ _id: chatId });
        if (existingChat) {
          const previousMessages =
            (await ChatService.getMessages({ chat: chatId })) || [];
          const formatPreviousMessages = previousMessages.map((m: any) => ({
            role: m.role,
            content: m.content,
          }));
          await ChatService.createMessage({
            chat: existingChat._id,
            content: message,
            role: "user",
          });
          messages = [
            ...formatPreviousMessages,
            { role: "user", content: message },
          ];
        }
      } else {
        const newChat = await ChatService.createChat({
          user: userId,
          bot,
          title: `Chat #${generateRandomHex(1)}`,
        });
        chat = newChat._id;
        await ChatService.createMessage({
          chat: newChat._id,
          content: message,
          role: "user",
        });
        messages = [{ role: "user", content: message }];
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let fullResponse = "";

      try {
        const streamGenerator =
          tool === "web_search"
            ? ChatService.chatMessengerWithWebSearch(messages)
            : ChatService.chatMessengerWithTools(messages);

        for await (const chunk of streamGenerator) {
          fullResponse += chunk;
          res.write(
            `data: ${JSON.stringify({
              content: chunk,
              isError: false,
              isEnd: false,
            })}\n\n`
          );
          res.flush();
        }
        res.write(
          `data: ${JSON.stringify({
            content: fullResponse,
            isError: false,
            isEnd: true,
          })}\n\n`
        );
        res.flush();
        res.end();

        await ChatService.createMessage({
          chat: chat,
          content: fullResponse,
          role: "assistant",
        });

        const isChatCompleteChat =
          messages.filter((m: any) => m.role !== "system" && m.role !== "tool")
            .length === 2;
        if (isChatCompleteChat) {
          await ChatService.updateChatTitleIfNeeded(chat);
        }
      } catch (err: any) {
        res.write(
          `data: ${JSON.stringify({
            content: err.message,
            isError: true,
            isEnd: true,
          })}\n\n`
        );
        res.flush();
        res.end();
      }
    } catch (e) {
      next(e);
    }
  },
};

export default ChatController;
