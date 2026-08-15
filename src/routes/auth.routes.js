import { Router } from "express";
import { authController } from "../controllers/index.js";
import { authValidators } from "../validators/index.js";
import {
  authenticate,
  validate,
  authRateLimiter,
} from "../middlewares/index.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(authValidators.registerSchema),
  authController.register,
);
router.post(
  "/login",
  authRateLimiter,
  validate(authValidators.loginSchema),
  authController.login,
);
router.post(
  "/refresh",
  validate(authValidators.refreshTokenSchema),
  authController.refresh,
);
router.post("/logout", authenticate, authController.logout);
router.post(
  "/change-password",
  authenticate,
  validate(authValidators.changePasswordSchema),
  authController.changePassword,
);
router.get("/me", authenticate, authController.me);

export default router;
