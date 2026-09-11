import sql from "mssql";
import { getDB } from "../../shared/db/connection.js";
import { buildSqlPagination } from "../../shared/utils/pagination.js";

export const createAnnouncement = async ({ title, description, type, userId }) => {
  const db = getDB();
  const result = await db
    .request()
    .input("title", sql.NVarChar(200), title.trim())
    .input("description", sql.NVarChar(sql.MAX), description.trim())
    .input("type", sql.NVarChar(100), type.trim())
    .input("userId", sql.Int, userId)
    .query(
      `INSERT INTO dbo.Announcement (MadeBy, Title, Description, Type, CreatedBy)
       OUTPUT INSERTED.Id AS id,
              INSERTED.MadeBy AS madeBy,
              INSERTED.Title AS title,
              INSERTED.Description AS description,
              INSERTED.Type AS type,
              INSERTED.Comments AS comments,
              INSERTED.Likes AS likes,
              INSERTED.Views AS views,
              INSERTED.IsPinned AS isPinned,
              INSERTED.CreatedAt AS createdAt
       VALUES (@userId, @title, @description, @type, @userId)`,
    );

  return result.recordset[0];
};

export const getAnnouncements = async ({ page, limit }) => {
  const { offset, limit: safeLimit } = buildSqlPagination({ page, limit });
  const db = getDB();
  const [countResult, dataResult] = await Promise.all([
    db.request().query("SELECT COUNT(*) AS total FROM dbo.Announcement"),
    db
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, safeLimit)
      .query(
        `SELECT Id AS id,
                MadeBy AS madeBy,
                Title AS title,
                Description AS description,
                Type AS type,
                Comments AS comments,
                Likes AS likes,
                Views AS views,
                IsPinned AS isPinned,
                CreatedAt AS createdAt
         FROM dbo.Announcement
         ORDER BY CreatedAt DESC, Id DESC
         OFFSET @offset ROWS
         FETCH NEXT @limit ROWS ONLY`,
      ),
  ]);

  return { items: dataResult.recordset, total: countResult.recordset[0].total };
};
