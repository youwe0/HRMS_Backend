import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import config from '../config/index.js';

/** Sign a short-lived access token. */
export const signAccessToken = (payload) =>
  jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
    issuer: config.jwt.issuer,
  });

/** Sign a long-lived refresh token. */
export const signRefreshToken = (payload) =>
  jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: config.jwt.issuer,
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, config.jwt.accessSecret, { issuer: config.jwt.issuer });

export const verifyRefreshToken = (token) =>
  jwt.verify(token, config.jwt.refreshSecret, { issuer: config.jwt.issuer });

/**
 * Hash a refresh token before persisting it, so a leaked DB
 * dump does not expose usable tokens.
 */
export const hashRefreshToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');
