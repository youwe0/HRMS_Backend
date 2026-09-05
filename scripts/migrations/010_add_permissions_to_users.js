/**
 * Migration 010 — Add Permissions column to Users table
 *
 * Adds a NVARCHAR(MAX) column named "Permissions" to the Users table.
 * This column stores a JSON array of permission IDs (e.g. "[1, 2, 3]").
 *
 * Columns:
 *   1. Permissions: NVARCHAR(MAX) NULL — JSON array of permission IDs
 */

export const up = async (pool) => {
  const req = pool.request();

  // Check if column already exists
  const columnCheck = await req.query(
    `SELECT 1 FROM sys.columns WHERE name = 'Permissions' AND object_id = OBJECT_ID('dbo.Users')`,
  );

  if (columnCheck.recordset.length > 0) {
    console.log("dbo.Users.Permissions column already exists — skipping");
    return;
  }

  await req.batch(`
    ALTER TABLE dbo.Users
    ADD Permissions NVARCHAR(MAX) NULL;
  `);

  console.log("Added Permissions column to dbo.Users table");
};
