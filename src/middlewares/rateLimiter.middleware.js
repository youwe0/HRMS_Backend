import rateLimit from 'express-rate-limit';
import config from '../config/index.js';
import { MESSAGES } from '../constants/index.js';

const createLimiter = ({ windowMs, max }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: MESSAGES.TOO_MANY_REQUESTS },
  });

/** Applied to the whole API. */
export const globalRateLimiter = createLimiter({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
});

/** Stricter limiter for authentication endpoints. */
export const authRateLimiter = createLimiter({
  windowMs: config.authRateLimit.windowMs,
  max: config.authRateLimit.max,
});
