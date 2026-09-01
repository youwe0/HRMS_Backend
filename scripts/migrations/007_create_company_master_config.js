/**
 * Migration 007 — Create CompanyMasterConfig table
 *
 * Columns:
 *   1. Id:         INT IDENTITY(1,1) PRIMARY KEY
 *   2. Module:     NVARCHAR(200) NOT NULL
 *   3. BasedOn:    NVARCHAR(200) NOT NULL
 *   4. CreatedBy:  INT NOT NULL (FK → dbo.Users.UserId)
 *   5. CreatedAt:  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
 *   6. IsActive:   BIT NOT NULL DEFAULT 1
 */

export const up = async (pool) => {
  const req = pool.request();

  // Check if table already exists
  const tableCheck = await req.query(`
    SELECT 1 FROM sys.tables WHERE name = 'CompanyMasterConfig' AND schema_id = SCHEMA_ID('dbo')
  `);

  if (tableCheck.recordset.length > 0) {
    console.log("dbo.CompanyMasterConfig already exists — skipping");
    return;
  }

  await req.batch(`
    CREATE TABLE dbo.CompanyMasterConfig (
      Id          INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
      Module      NVARCHAR(200) NOT NULL,
      BasedOn     NVARCHAR(200) NOT NULL,
      CreatedBy   INT           NOT NULL,
      CreatedAt   DATETIME2     NOT NULL CONSTRAINT DF_CompanyMasterConfig_CreatedAt DEFAULT SYSUTCDATETIME(),
      IsActive    BIT           NOT NULL CONSTRAINT DF_CompanyMasterConfig_IsActive DEFAULT 1,
      CONSTRAINT FK_CompanyMasterConfig_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES dbo.Users(UserId)
    );
  `);

  console.log("Created dbo.CompanyMasterConfig table");
};
