import { Router } from "express";
import * as authController from "./auth.controller.js";
import * as authValidators from "./auth.validator.js";
import {
  validate,
  authRateLimiter,
  authenticate,
  wrongMethod,
} from "../../shared/middlewares/index.js";

const router = Router();

// ---------- /register ----------
router.post(
  "/register",
  authRateLimiter,
  authenticate,
  validate(authValidators.registerSchema),
  authController.register,
);
router.all("/register", wrongMethod(["POST"]));

// ---------- /login ----------
router.post(
  "/login",
  authRateLimiter,
  validate(authValidators.loginSchema),
  authController.login,
);
router.all("/login", wrongMethod(["POST"]));

export default router;
