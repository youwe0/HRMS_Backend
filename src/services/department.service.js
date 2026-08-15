import { Department, Employee, User } from '../models/index.js';
import {
  ApiError,
  getPagination,
  getPaginationMeta,
} from '../utils/index.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const createDepartment = async ({ name, code, description, head, isActive = true }) => {
  if (await Department.findOne({ name })) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DEPARTMENT_NAME_EXISTS);
  }
  if (await Department.findOne({ code: code.toUpperCase() })) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DEPARTMENT_CODE_EXISTS);
  }
  if (head) {
    const headUser = await User.findById(head);
    if (!headUser) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.REFERENCED_HEAD_NOT_FOUND);
    }
  }

  return Department.create({ name, code: code.toUpperCase(), description, head, isActive });
};

export const getDepartments = async ({ page = 1, limit = 10, search, isActive } = {}) => {
  const filter = {};

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ name: regex }, { code: regex }];
  }
  if (typeof isActive === 'boolean') filter.isActive = isActive;

  const { page: safePage, limit: safeLimit, skip } = getPagination({ page, limit });
  const [departments, total] = await Promise.all([
    Department.find(filter).sort({ name: 1 }).skip(skip).limit(safeLimit).lean(),
    Department.countDocuments(filter),
  ]);

  return {
    items: departments,
    pagination: getPaginationMeta(total, safePage, safeLimit),
  };
};

export const getDepartmentById = async (id) => {
  const department = await Department.findById(id).lean();
  if (!department) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DEPARTMENT_NOT_FOUND);
  }
  return department;
};

export const updateDepartment = async (id, payload) => {
  const department = await Department.findById(id);
  if (!department) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DEPARTMENT_NOT_FOUND);
  }

  const { head, code, ...rest } = payload;

  if (rest.name) {
    const duplicate = await Department.findOne({ name: rest.name, _id: { $ne: id } });
    if (duplicate) {
      throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DEPARTMENT_NAME_EXISTS);
    }
  }

  let normalizedCode;
  if (code) {
    normalizedCode = code.toUpperCase();
    const duplicate = await Department.findOne({ code: normalizedCode, _id: { $ne: id } });
    if (duplicate) {
      throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DEPARTMENT_CODE_EXISTS);
    }
  }

  if (head) {
    const headUser = await User.findById(head);
    if (!headUser) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.REFERENCED_HEAD_NOT_FOUND);
    }
  }

  Object.assign(department, rest);
  if (normalizedCode) department.code = normalizedCode;
  if (Object.prototype.hasOwnProperty.call(payload, 'head')) department.head = head;

  await department.save();
  return department.toObject();
};

export const deleteDepartment = async (id) => {
  const department = await Department.findById(id);
  if (!department) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DEPARTMENT_NOT_FOUND);
  }

  const employeeCount = await Employee.countDocuments({ department: id });
  if (employeeCount > 0) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DEPARTMENT_HAS_EMPLOYEES);
  }

  await department.deleteOne();
};
