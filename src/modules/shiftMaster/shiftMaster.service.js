import sql from "mssql";
import { getDB } from "../../shared/db/connection.js";
import { buildSqlPagination } from "../../shared/utils/pagination.js";

/**
 * Convert an "HH:MM" or "HH:MM:SS" time string to a Date object
 * that mssql's sql.Time type accepts.
 * Uses a fixed dummy date (1970-01-01) — only the time portion matters.
 */
function timeStringToDate(timeStr) {
  if (!timeStr) return null;
  const parts = String(timeStr).split(":");
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  const s = parseInt(parts[2], 10) || 0;
  return new Date(1970, 0, 1, h, m, s);
}

/**
 * Create a new shift.
 * @param {Object}  opts
 * @param {string}  opts.shiftCode
 * @param {string}  opts.shiftName
 * @param {string}  opts.shiftType
 * @param {string}  opts.startTime
 * @param {string}  opts.endTime
 * @param {boolean} [opts.isOvernight]
 * @param {number}  [opts.totalShiftHours]
 * @param {number}  [opts.totalBreakTime]
 * @param {number}  [opts.workingHours]
 * @param {number}  [opts.graceInMinutes]
 * @param {number}  [opts.graceOutMinutes]
 * @param {number}  [opts.halfDayMarkAfterMinutes]
 * @param {number}  [opts.absentMarkAfterMinutes]
 * @param {number}  [opts.minHoursForFullDay]
 * @param {number}  [opts.checkinWindowBeforeMinutes]
 * @param {number}  [opts.checkoutWindowAfterMinutes]
 * @param {string}  [opts.weeklyOffDays]
 * @param {string}  [opts.status]
 * @param {number}  opts.userId
 * @returns {Object} created shift record
 */
export const createShift = async (opts) => {
  const db = getDB();
  const request = db
    .request()
    .input("shiftCode", sql.NVarChar(20), opts.shiftCode.trim())
    .input("shiftName", sql.NVarChar(100), opts.shiftName.trim())
    .input("shiftType", sql.NVarChar(20), opts.shiftType || "REGULAR")
    .input("startTime", sql.Time, timeStringToDate(opts.startTime))
    .input("endTime", sql.Time, timeStringToDate(opts.endTime))
    .input("isOvernight", sql.Bit, opts.isOvernight ? 1 : 0)
    .input("totalShiftHours", sql.Decimal(4, 2), opts.totalShiftHours ?? null)
    .input("totalBreakTime", sql.Decimal(4, 2), opts.totalBreakTime ?? null)
    .input("workingHours", sql.Decimal(4, 2), opts.workingHours ?? null)
    .input("graceInMinutes", sql.Int, opts.graceInMinutes ?? null)
    .input("graceOutMinutes", sql.Int, opts.graceOutMinutes ?? null)
    .input("halfDayMarkAfterMinutes", sql.Int, opts.halfDayMarkAfterMinutes ?? null)
    .input("absentMarkAfterMinutes", sql.Int, opts.absentMarkAfterMinutes ?? null)
    .input("minHoursForFullDay", sql.Decimal(4, 2), opts.minHoursForFullDay ?? null)
    .input("checkinWindowBeforeMinutes", sql.Int, opts.checkinWindowBeforeMinutes ?? null)
    .input("checkoutWindowAfterMinutes", sql.Int, opts.checkoutWindowAfterMinutes ?? null)
    .input("weeklyOffDays", sql.NVarChar(100), opts.weeklyOffDays || null)
    .input("status", sql.NVarChar(20), opts.status || "ACTIVE")
    .input("createdBy", sql.Int, opts.userId);

  const result = await request.query(`
    INSERT INTO dbo.ShiftMaster (
      ShiftCode, ShiftName, ShiftType, StartTime, EndTime, IsOvernight,
      TotalShiftHours, TotalBreakTime, WorkingHours,
      GraceInMinutes, GraceOutMinutes, HalfDayMarkAfterMinutes, AbsentMarkAfterMinutes,
      MinHoursForFullDay, CheckinWindowBeforeMinutes, CheckoutWindowAfterMinutes,
      WeeklyOffDays, Status, CreatedBy
    )
    OUTPUT
      INSERTED.Id AS id,
      INSERTED.ShiftCode AS shiftCode,
      INSERTED.ShiftName AS shiftName,
      INSERTED.ShiftType AS shiftType,
      INSERTED.StartTime AS startTime,
      INSERTED.EndTime AS endTime,
      INSERTED.IsOvernight AS isOvernight,
      INSERTED.TotalShiftHours AS totalShiftHours,
      INSERTED.TotalBreakTime AS totalBreakTime,
      INSERTED.WorkingHours AS workingHours,
      INSERTED.GraceInMinutes AS graceInMinutes,
      INSERTED.GraceOutMinutes AS graceOutMinutes,
      INSERTED.HalfDayMarkAfterMinutes AS halfDayMarkAfterMinutes,
      INSERTED.AbsentMarkAfterMinutes AS absentMarkAfterMinutes,
      INSERTED.MinHoursForFullDay AS minHoursForFullDay,
      INSERTED.CheckinWindowBeforeMinutes AS checkinWindowBeforeMinutes,
      INSERTED.CheckoutWindowAfterMinutes AS checkoutWindowAfterMinutes,
      INSERTED.WeeklyOffDays AS weeklyOffDays,
      INSERTED.Status AS status,
      INSERTED.CreatedBy AS createdBy,
      INSERTED.CreatedAt AS createdAt,
      INSERTED.IsActive AS isActive
    VALUES (
      @shiftCode, @shiftName, @shiftType, @startTime, @endTime, @isOvernight,
      @totalShiftHours, @totalBreakTime, @workingHours,
      @graceInMinutes, @graceOutMinutes, @halfDayMarkAfterMinutes, @absentMarkAfterMinutes,
      @minHoursForFullDay, @checkinWindowBeforeMinutes, @checkoutWindowAfterMinutes,
      @weeklyOffDays, @status, @createdBy
    )
  `);

  return result.recordset[0];
};

