import { asyncHandler, sendSuccess } from "../../shared/utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../../shared/constants/index.js";
import * as permissionService from "./permission.service.js";
import { createPaginatedHandler } from "../../shared/utils/pagination.js";
import ApiError from "../../shared/utils/ApiError.js";

// POST /permissions — bulk sync permissions from the frontend.
export const syncPermissions = asyncHandler(async (req, res) => {
  const { created, updated } = await permissionService.syncPermissions({
    permissions: req.body.permissions,
    userId: req.user.userId,
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PERMISSIONS_SYNCED, {
    created,
    updated,
  });
});

// POST /permissions/create — single permission creation.
export const createPermission = asyncHandler(async (req, res) => {
  const permission = await permissionService.createPermission({
    code: req.body.code,
    name: req.body.name,
    type: req.body.type,
    module: req.body.module,
    parentCode: req.body.parentCode,
    isActive: req.body.isActive,
    userId: req.user.userId,
  });
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.PERMISSION_CREATED, {
    permission,
  });
});

// PUT /permissions/:id — update an existing permission.
export const updatePermission = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const permission = await permissionService.updatePermission({
    id,
    code: req.body.code,
    name: req.body.name,
    type: req.body.type,
    module: req.body.module,
    parentCode: req.body.parentCode,
    isActive: req.body.isActive,
  });
  if (!permission) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND);
  }
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PERMISSION_UPDATED, {
    permission,
  });
});

// DELETE /permissions/:id — soft-delete a permission.
export const deletePermission = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const permission = await permissionService.deletePermission({ id });
  if (!permission) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND);
  }
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PERMISSION_DELETED, {
    permission,
  });
});

// GET /permissions — paginated list of all permissions.
export const getAllPermissions = createPaginatedHandler(
  (opts) => permissionService.getAllPermissions(opts),
  {
    dataKey: "permissions",
    message: MESSAGES.PERMISSIONS_RETRIEVED,
    statusCode: HTTP_STATUS.OK,
  },
);
