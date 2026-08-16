import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

export default {
  appName: process.env.APP_NAME || "HRMS API",
  nodeEnv,
  isProduction,
  isTest: nodeEnv === "test",
  port: parseInt(process.env.PORT, 10) || 5000,
  apiPrefix: process.env.API_PREFIX || "/api",

  sql: {
    server: process.env.SQL_SERVER || "localhost\\SQLEXPRESS",
    database: process.env.SQL_DATABASE || "HRMS",
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    port: parseInt(process.env.SQL_PORT, 10) || 1433,
    encrypt: process.env.SQL_ENCRYPT === "true",
    trustServerCertificate:
      process.env.SQL_TRUST_SERVER_CERTIFICATE !== "false",
  },

  cors: {
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim()),
    credentials: true,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },

  authRateLimit: {
    windowMs:
      parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 20,
  },

  log: {
    level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
    dir: process.env.LOG_DIR || "logs",
  },

};
