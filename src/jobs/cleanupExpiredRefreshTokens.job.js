import cron from 'node-cron';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { authService } from '../services/index.js';

/** Daily: purge expired refresh tokens from all users. */
export const startCleanupRefreshTokensJob = () => {
  const jobConfig = config.jobs.cleanupRefreshTokens;

  if (!jobConfig.enabled) {
    logger.info('Cleanup refresh tokens job is disabled');
    return;
  }

  cron.schedule(jobConfig.schedule, async () => {
    try {
      const removed = await authService.cleanupExpiredRefreshTokens();
      logger.info(`Cleanup job: removed ${removed} expired refresh token(s)`);
    } catch (err) {
      logger.error('Cleanup job failed', { error: err.message, stack: err.stack });
    }
  });

  logger.info(`Cleanup refresh tokens job scheduled (${jobConfig.schedule})`);
};
