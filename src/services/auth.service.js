import sql from "mssql";
import { getDB } from "../db/connection.js";
import { ApiError, hashPassword, comparePassword } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import { formatUserResponse } from "../helpers/index.js";

const fields = "UserId AS userId, UserName AS userName, Created_at AS createdAt, Created_by AS createdBy, Is_active AS isActive";

const findUser = async (userName, includePassword = false) => {
  const password = includePassword ? ", Password AS password" : "";
  return (await getDB().request().input("userName", sql.NVarChar, userName).query(`SELECT ${fields}${password} FROM dbo.Users WHERE UserName = @userName`)).recordset[0];
};

export const register = async ({ userName, password }) => {
  const normalizedUserName = userName.trim();
  if (await findUser(normalizedUserName)) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "Username already exists");
  }

  const result = await getDB().request()
    .input("userName", sql.NVarChar, normalizedUserName)
    .input("password", sql.NVarChar, await hashPassword(password))
    .query(`INSERT dbo.Users (UserName, Password) OUTPUT INSERTED.UserId AS userId, INSERTED.UserName AS userName, INSERTED.Created_at AS createdAt, INSERTED.Created_by AS createdBy, INSERTED.Is_active AS isActive VALUES (@userName, @password)`);
  return { user: formatUserResponse(result.recordset[0]) };
};

export const login = async ({ userName, password }) => {
  const user = await findUser(userName.trim(), true);
  if (!user || !user.isActive || !(await comparePassword(password, user.password))) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
  }
  return formatUserResponse(user);
};
