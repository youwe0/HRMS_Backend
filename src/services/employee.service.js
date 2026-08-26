import { getDB } from "../db/connection.js";
import { buildSqlPagination } from "../utils/pagination.js";

/**
 * Fetch a paginated list of employees.
 * Returns { items, total } so the controller can build pagination metadata.
 */
export const getAllEmployees = async ({ page, limit }) => {
  const { offset, limit: safeLimit } = buildSqlPagination({ page, limit });
  const db = getDB();

  // Run count query and data query in parallel for performance
  const [countResult, dataResult] = await Promise.all([
    db.request().query("SELECT COUNT(*) AS total FROM dbo.Users"),
    db
      .request()
      .input("offset", offset)
      .input("limit", safeLimit)
      .query(
        `SELECT UserId AS userId, UserName AS userName, Role AS role, Is_active AS isActive
         FROM dbo.Users
         ORDER BY UserId
         OFFSET @offset ROWS
         FETCH NEXT @limit ROWS ONLY`,
      ),
  ]);

  const total = countResult.recordset[0].total;

  return { items: dataResult.recordset, total };
};
