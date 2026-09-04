import { asyncHandler, sendSuccess } from "../../shared/utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../../shared/constants/index.js";
import * as userService from "./user.service.js";

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
