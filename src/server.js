import http from "node:http";
import config from "./config/index.js";
import logger from "./utils/logger.js";
import { initLoaders } from "./loaders/index.js";
import { attachSockets } from "./sockets/index.js";
import { disconnectDB } from "./db/connection.js";

const startServer = async () => {
  const app = await initLoaders();

  const server = http.createServer(app);

  if (config.enableSockets) {
    attachSockets(server);
  }

  server.listen(config.port, () => {
    logger.info(
      `${config.appName} is running on port ${config.port} (${config.nodeEnv})`,
    );
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down gracefully...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    // Force-exit if connections refuse to drain.
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch((err) => {
  logger.error("Failed to start server", {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});
