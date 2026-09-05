import Joi from "joi";
import { paginationSchema } from "../../shared/utils/pagination.js";

// Single permission — used for both bulk sync items and single create/update
const permissionItemSchema = Joi.object({
  code: Joi.string().trim().min(1).max(150).required(),
  name: Joi.string().trim().min(1).max(200).required(),
  type: Joi.string()
    .valid("module", "page", "section", "button")
    .required(),
  module: Joi.string().trim().min(1).max(50).required(),
  parentCode: Joi.string().trim().max(150).allow(null, "").optional(),
  isActive: Joi.boolean().optional(),
});

// POST /permissions — bulk sync
export const syncPermissionsSchema = Joi.object({
  permissions: Joi.array().items(permissionItemSchema).min(1).required(),
});

// POST /permissions/create — single create
export const createPermissionSchema = permissionItemSchema;

// PUT /permissions/:id — update
export const updatePermissionSchema = Joi.object({
  code: Joi.string().trim().min(1).max(150).required(),
  name: Joi.string().trim().min(1).max(200).required(),
  type: Joi.string()
    .valid("module", "page", "section", "button")
    .required(),
  module: Joi.string().trim().min(1).max(50).required(),
  parentCode: Joi.string().trim().max(150).allow(null, "").optional(),
  isActive: Joi.boolean().optional(),
});

// DELETE /permissions/:id
export const deletePermissionSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

// GET /permissions
export const getPermissionsSchema = paginationSchema();
