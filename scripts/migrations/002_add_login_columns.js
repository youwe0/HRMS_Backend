/**
 * Migration 002 — Login feature columns + UserId type change
 *
 * Changes:
 *   1. UserId: UNIQUEIDENTIFIER → INT IDENTITY(1,1)  (auto-numbering: 1, 2, 3 …)
 *   2. Role:           NVARCHAR(50), default 'employee'
 *   3. FailedLoginAttempts: INT, default 0
 *   4. LockedUntil:    DATETIME2, nullable
 *
 *  This drops and recreates the UserId column.
 *     If the table already has rows, back them up first.
 */

export const up = async (pool) => {
  const req = pool.request();

  // ── 1. Check current UserId column type 
  const colCheck = await req.query(`
    SELECT t.name AS DATA_TYPE
      FROM sys.columns c
      JOIN sys.types t ON c.system_type_id = t.system_type_id AND c.user_type_id = t.user_type_id
     WHERE c.object_id = OBJECT_ID('dbo.Users')
       AND c.name = 'UserId'
  `);

  if (colCheck.recordset.length === 0) {
    // Table doesn't exist yet — create it fresh with the new schema.
    await req.batch(`
      CREATE TABLE dbo.Users (
        UserId               INT              NOT NULL IDENTITY(1,1) PRIMARY KEY,
        UserName             NVARCHAR(100)    NOT NULL UNIQUE,
        Password             NVARCHAR(255)    NOT NULL,
        Role                 NVARCHAR(50)     NOT NULL CONSTRAINT DF_Users_Role DEFAULT 'employee',
        FailedLoginAttempts  INT              NOT NULL CONSTRAINT DF_Users_FailedLoginAttempts DEFAULT 0,
        LockedUntil          DATETIME2        NULL,
        Created_at           DATETIME2        NOT NULL CONSTRAINT DF_Users_Created_at DEFAULT SYSUTCDATETIME(),
        Created_by           INT              NULL,
        Is_active            BIT              NOT NULL CONSTRAINT DF_Users_Is_active DEFAULT 1
      );
    `);
    console.log("Created dbo.Users with INT UserId");
    return;
  }

  const currentType = colCheck.recordset[0].DATA_TYPE;
  if (currentType === "int") {
    console.log("UserId is already INT — skipping type change");
  } else {
    // ── Drop old PK, drop old column, add INT IDENTITY, re-add PK 
    console.log(`Changing UserId from ${currentType} to INT IDENTITY…`);

    const pkResult = await req.query(`
      SELECT name FROM sys.key_constraints
       WHERE parent_object_id = OBJECT_ID('dbo.Users')
         AND type = 'PK'
    `);
    if (pkResult.recordset.length > 0) {
      await req.batch(
        `ALTER TABLE dbo.Users DROP CONSTRAINT [${pkResult.recordset[0].name}]`,
      );
    }

    // Drop any DEFAULT constraint on UserId
    const dfResult = await req.query(`
      SELECT dc.name
        FROM sys.default_constraints dc
       WHERE dc.parent_object_id = OBJECT_ID('dbo.Users')
         AND dc.parent_column_id = COLUMNPROPERTY(OBJECT_ID('dbo.Users'), 'UserId', 'ColumnId')
    `);
    if (dfResult.recordset.length > 0) {
      await req.batch(
        `ALTER TABLE dbo.Users DROP CONSTRAINT [${dfResult.recordset[0].name}]`,
      );
    }

    // Drop any FK constraints referencing UserId from other tables
    const fkResult = await req.query(`
      SELECT OBJECT_NAME(parent_object_id) AS tbl, name AS fk
        FROM sys.foreign_keys
       WHERE referenced_object_id = OBJECT_ID('dbo.Users')
    `);
    for (const fk of fkResult.recordset) {
      console.log(`  Dropping FK [${fk.fk}] on [${fk.tbl}]`);
      await req.batch(
        `ALTER TABLE [${fk.tbl}] DROP CONSTRAINT [${fk.fk}]`,
      );
    }

    // Drop old column and add new INT IDENTITY column
    await req.batch(`ALTER TABLE dbo.Users DROP COLUMN UserId`);
    await req.batch(`ALTER TABLE dbo.Users ADD UserId INT NOT NULL IDENTITY(1,1)`);
    await req.batch(`ALTER TABLE dbo.Users ADD CONSTRAINT PK_Users PRIMARY KEY (UserId)`);
    console.log("UserId changed to INT IDENTITY(1,1)");
  }

  // ── 2. Add Role column 
  const hasRole = await req.query(`
    SELECT 1 FROM sys.columns
     WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'Role'
  `);
  if (hasRole.recordset.length === 0) {
    await req.batch(`
      ALTER TABLE dbo.Users
        ADD Role NVARCHAR(50) NOT NULL CONSTRAINT DF_Users_Role DEFAULT 'employee'
    `);
    console.log("Added Role column");
  }

  // ── 3. Add FailedLoginAttempts column 
  const hasAttempts = await req.query(`
    SELECT 1 FROM sys.columns
     WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'FailedLoginAttempts'
  `);
  if (hasAttempts.recordset.length === 0) {
    await req.batch(`
      ALTER TABLE dbo.Users
        ADD FailedLoginAttempts INT NOT NULL CONSTRAINT DF_Users_FailedLoginAttempts DEFAULT 0
    `);
    console.log("Added FailedLoginAttempts column");
  }

  // ── 4. Add LockedUntil column 
  const hasLocked = await req.query(`
    SELECT 1 FROM sys.columns
     WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'LockedUntil'
  `);
  if (hasLocked.recordset.length === 0) {
    await req.batch(`ALTER TABLE dbo.Users ADD LockedUntil DATETIME2 NULL`);
    console.log("Added LockedUntil column");
  }
};
