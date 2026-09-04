import jwt from "jsonwebtoken";
import config from "../../shared/config/index.js";

/**
 * Generate a signed JWT for the given user payload.
 * @param {object} payload – e.g. { userId, userName, role }
 * @returns {string} signed JWT
 */
export const generateToken = (payload) =>
  jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
