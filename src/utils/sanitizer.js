const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

const sanitizeError = (error) => {
  // Remove sensitive information from error messages
  const sanitizedError = {
    message: error.message,
    status: error.statusCode || 500
  };

  if (process.env.NODE_ENV !== 'production') {
    sanitizedError.stack = error.stack;
  }

  return sanitizedError;
};

module.exports = {
  sanitizeUser,
  sanitizeError
};