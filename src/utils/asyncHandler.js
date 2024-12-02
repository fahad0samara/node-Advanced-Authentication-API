const { AuthError } = require('./errorUtils');

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const asyncMiddleware = (middleware) => {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  asyncHandler,
  asyncMiddleware
};