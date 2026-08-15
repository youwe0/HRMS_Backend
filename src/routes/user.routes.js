import { Router } from "express";
import { userController } from "../controllers/index.js";
import { userValidators, objectIdParamSchema } from "../validators/index.js";
import { authenticate, authorize, validate } from "../middlewares/index.js";
import { ROLES } from "../constants/index.js";

const router = Router();

router.use(authenticate, authorize(ROLES.ADMIN, ROLES.HR));

router.get(
  "/",
  validate(userValidators.userListQuerySchema, "query"),
  userController.getUsers,
);
router.post(
  "/",
  validate(userValidators.createUserSchema),
  userController.createUser,
);
router.get(
  "/:id",
  validate(objectIdParamSchema, "params"),
  userController.getUser,
);
router.patch(
  "/:id",
  validate(objectIdParamSchema, "params"),
  validate(userValidators.updateUserSchema),
  userController.updateUser,
);
router.delete(
  "/:id",
  validate(objectIdParamSchema, "params"),
  userController.deleteUser,
);

export default router;
