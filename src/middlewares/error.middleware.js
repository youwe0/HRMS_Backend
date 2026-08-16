import { ApiError } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import logger from "../utils/logger.js";

//  404 for unmatched routes.
export const notFoundHandler = (req, res, next) => {
  next(
    new ApiError(
      HTTP_STATUS.NOT_FOUND,
      `${MESSAGES.ROUTE_NOT_FOUND}: ${req.method} ${req.originalUrl}`,
    ),
  );
};

// Centralized error middleware — every error in the app ends up here.
export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    if (error.code === 2627 || error.code === 2601) {
      error = new ApiError(HTTP_STATUS.CONFLICT, "Username already exists");
    } else {
      logger.error("Unhandled error", {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
      error = new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        MESSAGES.INTERNAL_SERVER_ERROR,
        [],
        false,
      );
    }
  }

  if (error.statusCode >= 500) {
    logger.error("Request failed", {
      method: req.method,
      path: req.originalUrl,
      statusCode: error.statusCode,
      message: error.message,
      stack: error.stack,
    });
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.details.length > 0 && { errors: error.details }),
  };

  return res.status(error.statusCode).json(response);
};
