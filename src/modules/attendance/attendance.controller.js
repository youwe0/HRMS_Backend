import { HTTP_STATUS, MESSAGES } from "../../shared/constants/index.js";
import * as attendanceService from "./attendance.service.js";
import { sendSuccess } from "../../shared/utils/apiResponse.js";
import ApiError from "../../shared/utils/ApiError.js";

/**
 * POST /attendance/:userId
 * Clock in or clock out for the authenticated user.
 */
export const makeAttendance = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const { clockTime } = req.body;

    const result = await attendanceService.makeAttendance({
      userId,
      clockTime,
      createdBy: req.user.userId,
    });

    if (result.action === "no_employee") {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Employment details not found for this user",
      );
    }

    if (result.action === "completed") {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "Attendance completed, try tomorrow",
      );
    }

    const message =
      result.action === "clock_in"
        ? "Clock-in recorded successfully"
        : "Clock-out recorded successfully";

    sendSuccess(res, HTTP_STATUS.OK, message, {
      attendance: result.record,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /attendance/:userId
 * Get attendance records for a date range.
 * Query params: fromDate, toDate (ISO date strings)
 */
export const getAttendance = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const { fromDate, toDate } = req.query;

    const records = await attendanceService.getAttendanceByDateRange({
      userId,
      fromDate,
      toDate,
    });

    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ATTENDANCE_RETRIEVED, {
      attendance: records,
    });
  } catch (err) {
    next(err);
  }
};
