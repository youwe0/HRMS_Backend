import { HTTP_STATUS, MESSAGES } from "../../shared/constants/index.js";
import * as employmentDetailsService from "./employmentDetails.service.js";
import { sendSuccess } from "../../shared/utils/apiResponse.js";
import { ApiError } from "../../shared/utils/index.js";

/**
 * GET /employment-details
 * Fetch employment details for the currently authenticated user.
 * The userId is extracted from the JWT token (req.user.userId).
 */
export const getEmploymentDetails = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const details = await employmentDetailsService.getEmploymentDetailsByUserId({ userId });

    if (!details) {
      return next(
        new ApiError(HTTP_STATUS.NOT_FOUND, "Employment details not found for this user"),
      );
    }

    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.EMPLOYMENT_DETAILS_RETRIEVED, {
      employmentDetails: details,
    });
  } catch (err) {
    next(err);
  }
};
