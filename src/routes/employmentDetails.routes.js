import { Router } from "express";
import { employmentDetailsController } from "../controllers/index.js";
import { authenticate, wrongMethod } from "../middlewares/index.js";

const router = Router();

// ---------- /employment-details ----------
router.get(
  "/",
  authenticate,
  employmentDetailsController.getEmploymentDetails,
);
router.all("/", wrongMethod(["GET"]));

export default router;
