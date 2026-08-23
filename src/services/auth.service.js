import sql from "mssql";
import { getDB } from "../db/connection.js";
import {
  ApiError,
  hashPassword,
  comparePassword,
  generateToken,
} from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import { formatUserResponse } from "../helpers/index.js";

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MINUTES = 15;

const fields =
  "UserId AS userId, UserName AS userName, Role AS role, Created_at AS createdAt, Created_by AS createdBy, Is_active AS isActive";

const findUser = async (userName, includePassword = false) => {
  const extra = includePassword
    ? ", Password AS password, FailedLoginAttempts AS failedLoginAttempts, LockedUntil AS lockedUntil"
    : "";
  return (
    await getDB()
      .request()
      .input("userName", sql.NVarChar, userName)
      .query(
        `SELECT ${fields}${extra} FROM dbo.Users WHERE UserName = @userName`,
      )
  ).recordset[0];
};

export const register = async ({ userName, password }) => {
  const normalizedUserName = userName.trim();
  if (await findUser(normalizedUserName)) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.USERNAME_EXISTS);
  }

  const result = await getDB()
    .request()
    .input("userName", sql.NVarChar, normalizedUserName)
    .input("password", sql.NVarChar, await hashPassword(password))
    .query(
      `INSERT dbo.Users (UserName, Password) OUTPUT INSERTED.UserId AS userId, INSERTED.UserName AS userName, INSERTED.Created_at AS createdAt, INSERTED.Created_by AS createdBy, INSERTED.Is_active AS isActive VALUES (@userName, @password)`,
    );
  return { user: formatUserResponse(result.recordset[0]) };
};

export const login = async ({ userName, passwordHash }) => {
  const normalizedUserName = userName.trim();

  //  Step 1: Check if user exists
  const user = await findUser(normalizedUserName, true);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }

  //   Step 2: Check if account is active
  if (!user.isActive) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
  }

  //   Step 3: Check if account is locked
  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    const remainingMs = new Date(user.lockedUntil) - new Date();
    const remainingMin = Math.ceil(remainingMs / 60000);
    throw new ApiError(
      HTTP_STATUS.LOCKED,
      `${MESSAGES.ACCOUNT_LOCKED}. Try again in ${remainingMin} minute${remainingMin === 1 ? "" : "s"}.`,
    );
  }

  //   Step 4: Verify password (bcrypt compare against client-side SHA-256 hash)
  const passwordMatch = await comparePassword(passwordHash, user.password);

  if (!passwordMatch) {
    //   Step 5a: Password mismatch — increment failed attempts
    const newAttempts = (user.failedLoginAttempts || 0) + 1;
    const lockUntil =
      newAttempts >= LOCKOUT_THRESHOLD
        ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
        : null;

    await getDB()
      .request()
      .input("userId", sql.Int, user.userId)
      .input("failedAttempts", sql.Int, newAttempts)
      .input("lockedUntil", sql.DateTime2, lockUntil)
      .query(
        `UPDATE dbo.Users
           SET FailedLoginAttempts = @failedAttempts,
               LockedUntil = @lockedUntil
         WHERE UserId = @userId`,
      );

    if (newAttempts >= LOCKOUT_THRESHOLD) {
      throw new ApiError(
        HTTP_STATUS.LOCKED,
        `${MESSAGES.ACCOUNT_LOCKED}. Try again in ${LOCKOUT_MINUTES} minutes.`,
      );
    }

    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
  }

  //  Step 5b: Password matched — reset counters
  await getDB()
    .request()
    .input("userId", sql.Int, user.userId)
    .query(
      `UPDATE dbo.Users
         SET FailedLoginAttempts = 0,
             LockedUntil = NULL
       WHERE UserId = @userId`,
    );

  const token = generateToken({
    userId: user.userId,
    userName: user.userName,
    role: user.role,
  });

  return {
    token,
    user: formatUserResponse(user),
  };
};
