// import { Socket } from "socket.io";
// import ChatService from "../../services/chat";
// import logger from "../../lib/logger";
// import UserService from "../../services/user";

// const handleUserChat = async (socket: Socket, p: { user: any; id: any }) => {
//   try {
//     const chat: any = await UserService.getUser({ id: p.id, user: p.user });
//     if (!chat) return;
//     socket.emit("chatbot/message", { messages: chat.messages });
//     socket.on("chatbot/message", async ({ text }) => {
//       try {
//         if (!text) return logger.error("No text");
//         chat.messages.push({ role: "user", content: text });
//         socket.emit("chatbot/message", { messages: chat.messages });
//         const messages = chat.messages.map((m: any) => ({
//           role: m.role as any,
//           content: m.content,
//         }));
//         let response;
//         response = await ChatService.getResponse(messages);
//         if (response)
//           chat.messages.push({ role: "assistant", content: response });
//         if (chat.messages.length === 3) {
//           const title = await ChatService.getTitle(
//             chat.messages.filter((m: any) => m.role !== "system")
//           );
//           if (title) chat.title = title;
//         }
//         socket.emit("chatbot/message", {
//           messages: chat.messages,
//           title: chat.messages.length === 3 ? chat.title : null,
//         });
//         await chat.save();
//       } catch (e: any) {
//         socket.emit("chatbot/message/error");
//       }
//     });
//   } catch (e: any) {
//     logger.error(e.message);
//   }
// };

// export default handleUserChat;
