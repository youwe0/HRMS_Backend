/** Standard success envelope used by all controllers. */
export const sendSuccess = (res, statusCode, message, data = null) =>
  res.status(statusCode).json({ success: true, message, data });
