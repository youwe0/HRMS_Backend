import Joi from 'joi';

export const objectId = Joi.string().hex().length(24);

export const objectIdParamSchema = Joi.object({
  id: objectId.required(),
});

export const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});