/**
 * Fetch a paginated list of shifts.
 * @param {Object} opts
 * @param {number} opts.page
 * @param {number} opts.limit
 * @returns {{ items: Object[], total: number }}
 */
export const getAllShifts = async ({ page, limit }) => {
  const { offset, limit: safeLimit } = buildSqlPagination({ page, limit });
  const db = getDB();

  const [countResult, dataResult] = await Promise.all([
    db
      .request()
      .query("SELECT COUNT(*) AS total FROM dbo.ShiftMaster WHERE IsActive = 1"),
    db
      .request()
      .input("offset", offset)
      .input("limit", safeLimit)
      .query(
        `SELECT
          Id AS id,
          ShiftCode AS shiftCode,
          ShiftName AS shiftName,
          ShiftType AS shiftType,
          StartTime AS startTime,
          EndTime AS endTime,
          IsOvernight AS isOvernight,
          TotalShiftHours AS totalShiftHours,
          TotalBreakTime AS totalBreakTime,
          WorkingHours AS workingHours,
          GraceInMinutes AS graceInMinutes,
          GraceOutMinutes AS graceOutMinutes,
          HalfDayMarkAfterMinutes AS halfDayMarkAfterMinutes,
          AbsentMarkAfterMinutes AS absentMarkAfterMinutes,
          MinHoursForFullDay AS minHoursForFullDay,
          CheckinWindowBeforeMinutes AS checkinWindowBeforeMinutes,
          CheckoutWindowAfterMinutes AS checkoutWindowAfterMinutes,
          WeeklyOffDays AS weeklyOffDays,
          Status AS status,
          CreatedBy AS createdBy,
          CreatedAt AS createdAt,
          IsActive AS isActive
        FROM dbo.ShiftMaster
        WHERE IsActive = 1
        ORDER BY Id
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY`,
      ),
  ]);

  const total = countResult.recordset[0].total;

  return { items: dataResult.recordset, total };
};

/**
 * Update an existing shift by ID.
 * @param {Object} opts
 * @param {number} opts.id
 * @param {Object} opts.fields – fields to update
 * @param {number} opts.userId – updater's userId
 * @returns {Object|null} updated shift record or null if not found
 */
