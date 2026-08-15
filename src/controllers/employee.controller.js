import { asyncHandler, sendSuccess } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import { employeeService } from '../services/index.js';

export const createEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Employee created successfully', { employee });
});

export const getEmployees = asyncHandler(async (req, res) => {
  const result = await employeeService.getEmployees(req.query);
  sendSuccess(res, HTTP_STATUS.OK, 'Employees fetched successfully', result);
});

export const getEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, 'Employee fetched successfully', { employee });
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmployee(req.params.id, req.body);
  sendSuccess(res, HTTP_STATUS.OK, 'Employee updated successfully', { employee });
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  await employeeService.deleteEmployee(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, 'Employee deleted successfully');
});
