const migration = `
CREATE TABLE dbo.Users (
  UserId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
  UserName NVARCHAR(100) NOT NULL UNIQUE,
  Password NVARCHAR(100) NOT NULL,
  Created_at DATETIME2 NOT NULL CONSTRAINT DF_Users_Created_at DEFAULT SYSUTCDATETIME(),
  Created_by UNIQUEIDENTIFIER NULL,
  Is_active BIT NOT NULL CONSTRAINT DF_Users_Is_active DEFAULT 1
);
`;

export const up = async (pool) => {
  await pool.request().batch(migration);
};
