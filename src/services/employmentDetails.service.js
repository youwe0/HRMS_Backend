import { getDB } from "../db/connection.js";

/**
 * Fetch employment details for a specific user.
 * @param {number} userId – the user's ID (from JWT token)
 * @returns {Object|null} employment details record or null if not found
 */
export const getEmploymentDetailsByUserId = async ({ userId }) => {
  const db = getDB();
  const result = await db
    .request()
    .input("userId", userId)
    .query(
      `SELECT
         EmployeeCode AS employeeCode,
         Department AS department,
         Designation AS designation,
         DateOfJoining AS dateOfJoining
       FROM dbo.Employment_details
       WHERE UserId = @userId`,
    );

  return result.recordset[0] || null;
};

/**
 * Upsert employment details for a specific user.
 * If a record exists for the userId, update it; otherwise insert a new one.
 * @param {number} userId – the target user's ID (from URL param)
 * @param {Object} data – { employeeCode, department, designation, dateOfJoining }
 * @param {number} createdBy – the authenticated user's ID (from JWT token)
 * @returns {Object} the upserted employment details record
 */
export const upsertEmploymentDetails = async ({ userId, data, createdBy }) => {
  const db = getDB();

  // Check if a record already exists
  const existing = await db
    .request()
    .input("userId", userId)
    .query(
      `SELECT Id FROM dbo.Employment_details WHERE UserId = @userId`,
    );

  if (existing.recordset.length > 0) {
    // Update existing record
    await db
      .request()
      .input("userId", userId)
      .input("employeeCode", data.employeeCode)
      .input("department", data.department)
      .input("designation", data.designation)
      .input("dateOfJoining", data.dateOfJoining)
      .query(
        `UPDATE dbo.Employment_details
         SET EmployeeCode = @employeeCode,
             Department = @department,
             Designation = @designation,
             DateOfJoining = @dateOfJoining
         WHERE UserId = @userId`,
      );
  } else {
    // Insert new record
    await db
      .request()
      .input("userId", userId)
      .input("employeeCode", data.employeeCode)
      .input("department", data.department)
      .input("designation", data.designation)
      .input("dateOfJoining", data.dateOfJoining)
      .input("createdBy", createdBy)
      .query(
        `INSERT INTO dbo.Employment_details
           (UserId, EmployeeCode, Department, Designation, DateOfJoining, CreatedBy)
         VALUES
           (@userId, @employeeCode, @department, @designation, @dateOfJoining, @createdBy)`,
      );
  }

  // Return the upserted record
  return getEmploymentDetailsByUserId({ userId });
};
