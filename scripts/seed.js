/**
 * Seed script — inserts the initial admin user into dbo.Users.
 *
 * Password is double-hashed to match the login flow:
 *   1. Client-side SHA-256  (simulated here with Node crypto)
 *   2. Server-side bcrypt   (stored in the DB)
 *
 * Usage:
 *   node scripts/seed.js
 *
 * Required env vars: SQL_SERVER, SQL_DATABASE, SQL_USER, SQL_PASSWORD
 */

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import sql from "mssql";
import { ROLES } from "../src/shared/config/roles.js";

dotenv.config();

const ADMIN_USER = "HRMS_Admin";
const ADMIN_RAW_PASSWORD = "Admin@12345";
const ADMIN_ROLE = ROLES.ADMIN;
const SALT_ROUNDS = 10;

// ── Helpers ──────────────────────────────────────────────────────────────

/** Replicate the frontend's client-side SHA-256 hashing (Web Crypto API). */
function sha256(plaintext) {
  return crypto.createHash("sha256").update(plaintext, "utf8").digest("hex");
}

// ── Main ─────────────────────────────────────────────────────────────────

const required = ["SQL_SERVER", "SQL_DATABASE", "SQL_USER", "SQL_PASSWORD"];
const missing = required.filter((name) => !process.env[name]);

if (missing.length) {
  console.error(`Seed failed: missing env var(s): ${missing.join(", ")}`);
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
    trustServerCertificate:
      process.env.SQL_TRUST_SERVER_CERTIFICATE !== "false",
    ...(instanceName ? { instanceName } : {}),
  },
};

const run = async () => {
  let pool;
  try {
    pool = await sql.connect(poolConfig);
    console.log("Connected to SQL Server");

    // Check if user already exists
    const existing = await pool
      .request()
      .input("userName", sql.NVarChar, ADMIN_USER)
      .query("SELECT UserId FROM dbo.Users WHERE UserName = @userName");

    if (existing.recordset.length > 0) {
      console.log(`User "${ADMIN_USER}" already exists — skipping.`);
      return;
    }

    // Double-hash: SHA-256 (client-side) → bcrypt (server-side)
    const sha256Hash = sha256(ADMIN_RAW_PASSWORD);
    const bcryptHash = await bcrypt.hash(sha256Hash, SALT_ROUNDS);

    const result = await pool
      .request()
      .input("userName", sql.NVarChar, ADMIN_USER)
      .input("password", sql.NVarChar, bcryptHash)
      .input("role", sql.NVarChar, ADMIN_ROLE)
      .query(
        `INSERT INTO dbo.Users (UserName, Password, Role)
         OUTPUT INSERTED.UserId, INSERTED.UserName, INSERTED.Role
         VALUES (@userName, @password, @role)`,
      );

    const user = result.recordset[0];
    console.log("Admin user created:");
    console.log(`  UserId   : ${user.UserId}`);
    console.log(`  UserName : ${user.UserName}`);
    console.log(`  Role     : ${user.Role}`);
    console.log(`  Password : ${ADMIN_RAW_PASSWORD}  (change after first login)`);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (pool) await pool.close();
  }
};

await run();
