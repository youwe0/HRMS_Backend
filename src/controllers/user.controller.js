import { asyncHandler, sendSuccess } from "../utils/index.js";
import { HTTP_STATUS } from "../constants/index.js";
import { userService } from "../services/index.js";

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, "User created successfully", { user });
});

export const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUsers(req.query);
  sendSuccess(res, HTTP_STATUS.OK, "Users fetched successfully", result);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, "User fetched successfully", { user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  sendSuccess(res, HTTP_STATUS.OK, "User updated successfully", { user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, "User deleted successfully");
});
