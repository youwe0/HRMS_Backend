import { asyncHandler, sendSuccess } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import { userService } from "../services/index.js";

export const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const users = await userService.searchUsers(q.trim());
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.USERS_SEARCH_RETRIEVED, { users });
});
