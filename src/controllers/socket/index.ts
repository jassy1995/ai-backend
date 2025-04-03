import { Server } from 'socket.io';
import handlePublicChat from './public-chat';
import handleUserChat from './user-chat';
import handleCustomChat from './custom-chat';

export default (io: Server) => {
  io.on('connection', async socket => {
    const { type = 'public', user, id } = socket.handshake.query;
    if (type === 'public') handlePublicChat(socket);
    if (type === 'user') await handleUserChat(socket, { user, id });
    if (type === 'custom') handleCustomChat(socket);
  });
};
