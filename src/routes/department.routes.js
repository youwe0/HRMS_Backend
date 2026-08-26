import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
  authRateLimiter,
} from "../middlewares/index.js";
import { departmentValidators } from "../validators/index.js";
import { departmentController } from "../controllers/index.js";

const router = Router();

// ---------- /departments ----------
router.post(
  "/",
  authRateLimiter,
  authenticate,
  validate(departmentValidators.createDepartmentSchema),
  departmentController.createDepartment,
);
router.all("/", wrongMethod(["POST"]));

export default router;
