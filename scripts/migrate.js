import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import dotenv from "dotenv";
import sql from "mssql";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "migrations");

const required = ["SQL_SERVER", "SQL_DATABASE", "SQL_USER", "SQL_PASSWORD"];
const missing = required.filter((name) => !process.env[name]);

if (missing.length) {
  console.error(`Migration failed: missing environment variable(s): ${missing.join(", ")}`);
  process.exit(1);
}

const [server, instanceName] = process.env.SQL_SERVER.split("\\", 2);
const poolConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server,
  database: process.env.SQL_DATABASE,
  port: Number.parseInt(process.env.SQL_PORT, 10) || 1433,
  options: {
    encrypt: process.env.SQL_ENCRYPT === "true",
    trustServerCertificate: process.env.SQL_TRUST_SERVER_CERTIFICATE !== "false",
    ...(instanceName ? { instanceName } : {}),
  },
};

const ensureMigrationsTable = (pool) =>
  pool.request().batch(`
    IF OBJECT_ID(N'dbo.Migrations', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.Migrations (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Name NVARCHAR(255) NOT NULL UNIQUE,
        RunAt DATETIME2 NOT NULL CONSTRAINT DF_Migrations_RunAt DEFAULT SYSUTCDATETIME()
      );
    END;
  `);

const run = async () => {
  let pool;
  try {
    pool = await sql.connect(poolConfig);
    await ensureMigrationsTable(pool);

    const appliedResult = await pool.request().query("SELECT Name FROM dbo.Migrations");
    const applied = new Set(appliedResult.recordset.map((migration) => migration.Name));
    const files = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith(".js"))
      .sort();

    let count = 0;
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skipped: ${file}`);
        continue;
      }

      console.log(`Running: ${file}`);
      const migration = await import(pathToFileURL(path.join(migrationsDir, file)).href);
      if (typeof migration.up !== "function") {
        throw new Error(`${file} must export an async up(pool) function`);
      }

      await migration.up(pool);
      await pool.request().input("name", sql.NVarChar(255), file).query(
        "INSERT INTO dbo.Migrations (Name) VALUES (@name)",
      );
      count += 1;
      console.log(`Applied: ${file}`);
    }

    console.log(`Migration complete: ${count} migration(s) applied.`);
  } catch (error) {
    console.error(`Migration failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (pool) await pool.close();
  }
};

await run();
