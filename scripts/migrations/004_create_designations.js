/**
 * Migration 004 — Create Designations table
 *
 * Columns:
 *   1. Id:          INT IDENTITY(1,1) PRIMARY KEY
 *   2. Designation: NVARCHAR(200) NOT NULL
 *   3. CreatedAt:   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
 *   4. CreatedBy:   INT NOT NULL (FK → dbo.Users.UserId)
 *   5. IsActive:    BIT NOT NULL DEFAULT 1
 */

export const up = async (pool) => {
  const req = pool.request();

  // Check if table already exists
  const tableCheck = await req.query(`
    SELECT 1 FROM sys.tables WHERE name = 'Designations' AND schema_id = SCHEMA_ID('dbo')
  `);

  if (tableCheck.recordset.length > 0) {
    console.log("dbo.Designations already exists — skipping");
    return;
  }

  await req.batch(`
    CREATE TABLE dbo.Designations (
      Id          INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
      Designation NVARCHAR(200) NOT NULL,
      CreatedAt   DATETIME2     NOT NULL CONSTRAINT DF_Designations_CreatedAt DEFAULT SYSUTCDATETIME(),
      CreatedBy   INT           NOT NULL,
      IsActive    BIT           NOT NULL CONSTRAINT DF_Designations_IsActive DEFAULT 1,
      CONSTRAINT FK_Designations_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES dbo.Users(UserId)
    );
  `);

  console.log("Created dbo.Designations table");
};
