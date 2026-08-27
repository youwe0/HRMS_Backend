import Joi from "joi";

export const searchUsersSchema = Joi.object({
  q: Joi.string().trim().min(1).max(100).required(),
})
  .unknown(false)
  .options({ stripUnknown: true });
