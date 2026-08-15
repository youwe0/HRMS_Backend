import { getExpressApp } from './express.loader.js';
import { initDatabase } from './mongoose.loader.js';
import { startJobs } from '../jobs/index.js';
import logger from '../utils/logger.js';

/**
 * Bootstraps everything the server needs (DB connection, scheduled jobs)
 * and returns the configured Express app. Keeps `server.js` minimal.
 */
export const initLoaders = async () => {
  const app = getExpressApp();

  await initDatabase();
  startJobs();

  logger.info('All loaders initialized');
  return app;
};
