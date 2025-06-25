import Chat from "../models/chat";
import { isValidObjectId } from "mongoose";
import Message from "../models/message";

const ChatDao = {
  createChat(data: any) {
    return Chat.create(data);
  },
  createMessage(args: any) {
    return Message.create(args);
  },
  getAll(args: { user: string; bot?: string }) {
    if (args.user && !isValidObjectId(args.user)) return null;
    return Chat.find(args).select("-messages").sort("-updatedAt");
  },
  getMessages(args: any) {
    if (args.chat && !isValidObjectId(args.chat)) return null;
    return Message.find(args);
  },
  getChat(args: any) {
    if (args._id && !isValidObjectId(args._id)) return null;
    return Chat.findOne(args);
  },
  getByUser(user: string) {
    return Chat.find({ user }).select("-messages").sort("-updatedAt");
  },
  update(args: any, data: any) {
    if (args._id && !isValidObjectId(args._id)) return null;
    return Chat.findOneAndUpdate(args, data, { new: true });
  },
  deleteById(id: string, user: string) {
    if (!isValidObjectId(id) || !isValidObjectId(user)) return null;
    return Chat.findOneAndDelete({ _id: id, user });
  },
};

export default ChatDao;
