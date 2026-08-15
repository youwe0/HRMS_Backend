import Joi from "joi";
import { objectId, paginationQuerySchema } from "./common.validator.js";

const EMPLOYEE_STATUS = ["active", "on-leave", "terminated"];

export const employeeListQuerySchema = paginationQuerySchema.keys({
  status: Joi.string()
    .valid(...EMPLOYEE_STATUS)
    .optional(),
  department: objectId.optional(),
  search: Joi.string().trim().max(100).optional(),
});

export const createEmployeeSchema = Joi.object({
  user: objectId.required(),
  department: objectId.required(),
  employeeId: Joi.string().trim().uppercase().min(3).max(20).required(),
  designation: Joi.string().trim().max(100).required(),
  joiningDate: Joi.date().max("now").required(),
  phone: Joi.string().trim().max(20).optional().allow(""),
  address: Joi.string().trim().max(500).optional().allow(""),
  salary: Joi.object({
    currency: Joi.string().trim().uppercase().length(3).default("USD"),
    amount: Joi.number().min(0).default(0),
  }).optional(),
  status: Joi.string()
    .valid(...EMPLOYEE_STATUS)
    .default("active"),
});

export const updateEmployeeSchema = Joi.object({
  department: objectId.optional(),
  employeeId: Joi.string().trim().uppercase().min(3).max(20).optional(),
  designation: Joi.string().trim().max(100).optional(),
  joiningDate: Joi.date().max("now").optional(),
  phone: Joi.string().trim().max(20).optional().allow(""),
  address: Joi.string().trim().max(500).optional().allow(""),
  salary: Joi.object({
    currency: Joi.string().trim().uppercase().length(3).optional(),
    amount: Joi.number().min(0).optional(),
  }).optional(),
  status: Joi.string()
    .valid(...EMPLOYEE_STATUS)
    .optional(),
}).min(1);
