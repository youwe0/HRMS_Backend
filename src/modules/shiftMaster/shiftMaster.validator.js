import Joi from "joi";
import { paginationSchema } from "../../shared/utils/pagination.js";

const shiftTypes = ["REGULAR", "ROTATIONAL", "FLEXIBLE", "SPLIT", "NIGHT"];
const statusValues = ["ACTIVE", "INACTIVE"];

export const createShiftSchema = Joi.object({
  shiftCode: Joi.string().trim().min(1).max(20).required(),
  shiftName: Joi.string().trim().min(1).max(100).required(),
  shiftType: Joi.string()
    .valid(...shiftTypes)
    .default("REGULAR"),
  startTime: Joi.string()
    .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
    .required()
    .messages({ "string.pattern.base": "startTime must be HH:MM or HH:MM:SS" }),
  endTime: Joi.string()
    .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
    .required()
    .messages({ "string.pattern.base": "endTime must be HH:MM or HH:MM:SS" }),
  isOvernight: Joi.boolean().optional(),
  totalShiftHours: Joi.number().min(0).max(24).optional(),
  totalBreakTime: Joi.number().min(0).max(480).optional(),
  workingHours: Joi.number().min(0).max(24).optional(),
  graceInMinutes: Joi.number().integer().min(0).optional(),
  graceOutMinutes: Joi.number().integer().min(0).optional(),
  halfDayMarkAfterMinutes: Joi.number().integer().min(0).optional(),
  absentMarkAfterMinutes: Joi.number().integer().min(0).optional(),
  minHoursForFullDay: Joi.number().min(0).max(24).optional(),
  checkinWindowBeforeMinutes: Joi.number().integer().min(0).optional(),
  checkoutWindowAfterMinutes: Joi.number().integer().min(0).optional(),
  weeklyOffDays: Joi.string().trim().max(100).optional().allow(null, ""),
  status: Joi.string()
    .valid(...statusValues)
    .default("ACTIVE"),
}).unknown(false);

export const updateShiftSchema = Joi.object({
  shiftCode: Joi.string().trim().min(1).max(20).optional(),
  shiftName: Joi.string().trim().min(1).max(100).optional(),
  shiftType: Joi.string()
    .valid(...shiftTypes)
    .optional(),
  startTime: Joi.string()
    .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
    .optional()
    .messages({ "string.pattern.base": "startTime must be HH:MM or HH:MM:SS" }),
  endTime: Joi.string()
    .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
    .optional()
    .messages({ "string.pattern.base": "endTime must be HH:MM or HH:MM:SS" }),
  isOvernight: Joi.boolean().optional(),
  totalShiftHours: Joi.number().min(0).max(24).optional(),
  totalBreakTime: Joi.number().min(0).max(480).optional(),
  workingHours: Joi.number().min(0).max(24).optional(),
  graceInMinutes: Joi.number().integer().min(0).optional(),
  graceOutMinutes: Joi.number().integer().min(0).optional(),
  halfDayMarkAfterMinutes: Joi.number().integer().min(0).optional(),
  absentMarkAfterMinutes: Joi.number().integer().min(0).optional(),
  minHoursForFullDay: Joi.number().min(0).max(24).optional(),
  checkinWindowBeforeMinutes: Joi.number().integer().min(0).optional(),
  checkoutWindowAfterMinutes: Joi.number().integer().min(0).optional(),
  weeklyOffDays: Joi.string().trim().max(100).optional().allow(null, ""),
  status: Joi.string()
    .valid(...statusValues)
    .optional(),
}).min(1).unknown(false);

export const getShiftsSchema = paginationSchema();

export const deleteShiftSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
}).unknown(false);

export const updateShiftParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
}).unknown(false);
