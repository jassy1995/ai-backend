import logger from '../lib/logger';
import db from '../lib/db';

const schema = new db.test.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 32,
      trim: true,
    },
    user: {
      type: db.test.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bot: {
      type: db.test.Schema.Types.String,
      required: true,
    },
  },
  {
    collection: 'chats',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

schema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chat',
});

const Chat = db.test.model('Chat', schema);

Chat.syncIndexes().catch((e) => logger.error(e));

export default Chat;
