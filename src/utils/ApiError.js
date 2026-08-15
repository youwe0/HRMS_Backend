/**
 * Operational error carrying an HTTP status code.
 * Non-operational (unexpected) errors default to 500.
 */
export default class ApiError extends Error {
  constructor(statusCode, message, details = [], isOperational = true) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
