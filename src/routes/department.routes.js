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

router.get(
  "/",
  authenticate,
  validate(departmentValidators.getDepartmentsSchema),
  departmentController.getAllDepartments,
);

router.all("/", wrongMethod(["POST", "GET"]));

// ---------- /departments/:id ----------
router.delete(
  "/:id",
  authenticate,
  validate(departmentValidators.deleteDepartmentSchema, "params"),
  departmentController.deleteDepartment,
);

router.all("/:id", wrongMethod(["DELETE"]));

export default router;
