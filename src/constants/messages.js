export const MESSAGES = {
  // Client errors — standardized messages
  UNEXPECTED_REQUEST: "Unexpected request",
  WRONG_METHOD: "Wrong method",
  UNAUTHORIZED: "Unauthorized request",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not found",
  CONFLICT: "Conflict",

  // Client errors — domain-specific
  VALIDATION_FAILED: "Unexpected request",
  USER_NOT_FOUND: "User does not exist",
  INVALID_CREDENTIALS: "Invalid username or password",
  ACCOUNT_LOCKED: "Account locked due to too many failed attempts",
  USERNAME_EXISTS: "Username already exists",
  TOKEN_EXPIRED: "Token has expired",
  INVALID_TOKEN: "Invalid token",

  // Rate limiting
  TOO_MANY_REQUESTS: "Too many requests, please try again later",

  // Success
  REGISTER_SUCCESS: "Registration successful",
  LOGIN_SUCCESS: "Login successful",
  DEPARTMENT_CREATED: "Department created successfully",
  DEPARTMENTS_RETRIEVED: "Departments retrieved successfully",
  DEPARTMENT_DELETED: "Department deleted successfully",
  DESIGNATION_CREATED: "Designation created successfully",
  DESIGNATIONS_RETRIEVED: "Designations retrieved successfully",
  DESIGNATION_DELETED: "Designation deleted successfully",
  USERS_SEARCH_RETRIEVED: "Users retrieved successfully",

  // Server errors
  INTERNAL_SERVER_ERROR: "Internal server error",
  ROUTE_NOT_FOUND: "Route not found",
  METHOD_NOT_ALLOWED: "Wrong method",
  MISSING_FIELDS: "Missing required fields",
  PAYLOAD_TOO_LARGE: "Request payload is too large",
};
