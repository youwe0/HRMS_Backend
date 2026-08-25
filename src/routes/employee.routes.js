import { Router } from "express";
import { employeeController } from "../controllers/index.js";
import { authenticate, validate, wrongMethod } from "../middlewares/index.js";
import { employeeValidators } from "../validators/index.js";

const router = Router();

// ---------- /employees ----------
router.get(
  "/",
  authenticate,
  validate(employeeValidators.getEmployeesSchema),
  employeeController.getAllEmployees,
);
router.all("/", wrongMethod(["GET"]));

export default router;
