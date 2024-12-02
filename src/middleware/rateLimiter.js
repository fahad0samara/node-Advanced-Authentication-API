const rateLimit = require('express-rate-limit');
const { createErrorResponse } = require('../utils/responseUtils');

const createRateLimiter = (options) => {
  return rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: options.max,
    message: createErrorResponse(options.message),
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: true,
    keyGenerator: (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    ...options
  });
};

const globalRateLimit = createRateLimiter({
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later'
});

const authRateLimit = createRateLimiter({
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5,
  message: 'Too many authentication attempts, please try again later'
});

module.exports = {
  globalRateLimit,
  authRateLimit
};