import { asyncHandler, sendSuccess } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import { authService } from "../services/index.js";

export const register = asyncHandler(async (req, res) => {
  const { user } = await authService.register(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.REGISTER_SUCCESS, { user });
});

export const login = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.LOGIN_SUCCESS, { user });
});
