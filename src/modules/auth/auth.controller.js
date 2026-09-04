import { asyncHandler, sendSuccess } from "../../shared/utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../../shared/constants/index.js";
import * as authService from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const { user } = await authService.register(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.REGISTER_SUCCESS, { user });
});

export const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.LOGIN_SUCCESS, { token, user });
});
