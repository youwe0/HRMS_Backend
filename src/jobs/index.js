import logger from '../utils/logger.js';
import { startCleanupRefreshTokensJob } from './cleanupExpiredRefreshTokens.job.js';

export const startJobs = () => {
  logger.info('Starting scheduled jobs...');
  startCleanupRefreshTokensJob();
};
