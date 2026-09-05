import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
  authRateLimiter,
} from "../../shared/middlewares/index.js";
import * as permissionValidators from "./permission.validator.js";
import * as permissionController from "./permission.controller.js";

const router = Router();

// ---------- POST /permissions — bulk sync ----------
router.post(
  "/",
  authRateLimiter,
  authenticate,
  validate(permissionValidators.syncPermissionsSchema),
  permissionController.syncPermissions,
);

// ---------- POST /permissions/create — single create ----------
router.post(
  "/create",
  authRateLimiter,
  authenticate,
  validate(permissionValidators.createPermissionSchema),
  permissionController.createPermission,
);

// ---------- GET /permissions — paginated list ----------
router.get(
  "/",
  authenticate,
  validate(permissionValidators.getPermissionsSchema),
  permissionController.getAllPermissions,
);

router.all("/", wrongMethod(["POST", "GET"]));

// ---------- PUT /permissions/:id — update ----------
router.put(
  "/:id",
  authRateLimiter,
  authenticate,
  validate(permissionValidators.deletePermissionSchema, "params"),
  validate(permissionValidators.updatePermissionSchema),
  permissionController.updatePermission,
);

// ---------- DELETE /permissions/:id — soft-delete ----------
router.delete(
  "/:id",
  authenticate,
  validate(permissionValidators.deletePermissionSchema, "params"),
  permissionController.deletePermission,
);

router.all("/:id", wrongMethod(["PUT", "DELETE"]));

export default router;
