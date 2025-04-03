import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const signToken = (payload: any, expiresIn = '1d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};
