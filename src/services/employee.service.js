import { getDB } from "../db/connection.js";

/**
 * Fetch a paginated list of employees.
 * Returns { employees, total } so the controller can build pagination metadata.
 */
export const getAllEmployees = async ({ page, limit }) => {
  const offset = (page - 1) * limit;
  const db = getDB();

  // Run count query and data query in parallel for performance
  const [countResult, dataResult] = await Promise.all([
    db.request().query("SELECT COUNT(*) AS total FROM dbo.Users"),
    db
      .request()
      .input("offset", offset)
      .input("limit", limit)
      .query(
        `SELECT UserId AS userId, UserName AS userName, Role AS role, Is_active AS isActive
         FROM dbo.Users
         ORDER BY UserId
         OFFSET @offset ROWS
         FETCH NEXT @limit ROWS ONLY`,
      ),
  ]);

  const total = countResult.recordset[0].total;

  return { employees: dataResult.recordset, total };
};
