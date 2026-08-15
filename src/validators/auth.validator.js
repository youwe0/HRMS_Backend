import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(72).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().optional().allow(""),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .max(72)
    .required()
    .invalid(Joi.ref("currentPassword")),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
}).with("newPassword", "confirmPassword");
