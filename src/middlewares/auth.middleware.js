import { ApiError, asyncHandler, verifyAccessToken } from '../utils/index.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import { userService } from '../services/index.js';

/** Verifies the Bearer access token and attaches the current user to req.user. */
export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_OR_EXPIRED_TOKEN);
  }

  const user = await userService.getUserById(payload.sub);
  if (!user || !user.isActive) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
  }

  req.user = user;
  return next();
});

/** Restricts the route to one or more roles. Must run after `authenticate`. */
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.FORBIDDEN));
  }
  return next();
};
