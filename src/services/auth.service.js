import { User } from "../models/index.js";
import {
  ApiError,
  hashPassword,
  comparePassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashRefreshToken,
} from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import { formatUserResponse } from "../helpers/index.js";
import config from "../config/index.js";

const MAX_REFRESH_TOKENS = 5;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // matches JWT + cookie lifetime

const buildTokenPayload = (user) => ({
  sub: user._id.toString(),
  role: user.role,
});

/** Sign a fresh token pair, persist the hashed refresh token, and return both. */
const issueTokens = async (user) => {
  const payload = buildTokenPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const hashed = hashRefreshToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

  const validTokens = (user.refreshTokens || []).filter(
    (t) => t.expiresAt > new Date(),
  );
  user.refreshTokens = [...validTokens, { token: hashed, expiresAt }].slice(
    -MAX_REFRESH_TOKENS,
  );
  await user.save();

  return { accessToken, refreshToken };
};

export const register = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: "employee",
  });

  return { user: formatUserResponse(user.toObject()) };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password",
  );

  if (!user || !user.isActive) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
  }

  const tokens = await issueTokens(user);
  return { user: formatUserResponse(user.toObject()), ...tokens };
};

export const refreshTokens = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      MESSAGES.INVALID_REFRESH_TOKEN,
    );
  }

  let payload;
  try {
    payload = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      MESSAGES.INVALID_REFRESH_TOKEN,
    );
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      MESSAGES.INVALID_REFRESH_TOKEN,
    );
  }

  const hashed = hashRefreshToken(incomingRefreshToken);
  const storedToken = user.refreshTokens.find((t) => t.token === hashed);
  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      MESSAGES.INVALID_REFRESH_TOKEN,
    );
  }

  // Rotate: revoke the used token, then issue a fresh pair.
  user.refreshTokens = user.refreshTokens.filter((t) => t.token !== hashed);
  const tokens = await issueTokens(user);

  return { user: formatUserResponse(user.toObject()), ...tokens };
};

export const logout = async (userId, incomingRefreshToken) => {
  if (!incomingRefreshToken) return;
  const hashed = hashRefreshToken(incomingRefreshToken);
  await User.updateOne(
    { _id: userId },
    { $pull: { refreshTokens: { token: hashed } } },
  );
};

export const changePassword = async (
  userId,
  { currentPassword, newPassword },
) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      MESSAGES.CURRENT_PASSWORD_INCORRECT,
    );
  }

  user.password = await hashPassword(newPassword);
  user.refreshTokens = []; // revoke all sessions on password change
  await user.save();
};

/** Removes expired refresh tokens across all users (used by the cron job). */
export const cleanupExpiredRefreshTokens = async () => {
  const result = await User.updateMany(
    { "refreshTokens.expiresAt": { $lte: new Date() } },
    { $pull: { refreshTokens: { expiresAt: { $lte: new Date() } } } },
  );
  return result.modifiedCount;
};
