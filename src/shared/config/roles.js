//   Role Master — single source of truth for all user roles in the HRMS.
//
//   Usage:
//     import { ROLES, ROLE_LIST } from "../config/roles.js";
//
//    if (user.role === ROLES.ADMIN) { ... }
//     if (!ROLE_LIST.includes(inputRole)) { throw ... }

export const ROLES = Object.freeze({
  ADMIN: "admin",
  HR: "hr",
  EMPLOYEE: "employee",
  DIRECTOR: "director",
});

//  Flat array of valid role strings — useful for Joi validation / seed scripts.
export const ROLE_LIST = Object.freeze(Object.values(ROLES));

//  Default role assigned to new users.
export const DEFAULT_ROLE = ROLES.EMPLOYEE;
