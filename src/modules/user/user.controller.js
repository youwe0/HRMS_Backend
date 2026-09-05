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

export const assignPermissions = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { permissions } = req.body;
  const result = await userService.assignPermissions({
    userId: userId,
    permissionIds: permissions,
  });
  sendSuccess(
    res,
    HTTP_STATUS.OK,
    MESSAGES.PERMISSIONS_ASSIGNED,
    { user: result },
  );
});

export const getUserPermissions = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const result = await userService.getUserPermissions({
    userId: userId,
  });
  sendSuccess(
    res,
    HTTP_STATUS.OK,
    MESSAGES.PERMISSIONS_RETRIEVED_FOR_USER,
    { user: result },
  );
});
