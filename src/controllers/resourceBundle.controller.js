import { asyncHandler, sendSuccess } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import { Blood_group, Gender, Employee_type } from "../config/generalConfig.js";

/**
 * GET /resource-bundle
 *
 * Returns every lookup group from GeneralConfig in a single response.
 * This endpoint is public — no JWT required.
 */
export const getResourceBundle = asyncHandler(async (_req, res) => {
  const data = { Blood_group, Gender, Employee_type };
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.RESOURCE_BUNDLE_RETRIEVED, data);
});
