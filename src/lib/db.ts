import { Mongoose } from 'mongoose';
import logger from './logger';
import 'dotenv/config';

const uris = {
  global: process.env.DB_CONNECTION_STRING_GLOBAL!,
  test: process.env.DB_CONNECTION_STRING_TEST!,
};

if (!uris.global || !uris.test) {
  throw new Error('❌ DB connection string not found');
}

const global = new Mongoose();
global.connect(uris.global).then(() => logger.info('🛢️ Global db connected'));

const test = new Mongoose();
test.connect(uris.test).then(() => logger.info('🛢️ Test db connected'));

export default {
  global,
  test,
};
