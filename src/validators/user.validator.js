import Joi from 'joi';
import { ROLES, ROLES_LIST } from '../constants/index.js';
import { paginationQuerySchema } from './common.validator.js';

export const userListQuerySchema = paginationQuerySchema.keys({
  search: Joi.string().trim().max(100).optional(),
  role: Joi.string().valid(...ROLES_LIST).optional(),
  isActive: Joi.boolean().optional(),
});

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(72).required(),
  role: Joi.string().valid(...ROLES_LIST).default(ROLES.EMPLOYEE),
  isActive: Joi.boolean().default(true),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().lowercase().email().optional(),
  password: Joi.string().min(8).max(72).optional(),
  role: Joi.string().valid(...ROLES_LIST).optional(),
  isActive: Joi.boolean().optional(),
}).min(1);
