import jwt from "jsonwebtoken";
import config from "../../shared/config/index.js";
import { ApiError } from "../../shared/utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../../shared/constants/index.js";

/**
 * Middleware that verifies a JWT access token from the Authorization header.
 * Attaches the decoded payload to req.user on success.
 * Skipped if no token is provided — the route itself must decide whether
 * authentication is required.
 */
export const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED),
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(
      new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED),
    );
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(
        new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.TOKEN_EXPIRED),
      );
    }
    if (err.name === "JsonWebTokenError") {
      return next(
        new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_TOKEN),
      );
    }
    return next(
      new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED),
    );
  }
};
