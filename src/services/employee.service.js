import { Employee, User, Department } from "../models/index.js";
import { ApiError, getPagination, getPaginationMeta } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import { formatEmployeeResponse } from "../helpers/index.js";

export const createEmployee = async (payload) => {
  const { user: userId, department: departmentId, employeeId } = payload;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      MESSAGES.REFERENCED_USER_NOT_FOUND,
    );
  }

  const department = await Department.findById(departmentId);
  if (!department) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      MESSAGES.REFERENCED_DEPARTMENT_NOT_FOUND,
    );
  }

  if (await Employee.findOne({ user: userId })) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      MESSAGES.USER_HAS_EMPLOYEE_PROFILE,
    );
  }

  if (await Employee.findOne({ employeeId })) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      MESSAGES.EMPLOYEE_ID_ALREADY_EXISTS,
    );
  }

  const employee = await Employee.create(payload);
  return formatEmployeeResponse(employee.toObject());
};

export const getEmployees = async ({
  page = 1,
  limit = 10,
  status,
  department,
  search,
} = {}) => {
  const filter = {};

  if (status) filter.status = status;
  if (department) filter.department = department;
  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ employeeId: regex }, { designation: regex }];
  }

  const {
    page: safePage,
    limit: safeLimit,
    skip,
  } = getPagination({ page, limit });
  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .populate("user", "name email")
      .populate("department", "name code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Employee.countDocuments(filter),
  ]);

  return {
    items: employees.map(formatEmployeeResponse),
    pagination: getPaginationMeta(total, safePage, safeLimit),
  };
};

export const getEmployeeById = async (id) => {
  const employee = await Employee.findById(id)
    .populate("user", "name email")
    .populate("department", "name code")
    .lean();

  if (!employee) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.EMPLOYEE_NOT_FOUND);
  }
  return formatEmployeeResponse(employee);
};

export const updateEmployee = async (id, payload) => {
  const employee = await Employee.findById(id);
  if (!employee) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.EMPLOYEE_NOT_FOUND);
  }

  const {
    employeeId,
    department: departmentId,
    user: userId,
    ...rest
  } = payload;

  if (employeeId && employeeId !== employee.employeeId) {
    const duplicate = await Employee.findOne({ employeeId, _id: { $ne: id } });
    if (duplicate) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        MESSAGES.EMPLOYEE_ID_ALREADY_EXISTS,
      );
    }
    employee.employeeId = employeeId;
  }

  if (userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        MESSAGES.REFERENCED_USER_NOT_FOUND,
      );
    }
    const profile = await Employee.findOne({ user: userId, _id: { $ne: id } });
    if (profile) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        MESSAGES.USER_HAS_EMPLOYEE_PROFILE,
      );
    }
    employee.user = userId;
  }

  if (departmentId) {
    const department = await Department.findById(departmentId);
    if (!department) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        MESSAGES.REFERENCED_DEPARTMENT_NOT_FOUND,
      );
    }
    employee.department = departmentId;
  }

  Object.assign(employee, rest);
  await employee.save();

  const updated = await Employee.findById(employee._id)
    .populate("user", "name email")
    .populate("department", "name code")
    .lean();
  return formatEmployeeResponse(updated);
};

export const deleteEmployee = async (id) => {
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.EMPLOYEE_NOT_FOUND);
  }
};
