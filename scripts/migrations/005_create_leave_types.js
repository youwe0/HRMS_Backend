//  Migration 005 — Create Leave_Types table

//  Columns:
//  1. Id:             INT IDENTITY(1,1) PRIMARY KEY
//  2. LeaveName:      NVARCHAR(200) NOT NULL
//  3. LeaveCode:      NVARCHAR(50)  NOT NULL
//  4. ApplicableFor:  NVARCHAR(200) NULL
//  5. CreatedBy:      INT NOT NULL (FK → dbo.Users.UserId)
//  6. CreatedAt:      DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
//  7. IsActive:       BIT NOT NULL DEFAULT 1

export const up = async (pool) => {
  const req = pool.request();

  // Check if table already exists
  const tableCheck = await req.query(
    `SELECT 1 FROM sys.tables WHERE name = 'Leave_Types' AND schema_id = SCHEMA_ID('dbo')`,
  );

  if (tableCheck.recordset.length > 0) {
    console.log("dbo.Leave_Types already exists — skipping");
    return;
  }

  await req.batch(`
    CREATE TABLE dbo.Leave_Types (
      Id             INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
      LeaveName      NVARCHAR(200) NOT NULL,
      LeaveCode      NVARCHAR(50)  NOT NULL,
      ApplicableFor  NVARCHAR(200) NULL,
      CreatedBy      INT           NOT NULL,
      CreatedAt      DATETIME2     NOT NULL CONSTRAINT DF_Leave_Types_CreatedAt DEFAULT SYSUTCDATETIME(),
      IsActive       BIT           NOT NULL CONSTRAINT DF_Leave_Types_IsActive DEFAULT 1,
      CONSTRAINT FK_Leave_Types_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES dbo.Users(UserId)
    );
  `);

  console.log("Created dbo.Leave_Types table");
};
