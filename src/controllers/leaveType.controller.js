import { asyncHandler, sendSuccess } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import { leaveTypeService } from "../services/index.js";
import { createPaginatedHandler } from "../utils/pagination.js";
import ApiError from "../utils/ApiError.js";

export const createLeaveType = asyncHandler(async (req, res) => {
  const leaveType = await leaveTypeService.createLeaveType({
    leaveName: req.body.leaveName,
    leaveCode: req.body.leaveCode,
    applicableFor: req.body.applicableFor,
    userId: req.user.userId,
  });
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.LEAVE_TYPE_CREATED, {
    leaveType,
  });
});

export const getAllLeaveTypes = createPaginatedHandler(
  (opts) => leaveTypeService.getAllLeaveTypes(opts),
  {
    dataKey: "leaveTypes",
    message: MESSAGES.LEAVE_TYPES_RETRIEVED,
    statusCode: HTTP_STATUS.OK,
  },
);

export const deleteLeaveType = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const leaveType = await leaveTypeService.deleteLeaveType({ id });
  if (!leaveType) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND);
  }
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.LEAVE_TYPE_DELETED, {
    leaveType,
  });
});
