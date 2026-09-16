import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
  authRateLimiter,
} from "../../shared/middlewares/index.js";
import * as shiftMasterValidators from "./shiftMaster.validator.js";
import * as shiftMasterController from "./shiftMaster.controller.js";

const router = Router();

// ---------- /shift-masters ----------
router.post(
  "/",
  authRateLimiter,
  authenticate,
  validate(shiftMasterValidators.createShiftSchema),
  shiftMasterController.createShift,
);

router.get(
  "/",
  authenticate,
  validate(shiftMasterValidators.getShiftsSchema),
  shiftMasterController.getAllShifts,
);

router.all("/", wrongMethod(["POST", "GET"]));

// ---------- /shift-masters/:id ----------
router.put(
  "/:id",
  authRateLimiter,
  authenticate,
  validate(shiftMasterValidators.updateShiftParamsSchema, "params"),
  validate(shiftMasterValidators.updateShiftSchema),
  shiftMasterController.updateShift,
);

router.delete(
  "/:id",
  authenticate,
  validate(shiftMasterValidators.deleteShiftSchema, "params"),
  shiftMasterController.deleteShift,
);

router.all("/:id", wrongMethod(["PUT", "DELETE"]));

export default router;
