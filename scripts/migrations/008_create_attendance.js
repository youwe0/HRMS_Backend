/**
 * Migration 008 — Create Attendance table
 *
 * Columns:
 *   1. EmployeeCode:   NVARCHAR(20) NOT NULL — part of composite PK
 *   2. Shift:          NVARCHAR(50) NULL — shift name, NULL by default
 *   3. AttendanceDate: DATE NOT NULL — part of composite PK, defaults to current date
 *   4. ClockIn:        DATETIME2 NULL — clock-in timestamp (same date as AttendanceDate)
 *   5. ClockOut:       DATETIME2 NULL — clock-out timestamp (same date as AttendanceDate)
 *   6. Status:         NVARCHAR(50) NULL — validated against attendanceStatus config
 *   7. IsActive:       BIT NOT NULL DEFAULT 1 — soft-delete flag
 *   8. UpdatedAt:      DATETIME2 NULL — set explicitly on update only
 *   9. UpdatedBy:      INT NULL — userId of person who last updated
 *  10. CreatedBy:      INT NOT NULL — userId of the creator
 *  11. CreatedAt:      DATETIME2 NOT NULL — UTC timestamp of creation
 *
 * Primary Key: Composite on (EmployeeCode, AttendanceDate)
 * Indexes:
 *   - IX_Attendance_AttendanceDate — on AttendanceDate alone
 *   - IX_Attendance_IsActive — on IsActive
 */

export const up = async (pool) => {
  const req = pool.request();

  // Check if table already exists
  const tableCheck = await req.query(
    `SELECT 1 FROM sys.tables WHERE name = 'Attendance' AND schema_id = SCHEMA_ID('dbo')`,
  );

  if (tableCheck.recordset.length > 0) {
    console.log("dbo.Attendance already exists — skipping");
    return;
  }

  await req.batch(`
    CREATE TABLE dbo.Attendance (
      EmployeeCode    NVARCHAR(20)  NOT NULL,
      Shift           NVARCHAR(50)  NULL,
      AttendanceDate  DATE          NOT NULL CONSTRAINT DF_Attendance_AttendanceDate DEFAULT CAST(SYSUTCDATETIME() AS DATE),
      ClockIn         DATETIME2     NULL,
      ClockOut        DATETIME2     NULL,
      Status          NVARCHAR(50)  NULL,
      IsActive        BIT           NOT NULL CONSTRAINT DF_Attendance_IsActive DEFAULT 1,
      UpdatedAt       DATETIME2     NULL,
      UpdatedBy       INT           NULL,
      CreatedBy       INT           NOT NULL,
      CreatedAt       DATETIME2     NOT NULL CONSTRAINT DF_Attendance_CreatedAt DEFAULT SYSUTCDATETIME(),

      CONSTRAINT PK_Attendance PRIMARY KEY CLUSTERED (EmployeeCode, AttendanceDate),
      CONSTRAINT FK_Attendance_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES dbo.Users(UserId),
      CONSTRAINT FK_Attendance_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES dbo.Users(UserId)
    );
  `);

  // Secondary index on AttendanceDate for "all employees on a given date" queries
  await req.batch(`
    CREATE NONCLUSTERED INDEX IX_Attendance_AttendanceDate
      ON dbo.Attendance (AttendanceDate);
  `);

  // Secondary index on IsActive for filtering active/inactive records
  await req.batch(`
    CREATE NONCLUSTERED INDEX IX_Attendance_IsActive
      ON dbo.Attendance (IsActive);
  `);

  console.log("Created dbo.Attendance table with indexes");
};
