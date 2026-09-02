import Joi from "joi";

/**
 * POST /attendance/:userId
 * Body: { clockTime } — ISO 8601 timestamp
 */
export const makeAttendanceSchema = Joi.object({
  clockTime: Joi.date().iso().required().messages({
    "any.required": "\"clockTime\" is required",
    "date.base": "\"clockTime\" must be a valid date",
    "date.iso": "\"clockTime\" must be in ISO 8601 format",
  }),
});

/**
 * Params for POST /attendance/:userId
 */
export const attendanceParamsSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "any.required": "\"userId\" is required",
    "number.base": "\"userId\" must be a number",
  }),
});

/**
 * GET /attendance/:userId
 * Query: { fromDate, toDate } — YYYY-MM-DD strings
 */
export const getAttendanceSchema = Joi.object({
  fromDate: Joi.date().iso().required().messages({
    "any.required": "\"fromDate\" is required",
    "date.base": "\"fromDate\" must be a valid date",
    "date.iso": "\"fromDate\" must be in ISO 8601 format",
  }),
  toDate: Joi.date().iso().required().messages({
    "any.required": "\"toDate\" is required",
    "date.base": "\"toDate\" must be a valid date",
    "date.iso": "\"toDate\" must be in ISO 8601 format",
  }),
});
