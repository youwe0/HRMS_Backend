import { HTTP_STATUS, MESSAGES } from "../../shared/constants/index.js";
import * as employmentDetailsService from "../employmentDetails/employmentDetails.service.js";
import { sendSuccess } from "../../shared/utils/apiResponse.js";
import { ApiError } from "../../shared/utils/index.js";

// ── Section registry ─────────────────────────────────────────────────────────
// Each key is a valid :section value. The handler fetches the respective data
// for the authenticated user and returns the result.
//
// To add a new section (e.g. "contact-details"):
//   1. Create its service in src/services/contactDetails.service.js
//   2. Export it from src/services/index.js
//   3. Add an entry here:
//        "contact-details": {
//          fetch: (userId) => contactDetailsService.getContactDetailsByUserId({ userId }),
//          dataKey: "contactDetails",
//          message: MESSAGES.CONTACT_DETAILS_RETRIEVED,
//        },

const sections = {
  "employment-details": {
    fetch: (userId) =>
      employmentDetailsService.getEmploymentDetailsByUserId({ userId }),
    dataKey: "employmentDetails",
    message: "Employment details retrieved successfully",
  },

  // ── Future sections go here ──────────────────────────────────────────────
  // "contact-details": {
  //   fetch: (userId) => contactDetailsService.getContactDetailsByUserId({ userId }),
  //   dataKey: "contactDetails",
  //   message: MESSAGES.CONTACT_DETAILS_RETRIEVED,
  // },
  // "education-details": {
  //   fetch: (userId) => educationDetailsService.getEducationDetailsByUserId({ userId }),
  //   dataKey: "educationDetails",
  //   message: MESSAGES.EDUCATION_DETAILS_RETRIEVED,
  // },
};

// ── Section updaters ───────────────────────────────────────────────────────
// Each key is a valid :section value for the PUT /updateData/:userId/:section
// endpoint. The handler upserts the respective data for the given userId.

const updateSections = {
  "employment-details": {
    upsert: (userId, data, createdBy) =>
      employmentDetailsService.upsertEmploymentDetails({ userId, data, createdBy }),
    dataKey: "employmentDetails",
    message: MESSAGES.EMPLOYMENT_DETAILS_UPDATED,
  },

  // ── Future update sections go here ───────────────────────────────────────
  // "contact-details": {
  //   upsert: (userId, data, createdBy) =>
  //     contactDetailsService.upsertContactDetails({ userId, data, createdBy }),
  //   dataKey: "contactDetails",
  //   message: MESSAGES.CONTACT_DETAILS_UPDATED,
  // },
};

// ── Controller ───────────────────────────────────────────────────────────────

/**
 * GET /userDetail/:section
 * Dispatches to the right data fetcher based on the :section parameter.
 * The userId is extracted from the JWT token (req.user.userId).
 */
export const getUserDetail = async (req, res, next) => {
  try {
    const { section } = req.params;
    const handler = sections[section];

    if (!handler) {
      return next(
        new ApiError(
          HTTP_STATUS.NOT_FOUND,
          `Unknown section: "${section}". Valid sections: ${Object.keys(sections).join(", ")}`,
        ),
      );
    }

    const userId = req.user.userId;
    const data = await handler.fetch(userId);

    if (!data) {
      return next(
        new ApiError(
          HTTP_STATUS.NOT_FOUND,
          `${handler.dataKey} not found for this user`,
        ),
      );
    }

    sendSuccess(res, HTTP_STATUS.OK, handler.message, {
      [handler.dataKey]: data,
    });
  } catch (err) {
    next(err);
  }
};

// ── Update controller ──────────────────────────────────────────────────────

/**
 * PUT /updateData/:userId/:section
 * Dispatches to the right upserter based on the :section parameter.
 * The userId comes from the URL param (not the JWT token).
 */
export const updateUserDetail = async (req, res, next) => {
  try {
    const { section, userId } = req.params;
    const handler = updateSections[section];

    if (!handler) {
      return next(
        new ApiError(
          HTTP_STATUS.NOT_FOUND,
          `Unknown section: "${section}". Valid sections: ${Object.keys(updateSections).join(", ")}`,
        ),
      );
    }

    const targetUserId = Number(userId);
    if (!Number.isFinite(targetUserId) || targetUserId <= 0) {
      return next(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          `Invalid userId: "${userId}". Must be a positive integer.`,
        ),
      );
    }

    const createdBy = req.user.userId;
    const data = req.body;

    const result = await handler.upsert(targetUserId, data, createdBy);

    sendSuccess(res, HTTP_STATUS.OK, handler.message, {
      [handler.dataKey]: result,
    });
  } catch (err) {
    next(err);
  }
};
