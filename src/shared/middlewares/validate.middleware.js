import { ApiError } from "../../shared/utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../../shared/constants/index.js";

//  Validates a request part (body | query | params) against a Joi schema.
//  Used inside route middleware — never inside controllers.
export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      allowUnknown: false,
      convert: true,
    });

    if (error) {
      const details = error.details.map(({ path, message }) => ({
        field: path.join("."),
        message,
      }));
      return next(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          MESSAGES.UNEXPECTED_REQUEST,
          details,
        ),
      );
    }

    // Express 5 makes req.query a read-only getter — skip reassignment
    // to avoid TypeError. The validated value is still available via Joi.
    try {
      req[source] = value;
    } catch {
      // req.query is a getter in Express 5 — cannot be overwritten
    }
    return next();
  };
