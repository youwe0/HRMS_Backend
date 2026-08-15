import { asyncHandler, sendSuccess } from "../utils/index.js";
import { HTTP_STATUS } from "../constants/index.js";
import { departmentService } from "../services/index.js";

export const createDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.createDepartment(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, "Department created successfully", {
    department,
  });
});

export const getDepartments = asyncHandler(async (req, res) => {
  const result = await departmentService.getDepartments(req.query);
  sendSuccess(res, HTTP_STATUS.OK, "Departments fetched successfully", result);
});

export const getDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.getDepartmentById(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, "Department fetched successfully", {
    department,
  });
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.updateDepartment(
    req.params.id,
    req.body,
  );
  sendSuccess(res, HTTP_STATUS.OK, "Department updated successfully", {
    department,
  });
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  await departmentService.deleteDepartment(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, "Department deleted successfully");
});
