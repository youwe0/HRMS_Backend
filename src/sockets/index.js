import { Server } from 'socket.io';
import config from '../config/index.js';
import { verifyAccessToken } from '../utils/index.js';
import logger from '../utils/logger.js';

/**
 * Attaches Socket.IO to the HTTP server.
 * Only used when ENABLE_SOCKETS=true (real-time features).
 */
export const attachSockets = (server) => {
  const io = new Server(server, {
    cors: { origin: config.cors.origin, credentials: true },
  });

  // Authenticate sockets with the same access token used by the REST API.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const payload = verifyAccessToken(token);
      socket.userId = payload.sub;
      return next();
    } catch {
      return next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (user ${socket.userId})`);
    socket.join(`user:${socket.userId}`);

    socket.emit('connected', { message: 'Connected to HRMS realtime service' });

    socket.on('ping', (callback) => {
      if (typeof callback === 'function') callback({ pong: Date.now() });
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
