import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
  authRateLimiter,
} from "../../shared/middlewares/index.js";
import * as leaveTypeValidators from "./leaveType.validator.js";
import * as leaveTypeController from "./leaveType.controller.js";

const router = Router();

// ---------- /leave-types ----------
router.post(
  "/",
  authRateLimiter,
  authenticate,
  validate(leaveTypeValidators.createLeaveTypeSchema),
  leaveTypeController.createLeaveType,
);

router.get(
  "/",
  authenticate,
  validate(leaveTypeValidators.getLeaveTypesSchema),
  leaveTypeController.getAllLeaveTypes,
);

router.all("/", wrongMethod(["POST", "GET"]));

// ---------- /leave-types/:id ----------
router.delete(
  "/:id",
  authenticate,
  validate(leaveTypeValidators.deleteLeaveTypeSchema, "params"),
  leaveTypeController.deleteLeaveType,
);

router.all("/:id", wrongMethod(["DELETE"]));

export default router;
