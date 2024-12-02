const logger = require('../utils/logger');
const { sanitizeError } = require('../utils/sanitizer');

const errorHandler = (err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  const sanitizedError = sanitizeError(err);

  if (err.name === 'AuthError' || err.name === 'ValidationError') {
    return res.status(err.statusCode).json({
      error: sanitizedError.message,
      ...(err.errors && { errors: err.errors })
    });
  }

  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : sanitizedError.message 
  });
};

module.exports = errorHandler;