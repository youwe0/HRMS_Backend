//  Migration 012 — Create ShiftMaster table
//
//  Columns:
//  1.  Id                            INT           IDENTITY(1,1) PRIMARY KEY
//  2.  ShiftCode                     NVARCHAR(20)  NOT NULL
//  3.  ShiftName                     NVARCHAR(100) NOT NULL
//  4.  ShiftType                     NVARCHAR(20)  NOT NULL DEFAULT 'REGULAR'
//  5.  StartTime                     TIME(7)       NOT NULL
//  6.  EndTime                       TIME(7)       NOT NULL
//  7.  IsOvernight                   BIT           NOT NULL DEFAULT 0
//  8.  TotalShiftHours               DECIMAL(4,2)  NULL
//  9.  TotalBreakTime                DECIMAL(4,2)  NULL
//  10. WorkingHours                  DECIMAL(4,2)  NULL
//  11. GraceInMinutes                INT           NULL
//  12. GraceOutMinutes               INT           NULL
//  13. HalfDayMarkAfterMinutes       INT           NULL
//  14. AbsentMarkAfterMinutes        INT           NULL
//  15. MinHoursForFullDay            DECIMAL(4,2)  NULL
//  16. CheckinWindowBeforeMinutes    INT           NULL
//  17. CheckoutWindowAfterMinutes    INT           NULL
//  18. WeeklyOffDays                 NVARCHAR(100) NULL
//  19. Status                        NVARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
//  20. CreatedBy                     INT           NOT NULL
//  21. CreatedAt                     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
//  22. UpdatedBy                     INT           NULL
//  23. UpdatedAt                     DATETIME2     NULL
//  24. IsActive                      BIT           NOT NULL DEFAULT 1

export const up = async (pool) => {
  const req = pool.request();

  // Check if table already exists
  const tableCheck = await req.query(
    `SELECT 1 FROM sys.tables WHERE name = 'ShiftMaster' AND schema_id = SCHEMA_ID('dbo')`,
  );

  if (tableCheck.recordset.length > 0) {
    console.log("dbo.ShiftMaster already exists — skipping");
    return;
  }

  await req.batch(`
    CREATE TABLE dbo.ShiftMaster (
      Id                          INT            NOT NULL IDENTITY(1,1) PRIMARY KEY,
      ShiftCode                   NVARCHAR(20)   NOT NULL,
      ShiftName                   NVARCHAR(100)  NOT NULL,
      ShiftType                   NVARCHAR(20)   NOT NULL CONSTRAINT DF_ShiftMaster_ShiftType DEFAULT 'REGULAR',
      StartTime                   TIME(7)        NOT NULL,
      EndTime                     TIME(7)        NOT NULL,
      IsOvernight                 BIT            NOT NULL CONSTRAINT DF_ShiftMaster_IsOvernight DEFAULT 0,
      TotalShiftHours             DECIMAL(4,2)   NULL,
      TotalBreakTime              DECIMAL(4,2)   NULL,
      WorkingHours                DECIMAL(4,2)   NULL,
      GraceInMinutes              INT            NULL,
      GraceOutMinutes             INT            NULL,
      HalfDayMarkAfterMinutes     INT            NULL,
      AbsentMarkAfterMinutes      INT            NULL,
      MinHoursForFullDay          DECIMAL(4,2)   NULL,
      CheckinWindowBeforeMinutes  INT            NULL,
      CheckoutWindowAfterMinutes  INT            NULL,
      WeeklyOffDays               NVARCHAR(100)  NULL,
      Status                      NVARCHAR(20)   NOT NULL CONSTRAINT DF_ShiftMaster_Status DEFAULT 'ACTIVE',
      CreatedBy                   INT            NOT NULL,
      CreatedAt                   DATETIME2      NOT NULL CONSTRAINT DF_ShiftMaster_CreatedAt DEFAULT SYSUTCDATETIME(),
      UpdatedBy                   INT            NULL,
      UpdatedAt                   DATETIME2      NULL,
      IsActive                    BIT            NOT NULL CONSTRAINT DF_ShiftMaster_IsActive DEFAULT 1,
      CONSTRAINT FK_ShiftMaster_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES dbo.Users(UserId),
      CONSTRAINT FK_ShiftMaster_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES dbo.Users(UserId)
    );
  `);

  console.log("Created dbo.ShiftMaster table");
};
