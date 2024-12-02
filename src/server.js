require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {
  securityHeaders,
  xssMiddleware,
  requestSizeLimiter,
  mongoSanitize
} = require('./middleware/security');
const { globalRateLimit } = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const tokenService = require('./services/tokenService');
const logger = require('./utils/logger');
const corsOptions = require('./middleware/security/corsConfig');

const app = express();

// Trust first proxy
app.set('trust proxy', 1);

// Basic middleware
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors(corsOptions));
app.use(express.json({ 
  limit: process.env.MAX_REQUEST_SIZE || '10kb' 
}));

// Security middleware
app.use(securityHeaders);
app.use(globalRateLimit);
app.use(xssMiddleware);
app.use(mongoSanitize);

// Logging middleware
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(errorHandler);

// Schedule cleanup of expired tokens
setInterval(() => {
  tokenService.cleanupExpiredTokens()
    .catch(error => logger.error('Token cleanup failed:', error));
}, 24 * 60 * 60 * 1000);

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  logger.info('Received shutdown signal. Closing HTTP server...');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
}

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});