export const updateShift = async ({ id, fields, userId }) => {
  const db = getDB();
  const request = db.request().input("id", sql.Int, id);

  // Build SET clause dynamically from provided fields
  const setClauses = [];
  const fieldMap = {
    shiftCode: { sql: sql.NVarChar(20), column: "ShiftCode" },
    shiftName: { sql: sql.NVarChar(100), column: "ShiftName" },
    shiftType: { sql: sql.NVarChar(20), column: "ShiftType" },
    startTime: { sql: sql.Time, column: "StartTime", transform: timeStringToDate },
    endTime: { sql: sql.Time, column: "EndTime", transform: timeStringToDate },
    isOvernight: { sql: sql.Bit, column: "IsOvernight" },
    totalShiftHours: { sql: sql.Decimal(4, 2), column: "TotalShiftHours" },
    totalBreakTime: { sql: sql.Decimal(4, 2), column: "TotalBreakTime" },
    workingHours: { sql: sql.Decimal(4, 2), column: "WorkingHours" },
    graceInMinutes: { sql: sql.Int, column: "GraceInMinutes" },
    graceOutMinutes: { sql: sql.Int, column: "GraceOutMinutes" },
    halfDayMarkAfterMinutes: { sql: sql.Int, column: "HalfDayMarkAfterMinutes" },
    absentMarkAfterMinutes: { sql: sql.Int, column: "AbsentMarkAfterMinutes" },
    minHoursForFullDay: { sql: sql.Decimal(4, 2), column: "MinHoursForFullDay" },
    checkinWindowBeforeMinutes: { sql: sql.Int, column: "CheckinWindowBeforeMinutes" },
    checkoutWindowAfterMinutes: { sql: sql.Int, column: "CheckoutWindowAfterMinutes" },
    weeklyOffDays: { sql: sql.NVarChar(100), column: "WeeklyOffDays" },
    status: { sql: sql.NVarChar(20), column: "Status" },
  };

  for (const [key, value] of Object.entries(fields)) {
    if (key in fieldMap) {
      const { sql: sqlType, column, transform } = fieldMap[key];
      const paramName = `p_${key}`;
      const finalValue = transform ? transform(value) : (value ?? null);
      request.input(paramName, sqlType, finalValue);
      setClauses.push(`${column} = @${paramName}`);
    }
  }

  // Always set UpdatedBy and UpdatedAt
  request.input("updatedBy", sql.Int, userId);
  setClauses.push("UpdatedBy = @updatedBy");
  setClauses.push("UpdatedAt = SYSUTCDATETIME()");

  if (setClauses.length === 0) return null;

  const result = await request.query(`
    UPDATE dbo.ShiftMaster
    SET ${setClauses.join(", ")}
    OUTPUT
      INSERTED.Id AS id,
      INSERTED.ShiftCode AS shiftCode,
      INSERTED.ShiftName AS shiftName,
      INSERTED.ShiftType AS shiftType,
      INSERTED.StartTime AS startTime,
      INSERTED.EndTime AS endTime,
      INSERTED.IsOvernight AS isOvernight,
      INSERTED.TotalShiftHours AS totalShiftHours,
      INSERTED.TotalBreakTime AS totalBreakTime,
      INSERTED.WorkingHours AS workingHours,
      INSERTED.GraceInMinutes AS graceInMinutes,
      INSERTED.GraceOutMinutes AS graceOutMinutes,
      INSERTED.HalfDayMarkAfterMinutes AS halfDayMarkAfterMinutes,
      INSERTED.AbsentMarkAfterMinutes AS absentMarkAfterMinutes,
      INSERTED.MinHoursForFullDay AS minHoursForFullDay,
      INSERTED.CheckinWindowBeforeMinutes AS checkinWindowBeforeMinutes,
      INSERTED.CheckoutWindowAfterMinutes AS checkoutWindowAfterMinutes,
      INSERTED.WeeklyOffDays AS weeklyOffDays,
      INSERTED.Status AS status,
      INSERTED.UpdatedBy AS updatedBy,
      INSERTED.UpdatedAt AS updatedAt,
      INSERTED.IsActive AS isActive
    WHERE Id = @id
  `);

  return result.recordset[0] || null;
};

/**
 * Soft-delete a shift by setting IsActive = 0.
 * @param {number} id – shift ID
 * @returns {Object|null} updated record or null if not found
 */
export const deleteShift = async ({ id }) => {
  const db = getDB();
  const result = await db
    .request()
    .input("id", sql.Int, id)
    .query(
      `UPDATE dbo.ShiftMaster
       SET IsActive = 0, Status = 'INACTIVE'
       OUTPUT
         INSERTED.Id AS id,
         INSERTED.ShiftCode AS shiftCode,
         INSERTED.ShiftName AS shiftName,
         INSERTED.IsActive AS isActive
       WHERE Id = @id AND IsActive = 1`,
    );

  return result.recordset[0] || null;
};
