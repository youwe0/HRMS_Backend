import { asyncHandler, sendSuccess } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import { departmentService } from "../services/index.js";
import { createPaginatedHandler } from "../utils/pagination.js";
import ApiError from "../utils/ApiError.js";

export const createDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.createDepartment({
    department: req.body.department,
    hod: req.body.hod,
    isActive: req.body.isActive,
    userId: req.user.userId,
  });
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.DEPARTMENT_CREATED, {
    department,
  });
});

export const getAllDepartments = createPaginatedHandler(
  (opts) => departmentService.getAllDepartments(opts),
  { dataKey: "departments", message: MESSAGES.DEPARTMENTS_RETRIEVED, statusCode: HTTP_STATUS.OK },
);

export const deleteDepartment = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const department = await departmentService.deleteDepartment({ id });
  if (!department) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND);
  }
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.DEPARTMENT_DELETED, {
    department,
  });
});
