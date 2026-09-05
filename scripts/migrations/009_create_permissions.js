/**
 * Migration 009 — Create Permissions table
 *
 * Columns:
 *   1. Id:         INT NOT NULL IDENTITY(1,1) — primary key
 *   2. Code:       VARCHAR(150) NOT NULL — unique permission code (e.g. employees.view)
 *   3. Name:       VARCHAR(200) NOT NULL — human label (e.g. "View Employees")
 *   4. Type:       VARCHAR(20) NOT NULL — one of: module, page, section, button
 *   5. Module:     VARCHAR(50) NOT NULL — top-level grouping (e.g. employees, departments)
 *   6. ParentCode: VARCHAR(150) NULL — self-reference to Code (e.g. button → page)
 *   7. IsActive:   BIT NOT NULL DEFAULT 1 — soft-delete / visibility flag
 *   8. CreatedAt:  DATETIME2 NOT NULL — UTC timestamp of creation
 *   9. CreatedBy:  INT NOT NULL — userId of the creator (FK → Users)
 *
 * Indexes:
 *   - PK_Permissions — clustered primary key on Id
 *   - UQ_Permissions_Code — unique index on Code
 *   - IX_Permissions_Module — nonclustered index on Module
 *   - IX_Permissions_IsActive — nonclustered index on IsActive
 */

export const up = async (pool) => {
  const req = pool.request();

  // Check if table already exists
  const tableCheck = await req.query(
    `SELECT 1 FROM sys.tables WHERE name = 'Permissions' AND schema_id = SCHEMA_ID('dbo')`,
  );

  if (tableCheck.recordset.length > 0) {
    console.log("dbo.Permissions already exists — skipping");
    return;
  }

  await req.batch(`
    CREATE TABLE dbo.Permissions (
      Id          INT            NOT NULL IDENTITY(1,1),
      Code        VARCHAR(150)   NOT NULL,
      Name        VARCHAR(200)   NOT NULL,
      Type        VARCHAR(20)    NOT NULL,
      Module      VARCHAR(50)    NOT NULL,
      ParentCode  VARCHAR(150)   NULL,
      IsActive    BIT            NOT NULL CONSTRAINT DF_Permissions_IsActive DEFAULT 1,
      CreatedAt   DATETIME2      NOT NULL CONSTRAINT DF_Permissions_CreatedAt DEFAULT SYSUTCDATETIME(),
      CreatedBy   INT            NOT NULL,

      CONSTRAINT PK_Permissions PRIMARY KEY CLUSTERED (Id),
      CONSTRAINT UQ_Permissions_Code UNIQUE (Code),
      CONSTRAINT FK_Permissions_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES dbo.Users(UserId)
    );
  `);

  // Index on Module for grouping and filtering
  await req.batch(`
    CREATE NONCLUSTERED INDEX IX_Permissions_Module
      ON dbo.Permissions (Module);
  `);

  // Index on IsActive for filtering active/inactive records
  await req.batch(`
    CREATE NONCLUSTERED INDEX IX_Permissions_IsActive
      ON dbo.Permissions (IsActive);
  `);

  console.log("Created dbo.Permissions table with indexes");
};
