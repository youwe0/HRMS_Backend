import sql from "mssql";
import { getDB } from "../db/connection.js";

/**
 * Upsert a CompanyMasterConfig record.
 * If a record with the same Module already exists and is active, update its BasedOn.
 * Otherwise, insert a new record.
 *
 * @param {Object}  opts
 * @param {string}  opts.moduleName  – module name (required)
 * @param {string}  opts.basedOn     – based-on value (required)
 * @param {number}  opts.userId      – userId of the creator (from JWT)
 * @returns {Object} the upserted record
 */
export const upsertCompanyMasterConfig = async ({
  moduleName,
  basedOn,
  userId,
}) => {
  const db = getDB();

  // Check if an active record with this module already exists
  const existing = await db
    .request()
    .input("module", sql.NVarChar(200), moduleName.trim())
    .query(
      `SELECT Id FROM dbo.CompanyMasterConfig WHERE Module = @module AND IsActive = 1`,
    );

  if (existing.recordset.length > 0) {
    // Update existing record
    const id = existing.recordset[0].Id;
    const result = await db
      .request()
      .input("id", sql.Int, id)
      .input("basedOn", sql.NVarChar(200), basedOn.trim())
      .query(
        `UPDATE dbo.CompanyMasterConfig
         SET BasedOn = @basedOn
         OUTPUT INSERTED.Id AS id,
                INSERTED.Module AS moduleName,
                INSERTED.BasedOn AS basedOn,
                INSERTED.CreatedBy AS createdBy,
                INSERTED.CreatedAt AS createdAt,
                INSERTED.IsActive AS isActive
         WHERE Id = @id`,
      );
    return result.recordset[0];
  }

  // Insert new record
  const result = await db
    .request()
    .input("module", sql.NVarChar(200), moduleName.trim())
    .input("basedOn", sql.NVarChar(200), basedOn.trim())
    .input("createdBy", sql.Int, userId)
    .query(
      `INSERT INTO dbo.CompanyMasterConfig (Module, BasedOn, CreatedBy)
       OUTPUT INSERTED.Id AS id,
              INSERTED.Module AS moduleName,
              INSERTED.BasedOn AS basedOn,
              INSERTED.CreatedBy AS createdBy,
              INSERTED.CreatedAt AS createdAt,
              INSERTED.IsActive AS isActive
       VALUES (@module, @basedOn, @createdBy)`,
    );
  return result.recordset[0];
};

/**
 * Get all active CompanyMasterConfig records.
 * @returns {Array} list of config records
 */
export const getAllCompanyMasterConfig = async () => {
  const db = getDB();
  const result = await db.request().query(
    `SELECT Id AS id,
            Module AS moduleName,
            BasedOn AS basedOn,
            CreatedBy AS createdBy,
            CreatedAt AS createdAt,
            IsActive AS isActive
     FROM dbo.CompanyMasterConfig
     WHERE IsActive = 1
     ORDER BY Id`,
  );
  return result.recordset;
};
