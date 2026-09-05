import sql from "mssql";
import { getDB } from "../../shared/db/connection.js";
import ApiError from "../../shared/utils/ApiError.js";
import { HTTP_STATUS, MESSAGES } from "../../shared/constants/index.js";

/**
 * Assign permissions to a user.
 * @param {number} userId – the target user's ID
 * @param {number[]} permissionIds – array of permission IDs to assign
 * @returns {object} the updated user with permissions
 */
export const assignPermissions = async ({ userId, permissionIds }) => {
  const db = getDB();

  // Build parameterized query to check permission IDs
  const permRequest = db.request();
  permissionIds.forEach((id, i) => {
    permRequest.input(`permId${i}`, sql.Int, id);
  });
  const permCheck = await permRequest.query(
    `SELECT Id, IsActive FROM dbo.Permissions WHERE Id IN (${permissionIds.map((_, i) => `@permId${i}`).join(",")})`
  );

  const foundIds = permCheck.recordset.map((r) => r.Id);
  const activeIds = permCheck.recordset.filter((r) => Number(r.IsActive) === 1).map((r) => r.Id);

  const missingIds = permissionIds.filter((id) => !foundIds.includes(id));
  const inactiveIds = permissionIds.filter((id) => foundIds.includes(id) && !activeIds.includes(id));

  if (missingIds.length > 0) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      MESSAGES.PERMISSION_ID_NOT_FOUND,
      [{ field: "permissions", message: `Permission ID(s) not found: ${missingIds.join(", ")}` }],
    );
  }

  if (inactiveIds.length > 0) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      MESSAGES.PERMISSION_ID_INACTIVE,
      [{ field: "permissions", message: `Permission ID(s) are inactive: ${inactiveIds.join(", ")}` }],
    );
  }

  // Store permissions as JSON array
  const permissionsJson = JSON.stringify(permissionIds);

  const result = await db
    .request()
    .input("userId", sql.Int, userId)
    .input("permissions", sql.NVarChar(sql.MAX), permissionsJson)
    .query(
      `UPDATE dbo.Users
       SET Permissions = @permissions
       OUTPUT INSERTED.UserId AS userId,
              INSERTED.UserName AS userName,
              INSERTED.Permissions AS permissions
       WHERE UserId = @userId`
    );

  if (result.recordset.length === 0) {
    return null;
  }

  const user = result.recordset[0];
  return {
    userId: user.userId,
    userName: user.userName,
    permissions: user.permissions ? JSON.parse(user.permissions) : [],
  };
};

/**
 * Get permissions assigned to a user.
 * @param {number} userId – the target user's ID
 * @returns {object|null} the user with permissions or null if not found
 */
export const getUserPermissions = async ({ userId }) => {
  const db = getDB();

  const result = await db
    .request()
    .input("userId", sql.Int, userId)
    .query(
      `SELECT UserId AS userId, UserName AS userName, Permissions AS permissions
       FROM dbo.Users
       WHERE UserId = @userId`
    );

  if (result.recordset.length === 0) {
    return null;
  }

  const user = result.recordset[0];
  return {
    userId: user.userId,
    userName: user.userName,
    permissions: user.permissions ? JSON.parse(user.permissions) : [],
  };
};

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
