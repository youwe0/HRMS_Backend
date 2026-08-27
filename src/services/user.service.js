import sql from "mssql";
import { getDB } from "../db/connection.js";

/**
 * Search users by userName (LIKE match), returning top 5 results.
 * @param {string} query – the search term (trimmed)
 * @returns {Array<{ userId: number, userName: string }>}
 */
export const searchUsers = async (query) => {
  const db = getDB();
  const searchTerm = `%${query}%`;

  const result = await db
    .request()
    .input("query", sql.NVarChar, searchTerm)
    .query(
      `SELECT TOP 5 UserId AS userId, UserName AS userName
       FROM dbo.Users
       WHERE UserName LIKE @query AND Is_active = 1
       ORDER BY UserName`,
    );

  return result.recordset;
};
