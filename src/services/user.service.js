import { User } from '../models/index.js';
import {
  ApiError,
  hashPassword,
  getPagination,
  getPaginationMeta,
} from '../utils/index.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import { formatUserResponse } from '../helpers/index.js';

export const createUser = async ({ name, email, password, role, isActive = true }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role,
    isActive,
  });

  return formatUserResponse(user.toObject());
};

export const getUsers = async ({ page = 1, limit = 10, search, role, isActive } = {}) => {
  const filter = {};

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }
  if (role) filter.role = role;
  if (typeof isActive === 'boolean') filter.isActive = isActive;

  const { page: safePage, limit: safeLimit, skip } = getPagination({ page, limit });
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
    User.countDocuments(filter),
  ]);

  return {
    items: users.map(formatUserResponse),
    pagination: getPaginationMeta(total, safePage, safeLimit),
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id).lean();
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }
  return formatUserResponse(user);
};

export const updateUser = async (id, payload) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }

  const { password, ...rest } = payload;

  if (rest.email) {
    const normalizedEmail = rest.email.toLowerCase().trim();
    const duplicate = await User.findOne({ email: normalizedEmail, _id: { $ne: id } });
    if (duplicate) {
      throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.EMAIL_ALREADY_EXISTS);
    }
    rest.email = normalizedEmail;
  }

  if (password) {
    rest.password = await hashPassword(password);
  }

  Object.assign(user, rest);
  await user.save();

  return formatUserResponse(user.toObject());
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }
};
