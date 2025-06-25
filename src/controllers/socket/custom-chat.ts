// import { Socket } from "socket.io";
// import logger from "../../lib/logger";
// import FmService from "../../services/fm";

// const chats: any[] = [];

// const handleCustomChat = (socket: Socket) => {
//   try {
//     logger.debug(`Connected ${socket.id}`);
//     chats.push({
//       id: socket.id,
//       messages: [
//         {
//           role: "system",
//           content: `${socket.handshake.query.prompt}`,
//         },
//       ],
//     });
//     logger.debug(`${chats.length} ongoing chat(s)`);
//     socket.on("message", async ({ text }) => {
//       if (!text) return logger.error("No text");
//       const messages = chats.find((c) => c.id === socket.id)!.messages;
//       messages.push({ role: "user", content: text });
//       socket.emit("message", { messages });
//       const response = await FmService.getChatCompletionFromGpt(messages as []);
//       if (response) messages.push(response);
//       socket.emit("message", { messages });
//     });
//     socket.on("disconnect", () => {
//       const index = chats.findIndex((c) => c.id === socket.id);
//       chats.splice(index, 1);
//       logger.debug(`Disconnected ${socket.id}`);
//       logger.debug(`${chats.length} ongoing chat(s)`);
//     });
//   } catch (e: any) {
//     logger.error(e.message);
//   }
// };

// export default handleCustomChat;
