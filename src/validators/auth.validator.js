import Joi from "joi";

export const registerSchema = Joi.object({
  userName: Joi.string().trim().min(2).max(100).required(),
  password: Joi.string().min(8).max(72).required(),
});

export const loginSchema = Joi.object({
  userName: Joi.string().trim().min(2).max(100).required(),
  password: Joi.string().required(),
});
