import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import routes from "./routes";
import logger from "./helpers/logger";
import { Server } from "socket.io";
import { createServer } from "http";
import helmet from "helmet";
// import socket from './controllers/socket';
import db from "./lib/db";
import dotenv from "dotenv";
dotenv.config();

process.env.TZ = "Etc/UTC";

if (!process.env.PORT) {
  throw new Error("PORT environment variable is not defined");
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 2000;

//deployment optimization
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  })
);

//builtin middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));

//routes
app.use(routes);

//starting the server
const start = async () => {
  try {
    await Promise.all([
      db.global.connection.asPromise(),
      db.test.connection.asPromise(),
    ]);
    logger.info("🛢️ All database connections established");
    // socket(io);
    server.listen(PORT, () => {
      logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();

//graceful shutdown
const graceful = async () => {
  await db.global.connection.close();
  await db.test.connection.close();
  logger.info("💀 Db connection closed");
  server.close(() => {
    logger.info("💀 Server connection closed");
    process.exit(0);
  });
};

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);
