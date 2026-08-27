import sql from "mssql";
import { getDB } from "../db/connection.js";
import { buildSqlPagination } from "../utils/pagination.js";

/**
 * Create a new designation.
 * @param {Object}  opts
 * @param {string}  opts.designation – designation name (required)
 * @param {boolean} [opts.isActive=true] – whether the designation is active
 * @param {number}  opts.userId      – userId of the creator (from JWT)
 * @returns {Object} created designation record
 */
export const createDesignation = async ({ designation, isActive = true, userId }) => {
  const db = getDB();
  const result = await db
    .request()
    .input("designation", sql.NVarChar(200), designation.trim())
    .input("createdBy", sql.Int, userId)
    .input("isActive", sql.Bit, isActive)
    .query(
      `INSERT INTO dbo.Designations (Designation, CreatedBy, IsActive)
       OUTPUT INSERTED.Id AS id,
              INSERTED.Designation AS designation,
              INSERTED.CreatedAt AS createdAt,
              INSERTED.CreatedBy AS createdBy,
              INSERTED.IsActive AS isActive
       VALUES (@designation, @createdBy, @isActive)`,
    );

  return result.recordset[0];
};

/**
 * Fetch a paginated list of designations.
 * Returns { items, total } so the controller can build pagination metadata.
 */
export const getAllDesignations = async ({ page, limit }) => {
  const { offset, limit: safeLimit } = buildSqlPagination({ page, limit });
  const db = getDB();

  const [countResult, dataResult] = await Promise.all([
    db.request().query("SELECT COUNT(*) AS total FROM dbo.Designations"),
    db
      .request()
      .input("offset", offset)
      .input("limit", safeLimit)
      .query(
        `SELECT Id AS id, Designation AS designation, IsActive AS isActive
         FROM dbo.Designations
         ORDER BY Id
         OFFSET @offset ROWS
         FETCH NEXT @limit ROWS ONLY`,
      ),
  ]);

  const total = countResult.recordset[0].total;

  return { items: dataResult.recordset, total };
};

/**
 * Soft-delete a designation by setting IsActive = 0.
 * @param {number} id – designation ID (required)
 * @returns {Object|null} updated designation record or null if not found
 */
export const deleteDesignation = async ({ id }) => {
  const db = getDB();
  const result = await db
    .request()
    .input("id", sql.Int, id)
    .query(
      `UPDATE dbo.Designations
       SET IsActive = 0
       OUTPUT INSERTED.Id AS id,
              INSERTED.Designation AS designation,
              INSERTED.IsActive AS isActive
       WHERE Id = @id`,
    );

  return result.recordset[0] || null;
};
