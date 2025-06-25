import logger from '../lib/logger';
import db from '../lib/db';

const schema = new db.test.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    chat: {
      type: db.test.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'messages',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Message = db.test.model('Message', schema);

Message.syncIndexes().catch((e) => logger.error(e));

export default Message;
