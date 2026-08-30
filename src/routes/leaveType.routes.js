import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
  authRateLimiter,
} from "../middlewares/index.js";
import { leaveTypeValidators } from "../validators/index.js";
import { leaveTypeController } from "../controllers/index.js";

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
