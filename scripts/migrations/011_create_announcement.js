/**
 * Migration 011 — Create Announcement table.
 *
 * Comments, Likes, Views, and IsPinned are intentionally nullable until their
 * respective interactions are implemented.
 */
export const up = async (pool) => {
  const request = pool.request();
  const tableCheck = await request.query(
    `SELECT 1 FROM sys.tables WHERE name = 'Announcement' AND schema_id = SCHEMA_ID('dbo')`,
  );

  if (tableCheck.recordset.length > 0) {
    console.log("dbo.Announcement already exists — skipping");
    return;
  }

  await request.batch(`
    CREATE TABLE dbo.Announcement (
      Id          INT            NOT NULL IDENTITY(1,1),
      MadeBy      INT            NOT NULL,
      Title       NVARCHAR(200)  NOT NULL,
      Description NVARCHAR(MAX)  NOT NULL,
      Type        NVARCHAR(100)  NOT NULL,
      Comments    NVARCHAR(MAX)  NULL,
      Likes       INT            NULL,
      Views       INT            NULL,
      IsPinned    BIT            NULL CONSTRAINT DF_Announcement_IsPinned DEFAULT NULL,
      CreatedBy   INT            NOT NULL,
      CreatedAt   DATETIME2      NOT NULL CONSTRAINT DF_Announcement_CreatedAt DEFAULT SYSUTCDATETIME(),

      CONSTRAINT PK_Announcement PRIMARY KEY CLUSTERED (Id),
      CONSTRAINT FK_Announcement_MadeBy FOREIGN KEY (MadeBy) REFERENCES dbo.Users(UserId),
      CONSTRAINT FK_Announcement_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES dbo.Users(UserId)
    );

    CREATE NONCLUSTERED INDEX IX_Announcement_CreatedAt
      ON dbo.Announcement (CreatedAt DESC, Id DESC);
  `);

  console.log("Created dbo.Announcement table");
};
