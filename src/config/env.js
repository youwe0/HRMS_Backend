import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

const getSecret = (name, value) => {
  if (value) return value;
  if (isProduction) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return `dev-${name}-change-me`;
};

export default {
  appName: process.env.APP_NAME || "HRMS API",
  nodeEnv,
  isProduction,
  isTest: nodeEnv === "test",
  port: parseInt(process.env.PORT, 10) || 5000,
  apiPrefix: process.env.API_PREFIX || "/api",

  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hrms",

  jwt: {
    accessSecret: getSecret("JWT_ACCESS_SECRET", process.env.JWT_ACCESS_SECRET),
    refreshSecret: getSecret(
      "JWT_REFRESH_SECRET",
      process.env.JWT_REFRESH_SECRET,
    ),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    issuer: process.env.JWT_ISSUER || "hrms-api",
    refreshCookieName: process.env.JWT_REFRESH_COOKIE_NAME || "refreshToken",
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

  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // matches refresh token lifetime
  },

  log: {
    level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
    dir: process.env.LOG_DIR || "logs",
  },

  enableSockets: process.env.ENABLE_SOCKETS === "true",

  jobs: {
    cleanupRefreshTokens: {
      enabled: process.env.JOB_CLEANUP_REFRESH_TOKENS !== "false",
      schedule: process.env.JOB_CLEANUP_REFRESH_TOKENS_SCHEDULE || "0 3 * * *",
    },
  },
};
