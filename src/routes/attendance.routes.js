import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
  authRateLimiter,
} from "../middlewares/index.js";
import { attendanceValidators } from "../validators/index.js";
import { attendanceController } from "../controllers/index.js";

const router = Router();

// ---------- /attendance/:userId ----------

// POST /attendance/:userId — clock in / clock out
router.post(
  "/:userId",
  authRateLimiter,
  authenticate,
  validate(attendanceValidators.attendanceParamsSchema, "params"),
  validate(attendanceValidators.makeAttendanceSchema),
  attendanceController.makeAttendance,
);

// GET /attendance/:userId — get attendance for date range
router.get(
  "/:userId",
  authenticate,
  validate(attendanceValidators.attendanceParamsSchema, "params"),
  validate(attendanceValidators.getAttendanceSchema, "query"),
  attendanceController.getAttendance,
);

router.all("/:userId", wrongMethod(["POST", "GET"]));

export default router;
