import { ApiError } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";

/**
 * Factory that returns a middleware responding with 405 Wrong Method.
 *
 * Usage in route files:
 *   router.post("/register", ...middlewares);
 *   router.all("/register", wrongMethod(["POST"]));
 *
 * When Express reaches `router.all` it means no method-specific route matched,
 * so we know the path is correct but the HTTP method is wrong.
 */
export const wrongMethod = (allowedMethods) => (req, res, next) => {
  res.set("Allow", allowedMethods.join(", "));
  next(new ApiError(HTTP_STATUS.METHOD_NOT_ALLOWED, MESSAGES.WRONG_METHOD));
};
