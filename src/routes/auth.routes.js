import { Router } from "express";
import { authController } from "../controllers/index.js";
import { authValidators } from "../validators/index.js";
import { validate, authRateLimiter } from "../middlewares/index.js";

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
export default router;
