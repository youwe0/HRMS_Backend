import Joi from "joi";

export const searchUsersSchema = Joi.object({
  q: Joi.string().trim().min(1).max(100).required(),
  searchFor: Joi.string()
    .valid("user", "department", "designation")
    .default("user"),
})
  .unknown(false)
  .options({ stripUnknown: true });

export const assignPermissionsSchema = Joi.object({
  permissions: Joi.array()
    .items(Joi.number().integer().positive())
    .min(0)
    .required()
    .messages({
      "array.min": "Permissions must be an array",
      "any.required": "Permissions array is required",
    }),
})
  .unknown(false)
  .options({ stripUnknown: true });

export const userIdParamSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "Invalid userId format. Must be a valid integer.",
    "number.integer": "Invalid userId format. Must be a valid integer.",
    "number.positive": "Invalid userId format. Must be a positive integer.",
    "any.required": "userId is required",
  }),
})
  .unknown(false)
  .options({ stripUnknown: true });
