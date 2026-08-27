import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
} from "../middlewares/index.js";
import { userValidators } from "../validators/index.js";
import { userController } from "../controllers/index.js";

const router = Router();

// ---------- /users/search ----------
router.get(
  "/search",
  authenticate,
  validate(userValidators.searchUsersSchema),
  userController.searchUsers,
);

router.all("/search", wrongMethod(["GET"]));

export default router;
