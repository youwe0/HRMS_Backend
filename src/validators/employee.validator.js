import { paginationSchema } from "../utils/pagination.js";

//  Validation schema for GET /employees query parameters.
//  Reuses the shared paginationSchema — override defaults if needed:
//  paginationSchema({ limit: 20, maxLimit: 100 })

export const getEmployeesSchema = paginationSchema();
