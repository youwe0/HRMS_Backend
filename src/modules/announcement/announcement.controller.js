import { asyncHandler, sendSuccess } from "../../shared/utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../../shared/constants/index.js";
import { createPaginatedHandler } from "../../shared/utils/pagination.js";
import * as AnnouncementService from "./announcement.service.js";

export const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await AnnouncementService.createAnnouncement({
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    userId: req.user.userId,
  });
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.ANNOUNCEMENT_CREATED, { announcement });
});

export const getAnnouncements = createPaginatedHandler(
  (options) => AnnouncementService.getAnnouncements(options),
  { dataKey: "announcements", message: MESSAGES.ANNOUNCEMENTS_RETRIEVED, statusCode: HTTP_STATUS.OK },
);
