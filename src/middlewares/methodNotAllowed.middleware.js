import { ApiError } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";

//   Returns 405 Method Not Allowed when a route path is registered
//   but the current request method is not one of the allowed methods.

export const methodNotAllowedHandler = (req, res, next) => {
  const allowedMethods = [];

  // Walk the Express router stack to find registered methods for this path
  const layers = req.app._router?.stack || [];
  for (const layer of layerIterator(layers)) {
    if (layer.route && pathMatches(layer.route.path, req.path)) {
      for (const method of Object.keys(layer.route.methods)) {
        if (method !== "_all") {
          allowedMethods.push(method.toUpperCase());
        }
      }
    }
  }

  if (allowedMethods.length > 0) {
    res.set("Allow", allowedMethods.join(", "));
    return next(
      new ApiError(
        HTTP_STATUS.METHOD_NOT_ALLOWED,
        `${MESSAGES.METHOD_NOT_ALLOWED}. Allowed: ${allowedMethods.join(", ")}`,
      ),
    );
  }

  // Not a known route at all — fall through to notFoundHandler
  return next();
};

//  Recursively yield all layers, diving into sub-routers.
function* layerIterator(layers) {
  for (const layer of layers) {
    yield layer;
    if (layer.handle?.stack) {
      yield* layerIterator(layer.handle.stack);
    }
  }
}

//  Simple path matcher that handles Express param syntax like /:id.
function pathMatches(routePath, reqPath) {
  const routeParts = routePath.split("/").filter(Boolean);
  const reqParts = reqPath.split("/").filter(Boolean);

  if (routeParts.length !== reqParts.length) return false;

  return routeParts.every(
    (part, i) => part.startsWith(":") || part === reqParts[i],
  );
}
