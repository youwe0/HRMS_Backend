import winston from "winston";
import path from "node:path";
import fs from "node:fs";
import config from "../../shared/config/index.js";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logDir = path.resolve(config.log.dir);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFormat = printf(
  ({ level, message, timestamp: ts, stack, ...meta }) => {
    let output = `${ts} [${level}]: ${stack || message}`;
    const rest = Object.keys(meta).filter(
      (key) => key !== "level" && key !== "message",
    );
    if (rest.length > 0) {
      const cleaned = {};
      rest.forEach((key) => {
        cleaned[key] = meta[key];
      });
      output += ` ${JSON.stringify(cleaned)}`;
    }
    return output;
  },
);

const logger = winston.createLogger({
  level: config.log.level,
  format: combine(errors({ stack: true }), timestamp(), logFormat),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
  exitOnError: false,
});

if (!config.isProduction) {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
  );
}

export default logger;
