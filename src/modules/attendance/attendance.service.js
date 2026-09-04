import { getDB } from "../../shared/db/connection.js";

/**
 * Build a YYYY-MM-DD date string from a Date object using UTC methods.
 * This avoids timezone-related day mismatches between client and server.
 */
function toDateString(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Make attendance (clock-in / clock-out) for an employee.
 *
 * Logic:
 *   1. Look up EmployeeCode from Employment_details by userId.
 *   2. Check if an attendance record exists for today.
 *   3. If no record → INSERT with ClockIn set, ClockOut NULL.
 *   4. If record exists and ClockOut is NULL → UPDATE ClockOut.
 *   5. If record exists and ClockOut is already set → already completed.
 *
 * @param {number} userId      – the authenticated user's ID (from JWT)
 * @param {string} clockTime   – the ISO timestamp of the clock event
 * @param {number} createdBy   – userId for audit trail (same as userId here)
 * @returns {Object} { action: 'clock_in'|'clock_out'|'completed', record? }
 */
export const makeAttendance = async ({ userId, clockTime, createdBy }) => {
  const db = getDB();

  // 1. Resolve EmployeeCode from Employment_details
  const empResult = await db
    .request()
    .input("userId", userId)
    .query(
      `SELECT EmployeeCode FROM dbo.Employment_details WHERE UserId = @userId`,
    );

  if (empResult.recordset.length === 0) {
    return { action: "no_employee", record: null };
  }

  const employeeCode = empResult.recordset[0].EmployeeCode;

  // Parse clockTime — use UTC methods to avoid timezone day-shift
  const clockDate = new Date(clockTime);
  const dateStr = toDateString(clockDate); // "YYYY-MM-DD" in UTC
  // Full datetime for ClockIn/ClockOut columns (pass as-is to SQL)
  const clockDateTime = clockDate;

  // 2. Check existing record for today
  const existingResult = await db
    .request()
    .input("employeeCode", employeeCode)
    .input("attendanceDate", dateStr)
    .query(
      `SELECT EmployeeCode, ClockIn, ClockOut, Status
       FROM dbo.Attendance
       WHERE EmployeeCode = @employeeCode AND AttendanceDate = @attendanceDate`,
    );

  if (existingResult.recordset.length === 0) {
    // 3. No record today → INSERT clock-in
    try {
      const insertResult = await db
        .request()
        .input("employeeCode", employeeCode)
        .input("clockIn", clockDateTime)
        .input("attendanceDate", dateStr)
        .input("createdBy", createdBy)
        .query(
          `INSERT INTO dbo.Attendance
             (EmployeeCode, AttendanceDate, ClockIn, CreatedBy)
           OUTPUT INSERTED.EmployeeCode AS employeeCode,
                  INSERTED.AttendanceDate AS attendanceDate,
                  INSERTED.ClockIn AS clockIn,
                  INSERTED.ClockOut AS clockOut,
                  INSERTED.Status AS status
           VALUES (@employeeCode, @attendanceDate, @clockIn, @createdBy)`,
        );

      return { action: "clock_in", record: insertResult.recordset[0] };
    } catch (insertErr) {
      // Handle race condition: PK violation (2627) means another request
      // inserted the same record between our SELECT and INSERT.
      if (insertErr.code === 2627 || insertErr.code === 2601) {
        // Re-fetch the existing record and determine the correct action
        const retryResult = await db
          .request()
          .input("employeeCode", employeeCode)
          .input("attendanceDate", dateStr)
          .query(
            `SELECT EmployeeCode, ClockIn, ClockOut, Status
             FROM dbo.Attendance
             WHERE EmployeeCode = @employeeCode AND AttendanceDate = @attendanceDate`,
          );
        const existing = retryResult.recordset[0];
        if (existing && existing.ClockIn && existing.ClockOut) {
          return { action: "completed", record: existing };
        }
        if (existing && existing.ClockIn && !existing.ClockOut) {
          return { action: "clock_out_needed", record: existing };
        }
        // Shouldn't happen, but rethrow if still broken
        throw insertErr;
      }
      throw insertErr;
    }
  }

  const existing = existingResult.recordset[0];

  // 5. Already has clock-in and clock-out → completed
  if (existing.ClockIn && existing.ClockOut) {
    return { action: "completed", record: existing };
  }

  // 4. Has clock-in but no clock-out → UPDATE clock-out
  const updateResult = await db
    .request()
    .input("employeeCode", employeeCode)
    .input("clockOut", clockDateTime)
    .input("attendanceDate", dateStr)
    .input("updatedBy", createdBy)
    .query(
      `UPDATE dbo.Attendance
       SET ClockOut = @clockOut,
           UpdatedAt = SYSUTCDATETIME(),
           UpdatedBy = @updatedBy
       OUTPUT INSERTED.EmployeeCode AS employeeCode,
              INSERTED.AttendanceDate AS attendanceDate,
              INSERTED.ClockIn AS clockIn,
              INSERTED.ClockOut AS clockOut,
              INSERTED.Status AS status
       WHERE EmployeeCode = @employeeCode
         AND AttendanceDate = @attendanceDate
         AND ClockOut IS NULL`,
    );

  return { action: "clock_out", record: updateResult.recordset[0] };
};

/**
 * Get attendance records for an employee within a date range.
 *
 * @param {number} userId    – the user's ID
 * @param {string} fromDate  – start date (YYYY-MM-DD)
 * @param {string} toDate    – end date (YYYY-MM-DD)
 * @returns {Array} list of attendance records
 */
export const getAttendanceByDateRange = async ({ userId, fromDate, toDate }) => {
  const db = getDB();

  // Resolve EmployeeCode
  const empResult = await db
    .request()
    .input("userId", userId)
    .query(
      `SELECT EmployeeCode FROM dbo.Employment_details WHERE UserId = @userId`,
    );

  if (empResult.recordset.length === 0) {
    return [];
  }

  const employeeCode = empResult.recordset[0].EmployeeCode;

  const result = await db
    .request()
    .input("employeeCode", employeeCode)
    .input("fromDate", fromDate)
    .input("toDate", toDate)
    .query(
      `SELECT EmployeeCode AS employeeCode,
              AttendanceDate AS attendanceDate,
              Shift AS shift,
              ClockIn AS clockIn,
              ClockOut AS clockOut,
              Status AS status,
              IsActive AS isActive,
              CreatedAt AS createdAt
       FROM dbo.Attendance
       WHERE EmployeeCode = @employeeCode
         AND AttendanceDate >= @fromDate
         AND AttendanceDate <= @toDate
       ORDER BY AttendanceDate DESC`,
    );

  return result.recordset;
};
