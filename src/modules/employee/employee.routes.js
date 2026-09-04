import { Router } from "express";
import * as employeeController from "./employee.controller.js";
import { authenticate, validate, wrongMethod } from "../../shared/middlewares/index.js";
import * as employeeValidators from "./employee.validator.js";

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
