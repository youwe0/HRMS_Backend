import sql from "mssql";
import config from "../config/index.js";
import logger from "../utils/logger.js";

let pool;

export const connectDB = async () => {
  if (pool?.connected) return pool;
  if (!config.sql.user || !config.sql.password) {
    throw new Error("SQL_USER and SQL_PASSWORD must be set to connect to SQL Server");
  }
  const [server, instanceName] = config.sql.server.split("\\", 2);
  pool = await new sql.ConnectionPool({
    user: config.sql.user,
    password: config.sql.password,
    server,
    database: config.sql.database,
    port: config.sql.port,
    options: {
      encrypt: config.sql.encrypt,
      trustServerCertificate: config.sql.trustServerCertificate,
      ...(instanceName ? { instanceName } : {}),
    },
  }).connect();
  logger.info(`SQL Server connected: ${config.sql.server}/${config.sql.database}`);
  return pool;
};

export const getDB = () => {
  if (!pool?.connected) throw new Error("SQL Server is not connected");
  return pool;
};

export const isDBConnected = () => Boolean(pool?.connected);

export const disconnectDB = async () => {
  if (pool) await pool.close();
  pool = undefined;
  logger.info("SQL Server disconnected");
};
