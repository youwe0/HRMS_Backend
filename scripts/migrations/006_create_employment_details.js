/**
 * Migration 006 — Create Employment_details table
 *
 * Columns:
 *   1. Id:             INT IDENTITY(1,1) PRIMARY KEY
 *   2. UserId:         INT NOT NULL (FK → dbo.Users.UserId)
 *   3. EmployeeCode:   NVARCHAR(20) NOT NULL UNIQUE (e.g. "EC001")
 *   4. Department:     NVARCHAR(200) NOT NULL
 *   5. Designation:    NVARCHAR(200) NOT NULL
 *   6. DateOfJoining:  DATE NOT NULL
 *   7. CreatedBy:      INT NOT NULL (FK → dbo.Users.UserId)
 *   8. CreatedAt:      DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
 */

export const up = async (pool) => {
  const req = pool.request();

  // Check if table already exists
  const tableCheck = await req.query(`
    SELECT 1 FROM sys.tables WHERE name = 'Employment_details' AND schema_id = SCHEMA_ID('dbo')
  `);

  if (tableCheck.recordset.length > 0) {
    console.log("dbo.Employment_details already exists — skipping");
    return;
  }

  await req.batch(`
    CREATE TABLE dbo.Employment_details (
      Id             INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
      UserId         INT           NOT NULL,
      EmployeeCode   NVARCHAR(20)  NOT NULL,
      Department     NVARCHAR(200) NOT NULL,
      Designation    NVARCHAR(200) NOT NULL,
      DateOfJoining  DATE          NOT NULL,
      CreatedBy      INT           NOT NULL,
      CreatedAt      DATETIME2     NOT NULL CONSTRAINT DF_Employment_details_CreatedAt DEFAULT SYSUTCDATETIME(),
      CONSTRAINT FK_Employment_details_UserId FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
      CONSTRAINT FK_Employment_details_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES dbo.Users(UserId),
      CONSTRAINT UQ_Employment_details_EmployeeCode UNIQUE (EmployeeCode)
    );
  `);

  console.log("Created dbo.Employment_details table");
};
