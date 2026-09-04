import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
} from "../../shared/middlewares/index.js";
import * as userValidators from "./user.validator.js";
import * as userController from "./user.controller.js";

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
