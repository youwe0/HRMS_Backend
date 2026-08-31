import { Router } from "express";
import { userDetailController } from "../controllers/index.js";
import { employmentDetailsValidators } from "../validators/index.js";
import { authenticate, validate, wrongMethod } from "../middlewares/index.js";

const router = Router();

// ---------- GET /userDetail/:section ----------
// A single endpoint that handles all user-detail sub-sections.
// The :section param determines which data to return.
// Supported sections: "employment-details" (extendable for contact, education, etc.)
router.get(
  "/:section",
  authenticate,
  userDetailController.getUserDetail,
);
router.all("/:section", wrongMethod(["GET"]));

// ---------- PUT /userDetail/:userId/:section ----------
// Upsert data for a specific user and section.
// The :userId param identifies the target user.
// The :section param determines which table to update.
// Supported sections: "employment-details" (extendable for contact, education, etc.)
router.put(
  "/:userId/:section",
  authenticate,
  validate(employmentDetailsValidators.updateEmploymentDetailsSchema),
  userDetailController.updateUserDetail,
);
router.all("/:userId/:section", wrongMethod(["PUT"]));

export default router;
