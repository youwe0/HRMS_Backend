import sql from "mssql";
import { getDB } from "../db/connection.js";
import { buildSqlPagination } from "../utils/pagination.js";

/**
 * Create a new department.
 * @param {Object}  opts
 * @param {string}  opts.department – department name (required)
 * @param {number}  [opts.hod]       – userId of the HOD (optional)
 * @param {boolean} [opts.isActive=true] – whether the department is active
 * @param {number}  opts.userId      – userId of the creator (from JWT)
 * @returns {Object} created department record
 */
export const createDepartment = async ({ department, hod, isActive = true, userId }) => {
  const db = getDB();
  const request = db
    .request()
    .input("department", sql.NVarChar(200), department.trim())
    .input("createdBy", sql.Int, userId)
    .input("isActive", sql.Bit, isActive);

  if (hod !== undefined && hod !== null) {
    request.input("hod", sql.Int, hod);
  }

  const result = await request.query(
    `INSERT INTO dbo.Departments (Department, HOD, CreatedBy, IsActive)
     OUTPUT INSERTED.Id AS id,
            INSERTED.Department AS department,
            INSERTED.HOD AS hod,
            INSERTED.CreatedAt AS createdAt,
            INSERTED.CreatedBy AS createdBy,
            INSERTED.IsActive AS isActive
     VALUES (@department, ${hod !== undefined && hod !== null ? "@hod" : "NULL"}, @createdBy, @isActive)`,
  );

  return result.recordset[0];
};

/**
 * Fetch a paginated list of departments.
 * Returns { items, total } so the controller can build pagination metadata.
 */
export const getAllDepartments = async ({ page, limit }) => {
  const { offset, limit: safeLimit } = buildSqlPagination({ page, limit });
  const db = getDB();

  const [countResult, dataResult] = await Promise.all([
    db.request().query("SELECT COUNT(*) AS total FROM dbo.Departments"),
    db
      .request()
      .input("offset", offset)
      .input("limit", safeLimit)
      .query(
        `SELECT Id AS id, Department AS department, IsActive AS isActive
         FROM dbo.Departments
         ORDER BY Id
         OFFSET @offset ROWS
         FETCH NEXT @limit ROWS ONLY`,
      ),
  ]);

  const total = countResult.recordset[0].total;

  return { items: dataResult.recordset, total };
};

/**
 * Soft-delete a department by setting IsActive = 0.
 * @param {number} id – department ID (required)
 * @returns {Object|null} updated department record or null if not found
 */
export const deleteDepartment = async ({ id }) => {
  const db = getDB();
  const result = await db
    .request()
    .input("id", sql.Int, id)
    .query(
      `UPDATE dbo.Departments
       SET IsActive = 0
       OUTPUT INSERTED.Id AS id,
              INSERTED.Department AS department,
              INSERTED.IsActive AS isActive
       WHERE Id = @id`,
    );

  return result.recordset[0] || null;
};
