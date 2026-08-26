/**
 * Migration 003 — Create Departments table
 *
 * Columns:
 *   1. Id:         INT IDENTITY(1,1) PRIMARY KEY
 *   2. Department: NVARCHAR(200) NOT NULL
 *   3. HOD:        INT NULL (FK → dbo.Users.UserId)
 *   4. CreatedAt:  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
 *   5. CreatedBy:  INT NOT NULL (FK → dbo.Users.UserId)
 *   6. IsActive:   BIT NOT NULL DEFAULT 1
 */

export const up = async (pool) => {
  const req = pool.request();

  // Check if table already exists
  const tableCheck = await req.query(`
    SELECT 1 FROM sys.tables WHERE name = 'Departments' AND schema_id = SCHEMA_ID('dbo')
  `);

  if (tableCheck.recordset.length > 0) {
    console.log("dbo.Departments already exists — skipping");
    return;
  }

  await req.batch(`
    CREATE TABLE dbo.Departments (
      Id          INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
      Department  NVARCHAR(200) NOT NULL,
      HOD         INT           NULL,
      CreatedAt   DATETIME2     NOT NULL CONSTRAINT DF_Departments_CreatedAt DEFAULT SYSUTCDATETIME(),
      CreatedBy   INT           NOT NULL,
      IsActive    BIT           NOT NULL CONSTRAINT DF_Departments_IsActive DEFAULT 1,
      CONSTRAINT FK_Departments_HOD FOREIGN KEY (HOD) REFERENCES dbo.Users(UserId),
      CONSTRAINT FK_Departments_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES dbo.Users(UserId)
    );
  `);

  console.log("Created dbo.Departments table");
};
