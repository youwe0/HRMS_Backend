import mongoose from "mongoose";
import { asyncHandler, sendSuccess } from "../utils/index.js";
import { HTTP_STATUS } from "../constants/index.js";
import config from "../config/index.js";

export const getHealth = asyncHandler(async (req, res) => {
  sendSuccess(res, HTTP_STATUS.OK, "API is healthy", {
    status: "ok",
    environment: config.nodeEnv,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});
