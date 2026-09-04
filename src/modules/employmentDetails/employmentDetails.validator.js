import Joi from "joi";

/**
 * Validate the request body for PUT /updateData/:userId/employment-details.
 * All fields are required because this is a "fill data" endpoint — the client
 * must send the complete record.
 */
export const updateEmploymentDetailsSchema = Joi.object({
  employeeCode: Joi.string().trim().min(1).max(20).required().messages({
    "string.empty": "\"employeeCode\" is not allowed to be empty",
    "any.required": "\"employeeCode\" is required",
  }),
  department: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "\"department\" is not allowed to be empty",
    "any.required": "\"department\" is required",
  }),
  designation: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "\"designation\" is not allowed to be empty",
    "any.required": "\"designation\" is required",
  }),
  dateOfJoining: Joi.date().iso().required().messages({
    "any.required": "\"dateOfJoining\" is required",
    "date.base": "\"dateOfJoining\" must be a valid date",
    "date.iso": "\"dateOfJoining\" must be in ISO 8601 format",
  }),
  createdBy: Joi.number().integer().positive().optional(),
});
