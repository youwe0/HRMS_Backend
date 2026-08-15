/** Sanitize and compute pagination values. */
export const getPagination = ({ page = 1, limit = 10, maxLimit = 50 } = {}) => {
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), maxLimit);
  return { page: safePage, limit: safeLimit, skip: (safePage - 1) * safeLimit };
};

/** Build the pagination metadata block for list responses. */
export const getPaginationMeta = (total, page, limit) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
});
