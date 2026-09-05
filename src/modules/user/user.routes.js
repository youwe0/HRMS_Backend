import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
  authRateLimiter,
} from "../../shared/middlewares/index.js";
import * as userValidators from "./user.validator.js";
import * as userController from "./user.controller.js";

const router = Router();

// ---------- /users/search ----------
router.get(
  "/search",
  authenticate,
  validate(userValidators.searchUsersSchema),
  userController.searchUsers,
);

router.all("/search", wrongMethod(["GET"]));

// ---------- /users/:userId/permissions — assign permissions ----------
router.put(
  "/:userId/permissions",
  authRateLimiter,
  authenticate,
  validate(userValidators.userIdParamSchema, "params"),
  validate(userValidators.assignPermissionsSchema),
  userController.assignPermissions,
);

router.all("/:userId/permissions", wrongMethod(["PUT"]));

// ---------- /users/:userId/permissions — get permissions ----------
router.get(
  "/:userId/permissions",
  authenticate,
  validate(userValidators.userIdParamSchema, "params"),
  userController.getUserPermissions,
);

router.all("/:userId/permissions", wrongMethod(["GET", "PUT"]));

export default router;
