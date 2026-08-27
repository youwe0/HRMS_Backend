import { asyncHandler, sendSuccess } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import { designationService } from "../services/index.js";
import { createPaginatedHandler } from "../utils/pagination.js";
import ApiError from "../utils/ApiError.js";

export const createDesignation = asyncHandler(async (req, res) => {
  const designation = await designationService.createDesignation({
    designation: req.body.designation,
    isActive: req.body.isActive,
    userId: req.user.userId,
  });
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.DESIGNATION_CREATED, {
    designation,
  });
});

export const getAllDesignations = createPaginatedHandler(
  (opts) => designationService.getAllDesignations(opts),
  { dataKey: "designations", message: MESSAGES.DESIGNATIONS_RETRIEVED, statusCode: HTTP_STATUS.OK },
);

export const deleteDesignation = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const designation = await designationService.deleteDesignation({ id });
  if (!designation) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND);
  }
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.DESIGNATION_DELETED, {
    designation,
  });
});
