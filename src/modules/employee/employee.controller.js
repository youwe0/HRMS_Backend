import { HTTP_STATUS } from "../../shared/constants/index.js";
import * as employeeService from "./employee.service.js";
import { createPaginatedHandler } from "../../shared/utils/pagination.js";

export const getAllEmployees = createPaginatedHandler(
  (opts) => employeeService.getAllEmployees(opts),
  { dataKey: "employees", message: "Employees retrieved successfully", statusCode: HTTP_STATUS.OK },
);
