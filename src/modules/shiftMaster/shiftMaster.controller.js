import { asyncHandler, sendSuccess } from "../../shared/utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../../shared/constants/index.js";
import * as shiftMasterService from "./shiftMaster.service.js";
import { createPaginatedHandler } from "../../shared/utils/pagination.js";
import ApiError from "../../shared/utils/ApiError.js";

export const createShift = asyncHandler(async (req, res) => {
  const shift = await shiftMasterService.createShift({
    shiftCode: req.body.shiftCode,
    shiftName: req.body.shiftName,
    shiftType: req.body.shiftType,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    isOvernight: req.body.isOvernight,
    totalShiftHours: req.body.totalShiftHours,
    totalBreakTime: req.body.totalBreakTime,
    workingHours: req.body.workingHours,
    graceInMinutes: req.body.graceInMinutes,
    graceOutMinutes: req.body.graceOutMinutes,
    halfDayMarkAfterMinutes: req.body.halfDayMarkAfterMinutes,
    absentMarkAfterMinutes: req.body.absentMarkAfterMinutes,
    minHoursForFullDay: req.body.minHoursForFullDay,
    checkinWindowBeforeMinutes: req.body.checkinWindowBeforeMinutes,
    checkoutWindowAfterMinutes: req.body.checkoutWindowAfterMinutes,
    weeklyOffDays: req.body.weeklyOffDays,
    status: req.body.status,
    userId: req.user.userId,
  });
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.SHIFT_CREATED, { shift });
});

export const getAllShifts = createPaginatedHandler(
  (opts) => shiftMasterService.getAllShifts(opts),
  {
    dataKey: "shifts",
    message: MESSAGES.SHIFTS_RETRIEVED,
    statusCode: HTTP_STATUS.OK,
  },
);

export const updateShift = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const shift = await shiftMasterService.updateShift({
    id,
    fields: req.body,
    userId: req.user.userId,
  });
  if (!shift) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND);
  }
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SHIFT_UPDATED, { shift });
});

export const deleteShift = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const shift = await shiftMasterService.deleteShift({ id });
  if (!shift) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND);
  }
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SHIFT_DELETED, { shift });
});
