import sql from "mssql";
import { getDB } from "../../shared/db/connection.js";

/**
 * Search users by userName (LIKE match), returning top 5 results.
 * @param {string} query – the search term (trimmed)
 * @returns {Array<{ userId: number, userName: string }>}
 */
const searchUsersByName = async (query) => {
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

/**
 * Search departments by Department name (LIKE match), returning top 5 results.
 * @param {string} query – the search term (trimmed)
 * @returns {Array<{ id: number, department: string }>}
 */
const searchDepartmentsByName = async (query) => {
  const db = getDB();
  const searchTerm = `%${query}%`;

  const result = await db
    .request()
    .input("query", sql.NVarChar, searchTerm)
    .query(
      `SELECT TOP 5 Id AS id, Department AS department
       FROM dbo.Departments
       WHERE Department LIKE @query AND IsActive = 1
       ORDER BY Department`,
    );

  return result.recordset;
};

/**
 * Search designations by Designation title (LIKE match), returning top 5 results.
 * @param {string} query – the search term (trimmed)
 * @returns {Array<{ id: number, designation: string }>}
 */
const searchDesignationsByTitle = async (query) => {
  const db = getDB();
  const searchTerm = `%${query}%`;

  const result = await db
    .request()
    .input("query", sql.NVarChar, searchTerm)
    .query(
      `SELECT TOP 5 Id AS id, Designation AS designation
       FROM dbo.Designations
       WHERE Designation LIKE @query AND IsActive = 1
       ORDER BY Designation`,
    );

  return result.recordset;
};

/**
 * Unified search dispatcher. Returns a consistent `{ results, users }` shape.
 * @param {string} query – the search term (trimmed)
 * @param {string} searchFor – one of "user" | "department" | "designation"
 * @returns {{ results: Array<{ id: number, label: string, sublabel?: string }>, users: Array<{ userId: number, userName: string }> }}
 */
export const searchUsers = async (query, searchFor = "user") => {
  if (searchFor === "department") {
    const departments = await searchDepartmentsByName(query);
    const results = departments.map((d) => ({
      id: d.id,
      label: d.department,
    }));
    return { results, users: [] };
  }

  if (searchFor === "designation") {
    const designations = await searchDesignationsByTitle(query);
    const results = designations.map((d) => ({
      id: d.id,
      label: d.designation,
    }));
    return { results, users: [] };
  }

  // Default: user search (backward-compatible)
  const users = await searchUsersByName(query);
  const results = users.map((u) => ({
    id: u.userId,
    label: u.userName,
  }));
  return { results, users };
};
