import { Router } from "express";
import { employeeController } from "../controllers/index.js";
import {
  employeeValidators,
  objectIdParamSchema,
} from "../validators/index.js";
import { authenticate, authorize, validate } from "../middlewares/index.js";
import { ROLES } from "../constants/index.js";

const router = Router();

router.use(authenticate, authorize(ROLES.ADMIN, ROLES.HR));

router.get(
  "/",
  validate(employeeValidators.employeeListQuerySchema, "query"),
  employeeController.getEmployees,
);
router.post(
  "/",
  validate(employeeValidators.createEmployeeSchema),
  employeeController.createEmployee,
);
router.get(
  "/:id",
  validate(objectIdParamSchema, "params"),
  employeeController.getEmployee,
);
router.patch(
  "/:id",
  validate(objectIdParamSchema, "params"),
  validate(employeeValidators.updateEmployeeSchema),
  employeeController.updateEmployee,
);
router.delete(
  "/:id",
  validate(objectIdParamSchema, "params"),
  employeeController.deleteEmployee,
);

export default router;
