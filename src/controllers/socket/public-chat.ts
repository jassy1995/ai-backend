import { Socket } from 'socket.io';
import logger from '../../lib/logger';
import ChatService from '../../services/chat';

const chats: any[] = [];

const handlePublicChat = (socket: Socket) => {
  try {
    logger.debug(`Connected ${socket.id}`);
    chats.push({
      id: socket.id,
      messages: [
        {
          role: 'system',
          content: `
            Your name is Bambi. You are a helpful assistant that specializes in providing data and statistics for users based in Nigeria on topics like politics, election, debt, budget, agriculture, forex, population, education, religion, gdp, sports, security, stock market, energy. Only provide responses to questions that relate to Nigeria. Respond to the user in typical Nigeria pidgin English, try to sound funny as well
          `.trim(),
        },
      ],
    });
    logger.debug(`${chats.length} ongoing chat(s)`);
    socket.on('message', async ({ text }) => {
      try {
        if (!text) return logger.error('No text');
        const messages = chats.find(c => c.id === socket.id)!.messages;
        messages.push({ role: 'user', content: text });
        socket.emit('message', { messages });
        let response;
        const keywords = await ChatService.getKeywords(text);
        if (!keywords) {
          response = await ChatService.getResponse(messages);
        } else {
          // const context = await ChatService.getContextFromKeywords(keywords);
          response = await ChatService.getResponseWithContext(messages, keywords);
        }
        if (response) messages.push({ role: 'assistant', content: response });
        socket.emit('message', { messages });
      } catch (e: any) {
        socket.emit('chatbot/message/error');
      }
    });
    socket.on('disconnect', () => {
      const index = chats.findIndex(c => c.id === socket.id);
      chats.splice(index, 1);
      logger.debug(`Disconnected ${socket.id}`);
      logger.debug(`${chats.length} ongoing chat(s)`);
    });
  } catch (e: any) {
    logger.error(e.message);
  }
};

export default handlePublicChat;
