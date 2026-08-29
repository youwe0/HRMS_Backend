import { asyncHandler, sendSuccess } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import { userService } from "../services/index.js";

export const searchUsers = asyncHandler(async (req, res) => {
  const { q, searchFor } = req.query;
  const { results, users } = await userService.searchUsers(
    q.trim(),
    searchFor,
  );
  sendSuccess(
    res,
    HTTP_STATUS.OK,
    MESSAGES.ENTITY_SEARCH_RETRIEVED,
    { results, users },
  );
});
