import mongoose from 'mongoose';
import logger from '../lib/logger';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 32,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bot: {
      type: mongoose.Schema.Types.String,
      required: true,
      default: 'bambi',
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', schema);

Chat.syncIndexes().catch(e => logger.error(e));

export default Chat;
