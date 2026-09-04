import sql from "mssql";
import { getDB } from "../../shared/db/connection.js";
import { buildSqlPagination } from "../../shared/utils/pagination.js";

/**
 * Create a new leave type.
 * @param {Object}  opts
 * @param {string}  opts.leaveName      – leave name (required)
 * @param {string}  opts.leaveCode      – leave code (required)
 * @param {string}  [opts.applicableFor] – applicable for (optional)
 * @param {number}  opts.userId         – userId of the creator (from JWT)
 * @returns {Object} created leave type record
 */
export const createLeaveType = async ({
  leaveName,
  leaveCode,
  applicableFor = null,
  userId,
}) => {
  const db = getDB();
  const result = await db
    .request()
    .input("leaveName", sql.NVarChar(200), leaveName.trim())
    .input("leaveCode", sql.NVarChar(50), leaveCode.trim())
    .input("applicableFor", sql.NVarChar(200), applicableFor || null)
    .input("createdBy", sql.Int, userId)
    .query(
      `INSERT INTO dbo.Leave_Types (LeaveName, LeaveCode, ApplicableFor, CreatedBy)
       OUTPUT INSERTED.Id AS id,
              INSERTED.LeaveName AS leaveName,
              INSERTED.LeaveCode AS leaveCode,
              INSERTED.ApplicableFor AS applicableFor,
              INSERTED.CreatedBy AS createdBy,
              INSERTED.CreatedAt AS createdAt,
              INSERTED.IsActive AS isActive
       VALUES (@leaveName, @leaveCode, @applicableFor, @createdBy)`,
    );

  return result.recordset[0];
};

/**
 * Fetch a paginated list of leave types.
 * Returns { items, total } so the controller can build pagination metadata.
 */
export const getAllLeaveTypes = async ({ page, limit }) => {
  const { offset, limit: safeLimit } = buildSqlPagination({ page, limit });
  const db = getDB();

  const [countResult, dataResult] = await Promise.all([
    db
      .request()
      .query("SELECT COUNT(*) AS total FROM dbo.Leave_Types WHERE IsActive = 1"),
    db
      .request()
      .input("offset", offset)
      .input("limit", safeLimit)
      .query(
        `SELECT Id AS id, LeaveName AS leaveName, LeaveCode AS leaveCode,
                ApplicableFor AS applicableFor, IsActive AS isActive
         FROM dbo.Leave_Types
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
 * Soft-delete a leave type by setting IsActive = 0.
 * @param {number} id – leave type ID (required)
 * @returns {Object|null} updated record or null if not found
 */
export const deleteLeaveType = async ({ id }) => {
  const db = getDB();
  const result = await db
    .request()
    .input("id", sql.Int, id)
    .query(
      `UPDATE dbo.Leave_Types
       SET IsActive = 0
       OUTPUT INSERTED.Id AS id,
              INSERTED.LeaveName AS leaveName,
              INSERTED.LeaveCode AS leaveCode,
              INSERTED.IsActive AS isActive
       WHERE Id = @id AND IsActive = 1`,
    );

  return result.recordset[0] || null;
};
