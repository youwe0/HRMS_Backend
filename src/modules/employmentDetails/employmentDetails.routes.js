import { Router } from "express";
import * as employmentDetailsController from "./employmentDetails.controller.js";
import { authenticate, wrongMethod } from "../../shared/middlewares/index.js";

const router = Router();

// ---------- /employment-details ----------
router.get(
  "/",
  authenticate,
  employmentDetailsController.getEmploymentDetails,
);
router.all("/", wrongMethod(["GET"]));

export default router;
