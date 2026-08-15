export const MESSAGES = {
  // Validation & auth
  VALIDATION_FAILED: "Validation failed",
  UNAUTHORIZED: "Authentication required",
  INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token",
  INVALID_CREDENTIALS: "Invalid email or password",
  INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
  FORBIDDEN: "You do not have permission to perform this action",
  TOO_MANY_REQUESTS: "Too many requests, please try again later",

  // Generic
  INTERNAL_SERVER_ERROR: "Internal server error",
  ROUTE_NOT_FOUND: "Route not found",
  NOT_FOUND: "Resource not found",

  // Auth flows
  REGISTER_SUCCESS: "Registration successful",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  TOKEN_REFRESHED: "Tokens refreshed successfully",
  PASSWORD_CHANGED: "Password changed successfully",
  CURRENT_PASSWORD_INCORRECT: "Current password is incorrect",

  // Domain
  EMAIL_ALREADY_EXISTS: "Email is already registered",
  USER_NOT_FOUND: "User not found",
  USER_HAS_EMPLOYEE_PROFILE: "This user already has an employee profile",
  DEPARTMENT_NOT_FOUND: "Department not found",
  DEPARTMENT_NAME_EXISTS: "Department with this name already exists",
  DEPARTMENT_CODE_EXISTS: "Department with this code already exists",
  DEPARTMENT_HAS_EMPLOYEES: "Cannot delete a department that has employees",
  EMPLOYEE_NOT_FOUND: "Employee not found",
  EMPLOYEE_ID_ALREADY_EXISTS: "Employee ID already exists",
  REFERENCED_USER_NOT_FOUND: "Referenced user does not exist",
  REFERENCED_DEPARTMENT_NOT_FOUND: "Referenced department does not exist",
  REFERENCED_HEAD_NOT_FOUND: "Referenced department head does not exist",
};
