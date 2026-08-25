import { asyncHandler, sendSuccess } from "../utils/index.js";
import { HTTP_STATUS } from "../constants/index.js";
import { employeeService } from "../services/index.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";

export const getAllEmployees = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination({
    page: req.query.page,
    limit: req.query.limit,
  });

  const { employees, total } = await employeeService.getAllEmployees({
    page,
    limit,
  });

  sendSuccess(res, HTTP_STATUS.OK, "Employees retrieved successfully", {
    employees,
    pagination: getPaginationMeta(total, page, limit),
  });
});
