import Joi from "joi";
import { paginationSchema } from "../utils/pagination.js";

export const createDepartmentSchema = Joi.object({
  department: Joi.string().trim().min(1).max(200).required(),
  hod: Joi.number().integer().positive().allow(null).optional(),
  isActive: Joi.boolean().optional(),
});

export const getDepartmentsSchema = paginationSchema();
