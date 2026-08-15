import mongoose from 'mongoose';
import config from '../config/index.js';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  mongoose.connection.on('connected', () => {
    logger.info(
      `MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`
    );
  });
  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', { error: err.message });
  });
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  await mongoose.connect(config.mongoUri, config.db.options);
  return mongoose.connection;
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};
