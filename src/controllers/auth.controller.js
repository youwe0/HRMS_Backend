import { asyncHandler, sendSuccess } from '../utils/index.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import config from '../config/index.js';
import { authService } from '../services/index.js';

const getRefreshToken = (req) =>
  req.cookies?.[config.jwt.refreshCookieName] || req.body?.refreshToken || null;

export const register = asyncHandler(async (req, res) => {
  const { user } = await authService.register(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.REGISTER_SUCCESS, { user });
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  res.cookie(config.jwt.refreshCookieName, refreshToken, config.cookie);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.LOGIN_SUCCESS, { user, accessToken });
});

export const refresh = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.refreshTokens(
    getRefreshToken(req)
  );
  res.cookie(config.jwt.refreshCookieName, refreshToken, config.cookie);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.TOKEN_REFRESHED, { user, accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id, getRefreshToken(req));
  res.clearCookie(config.jwt.refreshCookieName, {
    ...config.cookie,
    maxAge: undefined,
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.LOGOUT_SUCCESS);
});

export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, HTTP_STATUS.OK, 'Current user', { user: req.user });
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PASSWORD_CHANGED);
});
