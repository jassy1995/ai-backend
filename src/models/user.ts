import mongoose from 'mongoose';
import {comparePasswords, hashPassword} from '../helpers/auth';
import logger from '../lib/logger';

const schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: () => Date.now(),
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

interface UserBaseDocument extends Document, mongoose.InferSchemaType<typeof schema> {
  comparePasswords(password: string): boolean;
}

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password) this.password = await hashPassword(this.password);
  next();
});

schema.methods.comparePasswords = function (password: string) {
  return comparePasswords(password, this.password);
};

const User = mongoose.model<UserBaseDocument>('User', schema);

User.syncIndexes().catch(e => logger.error(e));

export default User;
