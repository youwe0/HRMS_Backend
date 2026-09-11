import { Router } from "express";
import {
  authenticate,
  validate,
  wrongMethod,
  authRateLimiter,
} from "../../shared/middlewares/index.js";
import * as AnnouncementValidators from "./announcement.validator.js";
import * as AnnouncementController from "./announcement.controller.js";

const router = Router();

router.post(
  "/",
  authRateLimiter,
  authenticate,
  validate(AnnouncementValidators.createAnnouncementSchema),
  AnnouncementController.createAnnouncement,
);

router.get(
  "/",
  authRateLimiter,
  authenticate,
  validate(AnnouncementValidators.getAnnouncementsSchema),
  AnnouncementController.getAnnouncements,
);

router.all("/", wrongMethod(["POST", "GET"]));

export default router;
