import Joi from "joi";
import { paginationSchema } from "../utils/pagination.js";

export const createLeaveTypeSchema = Joi.object({
  leaveName: Joi.string().trim().min(1).max(200).required(),
  leaveCode: Joi.string().trim().min(1).max(50).required(),
  applicableFor: Joi.string().trim().max(200).allow("", null).optional(),
});

export const getLeaveTypesSchema = paginationSchema();

export const deleteLeaveTypeSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
