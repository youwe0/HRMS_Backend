import { HTTP_STATUS } from "../constants/index.js";
import { employeeService } from "../services/index.js";
import { createPaginatedHandler } from "../utils/pagination.js";

export const getAllEmployees = createPaginatedHandler(
  (opts) => employeeService.getAllEmployees(opts),
  { dataKey: "employees", message: "Employees retrieved successfully", statusCode: HTTP_STATUS.OK },
);
