import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import routes from './routes';
import logger from './helpers/logger';
import { Server } from 'socket.io';
import { createServer } from 'http';
import helmet from 'helmet';
import socket from './controllers/socket';
import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';

process.env.TZ = 'Etc/UTC';

if (!process.env.DB_CONNECTION_STRING) {
  throw new Error('DB_CONNECTION_STRING environment variable is not defined');
}

if (!process.env.PORT) {
  throw new Error('PORT environment variable is not defined');
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

mongoose
  .connect(process.env.DB_CONNECTION_STRING!)
  .then(() => logger.info('Database connected'))
  .catch(e => logger.error(e));

const port = process.env.PORT || 2000;

//deployment optimization
app.use(
    compression({
        level: 6,
        threshold: 100 * 1000,
        filter: (req, res) => {
            if (req.headers['x-no-compression']) return false;
            return compression.filter(req, res);
        },
    })
);

//builtin middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));

//routes
app.use(routes);

socket(io);

//running server
app.listen(port, () => {
    logger.info(`⚡️ Server is running at http://localhost:${port}`);
});

const graceful = async () => {
    await mongoose.connection.close();
    logger.info('💀 Db connection closed');
    server.close(() => {
      logger.info('💀 Server connection closed');
      process.exit(0);
    });
  };
  
  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);