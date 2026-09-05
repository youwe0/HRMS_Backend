import sql from "mssql";
import { getDB } from "../../shared/db/connection.js";
import { buildSqlPagination } from "../../shared/utils/pagination.js";

/**
 * Bulk-sync permissions — inserts new ones and updates existing ones (matched by Code).
 */
export const syncPermissions = async ({ permissions, userId }) => {
  const db = getDB();
  let created = 0;
  let updated = 0;

  for (const perm of permissions) {
    const parentCode =
      perm.parentCode && perm.parentCode.trim() !== ""
        ? perm.parentCode.trim()
        : null;

    const existing = await db
      .request()
      .input("code", sql.VarChar(150), perm.code.trim())
      .query("SELECT Id FROM dbo.Permissions WHERE Code = @code");

    if (existing.recordset.length > 0) {
      await db
        .request()
        .input("code", sql.VarChar(150), perm.code.trim())
        .input("name", sql.VarChar(200), perm.name.trim())
        .input("type", sql.VarChar(20), perm.type)
        .input("module", sql.VarChar(50), perm.module.trim())
        .input("parentCode", sql.VarChar(150), parentCode)
        .input(
          "isActive",
          sql.Bit,
          perm.isActive !== undefined ? perm.isActive : 1,
        )
        .query(
          `UPDATE dbo.Permissions
           SET Name = @name,
               Type = @type,
               Module = @module,
               ParentCode = @parentCode,
               IsActive = @isActive
           WHERE Code = @code`,
        );
      updated++;
    } else {
      await db
        .request()
        .input("code", sql.VarChar(150), perm.code.trim())
        .input("name", sql.VarChar(200), perm.name.trim())
        .input("type", sql.VarChar(20), perm.type)
        .input("module", sql.VarChar(50), perm.module.trim())
        .input("parentCode", sql.VarChar(150), parentCode)
        .input(
          "isActive",
          sql.Bit,
          perm.isActive !== undefined ? perm.isActive : 1,
        )
        .input("createdBy", sql.Int, userId)
        .query(
          `INSERT INTO dbo.Permissions (Code, Name, Type, Module, ParentCode, IsActive, CreatedBy)
           VALUES (@code, @name, @type, @module, @parentCode, @isActive, @createdBy)`,
        );
      created++;
    }
  }

  return { created, updated };
};

/**
 * Create a single permission.
 */
export const createPermission = async ({
  code,
  name,
  type,
  module,
  parentCode,
  isActive = true,
  userId,
}) => {
  const db = getDB();
  const pc =
    parentCode && parentCode.trim() !== "" ? parentCode.trim() : null;

  const result = await db
    .request()
    .input("code", sql.VarChar(150), code.trim())
    .input("name", sql.VarChar(200), name.trim())
    .input("type", sql.VarChar(20), type)
    .input("module", sql.VarChar(50), module.trim())
    .input("parentCode", sql.VarChar(150), pc)
    .input("isActive", sql.Bit, isActive)
    .input("createdBy", sql.Int, userId)
    .query(
      `INSERT INTO dbo.Permissions (Code, Name, Type, Module, ParentCode, IsActive, CreatedBy)
       OUTPUT INSERTED.Id AS id,
              INSERTED.Code AS code,
              INSERTED.Name AS name,
              INSERTED.Type AS type,
              INSERTED.Module AS module,
              INSERTED.ParentCode AS parentCode,
              INSERTED.IsActive AS isActive,
              INSERTED.CreatedAt AS createdAt,
              INSERTED.CreatedBy AS createdBy
       VALUES (@code, @name, @type, @module, @parentCode, @isActive, @createdBy)`,
    );

  return result.recordset[0];
};

/**
 * Update an existing permission by Id.
 */
export const updatePermission = async ({
  id,
  code,
  name,
  type,
  module,
  parentCode,
  isActive,
}) => {
  const db = getDB();
  const pc =
    parentCode && parentCode.trim() !== "" ? parentCode.trim() : null;

  const result = await db
    .request()
    .input("id", sql.Int, id)
    .input("code", sql.VarChar(150), code.trim())
    .input("name", sql.VarChar(200), name.trim())
    .input("type", sql.VarChar(20), type)
    .input("module", sql.VarChar(50), module.trim())
    .input("parentCode", sql.VarChar(150), pc)
    .input("isActive", sql.Bit, isActive)
    .query(
      `UPDATE dbo.Permissions
       SET Code = @code,
           Name = @name,
           Type = @type,
           Module = @module,
           ParentCode = @parentCode,
           IsActive = @isActive
       OUTPUT INSERTED.Id AS id,
              INSERTED.Code AS code,
              INSERTED.Name AS name,
              INSERTED.Type AS type,
              INSERTED.Module AS module,
              INSERTED.ParentCode AS parentCode,
              INSERTED.IsActive AS isActive,
              INSERTED.CreatedAt AS createdAt,
              INSERTED.CreatedBy AS createdBy
       WHERE Id = @id`,
    );

  return result.recordset[0] || null;
};

/**
 * Soft-delete a permission by setting IsActive = 0.
 */
export const deletePermission = async ({ id }) => {
  const db = getDB();
  const result = await db
    .request()
    .input("id", sql.Int, id)
    .query(
      `UPDATE dbo.Permissions
       SET IsActive = 0
       OUTPUT INSERTED.Id AS id,
              INSERTED.Code AS code,
              INSERTED.Name AS name,
              INSERTED.IsActive AS isActive
       WHERE Id = @id`,
    );

  return result.recordset[0] || null;
};

/**
 * Fetch a paginated list of permissions.
 */
export const getAllPermissions = async ({ page, limit }) => {
  const { offset, limit: safeLimit } = buildSqlPagination({ page, limit });
  const db = getDB();

  const [countResult, dataResult] = await Promise.all([
    db.request().query("SELECT COUNT(*) AS total FROM dbo.Permissions"),
    db
      .request()
      .input("offset", offset)
      .input("limit", safeLimit)
      .query(
        `SELECT
           Id AS id,
           Code AS code,
           Name AS name,
           Type AS type,
           Module AS module,
           ParentCode AS parentCode,
           IsActive AS isActive,
           CreatedAt AS createdAt,
           CreatedBy AS createdBy
         FROM dbo.Permissions
         ORDER BY Module, Id
         OFFSET @offset ROWS
         FETCH NEXT @limit ROWS ONLY`,
      ),
  ]);

  const total = countResult.recordset[0].total;

  return { items: dataResult.recordset, total };
};
