import Joi from 'joi';
import { objectId, paginationQuerySchema } from './common.validator.js';

export const departmentListQuerySchema = paginationQuerySchema.keys({
  search: Joi.string().trim().max(100).optional(),
  isActive: Joi.boolean().optional(),
});

export const createDepartmentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  code: Joi.string().trim().uppercase().min(2).max(10).required(),
  description: Joi.string().trim().max(500).optional().allow(''),
  head: objectId.optional().allow(null),
  isActive: Joi.boolean().default(true),
});

export const updateDepartmentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  code: Joi.string().trim().uppercase().min(2).max(10).optional(),
  description: Joi.string().trim().max(500).optional().allow(''),
  head: objectId.optional().allow(null),
  isActive: Joi.boolean().optional(),
}).min(1);
