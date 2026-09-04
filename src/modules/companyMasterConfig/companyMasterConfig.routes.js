import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
  authRateLimiter,
} from "../../shared/middlewares/index.js";
import * as companyMasterConfigValidators from "./companyMasterConfig.validator.js";
import * as companyMasterConfigController from "./companyMasterConfig.controller.js";

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
