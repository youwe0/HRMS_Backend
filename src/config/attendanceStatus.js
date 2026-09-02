//   Attendance Status — valid values for the Status field.
//
//   The application layer must validate "status" against this file
//   before insert/update. Do NOT hardcode status values elsewhere.

export const ATTENDANCE_STATUS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  HALF_DAY: "Half Day",
  ON_LEAVE: "On Leave",
  HOLIDAY: "Holiday",
  WORK_FROM_HOME: "Work From Home",
  LATE: "Late",
  EARLY_LEAVE: "Early Leave",
};

/** Flat array of all valid status values for Joi .valid() usage. */
export const ATTENDANCE_STATUS_VALUES = Object.values(ATTENDANCE_STATUS);
