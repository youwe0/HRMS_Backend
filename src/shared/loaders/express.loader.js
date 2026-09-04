import app from "../../app.js";

/**
 * Express app creation + middleware mounting live in `src/app.js`.
 * This loader hands the configured app to the bootstrap sequence.
 */
export const getExpressApp = () => app;
