import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

import config from "./shared/config/index.js";
import routes from "./routes/index.js";
import {
  globalRateLimiter,
  httpLogger,
  notFoundHandler,
  errorHandler,
} from "./shared/middlewares/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

// ---- Security & parsing ----
app.use(helmet());
app.use(cors(config.cors));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static(publicDir));

// ---- Logging & rate limiting ----
app.use(httpLogger);
app.use(globalRateLimiter);

// ---- Routes ----
app.use(config.apiPrefix, routes);

// ---- 404 & error handling (must be last) ----
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
