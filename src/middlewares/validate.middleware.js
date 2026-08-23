import { ApiError } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";

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
          MESSAGES.VALIDATION_FAILED,
          details,
        ),
      );
    }

    req[source] = value;
    return next();
  };
