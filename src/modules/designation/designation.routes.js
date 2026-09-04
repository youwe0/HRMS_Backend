import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
  authRateLimiter,
} from "../../shared/middlewares/index.js";
import * as designationValidators from "./designation.validator.js";
import * as designationController from "./designation.controller.js";

const router = Router();

// ---------- /designations ----------
router.post(
  "/",
  authRateLimiter,
  authenticate,
  validate(designationValidators.createDesignationSchema),
  designationController.createDesignation,
);

router.get(
  "/",
  authenticate,
  validate(designationValidators.getDesignationsSchema),
  designationController.getAllDesignations,
);

router.all("/", wrongMethod(["POST", "GET"]));

// ---------- /designations/:id ----------
router.delete(
  "/:id",
  authenticate,
  validate(designationValidators.deleteDesignationSchema, "params"),
  designationController.deleteDesignation,
);

router.all("/:id", wrongMethod(["DELETE"]));

export default router;
