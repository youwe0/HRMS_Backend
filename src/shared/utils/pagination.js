import Joi from "joi";
import { sendSuccess } from "./apiResponse.js";

// ------------------------------------------------------------------
// Pagination helpers
// ------------------------------------------------------------------

/**
 * Sanitize and compute pagination values.
 * @param {Object}  opts
 * @param {number}  [opts.page=1]    – current page (1-indexed)
 * @param {number}  [opts.limit=10]  – records per page
 * @param {number}  [opts.maxLimit=50] – hard upper-bound for limit
 * @returns {{ page: number, limit: number, skip: number }}
 */
export const getPagination = ({ page = 1, limit = 10, maxLimit = 50 } = {}) => {
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), maxLimit);
  return { page: safePage, limit: safeLimit, skip: (safePage - 1) * safeLimit };
};

/**
 * Build the pagination metadata block for list responses.
 * @param {number} total   – total record count
 * @param {number} page    – current page
 * @param {number} limit   – records per page
 * @returns {{ page, limit, total, totalPages }}
 */
export const getPaginationMeta = (total, page, limit) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
});

// ------------------------------------------------------------------
// Joi schema factory
// ------------------------------------------------------------------

/**
 * Create a Joi schema for pagination query parameters.
 * @param {Object}  defaults
 * @param {number}  [defaults.page=1]    – default page
 * @param {number}  [defaults.limit=10]  – default limit
 * @param {number}  [defaults.maxLimit=50] – hard upper-bound for limit
 * @returns {import("joi").ObjectSchema}
 *
 * @example
 *   router.get("/items", validate(paginationSchema()), controller);
 *   router.get("/items", validate(paginationSchema({ limit: 20 })), controller);
 */
export const paginationSchema = ({ page = 1, limit = 10, maxLimit = 50 } = {}) =>
  Joi.object({
    page: Joi.number().integer().min(1).default(page),
    limit: Joi.number().integer().min(1).max(maxLimit).default(limit),
  })
    .unknown(false)
    .options({ stripUnknown: true });

// ------------------------------------------------------------------
// SQL Server OFFSET / FETCH helper
// ------------------------------------------------------------------

/**
 * Build the SQL fragment and input values for OFFSET … FETCH NEXT.
 * Use this inside your SQL query string with @offset and @limit inputs.
 *
 * @param {Object}  opts
 * @param {number}  opts.page
 * @param {number}  opts.limit
 * @returns {{ offset: number, limit: number, sqlSuffix: string }}
 *
 * @example
 *   const { offset, limit: lim } = buildSqlPagination({ page: 2, limit: 10 });
 *   db.request()
 *     .input("offset", offset)
 *     .input("limit", lim)
 *     .query(`SELECT * FROM dbo.Items ORDER BY Id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`);
 */
export const buildSqlPagination = ({ page, limit }) => {
  const { skip } = getPagination({ page, limit });
  return { offset: skip, limit };
};

// ------------------------------------------------------------------
// Controller factory
// ------------------------------------------------------------------

/**
 * Create a ready-to-use Express controller that handles pagination.
 *
 * @param {Function} fetchData      – async function({ page, limit }) => { items, total }
 * @param {Object}   options
 * @param {string}   options.dataKey    – key for the items array in the response data (e.g. "employees")
 * @param {string}   options.message    – success message
 * @param {number}   [options.statusCode=200] – HTTP status code
 * @returns {Function} Express request handler
 *
 * @example
 *   // In your controller file:
 *   import { createPaginatedHandler } from "../utils/pagination.js";
 *   import { employeeService } from "../services/index.js";
 *
 *   export const getAllEmployees = createPaginatedHandler(
 *     (opts) => employeeService.getAllEmployees(opts),
 *     { dataKey: "employees", message: "Employees retrieved successfully" },
 *   );
 */
export const createPaginatedHandler = (
  fetchData,
  { dataKey, message, statusCode = 200 },
) => {
  const handler = async (req, res) => {
    const { page, limit } = getPagination({
      page: req.query.page,
      limit: req.query.limit,
    });

    const { items, total } = await fetchData({ page, limit });

    sendSuccess(res, statusCode, message, {
      [dataKey]: items,
      pagination: getPaginationMeta(total, page, limit),
    });
  };

  // Preserve function name for better stack traces
  Object.defineProperty(handler, "name", { value: `paginated_${dataKey}` });
  return handler;
};
