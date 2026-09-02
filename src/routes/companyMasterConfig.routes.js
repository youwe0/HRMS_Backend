import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
  authRateLimiter,
} from "../middlewares/index.js";
import { companyMasterConfigValidators } from "../validators/index.js";
import { companyMasterConfigController } from "../controllers/index.js";

const router = Router();

// ---------- /company-master-config ----------

router.post(
  "/",
  authRateLimiter,
  authenticate,
  validate(companyMasterConfigValidators.upsertCompanyMasterConfigSchema),
  companyMasterConfigController.upsertCompanyMasterConfig,
);

router.get(
  "/",
  authenticate,
  companyMasterConfigController.getAllCompanyMasterConfig,
);

router.all("/", wrongMethod(["POST", "GET"]));

export default router;
