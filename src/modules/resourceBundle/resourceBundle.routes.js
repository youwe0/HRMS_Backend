import { Router } from "express";
import * as resourceBundleController from "./resourceBundle.controller.js";
import { globalRateLimiter, wrongMethod } from "../../shared/middlewares/index.js";

const router = Router();

// ---------- /resource-bundle ----------
// Public endpoint — no authenticate middleware.
router.get(
  "/resource-bundle",
  globalRateLimiter,
  resourceBundleController.getResourceBundle,
);
router.all("/resource-bundle", wrongMethod(["GET"]));

export default router;
