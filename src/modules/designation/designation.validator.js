import Joi from "joi";
import { paginationSchema } from "../../shared/utils/pagination.js";

export const createDesignationSchema = Joi.object({
  designation: Joi.string().trim().min(1).max(200).required(),
  isActive: Joi.boolean().optional(),
});

export const getDesignationsSchema = paginationSchema();

export const deleteDesignationSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
