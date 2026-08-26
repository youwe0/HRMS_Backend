import sql from "mssql";
import { getDB } from "../db/connection.js";

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
